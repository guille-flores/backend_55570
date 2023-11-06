const express = require('express');
const router = express.Router();
const productsModel = require('../dao/models/products.model.js');

router.get('/', async (req, res) => {
    try{
        let products = await productsModel.find().lean();
        
        const io = req.app.get('io');
        io.emit('load_products', products)

        res.render('realTimeProducts', {
            areProducts: products.length > 0,
            products
        });

    }catch(error){
        console.log("Cannot obtain the products with Mongoose: " + error)
    }
});

module.exports = router;
