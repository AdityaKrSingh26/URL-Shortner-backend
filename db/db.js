import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGO_URI = process.env.MONGO_URI;


const connection = async () => {
    const defaultAtlas = (DB_USERNAME && DB_PASSWORD)
        ? `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.gpht2ol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
        : undefined;
    const fallbackLocal = "mongodb://127.0.0.1:27017/url-shortener";
    const URL = MONGO_URI || MONGODB_URI || defaultAtlas || fallbackLocal;

    try {
        await mongoose.connect(URL);
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

export default connection;