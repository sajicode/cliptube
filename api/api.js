const express = require('express');
const api = express.Router();
const teacherRouter = require('./routes/UserRouter');
const clipRouter = require('./routes/ClipRouter');


api.use(teacherRouter);
api.use(clipRouter);

module.exports = api;