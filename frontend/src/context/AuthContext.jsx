import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  // Función de Login (llama a POST /api/auth/login)
  const login = async (email, password) => {
    try {
        const res = await api.post('/auth/login', { email, password });
        
        // Si el login es exitoso, el Backend debería devolver el token
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setIsAuthenticated(true);
        navigate('/tasks');
    } catch (err) {
        // MUY IMPORTANTE: Relanzar el error para que LoginPage lo maneje
        throw err;
    }
};

  // Función de Registro (llama a POST /api/auth/register)
  const register = async (email, password) => {
    try {
        const res = await api.post('/auth/register', { email, password });
        
        // Si el registro es exitoso, el Backend debería devolver el token
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setIsAuthenticated(true);
        navigate('/tasks');
    } catch (err) {
        // MUY IMPORTANTE: Relanzar el error para que RegisterPage lo maneje
        throw err; 
    }
};

  // Función de Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};