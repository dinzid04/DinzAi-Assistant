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

app.post('/api/banana-ai', upload.single('image'), async (req, res) => {
    try {
        const { prompt } = req.body;
        const image = req.file;

        if (!prompt || !image) {
            return res.status(400).json({ error: 'Prompt and image are required' });
        }

        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('image', image.buffer, {
            filename: image.originalname,
            contentType: image.mimetype,
        });

        const response = await axios.post('https://swagger-nextjs-one.vercel.app/api/ai/nano-banana', formData, {
            headers: {
                ...formData.getHeaders(),
                'accept': 'application/json',
            },
            responseType: 'json'
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error proxying to Banana AI API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch from Banana AI API' });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});