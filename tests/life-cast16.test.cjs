const {test}=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('../life/story-engine.js'),B=require('../life/character-engine.js'),S=require('../life/saves.js'),H=require('../life/hidden-character.js'),R=require('../life/robin.js');
const ids=['zhixia01','robin05'],copy=x=>JSON.parse(JSON.stringify(x));
function storage(){const data=new Map();return{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),data};}
function advance(s,i=0){const sc=E.getScene(s);if(sc.choices[i]?.require&&!sc.choices[i].require(s))i=sc.choices.findIndex(c=>!c.require||c.require(s));E.choose(s,i);a.equal(s.phase,'result');a.ok(E.validateCharacter(s));E.next(s);a.ok(E.validateCharacter(s));}
function reach(s,n,route=0){while(s.turns<n||s.storyActive)advance(s,s.storyActive?0:s.turns===2?route:1);return s;}
test('16 total, 15 public, balanced category filters and persisted hidden discovery',()=>{
 a.equal(E.characters.length,16);a.equal(new Set(E.characters.map(c=>c.id)).size,16);
 a.deepEqual(['优势人生','逆境人生','普通与特殊人生'].map(category=>E.filterCharacters({category}).length),[8,6,2]);
 const m=storage();a.equal(H.available(E.characters,H.unlocked(m)).length,15);
 a.ok(!H.available(E.characters,false).some(c=>c.id===H.id));
 a.throws(()=>H.unlock(m,R.create(),R.valid));a.equal(H.unlocked(m),false);
 const completed=R.replay([2,1,0,3]);H.unlock(m,completed,R.valid);a.equal(H.unlocked(m),true);
 a.equal(H.available(E.characters,H.unlocked(m)).length,16);
 a.equal(H.available(E.characters,false,'robin05').length,16,'imported Robin can resume without a discovery key');
 a.equal(H.unlocked({getItem:()=>{throw Error('blocked');}}),false);
 a.throws(()=>H.unlock({setItem:()=>{throw Error('full');}},completed,R.valid));
 a.equal(E.filterCharacters({category:'普通与特殊人生',country:'中国',gender:'女',decade:'1980',trait:'声音创作'})[0].id,'zhixia01');
});
test('new lives finish 12 major and four daily decisions; three dedicated major scenes, real route differences',()=>{
 const allTitles=new Set(),midScenes=new Set();
 for(const id of ids)for(let route=0;route<4;route++)for(let strategy=0;strategy<4;strategy++){
  const s=E.createCharacter(id,66731+route);let days=0,majors=0;
  while(s.phase!=='end'){
   const sc=E.getScene(s);a.doesNotMatch(sc.text,/undefined|NaN/);
   a.ok(sc.choices.filter(c=>!c.require||c.require(s)).length>=3,id+': '+sc.title);
   if(sc.daily){days++;a.equal(sc.choices.length,3);}else{majors++;a.ok(sc.choices.length>=4&&sc.choices.length<=6);if([2,6,9].includes(s.turns))allTitles.add(sc.title);if(s.turns===6)midScenes.add(sc.title+'|'+sc.choices[0].label);}
   const before=copy(s),n=sc.daily?strategy%3:s.turns===2?route:strategy,selected=sc.choices[n].require&&!sc.choices[n].require(s)?sc.choices.findIndex(c=>!c.require||c.require(s)):n;
   const restored=JSON.parse(JSON.stringify(before));E.choose(s,selected);E.choose(restored,selected);a.deepEqual(s,restored);a.ok(E.validateCharacter(s));if(sc.daily)a.equal(s.ageMonths,before.ageMonths);
   E.next(s);a.ok(E.validateCharacter(s));
  }
  a.equal(days,4);a.equal(majors,12);a.equal(E.journal(s).length,16);
  a.ok(s.flags.personalRoute&&s.flags.personalLater&&s.flags.personalClosing);
 }
 a.equal(allTitles.size,12);a.equal(midScenes.size,8);
});
test('early choices and resources gate optional late work; denied actions do not change state',()=>{
 const robin=reach(E.createCharacter('robin05',883),6,2);a.equal(E.getScene(robin).choices.length,5);a.ok(robin.flags.robinSmall);
 a.ok(E.getScene(robin).choices[4].require(robin));
 const denied=copy(robin);delete denied.flags.robinSmall;const before=copy(denied);E.choose(denied,4);a.deepEqual(denied,before);
 advance(robin,4);a.ok(robin.flags.boundedWork);reach(robin,9);a.match(E.getScene(robin).text,/有限报酬和边界/);
 const zhixia=reach(E.createCharacter('zhixia01',883),6,2);a.ok(E.getScene(zhixia).choices[4].require(zhixia));
 const alone=reach(E.createCharacter('zhixia01',883),6,3);a.equal(E.getScene(alone).choices.length,4);a.notEqual(E.getScene(alone).choices[0].label,E.getScene(zhixia).choices[0].label);
});
test('new daily effects and seeded outcomes survive save/load, independent forks and import',()=>{
 for(const id of ids){
  const s=E.createCharacter(id,66731),m=storage(),v=S.create(m,E.validateCharacter);advance(s);v.start(s);v.checkpoint('first daily','manual');const slot=v.view().slots[0].id,original=copy(v.view().branches[0]);
  const restored=v.load(slot);advance(restored,0);v.save(restored);a.deepEqual(v.view().branches[0],original);
  const another=v.load(slot);advance(another,2);v.save(another);a.notDeepEqual(restored.flags,another.flags);a.equal(v.view().branches.length,3);
  const w=S.create(storage(),E.validateCharacter);w.import(v.export());a.deepEqual(w.current(),another);
  const trial=reach(E.createCharacter(id,66731),6,0),clone=copy(trial);E.choose(trial,0);E.choose(clone,0);a.deepEqual(trial,clone);a.equal(trial.probabilityLog.at(-1).node,6);a.equal(trial.probabilityLog.at(-1).distribution.reduce((sum,x)=>sum+x.bp,0),10000);
  a.ok(E.validateCharacter(trial));
 }
});
test('existing pre-story saves keep their flow; existing story characters remain valid',()=>{
 for(const c of E.characters.filter(c=>!ids.includes(c.id))){
  const old=B.createCharacter(c.id,771),expected=copy(old);
  for(let i=0;i<12;i++){a.deepEqual(copy(E.getScene(old)),copy(B.getScene(expected)));E.choose(old,1);B.choose(expected,1);a.deepEqual(old,expected);a.ok(E.validateCharacter(old));E.next(old);B.next(expected);}
  const current=E.createCharacter(c.id,771);while(current.phase!=='end')advance(current,1);
 }
});
function browser(search='',m=storage()){
 const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',style:{},open:false,listeners:{},addEventListener(k,f){this.listeners[k]=f;},appendChild(){},classList:{toggle(){}},close(){this.open=false;},showModal(){this.open=true;}});return nodes.get(id);};
 const document={getElementById:node,body:node('body'),addEventListener(){}};
 const window={localStorage:m,location:{search,assign(){}},addEventListener(){},scrollTo(){}};
 const ctx=vm.createContext({document,window,localStorage:m,URLSearchParams,crypto:{getRandomValues(a){a[0]=449;return a;}},setTimeout:()=>1,clearTimeout(){}});
 const html=fs.readFileSync(__dirname+'/../life/index.html','utf8');for(const x of html.matchAll(/<script src="([^"?]+)[^"]*"><\/script>/g))vm.runInContext(fs.readFileSync(__dirname+'/../life/'+x[1],'utf8'),ctx);
 const click=dataset=>node('app').listeners.click({target:{closest:()=>({dataset})}});
 return{ctx,node,click,storage:m};
}
test('browser script order, locked navigation, three random pools and Robin start/exit/continue',()=>{
 const b=browser('?character=robin05');a.match(b.node('app').innerHTML,/15 位已解锁/);a.doesNotMatch(b.node('app').innerHTML,/data-character="robin05"/);
 a.equal(vm.runInContext('availableCast().length',b.ctx),15);
 for(const action of ['random-all','random-category','random']){vm.runInContext("categoryFilter='普通与特殊人生';Math.random=()=>0.999999;",b.ctx);b.click({action});a.notEqual(vm.runInContext('selected',b.ctx),'robin05');b.click({action:'browse'});}
 H.unlock(b.storage,R.replay([0,1,2,3]),R.valid);
 const open=browser('?character=robin05',b.storage);a.match(open.node('app').innerHTML,/如果，Robin从这里重新选择/);
 open.click({action:'start-character'});a.equal(vm.runInContext('state.characterId',open.ctx),'robin05');a.match(open.node('app').innerHTML,/平行人生身份卡/);
 open.click({choice:'0'});a.equal(vm.runInContext('state.phase',open.ctx),'result');open.node('exitBtn').onclick();a.match(open.node('app').innerHTML,/16 位已解锁/);
 open.click({action:'begin'});a.equal(vm.runInContext('state.turns',open.ctx),1);
 const resumed=browser('',b.storage);a.equal(vm.runInContext('state.characterId',resumed.ctx),'robin05');a.equal(vm.runInContext('state.turns',resumed.ctx),1);
});
test('new portrait is optimized JPEG, hidden identity is explicitly not a real likeness',()=>{
 const c=E.characters.find(c=>c.id==='zhixia01'),buf=fs.readFileSync(__dirname+'/../life/assets/'+c.image);a.equal(buf.readUInt16BE(0),0xffd8);a.ok(buf.length<120000);
 a.equal(E.characters.find(c=>c.id==='robin05').image,null);
 const html=fs.readFileSync(__dirname+'/../life/robin.html','utf8');a.ok(html.indexOf('hidden-character.js')<html.indexOf('src="robin.js'));
});
test('completed existing Robin short saves unlock through UI; storage failure never redirects',()=>{
 for(const blocked of [false,true]){
  const m=storage(),complete=R.replay([0,1,2,3]);m.setItem('life_robin_rehearsal_v1',JSON.stringify({current:complete,slots:[{name:'已有路线',state:complete}]}));
  const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',listeners:{},addEventListener(k,f){this.listeners[k]=f;}});return nodes.get(id);};
  const context=vm.createContext({document:{getElementById:node},localStorage:m,location:{href:''}});
  for(const file of ['hidden-character.js','robin.js'])vm.runInContext(fs.readFileSync(__dirname+'/../life/'+file,'utf8'),context);
  a.match(node('robinApp').innerHTML,/data-unlock/);
  if(blocked)m.setItem=()=>{throw Error('quota');};
  node('robinApp').listeners.click({target:{closest:()=>({dataset:{},hasAttribute:n=>n==='data-unlock'})}});
  a.equal(context.location.href,blocked?'':'./?character=robin05');a.equal(H.unlocked(m),!blocked);
  a.equal(JSON.parse(m.getItem('life_robin_rehearsal_v1')).slots[0].name,'已有路线');
  if(blocked)a.match(node('robinApp').innerHTML,/保存失败/);
 }
});
