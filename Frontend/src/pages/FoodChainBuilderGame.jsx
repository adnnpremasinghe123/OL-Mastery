import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  
import "./FoodChainBuilderGame.css";

const API_BASE = "http://localhost:8081/api/food-chain";

export default function FoodChainBuilderGame() {
  const navigate = useNavigate();  

  const [availableOrganisms, setAvailableOrganisms] = useState([]);
  const [currentChain, setCurrentChain] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);

 
  const [user, setUser] = useState(null);

  const foodChains = [
    ["Grass", "Rabbit", "Fox"],
    ["Algae", "Small Fish", "Big Fish", "Eagle"],
    ["Plant", "Insect", "Frog", "Snake"],
  ];

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const shuffleOrganisms = () => {
    const organisms = Array.from(new Set(foodChains.flat())).sort(
      () => Math.random() - 0.5
    );
    setAvailableOrganisms(organisms);
  };

  useEffect(() => {
    shuffleOrganisms();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) setGameOver(true);
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const addOrganism = (org) => {
    setCurrentChain([...currentChain, org]);
  };

  const submitChain = () => {
    const correct = foodChains.some(
      (chain) => chain.join() === currentChain.join()
    );
    if (correct) {
      setScore(score + 20);
      alert("Correct chain! +20 points");
    } else {
      alert("Incorrect chain.");
    }
    setCurrentChain([]);
  };

  
  const submitScore = async () => {
    if (!user) {
      alert("User not logged in");
      return;
    }

    try {
      await axios.post(`${API_BASE}/submit`, {
        userId: user.id,    // or user._id depending on your DB
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
    <div className="foodchain-game">

      {/* 🔙 Back Button */}
      <button className="back-btn" onClick={() => navigate("/games")}>
        ← Back to Subjects
      </button>

      <h2>🌿 Food Chain Builder</h2>

      <div className="info">
        <span>⏱ {timeLeft}s</span>
        <span>⭐ {score}</span>
      </div>

      {!gameOver ? (
        <>
          <div className="available">
            <h4>Available Organisms</h4>
            <div className="organism-list">
              {availableOrganisms.map((org, idx) => (
                <button key={idx} onClick={() => addOrganism(org)}>
                  {org}
                </button>
              ))}
            </div>
          </div>

          <div className="current-chain">
            <h4>Current Chain</h4>
            <div>{currentChain.join(" → ") || "Add organisms here"}</div>
            <button onClick={submitChain} disabled={currentChain.length === 0}>
              Submit Chain
            </button>
          </div>
        </>
      ) : (
        <div className="game-over">
          <h3>Game Over!</h3>
          <p><strong>{user?.name}</strong>, your score is: {score}</p>
          <button onClick={submitScore}>Save Score & Restart</button>
        </div>
      )}
    </div>
  );
}
