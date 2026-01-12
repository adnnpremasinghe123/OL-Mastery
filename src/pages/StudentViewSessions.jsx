import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentViewSessions() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8081/api/sessions")
      .then(res => setSessions(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "50px auto" }}>
      <h2>Available Sessions</h2>
      {sessions.length === 0 && <p>No sessions available</p>}
      {sessions.map(s => (
        <div key={s._id} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 15, borderRadius: 8 }}>
          <h4>{s.title}</h4>
          <p>{s.description}</p>
          <p>Date: {s.date} | Time: {s.time}</p>
          <p>Teacher: {s.createdBy}</p>
          <a href={s.meetingLink} target="_blank" rel="noreferrer">
            Join Session
          </a>
        </div>
      ))}
    </div>
  );
}
