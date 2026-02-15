import React from "react";
import Navbar from "../NavBar/NavBar";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./MainLayout.module.css";

import PropTypes from "prop-types";

const MainLayout = ({
  user,
  currentScreen,
  setScreen,
  onLogout,
  children,
  darkMode,
  toggleDarkMode,
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
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <main className={styles.appContent}>{children}</main>
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  user: PropTypes.object,
  currentScreen: PropTypes.string.isRequired,
  setScreen: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  children: PropTypes.node,
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default MainLayout;
