const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const DATA_FILE = path.join(__dirname, "../data/todos.json");

// Helper: read todos from file
function readTodos() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper: write todos to file
function saveTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2), "utf8");
}

// GET /todos — Get all todos (supports ?search=, ?filter=, ?priority=, ?sortBy=)
router.get("/", (req, res) => {
  let todos = readTodos();
  const { search, filter, priority, sortBy } = req.query;

  if (search) {
    const q = search.toLowerCase();
    todos = todos.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q)))
    );
  }

  if (filter === "completed") todos = todos.filter((t) => t.completed);
  if (filter === "pending") todos = todos.filter((t) => !t.completed);

  if (priority && priority !== "all") {
    todos = todos.filter((t) => t.priority === priority);
  }

  if (sortBy === "dueDate") {
    todos = todos.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  } else if (sortBy === "priority") {
    const order = { high: 0, medium: 1, low: 2 };
    todos = todos.sort((a, b) => (order[a.priority] ?? 3) - (order[b.priority] ?? 3));
  } else if (sortBy === "createdAt") {
    todos = todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === "title") {
    todos = todos.sort((a, b) => a.title.localeCompare(b.title));
  }

  res.json(todos);
});

// GET /todos/:id — Get single todo
router.get("/:id", (req, res) => {
  const todos = readTodos();
  const todo = todos.find((t) => t.id === req.params.id);
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  res.json(todo);
});

// POST /todos — Create new todo
router.post("/", (req, res) => {
  const { title, description, priority, dueDate, tags } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  const todos = readTodos();
  const now = new Date().toISOString();

  const newTodo = {
    id: uuidv4(),
    title: title.trim(),
    description: description ? description.trim() : "",
    completed: false,
    priority: priority || "medium",
    dueDate: dueDate || null,
    createdAt: now,
    updatedAt: now,
    tags: tags || [],
  };

  todos.push(newTodo);
  saveTodos(todos);
  res.status(201).json(newTodo);
});

// PUT /todos/:id — Update todo
router.put("/:id", (req, res) => {
  const todos = readTodos();
  const index = todos.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Todo not found" });

  const { title, description, completed, priority, dueDate, tags } = req.body;

  if (title !== undefined && !title.trim()) {
    return res.status(400).json({ error: "Title cannot be empty" });
  }

  todos[index] = {
    ...todos[index],
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description: description.trim() }),
    ...(completed !== undefined && { completed }),
    ...(priority !== undefined && { priority }),
    ...(dueDate !== undefined && { dueDate }),
    ...(tags !== undefined && { tags }),
    updatedAt: new Date().toISOString(),
  };

  saveTodos(todos);
  res.json(todos[index]);
});

// PATCH /todos/:id/toggle — Toggle completed status
router.patch("/:id/toggle", (req, res) => {
  const todos = readTodos();
  const index = todos.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Todo not found" });

  todos[index].completed = !todos[index].completed;
  todos[index].updatedAt = new Date().toISOString();

  saveTodos(todos);
  res.json(todos[index]);
});

// DELETE /todos/:id — Delete todo
router.delete("/:id", (req, res) => {
  const todos = readTodos();
  const index = todos.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Todo not found" });

  todos.splice(index, 1);
  saveTodos(todos);
  res.json({ message: "Todo deleted successfully" });
});

module.exports = router;
