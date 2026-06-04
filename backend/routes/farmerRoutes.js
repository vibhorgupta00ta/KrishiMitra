import express from "express";
import {
    getFarmerProfile,
    updateFarmerProfile,
} from "../controllers/farmerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
    .route("/profile")
    .get(protect, getFarmerProfile)
    .put(protect, updateFarmerProfile);

export default router;
