import supertest from "supertest";
import { expect } from 'chai'; 

// calling the environment variables
//import { PORT } from "../../src/config.js";
import * as dotenv from 'dotenv'
dotenv.config()


const url = supertest('http://localhost:'+process.env.PORT);
let productid
describe('Testing products', () =>{
    it('Test 1.0 - Obtaining product(s) from /api/products with Supertest', async ()=>{      
        const test = await url.get('/api/products/json')
        /*
        const { statusCode, _body } = await url.get('/api/products/json')
        const products = _body.products.map((x) => x._id)
        const response = {
            status: statusCode,
            payload: products
        }
        */
        expect(test.statusCode).to.be.oneOf([201, 200], "Payload: "+ JSON.stringify(test.body))
        expect(test.body).to.have.property('products')
        if(test.body.hasOwnProperty('products') && test.body.products.length > 0 ){
            test.body.products.forEach(product => {
                expect(product).to.have.property('_id')
            });
        }
    })

    it('Test 1.1 - Obtaining LIMITED product(s) from /api/products with Supertest', async ()=>{      
        const qs = {limit: 1}
        const test  = await url.get('/api/products/json?'+Object.keys(qs)[0]+'='+Object.values(qs)[0])
        /*
        const { statusCode, _body }  = await url.get('/api/products/json?'+Object.keys(qs)[0]+'='+Object.values(qs)[0])
        const products = _body.products.map((x) => x._id)
        const response = {
            status: statusCode,
            payload: products
        }
        console.log(response)
        */
        expect(test.statusCode).to.be.oneOf([201, 200], "Payload: "+ JSON.stringify(test.body))
        expect(test.body).to.have.property('products')
        if(test.body.hasOwnProperty('products') && test.body.products.length > 0 ){
            expect(test.body.products.length).to.be.eql(Object.values(qs)[0])
        }
    })

    it('Test 1.2 - Obtaining SORTED product(s) from /api/products with Supertest', async ()=>{      
        const qs = {sort: 'desc'}
        const test  = await url.get('/api/products/json?'+Object.keys(qs)[0]+'='+Object.values(qs)[0])
        /*
        const { statusCode, _body }  = await url.get('/api/products/json?'+Object.keys(qs)[0]+'='+Object.values(qs)[0])
        const products = _body.products.map((x) => ({_id: x._id, price: x.price}))
        const response = {
            status: statusCode,
            payload: products
        }
        console.log(response)
        */
        expect(test.statusCode).to.be.oneOf([201, 200], "Payload: "+ JSON.stringify(test.body))
        expect(test.body).to.have.property('products')
        if(test.body.hasOwnProperty('products') && test.body.products.length > 0 ){
            let prices = test.body.products.map((x) => x.price) //sort is based on price
            let sorted = false
            if(Object.values(qs)[0] === 'asc'){
                sorted = prices.every((value, index, array) => index === 0 || value >= array[index - 1]);
            }else if(Object.values(qs)[0] === 'desc'){
                sorted = prices.every((value, index, array) => index === 0 || value <= array[index - 1]);
            }
            expect(sorted).to.be.true;
        }
    })

    it('Test 1.3 - Obtaining FILTERED CATEGORY product(s) from /api/products with Supertest', async ()=>{      
        const qs = {category: 'coffee'}
        const test  = await url.get('/api/products/json?'+Object.keys(qs)[0]+'='+Object.values(qs)[0])
        /*
        const { statusCode, _body }  = await url.get('/api/products/json?'+Object.keys(qs)[0]+'='+Object.values(qs)[0])
        const products = _body.products.map(x => ({_id: x._id, category: x.category}))
        const response = {
            status: statusCode,
            payload: products
        }
        console.log(response)
        */

        expect(test.statusCode).to.be.oneOf([201, 200], "Payload: "+ JSON.stringify(test.body))
        expect(test.body).to.have.property('products')
        if(test.body.hasOwnProperty('products') && test.body.products.length > 0 ){
            test.body.products.forEach((element) => expect(element.category).to.be.eqls(Object.values(qs)[0]));
        }
    })
    

    it('Test 2 - Creating a product from /api/products with Supertest', async ()=>{
        const mockProduct = {
            title: 'Supertest Product Title',
            description: 'Supertest Mock Product',
            price: 2000.89,
            thumbnail: 'https://media.wired.com/photos/5a94ae219308984e64053143/1:1/w_1800,h_1800,c_limit/roomba.jpg',
            code: 'PRTESTSUPERTEST1',
            stock: 10,
            category: 'technology',
            owner: 'admin'
        }

        /*
        const { statusCode, _body }  = await url.post('/api/products').send(mockProduct)
        const response = {
            status: statusCode,
            payload: _body
        }
        console.log(response)
        */
        const test  = await url.post('/api/products').send(mockProduct)
        expect(test.statusCode).to.be.oneOf([201, 200], "Payload: "+ JSON.stringify(test.body))
        expect(test.body).to.have.property('products')
        if(test.body.hasOwnProperty('products')){
            expect(test.body.products).to.have.property('_id')
            productid = test.body.products._id
            console.log('New Product ID: ' + productid)
        }
    })

    it('Test 3 - Updating a product from /api/products/{id} with Supertest', async ()=>{
        const updateProduct = {
            id: productid,
            updates: {
                title: 'New Title Supertest',
                price: 100
            }
        };
        const test  = await url.put('/api/products').send(updateProduct)
        /*
        const response = {
            status: test.statusCode,
            payload: test.body
        }
        console.log(response)
        */
        expect(test.statusCode).to.be.oneOf([201, 200], "Payload: "+ JSON.stringify(test.body))
        expect(test.body).to.have.property('products')
        if(test.body.hasOwnProperty('products')){
            expect(test.body.products).to.have.property('_id')
            console.log('Product Updated: '+ JSON.stringify(test.body.products))
        }
    })

    it('Test 4 - Deleting a product from /api/products/{id} with Supertest', async ()=>{
        const test  = await url.delete('/api/products/' + productid)
        expect(test.statusCode).to.be.oneOf([201, 200], "Payload: "+ JSON.stringify(test.body))
        expect(test.body).to.have.property('product')
        if(test.body.hasOwnProperty('product')){
            expect(test.body.product).to.have.property('deletedCount')
        }
    })
})
