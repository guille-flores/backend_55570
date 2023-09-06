// DEFINING THE PRODUCT MANAGER CLASS TO STORE/MANAGE EVERY PRODUCT THAT GETS ADDED
class ProductManager{
    constructor(){
        this._products = [];
    }

    //return all products stored
    getProducts(){
        return this._products;
    }

    addProduct(product){
        //We will check if there is any product matching the new product code. 
        //If there is no match, then we will add it. If they match, we won't add it,
        if(this._products.filter(e => e.getCode() == product.getCode()).length == 0){
            //first, we will get the ids in the products
            let ids = this._products.map(item => {return item.id});

            //then, we will get the max id from the products
            let max_id = 0;
            if(ids.length > 0){
                max_id = Math.max(...ids);
            }
            product.id = max_id + 1; // add 1 to ensure we don't repeat the max currently available
            
            this._products.push(product); // push the new product
            
        }else{
            console.log(`\nThis product (CODE ${product.code}) is already in the Product Manager object.\n`)
        }
    }

    getProductByID(id){
        let found = this._products.filter(e => e.id == id);
        if(found.length > 0){
            console.log(found[0])
            return found[0];
        }else{
            throw new Error(`ID ${id} not found`);
        }
    }
}

// DEFINING THE PRODUCT CLASS TO CREATE NEW PRODUCTS 
class Product{
    constructor(title, description, price, thumbnail, code, stock) {
        if(title && description && price && thumbnail && code && !isNaN(stock)){
            this._title = title;
            this._description = description;
            this._price = price;
            this._thumbnail = thumbnail;
            this._code = code;
            this._stock = stock;
        }else{
            throw new Error('There is a missing field in the product to add.');
        }
    }

    getCode(){
        return this._code;
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

// OBTAINING EVERY PRODUCT FROM THE JSON OBJECT (LOOP THROUGH IT)
let productmanager = new ProductManager();
console.log('GET PRODUCTS METHOD 1: ')
console.log(productmanager.getProducts())
for(let index in products_arr){
    productmanager.addProduct(new Product(products_arr[index].title, products_arr[index].description, products_arr[index].price, products_arr[index].thumbnail, products_arr[index].code, products_arr[index].stock))
}

//return the added products
console.log('\n\nGET PRODUCTS METHOD 2: ')
console.log(productmanager.getProducts())

//look for a specific product ID
console.log('\n\nGET PRODUCT BY ID METHOD: ')
productmanager.getProductByID(4)

