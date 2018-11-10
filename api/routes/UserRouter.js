let express = require('express');
const passport = require('passport');
const passportConfig = require('../../config/passportConfig');
const {
  sendMail
} = require('../../config/sendmail');
const {
  User
} = require("../models/UserModel");
const {
  ClipWord
} = require('../models/ClipModel');

passportConfig();

const router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("errorMsg", "You must be logged in to see this page");
    res.redirect("/login");
  }
}

router.get("/", function (req, res) {
  res.render("index");
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.get("/register", function (req, res) {
  res.render("register");
});

router.post("/register", function (req, res, next) {
  let email = req.body.email;
  let firstname = req.body.firstname;
  let username = req.body.username;
  let password = req.body.password;
  // let port = `http://localhost:${process.env.PORT}` || `cliptube.herokuapp.com`;

  let message = `<h3 style="text-align:center; color: blue;"><a href='cliptube.herokuapp.com/login'>Click here</a> to login</h3>`;

  // validation
  req.checkBody('firstname', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Minimum length is 6 characters').isLength({
    min: 6
  });
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors
    });
  } else {
    User.findOne({
      username
    }, function (err, user) {
      if (err) {
        return next(err);
      }
      if (user) {
        req.flash("errorMsg", "Teacher exists already");
        return res.redirect("/register");
      }

      let newUser = new User({
        email,
        firstname,
        username,
        password
      });
      newUser.save(next);
    }).then(() => {
      sendMail(email, message);
    });
    req.flash("successMsg", "Registration successful, check your mail for confirmation");
    res.redirect("/login");
  }
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/teach',
    failureRedirect: '/login',
    failureFlash: true
  })
  // function (req, res) {
  //   res.redirect('/teach');
  // }
);

router.get('/logout', function (req, res) {
  req.logOut();
  req.flash('successMsg', "You are logged out");
  res.redirect("/");
});

router.get("/teach", function (req, res) {
  res.render("teach");
});

router.get("/learn", function (req, res) {
  res.render("learn");
});


module.exports = router;