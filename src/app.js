//defining the express module to set up a server
import express, { urlencoded, json } from 'express';
import { Server } from 'socket.io';
import { connect } from 'mongoose';
import userRouter from './router/user.router.js';
import productRouter from './router/product.router.js';
import cartRouter from './router/cart.router.js';
import profileRouter from './router/profile.router.js';
import realTimeProductsRouter from './router/realTimeProducts.router.js';

import session from 'express-session';
import MongoStorage from 'connect-mongo';
import initPassport from './config/passport.config.js';
import passport from 'passport';

// calling the environment variables
import { PORT, MONG_USER, MONGO_SECRET, MONGO_DB } from './config.js';

import { create } from 'express-handlebars';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Set up Express-Handlebars
const hbs = create({
    extname: 'handlebars', // Specify the file extension for your templates
    layoutsDir: join(__dirname, 'views', 'layouts'), // Specify the layouts directory
    defaultLayout: 'main', // Specify the default layout template
});


//setting up the express server and port
const app = express();
app.use(urlencoded({extended:true}))
app.use(json());
const port = PORT;
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
//app.use(static(__dirname+'/public'));

app.use(express.static(__dirname+'/public'))

// connecting to Mongo DB 
connect('mongodb+srv://'+MONG_USER+':'+MONGO_SECRET+'@cluster0.nlbr7os.mongodb.net/'+MONGO_DB+'?retryWrites=true&w=majority')
  .then(() => console.log('connected to DB!'))
  .catch(error => console.log("Cannot connect to MongoDB: " + error))

app.use(session({
  store: new MongoStorage({
      mongoUrl:'mongodb+srv://'+MONG_USER+':'+MONGO_SECRET+'@cluster0.nlbr7os.mongodb.net/'+MONGO_DB+'?retryWrites=true&w=majority',
      mongoOptions: {useNewUrlParser :true , useUnifiedTopology: true},
      ttl: 30 //expires after 30 min (Mongo DB will show the timezone in UTC - GMT+0)
  }),
  secret: 'CoderSecret',
  resave: false,
  saveUninitialized: false
}))

initPassport()
app.use(passport.initialize())
app.use(passport.session())

app.use ('/api/sessions', userRouter)
app.use('/api/products/', productRouter)
app.use('/api/carts/', cartRouter)
app.use('/', profileRouter)
app.use('/realtimeproducts', realTimeProductsRouter)

const httpServer = app.listen(port, () => {
  console.log(`Express running on local port: ${PORT}`)
})

const io = new Server(httpServer);
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