const { UserRepository, ReservationRepository } = require('./repository.js');
const express = require('express');
const jwt = require('jsonwebtoken');
const Reservation = require('../schema/reservationSchema.js')
const createUser = async (req, res) => {
    console.log(req.body)
    try {
        const user = await UserRepository.create(req.body)
        res.status(201).send(user)
    } catch (err) {
        res.status(400).send(err.message)
    }
}
const loginUser = async (req, res) => {
    try {
        const user = await UserRepository.login(req.body)
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            name: user.name
        }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.cookie('access_token', token, { httpOnly: true })
        res.status(200).send({ user, token })
    } catch (err) {
        res.status(400).send(err.message)
    }
}
const createReservation = async (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(400).send('Token not found')
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    userID = req.user.id
    if (!data) return res.status(400).send('User not found')
    const { date, time, status } = req.body;
    try {
        const reservation = await ReservationRepository.create({
            userID,
            date,
            time,
            status
        })
        console.log(reservation)
        res.status(201).send(reservation)
    } catch (err) {
        res.status(400).send(err.message)
    }
}

const getUserReservation = async (req, res) => {
    try {
        const userID = req.params.id
        const reservations = await Reservation.find({ userID }).populate('userID', 'name email')
        res.status(200).send(reservations)
    } catch (err) {
        res.status(400).send(err.message)
    }
}
module.exports = { createUser, createReservation, loginUser, getUserReservation }