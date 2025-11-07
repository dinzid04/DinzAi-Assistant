const express = require('express');
const path = require('path');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');

const app = express();

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

app.get('/api/play', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const response = await axios.get('https://swagger-nextjs-one.vercel.app/api/downloader/ytaudio', {
            params: { query, direct: true },
            responseType: 'stream'
        });

        response.data.on('error', (err) => {
            console.error('Stream Error:', err);
            res.status(500).json({ error: 'Failed to fetch audio stream' });
        });

        response.data.pipe(res);
    } catch (error) {
        console.error('Error proxying to play API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch from play API' });
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

app.get('/api/lyrics-search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Query parameter "q" is required' });
        }

        const response = await axios.get('https://api.nekolabs.web.id/discovery/lyrics/search', {
            params: { q }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching from Lyrics API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch from Lyrics API' });
    }
});

app.post('/api/what-music', upload.single('audio'), async (req, res) => {
    try {
        const audio = req.file;

        if (!audio) {
            return res.status(400).json({ error: 'Audio file is required' });
        }

        const formData = new FormData();
        formData.append('audio', audio.buffer, {
            filename: audio.originalname,
            contentType: audio.mimetype,
        });

        const response = await axios.post('https://swagger-nextjs-one.vercel.app/api/tools/what-music', formData, {
            headers: {
                ...formData.getHeaders(),
                'accept': 'application/json',
            },
            responseType: 'json'
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error proxying to What Music API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch from What Music API' });
    }
});

app.get('/api/animagine', async (req, res) => {
    try {
        const { prompt, ratio, model } = req.query;
        if (!prompt || !ratio || !model) {
            return res.status(400).json({ error: 'Prompt, ratio, and model are required' });
        }

        const response = await axios.get('https://swagger-nextjs-one.vercel.app/api/ai/animagine', {
            params: { prompt, ratio, model },
            responseType: 'json'
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error proxying to Animagine API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch from Animagine API' });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
