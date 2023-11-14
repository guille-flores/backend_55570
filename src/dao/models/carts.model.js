import { Schema, model } from 'mongoose';

const cartsCollection = 'carts'; //collection name in MongoDB

// defining the products schema for the collection
const cartsSchema = new Schema({
    products: [{
        quantity: {
            type: Number,
            default: 0
        },
        product: {
            type: Schema.ObjectId,
            ref:"products"
        }
    }]
});

// generating the product collection in the DB
const cartsModel = model(cartsCollection, cartsSchema);
export default cartsModel;