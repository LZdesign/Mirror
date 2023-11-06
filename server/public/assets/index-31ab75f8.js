(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function s(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(t){if(t.ep)return;t.ep=!0;const o=s(t);fetch(t.href,o)}})();const q=document.querySelector(".hero-banner"),m=document.querySelector(".hero-div"),c=document.querySelector(".answer"),g=document.querySelector(".question h3"),p=document.querySelector("#textArea"),k=document.querySelector(".progress__container"),E="https://www.themirrorapp.io/questions",L=document.querySelector(".Download");document.querySelector(".interaction__container");document.querySelector(".loading-response");const f=document.querySelector(".result"),I=document.getElementById("form-container");let l=[];async function y(n,e){const i=await(await fetch(n)).text();I.innerHTML=i,e&&e()}async function v(n){for(let e=0;e<n.length;e++)await new Promise(s=>setTimeout(s,40)),g.textContent+=n.charAt(e);c.disabled=!1}async function x(n){g.textContent="",v(n)}function h(n){const e=document.querySelector(".errorMessage"),s=document.querySelector(".errorDiv");s.style.height="auto",e.textContent=n,e.style.transform="translateY(0)",e.style.opacity="1",setTimeout(()=>{e.style.transform="translateY(-100%)",e.style.opacity="0"},2e3),setTimeout(()=>{s.style.height="0",e.textContent=""},2400)}function d(n){const e=document.querySelector(n);return e.value.trim()===""?(e.classList.add("error","shake"),e.addEventListener("animationend",()=>{e.classList.remove("error","shake")}),!1):!0}async function w(){return(await(await fetch(E,{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify({prompt:l})})).json()).message.trim()}function T(){const n=document.querySelector(".radioBtn:checked");if(n){const e=`/assets/components/${n.value}.html`;y(e,b)}}document.querySelectorAll(".radioBtn").forEach(n=>{n.addEventListener("click",()=>{const e=`/assets/components/${n.value}.html`;y(e,b)})});T();function b(){const n=document.querySelector("button.generate-question");n&&n.addEventListener("click",async e=>{e.preventDefault();const i=e.target.getAttribute("data-btn");if(i==="self-reflect"){const o=document.querySelector("#userName").value;document.querySelector("#focusArea").value;const a=document.querySelector("#focusAreaDetail").value,u=d("#userName"),r=d("#focusArea"),S=d("#focusAreaDetail");if(!u||!r||!S){h("Please fill in the empty fields");return}l=[{role:"system",content:`Background:
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
Close each session with a summary of insights gained and an action plan moving forward.
Data Protection:

Reassure the client that their data and conversations are kept confidential.
Do not store any personal information beyond what is necessary for the continuity of coaching sessions.`},{role:"user",content:`Begin a session with '${o}', '${o}' answered to why are you seeking out coaching: '${a}'`}]}else if(i==="vant"){const o=document.querySelector("#userName").value;document.querySelector("#vanting").value;const a=d("#vanting");if(!d("#userName")||!a){h("Please fill in the empty fields");return}l=[{role:"system",content:`Background:
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
Close each session with a summary of insights gained and an action plan moving forward.
Data Protection:

Reassure the client that their data and conversations are kept confidential.
Do not store any personal information beyond what is necessary for the continuity of coaching sessions.`},{role:"user",content:`Begin a session with '${o}', '${o}' answered to why are you seeking out coaching: '${focusAreaDetail}'`}]}n.disabled=!0,n.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';const t=await w();l.push({role:"assistant",content:t}),c.disabled=!0,m.classList.add("moveOut"),q.classList.add("moveIn"),setTimeout(()=>{k.querySelector("div[data-step='1']").classList.add("active"),m.classList.add("hidden")},500),v(t)})}c.addEventListener("click",async function(n){n.preventDefault();const e=p.value.trim();if(!e){h("Please enter your response");return}c.disabled=!0,c.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...',l.push({role:"user",content:e});try{const s=await w();l.push({role:"assistant",content:s}),c.innerHTML="Answer",p.value="",x(s)}catch(s){console.error(s)}finally{c.disabled=!1}});L.addEventListener("click",()=>{const n=document.querySelector(".DownloadReport");f.style.transform="translateY(200%)",f.classList.add("hidden"),n.classList.remove("hidden"),setTimeout(()=>{window.scrollTo(0,0),n.style.transform="translateY(0)"},500)});const A=Stripe("pk_live_UokfO3BfglTlhkt0XZ4HJtQe");document.getElementById("donation-form").addEventListener("submit",async n=>{n.preventDefault();const e=parseFloat(document.getElementById("donation-amount").value)*100,i=await(await fetch("/create-payment-intent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:e})})).text();console.log("Response from server:",i);const{client_secret:t}=JSON.parse(i),o=await A.confirmCardPayment(t,{payment_method:{card:cardElement}});o.error?console.error(o.error.message):console.log("Donation successful:",o.paymentIntent)});document.querySelector(".SubmitInfo").addEventListener("click",async n=>{n.preventDefault();const e=n.target,s=document.getElementById("greeting"),i=userName,t=document.getElementById("email").value,o="83635650801174350";if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)){document.getElementById("email").classList.add("error","shake"),setTimeout(()=>{document.getElementById("email").classList.remove("error","shake")},1e3),e.disabled=!1,e.innerHTML="Submit Info";return}if(i&&t){e.disabled=!0,e.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';try{const r=await fetch("https://www.themirrorapp.io/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,name:i,groupId:o})});r.ok?(s.textContent="Thanks for signing up! I'll be in touch soon.",console.log("Successfully added subscriber:",await r.json()),e.disabled=!1,e.classList.add("hidden")):(s.textContent="Something went wrong. Please try again.",console.error("Error adding subscriber:",await r.json()))}catch(r){console.error("Error adding subscriber:",r)}}});
