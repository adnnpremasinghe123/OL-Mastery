import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentQuiz.css";

export default function StudentQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // ----------------------------
  // Function to generate random math/general questions
  // ----------------------------
  const generateRandomQuiz = () => {
    const quizQuestions = [];

    // Example: 5 random questions
    for (let i = 0; i < 5; i++) {
      const type = Math.random() < 0.5 ? "math" : "general";

      if (type === "math") {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const correct = a + b;
        const options = [
          correct,
          correct + 1,
          correct - 1,
          correct + 2,
        ].sort(() => Math.random() - 0.5); // shuffle options

        quizQuestions.push({
          question: `What is ${a} + ${b}?`,
          options: options.map(String),
          correctAnswer: String(correct),
        });
      } else {
        const generalQuestions = [
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
          {
            question: "Which is a programming language?",
            options: ["HTML", "Python", "CSS", "Photoshop"],
            correctAnswer: "Python",
          },
        ];
        const randomIndex = Math.floor(Math.random() * generalQuestions.length);
        quizQuestions.push(generalQuestions[randomIndex]);
      }
    }

    return {
      _id: `auto-${Date.now()}`, // unique ID for each attempt
      title: "Auto-Generated Quiz",
      questions: quizQuestions,
    };
  };

  // ----------------------------
  // Fetch teacher quizzes from backend
  // ----------------------------
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/quizzes/all");
        setQuizzes(res.data || []);
      } catch (err) {
        console.error("Error loading quizzes:", err);
        setQuizzes([]); // fallback: empty
      }
    };
    fetchQuizzes();
  }, []);

  // ----------------------------
  // Select a quiz to attempt
  // ----------------------------
  const handleSelectQuiz = (quiz) => {
    if (quiz._id.startsWith("auto")) {
      // regenerate quiz dynamically
      setSelectedQuiz(generateRandomQuiz());
    } else {
      setSelectedQuiz(quiz);
    }
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const handleSelectAnswer = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = () => {
    let total = 0;
    selectedQuiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) total += 1;
    });
    setScore(total);
    setSubmitted(true);
  };

  // ----------------------------
  // Render quiz list or selected quiz
  // ----------------------------
  if (!selectedQuiz) {
    return (
      <div className="student-quiz-container">
        <h2>Available Quizzes</h2>
        {quizzes.length === 0 && <p>No quizzes available.</p>}
        <ul className="quiz-list">
          {quizzes.map((quiz) => (
            <li key={quiz._id}>
              <span>{quiz.title}</span>
              <button onClick={() => handleSelectQuiz(quiz)}>
                Attempt Quiz
              </button>
            </li>
          ))}
          {/* Add auto-generated quiz option */}
          <li key="auto">
            <span>Auto-Generated Quiz</span>
            <button onClick={() => handleSelectQuiz({ _id: "auto" })}>
              Attempt Quiz
            </button>
          </li>
        </ul>
      </div>
    );
  }

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
                id={`q${index}_opt${i}`}
                name={`question_${index}`}
                value={opt}
                checked={answers[index] === opt}
                onChange={() => handleSelectAnswer(index, opt)}
                disabled={submitted}
              />
              <label htmlFor={`q${index}_opt${i}`}>{opt}</label>
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
          <button onClick={() => setSelectedQuiz(null)}>Back to Quizzes</button>
        </div>
      )}
    </div>
  );
}
