require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./db.js')
const router = require('../routes/routers.js')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')

app.use(cookieParser());  //cookies parser para poder leer las cookies
app.use(express.json());  //para poder leer el json
app.use('/', router)  //router para los rutas de la

app.use((req, res, next) => {         //middleware para verificar token cada vez que se entra al dominio
    const token = req.cookies.access_token //obtenemos el token de la cookie "acces_token"
    if (!token) return next() //si no hay token, se pasa al siguiente middleware

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET); //verificamos el token con la clave secreta
        req.user = data; //si el token es valido, se guarda en req.user
        console.log(data) 
        next(); //pasamos al siguiente middleware
    } catch (err) {
        console.error("Token inválido o expirado:", err.message); //si el token es invalido o expiro, se muestra el error
    }

})

app.use((req, res) => {
    res.status(404).send('Page not Found') //si no se encuentra la pagina, se envia un error 404
})

db() //funcion para conectar a la base de datos con mongodb
    .then(() => {      //server
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
