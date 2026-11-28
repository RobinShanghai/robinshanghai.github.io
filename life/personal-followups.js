/* Authored follow-ups for the nine characters without continuous dialogue. */
(function(root){
const rows={
camille08:['Lea 不希望每次见面都围着成绩转。她带了两张展览的单子，想知道你这周有没有空一起看看。','pool',[
['约一个不带秒表的下午',{family:5,stress:-4},'你听完了她的课程烦恼，没把聊天变成训练指导。'],['说明备赛时间，请她一起选另一个日子',{skills:3,freedom:3},'你写下能赴约的时间，也接受她未必有空。'],['承认最近没有余力，先减少社交承诺',{health:5,stress:-3},'你减少了一项安排，而不是让别人一直等。']]],
chen01:['父亲想知道你是否需要支持。你希望得到的是资源、建议，还是被允许自己试一次？','office',[
['提出有限试做预算，约定独立核算',{skills:5,freedom:2},'你把试做范围与家族账目分开，资源优势没有变成无限追加资金。'],['先展示设计过程，请父亲只给意见',{family:4,skills:3},'你听取意见，也保留了最终设计判断。'],['暂不借用家族资源，缩小设计范围',{freedom:5,stress:1},'第一版更小，但责任与进度由自己掌握。']]],
yusuke91:['美咲愿意画说明书，却不想每次都被当成免费的帮手。她也有自己的作品要做。','office',[
['谈清图示范围与署名，按她有空的时间排期',{network:4,skills:3},'图示和技术记录分别署名，进度不再默认妹妹随时有空。'],['自己学画最基础的步骤，不占用她的时间',{skills:5,freedom:2},'图示还不漂亮，却能由你自己继续修改。'],['今天只看她的画，不谈维修产品',{family:5,stress:-3},'你第一次认真问起她自己的创作主题。']]],
maya94:['Lucia 是你的戏剧老师，Paulo 是哥哥。老师愿意谈表演，哥哥希望你也关心裁缝铺之外的他。','theatre',[
['请 Lucia 指出一段表演的具体问题',{skills:5,network:2},'练习得到具体建议，没有承诺录用。'],['陪 Paulo 吃饭，让他讲自己的计划',{family:5,stress:-3},'你们不只在需要拍摄或帮忙时才相见。'],['把练习留到明天，今天不接受额外任务',{health:5,freedom:3},'你给疲惫留了空间，没有用失联代替拒绝。']]],
lukas89:['Greta 想确认，自己说过的话会不会突然出现在你的文章里。她希望你认真回答，而非只说别担心。','cafe',[
['明确不引用私下谈话，逐条核对笔记',{family:5,skills:2},'你划去了私人材料，也解释了公开采访的区别。'],['如需采访另约时间，并允许她拒绝',{network:4,freedom:3},'采访与友情有了分开的约定。'],['今天不带本子，只聊眼前的展览',{family:4,stress:-4},'相处没有产出文章，也没有白费。']]],
sam73:['Rose 希望你相信她能学会处理自己的事情。你担心出错，但不想每次都替妹妹决定。','home',[
['让她先试，只一起检查安全部分',{family:5,skills:2},'你们保留安全检查，也留下她独立尝试的空间。'],['把家务重新分工，各留一个自由下午',{freedom:4,family:3},'妹妹的时间不再全部围着你的班次安排。'],['说明自己今天太累，约明天一起处理',{health:5,stress:-3},'你没把疲惫发泄成责备。']]],
ruth73:['Joan 这周的安排又变了。她愿意互助，但不希望一次借烤盘变成永远欠着的人情。','home',[
['重新确认双方能帮的时间，不默认她有空',{network:4,freedom:3},'互助有了结束时间，也允许下次拒绝。'],['和母亲商量她愿意自己完成的事情',{family:5,skills:2},'照护里保留了母亲自己的决定。'],['减少一项额外任务，先把睡眠找回来',{health:5,stress:-4},'并不是每件事都必须由你立刻解决。']]],
aki91:['晴子想先确认你希望怎样沟通，而不是直接替你回答客户。她也希望自己的图示被认真署名。','office',[
['自己书面核对需求，请她只协助图示',{skills:5,freedom:3},'客户听到的是你的判断，图示贡献也被保留。'],['共同演示，分别介绍技术与视觉设计',{network:4,skills:3},'你们各自解释擅长的部分，没有谁代替谁发言。'],['先完成现有维修，暂停扩大试用',{health:4,stress:-3},'交付范围缩小了，承诺也更容易兑现。']]],
seo97:['韩美说这次只想散步，不想讨论小店。你发现自己习惯把每次见面都变成帮人解决账目。','street',[
['先问她想聊天还是听建议',{family:5,network:2},'她选择聊天，你没有继续计算开店成本。'],['约定另一个记账时段，今晚保留给生活',{freedom:4,skills:2},'友情与工作不再挤在同一个晚上。'],['说明自己需要休息，约下次一起走走',{health:5,stress:-3},'你说清了边界，也给出了可调整的约定。']]]
};
const enabled=s=>s.flags.personalFollowups==='1'&&rows[s.characterId];
function day(s,sc){if(!enabled(s))return sc;if(s.storyCursor===0)return{...sc,choices:sc.choices.map((c,i)=>({...c,flag:{...c.flag,followupOpening:String(i)}}))};if(s.storyCursor!==(s.storyRevision===3?3:2))return sc;const r=rows[s.characterId],prior=s.dailyHistory.find(h=>h.id===s.characterId+'_daily_0');return{...sc,text:sc.text+'\n'+r[0]+(prior?'\n你想起自己当时的决定「'+prior.decision+'」。':''),choices:[...sc.choices,...r[2].map((c,i)=>({label:c[0],effect:c[1],result:c[2],months:0,flag:{followupRoute:String(i)},media:r[1]}))]};}
function major(s,step,sc){if(!enabled(s)||step!==9||s.flags.followupRoute===undefined)return sc;const r=rows[s.characterId][2][Number(s.flags.followupRoute)];if(!r)return sc;return{...sc,text:sc.text+'\n你们后来重新谈过：「'+r[0]+'」。'+r[2],choices:sc.choices.map((c,i)=>i===0?{...c,result:c.result+' 你也保留了那次谈话的约定：'+r[2]}:c)};}
const api={ids:Object.keys(rows),day,major};root.LifePersonalFollowups=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
