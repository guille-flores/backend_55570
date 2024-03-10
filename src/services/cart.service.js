import cartsModel from '../dao/models/carts.model.js';
import usersModel from '../dao/models/users.model.js';
import productsModel from '../dao/models/products.model.js';
import ticketsModel from '../dao/models/tickets.model.js';

class CartService{
    async createCart(){
        try{
            let new_cart = await cartsModel.create({})
            return new_cart
        }catch(error){
            throw new Error(error.message)
        }
    }

    async getCartByID(id){
        try{
            let cart = await cartsModel.find({_id: id}).populate('products.product');
            return cart
        }catch(error){
            throw new Error(error.message)
        }
    }
 
    async getCartFromEmail(data){
        try{
            let user = await usersModel.find({email: data.email});
            console.log(user)
            return user
        }catch(error){
            throw new Error(error.message)
        }
    }

    async addProductToCartByID(data){
        const cart_json = data.body;
        const cid = data.params.cid;
        const pid = data.params.pid;

        let cart = await cartsModel.find({_id: cid}).lean();
        if(cart.length > 0){
            //obtaining the current products in the cart
            let products = cart[0].products;

            //if the product already exists, we will just modify the quantity, not add another same product
            let existing_product = products.find((element) => element.product == pid);
            if(existing_product){
                let newProd = products.map((element) => {
                    if(element.product == pid){
                        return {product: element.product, quantity:cart_json.quantity}
                    }else{
                        return element
                    }
                });
                var result = await cartsModel.findOneAndUpdate({_id: cid}, {products: newProd}, {new: true});
            }else{
                products.push({product: pid, quantity: cart_json.quantity});
                var result = await cartsModel.findOneAndUpdate({_id: cid}, {products: products}, {new: true});
            }
            return result
        }else{
            return false
        }

    }

    async deleteProductsFromCartByID(cid){
        try{
            let cart = await cartsModel.find({_id: cid});
            if(cart.length > 0){
                // if the cart is found, we will delete all the products
                var result = await cartsModel.findOneAndUpdate({_id: cid}, {products: []}, {new: true});
                return result
            }else{
                return false
            }
        }catch(error){
            throw new Error(error.message)
        }
    }

    async deleteProductByIDFromCart(data){
        const cid = data.params.cid;
        const pid = data.params.pid;
        let cart = await cartsModel.find({_id: cid}).lean();
        if(cart.length > 0){
            //obtaining the current products in the cart
            let products = cart[0].products;

            //if the product already exists, we will just modify the quantity, not add another same product
            let index_product = products.findIndex((element) => element.product == pid);
            if (index_product > -1) { // only splice array when item is found
                products.splice(index_product, 1); // 2nd parameter means remove one item only
                var result = await cartsModel.findOneAndUpdate({_id: cid}, {products: products}, {new: true});
            }else{
                var result = cart
            }
            return result
        }else{
            return false
        }
    }

    async purchaseCart(cid, email){
        try{
            let cart = await cartsModel.find({_id: cid});
            if(cart.length > 0){
                // if the cart is found, we will loop through the products
                //obtaining the current products in the cart
                let products = cart[0].products;
                var remainingproducts = [];
                var purchasedproducts = [];
                var total = 0;
                for(let k = 0; k < products.length; k++){
                    let foundproduct = await productsModel.find({_id: products[k].product}).lean();
                    if(foundproduct.length > 0){
                        if(foundproduct[0].stock >= products[k].quantity){
                            total += foundproduct[0].price*products[k].quantity
                            let newstock = foundproduct[0].stock - products[k].quantity;
                            var updatedproduct = await productsModel.findOneAndUpdate({_id: products[k].product}, {stock: newstock}, {new: true});
                            let addedproduct = {
                                title: foundproduct[0].title,
                                price: foundproduct[0].price,
                                quantity: products[k].quantity
                            }
                            purchasedproducts.push(addedproduct);
                        }else{
                            remainingproducts.push(products[k]);
                        }
                    }else{
                        remainingproducts.push(products[k]);
                    }
                }
                var new_cart = await cartsModel.findOneAndUpdate({_id: cid}, {products: remainingproducts}, {new: true});
                let new_ticket = await ticketsModel.create({
                    amount: total,
                    products: purchasedproducts,
                    purchaser: email
                })
                console.log(purchasedproducts)
                return new_ticket
            }else{
                return false
            }
        }catch(error){
            throw new Error(error.message)
        }
    }
}

export default new CartService();