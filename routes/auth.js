import express from "express";
import {
  register,
  login,
  logout,
  session,
} from "../controllers/authController.js";
import ensureAuthenticated from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", ensureAuthenticated, logout);
router.get("/session", session);

export default router;
