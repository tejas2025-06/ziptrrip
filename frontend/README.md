# Todo App — Frontend

A multi-page React application for managing todos. Built with React, React Router v6, and Axios.

## Tech Stack

- **React 18** – UI library
- **React Router v6** – Multi-page routing
- **Axios** – HTTP client for API calls
- **CSS Variables** – Theming (light/dark mode)

## Getting Started

```bash
cd frontend
npm install
npm start
```

App runs at: `http://localhost:3000`

> **Note:** The backend must be running at `http://localhost:5000` for the app to work.

---

## Pages

### 1. Todo List — `/`

The main page displaying all todos.

**Features:**
- **View all todos** in a card-based list
- **Add new todo** via modal form (+ New Todo button)
- **Edit existing todo** via the ✎ button on each card
- **Delete todo** with confirmation dialog
- **Toggle completion** by clicking the circle checkbox
- **Search** todos by title, description, or tags (real-time, debounced)
- **Filter** by status: All / Pending / Completed
- **Filter** by priority: All / High / Medium / Low
- **Sort** by: Newest First / Due Date / Priority / A→Z title
- **Priority indicator** — colored left border (red = high, yellow = medium, green = low)
- **Overdue badge** — due dates in the past highlighted in red
- **Tag display** — up to 2 tags shown inline on cards
- **Stats bar** — total, done, and pending counts at a glance
- **Toast notifications** for create / update / delete actions

### 2. Todo Details — `/todo?id=<uuid>`

A full-detail view for a single todo, loaded via query parameter.

**Features:**
- **Displays** title, description, completion status, priority badge
- **Metadata cards** — due date (with relative label e.g. "in 3d", "Tomorrow", "2d overdue"), created date, last updated date, todo ID
- **Tags list** shown as styled chips
- **Toggle completion** from this page (Mark Complete / Mark as Pending)
- **Delete** todo with confirmation
- **Back navigation** to the list page

---

## Components

| Component | File | Description |
|-----------|------|-------------|
| `Navbar` | `components/Navbar.jsx` | Top navigation bar with brand logo and dark mode toggle |
| `TodoItem` | `components/TodoItem.jsx` | Individual todo card with priority bar, checkbox, meta, and action buttons |
| `TodoModal` | Inside `TodoList.jsx` | Add/Edit form modal with tag input |
| `TagsInput` | Inside `TodoList.jsx` | Multi-tag input with pill display |
| `Toast` | Inside `TodoList.jsx` | Auto-dismissing notification |

---

## Features — Full List

| Feature | Location |
|---------|----------|
| Add todo | TodoList page → modal |
| Edit todo | TodoList page → modal |
| Delete todo | TodoList and TodoDetails page |
| Toggle complete | TodoList and TodoDetails page |
| Search | TodoList page toolbar |
| Filter by status | TodoList page toolbar |
| Filter by priority | TodoList page toolbar |
| Sort | TodoList page toolbar |
| Due date with overdue indicator | TodoList cards + TodoDetails |
| Priority levels (high/medium/low) | Everywhere |
| Tags | Modal input + card + detail page |
| Dark mode | Navbar toggle, persisted in localStorage |
| Responsive UI | All pages (mobile-friendly) |
| Toast notifications | TodoList page |
| Clickable title to detail | TodoList cards |
| Query param routing | TodoDetails (`?id=...`) |

---

## Dark Mode

Dark mode preference is saved in `localStorage` and applied via a `data-theme` attribute on the root element. Toggle using the button in the navbar.
