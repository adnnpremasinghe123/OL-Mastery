import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AlgebraChallenge.css";

const API_BASE = "http://localhost:8081/api/algebra";

export default function AlgebraChallenge() {
  const navigate = useNavigate();

  // 🔹 Game State
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);

  // 🔹 Logged-in User
  const [user, setUser] = useState(null);

  // 🔹 Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    generateQuestion();
  }, [level]);

  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 200);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const generateQuestion = () => {
    let a = Math.floor(Math.random() * (level * 5)) + 1;
    let b = Math.floor(Math.random() * (level * 5)) + 1;
    let x = Math.floor(Math.random() * 10) + 1;

    let equationType = Math.floor(Math.random() * 3);

    if (equationType === 0) {
      setQuestion(`x + ${a} = ${x + a}`);
      setCorrectAnswer(x);
    } else if (equationType === 1) {
      setQuestion(`${a}x = ${a * x}`);
      setCorrectAnswer(x);
    } else {
      setQuestion(`${a}x + ${b} = ${(a * x) + b}`);
      setCorrectAnswer(x);
    }

    setAnswer("");
  };

  const checkAnswer = () => {
    if (Number(answer) === correctAnswer) {
      setScore(prev => prev + level * 15);
      if ((score / 15) % 5 === 0) {
        setLevel(prev => prev + 1);
      }
    }
    generateQuestion();
  };

  // 🔹 Save score ONLY when user clicks button
  const saveScore = async () => {
    if (!user) {
      alert("User not logged in");
      return;
    }

    try {
      await axios.post(`${API_BASE}/submit`, {
        userId: user.id,   // or user._id depending on your DB
        userName: user.name,
        score
      });

      alert("Score saved successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to save score");
    }
  };

  return (
    <div className="algebra-game">
      <h2>📐 Algebra Challenge</h2>

      <div className="info">
        <span>⏱️ {timeLeft}s</span>
        <span>⭐ {score}</span>
        <span>🎯 Lv {level}</span>
      </div>

      {!gameOver ? (
        <>
          <div className="question">{question}</div>

          <input
            type="number"
            placeholder="Enter x"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button onClick={checkAnswer}>Check Answer</button>
        </>
      ) : (
        <div className="game-over">
          <h3>Game Over!</h3>
          <p><strong>{user?.name}</strong>, your score is:</p>
          <h2>{score}</h2>

          {/* Save only on user click */}
          <button onClick={saveScore}>Save Score</button>
        </div>
      )}

      <button
        className="back-subjects-btn"
        onClick={() => navigate("/games")}
      >
        Back to Subjects
      </button>
    </div>
  );
}
