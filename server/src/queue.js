import Queue from 'bull';
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const openAiQueue = new Queue('openai', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
});

openAiQueue.process(async (job) => {
  const { prompt } = job.data;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: prompt,
      max_tokens: 500,
    });

    return completion.data.choices[0].message.content;
  } catch (error) {
    console.error('Error in queue processing:', error);
    if (error.response) {
      console.log('Error response data:', error.response.data);
    }
    throw error;
  }
});

export default openAiQueue;
