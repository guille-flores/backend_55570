//defining the express module to set up a server
const express = require('express');

//setting up the express server and port
const app = express();
app.use(express.urlencoded({extended:true}))
const port = 8080;


// DEFINING THE PRODUCT MANAGER CLASS TO STORE/MANAGE EVERY PRODUCT THAT GETS ADDED
const fs = require('node:fs');
const content = fs.readFileSync('./products.json', 'utf-8');
const products = JSON.parse(content);

// importing the class Product Manager
const {ProductManager} = require('./ProductManager.js');


// Setting up the server
app.get('/', (req, res) => {
    const message = 'To see all the products go to: localhost:' + port + '/products'
    res.send(message)
})

//to see all products or a limited number of products
app.get('/products', (req, res) => {
    let query = req.query;
    let {limit} = query;

    if(!limit || isNaN(limit)){
        // If the query param has limit, and if the limit is not a number, we will return the filtered products (limited to the given amount)
        return res.send(products)
    }
    limit = Math.floor(limit); //in case user enters a double/float number
    let limited_products = products.slice(0, limit);
    res.send(limited_products)
})

//to see the specific product by id
app.get('/products/:pid', (req, res) => {
    let pid = req.params.pid;
    let product = products.find(e => e.id == pid);
    if(product){
        return res.send(product)
    }
    res.send(`Product with id ${pid} not found.`)
})

app.listen(port, () => {
  console.log(`Express running on local port: ${port}`)
})


