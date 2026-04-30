import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaClipboardList,
  FaBook,
  FaTrophy,
  FaComments,
  FaVideo,
  FaChalkboardTeacher
} from "react-icons/fa";
import "./Home.css";

export default function Home() {

  // Slider
  const slides = [
    {
      title: "O/L Digital Learning Platform",
      text: "A complete learning system designed for Sri Lankan students and teachers.",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV7cTtUSrsjQa-vslu4Ec1vBhoAsFRQ6HwVA&s"
    },
    {
      title: "Attend Live Classes Anywhere",
      text: "Join online sessions and learn from expert teachers.",
      img: "https://images.unsplash.com/photo-1588072432836-e10032774350"
    },
    {
      title: "Practice With Quizzes & Games",
      text: "Improve performance using quizzes, challenges and rankings.",
      img: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b"
    }
  ];

  const [index, setIndex] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);

  // Fetch feedbacks from backend
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/feedback");
        setFeedbacks(res.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };
    fetchFeedbacks();
  }, []);

  // Slider auto-change
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-wrapper">

      {/* HERO SLIDER */}
      <section className="hero-clean">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`hero-slide ${i === index ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.img})` }}
          />
        ))}

        <div className="hero-overlay"></div>

        <div className="hero-inner">
          <h1>{slides[index].title}</h1>
          <p>{slides[index].text}</p>

          <div className="hero-buttons">
            <Link to="/login" className="primary-btn">
              Student Login
            </Link>
            <Link to="/about" className="secondary-btn">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="intro-section">
        <h2>Everything Needed for O/L Success</h2>
        <p>
          This platform connects students and teachers through structured
          learning tools that support exam preparation and performance monitoring.
        </p>
      </section>

      {/* FEATURES */}
      <section className="features-clean">
        <div className="feature-grid">
          <Feature icon={<FaClipboardList />} title="Quizzes & Challenges"
            text="Students can attempt subject quizzes and improve knowledge." />

          <Feature icon={<FaTrophy />} title="Leaderboard"
            text="Rankings help students stay motivated and monitor performance." />

          <Feature icon={<FaBook />} title="Learning Resources"
            text="Access notes, model papers, tutorials, and study guides anytime." />

          <Feature icon={<FaComments />} title="Discussion Rooms"
            text="Students and teachers can communicate and share knowledge." />

          <Feature icon={<FaVideo />} title="Live Online Classes"
            text="Teachers schedule sessions and students can join in real time." />

          <Feature icon={<FaChalkboardTeacher />} title="Teacher Management"
            text="Teachers upload materials and monitor student progress easily." />
        </div>
      </section>

      {/* ROLES */}
      <section className="roles-section">
        <Role title="For Students" items={[
          "Attempt quizzes & games",
          "Join live classes",
          "Access study materials",
          "Track progress & ranking",
          "View leaderboard"
        ]} />

        <Role title="For Teachers" items={[
          "Create live sessions",
          "Share resources",
          "Guide students",
          "Monitor performance"
        ]} />

        <Role title="For Admins" items={[
          "Create live sessions",
          "Share resources",
          "Guide students",
          "Monitor performance",
          "Manage students",
          "Manage teachers"
        ]} />
      </section>

      {/* STUDENT FEEDBACK */}
      <section className="home-feedback-section">
        <h2>Student Feedback</h2>
        {feedbacks.length === 0 ? (
          <p>No feedback submitted yet.</p>
        ) : (
          <div className="feedback-list">
            {feedbacks.map(fb => (
              <div key={fb._id} className="feedback-card">
                <h4>{fb.studentName}</h4>
                <p>Rating: {"⭐".repeat(fb.rating)}</p>
                <p>{fb.message}</p>
                <small>{new Date(fb.date).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="cta-clean">
        <h2>Start Learning Today</h2>
        <p>
          Join the platform and improve your O/L preparation with structured digital learning.
        </p>
        <Link to="/login" className="primary-btn">
          Get Started
        </Link>
      </section>

    </div>
  );
}

/* SMALL COMPONENTS */
function Feature({ icon, title, text }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function Role({ title, items }) {
  return (
    <div className="role-box">
      <h3>{title}</h3>
      <ul>
        {items.map((it, i) => (
          <li key={i}>✔ {it}</li>
        ))}
      </ul>
    </div>
  );
}