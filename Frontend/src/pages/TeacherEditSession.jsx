import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./TeacherCreateSession.css";

export default function TeacherEditSession() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    meetingLink: ""
  });

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {

      const res = await axios.get(`http://localhost:8081/api/sessions`);
      const session = res.data.find((s) => s._id === id);

      if (session) {
        setForm(session);
      }

    } catch (err) {
      alert("Error loading session");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateSession = async () => {

    try {

      await axios.put(`http://localhost:8081/api/sessions/${id}`, form);

      alert("Session updated successfully");

      navigate("/student/sessions");

    } catch (err) {

      alert("Error updating session");

    }

  };

  return (

    <div className="create-session-container">

      <h2>Edit Session</h2>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Session Title"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
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
        value={form.meetingLink}
        onChange={handleChange}
        placeholder="Meeting Link"
      />

      <div className="form-actions">

        <button
          className="primary-btn"
          onClick={updateSession}
        >
          Update Session
        </button>

        <button
          className="secondary-btn"
          onClick={() => navigate("/student/sessions")}
        >
          Cancel
        </button>

      </div>

    </div>

  );

}