const express = require('express');
const { check } = require('express-validator'); 
const router = express.Router();
const authController = require('../controllers/authController');
const loginLimiter = require('../middlewares/rateLimiter'); // ⬅️ IMPORTAR

// POST /api/auth/register
router.post(
    '/register',
    loginLimiter, // ⬅️ APLICAR
    [ 
        check('email', 'Por favor, incluye un email válido').isEmail(),
        check('password', 'La contraseña debe tener 6 o más caracteres').isLength({ min: 6 })
    ],
    authController.registerUser
);

// POST /api/auth/login
router.post(
    '/login',
    loginLimiter, // ⬅️ APLICAR
    [ 
        check('email', 'Por favor, incluye un email válido').isEmail(),
        check('password', 'La contraseña es requerida').exists()
    ],
    authController.loginUser
);

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Obtener token del header (Frontend lo envía como 'x-auth-token')
    const token = req.header('x-auth-token');

    // Verificar si no hay token
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, autorización denegada' });
    }

    // Verificar token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Agregar el usuario (ID) del payload al objeto de solicitud (req.user)
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token no es válido' });
    }
};
