import express from 'express';
import multer from 'multer';
import { detectDisease } from '../controllers/diseaseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for memory storage (we just pass the buffer to the python API)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.post('/detect', protect, upload.single('image'), detectDisease);

export default router;
