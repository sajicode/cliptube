const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const Teacher = require("../api/models/TeacherModel");

module.exports = function () {
  passport.serializeUser(function (teacher, done) {
    done(null, teacher._id);
  });

  passport.deserializeUser(function (id, none) {
    Teacher.findById(id, function (err, teacher) {
      done(err, teacher);
    });
  });

  passport.use("login", new LocalStrategy(function (email, password, done) {
    Teacher.findOne({
      email
    }, function (err, teacher) {
      if (err) {
        return done(err);
      }
      if (!teacher) {
        return done(null, false, {
          message: "No teacher has that email!"
        });
      }
      teacher.checkPassword(password, function (err, res) {
        if (err) {
          return done(err);
        }
        if (res) {
          return done(null, teacher);
        } else {
          return done(null, false, {
            message: "Invalid Password!"
          });
        }
      });
    });
  }));
};