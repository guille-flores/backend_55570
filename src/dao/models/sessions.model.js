import mongoose from "mongoose";

const collection = 'sessions';

const schema = new mongoose.Schema({
    _id: String,
    expires: Date,
    session: String
});

// generating the sessions collection in the DB
const sessionsModel = mongoose.model(collection, schema);
export default sessionsModel;