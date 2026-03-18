import express from "express";
import {
  getSignals,
  createSignal,
  updateSignal,
  deleteSignal,
} from "../controllers/signalController.js";
import ensureAuthenticated from "../middleware/auth.js";

const router = express.Router();

router.get("/:experienceId", getSignals);
router.post("/", ensureAuthenticated, createSignal);
router.put("/:experienceId", ensureAuthenticated, updateSignal);
router.delete("/:experienceId", ensureAuthenticated, deleteSignal);

export default router;
