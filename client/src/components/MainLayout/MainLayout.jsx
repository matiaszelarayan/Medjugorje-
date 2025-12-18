import React from "react";
import Navbar from "../NavBar/NavBar";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./MainLayout.module.css";

const MainLayout = ({
  user,
  currentScreen,
  setScreen,
  onLogout,
  children,
  darkMode,
  toggleDarkMode, // ✅ asegurate de recibir esta prop
}) => {
  const wrapperClass = darkMode
    ? `${styles.appWrapper} ${styles.modoOscuro}`
    : styles.appWrapper;

  return (
    <div className={wrapperClass}>
      <Sidebar active={currentScreen} setScreen={setScreen} user={user} />
      <div className={styles.mainColumn}>
        <Navbar
          user={user}
          onLogout={onLogout}
          darkMode={darkMode}           // ✅ pasamos el estado
          toggleDarkMode={toggleDarkMode} // ✅ pasamos la función
        />
        <main className={styles.appContent}>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
