/* V2.2 pilot: historical dates are facts; ALL weights and personal odds are game estimates.
   Ruleset 1 is immutable for saved runs. See PROBABILITY_AUDIT.md. */
(function(root){
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const periods=[
 {id:'oil1973',start:197310,end:197412,countries:['美国','英国'],shift:-.08,sectors:{creative:.7,technical:.6,service:.8,sport:.4,trade:1},news:'石油供应冲击已经推高能源成本，交通和经营预算需要重新核对。',source:'https://www.federalreservehistory.org/essays/oil-shock-of-1973-74'},
 {id:'japan1991',start:199107,end:199512,countries:['日本'],shift:-.10,sectors:{creative:.6,technical:.7,service:.5,sport:.4,trade:1},news:'日本银行已开始降息，资产价格调整使融资和订单判断更需谨慎。',source:'https://www2.boj.or.jp/archive/en/announcements/press/koen_2010/ko1009c.htm'},
 {id:'korea1997',start:199712,end:199812,countries:['韩国'],shift:-.18,sectors:{creative:.7,technical:.8,service:.6,sport:.4,trade:1},news:'韩国正经历资本外流和融资紧张，客户付款与岗位预算需要逐项确认。',source:'https://www.imf.org/en/news/articles/2015/09/28/04/53/pn99115'},
 {id:'chinaWto',start:200112,end:200612,countries:['中国'],shift:.06,sectors:{creative:.4,technical:.5,service:.1,sport:0,trade:1},news:'中国已加入世界贸易组织；接触外贸客户的渠道在变化，具体订单仍需争取。',source:'https://blogs.worldbank.org/en/eastasiapacific/reflections-on-forty-years-of-china-reforms'},
 {id:'gfc2008',start:200809,end:200906,countries:['美国','英国','法国','德国','日本','韩国','中国','巴西'],shift:-.13,sectors:{creative:.8,technical:.6,service:.4,sport:.5,trade:1},news:'国际金融市场压力已经加剧，合作方的融资、赞助和订单预算更不稳定。',source:'https://www.rba.gov.au/education/resources/explainers/the-global-financial-crisis.html'}
];
const date=s=>s.year*100+s.month;
const at=(s,offset)=>{const m=s.year*12+s.month-1+offset;return Math.floor(m/12)*100+m%12+1;};
const occurred=s=>periods.filter(e=>e.countries.includes(s.country)&&e.start<=date(s)).map(e=>e.id);
const active=(s,d=date(s))=>periods.filter(e=>e.countries.includes(s.country)&&e.start<=d&&d<=e.end);
function sector(s,c){const specific={sam73:'technical',ruth73:'service',aki91:'technical',seo97:'trade',ana94:'sport',lin01:'technical'};if(specific[c.id])return specific[c.id];if(/物流|集团|工厂|家族企业|产品系列/.test(s.role))return'trade';if(/维修|设备|电路|技术/.test(s.role))return'technical';if(c.focus==='sport')return'sport';if(c.focus==='art')return'creative';return'technical';}
function attach(s,c,step,choices){if(s.probabilityVersion!==1)return choices;
 return choices.map((choice,i)=>{if(!choice.chance||![0,3,5,6,7].includes(step))return choice;
 const kind=step===0||step===5?'training':step===7||(step===6&&i===2)?'venture':'career';
 const investment=kind==='venture'?Math.max(0,-(choice.effect?.savings||0)):0;
 const strategy=step===3&&i===4 ? 'special' : step===7&&i===1 ? 'contract' : kind==='venture' ? 'pilot' : step===3&&i===1 ? 'mentor' : 'open';
 const next={...choice,probability:{kind,sector:sector(s,c),strategy,investment}};
 // Existing small-investment option had no cash gate. New runs cannot borrow implicitly.
 if(investment){const previous=choice.require;next.require=x=>x.savings>=investment&&(!previous||previous(x));next.requireText='可动用现金足够支付本次预算；不自动借款';}
 return next;});
}
function distribution(s,c,choice){const cfg=choice.probability;if(!cfg)throw Error('Not a pilot choice');
 const {kind,sector:industry,strategy,investment}=cfg,t=s.traits;
 const buffer=clamp((s.savings-investment+Math.max(0,s.support)*3)/Math.max(1,s.living),-6,12);
 const ability=kind==='training'?t.intellect:kind==='venture'?(t.intellect+t.social)/2:(t[c.focus]+t.intellect)/2;
 const qualification=s.flags.qualification ? .06 : (s.flags.trained||s.flags.mentored ? .025 : 0);
 const specialty={invention:'intellect',sport:'sport',original:'art',screen:'looks'}[choice.flag?.entry];
 const base={career:.43,training:.42,venture:.38}[kind];
 const terms={base,skill:(s.skills-45)/300,ability:(ability-65)/400,network:(s.network-40)/600,education:qualification,health:(s.health-80)/800,stress:-Math.max(0,s.stress-40)/800,resources:buffer/240,strategy:strategy==='mentor' ? .05 : strategy==='contract' ? .07 : strategy==='special'&&specialty ? .08+(t[specialty]-95)/250 : 0};
 // Integrate the actual historical environment through the action interval.
 // Only present-date news is shown before choice; later shocks appear after time passes.
 let history=0;const events=new Set();
 for(let m=0;m<choice.months;m++)for(const e of active(s,at(s,m))){events.add(e.id);history+=e.shift*e.sectors[industry]*(kind==='training'?.2:kind==='career'?.7:1);}
 terms.history=history/choice.months;
 const q=clamp(Object.values(terms).reduce((a,b)=>a+b,0),.12,.85);
 const partial=clamp(.24-Math.abs(q-.5)*.12,.18,.24);
 let raw=kind==='venture'?[['breakthrough',q*.2],['success',q*.8],['partial',partial],['failure',(1-q-partial)*.7],['loss',(1-q-partial)*.3]]:[['success',q],['partial',partial],['failure',1-q-partial]];
 // q + partial can exceed 1 at the high cap: reserve a real downside for every attempt.
 if(q+partial>.96){const scale=(.96-q)/partial;raw=raw.map(([id,p])=>[id,id==='partial'?p*scale:p]);if(kind==='venture'){raw[3][1]=.04*.7;raw[4][1]=.04*.3;}else raw[2][1]=.04;}
 const outcomes=raw.map(([id,p])=>({id,bp:Math.round(p*10000)}));outcomes[outcomes.length-1].bp+=10000-outcomes.reduce((a,b)=>a+b.bp,0);
 return{ruleset:1,kind,terms,events:[...events],outcomes};
}
function resolve(s,c,choice,roll,precomputed){const d=precomputed||distribution(s,c,choice);let limit=0;const bucket=Math.floor(roll*10000),outcome=d.outcomes.find(o=>(limit+=o.bp)>bucket).id;
 const good=outcome==='success'||outcome==='breakthrough',u=c.living,investment=choice.probability.investment;
 if(good){Object.assign(s,choice.successSet||{});Object.assign(s.flags,choice.successFlag||{});if(choice.successIncome)s.salary=Math.round(s.salary*choice.successIncome);s.career=clamp(s.career+6,0,100);}
 if(d.kind==='venture'){
 const returns={breakthrough:3,success:1.5,partial:1,failure:.4,loss:0};s.savings+=Math.round(investment*returns[outcome]);
 if(outcome==='breakthrough'){s.network=clamp(s.network+5,0,100);s.salary=Math.round(s.salary*1.1);}
 if(outcome==='loss')s.stress=clamp(s.stress+8,0,100);
 }else if(good)s.savings+=Math.round(u*(d.kind==='training'?.5:1));
 if(outcome==='partial'){s.skills=clamp(s.skills+4,0,100);s.network=clamp(s.network+2,0,100);s.flags.followup=true;}
 if(outcome==='failure')s.skills=clamp(s.skills+2,0,100);
 s.flags['outcome_'+s.turns]=outcome;
 const messages=d.kind==='venture'?{breakthrough:'回款显著超过预算，客户带来新的持续合作，收入基础也得到改善。',success:'项目完成交付，回收本金并获得有限利润。',partial:'项目勉强收回本金。合作经验可以留下，但尚不足以扩大经营。',failure:'仅收回部分投入，需要重新积累预算；现有工作仍在。',loss:'本次投入未能收回。没有自动借款，下一次尝试要先看剩余储备。'}:{success:d.kind==='training'?'申请得到支持，阶段学习记录与相应收入变化已保存。':'申请获得实质进展，带来岗位或合作收益。',partial:'获得进一步评审与补充材料的机会，暂未得到正式资格或预期加薪；准备经验将帮助后续申请。',failure:'本次未取得名额或合同。你保留现职与学习记录，仍能选择其他路径。'};
 return{message:messages[outcome],record:{node:s.turns,year:s.year,month:s.month,outcome,kind:d.kind,events:d.events,distribution:d.outcomes}};
}
function validate(s){if(s.probabilityVersion===undefined)return s.worldEvents===undefined&&s.probabilityLog===undefined;
 if(s.probabilityVersion!==1||!Array.isArray(s.worldEvents)||JSON.stringify(s.worldEvents)!==JSON.stringify(occurred(s))||!Array.isArray(s.probabilityLog)||s.probabilityLog.length>s.turns)return false;
 return s.probabilityLog.every((r,i,a)=>r&&Number.isInteger(r.node)&&[0,3,5,6,7].includes(r.node)&&r.node<s.turns&&(!i||r.node>a[i-1].node)&&Number.isInteger(r.year)&&Number.isInteger(r.month)&&r.month>=1&&r.month<=12&&r.year*100+r.month<=date(s)&&['career','training','venture'].includes(r.kind)&&Array.isArray(r.events)&&r.events.every(id=>s.worldEvents.includes(id))&&Array.isArray(r.distribution)&&r.distribution.length===(r.kind==='venture'?5:3)&&new Set(r.distribution.map(o=>o.id)).size===r.distribution.length&&r.distribution.every(o=>o&&['breakthrough','success','partial','failure','loss'].includes(o.id)&&Number.isInteger(o.bp)&&o.bp>=0)&&r.distribution.reduce((n,o)=>n+o.bp,0)===10000&&r.distribution.some(o=>o.id===r.outcome));
}
const api={periods,occurred,active,attach,distribution,resolve,validate};root.LifeProbability=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
