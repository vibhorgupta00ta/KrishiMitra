import axios from 'axios';

const test = async () => {
    const apiKey = "AQ.Ab8RN6LjTHd9ddCL5HgFrSOhhb56gS-YMPbFn0gxtK6uKL1Uwg";
    const prompt = `Based on the following known agricultural conditions, recommend the single most suitable crop to plant. If specific N/P/K/weather values are missing, rely heavily on the Farm Location and General Soil Type to make the best educated recommendation for that region. 

IMPORTANT: Respond with ONLY the crop name in Hindi, nothing else. No extra words, no punctuation, no formatting like bold or italics. Just the crop name.

Location: India.

Known Metrics:
Nitrogen: 90
Phosphorus: 42
Potassium: 43
Temperature: 20.8°C
Humidity: 82%
pH: 6.5
Rainfall: 202.9mm`;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            { contents: [{ role: "user", parts: [{ text: prompt }] }] },
            { headers: { 'Content-Type': 'application/json' } }
        );
        console.log("Success:", response.data.candidates[0].content.parts[0].text);
    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
    }
};

test();
