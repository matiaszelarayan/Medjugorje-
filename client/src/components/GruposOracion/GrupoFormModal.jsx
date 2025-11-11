import React, { useState, useEffect } from "react";
import ModalBase from "../common/ModalBase/ModalBase"; // 👈 usamos la base
import styles from "./GrupoFormModal.module.css";

const GrupoFormModal = ({ grupo, onClose, onSave }) => {
  const [form, setForm] = useState({
    nombre_grupo: "",
    localidad: "",
    responsable: "",
  });

  useEffect(() => {
    if (grupo) setForm(grupo);
  }, [grupo]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre_grupo || !form.localidad || !form.responsable) {
      alert("Todos los campos son obligatorios");
      return;
    }
    onSave({ ...form, id: grupo?.id || Date.now() });
    onClose();
  };

  return (
    <ModalBase onClose={onClose}>
      <h3 className={styles.title}>{grupo ? "Editar Grupo" : "Nuevo Grupo"}</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Nombre del Grupo</label>
        <input
          type="text"
          name="nombre_grupo"
          value={form.nombre_grupo}
          onChange={handleChange}
        />

        <label>Localidad</label>
        <input
          type="text"
          name="localidad"
          value={form.localidad}
          onChange={handleChange}
        />

        <label>Responsable</label>
        <input
          type="text"
          name="responsable"
          value={form.responsable}
          onChange={handleChange}
        />

        <div className={styles.actions}>
          <button type="submit" className={styles.saveBtn}>Guardar</button>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
        </div>
      </form>
    </ModalBase>
  );
};

export default GrupoFormModal;
