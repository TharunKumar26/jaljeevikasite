const express = require('express');
const router = express.Router();
const authController = require('../controllers/admin');
const isAdmin = require('../middleware/is-admin');

//User home route
router.get('/', authController.getHome);

//login routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

//signup routes
router.get('/register', authController.getSignup);
router.post('/register', authController.postSignup);

//logout routes
router.get('/logout', isAdmin, authController.logout);

//authorize product route
router.post('/update/:id', isAdmin, authController.postAuthorize);

module.exports = router;