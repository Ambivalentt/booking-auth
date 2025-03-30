const { UserRepository, ReservationRepository } = require('./repository.js');
const express = require('express');
const jwt = require('jsonwebtoken');
const Reservation = require('../schema/reservationSchema.js')

const createUser = async (req, res) => { //funcion para crear usuarios
    try {
        const user = await UserRepository.create(req.body)  //llamos la clase UserRepository y la funcion create
        res.status(201).send(user)
    } catch (err) {
        res.status(400).send(err.message) //error por si noe ntra
    }
}
const loginUser = async (req, res) => {
    try {
        const user = await UserRepository.login(req.body) //llamos la clase UserRepository y la funcion login
        const token = jwt.sign({  //creamos el token con la libreria jsonwebtoken, mandamos el id, email y name del usuario
            id: user.id,
            email: user.email,
            name: user.name
        }, process.env.JWT_SECRET, { expiresIn: '1h' }) //clave del token y tiempo de expiracion
        res.cookie('access_token', token, { httpOnly: true }) //creamos el cookie acces_token y enviamos el token de jwt.sign
        res.status(200).send({ user, token })  //enviamos como respuesta el usuario y el token
    } catch (err) {
        res.status(400).send(err.message) //error si no funciona
    }
}
const createReservation = async (req, res) => {
    const token = req.cookies.access_token  //tomamos el token de la cookie "acces_token"
    if (!token) return res.status(400).send('Token not found') //si no hay respuesta del token se enviara un error 400
    const data = jwt.verify(token, process.env.JWT_SECRET); //pasamos el token y la clave secreta a data
    req.user = data; //pasamos data a req.user
    userID = req.user.id //obtenemos el id del usuario en userID
    if (!data) return res.status(400).send('User not found') //si no encuentra el token o la clave secreta, enviara error
    const { date, time, status } = req.body; //obtenemos la fecha hora y status de req.body (req.body es lo que el usuario envia)
    try {
        const reservation = await ReservationRepository.create({ //se llama a la clase ReservationRepository y la funcion create y le pasamos datos
            userID,
            date,
            time,
            status
        })
        //console.log(reservation) //checar si reservation esta enviando bien los datos 
        res.status(201).send(reservation) //response dos datos creados
    } catch (err) {
        res.status(400).send(err.message) //error si no se consigue crear la reserva
    }
}

const getUserReservation = async (req, res) => {
    try {
        const userID = req.params.id //obtenemos el id del parametro /:id
        const reservations = await Reservation.find({ userID }).populate('userID', 'name email') 
        //POPULATE:buscamos en la BD mongo si el userID existe y si no existe enviara un error 400, populate busca por id
        //userID es es lo que se espera buscar y el ID dentro de el, name y email es lo que se espera obtener
        res.status(200).send(reservations) //mandamos todas las reservaciones dependiendo del ID
    } catch (err) {
        res.status(400).send(err.message) //error si no se consigue obtener la reservacion o no existe
    }
}
module.exports = { createUser, createReservation, loginUser, getUserReservation }