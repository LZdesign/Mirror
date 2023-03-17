import { Configuration, OpenAIApi } from "openai";
import express from 'express';
import fs from 'fs';
import cors from 'cors';


const configuration = new Configuration({
    // organization: "org-OLSpZatsbrBn5PTgYr4bGi4B",
    apiKey: "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",
});


const openai = new OpenAIApi(configuration);
const app = express();
app.use(cors());
app.use(express.json());



app.post('/questions', async (req, res) => { 
  try {
    const prompt = req.body.prompt;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: prompt,
      max_tokens: 500
    });

    res.status(200).send({
      message: completion.data.choices[0].message.content,
    })

  } catch (error) {
    res.status(500).send({error})
  }
});

// create another route that will handle the POST request to the server to get the Insight text
app.post('/insight', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: prompt,
      max_tokens: 500
    });

    res.status(200).send({
      message: completion.data.choices[0].message.content,
    })

  } catch (error) {
    res.status(500).send({error})
  }


});








const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
