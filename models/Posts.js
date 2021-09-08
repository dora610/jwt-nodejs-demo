const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: 'You must supply the author of the post',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', postSchema);
