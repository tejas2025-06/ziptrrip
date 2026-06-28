import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/todos";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDueDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((date - today) / 86400000);
  const label = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  if (diffDays < 0) return { label: `${label} (${Math.abs(diffDays)}d overdue)`, isOverdue: true };
  if (diffDays === 0) return { label: `${label} (Today)`, isOverdue: false };
  if (diffDays === 1) return { label: `${label} (Tomorrow)`, isOverdue: false };
  return { label: `${label} (in ${diffDays}d)`, isOverdue: false };
}

export default function TodoDetails() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const id = params.get("id");

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("No todo ID provided in the URL.");
      setLoading(false);
      return;
    }

    axios
      .get(`${API}/${id}`)
      .then((res) => setTodo(res.data))
      .catch((err) => {
        if (err.response?.status === 404) setError("Todo not found.");
        else setError("Failed to load todo. Is the backend running?");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const res = await axios.patch(`${API}/${id}/toggle`);
      setTodo(res.data);
    } catch {
      alert("Failed to update todo.");
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this todo permanently?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      navigate("/");
    } catch {
      alert("Failed to delete todo.");
    }
  };

  if (loading) {
    return (
      <div>
        <Link to="/" className="back-link">← Back to todos</Link>
        <div className="loading-wrap">
          <div className="spinner" />
          <p>Loading todo...</p>
        </div>
      </div>
    );
  }

  if (error || !todo) {
    return (
      <div>
        <Link to="/" className="back-link">← Back to todos</Link>
        <div className="error-box">{error || "Todo not found."}</div>
      </div>
    );
  }

  const due = formatDueDate(todo.dueDate);
  const priorityLabel = (todo.priority || "medium");

  return (
    <div>
      <Link to="/" className="back-link">← Back to todos</Link>

      <div className="detail-card">
        {/* Header */}
        <div className="detail-header">
          <div style={{ flex: 1 }}>
            <h1 className={`detail-title ${todo.completed ? "completed-text" : ""}`}>
              {todo.title}
            </h1>
            <div className="detail-badges">
              <span className={`badge ${todo.completed ? "completed" : "pending"}`}>
                {todo.completed ? "✓ Completed" : "○ Pending"}
              </span>
              <span className={`badge ${priorityLabel}`}>
                {priorityLabel === "high" ? "🔴" : priorityLabel === "medium" ? "🟡" : "🟢"}{" "}
                {priorityLabel.charAt(0).toUpperCase() + priorityLabel.slice(1)} Priority
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="detail-body">
          {/* Description */}
          {todo.description && (
            <div className="detail-section">
              <div className="detail-section-label">Description</div>
              <p>{todo.description}</p>
            </div>
          )}

          {/* Meta grid */}
          <div className="detail-grid">
            <div className="detail-meta-card">
              <div className="detail-meta-label">Due Date</div>
              <div
                className="detail-meta-value"
                style={{ color: due?.isOverdue && !todo.completed ? "var(--danger)" : undefined }}
              >
                {due ? due.label : "No due date"}
              </div>
            </div>

            <div className="detail-meta-card">
              <div className="detail-meta-label">Created</div>
              <div className="detail-meta-value">{formatDate(todo.createdAt)}</div>
            </div>

            <div className="detail-meta-card">
              <div className="detail-meta-label">Last Updated</div>
              <div className="detail-meta-value">{formatDate(todo.updatedAt)}</div>
            </div>

            <div className="detail-meta-card">
              <div className="detail-meta-label">Todo ID</div>
              <div className="detail-meta-value" style={{ fontSize: "0.78rem", fontFamily: "monospace" }}>
                {todo.id}
              </div>
            </div>
          </div>

          {/* Tags */}
          {todo.tags && todo.tags.length > 0 && (
            <div className="detail-section">
              <div className="detail-section-label">Tags</div>
              <div className="tags-list">
                {todo.tags.map((tag) => (
                  <span key={tag} className="tag-badge">#{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="detail-actions">
          <button
            className={`btn ${todo.completed ? "btn-ghost" : "btn-primary"}`}
            onClick={handleToggle}
            disabled={toggling}
          >
            {toggling ? "..." : todo.completed ? "Mark as Pending" : "✓ Mark Complete"}
          </button>

          <button
            className="btn btn-ghost"
            onClick={() => navigate(`/?edit=${todo.id}`)}
            onClick={() => navigate("/")}
          >
            ← Back to List
          </button>

          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
