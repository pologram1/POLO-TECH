import test from 'node:test';
import assert from 'node:assert/strict';
import {Casino} from '../game.js';
import {winNotice,emptyNotice} from '../notifications.js';

test('win celebrates profit, not the returned stake',()=>{
  const casino=new Casino();
  const slots=casino.play('slots',10,'low',()=>0);
  assert.equal(winNotice(slots).title,'Won $70!');
  assert.match(winNotice(slots).copy,/\$80 returned.*\$10 bet/);
  assert.equal(winNotice(casino.play('dice',10,'low',()=>0)).title,'Won $10!');
});
test('pushes and losses are not celebrated',()=>{
  const casino=new Casino();let i=0;
  assert.equal(winNotice(casino.play('slots',10,'low',()=>[0,0,1][i++])),null);
  assert.equal(winNotice(casino.play('dice',10,'high',()=>0)),null);
});
test('natural blackjack notifies only after settlement and uses 3:2 profit',()=>{
  const casino=new Casino(),first=[0,8,12,7];
  const deck=[...first,...Array.from({length:52},(_,i)=>i).filter(i=>!first.includes(i))];
  const hand=casino.startBlackjack(10,deck);
  assert.equal(hand.status,'settled');
  assert.equal(winNotice(hand).title,'Won $15!');
  assert.equal(winNotice({status:'playing',change:10}),null);
});
test('empty playing balance offers bank recovery; total depletion offers reset',()=>{
  const casino=new Casino();
  assert.equal(emptyNotice(casino),null);
  casino.play('dice',100,'high',()=>0);casino.play('dice',100,'high',()=>0);
  assert.equal(emptyNotice(casino).target,'recover-bank');
  casino.transfer('withdraw',800);
  for(let i=0;i<8;i++)casino.play('dice',100,'high',()=>0);
  assert.equal(emptyNotice(casino).target,'reset-empty');
  casino.reset();assert.equal(emptyNotice(casino),null);
});
test('a held blackjack stake is not an empty-balance notification',()=>{
  const casino=new Casino();casino.wallet=10;
  const hand=casino.startBlackjack(10,Array.from({length:52},(_,i)=>i));
  assert.equal(hand.status,'playing');assert.equal(casino.wallet,0);
  assert.equal(emptyNotice(casino),null);
});
