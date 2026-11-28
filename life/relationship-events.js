/* Fictional young-adult experiences, not a childhood simulation or diagnosis. */
(function(root){
const rows={
ethan73:['散场后的约会','Claire','排练散场后，Claire 想约你吃饭，却不想每次谈话都变成试镜复盘。你习惯在别人面前表现得从容，这一次可以不扮演任何角色。','actorDinner','你曾给朋友留过不谈工作的晚餐，知道陪伴也可以没有任务。','排练时间'],
camille08:['没有秒表的下午','Julien','Julien 想与你度过一个没有训练表的下午。你享受游泳，也担心关系会挤占恢复时间；他希望被认真倾听，而不是成为日程中的一个空格。','swimNotes','你曾认真记录身体反馈，可以把同样的耐心用于讨论自己的精力。','恢复时间'],
jieun97:['姓氏之外的相处','李俊赫','李俊赫想约你去一家普通小店，不希望这次见面被当作家族合作。你有资源，也想知道彼此喜欢的究竟是什么。','heirListening','你曾听哥哥说完他的顾虑，理解询问比猜测更有用。','私人空间'],
lin01:['下班后的一次邀请','林然','林然约你下班后散步。你算着车费和明天的班次，又担心解释预算会让气氛尴尬。他也有自己的工作安排，愿意听具体的想法。','linVisitPlan','你和林燕商量过怎样一起回去看奶奶。上次是先对排班，再定日子，这回也可以这样问。','交通与班次']};
function apply(s,step,scene,ch){const r=rows[s.characterId];if(!r||s.flags.relationshipVersion!=='1')return scene;
if(step===4){const [title,name,context,memory,recall,limit]=r;return {...scene,title,text:context+'\n'+(s.flags[memory]?recall:s.stress>=55?'最近的压力让你更想尽快给出答案，但你仍可以先停下来想想。':'你还在摸索适合自己的相处方式，不必立刻证明什么。'),choices:[
ch('认真约会，先谈清彼此能投入的时间',{family:8,stress:2},`你与${name}约定先尝试相处，不承诺无限陪伴。`,{set:{partner:name},flag:{love:'together',relationshipResponse:'talk'},media:'cafe'}),
ch('先做朋友，在日常里慢慢了解',{network:5,stress:-3},'你们继续联系，不急着给关系命名。',{flag:{love:'friends',relationshipResponse:'slow'},media:'street'}),
ch('说明目前想独处，尊重对方另作安排',{freedom:7,stress:-3},'对方接受你的回答，也保留自己的选择。单身没有被当作失败。',{flag:{love:'single',relationshipResponse:'space'},media:'home'}),
ch('尝试交往，把现实限制一起写进安排',{family:5,freedom:3},`你们具体讨论${limit}，决定先按可承受的节奏见面。`,{set:{partner:name},flag:{love:'independent',relationshipResponse:'plan'},media:'cafe'}),
ch('借用以前协商的经验，先问对方真正需要什么',{family:6,network:3,stress:-2},'你们认真谈了一次，决定继续了解。熟悉的经验提供帮助，没有替双方决定恋爱。',{require:x=>!!x.flags[memory],requireText:'曾积累相关的沟通或自我观察经历',flag:{love:'friends',relationshipResponse:'listen'},media:'street'})]};}
if(step===9&&s.flags.relationshipResponse){const words={talk:'你曾主动谈清相处时间',slow:'你曾选择慢慢了解',space:'你曾为自己保留独处空间',plan:'你曾把现实限制说清楚',listen:'你曾先听对方的需要'};return {...scene,text:scene.text+'\n'+words[s.flags.relationshipResponse]+'。'+(s.partner?`现在与${s.partner}的关系仍需要照顾。`:'那次选择没有规定你以后必须保持单身或进入恋爱。'),choices:scene.choices.map((c,i)=>i===0?{...c,effect:{...c.effect,stress:(c.effect?.stress||0)-2},result:c.result+' 你也留意了自己的关系节奏，今天不必重复当年的反应。',flag:{...c.flag,relationshipReflected:true}}:c)};}
return scene;}
const api={ids:Object.keys(rows),apply};root.LifeRelationshipEvents=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
