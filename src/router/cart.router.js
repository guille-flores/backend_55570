import CartController from "../controllers/cart.controller.js";
import { Router } from "express";


const cartRouter = Router();

cartRouter.post('/', CartController.createCart)
cartRouter.get('/:cid', CartController.getCartByID)
cartRouter.post('/:cid/products/:pid', CartController.addProductToCartByID)
cartRouter.delete('/:cid', CartController.deleteProductsFromCartByID)
cartRouter.delete('/:cid/products/:pid', CartController.deleteProductByIDFromCart)

export default cartRouter
