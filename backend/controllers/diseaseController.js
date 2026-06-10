import axios from 'axios';

// @desc    Detect crop disease from image via Gemini Vision API
// @route   POST /api/disease/detect
// @access  Private
const detectDisease = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error("No image file provided.");
        }

        const { language } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        // Convert image buffer to base64
        const base64Image = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype;

        const langTarget = language === 'hi' ? 'Hindi' : 'English';

        const FormData = (await import('form-data')).default;
        const form = new FormData();
        form.append('image', req.file.buffer, { filename: 'image.jpg', contentType: req.file.mimetype });

        try {
            const response = await axios.post(
                `http://localhost:5001/predict_disease`,
                form,
                { headers: form.getHeaders() }
            );

            res.status(200).json({
                disease: response.data.disease || "Unknown Disease",
                confidence: response.data.confidence || 0,
                is_dummy: false
            });

        } catch (apiError) {
            console.error("Local ML API Error:", apiError.response ? apiError.response.data : apiError.message);
            res.status(503);
            throw new Error("Local AI model is not ready or failed to analyze the image.");
        }

    } catch (error) {
        next(error);
    }
};

export { detectDisease };
