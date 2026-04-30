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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [cheatingFlags, setCheatingFlags] = useState({
  tabSwitches: 0,
  fastAnswers: 0,
  copyPaste: 0,
  fullscreenElements: 0,
});
const [examStarted, setExamStarted] = useState(false);

const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const [countdown, setCountdown] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  /* ---------------- Load quizzes from API ---------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/"); // redirect if not logged in
      return;
    }

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
  }, [navigate]);

  /* ---------------- Timer for exam ---------------- */
  useEffect(() => {
    if (!timeLeft || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  /* ---------------- Countdown for quiz start ---------------- */
  useEffect(() => {
    if (!selectedQuiz || !selectedQuiz.startTime) return;

    const now = new Date();
    const start = new Date(selectedQuiz.startTime);

    if (now < start) {
      const countdownTimer = setInterval(() => {
        const diff = start - new Date();
        if (diff <= 0) {
          setCountdown(null);
          clearInterval(countdownTimer);
          setTimeLeft((selectedQuiz.timeLimit || 30) * 60); // start timer
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setCountdown(`${minutes}:${seconds.toString().padStart(2, "0")}`);
        }
      }, 1000);

      return () => clearInterval(countdownTimer);
    }
  }, [selectedQuiz]);
  //tab switch detection
  useEffect(() => {
  if (!examStarted) return;

  const handleVisibilityChange = () => {
    if (document.hidden) {
      setCheatingFlags((prev) => ({
        ...prev,
        tabSwitches: prev.tabSwitches + 1,
      }));
      alert("⚠️ Tab switching detected!");
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, [examStarted]);


//copy-paste detection
useEffect(() => {
  if (!examStarted) return;

  const handleCopy = () => {
    setCheatingFlags((prev) => ({
      ...prev,
      copyPaste: prev.copyPaste + 1,
    }));
    alert("⚠️ Copy detected!");
  };

  const handlePaste = () => {
    setCheatingFlags((prev) => ({
      ...prev,
      copyPaste: prev.copyPaste + 1,
    }));
    alert("⚠️ Paste detected!");
  };

  document.addEventListener("copy", handleCopy);
  document.addEventListener("paste", handlePaste);

  return () => {
    document.removeEventListener("copy", handleCopy);
    document.removeEventListener("paste", handlePaste);
  };
}, [examStarted]);

//fast answer detection
useEffect(() => {
  if (!examStarted) return;
  setQuestionStartTime(Date.now());
}, [currentQuestion, examStarted]);

//full screen detection

useEffect(() => {
  if (!examStarted) return;

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement && !submitted) {
      setCheatingFlags((prev) => ({
        ...prev,
        fullscreenElements: prev.fullscreenElements + 1,
      }));
      alert("⚠️ Fullscreen exit detected!");
    }
  };

  document.addEventListener("fullscreenchange", handleFullscreenChange);

  return () => {
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
  };
}, [examStarted, submitted]);



  /* ---------------- Select Quiz ---------------- */
const handleSelectQuiz = (quiz) => {
  const now = new Date();
  const quizStart = new Date(quiz.startTime);
  const quizEnd = new Date(quizStart.getTime() + (quiz.timeLimit || 30) * 60000);

  if (now < quizStart) {
    // Quiz hasn't started yet
    let diff = Math.floor((quizStart - now) / 1000); // seconds
    const days = Math.floor(diff / 86400);
    diff %= 86400;
    const hours = Math.floor(diff / 3600);
    diff %= 3600;
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    alert(
      `Quiz has not started yet. Starts in ${days}d ${hours}h ${minutes}m ${seconds}s`
    );
    return;
  }

  if (now > quizEnd) {
    // Quiz already finished
    alert("Sorry, this quiz has already ended.");
    return;
  }

  // Quiz started but not finished → calculate remaining time
  const remainingSeconds = Math.floor((quizEnd - now) / 1000);

 setCheatingFlags({
    tabSwitches: 0,
    fastAnswers: 0,
    copyPaste: 0,
    fullscreenElements: 0,
  });

  setSelectedQuiz(quiz);
  setAnswers({});
  setSubmitted(false);
  setScore(0);
  setCurrentQuestion(0);
  
  setCountdown(null);
  setTimeLeft(remainingSeconds);
  setExamStarted(true); // use remaining time
};
  /* ---------------- Submit Quiz ---------------- */
  const handleSubmit = async () => {
    if (!selectedQuiz) return;
    let total = 0;
    selectedQuiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) total++;
    });

    setScore(total);
    setSubmitted(true);
    setExamStarted(false); 

    try {
      await axios.post("http://localhost:8081/api/quiz-results/submit", {
        studentId: user._id || "guest",
        studentName: user.name || "Guest",
        quizId: selectedQuiz._id,
        quizTitle: selectedQuiz.title,
        score: total,
        total: selectedQuiz.questions.length,
       cheatingFlags: cheatingFlags,
      });
    } catch (err) {
      console.error("Failed to submit quiz result:", err);
    }
  };
 
useEffect(() => {
  if (!examStarted) return;

  const cheatingScore =
    cheatingFlags.tabSwitches * 2 +
    cheatingFlags.fastAnswers * 2 +
    cheatingFlags.copyPaste * 2 +
    cheatingFlags.fullscreenElements * 2;

  if (cheatingScore > 8) {
    alert("⚠️ Exam terminated. Too many suspicious activities!");

    handleSubmit();

    setTimeout(() => {
      navigate("/student");
    }, 1000);
  }
}, [cheatingFlags, examStarted, navigate]);

  /* ================= QUIZ LIST PAGE ================= */
  if (!selectedQuiz) {
    return (
      <div className="student-quiz-container">
        <h2>Available Quizzes</h2>
        <table className="quiz-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Created By</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            
            {quizzes.map((quiz) => (
              <tr key={quiz._id}>
                <td>{quiz.title}</td>
                <td>
                  {quiz.createdBy?.name || quiz.createdBy || "Teacher"}{" "}
                  {quiz.creatorRole ? `(${quiz.creatorRole})` : ""}
                </td>
                <td>{new Date(quiz.createdAt).toLocaleDateString()}</td>
                <td>{new Date(quiz.startTime).toLocaleString()}</td>
                <td style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleSelectQuiz(quiz)}
                    style={{
                      padding: "5px 10px",
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Start Exam
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
         <button
  onClick={() => navigate("/my-quiz-results")}
  style={{
    marginRight: "10px",
    padding: "8px 15px",
    background: "#00153e",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  }}
>
  My Quiz Results
</button>

        {(user.role === "teacher" || user.role === "admin") && (
          <button
            onClick={() => navigate("/teacher/quiz-results")}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#1e40af",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Quiz Results Dashboard
          </button>
        )}
      </div>
    );
  }

  const q = selectedQuiz.questions[currentQuestion];

  /* ================= EXAM / RESULT PAGE ================= */
  if (submitted) {
    return (
      <div className="result-box">
        <h2>Exam Completed</h2>
        <p>
          Score: {score} / {selectedQuiz.questions.length}
        </p>

        <button
          onClick={() => setSelectedQuiz(null)}
          style={{
            marginRight: "10px",
            padding: "8px 15px",
            background: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Back to Quizzes
        </button>

       
      </div>
    );
  }

  /* ================= EXAM PAGE ================= */
  return (
    <div className="exam-container">
      <div className="exam-header">
        <h2>{selectedQuiz.title}</h2>
        <div className="timer">
          {countdown ? (
            <>Quiz starts in: {countdown}</>
          ) : (
            <>⏱ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}</>
          )}
        </div>
      </div>

      {!countdown && (
        <div className="exam-body">
          <div className="question-area">
            <h3>
              Question {currentQuestion + 1} of {selectedQuiz.questions.length}
            </h3>
            <p>{q.question}</p>

            {q.options.map((opt, i) => (
              <label key={i} className="option">
            <input
  type="radio"
  name={`q${currentQuestion}`}
  value={opt}
  checked={answers[currentQuestion] === opt}
  onChange={() => {
    const timeTaken = (Date.now() - questionStartTime) / 1000;

    if (timeTaken < 2) {
      setCheatingFlags((prev) => ({
        ...prev,
        fastAnswers: prev.fastAnswers + 1,
      }));
    }

    setAnswers({ ...answers, [currentQuestion]: opt });
  }}
/>


                {opt}
              </label>
            ))}
          </div>

          <div className="question-palette">
            <h4>Questions</h4>
            <div className="palette-grid">
              {selectedQuiz.questions.map((_, i) => (
                <button
                  key={i}
                  className={answers[i] ? "answered" : ""}
                  onClick={() => setCurrentQuestion(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button className="submit-btn" onClick={handleSubmit}>
              Submit Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}