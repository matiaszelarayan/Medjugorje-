import React, { useState } from "react";
import styles from "./eventos.module.css";
import EventoFormModal from "./EventoFormModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import { Pencil, Trash2 } from "lucide-react";

// Datos simulados
const initialEventos = [
  {
    id: 1,
    titulo: "Viaje a Medjugorje",
    fechaInicio: "2026-05-02T08:00",
    fechaFin: "2026-05-09T22:00",
    ubicacion: "Medjugorje - Bosnia y Herzegovina",
    url: "",
    descripcion: "Peregrinación anual",
    publico: true
  }
];

const EventosScreen = ({ user }) => {
  const [eventos, setEventos] = useState(initialEventos);
  const [showModal, setShowModal] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [eventoAEliminar, setEventoAEliminar] = useState(null);

  // Orden por fecha de inicio
  const sortedEventos = eventos.slice().sort((a, b) =>
    (a.fechaInicio || "").localeCompare(b.fechaInicio || "")
  );

  // Crear o editar
  const handleSave = (evento) => {
    if (eventoEditando) {
      setEventos(prev =>
        prev.map(ev =>
          ev.id === eventoEditando.id ? { ...ev, ...evento, id: eventoEditando.id } : ev
        )
      );
    } else {
      const nuevo = {
        ...evento,
        id: eventos.length ? Math.max(...eventos.map(ev => ev.id)) + 1 : 1,
      };
      setEventos([...eventos, nuevo]);
    }
    setShowModal(false);
    setEventoEditando(null);
  };

  // Borrar evento
  const handleDelete = (id) => {
    setEventos(prev => prev.filter(ev => ev.id !== id));
    setEventoAEliminar(null);
  };
  const handleEdit = (evento) => {
    setEventoEditando(evento);
    setShowModal(true);
  };
  const handleNuevo = () => {
    setEventoEditando(null);
    setShowModal(true);
  };

  const esAdmin = user.role === "Admin";

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
                {ev.fechaInicio
                  ? new Date(ev.fechaInicio).toLocaleString("es-AR", {
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
