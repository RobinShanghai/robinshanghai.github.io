/* Cultural beliefs are social experiences, never supernatural probability modifiers.
   Sources and limits: CULTURE_NOTES.md. Fictional dialogue, not diagnostic claims. */
(function(root){
const ids=['chen01','yusuke91','ethan73'];
const enabled=s=>s.storyRevision===3&&ids.includes(s.characterId);
const rows={
chen01:{title:'饭桌上的生辰纸条',source:'https://hakkadict.moe.edu.tw/search_result/?id=9304',text:'一次亲友聚餐，姨妈提起用生辰八字合婚，问你愿不愿意听一位熟人的意见。母亲许蕙说可以听听，父亲更在意对方如何对待你。沈宁悄悄问：大家都在谈时间表，你自己想要什么？这只是这一桌人的不同意见，并不是所有家庭的习惯。',pressure:'被亲友的恋爱时间表催促',choices:[
['把合婚当作家庭仪式，说明决定仍由双方作出',{family:3,freedom:2},'你愿意了解家人的习惯，也说清没有双方的意愿就不推进关系。母亲记住了这条约定。','ritual','home'],
['请家人先了解真实相处，不拿生辰评价对方',{freedom:5,stress:2},'谈话有些尴尬，但你说明自己更想观察尊重、沟通和日常相处。没有因此与家人决裂。','boundary','home'],
['先答应一次介绍，给自己保留随时拒绝的余地',{network:3,stress:3},'你接受的是见面邀请，不是恋爱承诺。新的认识可能普通，也可能值得继续了解。','explore','cafe'],
['暂缓回答，与沈宁聊聊被催促时的感受',{stress:-3,freedom:2},'她听你说完，没有替你断言命好或命差。你暂时不必证明自己比别人早进入关系。','support','cafe']]},
yusuke91:{title:'晴天里的一张御神签',source:'https://www.mlit.go.jp/tagengo-db/en/H30-00533.html',text:'休息日，美咲邀你走到神社。你抽到的一张御神签提醒做事不宜操之过急；这是剧情虚构的签文，不是未来消息。父亲正志觉得出门散步就很好，美咲只想留个纪念。你却想到，最近遇到不确定的事，总想等一个明确答案。',pressure:'想在不确定时找到明确答案',choices:[
['把签文当作提醒，列出自己还需要了解的事',{skills:3,stress:-2},'你留下纸条，另写一张可核实的问题清单。签文没有替你完成判断。','ritual','school'],
['告诉美咲自己不信预测，仍陪她逛一会儿',{family:3,freedom:3},'你们不必有一样的信念，也可以享受同一个下午。','boundary','street'],
['聊聊各自担心的事，不急着给出答案',{stress:-3,family:2},'美咲也有自己的犹豫。你听见的是一个人的烦恼，不是一条需要立刻修好的电路。','support','street'],
['今天不解释签文，回家休息再考虑',{health:3,stress:-3},'你把纸条收好。暂停一天没有让机会神秘消失。','pause','home']]},
ethan73:{title:'Ben 圈出的星座专栏',source:'https://www.cjr.org/analysis/horoscopes_astrology.php',text:'排练间隙，Ben 把报纸星座专栏圈出一句关于新关系的话，笑着问你最近有没有约会。旁边的人说，你这样的外表应该很有经验。Ben 看见你迟疑，问要不要换个话题。好看不意味着你必须熟练，也不意味着你一定感到不安。',pressure:'被外貌带来的恋爱期待包围',choices:[
['当作轻松话题，聊聊各自喜欢怎样的相处',{network:3,stress:-2},'星座成了聊天的开头，具体的人仍要具体认识。Ben 没有给你的经历打分。','ritual','cafe'],
['说明不想被外貌推定经历，继续原来的安排',{freedom:5,stress:1},'你说出了边界。气氛短暂安静，随后大家回到排练，没有因此失去角色。','boundary','theatre'],
['接受一次普通见面，先说清自己不急于承诺',{network:4,stress:2},'你愿意认识新人，但没有把亲密当作必须完成的考核。见面不保证恋爱，也没有自动造成伤害。','explore','cafe'],
['私下告诉 Ben 这句话让自己有些压力',{stress:-3,family:2},'Ben 道歉，之后先问你愿不愿意聊。一次被认真倾听的经验留下了。','support','cafe']]}
};
function day(s){const row=rows[s.characterId];const remembered=s.flags.boundaries||s.flags.chenDinner||s.flags.yWalk||s.flags.actorDinner;
const feeling=remembered?'你想起以前为自己留时间的约定，这次可以沿用，也可以改变做法。':s.stress>=55?'最近事情很多，这句话显得格外刺耳。你可以先缓一缓，不必立刻回应。':'你有些在意，也仍有空间想一想自己愿意怎样回应。';
return{id:s.storyActive,title:row.title,text:row.text+'\n'+feeling,source:row.source,tag:'日常 · 信念与自我',daily:true,choices:row.choices.map(([label,effect,result,approach,media])=>({label,effect,result,months:0,media,flag:{cultureApproach:approach,culturePressure:row.pressure,cultureRememberedSupport:!!remembered},...(['support','explore'].includes(approach)?{bond:1}:{})}))};}
function revisit(s,scene,ch){if(!enabled(s)||!s.flags.cultureApproach)return scene;
const a=s.flags.cultureApproach;
const person={chen01:'沈宁',yusuke91:'美咲',ethan73:'Ben'}[s.characterId];
const memory={ritual:'你曾保留仪式或星座话题，同时把决定留给自己。',boundary:'你曾明确说出自己的边界。',explore:'你曾愿意认识新人，也保留拒绝的余地。',support:'你曾把压力告诉一个愿意倾听的人。',pause:'你曾允许自己暂时不作决定。'}[a];
const label=a==='support'?'再次找熟悉的人谈谈，也听听对方':a==='explore'?'回顾新的相处，决定是否调整自己的节奏':a==='boundary'?'重新说明边界，也听听对方的需要':a==='pause'?'在休息之后，重新说出自己的想法':'保留喜欢的习惯，把重要决定谈清楚';
return{...scene,text:scene.text+'\n'+memory+person+'记得那次谈话，但这不要求你永远保持同一种反应。',choices:[...scene.choices,ch(label,{stress:-4,freedom:3},`你和${person}重新谈了自己的节奏，也听见对方的近况。过去留下影响，但没有替今天作出决定。`,{bond:1,flag:{cultureRevisited:true},media:'cafe'})]};}
const api={ids,enabled,day,revisit};root.LifeCultureEvents=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
