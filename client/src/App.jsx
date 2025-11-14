import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./components/Dashboard/Dashboard";
import ContactosScreen from "./components/ContactosScreen/ContactosScreen";
import PerfilScreen from "./components/PerfilScreen/PerfilScreen";
import Login from "./components/Login/Login";
import MainLayout from "./components/MainLayout/MainLayout";
import AdminPerfiles from "./components/AdminPerfiles/AdminPerfiles";
import GruposScreen from "./components/GruposOracion/GruposScreen";
import CorreosScreen from "./components/Correos/CorreosScreen";
import EventosScreen from "./components/Eventos/EventosScreen";

const USERS = [
  {
    email: "admin@fm.org",
    password: "123456",
    nombre: "Rubén",
    apellido: "Aragón",
    role: "Admin",
    id: "user-001",
    foto_perfil: null,
  },
  {
    email: "colaborador@fm.org",
    password: "654321",
    nombre: "Gustavo",
    apellido: "",
    role: "Colaborador",
    id: "user-002",
    foto_perfil: null,
  },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setScreen] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);

  // Persistencia del modo oscuro
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

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
        return <Dashboard user={currentUser} setScreen={setScreen} />;
      case "contactos":
        return <ContactosScreen user={currentUser} />;
      case "grupos-oracion":
        return <GruposScreen user={currentUser} />;
      case "agenda":
        return <EventosScreen user={currentUser} />;
      case "correos":
        return <CorreosScreen user={currentUser} />;
      case "perfil":
        return <PerfilScreen user={currentUser} />;
      case "admin-perfiles":
        return <AdminPerfiles />;
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
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode((prev) => !prev)}
      >
        {renderScreen()}
      </MainLayout>

      <ToastContainer position="bottom-right" />
    </>
  );
}
