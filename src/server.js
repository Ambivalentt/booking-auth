require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./db.js')
const router = require('../routes/routers.js')
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')

app.use(cookieParser());
app.use(express.json());
app.use('/', router)

app.use((req, res, next) => {
    const token = req.cookies.access_token
    if (!token) return next()

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        console.log(data)
        next();
    } catch (err) {
        console.error("Token inválido o expirado:", err.message);
    }

})

app.use((req, res) => {
    res.status(404).send('Page not Found')
})

db()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
