import cartsModel from '../dao/models/carts.model.js';

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
}

export default new CartService();