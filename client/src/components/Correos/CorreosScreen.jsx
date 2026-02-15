import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./CorreosScreen.module.css";
import { Pencil, Send, Trash2 } from "lucide-react";
import NuevoCorreoModal from "./NuevoCorreoModal";
import EnvioCorreoModal from "./EnvioCorreoModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import {
  getCorreos,
  crearCorreo,
  editarCorreo,
  eliminarCorreo,
  enviarCorreo,
} from "../../api/correoService";
import { useErrorNotification } from "../../hooks/useErrorNotification";

import PropTypes from "prop-types";

// ... (existing code)

const CorreosScreen = ({ user }) => {
  const { notifyError } = useErrorNotification();

  const [correos, setCorreos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [correoEditando, setCorreoEditando] = useState(null);
  const [modalEnvioAbierto, setModalEnvioAbierto] = useState(false);
  const [correoSeleccionado, setCorreoSeleccionado] = useState(null);
  const [correoAEliminar, setCorreoAEliminar] = useState(null);

  useEffect(() => {
    getCorreos()
      .then((correos) => {
        setCorreos(correos);
      })
      .catch((error) => {
        console.error("Error al obtener los correos:", error);
        notifyError(error, "Error al obtener los correos");
      });
  }, []);


  const puedeEnviar = user.role === "administrador";
  const puedeEditar =
    user.role === "administrador" || user.role === "colaborador";

  // Ordenar por título
  const sortedCorreos = correos
    .slice()
    .sort((a, b) =>
      (a.titulo || "")
        .toLowerCase()
        .localeCompare((b.titulo || "").toLowerCase())
    );

  // Guardar correo editado o nuevo
  const handleGuardarCorreo = async (formData) => {
    console.log(formData);
    try {
      if (correoEditando) {
        const actualizado = await editarCorreo({
          ...formData,
          id: correoEditando.id,
        });
        setCorreos((prev) =>
          prev.map((c) => (c.id === actualizado.id ? actualizado : c))
        );
        toast.success("Correo actualizado correctamente");
      } else {
        const creado = await crearCorreo(formData);
        setCorreos((prev) => [creado, ...prev]);
        toast.success("Correo creado correctamente");
      }
    } catch (err) {
      console.error("Error guardando correo:", err);
      notifyError(err, "Error guardando correo");
    }

    setCorreoEditando(null);
    setModalAbierto(false);
  };
  const handleAbrirEnvio = (correo) => {
    setCorreoSeleccionado(correo);
    setModalEnvioAbierto(true);
  };

  const handleConfirmarEnvio = async () => {
    try {
      const data = await enviarCorreo(correoSeleccionado.id);

      setCorreos((prev) =>
        prev.map((c) =>
          c.id === correoSeleccionado.id
            ? {
              ...c,
              estado: data.estado,
              fecha_envio: data.fecha_envio,
            }
            : c
        )
      );
      toast.success("Correo enviado correctamente");
    } catch (error) {
      console.error("Error enviando correo:", error);
      notifyError(error, "Error enviando correo");
    }

    setModalEnvioAbierto(false);
    setCorreoSeleccionado(null);
  };


  // ---- ELIMINACIÓN ----
  const handleEliminarCorreo = (correo) => {
    setCorreoAEliminar(correo);
  };

  const confirmarEliminacion = async (id) => {
    try {
      await eliminarCorreo(id);
      setCorreos((prev) => prev.filter((c) => c.id !== id));
      toast.success("Correo eliminado correctamente");
    } catch (err) {
      console.error("Error eliminando correo:", err);
      notifyError(err, "Error eliminando correo");
    }

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
            onClick={() => {
              setCorreoEditando(null);
              setModalAbierto(true);
            }}
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
              <th>Fecha Creacion</th>
              <th>Fecha Envio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedCorreos.map((correo) => (
              <tr key={correo.id}>
                <td>{correo.titulo}</td>
                <td>{correo.estado}</td>
                <td>{correo.cantidad_destinatarios || 0} contactos</td>
                <td>{correo.fecha_creacion.slice(0, 10)}</td>
                <td>{correo.fecha_envio?.slice(0, 10) || "-"}</td>
                <td>
                  {puedeEditar && (
                    <button
                      className={styles.editBtn}
                      onClick={() => {
                        setCorreoEditando(correo);
                        setModalAbierto(true);
                      }}
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                  {puedeEnviar && correo.estado === "borrador" && (
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
            correo={correoEditando}
            onClose={() => {
              setModalAbierto(false);
              setCorreoEditando(null);
            }}
            onSave={handleGuardarCorreo}
          />
        )}
        {modalEnvioAbierto && correoSeleccionado && (
          <EnvioCorreoModal
            correo={correoSeleccionado}
            destinatarios={correoSeleccionado.cantidad_destinatarios}
            onClose={() => {
              setModalEnvioAbierto(false);
              setCorreoSeleccionado(null);
            }}
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

CorreosScreen.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string.isRequired,
  }).isRequired,
};

export default CorreosScreen;
