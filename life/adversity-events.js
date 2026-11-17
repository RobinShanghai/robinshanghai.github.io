(function(root){
const options={
 lin01:[['整理成绩，申请学习资助','先到县城做带薪学徒','保留零工，借书准备入学','与堂姐安排临时住宿'],['补充助学材料，等待评审','接受修理店的带薪岗位','请赵敏帮忙核对申请','暂缓搬家，先保住住处']],
 sam73:[['申请带薪维修学徒','增加清洁班次，先补房租','兼职学习基本维修','与家人划分可承担的房租'],['与房东商定分期安排','争取修理铺固定班次','请 Frank 帮忙核对工作报价','拒绝替亲属作无限担保']],
 ruth73:[['申请兼容轮班的课程名额','与雇主商定固定班次','利用间隙完成学习任务','与 Joan 商量轮流照护'],['申请调换课程时段','先保证复诊，改接晚班','与 Joan 交换一次照护时间','暂停本期课程，保留下期申请']],
 aki91:[['提交书面诊断作品申请岗位','选择可书面交接的工作','兼职学习电路课程','与田中讨论沟通和设备安排'],['要求书面题目再参加评估','寻找采用书面工单的岗位','请晴子协助整理演示材料','婉拒不合适岗位，保留现有工作']],
 seo97:[['申请仓库记账训练岗位','优先取得固定劳动收入','工作之余学习账务','与父母明确生活费支持上限'],['只用自己的履历申请岗位','增加工时，提供有限生活费','请崔英帮助核对家庭账目','拒绝个人担保，保留学习预算']],
 ana94:[['提交训练记录申请减免','保留工作，维持业余训练','与 Beatriz 轮流照顾弟妹','请教练安排本地体能测试'],['申请试训与班次协调','保留工资，参加下次选拔','与 Beatriz 交换训练和照护时间','选择本地赛事，暂不远行']]
};
function event(s,c,step,ch){const u=c.living;let title,text,choices;
 const opt=options[c.id];if(!opt)return null;
 if(step===0||step===2){const labels=opt[step===0?0:1];title=c.hardEvents[step===0?0:1];text=step===0?c.family+' '+c.educationBarrier+'。'+c.mentor+'愿意帮助你核对可行路径，任何名额都需要申请。':c.special+'。'+c.obligation+'。'+(s.flags.aid?'前次申请获得了支持，但支持有范围，不是无限保障。':'现有收入仍要优先覆盖必需生活。');
 choices=[ch(labels[0],{skills:6,stress:3},'你认真准备材料并说明自己的实际条件。',{chance:.35,successSet:{education:'获得阶段性学习或训练支持',role:'受支持的学习者'},successFlag:{aid:true,path:'study'},successIncome:1.1,flag:{path:'applicant'}}),ch(labels[1],{career:6,stress:6},'你把时间换成更稳定的劳动收入，学习计划暂缓而不是作废。',{income:1.25,set:{role:c.id==='ana94'?'兼职劳动者与业余跑者':c.id==='aki91'?'书面工单技术学徒':'固定班次工作者'},flag:{path:'work'}}),ch(labels[2],{skills:7,stress:5,network:3},'支持是互相协调的结果，你保留工作，也慢慢积累能力。',{bond:1,flag:{path:'mixed'}}),ch(labels[3],{family:5,stress:-4,freedom:4},'你说明了能承担的范围，没有用无法兑现的承诺换取暂时安心。',{flag:{boundaries:true,path:'support'}})];}
 if(step===5){title='有限时间里的学习安排';text=c.educationBarrier+'。你需要考虑'+c.obligation+'。全日训练不能假设工资照常发放。';choices=[ch('申请有补助的训练名额，获批后再离岗',{skills:6},'申请期间继续现有工作，等待实际结果。',{months:12,chance:.4,successFlag:{qualification:true},successSet:{education:'完成补助支持的专业训练'},successIncome:1.3}),ch('继续工作，完成业余学习',{skills:12,stress:8},'进度慢些，但你维持了生活收入。',{months:18,flag:{trained:true}}),ch('与导师交换劳动和技能指导',{skills:10,network:5},'指导不收费，你投入时间协助实际任务。',{months:12,bond:0,flag:{mentored:true}}),ch('暂缓正式课程，优先休整与照护',{health:6,family:8,stress:-8},'这一年没有取得新资格，但生活得以继续。',{months:12,flag:{balanced:true}})];}
 if(step===6){title=c.hardEvents[2];text=c.mentor+'带来新的消息：'+c.hardEvents[2]+'。'+(s.flags.qualification||s.flags.aid?'之前获得的训练支持让你有了作品和学习记录。':'你带着已有劳动经验前来，仍需满足对方的实际要求。')+' '+c.friend+'希望你也保留自己的选择。';choices=[ch('提交作品或劳动记录，争取正式机会',{skills:5,stress:4},'你的经历进入评估，并不能提前确定名额。',{months:12,chance:.35,successIncome:1.7,successSet:{role:c.id==='ana94'?'获得支持的竞技跑者':c.id==='aki91'?'设备诊断技术员':'专业岗位工作者'},successFlag:{mobility:true}}),ch('保持现有工作，积累现金储备',{career:5,stress:-3},'收入增加有限，但你能安排日常支出。',{months:12,income:1.12,flag:{reserve:true}}),ch('与伙伴试做有预算上限的小项目',{savings:-u,network:7,stress:5},'你投入了一笔可见成本。项目可能回款，也可能无法收回。',{months:12,require:x=>x.savings>=u,requireText:'现金至少覆盖一个月必需生活费',chance:.35,successIncome:1.4,successFlag:{owned:true},successSet:{role:'小项目经营者'}}),ch('选择时间可控的工作，靠近重要的人',{family:9,health:5,stress:-7},'财富没有跃升，但你为日常关系和身体留出空间。',{months:12,flag:{balanced:true}})];}
 if(step===7){title='先看清能承担的预算';text=c.friend+'邀请你一起考虑新的合作。你的住房情况是：'+c.housing+'。只投入当前可动用的现金，不把家人的资产当作自己的。';choices=[ch('用一个月生活费做小规模试验',{savings:-u,skills:4},'本金已经投入，回款取决于真实结果。',{require:x=>x.savings>=u,requireText:'现金至少覆盖一个月生活费',chance:.35}),ch('只提供专业劳动，不出资',{skills:5,network:4},'你用能力参与，不承担投资本金损失。',{bond:1}),ch('继续现职，暂不加入合作',{career:3,stress:-4},'你保留稳定的工作时间。'),ch('核对计划，帮助伙伴缩小规模',{network:6,family:3},'你们把计划改得更具体，没有因此保证盈利。',{bond:1})];}
 return title?{title,text,choices}:null;
}
root.AdversityEvents=event;if(typeof module!=='undefined')module.exports=event;
})(globalThis);
