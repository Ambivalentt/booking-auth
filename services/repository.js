const User = require('../schema/userSchema.js')
const bscrypt = require('bcryptjs')
const userReservation = require('../schema/reservationSchema.js')
const mongoose = require('mongoose')

class UserRepository {
    static async create({ name, email, password, gender, age }) {
        Validation.name(name)
        Validation.email(email)
        Validation.password(password)
        Validation.gender(gender)
        Validation.age(age)

        const user = await User.findOne({ email })
        if (user) throw new Error('Email already exists')

        const passwordHash = await bscrypt.hash(password, 10)

        const newUser = new User(
            {
                name,
                email,
                password: passwordHash,
                gender,
                age
            }
        );

        await newUser.save()
        return newUser
    }

    static async login({ email, password }) {
        const user = await User.findOne({ email })
        if (!user) throw new Error('Email not found')

        const isValid = await bscrypt.compare(password, user.password)
        if (!isValid) throw new Error('Password is incorrect')
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            age: user.age
        }
    }
}


class ReservationRepository {
    static MAX_RESERVATIONS_PER_HOUR = 7 // Maximo de reservas por hora;
    static async create({ userID, date, time, status }) { //funcionar para crear reservas con los campos requeridos

        const userExists = await User.findById(userID);
        //buscamos userID en la BD User, si no existe se enviara un error
        if (!userExists) throw new Error('User not found')
            
        const startTime = time.slice(0, 2) + ":00"; // obtenemos la hora sin minutos y agregamos 00
        const endTime = time.slice(0, 2) + ":59"; // Convierte "12:32" en "12:59"

        const count = await userReservation.countDocuments({ userID, date, time: { $gte: startTime, $lte: endTime }, status: "confirmed" })
      //si quitamos userID secontara todas las reservas en general
        //validacion de datos userid si existe, data y time
        Validation.countReservations(count)
        Validation.validateID(userID)
        Validation.validateDate(date)
        Validation.validateTime(time)

        const newReservation = new userReservation( //creamos una nueva reserva en la BD mongo pasandole el schmea y los datos necesarios
            {
                userID,
                date,
                time,
                status
            }
        );
        await newReservation.save() //esperamos y guardamos
        return newReservation
    }
}

//validacion de datos de los usuarios y reservas
class Validation {
    static name(name) {
        if (name.length < 3) throw new Error('Name must be at least 3 characters long')
        if (typeof name !== 'string') throw new Error('Name must be a string')
    }
    static email(email) {
        if (email.length < 3) throw new Error('Email must be at least 3 characters long')
        if (typeof email !== 'string') throw new Error('Email must be a string')
    }
    static password(password) {
        if (password.length < 3) throw new Error('Password must be at least 3 characters long')
        if (typeof password !== 'string') throw new Error('Password must be a string')
    }
    static gender(gender) {
        if (gender.length < 1) throw new Error('Need to select Famele or Male')
        if (typeof gender !== 'string') throw new Error('Gender must be a string')
    }
    static age(age) {
        if (age < 18) throw new Error('Person must be at least 18 years old')
        if (typeof age !== 'number') throw new Error('Age must be a number')
    }
    static validateID(ID) {
        if (!mongoose.Types.ObjectId.isValid(ID)) throw new Error('All users need to be registered for create a reservation')
    }
    static countReservations(count) {
        if (count >= ReservationRepository.MAX_RESERVATIONS_PER_HOUR) throw new Error('No more reservations available for this hour')
    }
    static validateTime(time) {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Formato HH:mm (24 horas)
        if (!timeRegex.test(time)) throw new Error('Time must be in format HH:MM');
    }
    static validateDate(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Eliminar la hora para comparar solo la fecha

        const reservationDate = new Date(date);
        reservationDate.setHours(0, 0, 0, 0); // Eliminar la hora también

        if (isNaN(reservationDate.getTime())) throw new Error('Invalid date format');
        if (reservationDate < today) throw new Error('Date must be today or in the future');
    }
}

module.exports = { UserRepository, ReservationRepository }