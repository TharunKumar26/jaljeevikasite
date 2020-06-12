const mongoose = require('mongoose');

const EnquerySchema = new mongoose.Schema({
  customerid: {
    type: String,
    required: true
  },
  Vendorid: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  file:{
      type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;