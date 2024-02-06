import UserService from "../services/user.service.js";
import { STATUS } from "../utils/constants.js";
import { transport } from "../utils/mailing.utils.js";
import { PORT } from "../config.js";

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
            const email = req.params.email;
            const response = await UserService.existingUser(email);
            if(response){
                let emailresponse = await transport.sendMail({
                    from: 'memo.rfl97@gmail.com',
                    to: email,
                    subject: '¿Has olvidado tu contraseña?',
                    html: `
                    <div>
                        <h1>Reestablece tu contraseña</h1>
                        <p>Parece que se ha solicitado reestablecer la contraseña del usuario ${email}.</p>
                        <p>Reestablece tu contraseña dando click al siguiente enlace:</p>
                        <a href='http://localhost:${PORT}/api/sessions/resetpassword?time=${Date.now()}&email=${encodeURI(email)}'>
                            <button type="button">Reestablecer Contraseña</button>
                        </a>
                        <p>Si no has sido tú, puedes hacer caso omiso a este mensaje.</p>
                    </div>
                    `,
                    attachments: []
                })
                res.status(201).json({
                    user: response,
                    status: STATUS.SUCCESS
                })
            }else{
                res.status(404).json({
                    user: `Seems like there is no user registered with the email address ${email}.`,
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

    async resetPasswordPage(req, res){
        try{ 
            const { time, email } = req.query
            if(Number(time) + 1*3600*1000 > Date.now()){
                res.render('resetpassword', {
                    expired: false,
                    email: email
                })
            }else{
                res.render('resetpassword', {
                    expired: true
                })
            }
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }
 
    async resetPassword(req, res){
        try{
            const data = req.body;
            const response = await UserService.resetPassword(data);

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
}

export default new UserController