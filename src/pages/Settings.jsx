import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Settings.css";

const API_BASE = "http://localhost:8081/api/settings"; // Your backend endpoint

export default function Settings() {
  const [settings, setSettings] = useState({
    platformName: "OL Mastery",
    notificationMessage: "",
    maxQuizAttempts: 3,
    discussionEnabled: true,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE);
      setSettings(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch settings");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
    setSuccess("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(API_BASE, settings);
      setSuccess("✅ Settings updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update settings");
    }
  };

  return (
    <div className="settings-page">
      <h2>OL Mastery Admin Settings</h2>
      {loading ? (
        <p>Loading settings...</p>
      ) : (
        <form className="settings-form" onSubmit={handleSave}>
          <label>Platform Name:</label>
          <input
            type="text"
            name="platformName"
            value={settings.platformName}
            onChange={handleChange}
            required
          />

          <label>Notification / Welcome Message:</label>
          <textarea
            name="notificationMessage"
            value={settings.notificationMessage}
            onChange={handleChange}
            rows={3}
          />

          <label>Max Quiz Attempts per Week:</label>
          <input
            type="number"
            name="maxQuizAttempts"
            value={settings.maxQuizAttempts}
            onChange={handleChange}
            min={1}
            max={10}
          />

          <label>
            <input
              type="checkbox"
              name="discussionEnabled"
              checked={settings.discussionEnabled}
              onChange={handleChange}
            />
            Enable Discussion Rooms
          </label>

          <button type="submit">Save Settings</button>
          {success && <p className="success-message">{success}</p>}
        </form>
      )}
    </div>
  );
}
