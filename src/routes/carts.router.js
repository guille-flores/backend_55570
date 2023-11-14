//defining the express module to set up a server
const express = require('express');
const router = express.Router();

const cartsModel = require('../dao/models/carts.model.js');
const productsModel = require('../dao/models/products.model.js');

router.post('/', async (req, res)=>{
    let new_cart = await cartsModel.create({})
    try{
        res.json({
            info:{
                status: 200,
                message: 'Cart created'
            },
            cart: new_cart
        })
    }catch(error){
        console.log("Cannot obtain the carts with Mongoose: " + error)
    }
})

//to see the specific product by id
router.get('/:cid', async (req, res) => {
    try{
        let cid = req.params.cid;
        let cart = await cartsModel.find({_id: cid});
        if(cart.length > 0){
            //return res.send(product)
            res.json({
                info: {
                    status: 200,
                    message: 'success'
                },
                products: cart
            })
        }else{
            //res.send(`Product with id ${pid} not found.`)
            res.json({
                info: {
                    status: 201,
                    message: 'success',
                    details: 'Cart with id ' + cid + ' was not found.'
                }
            })
        }
    }catch(error){
        console.log("Cannot obtain the carts with Mongoose: " + error)
    }
})

router.post('/:cid/product/:pid', async (req, res)=>{
    try{
        const cart_json = req.body;
        const cid = req.params.cid;
        const pid = req.params.pid;

        let cart = await cartsModel.find({_id: cid}).lean();
        let products = cart[0].products
        products.push({id: pid, quantity: cart_json.quantity})
        //obtaining the current products in the cart
        let result = await cartsModel.findOneAndUpdate({_id: cid}, {products: products}, {
            new: true
        });
        res.json({
            info:{
                status: 200,
                message: 'Added the product ' + pid + ' to the cart ' + cid + '.'
            },
            cart: result
        })
    }catch(error){
        console.log("Cannot obtain the carts with Mongoose: " + error)
    }
})

module.exports = router;