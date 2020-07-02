const mongoose = require('mongoose');

const EnquerySchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  seen:{
    type: Boolean,
  },
  
  date: {
    type: Date,
    default: Date.now
  }
});

const messages = mongoose.model('EnquirySchema', EnquerySchema);

module.exports = messages;