import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./GruposScreen.module.css";
import GrupoFormModal from "./GrupoFormModal";
import GrupoPrintButton from "./GrupoPrintButton";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import { Pencil, Trash2 } from "lucide-react";
import { getGrupos, crearGrupo, editarGrupo, eliminarGrupo } from "../../api/grupoOracionService";
import { getUsers } from "../../api/userService";
import logger from "../../utils/logger";
import { useErrorNotification } from "../../hooks/useErrorNotification";


import PropTypes from "prop-types";

// ... (existing code)

const GruposScreen = ({ user }) => {
  const { notifyError } = useErrorNotification();
  const [grupos, setGrupos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [users, setUsers] = useState([]);


  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const data = await getGrupos();
        setGrupos(data);
      } catch (error) {
        logger.error("Error al obtener los grupos:", error);
        notifyError(error, "Error al obtener los grupos");
      }
    };
    fetchGrupos();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        setUsers(users);
      } catch (error) {
        logger.error("Error al obtener los usuarios:", error);
        notifyError(error, "Error al obtener los usuarios");
      }
    };
    fetchUsers();
  }, []);

  // ORDENAR grupos por nombre_grupo alfabéticamente antes del render
  const sortedGrupos = grupos.slice().sort((a, b) =>
    (a.nombre_grupo || "").toLowerCase().localeCompare((b.nombre_grupo || "").toLowerCase())
  );



  const handleSave = async (grupo) => {
    try {
      let savedGrupo;

      if (grupo.id) {
        // EDITAR
        savedGrupo = await editarGrupo(grupo);

        setGrupos((prev) =>
          prev.map((g) => (g.id === grupo.id ? savedGrupo : g))
        );
        toast.success("Grupo actualizado correctamente");
      } else {
        // CREAR
        savedGrupo = await crearGrupo(grupo);

        setGrupos((prev) => [...prev, savedGrupo]);
        toast.success("Grupo creado correctamente");
      }

      setShowModal(false);
      setSelectedGrupo(null);
    } catch (error) {
      logger.error("Error al guardar grupo:", error);
      notifyError(error, "Error al guardar grupo");
    }
  };


  const handleEdit = (grupo) => {
    setSelectedGrupo(grupo);
    setShowModal(true);
  };
  const openDeleteModal = (grupo) => setDeleteTarget(grupo);
  const confirmDelete = async (id) => {
    try {
      await eliminarGrupo(id);

      setGrupos((prev) => prev.filter((g) => g.id !== id));
      toast.success("Grupo eliminado correctamente");
      setDeleteTarget(null);
    } catch (error) {
      logger.error("Error al eliminar grupo:", error);
      notifyError(error, "Error al eliminar grupo");
    }
  };

  const closeDeleteModal = () => setDeleteTarget(null);
  const openNewGrupo = () => {
    setSelectedGrupo(null);
    setShowModal(true);
  };

  return (
    <div className={`${styles.screenWrapper} screenWrapperGlobal`}>
      <div className={styles.gruposContainer}>
        <h2 className={styles.gruposTitle}>Grupos de Oración</h2>
        <div className={styles.actionsBar}>
          {user.role === "administrador" && (
            <button onClick={openNewGrupo} className="actionButtonGlobal">
              ➕ Nuevo Grupo
            </button>
          )}
          {user.role === "administrador" && (
            <GrupoPrintButton
              data={sortedGrupos}
              title="Listado de Grupos de Oración"
              className="actionButtonGlobal"
            />
          )}
        </div>
        <table className={styles.gruposTable}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Provincia</th>
              <th>Localidad</th>
              <th>Responsable</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedGrupos.map((grupo) => (
              <tr key={grupo.id}>
                <td>{grupo.nombre_grupo}</td>
                <td>{grupo.provincia}</td>
                <td>{grupo.localidad}</td>
                <td>
                  {users.find((u) => u.id === Number(grupo.responsable))
                    ?.nombre || "—"}
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(grupo)}
                    className={styles.editBtn}
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  {user.role === "administrador" && (
                    <button
                      onClick={() => openDeleteModal(grupo)}
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
        {showModal && (
          <GrupoFormModal
            grupo={selectedGrupo}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
            users={users}
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

GruposScreen.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string.isRequired,
  }).isRequired,
};

export default GruposScreen;
