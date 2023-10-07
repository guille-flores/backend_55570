const express = require('express');
const router = express.Router();

// IMPORTING THE PRODUCT MANAGER CLASS TO STORE/MANAGE EVERY PRODUCT THAT GETS ADDED
const ProductManager = require('../ProductManager.js');
const productmanager = new ProductManager(file='./products.json');
const products = productmanager._products


router.get('/', (req, res) => {
    res.render('realTimeProducts', {
        areProducts: products.length > 0,
        products
    });
});

module.exports = router;
