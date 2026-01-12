import React, { useState } from "react";
import axios from "axios";
import "./CreateQuiz.css";

export default function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: [""], correctAnswer: "" },
  ]);
  const [error, setError] = useState("");

  // -------------------------
  // Add New Question
  // -------------------------
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: [""], correctAnswer: "" },
    ]);
  };

  // -------------------------
  // Add Option to Question
  // -------------------------
  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  // -------------------------
  // Remove Option
  // -------------------------
  const removeOption = (qIndex, optIndex) => {
    const updated = [...questions];
    if (updated[qIndex].options.length > 1) {
      updated[qIndex].options.splice(optIndex, 1);
      setQuestions(updated);
    }
  };

  // -------------------------
  // Change Question Text
  // -------------------------
  const changeQuestionText = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].question = value;
    setQuestions(updated);
  };

  // -------------------------
   // Change Option Text
  // -------------------------
  const changeOptionText = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  // -------------------------
  // Change Correct Answer
  // -------------------------
  const setCorrectAnswer = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = value;
    setQuestions(updated);
  };

  // -------------------------
  // Submit Quiz
  // -------------------------
  const handleSubmit = async () => {
    // Validation
    if (!quizTitle.trim()) {
      setError("Quiz title is required.");
      return;
    }

    for (let q of questions) {
      if (!q.question.trim()) {
        setError("All questions must have text.");
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        setError("All options must be filled.");
        return;
      }
      if (!q.correctAnswer) {
        setError("Each question must have a correct answer.");
        return;
      }
    }

    setError("");

    try {
      const teacher = JSON.parse(localStorage.getItem("user"));

      const quizData = {
        title: quizTitle,
        questions: questions.map((q) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
        })),
       teacherId: teacher?._id || null

      };

      await axios.post("http://localhost:8081/api/quizzes/create", quizData);

      alert("Quiz created successfully!");

      // Reset form
      setQuizTitle("");
      setQuestions([{ question: "", options: [""], correctAnswer: "" }]);
    } catch (err) {
      console.error("Quiz Create Error:", err.response?.data || err); // ✅ DEBUG LOG
      alert(err.response?.data?.message || "Failed to create quiz");  // ✅ USER ERROR
    }
  };

  return (
    <div className="create-quiz-container">
      <h2 className="create-quiz-title">Create New Quiz</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Quiz Title */}
      <label>Quiz Title</label>
      <input
        type="text"
        value={quizTitle}
        placeholder="Enter quiz title"
        onChange={(e) => setQuizTitle(e.target.value)}
      />

      {/* Questions Section */}
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="question-card">
          <p className="question-title">Question {qIndex + 1}</p>

          <input
            type="text"
            placeholder="Enter question"
            value={q.question}
            onChange={(e) => changeQuestionText(qIndex, e.target.value)}
          />

          {/* Options */}
          <label>Options</label>
          {q.options.map((opt, optIndex) => (
            <div key={optIndex} className="option-input">
              <input
                type="text"
                placeholder={`Option ${optIndex + 1}`}
                value={opt}
                onChange={(e) =>
                  changeOptionText(qIndex, optIndex, e.target.value)
                }
              />
              <button
                className="remove-option-btn"
                onClick={() => removeOption(qIndex, optIndex)}
              >
                Remove
              </button>
            </div>
          ))}

          {/* Add Option */}
          <button className="add-option-btn" onClick={() => addOption(qIndex)}>
            + Add Option
          </button>

          {/* Correct Answer */}
          <label>Select Correct Answer</label>
          <select
            value={q.correctAnswer}
            onChange={(e) => setCorrectAnswer(qIndex, e.target.value)}
          >
            <option value="">Select Answer</option>
            {q.options.map((opt, index) => (
              <option key={index} value={opt}>
                {opt || `Option ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      ))}

      <button className="add-question-btn" onClick={addQuestion}>
        + Add New Question
      </button>

      <button className="submit-quiz-btn" onClick={handleSubmit}>
        Save Quiz
      </button>
    </div>
  );
}
