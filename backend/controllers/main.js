const Product = require('../models/product.model');

exports.getProduct = (req, res, next) => {
    Product.findById(req.params.id)
      .then(product => {
        return res.render('product.ejs', {
            name: product.name ,
            description: product.description,
            price: product.price,
            vendorname: product.vendorname,
            imgurl: product.imgurl,
            category: product.category,
            brand: product.brand,
            vendorlocation: product.vendorlocation,
            vendorid : product.vendorid,
            path: '/products'
        })
      })
      .catch(err => console.log(err));
  }