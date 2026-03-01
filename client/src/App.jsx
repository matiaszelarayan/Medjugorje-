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
import FormularioBuilderScreen from "./components/Formularios/FormularioBuilderScreen";

import { login as loginAPI, logout as logoutAPI } from "./api/authService";
import { getPerfil } from "./api/userService";
import logger from "./utils/logger"
import { useErrorNotification } from "./hooks/useErrorNotification";


export default function App() {
  const { notifyError } = useErrorNotification();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setScreen] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode && isAuthenticated) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode, isAuthenticated]);



  // Cargar la  sesión si hay tokens
  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) return;

    // obtiene perfil
    getPerfil()
      .then((user) => {
        setCurrentUser(user);
        setIsAuthenticated(true);
      })
      .catch(() => {
        handleLogout();
      });
  }, []);

  const handleLogin = async ({ email, password }) => {
    try {
      await loginAPI(email, password);

      // Con token válido obtener perfil
      const user = await getPerfil();
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      logger.error(err);
      notifyError(err, "Error al iniciar sesión");
      return false;
    }
  };

  const handleLogout = useCallback(() => {
    logoutAPI();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setScreen("dashboard");
  }, []);

  useEffect(() => {
    const onLogout = () => handleLogout();
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, [handleLogout]);

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
      // case "formularios":
      //   return <FormularioBuilderScreen user={currentUser} />;
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
