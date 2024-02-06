import UserController from "../controllers/user.controller.js";
import { Router } from "express";
import passport from 'passport'

const userRouter = Router();
userRouter.post('/register', passport.authenticate('register', {
    failureRedirect: '/failregister',
}), UserController.registerUser);

userRouter.get('/failregister',async(req,res)=>{
    res.send({error:'failed'})
});


userRouter.post('/login', passport.authenticate('login', {
    failureRedirect: '/faillogin',
}), UserController.loginUser);

userRouter.get('/faillogin',async(req,res)=>{
    res.send({error:'failed'})
})

userRouter.delete('/logout', UserController.logoutUser);


userRouter.get('/github', passport.authenticate('github',{scope:['user: email']}),
async(req,res)=>{

});

userRouter.get('/githubcallback' ,passport.authenticate('github', {failureRedirect:'/login' }), async(req,res)=>{
    req.session.user = req.user
    res.redirect('/')
});

userRouter.get('/current', UserController.currentUser);

userRouter.get('/forgotpassword/:email', UserController.forgotPassword); 

userRouter.get('/resetpassword', UserController.resetPasswordPage);

userRouter.post('/submitpassword', UserController.resetPassword);

export default userRouter