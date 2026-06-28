import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TodoItem from "../components/TodoItem";

const API = "http://localhost:5000/todos";

function TagsInput({ tags, setTags }) {
  const [input, setInput] = useState("");

  const addTag = (val) => {
    const t = val.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setInput("");
  };

  const handleKey = (e) => {
    if (["Enter", ",", " "].includes(e.key)) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };

  return (
    <div className="tags-input-wrap">
      {tags.map((t) => (
        <span key={t} className="tag-pill">
          #{t}
          <button onClick={() => setTags(tags.filter((x) => x !== t))}>×</button>
        </span>
      ))}
      <input
        className="tag-input-field"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => input && addTag(input)}
        placeholder={tags.length ? "" : "Add tags (press Enter)"}
      />
    </div>
  );
}

const EMPTY_FORM = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
  tags: [],
};

function TodoModal({ todo, onClose, onSave }) {
  const [form, setForm] = useState(
    todo
      ? { title: todo.title, description: todo.description || "", priority: todo.priority || "medium", dueDate: todo.dueDate || "", tags: todo.tags || [] }
      : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError("Title is required."); return; }
    setSaving(true);
    setError("");
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      setError(e.response?.data?.error || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{todo ? "Edit Todo" : "New Todo"}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-box">{error}</div>}

        <div className="form-group">
          <label className="form-label">Title *</label>
          <input
            className="form-input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="What needs to be done?"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Add more details..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              className="form-select"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-input"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Tags</label>
          <TagsInput tags={form.tags} setTags={(tags) => setForm({ ...form, tags })} />
        </div>

        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : todo ? "Save Changes" : "Add Todo"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className={`toast ${type}`}>{type === "success" ? "✓" : "✕"} {message}</div>;
}

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [priority, setPriority] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [modal, setModal] = useState(null); // null | "add" | todo object
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
  };

  const fetchTodos = useCallback(async () => {
    try {
      setError("");
      const params = {};
      if (search) params.search = search;
      if (filter !== "all") params.filter = filter;
      if (priority !== "all") params.priority = priority;
      if (sortBy) params.sortBy = sortBy;
      const res = await axios.get(API, { params });
      setTodos(res.data);
    } catch {
      setError("Failed to load todos. Make sure the backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  }, [search, filter, priority, sortBy]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(fetchTodos, 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleToggle = async (id) => {
    try {
      await axios.patch(`${API}/${id}/toggle`);
      fetchTodos();
    } catch {
      addToast("Failed to update todo.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this todo?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      addToast("Todo deleted.");
      fetchTodos();
    } catch {
      addToast("Failed to delete.", "error");
    }
  };

  const handleSave = async (form) => {
    if (modal && modal.id) {
      await axios.put(`${API}/${modal.id}`, form);
      addToast("Todo updated.");
    } else {
      await axios.post(API, form);
      addToast("Todo created!");
    }
    fetchTodos();
  };

  const completed = todos.filter((t) => t.completed).length;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Todos</h1>
          <p className="page-subtitle">Stay on top of your tasks</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal("add")}>
          + New Todo
        </button>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <span className="stat-chip"><span>{todos.length}</span> total</span>
        <span className="stat-chip"><span>{completed}</span> done</span>
        <span className="stat-chip"><span>{todos.length - completed}</span> pending</span>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search todos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="select-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <select className="select-filter" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="all">All Priority</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>

        <select className="select-filter" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Newest First</option>
          <option value="dueDate">By Due Date</option>
          <option value="priority">By Priority</option>
          <option value="title">A → Z</option>
        </select>
      </div>

      {/* Error */}
      {error && <div className="error-box">{error}</div>}

      {/* List */}
      {loading ? (
        <div className="loading-wrap">
          <div className="spinner" />
          <p>Loading todos...</p>
        </div>
      ) : todos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>{search || filter !== "all" || priority !== "all" ? "No todos match your filters" : "No todos yet!"}</h3>
          <p>{search ? "Try a different search." : "Click '+ New Todo' to get started."}</p>
        </div>
      ) : (
        <div className="todo-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onEdit={(t) => setModal(t)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <TodoModal
          todo={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onDone={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))}
          />
        ))}
      </div>
    </div>
  );
}
