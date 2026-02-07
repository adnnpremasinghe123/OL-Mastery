import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaGamepad, FaArrowLeft } from "react-icons/fa";
import "./SubjectGames.css";

export default function SubjectGames() {
  const { subject } = useParams();
  const navigate = useNavigate();

  const games = {
    math: [
      { title: "Quick Math Game", path: "/games/math/quick" },
      { title: "Algebra Challenge", path: "/games/math/algebra" }
    ],
    science: [
      { title: "Label The Human Body", path: "/games/science/body" },
      { title: "Food Chain Builder", path: "/games/science/food-chain" }
    ],
    english: [
      { title: "Grammar Fix Game", path: "/games/english/grammar" },
      { title: "Vocabulary Match", path: "/games/english/vocab" }
    ],
    history: [
      { title: "Timeline Sort Game", path: "/games/history/timeline" }
    ],
    ict: [
      { title: "Binary Number Game", path: "/games/ict/binary" }
    ],
  };

  return (
    <div className="subject-wrapper">
      <h2 className="subject-title">🎮 {subject.toUpperCase()} Games</h2>
      <p className="subject-subtitle">
        Choose a game to begin learning through fun!
      </p>

      <button className="back-btn" onClick={() => navigate("/games")}>
        <FaArrowLeft /> Back to Subjects
      </button>

      <div className="subject-grid">
        {games[subject]?.map((g) => (
          <div
            key={g.title}
            className="game-card"
            onClick={() => navigate(g.path)}
          >
            <FaGamepad className="game-icon" />
            <h3>{g.title}</h3>
          </div>
        )) || <p>No games added yet.</p>}
      </div>
    </div>
  );
}
