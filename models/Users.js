const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: 'You must provide a usernname',
    trim: true,
    unique: true,
  },
  hash: String,
});

module.exports = mongoose.model('User', userSchema);
