setTimeout(()=>{
 document.getElementById('boot').style.display='none';
 speak("Welcome back. IRIS online.");
 addAI("Welcome back. IRIS online.");
},2000);

// STARFIELD
const canvas=document.getElementById('bg');
const ctx=canvas.getContext('2d');
canvas.width=innerWidth;
canvas.height=innerHeight;

let stars=Array.from({length:300},()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,z:Math.random()*canvas.width}));

function draw(){
 ctx.fillStyle='black';
 ctx.fillRect(0,0,canvas.width,canvas.height);
 for(let s of stars){
  s.z--;
  if(s.z<=0)s.z=canvas.width;
  let k=128/s.z;
  let x=s.x*k+canvas.width/2;
  let y=s.y*k+canvas.height/2;
  ctx.fillStyle='cyan';
  ctx.fillRect(x,y,2,2);
 }
 requestAnimationFrame(draw);
}
draw();

// CHAT
function addUser(t){chat.innerHTML+=`<div class='msg user'>You: ${t}</div>`}
function addAI(t){chat.innerHTML+=`<div class='msg ai'>IRIS: ${t}</div>`}

async function sendMsg(){
 let t=input.value.trim();
 if(!t)return;
 addUser(t);
 input.value='';

 addAI("Thinking...");

 const res=await fetch('/api/chat',{
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify({message:t})
 });

 const data=await res.json();
 const reply=data.choices?.[0]?.message?.content || 'No response';

 chat.lastChild.remove();
 addAI(reply);
 speak(reply);
}

function speak(t){speechSynthesis.speak(new SpeechSynthesisUtterance(t))}

function startVoice(){
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR){alert('Not supported');return}
 let r=new SR();
 r.onresult=e=>{
  input.value=e.results[0][0].transcript;
  sendMsg();
 };
 r.start();
}
