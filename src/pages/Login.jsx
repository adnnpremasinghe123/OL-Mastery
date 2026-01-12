import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const API_BASE = "http://localhost:8081/api/users";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "", role: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.role) {
      setError("⚠️ Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/login`, formData);

      if (res.data.token && res.data.user) {

        // Save user data
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("name", res.data.user.name); // <-- store name

        // Role-based redirect
        const { role } = res.data.user;
        navigate(`/${role}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "❌ Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleLogin}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />

          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />

          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Administrator</option>
          </select>

          <button className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-text">
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
