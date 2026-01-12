import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Students.css";

const API_BASE = "http://localhost:8081/api/users"; // Replace with your backend endpoint

export default function Students() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", class: "" });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(API_BASE);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch students");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_BASE, formData);
      setFormData({ name: "", email: "", class: "" });
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to add student");
    }
  };

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

  return (
    <div className="students-page">
      <h2>Manage Students</h2>

      <form className="student-form" onSubmit={handleAddStudent}>
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
        <input
          type="text"
          name="class"
          placeholder="Class"
          value={formData.class}
          onChange={handleChange}
        />
        <button type="submit">Add Student</button>
      </form>

      <table className="students-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Class</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.class}</td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(student._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
