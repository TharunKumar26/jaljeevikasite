const express = require('express');
const router = express.Router();
const authController = require('../controllers/vendor');
const isVendor = require('../middleware/is-vendor');
const Message = require('../models/messages');

//Vendor home route
router.get('/', authController.getHome);

//login routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

//signup routes
router.get('/register', authController.getSignup);
router.post('/register', authController.postSignup);

//send route
router.post('/send', isVendor, authController.postSend);

//logout routes
router.get('/logout', isVendor, authController.logout);

//contact routes
router.get('/contact', authController.getContact);
router.post('/contact', authController.postContact);

//product routes
router.get('/addProduct', authController.getAddProduct);
router.get('/myProducts', authController.getProducts);

// Mesages
router.get('/getunseen',(req, res)=>{
    Message.find({seen :0, receiver : req.session.user._id},(err, data)=>{
        console.log(data.length)
        res.status(200).send(data.length.toString())
     });
});

module.exports = router;
