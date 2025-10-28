import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./MainLayout.module.css";

const MainLayout = ({ user, currentScreen, setScreen, onLogout, children, darkMode }) => {
  const wrapperClass = darkMode
    ? `${styles.appWrapper} modoOscuro`
    : styles.appWrapper;

  return (
    <div className={wrapperClass}>
      <Sidebar
        active={currentScreen}
        setScreen={setScreen}
        user={user}
      />
      <div className={styles.mainColumn}>
        <Navbar user={user} onLogout={onLogout} />
        <main className={styles.appContent}>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
