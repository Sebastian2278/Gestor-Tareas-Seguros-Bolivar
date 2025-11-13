import React, { useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import Navbar from '../components/Navbar';


function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [filters, setFilters] = useState({ status: '', priority: '', sort: 'createdAt_desc' });    
    const { isAuthenticated } = useContext(AuthContext);

    // Función principal para cargar tareas (implementa los filtros)
    const fetchTasks = useCallback(async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);
        try {
            // Construye la URL con los filtros
            const queryParams = new URLSearchParams(filters).toString();
            const res = await api.get(`/tasks?${queryParams}`);
            setTasks(res.data);
        } catch (err) {
            console.error("Error al cargar tareas:", err);
            setError("No se pudieron cargar las tareas. ¿El backend está corriendo?");
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, filters]); 

    // Carga las tareas al montar el componente o cuando cambian los filtros
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Lógica del CRUD

    // 1. Crear/Actualizar (desde el TaskForm)
    const handleSaveTask = async (taskData) => {
        try {
            if (editingTask) {
                // Actualizar (PUT)
                await api.put(`/tasks/${editingTask._id}`, taskData);
                setEditingTask(null);
                toast.success('✅ Tarea actualizada con éxito.'); // TOAST ÉXITO
            } else {
                // Crear (POST)
                await api.post('/tasks', taskData);
                toast.success('➕ Tarea creada con éxito.'); //  TOAST ÉXITO
            }
            fetchTasks(); 
        } catch (err) {
            const msg = err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || 'Error al guardar la tarea.';
            toast.error(`❌ Error: ${msg}`); //  TOAST ERROR
        }
    };

    // 2. Eliminar (DELETE)
    const handleDeleteTask = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            try {
                await api.delete(`/tasks/${id}`);
                setTasks(tasks.filter(t => t._id !== id));
                toast.warn(' Tarea eliminada correctamente.'); // TOAST WARN
            } catch (err) {
                toast.error(' Error al eliminar la tarea.'); // TOAST ERROR
            }
        }
    };

    // Manejo de Filtros
    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };
    
    // --- Renderizado de la Interfaz ---
    if (loading) return <p className="loading">Cargando tareas...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <>
            <Navbar />
            <div className="tasks-page-container">
                <div className="task-management">
                    <TaskForm 
                        currentTask={editingTask} 
                        onSave={handleSaveTask} 
                        onCancel={() => setEditingTask(null)}
                    />
                </div>

                <div className="task-list-section">
                    <h2>Lista de Tareas ({tasks.length})</h2>

                    {/* Implementación de Filtros */}
                    <div className="filters">
                        <label>
                            Filtrar por Estado:
                            <select name="status" value={filters.status} onChange={handleFilterChange}>
                                <option value="">Todos</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="En progreso">En Progreso</option>
                                <option value="Completada">Completada</option>
                            </select>
                        </label>
                        <label>
                        Filtrar por Prioridad:
                    <select name="priority" value={filters.priority} onChange={handleFilterChange}>
                        <option value="">Todos</option>
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                    </select>
                        </label>
                    </div>
                    <div className="filters">
  
    <label>
        Ordenar por:
        <select name="sort" value={filters.sort} onChange={handleFilterChange}>
            <option value="createdAt_desc">Fecha (Más reciente)</option>
            <option value="createdAt_asc">Fecha (Más antigua)</option>
            <option value="priority_desc">Prioridad</option>
        </select>
    </label>
</div>
                    <div className="task-list">
                        {tasks.length === 0 ? (
                            <p>No tienes tareas con estos filtros. ¡Crea una!</p>
                        ) : (
                            tasks.map(task => (
                                <div key={task._id} className={`task-card status-${task.status.replace(' ', '-')}`}>
                                    <div className="task-header">
                                        <h4>{task.title}</h4>
                                        <span className={`priority ${task.priority}`}>{task.priority.toUpperCase()}</span>
                                    </div>
                                    <p className="task-description">{task.description}</p>
                                    <p className="task-info">Estado: <strong>{task.status}</strong></p>
                                    <div className="task-actions">
                                        <button 
                                            className="btn-edit" 
                                            onClick={() => setEditingTask(task)}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            className="btn-delete" 
                                            onClick={() => handleDeleteTask(task._id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TasksPage;