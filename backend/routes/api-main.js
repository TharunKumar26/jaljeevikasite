const express = require('express');
const router = express.Router();

const mainController = require('../controllers/api-main');

router.get('/get/products', mainController.getProducts);
router.get('/search', mainController.searchProduct);

module.exports = router;