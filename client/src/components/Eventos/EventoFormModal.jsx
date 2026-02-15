import React, { useState, useEffect } from "react";
import ModalBase from "../common/ModalBase/ModalBase";
import styles from "./Eventos.module.css";

const defaultForm = {
  titulo: "",
  fecha_inicio: "",
  fecha_fin: "",
  ubicacion: "",
  url: "",
  descripcion: "",
  publico: true,
};


import PropTypes from "prop-types";

const EventoFormModal = ({ evento, onClose, onSave }) => {
  const [form, setForm] = useState(defaultForm);
  const [errores, setErrores] = useState({});

  // Función auxiliar para formatear fecha para input datetime-local (YYYY-MM-DDTHH:MM)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Ajustar a hora local
    const pad = (num) => num.toString().padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (evento) {
      setForm({
        titulo: evento.titulo ?? "",
        fecha_inicio: formatDateForInput(evento.fecha_inicio),
        fecha_fin: formatDateForInput(evento.fecha_fin),
        ubicacion: evento.ubicacion ?? "",
        url: evento.url ?? "",
        descripcion: evento.descripcion ?? "",
        publico: evento.publico ?? true,
      });
    } else {
      setForm(defaultForm);
    }
  }, [evento]);

  // Validación simple: título y fecha inicio obligatorios, fecha fin >= inicio si ambas están
  const validar = () => {
    let err = {};
    if (!form.titulo.trim()) err.titulo = "El título es obligatorio";
    if (!form.fecha_inicio) err.fecha_inicio = "La fecha/hora de inicio es obligatoria";
    if (form.fecha_fin && form.fecha_inicio && new Date(form.fecha_fin) < new Date(form.fecha_inicio)) {
      err.fecha_fin = "La fecha/hora de fin debe ser mayor o igual a la de inicio";
    }
    return err;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validar();
    setErrores(err);
    if (Object.keys(err).length === 0) {
      onSave(form);
    }
  };

  return (
    <ModalBase onClose={onClose}>
      <h2 className={styles.title}>{evento ? "Editar Evento" : "Nuevo Evento"}</h2>
      <p className={styles.subtitle}>
        Completa la información del {evento ? "evento" : "nuevo evento"}
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>Título *</label>
        <input
          type="text"
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          className={styles.input}
          required
        />
        {errores.titulo && (
          <div className={styles.error}>{errores.titulo}</div>
        )}

        <div className={styles.fechaRow}>
          <div>
            <label className={styles.label}>Fecha/Hora Inicio *</label>
            <input
              type="datetime-local"
              name="fecha_inicio"
              value={form.fecha_inicio}
              onChange={handleChange}
              className={styles.input}
              required
            />
            {errores.fecha_inicio && (
              <div className={styles.error}>{errores.fecha_inicio}</div>
            )}
          </div>
          <div>
            <label className={styles.label}>Fecha/Hora Fin</label>
            <input
              type="datetime-local"
              name="fecha_fin"
              value={form.fecha_fin}
              onChange={handleChange}
              className={styles.input}
              required
            />
            {errores.fecha_fin && (
              <div className={styles.error}>{errores.fecha_fin}</div>
            )}
          </div>
        </div>

        <label className={styles.label}>Ubicación</label>
        <input
          type="text"
          name="ubicacion"
          value={form.ubicacion}
          onChange={handleChange}
          placeholder="Ej: Parroquia San Juan"
          className={styles.input}
          required
        />

        <label className={styles.label}>Enlace (URL)</label>
        <input
          type="url"
          name="url"
          value={form.url}
          onChange={handleChange}
          placeholder="https://ejemplo.com/reunion"
          className={styles.input}
        />

        <label className={styles.label}>Descripción</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          rows={3}
          className={styles.textarea}
        />

        <div className={styles.formGroupCheckbox}>
          <input
            type="checkbox"
            name="publico"
            checked={form.publico}
            onChange={handleChange}
          />
          <label>Evento público</label>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelBtn}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
          >
            Guardar
          </button>
        </div>
      </form>
    </ModalBase>
  );
};

EventoFormModal.propTypes = {
  evento: PropTypes.shape({
    titulo: PropTypes.string,
    fecha_inicio: PropTypes.string,
    fecha_fin: PropTypes.string,
    ubicacion: PropTypes.string,
    url: PropTypes.string,
    descripcion: PropTypes.string,
    publico: PropTypes.bool,
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EventoFormModal;
