import React, { useState } from "react";
import axios from "axios";
import mammoth from "mammoth";
import "./CreateQuiz.css";
import { useNavigate } from "react-router-dom";

export default function CreateQuiz() {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [timeLimit, setTimeLimit] = useState(30);
  const [error, setError] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [showQuizzes, setShowQuizzes] = useState(false);
  const [title, setTitle] = useState("");


  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");

  const name = localStorage.getItem("name");
  const navigate = useNavigate();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  
  const extractQuestions = (text) => {
    const lines = text.split("\n").filter((l) => l.trim() !== "");
    let parsed = [];
    let current = null;
    let extractedTimeLimit = 30;
    let extractedTitle = "";

    lines.forEach((line, index) => {
      line = line.trim();

     
      if (index === 0 || /^title\s*:/i.test(line)) {
        extractedTitle = line.replace(/^title\s*:/i, "").trim();
        return;
      }

     
      if (/^(Time|Duration)\s*:/i.test(line)) {
        const limit = parseInt(line.split(":")[1]?.trim());
        if (!isNaN(limit)) extractedTimeLimit = limit;
        return;
      }

  
      if (/^\d+\./.test(line)) {
        if (current) parsed.push(current);
        current = {
          question: line.replace(/^\d+\.\s*/, ""),
          options: [],
          correctAnswer: "",
        };
      }
   
      else if (/^[A-D][\).\s]/.test(line)) {
        current?.options.push(line.replace(/^[A-D][\).\s]*/, "").trim());
      }
      
      else if (line.toLowerCase().includes("answer")) {
        const key = line.split(":")[1]?.trim();
        const map = { A: 0, B: 1, C: 2, D: 3 };
        if (map[key] !== undefined && current) {
          current.correctAnswer = current.options[map[key]];
        }
      }
    });

    if (current) parsed.push(current);
    setQuestions(parsed);
    setTimeLimit(extractedTimeLimit);
    setTitle(extractedTitle || "Untitled Quiz");
    setError("");
  };


  const handleFileUpload = async () => {
    if (!file) return setError("Upload a file first");

    const type = file.name.split(".").pop().toLowerCase();

    try {
      if (type === "html") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const doc = new DOMParser().parseFromString(
            e.target.result,
            "text/html"
          );
          extractQuestions(doc.body.innerText);
        };
        reader.readAsText(file);
      } else if (type === "docx") {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const result = await mammoth.extractRawText({
            arrayBuffer: e.target.result,
          });
          extractQuestions(result.value);
        };
        reader.readAsArrayBuffer(file);
      } else {
        setError("Only HTML or DOCX allowed");
      }
    } catch (err) {
      console.error(err);
      setError("File processing error");
    }
  };

  
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  
  const handleSaveQuiz = async () => {
    if (!startDate || !startTime) {
      return setError("Please select date and time");
    }

    try {
      const cleanQuestions = questions.map((q) => {
        const shuffled = shuffle(q.options);
        const correct = shuffled.find(
          (opt) => opt.trim() === q.correctAnswer.trim()
        );
        return { question: q.question, options: shuffled, correctAnswer: correct };
      });

      await axios.post("http://localhost:8081/api/quizzes", {
        title,
        questions: cleanQuestions,
        name,
        timeLimit,
        startDate,
        startTime,
      });

      alert("Quiz Saved & Emails Sent!");
      setQuestions([]);
      setTitle("");
      setStartDate("");
      setStartTime("");
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.message || "Save failed");
    }
  };

  
  const handleShowQuizzes = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/quizzes/all");
      const teacherQuizzes = res.data.filter((q) => q.createdBy === name);
      setQuizzes(teacherQuizzes);
      setShowQuizzes(true);
    } catch (err) {
      setError("Failed to fetch quizzes");
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await axios.delete(`http://localhost:8081/api/quizzes/${quizId}`);
      setQuizzes(quizzes.filter((q) => q._id !== quizId));
      alert("Quiz deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete quiz");
    }
  };

  return (
    <div className="create-quiz-container">
      <h2>Create Quiz</h2>

      <input type="file" onChange={handleFileChange} />

      <div style={{ marginTop: "15px" }}>
        <button onClick={handleFileUpload}>Convert</button>
        <button onClick={() => navigate("/student/quiz/:id")}>
          Go to Student Page
        </button>
      </div>

      <div style={{ marginTop: "15px" }}>
        <label>Quiz Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label style={{ marginLeft: "10px" }}>Start Time:</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      {error && <p className="error">{error}</p>}

      {title && <h3 className="quiz-title">{title}</h3>}

      {questions.map((q, i) => (
        <div key={i} className="question-block">
          <h4>{q.question}</h4>
          {q.options.map((o, j) => (
            <p key={j} className={o === q.correctAnswer ? "correct" : "incorrect"}>
              {o}
            </p>
          ))}
        </div>
      ))}

      {questions.length > 0 && (
        <button onClick={handleSaveQuiz}>Save Quiz (Time: {timeLimit} mins)</button>
      )}

      <hr />

      <button onClick={handleShowQuizzes}>Show My Quizzes</button>

      {showQuizzes &&
        quizzes.map((quiz) => (
          <div key={quiz._id} className="question-block">
            <h4>{quiz.title}</h4>
            <p>Teacher: {name}</p>
            <p>Questions: {quiz.questions.length}</p>
            <p>Time: {quiz.timeLimit} mins</p>
            <p>Start: {new Date(quiz.startTime).toLocaleString()}</p>
            <button
              onClick={() => handleDeleteQuiz(quiz._id)}
              style={{
                marginTop: "5px",
                padding: "5px 10px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Delete Quiz
            </button>
          </div>
        ))}
    </div>
  );
}