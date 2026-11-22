/* Optional V2.3 story layer. Old saves have no storyVersion and retain their exact flow. */
(function(root){
const base=typeof module!=='undefined'?require('./character-engine.js'):root.LifeEngine;
const D=typeof module!=='undefined'?require('./story-events.js'):root.LifeStoryEvents;
const clone=x=>JSON.parse(JSON.stringify(x)),cap=x=>Math.max(0,Math.min(100,x));
const scheduleOf=s=>s.storyRevision===3?[1,1,4,6,6]:[1,1,6,6],enabled=s=>s?.storyVersion===1;
function createCharacter(id,seed){const s=base.createCharacter(id,seed);if(D.ids.includes(id))Object.assign(s,{storyVersion:1,storyRevision:D.cultureIds.includes(id)?3:2,storyCursor:0,storyActive:null,dailyHistory:[],storyPeople:[clone(D.people[id])]});if(['ethan73','camille08','jieun97','lin01'].includes(id))s.flags.relationshipVersion='1';if(['ethan73','jieun97','lin01'].includes(id))s.flags.dialogueVersion='1';return s;}
function openDay(s){if(enabled(s)&&s.phase==='scene'&&scheduleOf(s)[s.storyCursor]===s.turns)s.storyActive=s.characterId+'_daily_'+s.storyCursor;}
function choose(s,i){if(!enabled(s)||!s.storyActive)return base.choose(s,i);if(s.phase!=='scene')return s;const sc=D.day(s),c=sc.choices[i];if(!c||c.require&&!c.require(s))return s;
 for(const[k,v]of Object.entries(c.effect||{}))s[k]=k==='savings'?Math.round(s[k]+v):cap(s[k]+v);
 Object.assign(s.flags,c.flag||{});if(c.bond!==undefined)s.relations[c.bond].closeness=cap(s.relations[c.bond].closeness+5);if(c.person!==undefined)s.storyPeople[c.person].closeness=cap(s.storyPeople[c.person].closeness+5);
 s.lastResult=c.result;s.dailyHistory.unshift({id:sc.id,date:s.year+'年'+s.month+'月',year:s.year,month:s.month,age:base.ageOf(s),title:sc.title,decision:c.label,result:c.result,savings:s.savings,role:s.role,beforeTurn:s.turns});s.phase='result';return s;}
function next(s){if(enabled(s)&&s.storyActive&&s.phase==='result'){s.storyActive=null;s.storyCursor++;s.phase='scene';s.currentSceneId='character_'+s.turns;}else base.next(s);openDay(s);return s;}
function validate(s){if(s?.storyVersion===undefined)return !['storyCursor','storyActive','dailyHistory','storyPeople'].some(k=>s?.[k]!==undefined)&&base.validateCharacter(s);
 if(s.storyRevision!==undefined&&![2,3].includes(s.storyRevision))return false;
 if(s.storyRevision===3&&!D.cultureIds.includes(s.characterId))return false;
 const schedule=scheduleOf(s),count=schedule.length;
 if(!enabled(s)||!D.ids.includes(s.characterId)||!Number.isInteger(s.storyCursor)||s.storyCursor<0||s.storyCursor>count||!Array.isArray(s.dailyHistory)||!Array.isArray(s.storyPeople)||s.storyPeople.length!==1)return false;
 const p=s.storyPeople[0],expected=D.people[s.characterId];if(p.name!==expected.name||p.role!==expected.role||!Number.isFinite(p.closeness)||p.closeness<0||p.closeness>100)return false;
 const active=s.storyActive!==null;if(active&&(s.storyActive!==s.characterId+'_daily_'+s.storyCursor||scheduleOf(s)[s.storyCursor]!==s.turns||!['scene','result'].includes(s.phase)))return false;
 if(s.dailyHistory.length!==s.storyCursor+(active&&s.phase==='result'?1:0))return false;
 if(!s.dailyHistory.every((h,i)=>{const cursor=s.dailyHistory.length-1-i;return h.id===s.characterId+'_daily_'+cursor&&h.beforeTurn===schedule[cursor]&&['date','title','decision','result','role'].every(k=>typeof h[k]==='string')&&Number.isFinite(h.age)&&Number.isFinite(h.savings)&&Number.isInteger(h.year)&&Number.isInteger(h.month)&&h.year*100+h.month<=s.year*100+s.month;}))return false;
 if(s.storyCursor>0&&s.turns<schedule[s.storyCursor-1])return false;if(s.storyCursor<count&&s.turns>scheduleOf(s)[s.storyCursor])return false;
 const check=active?{...s,phase:'scene',currentSceneId:'character_'+s.turns}:s;return base.validateCharacter(check);
}
function journal(s){if(!enabled(s))return s.history;const rows=[];for(let turn=s.history.length;turn>=0;turn--){rows.push(...s.dailyHistory.filter(h=>h.beforeTurn===turn));const h=s.history[s.history.length-turn];if(h)rows.push(h);}return rows;}
const api={...base,createCharacter,choose,next,validateCharacter:validate,getScene:s=>enabled(s)&&s.storyActive?D.day(s):base.getScene(s),currentRecord:s=>enabled(s)&&s.storyActive?s.dailyHistory[0]:s.history[0],journal};
root.LifeEngine=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
