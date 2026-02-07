import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentViewSessions.css";

export default function StudentViewSessions() {
  const [sessions, setSessions] = useState([]);
  const [editSession, setEditSession] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  /* ---------------- Load Sessions ---------------- */
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    axios
      .get("http://localhost:8081/api/sessions")
      .then((res) => setSessions(res.data))
      .catch((err) => console.error(err));
  };

  /* ---------------- Delete ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this session?")) return;

    try {
      await axios.delete(`http://localhost:8081/api/sessions/${id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setSessions(sessions.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("You are not authorized to delete this session.");
    }
  };

  /* ---------------- Update ---------------- */
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:8081/api/sessions/${editSession._id}`,
        editSession,
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      alert("Session updated successfully!");
      setEditSession(null);
      loadSessions();
    } catch (err) {
      console.error(err);
      alert("You are not authorized to edit this session.");
    }
  };

  const canModify = (session) =>
    user?.role === "admin" || user?.name === session.createdBy;

  return (
    <div className="sessions-container">
      <h2>Available Sessions</h2>

      {sessions.length === 0 && <p>No sessions available</p>}

      {sessions.map((s) => (
        <div key={s._id} className="session-card">
          <h4>{s.title}</h4>
          <p>{s.description}</p>
          <p>
            Date: {s.date} | Time: {s.time}
          </p>
          <p>Teacher: {s.createdBy}</p>

          <a
            href={s.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="join-link"
          >
            Join Session
          </a>

          {canModify(s) && (
            <div className="session-actions">
              <button
                className="btn btn-primary"
                onClick={() => setEditSession(s)}
              >
                Edit
              </button>

              <button
                className="btn btn-danger"
                onClick={() => handleDelete(s._id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      {/* -------------------- EDIT MODAL -------------------- */}
      {editSession && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Session</h3>

            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={editSession.title}
                onChange={(e) =>
                  setEditSession({ ...editSession, title: e.target.value })
                }
                placeholder="Title"
                required
              />

              <textarea
                value={editSession.description}
                onChange={(e) =>
                  setEditSession({
                    ...editSession,
                    description: e.target.value,
                  })
                }
                placeholder="Description"
                required
              />

              <input
                type="date"
                value={editSession.date}
                onChange={(e) =>
                  setEditSession({ ...editSession, date: e.target.value })
                }
                required
              />

              <input
                type="time"
                value={editSession.time}
                onChange={(e) =>
                  setEditSession({ ...editSession, time: e.target.value })
                }
                required
              />

              <input
                type="text"
                value={editSession.meetingLink}
                onChange={(e) =>
                  setEditSession({
                    ...editSession,
                    meetingLink: e.target.value,
                  })
                }
                placeholder="Meeting Link"
                required
              />

              <div className="modal-actions">
                <button type="submit" className="btn btn-success">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditSession(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
