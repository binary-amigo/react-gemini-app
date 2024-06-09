const PORT = 8000
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
console.log(process.env.GEMINI_API_KEY)

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


app.post("/gemini", async (req, res) => {

    const model = genAI.getGenerativeModel({model: "gemini-pro"})
    const chat = model.startChat({
        history: req.body.history,
    })

    const msg = req.body.message;

    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    res.send(text);

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });
