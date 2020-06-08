const mongoose = require('mongoose');

const VendorcontactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  subject: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const VendorContact = mongoose.model('Vendorcontact', VendorcontactSchema);

module.exports = VendorContact;