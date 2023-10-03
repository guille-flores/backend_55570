//defining the express module to set up a server
const express = require('express');
const router = express.Router();

// IMPORTING THE PRODUCT MANAGER CLASS TO STORE/MANAGE EVERY PRODUCT THAT GETS ADDED
const ProductManager = require('../ProductManager.js');
const productmanager = new ProductManager(file='./products.json');
const products = productmanager._products

//to see all products or a limited number of products
router.get('/', (req, res) => {
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
})

//to see the specific product by id
router.get('/:pid', (req, res) => {
    let pid = req.params.pid;
    let product = products.find(e => e.id == pid);
    if(product){
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
})


router.post('/', (req, res)=>{
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
    if(loopproduct){
        for(let cc = 0; cc < product.length; cc++){
            productmanager.addProduct(product[cc].title, product[cc].description, product[cc].price, product[cc].thumbnail, product[cc].code, product[cc].stock);    
        }
    }else{
        productmanager.addProduct(product.title, product.description, product.price, product.thumbnail, product.code, product.stock);
    }
    res.json({
        info:{
            status: 200,
            message: 'Product(s) added'
        },
        product: product
    })
})


router.put('/:pid', (req, res)=>{
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
    if(loopproduct){
        for(let cc = 0; cc < product.length; cc++){
            productmanager.updateProduct(product[cc].id, product[cc].updates);
        }
    }else{
        productmanager.updateProduct(product.id, product.updates);
    }
    res.json({
        info:{
            status: 200,
            message: 'Product(s) updated'
        },
        product: product
    })
})

router.delete('/:pid', (req, res)=>{
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
    if(loopproduct){
        for(let cc = 0; cc < product.length; cc++){
            productmanager.deleteProduct(product[cc].id);
            console.log(`Product ID ${product[cc].id} deleted.`)
        }
    }else{
        productmanager.deleteProduct(product.id);
    }
    res.json({
        info:{
            status: 200,
            message: 'Product(s) deleted'
        },
        product: product
    })
})

module.exports = router;