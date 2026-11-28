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
  "ethan73": ["theatre", "camera", "school", "camera", "theatre"],
  "chen01": ["design", "office", "design", "design", "street"],
  "noah73": ["studio", "studio", "school", "studio", "theatre"],
  "maya94": ["theatre", "camera", "theatre", "theatre", "design"],
  "yusuke91": ["electronics", "school", "electronics", "office", "electronics"],
  "jieun97": ["office", "office", "office", "school", "camera"],
  "lukas89": ["school", "office", "camera", "school", "theatre"],
  "camille08": ["pool", "pool", "school", "pool", "home"],
  "lin01": ["school", "school", "office", "school", "home"],
  "sam73": ["street", "office", "home", "school", "home"],
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

function eventArt(scene, characterId) {
  if (scene.id === 'character_0') return openingArt[characterId];
  return scene.daily ? dailyArt[scene.title] : undefined;
}

function choiceMedia(choice, override) {
  const key = override || choice.media;
  if (!Object.hasOwn(sceneSymbols, key)) return '';
  return `<span class="choice-media" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
      stroke-linecap="round" stroke-linejoin="round"><path d="${sceneSymbols[key]}"/></svg>
    <img src="assets/scene-${key}.jpg" alt="" loading="lazy" decoding="async">
  </span>`;
}

function sceneHeading(title, key) {
  if (!Object.hasOwn(sceneSymbols, key)) return `<h1>${esc(title)}</h1>`;
  return `<header class="scene-heading"><img src="assets/scene-${key}.jpg" alt="" decoding="async">
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
