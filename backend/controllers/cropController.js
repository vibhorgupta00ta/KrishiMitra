import CropPrediction from "../models/CropPrediction.js";
import Farm from "../models/Farm.js";
import axios from 'axios';

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
            language,
        } = req.body;

        // Fetch user's farm details to supplement missing data
        const farm = await Farm.findOne({ userId: req.user.id });
        const locationContext = farm?.district && farm?.state 
            ? `Farm Location: ${farm.district}, ${farm.state}, India.` 
            : `Location: India.`;
        const soilContext = farm?.soilType 
            ? `General Soil Type: ${farm.soilType}.` 
            : ``;

        const langTarget = language === 'hi' ? 'Hindi' : 'English';

        let predictedCrop = "Rice"; // Default fallback
        try {
            // Validate all fields are present
            if ([nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall].some(v => v === null || v === '')) {
                return res.status(400).json({ message: "All agricultural metrics are required for an accurate prediction." });
            }

            const payload = {
                nitrogen: nitrogen,
                phosphorus: phosphorus,
                potassium: potassium,
                temperature: temperature,
                humidity: humidity,
                ph: ph,
                rainfall: rainfall
            };

            const response = await axios.post(
                `http://localhost:5001/predict`,
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );
            
            if (response.data && response.data.predictedCrop) {
                predictedCrop = response.data.predictedCrop;
                // Capitalize first letter
                predictedCrop = predictedCrop.charAt(0).toUpperCase() + predictedCrop.slice(1);
            }
        } catch (error) {
            console.error("Local ML Prediction Error:", error.message);
        }

        // Translate to Hindi if requested (using basic translation dictionary for common crops, or Gemini for translation if needed)
        // Since Random Forest only outputs English class names, we can handle a basic map or just return English
        const hindiMap = {
            'Rice': 'चावल (Rice)',
            'Maize': 'मक्का (Maize)',
            'Chickpea': 'चना (Chickpea)',
            'Kidneybeans': 'राजमा (Kidneybeans)',
            'Pigeonpeas': 'अरहर (Pigeonpeas)',
            'Mothbeans': 'मोठ (Mothbeans)',
            'Mungbean': 'मूंग (Mungbean)',
            'Blackgram': 'उड़द (Blackgram)',
            'Lentil': 'मसूर (Lentil)',
            'Pomegranate': 'अनार (Pomegranate)',
            'Banana': 'केला (Banana)',
            'Mango': 'आम (Mango)',
            'Grapes': 'अंगूर (Grapes)',
            'Watermelon': 'तरबूज (Watermelon)',
            'Muskmelon': 'खरबूजा (Muskmelon)',
            'Apple': 'सेब (Apple)',
            'Orange': 'संतरा (Orange)',
            'Papaya': 'पपीता (Papaya)',
            'Coconut': 'नारियल (Coconut)',
            'Cotton': 'कपास (Cotton)',
            'Jute': 'जूट (Jute)',
            'Coffee': 'कॉफी (Coffee)'
        };

        if (language === 'hi' && hindiMap[predictedCrop]) {
            predictedCrop = hindiMap[predictedCrop];
        }

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
            predictedCrop: predictedCrop,
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
