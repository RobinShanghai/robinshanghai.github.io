/* Additional fictional personal arcs. Old saves remain unchanged. */
(function(root){
const continued=typeof module!=='undefined'?require('./continued-dialogue.js'):root.LifeContinuedDialogue;
const followups=typeof module!=='undefined'?require('./personal-followups.js'):root.LifePersonalFollowups;
const rows={
noah73:['June 把歌词页翻了过来','June 说副歌有一句来自她的草稿。Martin 想先听完整排练，你却还没有谈清署名。',['把两人的创作部分写清，一起改副歌','保留自己的版本，请 June 独立发表她的歌','请 Martin 听两版，只讨论编曲不裁定归属','暂停这首歌，陪 June 听一场演出'],['你们保留了各自的草稿，并同意在合写作品上共同署名。','June 保留自己的作品，你开始重写可能重合的部分。','Martin 指出两版的节奏差别，署名仍由你们协商。','你们听了一晚别人的歌，关系没有只剩作品争论。'],'一场小演出的节目单','主办方需要确定曲目与作者。June 想知道，你还记不记得那张歌词页。',['带共同署名的版本演出','演自己的新歌，给 June 留独立曲目','缩短节目，保留排练时间','这次只去听，不承担演出'],'theatre'],
maya94:['Paulo 的镜头停了下来','Paulo 希望试拍一段没有妆容修饰的生活片段。Lucia 提醒你，角色需要的脆弱不等于放弃自己的边界。',['谈清可拍内容和使用范围再试一遍','提出另一种表演方法，保留私密经历','请 Lucia 陪同讨论，再决定是否拍摄','谢绝试拍，和 Paulo 普通地吃顿饭'],['你们约定片段仅用于这次作品讨论，不把许可无限扩大。','你用虚构动作塑造人物，没有交出私人故事证明投入。','Lucia 帮你问清镜头用途，最终决定仍由你作出。','Paulo 接受了拒绝，晚饭没有变成另一场试镜。'],'样片的使用范围','有人希望把试拍片段用于宣传。Paulo 把新用途告诉你，等待明确答复。',['按新的范围重新授权','只提供公开作品，不使用试拍','要求先看剪辑，再讨论','不参加宣传，保留现有安排'],'camera'],
lukas89:['Felix 不愿交出的底片','出版社想给采访照片配上更醒目的标题。Felix 担心受访者被简化，Greta 要你提出可以执行的编辑方案。',['与受访者核实文字，给摄影者保留署名','另做评论文章，不改采访者原话','请 Greta 逐项审稿，暂缓印刷','退出本组选题，保留与 Felix 的私人交往'],['你把原话、评论和署名分开处理，修改需要多一轮时间。','评论以作者名义发表，不借受访者的嘴表达观点。','Greta 标出需要核实的句子，你承认进度要重新安排。','你不拿朋友关系索取底片，出版社另找选题。'],'印刷前的最后一页','Felix 带来受访者的补充说明，Greta 问你是否还来得及处理。',['核实后修改，说明延期原因','把补充意见放入单独页面','缩小本次出版范围','暂不出版，归还材料'],'office'],
sam73:['Rose 的学校通知','Rose 想参加学校活动，Frank 却问你能否多接一个班。妹妹说她愿意分担，但不希望被你决定所有安排。',['一起核对房租和活动费用','向 Frank 商量换班，留出陪伴时间','请 Rose 自己决定活动，你只说明能支持多少','今晚先吃饭，明天再一起算账'],['你们看见预算缺口，也给妹妹留下选择的空间。','Frank 需要先找人顶班，你没有替他许诺一定能换成。','你说清自己能承担的范围，没有把帮助变成控制。','今晚没有多赚一笔钱，却少了一场疲惫中的争执。'],'Frank 的周末加班单','Rose 又有学校安排，修理铺也缺人。你不必永远用同一种方式承担责任。',['接有限工时，明确下班时间','先协调换班，再回复 Rose','保留工作安排，另约陪伴时间','这次不接额外班，承担少赚的结果'],'office'],
ruth73:['Joan 留下的轮班表','Joan 能帮忙照看母亲，但不能每周都替你顶上。Mary 建议把课程和复诊日期写到同一张纸上。',['与 Joan 列出双方能承担的时段','请 Mary 协助调整学习安排','和母亲谈她希望保留的自主安排','暂停一项额外任务，先恢复睡眠'],['Joan 的帮助有了明确范围，你也答应提前告知变动。','Mary 帮你整理可补的内容，没有保证课程可以无限延期。','母亲说出自己能做的部分，照护不再全靠你猜。','你暂缓额外任务，不把休息解释为不关心家人。'],'那张轮班表需要重写','Joan 的工作时间变了，原先安排不能照搬。Mary 仍愿意讨论你的课程。',['重新协商分工，不默认 Joan 有空','缩减本期课程，保留继续学习的计划','询问母亲愿意接受哪些替代安排','先取消一个额外承诺，腾出时间'],'home'],
aki91:['晴子画出的操作面板','晴子认为你的说明书太像维修记录。田中则问，客户第一次操作时能否看懂。你熟悉电路，却不能替使用者回答。',['请晴子演示一次，再一起改图示','保留技术记录，另写简明使用说明','请田中收集客户的书面反馈','暂停额外开发，先完成现有维修'],['你看见几个容易误解的步骤，把设计署名留给晴子。','两份文档各有用途，不必把每个客户训练成技术员。','书面反馈让问题更明确，也减少了口头沟通的遗漏。','原型暂时留在柜里，按时交付也是一种可靠。'],'一位客户没有照说明操作','田中没有急着责怪客户，晴子想知道界面是否还能更清楚。',['共同修改图示并保留设计署名','请客户演示，再逐步排查','安排书面交接，明确维修范围','暂不扩大产品试用，先做好维护'],'office'],
seo97:['韩美递来的小店草图','韩美想把仓库旁的小空间变成店铺，问你愿不愿意帮忙记账。父亲也在等你核对家里的账，两份责任不能混成一本。',['先分开家庭与朋友的账目','只教韩美核对收支，不担任合伙人','约定有限试算时间，不出资担保','谢绝项目，和韩美保持普通往来'],['你们分别记录收入与支出，没有把友情当作无限担保。','韩美学着自己记账，你保留了下班后的时间。','试算是了解成本，不意味着承诺开店或替人借钱。','她继续寻找办法，你们仍可以讨论晚饭吃什么。'],'草图旁多了一份费用清单','韩美发现实际开销高于预想，父亲也有新账要核对。你需要重新划定责任。',['先核实成本，暂不追加承诺','限定每周帮忙时间','让各自负责自己的账本','退出筹备，保留友谊'],'office'],
ana94:['Beatriz 的训练时间又变了','Beatriz 要照顾弟妹，Teresa 希望你们坚持记录训练。你想争取成绩，也知道伙伴不能永远替你解决通勤与照护。',['一起核对能稳定参加的训练日','各自训练，每周交换一次记录','请 Teresa 调整可执行的训练目标','陪弟弟度过一个不谈成绩的下午'],['你们没有许诺每天都到场，而是找到双方能坚持的时段。','不同安排不等于放弃友谊，记录仍能交流。','Teresa 先看实际时间与恢复情况，没有承诺比赛名次。','这一天没有训练突破，弟弟却终于讲完了学校的故事。'],'比赛通知与工作排班','Teresa 带来一次参赛信息，Beatriz 的时间仍不确定。路费和请假都需要实际安排。',['核对路费和班次，再报名','保留工作，只参加附近训练','与教练商量较晚的比赛','暂缓参赛，把恢复与家人放在前面'],'street']
};
const laterResults = {
  noah73:['主办方收到两人确认过的署名。June 也拿到一份写着自己名字的节目单。','你演自己的新歌。June 收到单独的邀请，唱什么由她自己去谈。','你从节目单上划掉最后一首，带着留下的几页谱回去排练。','灯一暗，你坐在台下。June 的曲目由她自己介绍。'],
  maya94:['宣传方收到你确认的素材和用途。超出这次约定的使用还得再问你。','Paulo 交出的是已经公开的作品。私人素材留在他手里。','剪辑台留了一个位置。你看过画面再回复，宣传方暂时没有发布许可。','宣传单上没有出现你的影像。你如约回到原先的排练。'],
  lukas89:['你联系受访者逐句确认。Greta 把印刷推迟，好让更正赶上版面。','Felix 把新说明做成单页，注明收到的时间和受访者的原话。','你留下已经核实的几页，尚未解决的问题从这期拿掉了。','你把材料装回信封还给 Felix。这个版面先留给另一组选题。'],
  sam73:['Frank 把下班时间写在班表上。你拿到这班工钱，也赶得上和 Rose 吃晚饭。','Frank 找到能换班的人，你按商量好的时间给 Rose 回了话。','你按原来的班表去工作，和 Rose 一起挑了另一个可以出门的日子。','这笔加班费没有进账。Rose 放学时，你已经在门口等她。'],
  ruth73:['你把能承担的时段写出来，Joan 自己勾选愿意帮忙的那一格。','Mary 把剩余课程逐次圈出来。你留下讲义，准备等照护时间允许再续学。','母亲选了一次她愿意自己安排的出门，你在日历上留出那半天。','你撤掉额外约定，按原来的时间陪母亲回家。'],
  aki91:['晴子把容易看反的两个图示重画，你把她的名字留在新版说明的页脚。','客户按自己的习惯演示了一遍。你看到卡住的那一步，把它记进维修单。','田中带走一份写着范围和日期的工单，客户留下同一份副本。','新的试用没有排进日程。你先把已接下的机器一台台交还客户。'],
  seo97:['韩美和你把租金与水电逐笔核实，先划掉一项准备不足的费用。','你们圈出一个晚上对账，其他时段的进货与报价由韩美自己决定。','你把店里的账本交还韩美。父亲家的账另放一处，两边的支出各自承担。','你没有再接筹备任务。傍晚韩美打来电话，约你明天去吃饭。'],
  ana94:['你把车费和当天的班次核实清楚，再把报名单交去。赛果要到跑完才知道。','你回去上班，在附近跑完一段熟悉的路线，错过了这次远行。','Teresa 抄下另一场比赛的日期。你有时间协调班次，名额仍要自己报名。','报名表留在教练手里。你先睡了一个好觉，下午陪弟弟出门。']
};
function revisit(s,c,ch,r) {
  const previous=Number(s.flags.personalApproach);
  const labels=[...r[6]], results=[...laterResults[c.id]];
  let title=r[4], text=r[5];
  if(c.id==='noah73' && previous!==0) {
    labels[0]='请 June 重新听一遍，得到同意再合演';
    results[0]='你没有先报双人曲。June 听完新版本，同意一起试排，你们分别签下了署名。';
  }
  if(c.id==='maya94' && ![0,1].includes(previous)) {
    title='宣传单上还缺一张照片';
    text='宣传方来找 Paulo 借照片。你没有答应过把私人片段交给他们，Paulo 先把空白版样带给你看。';
    labels[0]='重新拍一张公开剧照，只许可这次使用';
    labels[1]='从已公开的作品里选一张';
    labels[2]='先看版样，再决定是否提供照片';
    results[1]='你交出了一张演出时已公开的剧照。私人影像没有进入宣传册。';
    results[2]='你在版样上看见照片预留的位置，决定等宣传文字确认后再回复。';
  }
  if(c.id==='lukas89' && previous===3) {
    title='Felix 带来一份新的采访稿';
    text='上次的选题已经交还。Felix 这次带来另一篇采访和受访者的补充说明，问你愿不愿意再读一次。';
    labels[3]='不接这篇稿子，把材料还给 Felix';
  }
  if(c.id==='seo97' && previous===3){
    text='上回你谢绝了筹备，韩美便自己做了费用清单。这次她把账本放在桌边，问你愿不愿意只看一眼。';
    labels[3]='这次也不参与筹备，另约晚上吃饭';
  }
  if(Number.isInteger(previous)&&r[3][previous])text+='\n你还记得上次：'+r[3][previous];
  const bonds={noah73:[1,1],maya94:[1,1,1],lukas89:[0,1,,1],sam73:[0,1,1,1],ruth73:[1,0],aki91:[1,,0],seo97:[1,1,1,1],ana94:[0,,0]}[c.id];
  const effects=[{skills:5,network:4,stress:2},{freedom:5,skills:3},{family:5,network:2},{health:6,stress:-5}];
  const choices=labels.map((label,i)=>{
    const effect={...effects[i]};
    if(c.id==='sam73'&&i===0)effect.savings=Math.round(c.living/8);
    return ch(label,effect,results[i],{flag:{personalRevision:String(i)},media:r[7],bond:bonds[i]});
  });
  return {title,text,choices};
}

function apply(s,c,step,ch,existing){const r=rows[c.id];if(!r||s.flags.castDepthVersion!=='1')return existing;
if(step===4)return{title:r[0],text:r[1],choices:r[2].map((label,i)=>ch(label,[{skills:5,family:3},{freedom:5,network:3},{skills:6,stress:2},{health:5,stress:-5}][i],r[3][i],{flag:{personalApproach:String(i)},media:r[7],...(i===0?{bond:1}:{})}))};
if(step===8&&s.narrativeVersion===1)return revisit(s,c,ch,r);
if(step===8){const i=Number(s.flags.personalApproach);return{title:r[4],text:r[5]+'\n'+(Number.isInteger(i)&&r[3][i]?'你还记得上次：'+r[3][i]:'这次需要重新谈清各自的安排。'),choices:r[6].map((label,n)=>ch(label,[{skills:5,network:4,stress:2},{freedom:5,skills:3},{family:5,network:2},{health:6,stress:-5}][n],['你核实了当前条件，再作有限承诺。','你调整参与方式，保留其他生活安排。','你把责任说清，也尊重了对方的时间。','你接受这次放下可能少一些机会，但没有因此失去全部人生。'][n],{flag:{personalRevision:String(n)},media:r[7],...(n===0?{bond:0}:{})}))};}
if(step===9&&s.narrativeVersion===1&&s.flags.personalRevision!==undefined&&s.history[0]) {
  const last=s.history[0];
  return {...existing,text:existing.text+'\n你想起「'+last.title+'」那次的决定：'+last.decision+'。'};
}
if(step===9&&s.flags.personalRevision!==undefined)return{...existing,text:existing.text+'\n'+c.friend+'想起了「'+r[4]+'」那次谈话。你选择过：'+r[6][Number(s.flags.personalRevision)]+'。彼此仍可以重新讨论，不必被过去的一次回应固定。'};
return existing;}
const api={ids:Object.keys(rows),apply:(s,c,step,ch,existing)=>followups.major(s,step,continued.major(s,step,apply(s,c,step,ch,existing),ch))};root.LifeCastDepth=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
