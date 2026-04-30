import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FaUserCircle, 
  FaSignOutAlt, 
  FaTrophy, 
  FaBook, 
  FaClipboardList, 
  FaComments,
  FaVideo 
} from 'react-icons/fa'
import './StudentDashboard.css'
import axios from "axios"

export default function StudentDashboard() {

  const navigate = useNavigate()

  const [studentName, setStudentName] = useState("Student")

  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const name = localStorage.getItem("name")
    if (name) setStudentName(name)
  }, [])

  const goToLeaderboard = () => navigate('/leaderboard')
  const goToQuizzes = () => navigate('/student/quiz/:id')
  const goToResources = () => navigate('/resources')
  const goToDiscussionRoom = () => navigate('/discussionRoom')
  const goToProfile = () => navigate('/update-profile')
  const goToLiveSessions = () => navigate('/student/sessions')
  const goToGames = () => navigate('/games')

const submitFeedback = async (e) => {
  e.preventDefault()

  if (rating === 0) {
    alert("Please select a rating")
    return
  }

  if (!feedback.trim()) {
    alert("Please write your feedback")
    return
  }

  try {
  
    
    const res = await axios.post("http://localhost:8081/api/feedback/submit", {
      studentName,  
      rating,
      message: feedback
    })

    console.log(res.data)

    setSubmitted(true)
    setRating(0)
    setFeedback("")

  } catch (error) {
    console.error("Feedback error:", error)
    alert("Failed to submit feedback")
  }
}


  return (

    <div className="student-dashboard">

      {/* HEADER */}

      <header className="dashboard-header">

        <div className="header-left">
          <h1>Welcome, {studentName}! 🎓</h1>
          <p>Track your progress, compete, and boost your OL preparation.</p>
        </div>

        <div className="header-right">

          <FaUserCircle
            size={40}
            color="#4f46e5"
            className="profile-icon"
            onClick={goToProfile}
            title="View Profile"
          />

          <Link to="/" className="logout-btn">
            <FaSignOutAlt /> Logout
          </Link>

        </div>

      </header>


      {/* FEATURES */}

      <div className="dashboard-features">

        <div className="feature-card" onClick={goToLeaderboard}>
          <FaTrophy size={50} color="#f59e0b" />
          <h3>Leaderboard</h3>
          <p>See your rank, compete, and stay motivated.</p>
          <button>View Leaderboard</button>
        </div>

        <div className="feature-card" onClick={goToQuizzes}>
          <FaClipboardList size={50} color="#10b981" />
          <h3>Quizzes & Challenges</h3>
          <p>Test your skills and improve daily.</p>
          <button>Start Quiz</button>
        </div>

        <div className="feature-card" onClick={goToResources}>
          <FaBook size={50} color="#2563eb" />
          <h3>Learning Resources</h3>
          <p>Notes, tutorials, papers and more.</p>
          <button>Explore Resources</button>
        </div>

        <div className="feature-card" onClick={goToDiscussionRoom}>
          <FaComments size={50} color="#ec4899" />
          <h3>Discussion Rooms</h3>
          <p>Interact with teachers & students.</p>
          <button>Join Discussion</button>
        </div>

        <div className="feature-card" onClick={goToLiveSessions}>
          <FaVideo size={50} color="#7c3aed" />
          <h3>Live Sessions</h3>
          <p>Attend real-time Zoom/Google Meet classes assigned by teachers.</p>
          <button>Join Live Session</button>
        </div>

        <div className="feature-card" onClick={goToGames}>
          <FaTrophy size={50} color="#8b5cf6" />
          <h3>Educational Games</h3>
          <p>Play subject-wise fun games to improve your OL knowledge.</p>
          <button>Play Games</button>
        </div>

      </div>


      {/* PROGRESS ANALYTICS */}

      <div className="analytics-section">

        <h2>Your Progress</h2>

        <div className="analytics-cards">

          <div className="analytics-card">
            <h4>Mathematics</h4>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '80%' }}></div>
            </div>
          </div>

          <div className="analytics-card">
            <h4>Science</h4>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '70%' }}></div>
            </div>
          </div>

          <div className="analytics-card">
            <h4>English</h4>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '90%' }}></div>
            </div>
          </div>

        </div>

      </div>


      {/* FEEDBACK SECTION */}

      <div className="feedback-section">

        <h2>Student Feedback</h2>

        {submitted && (
          <p className="success-msg">
            ✅ Thank you for your feedback!
          </p>
        )}

        <form className="feedback-form" onSubmit={submitFeedback}>

          <label>Rate Your Experience</label>

          <div className="rating-stars">

            {[1,2,3,4,5].map((star) => (

              <span
                key={star}
                className={star <= rating ? "star active" : "star"}
                onClick={() => setRating(star)}
              >
                ⭐
              </span>

            ))}

          </div>


          <label>Your Feedback</label>

          <textarea
            placeholder="Write your feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />

          <button type="submit">
            Submit Feedback
          </button>

        </form>

      </div>

    </div>
  )
}