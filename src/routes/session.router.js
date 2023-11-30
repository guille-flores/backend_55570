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
        description: 'User successfully registered!',
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

export default router