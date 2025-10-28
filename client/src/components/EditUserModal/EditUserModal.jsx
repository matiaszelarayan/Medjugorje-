import React, { useState } from "react";
import styles from "./EditUserModal.module.css";

const EditUserModal = ({ user, onClose, onSave }) => {
  const [nombre, setNombre] = useState(user.nombre);
  const [apellido, setApellido] = useState(user.apellido);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [fotoPreview, setFotoPreview] = useState(user.foto_perfil || null);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    const newErrors = {};

    if (!nombre || nombre.trim().length < 2) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!apellido || apellido.trim().length < 2) {
      newErrors.apellido = "El apellido es obligatorio";
    }

    if (!email || !email.includes("@")) {
      newErrors.email = "Email inválido";
    }

    if (!["Admin", "Colaborador"].includes(role)) {
      newErrors.role = "Rol inválido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedUser = {
      ...user,
      nombre,
      apellido,
      email,
      role,
      foto_perfil: fotoPreview,
    };

    onSave(updatedUser);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h3>Editar Usuario</h3>

        <label>Nombre:</label>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        {errors.nombre && <p className={styles.modalError}>{errors.nombre}</p>}

        <label>Apellido:</label>
        <input value={apellido} onChange={(e) => setApellido(e.target.value)} />
        {errors.apellido && <p className={styles.modalError}>{errors.apellido}</p>}

        <label>Email:</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <p className={styles.modalError}>{errors.email}</p>}

        <label>Rol:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Admin">Admin</option>
          <option value="Colaborador">Colaborador</option>
        </select>
        {errors.role && <p className={styles.modalError}>{errors.role}</p>}

        <label>Foto de perfil:</label>
        <input type="file" accept=".jpg,.png" onChange={handleImageChange} />
        {fotoPreview && (
          <div className={styles.modalImagePreview}>
            <img src={fotoPreview} alt="Preview" />
          </div>
        )}

        <div className={styles.modalActions}>
          <button onClick={handleSave}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
