// pages/QuizResults.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./QuizResults.css";

export default function QuizResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/quiz-results/all");
        setResults(res.data);
      } catch (err) {
        console.error("Fetch Results Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) return <p>Loading results...</p>;

  return (
    <div className="quiz-results-container">
      <h2>Student Quiz Results</h2>
      <table className="results-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Quiz Title</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {results.length > 0 ? results.map((r, idx) => (
            <tr key={r._id}>
              <td>{idx + 1}</td>
              <td>{r.studentName}</td>
              <td>{r.quizTitle}</td>
              <td>{r.score} / {r.total}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>No results found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
