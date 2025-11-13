const express = require('express');
const { check } = require('express-validator'); 
const router = express.Router();
const auth = require('../middlewares/auth'); 
const taskController = require('../controllers/taskController');

// POST /api/tasks (Crear)
router.post(
    '/',
    [
        auth, // Protegida por autenticación 
        check('title', 'El título es requerido').not().isEmpty()
    ],
    taskController.createTask
);

// GET /api/tasks (Leer todas, con filtros) [cite: 6, 12]
router.get('/', auth, taskController.getTasks);

// PUT /api/tasks/:id (Actualizar) [cite: 6]
router.put(
    '/:id',
    [
        auth,
        check('title', 'El título es requerido').not().isEmpty()
    ],
    taskController.updateTask
);

// DELETE /api/tasks/:id (Eliminar) [cite: 6]
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;