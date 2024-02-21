import mongoose from "mongoose";
import cartsModel from "../../src/dao/models/carts.model.js";
import { PORT, MONGO_DB, MONGO_USER, MONGO_SECRET } from "../../src/config.js";
import supertest from "supertest";
import { expect } from 'chai'; 

const url = supertest('http://localhost:'+PORT);

before(async ()=>{
    mongoose.connect('mongodb+srv://'+MONGO_USER+':'+MONGO_SECRET+'@cluster0.nlbr7os.mongodb.net/'+MONGO_DB+'?retryWrites=true&w=majority')
    await cartsModel.collection.drop()
})

let cartid
describe('Testing carts', () =>{
    it('Test 1 - Creating a new cart from /api/carts with Supertest', async ()=>{      
        const test  = await url.post('/api/carts')
        /*
        console.log(test.statusCode)
        console.log(test.body)
        */
        expect(test.statusCode).to.be.oneOf([201, 200], "Payload: "+ JSON.stringify(test.body))
        expect(test.body).to.have.property('cart')
        expect(test.body.cart).to.have.property('_id')
        cartid = test.body.cart._id
        console.log(`Cart ID: ${cartid}`)
    })

    it('Test 2 - Getting a cart from /api/carts/{cid} with Supertest', async ()=>{      
        const test  = await url.get('/api/carts/'+cartid)
        expect(test.statusCode).to.be.oneOf([201, 200], "Payload: "+ JSON.stringify(test.body))
        expect(test.body).to.have.property('cart')
        expect(test.body.cart[0]).to.have.property('_id')
        expect(test.body.cart[0]).to.have.property('products')        
    })

    it('Test 3 - Adding a product to the cart from /api/carts/{cid}/products/{pid} with Supertest', async ()=>{      
        const product_id = '65a9d70820516ff22144c99d'
        const quantity = {
            quantity: 2
        }
        const test  = await url.post('/api/carts/'+cartid+'/products/' + product_id).send(quantity)
        /*
        console.log(test.statusCode)
        console.log(test.body)
        */
        expect(test.statusCode).to.be.oneOf([201, 200], "Payload: "+ JSON.stringify(test.body))
        expect(test.body).to.have.property('cart')
        expect(test.body.cart).to.have.property('_id')
        expect(test.body.cart).to.have.property('products')
        console.log(test.body.message)
    })

    it('Test 4 - Getting the cart with a product from /api/carts/{cid} with Supertest', async ()=>{      
        const test  = await url.get('/api/carts/'+cartid)
        expect(test.statusCode).to.be.oneOf([201, 200], "Payload: "+ JSON.stringify(test.body))
        expect(test.body).to.have.property('cart')
        expect(test.body.cart[0]).to.have.property('_id')
        expect(test.body.cart[0]).to.have.property('products')
        if(test.body.cart[0].products.length > 0){
            let products = test.body.cart[0].products;
            let testresult = test.body.cart[0].products.map((x) => ({pid: x.product._id, quantity: x.quantity}))
            console.log(testresult)
        }
    })

    it('Test 5 - Adding another product to the cart from /api/carts/{cid}/products/{pid} with Supertest', async ()=>{      
        const product_id = '65541fbeed593f1d7be5931d'
        const quantity = {
            quantity: 4
        }
        const test  = await url.post('/api/carts/'+cartid+'/products/' + product_id).send(quantity)
        /*
        console.log(test.statusCode)
        console.log(test.body)
        */
        expect(test.statusCode).to.be.oneOf([201, 200], "Payload: "+ JSON.stringify(test.body))
        expect(test.body).to.have.property('cart')
        expect(test.body.cart).to.have.property('_id')
        expect(test.body.cart).to.have.property('products')
        console.log(test.body.message)
    })

    it('Test 6 - Getting the cart with products from /api/carts/{cid} with Supertest', async ()=>{      
        const test  = await url.get('/api/carts/'+cartid)
        expect(test.statusCode).to.be.oneOf([201, 200], "Payload: "+ JSON.stringify(test.body))
        expect(test.body).to.have.property('cart')
        expect(test.body.cart[0]).to.have.property('_id')
        expect(test.body.cart[0]).to.have.property('products')
        if(test.body.cart[0].products.length > 0){
            let testresult = test.body.cart[0].products.map((x) => ({pid: x.product._id, quantity: x.quantity}))
            console.log(testresult)
        }
    })

    it('Test 7 - Deleting a product from the cart from /api/carts/{cid}/products/{pid} with Supertest', async ()=>{      
        const product_id = '65541fbeed593f1d7be5931d'
        const test  = await url.delete('/api/carts/'+cartid+'/products/'+product_id)
        /*
        console.log(test.body)
        */
        expect(test.statusCode).to.be.oneOf([201, 200], "Payload: "+ JSON.stringify(test.body))
        expect(test.body).to.have.property('cart')
        expect(test.body.cart).to.have.property('_id')
        expect(test.body.cart).to.have.property('products')
        if(test.body.cart.products.length > 0){
            let products = test.body.cart.products.map((x) => x.product)
            console.log(products)            
            expect(products).not.include(product_id, "The deleted product is still in the cart")
        }
    })

    it('Test 8 - Deleting all products from the cart from /api/carts/{cid} with Supertest', async ()=>{      
        const test  = await url.delete('/api/carts/'+cartid)
        /*
        console.log(test.body)
        */
        expect(test.statusCode).to.be.oneOf([201, 200], "Payload: "+ JSON.stringify(test.body))
        expect(test.body).to.have.property('cart')
        expect(test.body.cart).to.have.property('_id')
        expect(test.body.cart).to.have.property('products')
        expect(test.body.cart.products.length).to.be.eqls(0)
    })
})

after(async ()=>{
    mongoose.connection.close()
})
