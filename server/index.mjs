import 'dotenv/config';
import { Configuration, OpenAIApi } from "openai";
import express from 'express';
import cors from 'cors';
import MailerLite from '@mailerlite/mailerlite-nodejs';

const mailerLite = new MailerLite({
  api_key: process.env.MAILERLITE_API_KEY
});

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const app = express();
app.use(cors({
  origin: 'https://www.themirrorapp.io/',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static('public'));


z
const getCompletion = async (prompt) => {
  try {
    return await openai.createChatCompletion({
      model: "gpt-4",
      messages: prompt,
      max_tokens: 500,
    });
  } catch (error) {
    console.error('Error in getCompletion:', error);
    if (error.response) {
      console.log('Error response data:', error.response.data);
    }
    throw error;
  }
};

const promiseTimeout = (ms, promise) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Promise timed out"));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((reason) => {
        clearTimeout(timer);
        reject(reason);
      });
  });
};

const addSubscriber = async (email, name, groupId) => {
  const params = {
    email,
    fields: {
      name
    },
    groups: [groupId],
    status: "active"
  };

  try {
    const response = await mailerLite.subscribers.createOrUpdate(params);
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
    }
    throw error;
  }
};

app.post('/subscribe', async (req, res) => {
  const { email, name, groupId } = req.body;

  try {
    const subscriber = await addSubscriber(email, name, groupId);
    res.status(200).send({ message: 'Subscriber added successfully', subscriber });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    res.status(500).send({ error: 'Failed to add subscriber' });
  }
});

app.post('/questions', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const completion = await promiseTimeout(60000, getCompletion(prompt));
        res.status(200).send({ message: completion.data.choices[0].message.content });
    } catch (error) {
        console.error('Error in questions route:', error);
        res.status(500).send({ error: 'Failed to get completion' });
    }
});

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  if (error.response) {
    console.log('Error response data:', error.response.data);
  }
  res.status(500).send({ error: 'An unexpected error occurred.' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});