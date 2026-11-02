// JavaScript 负责交互：按钮被点击后，改变页面状态。
// 第一个功能：深色模式（保存到本机浏览器）。
const themeButton = document.querySelector('#themeButton');
const themeLabel = document.querySelector('#themeLabel');
const themeSymbol = document.querySelector('#themeSymbol');

function safeReadTheme() {
  try { return localStorage.getItem('mylifelab-theme'); }
  catch { return null; } // 某些浏览器设置可能禁止本地储存。
}

function setTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  themeButton.setAttribute('aria-pressed', String(isDark));
  themeButton.setAttribute('aria-label', isDark ? '切换浅色模式' : '切换深色模式');
  themeLabel.textContent = isDark ? '浅色' : '深色';
  themeSymbol.textContent = isDark ? '☀' : '☾';
  try { localStorage.setItem('mylifelab-theme', theme); } catch { /* 不支持也能使用 */ }
}

setTheme(safeReadTheme() === 'dark' ? 'dark' : 'light');
themeButton.addEventListener('click', () => {
  const isDark = document.documentElement.dataset.theme === 'dark';
  setTheme(isDark ? 'light' : 'dark');
});

// 第二个功能：筛选公开日志的分类。
const filterButtons = document.querySelectorAll('.filter-chip');
const journalCards = document.querySelectorAll('.journal-card');
const emptyMessage = document.querySelector('#emptyMessage');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    let visible = 0;
    journalCards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.hidden = !show;
      if (show) visible += 1;
    });
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    emptyMessage.hidden = visible !== 0;
  });
});

// 第三个功能：版权年份自动更新。
document.querySelector('#year').textContent = new Date().getFullYear();
