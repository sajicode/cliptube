require('./config/config');

const express = require('express');
const bps = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
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

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// app.set("views", path.join(__dirname, "views"));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(morgan("dev"));
app.use(cors());

app.use(bps.json());
app.use(bps.urlencoded({
  extended: false
}));
app.use(cookieParser());
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