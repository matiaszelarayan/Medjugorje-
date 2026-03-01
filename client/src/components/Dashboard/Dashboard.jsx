import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import { Users, Calendar, Mail, HeartHandshake } from "lucide-react";
import { getDashboard } from "../../api/dashboardService";
import logger from "../../utils/logger";

const Card = ({ icon: Icon, title, value, color, onClick }) => {
  const iconColor = {
    blue: "var(--dash-icon-blue-color)",
    green: "var(--dash-icon-green-color)",
    purple: "var(--dash-icon-purple-color)",
    indigo: "var(--dash-icon-indigo-color)",
  }[color];

  const bgColor = {
    blue: "var(--dash-icon-blue-bg)",
    green: "var(--dash-icon-green-bg)",
    purple: "var(--dash-icon-purple-bg)",
    indigo: "var(--dash-icon-indigo-bg)",
  }[color];

  return (
    <div
      className={styles.card}
      style={{ "--card-border-color": iconColor }}
      onClick={onClick}
      role={onClick ? "button" : "presentation"}
      tabIndex={onClick ? 0 : -1}
    >
      <div className={styles.cardText}>
        <p className={styles.cardTitle}>{title}</p>
        <p className={styles.cardValue}>{value ?? "—"}</p>
      </div>
      <div className={styles.cardIcon} style={{ "--card-bg-color": bgColor, "--card-icon-color": iconColor }}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
    </div>
  );
};

import PropTypes from "prop-types";

// ... (Card component remains unchanged, you can add propTypes to it too if you like)

const Dashboard = ({ user, setScreen }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res))
      .catch((err) => logger.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Cargando dashboard...</p>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>Dashboard Principal</h1>
      <p className={styles.dashboardSubtitle}>
        Bienvenido, <strong>{user.nombre}</strong>.
      </p>

      <div className={styles.cardGrid}>
        <Card
          icon={Users}
          title="Contactos Totales"
          value={data?.contactos_total}
          color="blue"
          onClick={() => setScreen("contactos")}
        />
        <Card
          icon={Calendar}
          title="Próximos Eventos"
          value={data?.eventos_proximos}
          color="green"
          onClick={() => setScreen("agenda")}
        />
        <Card
          icon={Mail}
          title="Correos Enviados"
          value={data?.correos_enviados}
          color="purple"
          onClick={() => setScreen("correos")}
        />
        <Card
          icon={HeartHandshake}
          title="Grupos de Oración"
          value={data?.grupos_total}
          color="indigo"
          onClick={() => setScreen("grupos-oracion")}
        />
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  user: PropTypes.shape({
    nombre: PropTypes.string,
  }).isRequired,
  setScreen: PropTypes.func.isRequired,
};

export default Dashboard;
