module.exports = (req, res, next) => {
    if(!req.session.isLoggedIn){
      req.flash('error_msg', 'Please log in to view that resource');
      return res.redirect('/vendor/login');
    }
    next();
  }