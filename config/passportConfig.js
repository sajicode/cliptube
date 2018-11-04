const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const {
  User
} = require("../api/models/UserModel");

module.exports = function () {
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy(
    function (username, password, done) {
      User.findOne({
        username
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: "No teacher has that email!"
          });
        }
        user.checkPassword(password, function (err, res) {
          if (err) {
            return done(err);
          }
          if (res) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Invalid Password!"
            });
          }
        });
      });
    }));
};