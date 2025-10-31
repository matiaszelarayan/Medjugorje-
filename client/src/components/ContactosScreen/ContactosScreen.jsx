import React, { useState } from "react";
import styles from "./ContactosScreen.module.css";
import ContactFormModal from "../ContactFormModal/ContactFormModal";
import PrintButton from "../ContactFormModal/PrintButton";

const initialContacts = [
  {
    id: 1,
    nombre: "María",
    apellido: "López",
    email: "maria@fm.org",
    sexo: "Femenino",
    pais: "Argentina",
    provincia: "Buenos Aires",
    ciudad: "Junín",
    celular: "555-1234",
    instagram: "@maria",
    parroquia: "San José",
    participa_grupo: true,
    fecha_nacimiento: "1990-05-12",
    grupo_oracion: "Grupo Esperanza",
  },
  {
    id: 2,
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan@fm.org",
    sexo: "Masculino",
    pais: "Argentina",
    provincia: "Buenos Aires",
    ciudad: "Pergamino",
    celular: "555-5678",
    instagram: "@juanp",
    parroquia: "Santa María",
    participa_grupo: false,
    fecha_nacimiento: "1985-11-03",
    grupo_oracion: "",
  },
  {
    id: 3,
    nombre: "Laura",
    apellido: "Gómez",
    email: "laura@fm.org",
    sexo: "Femenino",
    pais: "Argentina",
    provincia: "Córdoba",
    ciudad: "Villa María",
    celular: "555-9012",
    instagram: "@laura.g",
    parroquia: "Nuestra Señora",
    participa_grupo: true,
    fecha_nacimiento: "1992-08-20",
    grupo_oracion: "Renacer",
  },
  {
    id: 4,
    nombre: "Carlos",
    apellido: "Ruiz",
    email: "carlos@fm.org",
    sexo: "Masculino",
    pais: "Argentina",
    provincia: "Santa Fe",
    ciudad: "Rosario",
    celular: "555-3456",
    instagram: "@carlosruiz",
    parroquia: "San Pablo",
    participa_grupo: false,
    fecha_nacimiento: "1988-03-15",
    grupo_oracion: "",
  },
  {
    id: 5,
    nombre: "Ana",
    apellido: "Torres",
    email: "ana@fm.org",
    sexo: "Femenino",
    pais: "Argentina",
    provincia: "Mendoza",
    ciudad: "San Rafael",
    celular: "555-7890",
    instagram: "@ana.t",
    parroquia: "Santa Clara",
    participa_grupo: true,
    fecha_nacimiento: "1995-12-01",
    grupo_oracion: "Luz y Vida",
  },
  {
    id: 6,
    nombre: "Luis",
    apellido: "Fernández",
    email: "luis@fm.org",
    sexo: "Masculino",
    pais: "Argentina",
    provincia: "Salta",
    ciudad: "Cafayate",
    celular: "555-2345",
    instagram: "@luisf",
    parroquia: "San Miguel",
    participa_grupo: false,
    fecha_nacimiento: "1983-07-09",
    grupo_oracion: "",
  },
  {
    id: 7,
    nombre: "Sofía",
    apellido: "Martínez",
    email: "sofia@fm.org",
    sexo: "Femenino",
    pais: "Argentina",
    provincia: "Tucumán",
    ciudad: "Yerba Buena",
    celular: "555-6789",
    instagram: "@sofia.m",
    parroquia: "San Juan Bautista",
    participa_grupo: true,
    fecha_nacimiento: "1998-04-25",
    grupo_oracion: "Camino de Fe",
  },
];

const grupos = [
  { id: 1, nombre_grupo: "Grupo Esperanza" },
  { id: 2, nombre_grupo: "Renacer" },
  { id: 3, nombre_grupo: "Camino de Fe" },
];

const ContactosScreen = ({ user }) => {
  const [contacts, setContacts] = useState(initialContacts);
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [viewMode, setViewMode] = useState("tabla");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    provincia: "",
    texto: "",
  });

  const filteredContacts = contacts.filter((c) => {
    return (
      (!filters.provincia || c.provincia === filters.provincia) &&
      (!filters.texto ||
        `${c.nombre} ${c.apellido} ${c.email}`
          .toLowerCase()
          .includes(filters.texto.toLowerCase()))
    );
  });

  const contactsPerPage = 5;
  const indexOfLast = currentPage * contactsPerPage;
  const indexOfFirst = indexOfLast - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  const handleSave = (newContact) => {
    setContacts((prev) => {
      const exists = prev.find((c) => c.id === newContact.id);
      return exists
        ? prev.map((c) => (c.id === newContact.id ? newContact : c))
        : [...prev, newContact];
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este contacto?")) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const openNewContact = () => {
    setSelectedContact(null);
    setShowModal(true);
  };

  const openEditContact = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  return (
    <div className={`${styles.screenWrapper} screenWrapperGlobal`}>
      <div className={styles.contactosContainer}>
        <h1 className={styles.contactosTitle}>Contactos</h1>
        <p className={styles.contactosSubtitle}>
          Gestión de personas vinculadas a la Fundación
        </p>

        <div className={styles.filtersBar}>
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o email"
            value={filters.texto}
            onChange={(e) => setFilters({ ...filters, texto: e.target.value })}
            className={styles.filterInput}
          />
          <select
            value={filters.provincia}
            onChange={(e) =>
              setFilters({ ...filters, provincia: e.target.value })
            }
            className={styles.filterSelect}
          >
            <option value="">Todas las provincias</option>
            <option value="Buenos Aires">Buenos Aires</option>
            <option value="Córdoba">Córdoba</option>
            <option value="Santa Fe">Santa Fe</option>
            <option value="Mendoza">Mendoza</option>
            <option value="Salta">Salta</option>
            <option value="Tucumán">Tucumán</option>
          </select>
          <PrintButton data={filteredContacts} title="Listado de Contactos" />
        </div>

        <div className={styles.actionsBar}>
          <button onClick={openNewContact} className="actionButtonGlobal">
            ➕ Nuevo Contacto
          </button>
          <button
            onClick={() =>
              setViewMode(viewMode === "tabla" ? "tarjetas" : "tabla")
            }
            className={styles.toggleButton}
          >
            Cambiar a vista {viewMode === "tabla" ? "tarjetas" : "tabla"}
          </button>
        </div>

        {viewMode === "tabla" ? (
          <table className={styles.contactTable}>
            <thead>
              <tr>
                <th>Apellido</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Provincia</th>
                <th>Ciudad</th>
                <th>Grupo</th>
                <th>Participa</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentContacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.apellido}</td>
                  <td>{contact.nombre}</td>
                  <td>{contact.email}</td>
                  <td>{contact.provincia}</td>
                  <td>{contact.ciudad}</td>
                  <td>{contact.grupo_oracion || "—"}</td>
                  <td>{contact.participa_grupo ? "✅" : "❌"}</td>
                  <td>
                    <button
                      onClick={() => openEditContact(contact)}
                      className={styles.editBtn}
                    >
                      ✏️
                    </button>
                    {user.role === "Admin" && (
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className={styles.deleteBtn}
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.contactosList}>
            {currentContacts.map((contact) => (
              <div key={contact.id} className={styles.contactoCard}>
                <div className={styles.contactoNombre}>
                  {contact.apellido}, {contact.nombre}
                </div>
                <div className={styles.contactoEmail}>📧 {contact.email}</div>
                <div className={styles.contactoProvincia}>
                  📍 {contact.provincia}, {contact.ciudad}
                </div>
                <div className={styles.contactoGrupo}>
                  🙏 {contact.grupo_oracion || "Sin grupo"}
                </div>
                <div className={styles.contactoParticipa}>
                  {contact.participa_grupo ? "✅ Participa" : "❌ No participa"}
                </div>
                <div className={styles.cardActions}>
                  <button
                    onClick={() => openEditContact(contact)}
                    className={styles.editBtn}
                  >
                    ✏️
                  </button>
                  {user.role === "Admin" && (
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className={styles.deleteBtn}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={
                currentPage === i + 1 ? styles.pageActive : styles.pageBtn
              }
            >
              {i + 1}
            </button>
          ))}
        </div>

        {showModal && (
          <ContactFormModal
            contact={selectedContact}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
            grupos={grupos}
          />
        )}
      </div>
    </div>
  );
};

export default ContactosScreen;
