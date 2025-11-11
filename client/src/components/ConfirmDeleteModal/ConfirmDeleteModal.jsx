import React from "react";
import ModalBase from "../common/ModalBase/ModalBase";
import styles from "./ConfirmDeleteModal.module.css";

// Versión mejorada para mostrar títulos de correos, grupos, usuarios, etc.
const getDisplayName = (entity) => {
  if (entity.titulo) return entity.titulo; // correos
  if (entity.asunto) return entity.asunto; // fallback correo
  if (entity.nombre && entity.apellido)
    return `${entity.nombre} ${entity.apellido}`; // usuarios
  if (entity.nombre_grupo)
    return entity.nombre_grupo; // grupos
  if (entity.nombre)
    return entity.nombre;
  return "";
};

const ConfirmDeleteModal = ({ user, onConfirm, onCancel }) => {
  return (
    <ModalBase onClose={onCancel}>
      <h3 className={styles.title}>¿Está seguro de eliminar este registro?</h3>
      <p className={styles.message}>
        Estás a punto de eliminar{" "}
        <strong>{getDisplayName(user)}</strong>.
      </p>
      <p className={styles.warning}>Esta acción no se puede deshacer.</p>
      <div className={styles.actions}>
        <button
          className={styles.deleteBtn}
          onClick={() => onConfirm(user.id)}
        >
          Eliminar
        </button>
        <button onClick={onCancel} className={styles.cancelBtn}>
          Cancelar
        </button>
      </div>
    </ModalBase>
  );
};

export default ConfirmDeleteModal;
