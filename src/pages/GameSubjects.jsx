import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCalculator, FaFlask, FaBook, FaHistory, FaLaptop } from "react-icons/fa";
import "./GameSubjects.css";

export default function GameSubjects() {
  const navigate = useNavigate();

  const subjects = [
    { name: "Mathematics", code: "math", icon: <FaCalculator /> },
    { name: "Science", code: "science", icon: <FaFlask /> },
    { name: "English", code: "english", icon: <FaBook /> },
    { name: "History", code: "history", icon: <FaHistory /> },
    { name: "ICT", code: "ict", icon: <FaLaptop /> },
  ];

  return (
    <div className="game-page-container">
      <h2 className="subject-title">🎮 Choose a Subject to Play Games</h2>
      <p className="subject-subtitle">
        Interactive games designed to improve your O/L knowledge
      </p>

      
      {/* Dashboard Button */}
      <div
        className="dashboard-btn"
        onClick={() => navigate("/student")}
      >
        ⬅️ Back to Dashboard
      </div>

      <div className="subject-grid">
        {subjects.map((sub) => (
          <div
            key={sub.code}
            className="game-card"
            onClick={() => navigate(`/games/${sub.code}`)}
          >
            <div className="game-icon">{sub.icon}</div>
            <h3>{sub.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
