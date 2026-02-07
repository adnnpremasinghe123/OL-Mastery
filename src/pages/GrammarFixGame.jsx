import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  
import "./GrammarFixGame.css";

const API_BASE = "http://localhost:8081/api/grammar-fix";

const sampleSentences = [
  { wrong: "He go to school every day.", correct: "He goes to school every day." },
  { wrong: "She don't like apples.", correct: "She doesn't like apples." },
  { wrong: "I has a pen.", correct: "I have a pen." },
  { wrong: "They is playing football.", correct: "They are playing football." },
  { wrong: "We was late to class.", correct: "We were late to class." },
];

export default function GrammarFixGame() {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);

  // 🔹 Logged-in user from localStorage
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Pick a random sentence
  const nextSentence = () => {
    setCurrentIndex(Math.floor(Math.random() * sampleSentences.length));
    setUserAnswer("");
  };

  useEffect(() => {
    nextSentence();
  }, []);

  const submitAnswer = () => {
    const correctAnswer = sampleSentences[currentIndex].correct.trim().toLowerCase();

    if (userAnswer.trim().toLowerCase() === correctAnswer) {
      setScore(prev => prev + 20);
      alert("Correct! +20 points");
    } else {
      alert(`Incorrect! Correct: "${sampleSentences[currentIndex].correct}"`);
    }
    nextSentence();
  };

  // 🔹 Save score using logged-in user
  const submitScore = async () => {
    if (!user) {
      alert("User not logged in");
      return;
    }

    try {
      await axios.post(`${API_BASE}/submit`, {
        userId: user.id,      // or user._id depending on your DB
        userName: user.name,
        score
      });

      alert("Score submitted successfully!");
      window.location.reload(); // 🔹 refresh page after saving score
    } catch (err) {
      console.error(err);
      alert("Failed to submit score");
    }
  };

  return (
    <div className="grammar-game">

      {/* 🔙 Back Button */}
      <button className="back-btn" onClick={() => navigate("/games")}>
        ← Back to Subjects
      </button>

      <h2>📝 Grammar Fix Game</h2>
      <div className="info">⭐ {score}</div>

      <div className="sentence">
        <p>{sampleSentences[currentIndex].wrong}</p>
      </div>

      <input
        placeholder="Type the correct sentence"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
      />

      <button onClick={submitAnswer} disabled={!userAnswer.trim()}>
        Submit Answer
      </button>

      {/* 🔹 Save score button (no manual ID/Name) */}
      <div className="student-info">
        <button onClick={submitScore}>Submit Score & Restart</button>
      </div>
    </div>
  );
}
