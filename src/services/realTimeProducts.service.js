import productsModel from '../dao/models/products.model.js';

class RealTimeProductsService{

    async getRealTimeProducts(data){
        try{
            let products = await productsModel.find().lean();
            const io = data.app.get('io');
            io.emit('load_products', products)
            return products
        }catch(error){
            throw new Error(error.message)
        }
    }
    
}

export default new RealTimeProductsService();