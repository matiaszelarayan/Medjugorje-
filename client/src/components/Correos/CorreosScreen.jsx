import React, { useState } from "react";
import styles from "./CorreosScreen.module.css";
import { Plus, Pencil, Send, Trash2 } from "lucide-react";
import NuevoCorreoModal from "./NuevoCorreoModal";

const CorreosScreen = ({ user }) => {
  const [correos, setCorreos] = useState([
    {
      id: 1,
      titulo: "Correo de prueba",
      estado: "Borrador",
      destinatarios: 3,
      fecha: "5 nov 2025, 17:51",
    },
    {
      id: 2,
      titulo: "Viaje a Medjugorje",
      estado: "Enviado",
      destinatarios: 3,
      fecha: "5 nov 2025, 11:28",
    },
  ]);

  const [modalAbierto, setModalAbierto] = useState(false);

  const puedeEnviar = user.role === "Admin";
  const puedeEditar = user.role === "Admin" || user.role === "Colaborador";

  const handleGuardarCorreo = (nuevoCorreo) => {
    const nuevo = {
      id: correos.length + 1,
      titulo: nuevoCorreo.asunto,
      estado: "Borrador",
      destinatarios: 3,
      fecha: new Date().toLocaleString("es-AR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setCorreos([nuevo, ...correos]);
  };

  return (
    <div className={styles.correosContainer}>
      <h2 className={styles.correosTitle}>Correos Masivos</h2>
      <p className={styles.correosSubtitle}>Gestiona y envía correos masivos</p>

      <div className={styles.actionsBar}>
        <button
          className={styles.actionButtonGlobal}
          onClick={() => setModalAbierto(true)}
        >
          <Plus size={16} />
          <span>Nuevo Correo</span>
        </button>
      </div>

      <table className={styles.correosTable}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Estado</th>
            <th>Destinatarios</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {correos.map((correo) => (
            <tr key={correo.id}>
              <td>{correo.titulo}</td>
              <td>{correo.estado}</td>
              <td>{correo.destinatarios} contactos</td>
              <td>{correo.fecha}</td>
              <td>
                {puedeEditar && (
                  <button className={styles.editBtn}>
                    <Pencil size={16} />
                  </button>
                )}
                {puedeEnviar && correo.estado === "Borrador" && (
                  <button className={styles.sendBtn}>
                    <Send size={16} />
                  </button>
                )}
                <button className={styles.deleteBtn}>
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalAbierto && (
        <NuevoCorreoModal
          onClose={() => setModalAbierto(false)}
          onSave={handleGuardarCorreo}
        />
      )}
    </div>
  );
};

export default CorreosScreen;
