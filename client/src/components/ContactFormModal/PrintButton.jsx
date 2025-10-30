import React from "react";
import styles from "./PrintButton.module.css";

const PrintButton = ({ data, title }) => {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const htmlContent = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 2rem;
            }
            h1 {
              text-align: center;
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 2rem;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 0.5rem;
              text-align: left;
              font-size: 0.9rem;
            }
            th {
              background-color: #f5f5f5;
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <table>
            <thead>
              <tr>
                <th>Apellido</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Provincia</th>
                <th>Ciudad</th>
                <th>Grupo</th>
                <th>Participa</th>
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (c) => `
                <tr>
                  <td>${c.apellido}</td>
                  <td>${c.nombre}</td>
                  <td>${c.email}</td>
                  <td>${c.provincia}</td>
                  <td>${c.ciudad}</td>
                  <td>${c.grupo_oracion || "—"}</td>
                  <td>${c.participa_grupo ? "Sí" : "No"}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <button onClick={handlePrint} className={styles.printBtn}>
      🖨️ Imprimir
    </button>
  );
};

export default PrintButton;
