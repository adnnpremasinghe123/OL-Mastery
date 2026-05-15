import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import "./PaymentPage.css";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {

  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [session, setSession] = useState(
    location.state?.session || null
  );

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

  
  useEffect(() => {

    const loadSession = async () => {

      if (session) {
        setPageLoading(false);
        return;
      }

      const saved = localStorage.getItem("selectedSession");
      if (saved) {
        setSession(JSON.parse(saved));
        setPageLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:8081/api/sessions/${sessionId}`
        );

        setSession(res.data);
        localStorage.setItem("selectedSession", JSON.stringify(res.data));

      } catch (err) {
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };

    loadSession();

  }, [sessionId]);


  const handlePay = async () => {
  const storedUser = localStorage.getItem("user");
  const userObj = storedUser ? JSON.parse(storedUser) : null;
  const finalUser = userObj || user;

  if (!finalUser) {
    alert("Session expired. Please login again.");
    window.location.href = "/login";
    return;
  }

  if (!session) {
    alert("Session not loaded");
    return;
  }

  if (!form.name || !form.email || !form.phone) {
    alert("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:8081/api/payments/create",
      {
        sessionId: session._id,
        userId: finalUser._id,
        amount: Number(session.payment).toFixed(2), // ✅ FIXED
        name: form.name,
        email: form.email,
        phone: form.phone,
      }
    );

    if (!window.payhere) {
      alert("Payment system not loaded");
      return;
    }

    window.payhere.startPayment(res.data);

  } catch (err) {
    console.error(err);
    alert("Payment failed");
  } finally {
    setLoading(false);
  }
};
 
 useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://www.payhere.lk/lib/payhere.js";
  script.async = true;

  script.onload = () => {
    console.log("PayHere loaded");

    window.payhere.onCompleted = () => {
      alert("Payment Successful");
      localStorage.removeItem("selectedSession");
       navigate("/student/sessions");
    };

    window.payhere.onDismissed = () => {
      alert("Payment Cancelled");
    };

    window.payhere.onError = (err) => {
      console.error("PayHere Error:", err);
    };
  };

  document.body.appendChild(script);
}, []);

 

  if (pageLoading) return <h3>Loading...</h3>;

  if (!session) return <h3>Session not found</h3>;

  return (
  <div className="payment-container">
    <div className="payment-card">

      <h2 className="title">{session.title}</h2>

      <div className="price-box">
        <span>Total Amount</span>
        <h3>Rs. {session.payment}</h3>
      </div>

      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="text"
          placeholder="Enter your phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />
      </div>

      <button className="pay-btn" onClick={handlePay} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>

    </div>
  </div>
);
}