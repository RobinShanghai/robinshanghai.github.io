const sceneSymbols = {
  "cafe": "M4 8h13v5a6 6 0 0 1-12 0V8m12 1h2a3 3 0 0 1 0 6h-2M3 21h17M8 3v2m4-2v2",
  "street": "M9 21l3-18m6 18L14 3M3 19l4-9",
  "school": "M12 6Q8 3 3 5v14q5-2 9 1 4-3 9-1V5q-5-2-9 1v14",
  "camera": "M3 7h4l2-3h6l2 3h4v13H3z M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
  "studio": "M4 15v-3a8 8 0 0 1 16 0v3M4 13h4v7H5q-2 0-2-2v-3q0-2 1-2zm16 0h-4v7h3q2 0 2-2v-3q0-2-1-2z",
  "electronics": "M7 7h10v10H7zM10 3v4m4-4v4m-4 10v4m4-4v4M3 10h4m-4 4h4m10-4h4m-4 4h4",
  "design": "M3 18L18 3l3 3L6 21H3zM13 8l3 3M4 4l5 2-3 3z",
  "track": "M3 17h9a5 5 0 0 0 0-10H5m-2 7h9a2 2 0 0 0 0-4H6M4 20h8a8 8 0 0 0 0-16H8",
  "home": "M2 11l10-8 10 8M5 10v11h14V10m-10 11v-7h6v7",
  "office": "M3 8h18v12H3zM8 8V5h8v3M3 12q9 5 18 0m-9 1v3",
  "theatre": "M3 4h18v16M3 4v16m0-15q6 3 1 9m17-9q-6 3-1 9M3 20h18",
  "pool": "M3 17q3-3 6 0t6 0 6 0M3 21q3-3 6 0t6 0 6 0M7 14V5q0-3 3-2m3 11V5q0-3 3-2M7 7h6m-6 4h6"
};

const openingArt = {
  "ethan73": ["camera", "camera", "school", "camera", "theatre"],
  "chen01": ["design", "office", "design", "design", "street"],
  "noah73": ["studio", "studio", "school", "studio", "theatre"],
  "maya94": ["theatre", "camera", "theatre", "theatre", "design"],
  "yusuke91": ["electronics", "school", "electronics", "office", "electronics"],
  "jieun97": ["office", "office", "office", "school", "camera"],
  "lukas89": ["school", "office", "camera", "school", "theatre"],
  "camille08": ["pool", "pool", "school", "pool", "home"],
  "lin01": ["school", "school", "office", "school", "home"],
  "sam73": ["home", "office", "home", "school", "home"],
  "ruth73": ["school", "school", "office", "school", "home"],
  "aki91": ["electronics", "electronics", "office", "school", "electronics"],
  "seo97": ["office", "office", "office", "school", "home"],
  "ana94": ["track", "track", "office", "home", "track"],
  "zhixia01": ["studio", "studio", "school", "studio", "home"],
  "robin05": ["studio", "studio", "theatre", "school", "home"]
};

const dailyArt = {
  "排练室外的热饮": ["cafe", "cafe", "studio", "street"],
  "唱片放到第二面": ["studio", "home", "studio", "home"],
  "她把唱片带回来了": ["studio", "home", "studio", "cafe"],
  "一场没有观众的晚饭": ["home", "home", "cafe", "home"],
  "镜头还没有打开": ["camera", "cafe", "camera", "home"],
  "一张只想自己留着的照片": ["camera", "home", "camera", "street"],
  "没有作品要交的周末": ["street", "theatre", "street", "home"],
  "Mary 留出的空白处": ["school", "school", "cafe", "home"],
  "借来的烤盘": ["home", "home", "school", "cafe"],
  "最后一块面包": ["home", "home", "office", "cafe"],
  "嘈杂柜台前的纸笔": ["electronics", "electronics", "cafe", "office"],
  "晴子的速写本": ["street", "street", "school", "home"],
  "一顿不用谈维修的饭": ["home", "home", "office", "home"],
  "韩美带来的便当": ["home", "home", "cafe", "home"],
  "朋友不想当你的客户": ["street", "street", "cafe", "home"],
  "训练路上的慢一段": ["track", "street", "track", "home"],
  "Beatriz 记得那段路": ["street", "cafe", "track", "street"]
};

// Each title refers to a place or a physical object in that particular scene.
// Shared choices by themselves cannot establish where a conversation happens.
const sceneSubjects = {
  cafe: [
    '街角咖啡，还是下一班车', '熟人介绍的晚餐', '没有秒表的下午',
    '聚会里的一次称赞', '笔记本合上以后', '下班后的一次邀请',
    '姓氏之外的相处', '散场后的约会'
  ],
  camera: [
    'Ben 的胶卷还没冲洗', '素妍坚持自己挑照片', '相机里没有家族头衔的下午',
    'Paulo 的镜头停了下来', '样片的使用范围', 'Felix 不愿交出的底片'
  ],
  design: [
    '样衣上的两种名字', '父亲在客厅摊开样本册', '打样师傅等你确认一个尺寸',
    '周岚的设计团队邀请', '沈宁提出合伙的新条件', '工作室的订单上限',
    '设计署名与客户沟通', '第一份共同签名的大订单'
  ],
  electronics: [
    '维修台旁的原型机', '山本带来的研究助理机会', '山本问你想解决哪一种问题',
    '妹妹画了一张难懂的电路图', '父亲提前收了工具', '客户说机器还是不好用',
    '山本在记录边上写了一个问号', '晴子画出的操作面板',
    '一位客户没有照说明操作', '客户带着旧纸条回来', '设备诊断项目的负责人'
  ],
  home: [
    '家宴上的名字，不只是一个姓氏', '家宴厨房里的志浩', '饭桌上先不谈订单',
    '饭桌上的生辰纸条', '母亲问你周末是否回家', '林燕家的一张折叠桌',
    '折叠桌该留给谁', '奶奶留在饭盒里的纸条', '林燕把门关得重了一点',
    '房东要求明确还款安排', 'Rose 的学校通知', 'Rose 想去同学家',
    'Joan 留下的轮班表', 'Joan 这次没有空', '那张轮班表需要重写',
    '母亲选了另一件外套', '课程时间与母亲复诊重叠', '父亲又问起一张收据',
    '亲属提出替家业担保', '弟弟给你画了一张奖牌', '母亲说的“为你好”',
    '家人问：你最近过得好吗'
  ],
  office: [
    '志浩给你的不是一张空白支票', '志浩的那一页预算',
    '父亲交来的第一份独立预算', '产能与品牌的边界',
    '印刷前的最后一页', 'Felix 的删改意见', '一封没必要公开的信',
    '韩美递来的小店草图', '草图旁多了一份费用清单', '网页上线后，维护才刚开始'
  ],
  pool: [
    'Alex 的训练表，还有你的星期天', '名单公布前的那次计时', '泳池关灯之后',
    'Lea 想把秒表放下', 'Ines 的转身笔记', '拍摄邀请夹在训练表里'
  ],
  school: [
    '借来的旧教材有缺页', '赵敏带来的岗位与课程表', '有限时间里的学习安排',
    '练习本里，写满了想做的事', '稳定工作，也能留一扇窗'
  ],
  street: ['Rose 的旧自行车', '车链又松了'],
  studio: [
    'June 把歌词页翻了过来', '磁带上的名字，由谁决定',
    '有一段声音，不需要发出去', '何岚退回的节目修改单',
    '录音之后，是职业还是喜欢', '关掉录音机之后，仍然有话想说'
  ],
  theatre: [
    'Marian 留下的排练席位', '旧剧场的新演员征集', 'Marian 想起了你的那场演出',
    '试读前的一张便条', '散场后，谁陪你收拾舞台', '门口等着的人',
    '一场小演出的节目单', '排练室里，谁还愿意再来'
  ],
  track: [
    'Beatriz 的训练时间又变了', '比赛通知与工作排班', 'Teresa 问起睡眠',
    '试训时间与工作班次冲突', '一次参赛与长期工作之间'
  ]
};
const subjectsByTitle = new Map();
for (const [media, titles] of Object.entries(sceneSubjects)) {
  for (const title of titles) subjectsByTitle.set(title, media);
}

const photoDescriptions = {
  cafe: '靠窗的小桌上摆着两杯咖啡',
  street: '一辆自行车靠在树影斑驳的街边',
  school: '铅笔和翻开的练习本放在教室的木桌上',
  camera: '胶片相机旁摊着接触印样',
  studio: '一副耳机搁在开盘式录音机旁边',
  electronics: '旧收音机的外壳已经拆开，旁边放着万用表',
  design: '裁衣剪压在布料和打版纸上',
  track: '一双磨旧的跑鞋放在社区跑道的白线旁',
  home: '窗边的饭桌已经摆好碗碟',
  office: '几个人俯在工作桌前讨论摊开的材料',
  theatre: '观众席前方，演员正站在亮着灯的舞台上',
  pool: '室内泳池的分道线上荡着水花'
};

function eventArt(scene, characterId) {
  if (scene.media !== undefined) {
    return Object.hasOwn(sceneSymbols, scene.media) ? [scene.media] : undefined;
  }
  if (scene.id === 'character_0') return openingArt[characterId];
  if (scene.daily && Object.hasOwn(dailyArt, scene.title)) return dailyArt[scene.title];
  const media = subjectsByTitle.get(scene.title);
  return media ? [media] : undefined;
}

function scenePhoto(key) {
  if (!Object.hasOwn(sceneSymbols, key)) return '';
  return key === 'track' ? 'assets/scene-track-sampa.jpg' : `assets/scene-${key}.jpg`;
}

function choiceMedia(choice, override) {
  const key = override || choice.media;
  if (!Object.hasOwn(sceneSymbols, key)) return '';
  return `<span class="choice-media" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
      stroke-linecap="round" stroke-linejoin="round"><path d="${sceneSymbols[key]}"/></svg>
    <img src="${scenePhoto(key)}" alt="" loading="lazy" decoding="async">
  </span>`;
}

function sceneHeading(title, key) {
  if (!Object.hasOwn(sceneSymbols, key)) return `<h1>${esc(title)}</h1>`;
  return `<header class="scene-heading"><img src="${scenePhoto(key)}" alt="${photoDescriptions[key]}" decoding="async">
    <h1>${esc(title)}</h1></header>`;
}

// These marks describe the action. Two choices in the same studio can mean
// performing, studying or sharing the cost of a recording.
const actionSymbols = {
  perform: 'M9 11V6a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0zm-3-1v1a6 6 0 0 0 12 0v-1m-6 7v4m-3 0h6',
  study: sceneSymbols.school,
  partner: 'M4 9a3 3 0 1 0 6 0 3 3 0 0 0-6 0zm9-1a3 3 0 1 0 6 0 3 3 0 0 0-6 0zM2 21v-2a5 5 0 0 1 10 0v2m2-5a5 5 0 0 1 8 4',
  work: sceneSymbols.office,
  home: sceneSymbols.home,
  explore: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-5-5-2.5 6.5L7 17l3.5-7z',
  craft: sceneSymbols.design,
  train: sceneSymbols.track
};
const openingActions = {
  ethan73:['perform','study','partner','home'], chen01:['work','craft','partner','explore'],
  noah73:['perform','study','partner','perform'], maya94:['perform','study','partner','craft'],
  yusuke91:['study','craft','work','home'], jieun97:['work','partner','study','explore'],
  lukas89:['work','partner','study','explore'], camille08:['train','study','partner','home'],
  lin01:['study','work','study','home'], sam73:['work','work','study','home'],
  ruth73:['study','work','study','partner'], aki91:['work','work','study','partner'],
  seo97:['work','work','study','home'], ana94:['train','work','home','train'],
  zhixia01:['study','work','partner','home'], robin05:['perform','perform','craft','home']
};

function choiceMark(scene, characterId, index, media) {
  const action = scene.id === 'character_0' && openingActions[characterId]?.[index];
  const path = actionSymbols[action] || sceneSymbols[media];
  if (!path) return String.fromCharCode(65 + index);
  return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`;
}
