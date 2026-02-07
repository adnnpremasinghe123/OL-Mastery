import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UpdateProfile.css";

export default function UpdateProfile() {
  // Load user info from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const [user, setUser] = useState(storedUser);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editable, setEditable] = useState(false);
  const [isDirty, setIsDirty] = useState(false); // Track if user changed any field

  // Fill form with current user data
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
      setIsDirty(false);
    }
  }, [user]);

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setIsDirty(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editable) return;

    const payload = {};
    if (form.name.trim() && form.name.trim() !== user.name) payload.name = form.name.trim();
    if (form.email.trim() && form.email.trim() !== user.email) payload.email = form.email.trim();
    if (form.password.trim()) payload.password = form.password.trim();

    if (Object.keys(payload).length === 0) {
      return alert("No changes detected.");
    }

    try {
      const token = localStorage.getItem("token"); // JWT token
      const res = await axios.put(
        `http://localhost:8081/api/users/update/${user.id || user._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } } // Send JWT
      );

      const updatedUser = res.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setForm({ name: updatedUser.name, email: updatedUser.email, password: "" });
      setEditable(false);
      setIsDirty(false);

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.error || "Error updating profile");
    }
  };

  return (
    <div className="profile-update-container">
      <h2>Update Your Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={updateField}
          placeholder="Enter your name"
          readOnly={!editable}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={updateField}
          placeholder="Enter your email"
          readOnly={!editable}
        />

        <label>Password (optional)</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={updateField}
          placeholder="Leave blank to keep current password"
          readOnly={!editable}
        />

        {!editable ? (
          <button type="button" onClick={() => setEditable(true)}>
            Edit
          </button>
        ) : (
          <button type="submit" disabled={!isDirty}>
            Save Changes
          </button>
        )}
      </form>
    </div>
  );
}
