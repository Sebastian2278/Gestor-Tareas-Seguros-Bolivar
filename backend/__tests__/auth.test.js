const request = require('supertest');
const app = require('../server'); // Importamos la app de Express desde server.js
const mongoose = require('mongoose');

// **IMPORTANTE:** Este bloque es para asegurar que la base de datos se limpie después de las pruebas.
beforeAll(async () => {
    // Si la conexión ya está establecida, no hace nada.
    if (mongoose.connection.readyState === 0) {
        // Usa una base de datos diferente para las pruebas
        await mongoose.connect(process.env.MONGO_URI.replace('GestorTareasDB', 'TestDB'));
    }
});

// Limpia el modelo de User después de cada prueba
afterEach(async () => {
    await mongoose.model('User').deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});
// **FIN DEL BLOQUE IMPORTANTE**

describe('POST /api/auth/register', () => {
    it('debería responder con 400 si la contraseña es demasiado corta', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@mail.com',
                password: 'corta' // Menos de 6 caracteres
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].msg).toBe('La contraseña debe tener 6 o más caracteres');
    });

    it('debería responder con 400 si el email es inválido', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'emailinvalido',
                password: 'passwordSegura'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].msg).toBe('Por favor, incluye un email válido');
    });
});