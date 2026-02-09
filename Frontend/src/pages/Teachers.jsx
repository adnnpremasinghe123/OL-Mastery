import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Teachers.css";

const API_BASE = "http://localhost:8081/api/teachers";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [editingTeacher, setEditingTeacher] = useState(null);

  // Load teachers
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(API_BASE);
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch teachers");
    }
  };

  // Handle typing
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new teacher
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_BASE, formData);
      setFormData({ name: "", email: "", password: "" });
      fetchTeachers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add teacher");
    }
  };

  // Prepare edit
  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      password: "",
    });
  };

  // Update teacher
  const handleUpdateTeacher = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API_BASE}/${editingTeacher._id}`, {
        name: formData.name,
        email: formData.email,
      });

      setEditingTeacher(null);
      setFormData({ name: "", email: "", password: "" });
      fetchTeachers();
    } catch (err) {
      console.error(err);
      alert("Failed to update teacher");
    }
  };

  // Delete teacher
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;

    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchTeachers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete teacher");
    }
  };

  // Search filtering
  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="teachers-page">
      <h2>Manage Teachers</h2>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search teachers..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Add / Update Form */}
      <form
        className="teacher-form"
        onSubmit={editingTeacher ? handleUpdateTeacher : handleAddTeacher}
      >
        <input
          type="text"
          name="name"
          placeholder="Teacher Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Teacher Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Password only when adding */}
        {!editingTeacher && (
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        )}

        <button type="submit">
          {editingTeacher ? "Update Teacher" : "Add Teacher"}
        </button>

        {editingTeacher && (
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setEditingTeacher(null);
              setFormData({ name: "", email: "", password: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Teachers Table */}
      <table className="teachers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredTeachers.map((teacher) => (
            <tr key={teacher._id}>
              <td>{teacher.name}</td>
              <td>{teacher.email}</td>

              <td className="actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(teacher)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(teacher._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {filteredTeachers.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "10px" }}>
                No teachers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
