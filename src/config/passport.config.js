import passport from 'passport';
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'

import usersModel from '../dao/models/users.model.js';
import cartsModel from '../dao/models/carts.model.js';
import CustomError from '../services/errors/customError.service.js';
import EErors from '../services/errors/typesError.service.js';
import { generateUserErrorInfo } from '../services/errors/userError.service.js';
// calling the environment variables
import * as dotenv from 'dotenv'
dotenv.config()

import bcrypt from 'bcrypt'

const LocalStrategy = local.Strategy;
var callbackURL = 'http://localhost:' + process.env.PORT
if (typeof window !== "undefined") {
    callbackURL = window.location.origin
}

const initPassport = () => {
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.98e7aef7032a1fc1',
        clientSecret: process.env.PASSPORT_GITHUB_SECRET,
        callbackURL: callbackURL + '/api/sessions/githubcallback'
    },
    async( accessToken, refreshToken, profile, done) => {
        try{
            console.log('passport before find one')
            console.log(profile)
            let user = await usersModel.findOne({email: profile._json.email});
            console.log('passport after find one')
            if(!user){
                let new_user = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    age: 0,
                    password: '',
                    last_connection: Date.now()
                };
                let result = await usersModel.create(new_user);
                return done(null, result)
            };
            return done(null, user)
        }catch(error){
            done(null, error)
        }
    }
    ));

    passport.use('register', new LocalStrategy( 
        {passReqToCallback :true , usernameField :'email'},

        async(req, username, password, done)=>{
            try{
                const {first_name, last_name, email, age} = req.body;
                const exist = await usersModel.findOne({email});
                
                if(exist) return done(null, false);
                
                //if consumer submits an invalid email
                if(!email.match(/[A-Za-z0-9]+@[A-Za-z]+\.[A-Za-z]+/)){
                    console.log(generateUserErrorInfo({first_name, last_name, email, age}))
                    CustomError.createError({
                        name: "User creation error",
                        cause: generateUserErrorInfo({first_name, last_name, email, age}),
                        message: "Error Trying to create a User",
                        code: EErors.INVALID_TYPE
                    })
                }
                //if consumer submits an invalid password
                if(!password.match(/\S{3,}/) || !password.match(/\d/)){
                    console.log(generateUserErrorInfo({first_name, last_name, email, age}))
                    CustomError.createError({
                        name: "User creation error",
                        cause: generateUserErrorInfo({first_name, last_name, email, age}),
                        message: "Error Trying to create a User",
                        code: EErors.INVALID_TYPE
                    })
                }
                //if consumer submits an invalid age
                if(age && (typeof Number(age) !== "number" || Number(age) <= 0 || Number(age) > 120)){
                    console.log(generateUserErrorInfo({first_name, last_name, email, age}))
                    CustomError.createError({
                        name: "User creation error",
                        cause: generateUserErrorInfo({first_name, last_name, email, age}),
                        message: "Error Trying to create a User",
                        code: EErors.INVALID_TYPE
                    })
                }

                let role = 'user';
                if(email.includes('@admin.com')){
                    role = 'admin';
                }; 
                let cart = await cartsModel.create({})
                const new_password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password:new_password,
                    role,
                    cart: cart._id,
                    last_connection: Date.now()
                };

                let result = await usersModel.create(user);
                return done(null, result)
            }catch(error){ 
                return done('User was not created... '+error)
            }
        }
    ));


    passport.use('login', new LocalStrategy( 
        {passReqToCallback :true , usernameField :'email'},
        
        async(req, email, password, done)=>{
            try{
                const existing_email = await usersModel.findOne({email});
                if(!existing_email) return done(null, false)

                const correct_credentials = bcrypt.compareSync(password, existing_email.password)
                if(!correct_credentials) return done(null, false)

                /* If the credentials are correct, we will also update the last login date */
                let update_last_connection = await usersModel.findOneAndUpdate({email: email}, {last_connection: Date.now()}, {
                    new: true
                });

                return done(null, existing_email)
            }catch(error){
                return done('There was an issue logging you in... '+error)
            }
        }
    ));

    passport.serializeUser((user,done)=>{
        done(null, user.id)
    })

 

    passport.deserializeUser(async(id, done)=>{
        let user = await usersModel.findById(id)
        done(null, user)
    })
};

export default initPassport;

