(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function o(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(n){if(n.ep)return;n.ep=!0;const s=o(n);fetch(n.href,s)}})();const E=document.querySelector(".hero-banner"),f=document.querySelector(".hero-div"),i=document.querySelector(".answer"),h=document.querySelector(".conversation-container"),g=document.querySelector("#textArea"),L="https://www.themirrorapp.io/questions",S=document.querySelector(".Download"),y=document.querySelector(".interaction");document.querySelector(".loading-response");const m=document.querySelector(".result");let l=[];function d(t,e){e.split(`

`).forEach(r=>{const n=document.createElement("div");n.classList.add("message",t);const s=r.split(`
`);s.forEach((a,u)=>{if(a){const c=document.createElement("p");c.textContent=a,n.appendChild(c)}u<s.length-1&&n.appendChild(document.createElement("br"))}),h.appendChild(n)}),h.scrollTop=h.scrollHeight}async function T(t){d("assistant",t),i.disabled=!1}async function q(t){t.toLowerCase().includes("end session?")?(d("assistant",t.replace(/end session\?/i,"")),i.classList.add("end-session-btn"),i.removeEventListener("click",w),i.addEventListener("click",C)):d("assistant",t)}async function k(){y.style.transform="translateY(-200%)",await new Promise(t=>setTimeout(t,200)),y.classList.add("hidden"),m.classList.remove("hidden"),m.style.transform="translateY(0)"}function p(t){const e=document.querySelector(".errorMessage"),o=document.querySelector(".errorDiv");o.style.height="auto",e.textContent=t,e.style.transform="translateY(0)",e.style.opacity="1",setTimeout(()=>{e.style.transform="translateY(-100%)",e.style.opacity="0"},2e3),setTimeout(()=>{o.style.height="0",e.textContent=""},2400)}function v(t){const e=document.querySelector(t);return(e.value?e.value.trim():e.textContent.trim())===""?(e.classList.add("error","shake"),e.addEventListener("animationend",()=>{e.classList.remove("error","shake")}),!1):!0}async function b(){let t=3,e;for(;t>0;)try{if(e=await fetch(L,{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify({prompt:l})}),e.ok)return(await e.json()).message.trim();throw new Error(`HTTP error! status: ${e.status}`)}catch(o){if(console.log(o),t--,t===0)throw new Error("Service is currently unavailable. Please try again later.");console.log(`Retrying... (${t} retries left)`),await new Promise(r=>setTimeout(r,2e3))}}async function C(t){t.preventDefault(),k()}function I(){const t=document.querySelector("button.generate-question");t&&t.addEventListener("click",async e=>{if(e.preventDefault(),e.target.getAttribute("data-btn")==="self-reflect"){const s=document.querySelector("#userName").value,a=document.querySelector("#focusAreaDetail").textContent,u=v("#userName"),c=v("#focusAreaDetail");if(console.log(s),console.log(a),!u||!c){p("Please fill in the empty fields");return}l=[{role:"system",content:`Background:
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
Close each session with a summary of insights gained and an action plan moving forward. On the last response when you are ready to end the session, avoid any other questions and end the message with "End Session?"

Data Protection:
Reassure the client that their data and conversations are kept confidential.
Do not store any personal information beyond what is necessary for the continuity of coaching sessions.`},{role:"user",content:`Begin a session with '${s}', '${s}' answered to why are you seeking out coaching: '${a}'`}],d("user",a)}t.disabled=!0,t.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Starting...';const n=await b();l.push({role:"assistant",content:n}),i.disabled=!0,f.classList.add("moveOut"),E.classList.add("moveIn"),setTimeout(()=>{f.classList.add("hidden")},500),T(n)})}I();async function w(t){t.preventDefault();const e=g.textContent.trim();if(!e){p("Please enter your response");return}d("user",e),i.disabled=!0,i.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading Response...',l.push({role:"user",content:e});try{const o=await b();l.push({role:"assistant",content:o}),q(o)}catch(o){console.error(o),p("An error occurred while sending your message. Please try again."),l.pop()}finally{i.classList.contains("end-session-btn")?i.innerHTML="End Session":i.innerHTML="Answer Honestly",g.textContent="",i.disabled=!1}}i.addEventListener("click",w);S.addEventListener("click",()=>{const t=document.querySelector(".DownloadReport");m.style.transform="translateY(200%)",m.classList.add("hidden"),t.classList.remove("hidden"),setTimeout(()=>{window.scrollTo(0,0),t.style.transform="translateY(0)"},500)});const x=Stripe("pk_live_UokfO3BfglTlhkt0XZ4HJtQe");document.getElementById("donation-form").addEventListener("submit",async t=>{t.preventDefault();const e=parseFloat(document.getElementById("donation-amount").value)*100,r=await(await fetch("/create-payment-intent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:e})})).text();console.log("Response from server:",r);const{client_secret:n}=JSON.parse(r),s=await x.confirmCardPayment(n,{payment_method:{card:cardElement}});s.error?console.error(s.error.message):console.log("Donation successful:",s.paymentIntent)});document.querySelector(".SubmitInfo").addEventListener("click",async t=>{t.preventDefault();const e=t.target,o=document.getElementById("greeting"),r=userName,n=document.getElementById("email").value,s="83635650801174350";if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n)){document.getElementById("email").classList.add("error","shake"),setTimeout(()=>{document.getElementById("email").classList.remove("error","shake")},1e3),e.disabled=!1,e.innerHTML="Submit Info";return}if(r&&n){e.disabled=!0,e.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';try{const c=await fetch("https://www.themirrorapp.io/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n,name:r,groupId:s})});c.ok?(o.textContent="Thanks for signing up! I'll be in touch soon.",console.log("Successfully added subscriber:",await c.json()),e.disabled=!1,e.classList.add("hidden")):(o.textContent="Something went wrong. Please try again.",console.error("Error adding subscriber:",await c.json()))}catch(c){console.error("Error adding subscriber:",c)}}});
