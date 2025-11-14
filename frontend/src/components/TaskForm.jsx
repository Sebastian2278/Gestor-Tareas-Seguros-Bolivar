import React, { useState, useEffect } from 'react';

// Formulario para crear o editar una tarea
function TaskForm({ currentTask, onSave, onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('media');
    const [status, setStatus] = useState('pendiente');

    // Efecto para cargar los datos de la tarea actual si estamos en modo Edición
    useEffect(() => {
        if (currentTask) {
            setTitle(currentTask.title || '');
            setDescription(currentTask.description || '');
            setPriority(currentTask.priority || 'media');
            setStatus(currentTask.status || 'pendiente');
        } else {
            // Limpiar si no hay tarea actual (modo Creación)
            setTitle('');
            setDescription('');
            setPriority('media');
            setStatus('pendiente');
        }
    }, [currentTask]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ title, description, priority, status });
    };

    return (
        <div className="task-form-container">
            <h3>{currentTask ? 'Editar Tarea' : 'Crear Nueva Tarea'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Título*:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Título de la tarea (Requerido)"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Descripción:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detalles adicionales"
                    ></textarea>
                </div>

                <div className="form-group">
            <label>Prioridad:</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
            </select>
        </div>

                {currentTask && ( // El estado solo se puede cambiar en edición
                    <div className="form-group">
                        <label>Estado:</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="pendiente">Pendiente</option>
                            <option value="en progreso">En Progreso</option>
                            <option value="completada">Completada</option>
                        </select>
                    </div>
                )}
                
                <div className="form-actions">
                    <button type="submit" className="btn-primary">
                        {currentTask ? 'Guardar Cambios' : 'Crear Tarea'}
                    </button>
                    {onCancel && (
                        <button type="button" className="btn-secondary" onClick={onCancel}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default TaskForm;