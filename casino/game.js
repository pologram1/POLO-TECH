export const SYMBOLS=['diamond','club','seven','spade','heart'];
export function randomInt(max){const range=4294967296,limit=range-range%max;let value;do{value=crypto.getRandomValues(new Uint32Array(1))[0];}while(value>=limit);return value%max;}
export function slotReturn(reels){if(reels.length!==3||reels.some(v=>!Number.isInteger(v)||v<0||v>=5))throw Error('Invalid reels.');return new Set(reels).size===1?8:new Set(reels).size===2?1:0;}
const amount=value=>{const n=Number(value);if(!Number.isSafeInteger(n)||n<1||n>1000000)throw Error('Enter a whole number from 1 to 1,000,000.');return n;};
export class Casino {
 constructor(saved){this.wallet=200;this.bank=800;this.rounds=0;this.net=0;this.history=[];this.name='Guest player';if(saved?.version===1&&Number.isSafeInteger(saved.wallet)&&saved.wallet>=0&&Number.isSafeInteger(saved.bank)&&saved.bank>=0&&Number.isSafeInteger(saved.rounds)&&saved.rounds>=0&&Number.isSafeInteger(saved.net)&&saved.wallet+saved.bank===1000+saved.net&&Array.isArray(saved.history)){Object.assign(this,{wallet:saved.wallet,bank:saved.bank,rounds:saved.rounds,net:saved.net,name:String(saved.name||'Guest player').slice(0,40),history:saved.history.slice(0,40)});}}
 record(action,change,detail){this.history.unshift({action,change,detail,wallet:this.wallet,bank:this.bank,date:new Date().toISOString()});this.history=this.history.slice(0,40);}
 transfer(direction,value){const n=amount(value);if(!['deposit','withdraw'].includes(direction))throw Error('Choose a transfer direction.');const from=direction==='deposit'?'wallet':'bank',to=from==='wallet'?'bank':'wallet';if(this[from]<n)throw Error('There are not enough credits in your '+from+'.');if(!Number.isSafeInteger(this[to]+n))throw Error('Balance limit reached.');this[from]-=n;this[to]+=n;this.record(direction==='deposit'?'Bank deposit':'Bank withdrawal',0,n+' credits · '+from+' → '+to);}
 play(game,value,choice='low',draw=randomInt){const bet=amount(value);if(bet>100)throw Error('The maximum bet is 100 credits.');if(bet>this.wallet)throw Error('Not enough playing credits. Withdraw credits from your bank.');let outcome,multiplier,detail;
  if(game==='slots'){outcome=[draw(5),draw(5),draw(5)];multiplier=slotReturn(outcome);detail=outcome.map(v=>SYMBOLS[v]).join(' / ');}
  else if(game==='dice'){if(!['low','high'].includes(choice))throw Error('Choose Low or High.');outcome=draw(6)+1;if(!Number.isInteger(outcome)||outcome<1||outcome>6)throw Error('Invalid roll.');multiplier=(choice==='low'?outcome<=3:outcome>=4)?2:0;detail='Rolled '+outcome+' · chose '+choice;}
  else throw Error('Choose a game.');
  const returned=bet*multiplier,change=returned-bet;if(!Number.isSafeInteger(this.wallet+change))throw Error('Balance limit reached.');this.wallet+=change;this.net+=change;this.rounds++;this.record(game==='slots'?'Slots':'High / Low',change,detail+' · bet '+bet+' · returned '+returned);return {outcome,multiplier,bet,returned,change};
 }
 serialize(){return {version:1,wallet:this.wallet,bank:this.bank,rounds:this.rounds,net:this.net,name:this.name,history:this.history};}
}
