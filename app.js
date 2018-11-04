require('./config/config');

const express = require('express');
const bps = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const {
  mongoose
} = require('./db/mongoose');

let routes = require("./api/routes/UserRouter");

let app = express();

// passportConfig();

app.set("port", process.env.PORT || 3100);

// set up views engine
app.set("views", path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultLayout: 'layout'
}));
app.set('view engine', 'handlebars');

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// log details in console
app.use(morgan("dev"));

// bodyparser middleware
app.use(bps.json());
app.use(bps.urlencoded({
  extended: false
}));
app.use(cookieParser());

// Express session
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}));

// Passport Init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.successMsg = req.flash('successMsg');
  res.locals.errorMsg = req.flash('errorMsg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// app.use('/teacher', routes);


app.use(routes);

module.exports = {
  app
};