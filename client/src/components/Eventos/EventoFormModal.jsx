import React, { useState, useEffect } from "react";
import ModalBase from "../common/ModalBase/ModalBase";
import styles from "./eventos.module.css";

const defaultForm = {
  titulo: "",
  fechaInicio: "",
  fechaFin: "",
  ubicacion: "",
  url: "",
  descripcion: "",
  publico: true,
};

const EventoFormModal = ({ evento, onClose, onSave }) => {
  const [form, setForm] = useState(defaultForm);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (evento) setForm({
      titulo: evento.titulo || "",
      fechaInicio: evento.fechaInicio || "",
      fechaFin: evento.fechaFin || "",
      ubicacion: evento.ubicacion || "",
      url: evento.url || "",
      descripcion: evento.descripcion || "",
      publico: !!evento.publico,
    });
  }, [evento]);

  // Validación simple: título y fecha inicio obligatorios, fecha fin >= inicio si ambas están
  const validar = () => {
    let err = {};
    if (!form.titulo.trim()) err.titulo = "El título es obligatorio";
    if (!form.fechaInicio) err.fechaInicio = "La fecha/hora de inicio es obligatoria";
    if (form.fechaFin && form.fechaInicio && new Date(form.fechaFin) < new Date(form.fechaInicio)) {
      err.fechaFin = "La fecha/hora de fin debe ser mayor o igual a la de inicio";
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
              name="fechaInicio"
              value={form.fechaInicio}
              onChange={handleChange}
              className={styles.input}
              required
            />
            {errores.fechaInicio && (
              <div className={styles.error}>{errores.fechaInicio}</div>
            )}
          </div>
          <div>
            <label className={styles.label}>Fecha/Hora Fin</label>
            <input
              type="datetime-local"
              name="fechaFin"
              value={form.fechaFin}
              onChange={handleChange}
              className={styles.input}
            />
            {errores.fechaFin && (
              <div className={styles.error}>{errores.fechaFin}</div>
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

export default EventoFormModal;
