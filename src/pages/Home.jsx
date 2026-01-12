import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaChalkboardTeacher, FaTrophy, FaBook, FaUsers } from 'react-icons/fa'
import './Home.css'

export default function Home() {
  const slides = [
    {
      image: 'src/assets/slide2.jpg',
      caption: 'Join Interactive Learning Sessions'
    },
    {
      image: 'src/assets/slide1.jpg',
      caption: 'Track Your Progress & Improve Grades'
    },
    {
      image: 'src/assets/slide3.png',
      caption: 'Connect with Qualified Teachers'
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Boost Your O/L Learning Journey</h1>
          <p>Empowering students, teachers, and administrators with innovative digital tools for better learning outcomes.</p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">Get Started</Link>
            <Link to="/about" className="btn btn-secondary">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Slideshow Section */}
      <section className="slideshow">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-caption">{slide.caption}</div>
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Our Platform Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <FaChalkboardTeacher size={50} color="#4f46e5" />
            <h3>Interactive Lessons</h3>
            <p>Engage in live discussions, quizzes, and interactive learning materials shared by teachers.</p>
          </div>
          <div className="feature-card">
            <FaTrophy size={50} color="#f59e0b" />
            <h3>Leaderboard & Motivation</h3>
            <p>Track your progress and compete with peers to earn points and badges.</p>
          </div>
          <div className="feature-card">
            <FaBook size={50} color="#10b981" />
            <h3>Learning Resources</h3>
            <p>Access notes, recorded sessions, and curated content for each subject anytime, anywhere.</p>
          </div>
          <div className="feature-card">
            <FaUsers size={50} color="#ec4899" />
            <h3>Admin & Teacher Tools</h3>
            <p>Teachers and admins can monitor progress, manage assignments, and optimize student learning experience.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>Why Students Love Our Platform</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>“I improved my grades and learned so much faster with the interactive quizzes and resources!”</p>
            <span>- Student A</span>
          </div>
          <div className="testimonial-card">
            <p>“The discussion rooms helped me clarify doubts instantly with my teacher and classmates.”</p>
            <span>- Student B</span>
          </div>
          <div className="testimonial-card">
            <p>“Seeing my ranking on the leaderboard motivated me to study consistently every week.”</p>
            <span>- Student C</span>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready to Start Learning?</h2>
        <Link to="/login" className="btn btn-primary">Login Now</Link>
      </section>

    </div>
  )
}
