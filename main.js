const express = require('express');
const path = require('path');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

const uploadsDir = path.join('/tmp', 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
    dest: uploadsDir,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/neko', upload.single('file'), async (req, res) => {
    try {
        const { text, systemPrompt, sessionId } = req.body;
        const formData = new FormData();
        formData.append('text', text);
        formData.append('systemPrompt', systemPrompt);
        formData.append('sessionId', sessionId);

        if (req.file) {
            formData.append('file', fs.createReadStream(req.file.path), req.file.originalname);
        }

        const response = await axios.post('https://api.nekolabs.web.id/ai/gpt/4o-mini-search', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        if (req.file) {
            fs.unlinkSync(req.file.path);
        }

        res.json(response.data);
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Failed to fetch from Neko API' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});