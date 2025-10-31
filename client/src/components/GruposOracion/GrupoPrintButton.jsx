import React from "react";

const GrupoPrintButton = ({ data, title, className }) => {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const html = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: sans-serif; padding: 2rem; }
            table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
            th, td { border: 1px solid #ccc; padding: 0.5rem; text-align: left; }
            h2 { color: #333; }
          </style>
        </head>
        <body>
          <h2>${title}</h2>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Localidad</th>
                <th>Responsable</th>
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (g) => `
                <tr>
                  <td>${g.nombre_grupo}</td>
                  <td>${g.localidad}</td>
                  <td>${g.responsable}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <button onClick={handlePrint} className={className}>
      🖨️ Imprimir listado
    </button>
  );
};

export default GrupoPrintButton;
