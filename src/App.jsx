import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './pages/about';
import DiscussionRoom from './pages/DiscussionRoom';
import LeaderBoard from './pages/LeaderBoard';
import CreateQuiz from './pages/CreateQuiz';
import StudentQuiz from "./pages/StudentQuiz";
import UpdateProfile from "./pages/UpdateProfile";
import SearchPage from "./pages/SearchPage";
import UploadResource from "./pages/UploadResource";
import Teachers from "./pages/Teachers";
import Students from "./pages/Students";
import Settings from "./pages/Settings";
import TeacherCreateSession from "./pages/TeacherCreateSession";
import StudentViewSessions from "./pages/StudentViewSessions";



function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* GENERAL ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARDS */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* FEATURES */}
        <Route path="/discussionRoom" element={<DiscussionRoom />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />

        {/* QUIZ */}
        <Route path="/teacher/create-quiz" element={<CreateQuiz />} />
        <Route path="/student/quiz/:id" element={<StudentQuiz />} />

        {/* PROFILE */}
        <Route path="/update-profile" element={<UpdateProfile />} />

        {/* SEARCH PAGE */}
        <Route path="/query" element={<SearchPage />} />

        {/* RESOURCES PAGE */}
        <Route path="/resources" element={<UploadResource />} />

        {/* USERS LIST */}
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/students" element={<Students />} />

        {/* SETTINGS */}
        <Route path="/settings" element={<Settings />} />

        {/*Teacher Sessions*/}
         <Route path="/teacher/session" element={<TeacherCreateSession />} />
        <Route path="/student/sessions" element={<StudentViewSessions />} />
        
      </Routes>

      <Footer />
    </>
  );
}

export default App;
