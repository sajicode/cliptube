const mongoose = require('mongoose');
const validator = require('validator');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const TeacherSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 2
  },
  lastname: {
    type: String,
    required: true,
    minlength: 2
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

// TeacherSchema.methods.toJSON = function () {
//   let teacher = this;
//   let teacherObject = teacher.toObject();

//   return _.pick(teacherObject, ['_id', 'firstname', 'lastname', 'email', 'clipwords', 'createdAt'])
// };

// for login
TeacherSchema.methods.checkPassword = function (password, done) {
  let teacher = this;
  bcrypt.compare(password, teacher.password, (err, res) => {
    done(err, res);
  });
};

// hash password
TeacherSchema.pre('save', function (next) {
  let teacher = this;

  if (teacher.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(teacher.password, salt, (err, hash) => {
        teacher.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const Teacher = mongoose.model('teacher', TeacherSchema);

module.exports = {
  Teacher
};