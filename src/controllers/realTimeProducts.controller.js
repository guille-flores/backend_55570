import RealTimeProductsService from "../services/realTimeProducts.service.js";
import { STATUS } from "../utils/constants.js";

class RealTimeProductsController {
    async getRealTimeProducts(req, res){
        try{
            const products = await RealTimeProductsService.getRealTimeProducts(req);
            res.render('realTimeProducts', {
                areProducts: products.length > 0,
                products
            });
        }catch(error){
            res.status(400).json({
                error: error.message,
                status: STATUS.FAIL
            })
        }
    }
}

export default new RealTimeProductsController