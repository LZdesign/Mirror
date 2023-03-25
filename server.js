import 'dotenv/config';
import { Configuration, OpenAIApi } from "openai";
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const app = express();
app.use(cors());
app.use(express.json());

const getCompletion = async (prompt) => {
    return await openai.createChatCompletion({
        model: "gpt-4",
        messages: prompt,
        max_tokens: 500
    });
};

// call stripe  
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'eur',
    
  
  });

  res.json({ client_secret: paymentIntent.client_secret });
});


app.post('/questions', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const completion = await getCompletion(prompt);
        res.status(200).send({ message: completion.data.choices[0].message.content });
    } catch (error) {
        res.status(500).send({ error });
    }
});

app.post('/insight', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const completion = await getCompletion(prompt);
        res.status(200).send({ message: completion.data.choices[0].message.content });
    } catch (error) {
        res.status(500).send({ error });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

