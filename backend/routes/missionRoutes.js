// backend/routes/missionRoutes.js
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createMission, getMyMissions, getMissionDetails } from "../controllers/missionController.js";

const router = express.Router();

// Create and Get missions for logged-in user
router.post("/missions", verifyToken, createMission);
router.get("/missions", verifyToken, getMyMissions);

// Get details (nodes + env data + alerts)
router.get("/:id", getMissionDetails);


export default router;
