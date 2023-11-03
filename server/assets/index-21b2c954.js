(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function o(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=o(s);fetch(s.href,n)}})();const R=document.querySelector(".hero-banner"),I=document.querySelector(".hero-div"),l=document.querySelector(".answer"),g=document.querySelector(".question h3"),A=document.querySelector("#textArea"),C=document.querySelector(".progress__container"),P="https://www.themirrorapp.io/questions",$=document.querySelector(".Download"),N=document.querySelector(".interaction__container"),k=document.querySelector(".loading-response"),w=document.querySelector(".result"),D=document.getElementById("form-container");let d=g.dataset.set,c=[];async function B(t,e){const r=await(await fetch(t)).text();D.innerHTML=r,e&&e()}async function O(t){for(let e=0;e<t.length;e++)await new Promise(o=>setTimeout(o,40)),g.textContent+=t.charAt(e),t.length>400&&(g.style.fontSize="1.8em",g.style.lineHeight="1.3");l.disabled=!1}async function H(t){if(C.querySelector(`div[data-step='${d}']`).classList.add("complete"),g.textContent="",d++,d<=3)O(t),C.querySelector(`div[data-step='${d}']`).classList.add("active"),document.querySelector(".current-question").textContent=d;else{const o=t;c=[...c,{role:"assistant",content:o}];const r=document.querySelector(".insightText"),s=document.querySelector(".tasksList"),n=document.querySelector(".resourcesList");n.innerHTML="";const i=/%%Insight: (.+?)\n\n/s,u=/%%Tasks:([\s\S]*?)\n\n/s,a=/%%Resources:([\s\S]*?)\n\n/s,h=o.match(i),f=o.match(u),S=o.match(a);console.log("Insight:",h),console.log("Tasks Match:",f),console.log("Resources Match:",S);const L=h&&h[1],q=f&&f[1],T=S&&S[1];if(L&&(console.log("Insight:",L),r.textContent=L),q&&(console.log("Tasks:",q),s.innerHTML="",q.trim().split(`
`).forEach(E=>{const p=document.createElement("li");p.textContent=E.trim(),s.appendChild(p)})),T){console.log("Resources:",T),n.innerHTML="";const E=/(.+?) - \[(.+?)\]/g;T.trim().split(`
`).forEach(p=>{const v=E.exec(p);if(v){const m=document.createElement("li"),b=document.createElement("a");b.href=v[2],b.target="_blank",b.textContent=v[2],m.textContent=`${v[1]} - `,m.appendChild(b),n.appendChild(m)}else{const m=document.createElement("li");m.textContent=p.trim(),n.appendChild(m)}})}F()}}async function F(){N.style.transform="translateY(-200%)",k.classList.remove("hidden"),await new Promise(t=>setTimeout(t,200)),N.classList.add("hidden"),await new Promise(t=>setTimeout(t,2e3)),k.style.transform="translateY(-200%)",await new Promise(t=>setTimeout(t,400)),w.classList.remove("hidden"),w.style.transform="translateY(0)",k.classList.add("hidden")}function x(t){const e=document.querySelector(".errorMessage"),o=document.querySelector(".errorDiv");o.style.height="auto",e.textContent=t,e.style.transform="translateY(0)",e.style.opacity="1",setTimeout(()=>{e.style.transform="translateY(-100%)",e.style.opacity="0"},2e3),setTimeout(()=>{o.style.height="0",e.textContent=""},2400)}function y(t){const e=document.querySelector(t);return e.value.trim()===""?(e.classList.add("error","shake"),e.addEventListener("animationend",()=>{e.classList.remove("error","shake")}),!1):!0}async function V(){return(await(await fetch(P,{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify({prompt:c})})).json()).message.trim()}function Y(){const t=document.querySelector(".radioBtn:checked");if(t){const e=`/assets/components/${t.value}.html`;B(e,M)}}document.querySelectorAll(".radioBtn").forEach(t=>{t.addEventListener("click",()=>{const e=`/assets/components/${t.value}.html`;B(e,M)})});Y();function M(){const t=document.querySelector("button.generate-question");t&&t.addEventListener("click",async e=>{e.preventDefault();const r=e.target.getAttribute("data-btn");if(r==="self-reflect"){const n=document.querySelector("#userName").value,i=document.querySelector("#focusArea").value,u=document.querySelector("#focusAreaDetail").value,a=y("#userName"),h=y("#focusArea"),f=y("#focusAreaDetail");if(!a||!h||!f){x("Please fill in the empty fields");return}c=[{role:"system",content:"You are an experienced life and mental coach. Start by asking your client the first question, which should encourage self-reflection. Follow the User instructions to complete the interaction. "},{role:"user",content:`Act as an expert life and mental coach specialized in ${i},  guide clients in improving their daily lives by setting goals, identifying obstacles, and creating strategies. Use active listening, clear communication, goal-setting, an action-oriented approach, trust, confidentiality, adaptability, and positive reinforcement. Begin a session with ${n}, They come to you to discuss: '${u}'. Start with a non-overwhelming question for self-reflection. Address the client as ${n} and use a friendly tone. Your first response: Welcome ${n}, [First Question].`}]}else if(r==="vant"){const n=document.querySelector("#userName").value,i=document.querySelector("#vanting").value,u=y("#vanting");if(!y("#userName")||!u){x("Please fill in the empty fields");return}c=[{role:"system",content:"You are an experienced life and mental coach. Start by asking your client the first question, which should encourage self-reflection. Follow the User instructions to complete the interaction. "},{role:"user",content:`As a skilled life and mental coach, guide clients to improve their relationships, careers, and lives by setting clear goals, identifying obstacles, and creating strategies to overcome challenges. Follow these coaching principles: Active Listening, Clear Communication, Goal-Setting, Action-Oriented Approach, Trust and Confidentiality, Flexibility and Adaptability, Positive Reinforcement. Engage in a session with ${n} who shares their emotions in '${i}'. Begin with empathy without overwhelming them. Address them as ${n}. Start the conversation with: Hello ${n}[response]. Use a friendly tone and speak in the first person.`}]}t.disabled=!0,t.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';const s=await V();c.push({role:"assistant",content:s}),d=1,l.disabled=!0,I.classList.add("moveOut"),R.classList.add("moveIn"),setTimeout(()=>{C.querySelector("div[data-step='1']").classList.add("active"),I.classList.add("hidden")},500),O(s)})}l.addEventListener("click",async function(t){t.preventDefault();const e=A.value.trim();if(!e){x("Please enter your response");return}l.disabled=!0,l.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';let o;d===3?o=e+". Share an insight, assign three tasks for the next session, and suggest resources. Ensure tasks are manageable, trackable, and attainable. Format: %%Insight: <Insight>  %%Tasks: 1.<Task 1> 2.<Task 2> 3.<Task 3>  %%Resources: <resource 1> <resource 2> <resource 3>  Conclusion.  The '%%' separates the response into sections, so don't avoid it and only add it to the beginning.":o=" Provide a follow-up question that will help you to understand the client's perspective on their reflection. "+e,c=[...c,{role:"user",content:o}];try{const n=(await(await fetch(P,{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify({prompt:c})})).json()).message.trim(),i={role:"assistant",content:n};c.push(i),l.innerHTML="Answer",l.disabled=!0,A.value="",H(n)}catch(r){console.error(r)}});$.addEventListener("click",()=>{const t=document.querySelector(".DownloadReport");w.style.transform="translateY(200%)",w.classList.add("hidden"),t.classList.remove("hidden"),setTimeout(()=>{window.scrollTo(0,0),t.style.transform="translateY(0)"},500)});const _=Stripe("pk_live_UokfO3BfglTlhkt0XZ4HJtQe");document.getElementById("donation-form").addEventListener("submit",async t=>{t.preventDefault();const e=parseFloat(document.getElementById("donation-amount").value)*100,r=await(await fetch("/create-payment-intent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:e})})).text();console.log("Response from server:",r);const{client_secret:s}=JSON.parse(r),n=await _.confirmCardPayment(s,{payment_method:{card:cardElement}});n.error?console.error(n.error.message):console.log("Donation successful:",n.paymentIntent)});document.querySelector(".SubmitInfo").addEventListener("click",async t=>{t.preventDefault();const e=t.target,o=document.getElementById("greeting"),r=userName,s=document.getElementById("email").value,n="83635650801174350";if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)){document.getElementById("email").classList.add("error","shake"),setTimeout(()=>{document.getElementById("email").classList.remove("error","shake")},1e3),e.disabled=!1,e.innerHTML="Submit Info";return}if(r&&s){e.disabled=!0,e.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';try{const a=await fetch("https://www.themirrorapp.io/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:s,name:r,groupId:n})});a.ok?(o.textContent="Thanks for signing up! I'll be in touch soon.",console.log("Successfully added subscriber:",await a.json()),e.disabled=!1,e.classList.add("hidden")):(o.textContent="Something went wrong. Please try again.",console.error("Error adding subscriber:",await a.json()))}catch(a){console.error("Error adding subscriber:",a)}}});