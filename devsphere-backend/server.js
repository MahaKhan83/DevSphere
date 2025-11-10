// server.js  — simple backend without DB
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// in-memory users list
let users = [];

// SIGN UP
app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  console.log("📥 SIGNUP body:", req.body);

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const userExists = users.find((u) => u.email === email);
  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  users.push({ name, email, password });
  console.log("✅ Users after signup:", users);

  return res.json({ message: "Signup successful" });
});

// LOGIN
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  console.log("📥 LOGIN body:", req.body);
  console.log("📦 Current users:", users);

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  return res.json({
    message: "Login successful",
    token: "fake-jwt-token",
    user,
  });
});

// FORGOT PASSWORD
app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  console.log("📥 FORGOT body:", req.body);

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(404).json({ error: "No user found with that email" });
  }

  return res.json({ message: "Password reset link sent (mock)" });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});