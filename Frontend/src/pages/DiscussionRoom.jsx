import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import { io } from "socket.io-client";
import "./DiscussionRoom.css";

const socket = io("http://localhost:8081", { transports: ["websocket"] });

export default function DiscussionRoom() {
  const location = useLocation();
  const userName = localStorage.getItem("name") || "User";

  const roleFromDashboard = location.state?.role || "student";
  const [role, setRole] = useState(roleFromDashboard);

  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [activeUsers, setActiveUsers] = useState([]);

  const subjects = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Geography",
    "Sinhala",
    "Buddhism",
    "IT"
  ];

  // -------------------------
  // JOIN ROOM + LISTEN EVENTS
  // -------------------------
  useEffect(() => {
    socket.emit("joinRoom", { subject: selectedSubject, user: userName });

    fetchMessages(selectedSubject);

    socket.on("receiveMessage", (message) => {
      if (message.subject === selectedSubject) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("messageDeleted", (messageId) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    // 🔥 FIXED: Listen for correct event "activeUsers"
    socket.on("activeUsers", (users) => {
      setActiveUsers(users); // users = [{ socketId, name }]
    });

    return () => {
      socket.emit("leaveRoom", { subject: selectedSubject, user: userName });
      socket.off("receiveMessage");
      socket.off("messageDeleted");
      socket.off("activeUsers");
    };
  }, [selectedSubject, userName]);


  const fetchMessages = async (subject) => {
    try {
      const res = await axios.get(`http://localhost:8081/api/messages/${subject}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    const message = {
      user: `${userName} (${role})`,
      role,
      subject: selectedSubject,
      content: newMessage,
      timestamp: new Date(),
    };

    socket.emit("sendMessage", message);
    setNewMessage("");
  };

  const handleDelete = async (id) => {
    try {
      socket.emit("deleteMessage", { messageId: id, subject: selectedSubject });
      await axios.delete(`http://localhost:8081/api/messages/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  return (
    <div className="discussion-container">
      <aside className="sidebar">
        <h3>Subjects</h3>
        <ul>
          {subjects.map((sub) => (
            <li
              key={sub}
              className={selectedSubject === sub ? "active" : ""}
              onClick={() => setSelectedSubject(sub)}
            >
              {sub}
            </li>
          ))}
        </ul>

        <div className="role-selector">
          <h4>Your Role</h4>
          <label>
            <input
              type="radio"
              value="student"
              checked={role === "student"}
              onChange={() => setRole("student")}
            />{" "}
            Student
          </label>
          <label>
            <input
              type="radio"
              value="teacher"
              checked={role === "teacher"}
              onChange={() => setRole("teacher")}
            />{" "}
            Teacher
          </label>
            <label>
            <input
              type="radio"
              value="admin"
              checked={role === "admin"}
              onChange={() => setRole("admin")}
            />{" "}
            Admin
          </label>
        </div>

        <Link
          to={`/${role === "teacher" ? "teacher" : "student"}`}
          className="back-dashboard-btn"
        >
          Back to Dashboard
        </Link>
      </aside>

      <main className="chat-area">
        <h2>{selectedSubject} Discussion Room</h2>

        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={msg._id || index}
              className={`message ${
                msg.role === "teacher"
                  ? "teacher-message"
                  : msg.user.includes(userName)
                  ? "my-message"
                  : "student-message"
              }`}
            >
              <div className="message-header">
                <strong>{msg.user}</strong>{" "}
                <small>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>

                {/* Allow deleting your own messages */}
                {msg.user.includes(userName) && (
                  <button className="delete-btn" onClick={() => handleDelete(msg._id)}>
                    🗑️
                  </button>
                )}
              </div>

              <div className="message-content">{msg.content}</div>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </main>

      
      
      <aside className="active-users">
        <h3>Active Users</h3>
        <ul>
          {activeUsers.length > 0 ? (
            activeUsers.map((u) => (
              <li key={u.socketId}>🟢 {u.name}</li>
            ))
          ) : (
            <li>No active users</li>
          )}
        </ul>
      </aside>
    </div>
  );
}
