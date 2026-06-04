import DiseaseReport from "../models/DiseaseReport.js";

// @desc    Detect crop disease from image
// @route   POST /api/disease/detect
// @access  Private
const detectDisease = async (req, res, next) => {
    try {
        const { imageUrl } = req.body; // In a real scenario, this might be a file upload

        if (!imageUrl) {
            res.status(400);
            throw new Error("Please provide an image url for disease detection");
        }

        // Dummy detection response (AI model will be integrated later)
        const dummyDiseaseName = "Tomato Blight";
        const dummyConfidence = 94;
        const dummyRecommendation =
            "Remove and destroy infected leaves. Apply copper-based fungicide.";

        // Save report to history
        const report = await DiseaseReport.create({
            userId: req.user.id,
            imageUrl,
            diseaseName: dummyDiseaseName,
            confidence: dummyConfidence,
            recommendation: dummyRecommendation,
        });

        res.status(201).json({
            diseaseName: report.diseaseName,
            confidence: report.confidence,
            recommendation: report.recommendation,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get disease detection history for the logged in user
// @route   GET /api/disease/history
// @access  Private
const getDiseaseHistory = async (req, res, next) => {
    try {
        const history = await DiseaseReport.find({ userId: req.user.id }).sort({
            createdAt: -1,
        });
        res.json(history);
    } catch (error) {
        next(error);
    }
};

export { detectDisease, getDiseaseHistory };
