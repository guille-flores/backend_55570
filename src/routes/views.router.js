import { Router } from 'express';
const router = Router();
import productsModel from '../dao/models/products.model.js';

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


router.get('/register', (req, res) => {
    res.render('register')
});

router.get('/login', (req, res) => {
    res.render('login')
});




export default router;
