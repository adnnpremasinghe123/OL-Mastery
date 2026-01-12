import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaClipboardList, 
  FaBook, 
  FaComments, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt, 
  FaUserCircle 
} from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Navigation functions
  const goToStudents = () => navigate("/students");
  const goToTeachers = () => navigate("/teachers");
  const goToQuizzes = () => navigate("/student/quiz/:id");
  const goToResources = () => navigate("/admin/resources");
  const goToDiscussions = () => navigate("/discussionRoom");
  const goToSettings = () => navigate("/settings");
  const goToProfile = () => navigate("/update-profile");
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav>
          <ul>
            <li onClick={() => navigate("/admin")} className="active"><FaChartBar /> Dashboard</li>
            <li onClick={goToStudents}><FaUsers /> Manage Students</li>
            <li onClick={goToTeachers}><FaChalkboardTeacher /> Manage Teachers</li>
            <li onClick={goToQuizzes}><FaClipboardList /> Quizzes</li>
            <li onClick={goToResources}><FaBook /> Resources</li>
            <li onClick={goToDiscussions}><FaComments /> Discussion Rooms</li>
            <li onClick={goToSettings}><FaCog /> Settings</li>
            <li onClick={logout}><FaSignOutAlt /> Logout</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-header">
          <h1>Welcome, Admin 👋</h1>
          <div className="admin-profile" onClick={goToProfile} title="View Profile">
            <FaUserCircle size={36} color="#4f46e5" />
          </div>
        </header>

        {/* Analytics Section */}
        <section className="admin-stats">
          <div className="stat-card">
            <FaUsers size={40} color="#4f46e5" />
            <div>
              <h3>1,245</h3>
              <p>Active Students</p>
            </div>
          </div>

          <div className="stat-card">
            <FaChalkboardTeacher size={40} color="#10b981" />
            <div>
              <h3>42</h3>
              <p>Teachers</p>
            </div>
          </div>

          <div className="stat-card">
            <FaClipboardList size={40} color="#f59e0b" />
            <div>
              <h3>120</h3>
              <p>Quizzes</p>
            </div>
          </div>

          <div className="stat-card">
            <FaComments size={40} color="#ec4899" />
            <div>
              <h3>350+</h3>
              <p>Discussions</p>
            </div>
          </div>
        </section>

        {/* Management Overview */}
        <section className="management-section">
          <h2>Quick Actions</h2>
          <div className="management-grid">
            <div className="management-card" onClick={goToStudents}>
              <h3>Add New Student</h3>
              <p>Register and manage student accounts easily.</p>
              <button>Add Student</button>
            </div>
            <div className="management-card" onClick={goToQuizzes}>
              <h3>Create Quiz</h3>
              <p>Design subject-based quizzes to enhance learning.</p>
              <button>Create Quiz</button>
            </div>
            <div className="management-card" onClick={goToResources}>
              <h3>Upload Resources</h3>
              <p>Share documents and materials with teachers and students.</p>
              <button>Upload</button>
            </div>
            <div className="management-card" onClick={goToDiscussions}>
              <h3>Monitor Discussions</h3>
              <p>Keep the discussion rooms active and moderated.</p>
              <button>View Discussions</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
