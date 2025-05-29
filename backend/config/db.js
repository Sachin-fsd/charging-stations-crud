const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();
// MongoDB connection URI
const dbURI = process.env.DB_URI || 'mongodb://localhost:27017/ev_charging_stations';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process with failure
    }
}

// Export the connectDB function
module.exports = connectDB;
// This code connects to a MongoDB database using Mongoose.