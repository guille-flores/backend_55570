//defining the express module to set up a server
const express = require('express');

//setting up the express server and port
const app = express();
app.use(express.urlencoded({extended:true}))
const port = 8080;

// DEFINING THE PRODUCT MANAGER CLASS TO STORE/MANAGE EVERY PRODUCT THAT GETS ADDED
const fs = require('node:fs');
const content = fs.readFileSync('./products.json', 'utf-8');
const products = JSON.parse(content);

// Defining the product manager class
class ProductManager{
    constructor(file){
        this._products = [];
        //it will receive the path of the file that will contain or that contains the products to manage
        this.path = file;
    }

    //return all products stored
    async getProducts() {
        const content = await fs.promises.readFile(this.path, 'utf-8');
        const data = JSON.parse(content);
        return data;    
    }

    addProduct(title, description, price, thumbnail, code, stock){
        //We will check if there is any product matching the new product code. 
        //If there is no match, then we will add it. If they match, we won't add it,
        if(!this._products.find(e => e.code === code)){
            //first, we will get the ids in the products
            let ids = this._products.map(item => {return item.id});

            //then, we will get the max id from the products
            let max_id = 0;
            if(ids.length > 0){
                max_id = Math.max(...ids);
            }
            let new_id = max_id + 1; // add 1 to ensure we don't repeat the max currently available
            
            this._products.push({id: new_id, title: title, description: description, price: price, thumbnail: thumbnail, code: code, stock: stock}); // push the new product
            fs.writeFile(this.path, JSON.stringify(this._products), (err) => {
                if (err) {
                  console.log(err);
                }
                console.log("Product Added!");
              });
        }else{
            console.log(`\nThis product (CODE ${code}) is already in the Product Manager object.\n`)
        }
    }

    async getProductByID(id){
        const res = await this.getProducts(); //waiting to obtain the products
        let found = res.find(e => e.id === id); //then we will find the matching id
        if(found){
            return found //if found, we will return it.
        }else{
            throw new Error(`ID ${id} not found. It may have been deleted.`);
        }
        ;
    }


    async deleteProduct(id){
        const res = await this.getProducts(); //waiting to obtain the products
        let index_found = res.findIndex(e => e.id === id);
        if(index_found !== -1){
            //if the product was found, it will have an index != -1
            //we use the splice method to remove the items from an array in the given index (and just 1 item, so we don't remove other items).
            res.splice(index_found, 1);

            //we update the products file to reflect the changes
            fs.writeFileSync(this.path, JSON.stringify(res));
            return res
        }else{
            //if we have the product file but no product matches the given ID
            throw new Error(`ID ${id} not found`);
        }
    }

    async updateProduct(id, modifications){
        const res = await this.getProducts(); //waiting to obtain the products
        
        //if no error thrown, we have producst, so we look for the specific one with the same ID
        let index_found = res.findIndex(e => e.id === id);
        if(index_found !== -1){
            //if the product was found, it will have an index != -1
            //now we will define the modifications. As we defined them as objects, we can iterate in their keys in a simple manner
            let target = res[index_found];
            for(const key in modifications){
                target[key] = modifications[key]; //modifying the value of the product with the new values
            }
            res[index_found] = target; //assigning the changes in the corresponding index to replace the product with this new changes
            fs.writeFileSync(this.path, JSON.stringify(res));
            return res[index_found]
        }else{
            //if we have the product file but no product matches the given ID
            throw new Error(`ID ${id} not found, cannot update the product. Please create the product with the method addProduct().`);
        }
    }
}

// Setting up the server
app.get('/', (req, res) => {
    const message = 'To see all the products go to: localhost:' + port + '/products'
    res.send(message)
})

//to see all products or a limited number of products
app.get('/products', (req, res) => {
    let query = req.query;
    let {limit} = query;

    if(!limit || isNaN(limit)){
        // If the query param has limit, and if the limit is not a number, we will return the filtered products (limited to the given amount)
        return res.send(products)
    }
    limit = Math.floor(limit); //in case user enters a double/float number
    let limited_products = products.slice(0, limit);
    res.send(limited_products)
})

//to see the specific product by id
app.get('/products/:pid', (req, res) => {
    let pid = req.params.pid;
    let product = products.find(e => e.id == pid);
    if(product){
        return res.send(product)
    }
    res.send(`Product with id ${pid} not found.`)
})

app.listen(port, () => {
  console.log(`Express running on local port: ${port}`)
})


