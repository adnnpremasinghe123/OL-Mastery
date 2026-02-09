import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaTrophy, FaBook, FaUsers, FaArrowRight } from 'react-icons/fa';
import './Home.css';

export default function Home() {
  const slides = [
    {
      // Using placeholder images here. Replace with your actual asset paths.
      image: 'https://via.placeholder.com/1200x600/6366f1/ffffff?text=Interactive+Learning', 
      caption: 'Join Interactive Learning Sessions'
    },
    {
      image: 'https://via.placeholder.com/1200x600/a855f7/ffffff?text=Track+Progress',
      caption: 'Track Your Progress & Improve Grades'
    },
    {
      image: 'https://via.placeholder.com/1200x600/d946ef/ffffff?text=Connect+Teachers',
      caption: 'Connect with Qualified Teachers'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="home-wrapper">
      {/* Animated Background Elements */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      {/* Hero Section */}
      <section className="hero-visual">
        <div className="hero-inner">
          <span className="badge">Next-Gen Learning Platform</span>
          <h1 className="glitch-text">
            Master Your O/Ls <br /> 
            <span className="gradient-text">Beyond the Classroom.</span>
          </h1>
          <p className="hero-subtitle">
            An immersive digital ecosystem designed for the modern Sri Lankan student. 
            Track, compete, and excel with AI-driven insights.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="glass-btn primary">
              Start Journey <FaArrowRight />
            </Link>
            <Link to="/about" className="glass-btn secondary">Explore Features</Link>
          </div>
        </div>
        
        {/* Floating Stats Card - Rare Visual Element */}
        <div className="floating-stats">
          <div className="stat-item">
            <strong>15k+</strong>
            <span>Active Students</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <strong>98%</strong>
            <span>Pass Rate</span>
          </div>
        </div>
      </section>

      {/* Slideshow Section - Now with a more integrated look */}
      <section className="slideshow-integrated">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide-item ${index === currentIndex ? 'active' : ''}`}
          >
            <div className="slide-content">
              <img src={slide.image} alt={slide.caption} className="slide-image"/>
              <div className="slide-caption-overlay">
                <h3>{slide.caption}</h3>
              </div>
            </div>
          </div>
        ))}
        <div className="slideshow-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </section>

      {/* Features Grid with Images */}
      <section className="feature-grid-section">
        <div className="section-header">
          <h2>Elevate Your Experience</h2>
          <p>Everything you need to dominate your exams in one place.</p>
        </div>

        <div className="rare-grid">
          <div className="feature-tile">
            <img src="src/assets/teacher.jpg" alt="Interactive Lessons" className="feature-image"/>
            <div className="tile-content">
              <div className="icon-box purple"><FaChalkboardTeacher /></div>
              <h3>Live Interaction</h3>
              <p>Real-time synchronization with expert tutors and peer groups.</p>
            </div>
          </div>
          <div className="feature-tile tall">
            <img src="src/assets/leaderboard.avif" alt="Leaderboard & Motivation" className="feature-image"/>
            <div className="tile-content">
              <div className="icon-box gold"><FaTrophy /></div>
              <h3>The Arena</h3>
              <p>Gamified leaderboards that turn studying into a rewarding challenge.</p>
            </div>
          </div>
          <div className="feature-tile">
            <img src="https://via.placeholder.com/300x200/10b981/ffffff?text=Resources" alt="Learning Resources" className="feature-image"/>
            <div className="tile-content">
              <div className="icon-box green"><FaBook /></div>
              <h3>Resource Vault</h3>
              <p>Unrestricted access to premium notes and past paper analysis.</p>
            </div>
          </div>
          <div className="feature-tile">
            <img src="https://via.placeholder.com/300x200/ec4899/ffffff?text=AdminTools" alt="Admin & Teacher Tools" className="feature-image"/>
            <div className="tile-content">
              <div className="icon-box pink"><FaUsers /></div>
              <h3>Admin Suite</h3>
              <p>Powerful analytics for educators to monitor student growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Testimonial Slider with Avatars */}
      <section className="modern-testimonials">
        <div className="section-header">
          <h2>What Our Achievers Say</h2>
          <p>Inspiring stories from students who transformed their O/L journey.</p>
        </div>
        <div className="testimonial-track">
          {[
            { quote: "This platform changed how I look at Mathematics. The interactive tools are a game changer.", name: "Aisha R.", avatar: "https://via.placeholder.com/50/FF6B6B/FFFFFF?text=AR" },
            { quote: "I never thought learning could be this engaging. My science grades soared!", name: "Nimal S.", avatar: "https://via.placeholder.com/50/4ECDC4/FFFFFF?text=NS" },
            { quote: "The past paper explanations are incredibly detailed. Helped me understand complex topics.", name: "Priya L.", avatar: "https://via.placeholder.com/50/45B7D1/FFFFFF?text=PL" },
            { quote: "Seeing my ranking motivated me to push harder every week. Highly recommend!", name: "Kumar M.", avatar: "https://via.placeholder.com/50/FFA07A/FFFFFF?text=KM" }
          ].map((testimonial, i) => (
            <div key={i} className="glass-card testimonial-card-fancy">
              <div className="quote-icon">“</div>
              <p>{testimonial.quote}</p>
              <div className="user-info">
                <img src={testimonial.avatar} alt={testimonial.name} className="avatar"/>
                <span>{testimonial.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Minimalist CTA */}
      <section className="final-cta">
        <div className="cta-content">
          <h2>Ready to redefine your future?</h2>
          <Link to="/login" className="glow-btn">Join Now</Link>
        </div>
      </section>
    </div>
  );
}