/* Authored fiction, 3 major scenes + 4 daily scenes per new life.
   Uses existing seeded probability at node 6; all probability values are game estimates. */
(function(root){
const ids=['zhixia01','robin05'];
const people={
 zhixia01:{name:'许静',role:'母亲；语文教师，习惯给建议，也在学习听女儿自己的打算',closeness:65},
 robin05:{name:'家人（平行设定）',role:'虚构家庭关系；希望Robin生活稳定，也愿意商量学习与独立空间',closeness:65}
};
const directions={sound:'声音记录',steady:'稳定工作',joint:'平等合作',private:'私人创作',music:'录音练习',stage:'共同排练',tools:'实用网页',explore:'开放探索'};
function major(s,c,step,ch,existing){
 if(!ids.includes(c.id))return null;
 const f=s.flags,u=c.living,robin=c.id==='robin05',route=f.personalRoute;
 if(step===0)return{...existing,title:robin?'Robin的另一种起点':'一台旧录音机，四种日子'};
 if(![2,6,9].includes(step))return null;
 let title,text,choices;
 if(!robin&&step===2){
  title='磁带上的名字，由谁决定';text='一位街坊录下很动人的家庭故事，却在交稿前请求匿名。何岚要求逐条确认可公开内容，叶舟已经画好带姓名的封面。母亲觉得机会难得，也担心你得罪熟人。你想怎样继续？';
  choices=[
   ch('重新确认授权，制作匿名声音故事',{skills:8,stress:3},'你重录容易辨认的段落，明确撤回边界。编辑工作变慢，但可以带着这份标准继续征稿。',{bond:0,flag:{personalRoute:'sound',consentRecord:true},media:'office'}),
   ch('保留助教收入，暂缓这一期节目',{career:6,stress:-4,family:4},'你把空出来的时间用于备课；不公开这段录音，也不把稳定工作当成创作失败。',{income:1.1,set:{role:'助教与周末记录者'},flag:{personalRoute:'steady'},media:'school'}),
   ch('与叶舟改做没有私人信息的街景专题',{network:7,savings:-u/2},'你们改录街道声，重谈封面署名和工作量。原来的私人录音没有发布。',{bond:1,require:x=>x.savings>=u/2,requireText:'现金够支付半个月生活费的制作成本',flag:{personalRoute:'joint',sharedCredit:true},media:'street'}),
   ch('把录音交回本人，只留下自己的听后笔记',{freedom:8,stress:-5},'你没有公开作品，但保住了一次私人交流。并非每次倾听都需要变成节目。',{flag:{personalRoute:'private'},media:'home'})];
 }
 if(robin&&step===2){
  title='Robin的周末，只能先答应一件事';text='顾言空出了周六的录音室，陆川的排练也在同一天。朋友还想请你做一个简单的活动网页。家人问你：这些兴趣里，哪件是这个月愿意真正投入时间的？这份选择可以改变，不必决定一生。';
  choices=[
   ch('约定录完一个吉他片段，保留基础工作',{skills:9,stress:2},'顾言把目标缩到一段能完成的录音。你不必先成为专业歌手才开始。',{bond:0,flag:{personalRoute:'music'},media:'theatre'}),
   ch('与陆川排一段双人戏，先确认时间边界',{network:7,skills:5,freedom:-2},'你们约好每周一次排练。陆川保留拒绝额外场次的权利。',{bond:1,flag:{personalRoute:'stage'},media:'theatre'}),
   ch('做一页活动网页，先写清维护范围',{skills:8,savings:-u/2},'你用当时能学到的网页技术完成样稿。朋友仍需整理内容，你没有承诺无限修改。',{require:x=>x.savings>=u/2,requireText:'有半个月生活费的设备与学习预算',flag:{personalRoute:'tools'},media:'office'}),
   ch('暂不接项目，把周末留给运动和观察',{health:7,freedom:7,stress:-6},'你把尚未开始的邀请婉拒，留下普通的周末。探索也可以不产生作品。',{flag:{personalRoute:'explore'},media:'street'})];
 }
 if(step===6){
  const label=directions[route]||'原来的探索';
  title=robin?{music:'录音之后，是职业还是喜欢',stage:'排练室里，谁还愿意再来',tools:'网页上线后，维护才刚开始',explore:'不急着变成一份职业'}[route]||'Robin重新分配时间':{sound:'何岚退回的节目修改单',steady:'稳定工作，也能留一扇窗',joint:'叶舟想要的不只是封面署名',private:'一盒只给熟人听的磁带'}[route]||'声音与日子如何继续';
  text=`你先前选择了「${label}」。${robin?(f.robinBoundary?'陆川记得你们谈过时间边界，邀请也给你留了拒绝的空间。':'陆川问你这次能投入多少时间，需要重新确认。'):(f.consentRecord?'何岚仍保留你写的授权记录，新稿也要遵守相同约定。':'何岚愿意继续教你，但公开作品仍须重新核实内容与授权。')}这次可以扩大投入、维持小规模、进修，也可以换一种生活。`;
  const apply=robin?{music:['提交录音样本，申请制作助理','录音制作助理'],stage:['带排练片段申请剧场制作岗位','剧场制作助理'],tools:['以已完成网页申请技术助理','网页技术助理'],explore:['整理已有经验，申请弹性助理岗位','弹性项目助理']}[route]:{sound:['修改节目，申请后续制作委托','声音节目制作人'],steady:['整理教案，申请课程制作岗位','课程内容助理'],joint:['与叶舟提交共同署名样稿','合作刊物制作人'],private:['提交匿名短稿，尝试一次公开征稿','兼职声音作者']}[route];
  const offer=apply||(robin?['整理作品申请制作岗位','制作助理']:['准备样稿申请编辑岗位','音频编辑助理']);
  choices=[
   ch(offer[0],{skills:5,stress:4},'你提交了具体材料，对方仍需比较内容、交期与预算。',{months:12,chance:.5,successSet:{role:offer[1]},successIncome:1.2,successFlag:{personalOffer:true},flag:{personalLater:'apply'},media:route==='tools'?'office':'theatre'}),
   ch(robin?'保留现有收入，让兴趣维持小规模':'保留现有工作，每月只完成一个小作品',{family:5,freedom:5,stress:-5},'你没有扩大承诺。收入和朋友相处仍有位置，创作也能慢慢留下来。',{months:12,flag:{personalLater:'small'},media:'home'}),
   ch(robin?'付有限学费，补足当前方向的基础':'支付有限学费，学习编辑与核实方法',{skills:12,savings:-u,stress:2},'你为课程留出预算，完成练习；课程本身不保证岗位。',{months:12,require:x=>x.savings>=u,requireText:'有一个月生活费的学习预算',flag:{personalLater:'learn'},media:'school'}),
   ch(robin?'暂停原项目，做一段稳定的本地工作':'减少制作，把时间留给家人和普通生活',{health:7,family:7,stress:-7},'你重新谈清了工作安排。留下的关系与经验没有因为暂缓项目而消失。',{months:12,set:{role:robin?'本地工作与兴趣探索者':'本地机构工作人员'},flag:{personalLater:'quiet'},media:'home'})];
  if(robin&&route==='tools')choices.push(ch('只接一次付费维护，写清范围与交付',{skills:5,career:5,savings:u/2},'你用实际做过的网页和需求说明取得一笔有限报酬；没有借此承诺长期公司或无限售后。',{require:x=>x.flags.robinSmall&&x.skills>=60,requireText:'早期采用小目标，而且能力至少60',flag:{personalLater:'bounded',boundedWork:true},media:'office'}));
  else if(robin&&route==='stage')choices.push(ch('与陆川共同组织一场限时读剧',{network:7,skills:6},'你们沿用最早谈好的时间边界，完成一次读剧；报名不等于卖座。',{bond:1,require:x=>x.flags.robinBoundary&&x.relations[1].closeness>=75,requireText:'曾谈清排练边界，与陆川亲近度至少75',flag:{personalLater:'shared'},media:'theatre'}));
  else if(!robin&&route==='joint')choices.push(ch('与叶舟按共同署名方案交付一期小刊物',{skills:5,network:7,savings:-u/2},'你们把两人的名字并排放上封面。小批交付完成，是否再做下一期可以另谈。',{bond:1,require:x=>x.flags.sharedCredit&&x.flags.zhixiaTime&&x.relations[1].closeness>=75&&x.savings>=u/2,requireText:'共同署名、守过相处约定，关系至少75且能承担制作成本',flag:{personalLater:'shared'},media:'office'}));
  else if(!robin&&route==='sound')choices.push(ch('为街坊做一份可撤回的私人声音档案',{skills:6,family:6},'你沿用授权记录，让每位讲述者保留自己的副本与撤回权。这不是商业成功的承诺。',{require:x=>x.flags.consentRecord&&x.skills>=60,requireText:'保留授权记录，而且能力至少60',flag:{personalLater:'archive'},media:'home'}));
 }
 if(step===9){
  title=robin?'Robin，这一次是谁替你定义生活':'关掉录音机之后，仍然有话想说';
  const result=f.personalOffer?'之前的申请得到支持，你有了新的工作机会。':f.personalLater==='apply'?'之前的申请没有立即变成正式机会，原有经验仍在。':f.boundedWork?'那次有明确范围的维护交付，为你留下了有限报酬和边界。':`你让「${directions[route]||'探索'}」按自己选择的规模继续。`;
  text=result+(robin?`顾言问你是否还喜欢最初的尝试，陆川想约一次不带任务的见面。${f.robinRest?'他记得你曾经选择单纯相处。':'朋友也有自己的生活，不会一直等你空下来。'}`:`叶舟带来一本自己的画册，母亲许静想听你说说最近过得怎样。${f.zhixiaListen?'她记得你曾认真听完她的一天，这次也先听你说。':'你们可以重新学习不把每次谈话变成建议。'}`);
  choices=[
   ch(robin?'和陆川散步，认真听他的近况':'陪叶舟看画册，今天不聊合作',{family:8,stress:-5},'这次相处没有新项目。对方分享了自己的计划，你认真听完。',{bond:1,flag:{personalClosing:'people'},media:'street'}),
   ch(robin?'与顾言复盘作品，明确下一段练习':'请何岚听新样稿，接受具体修改意见',{skills:8,network:3},'反馈不全是赞扬，你记下可以亲自练习的部分。',{bond:0,flag:{personalClosing:'craft'},media:'school'}),
   ch('把一个完整周末留给家人和休息',{family:8,health:5,stress:-6},'你兑现了一段具体的相处时间，不必先拿出成就才配休息。',{flag:{personalClosing:'home'},media:'home'}),
   ch(robin?'整理未来两地生活的问题，先研究条件':'留一笔探索预算，慢慢了解外地的生活',{freedom:7,skills:3,savings:-u/4},robin?'你列出学习、生活成本、签证与工作许可等需要逐项核实的问题；这一步没有迁居、拿到许可或收入保证。':'你开始收集工作和居住信息，暂未离开现有住处。下一阶段仍由你决定。',{require:x=>x.savings>=u/4,requireText:'能承担四分之一个月生活费的探索预算',flag:{personalClosing:'explore'},media:'street'})];
 }
 return{title,text,choices};
}
function day(s){const robin=s.characterId==='robin05',f=s.flags;let row;
const rows=robin?[
 ['练习本里，写满了想做的事','顾言翻到你记下的吉他、排练和网页三个计划。他问这个星期哪一件能真的做完；陆川也在等你回复周末见面。',[
  ['缩小为一个半小时能完成的练习',{skills:5,stress:-2},'你只练一个片段。完成的小目标会成为日后安排委托的依据。',{flag:{robinSmall:true},bond:0,media:'school'}],
  ['先把想法都记下来，今晚不赶进度',{freedom:4,stress:-3},'笔记可以留着，不必为每个念头立刻开工。',{flag:{robinNotebook:true},media:'home'}],
  ['按原约定去见陆川，回来再练',{family:4,stress:-2},'你们只是吃饭聊天；兴趣没有取消普通相处的资格。',{bond:1,flag:{robinRest:true},media:'cafe'}]]],
 ['陆川不想当永远等人的朋友',f.robinSmall?'你完成了小练习，陆川却说共同排练也需要你给出确定时间。':'陆川说他喜欢与你见面，却不想每次都等你的兴趣计划全部排完。他也有工作和想做的事。',[
  ['约固定时间，额外任务另行商量',{network:4,freedom:3},'你们把可投入的时间说清，之后的合作可以据此缩小范围。',{bond:1,flag:{robinBoundary:true},media:'cafe'}],
  ['道歉并暂缓合作，只保留普通来往',{family:4,stress:-3},'你不让朋友为不确定的承诺留空时间。见面可以没有排练任务。',{bond:1,flag:{robinRest:true},media:'street'}],
  ['坦白自己想独立探索，请他按自己的计划走',{freedom:5,stress:-2},'你们没有共同项目，但说清了期待，之后仍可重新邀请。',{flag:{robinSolo:true},media:'home'}]]],
 ['家人问：你最近过得好吗',f.robinNotebook?'家人看见你的兴趣笔记，先问这些安排有没有挤掉睡眠。':'家人这次没有先问收入，而是问你最近是否还有休息和朋友。',[
  ['讲讲一个小进步，也说出还不确定的事',{family:5,stress:-3},'家人听见了过程，不只是结果；不确定也能被放到桌上讨论。',{person:0,flag:{robinFamilyTalk:true},media:'home'}],
  ['一起做顿饭，今晚先不谈计划',{health:3,family:4},'这一顿饭没有变成职业咨询，也没有隐藏的奖励。',{person:0,media:'home'}],
  ['说明需要独处，约好下次再聊',{freedom:4,stress:-4},'你明确提出休息时间，留下具体的下一次相处约定。',{flag:{robinPrivate:true},media:'home'}]]],
 ['把“我们一起”说得更具体',f.robinBoundary?'陆川带来一份按你们约定时间排好的小计划，仍请你决定是否参加。':'陆川想再邀请你，但先问是否还想合作。这一次你可以重新谈清范围。',[
  ['按一个小目标试一次，双方保留退出权',{skills:4,network:4},'你们以有限尝试重新合作，谁都不用为整个未来作保证。',{bond:1,flag:{robinSmall:true,robinBoundary:true},media:'theatre'}],
  ['只看他的排练，做一次普通观众',{family:4,stress:-3},'你给他鼓掌，没有把自己也变成项目负责人。',{bond:1,flag:{robinRest:true},media:'theatre'}],
  ['婉拒这次邀请，给自己的节奏留空间',{health:4,freedom:4},'陆川可以找其他搭档，友谊不以每次合作为条件。',{flag:{robinSolo:true},media:'street'}]]]
]:[
 ['母亲说的“为你好”','许静在饭桌上列了三个稳定岗位。你刚想讲今天录到的雨声，她又开始比较工资。她不是不关心你，但你有些话还没说完。',[
  ['先听完她的担心，再请她听一段录音',{family:5,skills:2},'她仍不完全理解这份兴趣，但认真听到了结尾。',{person:0,flag:{zhixiaListen:true},media:'home'}],
  ['把预算写下来，约定各自不替对方作决定',{freedom:5,stress:-2},'你把生活费和尝试期限摆出来，谈话有了可以核对的内容。',{flag:{zhixiaBudget:true},media:'home'}],
  ['今晚先陪她洗碗，工作留到周末再谈',{health:3,family:3},'你们聊了菜价和学生的趣事，这一天没有作出职业决定。',{person:0,media:'home'}]]],
 ['叶舟画了一张没有用途的封面','叶舟把一张画递给你。你第一反应是问能否用在节目里，他却说只是想给朋友看看。',[
  ['放下节目进度，问他为什么画这条街',{family:4,stress:-2},'你听完他的童年回忆，约好下次不带工作见面。',{bond:1,flag:{zhixiaTime:true},media:'cafe'}],
  ['先谈授权与署名，不把友情当免费劳力',{network:4,skills:2},'你们先确认原创权与共同署名，正式制作仍要另外核对成本。这次没有擅自使用他的画。',{bond:1,flag:{sharedCredit:true},media:'office'}],
  ['告诉他今天有些累，约好另一天再听',{health:4,freedom:3},'他收起画，你给出具体时间，没有敷衍一句以后再说。',{flag:{zhixiaTime:true},media:'home'}]]],
 ['有一段声音，不需要发出去',f.zhixiaListen?'母亲主动问你是否想录下她读诗，又说有一段只愿给家里人听。':'母亲在家读诗，说这次只是读给自己听，不想变成任何作品。',[
  ['关掉机器，只做一个听众',{family:5,stress:-3},'有些相处在当场发生就足够了，你没有留下文件。',{person:0,flag:{zhixiaPrivate:true},media:'home'}],
  ['征得同意，只保留家用副本',{skills:3,family:3},'你写下不公开的约定，母亲可以随时要求删除。',{person:0,flag:{consentRecord:true},media:'home'}],
  ['去阳台休息，把这一会儿留给她自己',{health:5,freedom:3},'两个人都拥有了一点安静时间，没有关系危机发生。',{media:'home'}]]],
 ['叶舟把画册留出了一页',f.zhixiaTime?'叶舟记得你们的见面约定，这次先把画册摊开，等你看完再谈别的。':'你们有段时间只谈交稿。叶舟说新画册里有一页，希望你作为朋友先看看。',[
  ['认真看完，今天不提合作',{family:5,stress:-3},'他讲了最近想画的人，你们的相处没有工作报酬。',{bond:1,flag:{zhixiaTime:true},media:'cafe'}],
  ['问他是否愿意平等策划一期作品',{network:4,skills:3},'他愿意先讨论，两人分别保留署名与拒绝的权利。',{bond:1,flag:{sharedCredit:true},media:'office'}],
  ['坦白近期太忙，给自己一个安静晚上',{health:5,freedom:4},'你把画册还给他，约定之后主动联系；今晚没有新的任务。',{media:'home'}]]]
];
row=rows[s.storyCursor];if(!row)return null;
return{id:s.storyActive,title:row[0],text:row[1],daily:true,tag:'日常 · 生活片刻',choices:row[2].map(([label,effect,result,extra])=>({label,effect,result,months:0,...extra}))};
}
const api={ids,people,major,day};root.LifeNewLivesStories=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
