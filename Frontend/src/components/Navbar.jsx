// Navbar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar">
       
        <div className="navbar-logo" onClick={() => navigate("/")}>
          <img src={logo} alt="OL Mastery Logo" />
        </div>

      
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

     
        <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <li><a href="/" className="active">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
         
        </ul>

      
        <div className="navbar-right">
          <a href="/login" className="navbar-btn">Login</a>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
