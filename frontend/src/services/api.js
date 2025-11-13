import axios from 'axios';

// Instancia base de Axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL de tu backend
  headers: {
    'Content-Type': 'application/json',
},
});

// Interceptor: Se ejecuta antes de cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Adjunta el token al header 'x-auth-token' (como espera tu middleware)
    config.headers['x-auth-token'] = token; 
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;