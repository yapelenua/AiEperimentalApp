import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const HUGGING_FACE_MODEL_URL = process.env.HUGGING_FACE_MODEL_URL;

async function query(data) {
    try {
        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${HUGGING_FACE_MODEL_URL}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching response:", error);
        throw error;
    }
}

app.post('/query', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
    }

    try {
        const response = await query({ inputs: prompt });
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: "Error fetching response from Hugging Face." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
