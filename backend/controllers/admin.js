const Admin = require('../models/admin');
let Product = require('../models/product.model');
const bcrypt = require('bcryptjs');

exports.getHome = (req, res, next) => {
	res.render('adminhome',{
		title: ' Admin Home',
		path: '/admin'
	});
};

exports.getSignup = (req, res, next) => {
	res.render('adminreg',{
		title: ' Admin Register',
		isLoggedIn : req.session.isLoggedIn || false, 
        path: '/admin/register',
	});
};

exports.getLogin = (req, res, next) => {
	res.render('adminlogin',{
		title: ' Admin Login', 
		isLoggedIn : req.session.isLoggedIn || false, 
        path: '/admin/login',
	});
};

exports.postAuthorize = (req, res, next) => {
	Product.findById(req.params.id)
        .then(product => {
            product.isAuthorised = true;
            product.save()
                .then(() => {
                    console.log('Product authorized!')
                    res.redirect('/admindashboard')
                })
                .catch(err => res.status(400).json('Error: '+ err));
        })
        .catch(err => res.status(400).json('Error: '+ err));
};

exports.logout = (req, res, next) => {
	req.flash('success','Logged out successfully');
	req.session.destroy(err => {
		console.log(err);
		return res.redirect('/admin/login');
	});
}

exports.postSignup = (req, res, next) => {
	const { name, email, password, password2 } = req.body;
    let errors = [];

    // Validations

    // Check required fields
    if(!name || !email || !password || !password2){
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

    if(errors.length >0)
    {
        res.render('adminreg', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else
    {
        // Validation passed
        Admin.findOne({ email: email})
            .then(user => {
                if(user) 
                {
                    // Admin exists
                    errors.push({ msg: 'Email is already registered'});
                    res.render('adminreg', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } 
                else 
                {
                    const newAdmin = new Admin({
                        name,
                        email,
                        password
                    });
                    
                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                          if (err) throw err;
                          newAdmin.password = hash;
                          newAdmin
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
                              res.redirect('/admin/login');
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
	Admin.findOne({ email: email})
		.then(admin => {
			if(!admin){
				console.log("No admin with that email id exists!!");
				req.flash('error','Invalid email or password!');
				return res.redirect('/admin/login');
			}
			bcrypt
				.compare(password, admin.password)
				.then(doMatch => {
					if(doMatch){
						console.log("Matched");
						req.session.isLoggedIn = true;
						req.session.admin = admin;
						return req.session.save(err => {
							console.log(err);
							req.flash('error', err);
							res.redirect('/admindashboard');
						});
					}
					console.log('Invalid email or password!');
					req.flash('error', 'Invalid email or password!');
					return res.redirect('/admin/login');
				})
				.catch(err => {
					console.log(err);
					req.flash('error', 'Invalid email or password!');
					return res.redirect('/admin/login');
				})
			})
			.catch(err => console.log(err));
};