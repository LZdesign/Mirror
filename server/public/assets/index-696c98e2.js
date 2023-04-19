(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function o(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=o(s);fetch(s.href,n)}})();const P=document.querySelector(".hero-banner"),x=document.querySelector(".hero-div"),d=document.querySelector(".answer"),h=document.querySelector(".question h3"),C=document.querySelector("#textArea"),q=document.querySelector(".progress__container"),I="https://www.themirrorapp.io/questions",B=document.querySelector(".Download"),k=document.querySelector(".interaction__container"),L=document.querySelector(".loading-response"),w=document.querySelector(".result"),D=document.getElementById("form-container");let u=h.dataset.set,c=[];async function A(t,e){const r=await(await fetch(t)).text();D.innerHTML=r,e&&e()}async function N(t){for(let e=0;e<t.length;e++)await new Promise(o=>setTimeout(o,40)),h.textContent+=t.charAt(e),t.length>400&&(h.style.fontSize="1.8em",h.style.lineHeight="1.3");d.disabled=!1}async function H(t){if(q.querySelector(`div[data-step='${u}']`).classList.add("complete"),h.textContent="",u++,u<=3)N(t),q.querySelector(`div[data-step='${u}']`).classList.add("active"),document.querySelector(".current-question").textContent=u;else{const o=t;c=[...c,{role:"assistant",content:o}];const r=document.querySelector(".insightText"),s=document.querySelector(".tasksList"),n=document.querySelector(".resourcesList");n.innerHTML="";const i=o.indexOf("%%Insight:"),l=o.indexOf("%%Tasks:"),a=o.indexOf("%%Resources:"),p=o.slice(i+10,l).trim(),y=o.slice(l+9,a).trim(),E=o.slice(a+12).trim();p&&(r.textContent=p),y&&(s.innerHTML="",y.trim().split(`
`).forEach(g=>{const b=document.createElement("li");b.textContent=g.trim(),s.appendChild(b)})),E&&(n.innerHTML="",E.trim().split(`
`).forEach(g=>{const S=/(.+?) - \[(.+?)\]/.exec(g);if(S){const m=document.createElement("li"),v=document.createElement("a");v.href=S[2],v.target="_blank",v.textContent=S[1].trim(),m.appendChild(v),n.appendChild(m)}else{const m=document.createElement("li");m.textContent=g.trim(),n.appendChild(m)}})),$()}}async function $(){k.style.transform="translateY(-200%)",L.classList.remove("hidden"),await new Promise(t=>setTimeout(t,200)),k.classList.add("hidden"),await new Promise(t=>setTimeout(t,2e3)),L.style.transform="translateY(-200%)",await new Promise(t=>setTimeout(t,400)),w.classList.remove("hidden"),w.style.transform="translateY(0)",L.classList.add("hidden")}function T(t){const e=document.querySelector(".errorMessage"),o=document.querySelector(".errorDiv");o.style.height="auto",e.textContent=t,e.style.transform="translateY(0)",e.style.opacity="1",setTimeout(()=>{e.style.transform="translateY(-100%)",e.style.opacity="0"},2e3),setTimeout(()=>{o.style.height="0",e.textContent=""},2400)}function f(t){const e=document.querySelector(t);return e.value.trim()===""?(e.classList.add("error","shake"),e.addEventListener("animationend",()=>{e.classList.remove("error","shake")}),!1):!0}async function F(){return(await(await fetch(I,{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify({prompt:c})})).json()).message.trim()}function M(){const t=document.querySelector(".radioBtn:checked");if(t){const e=`/assets/components/${t.value}.html`;A(e,O)}}document.querySelectorAll(".radioBtn").forEach(t=>{t.addEventListener("click",()=>{const e=`/assets/components/${t.value}.html`;A(e,O)})});M();function O(){const t=document.querySelector("button.generate-question");t&&t.addEventListener("click",async e=>{e.preventDefault();const r=e.target.getAttribute("data-btn");if(r==="self-reflect"){const n=document.querySelector("#userName").value,i=document.querySelector("#focusArea").value,l=document.querySelector("#focusAreaDetail").value,a=f("#userName"),p=f("#focusArea"),y=f("#focusAreaDetail");if(!a||!p||!y){T("Please fill in the empty fields");return}c=[{role:"system",content:"You are an experienced life and mental coach. Start by asking your client the first question, which should encourage self-reflection. Follow the User instructions to complete the interaction. "},{role:"user",content:`Act as an expert life and mental coach specialized in ${i},  guide clients in improving their daily lives by setting goals, identifying obstacles, and creating strategies. Use active listening, clear communication, goal-setting, an action-oriented approach, trust, confidentiality, adaptability, and positive reinforcement. Begin a session with ${n}, They come to you to discuss: '${l}'. Start with a non-overwhelming question for self-reflection. Address the client as ${n} and use a friendly tone. Your first response: Welcome ${n}, [First Question].`}]}else if(r==="vant"){const n=document.querySelector("#userName").value,i=document.querySelector("#vanting").value,l=f("#vanting");if(!f("#userName")||!l){T("Please fill in the empty fields");return}c=[{role:"system",content:"You are an experienced life and mental coach. Start by asking your client the first question, which should encourage self-reflection. Follow the User instructions to complete the interaction. "},{role:"user",content:`As a skilled life and mental coach, guide clients to improve their relationships, careers, and lives by setting clear goals, identifying obstacles, and creating strategies to overcome challenges. Follow these coaching principles: Active Listening, Clear Communication, Goal-Setting, Action-Oriented Approach, Trust and Confidentiality, Flexibility and Adaptability, Positive Reinforcement. Engage in a session with ${n} who shares their emotions in '${i}'. Begin with empathy without overwhelming them. Address them as ${n}. Start the conversation with: Hello ${n}[response]. Use a friendly tone and speak in the first person.`}]}t.disabled=!0,t.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';const s=await F();c.push({role:"assistant",content:s}),u=1,d.disabled=!0,x.classList.add("moveOut"),P.classList.add("moveIn"),setTimeout(()=>{q.querySelector("div[data-step='1']").classList.add("active"),x.classList.add("hidden")},500),N(s)})}d.addEventListener("click",async function(t){t.preventDefault();const e=C.value.trim();if(!e){T("Please enter your response");return}d.disabled=!0,d.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';let o;u===3?o=e+". Share an insight, assign three tasks for the next session, and suggest resources. Ensure tasks are manageable, trackable, and attainable. Format: %%Insight: <Insight> %%Tasks: 1.<Task 1> 2.<Task 2> 3.<Task 3> %%Resources: <resource 1> <resource 2> <resource 3>.  The '%%' is important, don't avoid it.":o=" Provide a follow-up question that will help you to understand the client's perspective on their reflection. "+e,c=[...c,{role:"user",content:o}];try{const n=(await(await fetch(I,{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify({prompt:c})})).json()).message.trim(),i={role:"assistant",content:n};c.push(i),d.innerHTML="Answer",d.disabled=!0,C.value="",H(n)}catch(r){console.error(r)}});B.addEventListener("click",()=>{const t=document.querySelector(".DownloadReport");w.style.transform="translateY(200%)",w.classList.add("hidden"),t.classList.remove("hidden"),setTimeout(()=>{window.scrollTo(0,0),t.style.transform="translateY(0)"},500)});const R=Stripe("pk_live_UokfO3BfglTlhkt0XZ4HJtQe");document.getElementById("donation-form").addEventListener("submit",async t=>{t.preventDefault();const e=parseFloat(document.getElementById("donation-amount").value)*100,r=await(await fetch("/create-payment-intent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:e})})).text();console.log("Response from server:",r);const{client_secret:s}=JSON.parse(r),n=await R.confirmCardPayment(s,{payment_method:{card:cardElement}});n.error?console.error(n.error.message):console.log("Donation successful:",n.paymentIntent)});document.querySelector(".SubmitInfo").addEventListener("click",async t=>{t.preventDefault();const e=t.target,o=document.getElementById("greeting"),r=userName,s=document.getElementById("email").value,n="83635650801174350";if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)){document.getElementById("email").classList.add("error","shake"),setTimeout(()=>{document.getElementById("email").classList.remove("error","shake")},1e3),e.disabled=!1,e.innerHTML="Submit Info";return}if(r&&s){e.disabled=!0,e.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';try{const a=await fetch("https://www.themirrorapp.io/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:s,name:r,groupId:n})});a.ok?(o.textContent="Thanks for signing up! I'll be in touch soon.",console.log("Successfully added subscriber:",await a.json()),e.disabled=!1,e.classList.add("hidden")):(o.textContent="Something went wrong. Please try again.",console.error("Error adding subscriber:",await a.json()))}catch(a){console.error("Error adding subscriber:",a)}}});
