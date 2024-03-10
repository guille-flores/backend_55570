import usersModel from '../dao/models/users.model.js';
import sessionsModel from '../dao/models/sessions.model.js';
import bcrypt from 'bcrypt'
import { isValidObjectId } from 'mongoose';

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
            let update_last_connection = await usersModel.findOneAndUpdate({email: data.email}, {last_connection: Date.now()}, {
                new: true
            });
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

    async userDocuments(data, uid){
        try{
            let result
            if(isValidObjectId(uid)){
                result = await usersModel.findOneAndUpdate({ _id: uid }, { documents: data });
                if (result === null) {
                    result = `No user was found with the id ${uid}.`;
                }
            }else{
                result = `A valid MongoDB Object ID is needed as the User ID. Seems like ${uid} is not valid.`
            }
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }

    async getAllUsers(){
        try{
            let users = await usersModel.find();
            
            // Remove the 'password' key from each object
            const newUserArray = users.map(user => {
                const userObject = user.toObject(); // Convert Mongoose document to plain JavaScript object
                delete userObject.password;
                return userObject;
            });
            
            return newUserArray
        }catch(error){
            throw new Error(error.message)
        }
    }

    async deleteUsers(){
        try{
            const currenttime = new Date();
            currenttime.setDate(currenttime.getDate() - 2); //subtracting 2 days to filter users
            let users = await usersModel.find({last_connection: {$lt: currenttime}});
            
            if(users.length > 0){
                // Remove the 'password' key from each object
                const newUserArray = users.map(user => {
                    const userObject = user.toObject(); // Convert Mongoose document to plain JavaScript object
                    delete userObject.password;
                    return userObject;
                });
                const result = await usersModel.deleteMany({ last_connection: { $lt: currenttime } });
                return newUserArray
            }else{
                return null
            }
        }catch(error){
            throw new Error(error.message)
        }
    }
}

export default new UserService();