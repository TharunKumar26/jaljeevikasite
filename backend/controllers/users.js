const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

exports.getHome = (req, res, next) => {
	res.render('userhome',{
		title: ' User Home',
		path: '/users/'
	});
};

exports.getSignup = (req, res, next) => {
	res.render('userreg',{
		title: ' User Register',
		isLoggedIn : req.session.isLoggedIn || false, 
        path: '/users/register',
	});
};

exports.getLogin = (req, res, next) => {
	res.render('userlogin',{
		title: ' User Login', 
		isLoggedIn : req.session.isLoggedIn || false, 
        path: '/users/login',
	});
};

 exports.postSignup = (req, res, next) => {
 	const { name, email, password, password2 } = req.body;
    let errors = [];
    //Validations

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
         res.render('userreg', {
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
         User.findOne({ email: email})
             .then(user => {
                 if(user) 
                 {
                     // User exists
                     errors.push({ msg: 'Email is already registered'});
                     res.render('userreg', {
                         errors,
                         name,
                         email,
                         password,
                         password2
                     });
                 } 
                 else 
                 {
                    const newUser = new User({
                         name,
                         email,
                         password
                     });
                    
                     // Hash Password
                   bcrypt.genSalt(10, (err, salt) => {
                       bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                         newUser.password = hash;
                         newUser
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
                              res.redirect('/users/login');
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
	User.findOne({ email: email})
		.then(user => {
			if(!user){
				console.log("No user with that email id exists!!");
				req.flash('error','Invalid email or password!');
				return res.redirect('/users/login');
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
							res.redirect('/dashboard');
						});
					}
					console.log('Invalid email or password!');
					req.flash('error', 'Invalid email or password!');
					return res.redirect('/users/login');
				})
				.catch(err => {
					console.log(err);
					req.flash('error', 'Invalid email or password!');
					return res.redirect('/users/login');
				})
			})
			.catch(err => console.log(err));
};


exports.logout = (req, res, next) => {
	req.session.destroy(err => {
        console.log(err);
		return res.redirect('/users/login');
    });
}