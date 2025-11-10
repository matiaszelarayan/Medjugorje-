import React, { useState } from "react";
import styles from "./NuevoCorreoModal.module.css";
import { X } from "lucide-react";

const NuevoCorreoModal = ({ onClose, onSave }) => {
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [provincia, setProvincia] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [grupo, setGrupo] = useState("");
  const [soloNewsletter, setSoloNewsletter] = useState(true);

  const handleGuardar = () => {
    const nuevoCorreo = {
      asunto,
      mensaje,
      filtros: { provincia, ciudad, grupo, soloNewsletter },
    };
    onSave(nuevoCorreo);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Nuevo Correo Masivo</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <label className={styles.label}>Asunto</label>
        <input
          type="text"
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
          className={styles.input}
        />

        <label className={styles.label}>Mensaje</label>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className={styles.textarea}
        />

        <div className={styles.filters}>
          <h4>Filtros de Segmentación</h4>

          <label className={styles.label}>Provincia</label>
          <input
            type="text"
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            className={styles.input}
          />

          <label className={styles.label}>Ciudad</label>
          <input
            type="text"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className={styles.input}
          />

          <label className={styles.label}>Grupo de Oración</label>
          <input
            type="text"
            value={grupo}
            onChange={(e) => setGrupo(e.target.value)}
            className={styles.input}
          />

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={soloNewsletter}
              onChange={() => setSoloNewsletter(!soloNewsletter)}
            />
            Solo contactos que aceptan newsletter
          </label>
        </div>

        <div className={styles.footer}>
          <button className={`actionButtonGlobal ${styles.saveButton}`} onClick={handleGuardar}>
            Guardar Borrador
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NuevoCorreoModal;
