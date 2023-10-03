//defining the express module to set up a server
const express = require('express');
const router = express.Router();

// creating a cart class
const fs = require('node:fs');
class Cart {
    constructor(file) {
        //it will receive the path of the file that will contain or that contains the carts with the products
        this.path = file;
        //if the file exist and has a cart in it, we will retrieve that info
        if (fs.existsSync(file) && fs.readFileSync(file, 'utf-8').length > 0) {
            this.id = JSON.parse(fs.readFileSync(file, 'utf-8')).id;
            this.products = JSON.parse(fs.readFileSync(file, 'utf-8')).products;
        }
    }

    createCart(id = "cid" + Math.random().toString(16).slice(2,5)){
        // we will generate a random cart ID (CID) if user don't provide one. This will be provided using a random function.
        // the to string function will allow us to convert the numbers to letters in hexadecimal format
        // and the slice from 2-5 will limit the first 3 digits after decimal point
        this.id = id;
        console.log(`Cart created with ID: ${id}.`);
        this.products = [];
        //now we build the cart from the id and products
        let cart = {id: this.id , products: this.products};
        fs.writeFile(this.path, JSON.stringify(cart), (err) => err && console.error(err));
        return cart
    }

    addProduct(cid, pid, quantity){
        // we will add the product ID (PID) to the cart ID (CID)
        this.id = cid;
        this.products = JSON.parse(fs.readFileSync(this.path, 'utf-8')).products;
        let productIndex = -1;
        
        if(this.products.length > 0){
            productIndex = this.products.findIndex(e => e.id === pid);
        }
        if(productIndex === -1){ //if not found
            this.products.push({id: pid, quantity: quantity}); // push the new product
        }else{
            this.products[productIndex] = {id: pid, quantity: quantity};
            console.log(`\nThis product (ID ${pid}) is already in the cart ${cid}.\n We updated the product with the specified quantity (${quantity})\n`);
        }
        let cart = {id: this.id , products: this.products};
        fs.writeFile(this.path, JSON.stringify(cart), (err) => err && console.error(err));
        console.log()
    }
}

let cart = new Cart('./carts.json');

router.post('/', (req, res)=>{
    const cart_json = req.body;
    let new_cart = cart.createCart(cart_json.id);
    res.json({
        info:{
            status: 200,
            message: 'Cart created'
        },
        cart: new_cart
    })
})


//to see the specific product by id
router.get('/:cid', (req, res) => {
    let cid = req.params.cid;
    if(cart.id == cid){
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
            },
            cart: cart
        })
    }
})

router.post('/:cid/product/:pid', (req, res)=>{
    const cart_json = req.body;
    const cid = req.params.cid;
    const pid = req.params.pid;
    cart.addProduct(cid, pid, cart_json.quantity)
    res.json({
        info:{
            status: 200,
            message: 'Added the product ' + pid + ' to the cart ' + cid + '.'
        },
        cart: cart
    })
})

module.exports = router;