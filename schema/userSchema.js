const monngose = require('mongoose');
const Schema = monngose.Schema;

//schema para User de la collection users
const userChema = new Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    gender:{type:String, required:true},
    age:{type:Number, required:true},
},{collection:'users'})

module.exports = monngose.model('User', userChema);