const rateLimit = require('express-rate-limit');

// Límite de 5 intentos por IP cada 15 minutos para rutas críticas
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Límite de 5 peticiones por IP en 15 minutos
    standardHeaders: true, // Devuelve información de límite en los headers
    legacyHeaders: false, // Deshabilita los headers X-RateLimit-*
    message: async (request, response) => {
        return response.status(429).json({
            msg: 'Demasiados intentos de inicio de sesión. Intente de nuevo en 15 minutos.'
        });
    }
});

module.exports = loginLimiter;