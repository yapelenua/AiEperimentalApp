import axios from "axios";
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const HUGGING_FACE_MODEL_URL = process.env.HUGGING_FACE_MODEL_URL;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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
    }
}

function askForInput() {
    rl.question('Please enter your prompt: ', async (input) => {
        const response = await query({"inputs": input});
        console.log('Response from API:', JSON.stringify(response[0].generated_text, null, 2));

        askForInput();
    });
}

askForInput();
