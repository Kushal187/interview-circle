import express from "express";
import {
  createExperience,
  getAllExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js";
import ensureAuthenticated from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllExperiences);
router.get("/:id", getExperienceById);
router.post("/", ensureAuthenticated, createExperience);
router.put("/:id", ensureAuthenticated, updateExperience);
router.delete("/:id", ensureAuthenticated, deleteExperience);

export default router;
