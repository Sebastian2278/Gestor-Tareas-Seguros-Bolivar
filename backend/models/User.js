const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    match: [/.+@.+\..+/, 'Por favor, introduce un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida']
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);