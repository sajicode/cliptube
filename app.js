require('./config/config');

const express = require('express');
const bps = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const {
  mongoose
} = require('./db/mongoose');