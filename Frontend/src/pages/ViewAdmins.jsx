import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewAdmins.css";

export default function ViewAdmins() {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "", role: "admin" });
  const token = localStorage.getItem("token"); // JWT token

  useEffect(() => { fetchAdmins(); }, []);

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/admins/view", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch admins");
    }
  };

  // Delete admin
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/admins/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Admin deleted successfully");
      fetchAdmins();
    } catch (err) {
      console.error(err);
      alert("Failed to delete admin");
    }
  };

  // Edit admin
  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setEditData({ name: admin.name, email: admin.email, role: admin.role });
  };

  const handleChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8081/api/admins/edit/${editingAdmin._id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Admin updated successfully");
      setEditingAdmin(null);
      fetchAdmins();
    } catch (err) {
      console.error(err);
      alert("Failed to update admin");
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin List</h1>
      <input
        type="text"
        placeholder="Search by name/email..."
        className="search-box"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins
            .filter(a => a.name.toLowerCase().includes(search.toLowerCase()) ||
                        a.email.toLowerCase().includes(search.toLowerCase()))
            .map(admin => (
              <tr key={admin._id}>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.role}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(admin)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(admin._id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editingAdmin && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Admin</h2>
            <form onSubmit={handleEditSubmit}>
              <label>Name</label>
              <input type="text" name="name" value={editData.name} onChange={handleChange} required />
              <label>Email</label>
              <input type="email" name="email" value={editData.email} onChange={handleChange} required />
              <label>Role</label>
              <select name="role" value={editData.role} onChange={handleChange}>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setEditingAdmin(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
