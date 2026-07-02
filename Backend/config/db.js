const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || process.env.CONNECTION_STRING;

    if (!mongoUri) {
        console.log('Error Connecting to MongoDB: Missing MongoDB connection string. Set MONGO_URI or CONNECTION_STRING.');
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error Connecting to MongoDB: ', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;