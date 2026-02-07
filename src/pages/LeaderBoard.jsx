import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMedal, FaUserCircle } from "react-icons/fa";
import "./Leaderboard.css";

const API_BASE = "http://localhost:8081/api/leaderboard";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(API_BASE);
      setLeaderboard(res.data);
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    }
  };

  const getMedal = (index) => {
    if (index === 0) return <FaMedal style={{ color: "#FFD700" }} />;
    if (index === 1) return <FaMedal style={{ color: "#C0C0C0" }} />;
    if (index === 2) return <FaMedal style={{ color: "#CD7F32" }} />;
    return null;
  };

  const getCardClass = (index) => {
    if (index === 0) return "leader-card gold";
    if (index === 1) return "leader-card silver";
    if (index === 2) return "leader-card bronze";
    return "leader-card";
  };

  return (
    <div className="leaderboard-container">
      <h2>🏆 OL Mastery Leaderboard</h2>
      <div className="leaderboard-cards">
        {leaderboard.map((user, index) => (
          <div key={user.userId} className={getCardClass(index)}>
            <div className="leader-rank">
              #{index + 1} {getMedal(index)}
            </div>
            <div className="leader-avatar">
              <FaUserCircle />
            </div>
            <div className="leader-info">
              <h3>{user.userName}</h3>
              <p>ID: {user.userId}</p>
              <p>Score: {user.totalScore}</p>
            </div>
            {index > 2 && <div className="keep-going">Keep going! 🔥</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
