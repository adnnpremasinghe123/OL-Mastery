import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateQuiz.css";

export default function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: [""], correctAnswer: "" }]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const addQuestion = (e) => {
    e.preventDefault();
    setQuestions([...questions, { question: "", options: [""], correctAnswer: "" }]);
  };

  const addOption = (e, qIndex) => {
    e.preventDefault();
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const removeOption = (e, qIndex, optIndex) => {
    e.preventDefault();
    const updated = [...questions];
    if (updated[qIndex].options.length > 1) {
      updated[qIndex].options.splice(optIndex, 1);
      setQuestions(updated);
    }
  };

  const changeQuestionText = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].question = value;
    setQuestions(updated);
  };

  const changeOptionText = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const setCorrectAnswer = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quizTitle.trim()) return setError("Quiz title is required.");
    for (let q of questions) {
      if (!q.question.trim()) return setError("All questions must have text.");
      if (q.options.some((opt) => !opt.trim())) return setError("All options must be filled.");
      if (!q.correctAnswer) return setError("Each question must have a correct answer.");
    }

    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user")) || {};
      const quizData = {
        title: quizTitle,
        questions: questions.map((q) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
        })),
        userName: user.name || "Teacher",
        userRole: user.role || "teacher",
      };

      await axios.post("http://localhost:8081/api/quizzes", quizData);

      alert("Quiz created successfully!");
      setQuizTitle("");
      setQuestions([{ question: "", options: [""], correctAnswer: "" }]);
    } catch (err) {
      console.error("Quiz Create Error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to create quiz");
    }
  };

  return (
    <div className="create-quiz-container">
      <h2>Create New Quiz</h2>

      <button className="view-quizzes-btn" onClick={() => navigate("/student/quiz/:id")}>
        View Quizzes
      </button>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Quiz Title</label>
        <input
          type="text"
          value={quizTitle}
          placeholder="Enter quiz title"
          onChange={(e) => setQuizTitle(e.target.value)}
          className="quiz-title-input"
        />
      </div>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="question-card">
          <div className="question-header">
            <h4>Question {qIndex + 1}</h4>
          </div>
          <input
            type="text"
            placeholder="Enter question"
            value={q.question}
            onChange={(e) => changeQuestionText(qIndex, e.target.value)}
            className="question-input"
          />

          <div className="options-section">
            <label>Options</label>
            {q.options.map((opt, optIndex) => (
              <div key={optIndex} className="option-row">
                <input
                  type="text"
                  placeholder={`Option ${optIndex + 1}`}
                  value={opt}
                  onChange={(e) => changeOptionText(qIndex, optIndex, e.target.value)}
                  className="option-input-field"
                />
                <button className="remove-option-btn" onClick={(e) => removeOption(e, qIndex, optIndex)}>
                  ✕
                </button>
              </div>
            ))}
            <button className="add-option-btn" onClick={(e) => addOption(e, qIndex)}>
              + Add Option
            </button>
          </div>

          <div className="correct-answer-section">
            <label>Correct Answer</label>
            <select value={q.correctAnswer} onChange={(e) => setCorrectAnswer(qIndex, e.target.value)}>
              <option value="">Select Answer</option>
              {q.options.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt || `Option ${i + 1}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <div className="quiz-actions">
        <button className="add-question-btn" onClick={addQuestion}>
          + Add New Question
        </button>
        <button className="submit-quiz-btn" onClick={handleSubmit}>
          Save Quiz
        </button>
      </div>
    </div>
  );
}
