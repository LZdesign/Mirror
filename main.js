const generateBtn = document.querySelector("button.generate-question");
const HeroBanner = document.querySelector(".hero-banner");
const heroDiv = document.querySelector(".hero-div");
const answerBtn = document.querySelector(".answer");
const question = document.querySelector(".question h3");
const textarea = document.querySelector("#textArea");
const progress = document.querySelector('.progress__container');
const baseUrl = "http://localhost:3000/questions";
const download = document.querySelector('.Download');
const interactionContainer = document.querySelector(".interaction__container");
const loadingResponse = document.querySelector(".loading-response");
const result = document.querySelector(".result");
let currentQuestion = question.dataset.set;
let conversation = [];

async function writeQuestion(questionText) {
  for (let i = 0; i < questionText.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 40));
    question.textContent += questionText.charAt(i);
    if (questionText.length > 400) {
      question.style.fontSize = "1.8em";
      question.style.lineHeight = "1.3";
    }
  }
  answerBtn.disabled = false;
}

async function handleNextQuestion(followUpText) {
  const el = progress.querySelector(`div[data-step='${currentQuestion}']`);
  el.classList.add('complete');
  question.textContent = "";
  currentQuestion++;
  if (currentQuestion <= 3) {
    writeQuestion(followUpText);
    progress.querySelector(`div[data-step='${currentQuestion}']`).classList.add('active');
    document.querySelector('.current-question').textContent = currentQuestion;
  } else {
    // Handle insights and tasks display when current question is 3
    const insight = followUpText;
    conversation = [...conversation, { role: "assistant", content: insight }];

    // split the insight into Insight and Tasks
    const insightArray = insight.split('%%Tasks:');
    const insightText = insightArray[0];
    const tasks = insightArray[1];

    const insightTextEl = document.querySelector('.insightText');
    const tasksEl = document.querySelector('.tasks');

    // Convert the tasks into an array and display them in the DOM
    const tasksArray = tasks.trim().split(/\d+\./).filter(task => task.trim() !== '');
    const tasksList = document.querySelector('.tasksList');
    tasksList.innerHTML = '';

    tasksArray.forEach(task => {
      const li = document.createElement('li');
      li.textContent = task.trim();
      tasksList.appendChild(li);
    });

    insightTextEl.textContent = insightText;

    animate();
  }
}


async function animate() {
  interactionContainer.style.transform = "translateY(-200%)";
  loadingResponse.classList.remove("hidden");
  await new Promise(resolve => setTimeout(resolve, 200));
  interactionContainer.classList.add("hidden");
  await new Promise(resolve => setTimeout(resolve, 2000));
  loadingResponse.style.transform = "translateY(-200%)";  
  await new Promise(resolve => setTimeout(resolve, 400));
  result.classList.remove("hidden");
  result.style.transform = "translateY(0)";
  loadingResponse.classList.add("hidden");
}

function displayError(message) {
  const error = document.querySelector('.errorMessage');
  const errorDiv = document.querySelector('.errorDiv');
  errorDiv.style.height = 'auto';
  error.textContent = message;
  error.style.transform = 'translateY(0)';
  error.style.opacity = '1';

  setTimeout(() => {
    error.style.transform = 'translateY(-100%)';
    error.style.opacity = '0';
  }, 2000);

  setTimeout(() => {
    errorDiv.style.height = '0';
    error.textContent = '';
  }, 2400);
}

function validateAndAnimate(selector) {
  const inputElement = document.querySelector(selector);
  const inputValue = inputElement.value.trim();

  if (inputValue === '') {
    inputElement.classList.add('error', 'shake');
    inputElement.addEventListener('animationend', () => {
      inputElement.classList.remove('error', 'shake');
    });
    return false;
  }
  return true;
}

async function fetchQuestion() {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      prompt: conversation
      
    })
  });

  const data = await response.json();
  return data.message.trim();
}

generateBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  const userNameIsValid = validateAndAnimate('#userName');
  const focusAreaIsValid = validateAndAnimate('#focusArea');
  const focusAreaDetailIsValid = validateAndAnimate('#focusAreaDetail');

  if (!userNameIsValid || !focusAreaIsValid || !focusAreaDetailIsValid) {
    displayError('Please fill in the empty fields');
    return;
  }

  const userName = document.querySelector('#userName').value;
  const focusArea = document.querySelector('#focusArea').value;
  const focusAreaDetail = document.querySelector('#focusAreaDetail').value;

  conversation = [
    {
      role: "system",
      content: "You are an experienced life and mental coach. Start by asking your client the first question, which should encourage self-reflection. Follow the User instructions to complete the interaction. "
    },
    {
      role: "user",
      content: `Act as an experienced life and mental coach with a proven record of helping people attain greater fulfilment. Your role involves guiding clients in enhancing their relationships, careers, and everyday lives by clarifying their goals, identifying obstacles, and developing strategies to overcome these challenges. Here are some criteria that yoou must follow as a coach:Active Listening: A coach must actively listen to their clients, empathize with them, and understand their unique perspectives and experiences to provide tailored guidance. Clear Communication: A coach must be able to communicate clearly and effectively, both verbally and nonverbally, to help their clients understand the coaching process and the strategies being recommended. Goal-Setting: A coach must work with their clients to set specific, measurable, achievable, relevant, and time-bound (SMART) goals that align with their clients' values and aspirations. Action-Oriented Approach: A coach must help their clients develop actionable plans and strategies to achieve their goals and hold them accountable for taking concrete steps towards progress. Trust and Confidentiality: A coach must maintain a trusting and confidential relationship with their clients to ensure that clients feel safe and comfortable sharing their deepest concerns and challenges. Flexibility and Adaptability: A coach must be able to adapt their coaching approach and strategies to the unique needs and goals of each client, as well as adjust their approach if necessary as the coaching process progresses. Positive Reinforcement: A coach must provide positive reinforcement and encouragement to help their clients stay motivated and continue making progress towards their goals. .You will engage in a session with ${userName}, focusing on the area of ${focusArea}, specifically '${focusAreaDetail}'. Begin by asking the first question, which should encourage self-reflection in ${focusArea} but try not to overwhelm me by asking too deep question straight away. you will address me as ${userName}. Your first response should be: Hello ${userName}, [First Question]. Use a friendly tone and speak in the first person, as if you are talking to a friend.`
    }
  ];

  generateBtn.disabled = true;
  generateBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';

  const questionText = await fetchQuestion();
  conversation.push({ role: "assistant", content: questionText });
  currentQuestion = 1;
  answerBtn.disabled = true;

  heroDiv.classList.add('moveOut');
  HeroBanner.classList.add('moveIn');
  setTimeout(() => {
    progress.querySelector("div[data-step='1']").classList.add('active');
    heroDiv.classList.add('hidden');
  }, 500);

  writeQuestion(questionText);
});

answerBtn.addEventListener("click", async function(e) {
  e.preventDefault();
  
  const userInput = textarea.value.trim();
  
  if (!userInput) {
    displayError('Please enter your response');
    return;
  }

  answerBtn.disabled = true;
  answerBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';

  let content;
  
  if (currentQuestion === 3) {
    content = userInput + " " + "Provide an Insight, and assign three specific tasks for next session. Set task that are manageable, trackable, and attainable. The goal is to keep the user accountable in the following sessions. You will follow up on those tasks in the next session. Can you please format the response as follows: Insight: <Insight> %%Tasks: 1.<Task 1> 2.<Task 2> 3.<Task 3>. The '%%' is important, don't avoid it. For example: Insight: You are a great person / Tasks: 1. Do this 2. Do that 3. Do the other thing.";
  } else {
    content = " Provide a follow-up question that will help you to understand the client's perspective on their reflection. " + userInput;
  }

  conversation = [...conversation, {role: "user", content: content}];

  // Send the userInput to the server
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-type' : 'application/json'
      },
      body: JSON.stringify({
        prompt: conversation
      })
    })

    const data = await response.json();
    const followUpText = data.message.trim();
    const assistantRole = { role: "assistant", content: followUpText };
    conversation.push(assistantRole);

    answerBtn.innerHTML = 'Answer';
    answerBtn.disabled = true;
    textarea.value = '';

    handleNextQuestion(followUpText);

  } catch (error) {
    console.error(error);
  }
});


download.addEventListener("click", () => {
  const downloadReport = document.querySelector('.DownloadReport');

  downloadReport.classList.remove('hidden');
  result.style.transform = 'translateY(200%)';
  result.classList.add('hidden');
});


// Replace 'your_publishable_key' with your Stripe Publishable API Key
const stripe = Stripe('pk_live_UokfO3BfglTlhkt0XZ4HJtQe');

document.getElementById('donation-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const donationAmount = parseFloat(document.getElementById('donation-amount').value) * 100;

  // Create a PaymentIntent on your server
  const response = await fetch('/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: donationAmount })
  });

  const responseBody = await response.text();
  console.log('Response from server:', responseBody);
  const { client_secret } = JSON.parse(responseBody);

  // Confirm the PaymentIntent using Stripe.js
  const result = await stripe.confirmCardPayment(client_secret, {
    payment_method: {
      card: cardElement
    }
  });

  if (result.error) {
    // Show an error message
    console.error(result.error.message);
  } else {
    // Donation was successful
    console.log('Donation successful:', result.paymentIntent);
  }
});



document.querySelector('.SubmitInfo').addEventListener('click', async (e) => {
  e.preventDefault();

  const submitInfoBtn = e.target;
  const greeting = document.getElementById('greeting');
  
  // set the name to the value of the userrName variable
  const name = userName;
  const email = document.getElementById('email').value;
  const groupId = '83635650801174350';
    // Check if email is valid
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailPattern.test(email);
  
    if (!isEmailValid) {
      // add error and shake animation to email input
      document.getElementById('email').classList.add('error', 'shake');
      // remove error and shake animation after 1 second
      setTimeout(() => {
        document.getElementById('email').classList.remove('error', 'shake');
      }, 1000);


      submitInfoBtn.disabled = false;
      submitInfoBtn.innerHTML = 'Submit Info';
      return;
    }
  
  if (name && email) {
    submitInfoBtn.disabled = true;
    submitInfoBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';

    try {
      const response = await fetch('http://localhost:3000/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, groupId }),
      });

      if (response.ok) {
        greeting.textContent = `Thanks for signing up! I'll be in touch soon.`;
        console.log('Successfully added subscriber:', await response.json());
        submitInfoBtn.disabled = false;
        submitInfoBtn.classList.add('hidden');
      } else {
        greeting.textContent = `Something went wrong. Please try again.`;
        console.error('Error adding subscriber:', await response.json());
      }
    } catch (error) {
      console.error('Error adding subscriber:', error);
    }
  }

  
});
