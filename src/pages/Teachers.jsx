import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Teachers.css"; // You can style the page

const API_BASE = "http://localhost:8081/api/users";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch teachers
  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}?role=teacher`);
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load teachers");
    }
    setLoading(false);
  };

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or update teacher
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE}/register`, { ...formData, role: "teacher" });
      }
      setFormData({ name: "", email: "", password: "" });
      loadTeachers();
    } catch (err) {
      console.error(err);
      alert("Failed to save teacher");
    }
  };

  // Edit teacher
  const handleEdit = (teacher) => {
    setEditingId(teacher._id);
    setFormData({ name: teacher.name, email: teacher.email, password: "" });
  };

  // Delete teacher
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      loadTeachers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete teacher");
    }
  };

  return (
    <div className="teachers-page">
      <h2>Manage Teachers</h2>

      <form className="teacher-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          placeholder={editingId ? "New Password (optional)" : "Password"}
          onChange={handleChange}
          required={!editingId}
        />
        <button type="submit">{editingId ? "Update Teacher" : "Add Teacher"}</button>
        {editingId && <button onClick={() => { setEditingId(null); setFormData({ name: "", email: "", password: "" }) }}>Cancel</button>}
      </form>

      <h3>Teachers List</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="teachers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>{t.email}</td>
                <td>
                  <button onClick={() => handleEdit(t)}>Edit</button>
                  <button onClick={() => handleDelete(t._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
