import React from "react";
import styles from "./ConfirmationModal.module.css";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.cancelBtn}>
            Cancelar
          </button>
          <button onClick={onConfirm} className={styles.confirmBtn}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
