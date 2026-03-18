import express from "express";
import { getSignals, createSignal } from "../controllers/signalController.js";
import ensureAuthenticated from "../middleware/auth.js";

const router = express.Router();

router.get("/:experienceId", getSignals);
router.post("/", ensureAuthenticated, createSignal);

export default router;
