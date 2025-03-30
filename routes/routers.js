const express = require('express');
const router = express.Router();
const { createUser,loginUser, createReservation, getUserReservation, cancelReservation } = require('../services/userControllers.js')

//routers post y get dependiendo del endpoint
router.post('/register', createUser)
router.post('/login', loginUser)
router.post('/reservation', createReservation)
router.get('/userReservation/:id', getUserReservation)
router.get('/cancelReservation/:id', cancelReservation)
module.exports = router;