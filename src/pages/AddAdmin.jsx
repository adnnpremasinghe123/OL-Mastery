import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddAdmin.css"; // optional CSS
import { FaUserPlus } from "react-icons/fa";

export default function AddAdmin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [type, setType] = useState(""); // "success" or "error"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage(""); // clear previous messages when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = form;

    if (!name || !email || !password) {
      setMessage("All fields are required.");
      setType("error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You must be logged in as admin.");
        setType("error");
        return;
      }

      const res = await axios.post(
        "http://localhost:8081/api/admin/create-admin",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message || "Admin created successfully");
      setType("success");

      // Reset form
      setForm({ name: "", email: "", password: "" });

      // Redirect to admin dashboard after 1.5s
      setTimeout(() => navigate("/admin"), 1500);

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to create admin"
      );
      setType("error");
    }
  };

  return (
    <div className="add-admin-container">
      <div className="add-admin-card">
        <h2>
          <FaUserPlus /> Add New Admin
        </h2>
        <p>Add another administrator to manage the app.</p>

        {message && (
          <div
            className={`alert ${
              type === "success" ? "alert-success" : "alert-error"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-admin-form">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter admin name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter admin email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="text" // show plain text password
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="add-admin-btn">
            Create Admin
          </button>
        </form>

        <button className="back-btn" onClick={() => navigate("/admin")}>
          Go Back
        </button>
      </div>
    </div>
  );
}
