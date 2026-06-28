import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar({ darkMode, toggleDarkMode }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-dot" />
          TodoFlow
        </Link>
        <button className="dark-toggle" onClick={toggleDarkMode}>
          {darkMode ? "☀ Light" : "☽ Dark"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
