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

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

    const data = await geminiRes.json();

    // Surface Gemini errors clearly
    if (data.error) {
      console.error('Gemini error:', JSON.stringify(data.error));
      return res.status(200).json({ text: 'Gemini error: ' + data.error.message });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      || 'Unable to generate at this time.';

    res.json({ text });

  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ text: 'Server error: ' + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
