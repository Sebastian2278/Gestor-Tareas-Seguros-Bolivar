// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Carga las variables de entorno (.env)

const app = express();
const PORT = process.env.PORT || 5000;

// Conexión a MongoDB Atlas
const connectDB = async () => {
    try {
        // Usa la variable de entorno MONGO_URI
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Atlas Conectado...');
    } catch (err) {
        console.error('❌ Error de conexión a MongoDB:', err.message);
        process.exit(1); 
    }
};

connectDB();

// Middlewares: Deben ir antes de las rutas
app.use(cors()); 
app.use(express.json()); // Permite recibir JSON en el body de las peticiones

//  Importar los archivos de rutas 
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

//  Usar las rutas 
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API está corriendo en el puerto ' + PORT);
});

app.listen(PORT, () => console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`));

module.exports = app; // ⬅️ AGREGAR ESTA LÍNEA