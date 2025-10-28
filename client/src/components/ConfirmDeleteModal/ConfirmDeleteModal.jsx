import React from "react";
import styles from "./ConfirmDeleteModal.module.css";

const ConfirmDeleteModal = ({ user, onConfirm, onCancel }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h3>¿Eliminar usuario?</h3>
        <p>
          Estás a punto de eliminar a{" "}
          <strong>{user.nombre} {user.apellido}</strong>.
        </p>
        <p>Esta acción no se puede deshacer.</p>

        <div className={styles.modalActions}>
          <button className={styles.deleteButton} onClick={() => onConfirm(user.id)}>
            Eliminar
          </button>
          <button onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
