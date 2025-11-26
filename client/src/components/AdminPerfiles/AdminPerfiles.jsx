import React, { useState, useEffect } from "react";
import styles from "./AdminPerfiles.module.css";
import { Pencil, Trash2 } from "lucide-react";
import CreateUserModal from "../CreateUserModal/CreateUserModal";
import EditUserModal from "../EditUserModal/EditUserModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import PrintButton from "./PrintButton";
import { crearUser, eliminarUser, editarUser, getUsers } from "../../api/userService";

const AdminPerfiles = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filtroRol, setFiltroRol] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        setUsuarios(users);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };
    fetchUsers();
  }, []);


  const handleSaveUser = (updatedUser) => {

    console.log(updatedUser);

    try {
      editarUser(updatedUser);
    } catch (error) {
      console.error("Error al editar el usuario:", error);
    }
    setUsuarios((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  const handleCreateUser = async (nuevoUsuario) => {

    try {
      await crearUser(nuevoUsuario);
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      console.error(
        "Error al crear el usuario:",
        error.response?.data || error
      );
    }
    
    setUsuarios((prev) => [...prev, nuevoUsuario]);
    setBusqueda("");
    setFiltroRol("Todos");
    setPaginaActual(1);
  };

  const handleDeleteUser = (id) => {

    try {
      eliminarUser(id);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }

    setUsuarios((prev) => prev.filter((u) => u.id !== id));
    setUsuarioAEliminar(null);
    setMensajeExito("Usuario eliminado con éxito");
    setTimeout(() => setMensajeExito(""), 3000);
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideRol = filtroRol === "Todos" || u.role === filtroRol;
    const coincideTexto =
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase());
    return coincideRol && coincideTexto;
  });

  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  const indiceInicio = (paginaActual - 1) * usuariosPorPagina;
  const usuariosPagina = usuariosFiltrados.slice(
    indiceInicio,
    indiceInicio + usuariosPorPagina
  );

  return (
    <div className={`${styles.adminContainer} adminContainerGlobal`}>
      <h2 className={styles.title}>Administrar Perfiles</h2>

      {mensajeExito && (
        <p className={`${styles.successAlert} successAlertGlobal`}>
          {mensajeExito}
        </p>
      )}

      <div className={`${styles.filtrosContainer} filtrosContainerGlobal`}>
        <select
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
        >
          <option value="Todos">Todos</option>
          <option value="administrador">Administrador</option>
          <option value="colaborador">Colaborador</option>
        </select>

        <input
          type="text"
          placeholder="Buscar por nombre o email"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className={styles.botonesContainer}>
        <button
          className={`${styles.createButton} createButtonGlobal`}
          onClick={() => setShowCreateModal(true)}
        >
          Crear nuevo usuario
        </button>
        <PrintButton />
      </div>

      <table className={styles.adminTable}>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosPagina.map((u) => (
            <tr key={u.id}>
              <td>
                {u.foto_perfil ? (
                  <img
                    src={u.foto_perfil}
                    alt="Foto"
                    className={styles.adminAvatar}
                  />
                ) : (
                  <span className={styles.noFoto}>Sin foto</span>
                )}
              </td>
              <td>
                {u.nombre} {u.apellido}
              </td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button
                  className={styles.editButton}
                  onClick={() => setUsuarioEditando(u)}
                  title="Editar"
                  aria-label="Editar"
                >
                  <Pencil size={16} />
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => setUsuarioAEliminar(u)}
                  title="Eliminar"
                  aria-label="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPaginas > 1 && (
        <div className={`${styles.paginacion} paginacionGlobal`}>
          <button
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
          >
            Anterior
          </button>
          <span>
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() =>
              setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
            }
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      )}

      {usuarioEditando && (
        <EditUserModal
          user={usuarioEditando}
          onClose={() => setUsuarioEditando(null)}
          onSave={handleSaveUser}
        />
      )}

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateUser}
        />
      )}

      {usuarioAEliminar && (
        <ConfirmDeleteModal
          user={usuarioAEliminar}
          onConfirm={handleDeleteUser}
          onCancel={() => setUsuarioAEliminar(null)}
        />
      )}
    </div>
  );
};

export default AdminPerfiles;
