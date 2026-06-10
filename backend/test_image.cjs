const axios = require('axios');
const apiKey = "AQ.Ab8RN6LjTHd9ddCL5HgFrSOhhb56gS-YMPbFn0gxtK6uKL1Uwg";

axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
  contents: [{ role: "user", parts: [{ text: "Hello" }, { inlineData: { mimeType: "image/jpeg", data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" } }] }]
})
.then(res => console.log(res.data.candidates[0].content.parts[0].text))
.catch(err => console.error(err.response ? err.response.data : err.message));
