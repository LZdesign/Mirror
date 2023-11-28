(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function r(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(n){if(n.ep)return;n.ep=!0;const s=r(n);fetch(n.href,s)}})();const y=document.querySelector(".hero-banner"),h=document.querySelector(".hero-div"),i=document.querySelector(".answer"),f=document.querySelector(".conversation-container"),g=document.querySelector("#textArea"),v="https://www.themirrorapp.io",S=document.querySelector(".Download"),w=document.querySelector(".interaction");document.querySelector(".loading-response");const m=document.querySelector(".result");let b="",c=[];function T(t){return t.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")}function p(t,e){e.split(`

`).forEach(o=>{const n=document.createElement("div");n.classList.add("message",t);const s=o.split(`
`);s.forEach((a,d)=>{if(a){const l=document.createElement("p");l.innerHTML=T(a),n.appendChild(l)}d<s.length-1&&n.appendChild(document.createElement("br"))}),f.appendChild(n)}),f.scrollTop=f.scrollHeight}async function I(t){p("assistant",t),i.disabled=!1}async function q(t){t.toLowerCase().includes("end session?")?(p("assistant",t.replace(/end session\?/i,"")),i.classList.add("end-session-btn"),i.removeEventListener("click",E),i.addEventListener("click",O)):p("assistant",t)}async function P(){w.style.transform="translateY(-200%)",await new Promise(t=>setTimeout(t,200)),w.classList.add("hidden"),m.classList.remove("hidden"),m.style.transform="translateY(0)"}function u(t){const e=document.querySelector(".errorMessage"),r=document.querySelector(".errorDiv");r.style.height="auto",e.textContent=t,e.style.transform="translateY(0)",e.style.opacity="1",setTimeout(()=>{e.style.transform="translateY(-100%)",e.style.opacity="0"},2e3),setTimeout(()=>{r.style.height="0",e.textContent=""},2400)}function C(t){const e=document.querySelector(t);return(e.value?e.value.trim():e.textContent.trim())===""?(e.classList.add("error","shake"),e.addEventListener("animationend",()=>{e.classList.remove("error","shake")}),!1):!0}async function k(){let t=3,e,r=v+"/threadId";for(;t>0;)try{if(e=await fetch(r),e.ok){const{threadId:o}=await e.json();return o}else throw new Error(`HTTP error! status: ${e.status}`)}catch(o){if(console.log(o),t--,t===0)throw new Error("Service is currently unavailable. Please try again later.");console.log(`Retrying... (${t} retries left)`),await new Promise(n=>setTimeout(n,2e3))}}async function L(t=""){let e=3,r,o=c[c.length-1],n=`${v}/questions/${t}`;for(;e>0;)try{if(r=await fetch(n,{method:"POST",headers:{"Content-type":"application/json"},body:JSON.stringify({prompt:o})}),r.ok){const s=await r.json(),{message:a}=s;return a.value.trim()}else throw new Error(`HTTP error! status: ${r.status}`)}catch(s){if(console.log(s),e--,e===0)throw new Error("Service is currently unavailable. Please try again later.");console.log(`Retrying... (${e} retries left)`),await new Promise(a=>setTimeout(a,2e3))}}document.querySelectorAll(".topic-pills .pill").forEach(t=>{t.addEventListener("click",e=>{e.preventDefault(),b=e.target.textContent.trim(),document.querySelectorAll(".topic-pills .pill").forEach(r=>r.classList.remove("selected")),e.target.classList.add("selected")})});async function O(t){t.preventDefault(),P()}function x(){const t=document.querySelector("button.generate-question");t&&t.addEventListener("click",async e=>{if(e.preventDefault(),e.target.getAttribute("data-btn")==="self-reflect"){const a=document.querySelector("#userName").value,d=b;if(!C("#userName")){u("Please fill in the empty fields");return}c=[{role:"user",content:`Begin a session with '${a}', '${a}' answered to why are you seeking out coaching: '${d}'`}]}t.disabled=!0,t.classList.add("waiting"),t.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Starting...';const n=await k();window.threadId=n||"";const s=await L(n);c.push({role:"assistant",content:s}),i.disabled=!0,h.classList.add("moveOut"),y.classList.remove("hidden"),setTimeout(()=>{y.classList.add("moveIn")},100),setTimeout(()=>{h.classList.add("hidden")},500),I(s)})}x();async function E(t){t.preventDefault();const e=g.textContent.trim();if(!e){u("Please enter your response");return}if(!window.threadId){u("threadId is not defined");return}p("user",e),i.disabled=!0,i.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading Response...',i.classList.add("waiting"),c.push({role:"user",content:e});try{const r=await L(window.threadId);c.push({role:"assistant",content:r}),q(r)}catch(r){console.error(r),u("An error occurred while sending your message. Please try again."),c.pop()}finally{i.classList.contains("end-session-btn")?i.innerHTML="End Session":(i.classList.remove("waiting"),i.innerHTML="Answer Honestly"),g.textContent="",i.disabled=!1}}i.addEventListener("click",E);S.addEventListener("click",()=>{const t=document.querySelector(".DownloadReport");m.style.transform="translateY(200%)",m.classList.add("hidden"),t.classList.remove("hidden"),setTimeout(()=>{window.scrollTo(0,0),t.style.transform="translateY(0)"},500)});const B=Stripe("pk_live_UokfO3BfglTlhkt0XZ4HJtQe");document.getElementById("donation-form").addEventListener("submit",async t=>{t.preventDefault();const e=parseFloat(document.getElementById("donation-amount").value)*100,o=await(await fetch("/create-payment-intent",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:e})})).text(),{client_secret:n}=JSON.parse(o),s=await B.confirmCardPayment(n,{payment_method:{card:cardElement}});s.error?console.error(s.error.message):console.log("Donation successful:",s.paymentIntent)});document.querySelector(".SubmitInfo").addEventListener("click",async t=>{t.preventDefault();const e=t.target,r=document.getElementById("greeting"),o=userName,n=document.getElementById("email").value,s="83635650801174350";if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n)){document.getElementById("email").classList.add("error","shake"),setTimeout(()=>{document.getElementById("email").classList.remove("error","shake")},1e3),e.disabled=!1,e.innerHTML="Submit Info";return}if(o&&n){e.disabled=!0,e.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';try{const l=await fetch("https://www.themirrorapp.io/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:n,name:o,groupId:s})});l.ok?(r.textContent="Thanks for signing up! I'll be in touch soon.",console.log("Successfully added subscriber:",await l.json()),e.disabled=!1,e.classList.add("hidden")):(r.textContent="Something went wrong. Please try again.",console.error("Error adding subscriber:",await l.json()))}catch(l){console.error("Error adding subscriber:",l)}}});