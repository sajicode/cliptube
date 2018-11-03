require('./config/config');

const express = require('express');
const bps = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
const passportConfig = require('./config/passportConfig');
const {
  mongoose
} = require('./db/mongoose');

let routes = require("./api/routes/TeacherRoutes");

let app = express();

passportConfig();

app.set("port", process.env.PORT || 3100);

// set up views engine
app.set("views", path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultLayout: 'layout'
}));
app.set('view engine', 'handlebars');

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan("dev"));

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

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

module.exports = {
  app
};