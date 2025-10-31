import React, { useState } from "react";
import styles from "./GruposScreen.module.css";
import GrupoFormModal from "./GrupoFormModal";
import GrupoPrintButton from "./GrupoPrintButton";

const initialGrupos = [
  {
    id: 1,
    nombre_grupo: "Grupo Esperanza",
    localidad: "Junín",
    responsable: "María López",
  },
  {
    id: 2,
    nombre_grupo: "Renacer",
    localidad: "Villa María",
    responsable: "Laura Gómez",
  },
  {
    id: 3,
    nombre_grupo: "Camino de Fe",
    localidad: "Yerba Buena",
    responsable: "Sofía Martínez",
  },
];
const GruposScreen = ({ user }) => {
  const [grupos, setGrupos] = useState(initialGrupos);
  const [showModal, setShowModal] = useState(false);
  const [selectedGrupo, setSelectedGrupo] = useState(null);

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

  const handleDelete = (id) => {
    if (window.confirm("¿Eliminar este grupo de oración?")) {
      setGrupos((prev) => prev.filter((g) => g.id !== id));
    }
  };

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
              data={grupos}
              title="Listado de Grupos de Oración"
              className="actionButtonGlobal"
            />
          )}
        </div>
        <table className={styles.gruposTable}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Localidad</th>
              <th>Responsable</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {grupos.map((grupo) => (
              <tr key={grupo.id}>
                <td>{grupo.nombre_grupo}</td>
                <td>{grupo.localidad}</td>
                <td>{grupo.responsable}</td>
                <td>
                  <button
                    onClick={() => handleEdit(grupo)}
                    className={styles.editBtn}
                  >
                    ✏️
                  </button>
                  {user.role === "Admin" && (
                    <button
                      onClick={() => handleDelete(grupo.id)}
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

        {showModal && (
          <GrupoFormModal
            grupo={selectedGrupo}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default GruposScreen;
