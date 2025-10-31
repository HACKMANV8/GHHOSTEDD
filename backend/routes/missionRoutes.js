import express from "express";
import { createMission, getMyMissions } from "../controllers/missionController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/missions", verifyToken, createMission);
router.get("/missions", verifyToken, getMyMissions);

export default router;
