import CartService from "../services/cart.service.js";
import { STATUS } from "../utils/constants.js";

class CartController {
    async createCart(req, res){
        try{
            const response = await CartService.createCart();
            res.status(201).json({
                cart: response,
                status: STATUS.SUCCESS
            })
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }

    async getCartByID(req, res){
        try{
            const cid = req.params.cid;
            const response = await CartService.getCartByID(cid);

            if(response.length > 0){
                res.status(201).json({
                    cart: response,
                    status: STATUS.SUCCESS
                })
            }else{
                res.status(404).json({
                    cart: 'Cart with id ' + cid + ' was not found.',
                    status: STATUS.SUCCESS
                })
            }
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }

    async addProductToCartByID(req, res){
        try{
            const response = await CartService.addProductToCartByID(req);
            if(response){
                res.status(200).json({
                    message: 'Added the product ' + req.params.pid + ' to the cart ' + req.params.cid + '.',
                    cart: response,
                    status: STATUS.SUCCESS
                })
            }else{
                res.status(404).json({
                    message: 'Cart with id ' + req.params.cid + ' was not found.',
                    status: STATUS.SUCCESS
                })
            }
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }

    async deleteProductsFromCartByID(req, res){
        try{
            const cid = req.params.cid;
            const response = await CartService.deleteProductsFromCartByID(cid);
            if(response){
                res.status(200).json({
                    cart: response,
                    status: STATUS.SUCCESS
                })
            }else{
                res.status(404).json({
                    message: 'Cart with id ' + cid + ' was not found.',
                    status: STATUS.SUCCESS
                })
            }
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }

    async deleteProductByIDFromCart(req, res){
        try{
            const response = await CartService.deleteProductByIDFromCart(req);
            if(response){
                res.status(200).json({
                    cart: response,
                    status: STATUS.SUCCESS
                })
            }else{
                res.status(404).json({
                    message: 'Cart with id ' + cid + ' was not found.',
                    status: STATUS.SUCCESS
                })
            }
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }
}

export default new CartController