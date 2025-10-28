import React from "react";
import "./Sidebar.css";
import { Home, Users, Calendar, Settings, UserCog } from "lucide-react";

const Sidebar = ({ active, setScreen, user }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Menú Principal</div>

      <div
        className={`sidebar-item ${active === "dashboard" ? "active" : ""}`}
        onClick={() => setScreen("dashboard")}
      >
        <Home size={20} className="sidebar-icon" />
        <span>Dashboard</span>
      </div>

      <div
        className={`sidebar-item ${active === "contactos" ? "active" : ""}`}
        onClick={() => setScreen("contactos")}
      >
        <Users size={20} className="sidebar-icon" />
        <span>Contactos</span>
      </div>

      <div
        className={`sidebar-item ${active === "agenda" ? "active" : ""}`}
        onClick={() => setScreen("agenda")}
      >
        <Calendar size={20} className="sidebar-icon" />
        <span>Eventos</span>
      </div>

      {user.role === "Colaborador" && (
        <div
          className={`sidebar-item ${active === "perfil" ? "active" : ""}`}
          onClick={() => setScreen("perfil")}
        >
          <UserCog size={20} className="sidebar-icon" />
          <span>Mi Perfil</span>
        </div>
      )}

      {user.role === "Admin" && (
        <div
          className={`sidebar-item ${active === "admin-perfiles" ? "active" : ""}`}
          onClick={() => setScreen("admin-perfiles")}
        >
          <UserCog size={20} className="sidebar-icon" />
          <span>Administrar Perfiles</span>
        </div>
      )}

      <div
        className={`sidebar-item ${active === "configuracion" ? "active" : ""}`}
        onClick={() => setScreen("configuracion")}
      >
        <Settings size={20} className="sidebar-icon" />
        <span>Configuración</span>
      </div>
    </aside>
  );
};

export default Sidebar;
