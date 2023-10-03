//defining the express module to set up a server
const express = require('express');
const productsRouter = require('./routes/products.router.js'); 
const cartsRouter = require('./routes/carts.router.js')

//setting up the express server and port
const app = express();
app.use(express.urlencoded({extended:true}))
app.use(express.json());
const port = 8080;

app.use('/api/products/', productsRouter)
app.use('/api/carts/', cartsRouter)
app.listen(port, () => {
  console.log(`Express running on local port: ${port}`)
})


