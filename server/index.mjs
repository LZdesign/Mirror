import 'dotenv/config';
import { Configuration, OpenAIApi } from "openai";
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
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
  origin: 'https://www.themirrorapp.io/', // Replace with your front-end domain
  methods: ['GET', 'POST'], // You can add more methods if needed
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static('public'));

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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'eur',
  });

  res.json({ client_secret: paymentIntent.client_secret });
});

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
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
    }
  }
};

app.post('/subscribe', async (req, res) => {
  const { email, name, groupId } = req.body;

  try {
    const subscriber = await addSubscriber(email, name, groupId);
    res.status(200).send({ message: 'Subscriber added successfully', subscriber });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    res.status(500).send({ error });
  }
});

app.post('/questions', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        console.log("Before API call:", new Date().toISOString());
        const completion = await promiseTimeout(60000, getCompletion(prompt));
        console.log("After API call:", new Date().toISOString());
        res.status(200).send({ message: completion.data.choices[0].message.content });
    } catch (error) {
        res.status(500).send({ error });
    }
});

// Add this middleware after all other routes and middleware
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

