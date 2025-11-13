const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  // Referencia al usuario (relación uno a muchos)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  title: {
    type: String,
    required: [true, 'El título de la tarea es requerido'],
    trim: true 
  },
  description: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['baja', 'media', 'alta'], // Solo permite estos valores [cite: 9]
    default: 'media'
  },
  status: {
    type: String,
    enum: ['pendiente', 'en progreso', 'completada'], // Solo permite estos valores [cite: 10]
    default: 'pendiente'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', TaskSchema);