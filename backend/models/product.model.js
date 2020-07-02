const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {type: String, required: true},
    vendorid :{type: String},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    vendorname: {type: String, required: true},
    imgurl: {type: String, default:"harvest1"},
    category: {type: String, required: true},
    brand: {type: String, required: true},
    vendorlocation:{type: String, required: true},
    isAuthorised:{type: Boolean, default: false},
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;