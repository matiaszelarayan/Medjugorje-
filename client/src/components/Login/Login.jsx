import React, { useState } from "react";
import styles from "./Login.module.css";
import { ArrowRight } from "lucide-react";
import logo from "../../assets/logo.png";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onLogin(formData);
    if (!success) {
      setError("Credenciales inválidas. Intenta nuevamente.");
    }
  };

  return (
    <div className={styles["login-wrapper"]}>
      <div className={styles["login-box"]}>
        <img src={logo} alt="Logo" className={styles["login-logo"]} />
        <h2>Fundación Centro Medjugorje Argentina</h2>
        <p>Plataforma Institucional</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Ingresar <ArrowRight size={16} style={{ marginLeft: "0.5rem" }} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
