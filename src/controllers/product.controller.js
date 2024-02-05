import ProductService from "../services/product.service.js";
import { STATUS } from "../utils/constants.js";

import CustomError from '../services/errors/customError.service.js';
import EErors from '../services/errors/typesError.service.js';
import { generateProductErrorInfo } from '../services/errors/productError.service.js';

class ProductController {
    async getProducts(req, res){
        try{
            const query = req.query
            const response = await ProductService.getProducts(query);

            res.render('home', {
                areProducts: response.length > 0,
                products: response
            }).status(201).json({
                products: response,
                status: STATUS.SUCCESS
            })
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }

    async getProductsJSON(req, res){
        try{
            const query = req.query
            const response = await ProductService.getProducts(query);

            res.status(201).json({
                products: response,
                status: STATUS.SUCCESS
            })
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }

    async getProductByID(req, res){
        try{
            const pid = req.params.pid;
            const response = await ProductService.getProductByID(pid);

            res.render('home', {
                areProducts: response.length > 0,
                products: response
            }).status(201).json({
                products: response,
                status: STATUS.SUCCESS
            })
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }

    async getProductByIDJSON(req, res){
        try{
            const pid = req.params.pid;
            const response = await ProductService.getProductByID(pid);

            res.status(201).json({
                products: response,
                status: STATUS.SUCCESS
            })
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }

    async createProduct(req, res, next){
        try{
            const data = req.body;
            let owner = 'admin'
            if(req.hasOwnProperty('session') && req.session.hasOwnProperty('user') && req.session.user.hasOwnProperty('email')){
                owner = req.session.user.email;
            }
            if(data.hasOwnProperty('products')){ //first we check if there is a multiple product inside the json
                const product = data.products;
                if(Array.isArray(product)){ //we also check if the multiple products are a list/array
                    for(let cc = 0; cc < product.length; cc++){
                        data.products[cc].owner = owner;
                        //if the product has no title, price, code or stock, we will raise an error
                        if(!product[cc].hasOwnProperty('title') || !product[cc].hasOwnProperty('price') || !product[cc].hasOwnProperty('code') || !product[cc].hasOwnProperty('stock')){
                            CustomError.createError({
                                name: "Product creation error",
                                cause: generateProductErrorInfo(product[cc]),
                                message: "Error Trying to create a Product",
                                code: EErors.INVALID_TYPE
                            })
                        }

                        //if the price is not a number or is < $0
                        if(typeof Number(product[cc].price) !== "number" || Number(product[cc].price) < 0){
                            CustomError.createError({
                                name: "Product creation error",
                                cause: generateProductErrorInfo(product[cc]),
                                message: "Error Trying to create a Product",
                                code: EErors.INVALID_TYPE
                            })
                        }

                        //if the price is not a number or is < $0
                        if(typeof Number(product[cc].stock) !== "number" || Number(product[cc].stock) < 0){
                            CustomError.createError({
                                name: "Product creation error",
                                cause: generateProductErrorInfo(product[cc]),
                                message: "Error Trying to create a Product",
                                code: EErors.INVALID_TYPE
                            })
                        }
                    }
                }else{
                    //if the product has no title, price, code or stock, we will raise an error
                    if(!product.hasOwnProperty('title') || !product.hasOwnProperty('price') || !product.hasOwnProperty('code') || !product.hasOwnProperty('stock')){
                        CustomError.createError({
                            name: "Product creation error",
                            cause: generateProductErrorInfo(product),
                            message: "Error Trying to create a Product",
                            code: EErors.INVALID_TYPE
                        })
                    }

                    //if the price is not a number or is < $0
                    if(typeof Number(product.price) !== "number" || Number(product.price) < 0){
                        CustomError.createError({
                            name: "Product creation error",
                            cause: generateProductErrorInfo(product),
                            message: "Error Trying to create a Product",
                            code: EErors.INVALID_TYPE
                        })
                    }

                    //if the price is not a number or is < $0
                    if(typeof Number(product.stock) !== "number" || Number(product.stock) < 0){
                        CustomError.createError({
                            name: "Product creation error",
                            cause: generateProductErrorInfo(product),
                            message: "Error Trying to create a Product",
                            code: EErors.INVALID_TYPE
                        })
                    }
                }
            }else{
                data.owner = owner;
                if(!data.hasOwnProperty('title') || !data.hasOwnProperty('price') || !data.hasOwnProperty('code') || !data.hasOwnProperty('stock')){
                    CustomError.createError({
                        name: "Product creation error",
                        cause: generateProductErrorInfo(data),
                        message: "Error Trying to create a Product",
                        code: EErors.INVALID_TYPE
                    })
                }

                //if the price is not a number or is < $0
                if(typeof Number(data.price) !== "number" || Number(data.price) < 0){
                    CustomError.createError({
                        name: "Product creation error",
                        cause: generateProductErrorInfo(data),
                        message: "Error Trying to create a Product",
                        code: EErors.INVALID_TYPE
                    })
                }

                //if the price is not a number or is < $0
                if(typeof Number(data.stock) !== "number" || Number(data.stock) < 0){
                    CustomError.createError({
                        name: "Product creation error",
                        cause: generateProductErrorInfo(data),
                        message: "Error Trying to create a Product",
                        code: EErors.INVALID_TYPE
                    })
                }
            }

            const response = await ProductService.createProduct(data);

            res.status(201).json({
                products: response,
                status: STATUS.SUCCESS
            })
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL,
                cause: error.cause
            })
        }
    }

    async updateProduct(req, res){
        try{ 
            const data = req.body;

            if(data.hasOwnProperty('products')){ //first we check if there is a multiple product inside the json
                const product = data.products;
                if(Array.isArray(product)){ //we also check if the multiple products are a list/array
                    for(let cc = 0; cc < product.length; cc++){
                        //updates 
                        let updates = product[cc].updates
                        for(var key in updates){
                            switch(key){
                                case 'price':
                                    //if the price is not a number or is < $0
                                    if(typeof Number(updates[key]) !== "number" || Number(updates[key]) < 0){
                                        CustomError.createError({
                                            name: "Product creation error",
                                            cause: generateProductErrorInfo(updates),
                                            message: "Error Trying to create a Product",
                                            code: EErors.INVALID_TYPE
                                        })
                                    }
                                    break;
                                case 'stock':
                                    //if the stock is not a number or is < $0
                                    if(typeof Number(updates[key]) !== "number" || Number(updates[key]) < 0){
                                        CustomError.createError({
                                            name: "Product creation error",
                                            cause: generateProductErrorInfo(updates),
                                            message: "Error Trying to create a Product",
                                            code: EErors.INVALID_TYPE
                                        })
                                    }
                                    break;
                            }
                        }
                    }
                }else{
                    let updates = product.updates
                    for(var key in updates){
                        switch(key){
                            case 'price':
                                //if the price is not a number or is < $0
                                if(typeof Number(updates[key]) !== "number" || Number(updates[key]) < 0){
                                    CustomError.createError({
                                        name: "Product creation error",
                                        cause: generateProductErrorInfo(updates),
                                        message: "Error Trying to create a Product",
                                        code: EErors.INVALID_TYPE
                                    })
                                }
                                break;
                            case 'stock':
                                //if the stock is not a number or is < $0
                                if(typeof Number(updates[key]) !== "number" || Number(updates[key]) < 0){
                                    CustomError.createError({
                                        name: "Product creation error",
                                        cause: generateProductErrorInfo(updates),
                                        message: "Error Trying to create a Product",
                                        code: EErors.INVALID_TYPE
                                    })
                                }
                                break;
                        }
                    }
                }
            }else{
                let updates = data.updates
                for(var key in updates){
                    switch(key){
                        case 'price':
                            //if the price is not a number or is < $0
                            if(typeof Number(updates[key]) !== "number" || Number(updates[key]) < 0){
                                CustomError.createError({
                                    name: "Product creation error",
                                    cause: generateProductErrorInfo(updates),
                                    message: "Error Trying to create a Product",
                                    code: EErors.INVALID_TYPE
                                })
                            }
                            break;
                        case 'stock':
                            //if the stock is not a number or is < $0
                            if(typeof Number(updates[key]) !== "number" || Number(updates[key]) < 0){
                                CustomError.createError({
                                    name: "Product creation error",
                                    cause: generateProductErrorInfo(updates),
                                    message: "Error Trying to create a Product",
                                    code: EErors.INVALID_TYPE
                                })
                            }
                            break;
                    }
                }
            }


            const response = await ProductService.updateProduct(data);

            res.status(201).json({
                products: response,
                status: STATUS.SUCCESS
            })
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL,
                cause: error.cause
            })
        }
    }

    async deleteProductByID(req, res){
        try{
            const id = req.params.pid;
            const response = await ProductService.deleteProductByID(id);

            res.status(201).json({
                product: response,
                status: STATUS.SUCCESS
            })
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }
}

export default new ProductController