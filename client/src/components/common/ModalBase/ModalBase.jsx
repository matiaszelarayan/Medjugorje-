import React from "react";
import styles from "./ModalBase.module.css";

const ModalBase = ({ children, onClose }) => {
  const handleOverlayClick = () => {
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalBase;
