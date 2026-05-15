import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Students.css";

const API_BASE = "http://localhost:8081/api/users"; 

export default function Students() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // <-- NEW

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(API_BASE);
      const studentsOnly = res.data.filter(u => u.role === "student");
      setStudents(studentsOnly);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch students");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_BASE, { ...formData, role: "student" });
      setFormData({ name: "", email: "" });
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to add student");
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to delete student");
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({ name: student.name, email: student.email });
  };

  // Update student
  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/${editingStudent._id}`, { ...formData, role: "student" });
      setEditingStudent(null);
      setFormData({ name: "", email: "" });
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to update student");
    }
  };

 
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="students-page">
      <h2>Manage Students</h2>

      {/* 🔍 Search Input */}
      <input
        type="text"
        className="search-box"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

   
      <form
        className="student-form"
        onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
      >
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Student Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingStudent ? "Update Student" : "Add Student"}
        </button>
        {editingStudent && (
          <button type="button" onClick={() => setEditingStudent(null)}>
            Cancel
          </button>
        )}
      </form>

      <table className="students-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(student)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(student._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
