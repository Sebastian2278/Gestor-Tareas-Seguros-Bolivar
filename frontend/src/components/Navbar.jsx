import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
    const { logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <h1>Gestor de Tareas Personales</h1>
            <button className="btn-logout" onClick={logout}>
                Cerrar Sesión
            </button>
        </nav>
    );
}

export default Navbar;