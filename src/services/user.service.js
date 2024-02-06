import usersModel from '../dao/models/users.model.js';
import sessionsModel from '../dao/models/sessions.model.js';
import bcrypt from 'bcrypt'

class UserService{
    async registerUser(data){
        try{
            const result = await usersModel.findOne({email:data.email});
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }
 
    async existingUser(email){
        try{
            const result = await usersModel.findOne({email:email});
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }

    async loginUser(data){
        try{
            const result = await usersModel.findOne({email:data.email});
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }

    async logoutUser(data){
        try{
            console.log('Email: ')
            console.log(data.email)
            //we will look for existing sessions
            const result = await sessionsModel.findOneAndDelete().regex("session", data.email).then(
                console.log('Session Closed Successfully!')
            );
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }

    async currentUser(data){
        try{
            if(data.hasOwnProperty('session') && data.session.hasOwnProperty('user')){
                let sessions = await sessionsModel.find().regex("session", data.session.user.email);
                let user = await usersModel.find({email:data.session.user.email});
                if(sessions.length > 0){ //if an existing session is found with the given email
                    let payload = {
                        user,
                        sessions
                    }
                    return payload
                }
            }else{
                return false
            }
        }catch(error){
            throw new Error(error.message)
        }
    }

    async resetPassword(data){
        try{
            let newpassword = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
            const result = await usersModel.updateOne({ email: data.email }, { password: newpassword });
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }
}

export default new UserService();