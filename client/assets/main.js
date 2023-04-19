const HeroBanner = document.querySelector(".hero-banner");
const heroDiv = document.querySelector(".hero-div");
const answerBtn = document.querySelector(".answer");
const question = document.querySelector(".question h3");
const textarea = document.querySelector("#textArea");
const progress = document.querySelector('.progress__container');
const baseUrl = "https://www.themirrorapp.io/questions";
const download = document.querySelector('.Download');
const interactionContainer = document.querySelector(".interaction__container");
const loadingResponse = document.querySelector(".loading-response");
const result = document.querySelector(".result");
const formContainer = document.getElementById("form-container");
let currentQuestion = question.dataset.set;
let conversation = [];



async function loadForm(formFileName, callback) {
  const response = await fetch(formFileName);
  const formHtml = await response.text();
  formContainer.innerHTML = formHtml;

  // Call the callback function after the form has been loaded
  if (callback) {
    callback();
  }
}


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

    const insightContainer = document.querySelector('.insightText');
    const tasksContainer = document.querySelector('.tasksList');
    const resourcesContainer = document.querySelector('.resourcesList');
    resourcesContainer.innerHTML = '';

    const insightRegex = /%%Insight: (.+?)\n\n/;
    const tasksRegex = /%%Tasks:\n([\s\S]+?)\n\n/;
    const resourcesRegex = /%%Resources:\n([\s\S]+?)$/;

    const insightMatch = insight.match(insightRegex);
    const tasksMatch = insight.match(tasksRegex);
    const resourcesMatch = insight.match(resourcesRegex);

    const insightText = insightMatch && insightMatch[1];
    const tasks = tasksMatch && tasksMatch[1];
    const resources = resourcesMatch && resourcesMatch[1];

    if (insightText) {
      insightContainer.textContent = insightText;
    }

    if (tasks) {
      tasksContainer.innerHTML = '';
      tasks.trim().split("\n").forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.trim();
        tasksContainer.appendChild(li);
      });
    }

    if (resources) {
      resourcesContainer.innerHTML = '';
      const resourceRegex = /(.+?) - \[(.+?)\]/g;
      resources.trim().split("\n").forEach(resource => {
        const match = resourceRegex.exec(resource);
        if (match) {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = match[2];
          a.target = '_blank';
          a.textContent = match[2];
          li.textContent = `${match[1]} - `;
          li.appendChild(a);
          resourcesContainer.appendChild(li);
        } else {
          const li = document.createElement('li');
          li.textContent = resource.trim();
          resourcesContainer.appendChild(li);
        }
      });
    }

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

// Save conversation to localStorage
function saveConversation(conversation) {
  localStorage.setItem("conversation", JSON.stringify(conversation));
}

// Restore conversation from localStorage
function restoreConversation() {
  const storedConversation = localStorage.getItem("conversation");
  if (storedConversation) {
    return JSON.parse(storedConversation);
  }
  return [];
}

function loadCheckedForm() {
  const checkedRadioBtn = document.querySelector('.radioBtn:checked');
  if (checkedRadioBtn) {
    const formFileName = `/assets/components/${checkedRadioBtn.value}.html`;
    loadForm(formFileName, addGenerateBtnEventListener);
  }
}

document.querySelectorAll('.radioBtn').forEach(radioBtn => {
  radioBtn.addEventListener('click', () => {
    const formFileName = `/assets/components/${radioBtn.value}.html`;
    loadForm(formFileName, addGenerateBtnEventListener);
  });
});

// Load the form for the checked radio button on page load
loadCheckedForm();

function addGenerateBtnEventListener() {
  const generateBtn = document.querySelector("button.generate-question");

  if (generateBtn) {
    
      generateBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // check if the button clicked has a data-btn attribute 
        
        
        const btn = e.target;
        const btnType = btn.getAttribute('data-btn');
        
        if (btnType === 'self-reflect') {
          
          const userName = document.querySelector('#userName').value;
          const focusArea = document.querySelector('#focusArea').value;
          const focusAreaDetail = document.querySelector('#focusAreaDetail').value;
  
          const userNameIsValid = validateAndAnimate('#userName');
          const focusAreaIsValid = validateAndAnimate('#focusArea');
          const focusAreaDetailIsValid = validateAndAnimate('#focusAreaDetail');
          
          if (!userNameIsValid || !focusAreaIsValid || !focusAreaDetailIsValid) {
            displayError('Please fill in the empty fields');
            return;
          }
          
          conversation = [
            {
              role: "system",
              content: "You are an experienced life and mental coach. Start by asking your client the first question, which should encourage self-reflection. Follow the User instructions to complete the interaction. "
            },
            {
              role: "user",
              content: `Act as an expert life and mental coach specialized in ${focusArea},  guide clients in improving their daily lives by setting goals, identifying obstacles, and creating strategies. Use active listening, clear communication, goal-setting, an action-oriented approach, trust, confidentiality, adaptability, and positive reinforcement. Begin a session with ${userName}, They come to you to discuss: '${focusAreaDetail}'. Start with a non-overwhelming question for self-reflection. Address the client as ${userName} and use a friendly tone. Your first response: Welcome ${userName}, [First Question].`
            }
          ];
        }
        else if (btnType === 'vant') {
          const userName = document.querySelector('#userName').value;
          const vant = document.querySelector('#vanting').value;
          
          const vantIsValid = validateAndAnimate('#vanting');
          const userNameIsValid = validateAndAnimate('#userName');


        if (!userNameIsValid || !vantIsValid) {
          displayError('Please fill in the empty fields');
          return;
        }


        conversation = [
          {
            role: "system",
            content: "You are an experienced life and mental coach. Start by asking your client the first question, which should encourage self-reflection. Follow the User instructions to complete the interaction. "
          },
          {
            role: "user",
            content: `As a skilled life and mental coach, guide clients to improve their relationships, careers, and lives by setting clear goals, identifying obstacles, and creating strategies to overcome challenges. Follow these coaching principles: Active Listening, Clear Communication, Goal-Setting, Action-Oriented Approach, Trust and Confidentiality, Flexibility and Adaptability, Positive Reinforcement. Engage in a session with ${userName} who shares their emotions in '${vant}'. Begin with empathy without overwhelming them. Address them as ${userName}. Start the conversation with: Hello ${userName}[response]. Use a friendly tone and speak in the first person.`
         
          }
        ];
      }



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
  }
}


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
    content = userInput + "." + " Share an insight, assign three tasks for the next session, and suggest resources. Ensure tasks are manageable, trackable, and attainable. Format: %%Insight: <Insight> %%Tasks: 1.<Task 1> 2.<Task 2> 3.<Task 3> %%Resources: <resource 1> <resource 2> <resource 3>.  The '%%' is important, don't avoid it.";
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
  result.style.transform = 'translateY(200%)';
  result.classList.add('hidden');
  downloadReport.classList.remove('hidden');
  setTimeout(() => {    
    // scroll view to the top
    window.scrollTo(0, 0);
    downloadReport.style.transform = 'translateY(0)';
  }, 500);
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
      const response = await fetch('https://www.themirrorapp.io/subscribe', {
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


