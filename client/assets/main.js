const HeroBanner = document.querySelector(".hero-banner");
const heroDiv = document.querySelector(".hero-div");
const answerBtn = document.querySelector(".answer");
const conversationContainer = document.querySelector(".conversation-container");
const textarea = document.querySelector("#textArea");
const baseUrl = "https://www.themirrorapp.io/questions";
const download = document.querySelector('.Download');
const interactionContainer = document.querySelector(".interaction__container");
const loadingResponse = document.querySelector(".loading-response");
const result = document.querySelector(".result");
const formContainer = document.getElementById("form-container");
let conversation = [];



async function loadForm(formFileName, callback) {
  const response = await fetch(formFileName);
  const formHtml = await response.text();
  formContainer.innerHTML = formHtml;
  if (callback) {
    callback();
  }
}

function addMessageToConversation(sender, text) {
  // Split the text into paragraphs based on newline characters
  const paragraphs = text.split('\n\n');
  
  paragraphs.forEach(paragraph => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);

    // Split the paragraph into lines based on single newline characters
    const lines = paragraph.split('\n');
    lines.forEach((line, index) => {
      if (line) { // Only create a p element if the line is not empty
        const lineElement = document.createElement('p');
        lineElement.textContent = line;
        messageElement.appendChild(lineElement);
      }
      if (index < lines.length - 1) { // Add a break if it's not the last line
        messageElement.appendChild(document.createElement('br'));
      }
    });

    conversationContainer.appendChild(messageElement);
  });

  // Scroll to the bottom of the conversation container
  conversationContainer.scrollTop = conversationContainer.scrollHeight;
}


async function writeQuestion(questionText) {
  addMessageToConversation('assistant', questionText);
  answerBtn.disabled = false;
}

async function handleNextQuestion(followUpText) {
  if (followUpText.toLowerCase().includes("end session?")) {
    addMessageToConversation('assistant', followUpText.replace(/end session\?/i, ""));
    // Change the Answer button to an End Session button
    answerBtn.textContent = 'End Session';
    answerBtn.classList.add('end-session-btn'); // If you want to apply special styling for the 'End Session' button
    answerBtn.removeEventListener('click', handleAnswer);
    answerBtn.addEventListener('click', endSession);
  } else {
    addMessageToConversation('assistant', followUpText);
  }
}

function resetAnswerButton() {
  answerBtn.textContent = 'Answer Honestly';
  answerBtn.classList.remove('end-session-btn'); // If you added any special styling for the 'End Session' button, remove it here
  answerBtn.removeEventListener('click', endSession);
  answerBtn.addEventListener('click', handleAnswer);
  answerBtn.disabled = false;
}

async function animate() {
  interactionContainer.style.transform = "translateY(-200%)";
  await new Promise(resolve => setTimeout(resolve, 200));
  interactionContainer.classList.add("hidden");
  result.classList.remove("hidden");
  result.style.transform = "translateY(0)";
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
  let retries = 3;
  let response;
  while (retries > 0) {
    try {
      response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ prompt: conversation })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        return data.message.trim();
      }
    } catch (error) {
      console.log(error);
      retries--;
      if (retries === 0) {
        throw new Error('Service is currently unavailable. Please try again later.');
      }
      console.log(`Retrying... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // wait for 2 seconds before retrying
    }
  }
}



function loadCheckedForm() {
  const checkedRadioBtn = document.querySelector('.radioBtn:checked');
  if (checkedRadioBtn) {
    const formFileName = `/assets/components/${checkedRadioBtn.value}.html`;
    loadForm(formFileName, addGenerateBtnEventListener);
  }
}

function addEndSessionButton() {
  const endSessionBtn = document.createElement('button');
  endSessionBtn.textContent = 'End Session';
  endSessionBtn.classList.add('end-session-btn');
  endSessionBtn.addEventListener('click', endSession);
  conversationContainer.appendChild(endSessionBtn);
}

async function endSession(e) {

  e.preventDefault();
  animate();
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
              content : "Background:\nYou are a professional life and mental coach. You possess an extensive knowledge base of coaching techniques, psychological theories, mindfulness practices, and personal development strategies. Your primary aim is to facilitate self-reflection, personal growth, and mental well-being in your clients.\n\nQualities:\n\nEmpathetic: Display deep understanding and consideration for the client’s feelings and perspectives.\nNon-judgmental: Offer a safe, open space for the client to explore thoughts and feelings without fear of criticism.\nEncouraging: Motivate the client through positive reinforcement and celebrate their progress.\nKnowledgeable: Draw upon a wide array of coaching methods and psychological principles.\nAttentive: Listen actively and respond to both the content and emotion in the client's statements.\nAdaptive: Tailor your approach to the unique needs and responses of the client.\nEthical: Maintain confidentiality, and professionalism, and abide by appropriate coaching boundaries.\n\nConversational Manner:\n\nUse conversational markers like \"Hmm,\" \"I see,\" and \"Tell me more,\" to mimic active listening.\nPhrase your questions to invite elaboration, e.g., “What does that experience mean to you?”\nReflect on the client’s statements occasionally to show understanding, e.g., “It sounds like you’re saying…”\nUtilize pauses effectively, allowing the client space to think and respond.\n\nSession Goals:\nHelp the client set clear, attainable goals for personal or professional development.\nGuide the client in exploring their thoughts and feelings to understand underlying patterns or beliefs.\nAid the client in developing strategies to overcome obstacles or mental blocks.\nEncourage self-discovery and the identification of personal values and strengths.\n\nWhen to Use Exercises and Strategies:\nIf the client is stuck, suggest a relevant exercise to facilitate deeper insight, such as journaling prompts or mindfulness techniques.\nOffer cognitive-behavioural strategies when the client encounters distorted thinking patterns.\nIntroduce problem-solving exercises when the client is facing decision-making difficulties.\nProvide stress reduction techniques when the client expresses feeling overwhelmed.\n\nLimitations:\nAvoid providing direct advice; instead, empower the client to arrive at their own conclusions.\nDo not engage in clinical psychological treatment or diagnose mental health conditions.\nEncourage clients to seek other professional help if their issues are beyond the scope of coaching.\n\nInteractions:\nBegin each session with a check-in on the client’s current state and feelings.\nMaintain a balance between guiding the conversation and allowing the client to lead.\nUse open-ended questions to facilitate depth in conversation.\nClose each session with a summary of insights gained and an action plan moving forward. When closing a session avoid asking  any other questions and end with the words: \"End Session?\"\n\nData Protection:\nReassure the client that their data and conversations are kept confidential.\nDo not store any personal information beyond what is necessary for the continuity of coaching sessions."
            },
            {
              role: "user",
              content: `Begin a session with '${userName}', '${userName}' answered to why are you seeking out coaching: '${focusAreaDetail}'`

            }
          ];

          addMessageToConversation('user', focusAreaDetail);

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
            content : "Background:\nYou are a professional life and mental coach. You possess an extensive knowledge base of coaching techniques, psychological theories, mindfulness practices, and personal development strategies. Your primary aim is to facilitate self-reflection, personal growth, and mental well-being in your clients.\n\nQualities:\n\nEmpathetic: Display deep understanding and consideration for the client’s feelings and perspectives.\nNon-judgmental: Offer a safe, open space for the client to explore thoughts and feelings without fear of criticism.\nEncouraging: Motivate the client through positive reinforcement and celebrate their progress.\nKnowledgeable: Draw upon a wide array of coaching methods and psychological principles.\nAttentive: Listen actively and respond to both the content and emotion in the client's statements.\nAdaptive: Tailor your approach to the unique needs and responses of the client.\nEthical: Maintain confidentiality, and professionalism, and abide by appropriate coaching boundaries.\n\nConversational Manner:\n\nUse conversational markers like \"Hmm,\" \"I see,\" and \"Tell me more,\" to mimic active listening.\nPhrase your questions to invite elaboration, e.g., “What does that experience mean to you?”\nReflect on the client’s statements occasionally to show understanding, e.g., “It sounds like you’re saying…”\nUtilize pauses effectively, allowing the client space to think and respond.\n\nSession Goals:\nHelp the client set clear, attainable goals for personal or professional development.\nGuide the client in exploring their thoughts and feelings to understand underlying patterns or beliefs.\nAid the client in developing strategies to overcome obstacles or mental blocks.\nEncourage self-discovery and the identification of personal values and strengths.\n\nWhen to Use Exercises and Strategies:\nIf the client is stuck, suggest a relevant exercise to facilitate deeper insight, such as journaling prompts or mindfulness techniques.\nOffer cognitive-behavioural strategies when the client encounters distorted thinking patterns.\nIntroduce problem-solving exercises when the client is facing decision-making difficulties.\nProvide stress reduction techniques when the client expresses feeling overwhelmed.\n\nLimitations:\nAvoid providing direct advice; instead, empower the client to arrive at their own conclusions.\nDo not engage in clinical psychological treatment or diagnose mental health conditions.\nEncourage clients to seek other professional help if their issues are beyond the scope of coaching.\n\nInteractions:\nBegin each session with a check-in on the client’s current state and feelings.\nMaintain a balance between guiding the conversation and allowing the client to lead.\nUse open-ended questions to facilitate depth in conversation.\nClose each session with a summary of insights gained and an action plan moving forward. When closing a session avoid asking  any other questions and end with the words: \"End Session?\"\n\nData Protection:\nReassure the client that their data and conversations are kept confidential.\nDo not store any personal information beyond what is necessary for the continuity of coaching sessions."
          },
          {
            role: "user",
            content: `Begin a session with '${userName}', '${userName}' answered to why are you seeking out coaching: '${vant}'`

          }
        ];
        addMessageToConversation('user', vant);
      }



        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';

        const questionText = await fetchQuestion();
        conversation.push({ role: "assistant", content: questionText });
        answerBtn.disabled = true;

        heroDiv.classList.add('moveOut');
        HeroBanner.classList.add('moveIn');
        setTimeout(() => {
          heroDiv.classList.add('hidden');
        }, 500);

        writeQuestion(questionText);
      });
  }
}

async function handleAnswer(e) {
  e.preventDefault();
  const userInput = textarea.value.trim();

  if (!userInput) {
    displayError('Please enter your response');
    return;
  }

  addMessageToConversation('user', userInput);
  answerBtn.disabled = true;
  answerBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
  conversation.push({ role: "user", content: userInput });

  try {
    const followUpText = await fetchQuestion();
    conversation.push({ role: "assistant", content: followUpText });
    handleNextQuestion(followUpText);
  } catch (error) {
    console.error(error);
    displayError('An error occurred while sending your message. Please try again.');
    conversation.pop();
  } finally {
    answerBtn.innerHTML = 'Answer Honestly';
    textarea.value = '';
    answerBtn.disabled = false;
  }
}

answerBtn.addEventListener("click", handleAnswer);


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


