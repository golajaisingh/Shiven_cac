const chat = document.getElementById('chat');
const input = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');
const voiceReply = document.getElementById('voiceReply');
const language = document.getElementById('language');
const statusEl = document.getElementById('status');

const services = [
  ['बाल आधार','बाल आधार सेवा के लिए बच्चे का जन्म प्रमाण पत्र, माता या पिता का आधार और मोबाइल नंबर साथ लाएँ। केंद्र पर उपलब्धता पहले पूछ लें।'],
  ['baal aadhaar','For Baal Aadhaar, bring the child’s birth certificate, a parent’s Aadhaar card and mobile number.'],
  ['pan','PAN card application, correction and reprint assistance is available at the centre. Please bring Aadhaar, mobile number, photo and signature.'],
  ['पैन','पैन कार्ड आवेदन, सुधार और रीप्रिंट में सहायता उपलब्ध है। आधार, मोबाइल नंबर, फोटो और हस्ताक्षर साथ लाएँ।'],
  ['e-district','Delhi e-District services include income, caste, domicile and other certificate assistance. Required documents depend on the service.'],
  ['ई-डिस्ट्रिक्ट','दिल्ली ई-डिस्ट्रिक्ट में आय, जाति, निवास और अन्य प्रमाण-पत्र सेवाओं में सहायता उपलब्ध है।'],
  ['print','Printing, scanning, photocopy, online form filling and document upload services are available.'],
  ['प्रिंट','प्रिंटिंग, स्कैनिंग, फोटोकॉपी, ऑनलाइन फॉर्म और दस्तावेज़ अपलोड की सुविधा उपलब्ध है।'],
  ['vendor','Street Vendor Licence application assistance is available. Bring Aadhaar, mobile number, photo, address proof and vending details.'],
  ['वेंडर','स्ट्रीट वेंडर लाइसेंस आवेदन सहायता उपलब्ध है। आधार, मोबाइल, फोटो, पता और वेंडिंग विवरण साथ लाएँ।'],
  ['passport','Passport application and appointment assistance is available.'],
  ['पासपोर्ट','पासपोर्ट आवेदन और अपॉइंटमेंट में सहायता उपलब्ध है।'],
  ['voter','Voter ID new registration and correction assistance is available.'],
  ['वोटर','वोटर आईडी नया आवेदन और सुधार सहायता उपलब्ध है।']
];

function addBubble(text, who='bot'){
  const div=document.createElement('div');
  div.className=`bubble ${who}`;
  div.textContent=text;
  chat.appendChild(div);
  chat.scrollTop=chat.scrollHeight;
}

function isHindi(text){return /[\u0900-\u097F]/.test(text)}

function answer(text){
  const lower=text.toLowerCase();
  for(const [key,value] of services){if(lower.includes(key.toLowerCase())) return value;}
  if(/hello|hi|namaste|नमस्ते|नमस्कार/.test(lower)) return isHindi(text)?'नमस्ते! मैं सोनिया एआई रिसेप्शनिस्ट हूँ। कृपया बताइए, आपको किस CSC सेवा की जानकारी चाहिए?':'Hello! I am Sonia AI Receptionist. Which CSC service do you need help with?';
  if(/time|समय|खुला|open/.test(lower)) return isHindi(text)?'हमारा सहायता समय सुबह 9 बजे से रात 9 बजे तक है।':'Our assistance hours are 9:00 AM to 9:00 PM.';
  if(/address|location|पता|कहाँ/.test(lower)) return 'Deepika Computer & Printer Center, Shop No. 158-B, Dabri Extension East, near Shamshaan Ghat, Delhi 110045.';
  if(/phone|mobile|number|फोन|मोबाइल/.test(lower)) return 'Contact number: 7011105492.';
  return isHindi(text)?'इस प्रश्न का उत्तर अभी मेरी सेवा सूची में नहीं है। कृपया सेवा का नाम लिखें या इसे जय सिंह जी के लिए नोट करें।':'I do not have this answer in my offline service list yet. Please mention the service name or note it for Jai Singh.';
}

function speak(text){
  if(!voiceReply.checked || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang=isHindi(text)?'hi-IN':'en-IN';
  u.rate=0.95;
  speechSynthesis.speak(u);
}

function sendMessage(msg=input.value.trim()){
  if(!msg) return;
  addBubble(msg,'user'); input.value=''; statusEl.textContent='Thinking…';
  setTimeout(()=>{const reply=answer(msg);addBubble(reply,'bot');speak(reply);statusEl.textContent='Ready';},300);
}

sendBtn.onclick=()=>sendMessage();
input.addEventListener('keydown',e=>{if(e.key==='Enter')sendMessage()});
document.querySelectorAll('[data-msg]').forEach(b=>b.onclick=()=>sendMessage(b.dataset.msg));

const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
if(Recognition){
  const rec=new Recognition();
  rec.interimResults=false;
  rec.continuous=false;
  micBtn.onclick=()=>{
    rec.lang=language.value==='auto'?'hi-IN':language.value;
    micBtn.classList.add('listening'); statusEl.textContent='Listening…';
    try{rec.start()}catch(e){}
  };
  rec.onresult=e=>{input.value=e.results[0][0].transcript;sendMessage();};
  rec.onerror=e=>{addBubble('Microphone error: '+e.error+'. Please allow microphone permission in Chrome/Edge.','bot');};
  rec.onend=()=>{micBtn.classList.remove('listening');statusEl.textContent='Ready';};
}else{
  micBtn.onclick=()=>addBubble('Voice input is not supported in this browser. Please open Sonia in Google Chrome or Microsoft Edge.','bot');
}

addBubble('नमस्ते! मैं सोनिया एआई रिसेप्शनिस्ट हूँ। मैं हिंदी और English में CSC सेवाओं की जानकारी दे सकती हूँ। नीचे माइक्रोफोन दबाकर बोलें या अपना प्रश्न लिखें।');
