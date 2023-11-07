//defining the express module to set up a server
const express = require('express');
const productsRouter = require('./routes/products.router.js'); 
const cartsRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');
const realTimeProducts = require('./routes/realTimeProducts.router.js');
const socket = require('socket.io');
const mongoose = require('mongoose');

// calling the environment variables
const config = require('./config.env');

const exphbs = require('express-handlebars');
const path = require('path');
// Set up Express-Handlebars
const hbs = exphbs.create({
    extname: 'handlebars', // Specify the file extension for your templates
    layoutsDir: path.join(__dirname, 'views', 'layouts'), // Specify the layouts directory
    defaultLayout: 'main', // Specify the default layout template
});


//setting up the express server and port
const app = express();
app.use(express.urlencoded({extended:true}))
app.use(express.json());
const port = config.PORT;
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));

// connecting to Mongo DB 
mongoose.connect('mongodb+srv://'+config.MONG_USER+':'+config.MONGO_SECRET+'@cluster0.nlbr7os.mongodb.net/'+config.MONGO_DB+'?retryWrites=true&w=majority')
  .then(() => console.log('connected to DB!'))
  .catch(error => console.log("Cannot connect to MongoDB: " + error))


app.use('/api/products/', productsRouter)
app.use('/api/carts/', cartsRouter)
app.use('/', viewsRouter)
app.use('/realtimeproducts', realTimeProducts)
const httpServer = app.listen(port, () => {
  console.log(`Express running on local port: ${config.PORT}`)
})

const io = new socket.Server(httpServer);
app.set('io', io); //we will pass this socket so it can be used in the routers
io.on('connection', socket => {
  /*
  console.log('Nuevo cliente conectado');
  socket.on('message', data => {
    console.log(data)
  });
  */

  socket.on('delete_pid', data => {
    const destination = 'http://localhost:' + port + '/api/products/'+data;
    
    //to send the delete request we use fetch
    fetch(destination, { method: 'DELETE' })
      .then(() => console.log('Delete successful'));
  });

  socket.on('add_product',data => {
    const destination = 'http://localhost:' + port + '/api/products/';
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
  };
    //to send the post request we use fetch
    fetch(destination, requestOptions)
      .then(() => console.log('Product successfully added!'));
  });

})