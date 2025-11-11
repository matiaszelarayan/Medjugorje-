import React, { useState } from "react";
import styles from "./CorreosScreen.module.css";
import { Pencil, Send, Trash2 } from "lucide-react";
import NuevoCorreoModal from "./NuevoCorreoModal";
import EnvioCorreoModal from "./EnvioCorreoModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";

const CorreosScreen = ({ user }) => {
  const [correos, setCorreos] = useState([
    {
      id: 1,
      titulo: "Correo de prueba",
      estado: "Borrador",
      destinatarios: 3,
      fecha: "5 nov 2025, 17:51",
      asunto: "Correo de prueba",
      contenido: "Aquí va el cuerpo del correo",
      soloNewsletter: true,
    },
    {
      id: 2,
      titulo: "Viaje a Medjugorje",
      estado: "Enviado",
      destinatarios: 3,
      fecha: "5 nov 2025, 11:28",
      asunto: "Viaje a Medjugorje",
      contenido: "Detalles del viaje",
      soloNewsletter: false,
    },
  ]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEnvioAbierto, setModalEnvioAbierto] = useState(false);
  const [correoSeleccionado, setCorreoSeleccionado] = useState(null);
  const [correoAEliminar, setCorreoAEliminar] = useState(null);

  const puedeEnviar = user.role === "Admin";
  const puedeEditar = user.role === "Admin" || user.role === "Colaborador";

  const handleGuardarCorreo = (nuevoCorreo) => {
    const nuevo = {
      id: correos.length + 1,
      titulo: nuevoCorreo.asunto,
      estado: "Borrador",
      destinatarios: nuevoCorreo.destinatarios || 3,
      fecha: new Date().toLocaleString("es-AR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      asunto: nuevoCorreo.asunto,
      contenido: nuevoCorreo.contenido,
      soloNewsletter: nuevoCorreo.soloNewsletter,
    };
    setCorreos([nuevo, ...correos]);
  };

  const handleAbrirEnvio = (correo) => {
    setCorreoSeleccionado(correo);
    setModalEnvioAbierto(true);
  };

  const handleConfirmarEnvio = () => {
    setCorreos((prev) =>
      prev.map((c) =>
        c.id === correoSeleccionado.id ? { ...c, estado: "Enviado" } : c
      )
    );
    setModalEnvioAbierto(false);
  };

  // ---- ELIMINACIÓN ----
  const handleEliminarCorreo = (correo) => {
    setCorreoAEliminar(correo);
  };

  const confirmarEliminacion = (id) => {
    setCorreos((prev) => prev.filter((c) => c.id !== id));
    setCorreoAEliminar(null);
  };

  const cancelarEliminacion = () => setCorreoAEliminar(null);

  return (
    <div className={`${styles.screenWrapper} screenWrapperGlobal`}>
      <div className={styles.correosContainer}>
        <h2 className={styles.correosTitle}>Correos Masivos</h2>
        <p className={styles.correosSubtitle}>
          Gestiona y envía correos masivos
        </p>

        <div className={styles.actionsBar}>
          <button
            onClick={() => setModalAbierto(true)}
            className="actionButtonGlobal"
          >
            ➕ Nuevo Correo
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
                    <button
                      className={styles.sendBtn}
                      onClick={() => handleAbrirEnvio(correo)}
                    >
                      <Send size={16} />
                    </button>
                  )}
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleEliminarCorreo(correo)}
                  >
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

        {modalEnvioAbierto && correoSeleccionado && (
          <EnvioCorreoModal
            correo={correoSeleccionado}
            destinatarios={correoSeleccionado.destinatarios}
            onClose={() => setModalEnvioAbierto(false)}
            onSend={handleConfirmarEnvio}
          />
        )}

        {correoAEliminar && (
          <ConfirmDeleteModal
            user={correoAEliminar}
            onConfirm={confirmarEliminacion}
            onCancel={cancelarEliminacion}
          />
        )}
      </div>
    </div>
  );
};

export default CorreosScreen;
