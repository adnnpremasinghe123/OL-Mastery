import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Sample data (replace with API call in real app)
const sampleItems = [
  { id: 1, title: "Mathematics Basics" },
  { id: 2, title: "Advanced Science" },
  { id: 3, title: "English Grammar" },
  { id: 4, title: "History of Sri Lanka" },
  { id: 5, title: "Geography of Asia" },
  { id: 6, title: "IT Fundamentals" },
];

export default function SearchPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query") || "";
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Simple search: filter items that include the query (case-insensitive)
    const filtered = sampleItems.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Search Results for "{query}"</h2>

      {results.length > 0 ? (
        <ul>
          {results.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      ) : (
        <p>No results found for "{query}"</p>
      )}
    </div>
  );
}
