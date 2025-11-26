import React, { useState, useEffect } from "react";
import styles from "./ContactosScreen.module.css";
import ContactFormModal from "../ContactFormModal/ContactFormModal";
import PrintButton from "../ContactFormModal/PrintButton";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import { Pencil, Trash2 } from "lucide-react";
import {
  getContactos,
  crearContacto,
  editarContacto,
  eliminarContacto,
} from "../../api/contactoService";
import  CopiarLinkFormulario from "./CopiarLinkFormulario";

import { getGrupos } from "../../api/grupoOracionService";




const ContactosScreen = ({ user }) => {
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [viewMode, setViewMode] = useState("tabla");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    provincia: "",
    texto: "",
  });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const data = await getGrupos();
        setGrupos(data);
      } catch (error) {
        console.error("Error al obtener los grupos:", error);
      }
    };
    fetchGrupos();
  }, []);

  useEffect(() => {
      const fetchContactos = async () => {
        try {
          const data = await getContactos();
          setContacts(data);
        } catch (error) {
          console.error("Error al obtener los contactos:", error);
        }
      };
    fetchContactos();
  }, []);

  // 1. Filtrar
  const filteredContacts = contacts.filter((c) => {
    return (
      (!filters.provincia || c.provincia === filters.provincia) &&
      (!filters.texto ||
        `${c.nombre} ${c.apellido} ${c.email}`.toLowerCase().includes(filters.texto.toLowerCase()))
    );
  });

  // 2. Ordenar filtrados: Apellido, luego Nombre
  const sortedFilteredContacts = filteredContacts.slice().sort((a, b) => {
    const ap1 = (a.apellido || "").toLowerCase();
    const ap2 = (b.apellido || "").toLowerCase();
    if (ap1 < ap2) return -1;
    if (ap1 > ap2) return 1;
    return (a.nombre || "").toLowerCase().localeCompare((b.nombre || "").toLowerCase());
  });

  // 3. Paginación sobre la lista ordenada
  const contactsPerPage = 5;
  const indexOfLast = currentPage * contactsPerPage;
  const indexOfFirst = indexOfLast - contactsPerPage;
  const currentContacts = sortedFilteredContacts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedFilteredContacts.length / contactsPerPage);

  // HANDLERS (sin cambios)
  const handleSave = async (formData) => {
    try {
    let saved;

    if (formData.id) {
      // EDITAR
      saved = await editarContacto(formData);
    } else {
      // CREAR
      saved = await crearContacto(formData);
    }

    setContacts((prev) => {
      const exists = prev.find((c) => c.id === saved.id);
      return exists
        ? prev.map((c) => (c.id === saved.id ? saved : c))
        : [...prev, saved];
    });

  } catch (err) {
    console.error("Error guardando contacto:", err);
  }
  };
  const openDeleteModal = (contact) => setDeleteTarget(contact);

 const confirmDelete = async (id) => {
   try {
     await eliminarContacto(id);
     setContacts((prev) => prev.filter((c) => c.id !== id));
   } catch (err) {
     console.error("Error eliminando contacto:", err);
   }
   setDeleteTarget(null);
 };
  const closeDeleteModal = () => setDeleteTarget(null);
  const openNewContact = () => {
    setSelectedContact(null);
    setShowModal(true);
  };
  const openEditContact = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  // RENDER
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
          <CopiarLinkFormulario/>
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
                  <td>
                    {grupos.find((g) => g.id === Number(contact.grupo_oracion))
                      ?.nombre_grupo || "—"}
                  </td>
                  <td>{contact.participa_grupo ? "✅" : "❌"}</td>
                  <td>
                    <button
                      onClick={() => openEditContact(contact)}
                      className={styles.editBtn}
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    {user.role === "administrador" && (
                      <button
                        onClick={() => openDeleteModal(contact)}
                        className={styles.deleteBtn}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
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
                  🙏{" "}
                  {grupos.find((g) => g.id === Number(contact.grupo_oracion))
                    ?.nombre_grupo || "—"}
                </div>
                <div className={styles.contactoParticipa}>
                  {contact.participa_grupo ? "✅ Participa" : "❌ No participa"}
                </div>
                <div className={styles.cardActions}>
                  <button
                    onClick={() => openEditContact(contact)}
                    className={styles.editBtn}
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  {user.role === "administrador" && (
                    <button
                      onClick={() => openDeleteModal(contact)}
                      className={styles.deleteBtn}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
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

        {deleteTarget && (
          <ConfirmDeleteModal
            user={deleteTarget}
            onConfirm={confirmDelete}
            onCancel={closeDeleteModal}
          />
        )}
      </div>
    </div>
  );
};

export default ContactosScreen;
