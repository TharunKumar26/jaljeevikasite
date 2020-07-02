const Product = require('../models/product.model');

exports.searchProduct = (req, res, next) => {
  const text = req.query.text;
  Product.find({name: {"$regex": new RegExp(text, "i")}, isAuthorised: true})
    .limit(7)
    .then(results => {
      return res.json(results);
    })
    .catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
  console.log("name:",req.query.name );
  Product.find({name: req.query.name },'name')
    .then(products => {
      return res.json(products);
    })
    .catch(err => console.log(err));
}

