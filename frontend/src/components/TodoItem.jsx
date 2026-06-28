import React from "react";
import { useNavigate } from "react-router-dom";

function formatDueDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = date < today;
  const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return { label, isOverdue };
}

function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const navigate = useNavigate();
  const due = formatDueDate(todo.dueDate);

  return (
    <div className={`todo-card ${todo.completed ? "completed" : ""}`}>
      <div className={`priority-bar ${todo.priority || "medium"}`} />

      <button
        className={`checkbox-btn ${todo.completed ? "checked" : ""}`}
        onClick={() => onToggle(todo.id)}
        title={todo.completed ? "Mark as pending" : "Mark as complete"}
      >
        {todo.completed ? "✓" : ""}
      </button>

      <div className="todo-body">
        <a
          className="todo-title"
          onClick={() => navigate(`/todo?id=${todo.id}`)}
          href="#"
          onClick={(e) => { e.preventDefault(); navigate(`/todo?id=${todo.id}`); }}
        >
          {todo.title}
        </a>

        {todo.description && (
          <div className="todo-desc">{todo.description}</div>
        )}

        <div className="todo-meta">
          <span className={`meta-chip priority-${todo.priority || "medium"}`}>
            {(todo.priority || "medium").charAt(0).toUpperCase() + (todo.priority || "medium").slice(1)}
          </span>

          {due && (
            <span className={`meta-chip due ${due.isOverdue && !todo.completed ? "overdue" : ""}`}>
              📅 {due.label}
              {due.isOverdue && !todo.completed ? " · Overdue" : ""}
            </span>
          )}

          {todo.tags && todo.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="meta-chip tag">#{tag}</span>
          ))}
          {todo.tags && todo.tags.length > 2 && (
            <span className="meta-chip tag">+{todo.tags.length - 2}</span>
          )}
        </div>
      </div>

      <div className="todo-actions">
        <button
          className="icon-btn"
          onClick={() => navigate(`/todo?id=${todo.id}`)}
          title="View details"
        >👁</button>
        <button
          className="icon-btn"
          onClick={() => onEdit(todo)}
          title="Edit"
        >✎</button>
        <button
          className="icon-btn danger"
          onClick={() => onDelete(todo.id)}
          title="Delete"
        >✕</button>
      </div>
    </div>
  );
}

export default TodoItem;
