const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VendorSchema = new Schema({
    name: {type: String, required: true},
    vendorname: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: Number, required: true},
    password:{type: String, required: true},
    gst:{type:String},
    pancard:{type:String},
    address1: {type: String, required: true},
    address2: {type: String, required: true},
    landmark: {type: String},
    district: {type: String, required: true},
    state: {type: String, required: true},
    country: {type: String, required: true},
    pincode: {type: Number, required: true},
    emailconfirm: {type: Boolean},
    phoneconfirm: {type: Boolean},

});

const Vendorreg = mongoose.model('VendorSchema', VendorSchema);

module.exports = Vendorreg;