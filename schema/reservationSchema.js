const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//creamos el schema para reservaciones, con el id del anterior schema de user
const reservationSchema = new Schema({
    userID:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date:{type:String, required:true},
    time:{type:String, required:true},
    status:{type:String, enum:['confirmed','cancelled','cancalled'], default:'confirmed'},
},{collection:'reservation'})

module.exports = mongoose.model('Reservation', reservationSchema);