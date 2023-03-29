(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function o(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(n){if(n.ep)return;n.ep=!0;const s=o(n);fetch(n.href,s)}})();const f=document.querySelector("button.generate-question"),A=document.querySelector(".hero-banner"),w=document.querySelector(".hero-div"),l=document.querySelector(".answer"),m=document.querySelector(".question h3"),S=document.querySelector("#textArea"),v=document.querySelector(".progress__container"),L="https://themirrorapp.io/questions",E=document.querySelector(".Download"),q=document.querySelector(".interaction__container"),y=document.querySelector(".loading-response"),h=document.querySelector(".result");let d=m.dataset.set,i=[];async function T(t){for(let e=0;e<t.length;e++)await new Promise(o=>setTimeout(o,40)),m.textContent+=t.charAt(e),t.length>400&&(m.style.fontSize="1.8em",m.style.lineHeight="1.3");l.disabled=!1}async function x(t){if(v.querySelector(`div[data-step='${d}']`).classList.add("complete"),m.textContent="",d++,d<=3)T(t),v.querySelector(`div[data-step='${d}']`).classList.add("active"),document.querySelector(".current-question").textContent=d;else{const o=t;i=[...i,{role:"assistant",content:o}];const r=o.split("%%Tasks:"),n=r[0],s=r[1],a=document.querySelector(".insightText");document.querySelector(".tasks");const u=s.trim().split(/\d+\./).filter(p=>p.trim()!==""),c=document.querySelector(".tasksList");c.innerHTML="",u.forEach(p=>{const b=document.createElement("li");b.textContent=p.trim(),c.appendChild(b)}),a.textContent=n,I()}}async function I(){q.style.transform="translateY(-200%)",y.classList.remove("hidden"),await new Promise(t=>setTimeout(t,200)),q.classList.add("hidden"),await new Promise(t=>setTimeout(t,2e3)),y.style.transform="translateY(-200%)",await new Promise(t=>setTimeout(t,400)),h.classList.remove("hidden"),h.style.transform="translateY(0)",y.classList.add("hidden")}function k(t){const e=document.querySelector(".errorMessage"),o=document.querySelector(".errorDiv");o.style.height="auto",e.textContent=t,e.style.transform="translateY(0)",e.style.opacity="1",setTimeout(()=>{e.style.transform="translateY(-100%)",e.style.opacity="0"},2e3),setTimeout(()=>{o.style.height="0",e.textContent=""},2400)}function g(t){const e=document.querySelector(t);return e.value.trim()===""?(e.classList.add("error","shake"),e.addEventListener("animationend",()=>{e.classList.remove("error","shake")}),!1):!0}async function P(){return(await(await fetch(L,{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify({prompt:i})})).json()).message.trim()}f.addEventListener("click",async t=>{t.preventDefault();const e=g("#userName"),o=g("#focusArea"),r=g("#focusAreaDetail");if(!e||!o||!r){k("Please fill in the empty fields");return}const n=document.querySelector("#userName").value,s=document.querySelector("#focusArea").value,a=document.querySelector("#focusAreaDetail").value;i=[{role:"system",content:"You are an experienced life and mental coach. Start by asking your client the first question, which should encourage self-reflection. Follow the User instructions to complete the interaction. "},{role:"user",content:`Act as an experienced life and mental coach with a proven record of helping people attain greater fulfilment. Your role involves guiding clients in enhancing their relationships, careers, and everyday lives by clarifying their goals, identifying obstacles, and developing strategies to overcome these challenges. Here are some criteria that yoou must follow as a coach:Active Listening: A coach must actively listen to their clients, empathize with them, and understand their unique perspectives and experiences to provide tailored guidance. Clear Communication: A coach must be able to communicate clearly and effectively, both verbally and nonverbally, to help their clients understand the coaching process and the strategies being recommended. Goal-Setting: A coach must work with their clients to set specific, measurable, achievable, relevant, and time-bound (SMART) goals that align with their clients' values and aspirations. Action-Oriented Approach: A coach must help their clients develop actionable plans and strategies to achieve their goals and hold them accountable for taking concrete steps towards progress. Trust and Confidentiality: A coach must maintain a trusting and confidential relationship with their clients to ensure that clients feel safe and comfortable sharing their deepest concerns and challenges. Flexibility and Adaptability: A coach must be able to adapt their coaching approach and strategies to the unique needs and goals of each client, as well as adjust their approach if necessary as the coaching process progresses. Positive Reinforcement: A coach must provide positive reinforcement and encouragement to help their clients stay motivated and continue making progress towards their goals. .You will engage in a session with ${n}, focusing on the area of ${s}, specifically '${a}'. Begin by asking the first question, which should encourage self-reflection in ${s} but try not to overwhelm me by asking too deep question straight away. you will address me as ${n}. Your first response should be: Hello ${n}, [First Question]. Use a friendly tone and speak in the first person, as if you are talking to a friend.`}],f.disabled=!0,f.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';const u=await P();i.push({role:"assistant",content:u}),d=1,l.disabled=!0,w.classList.add("moveOut"),A.classList.add("moveIn"),setTimeout(()=>{v.querySelector("div[data-step='1']").classList.add("active"),w.classList.add("hidden")},500),T(u)});l.addEventListener("click",async function(t){t.preventDefault();const e=S.value.trim();if(!e){k("Please enter your response");return}l.disabled=!0,l.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';let o;d===3?o=e+" Provide an Insight, and assign three specific tasks for next session. Set task that are manageable, trackable, and attainable. The goal is to keep the user accountable in the following sessions. You will follow up on those tasks in the next session. Can you please format the response as follows: Insight: <Insight> %%Tasks: 1.<Task 1> 2.<Task 2> 3.<Task 3>. The '%%' is important, don't avoid it. For example: Insight: You are a great person / Tasks: 1. Do this 2. Do that 3. Do the other thing.":o=" Provide a follow-up question that will help you to understand the client's perspective on their reflection. "+e,i=[...i,{role:"user",content:o}];try{const s=(await(await fetch(L,{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify({prompt:i})})).json()).message.trim(),a={role:"assistant",content:s};i.push(a),l.innerHTML="Answer",l.disabled=!0,S.value="",x(s)}catch(r){console.error(r)}});E.addEventListener("click",()=>{const t=document.querySelector(".DownloadReport");h.style.transform="translateY(200%)",h.classList.add("hidden"),t.classList.remove("hidden"),setTimeout(()=>{window.scrollTo(0,0),t.style.transform="translateY(0)"},500)});const C=Stripe("pk_live_UokfO3BfglTlhkt0XZ4HJtQe");document.getElementById("donation-form").addEventListener("submit",async t=>{t.preventDefault();const e=parseFloat(document.getElementById("donation-amount").value)*100,r=await(await fetch("/create-payment-intent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:e})})).text();console.log("Response from server:",r);const{client_secret:n}=JSON.parse(r),s=await C.confirmCardPayment(n,{payment_method:{card:cardElement}});s.error?console.error(s.error.message):console.log("Donation successful:",s.paymentIntent)});document.querySelector(".SubmitInfo").addEventListener("click",async t=>{t.preventDefault();const e=t.target,o=document.getElementById("greeting"),r=userName,n=document.getElementById("email").value,s="83635650801174350";if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n)){document.getElementById("email").classList.add("error","shake"),setTimeout(()=>{document.getElementById("email").classList.remove("error","shake")},1e3),e.disabled=!1,e.innerHTML="Submit Info";return}if(r&&n){e.disabled=!0,e.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';try{const c=await fetch("https://themirrorapp.io/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n,name:r,groupId:s})});c.ok?(o.textContent="Thanks for signing up! I'll be in touch soon.",console.log("Successfully added subscriber:",await c.json()),e.disabled=!1,e.classList.add("hidden")):(o.textContent="Something went wrong. Please try again.",console.error("Error adding subscriber:",await c.json()))}catch(c){console.error("Error adding subscriber:",c)}}});
