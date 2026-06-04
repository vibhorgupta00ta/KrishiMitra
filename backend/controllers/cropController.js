import CropPrediction from "../models/CropPrediction.js";

// @desc    Predict suitable crop
// @route   POST /api/crop/predict
// @access  Private
const predictCrop = async (req, res, next) => {
    try {
        const {
            nitrogen,
            phosphorus,
            potassium,
            temperature,
            humidity,
            ph,
            rainfall,
        } = req.body;

        if (
            nitrogen == null ||
            phosphorus == null ||
            potassium == null ||
            temperature == null ||
            humidity == null ||
            ph == null ||
            rainfall == null
        ) {
            res.status(400);
            throw new Error("Please provide all required parameters for prediction");
        }

        // Dummy prediction response (AI model will be integrated later)
        const dummyPredictedCrop = "Rice";

        // Save prediction to history
        const prediction = await CropPrediction.create({
            userId: req.user.id,
            nitrogen,
            phosphorus,
            potassium,
            temperature,
            humidity,
            ph,
            rainfall,
            predictedCrop: dummyPredictedCrop,
        });

        res.status(201).json({
            predictedCrop: prediction.predictedCrop,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get crop prediction history for the logged in user
// @route   GET /api/crop/history
// @access  Private
const getCropHistory = async (req, res, next) => {
    try {
        const history = await CropPrediction.find({ userId: req.user.id }).sort({
            createdAt: -1,
        });
        res.json(history);
    } catch (error) {
        next(error);
    }
};

export { predictCrop, getCropHistory };
