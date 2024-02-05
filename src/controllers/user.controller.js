import UserService from "../services/user.service.js";
import { STATUS } from "../utils/constants.js";

class UserController {
    async registerUser(req, res){
        try{
            const data = req.body;
            const response = await UserService.registerUser(data);

            req.session.user = {
                name : `${data.first_name} ${data.last_name}`,
                email : data.email,
                age: data.age
            };

            req.session.save(); 

            res.status(201).json({
                user: response,
                status: STATUS.SUCCESS
            })
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }

    async loginUser(req, res){
        try{
            const data = req.body;
            const response = await UserService.loginUser(data);
            req.session.user = {
                name : `${data.first_name} ${data.last_name}`,
                email : data.email,
                age: data.age
            };

            req.session.save(); 
            
            res.status(201).json({
                user: response,
                status: STATUS.SUCCESS
            })
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }

    async logoutUser(req, res){
        try{
            const data = req.body;
            const response = await UserService.logoutUser(data);
            res.status(201).json({
                user: response,
                status: STATUS.SUCCESS
            })
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }
 
    async currentUser(req, res){
        try{
            const response = await UserService.currentUser(req);
            if(response){
                res.status(201).json({
                    user: response,
                    status: STATUS.SUCCESS
                })
            }else{
                res.status(404).json({
                    user: 'Seems like there is no user currently logged-in.',
                    status: STATUS.SUCCESS
                })
            }
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }
 
    async forgotPassword(req, res){
        try{
            console.log('checking exiistings')
            const response = await UserService.existingUser(req);
            if(response){
                console.log(response.email)
                res.status(201).json({
                    user: response,
                    status: STATUS.SUCCESS
                })
            }else{
                res.status(404).json({
                    user: 'Seems like there is no user registered with that email address.',
                    status: STATUS.SUCCESS
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

export default new UserController