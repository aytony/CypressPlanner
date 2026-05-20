const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'https://aytony.github.io'
}));

app.post('/generate', async (req, res) => {
  try {
    const { prompt, maxTokens } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: maxTokens || 1000,
            temperature: 0.85
          }
        })
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      || 'Unable to generate at this time. Please try again.';

    res.json({ text });

  } catch (err) {
    res.status(500).json({ text: 'Something went wrong. Please try again.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
