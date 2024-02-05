import ProfileService from "../services/profile.service.js";
import { STATUS } from "../utils/constants.js";

class ProfileController {
    async homePage(req, res){
        try{
            const response = await ProfileService.homePage(req);

            res.render('home', {
                notLoggedIn: response.notlogged, 
                areProducts: response.products.length > 0,
                products: response.products,
                isAdmin: response.isAdmin
            })
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }

    async registrationPage(req, res){
        try{
            const response = await ProfileService.loggedinUser(req);
            if(response.hasOwnProperty('notLoggedIn') && response.notLoggedIn == false){
                res.render('register', {
                    notLoggedIn: false,
                    email: response.email
                })
            }else{
                res.render('register', {
                    notLoggedIn: true
                })
            }
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }

    async loginPage(req, res){
        try{
            const response = await ProfileService.loggedinUser(req);
            if(response.hasOwnProperty('notLoggedIn') && response.notLoggedIn == false){
                res.render('login', {
                    notLoggedIn: false,
                    email: response.email
                })
            }else{
                res.render('login', {
                    notLoggedIn: true
                })
            }
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }

    async profilePage(req, res){
        try{
            const response = await ProfileService.loggedinUser(req);
            if(response.hasOwnProperty('notLoggedIn') && response.notLoggedIn == false){
                res.render('profile', {
                    notLoggedIn: false,
                    email: response.email,
                    age: response.age,
                    name: response.name
                })
            }else{
                res.render('profile', {
                    notLoggedIn: true
                })
            }
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }

    async forgotPasswordPage(req, res){
        try{
            const response = await ProfileService.loggedinUser(req);
            if(response.hasOwnProperty('notLoggedIn') && response.notLoggedIn == false){
                res.render('login', {
                    notLoggedIn: false,
                    email: response.email
                })
            }else{
                res.render('forgotpassword', {
                    notLoggedIn: true
                })
            }
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }
}

export default new ProfileController