require('dotenv').config();  //cargamos las claves dl arthico .env
const mongoose = require('mongoose');

//conectamos a mongodb con la password indicada de MONG_URI
const server = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI)  //conectamos mongodb con la clave MONGO_URI
        console.log('Connected to MongoDB'); //verificamos si ya conecto
    } catch (error) {
        console.error(error);  //envia error si no conecta
    }
}

module.exports = server;