import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./QuizResults.css";

export default function QuizResults() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const res = await axios.get("http://localhost:8081/api/quiz-results/all");
      setResults(res.data);
    };
    fetchResults();
  }, []);

 
  const groupedByQuiz = results.reduce((acc, r) => {
    if (!acc[r.quizTitle]) acc[r.quizTitle] = [];
    acc[r.quizTitle].push(r);
    return acc;
  }, {});

 
  const quizStats = Object.keys(groupedByQuiz).map((quizTitle) => {
    const quizResults = groupedByQuiz[quizTitle];

    const totalScore = quizResults.reduce((sum, r) => sum + r.score, 0);
    const totalMarks = quizResults.reduce((sum, r) => sum + r.total, 0);

    const average = Math.round((totalScore / totalMarks) * 100);

    
    let passCount = 0;
    let failCount = 0;
    quizResults.forEach(r => {
      const percentage = (r.score / r.total) * 100;
      if (percentage >= 50) passCount++;
      else failCount++;
    });

    
    const topStudents = [...quizResults]
      .sort((a, b) => (b.score / b.total) - (a.score / a.total))
      .slice(0, 5)
      .map(r => ({
        name: r.studentName,
        percentage: Math.round((r.score / r.total) * 100),
      }));

    return {
      quizTitle,
      average,
      totalStudents: quizResults.length,
      passCount,
      failCount,
      topStudents,
      quizResults
    };
  });

  return (
    <div className="quiz-results-container">
      <h2>Quiz Results Dashboard</h2>

      {quizStats.map((quiz, idx) => {
        const barData = {
          labels: quiz.quizResults.map(r => r.studentName),
          datasets: [
            {
              label: "Score %",
              data: quiz.quizResults.map(r => Math.round((r.score / r.total) * 100)),
              backgroundColor: "#2563eb"
            }
          ]
        };

        const pieData = {
          labels: ["Pass", "Fail"],
          datasets: [
            {
              data: [quiz.passCount, quiz.failCount],
              backgroundColor: ["#22c55e", "#ef4444"]
            }
          ]
        };

        return (
          <div key={idx} className="quiz-section">
            <h3>{quiz.quizTitle}</h3>
            <p>Students Attempted: {quiz.totalStudents}</p>
            <p>Average Score: {quiz.average}%</p>

            {/* BAR CHART */}
            <div className="chart-section">
              <h4>Student Performance</h4>
              <Bar data={barData} />
            </div>

            {/* PIE CHART */}
            <div className="chart-section">
              <h4>Pass vs Fail</h4>
              <div style={{ maxWidth: "350px", margin: "auto" }}>
                <Pie data={pieData} />
              </div>
            </div>

            {/* TOP STUDENTS */}
            <div className="top-students">
              <h4>Top Students</h4>
              <ul>
                {quiz.topStudents.map((s, i) => (
                  <li key={i}>
                    <span>#{i + 1} {s.name}</span>
                    <strong>{s.percentage}%</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}