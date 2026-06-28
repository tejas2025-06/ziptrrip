const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const todoRoutes = require("./routes/todos");
app.use("/todos", todoRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Todo API is running", version: "1.0.0" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
