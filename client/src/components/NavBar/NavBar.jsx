import React, { useState } from "react";
import styles from "./NavBar.module.css";
import logo from "../../assets/logo.png";
import { toast } from "react-toastify";

import PropTypes from "prop-types";

const NavBar = ({ user, onLogout, darkMode, toggleDarkMode }) => {
  const [showModal, setShowModal] = useState(false);
  // Solución: Retornar navbar vacío si no hay user
  if (!user) return null;

  const handleLogout = () => {
    toast(`Hasta pronto, ${user.nombre}`);
    setShowModal(false);
    onLogout();
  };

  return (
    <nav className={`${styles.navbar} navbarGlobal`}>
      <div className={styles.navbarLogo}>
        <img src={logo} alt="FM Logo" />
        <span>Asociación Centro Medjugorje Argentina - Plataforma</span>
      </div>

      <div className={styles.navbarUser}>
        {user.foto_perfil && (
          <img
            src={user.foto_perfil}
            alt="Foto de perfil"
            className={styles.navbarAvatar}
          />
        )}
        <span>
          Hola, {user.nombre} {user.apellido}
        </span>
        <span className={styles.navbarRole}>({user.role})</span>
        <button className={styles.logoutButton} onClick={() => setShowModal(true)}>
          Cerrar sesión
        </button>
        <button className={styles.toggleDark} onClick={toggleDarkMode}>
          {darkMode ? "Modo claro" : "Modo oscuro"}
        </button>
      </div>

      {showModal && (
        <div className={styles.logoutModal}>
          <div className={styles.modalContent}>
            <p>¿Seguro que querés cerrar sesión?</p>
            <div className={styles.modalActions}>
              <button onClick={handleLogout}>Sí, cerrar</button>
              <button onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

NavBar.propTypes = {
  user: PropTypes.shape({
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    role: PropTypes.string,
    foto_perfil: PropTypes.string,
  }),
  onLogout: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default NavBar;
