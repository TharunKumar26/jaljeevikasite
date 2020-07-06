const express = require('express');
const router = express.Router();
const isUser = require('../middleware/is-user');
const isVendor = require('../middleware/is-vendor');
const isAdmin = require('../middleware/is-admin');
const apiMain = require('./api-main');
let Product = require('../models/product.model');
const path = require('path');

// Welcome Page
router.get('/', (req, res) => res.render('logreg'));

// User Dashboard
// router.route('/dashboard').get(isUser,(req, res) => { 
//   Product.find({isAuthorised: true}, function(err, data){
//       res.render('dashboard', { 
//          products : data.slice(0,6)
//       });
//   });
// });
router.route('/dashboard').get(isUser,(req, res) => { 
  Product.find({isAuthorised: true}, function(err, data){
    Product.find().distinct('category', function(error, category) {
      Product.find().distinct('brand', function(error, brand) {
        Product.find().distinct('vendorlocation', function(error, location) {
         
          res.render('dashboard', {
            products : data,
            brand : brand,
            cats : category,
            location : location,
            feature : data.slice(0,7),
         });
        });
      });
    }); 
  });
});

// Admin Dashboard
router.route('/admindashboard').get(isAdmin,(req, res) => { 
  Product.find({isAuthorised: false}, function(err, data){
      res.render('admindashboard', { 
         products : data
      });
  });
});

// Vendor Dashboard
router.get('/vendordashboard',isVendor, (req, res) => res.render('Vendordashboard'));

// Services
router.get('/services', isUser, (req, res) => res.render('services'));

// About Us
router.get('/aboutus', isUser, (req, res) => res.render('aboutus'));

// Contact us
router.get('/contactus', isUser, (req, res) => res.render('contactus'));

// Meet the teem,
router.get('/team', isUser, (req, res) => res.render('team'));

// Api main
router.use('/api/main', apiMain);

//filters
router.get('/filter',(req, res)=>{
  
  var querylist = req.query;
  if(req.query.price){
    var li = req.query;
    var n=-1;
    if (req.query.price=='low'){
      n = 1
    }
    delete li.price 
  Product.find( li).sort({price:n}).exec( (err,data)=>{
    Product.find().distinct('category', function(error, category) {
      Product.find().distinct('brand', function(error, brand) {
        Product.find().distinct('vendorlocation', function(err, location) {            
              res.render('dashboard', { 
                products : data.slice(0,12),
                brand : brand,
                cats : category,
                location : location
        });
      });
    });
    })
    })
  }
  else {
    Product.find( querylist,function (err,data){
    Product.find().distinct('category', function(error, category) {
      Product.find().distinct('brand', function(error, brand) {
        Product.find().distinct('vendorlocation', function(err, location) {
              res.render('dashboard', { 
                products : data.slice(0,12),
                brand : brand,
                cats : category,
                location : location
        });
      });
    });
    })
    })
  }
  /*
  if (req.query.location){
    console.log('ti')
      const userlocation = req.query.location;
      Product.find( li,function(err,data){
          console.log(data[0])
          res.render('dashboard',{products : data.slice(0,6) })
          })
      }
  if (req.query.price){
      console.log("yep")
          if (req.query.price == "high"){
                  Product.find().sort({price:-1})
                  .then((err,products) => {res.render('dashboard', {products :data[0]})
          })
      }
          else {
      
      Product.find().sort({price:1})
      .then((err,products) => {res.render('dashboard', {products : data[0]})
          })
      }
  }
  
  if(req.query.category)
  {
  const category = req.query.category
  Product.find( {category: category},(err, data)=>{
     setTimeout(() => {
      console.log("tharun")
      console.log(data[0])
      res.render('dashboard',{products : data.slice(0,6) })
     }, 5000);
  })

}
if (req.query.brand)
  {
const brandname = req.query.brand
Product.find( {brand: brandname },(err, data)=>{
  res.render('dashboard',{products : data[0] })
})
  }
  */

})

module.exports = router;
