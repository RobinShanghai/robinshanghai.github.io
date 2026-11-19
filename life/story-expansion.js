/* Fictional Shanghai/Osaka personal stories. Reuses V2.2 probability rules. */
(function(root){
const ids=['chen01','yusuke91'];
const people={chen01:{name:'陈绍明',role:'父亲；经营纺织工厂，希望女儿理解交付责任，也学着尊重她的设计',closeness:65},yusuke91:{name:'佐藤正志',role:'父亲；经营电器维修店，希望保住老客户，也想有时间休息',closeness:60}};
function major(s,c,step,ch,existing){const f=s.flags,u=c.living;let title,text,choices;
if(c.id==='chen01'){
if(step===2){title='样衣上的两种名字';text='沈宁带来第一件样衣，希望作品署上两人的名字。父亲陈绍明愿意借出工厂的打样时间，但提醒你生产线也有客户交期。周岚问：你想练好设计，还是先学会经营？';choices=[
ch('与沈宁共同署名，先做小批样衣',{skills:8,network:5,savings:-u},'你们写清设计署名和样衣预算。沈宁保留自己的客户；这是一份合作约定，还不是销量承诺。',{require:x=>x.savings>=u,requireText:'现金可支付样衣预算',bond:1,flag:{chenCredit:true,chenDirection:'brand'},media:'office'}),
ch('跟父亲核对交期，再借用闲置打样时间',{career:7,family:5,skills:4},'你先完成排期表，工厂资源有了可协商的边界。父亲不要求你因此放弃自己的品牌。',{flag:{chenSchedule:true,chenDirection:'factory'},media:'office'}),
ch('带作品请周岚指导，暂不接订单',{skills:11,freedom:4},'你把尚未成熟的系列带去讨论，修改版型与材料选择，暂时没有销售收入。',{bond:0,flag:{chenDirection:'design'},media:'school'}),
ch('保留小规模创作，把周末留给生活',{health:5,family:5,stress:-5},'你不扩大项目，沈宁可以接别的工作。充足的家庭资源也可以用来换取从容。',{flag:{chenDirection:'quiet'},media:'home'})];}
if(step===6){return {...existing,text:existing.text+(f.chenCredit?' 沈宁还留着那份共同署名约定，这次会据此讨论权责。':f.chenSchedule?' 你早年核对过的排期表，让父亲愿意听具体的试行方案。':' 你们需要重新谈清署名、预算和责任。'),choices:[...existing.choices.map(x=>({...x,media:'office'})),ch('与父亲试行一个季度的独立预算，再决定规模',{career:8,family:5,freedom:5},'父亲认可你用排期和账本说话。你负责有限的产品系列，保留设计时间；工厂与个人支出分别核算。',{months:12,require:x=>x.flags.chenSchedule&&x.storyPeople[0].closeness>=70,requireText:'曾核对工厂排期，且与父亲亲近度至少70',income:1.15,set:{role:'独立核算的产品设计负责人'},flag:{business:'factory',chenTrial:true},media:'office'})]};}
if(step===9){title='饭桌上先不谈订单';text=`${f.chenTrial?'季度试行让父亲看见你的工作方法，但你不想每顿饭都像汇报。':f.business==='partners'?'沈宁有了自己负责的设计线，也想留出不谈公司的时间。':'事业已有自己的节奏，父亲却仍习惯在吃饭时问订单。'}${f.chenDinner?'你记得以前约好留一顿不谈生意的晚饭。':'母亲许蕙把账本合上，请大家先吃饭。'}`;choices=[
ch('陪父母吃饭，谈工作之外的近况',{family:9,stress:-5},'父亲聊起最近学做的一道菜。没有投资承诺，也没有必须解决的矛盾。',{flag:{chenDinner:true},media:'home'}),
ch('和沈宁核对署名，给各自的作品留空间',{network:5,freedom:6},'你们把共同作品与独立作品分开列出。熟悉不等于可以替对方做决定。',{bond:1,flag:{chenCredit:true},media:'office'}),
ch('约周岚看展，只做观众',{skills:5,stress:-4},'你们讨论喜欢的作品，没有把每一幅画都变成商业灵感。',{bond:0,media:'theatre'}),
ch('独自休息，把电话留到明天',{health:6,freedom:5,stress:-6},'没有错失命运般的机会。你只是拥有了一个安静晚上。',{media:'home'})];
if(f.chenCredit)choices.push(ch('邀请沈宁共同策划一次小型作品展示',{skills:6,network:7,savings:-u},'早年的共同署名约定成为展签的一部分。费用有限，作品能否带来订单仍未知。',{require:x=>x.relations[1].closeness>=65&&x.savings>=u*2,requireText:'与沈宁亲近度至少65，并留有两个月生活费',bond:1,flag:{chenExhibition:true},media:'theatre'}));}
}
if(c.id==='yusuke91'){
if(step===2){title='维修台旁的原型机';text='你做的检测小装置能减少重复排查。父亲正志担心客户的机器被耽误，山本希望你保留可复核的实验记录，美咲则说按钮让第一次使用的人摸不着头脑。技术好，不等于产品已经好用。';choices=[
ch('先做对照测试，请山本审阅记录',{skills:11,stress:3},'你记录失败样本和测量条件。山本愿意继续指导，但没有替你承诺研究名额。',{bond:0,flag:{yEvidence:true,yDirection:'research'},media:'school'}),
ch('在维修店试用，明确不耽误客户交付',{career:7,family:5},'你从自己能负责的任务开始，把原型当作辅助工具，而非所有故障的答案。',{flag:{yCustomer:true,yDirection:'shop'},media:'office'}),
ch('和美咲重新设计界面，署上她的名字',{skills:6,network:5,freedom:4},'她解释使用者为什么会按错。你们约定设计署名，妹妹不只是免费的帮手。',{bond:1,flag:{yInterface:true,yDirection:'product'},media:'office'}),
ch('暂缓开发，先完成基本维修和课程',{health:5,skills:5,stress:-5},'原型收进柜子，你先把手头的学习与交付做完。没有人把暂停解释为失败。',{flag:{yDirection:'steady'},media:'home'})];}
if(step===6){title=f.yEvidence?'山本带来的研究助理机会':'山本问你想解决哪一种问题';text=`${f.yEvidence?'记录齐全的原型得到讨论机会，山本建议你申请研究助理岗位。':'山本愿意看你的经历，但申请研究岗位仍要拿出可复核的材料。'}${f.yInterface?'美咲重新设计过的界面让陌生人更容易操作。':'美咲提醒你，客户不会因为电路精巧就自然知道怎么使用。'}父亲希望店里有人接班；你也可以先进入工程团队，或只做小范围的产品试用。`;choices=[
ch('整理实验材料，申请研究助理岗位',{skills:5,stress:4},'你提交真实记录，等待评审。技术能力有帮助，名额与团队需求仍会影响结果。',{months:12,chance:.5,require:x=>x.flags.yEvidence||x.flags.qualification,requireText:'有对照实验记录或已获得进修资格',successSet:{role:'研究团队助理'},successIncome:1.25,successFlag:{yResearch:true},media:'school'}),
ch('进入工程团队，先承担测试与维护',{skills:9,career:6},'你从测试与维护岗位积累交付经验。能修好原型，并不意味着已经能管理一整条产品线。',{months:12,income:1.12,set:{role:'工程测试与维护技术员'},flag:{yCareer:'engineering'},media:'office'}),
ch('接手维修店的技术工作，给父亲留出休息日',{family:9,skills:7,freedom:3},'你承担技术工作，父亲仍负责熟悉的客户沟通。两人一起安排固定休息日。',{months:12,income:1.08,set:{role:'家族维修店技术负责人'},flag:{yCareer:'shop'},media:'office'}),
ch('保留现有工作，限额做产品用户试用',{skills:8,savings:-u,network:4},'你只做能承担的小批试用，收集故障和使用反馈。花掉的是验证预算，不是购买必然成功。',{months:12,require:x=>x.savings>=u*2,requireText:'现金至少覆盖两个月生活费',flag:{yCareer:'prototype'},media:'office'}),
ch('暂不扩大项目，先恢复生活节奏',{health:8,family:5,stress:-7},'你保留已有工作与原型资料，减少额外开发时间。这个选择不需要靠一场失败来证明合理。',{months:12,flag:{yCareer:'steady'},media:'home'})];}
if(step===9){title='美咲的展签与父亲的休息日';text=`${f.yResearch?'研究团队的工作让你更重视记录，家人却更关心你有没有好好休息。':f.yCareer==='shop'?'维修店熟悉的客户仍然来往，父亲开始习惯固定休息日。':'技术工作有了自己的节奏，家人也各有计划。'}${f.yInterface?'美咲想把你们一起设计的界面放进作品集。':'美咲准备自己的设计作品集，希望你先听她说完。'}${f.yWalk?'父亲问你，之前约好的散步还去不去。':'父亲难得早早收好工具。'}`;choices=[
ch('帮美咲整理作品，尊重她的署名',{family:7,network:4},'你说明自己负责的电路部分，把视觉与交互设计留给她介绍。她的作品不必只是你的附录。',{bond:1,flag:{yCredit:true},media:'office'}),
ch('陪父亲散步，今晚不谈修理',{family:9,health:4,stress:-5},'你们聊起街坊和晚饭，没有讨论下一件产品。',{flag:{yWalk:true},media:'street'}),
ch('请山本评议失败记录，决定是否继续研究',{skills:9,freedom:3},'没有获得预期结果的记录也有用途。你们明确下一次要检验什么，而不是承诺突破。',{bond:0,flag:{yEvidence:true},media:'school'}),
ch('留一个空闲周末，不安排新项目',{health:7,stress:-7},'机器暂时关着，生活并没有因此停下来。',{media:'home'})];
if(f.yCustomer)choices.push(ch('与父亲为老客户整理维护记录和清楚报价',{career:7,family:5,network:5},'早年的试用让你知道客户真正担心什么。你们用清楚的服务记录减少误会，不靠神奇发明保证发财。',{require:x=>x.storyPeople[0].closeness>=65,requireText:'曾在店里试用原型，且与父亲亲近度至少65',income:1.08,flag:{yService:true},media:'office'}));}
}
return choices?{title,text,choices}:null;}
const daily={
chen01:[
['父亲在客厅摊开样本册','你只是下楼倒水，父亲却想听你评价一块面料。母亲说晚饭快凉了。',[
['先一起吃饭，另约看样本的时间',{family:4,stress:-3},'父亲收好样本册，晚饭没有变成会议。',{person:0,flag:{chenDinner:true},media:'home'}],
['花一会儿听他解释面料，再去吃饭',{skills:3,family:2},'你听见他对工艺的在意，而不只是控制交期。',{person:0,media:'home'}],
['说明今天想独处，留张便条说明明天的安排',{freedom:4,stress:-3},'你没有拿走家里的支持，也没有承诺今晚继续工作。',{media:'home'}]]],
['沈宁的速写本翻到了最后一页','她想画河边旧楼，你却想到新系列的图案。她笑着说，今天能不能只是散步。',[
['收起商业想法，陪她慢慢走',{family:3,stress:-3},'你们聊的是喜欢的窗户和晚霞，没有新项目。',{bond:1,media:'street'}],
['先问她愿不愿意合作，尊重拒绝',{network:3,freedom:2},'她暂时只想自己画，你记住了这个边界。',{flag:{chenCredit:true},media:'street'}],
['各画各的，约好吃晚饭时再见',{skills:3,stress:-2},'你们不必每一次灵感都一致。',{media:'cafe'}]]],
['打样师傅等你确认一个尺寸','师傅已经改过两次，但你才发现自己写得不清楚。父亲没有替你回答。',[
['承认说明有误，重新核对并留记录',{skills:4,career:2},'修改有了依据，父亲看见你愿意承担自己那部分责任。',{person:0,flag:{chenSchedule:true},media:'office'}],
['请周岚解释版型，再给师傅答复',{skills:5},'你先弄懂问题，没有假装自己已经会了。',{bond:0,media:'school'}],
['暂停这次打样，让现有订单先走',{freedom:3,stress:-2},'你把灵感留到下一次，不占用已答应客户的时间。',{media:'office'}]]],
['母亲问你周末是否回家','她只是想一起试一道新菜，并不准备劝你接班。沈宁也有自己的周末安排。',[
['回家帮忙做饭，手机留在一边',{family:5,stress:-3},'菜没有做得特别好，大家还是吃完了。',{person:0,flag:{chenDinner:true},media:'home'}],
['邀请沈宁来，但让她自己决定',{family:3,network:2},'她这次有事，你们约好改天再见。',{bond:1,media:'home'}],
['告诉母亲想休息，约下一个周末',{health:4,freedom:3},'一个平静的周末，没有隐藏的惩罚。',{media:'home'}]]]
],
yusuke91:[
['妹妹画了一张难懂的电路图','美咲把你的说明画成给普通人看的图，省略了你认为很重要的部分。你们差点吵起来。',[
['请她解释第一次使用的人会怎样看',{skills:4,family:2},'你发现自己默认别人懂得太多，记下界面需要修改的地方。',{bond:1,flag:{yInterface:true},media:'home'}],
['各画一个版本，约好一起比较',{skills:3,freedom:2},'不同的表达暂时并排放着，不急着分胜负。',{media:'home'}],
['先放下图纸，一起去买晚饭',{health:3,stress:-3},'争论没有变成家庭决裂，今晚先吃饭。',{media:'street'}]]],
['父亲提前收了工具','店里难得清闲，父亲问你要不要出去走走。工作台上还有一件没完成的个人原型。',[
['关灯出门，听父亲说街坊的近况',{family:4,stress:-3},'你们没有谈技术，父亲也有工作之外想讲的事。',{person:0,flag:{yWalk:true},media:'street'}],
['先约好散步时间，把手头这一步记录好',{skills:3,family:2},'记录让你可以安心停下，不必每次重新猜上次做到哪里。',{flag:{yNotes:true},media:'office'}],
['留在家里休息，让父亲自己走一会儿',{health:4,stress:-2},'你们各自度过一个普通晚上。',{media:'home'}]]],
['客户说机器还是不好用','故障已经修好，但一位老客户仍看不懂操作。父亲问你是否愿意听完对方的描述。',[
['请客户演示，再写一张简单说明',{network:4,skills:2},'问题出在操作顺序。你没有把客户当作不懂技术的麻烦。',{person:0,flag:{yCustomer:true},media:'office'}],
['请美咲帮忙画说明，明确她的署名',{skills:3,family:3},'她答应做一页，更多设计需要重新商量。',{bond:1,flag:{yInterface:true},media:'office'}],
['先交给熟悉客户的父亲，自己整理维修记录',{skills:4,stress:-2},'你承认今天的耐心有限，把交接写清楚。',{flag:{yNotes:true},media:'office'}]]],
['山本在记录边上写了一个问号','一次测试缺少温度和测量条件。山本没有责备你，只问这份结果能否被别人重复。',[
['补做对照，连失败的结果一起保存',{skills:5},'你留下可复核的条件，研究不只保留好看的那一页。',{bond:0,flag:{yEvidence:true},media:'school'}],
['先承认记录不完整，约时间重做',{skills:3,stress:-2},'这次结果没有当作证据提交，你保留重新检验的机会。',{media:'school'}],
['暂停额外研究，把本周交付和睡眠安排好',{health:4,freedom:3,stress:-3},'山本接受你暂缓的决定，没有因此否定你的能力。',{media:'home'}]]]
]};
const api={ids,people,major,daily};root.LifeStoryExpansion=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
