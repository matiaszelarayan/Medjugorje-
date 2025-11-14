import React from "react";
import styles from "./Dashboard.module.css";
import { Users, Calendar, Mail, HeartHandshake } from "lucide-react";

const Card = ({ icon: Icon, title, value, color, onClick }) => {
  const borderColor = {
    blue: "#2a6fb0",
    green: "#2f7d4f",
    purple: "#6b4ca3",
    indigo: "#3f51b5",
  }[color];

  const bgColor = {
    blue: "#e0f0ff",
    green: "#dff5e1",
    purple: "#f0e8ff",
    indigo: "#e8ebff",
  }[color];

  const iconColor = borderColor;

  return (
    <div
      className={styles.card}
      style={{
        "--card-border-color": borderColor,
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
      title={onClick ? `Ir a ${title}` : undefined}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? "button" : "presentation"}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className={styles.cardText}>
        <p className={styles.cardTitle}>{title}</p>
        <p className={styles.cardValue}>{value}</p>
      </div>
      <div
        className={styles.cardIcon}
        style={{
          "--card-bg-color": bgColor,
          "--card-icon-color": iconColor,
        }}
      >
        {Icon && <Icon className="w-6 h-6" />}
      </div>
    </div>
  );
};

const initialContacts = [
  {
    id: 1,
    nombre: "María López",
    email: "maria@fm.org",
    tipo: "Fiel",
    phone: "555-1234",
  },
  {
    id: 2,
    nombre: "Juan Pérez",
    email: "juan@fm.org",
    tipo: "Colaborador",
    phone: "555-5678",
  },
  {
    id: 3,
    nombre: "Laura Gómez",
    email: "laura@fm.org",
    tipo: "Fiel",
    phone: "555-9012",
  },
];

const initialEventos = [
  {
    id: 1,
    titulo: "Viaje a Medjugorje",
    fechaInicio: "2026-05-02T08:00",
    publico: true,
  },
  {
    id: 2,
    titulo: "Reunión de Grupos",
    fechaInicio: "2025-11-22T19:00",
    publico: true,
  },
  {
    id: 3,
    titulo: "Jornada de Oración",
    fechaInicio: "2025-12-08T10:00",
    publico: false,
  },
];

const initialCorreos = [
  { id: 1, titulo: "Correo de prueba", estado: "Enviado" },
  { id: 2, titulo: "Newsletter Noviembre", estado: "Enviado" },
  { id: 3, titulo: "Invitación a Evento", estado: "Borrador" },
];

const initialGrupos = [
  { id: 1, nombre_grupo: "Grupo Esperanza" },
  { id: 2, nombre_grupo: "Renacer" },
  { id: 3, nombre_grupo: "Camino de Fe" },
];

const Dashboard = ({ user, setScreen }) => {
  const contactosTotal = initialContacts.length;
  const eventosProximos = initialEventos.filter(
    (ev) => new Date(ev.fechaInicio) > new Date()
  ).length;
  const correosEnviados = initialCorreos.filter(
    (c) => c.estado === "Enviado"
  ).length;
  const gruposTotal = initialGrupos.length;

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>Dashboard Principal</h1>
      <p className={styles.dashboardSubtitle}>
        Bienvenido, <strong>{user.nombre}</strong>. Empieza a gestionar la
        información de la Fundación.
      </p>

      <div className={styles.cardGrid}>
        <Card
          icon={Users}
          title="Contactos Totales"
          value={contactosTotal}
          color="blue"
          onClick={() => setScreen("contactos")}
        />
        <Card
          icon={Calendar}
          title="Próximos Eventos"
          value={eventosProximos}
          color="green"
          onClick={() => setScreen("agenda")}
        />
        <Card
          icon={Mail}
          title="Correos Enviados"
          value={correosEnviados}
          color="purple"
          onClick={() => setScreen("correos")}
        />
        <Card
          icon={HeartHandshake}
          title="Grupos de Oración"
          value={gruposTotal}
          color="indigo"
          onClick={() => setScreen("grupos-oracion")}
        />
      </div>

      <div className={styles.infoSection}>
        <h2 className={styles.sectionTitle}>Accesos Rápidos</h2>
        <p className={styles.sectionText}>
          Haz clic en cualquier tarjeta para acceder directamente a cada módulo.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
