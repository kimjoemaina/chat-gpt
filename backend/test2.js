const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

require('dotenv').config()

const app = express()
// Express App Config
app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'public')))
} else {
  const corsOptions = {
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000', 'https://chat-gpt-az9j.onrender.com'],
    credentials: true,
    exposedHeaders: ['Access-Control-Allow-Origin'],
  };
  app.use(cors(corsOptions));
}


app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// // Set up OpenAI endpoint

const configuration = new Configuration({
  apiKey: process.env.CHATBOT_KEY
});

const openai = new OpenAIApi(configuration);

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;
  console.log("prompt", prompt)
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 2048,
  });
  console.log('res', completion.data.choices[0].text)
  res.send(completion.data.choices[0].text);
});


const port = 3030;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`http://localhost:${port}`);
});