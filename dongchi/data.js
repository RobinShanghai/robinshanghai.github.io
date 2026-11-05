export const STORAGE_KEY = 'dongchi.diary.v1';
export const types = { food: '饮食', activity: '运动', weight: '体重' };
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function validDay(day) {
  if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const date = new Date(`${day}T12:00:00`);
  return Number.isFinite(date.getTime()) && localDay(date) === day;
}
export function validateEntries(entries) {
  if (!Array.isArray(entries) || entries.length > 50000) throw new Error('记录格式不正确，或超过了 50,000 条记录。');
  const ids = new Set();
  return entries.map(entry => {
    if (!entry || typeof entry.id !== 'string' || !entry.id || ids.has(entry.id) || !Object.hasOwn(types, entry.type) || !validDay(entry.date)) throw new Error('备份中有无效或重复的记录。');
    ids.add(entry.id);
    const text = key => {
      if (typeof entry[key] !== 'string' || entry[key].length > 4000) throw new Error('备份中的文字格式不正确。');
      return entry[key];
    };
    const clean = { id: entry.id, type: entry.type, date: entry.date, title: text('title'), note: text('note') };
    if (!clean.title.trim()) throw new Error('记录名称不能为空。');
    if (entry.type === 'food') {
      clean.meal = text('meal');
      clean.quantity = text('quantity');
      if (!['早餐', '午餐', '晚餐', '加餐'].includes(clean.meal)) throw new Error('餐次格式不正确。');
    }
    if (entry.type === 'activity') {
      if (!Number.isFinite(entry.minutes) || entry.minutes <= 0 || entry.minutes > 1440) throw new Error('运动时长应为 1–1440 分钟。');
      clean.minutes = entry.minutes;
    }
    if (entry.type === 'weight') {
      if (!Number.isFinite(entry.weight) || entry.weight < 1 || entry.weight > 500) throw new Error('体重应为 1–500 kg。');
      clean.weight = entry.weight;
    }
    return clean;
  });
}
export function decodeBackup(text) {
  const data = JSON.parse(text);
  if (data.app !== 'dongchi' || data.version !== 1 || data.kind !== 'backup') throw new Error('请选择「动吃动吃」网页版导出的完整 JSON 备份。');
  return validateEntries(data.entries);
}
export function readEntries(storage) {
  const saved = storage.getItem(STORAGE_KEY);
  return saved === null ? [] : decodeBackup(saved);
}
export function backupObject(entries) {
  return { app: 'dongchi', version: 1, kind: 'backup', exportedAt: new Date().toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, entries };
}
export function saveEntries(storage, entries) {
  const clean = validateEntries(entries);
  storage.setItem(STORAGE_KEY, JSON.stringify(backupObject(clean)));
  return clean;
}
export function summarize(entries) {
  const foods = entries.filter(e => e.type === 'food');
  const activities = entries.filter(e => e.type === 'activity');
  const weights = entries.filter(e => e.type === 'weight').sort((a, b) => a.date.localeCompare(b.date));
  return { meals: new Set(foods.map(e => `${e.date}/${e.meal}`)).size, foods: foods.length, minutes: activities.reduce((n, e) => n + e.minutes, 0), activities: activities.length, weights, days: new Set(entries.map(e => e.date)).size };
}
export function inRange(entries, start, end) {
  return entries.filter(e => e.date >= start && e.date <= end);
}
export function dateOffset(days, base = new Date()) {
  const date = new Date(base);
  date.setDate(date.getDate() + days);
  return localDay(date);
}
export function demoEntries() {
  const entries = [];
  for (let i = 0; i < 14; i++) {
    const date = dateOffset(-i);
    entries.push({ id: `demo-food-${i}`, type: 'food', date, title: i % 2 ? '米饭、清蒸鱼、炒青菜' : '鸡蛋三明治、牛奶', meal: i % 2 ? '午餐' : '早餐', quantity: '一人份', note: '' });
    if (i % 3 === 0) entries.push({ id: `demo-move-${i}`, type: 'activity', date, title: '散步', minutes: 30 + i, note: '沿着河边走走' });
    if (i % 2 === 0) entries.push({ id: `demo-weight-${i}`, type: 'weight', date, title: '体重', weight: +(64.5 + i * .04).toFixed(1), note: '' });
  }
  return entries;
}
