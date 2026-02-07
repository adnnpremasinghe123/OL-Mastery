import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UploadResource.css";

export default function UploadResource() {
  const user = JSON.parse(localStorage.getItem("user")); // {name, role}
  const token = localStorage.getItem("token"); // JWT token

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [resources, setResources] = useState([]);
  const [editingResource, setEditingResource] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/resources", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching resources");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setEditingResource(null);
    document.getElementById("fileInput").value = "";
  };

  // --------------------------
  // UPLOAD OR UPDATE RESOURCE
  // --------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !editingResource) return alert("Please select a file");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description || "");
    if (file) formData.append("file", file);

    try {
      if (editingResource) {
        // UPDATE
        await axios.put(
          `http://localhost:8081/api/resources/${editingResource._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Resource updated!");
      } else {
        // CREATE
        await axios.post("http://localhost:8081/api/resources/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Resource uploaded!");
      }

      resetForm();
      fetchResources();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error uploading resource");
    }
  };

  // --------------------------
  // DELETE RESOURCE
  // --------------------------
  const handleDelete = async (resource) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;

    try {
      await axios.delete(`http://localhost:8081/api/resources/${resource._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchResources();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error deleting resource");
    }
  };

  // --------------------------
  // EDIT RESOURCE
  // --------------------------
  const handleEdit = (resource) => {
    setEditingResource(resource);
    setTitle(resource.title);
    setDescription(resource.description || "");
    setFile(null); // optional: user can choose new file
  };

  return (
    <div className="upload-resource-container">
      <h2>{editingResource ? "Edit Resource" : "Upload Resource"}</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          id="fileInput"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required={!editingResource} // file required only on new upload
        />
        <div className="form-buttons">
          <button type="submit">{editingResource ? "Update Resource" : "Upload"}</button>
          {editingResource && (
            <button type="button" onClick={resetForm} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2>Uploaded Resources</h2>
      <div className="resources-list">
        {resources.length === 0 && <p>No resources uploaded yet.</p>}

        {resources.map((r) => (
          <div key={r._id} className="resource-card">
            <h4>{r.title}</h4>
            {r.description && <p>{r.description}</p>}
            <p>
              Uploaded by: {r.uploadedBy} ({r.role})
            </p>
            <a href={`http://localhost:8081${r.fileUrl}`} target="_blank" rel="noreferrer">
              Download
            </a>

            {(user.role === "admin" || user.role === "superadmin" || user.name === r.uploadedBy) && (
              <div className="resource-actions">
                <button className="edit-btn" onClick={() => handleEdit(r)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(r)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
