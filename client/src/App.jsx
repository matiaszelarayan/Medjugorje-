import React, { useState, useCallback } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import ContactosScreen from "./components/ContactosScreen";
import PerfilScreen from "./components/PerfilScreen";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Simulación de usuarios válidos
const USERS = [
  {
    email: "admin@fm.org",
    password: "123456",
    name: "Rubén Aragón",
    role: "Admin",
    id: "user-001",
  },
  {
    email: "colaborador@fm.org",
    password: "654321",
    name: "Gustavo",
    role: "Colaborador",
    id: "user-002",
  },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setScreen] = useState("dashboard");

  const handleLogin = ({ email, password }) => {
    const user = USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setScreen("dashboard");
  };

  const renderScreen = useCallback(() => {
    switch (currentScreen) {
      case "dashboard":
        return <Dashboard user={currentUser} />;
      case "contactos":
        return <ContactosScreen />;
      case "agenda":
        return (
          <div>
            <h1 className="section-title">Agenda de Actividades (RF2)</h1>
            <p className="section-subtitle">
              Área de planificación y seguimiento de eventos. ¡En desarrollo!
            </p>
          </div>
        );
      case "emailing":
        return (
          <div>
            <h1 className="section-title">Módulo de Emailing (RF4)</h1>
            <p className="section-subtitle">
              Área de gestión de campañas de correo. (Solo visible para Admin).
              ¡En desarrollo!
            </p>
          </div>
        );
      case "perfil":
        return <PerfilScreen user={currentUser} />;
      case "admin-perfiles":
        return (
          <div>
            <h1 className="section-title">Administrar Perfiles</h1>
            <p className="section-subtitle">
              Módulo exclusivo para el administrador. ¡En desarrollo!
            </p>
          </div>
        );
      default:
        return <Dashboard user={currentUser} />;
    }
  }, [currentScreen, currentUser]);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <MainLayout
        user={currentUser}
        currentScreen={currentScreen}
        setScreen={setScreen}
        onLogout={handleLogout}
      >
        {renderScreen()}
      </MainLayout>
      <ToastContainer position="bottom-right" />
    </>
  );
}

