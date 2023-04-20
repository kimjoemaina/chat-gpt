const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

require('dotenv').config();

const app = express();

// Express App Config
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

// Set up CORS
const corsOptions = {
  origin: ['https://chat-frontend-ws30.onrender.com', 'http://127.0.0.1:3000', 'http://localhost:3000'],

  credentials: true,
  exposedHeaders: ['Access-Control-Allow-Origin'],
};
app.use(cors(corsOptions));

// Set up static assets serving for production


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'public')));
} else {
  const corsOptions = {
    origin: ['https://chat-frontend-ws30.onrender.com', 'http://127.0.0.1:3000', 'http://localhost:3000'],

    credentials: true,
    exposedHeaders: ['Access-Control-Allow-Origin'],
  };
  app.use(cors(corsOptions));
}

app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Set up OpenAI endpoint

const configuration = new Configuration({
  apiKey: process.env.CHATBOT_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  console.log('prompt', prompt);
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 2048,
  });
  console.log('response', completion.data.choices[0].text);
  res.send(completion.data.choices[0].text);
});

// Set up fallback for all other routes
app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const port = process.env.PORT || 3030;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});