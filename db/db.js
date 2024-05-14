import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;


const connection = async () => {
    const URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.gpht2ol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

    try {
        await mongoose.connect(URL);
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

export default connection;