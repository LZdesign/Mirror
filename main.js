import './style.css';

const generateBtn = document.querySelector("button.generate-question");
const HeroBanner = document.querySelector(".hero-banner");
const heroDiv = document.querySelector(".hero-div");
const answerBtn = document.querySelector(".answer");
const question = document.querySelector(".question h3");
const textarea = document.querySelector("#textArea");
const progress = document.querySelector('.progress__container');
const baseUrl = "http://localhost:3000/questions";
const insightUrl = "http://localhost:3000/questions";
const download = document.querySelector('.Download');
const interactionContainer = document.querySelector(".interaction__container");
const loadingResponse = document.querySelector(".loading-response");
const result = document.querySelector(".result");

let conversation =  [  
  {
    role: "system",
    content: "You are an experienced life and mental coach. Start by asking your client the first question, which should encourage self-reflection. Follow the User instructions to complete the interaction."
  },
  {    role: "user",    content: "You are an experienced life and mental coach with a proven record of helping people attain greater fulfilment. Your role involves guiding clients in enhancing their relationships, careers, and everyday lives by clarifying their goals, identifying obstacles, and developing strategies to overcome these challenges. You will engage in a session with a client. Begin by asking the first question, which should encourage self-reflection. Use deep questions and always only start with the question."  }
];




let el;

let currentQuestion = question.dataset.set;
let followup1;
let followup2;

let questionText;
let i = 0;
let intervalId = null;


function writeQuestion(questionText) {
  intervalId = setInterval(() => {
    question.textContent += questionText.charAt(i);
    // if the lenght of the question is longer than 200 words scale the font size down with a factor of 0.8
    if (questionText.length > 200) {
      question.style.fontSize = "1.2rem";
    }
    i++;
    if (i === questionText.length) {
      answerBtn.disabled = false;
      clearInterval(intervalId);
      i = 0;
    }
    

  }, 40);
}



function handleNextQuestion() {
  let followUpText;
  switch(currentQuestion) {
    case 1:
      followUpText = followup1;
      el.classList.add('complete');
      break;
    case 2:
      followUpText = followup2;
      el.classList.add('complete');
      break;
    case 3:
      el = progress.querySelector( "div[data-step='3']");
      el.classList.add('complete');
      animate();
      return;
  }
  question.textContent = "";
  writeQuestion(followUpText);
  currentQuestion++;
  el = progress.querySelector( "div[data-step='" + currentQuestion + "']");
  el.classList.add('active'); 
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

function updateDomAfterFetch(questionText) {
  setTimeout(() => {
    writeQuestion(questionText);
  }, 600);
}





generateBtn.addEventListener("click", async function() {
  getQuestion();
  
  heroDiv.classList.add('moveOut');
  HeroBanner.classList.add('moveIn');
  
  setTimeout(() => {
      //Set progress step to active
      el = progress.querySelector( "div[data-step='1']"); 
      el.classList.add('active');    
  }, 500);
});


answerBtn.addEventListener("click", async function(e) {
  e.preventDefault();

  if (!textarea.value) {
    textArea.classList.add('error');
    textArea.classList.add('shake');
    textArea.addEventListener('animationend', function() {
        textArea.classList.remove('error', 'shake');
    });
    return;
  }
  // collect the input value in a variable to pass to the server as a POST request
  let userInput = textarea.value;
  if (currentQuestion === 3) {
    userInput = userInput + " " + "Provide an Insight, and assign three specific tasks for my next session. Can you please format the response as follows: Insight: <Insight> %%Tasks: 1.<Task 1> 2.<Task 2> 3.<Task 3>. The '%%' is important don't avoid it. for example: Insight: You are a great person / Tasks: 1. Do this 2. Do that 3. Do the other thing.";
    conversation = [...conversation, {role: "user", content: userInput}];
  }
  if (currentQuestion === 2) {
    userInput = userInput + " " + "Ask a follow-up question to further guide my self-exploration.";
    conversation = [...conversation, {role: "user", content: userInput}];
  }
  


  // send the userInput to the server
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
    const parseData = data.message.trim();
    
    if (currentQuestion === 1) {
      followup1 = parseData;
      conversation = [...conversation, {role: "assistant", content: followup1}];
    }
    if (currentQuestion === 2) {
      followup2 = parseData;
      conversation = [...conversation, {role: "assistant", content: followup2}];
    }
    if (currentQuestion === 3) {
      const insight = parseData;
      conversation = [...conversation, {role: "assistant", content: insight}];
      
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
      // tasksEl.textContent = tasks;
      console.log(tasksArray);
      console.log(tasksList);
      console.log(tasks);


      
    }

    answerBtn.disabled = true;
    handleNextQuestion();
    textArea.value = '';
  } catch (error) {
    console.error(error);
  }
   
  
});


download.addEventListener("click", () => {
  const downloadReport = document.querySelector('.DownloadReport');

  downloadReport.classList.remove('hidden');
  result.style.transform = 'translateY(200%)';
  result.classList.add('hidden');

})


// create a function that make a POST request to the server to get the question text
const getQuestion = async () => {
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
    const parseData = data.message.trim();
    questionText = parseData;
    currentQuestion = 1;  
    answerBtn.disabled = true;
    updateDomAfterFetch(questionText);
    conversation = [...conversation, {role: "assistant", content: questionText}];
    console.log(conversation);

  } catch (error) {
    console.error(error);
  }
}



// Create a function that make a POST request to the server to get the Insight text
const getInsight = async () => {
  try {
    const response = await fetch(insightUrl, {
      method: 'POST',
      headers: {
        'Content-type' : 'application/json'
      },
      body: JSON.stringify({
        prompt: conversation
      })
    })

    const data = await response.json();
    const parseData = data.message.trim();
    insight = parseData;
    conversation = [...conversation, {role: "coach", content: insight}];
    console.log(conversation);

  } catch (error) {
    console.error(error);
  }
}
