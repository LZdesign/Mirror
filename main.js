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
let userName;
let focusArea;
let focusAreaDetail;
let conversation = [];




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





generateBtn.addEventListener("click", async function(e) {
  e.preventDefault();
  // set the user name and focus area
  userName = document.querySelector("#userName").value;
  focusArea = document.querySelector("#focusArea").value;
  focusAreaDetail = document.querySelector("#focusAreaDetail").value;

  if (userName === "" || focusArea === "" || focusAreaDetail === "") {
    alert("Please fill in all the fields");
    return;
  }
  else {

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
  


    // Add a loading spinner animation to show that the question is being generated
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';
  
  getQuestion();
  }
  
});


answerBtn.addEventListener("click", async function(e) {
  e.preventDefault();

  answerBtn.disabled = true;
  answerBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';


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
    userInput = userInput + " " + "Provide an Insight, and assign three specific tasks for next session. Set task that are managable, trackable and attainable. The goal is to keep the user accountable on the following sessions. You will follow up on those task in the next session. Can you please format the response as follows: Insight: <Insight> %%Tasks: 1.<Task 1> 2.<Task 2> 3.<Task 3>. The '%%' is important don't avoid it. for example: Insight: You are a great person / Tasks: 1. Do this 2. Do that 3. Do the other thing.";
    conversation = [...conversation, {role: "user", content: userInput}];
  }
  if (currentQuestion === 2 || currentQuestion === 1) {
    userInput = " Provide a follow up question that will help you to understand the client's perspective on their reflection." + " " + userInput; 
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

      
    }

    answerBtn.innerHTML = 'Answer';
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

    // if response ok, parse the data and update the DOM
    if (response.ok) {
      heroDiv.classList.add('moveOut');
      HeroBanner.classList.add('moveIn');
      setTimeout(() => {
        
        //Set progress step to active
          el = progress.querySelector( "div[data-step='1']"); 
          el.classList.add('active');    
      }, 500);

      const data = await response.json();
      const parseData = data.message.trim();
      questionText = parseData;
      currentQuestion = 1;  
      answerBtn.disabled = true;
      updateDomAfterFetch(questionText);
      conversation = [...conversation, {role: "assistant", content: questionText}];
    }
    
  } catch (error) {
    console.error(error);
  }
}


