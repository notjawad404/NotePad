const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    }
    catch(error){
        console.log("Error Connecting to MongoDB: ", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;