const mongoose = require('mongoose');

const ClipSchema = new mongoose.Schema({
  clipword: {
    type: String,
    unique: true,
    required: true
  },
  url: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'teacher'
  }
});

const ClipWord = mongoose.model('clipword', ClipSchema);

module.exports = {
  ClipWord
};