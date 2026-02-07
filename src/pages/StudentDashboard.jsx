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

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [studentName, setStudentName] = useState("Student")

  // Load name from storage
  useEffect(() => {
    const name = localStorage.getItem("name")
    if (name) setStudentName(name)
  }, [])

  // Navigation Functions
  const goToLeaderboard = () => navigate('/leaderboard')
  const goToQuizzes = () => navigate('/student/quiz/:id')
  const goToResources = () => navigate('/resources')
  const goToDiscussionRoom = () => navigate('/discussionRoom')
  const goToProfile = () => navigate('/update-profile')
  const goToLiveSessions = () => navigate('/student/sessions')
  const goToGames = () => navigate('/games') 

  return (
    <div className="student-dashboard">
      
      {/* Header */}
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
          <Link to="/" className="logout-btn"><FaSignOutAlt /> Logout</Link>
        </div>
      </header>

      {/* Features Section */}
      <div className="dashboard-features">

        {/* Leaderboard */}
        <div className="feature-card" onClick={goToLeaderboard}>
          <FaTrophy size={50} color="#f59e0b" />
          <h3>Leaderboard</h3>
          <p>See your rank, compete, and stay motivated.</p>
          <button onClick={goToLeaderboard}>View Leaderboard</button>
        </div>

        {/* Quizzes */}
        <div className="feature-card" onClick={goToQuizzes}>
          <FaClipboardList size={50} color="#10b981" />
          <h3>Quizzes & Challenges</h3>
          <p>Test your skills and improve daily.</p>
          <button onClick={goToQuizzes}>Start Quiz</button>
        </div>

        {/* Learning Resources */}
        <div className="feature-card" onClick={goToResources}>
          <FaBook size={50} color="#2563eb" />
          <h3>Learning Resources</h3>
          <p>Notes, tutorials, papers and more.</p>
          <button onClick={goToResources}>Explore Resources</button>
        </div>

        {/* Discussion Rooms */}
        <div className="feature-card" onClick={goToDiscussionRoom}>
          <FaComments size={50} color="#ec4899" />
          <h3>Discussion Rooms</h3>
          <p>Interact with teachers & students.</p>
          <button onClick={goToDiscussionRoom}>Join Discussion</button>
        </div>

        {/* ⭐ NEW — Live Sessions */}
        <div className="feature-card" onClick={goToLiveSessions}>
          <FaVideo size={50} color="#7c3aed" />
          <h3>Live Sessions</h3>
          <p>Attend real-time Zoom/Google Meet classes assigned by teachers.</p>
          <button onClick={goToLiveSessions}>Join Live Session</button>
        </div>
      </div>

         {/* ⭐ Educational Games */}
<div className="feature-card" onClick={goToGames}>
  <FaTrophy size={50} color="#8b5cf6" />
  <h3>Educational Games</h3>
  <p>Play subject-wise fun games to improve your OL knowledge.</p>
  <button onClick={goToGames}>Play Games</button>
</div>



      {/* Progress Section */}
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

    </div>
  )
}
