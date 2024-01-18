import { Router } from "express";
import { generateProducts } from "../utils/mock.utils.js";
import { STATUS } from "../utils/constants.js";

const mockingproductRouter = Router();

mockingproductRouter.get('/', (req, res)=>{
    const response = Array.from({ length: 100 }, () => generateProducts());
    res.status(201).json({
        products: response,
        status: STATUS.SUCCESS
    })
})

export default mockingproductRouter