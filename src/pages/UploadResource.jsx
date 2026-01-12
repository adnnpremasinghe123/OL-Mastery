import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UploadResource.css";

export default function UploadResource() {
  const user = JSON.parse(localStorage.getItem("user")); // {name, role}
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/resources");
      setResources(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching resources");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description || "");
    formData.append("uploadedBy", user.name);
    formData.append("role", user.role);
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8081/api/resources/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Resource uploaded!");
      setTitle("");
      setDescription("");
      setFile(null);
      document.getElementById("fileInput").value = ""; // reset file input
      fetchResources();
    } catch (err) {
      console.error(err);
      alert("Error uploading resource");
    }
  };

  return (
    <div className="upload-resource-container">
      <h2>Upload Resource</h2>
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
          required
        />
        <button type="submit">Upload</button>
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
          </div>
        ))}
      </div>
    </div>
  );
}
