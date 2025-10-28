import React from "react";
import styles from "./Dashboard.module.css";
import { Users, Calendar, Mail, BookOpen } from "lucide-react";

const Card = ({ icon: Icon, title, value, color }) => {
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
    <div className={styles.card} style={{ "--card-border-color": borderColor }}>
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
  { id: 1, name: "María López", email: "maria@fm.org", type: "Fiel", phone: "555-1234" },
  { id: 2, name: "Juan Pérez", email: "juan@fm.org", type: "Colaborador", phone: "555-5678" },
  { id: 3, name: "Laura Gómez", email: "laura@fm.org", type: "Fiel", phone: "555-9012" },
];

const Dashboard = ({ user }) => (
  <div className={styles.dashboardContainer}>
    <h1 className={styles.dashboardTitle}>Dashboard Principal</h1>
    <p className={styles.dashboardSubtitle}>
      Bienvenido, <strong>{user.name}</strong>. Empieza a gestionar la información de la Fundación.
    </p>
    <div className={styles.cardGrid}>
      <Card icon={Users} title="Contactos Totales" value={initialContacts.length} color="blue" />
      <Card icon={Calendar} title="Próximos Eventos" value={3} color="green" />
      <Card icon={Mail} title="Campañas Enviadas" value={12} color="purple" />
      <Card icon={BookOpen} title="RF Implementadas" value="1/4" color="indigo" />
    </div>
  </div>
);

export default Dashboard;
