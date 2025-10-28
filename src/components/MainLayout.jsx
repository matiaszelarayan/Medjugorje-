import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../App.css"; // ✅ Correcta desde /components

const MainLayout = ({ user, currentScreen, setScreen, onLogout, children }) => {
  return (
    <div className="app-wrapper">
      <Sidebar
        active={currentScreen}
        setScreen={setScreen}
        user={user} // ✅ Necesario para mostrar menú según rol
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar user={user} onLogout={onLogout} />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
