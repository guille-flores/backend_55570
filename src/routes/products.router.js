//defining the express module to set up a server
const express = require('express');
const router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId; 

const productsModel = require('../dao/models/products.model.js');
//to see all products or a limited number of products
router.get('/', async (req, res) => {
    try{
        let products = await productsModel.find();
        //res.send({result:"success", payload:products})

        let query = req.query;
        let {limit} = query;
        if(!limit || isNaN(limit)){
            // If the query param has limit, and if the limit is not a number, we will return the filtered products (limited to the given amount)
            //return res.send(products)
            res.json({
                info: {
                    status: 200,
                    message: 'success'
                },
                products: products
            })
        }else{
            limit = Math.floor(limit); //in case user enters a double/float number
            let limited_products = products.slice(0, limit);
            //res.send(limited_products)
            res.json({
                info: {
                    status: 200,
                    message: 'success'
                },
                products: limited_products
            })
        }
    }catch(error){
        console.log("Cannot obtain the products with Mongoose: " + error)
    }
})


//to see the specific product by id
router.get('/:pid', async (req, res) => {
    try{
        let pid = req.params.pid;
        
        let product = await productsModel.find({_id: pid});
        //console.log(product)
        if(product.length > 0){
            //return res.send(product)
            res.json({
                info: {
                    status: 200,
                    message: 'success'
                },
                products: product
            })
        }else{
            //res.send(`Product with id ${pid} not found.`)
            res.json({
                info: {
                    status: 201,
                    message: 'success',
                    details: 'Product with id ' + pid + ' was not found.'
                }
            })
        }
    }catch(error){
        console.log("Cannot obtain the products with Mongoose: " + error)
    }
})

router.post('/', async (req, res)=>{
    try{
        const product_json = req.body;
        //for simplicity, we will allow and suppose that the user can push multiple products in a single JSON.
        //the multiple products should come as: "{products":[{product 1}, {products 2}, ..., {product n}]}
        let product = product_json;
        let loopproduct = false;
        if(product_json.hasOwnProperty('products')){ //first we check if there is a multiple product inside the json
            product = product_json.products;
        }
        if(Array.isArray(product)){ //we also check if the multiple products are a list/array
            loopproduct = true;
        }
        //console.log(product)
        let result_arr = []
        
        if(loopproduct){
            for(let cc = 0; cc < product.length; cc++){
                let result = await productsModel.create(product[cc])
                result_arr.push(result);
            }
        }else{
            let result = await productsModel.create(product);
            result_arr = result;
        }
        res.json({
            info:{
                status: 200,
                message: 'Product(s) added'
            },
            product: result_arr
        })
    }catch(error){
        console.log("Cannot obtain the products with Mongoose: " + error)
    }
})

router.put('/:pid', async (req, res)=>{
    try {
        const product_json = req.body;
        //for simplicity, we will allow and suppose that the user can push multiple products in a single JSON.
        //the multiple products should come as: "{products":[{product 1}, {products 2}, ..., {product n}]}
        let product = product_json;
        let loopproduct = false;
        if(product_json.hasOwnProperty('products')){ //first we check if there is a multiple product inside the json
            product = product_json.products;
        }
        if(Array.isArray(product)){ //we also check if the multiple products are a list/array
            loopproduct = true;
        }
        //console.log(product)
        let result_arr = []

        if(loopproduct){
            for(let cc = 0; cc < product.length; cc++){
                let result = await productsModel.findOneAndUpdate({_id: product[cc].id}, product[cc].updates, {
                    new: true
                });
                result_arr.push(result);
            }
        }else{
            let result = await productsModel.findOneAndUpdate({_id: product.id}, product.updates, {
                new: true
            });
            result_arr = result;
        }
        res.json({
            info:{
                status: 200,
                message: 'Product(s) updated'
            },
            product: result_arr
        })
    }catch(error){
        console.log("Cannot obtain the products with Mongoose: " + error)
    }
})

router.delete('/:pid', async (req, res)=>{
    try{
        let id = req.params.pid;
        let result = await productsModel.deleteOne({_id: new ObjectId(id)});
        res.json({
            info:{
                status: 200,
                message: 'Product(s) deleted'
            },
            product: result
        })
    }catch(error){
        console.log("Cannot obtain the products with Mongoose: " + error)
    }
})

module.exports = router;