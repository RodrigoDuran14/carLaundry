import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutBtn from "./LogoutBtn";
import "../styles/other/NavBar.css";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navcontainer">
      <div></div>
      <div className={`menubtn ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
        &#9776;
      </div>
      <div className={`navlinks ${menuOpen ? "open" : ""}`}>
        <ul className="navul">
          <li className="navli">
            <Link to="/home" onClick={closeMenu}>
              Inicio
            </Link>
          </li>
          <li className="navli">
            <Link to="/clientes" onClick={closeMenu}>
              Clientes
            </Link>
          </li>
          <li className="navli">
            <Link to="/empleados" onClick={closeMenu}>
              Empleados
            </Link>
          </li>
          <li className="navli">
            <Link to="/vehiculos" onClick={closeMenu}>
              Vehiculos
            </Link>
          </li>
          <li className="navli">
            <Link to="/tipos-lavados" onClick={closeMenu}>
              Tipos de Lavados
            </Link>
          </li>
          <li className="navli">
            <Link to="/lavados" onClick={closeMenu}>
              Lavados
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <LogoutBtn />
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
