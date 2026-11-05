import { STORAGE_KEY, types, localDay, validDay, validateEntries, decodeBackup, readEntries, backupObject, saveEntries, summarize, inRange, dateOffset, demoEntries } from './data.js';
const app = document.querySelector('#app');
const modal = document.querySelector('#modal');
let tab = 'today';
let filter = 'all';
let entries = [];
let demo = false;
let demoData = [];
let storageError = '';
let range = { start: dateOffset(-6), end: localDay(), preset: 'week' };
let pendingImport = null;
let previewURL = null;
let toastTimer;
try { entries = readEntries(localStorage); } catch { storageError = '暂时无法读取已保存的记录。请先下载原始数据，再尝试恢复备份。'; }
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const paths = {
  home: '<path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
  book: '<path d="M4 3h13a3 3 0 0 1 3 3v15H6a3 3 0 0 1-3-3V4a1 1 0 0 1 1-1ZM3 17h17M7 7h8m-8 4h6"/>',
  chart: '<path d="M4 3v18h17M8 15l4-5 4 3 5-8"/>',
  settings: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="currentColor"/><circle cx="16" cy="17" r="3" fill="currentColor"/>',
  food: '<path d="M3 11h18c-1 7-5 9-9 9s-8-2-9-9Zm4 9h10M6 3v4m6-4v4m6-4v4"/>',
  activity: '<path d="m3 8 3-2 3 3 6 6 3 3-2 3M3 12l3-3m12 6 3-3M9 3l3 3-6 6-3-3m12 3 3-3 3 3-6 6-3-3"/>',
  weight: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M7 9a5 5 0 0 1 10 0Zm5-3 2 3M9 16h6"/>',
  edit: '<path d="m15 4 5 5M4 15 16 3l5 5L9 20l-6 1Z"/>',
  trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.book}</svg>`;
function art(type) {
  const inside = {
    food: '<path d="M10 36h60c-2 21-15 29-30 29S12 57 10 36Z" fill="#f9fcf1"/><path d="M8 36q32-15 64 0M21 65h38M23 14q-7 8 1 15m17-17q-7 8 0 16m16-16q-7 8 0 16" fill="none"/><path d="m48 18 25-9m-23 15 25-9"/><path d="m29 46 2 1m19-1 2-1m-15 6q4 4 8-1"/>',
    activity: '<path d="m14 41 39-14 7 17-39 14Z" fill="#fffdf3"/><rect x="7" y="29" width="14" height="35" rx="5" fill="#a6bd91" transform="rotate(-20 14 46)"/><rect x="55" y="10" width="14" height="35" rx="5" fill="#a6bd91" transform="rotate(-20 62 27)"/><path d="m32 38 1 1m10-5 1 1m-8 6q5 4 9-2M13 13l-3-5m9 3 2-5m43 54 4 3m-7 2 1 5"/>',
    weight: '<rect x="12" y="13" width="56" height="57" rx="12" fill="#fffdf4"/><path d="M24 35a16 16 0 0 1 32 0Z" fill="#cbd8b7"/><path d="m40 34 5-11m-16 27 2 1m18-1 2-1m-15 7q5 5 9-1"/>'
  };
  return `<svg class="art-icon" viewBox="0 0 80 80" fill="none" stroke="#464c3c" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inside[type]}</svg>`;
}
function currentEntries() { return demo ? demoData : entries; }
function toast(message) {
  const el = document.querySelector('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}
function updateEntries(change) {
  try {
    if (demo) demoData = validateEntries(change(demoData));
    else {
      if (storageError) throw new Error('请先在「我的」里恢复数据，再记录新的内容。');
      entries = saveEntries(localStorage, change(readEntries(localStorage)));
    }
    render();
    return true;
  } catch (error) { toast(`未能保存。${error.message}`); return false; }
}
function nav(mobile = false) {
  return `<nav class="${mobile ? 'mobile-nav' : 'desktop-nav'}" aria-label="${mobile ? '底部导航' : '主导航'}">${[['today','home','今天'],['records','book','记录本'],['reports','chart','报告'],['settings','settings','我的']].map(([id, symbol, label]) => `<button data-tab="${id}" class="${tab === id ? 'active' : ''}" ${tab === id ? 'aria-current="page"' : ''}>${icon(symbol)}<span>${label}</span></button>`).join('')}</nav>`;
}
function render() {
  const content = { today: todayView, records: recordsView, reports: reportsView, settings: settingsView, about: aboutView }[tab]();
  app.innerHTML = `${demo ? '<div class="demo-banner"><span>正在体验示例 · 这里的记录都是虚构的</span><button data-action="exit-demo">回到我的记录 ↗</button></div>' : ''}<header class="topbar"><a class="brand" href="#today" data-tab="today"><img src="./icon.svg" alt=""><div><b>动吃动吃</b><small>EAT · MOVE · FEEL GOOD</small></div></a>${nav()}<div class="top-end"><span class="local-dot">记录在本机</span><button class="icon-button" data-tab="about" aria-label="关于动吃动吃">♡</button></div></header><main class="workspace">${storageError && !demo ? `<div class="error-banner">${escapeHTML(storageError)}<button data-tab="settings">管理数据</button></div>` : ''}${content}</main><footer class="footer"><span>每一口、每一步，都值得记下来 <span class="footer-heart">♡</span></span><button data-tab="about">动吃动吃 · 一个小小的生活实验</button></footer>${nav(true)}`;
}
function todayView() {
  const today = localDay();
  const data = currentEntries();
  const daily = data.filter(e => e.date === today);
  const stats = summarize(daily);
  const latestWeight = summarize(data).weights.at(-1);
  const hour = new Date().getHours();
  const greeting = hour < 11 ? '早上好，开饭啦！' : hour < 17 ? '午后好，歇一小会儿' : '晚上好，今天辛苦啦';
  const weekday = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date());
  return `<div class="dayline"><span class="eyebrow">MY LITTLE DAILY DIARY</span><span class="date">${weekday}</span></div><section class="hero"><div class="hero-copy"><span class="bubble-label">${greeting} ✦</span><h1>好好吃饭，<br>也要<span>好好动一动。</span></h1><p>把今天的小日常，记进生活里。<br>一点点就好，我们慢慢来。</p></div><img class="hero-art" src="./assets/friends.svg" alt="吃饭的小兔和举哑铃的小熊"><span class="hero-stamp">DAILY<br>小日常</span></section><div class="section-head"><h2>今天，记一点 <small>A LITTLE EVERY DAY</small></h2><p>从一件小事开始 ↙</p></div><section class="quick-grid" aria-label="快速记录">${[['food','吃了什么','每一餐，都算数'],['activity','动一动','散步也很棒'],['weight','记体重','关注自己的变化']].map(([type,title,description])=>`<button class="quick-card ${type}" data-add="${type}">${art(type)}<span><strong>${title}</strong><small>${description}</small></span><span class="plus" aria-hidden="true">+</span></button>`).join('')}</section><div class="dashboard-bottom"><div><div class="section-head"><h2>今天的小足迹</h2><span class="eyebrow">TODAY</span></div><section class="panel"><div class="stats"><div class="stat"><p class="stat-label">已记饮食</p><strong>${stats.meals}</strong><small>餐</small></div><div class="stat"><p class="stat-label">活动时长</p><strong>${stats.minutes}</strong><small>分钟</small></div><div class="stat"><p class="stat-label">最近体重</p><strong>${latestWeight ? latestWeight.weight : '—'}</strong><small>kg</small></div></div><div class="week-strip">${Array.from({length:7},(_,i)=>{const day = dateOffset(i - 6);return `<div class="day-cell ${data.some(e=>e.date===day)?'has':''} ${i===6?'today':''}"><span>${['日','一','二','三','四','五','六'][new Date(day+'T12:00:00').getDay()]}</span><i>${data.some(e=>e.date===day)?'✓':Number(day.slice(-2))}</i></div>`;}).join('')}</div></section></div><div><div class="section-head"><h2>刚刚记下的</h2><button class="text-button" data-tab="records">翻翻记录本 →</button></div><section class="panel">${daily.length ? daily.slice(-2).reverse().map(entryRow).join('') : `<div class="small-empty"><div class="empty-doodle">${art('food')}</div><div><p>今天的故事，等你来写。</p><small>点上面的卡片，记下第一笔吧。</small><button class="text-button" data-action="demo">先看看示例 ↗</button></div></div>`}</section></div></div>`;
}
function entryRow(entry) {
  const detail = entry.type === 'food' ? `${entry.meal} · ${entry.quantity || '未填写份量'}` : entry.type === 'activity' ? `${entry.minutes} 分钟` : `${entry.weight} kg`;
  return `<div class="entry-row"><span class="entry-symbol ${entry.type}">${icon(entry.type)}</span><div class="entry-main"><h3>${escapeHTML(entry.title)}</h3><p>${escapeHTML(detail)}${entry.note ? ' · ' + escapeHTML(entry.note) : ''}</p></div><div class="entry-actions"><button data-edit="${escapeHTML(entry.id)}" aria-label="编辑${escapeHTML(entry.title)}">${icon('edit')}</button><button data-delete="${escapeHTML(entry.id)}" aria-label="删除${escapeHTML(entry.title)}">${icon('trash')}</button></div></div>`;
}
function recordsView() {
  const filtered = currentEntries().filter(e => filter === 'all' || e.type === filter).sort((a,b)=>b.date.localeCompare(a.date));
  const dates = [...new Set(filtered.map(e=>e.date))];
  return `<div class="page-title"><div><h1>我的记录本</h1><p>把平凡的一天，认真收藏。</p></div><button class="primary" data-action="choose-add">＋ 记一笔</button></div><div class="filters">${[['all','全部'],...Object.entries(types)].map(([id,title])=>`<button class="chip ${filter===id?'active':''}" data-filter="${id}">${title}</button>`).join('')}</div>${dates.length ? dates.map(date=>`<section class="timeline-group"><h2 class="timeline-date">${date.replaceAll('-',' / ')} ${date===localDay()?'· 今天':''}</h2><div class="panel">${filtered.filter(e=>e.date===date).map(entryRow).join('')}</div></section>`).join('') : `<section class="panel large-empty"><img src="./assets/friends.svg" alt="小兔与小熊"><h2>记录本还是空白的</h2><p>记下一顿饭、一次散步，或今天的体重。</p><button class="primary" data-action="choose-add">写下第一笔</button></section>`}`;
}
function chartSVG(weights) {
  if (!weights.length) return '<div class="large-empty"><p>这个日期范围还没有体重记录。<br>记下一次测量，就会在这里看到。</p></div>';
  const daily = new Map();
  weights.forEach(e=>daily.set(e.date,e.weight));
  const points = [...daily].sort(([a],[b])=>a.localeCompare(b));
  const values = points.map(p=>p[1]);
  const low = Math.floor((Math.min(...values)-.5)*10)/10;
  const high = Math.ceil((Math.max(...values)+.5)*10)/10;
  const first = new Date(range.start+'T12:00:00').getTime();
  const last = new Date(range.end+'T12:00:00').getTime();
  const x = date => first===last?260:45+(new Date(date+'T12:00:00').getTime()-first)/(last-first)*440;
  const y = value => 170-(value-low)/(high-low)*140;
  return `<svg class="chart" viewBox="0 0 520 210" role="img" aria-label="所选日期内的体重趋势，同日取最后一次记录">${[0,1,2,3].map(i=>{const value=low+(high-low)*i/3;return `<path d="M45 ${y(value)}H485" stroke="#e2e5d8" stroke-dasharray="4 5"/><text x="3" y="${y(value)+4}">${value.toFixed(1)}</text>`;}).join('')}<path d="${points.map(([date,value],i)=>`${i?'L':'M'}${x(date)},${y(value)}`).join(' ')}" stroke="#81986c" stroke-width="2.5" fill="none"/>${points.map(([date,value])=>`<circle cx="${x(date)}" cy="${y(value)}" r="4" fill="#fffdf8" stroke="#6d8658" stroke-width="2"><title>${date} · ${value} kg</title></circle>`).join('')}<text x="45" y="200">${range.start.slice(5).replace('-','/')}</text><text x="485" y="200" text-anchor="end">${range.end.slice(5).replace('-','/')}</text></svg>`;
}
function reportEntries() { return inRange(currentEntries(), range.start, range.end); }
function reportsView() {
  const stats = summarize(reportEntries());
  const first = stats.weights[0];
  const last = stats.weights.at(-1);
  return `<div class="page-title"><div><h1>日常小报告</h1><p>看看一路走来的足迹，也可以带走你的记录。</p></div><span class="eyebrow">YOUR OWN STORY</span></div><section class="panel report-tools"><div class="filters">${[['today','今天'],['week','近7天'],['month','近1个月'],['year','近1年'],['all','全部']].map(([id,title])=>`<button class="chip ${range.preset===id?'active':''}" data-range="${id}">${title}</button>`).join('')}</div><div class="dates"><input aria-label="报告开始日期" id="report-start" type="date" value="${range.start}" max="${range.end}"><span>至</span><input aria-label="报告结束日期" id="report-end" type="date" value="${range.end}" min="${range.start}" max="${localDay()}"></div></section><div class="report-grid"><section class="panel"><div class="panel-head"><h2>体重的小变化</h2><span>kg · 同日取最后一笔</span></div><div class="chart-wrap">${chartSVG(stats.weights)}</div><p class="chart-summary">${first ? `共 ${stats.weights.length} 次测量 · 首末体重 ${first.weight} → ${last.weight} kg` : '有记录的日子，才有测量点。'}<br>连线仅连接已有记录。</p></section><section class="panel report-stats"><div class="report-metric"><p>记录了饮食</p><strong>${stats.meals}</strong><small>餐</small></div><div class="report-metric"><p>累计活动</p><strong>${stats.minutes}</strong><small>分钟 / ${stats.activities} 次</small></div><div class="report-metric"><p>留下记录的日子</p><strong>${stats.days}</strong><small>天</small></div></section></div><section class="panel export-card"><h2>把这段日常带走 ${icon('download')}</h2><p>${range.start} — ${range.end} · 导出所选日期内的记录，供自己回顾或交给 AI 分析。</p><div class="actions"><button class="secondary" data-export="text">↗ 分享文字简报</button><button class="secondary" data-export="image">▧ 生成报告长图</button><button class="secondary" data-export="json">↓ 导出完整记录</button></div><p class="mini-note">统计只汇总你填写的记录。饮食按同一天的餐次计数。导出的文件可能包含你的健康信息与备注，请自行选择分享对象。</p></section>`;
}
function settingsView() {
  return `<div class="page-title"><div><h1>我的小空间</h1><p>记录属于你，想带走的时候就带走。</p></div></div><div class="settings-grid"><section class="panel"><h2>备份与恢复</h2><p>记录保存在这个浏览器里。换设备或清除浏览器数据前，请下载一份备份。恢复功能支持本网页版导出的完整备份文件。</p><div class="actions"><button class="secondary" data-action="backup">↓ 下载全部记录备份</button><button class="secondary" data-action="import">↑ 从备份恢复</button>${storageError ? '<button class="secondary" data-action="raw">↓ 下载原始存储数据</button>' : ''}</div></section><section class="panel"><h2>放到手机主屏幕</h2><p>在 iPhone 的 Safari 打开网页，点「分享」，选择「添加到主屏幕」。首次联网打开后，可在离线时继续记录。</p><p class="mini-note">各设备和浏览器分别保存记录。本站当前的访问权限由发布者设置。</p><button class="text-button" data-tab="about">了解这个小工具 →</button></section><section class="panel"><h2>先逛逛示例</h2><p>用一份虚构的两周记录，体验记录本和体重趋势。</p><button class="secondary" data-action="${demo?'exit-demo':'demo'}">${demo?'回到我的记录':'进入示例模式 ↗'}</button></section><section class="panel"><h2>整理记录本</h2><p>当前${demo?'示例':'本机'}共有 ${currentEntries().length} 条记录。单条记录可以在「记录本」里编辑或删除。</p><button class="secondary danger" data-action="clear">清空${demo?'示例':'本机'}记录</button></section></div>`;
}
function aboutView() {
  return `<div class="reading"><div class="page-title"><div><span class="eyebrow">A LITTLE LIFE EXPERIMENT</span><h1 style="margin-top:12px">你好，这里是动吃动吃。</h1></div></div><img src="./assets/friends.svg" alt="一起吃饭运动的小兔和小熊" style="width:100%;max-height:230px"><h2>好好吃饭，好好生活。</h2><p>这是 Robin 从第一次制作 iPhone App 开始的小尝试。后来，它变成了一个打开网页就能用的日常记录本。</p><h2>你的日常，由你保管。</h2><p>饮食、运动、体重和备注都保存在当前浏览器中。应用没有账户系统，也不会主动上传这些记录。浏览器数据清除或更换设备时，需要用你导出的备份恢复。</p><p>站点托管服务可能处理访问所需的常规网络信息。记录会在你主动导出或分享时包含在文件中。</p><h2>简单一点，也很好。</h2><p>统计和趋势来自你填写的数据。你可以选取一段时间，生成报告，交给自己选择的 AI 或专业人士进一步分析。</p><button class="primary" data-tab="today">回到今天 ${icon('arrow')}</button></div>`;
}
function openModal(html) {
  if (previewURL) { URL.revokeObjectURL(previewURL); previewURL = null; }
  modal.innerHTML = html;
  if (!modal.open) modal.showModal();
}
function modalHead(title) { return `<div class="modal-head"><h2>${title}</h2><button class="modal-close" data-close aria-label="关闭">×</button></div>`; }
function recordForm(type, existing) {
  const value = key => escapeHTML(existing?.[key] ?? '');
  const today = localDay();
  const foods = ['米饭','鸡蛋','面包','牛奶','面条','鸡肉','鱼','豆腐','青菜','水果'];
  const activities = ['散步','骑行','跑步','力量训练','瑜伽','游泳','羽毛球','跳绳'];
  openModal(`${modalHead(`${existing ? '编辑' : '记一下'}${types[type]}`)}<form id="record-form" data-type="${type}" data-id="${value('id')}"><div class="form-row"><label class="form-field">日期<input type="date" name="date" value="${existing?.date || today}" max="${today}" required></label>${type==='food'?`<label class="form-field">哪一餐<select name="meal">${['早餐','午餐','晚餐','加餐'].map(m=>`<option ${existing?.meal===m?'selected':''}>${m}</option>`).join('')}</select></label>`:''}</div>${type==='weight'?`<label class="form-field">体重（kg）<input name="weight" type="number" inputmode="decimal" min="1" max="500" step="0.1" value="${value('weight')}" placeholder="比如 64.5" required></label>`:`<label class="form-field">${type==='food'?'吃了什么':'做了什么运动'}<input name="title" maxlength="120" value="${value('title')}" placeholder="${type==='food'?'比如 米饭、鸡蛋、青菜':'比如 骑行'}" required></label><div class="suggestions">${(type==='food'?foods:activities).map(s=>`<button type="button" data-suggest="${s}">${s}</button>`).join('')}</div>${type==='food'?`<label class="form-field">份量（选填）<input name="quantity" maxlength="120" value="${value('quantity')}" placeholder="比如 一碗米饭、两个鸡蛋"></label>`:`<label class="form-field">时长（分钟）<input name="minutes" type="number" inputmode="numeric" min="1" max="1440" step="1" value="${value('minutes')}" placeholder="比如 30" required></label>`}`}<label class="form-field">想补充的话（选填）<textarea name="note" maxlength="2000" placeholder="记下当时的心情或细节">${value('note')}</textarea></label><p class="form-error" id="form-error" role="alert"></p><div class="dialog-actions"><button class="secondary" type="button" data-close>取消</button><button class="primary" type="submit">保存这一笔 ♡</button></div></form>`);
}
function confirmDialog(title, message, action, label = '确认删除') {
  openModal(`${modalHead(title)}<p class="confirm-copy">${escapeHTML(message)}</p><div class="dialog-actions"><button class="secondary" data-close>取消</button><button class="primary ${action==='confirm-clear'||action==='confirm-delete'?'danger':''}" data-action="${action}">${label}</button></div>`);
}
let deleteId;
function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = name;
  document.body.append(link); link.click(); link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
}
function reportText() {
  const data = reportEntries();
  const s = summarize(data);
  const lines = ['动吃动吃 · 日常简报', `${range.start} 至 ${range.end}`, `饮食 ${s.meals} 餐，共 ${s.foods} 条记录`, `运动 ${s.activities} 次，累计 ${s.minutes} 分钟`, `体重测量 ${s.weights.length} 次`];
  if (s.weights.length) lines.push(`首末体重 ${s.weights[0].weight} → ${s.weights.at(-1).weight} kg`);
  lines.push(`有记录的日子 ${s.days} 天`, '统计仅来自填写的记录。');
  return lines.join('\n');
}
async function exportReport(kind) {
  if(kind==='json') {
    download(new Blob([JSON.stringify({app:'dongchi',version:1,kind:'report',startInclusive:range.start,endInclusive:range.end,timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,entries:reportEntries()},null,2)],{type:'application/json'}),`动吃动吃_${range.start}_${range.end}.json`);
    toast('所选日期的记录已导出');
  } else if(kind==='text') {
    const text = reportText();
    try {
      if(navigator.share) await navigator.share({title:'动吃动吃 · 日常简报',text});
      else { download(new Blob([text],{type:'text/plain;charset=utf-8'}),`动吃动吃_简报_${range.end}.txt`); toast('文字简报已导出'); }
    } catch(error) { if(error.name!=='AbortError') { download(new Blob([text],{type:'text/plain;charset=utf-8'}),'动吃动吃_简报.txt'); } }
  } else { await imageReport(); }
}
async function imageReport() {
  const canvas = document.createElement('canvas');
  canvas.width = 900; canvas.height = 1450;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle='#f8f5ed';ctx.fillRect(0,0,900,1450);
  ctx.strokeStyle='#637b58';ctx.lineWidth=2;ctx.strokeRect(35,35,830,1380);
  ctx.fillStyle='#383b32';ctx.font='bold 46px sans-serif';ctx.fillText('动吃动吃',80,115);
  ctx.font='23px sans-serif';ctx.fillStyle='#7b826e';ctx.fillText('我的日常小报告',80,161);
  ctx.fillText(`${range.start} — ${range.end}`,80,208);
  const picture = new Image();picture.src='./assets/friends.svg';
  try { await picture.decode();ctx.drawImage(picture,425,55,380,230); } catch { /* The report remains readable without the decorative illustration. */ }
  ctx.fillStyle='#e5ebda';ctx.fillRect(70,270,760,230);
  const s=summarize(reportEntries());
  ctx.fillStyle='#4d6043';ctx.font='25px sans-serif';
  [`记录饮食   ${s.meals} 餐（${s.foods} 条）`,`累计运动   ${s.activities} 次 · ${s.minutes} 分钟`,`有记录的日子   ${s.days} 天`].forEach((line,i)=>ctx.fillText(line,105,330+i*60));
  ctx.fillStyle='#383b32';ctx.font='bold 28px sans-serif';ctx.fillText('体重的小变化',80,575);
  ctx.font='20px sans-serif';ctx.fillStyle='#7b826e';ctx.fillText('kg · 同日取最后一笔',80,615);
  if(s.weights.length) {
    const svg = chartSVG(s.weights).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="780" height="330" ');
    const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
    try { const image = new Image(); image.src=url;await image.decode();ctx.drawImage(image,60,655,780,330); }
    finally { URL.revokeObjectURL(url); }
    ctx.font='23px sans-serif';ctx.fillStyle='#4d6043';ctx.fillText(`首末体重   ${s.weights[0].weight} → ${s.weights.at(-1).weight} kg`,80,1050);
    ctx.fillText(`共 ${s.weights.length} 次测量`,80,1095);
  } else { ctx.font='24px sans-serif';ctx.fillText('这段时间还没有体重记录',230,810); }
  ctx.font='21px sans-serif';ctx.fillStyle='#7b826e';
  ['统计来自自行填写的记录。','连线仅连接已有测量点。','每一口、每一步，都值得记下来。'].forEach((line,i)=>ctx.fillText(line,80,1210+i*47));
  if(demo) { ctx.fillStyle='#ad7951';ctx.fillText('示例数据',700,1380); }
  const blob = await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
  if(!blob) {toast('图片生成失败，请重试');return;}
  openModal(`${modalHead('你的报告长图')}<p class="preview-help">可以下载图片，也可以在手机上长按图片保存。</p><img class="modal-preview" alt="动吃动吃报告长图"><div class="dialog-actions"><button class="primary" id="save-image">下载 PNG 图片</button></div>`);
  previewURL=URL.createObjectURL(blob);
  modal.querySelector('img').src=previewURL;
  modal.querySelector('#save-image').onclick=()=>download(blob,`动吃动吃_报告_${range.end}.png`);
}
function chooseImport() {
  const input = document.createElement('input');input.type='file';input.accept='.json,application/json';
  input.onchange = async()=>{
    const file=input.files[0];if(!file)return;
    try {
      if(file.size>20*1024*1024)throw new Error('备份文件超过 20 MB。');
      pendingImport=decodeBackup(await file.text());
      confirmDialog('从备份恢复',`这份备份有 ${pendingImport.length} 条记录。恢复会替换当前${demo?'示例':'浏览器'}中的全部记录，请先确认已有备份。`,'confirm-import','恢复这份备份');
    }catch(error){toast(error.message);}
  };input.click();
}
async function action(name) {
  if(name==='choose-add')openModal(`${modalHead('今天想记点什么？')}<div class="actions">${Object.entries(types).map(([type,title])=>`<button class="secondary" data-add="${type}">${icon(type)} ${title}</button>`).join('')}</div>`);
  if(name==='demo'){demo=true;demoData=demoEntries();render();toast('已进入独立的示例模式');}
  if(name==='exit-demo'){demo=false;render();}
  if(name==='backup') {
    if(storageError&&!demo){toast('读取失败，请下载原始数据留存');return;}
    download(new Blob([JSON.stringify(backupObject(currentEntries()),null,2)],{type:'application/json'}),`动吃动吃_完整备份_${localDay()}.json`);
    toast('备份已导出，请保存好');
  }
  if(name==='raw') {try{download(new Blob([localStorage.getItem(STORAGE_KEY)||''],{type:'application/json'}),'动吃动吃_原始数据.json');}catch{toast('浏览器拒绝读取本地存储');}}
  if(name==='import')chooseImport();
  if(name==='clear')confirmDialog('清空记录本？','将删除这个浏览器中保存的全部记录。删除后无法撤销，建议先下载备份。','confirm-clear','清空记录');
  if(name==='confirm-clear') {
    try {if(demo)demoData=[];else{saveEntries(localStorage,[]);entries=[];storageError='';}modal.close();render();toast('记录本已清空');}catch{toast('无法清空，请检查浏览器存储权限');}
  }
  if(name==='confirm-import') {
    try {if(demo)demoData=pendingImport;else{entries=saveEntries(localStorage,pendingImport);storageError='';}pendingImport=null;modal.close();render();toast('备份恢复完成');}catch(error){toast(`恢复失败。${error.message}`);}
  }
  if(name==='confirm-delete') {if(updateEntries(list=>list.filter(e=>e.id!==deleteId))){modal.close();toast('已删除这一笔');}}
}
document.addEventListener('click',async event=>{
  const button=event.target.closest('button,a[data-tab]');if(!button)return;
  if(button.dataset.tab){event.preventDefault();tab=button.dataset.tab;render();window.scrollTo({top:0,behavior:'instant'});}
  if(button.hasAttribute('data-close'))modal.close();
  if(button.dataset.add)recordForm(button.dataset.add);
  if(button.dataset.edit){const entry=currentEntries().find(e=>e.id===button.dataset.edit);if(entry)recordForm(entry.type,entry);}
  if(button.dataset.delete){deleteId=button.dataset.delete;confirmDialog('删除这条记录？','删除后无法撤销。','confirm-delete');}
  if(button.dataset.action)await action(button.dataset.action);
  if(button.dataset.filter){filter=button.dataset.filter;render();}
  if(button.dataset.suggest){const form=modal.querySelector('form');const field=form.elements.title;field.value=form.dataset.type==='food'&&field.value ? field.value+'、'+button.dataset.suggest : button.dataset.suggest;}
  if(button.dataset.range){
    const preset=button.dataset.range;let start=localDay();
    if(preset==='week')start=dateOffset(-6);
    if(preset==='month'||preset==='year'){
      const today = new Date();
      const year=today.getFullYear()-(preset==='year'?1:0);
      const month=today.getMonth()-(preset==='month'?1:0);
      const finalDay=new Date(year,month+1,0).getDate();
      const boundary=new Date(year,month,Math.min(today.getDate(),finalDay));
      start=dateOffset(1,boundary);
    }
    if(preset==='all')start=currentEntries().map(e=>e.date).sort()[0]||localDay();
    range={start,end:localDay(),preset};render();
  }
  if(button.dataset.export){try{await exportReport(button.dataset.export);}catch{toast('导出失败，请重试。');}}
});
document.addEventListener('change',event=>{
  if(event.target.id==='report-start'||event.target.id==='report-end') {
    const start=document.querySelector('#report-start').value;
    const end=document.querySelector('#report-end').value;
    if(!validDay(start)||!validDay(end)||start>end||end>localDay()){toast('请选择有效日期，开始日期需早于或等于结束日期。');render();return;}
    range={start,end,preset:'custom'};render();
  }
});
modal.addEventListener('submit',event=>{
  event.preventDefault();const form=event.target;const fields=new FormData(form);const type=form.dataset.type;
  const entry={id:form.dataset.id||crypto.randomUUID(),type,date:fields.get('date'),title:type==='weight'?'体重':fields.get('title').trim(),note:fields.get('note').trim()};
  if(type==='food'){entry.meal=fields.get('meal');entry.quantity=fields.get('quantity').trim();}
  if(type==='activity')entry.minutes=Number(fields.get('minutes'));
  if(type==='weight')entry.weight=Number(fields.get('weight'));
  try {
    validateEntries([entry]);if(entry.date>localDay())throw new Error('请选择今天或之前的日期。');
    const saved=updateEntries(list=>{
      if(form.dataset.id){const index=list.findIndex(e=>e.id===entry.id);if(index<0)throw new Error('这条记录已在其他窗口删除，请重新添加。');return list.map(e=>e.id===entry.id?entry:e);}
      return [...list,entry];
    });
    if(saved){modal.close();toast('记好啦，又留下一个小足迹 ♡');}
  }catch(error){form.querySelector('#form-error').textContent=error.message;}
});
window.addEventListener('storage',event=>{
  if(event.key===STORAGE_KEY||event.key===null){try{entries=readEntries(localStorage);storageError='';}catch{storageError='其他窗口更新的数据暂时无法读取。请先备份原始数据。';}render();}
});
render();
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
