const mongoose = require('mongoose');

const EnquerySchema = new mongoose.Schema({
  customerid: {
    type: String,
    required: true
  },
  vendorid: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
 
  date: {
    type: Date,
    default: Date.now
  }
});

const Messages = mongoose.model('Enquiry', EnquerySchema);

module.exports = Messages;