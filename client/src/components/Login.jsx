import React, { useState } from "react";
import "./Login.css";
import { LogIn, ArrowRight } from "lucide-react";
import logo from "../assets/logo.png";

const PRIMARY_COLOR = "#1c3a64";
const SECONDARY_COLOR = "#4a90e2";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    const success = onLogin(formData);
    if (!success) {
      setError("Credenciales inválidas. Intenta nuevamente.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-header">
          <img src={logo} alt="FM Logo" className="login-logo" />
          <h2>FM Plataforma</h2>
          <p>Casos Colaboradores</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="admin@fm.org"
          />

          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="123456"
          />

          {error && <div className="error">{error}</div>}

          <button type="submit">
            Ingresar <ArrowRight className="arrow-icon" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
