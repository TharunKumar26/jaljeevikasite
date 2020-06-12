const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    vendorname: {type: String, required: true},
    imgurl: {type: String, required: true},
    category: {type: String, required: true},
    brand: {type: String, required: true},
    vendorlocation:{type: String, required: true},
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;