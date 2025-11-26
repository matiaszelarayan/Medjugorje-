import React, { useState } from "react";

function CopiarLinkFormulario() {

  const [copiado, setCopiado] = useState(false);

  const urlPublica = `${window.location.origin}/formulario-inscripcion.html`;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(urlPublica);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return <button style={{minWidth: "110px"}} onClick={copiar}>{copiado ? "Copiado!" : "Link Inscripción"}</button>;
}

export default CopiarLinkFormulario;
