import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./QuickMathGame.css";

const API_BASE = "http://localhost:8081/api/math-score";

export default function QuickMathGame() {
  const navigate = useNavigate();

  
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState("+");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);

 
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
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const generateQuestion = () => {
    const max = level * 10;
    const ops = ["+", "-", "*", "/"];
    const op = ops[Math.floor(Math.random() * ops.length)];

    let a = Math.floor(Math.random() * max) + 1;
    let b = Math.floor(Math.random() * max) + 1;

    if (op === "/") a = a * b;

    setNum1(a);
    setNum2(b);
    setOperator(op);
    setAnswer("");
  };

  const getCorrectAnswer = () => {
    switch (operator) {
      case "+": return num1 + num2;
      case "-": return num1 - num2;
      case "*": return num1 * num2;
      case "/": return num1 / num2;
      default: return 0;
    }
  };

  const checkAnswer = () => {
    if (Number(answer) === getCorrectAnswer()) {
      setScore(prev => prev + level * 10);
      if ((score / 10) % 5 === 0) {
        setLevel(prev => prev + 1);
      }
    }
    generateQuestion();
  };


  const submitScore = async () => {
    if (!user) {
      alert("User not logged in");
      return;
    }

    try {
      await axios.post(`${API_BASE}/submit`, {
        userId: user.id,      // or user._id if your DB uses _id
        userName: user.name,
        score
      });

      alert("Score saved successfully!"); // ✅ only show alert, no redirect
       window.location.reload();
    } catch (err) {
      alert("Failed to save score");
    }
  };

  return (
    <div className="math-game">
      <h2>⚡ Quick Math Challenge</h2>

      <div className="info">
        <span>⏱️ {timeLeft}s</span>
        <span>⭐ Score: {score}</span>
        <span>🎯 Level: {level}</span>
      </div>

      {!gameOver ? (
        <>
          <div className="question">
            {num1} {operator} {num2} = ?
          </div>

          <input
            type="number"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
          />

          <button onClick={checkAnswer}>Submit Answer</button>
        </>
      ) : (
        <div className="game-over">
          <h3>🎉 Game Over</h3>
          <p><strong>{user?.name}</strong>, your score is:</p>
          <h2>{score}</h2>

          <button onClick={submitScore}>Save Score</button>
        </div>
      )}

      <button
        className="nav-subject-btn"
        onClick={() => navigate("/games")}
      >
        Back to Subjects
      </button>
    </div>
  );
}
