// Navbar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      // Navigate to search page with query as URL param
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // Clear input
      setMenuOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="navbar-logo">
          <img src={logo} alt="OL Mastery Logo" />
        </div>

        {/* Hamburger */}
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation Links */}
        <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <li><a href="/" className="active">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>

        {/* Right Side */}
        <div className="navbar-right">
          <div className="navbar-search">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button onClick={handleSearch}>🔍</button>
          </div>
          <a href="/login" className="navbar-btn">Login</a>
        </div>
      </nav>

      {/* Floating Chatbot Button */}
      <div 
        className="chatbot-button"
        onClick={() => setChatOpen(!chatOpen)}
      >
        💬
      </div>

      {/* Chatbot Window */}
      {chatOpen && (
        <div className="chatbot-window">
          <h4>Chat Assistant</h4>
          <div className="chatbot-messages">
            <p>Hello! How can I help you today? 😊</p>
          </div>
          <input 
            className="chatbot-input"
            type="text"
            placeholder="Type a message..."
          />
        </div>
      )}
    </>
  );
};

export default Navbar;
