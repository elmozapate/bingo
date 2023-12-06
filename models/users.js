const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersShema = new Schema({
    name: String,
    paswword: String,
    ip: Number,
    descripcion: String
});

// Crear el modelo
const Users = mongoose.model('users', usersShema);

module.exports = Users;