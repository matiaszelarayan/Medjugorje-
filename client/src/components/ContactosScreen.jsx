import React from "react";
import "./ContactosScreen.css";

const contactos = [
  { id: 1, name: "María López", email: "maria@fm.org", type: "Fiel", phone: "555-1234" },
  { id: 2, name: "Juan Pérez", email: "juan@fm.org", type: "Colaborador", phone: "555-5678" },
  { id: 3, name: "Laura Gómez", email: "laura@fm.org", type: "Fiel", phone: "555-9012" },
];

const ContactosScreen = () => {
  return (
    <div className="contactos-container">
      <h1 className="contactos-title">Contactos</h1>
      <p className="contactos-subtitle">Listado de personas vinculadas a la Fundación</p>

      <div className="contactos-list">
        {contactos.map(contacto => (
          <div key={contacto.id} className="contacto-card">
            <div className="contacto-nombre">{contacto.name}</div>
            <div className="contacto-email">📧 {contacto.email}</div>
            <div className="contacto-telefono">📞 {contacto.phone}</div>
            <div className="contacto-tipo">👤 Tipo: {contacto.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactosScreen;
