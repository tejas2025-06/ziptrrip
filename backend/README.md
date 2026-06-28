# Todo App — Backend

A RESTful API built with **Node.js** and **Express.js** that powers the Todo application. Data is persisted in a local JSON file.

## Tech Stack

- **Node.js** – Runtime environment
- **Express.js** – Web framework
- **UUID** – Unique ID generation
- **nodemon** – Auto-restart during development

## Getting Started

```bash
cd backend
npm install
npm run dev     # development (auto-reload)
npm start       # production
```

Server runs at: `http://localhost:5000`

---

## API Reference

### Base URL
```
http://localhost:5000
```

---

### GET `/todos`

Returns all todos. Supports query parameters for filtering, searching, and sorting.

| Query Param | Values | Description |
|-------------|--------|-------------|
| `search` | any string | Filter by title, description, or tags |
| `filter` | `completed`, `pending` | Filter by completion status |
| `priority` | `high`, `medium`, `low` | Filter by priority level |
| `sortBy` | `dueDate`, `priority`, `createdAt`, `title` | Sort order |

**Example:**
```
GET /todos?search=react&filter=pending&sortBy=priority
```

**Response:**
```json
[
  {
    "id": "uuid-here",
    "title": "Learn React",
    "description": "Complete React basics",
    "completed": false,
    "priority": "high",
    "dueDate": "2025-06-20",
    "createdAt": "2025-06-01T10:00:00.000Z",
    "updatedAt": "2025-06-01T10:00:00.000Z",
    "tags": ["learning", "frontend"]
  }
]
```

---

### GET `/todos/:id`

Returns a single todo by ID.

**Response:** `200 OK` with todo object, or `404` if not found.

---

### POST `/todos`

Creates a new todo.

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "priority": "high | medium | low (default: medium)",
  "dueDate": "YYYY-MM-DD (optional)",
  "tags": ["array", "of", "strings"]
}
```

**Response:** `201 Created` with the new todo object.

---

### PUT `/todos/:id`

Updates an existing todo. All fields are optional — only provided fields are updated.

**Request Body:** Same fields as POST (all optional).

**Response:** `200 OK` with updated todo, or `404` if not found.

---

### PATCH `/todos/:id/toggle`

Toggles the `completed` status of a todo (true ↔ false).

**Response:** `200 OK` with updated todo.

---

### DELETE `/todos/:id`

Deletes a todo by ID.

**Response:** `200 OK` with `{ message: "Todo deleted successfully" }`, or `404` if not found.

---

## Data Model

Each todo has the following structure:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Unique identifier |
| `title` | string | Todo title (required) |
| `description` | string | Detailed description |
| `completed` | boolean | Completion status |
| `priority` | string | `high`, `medium`, or `low` |
| `dueDate` | string | ISO date string (YYYY-MM-DD) |
| `createdAt` | string | ISO timestamp of creation |
| `updatedAt` | string | ISO timestamp of last update |
| `tags` | string[] | Array of tag labels |

## Data Storage

Data is stored in `data/todos.json`. The file is read/written synchronously on each request. For production use, replace with a database (MongoDB, SQLite, etc.).
