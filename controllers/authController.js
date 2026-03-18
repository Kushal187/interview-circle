import bcrypt from "bcrypt";
import connectDB from "../db/connectDB.js";
import passport from "../config/passport.js";

const SALT_ROUNDS = 10;

async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const db = await connectDB();
    const existing = await db
      .collection("users")
      .findOne({ $or: [{ username }, { email }] });

    if (existing) {
      return res
        .status(409)
        .json({ error: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const now = new Date();

    const result = await db.collection("users").insertOne({
      username,
      email,
      hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    const user = { _id: result.insertedId, username, email };

    req.login(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Login after registration failed" });
      }
      res.status(201).json({
        user: { _id: user._id, username: user.username, email: user.email },
      });
    });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
}

function login(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Login failed" });
    }
    if (!user) {
      return res
        .status(401)
        .json({ error: info?.message || "Invalid credentials" });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Login failed" });
      }
      res.json({
        user: { _id: user._id, username: user.username, email: user.email },
      });
    });
  })(req, res, next);
}

function logout(req, res) {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Session destruction failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out" });
    });
  });
}

function session(req, res) {
  if (req.isAuthenticated()) {
    const { _id, username, email } = req.user;
    return res.json({ user: { _id, username, email } });
  }
  res.json({ user: null });
}

export { register, login, logout, session };
