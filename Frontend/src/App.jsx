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
import Chatbot from './components/Chatbot';
import About from './pages/about';
import DiscussionRoom from './pages/DiscussionRoom';
import LeaderBoard from './pages/LeaderBoard';
import CreateQuiz from './pages/CreateQuiz';
import StudentQuiz from "./pages/StudentQuiz";
import UpdateProfile from "./pages/UpdateProfile";
import UploadResource from "./pages/UploadResource";
import Teachers from "./pages/Teachers";
import Students from "./pages/Students";
import TeacherCreateSession from "./pages/TeacherCreateSession";
import StudentViewSessions from "./pages/StudentViewSessions";
import AddAdmin from "./pages/AddAdmin";
import ViewAdmins from "./pages/ViewAdmins";
import QuizResults from "./pages/QuizResults"; 
import GameSubjects from "./pages/GameSubjects";
import SubjectGames from "./pages/SubjectGames";
import QuickMathGame from "./pages/QuickMathGame";
import AlgebraChallenge from "./pages/AlgebraChallenge";
import HumanBodyLabelGame from "./pages/HumanBodyLabelGame";
import FoodChainBuilderGame from './pages/FoodChainBuilderGame';
import GrammarFixgame from "./pages/GrammarFixgame";
import VocabularyMatchGame from "./pages/VocabularyMatchGame";
import TimelineSortGame from "./pages/TimelineSortGame";
import BinaryGame from './pages/BinaryGame';
import PaymentPage from './pages/PaymentPage';
import TeacherEditSession from "./pages/TeacherEditSession";
import  MyQuizResults from "./pages/MyQuizResults";


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
        <Route path="/teacher/quiz-results" element={<QuizResults />} /> 
        <Route path="/my-quiz-results" element={< MyQuizResults />} />

        {/* PROFILE */}
        <Route path="/update-profile" element={<UpdateProfile />} />

      

        {/* RESOURCES PAGE */}
        <Route path="/resources" element={<UploadResource />} />

        {/* USERS LIST */}
        <Route path="/admin/teachers" element={<Teachers />} />
        <Route path="/admin/students" element={<Students />} />

        {/* TEACHER & STUDENT SESSIONS */}
        <Route path="/teacher/session" element={<TeacherCreateSession />} />
        <Route path="/student/sessions" element={<StudentViewSessions />} />
         <Route path="/payment/:sessionId" element={<PaymentPage />} />
         <Route path="/edit-session/:id" element={<TeacherEditSession />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/add-admin" element={<AddAdmin />} />
        <Route path="/admin/view-admins" element={<ViewAdmins />} />
         
           {/* Games */}
        <Route path="/games" element={<GameSubjects />} />
        <Route path="/games/:subject" element={<SubjectGames />} />
        <Route path="/games/math/quick" element={<QuickMathGame />} />
        <Route path="/games/math/algebra" element={<AlgebraChallenge/>} />
        <Route path="/games/science/body" element={<HumanBodyLabelGame/>} />
        <Route path="/games/science/food-chain" element={<FoodChainBuilderGame/>} />
        <Route path="/games/english/grammar" element={<GrammarFixgame/>} />
        <Route path="/games/english/vocab" element={<VocabularyMatchGame/>} />
        <Route path="/games/history" element={<TimelineSortGame/>} />
        <Route path="/games/ict" element={<BinaryGame/>} />
      </Routes>


      <Footer />
      <Chatbot />
    </>
  );
}

export default App;
