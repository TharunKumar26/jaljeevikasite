module.exports = (req, res, next) => {
    if(!req.session.isLoggedIn){
      console.log("Login first")
      req.flash('error_msg', 'Please log in to view that resource');
      return res.redirect('/admin/login');
    }
    next();
  }