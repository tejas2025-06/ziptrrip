# TodoFlow — Full Stack Todo Application

A complete full-stack Todo application built with **React** (frontend) and **Node.js + Express** (backend). Data is persisted in a local JSON file.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Storage | JSON file (`backend/data/todos.json`) |
| Styling | Custom CSS with CSS variables (light/dark) |

---

## Project Structure

```
todo-app/
├── backend/
│   ├── server.js          # Express app entry point
│   ├── package.json
│   ├── routes/
│   │   └── todos.js       # CRUD route handlers
│   ├── data/
│   │   └── todos.json     # Persistent data store
│   └── README.md          # Backend API docs
│
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js         # Root component + routing
│   │   ├── App.css        # Global styles + theming
│   │   ├── index.js       # React entry point
│   │   ├── pages/
│   │   │   ├── TodoList.jsx     # Page 1: All todos
│   │   │   └── TodoDetails.jsx  # Page 2: Single todo (?id=...)
│   │   └── components/
│   │       ├── Navbar.jsx       # Navigation bar
│   │       └── TodoItem.jsx     # Todo card component
│   └── README.md          # Frontend feature docs
│
├── README.md              # This file
└── .gitignore
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd todo-app
```

### 2. Start the Backend

```bash
cd backend
npm install
npm start        # or: npm run dev (auto-reload)
```

Backend runs at: `http://localhost:5000`

### 3. Start the Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## Features

### Todo List Page (`/`)

- View all todos in a card layout
- Add new todo (title, description, priority, due date, tags)
- Edit any todo inline via modal
- Delete todo with confirmation
- Toggle completion status
- Search by title, description, or tags
- Filter by completion status (All / Pending / Completed)
- Filter by priority (High / Medium / Low)
- Sort by newest, due date, priority, or title
- Stats bar with total / done / pending counts
- Toast notifications for all actions

### Todo Details Page (`/todo?id=<uuid>`)

- Full view of a single todo via URL query parameter
- Displays: title, description, status badge, priority badge
- Metadata: due date (relative), created at, updated at, ID
- Tags displayed as chips
- Toggle completion from this page
- Delete from this page

### Additional Features

- 🌙 **Dark mode** — toggle in navbar, saved to `localStorage`
- 📱 **Responsive** — works on mobile and desktop
- 🏷 **Tags** — multi-tag input with pill display
- 🔴 **Overdue detection** — red highlight for past due dates
- 🟥🟡🟢 **Priority colors** — left border + badge color coding

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos` | Get all todos (supports `?search=`, `?filter=`, `?priority=`, `?sortBy=`) |
| GET | `/todos/:id` | Get single todo |
| POST | `/todos` | Create new todo |
| PUT | `/todos/:id` | Update todo |
| PATCH | `/todos/:id/toggle` | Toggle completed |
| DELETE | `/todos/:id` | Delete todo |

Full API docs in [`backend/README.md`](./backend/README.md).

---

## Data Model

```json
{
  "id": "uuid-string",
  "title": "string",
  "description": "string",
  "completed": false,
  "priority": "high | medium | low",
  "dueDate": "YYYY-MM-DD",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp",
  "tags": ["string"]
}
```
