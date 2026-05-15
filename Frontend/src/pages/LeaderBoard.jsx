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
    return `#${index + 1}`;
  };

  return (
    <div className="leaderboard-container">
      <h2>🏆 OL Mastery Leaderboard</h2>

      <div className="table-wrapper">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>User ID</th>
              <th>Score</th>
            </tr>
          </thead>

          <tbody>
            {leaderboard.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty">
                  No data available
                </td>
              </tr>
            ) : (
              leaderboard.map((user, index) => (
                <tr
                  key={user.userId}
                  className={index < 3 ? "top-row" : ""}
                >
                  
                  <td className="rank-cell">
                    {getMedal(index)}
                  </td>

                
                  <td className="user-cell">
                    <FaUserCircle className="avatar" />
                    <span>{user.userName}</span>
                  </td>

                 
                  <td>{user.userId}</td>

                 
                  <td className="score-cell">
                    {user.totalScore}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}