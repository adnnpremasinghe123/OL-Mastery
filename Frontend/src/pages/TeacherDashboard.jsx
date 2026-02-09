import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaBook, 
  FaClipboardList, 
  FaComments, 
  FaUserCircle, 
  FaSignOutAlt,
  FaVideo
} from "react-icons/fa";
import './TeacherDashboard.css';

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const [teacherName, setTeacherName] = useState("Teacher");

  // Load user name from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/"); // If no user in localStorage → redirect to login
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user?.name) {
        setTeacherName(user.name);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, [navigate]);

  // Navigation functions
  const goToLeaderboard = () => navigate('/leaderboard');
  const goToQuizzes = () => navigate('/teacher/create-quiz');
  const goToResources = () => navigate('/resources');
  const goToDiscussion = () => navigate('/discussionRoom');
  const goToProfile = () => navigate('/update-profile');
  const goToOnlineSession = () => navigate('/teacher/session');

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="teacher-dashboard">
      
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Welcome, {teacherName}! 👩‍🏫</h1>
          <p>Manage your quizzes, resources, and student performance.</p>
        </div>

        <div className="header-right">
          <FaUserCircle 
            size={40} 
            color="#4f46e5" 
            className="profile-icon" 
            onClick={goToProfile}
            title="View Profile"
          />

          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      {/* Main Cards */}
      <div className="dashboard-features">
        
        <div className="feature-card" onClick={goToLeaderboard}>
          <FaUsers size={50} color="#2563eb" />
          <h3>Student Leaderboard</h3>
          <p>View rankings, quiz performance, and student activity.</p>
          <button>View Leaderboard</button>
        </div>

        <div className="feature-card" onClick={goToQuizzes}>
          <FaClipboardList size={50} color="#10b981" />
          <h3>Quizzes</h3>
          <p>Create and manage quizzes.</p>
          <button>Manage Quizzes</button>
        </div>

        <div className="feature-card" onClick={goToResources}>
          <FaBook size={50} color="#f59e0b" />
          <h3>Learning Resources</h3>
          <p>Upload notes and study materials.</p>
          <button>Upload Resources</button>
        </div>

        <div className="feature-card" onClick={goToDiscussion}>
          <FaComments size={50} color="#ec4899" />
          <h3>Discussion Rooms</h3>
          <p>Interact with students through discussions.</p>
          <button>Join Discussions</button>
        </div>

        <div className="feature-card" onClick={goToOnlineSession}>
          <FaVideo size={50} color="#7c3aed" />
          <h3>Online Sessions</h3>
          <p>Start and manage live sessions.</p>
          <button>Start Session</button>
        </div>

      </div>
    </div>
  );
}
