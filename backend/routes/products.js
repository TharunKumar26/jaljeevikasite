const router = require('express').Router();
let Product = require('../models/product.model');
const mainController = require('../controllers/main');
const isUser = require('../middleware/is-user');

// locolhost:5000/products/
// router.route('/').get(isUser, (req, res) => { 
//     Product.find()
//         .then(products => res.json(products))
//         .catch(err => res.status(400).json('Error: ' + err)); 


//         if (req.query.location !=''){
//             const userlocation = req.user.location;
//             Product.find( {vendorlocation: userlocation},(err,data)=>{
//                 res.render('/',{products : products })
//                 })
//             }
//         if (req.query.price!=''){
//                 if (req.query.price == "high"){
//                         Product.find().sort({price:-1})
//                         .then((err,products) => {res.render('/', {products :products})
//                 })
//             }
//                 else {
            
//             Product.find().sort({price:1})
//             .then((err,products) => {res.render('/', {products : products})
//                 })
//             }
//         }
        
//         if(req.query.category!='')
//         {
//         const category = req.query.cat
//         Product.find( {category: category}, (err, data)=>{
//             res.render('/',{products : products })
//         })
    
//     }
//     if (req.query.brand!='')
//         {
//     const brandname = req.query.brand
//     Product.find( {brand: brandname },(err, data)=>{
//         res.render('/',{products : products })
//     })
//         }
//     Product.find({}, function(err, data){
//         res.render('product.ejs', { 
//            product : data[0]
//         });
//     });
// });

// locolhost:5000/products/add
router.route('/add').post((req, res) => {
    const name = req.body.name;
    const vendorid = req.session.user._id;
    const description = req.body.description;
    const price = Number(req.body.price);
    const vendorname = req.body.vendorname;
    const imgurl = req.body.imgurl;
    const category = req.body.category;
    const brand = req.body.brand;
    const vendorlocation = req.body.vendorlocation;
    const isAuthorised = false;

    const newProduct = new Product({
        name,
        vendorid,
        description,
        price,
        vendorname,
        imgurl,
        category,
        brand,
        vendorlocation,
        isAuthorised
    });

    newProduct.save()
        .then(() => res.render('addproduct'))
        .catch(err => res.status(400).json('Error: '+ err));
});

// /products/:id
router.get('/:id', isUser, mainController.getProduct);

// delete product
router.route('/:id').delete((req, res) => {
    Product.findByIdAndDelete(req.params.id)
        .then(() => console.log('Product deleted.'))
        .catch(err => res.status(400).json('Error: '+ err));
});

//update product post request
router.route('/update/:id').post((req, res) => {
    Product.findById(req.params.id)
        .then(product => {
            product.name = req.body.name;
            product.description = req.body.description;
            product.price = Number(req.body.price);
            product.vendorname = req.body.vendorname;
            product.imgurl = req.body.imgurl;
            product.category = req.body.category;
            product.brand = req.body.brand;
            product.vendorlocation = req.body.vendorlocation;
            product.isAuthorised = false;
            product.save()
                .then(() => res.json('Product updated!'))
                .catch(err => res.status(400).json('Error: '+ err));
        })
        .catch(err => res.status(400).json('Error: '+ err));
});

// get request for editing product
router.route('/update/:id').get((req, res) => {
    Product.findById(req.params.id, (err, product)=>{
        res.render('updateProduct',{
            title: 'Edit Product',
            product:product
        });
    });
});

module.exports = router;