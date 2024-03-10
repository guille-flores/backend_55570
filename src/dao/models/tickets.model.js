import { Schema, model } from 'mongoose';

const ticketsCollection = 'tickets'; //collection name in MongoDB

// defining the products schema for the collection
const ticketsSchema = new Schema({
    purchase_datetime: {
        type: Date, 
        default: Date.now
    },
    amount: {
        type: Number,
        default: 0
    },
    products: [{
        title: String,
        price: Number,
        quantity: Number
    }],
    purchaser: String
});

// generating the ticketsModel collection in the DB
const ticketsModel = model(ticketsCollection, ticketsSchema);
export default ticketsModel;