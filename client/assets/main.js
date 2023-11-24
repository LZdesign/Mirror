const HeroBanner = document.querySelector(".hero-banner");
const heroDiv = document.querySelector(".hero-div");
const answerBtn = document.querySelector(".answer");
const conversationContainer = document.querySelector(".conversation-container");
const textarea = document.querySelector("#textArea");
const serverport = 3001;
const baseUrl = `https://www.themirrorapp.io`;
const download = document.querySelector('.Download');
const interactionContainer = document.querySelector(".interaction");
const loadingResponse = document.querySelector(".loading-response");
const result = document.querySelector(".result");
let selectedTopic = "";
let conversation = [];


function markdownToHTML(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}


function addMessageToConversation(sender, text) {
  const paragraphs = text.split('\n\n');
  
  paragraphs.forEach(paragraph => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);

    const lines = paragraph.split('\n');
    lines.forEach((line, index) => {
      if (line) {
        const lineElement = document.createElement('p');
        lineElement.innerHTML = markdownToHTML(line); // Use innerHTML instead of textContent
        messageElement.appendChild(lineElement);
      }
      if (index < lines.length - 1) {
        messageElement.appendChild(document.createElement('br'));
      }
    });

    conversationContainer.appendChild(messageElement);
  });


// Scroll to the bottom of the conversation container
  conversationContainer.scrollTop = conversationContainer.scrollHeight;
}

//  function to write the question to the conversation 

async function writeQuestion(questionText) {
  addMessageToConversation('assistant', questionText);
  answerBtn.disabled = false;
}


// function to handle the next question
async function handleNextQuestion(followUpText) {
  if (followUpText.toLowerCase().includes("end session?")) {
    addMessageToConversation('assistant', followUpText.replace(/end session\?/i, ""));
    answerBtn.classList.add('end-session-btn'); // If you want to apply special styling for the 'End Session' button
    answerBtn.removeEventListener('click', handleAnswer);
    answerBtn.addEventListener('click', endSession);
  } else {
    addMessageToConversation('assistant', followUpText);
  }
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
  const inputValue = inputElement.value ? inputElement.value.trim() : inputElement.textContent.trim();


  if (inputValue === '') {
    inputElement.classList.add('error', 'shake');
    inputElement.addEventListener('animationend', () => {
      inputElement.classList.remove('error', 'shake');
    });
    return false;
  }
  return true;
}

async function fetchthreadId() {
  let retries = 3;
  let response;
  let nextUrl = baseUrl+"/threadId";

  while (retries > 0) {
    try {
      response = await fetch(nextUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const {threadId} = await response.json();

        return threadId; 
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


async function fetchQuestion(threadId="") {
  let retries = 3;
  let response;
  let lastMessage = conversation[conversation.length - 1];
  let nextUrl = `${baseUrl}/questions/${threadId}`;

  while (retries > 0) {
    try {
      response = await fetch(nextUrl, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ prompt: lastMessage })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const prompt = await response.json();        
        const { message } = prompt;

        return message.value.trim(); 
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


document.querySelectorAll('.topic-pills .pill').forEach(pill => {
  pill.addEventListener('click', (e) => {
    e.preventDefault();
    selectedTopic = e.target.textContent.trim();
    document.querySelectorAll('.topic-pills .pill').forEach(p => p.classList.remove('selected'));
    e.target.classList.add('selected');
  });
});



async function endSession(e) {
  e.preventDefault();
  animate();
}




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
          const focusAreaDetail = selectedTopic;
  
          const userNameIsValid = validateAndAnimate('#userName');
          
          if (!userNameIsValid ) {
            displayError('Please fill in the empty fields');
            return;
          }
          
          conversation = [
            {
              role: "user",
              content: `Begin a session with '${userName}', '${userName}' answered to why are you seeking out coaching: '${focusAreaDetail}'`

            }
          ];

          // addMessageToConversation('user', focusAreaDetail);

        }

        generateBtn.disabled = true;
        generateBtn.classList.add('waiting');
        generateBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Starting...';

        const threadId = await fetchthreadId(); 
        window.threadId = threadId || "";

        const questionText = await fetchQuestion(threadId);
        conversation.push({ role: "assistant", content: questionText });
        answerBtn.disabled = true;

        heroDiv.classList.add('moveOut');
        HeroBanner.classList.remove('hidden');
        setTimeout(() => {
        HeroBanner.classList.add('moveIn');
        }, 100);
        setTimeout(() => {
          heroDiv.classList.add('hidden');
        }, 500);

        writeQuestion(questionText);
      });
  }
}


addGenerateBtnEventListener();



async function handleAnswer(e) {
  e.preventDefault();
  const userInput = textarea.textContent.trim();

  if (!userInput) {
    displayError('Please enter your response');
    return;
  }

  if (!window.threadId) {
    displayError('threadId is not defined');
    return;
  }

  addMessageToConversation('user', userInput);
  answerBtn.disabled = true;
  answerBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading Response...';
  answerBtn.classList.add('waiting');
  conversation.push({ role: "user", content: userInput });

  try {
    const followUpText = await fetchQuestion(window.threadId);
    conversation.push({ role: "assistant", content: followUpText });
    handleNextQuestion(followUpText);
  } catch (error) {
    console.error(error);
    displayError('An error occurred while sending your message. Please try again.');
    conversation.pop();
  } finally {
    if (answerBtn.classList.contains('end-session-btn')) {
      answerBtn.innerHTML = 'End Session';
    } else {
      answerBtn.classList.remove('waiting');
      answerBtn.innerHTML = 'Answer Honestly';

    }
    textarea.textContent = '';
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


