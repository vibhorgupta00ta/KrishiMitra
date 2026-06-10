import axios from 'axios';

// @desc    Chat with AI Assistant in Hindi
// @route   POST /api/ai/chat
// @access  Public / Private
const chatWithAI = async (req, res, next) => {
    try {
        const { message, language } = req.body;

        if (!message) {
            res.status(400);
            throw new Error("Message is required");
        }

        const apiKey = process.env.GEMINI_API_KEY;
        let aiText = "";
        
        const langTarget = language === 'en' ? 'English' : 'Hindi';

        // Ensure we explicitly ask the model to reply in the requested language
        const systemPrompt = `You are KrishiMitra, an expert AI assistant for Indian farmers. You must reply ONLY in ${langTarget}. Provide short, helpful, and concise answers related to farming, crops, weather, and agriculture.`;
        
        try {
            // Attempt to call Gemini API
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                {
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: `${systemPrompt}\n\nFarmer says: ${message}` }]
                        }
                    ]
                },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data && response.data.candidates && response.data.candidates.length > 0) {
                aiText = response.data.candidates[0].content.parts[0].text;
            }
        } catch (apiError) {
            console.error("AI API Error:", apiError.response ? apiError.response.data : apiError.message);
            // Fallback to mocked response if API key fails or format is wrong
            aiText = "माफ़ करें, अभी मेरा सर्वर व्यस्त है। लेकिन मैं आपको बता सकता हूँ कि अच्छी पैदावार के लिए मिट्टी की जाँच ज़रूरी है। (Mocked Response due to API Error)";
        }

        res.json({ reply: aiText });
    } catch (error) {
        next(error);
    }
};

export { chatWithAI };
