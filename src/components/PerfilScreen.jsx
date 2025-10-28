import React, { useState } from "react";
import "./PerfilScreen.css";

const PerfilScreen = ({ user }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
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
      setImagePreview(null);
      setSuccessMessage("");
      setPasswordError("La imagen debe ser .jpg o .png");
    }
  };

  const handleSave = () => {
    setPasswordError("");
    setSuccessMessage("");

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

    // Simulación de guardado
    setSuccessMessage("Cambios guardados correctamente (simulado)");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="perfil-container">
      <h2>Mi Perfil</h2>

      <div className="perfil-info">
        <p><strong>Nombre:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role}</p>
      </div>

      <div className="perfil-section">
        <label>Foto de perfil (.jpg o .png):</label>
        <input type="file" accept=".jpg,.png" onChange={handleImageChange} />
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}
      </div>

      <div className="perfil-section">
        <label>Nueva contraseña:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="perfil-section">
        <label>Confirmar contraseña:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {passwordError && <p className="error-message">{passwordError}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <button className="save-button" onClick={handleSave}>
        Guardar cambios
      </button>
    </div>
  );
};

export default PerfilScreen;
