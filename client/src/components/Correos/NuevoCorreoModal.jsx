import React, { useState } from "react";
import ModalBase from "../common/ModalBase/ModalBase"; // 👈 importa la base
import styles from "./NuevoCorreoModal.module.css";

// Ejemplo de datos simulados (en tu proyecto vendrán de la BD)
const provincias = [
  { id: 1, nombre: "Buenos Aires" },
  { id: 2, nombre: "Córdoba" },
  { id: 3, nombre: "Santa Fe" },
];

const ciudades = [
  { id: 1, nombre: "Junín", provincia_id: 1 },
  { id: 2, nombre: "Pergamino", provincia_id: 1 },
  { id: 3, nombre: "Villa María", provincia_id: 2 },
  { id: 4, nombre: "Rosario", provincia_id: 3 },
];

const gruposOracion = [
  { id: 1, nombre_grupo: "Grupo Esperanza" },
  { id: 2, nombre_grupo: "Renacer" },
  { id: 3, nombre_grupo: "Camino de Fe" },
];

const contactos = [
  { id: 1, provincia_id: 1, ciudad_id: 1, grupo_id: 1, acepta_newsletter: true },
  { id: 2, provincia_id: 1, ciudad_id: 2, grupo_id: 2, acepta_newsletter: false },
  { id: 3, provincia_id: 2, ciudad_id: 3, grupo_id: 1, acepta_newsletter: true },
  { id: 4, provincia_id: 3, ciudad_id: 4, grupo_id: 3, acepta_newsletter: true },
];

const NuevoCorreoModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    asunto: "",
    contenido: "",
    provincia: "",
    ciudad: "",
    grupo: "",
    soloNewsletter: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Filtrar ciudades según provincia seleccionada
  const ciudadesFiltradas = formData.provincia
    ? ciudades.filter((c) => c.provincia_id === parseInt(formData.provincia))
    : ciudades;

  // Calcular destinatarios
  const destinatarios = contactos.filter((c) => {
    const matchProvincia =
      !formData.provincia || c.provincia_id === parseInt(formData.provincia);
    const matchCiudad =
      !formData.ciudad || c.ciudad_id === parseInt(formData.ciudad);
    const matchGrupo =
      !formData.grupo || c.grupo_id === parseInt(formData.grupo);
    const matchNewsletter =
      !formData.soloNewsletter || c.acepta_newsletter;
    return matchProvincia && matchCiudad && matchGrupo && matchNewsletter;
  }).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, destinatarios });
    onClose();
  };

  return (
    <ModalBase onClose={onClose}>
      <h2 className={styles.title}>Nuevo Correo Masivo</h2>
      <p className={styles.subtitle}>
        Crea un nuevo correo masivo con filtros de segmentación
      </p>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Asunto *</label>
          <input
            type="text"
            name="asunto"
            value={formData.asunto}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Mensaje *</label>
          <textarea
            name="contenido"
            value={formData.contenido}
            onChange={handleChange}
            required
            className={styles.textarea}
            rows={6}
          />
        </div>

        <div className={styles.formGroupCheckbox}>
          <label>
            <input
              type="checkbox"
              name="soloNewsletter"
              checked={formData.soloNewsletter}
              onChange={handleChange}
            />
            Solo contactos que aceptan newsletter
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Provincia</label>
          <select
            name="provincia"
            value={formData.provincia}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">Todas</option>
            {provincias.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Ciudad</label>
          <select
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">Todas</option>
            {ciudadesFiltradas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Grupo de Oración</label>
          <select
            name="grupo"
            value={formData.grupo}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">-- Seleccionar grupo --</option>
            {gruposOracion.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre_grupo}
              </option>
            ))}
          </select>
        </div>

        <p className={styles.destinatarios}>
          Destinatarios: {destinatarios} contactos
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelBtn}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.submitBtn}>
            Guardar Borrador
          </button>
        </div>
      </form>
    </ModalBase>
  );
};

export default NuevoCorreoModal;
