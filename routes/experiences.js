import express from "express";
import { createExperience } from "../controllers/experienceController.js";
import ensureAuthenticated from "../middleware/auth.js";

const router = express.Router();

router.post("/", ensureAuthenticated, createExperience);

export default router;
