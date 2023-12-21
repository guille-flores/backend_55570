import {Router} from 'express'
import usersModel from '../dao/models/users.model.js';
import sessionsModel from '../dao/models/sessions.model.js';
import passport from 'passport'

const router = Router();
router.post('/register', passport.authenticate('register', {
    failureRedirect: '/failregister',
}), async (req, res)=>{
    const {email, password, first_name, last_name, age} = req.body;

    req.session.user = {
        name : `${first_name} ${last_name}`,
        email : email,
        age: age
    };

    res.send({
        status: 200,
        message: 'success',
        description: 'User successfully registered!',
    })
});

router.get('/failregister',async(req,res)=>{
    res.send({error:'failed'})
});


router.post('/login', passport.authenticate('login', {
    failureRedirect: '/faillogin',
}), async (req, res)=>{
    const {email, password, first_name, last_name, age} = req.body;

    req.session.user = {
        name : `${first_name} ${last_name}`,
        email : email,
        age: age
    };

    res.send({
        status: 200,
        message: 'success',
        description: 'User successfully logged-in!',
    })
});

router.get('/faillogin',async(req,res)=>{
    res.send({error:'failed'})
})

router.delete('/logout', async (req, res) => {
    const {email} = req.body;
    console.log('Email: ')
    console.log(email)
    //we will look for existing sessions
    await sessionsModel.findOneAndDelete().regex("session", email).then(
        console.log('Session Closed Successfully!')
    );
    res.render('login', {
        notLoggedIn: true
    });
});


router.get('/github', passport.authenticate('github',{scope:['user: email']}),
async(req,res)=>{

});

router.get('/githubcallback' ,passport.authenticate('github', {failureRedirect:'/login' }), async(req,res)=>{
    req.session.user= req.user
    res.redirect('/')
});

router.get('/current', async (req, res) => {
    //we will look for existing sessions
    if(req.hasOwnProperty('session') && req.session.hasOwnProperty('user')){
        let sessions = await sessionsModel.find().regex("session", req.session.user.email);
        let user = await usersModel.find({email:req.session.user.email});
        if(sessions.length > 0){ //if an existing session is found with the given email
            console.log(sessions)
            let payload = {
                user,
                sessions
            }
            console.log(payload)
            res.json({
                info:{
                    status: 200,
                    message: 'There is a user currently loggeed-in.',
                    payload
                }
            })
        }
    }else{
        res.json({
            info:{
                status: 404,
                message: 'Seems like there is no user currently logged-in.'
            }
        })
    }
});


export default router