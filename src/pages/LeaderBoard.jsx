import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Leaderboard.css";

const API_BASE = "http://localhost:8081/api/leaderboard"; // Your endpoint

export default function Leaderboard() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("weekly");

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(`${API_BASE}?filter=${filter}`);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load leaderboard data");
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="leaderboard-page">
      <h2>Student Leaderboard</h2>

      {/* Filters */}
      <div className="filter-buttons">
        <button
          className={filter === "weekly" ? "active" : ""}
          onClick={() => setFilter("weekly")}
        >
          Weekly
        </button>

        <button
          className={filter === "monthly" ? "active" : ""}
          onClick={() => setFilter("monthly")}
        >
          Monthly
        </button>

        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All Time
        </button>
      </div>

      {/* Leaderboard table */}
      <div className="leaderboard-table">
        {students.map((stu, index) => (
          <div className="leaderboard-row" key={stu._id}>
            <div className="rank">{getRankBadge(index + 1)}</div>

            <div className="student-info">
              <h4>{stu.name}</h4>
              <p>Class: {stu.class}</p>
            </div>

            <div className="stats-box">
              <span className="label">Score</span>
              <span className="value">{stu.score}</span>
            </div>

            <div className="stats-box">
              <span className="label">Quizzes</span>
              <span className="value">{stu.quizzesDone}</span>
            </div>

            <div className="stats-box">
              <span className="label">Activeness</span>
              <span className="value">{stu.loginStreak} days 🔥</span>
            </div>

            <div className="xp-box">
              <span>{stu.xp} XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
