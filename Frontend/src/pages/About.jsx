import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      {/* ===== HERO SECTION ===== */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About OL Matery</h1>
          <p>
             OL Mastery is a smart afterschool learning platform designed to
            connect students, teachers, and administrators — empowering O/L
            learners in Sri Lanka to achieve their best through collaboration,
            technology, and motivation.
          </p>
        </div>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section className="mission-vision">
        <div className="mission-card">
          <h2>🎯 Our Mission</h2>
          <p>
            To provide a digital ecosystem that enhances afterschool learning
            experiences through engaging tools, real-time interaction, and
            performance tracking — helping students learn smarter, not harder.
          </p>
        </div>
        <div className="vision-card">
          <h2>🌟 Our Vision</h2>
          <p>
            To become Sri Lanka’s leading educational innovation hub, bridging
            the gap between traditional classroom learning and the digital
            future through meaningful technology and collaboration.
          </p>
        </div>
      </section>

      {/* ===== PLATFORM FEATURES ===== */}
      <section className="roles-section">
        <h2>Who We Empower</h2>
        <p className="roles-intro">
          Our platform brings together students, teachers, and administrators
          under one connected digital learning space.
        </p>

        <div className="role-cards">
          <div className="role-card">
            <img src="/src/assets/student.jpg" alt="Student" />
            <div className="role-content">
              <h3>👩‍🎓 Students</h3>
              <p>
                Learn, collaborate, and grow with access to quizzes, discussion
                forums, and interactive study materials tailored for O/L
                success.
              </p>
            </div>
          </div>

          <div className="role-card">
            <img src="/src/assets/teacher.jpg" alt="Teacher" />
            <div className="role-content">
              <h3>👨‍🏫 Teachers</h3>
              <p>
                Engage students through digital classrooms, monitor progress,
                and share valuable learning materials to enhance understanding.
              </p>
            </div>
          </div>

          <div className="role-card">
            <img src="/src/assets/admin.jpg" alt="Administrator" />
            <div className="role-content">
              <h3>🧑‍💼 Administrators</h3>
              <p>
                Manage users, oversee school-wide learning activities, and
                access real-time analytics to improve performance outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CORE VALUES ===== */}
      <section className="values-section">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>💡 Innovation</h3>
            <p>We embrace creativity to enhance modern education through technology.</p>
          </div>
          <div className="value-card">
            <h3>🤝 Collaboration</h3>
            <p>We believe in teamwork among students, teachers, and schools.</p>
          </div>
          <div className="value-card">
            <h3>📈 Excellence</h3>
            <p>We strive for continuous growth and improvement in learning outcomes.</p>
          </div>
          <div className="value-card">
            <h3>❤️ Passion</h3>
            <p>We are driven by a shared love for teaching, learning, and progress.</p>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <h2>Join the Future of Learning</h2>
        <p>
          Be part of a growing digital community that empowers education across
          Sri Lanka. Together, let’s make learning smarter, engaging, and
          inspiring.
        </p>
        <a href="/register" className="cta-button">
          Get Started
        </a>
      </section>
    </div>
  );
}
