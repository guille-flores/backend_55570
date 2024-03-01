import mongoose from "mongoose";

const collection = 'Users';

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: {
        type: Number,
        min: 0,
        validate : {
            // Age MUST be an integer, so we apply a validator here
            // Mongoose doesn't have different schema for double or integers
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value'
        }
    },
    password: String,
    role: {
        type: String,
        default: 'user'
    },
    cart: {
        type: mongoose.Schema.ObjectId,
        ref:"carts"
    },
    last_connection: Date,
    documents: [{
        name: String,
        reference: String
    }]
});

// generating the product collection in the DB
const usersModel = mongoose.model(collection, schema);
export default usersModel;