import React, { useState } from "react";
import "./Navbar.css";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";

const Navbar = ({ user, onLogout }) => {
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    toast(`Hasta pronto, ${user.name}`);
    setShowModal(false);
    onLogout(); // Esto lo define App.jsx
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="FM Logo" />
        <span>Fundación Medjugorje - Plataforma</span>
      </div>

      <div className="navbar-user">
        <span>Hola, {user.name}</span>
        <span className="navbar-role">({user.role})</span>
        <button className="logout-button" onClick={() => setShowModal(true)}>
          Cerrar sesión
        </button>
      </div>

      {showModal && (
        <div className="logout-modal">
          <div className="modal-content">
            <p>¿Seguro que querés cerrar sesión?</p>
            <div className="modal-actions">
              <button onClick={handleLogout}>Sí, cerrar</button>
              <button onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
