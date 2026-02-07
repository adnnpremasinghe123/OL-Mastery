import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./VocabularyMatchGame.css";

const API_BASE = "http://localhost:8081/api/vocabulary-match";

const vocabList = [
  { word: "Ephemeral", meaning: "Lasting for a very short time" },
  { word: "Ubiquitous", meaning: "Present everywhere" },
  { word: "Cacophony", meaning: "Harsh, discordant sound" },
  { word: "Loquacious", meaning: "Very talkative" },
  { word: "Obfuscate", meaning: "Make something unclear" },
];

export default function VocabularyMatchGame() {
  const navigate = useNavigate();
  const [shuffledWords, setShuffledWords] = useState([]);
  const [shuffledMeanings, setShuffledMeanings] = useState([]);
  const [matches, setMatches] = useState({});
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    startGame();
  }, []);

  const startGame = () => {
    setShuffledWords([...vocabList].sort(() => Math.random() - 0.5));
    setShuffledMeanings([...vocabList].sort(() => Math.random() - 0.5));
    setMatches({});
    setScore(0);
    setCompleted(false);
  };

  const handleMatch = (word, meaning) => {
    // Ignore if already matched
    if (matches[word]) return;

    setMatches(prev => ({ ...prev, [word]: meaning }));

    const correctMeaning = vocabList.find(v => v.word === word).meaning;
    if (meaning === correctMeaning) {
      setScore(prev => prev + 20);
    }

    // Check if game completed
    if (Object.keys(matches).length + 1 === vocabList.length) {
      setCompleted(true);
    }
  };

  const submitScore = async () => {
    if (!user) return alert("User not logged in");

    try {
      await axios.post(`${API_BASE}/submit`, {
        userId: user.id,
        userName: user.name,
        score,
      });
      alert("Score submitted successfully!");
      startGame();
    } catch (err) {
      console.error(err);
      alert("Failed to submit score");
    }
  };

  return (
    <div className="vocab-game">
      <button className="back-btn" onClick={() => navigate("/games")}>
        ← Back to Subjects
      </button>

      <h2>📚 Vocabulary Match Game</h2>
      <div className="score">⭐ Score: {score}</div>

      <div className="game-board">
        <div className="words-column">
          <h3>Words</h3>
          {shuffledWords.map((v, idx) => (
            <div
              key={idx}
              className={`word-card ${matches[v.word] ? "matched" : ""}`}
            >
              {v.word}
            </div>
          ))}
        </div>

        <div className="meanings-column">
          <h3>Meanings</h3>
          {shuffledMeanings.map((v, idx) => (
            <button
              key={idx}
              className={`meaning-card ${
                Object.values(matches).includes(v.meaning) ? "matched" : ""
              }`}
              onClick={() => {
                const nextWord = shuffledWords.find(w => !matches[w.word]);
                if (!nextWord) return;
                handleMatch(nextWord.word, v.meaning);
              }}
            >
              {v.meaning}
            </button>
          ))}
        </div>
      </div>

      {completed && (
        <div className="completion">
          <h3>🎉 Game Completed!</h3>
          <p>Your Score: {score}</p>
          <button onClick={submitScore}>Submit Score & Restart</button>
        </div>
      )}
    </div>
  );
}
