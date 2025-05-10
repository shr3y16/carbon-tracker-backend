import express from "express";
import { registerUser, loginUser } from "./services/authService";

const app = express();
app.use(express.json());

// POST /register
app.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const user = await registerUser(email, password, name);
    res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await loginUser(email, password);
    res.status(200).json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
  console.log("Hello, World!");
});

export default app;
