import express from "express";
import { getMe } from "../controllers/userController.js";
import ensureAuthenticated from "../middleware/auth.js";

const router = express.Router();

router.get("/me", ensureAuthenticated, getMe);

export default router;
