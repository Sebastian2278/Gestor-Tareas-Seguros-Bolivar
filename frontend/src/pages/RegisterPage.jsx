import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);
  const [error, setError] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.preventDefault();
    setError(''); 
    try {
        await register(email, password);
        // Si el registro es exitoso, te redirige
    } catch (err) {
        const msg = err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || 'Error de registro desconocido.';
        setError(msg); 
    }
 
  };

  return (
    <div className="auth-container">
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn-primary">
          Registrar
        </button>
      </form>
      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
      </p>
    </div>
  );
}

export default RegisterPage;