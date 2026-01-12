import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TeacherCreateSession.css";



export default function TeacherCreateSession() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // {name, role}

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    meetingLink: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const createSession = async () => {
    if (!form.title || !form.date || !form.time || !form.meetingLink) {
      return alert("Please fill all required fields");
    }

    await axios.post("http://localhost:8081/api/sessions", {
      ...form,
      createdBy: user.name
    });

    alert("Session Created!");
    navigate("/student/sessions");
  };

  return (
    <div className="create-session-container">
  <h2>Create Session</h2>
  <input name="title" placeholder="Title" onChange={handleChange} />
  <textarea name="description" placeholder="Description" onChange={handleChange} />
  <input type="date" name="date" onChange={handleChange} />
  <input type="time" name="time" onChange={handleChange} />
  <input name="meetingLink" placeholder="Meeting Link" onChange={handleChange} />
  <button onClick={createSession}>Create Session</button>
</div>
  );
}
