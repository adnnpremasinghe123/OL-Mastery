import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./HumanBodyLabelGame.css";

const API_BASE = "http://localhost:8081/api/body-score";


const bodyParts = [
  { name: "Heart", hint: "Pumps blood throughout the body" },
  { name: "Lungs", hint: "Responsible for breathing" },
  { name: "Brain", hint: "Controls the body and mind" },
  { name: "Stomach", hint: "Digest food" },
  { name: "Liver", hint: "Detoxifies chemicals" },
];

export default function HumanBodyLabelGame() {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);

 
  const [user, setUser] = useState(null);

 
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  
  const nextPart = () => {
    setCurrentIndex(Math.floor(Math.random() * bodyParts.length));
    setUserAnswer("");
  };

  useEffect(() => {
    nextPart();
  }, []);

  const submitAnswer = () => {
    const correctAnswer = bodyParts[currentIndex].name.trim().toLowerCase();
    if (userAnswer.trim().toLowerCase() === correctAnswer) {
      setScore(prev => prev + 20);
      alert("Correct! +20 points");
    } else {
      alert(`Incorrect! Correct answer: "${bodyParts[currentIndex].name}"`);
    }
    nextPart();
  };

  
  const submitScore = async () => {
    if (!user) {
      alert("User not logged in");
      return;
    }

    try {
      await axios.post(`${API_BASE}/submit`, {
        userId: user.id,       // or user._id depending on your DB
        userName: user.name,
        score
      });
      alert("Score submitted successfully!");
      window.location.reload(); // refresh page automatically
    } catch (err) {
      console.error(err);
      alert("Failed to submit score");
    }
  };

  return (
    <div className="body-game">
      <h2>🧍 Human Body Label Game</h2>
      <div className="info">⭐ {score}</div>

      <div className="question">
        <p>Hint: {bodyParts[currentIndex].hint}</p>
      </div>

      <input
        placeholder="Enter the body part"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
      />
      <button onClick={submitAnswer} disabled={!userAnswer.trim()}>
        Submit Answer
      </button>

      {/* Save score */}
      <button
        className="save-score-btn"
        onClick={submitScore}
      >
        Save Score
      </button>

      <button
        className="back-subjects-btn"
        onClick={() => navigate("/games")}
      >
        Back to Subjects
      </button>
    </div>
  );
}
