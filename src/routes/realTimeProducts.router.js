import { Router } from 'express';
const router = Router();
import productsModel from '../dao/models/products.model.js';

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

export default router;
