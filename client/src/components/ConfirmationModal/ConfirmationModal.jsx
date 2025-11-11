import React from "react";
import ModalBase from "../common/ModalBase/ModalBase"; // 👈 usamos la base
import styles from "./ConfirmationModal.module.css";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <ModalBase onClose={onCancel}>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <button onClick={onCancel} className={styles.cancelBtn}>
          Cancelar
        </button>
        <button onClick={onConfirm} className={styles.confirmBtn}>
          Eliminar
        </button>
      </div>
    </ModalBase>
  );
};

export default ConfirmationModal;
