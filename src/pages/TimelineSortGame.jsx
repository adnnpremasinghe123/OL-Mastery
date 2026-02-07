import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./TimelineSortGame.css";

const API_BASE = "http://localhost:8081/api/timeline";

const sampleEvents = [
  { event: "World War I begins", year: 1914 },
  { event: "Independence of Sri Lanka", year: 1948 },
  { event: "Invention of the Internet", year: 1983 },
  { event: "First man on the Moon", year: 1969 },
  { event: "Fall of Berlin Wall", year: 1989 },
];

export default function TimelineSortGame() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);

  // 🔹 Load logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    shuffleEvents();
  }, []);

  const shuffleEvents = () => {
    setEvents([...sampleEvents].sort(() => Math.random() - 0.5));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newEvents = [...events];
    [newEvents[index - 1], newEvents[index]] =
      [newEvents[index], newEvents[index - 1]];
    setEvents(newEvents);
  };

  const moveDown = (index) => {
    if (index === events.length - 1) return;
    const newEvents = [...events];
    [newEvents[index + 1], newEvents[index]] =
      [newEvents[index], newEvents[index + 1]];
    setEvents(newEvents);
  };

  const checkOrder = () => {
    const isCorrect = events.every(
      (e, i, arr) => i === 0 || e.year >= arr[i - 1].year
    );

    if (isCorrect) {
      setScore(prev => prev + 50);
      alert("Correct order! +50 points");
    } else {
      alert("Incorrect order. Try again!");
    }

    shuffleEvents();
  };

  // 🔹 Save score using logged-in user
  const submitScore = async () => {
    if (!user) {
      alert("User not logged in");
      return;
    }

    try {
      await axios.post(`${API_BASE}/submit`, {
        userId: user.id,      // or user._id
        userName: user.name,
        score,
      });

      alert("Score saved successfully!");
      window.location.reload(); // 🔄 refresh page
    } catch (err) {
      console.error(err);
      alert("Failed to save score");
    }
  };

  return (
    <div className="timeline-game">
      <button className="back-btn" onClick={() => navigate("/games")}>
        ← Back to Subjects
      </button>

      <h2>📜 Timeline Sort Game</h2>
      <div className="info">⭐ {score}</div>

      <div className="event-list">
        {events.map((e, idx) => (
          <div key={idx} className="event-item">
            <span>{e.event}</span>
            <div className="buttons">
              <button onClick={() => moveUp(idx)}>↑</button>
              <button onClick={() => moveDown(idx)}>↓</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={checkOrder} className="check-btn">
        Check Order
      </button>

      <button onClick={submitScore} className="save-btn">
        Save Score
      </button>
    </div>
  );
}
