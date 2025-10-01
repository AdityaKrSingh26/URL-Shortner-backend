import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const MONGO_URI=process.env.MONGO_URI


const connection = async () => {
    const URL = MONGO_URI;

    try {
        await mongoose.connect(URL);
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

export default connection;