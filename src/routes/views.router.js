const express = require('express');
const router = express.Router();
const productsModel = require('../dao/models/products.model.js');

//We will show the products via Handlebars
router.get('/', async (req, res) => {
    /*
    Mongoose returns Mongoose documents, not JavaScript Objects, so in order to use them
    with Handlebars, we first need to make them JS objects so they have 'own' properties.
    This is done with lean() method.
    */
    let products = await productsModel.find().lean();
    res.render('home', {
        areProducts: products.length > 0,
        products
    });
});

module.exports = router;
