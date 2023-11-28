import 'dotenv/config';
import { OpenAI } from "openai";
import express from 'express';
import cors from 'cors';
import MailerLite from '@mailerlite/mailerlite-nodejs';
const serverport = 3001;
const clientPort = 3000;



const mailerLite = new MailerLite({
  api_key: process.env.MAILERLITE_API_KEY
});


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();
app.use(cors({ 
  origin: [ process.env.DOMAIN_SERVER , `http://localhost:${clientPort}`],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static('public'));


let threadId = null; // initialize threadId to null
let runId = null;



const getThread = async () => {
  const thread = await openai.beta.threads.create();
  threadId = thread.id; // set threadId to the newly created thread's id
  return threadId;
}




const StartSession = async (prompt, threadId) => {
  const userMessage = prompt;
  let tId = threadId;

  
  // Create a thread if not already created
  if (!tId) {
    throw new Error('Invalid request');
  }

  // Create a message in the thread
  await openai.beta.threads.messages.create(tId, userMessage);

  // Create a run in the thread
  const run = await openai.beta.threads.runs.create(threadId, { 
    assistant_id: "asst_xlelcBeodEC4PPGqYReZaHCc",
    instructions: "Use bold markup to highlight the questions you want to ask the user. If you ask a question that has options form which the user can pick from, add it at the end inside [ ]  like this [ option1, option2, option3 ] Only insert the actual options. If one of the options is to pick somethine else always user 'Something Else'. Keep the conversation simple and ask 1 question at a time."
  });
  
  runId = run.id;

  // Get Run Id 
  console.log('Run ID:', runId);

  

  
  // Wait for the run to complete and then get messages
  await waitForRunCompletion(tId, runId);
  let messages = await getMessages(tId);
  
  return messages
}

// const Get_Options = async (question, options) => {
//     console.log( "GET_Options Called");
//     const IntQuestion = question;
//     const option = options[2];

    

// }


// Function to wait for run completion
const waitForRunCompletion = async (threadId, runId) => {
  console.log('Waiting for run to complete...');
  let status = '';
  do {
    try {
      const res = await openai.beta.threads.runs.retrieve(threadId, runId);
      status = res.status;
      
      
      if (status === 'requires_action') {
        const requires_action = res.required_action.submit_tool_outputs.tool_calls;                

        let toolsOutput = [];
        for ( const action of requires_action ) {
           const function_name = action.function.name;
            const function_arguments = JSON.parse(action.function.arguments);

            if (function_name === 'Get_Options') {
              const { question, options } = function_arguments;
              const output = await Get_Options(question, options);

              console.log(output);

              toolsOutput.push({ 
                  tool_call_id: action.id,
                  output: JSON.stringify(output)  
              });
            } else {
              console.log('Unknown function:', function_name);
            }

            await openai.beta.threads.runs.submitToolOutputs(
              threadId, 
              runId, 
              { tool_outputs: toolsOutput }
            );
      }
    }
      
      if (status === 'completed') {
        break;
      }
      
    } catch (error) {
      console.error('Error checking run status:', error);
      throw error;
    }

    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before checking again
  } while (status !== 'completed');
}

//Function to get the last message from the assistant
const getMessages = async (threadId="") => {
  if (!threadId) return []; 

  try {
    const messages = await openai.beta.threads.messages.list(threadId);
    const lastMessage = messages.data.filter(message => message.run_id === runId && message.role === "assistant").pop();
    return lastMessage.content[0].text;
  } catch (error) {
    console.error('Error retrieving messages:', error);
    throw error;
  }
}




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

app.get('/threadId', async (req, res) => {
  try {
    const threadId = await getThread();
    res.status(200).send({ threadId });
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).send({ error: 'Failed to start session' });
  }
});


//Second Call
app.post('/questions/:threadId', async (req, res) => {
  try {
    const { threadId } = req.params;
    const { prompt } = req.body;
  
  if (!threadId || !prompt) throw new Error('Invalid request');

    const session = await StartSession(prompt, threadId);
    res.status(200).send({ message: session });
  } catch (error) {
    console.error('Error starting session:', error);
    res.status(500).send({ error: 'Failed to start session' });
  }
});

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  if (error.response) {
    console.log('Error response data:', error.response.data);
  }
  res.status(500).send({ error: 'An unexpected error occurred.' });
});

const PORT = process.env.PORT || serverport;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});