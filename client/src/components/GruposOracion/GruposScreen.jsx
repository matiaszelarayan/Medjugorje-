import React, { useState } from "react";
import styles from "./GruposScreen.module.css";
import GrupoFormModal from "./GrupoFormModal";
import GrupoPrintButton from "./GrupoPrintButton";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import { Pencil, Trash2 } from "lucide-react";

const initialGrupos = [
  {
    id: 1,
    nombre_grupo: "Grupo Esperanza",
    provincia: "Buenos Aires",
    localidad: "Junín",
    responsable: "María López",
  },
  {
    id: 2,
    nombre_grupo: "Renacer",
    provincia: "Córdoba",
    localidad: "Villa María",
    responsable: "Laura Gómez",
  },
  {
    id: 3,
    nombre_grupo: "Camino de Fe",
    provincia: "Tucumán",
    localidad: "Yerba Buena",
    responsable: "Sofía Martínez",
  },
];

const GruposScreen = ({ user }) => {
  const [grupos, setGrupos] = useState(initialGrupos);
  const [showModal, setShowModal] = useState(false);
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ORDENAR grupos por nombre_grupo alfabéticamente antes del render
  const sortedGrupos = grupos.slice().sort((a, b) =>
    (a.nombre_grupo || "").toLowerCase().localeCompare((b.nombre_grupo || "").toLowerCase())
  );

  const handleSave = (grupo) => {
    setGrupos((prev) => {
      const exists = prev.find((g) => g.id === grupo.id);
      return exists
        ? prev.map((g) => (g.id === grupo.id ? grupo : g))
        : [...prev, { ...grupo, id: Date.now() }];
    });
    setShowModal(false);
  };

  const handleEdit = (grupo) => {
    setSelectedGrupo(grupo);
    setShowModal(true);
  };
  const openDeleteModal = (grupo) => setDeleteTarget(grupo);
  const confirmDelete = (id) => {
    setGrupos((prev) => prev.filter((g) => g.id !== id));
    setDeleteTarget(null);
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
          {user.role === "Admin" && (
            <button onClick={openNewGrupo} className="actionButtonGlobal">
              ➕ Nuevo Grupo
            </button>
          )}
          {user.role === "Admin" && (
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
                <td>{grupo.responsable}</td>
                <td>
                  <button
                    onClick={() => handleEdit(grupo)}
                    className={styles.editBtn}
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  {user.role === "Admin" && (
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

export default GruposScreen;
