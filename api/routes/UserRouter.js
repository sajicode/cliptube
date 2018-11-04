let express = require('express');
const passport = require('passport');
const passportConfig = require('../../config/passportConfig');
const {
  User
} = require("../models/UserModel");

passportConfig();

const router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("errorMsg", "You must be logged in to see this page");
    res.redirect("/");
  }
}

router.get("/", function (req, res) {
  res.render("index");
});

router.post("/register", function (req, res, next) {
  let email = req.body.email;
  let firstname = req.body.firstname;
  let username = req.body.username;
  let password = req.body.password;

  // validation
  req.checkBody('firstname', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render('index', {
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
        return res.redirect("/");
      }

      let newUser = new User({
        email,
        firstname,
        username,
        password
      });
      newUser.save(next);
    });
    req.flash("successMsg", "You are registered and can now login");
    res.redirect("/");
  }
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/teach',
    failureRedirect: '/',
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

router.get("/teach", ensureAuthenticated, function (req, res) {
  res.render("teach");
});

router.get("/learn", ensureAuthenticated, function (req, res) {
  res.render("learn");
});

module.exports = router;