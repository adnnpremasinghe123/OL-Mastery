import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TeacherCreateSession.css";

export default function TeacherCreateSession() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    payment: "",
    meetingLink: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createSession = async () => {
    if (!form.title || !form.date || !form.time || !form.meetingLink) {
      return alert("Please fill all required fields");
    }

    try {
      const res = await axios.post("http://localhost:8081/api/sessions", {
        ...form,
        createdBy: user.name,
      });

      const existingSessions =
        JSON.parse(localStorage.getItem("sessions")) || [];

      localStorage.setItem(
        "sessions",
        JSON.stringify([...existingSessions, res.data])
      );

      alert("Session Created! Emails sent to students.");
      navigate("/student/sessions");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error creating session");
    }
  };

  return (
    <div className="create-session-container">
      <h2>Create Live Session</h2>

      <input
        name="title"
        placeholder="Session Title"
        value={form.title}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Session Description (optional)"
        value={form.description}
        onChange={handleChange}
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />

      <input
        type="time"
        name="time"
        value={form.time}
        onChange={handleChange}
      />

      <input
        name="meetingLink"
        placeholder="Meeting Link (Zoom / Google Meet)"
        value={form.meetingLink}
        onChange={handleChange}
      />
      <input
        name="payment"
        placeholder="Payment Amount (RS)"
        value={form.payment}
        onChange={handleChange}
      />

      {/* Action Buttons */}
      <div className="form-actions">
        <button className="primary-btn" onClick={createSession}>
          Create Session
        </button>
    
        <button
          className="secondary-btn"
          onClick={() => navigate("/student/sessions")}
        >
          View Sessions
        </button>
      </div>
    </div>
  );
}
