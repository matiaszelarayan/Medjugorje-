import React from "react";
import styles from "./Sidebar.module.css";
import { Home, Users, Calendar, Settings, UserCog } from "lucide-react";

const Sidebar = ({ active, setScreen, user }) => {
  return (
    <aside className={`${styles.sidebar} sidebarGlobal`}>
      <div className={styles.sidebarTitle}>Menú Principal</div>

      <div
        className={`${styles.sidebarItem} ${active === "dashboard" ? styles.active : ""}`}
        onClick={() => setScreen("dashboard")}
      >
        <Home size={20} className={styles.sidebarIcon} />
        <span>Dashboard</span>
      </div>

      <div
        className={`${styles.sidebarItem} ${active === "contactos" ? styles.active : ""}`}
        onClick={() => setScreen("contactos")}
      >
        <Users size={20} className={styles.sidebarIcon} />
        <span>Contactos</span>
      </div>

      <div
        className={`${styles.sidebarItem} ${active === "agenda" ? styles.active : ""}`}
        onClick={() => setScreen("agenda")}
      >
        <Calendar size={20} className={styles.sidebarIcon} />
        <span>Eventos</span>
      </div>

      {user.role === "Colaborador" && (
        <div
          className={`${styles.sidebarItem} ${active === "perfil" ? styles.active : ""}`}
          onClick={() => setScreen("perfil")}
        >
          <UserCog size={20} className={styles.sidebarIcon} />
          <span>Mi Perfil</span>
        </div>
      )}

      {user.role === "Admin" && (
        <div
          className={`${styles.sidebarItem} ${active === "admin-perfiles" ? styles.active : ""}`}
          onClick={() => setScreen("admin-perfiles")}
        >
          <UserCog size={20} className={styles.sidebarIcon} />
          <span>Administrar Perfiles</span>
        </div>
      )}

      <div
        className={`${styles.sidebarItem} ${active === "configuracion" ? styles.active : ""}`}
        onClick={() => setScreen("configuracion")}
      >
        <Settings size={20} className={styles.sidebarIcon} />
        <span>Configuración</span>
      </div>
    </aside>
  );
};

export default Sidebar;
