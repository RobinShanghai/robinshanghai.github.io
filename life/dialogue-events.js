/* Authored branching conversations; no AI service, external requests or extra RNG. */
(function(root){
const ids=['ethan73','jieun97','lin01'];
const enabled=s=>s.flags?.dialogueVersion==='1'&&ids.includes(s.characterId);
// Each opening leads to three different follow-up actions, alongside the old daily choices.
const scripts={
ethan73:{opening:[
'Marian 说：“你注意到那次停顿了。不过，Ben 是不是还在等你？”',
'Ben 见你按约回来，笑着说：“我以为导演一出现，你就忘了我们。”',
'Marian 给了你公开排练时间：“可以来看，不必为了争取机会假装什么都懂。”'],follow:[
['Ben 拿着胶卷问：“你想让我只替你拍试镜照，还是愿意听我想拍什么？”',[
['先道歉，再让 Ben 选一张他最喜欢的照片','你没有解释自己有多忙，先听他谈画面。Ben 说，下次想拍的是街坊，不只是演员。',{family:5,network:2},'listen'],
['坦白自己很想抓住导演机会，商量分开安排时间','Ben 不反对你的野心，只要求别让他无期限等待。你们约好提前说明改期。',{freedom:4,stress:2},'boundary'],
['改口：这次不做试镜照，陪他拍街坊','你把自己的宣传照留到下次。今天没有增加曝光，却完成了一次朋友想做的拍摄。',{skills:4,family:3},'shared']]],
['Ben 放下照片：“谢谢你回来。但你也不用每次都为了我放弃机会。”',[
['告诉他赴约也是自己想做的事','Ben 不再把这顿饭当成你牺牲事业的补偿。你们安稳地吃完晚饭。',{family:5,stress:-3},'listen'],
['承认自己也想去排练，约好下次怎样改期','你允许两个愿望同时存在。Ben 愿意商量，不要求永远被优先选择。',{freedom:4,network:2},'boundary'],
['邀请他下次一起旁观，但由他自己决定','Ben 想先看排练时间，仍会保留自己的拍摄计划。',{network:4,skills:2},'shared']]],
['Ben 问：“公开排练，你是想去学习，还是想被选中？”',[
['承认两者都想，也请他指出自己不自然的地方','他指出你一紧张就急着接话。你试着听完一句再回答，没有立刻变成更好的演员。',{skills:5,stress:1},'listen'],
['说自己还没想清，先只旁观一场','你不提前向朋友保证会得到角色，给探索留了空间。',{freedom:4,stress:-2},'boundary'],
['请他一起做一段小练习，署名和时间先谈好','你们约定练习只占一个晚上，录像也属于共同作品。',{skills:4,network:3},'shared']]]],returning:'Ben 又拿出一卷新照片，这次先问你有没有空。'},
jieun97:{opening:[
'志浩低声说：“我不是想要你替我解决，我只是不想回家还要证明自己。”',
'志浩看了你一眼：“原来你也会怕选错。我一直以为你比我自由。”',
'志浩点头：“谢谢。等我想说时，会自己来找你。”'],follow:[
['布展时，素妍问你：“你现在是在听我的想法，还是替我想好了作品该怎样？”',[
['先问她为何舍弃那张照片，听完再评价','她解释了系列主题，你发现喜欢一张照片不等于理解整组作品。',{skills:4,family:3},'listen'],
['承认自己习惯快速给答案，重新划清分工','素妍负责选片，你只承担约好的布展工作。资源没有变成编辑权。',{freedom:4,network:3},'boundary'],
['提议各自挑一张，交流理由而不争输赢','你们保留不同审美，交流没有自动变成商业合作。',{skills:5,stress:-2},'shared']]],
['素妍听说你也在犹豫，问：“你是真的喜欢摄影，还是只想离开家族安排？”',[
['坦白两种念头都有，先聊最喜欢拍什么','你们从街角的光线聊起，第一次没有急着给未来一个职业名称。',{skills:4,stress:-3},'listen'],
['说明暂不投资工作室，先做普通参与者','你保留资金，也把她从必须替你证明独立的压力里放出来。',{freedom:5,family:2},'boundary'],
['约一次没有成果要求的拍摄散步','拍摄没有展览承诺，也可以是一段值得一起度过的时间。',{health:3,network:3},'shared']]],
['志浩稍后来找你：“刚才不是对你生气。”素妍也说，安静不一定代表反对。',[
['问他现在想聊，还是只想有人陪一会儿','你让他选择谈话的节奏，没有替沉默作解释。',{family:5,stress:-2},'listen'],
['告诉他们自己也需要独处，约好再谈','彼此有了明确的下次见面，不必靠猜测维持关系。',{freedom:5,stress:-2},'boundary'],
['提议布展后一起吃饭，不讨论预算与成绩','志浩愿意来，但会晚一点。你们接受这个普通的安排。',{family:4,network:2},'shared']]]],returning:'素妍准备新作品，志浩也有自己的安排；他们不再假设你会自动同意。'},
lin01:{opening:[
'奶奶回信：“原来你也有难的时候。以后不用每次只写都好。”',
'林燕说：“我想一起回去，但还没拿到排班表，别先替我答应。”',
'第二天奶奶没有责怪你迟回信，只问：“昨天睡够了吗？”'],follow:[
['翻着缺页教材，林燕问：“信里能说实话，缺的钱和时间，能不能也跟我说清？”',[
['列出自己承担得起的开销，请她一起核对','你们没有凭空多出钱，但知道哪笔支出需要暂缓。',{skills:3,family:4},'listen'],
['说明只求借阅教材，不希望她替自己出学费','林燕知道怎样帮忙才不会越过你的边界，先去问邻居是否方便借书。',{freedom:5,network:2},'boundary'],
['约好轮流用桌子，双方都保留休息时间','你没有用加倍熬夜偿还人情，林燕也能按时睡觉。',{health:3,family:4},'shared']]],
['林燕还没确定休息日：“我怕答应了又做不到，你会觉得我不关心奶奶。”',[
['告诉她不必用一次回家证明关心','她松了口气，愿意拿到排班表后再一起安排。',{family:5,stress:-2},'listen'],
['改口：这次各自回去，不再等一个共同日期','你们保留各自的责任，也不把分开行动当作疏远。',{freedom:4,stress:-3},'boundary'],
['先合写一封信，等有空再回去','没有额外路费，奶奶收到了两个人具体的近况。',{family:4,skills:2},'shared']]],
['林燕看见你打呵欠：“今晚先学，还是先睡？你不必跟我证明自己多能撑。”',[
['承认自己累了，请她明天提醒自己借教材','她答应提醒一次，不承担监督你整个学期的责任。',{health:4,family:2},'listen'],
['把今晚目标缩小，只补一页笔记','学习没有停止，你也给睡眠留下时间。',{skills:3,health:2},'boundary'],
['先吃饭，互相说一件工作之外的小事','教材还在桌上，晚饭也没有带来奇遇，但这一晚不只剩任务。',{family:4,stress:-4},'shared']]]],returning:'林燕又来商量桌子和班次，奶奶仍会问你有没有按时吃饭。'}
};
function day(s,scene){if(!enabled(s)||s.storyCursor>1)return scene;const data=scripts[s.characterId];
if(s.storyCursor===0)return {...scene,choices:scene.choices.map((c,i)=>({...c,result:c.result+'\n'+data.opening[i],flag:{...c.flag,dialogueOpening:String(i)}}))};
const opening=Number(s.flags.dialogueOpening);if(!Number.isInteger(opening)||opening<0||opening>2)return scene;
const [reply,choices]=data.follow[opening];return {...scene,text:scene.text+'\n\n'+reply,choices:[...scene.choices.map(c=>({...c,flag:{...c.flag,dialogueRoute:'ordinary'}})),...choices.map(([label,result,effect,route])=>({label,result,effect,months:0,media:route==='shared'?'home':'cafe',flag:{dialogueRoute:route},...(route==='listen'?{bond:1}:{})}))]};}
function major(s,step,scene){if(!enabled(s)||![6,9].includes(step)||!s.flags.dialogueRoute)return scene;
const route=s.flags.dialogueRoute;const memory={listen:'你曾把话听完，再给出自己的回答。',boundary:'你曾改口或说明界限，没有让一次答应变成无限责任。',shared:'你曾把一小段时间留给共同生活，而不是只追求成果。',ordinary:'那次谈话之后，你们仍各自过着普通的日子。'}[route];
return {...scene,text:scene.text+'\n'+scripts[s.characterId].returning+memory,choices:scene.choices.map((c,i)=>step===9&&i===0?{...c,result:c.result+' 你想起当年的回应，也留意今天是否仍适合。',flag:{...c.flag,dialogueRevisited:true}}:c)};}
const api={ids,day,major};root.LifeDialogueEvents=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
