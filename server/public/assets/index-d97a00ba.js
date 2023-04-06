(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function o(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(n){if(n.ep)return;n.ep=!0;const s=o(n);fetch(n.href,s)}})();const x=document.querySelector(".hero-banner"),b=document.querySelector(".hero-div"),d=document.querySelector(".answer"),m=document.querySelector(".question h3"),w=document.querySelector("#textArea"),v=document.querySelector(".progress__container"),q="https://www.themirrorapp.io/questions",E=document.querySelector(".Download"),S=document.querySelector(".interaction__container"),g=document.querySelector(".loading-response"),f=document.querySelector(".result"),C=document.getElementById("form-container");let u=m.dataset.set,c=[];async function A(t,e){const a=await(await fetch(t)).text();C.innerHTML=a,e&&e()}async function k(t){for(let e=0;e<t.length;e++)await new Promise(o=>setTimeout(o,40)),m.textContent+=t.charAt(e),t.length>400&&(m.style.fontSize="1.8em",m.style.lineHeight="1.3");d.disabled=!1}async function I(t){if(v.querySelector(`div[data-step='${u}']`).classList.add("complete"),m.textContent="",u++,u<=3)k(t),v.querySelector(`div[data-step='${u}']`).classList.add("active"),document.querySelector(".current-question").textContent=u;else{const o=t;c=[...c,{role:"assistant",content:o}];const a=o.split("%%Tasks:"),n=a[0],s=a[1],i=document.querySelector(".insightText");document.querySelector(".tasks");const h=s.trim().split(/\d+\./).filter(l=>l.trim()!==""),r=document.querySelector(".tasksList");r.innerHTML="",h.forEach(l=>{const p=document.createElement("li");p.textContent=l.trim(),r.appendChild(p)}),i.textContent=n,P()}}async function P(){S.style.transform="translateY(-200%)",g.classList.remove("hidden"),await new Promise(t=>setTimeout(t,200)),S.classList.add("hidden"),await new Promise(t=>setTimeout(t,2e3)),g.style.transform="translateY(-200%)",await new Promise(t=>setTimeout(t,400)),f.classList.remove("hidden"),f.style.transform="translateY(0)",g.classList.add("hidden")}function L(t){const e=document.querySelector(".errorMessage"),o=document.querySelector(".errorDiv");o.style.height="auto",e.textContent=t,e.style.transform="translateY(0)",e.style.opacity="1",setTimeout(()=>{e.style.transform="translateY(-100%)",e.style.opacity="0"},2e3),setTimeout(()=>{o.style.height="0",e.textContent=""},2400)}function y(t){const e=document.querySelector(t);return e.value.trim()===""?(e.classList.add("error","shake"),e.addEventListener("animationend",()=>{e.classList.remove("error","shake")}),!1):!0}async function O(){return(await(await fetch(q,{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify({prompt:c})})).json()).message.trim()}function B(){const t=document.querySelector(".radioBtn:checked");if(t){const e=`components/${t.value}.html`;A(e,T)}}document.querySelectorAll(".radioBtn").forEach(t=>{t.addEventListener("click",()=>{const e=`components/${t.value}.html`;A(e,T)})});B();function T(){const t=document.querySelector("button.generate-question");t&&t.addEventListener("click",async e=>{e.preventDefault();const o=y("#userName"),a=y("#focusArea"),n=y("#focusAreaDetail");if(!o||!a||!n){L("Please fill in the empty fields");return}const i=e.target.getAttribute("data-btn");if(i==="self-reflect"){const r=document.querySelector("#userName").value,l=document.querySelector("#focusArea").value,p=document.querySelector("#focusAreaDetail").value;c=[{role:"system",content:"You are an experienced life and mental coach. Start by asking your client the first question, which should encourage self-reflection. Follow the User instructions to complete the interaction. "},{role:"user",content:`Act as an experienced life and mental coach with a proven record of helping people attain greater fulfilment. Your role involves guiding clients in enhancing their relationships, careers, and everyday lives by clarifying their goals, identifying obstacles, and developing strategies to overcome these challenges. Here are some criteria that yoou must follow as a coach:Active Listening: A coach must actively listen to their clients, empathize with them, and understand their unique perspectives and experiences to provide tailored guidance. Clear Communication: A coach must be able to communicate clearly and effectively, both verbally and nonverbally, to help their clients understand the coaching process and the strategies being recommended. Goal-Setting: A coach must work with their clients to set specific, measurable, achievable, relevant, and time-bound (SMART) goals that align with their clients' values and aspirations. Action-Oriented Approach: A coach must help their clients develop actionable plans and strategies to achieve their goals and hold them accountable for taking concrete steps towards progress. Trust and Confidentiality: A coach must maintain a trusting and confidential relationship with their clients to ensure that clients feel safe and comfortable sharing their deepest concerns and challenges. Flexibility and Adaptability: A coach must be able to adapt their coaching approach and strategies to the unique needs and goals of each client, as well as adjust their approach if necessary as the coaching process progresses. Positive Reinforcement: A coach must provide positive reinforcement and encouragement to help their clients stay motivated and continue making progress towards their goals. .You will engage in a session with ${r}, focusing on the area of ${l}, specifically '${p}'. Begin by asking the first question, which should encourage self-reflection in ${l} but try not to overwhelm me by asking too deep question straight away. you will address me as ${r}. Your first response should be: Hello ${r}, [First Question]. Use a friendly tone and speak in the first person, as if you are talking to a friend.`}]}else if(i==="self-reflect-2"){const r=document.querySelector("#userName").value,l=document.querySelector("#vanting").value;c=[{role:"system",content:"You are an experienced life and mental coach. Start by asking your client the first question, which should encourage self-reflection. Follow the User instructions to complete the interaction. "},{role:"user",content:`Act as an experienced life and mental coach with a proven record of helping people attain greater fulfilment. Your role involves guiding clients in enhancing their relationships, careers, and everyday lives by clarifying their goals, identifying obstacles, and developing strategies to overcome these challenges. Here are some criteria that yoou must follow as a coach:Active Listening: A coach must actively listen to their clients, empathize with them, and understand their unique perspectives and experiences to provide tailored guidance. Clear Communication: A coach must be able to communicate clearly and effectively, both verbally and nonverbally, to help their clients understand the coaching process and the strategies being recommended. Goal-Setting: A coach must work with clients to set specific, measurable, achievable, relevant, and time-bound (SMART) goals that align with their client's values and aspirations. Action-Oriented Approach: A coach must help clients develop actionable plans and strategies to achieve their goals and hold them accountable for taking concrete steps towards progress. Trust and Confidentiality: A coach must maintain a trusting and confidential relationship with their clients to ensure they feel safe and comfortable sharing their deepest concerns and challenges. Flexibility and Adaptability: A coach must be able to adapt their coaching approach and strategies to the unique needs and goals of each client, as well as adjust their approach if necessary as the coaching process progresses. Positive Reinforcement: A coach must provide positive reinforcement and encouragement to help their clients stay motivated and continue making progress towards their goals. You will engage in a session with ${r}, he is currently experiencing some emotions, saying the following '${l}'. Begin by understanding and empathising, but try not to overwhelm me by asking too deep questions straight away. you will address me as ${r}. Your first response should be: Hello ${r}[response]. Use a friendly tone and speak in the first person, as if you are talking to a friend.`}]}t.disabled=!0,t.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';const h=await O();c.push({role:"assistant",content:h}),u=1,d.disabled=!0,b.classList.add("moveOut"),x.classList.add("moveIn"),setTimeout(()=>{v.querySelector("div[data-step='1']").classList.add("active"),b.classList.add("hidden")},500),k(h)})}d.addEventListener("click",async function(t){t.preventDefault();const e=w.value.trim();if(!e){L("Please enter your response");return}d.disabled=!0,d.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';let o;u===3?o=e+" Provide an Insight, and assign three specific tasks for next session. Set task that are manageable, trackable, and attainable. The goal is to keep the user accountable in the following sessions. You will follow up on those tasks in the next session. Can you please format the response as follows: <Insight> %%Tasks: 1.<Task 1> 2.<Task 2> 3.<Task 3>. The '%%' is important, don't avoid it. For example: Insight: You are a great person / Tasks: 1. Do this 2. Do that 3. Do the other thing.":o=" Provide a follow-up question that will help you to understand the client's perspective on their reflection. "+e,c=[...c,{role:"user",content:o}];try{const s=(await(await fetch(q,{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify({prompt:c})})).json()).message.trim(),i={role:"assistant",content:s};c.push(i),d.innerHTML="Answer",d.disabled=!0,w.value="",I(s)}catch(a){console.error(a)}});E.addEventListener("click",()=>{const t=document.querySelector(".DownloadReport");f.style.transform="translateY(200%)",f.classList.add("hidden"),t.classList.remove("hidden"),setTimeout(()=>{window.scrollTo(0,0),t.style.transform="translateY(0)"},500)});const N=Stripe("pk_live_UokfO3BfglTlhkt0XZ4HJtQe");document.getElementById("donation-form").addEventListener("submit",async t=>{t.preventDefault();const e=parseFloat(document.getElementById("donation-amount").value)*100,a=await(await fetch("/create-payment-intent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:e})})).text();console.log("Response from server:",a);const{client_secret:n}=JSON.parse(a),s=await N.confirmCardPayment(n,{payment_method:{card:cardElement}});s.error?console.error(s.error.message):console.log("Donation successful:",s.paymentIntent)});document.querySelector(".SubmitInfo").addEventListener("click",async t=>{t.preventDefault();const e=t.target,o=document.getElementById("greeting"),a=userName,n=document.getElementById("email").value,s="83635650801174350";if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n)){document.getElementById("email").classList.add("error","shake"),setTimeout(()=>{document.getElementById("email").classList.remove("error","shake")},1e3),e.disabled=!1,e.innerHTML="Submit Info";return}if(a&&n){e.disabled=!0,e.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';try{const r=await fetch("https://www.themirrorapp.io/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n,name:a,groupId:s})});r.ok?(o.textContent="Thanks for signing up! I'll be in touch soon.",console.log("Successfully added subscriber:",await r.json()),e.disabled=!1,e.classList.add("hidden")):(o.textContent="Something went wrong. Please try again.",console.error("Error adding subscriber:",await r.json()))}catch(r){console.error("Error adding subscriber:",r)}}});