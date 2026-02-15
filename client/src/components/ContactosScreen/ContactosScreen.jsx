import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
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
import CopiarLinkFormulario from "./CopiarLinkFormulario";
import logger from "../../utils/logger";

import { getGrupos } from "../../api/grupoOracionService";
import { useGeoArgentina } from "../../hooks/useGeoArgentina";
import { useErrorNotification } from "../../hooks/useErrorNotification";


import PropTypes from "prop-types";

// ... (existing code)

const ContactosScreen = ({ user }) => {
  const { notifyError } = useErrorNotification();
  const [contacts, setContacts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
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
        logger.error("Error al obtener los grupos:", error);
      }
    };
    fetchGrupos();
  }, []);

  const fetchContactos = async () => {
    try {
      const params = {
        page: currentPage,
        search: filters.texto,
        provincia: filters.provincia,
      };
      const data = await getContactos(params);
      setContacts(data.results);
      setTotalCount(data.count);
      setTotalCount(data.count);
    } catch (error) {
      logger.error("Error al obtener los contactos:", error);
      notifyError(error, "Error al obtener los contactos");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContactos();
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, currentPage]);

  const currentContacts = contacts;
  const contactsPerPage = 10;
  const totalPages = Math.ceil(totalCount / contactsPerPage);

  const handleSave = async (formData) => {
    try {
      if (formData.id) {
        // EDITAR
        await editarContacto(formData);
        toast.success("Contacto actualizado correctamente");
      } else {
        // CREAR
        await crearContacto(formData);
        toast.success("Contacto creado correctamente");
      }

      await fetchContactos();

    } catch (err) {
      logger.error("Error guardando contacto:", err);
      notifyError(err, "Error guardando contacto");
    }
  };
  const openDeleteModal = (contact) => setDeleteTarget(contact);

  const confirmDelete = async (id) => {
    try {
      await eliminarContacto(id);
      toast.success("Contacto eliminado correctamente");
      setContacts((prev) => prev.filter((c) => c.id !== id));

      if (contacts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchContactos();
      }
    } catch (err) {
      logger.error("Error eliminando contacto:", err);
      notifyError(err, "Error eliminando contacto");
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

  const { provincias, loadingProv } = useGeoArgentina(null);


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
            onChange={(e) => {
              setFilters({ ...filters, texto: e.target.value });
              setCurrentPage(1);
            }}
            className={styles.filterInput}
          />
          <select
            value={filters.provincia}
            onChange={(e) => {
              setFilters({ ...filters, provincia: e.target.value });
              setCurrentPage(1);
            }}
            className={styles.filterSelect}
            disabled={loadingProv}
          >
            <option value="">Todas las provincias</option>

            {provincias.map((prov) => (
              <option key={prov.id} value={prov.nombre}>
                {prov.nombre}
              </option>
            ))}
          </select>
          <PrintButton data={contacts} title="Listado de Contactos" />
        </div>

        <div className={styles.actionsBar}>
          <button onClick={openNewContact} className="actionButtonGlobal">
            ➕ Nuevo Contacto
          </button>
          <CopiarLinkFormulario />
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

ContactosScreen.propTypes = {
  user: PropTypes.object,
};

export default ContactosScreen;
