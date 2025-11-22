import React, { useState } from "react";
import ModalBase from "../common/ModalBase/ModalBase"; // 👈 importa la base
import styles from "./CreateUserModal.module.css";

const CreateUserModal = ({ onClose, onCreate }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("colaborador");
  const [password, setPassword] = useState("");
  const [fotoPreview, setFotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const validatePassword = (pass) => {
    return pass.length >= 6 && /[a-zA-Z]/.test(pass) && /[A-Z]/.test(pass);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = () => {
    const newErrors = {};

    if (!nombre || nombre.trim().length < 2) newErrors.nombre = "El nombre es obligatorio";
    if (!apellido || apellido.trim().length < 2) newErrors.apellido = "El apellido es obligatorio";
    if (!email || !email.includes("@")) newErrors.email = "Email inválido";
    if (!["administrador", "colaborador"].includes(role)) newErrors.role = "Rol inválido";
    if (!validatePassword(password)) newErrors.password = "Contraseña débil (mínimo 6 caracteres, una letra y una mayúscula)";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const nuevoUsuario = {
      // id: Date.now().toString(),
      nombre,
      apellido,
      email,
      role,
      foto_perfil: fotoPreview,
      password, // solo para simulación
    };

    onCreate(nuevoUsuario);
    onClose();
  };

  return (
    <ModalBase onClose={onClose}>
      <h3 className={styles.title}>Crear Nuevo Usuario</h3>

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
        <option value="administrador">Administrador</option>
        <option value="colaborador">Colaborador</option>
      </select>
      {errors.role && <p className={styles.modalError}>{errors.role}</p>}

      <label>Contraseña inicial:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {errors.password && <p className={styles.modalError}>{errors.password}</p>}

      <label>Foto de perfil:</label>
      <input type="file" accept=".jpg,.png" onChange={handleImageChange} />
      {fotoPreview && (
        <div className={styles.modalImagePreview}>
          <img src={fotoPreview} alt="Preview" />
        </div>
      )}

      <div className={styles.modalActions}>
        <button onClick={handleCreate} className={styles.createBtn}>Crear</button>
        <button onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
      </div>
    </ModalBase>
  );
};

export default CreateUserModal;
