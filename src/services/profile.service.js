import productsModel from '../dao/models/products.model.js';
import sessionsModel from '../dao/models/sessions.model.js';

class ProfileService{
    async homePage(data){
        try{
            let notlogged = true;
            let isAdmin = false;
            if(data.hasOwnProperty('session') && data.session.hasOwnProperty('user')){
                let sessions = await sessionsModel.find().regex("session", data.session.user.email);
                if(sessions.length > 0){ //if an existing session is found with the given email
                    notlogged = false;
                    let email = data.session.user.email
                    if(email.search('@admin') > 0){
                        isAdmin = true;
                    }
                }
            };

            /*
            Mongoose returns Mongoose documents, not JavaScript Objects, so in order to use them
            with Handlebars, we first need to make them JS objects so they have 'own' properties.
            This is done with lean() method.
            */

            const products = await productsModel.find().lean();
            const result = {
                products: products,
                notlogged: notlogged,
                isAdmin: isAdmin
            }
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }

    async loggedinUser(data){
        try{ 
            //we will look for existing sessions
            //console.log(data.session)
            let result = {}
            if(data.hasOwnProperty('session') && data.session.hasOwnProperty('user')){
                let sessions = await sessionsModel.find().regex("session", data.session.user.email);
                if(sessions.length > 0){ //if an existing session is found with the given email
                    result = {
                        notLoggedIn: sessions.length < 1,
                        email: data.session.user.email,
                        age: data.session.user.age,
                        name: data.session.user.name
                    }
                }
            }else{
                result = {
                    notLoggedIn: true
                }
            }
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }

    
}

export default new ProfileService();