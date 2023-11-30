import passport from 'passport';
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'

import usersModel from '../dao/models/users.model.js';
import bcrypt from 'bcrypt'

const LocalStrategy = local.Strategy;

const initPassport = () => {
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.98e7aef7032a1fc1',
        clientSecret: '225d22916104e584a1be46fe3b64fafc7907093e',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    },
    async( accessToken, refreshToken, profile, done) => {
        try{
            let user = await usersModel.findOne({email: profile._json.email});
            if(!user){
                let new_user = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    age: 0,
                    password: ''
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
                
                const new_password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password:new_password
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

