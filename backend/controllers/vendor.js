const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
let Product = require('../models/product.model');
const Message = require('../models/messages');
const router = require('../routes/chat');
const { data } = require('jquery');

exports.getHome = (req, res, next) => {
	res.render('vendorhome',{
		title: ' Vendor Home',
		path: '/vendor/'
	});
};

exports.getAddProduct = (req, res, next) => {
    res.render('addproduct',{
		title: 'Add Product',
        path: '/vendor/vendorhome',
    });
};

exports.getProducts = (req, res, next) => {
    Product.find({vendorid: req.session.user._id}, function(err, data){
        res.render('productcard', { 
           products : data,
           title: 'My Products',
		    path: '/vendor/myProducts'
        });
    });
};

exports.getSignup = (req, res, next) => {
	res.render('vendorreg2',{
		title: ' Vendor Register',
		isLoggedIn : req.session.isLoggedIn || false, 
        path: '/vendor/register',
	});
};

exports.getLogin = (req, res, next) => {
	res.render('vendorlogin',{
		title: ' Vendor Login', 
		isLoggedIn : req.session.isLoggedIn || false, 
        path: '/vendor/login',
	});
};

exports.postSignup = (req, res, next) => {
	const name = req.body.name;
    const vendorname = req.body.vendorname
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    const password2 = req.body.password2;
    const pancard = req.body.pancard;
    const gst = req.body.gst;
    const address1 = req.body.address1;
    const address2 = req.body.address2
    const landmark = req.body.landmark;
    const district = req.body.district;
    const state = req.body.state;
    const country = req.body.country;
    const pincode = req.body.pincode;
    const conditions = req.body.conditions;
    let errors = [];

    // Validation

    // Check required fields
    if(!name || !pancard || !gst|| !vendorname || !password || !password2 || !email || !phone || !address1 || !address2 || !district || !state || !country || !pincode){
        errors.push({ msg: 'Please fill in all the required fields'});
    }

    // Check passwords match
    if(password !== password2){
        errors.push({ msg: 'Passwords do not match'});
    }

    // Check password length
    if(password.length < 6){
        errors.push({ msg: 'Password should be at least 6 characters long'});
    }

    if(conditions !="agreed"){
        errors.push({msg :'Please agree to the use of privacy and conditions'})
    }

    if(errors.length >0)
    {
        res.render('vendorreg2', {
            errors,
            name,
            vendorname, 
            email, 
            phone,
            password, 
            gst, 
            pancard, 
            address1, 
            address2, 
            landmark,
            district, 
            state, 
            country, 
            pincode
        });
    }
    else
    {   
        // Validation passed
        Vendor.findOne({ email: email})
            .then(user => {
                if(user)
                {
                    // Vendor exists
                    errors.push({ msg: 'Email is already registered'});
                    res.render('vendorreg2', {
                        errors,
                        name,
                        vendorname, 
                        email, 
                        phone,
                        password, 
                        gst, 
                        pancard, 
                        address1, 
                        address2, 
                        landmark,
                        district, 
                        state, 
                        country, 
                        pincode
                    });
                } 
                else
                {
                    const newvendor   = new Vendor({
                        name,
                        vendorname, 
                        email, 
                        phone,
                        password, 
                        gst, 
                        pancard, 
                        address1, 
                        address2, 
                        landmark,
                        district, 
                        state, 
                        country, 
                        pincode
       
                    });
                    
                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newvendor.password, salt, (err, hash) => {
                          if (err) throw err;
                          newvendor.password = hash;
                          newvendor
                            .save()
                            .then(() => {
                                req.session.isLoggedIn = true;
							    req.session.user = user;
							    req.session.save();
							    console.log(req.session);
                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                );
                              res.redirect('/vendor/login');
                            })
                            .catch(err => console.log(err));
                        });
                    });
                }
            });
    }
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	Vendor.findOne({ email: email})
		.then(user => {
			if(!user){
				console.log("No vendor with that email id exists!!");
				req.flash('error','Invalid email or password!');
				return res.redirect('/vendor/login');
			}
			bcrypt
				.compare(password, user.password)
				.then(doMatch => {
					if(doMatch){
						console.log("Matched");
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save(err => {
							console.log(err);
							req.flash('error', err);
							res.redirect('/vendordashboard');
						});
					}
					console.log('Invalid email or password!');
					req.flash('error', 'Invalid email or password!');
					return res.redirect('/vendor/login');
				})
				.catch(err => {
					console.log(err);
					req.flash('error', 'Invalid email or password!');
					return res.redirect('/vendor/login');
				})
			})
			.catch(err => console.log(err));
};


exports.logout = (req, res, next) => {
	req.flash('success','Logged out successfully');
	req.session.destroy(err => {
		console.log(err);
		return res.redirect('/vendor/login');
	});
};

exports.postSend = (req, res, next) => {
    const customerid = req.body.customerid;
    const vendorid = req.body.vendorid;
    const message = req.body.message;
    if (!customerid || !vendorid || !message){
        errors.push({ msg: 'Please type something'});
        
    }
    if(errors.length >0){
        res.render('vendorcontact', {
            errors,
        });
    }
};

exports.getContact = (req, res, next) => {
	res.render('vendorcontact',{
		title: ' Vendor Contact',  
		path: '/vendor/contact'
	});
};

exports.postContact = (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const subject = req.body.subject
    const message = req.body.message
    let errors =[]

    if (!name|| !email || !subject || !message){
        errors.push({msg :"Please all the required fields"})
    }
    if (errors.length >0){
        res.render('vendorcontact', {
            errors,})
    }

    const newmessage = contact({
        name, email, subject, message
    })

    newmessage.save().then(() => {
        let success_msg = "successfully sent!"
        res.render('vendorcontact',{success_msg})
    }).catch(()=>{
        res.send("Err")
    })

   /* contact.find({}, (err, data)=>{
        console.log(data)
    })*/
};
