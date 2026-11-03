// Part A - HTTP module + FS module (no Express)
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const PORT = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In-memory "database"
const tasks = [
  { id: 1, taskName: "Develop Login Page", assignedTo: "Rahul Sharma", status: "Pending" },
  { id: 2, taskName: "Design Database Schema", assignedTo: "Priya Verma", status: "In Progress" },
  { id: 3, taskName: "Write Test Cases", assignedTo: "Amit Kumar", status: "Completed" },
];

const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const sendHtml = (res, statusCode, html) => {
  res.writeHead(statusCode, { "Content-Type": "text/html" });
  res.end(html);
};

const server = http.createServer((req, res) => {
  const { url, method } = req;

  // GET /
  if (url === "/" && method === "GET") {
    return sendHtml(res, 200, "<h1>Welcome to Employee Task Management</h1>");
  }

  // GET /tasks
  if (url === "/tasks" && method === "GET") {
    return sendJson(res, 200, { count: tasks.length, data: tasks });
  }

  // GET /about
  if (url === "/about" && method === "GET") {
    return sendHtml(
      res,
      200,
      "<h1>About</h1><p>Employee Task Management Application built with Node.js HTTP and FS modules.</p>"
    );
  }

  // GET /home -> serve public/index.html using fs
  if (url === "/home" && method === "GET") {
    const filePath = path.join(__dirname, "public", "index.html");
    return fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        return sendHtml(res, 500, "<h1>500 - Could not read the file</h1>");
      }
      sendHtml(res, 200, data);
    });
  }

  // POST /add-task
  if (url === "/add-task" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      let task;
      try {
        task = JSON.parse(body);
      } catch {
        return sendJson(res, 400, { error: "Invalid JSON" });
      }

      const { id, taskName, assignedTo, status } = task;
      if (id === undefined || !taskName || !assignedTo || !status) {
        return sendJson(res, 400, {
          error: "id, taskName, assignedTo and status are required",
        });
      }
      if (tasks.some((t) => t.id === id)) {
        return sendJson(res, 400, { error: `Task with id ${id} already exists` });
      }

      const newTask = { id, taskName, assignedTo, status };
      tasks.push(newTask);
      sendJson(res, 201, { message: "Task added successfully", task: newTask });
    });
    return;
  }

  // Anything else -> 404
  sendHtml(res, 404, "<h1>404 - Page Not Found</h1>");
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});