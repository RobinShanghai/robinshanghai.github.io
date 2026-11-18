const {test}=require('node:test'),a=require('node:assert/strict');
const E=require('../life/character-engine.js'),P=require('../life/probability.js'),S=require('../life/saves.js');
const copy=s=>JSON.parse(JSON.stringify(s));
function to(id,step){const s=E.createCharacter(id,918737);while(s.turns<step){E.choose(s,1);E.next(s);}return s;}
function odds(s,i=0){return P.distribution(s,E.profile(s),E.getScene(s).choices[i]);}
test('all pilot distributions sum to 10000, remain bounded, and complete 14 new lives',()=>{
 for(const c of E.characters)for(let route=0;route<4;route++){const s=E.createCharacter(c.id,12498);for(let step=0;step<12;step++){
 const choices=E.getScene(s).choices;for(const ch of choices.filter(x=>x.probability)){const d=P.distribution(s,c,ch);a.equal(d.outcomes.reduce((n,o)=>n+o.bp,0),10000);a.ok(d.outcomes.every(o=>o.bp>=0&&o.bp<=10000));a.equal(d.outcomes.length,d.kind==='venture'?5:3);}
 let i=route;if(choices[i].require&&!choices[i].require(s))i=choices.findIndex(x=>!x.require||x.require(s));E.choose(s,i);a.ok(E.validateCharacter(s),c.id+' '+step);E.next(s);
 }a.equal(s.phase,'end');}
});
test('adversity opening uses the actual crisis at the start, not just later calmer dates',()=>{const s=E.createCharacter('seo97',915);a.ok(odds(s).terms.history<0);a.equal(E.getScene(s).choices[0].probability.kind,'training');E.choose(s,0);a.ok(E.validateCharacter(s));});
test('same situation responds to ability, liquidity, qualification, industry and historical date',()=>{
 let s=to('seo97',3),d=odds(s),better=copy(s);better.skills+=15;better.savings+=better.living*12;better.flags.qualification=true;a.ok(odds(better).outcomes[0].bp>d.outcomes[0].bp);
 const ch=E.getScene(s).choices[0],c=E.profile(s);s.year=1998;s.month=1;const crisis=P.distribution(s,c,ch);s.year=1996;const before=P.distribution(s,c,ch);a.ok(crisis.terms.history<before.terms.history);a.equal(before.terms.history,0);
 s.year=1998;const trade=P.distribution(s,c,{...ch,probability:{...ch.probability,sector:'trade'}}),sport=P.distribution(s,c,{...ch,probability:{...ch.probability,sector:'sport'}});a.ok(trade.terms.history<sport.terms.history);
 s=to('yusuke91',3);a.ok(odds(s,4).outcomes[0].bp>odds(s,0).outcomes[0].bp);
});
test('history is deterministic, future news hidden, crossing a shock affects outcomes only after choice',()=>{
 const s=to('jieun97',3);s.year=1997;s.month=10;s.worldEvents=P.occurred(s);a.deepEqual(s.worldEvents,[]);a.equal(P.active(s).length,0);
 const sc=E.getScene(s);a.ok(!sc.text.includes('韩国正经历'));const d=P.distribution(s,E.profile(s),sc.choices[0]);a.ok(d.events.includes('korea1997'));
 const seed=s.rngState;P.occurred(s);a.equal(s.rngState,seed);E.choose(s,0);a.ok(s.worldEvents.includes('korea1997'));a.ok(s.lastResult.includes('这段时间的新消息'));
 const j={country:'日本',year:1991,month:6};a.equal(P.active(j).length,0);j.month=7;a.equal(P.active(j)[0].id,'japan1991');
});
test('all outcome branches cause distinct consequences and no implicit debt',()=>{
 const s=to('sam73',7);s.savings=s.living*2;const ch=E.getScene(s).choices[0],d=odds(s);let start=0;const states=[];
 for(const o of d.outcomes){const x=copy(s);x.savings-=ch.probability.investment;const r=P.resolve(x,E.profile(x),ch,(start+o.bp/2)/10000,d);a.equal(r.record.outcome,o.id);a.ok(x.savings>=0);states.push(x.savings);start+=o.bp;}a.equal(new Set(states).size,5);
 const t=to('lin01',5),tc=E.getScene(t).choices[0],td=odds(t);const partial=copy(t);P.resolve(partial,E.profile(t),tc,(td.outcomes[0].bp+1)/10000,td);a.ok(!partial.flags.qualification);a.ok(partial.flags.followup);
 const blocked=to('ethan73',7);blocked.savings=0;const original=copy(blocked);E.choose(blocked,0);a.deepEqual(blocked,original);
});
test('Save/Load repeats random outcome, preserves original branch, and exports complete history',()=>{
 const data=new Map(),v=S.create({getItem:k=>data.get(k)||null,setItem:(k,x)=>data.set(k,x)},E.validateCharacter);
 const initial=to('seo97',3);v.start(initial,'原路线');v.checkpoint('决策前');const slot=v.view().slots[0].id;const first=copy(initial);E.choose(first,0);v.save(first);const branch=copy(v.view().branches[0]);
 const restored=v.load(slot);E.choose(restored,0);a.deepEqual(restored,first);v.save(restored);a.deepEqual(v.view().branches[0],branch);
 const other=v.load(slot);E.choose(other,1);v.save(other);a.notDeepEqual(other.flags,first.flags);a.deepEqual(v.view().branches[0],branch);
 const w=S.create({getItem:()=>null,setItem:()=>{}},E.validateCharacter);w.import(v.export());a.deepEqual(w.current(),other);
 const bad=copy(first);bad.worldEvents.push('future');a.equal(E.validateCharacter(bad),false);const bad2=copy(first);bad2.probabilityLog[0].distribution[0].bp++;a.equal(E.validateCharacter(bad2),false);
});
test('old V2 states use exact old formula, binary effects, and no new fields',()=>{
 const s=to('seo97',3);delete s.probabilityVersion;delete s.worldEvents;delete s.probabilityLog;
 const c=E.getScene(s).choices[0];a.equal(c.probability,undefined);let seed=s.rngState;seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;
 const p=Math.max(.15,Math.min(.95,c.chance+(s.skills+c.effect.skills-45)/250+(s.network-40)/400+E.profile(s).climate)),win=(seed>>>0)/4294967296<p;
 const before=s.savings;E.choose(s,0);a.equal(s.rngState,seed>>>0);a.equal(s.lastResult.includes('合作取得进展'),win);a.equal(s.savings,before+(win?s.living*4:0)+Math.round((s.salary*.82/12+s.support-s.living)*c.months));a.ok(E.validateCharacter(s));a.equal(s.worldEvents,undefined);
});
test('browser script order loads probability engine without CommonJS',()=>{
 const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),dir=path.join(__dirname,'../life');const html=fs.readFileSync(path.join(dir,'index.html'),'utf8'),ctx=vm.createContext({});
 for(const m of html.matchAll(/<script src="([^"?]+)/g)){if(m[1]==='app.js')break;vm.runInContext(fs.readFileSync(path.join(dir,m[1]),'utf8'),ctx);}
 a.ok(ctx.LifeProbability);const s=ctx.LifeEngine.createCharacter('seo97',789);ctx.LifeEngine.choose(s,0);a.ok(ctx.LifeEngine.validateCharacter(s));a.equal(s.probabilityLog.length,1);
});
