/* Objects, people and promises that can return later in the same playthrough. */
(function (root) {
'use strict';

// Each scene has two invitations. People who can convene a room hear the first.
// People who have developed an eye for detail notice the second.
const encounters = {
  ethan73: {
    opening:'Nora 留下的试镜地址', title:'候场室里少了一个人', media:'theatre',
    situation:'读本会快开始了，和新人搭戏的人还在路上。一摞角色页放在窗台上，Nora 在门边问谁愿意先试。',
    public:'交上自己的角色页，按顺序试读', practice:'坐在后排记下停顿，留下再试的地址',
    social:['召集等候的演员，先轮流搭一遍戏','候场的人挪开了椅子。演对手戏的姑娘在你的角色页背面写了名字。','约那位搭戏的演员，再排一次双人场'],
    insight:['找出两版台词的不同，给大家标好停顿','你把两份错开的页码排在一起。Nora 留下了那本有批注的剧本。','带着批注过的剧本，争取一次读剧助理的轮值']
  },
  chen01: {
    opening:'桌上放着一只样衣袋', title:'样衣上的两种签名', media:'design',
    situation:'客户送回一件样衣。设计图写着沈宁的名字，随货的小卡却只印了工厂名。样衣下午要交，你们还有一个上午。',
    public:'把改过的样衣按时送去，附上设计名单', practice:'留下纸样，等下一次有署名约定再投',
    social:['请打版师和沈宁一起向买手介绍这件衣服','买手听完两个人的解释，把下次看样的邀请寄给了她们两个。','陪打版师和沈宁去看样会，让她们先发言'],
    insight:['对照纸样与成衣，把改动标回原作者名下','你翻到被覆盖的那层纸样。沈宁认出了自己改过的袖口。','拿着那层纸样，把打版记录整理成册']
  },
  noah73: {
    opening:'空白磁带还剩一面', title:'录音红灯亮起之前', media:'studio',
    situation:'录音师把空白带穿过磁头。June 带来一张歌词纸，鼓手只能待到晚班开工。大家得决定把这段棚时用在哪里。',
    public:'录一遍完整的歌，交给制作人试听', practice:'抄下谱子，回家用旧琴练较难的段落',
    social:['请 June 领唱副歌，让乐队跟着她试一遍','副歌唱到第二遍时，鼓手换了节奏。June 把合唱那条带子留下了。','借回那条合唱带，让 June 一起编第二声部'],
    insight:['分别试听人声和底鼓，找到总被盖住的那句词','你在盒盖上标了走带位置。录音师交班时特地把这个记号指给下一位。','拿着那盒磁带，跟值班录音师学一次混音']
  },
  maya94: {
    opening:'裁缝铺门口的通告', title:'镜头外也有人在说话', media:'camera',
    situation:'试镜间只有一盏灯。试戏的片段写着母女争执，可对戏的人只负责念提示。Lucia 坐在角落，等你决定怎么演。',
    public:'按试镜流程把这段戏演完', practice:'抄下人物小传，带回剧团再排',
    social:['问对戏的人愿不愿意坐进光里，一起演完这场争执','她放下提示纸，第一次抬头看了你。收工时她问下次能不能再一起读戏。','带那位对戏伙伴到剧团，排一次双人小场'],
    insight:['从台词里找出母亲没有说出口的事，再试一次','你停在那句答非所问的对白上。Lucia 在自己的台本里夹了一张签。','和 Lucia 重读夹签的那页，整理人物笔记']
  },
  yusuke91: {
    opening:'柜台上的第一台样机', title:'波形忽然断了一截', media:'electronics',
    situation:'演示桌上的传感器刚才还好好的，一接上长线就丢了一段信号。山本把下周的试用表留在桌上。',
    public:'交上现有的试用记录，写明故障', practice:'先把样机带回去，把接线再做一遍',
    social:['请操作员一起演示，让每个人说出手上那一步','大家轮流碰了碰接头，操作员终于说起自己平时怎样布线。他请你去现场看看。','到操作员的工作台旁，记录一个完整班次'],
    insight:['交换两根导线，留下能重复出现的故障波形','波形在同一处断开。山本借你一本记录簿，约好下次再接同一套线。','重搭记录簿里的电路，做一套对照试验']
  },
  jieun97: {
    opening:'预算会议旁的空位', title:'会议室最后一把椅子', media:'office',
    situation:'集团拨款会议快结束时，两家小承运商还在门外等。表上的到款日很整齐，司机说自己等的却是上个月那一笔。',
    public:'把承运商的说明随会议记录递交', practice:'回仓库跟一班车，补上交接记录',
    social:['请司机和财务一起进来，各自讲完一次交接','司机说完，出纳也翻出了退回的单子。两人约你下次到仓库核对。','应约去仓库，让司机和出纳当面走一遍交接'],
    insight:['把同一票货的签收、开票和入账日期对在一起','三张单据说的是同一票货，却跨了两个月。韩秀珍把复印件交给你继续查。','循着那份复印件，把下一批运单核到末页']
  },
  lukas89: {
    opening:'印刷机旁的一叠来稿', title:'采访对象划掉了一行字', media:'school',
    situation:'独立书稿就要送印。受访者用铅笔删去了一句话，Felix 的照片却恰好拍到了那件事。Greta 在等最后一份校样。',
    public:'交一版删去引语和相关照片的校样', practice:'暂缓这页付印，自己重读采访记录',
    social:['邀受访者和 Felix 坐下来，一起挑可刊出的照片','受访者指着窗边的一张说，这张才像我们的生活。Felix 留了一份联系印样。','带着联系印样，请受访者一起做下一页图注'],
    insight:['把底片编号和逐字稿逐条核对，标出误配的图注','你在页边圈出了错位的两个编号。Greta 把下一份校样单独留给你。','拿着那张有圈记的校样，跟一回印厂夜班']
  },
  camille08: {
    opening:'泳道边的选拔名单', title:'最后半条泳道', media:'pool',
    situation:'闭馆前剩下半条可用泳道，选拔报名还缺一段训练记录。Alex 在池边拿着表，Lea 也正等这段水线。',
    public:'按报名要求游一组，请教练记时', practice:'在岸上复盘动作，改天补测',
    social:['邀请 Lea 和候场的队友轮流领游、轮流记圈','原本各等各的队友凑成一组。离开泳池时，Lea 问你周末还组不组。','和上次那组队友留半条泳道，练一次接力交接'],
    insight:['把前后半程拆开记时，找出掉速的那个转身','转身附近的两次记录差得格外多。Alex 给你留了一张分段表。','用那张分段表，专门练容易掉速的转身']
  },
  lin01: {
    opening:'老师留着一张报名表', title:'公告栏上叠着两张通知', media:'school',
    situation:'县城公告栏刚贴出勤工与旁听安排，两张纸边缘卷在一起。林燕快要去上工，赵敏让你先看清楚再决定。',
    public:'在公开登记册上填下自己的可到时间', practice:'抄下旁听地址，先回去把功课补齐',
    social:['叫上同路的学徒，一起找值班老师商量轮换','几个人凑出了一张轮值表。老师让你们下周带着各自的班次再来。','带着学徒们的班表，去试排一次轮换'],
    insight:['对照两张表，圈出兼容零工和旁听的半天','原来两张纸上的时间指的是不同的教室。赵敏在你的抄件上签了名。','依照那份签过名的课表，去旁听第一节课']
  },
  sam73: {
    opening:'修理铺开门以前', title:'柜台上有一只退回来的零件', media:'electronics',
    situation:'修理铺的顾客说车修过还是有异响。Frank 正赶着下一单，柜台上放着换下来的零件和一张沾油的工单。',
    public:'把返修情况写上工单，排进当天的队', practice:'留在铺里，先跟一遍正常的检修',
    social:['请顾客再说一遍听见异响的时刻，约师傅一同听','顾客提到只有刚开出巷口才响。Frank 请你在下次交车时也到场。','赶在交车前回到铺里，让顾客自己听一遍'],
    insight:['对照两张工单上的型号，取回包装盒核实','包装盒和工单末尾的字母不一样。Frank 把两张单子钉进返修簿。','翻开返修簿，用旧件练一次逐项核对']
  },
  ruth73: {
    opening:'夜校的灯还亮着', title:'夜校门上的调课条', media:'school',
    situation:'教室门上贴了一张调课条。几位轮班学生站在那里，谁都不敢说自己下周一定能来。Mary 把点名册夹在臂弯里。',
    public:'把能到的晚上登记给 Mary', practice:'借今天的讲义回去，等班表确定再来',
    social:['让轮班同学各写一个能来的时段，带去和 Mary 商量','白纸上第一次排出了能坐满一桌的晚上。Mary 把钥匙借给那天最早到的人。','去开门最早的那一桌，轮流把漏掉的课讲给别人'],
    insight:['并排抄下课表和车次，拼出能赶上的一组课','别人只看见撞班，你在纸上找出了两个能连上的时段。Mary 留下了你的抄本。','按那份抄本跑一趟，把最晚能赶上的车补进去']
  },
  aki91: {
    opening:'一张可以写清楚的工单', title:'控制板旁边缺了一行字', media:'electronics',
    situation:'招聘方把旧控制板摆上桌，只说可以试做。田中要等一份诊断，晴子带来纸笔，面板上两个按钮的字快磨没了。',
    public:'提交书面诊断，把无法确认的部分圈出', practice:'抄下面板编号，回维修店先查手册',
    social:['请操作员用手势演一遍，同时用纸笔确认每一步','操作员拿笔画出了停机时的顺序。晴子把那张图留给你们共同修改。','请操作员和晴子重看那张图，试做一张图示工单'],
    insight:['沿指示灯的顺序排查，画出两个按钮的区别','你在表格上标出两条截然不同的回路。田中空出了一个下午让你复测。','在约好的下午，用两条回路验证书面诊断']
  },
  seo97: {
    opening:'仓库里借来的一支铅笔', title:'收货本上多了一笔', media:'office',
    situation:'临时仓库打烊前，收货本上留下一笔没人签名的退货。崔英正在交班，韩美记得货车回来过。',
    public:'把未签收的退货单列出，跟随正常流程交班', practice:'留下整理空箱，把今天的单据按时段排好',
    social:['请当班司机与收货员同桌，把退货经过说清','司机和收货员各补上了自己记得的一段。崔英邀你下次来做交班记录。','去赴崔英的约，跟司机和收货员一起交班'],
    insight:['对照箱签和货号，找出被记了两次的箱子','两列看似相同的数字指向同一只箱子。崔英把那页账留给你作样本。','照着样本另做一页退货账，请崔英复核']
  },
  ana94: {
    opening:'去训练场的那班车', title:'教练手里多了一张报名表', media:'track',
    situation:'俱乐部把测试放在工作日下午。Teresa 手里还有一张未填的报名表，Beatriz 在算回家接弟妹需要留多久。',
    public:'登记能参加的本地测试，等正式通知', practice:'这次先留下，把日常训练跑完',
    social:['邀同班的跑者一起找教练，商量分组起跑','几位跑者不用再各自去请假。Teresa 请你下回提前带来大家的班表。','带着跑者的班表，帮下一场测试排出起跑组'],
    insight:['对照通勤和分段记录，找出不用旷工的测试窗口','你圈出的那一栏原本没人填。Teresa 把窄窄的时间条夹在训练本里。','按训练本夹着的时间条，试跑同一段路']
  },
  zhixia01: {
    opening:'借来的录音机', title:'磁带里有一句不愿播的话', media:'studio',
    situation:'何岚等着试听节目。受访的阿姨喜欢故事开头，却不想让邻居听见后半句。叶舟停下画封面的手。',
    public:'剪去整段私人谈话，交一版试听', practice:'暂缓投稿，先把几盒原带编好目录',
    social:['请阿姨亲手按下暂停键，陪她选出愿意留下的那段','她反复听了两遍，最后自己写下片名，还约你去听早市开门的声音。','应阿姨的约，到早市录下她愿意介绍的人'],
    insight:['把同日两轨录音对齐，单独取出她想保留的环境声','滚轴摩擦声过去，远处有一声车铃。何岚在盒脊上给这个剪点画了圈。','带上标着剪点的磁带，去编辑室做第二次剪辑']
  },
  robin05: {
    opening:'一把吉他，一本空白排练簿', title:'排练室只剩一个下午', media:'theatre',
    situation:'小剧场的排练快散了，制作助理需要一份能交出去的样本。顾言在收电线，陆川问你这一个下午想留下什么。',
    public:'完成一段个人样本，按约交给制作人', practice:'把排练过程写进笔记，先回去练',
    social:['把乐手和演员请到同一张桌旁，商量合做一段开场','有人敲了四拍，有人顺着节拍念了第一句。散场前大家约好再来一次。','回到那张桌旁，把约好的开场同大家排一遍'],
    insight:['对着排练记录寻找换场的空隙，写一页提示单','顾言按你的单子试了一遍，终于在熄灯前收到了提示。他把单子夹进剧本。','把夹在剧本里的提示单带到下一场排练']
  }
};

function apply(s, c, step, ch, scene) {
  const item = encounters[c.id];
  if (step===5 && (s.stress>=60 || s.health<72)) {
    scene={...scene,choices:[...scene.choices,ch('把密集课程推到下期，先把休息日排回去',{health:9,stress:-10,career:-2},'你空出了原先要赶路的那一天。等能睡个整觉，才重新翻开课程表。',{months:3,flag:{protectedRest:true}})]};
  }
  if (step === 0) return {...scene, title:item.opening};
  if (step === 3) {
    const choices = [
      ch(item.public,{skills:4,career:3},'你把手头能交付的部分做完，留下姓名，回去等消息。',{flag:{entry:'open'},chance:.48}),
      ch(item.practice,{skills:9,stress:-3},'你把没有弄明白的地方记了下来。再回到这里时，你知道该先问什么。',{flag:{entry:'practice'}}),
      ch('请'+c.mentor+'陪你准备，自己出面争取',{network:4,skills:3},c.mentor+'指出一个你没留意的细节。轮到你开口时，对方把时间留给了你。',{flag:{entry:'mentor'},bond:0,chance:.53}),
      ch('先把答复缓一缓，保住手头的安排',{freedom:6,stress:-5},'你说明这次能承担的范围，把原先约好的人和事排回日程。',{flag:{entry:'defer'}})
    ];
    for (const [key,available] of [['social',s.traits.social+(s.flags.path==='spotlight'?3:0)>=78],['insight',s.traits.intellect+(s.flags.trained?2:0)>=86]]) {
      if (!available) continue;
      const [label,result]=item[key];
      choices.push(ch(label,key==='social'?{network:8,family:2}:{skills:9,career:2},result,{flag:{invitation:key,entry:key}}));
    }
    return {...scene,title:item.title,text:item.situation,media:item.media,choices};
  }
  const invitation=item[s.flags.invitation];
  if (step===5 && Array.isArray(invitation)) {
    const social=s.flags.invitation==='social';
    return {...scene,text:scene.text+'\n'+invitation[1],choices:[...scene.choices,ch(invitation[2],social?{network:9,skills:4}:{skills:12,career:3},social?'你按约出现。散场前，对方问你下一次愿不愿意带一个新人一起来。':'你把做过的步骤重新验证了一遍，留下了一份别人也能照着用的记录。',{flag:{keptInvitation:true,trained:true},months:6})]};
  }
  if (step===9 && s.flags.keptInvitation) {
    return {...scene,text:scene.text+'\n'+(s.flags.invitation==='social'?'上回约你带新人的伙伴又来了，身后跟着一个有些拘谨的年轻人。':'有人带着你留下的记录来请教，折过角的一页上写满了新问题。'),choices:[...scene.choices,ch('留一个下午，把那次经历教给后来的人',{family:4,network:5,freedom:-2},'临走时，对方用自己的话又讲了一遍。你第一次听见这段经历在别人口中是什么样子。',{flag:{passedOn:true}})]};
  }
  return scene;
}

function grow(s,c) {
  const e=c.effect||{};
  // Listening and collaboration build rapport. A demanding run of shifts can erode it.
  const rapport=(c.bond!==undefined||c.person!==undefined?2:0)+Math.round((e.network||0)/3)+Math.round((e.family||0)/6)-(e.stress>=5?2:0);
  const attention=Math.round((e.skills||0)/4)-(s.stress>75&&e.stress>0?2:0);
  const clamp=n=>Math.max(0,Math.min(100,n));
  s.traits.social=clamp(s.traits.social+rapport);
  s.traits.intellect=clamp(s.traits.intellect+attention);
  s.traits.health=s.health;
  s.traits.network=s.network;
}
const api={apply,grow};
root.LifeOpportunities=api;
if(typeof module!=='undefined')module.exports=api;
})(globalThis);
