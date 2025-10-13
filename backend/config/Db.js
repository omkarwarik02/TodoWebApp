require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async() =>{
    try{
        mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
        console.log("MongoDB Connected");
    }catch (error){
        console.log("DB connection failed", error.message);
        process.exit(1);
    }

};
module.exports = connectDB;