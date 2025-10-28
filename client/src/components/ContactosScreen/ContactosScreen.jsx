import React from "react";
import styles from "./ContactosScreen.module.css";

const contactos = [
  { id: 1, name: "María López", email: "maria@fm.org", type: "Fiel", phone: "555-1234" },
  { id: 2, name: "Juan Pérez", email: "juan@fm.org", type: "Colaborador", phone: "555-5678" },
  { id: 3, name: "Laura Gómez", email: "laura@fm.org", type: "Fiel", phone: "555-9012" },
];

const ContactosScreen = () => {
  return (
    <div className={styles.contactosContainer}>
      <h1 className={styles.contactosTitle}>Contactos</h1>
      <p className={styles.contactosSubtitle}>
        Listado de personas vinculadas a la Fundación
      </p>

      <div className={styles.contactosList}>
        {contactos.map((contacto) => (
          <div key={contacto.id} className={styles.contactoCard}>
            <div className={styles.contactoNombre}>{contacto.name}</div>
            <div className={styles.contactoEmail}>📧 {contacto.email}</div>
            <div className={styles.contactoTelefono}>📞 {contacto.phone}</div>
            <div className={styles.contactoTipo}>👤 Tipo: {contacto.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactosScreen;
