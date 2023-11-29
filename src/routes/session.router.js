import {Router} from 'express'
import usersModel from '../dao/models/users.model.js';
import sessionsModel from '../dao/models/sessions.model.js';
import bcrypt from 'bcrypt'

const router = Router();
router.post('/register', async (req, res)=>{
    const {first_name, last_name, email, age, password} = req.body;
    const exist = await usersModel.findOne({email});
    if(exist) return res.status(400).send({
        status: 400,
        message: 'error',
        description: 'A user with email ' + email + ' is already registered.'
    });
    const new_password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const user = {
        first_name,
        last_name,
        email,
        age,
        password:new_password
    };

    let result = await usersModel.create(user);
    res.send({
        status: 200,
        message: 'success',
        description: 'User successfully registered!',
        payload: result
    })
});

router.post('/login', async (req, res)=>{
    const {email, password} = req.body;
    const existing_email = await usersModel.findOne({email});
    if(!existing_email) return res.status(400).send({
        status: 400,
        message: 'error',
        description: 'A user with email ' + email + ' is not registered.'
    });

    const correct_credentials = bcrypt.compareSync(password, existing_email.password)
    if(!correct_credentials) return res.status(400).send({
        status: 400,
        message: 'error',
        description: 'Incorrect credentials, prease try again.'
    });

    req.session.user = {
        name : `${existing_email.first_name} ${existing_email.last_name}`,
        email : existing_email.email,
        age: existing_email.age
    };

    res.send({
        status:'200',
        message: 'success',
        description: 'Primer Logueo', 
        payload: req.session.user  
        });
});

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

export default router