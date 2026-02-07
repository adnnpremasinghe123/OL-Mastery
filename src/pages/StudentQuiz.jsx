import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StudentQuiz.css";

export default function StudentQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();

  /* ---------------- Fetch Quizzes ---------------- */
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/quizzes/all");
        setQuizzes(res.data || []);
      } catch (err) {
        console.error("Error loading quizzes:", err);
        setQuizzes([]);
      }
    };
    fetchQuizzes();
  }, []);

  /* ---------------- Delete Quiz ---------------- */
  const handleDeleteQuiz = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await axios.delete(`http://localhost:8081/api/quizzes/${id}`, {
        data: { userRole: user.role, userName: user.name },
      });
      setQuizzes(quizzes.filter((q) => q._id !== id));
      alert("Quiz deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete quiz");
    }
  };

  /* ---------------- Select Quiz ---------------- */
  const handleSelectQuiz = (quiz) => {
    if (quiz._id === "auto") {
      setSelectedQuiz(generateRandomQuiz());
    } else {
      setSelectedQuiz(quiz);
    }
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  /* ---------------- Auto Quiz ---------------- */
  const generateRandomQuiz = () => {
    const questions = [];

    for (let i = 0; i < 5; i++) {
      if (Math.random() < 0.5) {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const correct = a + b;
        const options = [correct, correct + 1, correct - 1, correct + 2]
          .sort(() => Math.random() - 0.5)
          .map(String);

        questions.push({
          question: `What is ${a} + ${b}?`,
          options,
          correctAnswer: String(correct),
        });
      } else {
        const general = [
          {
            question: "What is the capital of France?",
            options: ["Paris", "London", "Rome", "Berlin"],
            correctAnswer: "Paris",
          },
          {
            question: "Which planet is known as the Red Planet?",
            options: ["Mars", "Venus", "Jupiter", "Saturn"],
            correctAnswer: "Mars",
          },
        ];
        questions.push(general[Math.floor(Math.random() * general.length)]);
      }
    }

    return {
      _id: `auto-${Date.now()}`,
      title: "Auto-Generated Quiz",
      questions,
    };
  };

  /* ---------------- Submit Quiz ---------------- */
  const handleSubmit = async () => {
    let total = 0;
    selectedQuiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) total++;
    });

    setScore(total);
    setSubmitted(true);

    try {
      await axios.post("http://localhost:8081/api/quiz-results/submit", {
        studentId: user._id || "guest",
        studentName: user.name || "Guest",
        quizId: selectedQuiz._id,
        quizTitle: selectedQuiz.title,
        score: total,
        total: selectedQuiz.questions.length,
      });
    } catch (err) {
      console.error("Failed to submit quiz result:", err);
    }
  };

  /* ================= QUIZ LIST PAGE ================= */
  if (!selectedQuiz) {
    return (
      <div className="student-quiz-container">
        <h2>Available Quizzes</h2>

        {user.role === "teacher" && (
          <button
            className="view-quiz-results-btn"
            onClick={() => navigate("/teacher/quiz-results")}
            style={{ marginBottom: "24px" }}
          >
            View Quiz Results
          </button>
        )}

        <ul className="quiz-list">
          {quizzes.map((quiz) => (
            <li key={quiz._id} className="quiz-item">
              <span>{quiz.title}</span>

              <div className="quiz-actions">
                <button onClick={() => handleSelectQuiz(quiz)}>
                  Attempt
                </button>

                {user.role === "admin" && (
                  <>
                    <button className="edit-btn">Edit</button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteQuiz(quiz._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}

          {/* Auto Quiz */}
          <li className="quiz-item">
            <span>Auto-Generated Quiz</span>
            <div className="quiz-actions">
              <button onClick={() => handleSelectQuiz({ _id: "auto" })}>
                Attempt
              </button>
            </div>
          </li>
        </ul>
      </div>
    );
  }

  /* ================= QUIZ ATTEMPT PAGE ================= */
  return (
    <div className="student-quiz-container">
      <h2>{selectedQuiz.title}</h2>

      {selectedQuiz.questions.map((q, index) => (
        <div key={index} className="question-card">
          <p className="question-title">
            {index + 1}. {q.question}
          </p>

          {q.options.map((opt, i) => (
            <div key={i} className="option">
              <input
                type="radio"
                id={`q${index}_${i}`}
                name={`question_${index}`}
                value={opt}
                checked={answers[index] === opt}
                onChange={() =>
                  setAnswers({ ...answers, [index]: opt })
                }
                disabled={submitted}
              />
              <label htmlFor={`q${index}_${i}`}>{opt}</label>
            </div>
          ))}
        </div>
      ))}

      {!submitted ? (
        <button className="submit-quiz-btn" onClick={handleSubmit}>
          Submit Quiz
        </button>
      ) : (
        <div className="result-box">
          <h3>
            You scored {score} / {selectedQuiz.questions.length}
          </h3>
          <button onClick={() => setSelectedQuiz(null)}>
            Back to Quizzes
          </button>
        </div>
      )}
    </div>
  );
}
