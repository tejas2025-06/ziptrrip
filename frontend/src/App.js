import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TodoList from "./pages/TodoList";
import TodoDetails from "./pages/TodoDetails";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode((d) => !d)} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<TodoList />} />
            <Route path="/todo" element={<TodoDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
