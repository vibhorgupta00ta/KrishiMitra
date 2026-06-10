const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: './.env' });

async function test() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const systemPrompt = "You are KrishiMitra";
        const message = "hi";
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
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
        console.log("Success:", response.data);
    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
    }
}
test();
