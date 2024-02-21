import mongoose from "mongoose";
import usersModel from "../../src/dao/models/users.model.js";
import { PORT, MONGO_DB, MONGO_USER, MONGO_SECRET } from "../../src/config.js";
import supertest from "supertest";
import { expect } from 'chai'; 

const url = supertest('http://localhost:'+PORT);

before(async ()=>{
    mongoose.connect('mongodb+srv://'+MONGO_USER+':'+MONGO_SECRET+'@cluster0.nlbr7os.mongodb.net/'+MONGO_DB+'?retryWrites=true&w=majority')
    await usersModel.collection.drop()
})

let cookie
let emailaddress = 'supertest@hotmail.com'
describe('Testing sessions router', () =>{
    it('Test 1 - User Registration in /api/sessions/register with Supertest', async ()=>{      
        const mockUser = {
            first_name: "SuperTest", 
            last_name: "LasNameTest", 
            email: emailaddress, 
            age: "13",
            password: "Guille1997"
        }
        const test = await url.post('/api/sessions/register').send(mockUser)
        /*
        console.log(test.statusCode)
        console.log(test.body)
        */
        expect(test.statusCode).to.be.oneOf([201, 200], "Payload: "+ JSON.stringify(test.body))
        expect(test.body).to.have.property('user')
        if(test.body.hasOwnProperty('user')){
            expect(test.body.user).to.have.property('_id')
            expect(test.body.user).to.have.property('email')
            console.log('User ID: '+ test.body.user._id)
            console.log('User Email: '+ test.body.user.email)
        }
    })

    it('Test 2 - User Login in /api/sessions/login with Supertest', async ()=>{      
        const mockUser = {
            email: emailaddress, 
            password: "Guille1997"
        }
        const test = await url.post('/api/sessions/login').send(mockUser)
        /*
        console.log(test.statusCode)
        console.log(test.body)
        */
        expect(test.statusCode).to.be.oneOf([201, 200])
        expect(test.body).to.have.property('user')
        if(test.body.hasOwnProperty('user')){
            expect(test.body.user).to.have.property('_id')
            expect(test.body.user).to.have.property('email')
            console.log('User ID: '+ test.body.user._id)
            console.log('User Email: '+ test.body.user.email)
        }
        expect(test.headers).to.have.property('set-cookie')
        
        const cookieHeader = test.headers['set-cookie'][0]
        expect(cookieHeader).to.be.ok
        
        const cookieParts = cookieHeader.split('=')
        cookie = {
            name: cookieParts[0],
            value: cookieParts[1]
        }
    })

    it('Test 3 - Get current user info in /api/sessions/current with Supertest', async ()=>{      
        const test = await url.get('/api/sessions/current').set('Cookie', [`${cookie.name}= ${cookie.value}`])
        expect(test.statusCode).to.be.oneOf([201, 200])
        expect(test.body).to.have.property('user')
        expect(test.body.user).to.have.property('user')
        expect(test.body.user.user[0].email).to.be.equal(emailaddress)
    })
})

after(async ()=>{
    mongoose.connection.close()
})

