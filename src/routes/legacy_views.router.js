import { Router } from 'express';
const router = Router();
import productsModel from '../dao/models/products.model.js';
import sessionsModel from '../dao/models/sessions.model.js';

//We will show the products via Handlebars
router.get('/', async (req, res) => {
    
    let notlogged = true;
    if(req.hasOwnProperty('session') && req.session.hasOwnProperty('user')){
        let sessions = await sessionsModel.find().regex("session", req.session.user.email);
        if(sessions.length > 0){ //if an existing session is found with the given email
            notlogged = false;
        }
    };

    /*
    Mongoose returns Mongoose documents, not JavaScript Objects, so in order to use them
    with Handlebars, we first need to make them JS objects so they have 'own' properties.
    This is done with lean() method.
    */

    let products = await productsModel.find().lean();
    res.render('home', {
        notLoggedIn: notlogged, 
        areProducts: products.length > 0,
        products
    }); 
});


router.get('/register', async (req, res) => {
    //we will look for existing sessions
    if(req.hasOwnProperty('session') && req.session.hasOwnProperty('user')){
        let sessions = await sessionsModel.find().regex("session", req.session.user.email);
        if(sessions.length > 0){ //if an existing session is found with the given email
            console.log(sessions)
            res.render('register', {
                notLoggedIn: sessions.length < 1,
                email: req.session.user.email
            });
        }
    }else{
        res.render('register', {
            notLoggedIn: true
        });
    }
    
});

router.get('/login', async (req, res) => {
    //we will look for existing sessions
    if(req.hasOwnProperty('session') && req.session.hasOwnProperty('user')){
        let sessions = await sessionsModel.find().regex("session", req.session.user.email);
        if(sessions.length > 0){ //if an existing session is found with the given email
            console.log(sessions)
            res.render('login', {
                notLoggedIn: sessions.length < 1,
                email: req.session.user.email
            });
        }
    }else{
        res.render('login', {
            notLoggedIn: true
        });
    }
});

router.get('/profile', async (req, res) => {
    //we will look for existing sessions
    if(req.hasOwnProperty('session') && req.session.hasOwnProperty('user')){
        let sessions = await sessionsModel.find().regex("session", req.session.user.email);
        if(sessions.length > 0){ //if an existing session is found with the given email
            console.log(sessions)
            res.render('profile', {
                notLoggedIn: sessions.length < 1,
                email: req.session.user.email,
                age: req.session.user.age,
                name: req.session.user.name
            });
        }
    }else{
        res.render('profile', {
            notLoggedIn: true
        });
    }
});


export default router;
