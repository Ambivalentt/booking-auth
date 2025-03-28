require('dotenv').config();
const mongoose = require('mongoose');


const server = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error);
    }
}

module.exports = server;