const mongoose = require('mongoose');

const cartsCollection = 'carts'; //collection name in MongoDB

// defining the products schema for the collection
const cartsSchema = new mongoose.Schema({
    products: {
        type: [{
            product:{
                type: mongoose.Schema.ObjectId,
                ref:"products"
            },
            quantity:{
                type: Number,
                default: 0
            }
        }],
        required: false,
        default: [] //default is to create an empty array of products for the cart
    }
});

// generating the product collection in the DB
const cartsModel = mongoose.model(cartsCollection, cartsSchema);
module.exports = cartsModel;