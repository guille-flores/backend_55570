import productsModel from '../dao/models/products.model.js';
import mongoose from 'mongoose';

class ProductService{
    async getProducts(query){
        try{
            let {limit, sort, category} = query;
            let sorttype = null;
            let products = [];
            if(sort && category){
                if(typeof sort === 'string' && (sort.toLowerCase() == 'asc' || sort.toLowerCase() == 'desc')){
                    if(sort.toLowerCase() == 'asc'){
                        sorttype = 1;
                    }else{
                        sorttype = -1;
                    }
                    products = await productsModel.aggregate([
                        {$match: {'category': category}},
                        {$sort: {'price': sorttype}}
                    ]);
                }else{
                    products = await productsModel.aggregate([
                        {$match: {'category': category}}
                    ]);
                }
                
            }else if(category){
                products = await productsModel.aggregate([
                    {$match: {'category': category}}
                ]);
            }else if(sort){
                if(typeof sort === 'string' && (sort.toLowerCase() == 'asc' || sort.toLowerCase() == 'desc')){
                    if(sort.toLowerCase() == 'asc'){
                        sorttype = 1;
                    }else{
                        sorttype = -1;
                    }
                    products = await productsModel.aggregate([
                        {$sort: {'price': sorttype}}
                    ]);
                }else{
                    products = await productsModel.find().lean();
                }
            }else{
                products = await productsModel.find().lean();
            }


            if(!limit || isNaN(limit)){
                // If the query param has limit, and if the limit is not a number, we will return the filtered products (limited to the given amount)
                //return res.send(products)
                return products
            }else{
                limit = Math.floor(limit); //in case user enters a double/float number
                let limited_products = products.slice(0, limit);
                return limited_products
            } 
        }catch(error){
            throw new Error(error.message)
        }
    }

    async getProductByID(id){
        try{
            let product = await productsModel.find({_id: id}).lean();
            //console.log(product)
            return product
        }catch(error){
            throw new Error(error.message)
        }
    }

    async createProduct(data){
        try{
            const product_json = data;
            //for simplicity, we will allow and suppose that the user can push multiple products in a single JSON.
            //the multiple products should come as: "{products":[{product 1}, {products 2}, ..., {product n}]}
            let product = product_json;
            let loopproduct = false;
            if(product_json.hasOwnProperty('products')){ //first we check if there is a multiple product inside the json
                product = product_json.products;
            }
            if(Array.isArray(product)){ //we also check if the multiple products are a list/array
                loopproduct = true;
            }
            //console.log(product)
            let result_arr = []
            
            if(loopproduct){
                for(let cc = 0; cc < product.length; cc++){
                    let result = await productsModel.create(product[cc])
                    result_arr.push(result);
                }
            }else{
                let result = await productsModel.create(product);
                result_arr = result;
            }
            return result_arr
        }catch(error){
            throw new Error(error.message)
        }
    }
    
    async updateProduct(data){
        try{
            //for simplicity, we will allow and suppose that the user can push multiple products in a single JSON.
            //the multiple products should come as: "{products":[{product 1}, {products 2}, ..., {product n}]}
            const product_json = data;
            let product = product_json;
            let loopproduct = false;
            if(product_json.hasOwnProperty('products')){ //first we check if there is a multiple product inside the json
                product = product_json.products;
            }
            if(Array.isArray(product)){ //we also check if the multiple products are a list/array
                loopproduct = true;
            }
            //console.log(product)
            let result_arr = []

            if(loopproduct){
                for(let cc = 0; cc < product.length; cc++){
                    let result = await productsModel.findOneAndUpdate({_id: product[cc].id}, product[cc].updates, {
                        new: true
                    });
                    result_arr.push(result);
                }
            }else{
                let result = await productsModel.findOneAndUpdate({_id: product.id}, product.updates, {
                    new: true
                });
                result_arr = result;
            }
            return result_arr
        }catch(error){
            throw new Error(error.message)
        }
    }

    async deleteProductByID(id){
        try{
            let result = await productsModel.deleteOne({_id: new mongoose.Types.ObjectId(id)});
            return result
        }catch(error){
            throw new Error(error.message)
        }
    }
    
}

export default new ProductService();