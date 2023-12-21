import ProductController from "../controllers/product.controller.js";
import { Router } from "express";


const productRouter = Router();

productRouter.get('/', ProductController.getProducts)
productRouter.get('/json', ProductController.getProductsJSON)

//to see the specific product by id
productRouter.get('/:pid', ProductController.getProductByID)
productRouter.get('/:pid/json', ProductController.getProductByIDJSON)

//create a product
productRouter.post('/', ProductController.createProduct)

//update a product
productRouter.put('/', ProductController.updateProduct)

productRouter.delete('/:pid', ProductController.deleteProductByID)

export default productRouter