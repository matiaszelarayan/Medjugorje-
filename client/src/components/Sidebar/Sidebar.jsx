import React from "react";
import styles from "./Sidebar.module.css";
import { Home, Users, Calendar, HeartHandshake, UserCog, Mail, FileText } from "lucide-react";

const Sidebar = ({ active, setScreen, user }) => {
  // Solución defensiva contra user undefined/null:
  if (!user) return null; // o puedes usar: return <></>; o un loader si prefieres

  return (
    <aside className={`${styles.sidebar} sidebarGlobal`}>
      <div className={styles.sidebarTitle}>Menú Principal</div>

      <div
        className={`${styles.sidebarItem} ${
          active === "dashboard" ? styles.active : ""
        }`}
        onClick={() => setScreen("dashboard")}
        title="Ir al panel principal"
      >
        <Home size={20} className={styles.sidebarIcon} />
        <span>Dashboard</span>
      </div>

      <div
        className={`${styles.sidebarItem} ${
          active === "contactos" ? styles.active : ""
        }`}
        onClick={() => setScreen("contactos")}
        title="Gestionar personas vinculadas"
      >
        <Users size={20} className={styles.sidebarIcon} />
        <span>Contactos</span>
      </div>

      {user.role === "Admin" && (
        <div
          className={`${styles.sidebarItem} ${
            active === "grupos-oracion" ? styles.active : ""
          }`}
          onClick={() => setScreen("grupos-oracion")}
          title="Administrar grupos de oración"
        >
          <HeartHandshake size={20} className={styles.sidebarIcon} />
          <span>Grupos de Oración</span>
        </div>
      )}

      {(user.role === "Admin" || user.role === "Colaborador") && (
        <div
          className={`${styles.sidebarItem} ${
            active === "correos" ? styles.active : ""
          }`}
          onClick={() => setScreen("correos")}
          title="Correos masivos y newsletter"
        >
          <Mail size={20} className={styles.sidebarIcon} />
          <span>Correos</span>
        </div>
      )}

      {(user.role === "Admin" || user.role === "Colaborador") && (
        <div
          className={`${styles.sidebarItem} ${
            active === "formularios" ? styles.active : ""
          }`}
          onClick={() => setScreen("formularios")}
          title="Crear y administrar formularios"
        >
          <FileText size={20} className={styles.sidebarIcon} />
          <span>Formularios</span>
        </div>
      )}

      <div
        className={`${styles.sidebarItem} ${
          active === "agenda" ? styles.active : ""
        }`}
        onClick={() => setScreen("agenda")}
        title="Gestión de eventos y actividades"
      >
        <Calendar size={20} className={styles.sidebarIcon} />
        <span>Eventos</span>
      </div>

      {user.role === "Colaborador" && (
        <div
          className={`${styles.sidebarItem} ${
            active === "perfil" ? styles.active : ""
          }`}
          onClick={() => setScreen("perfil")}
          title="Ver o editar mi perfil"
        >
          <UserCog size={20} className={styles.sidebarIcon} />
          <span>Mi Perfil</span>
        </div>
      )}

      {user.role === "Admin" && (
        <div
          className={`${styles.sidebarItem} ${
            active === "admin-perfiles" ? styles.active : ""
          }`}
          onClick={() => setScreen("admin-perfiles")}
          title="Administrar perfiles de usuario"
        >
          <UserCog size={20} className={styles.sidebarIcon} />
          <span>Administrar Perfiles</span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
