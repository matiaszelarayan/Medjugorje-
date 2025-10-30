import React, { useState } from "react";
import styles from "./PerfilScreen.module.css";

const PerfilScreen = ({ user }) => {
  const [nombre, setNombre] = useState(user.nombre || "");
  const [apellido, setApellido] = useState(user.apellido || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [imagePreview, setImagePreview] = useState(user.foto_perfil || null);
  const [successMessage, setSuccessMessage] = useState("");

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 6;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    return hasMinLength && hasLetter && hasUppercase;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setImagePreview(URL.createObjectURL(file));
      setPasswordError("");
    } else {
      setImagePreview(user.foto_perfil || null);
      setSuccessMessage("");
      setPasswordError("La imagen debe ser .jpg o .png");
    }
  };

  const handleSave = () => {
    setPasswordError("");
    setSuccessMessage("");

    const quiereCambiarPassword = newPassword || confirmPassword;

    if (quiereCambiarPassword) {
      if (newPassword !== confirmPassword) {
        setPasswordError("Las contraseñas no coinciden");
        return;
      }

      if (!validatePassword(newPassword)) {
        setPasswordError(
          "La contraseña debe tener al menos 6 caracteres, una letra y una mayúscula"
        );
        return;
      }
    }

    // Simulación de guardado
    console.log("Datos actualizados:", {
      nombre,
      apellido,
      nuevaPassword: quiereCambiarPassword ? newPassword : "(sin cambios)",
      foto: imagePreview,
    });

    setSuccessMessage("Cambios guardados correctamente (simulado)");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className={styles.perfilContainer}>
      <h2>Mi Perfil</h2>

      <div className={styles.perfilSection}>
        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>

      <div className={styles.perfilSection}>
        <label>Apellido:</label>
        <input
          type="text"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />
      </div>

      <div className={styles.perfilInfo}>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role}</p>
      </div>

      <div className={styles.perfilSection}>
        <label>Foto de perfil (.jpg o .png):</label>
        <input type="file" accept=".jpg,.png" onChange={handleImageChange} />
        {imagePreview && (
          <div className={styles.imagePreview}>
            <img src={imagePreview} alt="Preview" />
          </div>
        )}
      </div>

      <div className={styles.perfilSection}>
        <label>Nueva contraseña:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className={styles.perfilSection}>
        <label>Confirmar contraseña:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
      {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

      <button className={styles.saveButton} onClick={handleSave}>
        Guardar cambios
      </button>
    </div>
  );
};

export default PerfilScreen;
