const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../life/story-engine');
const S = require('../life/saves');
const make = (id,seed) => Object.assign(E.createCharacter(id,seed), {narrativeVersion:1});
const available = (s) => E.getScene(s).choices.map((c,i)=>({c,i})).filter(({c})=>!c.require||c.require(s));

test('each new life reaches its own era and invitation, with at least three real major actions',()=>{
 const eras=new Set(), invitations=new Set();
 for(const c of E.characters)for(let route=0;route<6;route++){
   const s=make(c.id,27+route);
   while(s.phase!=='end'){
     const scene=E.getScene(s), options=available(s);
     if(!scene.daily){
       assert.ok(options.length>=3,c.id+' / '+scene.title+' / '+options.length);
       if(s.turns===1){eras.add(scene.title);assert.ok(scene.source);}
       if(s.turns===3)invitations.add(scene.title);
     }
     assert.doesNotMatch(scene.text,/undefined|\[object Object\]/);
     E.choose(s,options[route%options.length].i);
     assert.equal(s.phase,'result');assert.ok(E.validateCharacter(s),c.id);
     E.next(s);assert.ok(E.validateCharacter(s),c.id);
   }
   assert.equal(s.turns,12);
 }
 assert.equal(eras.size,16);assert.equal(invitations.size,16);
});

test('a hidden trait changes visible invitations; loading forks the opportunity and its callback',()=>{
 const s=make('ethan73',41);
 while(s.turns!==3||s.storyActive){E.choose(s,available(s)[0].i);E.next(s);}
 s.traits.social=60;
 const hasSocial=x=>available(x).some(({c})=>c.flag?.invitation==='social');
 assert.equal(hasSocial(s),false);s.traits.social=95;assert.equal(hasSocial(s),true);
 const values=new Map(), store={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};
 const vault=S.create(store,E.validateCharacter);vault.start(s,'剧场');vault.checkpoint('候场前','auto');
 const slot=vault.view().slots[0].id;
 for(const accept of [true,false]){
   const branch=vault.load(slot), options=available(branch);
   E.choose(branch,accept?options.find(({c})=>c.flag?.invitation==='social').i:options[0].i);
   E.next(branch);
   while(branch.turns<5||branch.storyActive){E.choose(branch,available(branch)[0].i);E.next(branch);}
   assert.equal(available(branch).some(({c})=>c.flag?.keptInvitation),accept);
   vault.save(branch);
 }
 assert.equal(vault.view().branches.length,3);
});
