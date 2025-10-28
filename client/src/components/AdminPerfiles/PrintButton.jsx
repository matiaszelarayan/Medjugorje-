import React from "react";
import styles from "./PrintButton.module.css";

const PrintButton = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button className={`${styles.printButton} printButtonGlobal`} onClick={handlePrint}>
      🖨️ Imprimir listado
    </button>
  );
};

export default PrintButton;
