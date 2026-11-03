// Part B - REST API with Express
import express from "express";

const PORT = 4000;
const app = express();

app.use(express.json());

let tasks = [
  { id: 1, taskName: "Develop Login Page", assignedTo: "Rahul Sharma", status: "Pending", priority: "High" },
  { id: 2, taskName: "Design Database Schema", assignedTo: "Priya Verma", status: "In Progress", priority: "Medium" },
  { id: 3, taskName: "Write Test Cases", assignedTo: "Amit Kumar", status: "Completed", priority: "Low" },
];

// GET /tasks - all tasks
app.get("/tasks", (req, res) => {
  res.json({ count: tasks.length, data: tasks });
});

// GET /tasks/:id - one task
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ message: `Task with id ${id} not found` });
  }
  res.json(task);
});

// POST /tasks - add
app.post("/tasks", (req, res) => {
  const { id, taskName, assignedTo, status, priority } = req.body ?? {};
  if (id === undefined || !taskName || !assignedTo || !status || !priority) {
    return res.status(400).json({
      message: "id, taskName, assignedTo, status and priority are required",
    });
  }
  if (tasks.some((t) => t.id === id)) {
    return res.status(400).json({ message: `Task with id ${id} already exists` });
  }
  const task = { id, taskName, assignedTo, status, priority };
  tasks.push(task);
  res.status(201).json({ message: "Task added successfully", task });
});

// PUT /tasks/:id - update
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ message: `Task with id ${id} not found` });
  }
  const { taskName, assignedTo, status, priority } = req.body ?? {};
  if (!taskName || !assignedTo || !status || !priority) {
    return res.status(400).json({
      message: "taskName, assignedTo, status and priority are required",
    });
  }
  Object.assign(task, { taskName, assignedTo, status, priority });
  res.json({ message: "Task updated successfully", task });
});

// DELETE /tasks/:id - remove
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ message: `Task with id ${id} not found` });
  }
  const [deleted] = tasks.splice(index, 1);
  res.json({ message: "Task deleted successfully", task: deleted });
});

// Invalid routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});