const router = require('express').Router();
let Product = require('../models/product.model');


// locolhost:5000/products/
router.route('/').get((req, res) => { 
    Product.find()
        .then(products => res.json(products))
        .catch(err => res.status(400).json('Error: ' + err));
});



router.get('/search',(req, res)=>{
    let products =[]
    
    if (req.query.location !=''){
        const userlocation = req.user.location;
       

        Product.find( {vendorlocation: userlocation},(data)=>{
            res.render('',{products : products })
            
        })
        
    }
    if (req.query.price!=''){
        
       
    if (req.query.price == "high"){
        Product.find().sort({price:-1})
.then((products) => {res.render('/', {products :products})
    })


    }
    else {
        Product.find().sort({price:1})
        .then((products) => {res.render('/', {products : products})
    })
            
    }
}
    
    if(req.query.category!='')
    {
    const category = req.query.cat
    Product.find( {category: category}, (data)=>{
        res.render('/',{products : products })
    })

}
if (req.query.category!='')
{
const category = req.query.brand
Product.find( {category: category},(data)=>{
    res.render('/',{products : products })
})




}
    
    res.render('/',{})



})

// locolhost:5000/products/add
router.route('/add').post((req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const price = Number(req.body.price);
    const vendorname = req.body.vendorname;
    const imgurl = req.body.imgurl;
    const category = req.body.category;
    const brand = req.body.brand;

    const newProduct = new Product({
        name,
        description,
        price,
        vendorname,
        imgurl,
        category,
        brand,
    });

    newProduct.save()
        .then(() => res.json('Product added!'))
        .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/:id').get((req, res) => {
    
    Product.findById(req.params.id)
        .then(product => res.json(product))
        .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/:id').delete((req, res) => {
    
    Product.findByIdAndDelete(req.params.id)
        .then(() => res.json('Product deleted.'))
        .catch(err => res.status(400).json('Error: '+ err));
});

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
            product.save()
                .then(() => res.json('Product updated!'))
                .catch(err => res.status(400).json('Error: '+ err));
        })
        .catch(err => res.status(400).json('Error: '+ err));
});

module.exports = router;
