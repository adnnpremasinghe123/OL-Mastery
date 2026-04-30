import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StudentViewSessions.css";

export default function StudentViewSessions() {
  const [sessions, setSessions] = useState([]);
  const [showPast, setShowPast] = useState(false);
  const [payments, setPayments] = useState({}); // store per session

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    loadSessions();
  }, []);

  /* ---------------- LOAD SESSIONS ---------------- */

  const loadSessions = async () => {
    const res = await axios.get("http://localhost:8081/api/sessions");
    setSessions(res.data);

    // load payments for each session
    res.data.forEach((session) => {
      loadPaymentsBySession(session._id);
    });
  };

  /* ---------------- LOAD PAYMENTS PER SESSION ---------------- */

  const loadPaymentsBySession = async (sessionId) => {
    try {
      const res = await axios.get(
        `http://localhost:8081/api/payments/session/${sessionId}`
      );

      setPayments((prev) => ({
        ...prev,
        [sessionId]: res.data,
      }));
    } catch (err) {
      console.error("Error loading payments:", err);
    }
  };

  /* ---------------- CHECK IF USER PAID ---------------- */
const isPaid = (sessionId) => {
  const sessionPayments = payments[sessionId] || [];

  return sessionPayments.some(
    (p) =>
      String(p.userId?._id || p.userId) === String(user._id) &&
      p.status === "PAID"
  );
};
 

  /* ---------------- HANDLE PAY ---------------- */

  const handlePay = (session) => {
    localStorage.setItem("selectedSession", JSON.stringify(session));

    navigate(`/payment/${session._id}`, {
      state: { session },
    });
  };

  /* ---------------- FILTER ---------------- */

  const now = new Date();

  const filteredSessions = sessions.filter((s) => {
    const sessionDate = new Date(`${s.date} ${s.time}`);
    return showPast ? sessionDate < now : sessionDate >= now;
  });

  const teachers = [...new Set(filteredSessions.map((s) => s.createdBy))];

  /* ---------------- UI ---------------- */

  return (
    <div className="sessions-container">
      <h2>Live Sessions</h2>

      <button
        className="toggle-btn"
        onClick={() => setShowPast(!showPast)}
      >
        {showPast ? "Show Upcoming Sessions" : "Show Previous Sessions"}
      </button>

      <table className="sessions-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Date / Time</th>
            <th>Description</th>
            <th>Payment</th>

            {teachers.map((t) => (
              <th key={t}>{t}</th>
            ))}

            {user.role === "teacher" && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {filteredSessions.map((s) => (
            <tr key={s._id}>
              <td>{s.title}</td>
              <td>
                {s.date} {s.time}
              </td>
              <td>{s.description}</td>
              <td>Rs. {s.payment}</td>

              {teachers.map((teacher) => (
                <td key={teacher}>
                  {teacher === s.createdBy ? (
                    isPaid(s._id) ? (
                      <a
                        href={s.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="join-btn"
                      >
                        Join
                      </a>
                    ) : (
                      <button
                        className="pay-btn"
                        onClick={() => handlePay(s)}
                      >
                        Pay Now
                      </button>
                    )
                  ) : (
                    "-"
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}