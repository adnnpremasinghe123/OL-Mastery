import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UploadResource.css";

export default function UploadResource() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);

  const [resources, setResources] = useState([]);
  const [editingResource, setEditingResource] =
    useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  // ================= FETCH =================

  const fetchResources = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8081/api/resources",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResources(res.data);

    } catch (err) {
      console.error(err);
      alert("Error fetching resources");
    }
  };

  // ================= RESET FORM =================

  const resetForm = () => {
    setDescription("");
    setSubject("");
    setFile(null);
    setEditingResource(null);

    const fileInput =
      document.getElementById("fileInput");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // ================= UPLOAD / UPDATE =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file && !editingResource) {
      return alert("Please select a file");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "description",
        description
      );

      formData.append(
        "subject",
        subject
      );

      if (file) {
        formData.append("file", file);
      }

      // ===== UPDATE =====

      if (editingResource) {
        await axios.put(
          `http://localhost:8081/api/resources/${editingResource._id}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",

              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(
          "✅ Resource updated successfully"
        );
      }

      // ===== CREATE =====

      else {
        await axios.post(
          "http://localhost:8081/api/resources/upload",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",

              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(
          "✅ Resource uploaded successfully"
        );
      }

      resetForm();
      fetchResources();

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.error ||
          "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================

  const handleDelete = async (resource) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resource?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:8081/api/resources/${resource._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("🗑 Resource deleted");

      fetchResources();

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.error ||
          "Error deleting resource"
      );
    }
  };

  // ================= EDIT =================

  const handleEdit = (resource) => {
    setEditingResource(resource);

    setDescription(
      resource.description || ""
    );

    setSubject(resource.subject || "");

    setFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= FILE TYPE =================

  const getFileType = (url) => {
    if (!url) return "FILE";

    const ext =
      url.split(".").pop().toLowerCase();

    if (ext === "pdf") return "PDF";

    if (
      ext === "doc" ||
      ext === "docx"
    )
      return "DOC";

    if (
      ext === "ppt" ||
      ext === "pptx"
    )
      return "PPT";

    if (
      ext === "jpg" ||
      ext === "jpeg" ||
      ext === "png"
    )
      return "IMAGE";

    return ext.toUpperCase();
  };

  return (
    <div className="resource-page">

      {/* ================= PAGE TITLE ================= */}

      <div className="resource-title">

        <h2>
          📚 Learning Resources
        </h2>

        <p>
          Upload and manage OL study
          materials
        </p>

      </div>

      {/* ================= FORM ================= */}

      <form
        onSubmit={handleSubmit}
        className="upload-form"
      >

        <h3>
          {editingResource
            ? "✏ Edit Resource"
            : "⬆ Upload New Resource"}
        </h3>

        {/* SUBJECT */}

        <div className="form-group">

          <label>
            Subject
          </label>

          <select
            value={subject}
            onChange={(e) =>
              setSubject(
                e.target.value
              )
            }
            required
          >
            <option value="">
              Select Subject
            </option>

            <option>
              Mathematics
            </option>

            <option>
              Science
            </option>

            <option>
              ICT
            </option>

            <option>
              English
            </option>

            <option>
              History
            </option>

            <option>
              Geography
            </option>

            <option>
              Sinhala
            </option>

          </select>
        </div>

        {/* DESCRIPTION */}

        <div className="form-group">

          <label>
            Description
          </label>

          <textarea
            placeholder="Enter resource description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />

        </div>

        {/* FILE */}

        <div className="form-group">

          <label>
            {editingResource
              ? "Replace File (Optional)"
              : "Upload File"}
          </label>

          <input
            id="fileInput"
            type="file"
            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }
            required={!editingResource}
          />

        </div>

        {/* BUTTONS */}

        <div className="form-buttons">

          <button type="submit">

            {loading
              ? "Please wait..."
              : editingResource
              ? "Update Resource"
              : "Upload Resource"}

          </button>

          {editingResource && (
            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}

        </div>
      </form>

      {/* ================= TABLE ================= */}

      <div className="resources-section">

        <div className="resources-table-wrapper">

          <table className="resources-table">

            <thead>
              <tr>
                <th>Subject</th>
                <th>Type</th>
                <th>Uploaded By</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {resources.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="empty-state"
                  >
                    No resources uploaded yet
                  </td>
                </tr>

              ) : (

                resources.map((r) => (

                  <tr key={r._id}>

                    {/* SUBJECT */}

                    <td>
                      <span className="subject-badge">
                        {r.subject ||
                          "General"}
                      </span>
                    </td>

                    {/* FILE TYPE */}

                    <td>
                      <span className="file-badge">
                        {getFileType(
                          r.fileUrl
                        )}
                      </span>
                    </td>

                    {/* UPLOADER */}

                    <td>
                      {r.uploadedBy}

                      <br />

                      <small>
                        ({r.role})
                      </small>
                    </td>

                    {/* DESCRIPTION */}

                    <td>
                      {r.description ||
                        "No description"}
                    </td>

                    {/* ACTIONS */}

                    <td>

                      <div className="action-buttons">

                        {/* DOWNLOAD */}

                        <a
                          href={`http://localhost:8081${r.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="download-btn"
                        >
                          Download
                        </a>

                        {/* EDIT & DELETE */}

                        {(user.role ===
                          "admin" ||

                          user.role ===
                            "superadmin" ||

                          user.name ===
                            r.uploadedBy) && (
                          <>

                            <button
                              className="edit-btn"
                              onClick={() =>
                                handleEdit(r)
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="delete-btn"
                              onClick={() =>
                                handleDelete(r)
                              }
                            >
                              Delete
                            </button>

                          </>
                        )}
                      </div>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}