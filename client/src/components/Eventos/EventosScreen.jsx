import React, { useState, useEffect } from "react";
import styles from "./eventos.module.css";
import EventoFormModal from "./EventoFormModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import { Pencil, Trash2 } from "lucide-react";
import {
  getEventos,
  crearEvento,
  editarEvento,
  eliminarEvento,
} from "../../api/eventosService";
import logger from "../../utils/logger";



const EventosScreen = ({ user }) => {
  const [eventos, setEventos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [eventoAEliminar, setEventoAEliminar] = useState(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await getEventos();
        setEventos(data);
      } catch (error) {
        logger.error("Error al obtener los eventos:", error);
      }
    };
    fetchEventos();
  }, []);

  // Orden por fecha de inicio
  const sortedEventos = eventos.slice().sort((a, b) =>
    (a.fecha_inicio || "").localeCompare(b.fecha_inicio || "")
  );

  // Crear o editar
  const handleSave = async (evento) => {
    logger.log("Guardando evento:", evento);
    try {
      let data;

      if (eventoEditando) {
        data = await editarEvento({
          ...evento,
          id: eventoEditando.id,
        });

        setEventos((prev) => prev.map((ev) => (ev.id === data.id ? data : ev)));
      } else {
        data = await crearEvento(evento);
        logger.log("Evento creado:", data);
        setEventos((prev) => [...prev, data]);
      }

      setShowModal(false);
      setEventoEditando(null);
    } catch (error) {
      logger.error("Error guardando evento", error);
    }
  };

  // Borrar evento
  const handleDelete = async () => {
    try {
      await eliminarEvento(eventoAEliminar.id);
      setEventos((prev) => prev.filter((ev) => ev.id !== eventoAEliminar.id));
      setEventoAEliminar(null);
    } catch (err) {
      logger.error("Error eliminando evento", err);
    }
  };
  const handleEdit = (evento) => {
    setEventoEditando(evento);
    setShowModal(true);
  };
  const handleNuevo = () => {
    setEventoEditando(null);
    setShowModal(true);
  };

  const esAdmin = user.role === "administrador";

  return (
    <div className={styles.screenWrapper}>
      <h1 className={styles.title}>Eventos</h1>
      <p className={styles.subtitle}>Gestiona los eventos y actividades</p>
      <div className={styles.actionsBar}>
        <button onClick={handleNuevo} className={styles.nuevoBtn}>
          + Nuevo Evento
        </button>
      </div>
      <table className={styles.eventosTable}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Fecha Inicio</th>
            <th>Ubicación</th>
            <th>Público</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedEventos.map((ev) => (
            <tr key={ev.id}>
              <td>{ev.titulo}</td>
              <td>
                {ev.fecha_inicio
                  ? new Date(ev.fecha_inicio).toLocaleString("es-AR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  : ""}
              </td>
              <td>{ev.ubicacion}</td>
              <td>{ev.publico ? "Sí" : "No"}</td>
              <td>
                <button
                  onClick={() => handleEdit(ev)}
                  className={styles.editBtn}
                  title="Editar"
                >
                  <Pencil size={16} />
                </button>
                {esAdmin && (
                  <button
                    onClick={() => setEventoAEliminar(ev)}
                    className={styles.deleteBtn}
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <EventoFormModal
          evento={eventoEditando}
          onClose={() => { setShowModal(false); setEventoEditando(null); }}
          onSave={handleSave}
        />
      )}
      {eventoAEliminar && (
        <ConfirmDeleteModal
          user={eventoAEliminar}
          onConfirm={() => handleDelete(eventoAEliminar.id)}
          onCancel={() => setEventoAEliminar(null)}
        />
      )}
    </div>
  );
};

export default EventosScreen;
