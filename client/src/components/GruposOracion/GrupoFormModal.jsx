import React, { useState, useEffect } from "react";
import ModalBase from "../common/ModalBase/ModalBase";
import styles from "./GrupoFormModal.module.css";
import { useGeoArgentina } from "../../hooks/useGeoArgentina";

const GrupoFormModal = ({ grupo, onClose, onSave, users }) => {
  const [form, setForm] = useState({
    nombre_grupo: "",
    provincia: "",
    localidad: "",
    responsable: "",
  });

  // Integrar hook provincias/localidades
  const {
    provincias,
    localidades,
    loadingProv,
    loadingLoc,
    errorProv,
    errorLoc,
  } = useGeoArgentina(form.provincia);

  useEffect(() => {
    if (grupo) setForm(grupo);
  }, [grupo]);

 const handleChange = (e) => {
   const { name, value } = e.target;

   if (name === "provincia") {
     setForm({ ...form, provincia: value, localidad: "" });
   } else if (name === "responsable") {
     setForm({ ...form, responsable: Number(value) });
   } else {
     setForm({ ...form, [name]: value });
   }
 };


  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación básica
    if (!form.nombre_grupo || !form.provincia || !form.localidad || !form.responsable) {
      alert("Todos los campos son obligatorios");
      return;
    }
    onSave(form);
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

        <label>Provincia</label>
        {loadingProv ? (
          <select className={styles.select} disabled>
            <option>Cargando provincias...</option>
          </select>
        ) : errorProv ? (
          <select className={styles.select} disabled>
            <option>{errorProv}</option>
          </select>
        ) : (
          <select
            name="provincia"
            value={form.provincia}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="">Seleccione provincia...</option>
            {provincias.map((p) => (
              <option key={p.id} value={p.nombre}>
                {p.nombre}
              </option>
            ))}
          </select>
        )}

        <label>Localidad</label>
        {form.provincia && loadingLoc ? (
          <select className={styles.select} disabled>
            <option>Cargando localidades...</option>
          </select>
        ) : errorLoc ? (
          <select className={styles.select} disabled>
            <option>{errorLoc}</option>
          </select>
        ) : (
          <select
            name="localidad"
            value={form.localidad}
            onChange={handleChange}
            required
            className={styles.select}
            disabled={!form.provincia}
          >
            <option value="">Seleccione localidad...</option>
            {localidades.map((l) => (
              <option key={l.id} value={l.nombre}>
                {l.nombre}
              </option>
            ))}
          </select>
        )}

        <label>Responsable</label>
        <select
          name="responsable"
          value={form.responsable}
          onChange={handleChange}
          required
          className={styles.select}
        >
          <option value="">Seleccione responsable...</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nombre}
            </option>
          ))}
        </select>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveBtn}>
            Guardar
          </button>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Cancelar
          </button>
        </div>
      </form>
    </ModalBase>
  );
};

export default GrupoFormModal;
