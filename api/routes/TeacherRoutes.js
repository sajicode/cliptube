let express = require('express');
const passport = require('passport');

const Teacher = require("../models/TeacherModel");

const router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("info", "You must be logged in to see this page");
    res.redirect("/login");
  }
}

router.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

router.get("/", function (req, res) {
  res.render("index");
});

router.post("/register", function (req, res, next) {
  let email = req.body.email;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let password = req.body.password;

  Teacher.findOne({
    email
  }, function (err, teacher) {
    if (err) {
      return next(err);
    }
    if (teacher) {
      req.flash("error", "Teacher already exists");
      return res.redirect("/register");
    }

    let newTeacher = new Teacher({
      email,
      firstname,
      lastname,
      password
    });
    newTeacher.save(next);
  });
}, passport.authenticate("login", {
  successRedirect: "/teach",
  failureRedirect: "/register",
  failureFlash: true
}));

router.get("/teach", function (req, res) {
  res.render("teach");
});


module.exports = router;