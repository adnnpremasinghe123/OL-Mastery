import React, { useEffect, useState } from "react";
import axios from "axios";
import './UpdateProfile.css';

export default function UpdateProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {};
    if (form.name.trim()) payload.name = form.name.trim();
    if (form.email.trim()) payload.email = form.email.trim();
    if (form.password.trim()) payload.password = form.password.trim();

    if (Object.keys(payload).length === 0) {
      return alert("Please edit at least one field to update.");
    }

    try {
      const res = await axios.put(
        `http://localhost:8081/api/users/update/${user._id}`,
        payload
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Profile updated successfully!");
      setForm({
        name: res.data.user.name || "",
        email: res.data.user.email || "",
        password: "",
      });
      setEditable(false);
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
          <button type="submit">Save Changes</button>
        )}
      </form>
    </div>
  );
}
