(function(root){
const options={
 lin01:[['整理成绩，申请学习资助','先到县城做带薪学徒','保留零工，借书准备入学','与堂姐安排临时住宿'],['补充助学材料，等待评审','接受修理店的带薪岗位','请赵敏帮忙核对申请','暂缓搬家，先保住住处']],
 sam73:[['申请带薪维修学徒','增加清洁班次，先补房租','兼职学习基本维修','与家人划分可承担的房租'],['与房东商定分期安排','争取修理铺固定班次','请 Frank 帮忙核对工作报价','拒绝替亲属作无限担保']],
 ruth73:[['申请兼容轮班的课程名额','与雇主商定固定班次','利用间隙完成学习任务','与 Joan 商量轮流照护'],['申请调换课程时段','先保证复诊，改接晚班','与 Joan 交换一次照护时间','暂停本期课程，保留下期申请']],
 aki91:[['提交书面诊断作品申请岗位','选择可书面交接的工作','兼职学习电路课程','与田中讨论沟通和设备安排'],['要求书面题目再参加评估','寻找采用书面工单的岗位','请晴子协助整理演示材料','婉拒不合适岗位，保留现有工作']],
 seo97:[['申请仓库记账训练岗位','优先取得固定劳动收入','工作之余学习账务','与父母明确生活费支持上限'],['只用自己的履历申请岗位','增加工时，提供有限生活费','请崔英帮助核对家庭账目','拒绝个人担保，保留学习预算']],
 ana94:[['提交训练记录申请减免','保留工作，维持业余训练','与 Beatriz 轮流照顾弟妹','请教练安排本地体能测试'],['申请试训与班次协调','保留工资，参加下次选拔','与 Beatriz 交换训练和照护时间','选择本地赛事，暂不远行']]
};
// Work, care and training have different consequences even when the next scene occurs in the same month.
const secondDecisions = {
  sam73: {
    text:'房东在门边等一个还款日期。父亲拿不准下周还有几天活，Frank 的修理铺倒有几张排好的工单。',
    choices:[
      ['和房东商量分期，只答应眼下付得起的一笔',{stress:-4,freedom:3},'你们把眼前的一笔和余款分开写。欠租还在，下一次碰面已有具体日期。',{flag:{rentPlan:true}}],
      ['接下 Frank 修理铺的固定班次，把工钱留给房租',{skills:5,career:4,stress:3},'你拿到每周相同的班表，可以照发薪日安排房租。',{set:{role:'修理铺轮班工'},income:1.12,bond:0}],
      ['把零工的报价拿给 Frank 看，再决定接哪一单',{skills:6,network:2},'扣除来回车费后，那份远处的活并没有看起来那么划算。你留下了近处的工单。',{bond:0}],
      ['只答应分担自己的房租，不给亲属签担保',{freedom:6,family:-2},'父亲一时没有接话。你把自己能分担的部分写在纸上，把担保栏留空。',{flag:{boundaries:true}}]
    ]},
  ruth73: {
    text:'Mary 在夜校黑板上写下新课表。母亲的复诊在同一天，洗衣店的排班还来得及调一次。',
    choices:[
      ['带上班表去找 Mary，问能否换到另一个课堂',{skills:4,network:2},'Mary 找到一节可以补听的课，在你的讲义上圈出日期。这学期的其他课仍得逐次安排。',{bond:0}],
      ['先陪母亲复诊，换到晚班工作',{family:6,stress:4},'母亲把一直想问的事说给医生听。傍晚你去洗衣店报到，错过的那节课留下了讲义。',{}],
      ['跟 Joan 换一次照护时段，空出这堂课',{network:5,skills:3},'Joan 记下这次的时间，你答应下周替她办一件事。下一次复诊仍要再问。',{bond:1}],
      ['暂停这期课程，问清下一期的报名日',{health:5,stress:-5},'Mary 把报名日写在信封背面。你放回这一期的课本，没有领到结课资格。',{flag:{courseBreak:true}}]
    ]},
  aki91: {
    text:'面试者隔着嘈杂的柜台念故障现象。田中带来了你做过的工单，你想让对方看清自己实际怎样查出问题。',
    choices:[
      ['请面试者把故障题写下来，再做示范',{skills:6,freedom:4},'故障现象写清后，你把检测顺序逐项标出来。留给对方的是可以复核的记录，岗位仍待答复。',{flag:{writtenAssessment:true}}],
      ['去另一个车间问使用书面工单的岗位',{network:5,career:3},'那里的负责人让你看实际工单，约好另一天带一份修理记录来。',{}],
      ['请晴子帮忙整理示意图，由自己回答技术问题',{skills:4,network:4},'晴子给图配上说明，你在图纸旁签下各自的名字。面试时怎么解释仍由你决定。',{bond:1}],
      ['婉拒这场面试，回维修点完成手里的活',{freedom:6,stress:-3},'你向田中说明原因，把下午留给已经答应客户的修理。现有工钱照常。',{}]
    ]},
  seo97: {
    text:'亲属把担保单放到餐桌上。父亲请你帮着看账，仓库也正收人事申请。你能答应的事和愿意承担的债，是两回事。',
    choices:[
      ['收起担保单，只用自己的履历去申请岗位',{career:4,freedom:5},'仓库留下你的履历，请你等通知。申请上没有填父母的小店，也没有加上你的担保。',{}],
      ['增加一班工作，把额外工钱的一部分交到家里',{family:5,health:-2,stress:3},'你多接一班，给父母一笔说好上限的生活费。下个月的安排得再商量。',{}],
      ['请崔英一起核对账目，把个人和小店的账分开',{skills:6,network:3},'崔英把两本账分开摆好，一起圈出还没核实的收据。你没有替家里签字。',{bond:0}],
      ['退回担保单，把学费留在自己的账上',{freedom:6,stress:2},'亲属收回了单子。父亲还要继续协商，你给学习预留的那笔钱仍由自己安排。',{flag:{boundaries:true}}]
    ]},
  ana94: {
    text:'俱乐部贴出了试训日期，和你的工作班次撞上了。Teresa 有报名表，Beatriz 拿着要接弟妹的时间单。',
    choices:[
      ['把班表带给 Teresa，申请另一个试训时段',{skills:4,network:3},'Teresa 替你递交了换时段的请求。你保留原先的工作安排，等到收到答复再请假。',{bond:0}],
      ['保留这班工，把下一场公开选拔记下来',{career:3,freedom:4},'这班工的工资保住了。你在日历上圈出下次选拔，还要按时交表。',{}],
      ['和 Beatriz 各换一个照护时段，两人都留出训练时间',{family:5,network:4},'两张时间单终于对上。你们能各训练一次，却还得自己争取比赛名额。',{bond:1}],
      ['只报附近能往返的比赛，继续在本地训练',{health:4,skills:4},'Teresa 和你看过本地赛程。你省下远行的路费，报名表上的成绩栏还空着。',{flag:{localMeet:true}}]
    ]}
};
const openingRoles = {
  lin01:['助学名额申请人','获得资助的进修学生','县城带薪学徒'],
  sam73:['维修学徒申请人','带薪维修学徒','清洁轮班工'],
  ruth73:['夜校课程申请人','兼读课程的洗衣店工人','洗衣店固定班工人'],
  aki91:['技术岗位申请人','采用书面工单的技术学徒','书面交接的维修工'],
  seo97:['仓库训练岗位申请人','仓库记账学徒','仓库轮班工'],
  ana94:['俱乐部试训申请人','获减费试训的跑者','兼职劳动者与业余跑者']
};
function workingDecision(s,c,step,ch, scene){
  if(s.narrativeVersion!==1)return scene;
  if(step===0){
    const [applicant,accepted,work]=openingRoles[c.id];
    const [apply,employment,mixed,care]=scene.choices;
    return {...scene,choices:[
      {...apply,set:{role:applicant},successSet:{role:accepted,education:c.id==='lin01'?'获得阶段性学习支持':s.education}},
      {...employment,set:{role:work}},
      {...mixed,result:c.id==='ana94'?'你和 Beatriz 轮流腾出时间照顾弟妹，各自保留了能去训练的下午。':'你在现有生活里留出一段能坚持的学习时间，进度取决于接下来的排班。',bond:c.id==='ana94'?1:undefined},
      {...care,result:c.id==='ana94'?'Teresa 记下你能到场的日子，本地测试先从记录状态开始。':c.id==='aki91'?'田中和你对好书面交接的方式，设备需求也逐项记录下来。':care.result,bond:['ana94','aki91'].includes(c.id)?0:c.id==='ruth73'?1:undefined}
    ]};
  }
  const row=step===2&&secondDecisions[c.id];
  if(!row)return scene;
  return {...scene,text:row.text,choices:row.choices.map(([label,effect,result,extra])=>ch(label,effect,result,extra))};
}

function event(s,c,step,ch){const u=c.living;let title,text,choices;
 const opt=options[c.id];if(!opt)return null;
 if(step===0||step===2){const labels=opt[step===0?0:1];title=c.hardEvents[step===0?0:1];text=step===0?c.family+' '+c.educationBarrier+'。'+c.mentor+'愿意帮助你核对可行路径，任何名额都需要申请。':c.special+'。'+c.obligation+'。'+(s.flags.aid?'前次申请获得了支持，但支持有范围，不是无限保障。':'现有收入仍要优先覆盖必需生活。');
 choices=[ch(labels[0],{skills:6,stress:3},'你认真准备材料并说明自己的实际条件。',{chance:.35,successSet:{education:'获得阶段性学习或训练支持',role:'受支持的学习者'},successFlag:{aid:true,path:'study'},successIncome:1.1,flag:{path:'applicant'}}),ch(labels[1],{career:6,stress:6},'你把时间换成更稳定的劳动收入，学习计划暂缓而不是作废。',{income:1.25,set:{role:c.id==='ana94'?'兼职劳动者与业余跑者':c.id==='aki91'?'书面工单技术学徒':'固定班次工作者'},flag:{path:'work'}}),ch(labels[2],{skills:7,stress:5,network:3},'支持是互相协调的结果，你保留工作，也慢慢积累能力。',{bond:1,flag:{path:'mixed'}}),ch(labels[3],{family:5,stress:-4,freedom:4},'你说明了能承担的范围，没有用无法兑现的承诺换取暂时安心。',{flag:{boundaries:true,path:'support'}})];}
 if(step===5){title='有限时间里的学习安排';text=c.educationBarrier+'。你需要考虑'+c.obligation+'。全日训练不能假设工资照常发放。';choices=[ch('申请有补助的训练名额，获批后再离岗',{skills:6},'申请期间继续现有工作，等待实际结果。',{months:12,chance:.4,successFlag:{qualification:true},successSet:{education:'完成补助支持的专业训练'},successIncome:1.3}),ch('继续工作，完成业余学习',{skills:12,stress:8},'进度慢些，但你维持了生活收入。',{months:18,flag:{trained:true}}),ch('与导师交换劳动和技能指导',{skills:10,network:5},'指导不收费，你投入时间协助实际任务。',{months:12,bond:0,flag:{mentored:true}}),ch('暂缓正式课程，优先休整与照护',{health:6,family:8,stress:-8},'这一年没有取得新资格，但生活得以继续。',{months:12,flag:{balanced:true}})];}
 if(step===6){title=c.hardEvents[2];text=c.mentor+'带来新的消息：'+c.hardEvents[2]+'。'+(s.flags.qualification||s.flags.aid?'之前获得的训练支持让你有了作品和学习记录。':'你带着已有劳动经验前来，仍需满足对方的实际要求。')+' '+c.friend+'希望你也保留自己的选择。';choices=[ch('提交作品或劳动记录，争取正式机会',{skills:5,stress:4},'你的经历进入评估，并不能提前确定名额。',{months:12,chance:.35,successIncome:1.7,successSet:{role:c.id==='ana94'?'获得支持的竞技跑者':c.id==='aki91'?'设备诊断技术员':'专业岗位工作者'},successFlag:{mobility:true}}),ch('保持现有工作，积累现金储备',{career:5,stress:-3},'收入增加有限，但你能安排日常支出。',{months:12,income:1.12,flag:{reserve:true}}),ch('与伙伴试做有预算上限的小项目',{savings:-u,network:7,stress:5},'你投入了一笔可见成本。项目可能回款，也可能无法收回。',{months:12,require:x=>x.savings>=u,requireText:'现金至少覆盖一个月必需生活费',chance:.35,successIncome:1.4,successFlag:{owned:true},successSet:{role:'小项目经营者'}}),ch('选择时间可控的工作，靠近重要的人',{family:9,health:5,stress:-7},'财富没有跃升，但你为日常关系和身体留出空间。',{months:12,flag:{balanced:true}})];}
 if(step===7){title='先看清能承担的预算';text=c.friend+'邀请你一起考虑新的合作。你的住房情况是：'+c.housing+'。只投入当前可动用的现金，不把家人的资产当作自己的。';choices=[ch('用一个月生活费做小规模试验',{savings:-u,skills:4},'本金已经投入，回款取决于真实结果。',{require:x=>x.savings>=u,requireText:'现金至少覆盖一个月生活费',chance:.35}),ch('只提供专业劳动，不出资',{skills:5,network:4},'你用能力参与，不承担投资本金损失。',{bond:1}),ch('继续现职，暂不加入合作',{career:3,stress:-4},'你保留稳定的工作时间。'),ch('核对计划，帮助伙伴缩小规模',{network:6,family:3},'你们把计划改得更具体，没有因此保证盈利。',{bond:1})];}
 return title?workingDecision(s,c,step,ch,{title,text,choices}):null;
}
root.AdversityEvents=event;if(typeof module!=='undefined')module.exports=event;
})(globalThis);
