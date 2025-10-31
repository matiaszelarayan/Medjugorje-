import React, { useState } from "react";
import styles from "./ContactFormModal.module.css";

const ContactFormModal = ({ contact, onClose, onSave, grupos }) => {
  const [formData, setFormData] = useState({
    nombre: contact?.nombre || "",
    apellido: contact?.apellido || "",
    email: contact?.email || "",
    sexo: contact?.sexo || "",
    pais: contact?.pais || "",
    provincia: contact?.provincia || "",
    ciudad: contact?.ciudad || "",
    celular: contact?.celular || "",
    instagram: contact?.instagram || "",
    parroquia: contact?.parroquia || "",
    participa_grupo: contact?.participa_grupo || false,
    fecha_nacimiento: contact?.fecha_nacimiento || "",
    grupo_oracion: contact?.grupo_oracion || "",
  });

  const isEdit = !!contact;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newContact = isEdit
      ? { ...formData, id: contact.id }
      : { ...formData, id: Date.now() };
    onSave(newContact);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>
          {isEdit ? "Editar Contacto" : "Crear Nuevo Contacto"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Campos obligatorios */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Sexo</label>
            <select
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Seleccionar</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>País</label>
            <input
              type="text"
              name="pais"
              value={formData.pais}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Provincia</label>
            <input
              type="text"
              name="provincia"
              value={formData.provincia}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ciudad / Localidad</label>
            <input
              type="text"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          {/* Campos opcionales */}
          <hr className={styles.separator} />

          <div className={styles.formGroup}>
            <label className={styles.label}>Celular</label>
            <input
              type="text"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Instagram</label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Parroquia</label>
            <input
              type="text"
              name="parroquia"
              value={formData.parroquia}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroupCheckbox}>
            <label className={styles.label}>
              ¿Participa en un grupo de oración?
            </label>
            <input
              type="checkbox"
              name="participa_grupo"
              checked={formData.participa_grupo}
              onChange={handleChange}
              className={styles.checkbox}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Fecha de Nacimiento</label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Grupo de Oración</label>
            <select
              name="grupo_oracion"
              value={formData.grupo_oracion || ""}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">-- Seleccionar grupo --</option>
              {grupos.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nombre_grupo}
                </option>
              ))}
            </select>
            <small className={styles.helpText}>
              Si el grupo aún no está disponible, dejá este campo vacío. El
              administrador lo cargará y podrás actualizarlo luego.
            </small>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.submitBtn}>
              {isEdit ? "Guardar Cambios" : "Crear Contacto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactFormModal;
