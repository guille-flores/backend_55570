const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let ProductManager = require('../ProductManager.js');
    let productmanager = new ProductManager(file='./products.json');
    let products = productmanager._products
    const io = req.app.get('io');
    io.emit('load_products', products)

    res.render('realTimeProducts', {
        areProducts: products.length > 0,
        products
    });
});

module.exports = router;
