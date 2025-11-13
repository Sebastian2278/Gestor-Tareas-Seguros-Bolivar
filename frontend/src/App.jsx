import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import { AuthContext } from './context/AuthContext';

// Componente para proteger las rutas (Ruta Privada)
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  // Si está autenticado, muestra la página; si no, redirige al login
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Ruta protegida para las tareas */}
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <TasksPage />
            </PrivateRoute>
          }
        />
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/tasks" />} />
      </Routes>
    </div>
  );
}

export default App;