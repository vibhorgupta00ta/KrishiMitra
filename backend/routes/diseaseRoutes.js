import express from "express";
import {
    detectDisease,
    getDiseaseHistory,
} from "../controllers/diseaseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/detect", protect, detectDisease);
router.get("/history", protect, getDiseaseHistory);

export default router;
