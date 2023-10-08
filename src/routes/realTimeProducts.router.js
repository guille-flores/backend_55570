const express = require('express');
const router = express.Router();

let ProductManager = require('../ProductManager.js');
let productmanager = new ProductManager(file='./products.json');
let products = productmanager._products

router.get('/', (req, res) => {
    const io = req.app.get('io');
    io.on('connection', socket => {            
        socket.on('load_products', () => {
            let ProductManager = require('../ProductManager.js');
            let productmanager = new ProductManager(file='./products.json');
            let products = productmanager._products
            console.log(products)
          });
    });
    res.render('realTimeProducts', {
        areProducts: products.length > 0,
        products
    });
});

module.exports = router;
