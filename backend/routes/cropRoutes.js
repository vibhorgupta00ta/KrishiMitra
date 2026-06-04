import express from "express";
import { predictCrop, getCropHistory } from "../controllers/cropController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/predict", protect, predictCrop);
router.get("/history", protect, getCropHistory);

export default router;
