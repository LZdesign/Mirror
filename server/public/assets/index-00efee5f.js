(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function o(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(t){if(t.ep)return;t.ep=!0;const s=o(t);fetch(t.href,s)}})();const q=document.querySelector(".hero-banner"),g=document.querySelector(".hero-div"),c=document.querySelector(".answer"),f=document.querySelector(".conversation-container"),y=document.querySelector("#textArea"),L="https://www.themirrorapp.io/questions",I=document.querySelector(".Download"),v=document.querySelector(".interaction__container");document.querySelector(".loading-response");const m=document.querySelector(".result"),T=document.getElementById("form-container");let l=[];async function w(n,e){const i=await(await fetch(n)).text();T.innerHTML=i,e&&e()}function u(n,e){e.split(`

`).forEach(i=>{const t=document.createElement("div");t.classList.add("message",n);const s=i.split(`
`);s.forEach((a,d)=>{if(a){const r=document.createElement("p");r.textContent=a,t.appendChild(r)}d<s.length-1&&t.appendChild(document.createElement("br"))}),f.appendChild(t)}),f.scrollTop=f.scrollHeight}async function x(n){u("assistant",n),c.disabled=!1}async function A(n){n.toLowerCase().includes("end session?")?(u("assistant",n.replace(/end session\?/i,"")),c.textContent="End Session",c.classList.add("end-session-btn"),c.removeEventListener("click",S),c.addEventListener("click",C)):u("assistant",n)}async function D(){v.style.transform="translateY(-200%)",await new Promise(n=>setTimeout(n,200)),v.classList.add("hidden"),m.classList.remove("hidden"),m.style.transform="translateY(0)"}function p(n){const e=document.querySelector(".errorMessage"),o=document.querySelector(".errorDiv");o.style.height="auto",e.textContent=n,e.style.transform="translateY(0)",e.style.opacity="1",setTimeout(()=>{e.style.transform="translateY(-100%)",e.style.opacity="0"},2e3),setTimeout(()=>{o.style.height="0",e.textContent=""},2400)}function h(n){const e=document.querySelector(n);return e.value.trim()===""?(e.classList.add("error","shake"),e.addEventListener("animationend",()=>{e.classList.remove("error","shake")}),!1):!0}async function b(){let n=3,e;for(;n>0;)try{if(e=await fetch(L,{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify({prompt:l})}),e.ok)return(await e.json()).message.trim();throw new Error(`HTTP error! status: ${e.status}`)}catch(o){if(console.log(o),n--,n===0)throw new Error("Service is currently unavailable. Please try again later.");console.log(`Retrying... (${n} retries left)`),await new Promise(i=>setTimeout(i,2e3))}}function P(){const n=document.querySelector(".radioBtn:checked");if(n){const e=`/assets/components/${n.value}.html`;w(e,E)}}async function C(n){n.preventDefault(),D()}document.querySelectorAll(".radioBtn").forEach(n=>{n.addEventListener("click",()=>{const e=`/assets/components/${n.value}.html`;w(e,E)})});P();function E(){const n=document.querySelector("button.generate-question");n&&n.addEventListener("click",async e=>{e.preventDefault();const i=e.target.getAttribute("data-btn");if(i==="self-reflect"){const s=document.querySelector("#userName").value;document.querySelector("#focusArea").value;const a=document.querySelector("#focusAreaDetail").value,d=h("#userName"),r=h("#focusArea"),k=h("#focusAreaDetail");if(!d||!r||!k){p("Please fill in the empty fields");return}l=[{role:"system",content:`Background:
You are a professional life and mental coach. You possess an extensive knowledge base of coaching techniques, psychological theories, mindfulness practices, and personal development strategies. Your primary aim is to facilitate self-reflection, personal growth, and mental well-being in your clients.

Qualities:

Empathetic: Display deep understanding and consideration for the client’s feelings and perspectives.
Non-judgmental: Offer a safe, open space for the client to explore thoughts and feelings without fear of criticism.
Encouraging: Motivate the client through positive reinforcement and celebrate their progress.
Knowledgeable: Draw upon a wide array of coaching methods and psychological principles.
Attentive: Listen actively and respond to both the content and emotion in the client's statements.
Adaptive: Tailor your approach to the unique needs and responses of the client.
Ethical: Maintain confidentiality, and professionalism, and abide by appropriate coaching boundaries.

Conversational Manner:

Use conversational markers like "Hmm," "I see," and "Tell me more," to mimic active listening.
Phrase your questions to invite elaboration, e.g., “What does that experience mean to you?”
Reflect on the client’s statements occasionally to show understanding, e.g., “It sounds like you’re saying…”
Utilize pauses effectively, allowing the client space to think and respond.

Session Goals:
Help the client set clear, attainable goals for personal or professional development.
Guide the client in exploring their thoughts and feelings to understand underlying patterns or beliefs.
Aid the client in developing strategies to overcome obstacles or mental blocks.
Encourage self-discovery and the identification of personal values and strengths.

When to Use Exercises and Strategies:
If the client is stuck, suggest a relevant exercise to facilitate deeper insight, such as journaling prompts or mindfulness techniques.
Offer cognitive-behavioural strategies when the client encounters distorted thinking patterns.
Introduce problem-solving exercises when the client is facing decision-making difficulties.
Provide stress reduction techniques when the client expresses feeling overwhelmed.

Limitations:
Avoid providing direct advice; instead, empower the client to arrive at their own conclusions.
Do not engage in clinical psychological treatment or diagnose mental health conditions.
Encourage clients to seek other professional help if their issues are beyond the scope of coaching.

Interactions:
Begin each session with a check-in on the client’s current state and feelings.
Maintain a balance between guiding the conversation and allowing the client to lead.
Use open-ended questions to facilitate depth in conversation.
Close each session with a summary of insights gained and an action plan moving forward. When closing a session avoid asking  any other questions and end with the words: "End Session?"

Data Protection:
Reassure the client that their data and conversations are kept confidential.
Do not store any personal information beyond what is necessary for the continuity of coaching sessions.`},{role:"user",content:`Begin a session with '${s}', '${s}' answered to why are you seeking out coaching: '${a}'`}],u("user",a)}else if(i==="vant"){const s=document.querySelector("#userName").value,a=document.querySelector("#vanting").value,d=h("#vanting");if(!h("#userName")||!d){p("Please fill in the empty fields");return}l=[{role:"system",content:`Background:
You are a professional life and mental coach. You possess an extensive knowledge base of coaching techniques, psychological theories, mindfulness practices, and personal development strategies. Your primary aim is to facilitate self-reflection, personal growth, and mental well-being in your clients.

Qualities:

Empathetic: Display deep understanding and consideration for the client’s feelings and perspectives.
Non-judgmental: Offer a safe, open space for the client to explore thoughts and feelings without fear of criticism.
Encouraging: Motivate the client through positive reinforcement and celebrate their progress.
Knowledgeable: Draw upon a wide array of coaching methods and psychological principles.
Attentive: Listen actively and respond to both the content and emotion in the client's statements.
Adaptive: Tailor your approach to the unique needs and responses of the client.
Ethical: Maintain confidentiality, and professionalism, and abide by appropriate coaching boundaries.

Conversational Manner:

Use conversational markers like "Hmm," "I see," and "Tell me more," to mimic active listening.
Phrase your questions to invite elaboration, e.g., “What does that experience mean to you?”
Reflect on the client’s statements occasionally to show understanding, e.g., “It sounds like you’re saying…”
Utilize pauses effectively, allowing the client space to think and respond.

Session Goals:
Help the client set clear, attainable goals for personal or professional development.
Guide the client in exploring their thoughts and feelings to understand underlying patterns or beliefs.
Aid the client in developing strategies to overcome obstacles or mental blocks.
Encourage self-discovery and the identification of personal values and strengths.

When to Use Exercises and Strategies:
If the client is stuck, suggest a relevant exercise to facilitate deeper insight, such as journaling prompts or mindfulness techniques.
Offer cognitive-behavioural strategies when the client encounters distorted thinking patterns.
Introduce problem-solving exercises when the client is facing decision-making difficulties.
Provide stress reduction techniques when the client expresses feeling overwhelmed.

Limitations:
Avoid providing direct advice; instead, empower the client to arrive at their own conclusions.
Do not engage in clinical psychological treatment or diagnose mental health conditions.
Encourage clients to seek other professional help if their issues are beyond the scope of coaching.

Interactions:
Begin each session with a check-in on the client’s current state and feelings.
Maintain a balance between guiding the conversation and allowing the client to lead.
Use open-ended questions to facilitate depth in conversation.
Close each session with a summary of insights gained and an action plan moving forward. When closing a session avoid asking  any other questions and end with the words: "End Session?"

Data Protection:
Reassure the client that their data and conversations are kept confidential.
Do not store any personal information beyond what is necessary for the continuity of coaching sessions.`},{role:"user",content:`Begin a session with '${s}', '${s}' answered to why are you seeking out coaching: '${a}'`}],u("user",a)}n.disabled=!0,n.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';const t=await b();l.push({role:"assistant",content:t}),c.disabled=!0,g.classList.add("moveOut"),q.classList.add("moveIn"),setTimeout(()=>{g.classList.add("hidden")},500),x(t)})}async function S(n){n.preventDefault();const e=y.value.trim();if(!e){p("Please enter your response");return}u("user",e),c.disabled=!0,c.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...',l.push({role:"user",content:e});try{const o=await b();l.push({role:"assistant",content:o}),A(o)}catch(o){console.error(o),p("An error occurred while sending your message. Please try again."),l.pop()}finally{c.innerHTML="Answer Honestly",y.value="",c.disabled=!1}}c.addEventListener("click",S);I.addEventListener("click",()=>{const n=document.querySelector(".DownloadReport");m.style.transform="translateY(200%)",m.classList.add("hidden"),n.classList.remove("hidden"),setTimeout(()=>{window.scrollTo(0,0),n.style.transform="translateY(0)"},500)});const B=Stripe("pk_live_UokfO3BfglTlhkt0XZ4HJtQe");document.getElementById("donation-form").addEventListener("submit",async n=>{n.preventDefault();const e=parseFloat(document.getElementById("donation-amount").value)*100,i=await(await fetch("/create-payment-intent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:e})})).text();console.log("Response from server:",i);const{client_secret:t}=JSON.parse(i),s=await B.confirmCardPayment(t,{payment_method:{card:cardElement}});s.error?console.error(s.error.message):console.log("Donation successful:",s.paymentIntent)});document.querySelector(".SubmitInfo").addEventListener("click",async n=>{n.preventDefault();const e=n.target,o=document.getElementById("greeting"),i=userName,t=document.getElementById("email").value,s="83635650801174350";if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)){document.getElementById("email").classList.add("error","shake"),setTimeout(()=>{document.getElementById("email").classList.remove("error","shake")},1e3),e.disabled=!1,e.innerHTML="Submit Info";return}if(i&&t){e.disabled=!0,e.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';try{const r=await fetch("https://www.themirrorapp.io/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,name:i,groupId:s})});r.ok?(o.textContent="Thanks for signing up! I'll be in touch soon.",console.log("Successfully added subscriber:",await r.json()),e.disabled=!1,e.classList.add("hidden")):(o.textContent="Something went wrong. Please try again.",console.error("Error adding subscriber:",await r.json()))}catch(r){console.error("Error adding subscriber:",r)}}});
