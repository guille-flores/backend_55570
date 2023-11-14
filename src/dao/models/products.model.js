import { Schema, model } from 'mongoose';

const productsCollection = 'products'; //collection name in MongoDB

// defining the products schema for the collection
const productsSchema = new Schema({
    title: {
        type: String,
        required: true
        // Every product SHOULD have a title, it doens't have to be unique, but must have a name at least
    },
    description: String,
    price: {
        type: Number,
        required: true,
        min: 0
        // We need a price to add a product. It could be set a default of 0 but is better that user adds it
        // Also, the price cannot be < 0
    },
    thumbnail: String,
    code:{
        type: String,
        unique: true,
        required: true
        // Code must be unique and is a mandatory field
    },
    stock: {
        type: Number,
        min: 0,
        default: 0,
        validate : {
            // Stock MUST be an integer, so we apply a validator here
            //Mongoose doesn't have different schema for double or integers
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value'
        }
    }
});

// generating the product collection in the DB
const productsModel = model(productsCollection, productsSchema);
export default productsModel;