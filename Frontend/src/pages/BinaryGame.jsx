import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./BinaryGame.css";

const API_BASE = "http://localhost:8081/api/binary";

export default function BinaryGame() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [questionCount, setQuestionCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔁 Generate question
  useEffect(() => {
    if (!gameOver) generateQuestion();
  }, [level, gameOver]);

  // ⏱ Timer logic
  useEffect(() => {
    if (gameOver) return;

    if (timeLeft === 0) {
      setGameOver(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver]);

  const generateQuestion = () => {
    const type = Math.floor(Math.random() * 3);
    setFeedback("");
    setQuestionCount((c) => c + 1);

    if (type === 0) {
      const decimal = Math.floor(Math.random() * (level * 15)) + 1;
      setQuestion(`Convert to Decimal: ${decimal.toString(2)}₂`);
      setCorrectAnswer(decimal.toString());
    } 
    else if (type === 1) {
      const decimal = Math.floor(Math.random() * (level * 15)) + 1;
      setQuestion(`Convert to Binary: ${decimal}₁₀`);
      setCorrectAnswer(decimal.toString(2));
    } 
    else {
      const decimal = Math.floor(Math.random() * (level * 10)) + 1;
      const binary = decimal.toString(2);
      const index = Math.floor(Math.random() * binary.length);

      setQuestion(
        `Fill the missing bit: ${
          binary.substring(0, index) + "_" + binary.substring(index + 1)
        }₂`
      );
      setCorrectAnswer(binary[index]);
    }

    setAnswer("");
  };

  const checkAnswer = () => {
    if (answer.trim() === "") return;

    if (answer.trim() === correctAnswer) {
      setFeedback("✅ Correct!");
      setScore((prev) => {
        const newScore = prev + level * 20;
        if (newScore % 100 === 0) {
          setLevel((l) => l + 1);
          setTimeLeft((t) => t + 5); // ⏱ bonus time on level up
        }
        return newScore;
      });
    } else {
      setFeedback("❌ Wrong!");
    }

    setTimeout(generateQuestion, 600);
  };

  // 💾 Save score
  const submitScore = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      await axios.post(`${API_BASE}/submit`, {
        userId: user._id,
        userName: user.name,
         score: Number(score),
      });

      alert("Score saved successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to save score");
    }
  };

  const difficulty =
    level <= 2 ? "Easy" : level <= 4 ? "Medium" : "Hard";

  return (
    <div className="binary-game">
      <button className="back-btn" onClick={() => navigate("/games")}>
        ← Back to Subjects
      </button>

      <h2>💻 Binary Challenge</h2>

      <div className="info">
        <span>⏱ {timeLeft}s</span>
        <span>⭐ {score}</span>
        <span>🎯 Lv {level}</span>
        <span>🔥 {difficulty}</span>
      </div>

      {!gameOver ? (
        <>
          <div className="question">{question}</div>

          <input
            placeholder="Your Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button onClick={checkAnswer} disabled={!answer.trim()}>
            Submit Answer
          </button>

          <div className="feedback">{feedback}</div>
          <div className="counter">Question #{questionCount}</div>
        </>
      ) : (
        <div className="game-over">
          <h3>Game Over!</h3>
          <p>Final Score: ⭐ {score}</p>
          <button onClick={submitScore}>Save Score</button>
        </div>
      )}
    </div>
  );
}
