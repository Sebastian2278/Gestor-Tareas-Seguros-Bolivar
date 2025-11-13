const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// [cite: 6] Crear una nueva tarea
exports.createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority, status } = req.body;

    try {
        const newTask = new Task({
            user: req.user.id, 
            title, // [cite: 7]
            description, // [cite: 8]
            priority, // [cite: 9]
            status // [cite: 10]
        });

        const task = await newTask.save();
        res.json(task);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

// [cite: 6] Leer todas las tareas (con filtros)
exports.getTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, priority, sort } = req.query; // ⬅️ OBTENER 'sort'

        const filter = { user: userId };

        // 1. Aplicar Filtros
        if (status) {
            filter.status = status;
        }
        if (priority) {
            filter.priority = priority;
        }

        // 2. Aplicar Ordenamiento
        let sortOption = {};
        switch (sort) {
            case 'createdAt_desc': // Más reciente primero (default)
                sortOption = { createdAt: -1 };
                break;
            case 'createdAt_asc': // Más antigua primero
                sortOption = { createdAt: 1 };
                break;
            case 'priority_desc': // Alta > Media > Baja
                // Ordenar por prioridad requiere lógica más compleja o un campo numérico.
                // Usaremos un orden de texto simple para el ejemplo, pero crearemos un caso para priorizar la alta.
                sortOption = { priority: -1, createdAt: -1 }; 
                break;
            default: // Por defecto, ordenar por la más reciente
                sortOption = { createdAt: -1 };
                break;
        }
        
        // Ejecutar la consulta con filtro y ordenamiento
        const tasks = await Task.find(filter).sort(sortOption); // ⬅️ APLICAR SORT
        
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

// [cite: 6] Actualizar una tarea
exports.updateTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { title, description, priority, status } = req.body;

    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Tarea no encontrada' });
        }

        // Validación: Asegurarse de que el usuario sea el dueño de la tarea
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        const fieldsToUpdate = {};
        if (title) fieldsToUpdate.title = title;
        if (description) fieldsToUpdate.description = description;
        if (priority) fieldsToUpdate.priority = priority;
        if (status) fieldsToUpdate.status = status;
        
        // Actualizar y obtener la versión modificada
        task = await Task.findByIdAndUpdate(
            req.params.id, 
            { $set: fieldsToUpdate }, 
            { new: true } 
        );

        res.json(task);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

// [cite: 6] Eliminar una tarea
exports.deleteTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Tarea no encontrada' });
        }

        // Validación: Asegurarse de que el usuario sea el dueño de la tarea
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        await Task.deleteOne({ _id: req.params.id }); 
        res.json({ msg: 'Tarea eliminada' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};