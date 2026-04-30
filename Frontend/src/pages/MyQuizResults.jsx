import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./MyQuizResults.css";

export default function QuizResults() {
  const [results, setResults] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/quiz-results/${user.name}/results`)
      .then((res) => setResults(res.data || []))
      .catch(() => alert("Failed to load results"));
  }, [user.name]);

  /* -------- Calculate Average -------- */
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const totalMarks = results.reduce((sum, r) => sum + r.total, 0);
  const average =
    totalMarks === 0 ? 0 : ((totalScore / totalMarks) * 100).toFixed(1);

  /* -------- Prepare Chart Data -------- */
  const chartData = results.map((r) => ({
    name: r.quizTitle,
    score: r.score,
  }));

  return (
    <div className="quiz-results-container">
      <h2>My Quiz Results</h2>

      {/* -------- Summary Cards -------- */}
      <div className="summary-cards">
        <div className="card">
          <h3>Total Quizzes</h3>
          <p>{results.length}</p>
        </div>

        <div className="card">
          <h3>Average (%)</h3>
          <p>{average}%</p>
        </div>
      </div>

      {/* -------- Chart -------- */}
      {results.length > 0 && (
        <div className="chart-container">
          <h3>Performance Chart</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* -------- Table -------- */}
      {results.length === 0 ? (
        <p className="no-results">No results found.</p>
      ) : (
        <table className="quiz-results-table">
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Score</th>
              <th>Total</th>
              <th>Percentage</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {results.map((r) => {
              const percent = ((r.score / r.total) * 100).toFixed(1);

              return (
                <tr key={r._id}>
                  <td>{r.quizTitle}</td>
                  <td>{r.score}</td>
                  <td>{r.total}</td>
                  <td>{percent}%</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}