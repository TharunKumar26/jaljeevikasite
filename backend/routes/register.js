const router = require('express').Router();
let Product = require('../models/Vendorreg.model');

// locolhost:5000/products/
router.route('/').get((req, res) => { 
    res.send("<h1>Empty Route</h1>");
});


router.route('/register').post((req, res) => {
    const Name = req.body.name;
    const vendorname = req.body.vendorname
    const email = req.body.email;
    const phone = Number(req.body.phone);
    const address1 = req.body.address1;
    const address2 = req.body.address2
    const landmark = req.body.landmark;
    const district = req.body.district;
    const state = req.body.state;
    const country = req.body.country;
    const pincode = req.body.pincode;

    const emailexist = Vendor.findOne({"email" : email});
    if (emailexist) return res.status(400).send("Email already exists")
    const phoneexist = Vendor.findOne({"phone" : phone});
    if (phoneexist) return res.status(400).send("Email already exists")
    
    
    const vendor = new Vendor({
        name, vendorname, email, phone, address1, address2, landmark,district, state, country, pincode
       
    });

    vendor.save()
        .then(() => res.json('Account Created'))
        .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/reset').get((req,res) =>{

    
});

// router.route('/resetpassword').post((req, res) => {
    
//     gmail = 
//         .then(product => res.json(product))
//         .catch(err => res.status(400).json('Error: '+ err));
// });



module.exports = router;