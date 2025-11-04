const express = require('express');
const path = require('path');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 3000;

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/neko', async (req, res) => {
    try {
        const { text, systemPrompt, sessionId } = req.query;
        const response = await axios.get('https://api.nekolabs.web.id/ai/gpt/4o-mini-search', {
            params: {
                text,
                systemPrompt,
                sessionId
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch from Neko API' });
    }
});

app.get('/api/lyrics-search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Query parameter "q" is required' });
        }

        const response = await axios.get('https://api.nekolabs.web.id/discovery/lyrics/search', {
            params: { q },
            headers: { 'accept': 'application/json' }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching from Lyrics API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch from Lyrics API' });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});