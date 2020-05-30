const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VendorregSchema = new Schema({
    Name: {type: String, required: true},
    vendorname: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: Number, required: true},
    address1: {type: String, required: true},
    address2: {type: String, required: true},
    landmark: {type: String, required: true},
    district: {type: String, required: true},
    state: {type: String, required: true},
    country: {type: String, required: true},
    pincode: {type: Number, required: true},
    emailconfirm: {type: Boolean, required: true},
    phoneconfirm: {type: Boolean, required: true},
    

}, {
    timestamps: true,
});

const Vendorreg = mongoose.model('Vendorreg', productSchema);

module.exports = Vendorreg;