import React from "react";
import { useNavigate } from "react-router-dom";
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
  FaUserCircle,
  FaVideo,
  FaTrophy,
  FaUserPlus
} from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Navigation targets
  const pages = {
    students: "/admin/students",
    teachers: "/admin/teachers",
    quizzes: "/student/quiz/:id",
    createQuiz: "/teacher/create-quiz",
    resources: "/resources",
    discussions: "/discussionRoom",
    sessions: "/student/sessions",
    leaderboard: "/leaderboard",
    addAdmin: "/admin/add-admin",
    viewAdmins: "/admin/view-admins",

  };

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
            <li onClick={() => navigate("/admin")} className="active">
              <FaChartBar /> Dashboard
            </li>

            <li onClick={() => navigate(pages.students)}>
              <FaUsers /> Manage Students
            </li>

            <li onClick={() => navigate(pages.teachers)}>
              <FaChalkboardTeacher /> Manage Teachers
            </li>

            <li onClick={() => navigate(pages.quizzes)}>
              <FaClipboardList /> View Quizzes
            </li>

            <li onClick={() => navigate(pages.createQuiz)}>
              <FaClipboardList /> Create Quiz
            </li>

            <li onClick={() => navigate(pages.resources)}>
              <FaBook /> Resources
            </li>

            <li onClick={() => navigate(pages.discussions)}>
              <FaComments /> Discussion Rooms
            </li>

            <li onClick={() => navigate(pages.sessions)}>
              <FaVideo /> Free Sessions
            </li>

            <li onClick={() => navigate(pages.leaderboard)}>
              <FaTrophy /> Leaderboard
            </li>

            <li onClick={() => navigate(pages.addAdmin)}>
              <FaUserPlus /> Add New Admin
            </li>
            
             <li onClick={() => navigate(pages.viewAdmins)}>
         <FaUserPlus /> View Admins
             </li>
            

            <li onClick={logout}>
              <FaSignOutAlt /> Logout
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">

        {/* Top Bar */}
        <header className="admin-header">
          <h1>Welcome Back, Admin 👋</h1>
          <div className="admin-profile" onClick={() => navigate("/update-profile")}>
            <FaUserCircle size={36} color="#4f46e5" />
          </div>
        </header>

        {/* Statistics Section */}
        <section className="admin-stats">
          <div className="stat-card">
            <FaUsers size={40} color="#4f46e5" />
            <div>
              <h3>1,245</h3>
              <p>Students</p>
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

        {/* Quick Actions */}
        <section className="management-section">
          <h2>Quick Actions</h2>

          <div className="management-grid">

            <div className="management-card" onClick={() => navigate(pages.students)}>
              <h3>View / Remove Students</h3>
              <p>Manage student accounts and remove inactive ones.</p>
              <button>Manage Students</button>
            </div>

            <div className="management-card" onClick={() => navigate(pages.teachers)}>
              <h3>View / Remove Teachers</h3>
              <p>Manage teacher accounts and permissions.</p>
              <button>Manage Teachers</button>
            </div>

            <div className="management-card" onClick={() => navigate(pages.createQuiz)}>
              <h3>Create New Quiz</h3>
              <p>Create subject-based quizzes for students.</p>
              <button>Create Quiz</button>
            </div>

            <div className="management-card" onClick={() => navigate(pages.quizzes)}>
              <h3>View Existing Quizzes</h3>
              <p>Update or delete existing quizzes.</p>
              <button>View Quizzes</button>
            </div>

            <div className="management-card" onClick={() => navigate(pages.resources)}>
              <h3>Manage Resources</h3>
              <p>Upload, update, or delete study materials.</p>
              <button>Manage Resources</button>
            </div>

            <div className="management-card" onClick={() => navigate(pages.discussions)}>
              <h3>Manage Discussion Rooms</h3>
              <p>Moderate and manage conversations.</p>
              <button>Manage Discussions</button>
            </div>

            <div className="management-card" onClick={() => navigate(pages.sessions)}>
              <h3>Manage Free Sessions</h3>
              <p>View, edit, or delete online sessions.</p>
              <button>Manage Sessions</button>
            </div>

            <div className="management-card" onClick={() => navigate(pages.leaderboard)}>
              <h3>View Leaderboard</h3>
              <p>Track top performing students.</p>
              <button>Leaderboard</button>
            </div>

            <div className="management-card" onClick={() => navigate(pages.addAdmin)}>
              <h3>Add New Admin</h3>
              <p>Create new admin accounts with full access.</p>
              <button>Add Admin</button>
            </div>

            <div className="management-card" onClick={() => navigate(pages.viewAdmins)}>
           <h3>View Admins</h3>
           <p>See all admin accounts in the system.</p>
           <button>View Admins</button>
           </div>


          </div>
        </section>
      </main>
    </div>
  );
}
