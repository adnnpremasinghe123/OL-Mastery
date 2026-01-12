import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>Path to OL Success</h3>
        <p>
          Empowering students, teachers, and administrators to enhance learning through technology.
        </p>

        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/login">Login</a>
         
          <a href="/about">About</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} OL Mastery| All Rights Reserved</p>
      </div>
    </footer>
  );
}
