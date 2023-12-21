//defining the express module to set up a server
import { Router } from 'express';
const router = Router();


import cartsModel from '../dao/models/carts.model.js';
import productsModel from '../dao/models/products.model.js';

router.post('/', async (req, res)=>{
    let new_cart = await cartsModel.create({})
    try{
        res.json({
            info:{
                status: 200,
                message: 'Cart created'
            },
            payload: new_cart
        })
    }catch(error){
        console.log("Cannot obtain the carts with Mongoose: " + error);
        res.json({
            info: {
                status: 400,
                message: 'error'
            },
            payload: error
        });
    }
})

//to see the specific product by id
router.get('/:cid', async (req, res) => {
    try{
        let cid = req.params.cid;
        let cart = await cartsModel.find({_id: cid}).populate('products.product');
        if(cart.length > 0){
            //return res.send(product)
            res.json({
                info: {
                    status: 200,
                    message: 'success'
                },
                payload: cart
            })
        }else{
            //res.send(`Product with id ${pid} not found.`)
            res.json({
                info: {
                    status: 404,
                    message: 'error',
                    details: 'Cart with id ' + cid + ' was not found.'
                }
            })
        }
    }catch(error){
        console.log("Cannot obtain the carts with Mongoose: " + error);
        res.json({
            info: {
                status: 400,
                message: 'error'
            },
            payload: error
        });
    }
})

router.post('/:cid/products/:pid', async (req, res)=>{
    try{
        const cart_json = req.body;
        const cid = req.params.cid;
        const pid = req.params.pid;

        let cart = await cartsModel.find({_id: cid}).lean();
        if(cart.length > 0){
            //obtaining the current products in the cart
            let products = cart[0].products;

            //if the product already exists, we will just modify the quantity, not add another same product
            let existing_product = products.find((element) => element.product == pid);
            if(existing_product){
                let newProd = products.map((element) => {
                    if(element.product == pid){
                        return {product: element.product, quantity:cart_json.quantity}
                    }else{
                        return element
                    }
                });
                var result = await cartsModel.findOneAndUpdate({_id: cid}, {products: newProd}, {new: true});
            }else{
                products.push({product: pid, quantity: cart_json.quantity});
                var result = await cartsModel.findOneAndUpdate({_id: cid}, {products: products}, {new: true});
            }
            res.json({
                info:{
                    status: 200,
                    message: 'Added the product ' + pid + ' to the cart ' + cid + '.'
                },
                payload: result
            })
        }else{
            //res.send(`Product with id ${pid} not found.`)
            res.json({
                info: {
                    status: 404,
                    message: 'error',
                    details: 'Cart with id ' + cid + ' was not found.'
                }
            })
        }
    }catch(error){
        console.log("Cannot obtain the carts with Mongoose: " + error);
        res.json({
            info: {
                status: 400,
                message: 'error'
            },
            payload: error
        });
    }
})


router.delete('/:cid', async (req, res)=>{
    try{
        let cid = req.params.cid;
        let cart = await cartsModel.find({_id: cid});
        if(cart.length > 0){
            // if the cart is found, we will delete all the products
            var result = await cartsModel.findOneAndUpdate({_id: cid}, {products: []}, {new: true});
            res.json({
                info: {
                    status: 200,
                    message: 'success'
                },
                products: result
            })
        }else{
            //res.send(`Product with id ${pid} not found.`)
            res.json({
                info: {
                    status: 404,
                    message: 'error',
                    details: 'Cart with id ' + cid + ' was not found.'
                }
            })
        }
    }catch(error){
        console.log("Cannot obtain the products with Mongoose: " + error);
        res.json({
            info: {
                status: 400,
                message: 'error'
            },
            payload: error
        });
    }
});

router.delete('/:cid/products/:pid', async (req, res)=>{
    try{
        const cid = req.params.cid;
        const pid = req.params.pid;
        
        let cart = await cartsModel.find({_id: cid}).lean();
        if(cart.length > 0){
            //obtaining the current products in the cart
            let products = cart[0].products;

            //if the product already exists, we will just modify the quantity, not add another same product
            let index_product = products.findIndex((element) => element.product == pid);
            if (index_product > -1) { // only splice array when item is found
                products.splice(index_product, 1); // 2nd parameter means remove one item only
                var result = await cartsModel.findOneAndUpdate({_id: cid}, {products: products}, {new: true});
            }else{
                var result = cart
            }
            res.json({
                info:{
                    status: 200,
                    message: 'The product ' + pid + ' is no longer in the cart ' + cid + '.'
                },
                cart: result
            })
        }else{
            //res.send(`Product with id ${pid} not found.`)
            res.json({
                info: {
                    status: 404,
                    message: 'error',
                    details: 'Cart with id ' + cid + ' was not found.'
                }
            })
        }
    }catch(error){
        console.log("Cannot obtain the products with Mongoose: " + error);
        res.json({
            info: {
                status: 400,
                message: 'error'
            },
            payload: error
        });
    }
});

export default router;