const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/user.model');
const Vendor = require('../models/Vendor');

// constructor
function SessionConstructor(userId, userGroup) {
  this.userId = userId;
  this.userGroup = userGroup;
}

module.exports = function(passport) {

  // strategy name = user
  passport.use('user',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );
  // strategy name = vendor
  passport.use('vendor',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match vendor
      Vendor.findOne({
        email: email
      }).then(vendor => {
        if (!vendor) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, vendor.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, vendor);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(userObject, done) {
    let userGroup = "user";
    let userPrototype = Object.getPrototypeOf(userObject);

    if (userPrototype === User.prototype) {
      userGroup = "user";
    } else if (userPrototype === Vendor.prototype) {
      userGroup = "vendor";
    }

    let sessionConstructor = new SessionConstructor(userObject.id, userGroup);
    done(null, SessionConstructor);
  });

  passport.deserializeUser(function(id, done) {

    if(SessionConstructor.userGroup == 'user'){
      User.findOne(SessionConstructor.userId, function(err, user){
        done(err, user);
      });
    }
    else if(SessionConstructor.userGroup == 'vendor'){
      Vendor.findOne(SessionConstructor.userId, function(err,vendor){
        done(err, vendor);
      });
    }
  });
}