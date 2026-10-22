import {records} from './knowledge.js';
export function normalize(s){return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/miniamazon/g,'mini amazon').replace(/[^a-z0-9+]/g,' ').replace(/\s+/g,' ').trim();}
const stop=new Set('a an the i me my you your it its is are was were do does did to of for in on and or can could would should please tell about what how when where with this that them they'.split(' '));
const tokens=s=>normalize(s).split(' ').filter(t=>t&&!stop.has(t));
export function topicOf(q){const s=normalize(q);if(/\b(fras|facial|ricardo|raspberry|attendance)\b/.test(s))return 'fras';if(/\b(fragrance|perfume)\b/.test(s))return 'fragrance';if(/\b(amazon|mini|ecommerce|checkout|product|admin)\b/.test(s))return 'mini';if(/\b(casino|blackjack|slots|dice|credits)\b/.test(s))return 'casino';if(/\b(assistant|chatbot)\b/.test(s))return 'assistant';return null;}
export function search(q,context='portfolio'){
 const s=normalize(q),ts=tokens(q),explicit=topicOf(q),topic=explicit||context;
 if(/^(hi|hello|hey|hola|help)$/.test(s))return {record:records[0],score:10};
 // Personal account data and unrelated tasks must never be presented as project facts.
 if(/\b(weather|recipe|president|password|secret|api key)\b/.test(s))return null;
 if(/\b(contact|email|linkedin|hire)\b/.test(s))return {record:records.find(r=>r.id==='contact'),score:10};
 if(/\b(resume|cv|graduation|fastapi|skills|education)\b/.test(s))return {record:records.find(r=>r.id==='resume'),score:10};
 if(/\b(all projects|tour|whole site|explore site|explore the site|navigate)\b/.test(s))return {record:records[0],score:10};
 if(/\b(who made|creator|creators|authors|co creator)\b/.test(s)&&topic==='fras')return {record:records.find(r=>r.id==='fras-creators'),score:10};
 if(/\b(blackjack|21)\b/.test(s)&&topic==='casino')return {record:records.find(r=>r.id==='casino-blackjack'),score:10};
 if(/\b(price|prices|pricing|value|offers)\b/.test(s)&&topic==='fragrance')return {record:records.find(r=>r.id==='fragrance-price'),score:10};
 let ranked=records.map(record=>{const words=tokens(record.questions);let score=0,hits=0;for(const t of ts){if(words.includes(t)){score+=1.5;hits++;}else if(t.length>3&&words.some(w=>w.startsWith(t)||t.startsWith(w))) {score+=.7;hits++;}}
 if(record.topic===topic&&hits)score+=explicit?2.2:1.2;
 if(explicit&&record.topic!==explicit)score-=3;
 return {record,score,hits};}).sort((a,b)=>b.score-a.score);
 return ranked[0]?.score>=2.5&&ranked[0].hits>=1?ranked[0]:null;
}
export function semanticText(r){return r.topic+' '+r.questions+' '+r.answer;}
export function semanticMatch(scores,context){const sorted=scores.map((score,i)=>({record:records[i],score})).sort((a,b)=>b.score-a.score);return sorted[0]?.score>=.43?sorted[0]:null;}
