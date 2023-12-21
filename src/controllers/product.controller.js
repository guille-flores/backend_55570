import ProductService from "../services/product.service.js";
import { STATUS } from "../utils/constants.js";


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

    async createProduct(req, res){
        try{
            const data = req.body;
            const response = await ProductService.createProduct(data);

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

    async updateProduct(req, res){
        try{
            const data = req.body;
            const response = await ProductService.updateProduct(data);

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