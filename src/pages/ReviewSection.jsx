import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ReviewSection.css";

const API_URL = "http://localhost:8081/api/reviews";

export default function ReviewSection() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);

  // ✅ SAFE user parsing
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const userId = user?._id;
  const userName = user?.name;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadReviews();
  }, []);

  // 🔹 Load all reviews
  const loadReviews = async () => {
    try {
      const res = await axios.get(API_URL);
      setReviews(res.data);

      if (userId) {
        const reviewed = res.data.some(
          (r) => r.userId?.toString() === userId
        );
        setHasReviewed(reviewed);
      } else {
        setHasReviewed(false);
      }
    } catch (err) {
      console.error("Failed to load reviews", err);
    }
  };

  // 🔹 Submit review (instant UI update)
  const submitReview = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const res = await axios.post(API_URL, {
        userId,
        rating,
        comment,
      });

      // ✅ SHOW REVIEW IMMEDIATELY
      setReviews((prev) => [res.data, ...prev]);
      setHasReviewed(true);
      setRating(5);
      setComment("");
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting review");
    }
  };

  // 🔹 Admin delete review
  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert("Failed to delete review");
    }
  };

  return (
    <div className="review-section">
      <h2>Feedback & Reviews</h2>

      {/* ✅ Review Form */}
      {user && !hasReviewed && (
        <form className="review-form" onSubmit={submitReview}>
          <p className="logged-user">
            Logged in as <strong>{userName}</strong>
          </p>

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {"⭐".repeat(n)}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Write your feedback..."
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button type="submit">Submit Review</button>
        </form>
      )}

      {/* ✅ Messages */}
      {!user && (
        <p className="review-warning">Login to submit a review.</p>
      )}

      {user && hasReviewed && (
        <p className="review-warning">
          You already submitted a review.
        </p>
      )}

      {/* ✅ Review List */}
      <div className="review-list">
        {reviews.map((r) => (
          <div key={r._id} className="review-card">
            <h4>{r.username}</h4>
            <p>{"⭐".repeat(r.rating)}</p>
            <p>{r.comment}</p>
            <small>
              {new Date(r.createdAt).toLocaleDateString()}
            </small>

            {isAdmin && (
              <button
                className="delete-btn"
                onClick={() => deleteReview(r._id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
