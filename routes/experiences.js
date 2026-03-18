import express from "express";
import {
  createExperience,
  getAllExperiences,
  getExperienceById,
} from "../controllers/experienceController.js";
import ensureAuthenticated from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllExperiences);
router.get("/:id", getExperienceById);
router.post("/", ensureAuthenticated, createExperience);

export default router;
