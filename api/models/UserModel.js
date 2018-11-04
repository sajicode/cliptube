const mongoose = require('mongoose');
const validator = require('validator');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 2
  },
  username: {
    type: String,
    required: true,
    minlength: 2,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },

  clipwords: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'clipword'
  }],

  createdAt: {
    type: Date,
    default: new Date().toString()
  }
});

// for login
UserSchema.methods.checkPassword = function (password, done) {
  let user = this;
  bcrypt.compare(password, user.password, (err, res) => {
    done(err, res);
  });
};

// hash password
UserSchema.pre('save', function (next) {
  let user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('teacher', UserSchema);

module.exports = {
  User
};