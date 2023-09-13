// DEFINING THE PRODUCT MANAGER CLASS TO STORE/MANAGE EVERY PRODUCT THAT GETS ADDED
class ProductManager{
    constructor(file){
        this._products = [];
        //it will receive the path of the file that will contain or that contains the products to manage
        this.path = file;
    }

    //return all products stored
    getProducts(){
        const fs = require('node:fs');
        //if the file exist, then it could have some product, so we will check the file
        if (fs.existsSync(this.path) && fs.readFileSync(this.path).length !== 0) { 
            let data = fs.readFileSync(this.path, { encoding: 'utf8', flag: 'r' });
            //wait for the products to load and parse them as list instead of STRING
            this._products = JSON.parse(data) 
        }
        return this._products;
    }

    addProduct(title, description, price, thumbnail, code, stock){
        const fs = require('node:fs');
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
            fs.writeFileSync(this.path, JSON.stringify(this._products));
        }else{
            console.log(`\nThis product (CODE ${code}) is already in the Product Manager object.\n`)
        }
    }

    getProductByID(id){
        const fs = require('node:fs');
        //if the file exist, then it could have some product, so we will check the file
        if (fs.existsSync(this.path) && fs.readFileSync(this.path).length !== 0) { 
            let data = fs.readFileSync(this.path, { encoding: 'utf8', flag: 'r' });
            //wait for the products to load and parse them as list instead of STRING
            this._products = JSON.parse(data) 
        }

        let found = this._products.find(e => e.id === id);
        if(found){
            console.log(found)
            return found;
        }else{
            throw new Error(`ID ${id} not found. It may have been deleted.`);
        }
    }


    deleteProduct(id){
        const fs = require('node:fs');
        //if the file exist, then it could have some product, so we will check the file
        if (fs.existsSync(this.path) && fs.readFileSync(this.path).length !== 0) { 
            let data = fs.readFileSync(this.path, { encoding: 'utf8', flag: 'r' });
            //wait for the products to load and parse them as list instead of STRING
            this._products = JSON.parse(data) 
        }else{
            throw new Error(`The Product Manager has no products! ID ${id} doesn't exist in Product Manager.`);
            // if the file doesn't exists, then we haven't added any product (is empty, so we cannot delete any product).
        }
        
        //if no error thrown, we have producst, so we look for the specific one with the same ID
        let index_found = this._products.findIndex(e => e.id === id);
        if(index_found !== -1){
            //if the product was found, it will have an index != -1
            //we use the splice method to remove the items from an array in the given index (and just 1 item, so we don't remove other items).
            this._products.splice(index_found, 1);

            //we update the products file to reflect the changes
            fs.writeFileSync(this.path, JSON.stringify(this._products));
            console.log(this._products)
            return this._products
        }else{
            //if we have the product file but no product matches the given ID
            throw new Error(`ID ${id} not found`);
        }
    }

    updateProduct(id, modifications){
        const fs = require('node:fs');
        //if the file exist, then it could have some product, so we will check the file
        if (fs.existsSync(this.path) && fs.readFileSync(this.path).length !== 0) { 
            let data = fs.readFileSync(this.path, { encoding: 'utf8', flag: 'r' });
            //wait for the products to load and parse them as list instead of STRING
            this._products = JSON.parse(data) 
        }else{
            throw new Error(`The Product Manager has no products! ID ${id} not found. Please create the product with the method addProduct().`);
            // if the file doesn't exists, then we haven't added any product (is empty, so we cannot delete any product).
        }
        
        //if no error thrown, we have producst, so we look for the specific one with the same ID
        let index_found = this._products.findIndex(e => e.id === id);
        if(index_found !== -1){
            //if the product was found, it will have an index != -1
            //now we will define the modifications. As we defined them as objects, we can iterate in their keys in a simple manner
            let target = this._products[index_found];
            for(const key in modifications){
                target[key] = modifications[key]; //modifying the value of the product with the new values
            }
            this._products[index_found] = target; //assigning the changes in the corresponding index to replace the product with this new changes
            fs.writeFileSync(this.path, JSON.stringify(this._products));
            console.log(this._products[index_found])
            return this._products[index_found]
        }else{
            //if we have the product file but no product matches the given ID
            throw new Error(`ID ${id} not found, cannot update the product. Please create the product with the method addProduct().`);
        }
    }
}


// JSON OBJECT
const products_json = `{
    "products":[
        {
            "title": "MOSISO Funda MacBook",
            "description": "MOSISO Funda Dura Compatible con MacBook Pro 13 Pulgadas 2023, 2022, 2021, 2020-2016 M2 M1 A2338 A2289 A2251 A2159 A1989 A1706 A1708 con/sin Barra táctil, Carcasa Rígida de Plástico, Negro.",
            "price": 389.00,
            "thumbnail": "https://m.media-amazon.com/images/I/51iK6bF9EYL._AC_SL1200_.jpg",
            "code": "PR-0001",
            "stock": 5
        }, 
        {
            "title": "PUBAMALL Cubierta Impermeable",
            "description": "PUBAMALL Cubierta Impermeable para Motocicletas, protección contra el Polvo, escombros, Lluvia y Clima, Aptos para Motocicletas como Honda, Yamaha, Suzuki, Harley y más.",
            "price": 199.65,
            "thumbnail": "https://m.media-amazon.com/images/I/410y+P66JcL._AC_.jpg",
            "code": "PR-0002",
            "stock": 59
        }, 
        {
            "title": "Echo Dot (3ra generación)",
            "description": "Nuestro dispositivo Echo más popular, Echo Dot es un bocina inteligente que se controla con la voz y que usa Alexa. Gracias a su diseño, es ideal para cualquier habitación de la casa.",
            "price": 999.00,
            "thumbnail": "https://m.media-amazon.com/images/I/61Rr8uxmREL._AC_SL1000_.jpg",
            "code": "PR-0003",
            "stock": 1
        }, 
        {
            "title": "Kindle (versión de 2022)",
            "description": "El Kindle más ligero y compacto, ahora con una pantalla de alta resolución de 300 ppi para ofrecer texto e imágenes más nítidas.",
            "price": 2099.00,
            "thumbnail": "https://m.media-amazon.com/images/I/712cXKEU6SL._AC_SL1500_.jpg",
            "code": "PR-0004",
            "stock": 0
        }, 
        {
            "title": "TP-Link Deco WiFi Mesh",
            "description": "Sistema WiFi de Malla Para todo el Hogar: Antivirus, Roaming Continuo, Cobertura de hasta 5,500 Pies Cuadrados y Más de 100 Dispositivos (Deco M5 3 Pack).",
            "price": 2968.00,
            "thumbnail": "https://m.media-amazon.com/images/I/611EW6z8sZL._AC_SL1500_.jpg",
            "code": "PR-0005",
            "stock": 3
        }, 
        {
            "title": "TP-Link Deco WiFi Mesh",
            "description": "Sistema WiFi de Malla Para todo el Hogar: Antivirus, Roaming Continuo, Cobertura de hasta 5,500 Pies Cuadrados y Más de 100 Dispositivos (Deco M5 3 Pack).",
            "price": 2968.00,
            "thumbnail": "https://m.media-amazon.com/images/I/611EW6z8sZL._AC_SL1500_.jpg",
            "code": "PR-0005",
            "stock": 3
        }          
    ]
}`;

// PARSING JSON OBJECT
const products_obj = JSON.parse(products_json);
const products_arr = products_obj.products;

//write the path of the file that will contain or that contains the products to manage
let productmanager = new ProductManager(file='./products.json'); 

console.log('GET PRODUCTS METHOD 1: ')
console.log(productmanager.getProducts())


for(let index in products_arr){
    // OBTAINING EVERY PRODUCT FROM THE JSON OBJECT (LOOP THROUGH IT)
    productmanager.addProduct(products_arr[index].title, products_arr[index].description, products_arr[index].price, products_arr[index].thumbnail, products_arr[index].code, products_arr[index].stock);
}
console.log('\n\nGET PRODUCTS METHOD 2: ')
console.log(productmanager.getProducts())

//look for a specific product ID
console.log('\n\nGET PRODUCT BY ID METHOD: ')
productmanager.getProductByID(4)

//look for a specific product ID
console.log('\n\nDELETE PRODUCT BY ID METHOD: ')
productmanager.deleteProduct(4)


//We will define some values that we want to modify form the product
let modifyobject = {
    "title": "Echo Dot (2da generación)",
    "price": 799.99
};
console.log('\n\nUPDATE PRODUCTS METHOD: ')
console.log('before modifications: ')
productmanager.getProductByID(3)
console.log('after modifications: ') 
productmanager.updateProduct(3, modifyobject)
