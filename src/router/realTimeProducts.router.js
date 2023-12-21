import RealTimeProductsController from "../controllers/realTimeProducts.controller.js";
import { Router } from "express";


const realTimeProductsRouter = Router();

realTimeProductsRouter.get('/', RealTimeProductsController.getRealTimeProducts)

export default realTimeProductsRouter
