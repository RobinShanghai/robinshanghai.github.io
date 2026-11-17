/* 人生模拟器 - 离线规则引擎。无外部依赖，可在微信小程序和普通浏览器中运行。 */
var LifeEngine = (function () {
  var VERSION = 1;
  var profiles = [
    {name:'Ethan Miller', gender:'男', origin:'宾夕法尼亚州伊利', city:'伊利', role:'仓储学徒', salary:30000, savings:2100, health:82, family:73, career:33, stress:31, skills:38, network:29, education:'高中毕业'},
    {name:'Olivia Chen', gender:'女', origin:'加州萨克拉门托', city:'萨克拉门托', role:'餐饮兼职员工', salary:27000, savings:1300, health:79, family:68, career:38, stress:38, skills:44, network:36, education:'高中毕业'},
    {name:'Noah Brooks', gender:'男', origin:'俄亥俄州代顿', city:'代顿', role:'维修助理', salary:34000, savings:850, health:90, family:62, career:35, stress:26, skills:48, network:25, education:'高中毕业'},
    {name:'Maya Rivera', gender:'女', origin:'科罗拉多州普韦布洛', city:'普韦布洛', role:'零售店员', salary:28500, savings:1800, health:84, family:77, career:36, stress:34, skills:43, network:34, education:'高中毕业'}
  ];
  function clamp(n){return Math.max(0,Math.min(100,Math.round(n)));}
  function random(s){if(!s)return Math.random();if(!s.rngState)s.rngState=2463534242;var x=s.rngState;x^=x<<13;x^=x>>>17;x^=x<<5;s.rngState=x>>>0;return s.rngState/4294967296;}
  function randomInt(max,s){return Math.floor(random(s)*max);}
  function money(n){return (n<0?'−$':'$')+Math.round(Math.abs(n)).toLocaleString('en-US');}
  function ageOf(s){return Math.floor(s.ageMonths/12);}
  function createEli(){return {
    version:VERSION, mode:'eli', name:'Eli Walker', gender:'男', origin:'西弗吉尼亚州 Welch', city:'上海', year:2054, month:7, ageMonths:46*12+7,
    role:'Global Supplier Operations Director', salary:174000, savings:35000, health:73, family:78, career:81, stress:61, skills:86, network:79,
    education:'本科毕业', partner:'嘉宁', children:1, childrenNames:['小禾'], parentHealth:65, familyNotes:'嘉宁与小禾在身边；妹妹 Sara 与 Evan 在 Greensboro；老友 Robert 已步入晚年。',
    milestones:['从 Welch 出发，靠技能和机会走上全球供应链管理岗位','完成本科学历','上海派驻，目前年薪 $174,000'],
    history:[], lastResult:'', lastEventIds:[], turns:0, currentSceneId:'eli_crossroads', phase:'scene', ended:false,
    intro:'你曾修好一辆旧 Silverado，也经历过求职碰壁。现在是 2054 年夏天，你正站在又一个人生路口。',
    notice:'注意：除已经发生的经历与年薪外，游戏中的初始存款、属性与未来事件为模拟设定。'
  };}
  function createRandom(profileIndex){var p=profiles[Number.isInteger(profileIndex)&&profileIndex>=0&&profileIndex<profiles.length?profileIndex:randomInt(profiles.length)];return {
    version:VERSION, mode:'random', name:p.name, gender:p.gender, origin:p.origin, city:p.city, year:2026, month:9, ageMonths:18*12+2,
    role:p.role, salary:p.salary, savings:p.savings, health:p.health, family:p.family, career:p.career, stress:p.stress, skills:p.skills, network:p.network,
    education:p.education, partner:null, children:0, childrenNames:[], parentHealth:73, familyNotes:'家人、同事、朋友都有各自的人生，不会永远围绕你转。',
    milestones:['18 岁，刚踏入社会'],history:[],lastResult:'',lastEventIds:[],turns:0,currentSceneId:'young_crossroads',phase:'scene',ended:false,
    intro:'你没有主角光环。城市、学历、家庭与运气都会产生影响，而真正的决定由你做。',
    notice:'随机人生从虚构角色开始；所有收入与事件均为游戏模拟。'
  };}
  function choice(label, months, effect, result, extra){var c={label:label,months:months,effect:effect||{},result:result||''};if(extra){Object.keys(extra).forEach(function(k){c[k]=extra[k];});}return c;}
  var scenes = [
    {id:'eli_crossroads',title:'一封改变薪酬结构的邮件',tag:'主线 · 职业',text:'你在上海的生活已经稳定。现任岗位年薪 $174,000。一家设备企业提出约 $348,000 的总薪酬讨论空间，但股权不确定、合同尚未签。原公司也可能提供更高层的亚洲岗位。你决定怎样走？',only:'eli',choices:[
      choice('主动推进外部 $348k 机会，并要求正式书面条款',4,{stress:9,network:4},'你把最关心的责任边界、上海安排与股权条件都摆到桌上。', {chance:{p:0.62,win:{set:{salary:348000,role:'Global Operations VP'},add:{career:11,stress:8,savings:12000},text:'谈判最终成功，合同签署。收入显著提高，但董事会对你的期待同样变高。'},fail:{add:{career:-5,stress:10,network:3},text:'谈判没有形成可接受的书面条件。你保住现职，却也耗费了精力。'}}}),
      choice('继续在现公司争取亚洲 Director 晋升',6,{skills:4,network:7,stress:4},'你将内部支持者、交付指标与派驻条件逐一梳理。',{chance:{p:0.60,win:{set:{salary:218000,role:'Asia Director'},add:{career:9,family:4},text:'总部批准了内部晋升；薪酬改善、稳定性仍相对较高。'},fail:{add:{career:-3,stress:5},text:'总部推迟了编制审批。你积累了影响力，但这次没有升职。'}}}),
      choice('保留现职，同时低调比较外部市场',6,{skills:4,network:9,career:3,stress:3},'你建立了真实的岗位报价清单，也开始评估跨国流动与税务代价。'),
      choice('先和嘉宁规划二胎、孩子教育与长辈照顾',4,{family:13,stress:-9,career:-2},'家庭讨论没有立刻得到唯一答案，但你们清楚了彼此能够承受的边界。')
    ]},
    {id:'young_crossroads',title:'十八岁的第一张路线图',tag:'主线 · 起点',text:'高中刚毕业，手上的现金很有限。有人说大学文凭才是跳板，也有人说先干活更实在。你必须在时间、债务和机会之间做取舍。',only:'random',choices:[
      choice('申请社区学院，边读书边做兼职',12,{skills:9,career:5,stress:7,savings:-3500},'你读到了真正有用的基础课，但大部分周末都用来打工。'),
      choice('先找正式工作，积累现金与行业经验',9,{career:5,skills:6,stress:7},'你学会了按时交付，但发现没有证书的晋升通道比想象中窄。'),
      choice('参加职业技能培训并申请学徒岗位',9,{skills:12,network:4,savings:-1800},'实践能力提升很快，能否碰到好师傅却有一定运气成分。'),
      choice('尝试小规模接单/创业，不辞掉现有兼职',6,{network:7,stress:10,savings:-900},'你开始认识真正的客户，也第一次独自面对收款与投诉。',{chance:{p:0.47,win:{add:{savings:3900,career:5},text:'第一批客户愿意继续付费，你有了可复用的做事流程。'},fail:{add:{savings:-1200,stress:7},text:'回头客不足。成本是真实的，热情并不能代替现金流。'}}})
    ]},
    {id:'skill_training',title:'需要重新学习的行业',tag:'学习 · 职业',text:'你所在行业的新工具和流程正在改变用人标准。公司不会无条件为每个人提供培训预算。',choices:[
      choice('抽业余时间完成一套证书课程',8,{skills:12,stress:6,savings:-900,career:3},'你拿到了技能证明，但它只能增加谈判筹码，不能替你完成工作。'),
      choice('争取公司预算，内部推动培训',6,{skills:7,network:6,stress:3},'一个小范围试点得到支持，你开始影响身边的人。'),
      choice('暂时只做好当前工作',6,{stress:-5,family:5,skills:-3},'日子平稳了一段时间，但工具更新还在继续。')
    ]},
    {id:'unexpected_expense',title:'计划外的维修账单',tag:'生活 · 财务',text:'生活没有暂停键。一笔不在预算里的维修账单突然出现，而且短期内不能不处理。',choices:[
      choice('直接支付，优先消除风险',3,{savings:-4400,stress:-4,health:2},'现金储备减少，但问题解决得比较彻底。'),
      choice('先做必要维修，剩余部分暂缓',4,{savings:-1600,stress:6,skills:2},'眼前能继续运作，却留下了未来还要处理的尾巴。'),
      choice('寻找可靠的二手件和独立维修商',4,{savings:-2600,network:2,stress:3},'你花了更多时间比较报价，最终减少了支出。')
    ]},
    {id:'job_offer',title:'招聘经理的电话',tag:'职业 · 机会',text:'一个招聘经理向你描述更高薪的岗位。年收入可能提高，但工作地点、业务稳定性与加班程度都有未知数。',choices:[
      choice('参加完整面试，拿到合同再决定',5,{network:7,stress:5},'你明确要求合同、职责和奖金计算方式。',{chance:{p:0.49,win:{multiplySalary:1.30,add:{career:9,stress:7},set:{role:'跨部门负责人'},text:'书面合同谈成，薪资上升约三成。新的考核开始了。'},fail:{add:{career:-2,network:3},text:'机会暂时终止；这次面试仍帮你校准了市场价值。'}}}),
      choice('优先留任，谈当前岗位的条件',5,{family:5,career:3,network:2},'你让上级知道了你的价值，但对方并没有立即承诺。',{chance:{p:0.42,win:{multiplySalary:1.12,add:{career:4},text:'最终获得加薪。'},fail:{add:{stress:3},text:'薪资调整延期。'}}}),
      choice('不换工作，把精力用于生活',6,{family:8,health:5,stress:-7,career:-2},'你获得了喘息空间，代价是可能错过一次跃迁。')
    ]},
    {id:'layoff',title:'组织架构重新洗牌',tag:'风险 · 职业',text:'总部宣布组织重组。有人升职，也有人被裁。你参与的一条业务线正被审视。',choices:[
      choice('主动提出改善成本与交付的方案',6,{skills:6,network:4,stress:9},'你的方案获得注意，但人事结果仍取决于更高层决策。',{chance:{p:0.60,win:{add:{career:10},text:'团队被保留下来，你被赋予更大职责。'},fail:{add:{career:-10,savings:-5500},text:'你的方案没能改变削减编制的决定，收入出现空档。'}}}),
      choice('提前联系猎头并整理应急资金',6,{network:9,stress:4,savings:800},'你有了更多选项，也开始认真计算现金储备。'),
      choice('相信现有业绩，继续原来节奏',6,{stress:-2},'你没有被日常传言带偏，但承担了更大的信息盲区。',{chance:{p:0.38,win:{add:{career:2},text:'岗位暂时安全。'},fail:{multiplySalary:0.8,add:{career:-14,stress:13},text:'业务被整合，你的薪资与话语权同时下降。'}}})
    ]},
    {id:'family_time',title:'一场你差点错过的聚会',tag:'家庭 · 关系',text:'工作临时出现任务，碰巧撞上家人早已安排的聚会。没人明确要求你一定出席，但这对关系有影响。',choices:[
      choice('安排交接，准时参加聚会',3,{family:12,career:-2,stress:-5},'你发现关系很多时候靠的是平凡的出席，而不是大事上的豪言。'),
      choice('先完成任务，再视频和家人聊天',3,{career:4,family:2,stress:5},'事情完成了，遗憾也留下了。'),
      choice('和同事协调轮流承担，让双方都不失约',4,{family:8,network:6,stress:4},'你花时间协商边界，最终争取了一个可执行的方案。')
    ]},
    {id:'burnout',title:'连续几个月睡不好',tag:'健康 · 工作',text:'长时间的紧绷开始显现。你越来越难恢复精力，工作中的小事也容易让你烦躁。',choices:[
      choice('减少额外项目，认真调整作息',6,{health:12,stress:-17,family:4,career:-3},'节奏放慢了，但你更能持续地处理复杂问题。'),
      choice('安排检查，并重新分配团队工作',5,{savings:-800,health:8,stress:-9,network:5},'你没把疲劳当成意志力问题，团队也学会了分担。'),
      choice('再冲一个季度，等项目结束再说',4,{career:8,health:-12,stress:13},'项目可能推进了，恢复能力却进一步下降。')
    ]},
    {id:'investment',title:'一个看似诱人的投资项目',tag:'财务 · 风险',text:'熟人向你介绍回报不错的项目，并强调机会稍纵即逝。信息不完全透明，投入的资金可能无法很快取回。',choices:[
      choice('先调查合同、费用、退出条款，不立即投',4,{skills:4,network:1,stress:1},'你查到不少值得追问的细节。没有下单，也是一种决策。'),
      choice('只用可承受损失的小额资金尝试',6,{savings:-2500,stress:5},'你把风险限制在能承受的范围之内。',{chance:{p:0.43,win:{add:{savings:4700},text:'投资取得阶段性收益，但运气也占了相当一部分。'},fail:{add:{savings:-1500},text:'收益落空，你损失了部分本金。'}}}),
      choice('把钱留作应急储备',6,{savings:600,stress:-5,family:3},'你拒绝了这个机会，换回的是更高的安全边际。')
    ]},
    {id:'side_project',title:'有人愿意为你的经验付费',tag:'副业 · 商业',text:'你帮别人解决了一件麻烦事，对方问能否持续提供类似服务。需求存在，但获客、合同和交付都需要成本。',choices:[
      choice('先找三个付费试点，验证复购',6,{network:8,skills:5,stress:8,savings:-1200},'小规模验证比一开始租办公室更明智。',{chance:{p:0.56,win:{add:{savings:6500,career:3},text:'两位客户选择续约。你开始建立简单的服务流程。'},fail:{add:{savings:-1600,stress:5},text:'客户愿意夸奖，却不愿持续付款。'}}}),
      choice('只承接能兼顾家庭和主业的零散项目',5,{savings:2200,skills:3,stress:4},'收入不算高，但你知道自己能够交付。'),
      choice('不做额外工作，留出休息时间',5,{health:7,stress:-9,family:6},'你用时间换取了更好的状态。')
    ]},
    {id:'old_friend',title:'许久未联系的朋友',tag:'关系 · 时代',text:'一位认识多年的老朋友突然发来消息。彼此的人生轨迹已经明显不同。',choices:[
      choice('认真约时间聊聊，关心近况',3,{family:4,network:9,stress:-4},'这次交流没有直接带来收入，却重新建立了真实的连接。'),
      choice('约对方交流行业和未来机会',4,{network:11,career:3,stress:2},'专业上的交流很有价值，你也感受到他面对自己的压力。'),
      choice('礼貌回复，继续自己的安排',3,{stress:-2,network:-2},'有些联系渐渐淡去，并不意味着谁做错了事。')
    ]},
    {id:'family_planning',title:'家庭需要一次认真沟通',tag:'家庭 · 未来',require:function(s){return !!s.partner && ageOf(s)<55 && s.children<3;},text:'是否再要一个孩子，不只是预算问题。伴侣的职业、健康、照顾资源和双方意愿，都不能被一句“收入够了”代替。',choices:[
      choice('和伴侣讨论意愿，先安排工作与照护资源',8,{family:12,stress:-3,savings:-1500},'你们把双方的意愿与实际支持条件放到了同一张清单上。',{chance:{p:0.47,win:{add:{children:1,family:7,stress:8},text:'在双方充分准备并达成一致后，家庭迎来新成员。'},fail:{add:{family:3},text:'你们暂时没有迎来新成员，但更了解彼此的期待。'}}}),
      choice('再等一年，先稳定岗位和现金流',12,{savings:3500,family:2,career:3},'你们同意在下一阶段重新评估，而不是默认另一方会承担所有代价。'),
      choice('把当下的孩子和伴侣关系放在第一位',8,{family:9,health:3,stress:-5},'眼前的亲密关系得到了更多时间。')
    ]},
    {id:'relationship',title:'一段可能进一步发展的关系',tag:'人际 · 选择',require:function(s){return !s.partner && ageOf(s)>=20 && ageOf(s)<=50;},text:'你与一位相处愉快的人开始频繁见面。对方也有自己的计划，感情不会因为你投入时间就自动得到回应。',choices:[
      choice('认真沟通未来期望，不急着定义关系',7,{family:4,stress:3},'你表现得坦诚，也尊重对方的决定。',{chance:{p:0.56,win:{set:{partner:'伴侣'},add:{family:11},text:'双方决定正式开始一段关系。'},fail:{add:{stress:4},text:'你们最终没有走到一起，但仍能彼此尊重。'}}}),
      choice('先把精力放在工作和自我建设',8,{skills:7,career:5,family:-3},'人生节奏有时比别人的时间表更重要。'),
      choice('维持交往，但暂不讨论长期承诺',6,{family:3,stress:-2},'关系在发展，也带着一些悬而未决的问题。')
    ]},
    {id:'education',title:'学历真的限制了晋升吗？',tag:'教育 · 阶层',require:function(s){return s.education!=='本科毕业' && ageOf(s)<44;},text:'你发现一些岗位明确要求高等教育学历。更长的学习期会影响当下收入，却可能改变未来的岗位筛选条件。',choices:[
      choice('报名可兼顾工作的正规学位项目',24,{skills:16,career:8,savings:-9000,stress:12},'你完成了艰苦的阶段性学习。',{chance:{p:0.77,win:{set:{education:'本科毕业'},add:{career:7},text:'坚持多年后获得本科学历。'},fail:{add:{skills:3,stress:5},text:'学习进度落后于计划，暂时还没有拿到文凭。'}}}),
      choice('用短期职业认证切入更好的职位',9,{skills:11,career:5,savings:-1600},'你获得了更容易直接应用的职业技能。'),
      choice('依靠作品与业绩直接竞争岗位',8,{network:6,career:4,stress:5},'你继续走实践路线，但学历筛选仍是一道真实的门槛。')
    ]},
    {id:'move_city',title:'要不要为工作换一座城市',tag:'城市 · 流动',text:'另一个城市的生活成本与就业机会都与你熟悉的环境不同。新的城市可能带来空间，也可能让照护与社交更困难。',choices:[
      choice('先做实地调查与预算，不急着搬',5,{network:5,skills:3,savings:-900},'你收集了租金、交通与税务数据，决定不再仅靠印象。'),
      choice('接受新城市的职业机会',9,{career:9,stress:9,family:-7,savings:-6000},'你换来了职业增长，但重建生活秩序比预想中更累。',{chance:{p:0.58,win:{multiplySalary:1.19,add:{career:4},text:'新岗位发展尚可，收入改善。'},fail:{add:{stress:8,career:-4},text:'新团队磨合艰难，晋升承诺没有实现。'}}}),
      choice('继续留在熟悉的城市',7,{family:7,stress:-6,career:-2},'你保住熟悉的支持网络，也放弃了一个不确定的机会。')
    ]},
    {id:'health_check',title:'例行检查的提醒',tag:'健康 · 风险',text:'最近工作与生活越来越忙。你意识到自己的状态需要更长期的管理。',choices:[
      choice('安排体检，制定可持续的锻炼习惯',6,{health:13,stress:-7,savings:-750},'一些改变没有立竿见影，但你开始稳步建立习惯。'),
      choice('先做最容易坚持的日常运动',6,{health:8,stress:-4,family:2},'你没有追逐极端目标，状态逐渐改善。'),
      choice('眼前太忙，再往后推',5,{career:4,health:-8,stress:8},'时间过去了，累积的疲劳没有自动消失。')
    ]},
    {id:'manager_conflict',title:'团队里的分歧',tag:'管理 · 人心',text:'两位核心同事对资源分配产生分歧，各自都能拿出合理理由。你必须在公平、效率和个人关系之间平衡。',require:function(s){return s.career>=45;},choices:[
      choice('听取双方证据，明确共同目标与边界',5,{network:8,career:6,stress:5},'双方都没有百分百满意，但团队知道了规则。'),
      choice('选择效率最高的方案，快速推动',4,{career:9,network:-7,stress:7},'短期推进更快，团队信任受到考验。'),
      choice('把决定上交更高层，不介入矛盾',4,{stress:-3,career:-6,network:-5},'你减少了眼前冲突，却让团队感到缺少承担。')
    ]},
    {id:'caregiving',title:'家里的长辈需要帮助',tag:'家庭 · 责任',require:function(s){return ageOf(s)>=28;},text:'家中长辈需要更多照顾。专业服务、亲自陪伴与财务支持都有作用，却没有一种方案对所有人都完全公平。',choices:[
      choice('协调家人，购买适度专业照护服务',8,{savings:-4800,family:11,stress:4},'你把责任分散到可持续的支持系统中。'),
      choice('减少工作安排，亲自承担更多照护',8,{family:13,career:-7,stress:7,health:-3},'家人感受到支持，你的职业进展有所放缓。'),
      choice('提供经济支持，并定期远程沟通',7,{savings:-2500,family:4,career:3},'资金解决了一部分问题，但陪伴无法完全外包。')
    ]},
    {id:'global_economy',title:'市场突然变冷了',tag:'经济 · 周期',text:'行业订单放缓，公司开始压缩预算。再优秀的个人也不能凭意志改变经济周期。',choices:[
      choice('保住核心现金流，削减非必要支出',9,{savings:2800,stress:4,career:-2},'你主动提高了抗风险能力。'),
      choice('布局新技能和新的业务领域',9,{skills:10,network:5,savings:-1700,stress:7},'你为下一轮机会做准备，但短期没有明显回报。'),
      choice('尝试逆势扩张，承担更大风险',8,{career:4,savings:-5300,stress:12},'你押注行业复苏。',{chance:{p:0.35,win:{add:{savings:15600,career:9},text:'需求突然恢复，这次逆势投入碰巧踩对了节奏。'},fail:{add:{savings:-7400,career:-6},text:'复苏晚于预期，资金压力明显上升。'}}})
    ]},
    {id:'vacation',title:'一段难得的休息窗口',tag:'生活 · 时间',text:'未来几个月没有必须亲自出席的重大节点。你可以把时间留给自己，也可以用它交换更多职业筹码。',choices:[
      choice('安排旅行或体验新活动',4,{savings:-2400,health:5,family:8,stress:-10},'这段经历没有让简历变长，却给了你新鲜的记忆。'),
      choice('专注学习和新技能训练',5,{skills:9,career:3,stress:3},'你在平静的月份里补足了自己的短板。'),
      choice('主动争取高曝光度的工作项目',5,{career:9,network:5,stress:10,health:-3},'你的名字开始被更多决策者看到。')
    ]},
    {id:'housing',title:'租房、买房与自由',tag:'资产 · 家庭',require:function(s){return ageOf(s)>23;},text:'熟悉的居住环境正在涨价。买房可能提升稳定感，也意味着更低流动性和长期支出。',choices:[
      choice('继续租住，保持流动性与应急金',9,{savings:2600,stress:-2},'你的选择保留了迁移和应对风险的灵活性。'),
      choice('购买负担得起的住宅，预留维修金',12,{savings:-22000,family:6,stress:8},'你承担了长期资产和维护义务，账面安全不等于现金充裕。', {require:function(s){return s.savings>=26000;}}),
      choice('调整住房预算，搬到成本更可控的地区',9,{savings:5200,family:-2,stress:4},'生活变得朴素一些，但现金流轻松了。')
    ]},
    {id:'mentorship',title:'一位年轻同事来请教',tag:'传承 · 人际',require:function(s){return ageOf(s)>=29;},text:'一位能力不错却缺乏人脉的年轻人问你能否提供建议。你有经验，但也很忙。',choices:[
      choice('定期指导，分享真实的职业教训',6,{network:9,skills:3,family:3,stress:3},'年轻人的进步也让你重新理解自己走过的路。'),
      choice('帮忙介绍合适的人，然后让他自己尝试',5,{network:6,career:3},'你提供了机会，却没有替对方做决定。'),
      choice('婉拒，以自己的事务为先',4,{stress:-4},'你保护了时间边界，关系没有更进一步。')
    ]},
    {id:'retirement',title:'关于下一段生活的想象',tag:'晚年 · 规划',require:function(s){return ageOf(s)>=59;},text:'工作仍有价值，但身体、家庭与时间的意义正发生变化。继续全职、渐进退休、或彻底转向新生活，都有代价。',choices:[
      choice('逐渐减少工作，培养非职业的生活重心',18,{salary:-Math.max(0,20000),health:7,family:11,stress:-11,career:-5},'你的收入下降了一些，但生活不再完全围绕岗位展开。'),
      choice('继续高强度工作与管理职责',12,{career:6,savings:5000,stress:10,health:-9},'你依然获得专业认可，也更加清楚体力的边界。'),
      choice('退休或半退休，把时间还给家庭和自己',12,{health:8,family:13,stress:-13,career:-8},'你主动卸下一部分角色。',{set:{role:'退休 / 自由安排'},multiplySalary:0.18})
    ]},
    {id:'family_reunion_eli',title:'来自 Greensboro 的消息',tag:'人物 · Sara',only:'eli',text:'Sara 最近正忙于医疗项目协调工作，和 Evan 也在规划自己的未来。她发来讯息问你，下一次家人什么时候能聚在一起。',choices:[
      choice('提前敲定探亲行程，与家人见面',5,{savings:-2800,family:14,stress:-6},'你听她讲工作里的挫折，也分享了自己早年的弯路。'),
      choice('安排一次长时间视频交流',3,{family:6,stress:-2},'虽然隔着屏幕，Sara 还是感受到你的在乎。'),
      choice('等下一次出差时再顺路安排',6,{career:4,family:-3},'旅行节省了部分成本，见面的时间却被一推再推。')
    ]},
    {id:'shanghai_eli',title:'上海派驻续约的条件',tag:'主线 · 上海',only:'eli',text:'公司希望延长上海派驻。住房补贴、税务安排与岗位级别可能左右你的实际收益。对嘉宁来说，双方家庭的支持同样重要。',choices:[
      choice('争取书面补贴和岗位边界，审慎续签',6,{network:5,career:5,family:4,stress:4},'你逐一核对补贴是否固定、税务如何承担、续签后的汇报关系。',{chance:{p:0.64,win:{add:{savings:6200,family:4},text:'新的派驻补贴得到书面确认。'},fail:{add:{stress:5},text:'部分补贴未获批准，你继续保留选择权。'}}}),
      choice('优先适应孩子与家庭需要',6,{family:12,career:-2,stress:-7},'你没有完全按收入高低来安排生活。'),
      choice('重新评估全球流动机会',7,{network:10,career:4,stress:7},'市场上有不少有趣的岗位，但真正合适的并不多。')
    ]},
    {id:'robert_eli',title:'老友 Robert 的近况',tag:'人物 · 时间',only:'eli',text:'Robert 已经年近九十。你忽然意识到，再好的朋友也未必有无数次见面的机会。',choices:[
      choice('专门抽时间拜访',5,{savings:-2100,family:9,health:2,stress:-4},'你们谈起许多往事，也坦然谈到岁月本身。'),
      choice('定期联系，并寄去一份小礼物',4,{savings:-180,family:6},'电话里熟悉的声音让一段友谊继续延伸。'),
      choice('先忙事业，改天再联系',6,{career:4,stress:3,family:-6},'日历变得越来越满。你开始明白“以后”不是一个可靠的日期。')
    ]},
    {id:'children',title:'孩子开始有自己的选择',tag:'家庭 · 成长',require:function(s){return s.children>0;},text:'孩子对兴趣、学校和未来有自己的判断。你的经验能帮忙，但过度掌控也可能损害信任。',choices:[
      choice('认真倾听，陪孩子尝试而非代替决定',6,{family:12,stress:-3,savings:-900},'沟通费时间，却建立了更可靠的关系。'),
      choice('投入更好的教育资源和专业指导',8,{savings:-4800,family:5,career:2},'资源带来便利，但未必能解决全部成长问题。'),
      choice('强调纪律和成绩，减少试错',6,{family:-9,stress:5,savings:700},'短期效率提升了，亲密感却出现细微裂缝。')
    ]}
  ];
  function getScene(s){var found=scenes.filter(function(a){return a.id===s.currentSceneId;})[0];return found || scenes[0];}
  function visibleScenes(s){return scenes.filter(function(a){if(a.only && a.only!==s.mode)return false;return !a.require||a.require(s);});}
  function chooseNextScene(s){
    var pool=visibleScenes(s).filter(function(a){return a.id!=='eli_crossroads'&&a.id!=='young_crossroads'&&s.lastEventIds.indexOf(a.id)<0;});
    if(!pool.length)pool=visibleScenes(s).filter(function(a){return a.id!=='eli_crossroads'&&a.id!=='young_crossroads';});
    if(!pool.length)pool=scenes;
    var pick=pool[randomInt(pool.length,s)];s.currentSceneId=pick.id;s.phase='scene';s.lastResult='';return s;
  }
  function apply(s, e){if(!e)return;
    Object.keys(e).forEach(function(k){var v=e[k];
      if(k==='salary'||k==='savings'||k==='children'){s[k]=Math.max(k==='savings'?-50000:0,(s[k]||0)+v);}
      else if(typeof s[k]==='number'){s[k]=clamp(s[k]+v);}
    });
  }
  function applySpecial(s,a){if(!a)return;
    if(a.effect)apply(s,a.effect);if(a.add)apply(s,a.add);
    if(a.set)Object.keys(a.set).forEach(function(k){s[k]=a.set[k];});
    if(a.multiplySalary!=null)s.salary=Math.max(0,Math.round(s.salary*a.multiplySalary));
  }
  function passMonths(s,months){
    var annualNet=s.salary*(s.salary>200000?0.61:(s.salary>95000?0.68:0.77));
    var living=s.mode==='eli'?7200:(s.children?3600:1950);
    if(s.partner && s.mode==='random')living+=420;
    living+=s.children*(s.mode==='eli'?1150:490);
    var netChange=Math.round((annualNet/12-living)*months);
    s.savings=Math.max(-50000,Math.round(s.savings+netChange));
    s.month+=months;
    while(s.month>12){s.month-=12;s.year++;}
    s.ageMonths+=months;
    var stressDrift=s.stress>77?3:0;
    s.health=clamp(s.health-(s.stress>75?Math.ceil(months/5):0)-(ageOf(s)>=60?Math.floor(months/7):0));
    s.stress=clamp(s.stress+stressDrift);
    if(s.savings<0)s.stress=clamp(s.stress+5);
    if(ageOf(s)>70&&random(s)<Math.min(.31,(ageOf(s)-70)*0.013+Math.max(0,50-s.health)*.004)){
      s.ended=true;s.phase='end';s.lastResult='这一年，生命走到了终点。没有一个数字能完整概括你留下的东西。';
    }
    if(s.health<=1){s.ended=true;s.phase='end';s.lastResult='长期的健康损耗最终让这段人生提前结束。';}
  }
  function choose(s,index){
    if(!s||s.phase!=='scene')return s;
    var scene=getScene(s), c=scene.choices[index];if(!c||c.require&&!c.require(s))return s;
    var heading=scene.title, text=c.result;
    applySpecial(s,{effect:c.effect,set:c.set,multiplySalary:c.multiplySalary});
    if(c.chance){var passed=random(s)<c.chance.p;var outcome=passed?c.chance.win:c.chance.fail;applySpecial(s,outcome);text+='\n\n'+outcome.text;}
    passMonths(s,c.months);
    if(s.savings<=-10000){s.stress=clamp(s.stress+9);text+='\n\n你的现金流已经陷入明显赤字，接下来需要谨慎。';}
    s.turns++;
    s.lastEventIds.push(scene.id);if(s.lastEventIds.length>6)s.lastEventIds.shift();
    s.history.unshift({date:s.year+'年'+s.month+'月',age:ageOf(s),title:heading,decision:c.label,result:text,savings:Math.round(s.savings),role:s.role});
    if(s.history.length>80)s.history.length=80;
    if(!s.ended){s.phase='result';s.lastResult=text;}
    return s;
  }
  function next(s){if(s&&s.phase==='result')chooseNextScene(s);return s;}
  function stats(s){return [
    {key:'health',label:'健康',value:s.health}, {key:'family',label:'关系',value:s.family},
    {key:'career',label:'事业',value:s.career}, {key:'skills',label:'能力',value:s.skills},
    {key:'network',label:'人脉',value:s.network}, {key:'stress',label:'压力',value:s.stress}
  ];}
  function summary(s){return {age:ageOf(s),date:s.year+'年'+s.month+'月',salary:money(s.salary),savings:money(s.savings),partner:s.partner||'暂无',children:s.children,city:s.city};}
  return {VERSION:VERSION,createEli:createEli,createRandom:createRandom,getScene:getScene,choose:choose,next:next,stats:stats,summary:summary,ageOf:ageOf,money:money};
})();
if(typeof module!=='undefined'&&module.exports){module.exports=LifeEngine;}
