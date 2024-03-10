//defining the express module to set up a server
import express, { urlencoded, json } from 'express';
import { Server } from 'socket.io';
import { connect } from 'mongoose';
import userRouter from './router/user.router.js';
import usersRouter from './router/users_get_delete.router.js';
import productRouter from './router/product.router.js';
import cartRouter from './router/cart.router.js';
import profileRouter from './router/profile.router.js';
import realTimeProductsRouter from './router/realTimeProducts.router.js';
import mockingproductRouter from './router/mockingproduct.router.js';
import { devLogger } from './utils/logger_dev.utils.js';
import { prodLogger } from './utils/logger_prod.utils.js';

import session from 'express-session';
import MongoStorage from 'connect-mongo';
import initPassport from './config/passport.config.js';
import passport from 'passport';
import compression from 'express-compression';
import errorHandler from "./controllers/error.controller.js";
import nodemailer from 'nodemailer'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress  from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentacion de las APIs del e-commerce',
      descripcion: 'Información de las integraciones de Productos y Carritos de un E-Commerce desarrollado para el curso de Backend de Coderhouse.',
      version: '1.0.0',
      contact: {
        name: 'Guillermo Flores',
        email: 'memo.rfl97@gmail.com',
        url: 'https://www.linkedin.com/in/guillermo-ramirez-flores/'
      }
    }
  },
  apis: ['./src/docs/**/*.yaml']
};
const spec = swaggerJSDoc(swaggerOptions)

// calling the environment variables
import * as dotenv from 'dotenv'
dotenv.config()

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
app.use(compression());
const port = process.env.PORT;
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));
//app.use(static(__dirname+'/public'));

app.use(express.static(__dirname+'/public'))

// connecting to Mongo DB 
connect('mongodb+srv://'+process.env.MONGO_USER+':'+process.env.MONGO_SECRET+'@cluster0.nlbr7os.mongodb.net/'+process.env.MONGO_DB+'?retryWrites=true&w=majority')
  .then(() => console.log('connected to DB!'))
  .catch(error => console.log("Cannot connect to MongoDB: " + error))

app.use(session({
  store: new MongoStorage({
      mongoUrl:'mongodb+srv://'+process.env.MONGO_USER+':'+process.env.MONGO_SECRET+'@cluster0.nlbr7os.mongodb.net/'+process.env.MONGO_DB+'?retryWrites=true&w=majority',
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
if(process.env.NODE_ENV === 'development'){
  app.use(devLogger)
  app.use('/loggerTest', (req, res) => {
    req.logger.fatal('fatal')
    req.logger.warning('error')
    req.logger.info('info')
    req.logger.http('http')
    req.logger.debug('debug')
    req.logger.error('error')
    res.send('Test Logger')
  })
  app.use ('/mockingproducts', mockingproductRouter)
}
if(process.env.NODE_ENV === 'production'){
  app.use(prodLogger)
  app.use('/loggerTest', (req, res) => {
    console.log(req.logger)
    req.logger.fatal('fatal')
    req.logger.warning('error')
    req.logger.info('info')
    res.send('Test Logger')
  })
}
app.use ('/api/sessions/', userRouter)
app.use ('/api/users/', usersRouter)
app.use('/api/products/', productRouter)
app.use('/api/carts/', cartRouter)
app.use('/', profileRouter)
app.use('/realtimeproducts/', realTimeProductsRouter)


app.use(errorHandler);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec))

const httpServer = app.listen(port, () => {
  console.log(`Express running on local port: ${process.env.PORT}`)
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