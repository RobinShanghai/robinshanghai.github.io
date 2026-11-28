/* Browser chapter UI. Engine stays shared with the original WeChat projects. */
const E = LifeEngine, KEY = 'life_variables_web_chapter1_v1', LIMIT = 12;
const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state = null, page = 'cover', tab = 'story', timer, selected=null,  countryFilter='全部',categoryFilter='全部',decadeFilter='全部',genderFilter='全部';
const portrait=(c,alt)=>c?.hidden?`<div class="portrait-placeholder robin-identity" role="img" aria-label="Robin平行人生身份卡，非本人肖像"><strong>R.</strong><span>ROBIN · 隐藏档案</span><span>平行人生 · 本人肖像待提供</span></div>`:c?.image?`<img src="assets/${c.image}" alt="${esc(alt)}" loading="lazy">`:`<div class="portrait-placeholder" role="img" aria-label="${esc(alt)}，暂未配置肖像"><strong>${esc(c?.name||'人物')}</strong><span>人物档案 · 肖像待补</span></div>`;
const selectFilter=(id,label,values,value)=>`<label>${label}<select id="${id}" aria-label="${label}">${values.map(x=>`<option ${x===value?'selected':''}>${esc(x)}</option>`).join('')}</select></label>`;
$('app').addEventListener('error',e=>{if(e.target.matches?.('.choice-media img, .scene-heading img'))e.target.hidden=true;},true);
let soundStorage;try{soundStorage=window.localStorage;}catch{}
const sound=LifeAudio.create({AudioContext:window.AudioContext||window.webkitAudioContext,storage:soundStorage,document,addEventListener:window.addEventListener.bind(window)});
function syncSoundScene(){sound.setScene(page==='game'&&tab==='story'&&!$('settings').open?LifeAudio.sceneFor(state):null);}
function soundControls(){const p=sound.settings();$('soundEnabled').checked=p.enabled;$('ambientEnabled').checked=p.ambient;$('soundVolume').value=Math.round(p.volume*100);$('soundVolumeValue').value=Math.round(p.volume*100)+'%';for(const id of ['soundEnabled','ambientEnabled','soundVolume','soundPreview'])$(id).disabled=!sound.supported;$('soundStatus').textContent=sound.supported?'点击开启后播放；切到后台自动停止。场景声目前为家庭钟声和泳池水声的合成示意。':'当前浏览器不支持音效，文字游戏可正常游玩。';}
$('soundEnabled').onchange=()=>{sound.configure({enabled:$('soundEnabled').checked});syncSoundScene();soundControls();if(sound.settings().enabled)sound.play('choice');};
$('ambientEnabled').onchange=()=>{sound.configure({ambient:$('ambientEnabled').checked});syncSoundScene();soundControls();};
$('soundVolume').oninput=()=>{sound.configure({volume:Number($('soundVolume').value)/100});soundControls();};
$('soundPreview').onclick=()=>{if(!sound.settings().enabled){sound.configure({enabled:true});soundControls();}sound.play('save');};
document.addEventListener('click',e=>{if(e.isTrusted&&!e.target.closest('button:disabled'))sound.unlock();},true);
$('settings').addEventListener('close',syncSoundScene);
soundControls();
function valid(s) {
  if(s?.version===2)return E.validateCharacter(s);
  if (!s || s.version !== E.VERSION || s.mode !== 'random' || s.name !== 'Ethan Miller' || !['scene','result','end'].includes(s.phase)) return false;
  if (!Number.isInteger(s.turns) || s.turns < 0 || s.turns > LIMIT || !Number.isInteger(s.ageMonths) || s.ageMonths < 216 || s.ageMonths > 1800 || !Number.isInteger(s.year) || s.year < 2026 || s.year > 2200 || !Number.isInteger(s.month) || s.month < 1 || s.month > 12) return false;
  if (!['salary','savings','health','family','career','skills','network','stress','children'].every(k => Number.isFinite(s[k]))) return false;
  if (!E.stats(s).every(x=>x.value>=0 && x.value<=100) || typeof s.ended !== 'boolean' || typeof s.lastResult !== 'string') return false;
  if (!['role','city','origin','education','familyNotes'].every(k=>typeof s[k]==='string'&&s[k].length<1000)) return false;
  if (!Array.isArray(s.lastEventIds) || s.lastEventIds.length > 6 || !Array.isArray(s.milestones) || !Array.isArray(s.childrenNames) || !Array.isArray(s.history) || s.history.length !== s.turns) return false;
  if (!Number.isFinite(s.parentHealth)||s.parentHealth<0||s.parentHealth>100||!(s.partner===null||typeof s.partner==='string')||!s.lastEventIds.every(x=>typeof x==='string')||!s.milestones.every(x=>typeof x==='string')||!s.childrenNames.every(x=>typeof x==='string'))return false;
  if (!s.history.every(h=>h&&['date','title','decision','result','role'].every(k=>typeof h[k]==='string')&&Number.isFinite(h.age))) return false;
  return E.getScene(s).id === s.currentSceneId;
}
function toast(text) { ($('settings').open?$('settings'):document.body).appendChild($('toast'));  $('toast').textContent=text; $('toast').style.display='block'; clearTimeout(timer); timer=setTimeout(()=>$('toast').style.display='none',3500); }
let vault, storageError=false;
function save(){try{vault.save(state);return true;}catch(e){toast('保存失败：'+e.message+'。请导出当前备份。');return false;}}
try {vault=LifeSaves.create(localStorage,valid);state=vault.current();if(!state){const old=JSON.parse(localStorage.getItem(KEY));if(valid(old)){state=vault.start(old,'迁移旧进度（起点为迁移时）');}}document.body.classList.toggle('large',localStorage.getItem(KEY+'_font')==='large');} catch(e){storageError=true;toast('无法打开存档：'+e.message+'。请保留备份，暂不开始新游戏。');}
function start(id){try{if(storageError)throw Error('存档不可用，请先备份');const fresh=E.createCharacter(id||selected||E.characters[0].id,crypto.getRandomValues(new Uint32Array(1))[0]||2463534242);fresh.narrativeVersion=1;state=vault.start(fresh,fresh.name+' · 新人生');page='game';tab='story';checkpoint();render();}catch(e){toast(e.message);}}
function checkpoint(){if(state?.phase==='scene'&&state.turns<LIMIT){try{vault.checkpoint(E.getScene(state).title,'auto');}catch(e){toast('检查点保存失败：'+e.message);}}}
function openSaves(){sound.setScene(null);renderSaves();$('settings').showModal();}
function renderSaves(){if(!vault)return;const d=vault.view();$('saveList').innerHTML=`<h3>人生分支</h3>${d.branches.map(b=>`<article class="save-card"><strong>${esc(b.name)}</strong><small>${esc(b.state.name)} · ${E.ageOf(b.state)} 岁 · ${b.state.year} 年 · ${esc(E.getScene(b.state).title)}<br>${esc(new Date(b.updated).toLocaleString())}</small><button data-save-op="resume" data-id="${esc(b.id)}">${b.id===d.active?'当前分支':'继续此分支'}</button><button data-save-op="rename-branch" data-id="${esc(b.id)}">重命名</button>${b.id!==d.active?`<button data-save-op="delete-branch" data-id="${esc(b.id)}">删除</button>`:''}</article>`).join('')}<h3>决策前检查点与手动存档</h3>${d.slots.slice().reverse().map(c=>`<article class="save-card"><strong>${esc(c.name)}</strong><small>${esc(d.branches.find(b=>b.id===c.branchId)?.name)} · ${esc(c.state.name)} · ${E.ageOf(c.state)} 岁 · ${c.state.year} 年<br>${esc(new Date(c.created).toLocaleString())} · ${c.kind==='auto'?'自动检查点':'手动保存'}</small><button data-save-op="load" data-id="${esc(c.id)}">读取并创建新分支</button><button data-save-op="rename-slot" data-id="${esc(c.id)}">重命名</button><button data-save-op="delete-slot" data-id="${esc(c.id)}">删除</button></article>`).join('')||'<p>开始游戏后会自动保存决策前检查点。</p>'}`;}
function availableCast(){return LifeHiddenCharacter.available(E.characters,LifeHiddenCharacter.unlocked(soundStorage),state?.characterId);}
function filteredCast(){const allowed=new Set(availableCast().map(c=>c.id));return E.filterCharacters({category:categoryFilter,country:countryFilter,gender:genderFilter,decade:decadeFilter}).filter(c=>allowed.has(c.id));}
function cover(){const cast=filteredCast(),available=availableCast();return `<section class="cast-intro cast-landing"><div class="cast-poster"><img src="assets/life-ensemble-v2.jpg" srcset="assets/life-ensemble-v2-small.jpg 800w, assets/life-ensemble-v2.jpg 1600w" sizes="(max-width: 600px) calc(100vw - 36px), (max-width: 1220px) calc(100vw - 60px), 1160px" width="1600" height="900" alt="八人全明星群像：金智恩、Ethan、Camille、Maya、Noah、Ana、佐藤悠介与林禾" fetchpriority="high" decoding="async"><div class="cast-poster-caption"><div class="eyebrow">LIFE VARIABLES / CHOOSE YOUR BEGINNING</div><h1>人生的变量</h1></div></div><div class="cast-intro-copy"><p class="intro-lead">如果，人生可以重选。<br>成为你向往的人，也可以从逆境或普通日常里，走出自己的路。</p><p class="intro-detail">有人递来一卷还没剪好的磁带，有人等着你签收一车货。你手里有什么、以前答应过谁，都可能改变下一次敲门的人。</p><ul class="landing-facts" aria-label="当前可玩内容"><li>${E.characters.length}位人物 · ${E.characters.filter(c=>!c.hidden).length}位公开＋Robin隐藏人生</li><li>${new Set(E.characters.map(c=>c.country)).size}个国家 · 三类人生</li><li>18岁起步 · 青年篇</li><li>12次重大抉择＋专属日常</li><li>Save / Load · 独立人生分支</li></ul><div class="cast-actions"><button class="wide" data-action="random-all">全部已解锁人物随机（忽略筛选）</button><button class="wide" data-action="random-category">仅按当前类别随机（忽略其他筛选）</button>${state?'<button class="primary" data-action="begin">继续当前人生 →</button>':''}<button class="wide" data-action="random" ${cast.length?'':'disabled'}>在当前全部筛选结果中随机 ↻</button></div><p class="fine">${E.characters.length} 位人物 · ${available.length} 位已解锁。可按类别、国家、年代、性别筛选；随机模式的范围由你选择。</p><p class="fine">${available.some(c=>c.hidden)?'隐藏档案已开启：Robin可在普通与特殊人生中选择，也已加入随机范围。':'还有1位隐藏人物：<a href="robin.html">完成Robin的四步选择短篇</a>后解锁。未解锁人物不参加随机。'}</p><p class="fine">重大选择前可存档，读取后保留原分支，体验不同选择。当前开放青年篇，中晚年与完整一生仍在开发。</p></div></section><section aria-label="选择人物"><div class="cast-filters">${selectFilter('categoryFilter','人生类别',['全部','优势人生','逆境人生','普通与特殊人生'],categoryFilter)}${selectFilter('decadeFilter','出生年代',['全部','1950','1960','1970','1980','1990','2000'],decadeFilter)}${selectFilter('genderFilter','性别',['全部','男','女'],genderFilter)}<label>出生国家 <select id="countryFilter" aria-label="出生国家">${['全部',...new Set(available.map(c=>c.country))].map(t=>`<option ${t===countryFilter?'selected':''}>${esc(t)}</option>`).join('')}</select></label><span aria-live="polite">${cast.length} 位人物</span></div><div class="cast-grid">${cast.map(c=>`<article class="cast-card">${portrait(c,c.name)}<div class="cast-copy"><small>${esc(c.country)} · ${c.birth} 年出生</small><h2>${esc(c.title)}</h2><strong>${esc(c.name)}</strong><p>${esc(c.goal)}</p><button class="wide" data-character="${c.id}">了解这段人生 →</button></div></article>`).join('')}</div>${cast.length?'':'<p class="empty">这个组合暂时没有已解锁人物，请切换类别或筛选。</p>'}</section><p class="fine">人物与个人经历为虚构。Robin为本人兴趣启发的平行人生，关系与经历是虚构。人物肖像与群像海报为AI创作，不是真人合影或历史照片。</p>`;}
function stageAlbum(character) {
  const stages = stageAlbums[character.id];
  if (!stages) return '';
  const photos = stages.map(stage => {
    const caption = stage.age + '岁 · ' + stage.label;
    return `<figure><img loading="lazy" decoding="async" width="${stage.width}" height="${stage.height}"
      src="assets/stages/${esc(stage.file)}" alt="${esc(character.name)}，${esc(caption)}"
      data-portrait="assets/${esc(character.image)}"><figcaption>${esc(caption)}</figcaption></figure>`;
  });
  return `<details class="stage-album"><summary>成长相册 · 6 张照片</summary>
    <p>想象${esc(character.name)}在25、35、50和65岁时的生活。35岁的三张照片各是一条可能的路。</p>
    <div class="stage-photos">${photos.join('')}</div></details>`;
}

$('app').addEventListener('error', event => {
  const photo = event.target;
  if (!photo.matches?.('.stage-photos img[data-portrait]')) return;
  photo.src = photo.dataset.portrait;
  delete photo.dataset.portrait;
  photo.alt = '成长照加载失败，显示18岁档案照';
  photo.closest('figure').querySelector('figcaption').append('（暂以18岁档案照代替）');
}, true);

function detail(){const c=E.characters.find(c=>c.id===selected);return `<button class="quiet" data-action="browse">← 返回人物选择</button><section class="cover character-detail"><div class="cover-copy"><div class="eyebrow">${esc(c.country)} / ${c.birth} 年出生</div><h1>${esc(c.title)}</h1><h2>${esc(c.name)}</h2><p>${esc(c.family)}</p><p><strong>想尝试的人生</strong><br>${esc(c.goal)}</p><p>${esc(c.personality)}</p><button class="primary" data-action="start-character">选择这个身份 →</button><p class="fine">${c.start} 年，18 岁开始。开启新人生不会覆盖旧分支。</p></div><div class="cover-image">${portrait(c,c.name)}</div></section>${stageAlbum(c)}<section class="context-card"><h2>你将走入的年代</h2><p>${esc(c.history)}</p><a href="${c.source}" target="_blank" rel="noopener noreferrer">历史参考 ↗</a><p class="fine">史实仅作时代背景，人物、合同、经济数值与结果均为虚构。金额按开局币值作简化模拟，不用于跨年代购买力比较。</p>${c.category==='逆境人生'?`<h3>现实条件</h3><p>住房：${esc(c.housing)}<br>资产：${esc(c.assets)}<br>教育：${esc(c.educationBarrier)}<br>责任：${esc(c.obligation)}</p>`:''}<h3>已经在你生命里的人</h3><p><strong>${esc(c.mentor)}</strong> · ${esc(c.mentorRole)}</p><p><strong>${esc(c.friend)}</strong> · ${esc(c.friendRole)}</p></section>`;}
function profile(){
 const c=E.profile(state);
 const imageAt25=stageAlbums[c?.id]?.[0];
 const roleAt25={ethan73:/演员|演艺|表演/,chen01:/设计|产品|品牌/,noah73:/音乐|唱|乐手/,maya94:/演员|表演/,yusuke91:/技术|研发|工程|维修/,jieun97:/集团|文化项目/,lukas89:/出版|编辑/,camille08:/游泳|运动员/,lin01:/学|研究/,sam73:/维修|技工/,ruth73:/洗衣/,aki91:/维修|技术/,seo97:/账|仓库/,ana94:/跑|田径/,zhixia01:/声音|音频|录音/};
 const useStage=imageAt25&&E.ageOf(state)>=25&&E.ageOf(state)<30&&roleAt25[c.id]?.test(state.role);
 const picture=useStage?`<img src="assets/stages/${esc(imageAt25.file)}" alt="${esc(imageAt25.label)}">`:portrait(c||{image:'ethan.jpg'},state.name);
 return `<aside class="profile"><div class="profile-photo">${picture}<span class="photo-label">${c?.hidden?'Robin · 平行人生身份卡':useStage?'二十五岁时的留影':'十八岁时的档案照'}</span></div>
 <div class="profile-body"><h2>${esc(state.name)}</h2><p class="sub">${esc(state.city)} · ${E.ageOf(state)}岁</p><p>${esc(state.role)}</p></div></aside>`;
}
function story(){
 if(state.phase==='end'||(state.turns>=LIMIT&&state.phase!=='result'))return ending();
 if(state.phase==='result'){
   const record=E.currentRecord(state);
   return `<span class="scene-label">${esc(record.date)}</span><h1>${esc(record.title)}</h1><blockquote class="result-quote">${esc(record.decision)}</blockquote><p class="narrative">${esc(state.lastResult)}</p><button class="primary" data-action="next">${state.turns>=LIMIT?'回望这一章':'翻到下一页'}</button>`;
 }
 const scene=E.getScene(state),art=eventArt(scene,state.characterId);
 return `<span class="scene-label">${scene.daily?'生活片刻':esc(scene.tag)}</span>${sceneHeading(scene.title,art?.[0])}
 <p class="narrative">${esc(scene.text)}</p><div class="choice-heading">你会怎么做？</div>
 <div class="choices">${scene.choices.map((c,i)=>{
   if(c.require&&!c.require(state))return '';
   return `<button class="choice" data-choice="${i}"><span class="choice-text">${esc(c.label)}${c.description?`<span class="choice-description">${esc(c.description)}</span>`:''}</span></button>`;
 }).join('')}</div><div class="scene-tools"><button class="quiet" data-action="saves">在这里存档 ／ 读取存档</button>${scene.source?`<a href="${esc(scene.source)}" target="_blank" rel="noopener noreferrer">时代资料</a>`:''}</div>`;
}
function ending(){
 const record=state.history[0],c=E.profile(state);
 const recalled=state.narrativeVersion===1?state.history.at(-2):null;
 return `<span class="scene-label">青年篇 · 回望</span><h1>${esc(state.name)}的这一章</h1>
 <p class="narrative">十八岁那年，你在${esc(state.origin)}。${c?'当时的心愿是「'+esc(c.goal)+'」。':''}如今你${E.ageOf(state)}岁，正在做的事是${esc(state.role)}。</p>
 ${recalled?`<article class="entry"><small>${esc(recalled.date)}</small><h3>${esc(recalled.title)}</h3><p>${esc(recalled.decision)}</p></article>`:''}
 <p class="narrative">${esc(record?.result||state.lastResult)}</p><button class="primary" data-tab="journal">翻开人生手记</button>`;
}
function journal() {return `<span class="scene-label">THE DAYS WE LIVED</span><h1>人生手记</h1>${state.history.length?E.journal(state).map(h=>`<article class="entry"><small>${esc(h.date)} · ${h.age} 岁</small><h3>${esc(h.title)}</h3><p>你的选择：${esc(h.decision)}</p><p>${esc(h.result)}</p></article>`).join(''):'<p class="empty">第一笔，等你写下。做出选择后，经历会记在这里。</p>'}`;}
function person(){
 const c=E.profile(state);
 return `<h1>${esc(state.name)}</h1><p class="narrative">${esc(state.familyNotes)}</p>${c?`<p>${esc(c.personality)}</p>`:''}
 <p>${esc(state.role)} · ${esc(state.city)}</p>${state.partner?`<p>伴侣 · ${esc(state.partner)}</p>`:''}
 ${LifeCastDaily.peopleFor(state).map(r=>`<article class="entry"><h3>${esc(r.name)}</h3><p>${esc(r.role)}</p></article>`).join('')}`;
}
function render() {
 syncSoundScene();
 if(page==='detail'){$('app').innerHTML=detail();return;}
 if(page==='cover'){$('app').innerHTML=cover();return;}
 const d=E.summary(state); $('app').innerHTML=`<div class="chapter-line"><span><strong>第一章 · 试着生活</strong>${state.year>2026?' · 虚构未来':''} · ${esc(vault.view().branches.find(b=>b.id===vault.view().active)?.name)} / ${d.date}</span><span>${Math.min(LIMIT,state.turns)} / ${LIMIT} 次重大抉择${state.dailyHistory?.length?' · '+state.dailyHistory.length+' 个生活片刻':''}</span><div class="progress"><i style="width:${Math.min(100,state.turns/LIMIT*100)}%"></i></div></div><div class="game">${profile()}<section class="story"><nav class="tabs" aria-label="游戏页面">${[['story','此刻'],['person','人物'],['journal','人生手记']].map(([id,label])=>`<button class="tab ${tab===id?'active':''}" data-tab="${id}" aria-current="${tab===id?'page':'false'}">${label}</button>`).join('')}</nav>${tab==='journal'?journal():tab==='person'?person():page==='review'?ending():story()}</section></div>`;
}
$('app').addEventListener('click',event=>{
 const b=event.target.closest('button');if(!b||b.disabled)return;
 if(b.dataset.character){if(!availableCast().some(c=>c.id===b.dataset.character))return;selected=b.dataset.character;page='detail';render();window.scrollTo(0,0);return;}
 if(b.dataset.action==='browse'){page='cover';render();return;}
 if(b.dataset.action==='random-all'||b.dataset.action==='random-category'){const pool=b.dataset.action==='random-all'?availableCast():availableCast().filter(c=>categoryFilter==='全部'||c.category===categoryFilter);if(!pool.length){toast('这个类别暂时没有人物。');return;}selected=pool[Math.floor(Math.random()*pool.length)].id;page='detail';render();return;}
 if(b.dataset.action==='random'){const pool=filteredCast();if(pool.length){selected=pool[Math.floor(Math.random()*pool.length)].id;page='detail';render();window.scrollTo(0,0);}return;}
 if(b.dataset.action==='start-character'){if(!availableCast().some(c=>c.id===selected))return;start(selected);window.scrollTo(0,0);return;}
 if(b.dataset.action==='saves'){openSaves();return;}
 if(b.dataset.tab){tab=b.dataset.tab;render();return;}
 if(b.dataset.action==='begin'){if(storageError){toast('存档暂不可用，请先备份并检查浏览器存储。');return;}if(state){checkpoint();page=state.turns>=LIMIT&&state.phase!=='result'?'review':'game';render();}else start();return;}
 if(b.dataset.choice!==undefined && state.phase==='scene' && state.turns<LIMIT){const before=JSON.parse(JSON.stringify(state));E.choose(state,Number(b.dataset.choice));if(!save())state=before;else if(state.phase==='result')sound.play('choice');render();return;}
 if(b.dataset.action==='next'){if(state.version!==2&&state.turns>=LIMIT){page='review';render();return;}const before=JSON.parse(JSON.stringify(state));E.next(state);if(!save())state=before;else{checkpoint();sound.play('page');}render();globalThis.window?.scrollTo(0,0);}
});
$('app').addEventListener('change',event=>{if(event.target.id==='categoryFilter'){categoryFilter=event.target.value;render();}if(event.target.id==='decadeFilter'){decadeFilter=event.target.value;render();}if(event.target.id==='genderFilter'){genderFilter=event.target.value;render();}if(event.target.id==='countryFilter'){countryFilter=event.target.value;render();}});
function leaveGame(destination){if(storageError){toast('存档暂不可用，请先导出备份。');return false;}if(state&&!save())return false;if(destination==='robin'){window.location.assign('../');}else{page='cover';tab='story';if($('settings').open)$('settings').close();render();window.scrollTo(0,0);toast('进度已保存，可随时继续当前人生。');}return true;}
$('brand').onclick=e=>{e.preventDefault();leaveGame('home');};
$('homeBtn').onclick=()=>leaveGame('home');$('exitBtn').onclick=()=>leaveGame('home');
$('robinLink').onclick=e=>{e.preventDefault();leaveGame('robin');};
$('menuBtn').onclick=openSaves;$('closeSettings').onclick=()=>$('settings').close();
$('fontBtn').onclick=()=>{document.body.classList.toggle('large');try{localStorage.setItem(KEY+'_font',document.body.classList.contains('large')?'large':'normal');}catch{};};
$('restartBtn').onclick=()=>{try{if(!state){page='cover';render();}else{state=vault.replay();page='game';tab='story';checkpoint();render();}$('settings').close();toast('已从相同起点建立新分支，原进度仍保留。');}catch(e){toast(e.message);}};
$('manualSave').onclick=()=>{try{vault.checkpoint($('saveName').value||E.getScene(state).title);renderSaves();toast('已保存完整状态。');sound.play('save');}catch(e){toast(e.message);}};
$('saveList').onclick=event=>{const b=event.target.closest('[data-save-op]');if(!b)return;try{const op=b.dataset.saveOp,id=b.dataset.id;if(op==='load'||op==='resume'){state=vault[op](id);page='game';tab='story';checkpoint();$('settings').close();render();return;}if(op.startsWith('rename')){const label=prompt('输入新名称');if(label!==null)vault.rename(op.endsWith('branch')?'branch':'slot',id,label);}if(op.startsWith('delete')&&confirm('确认删除？此操作不能撤销，建议先导出备份。'))vault.remove(op.endsWith('branch')?'branch':'slot',id);renderSaves();}catch(e){toast(e.message);}};
$('exportBtn').onclick=()=>{try{const content=vault?vault.export():JSON.stringify({format:'life-variables-recovery',raw:localStorage.getItem(LifeSaves.KEY),legacy:localStorage.getItem(KEY)});const blob=new Blob([content],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='life-variables-all-branches.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('已导出全部分支和检查点。');}catch(e){toast(e.message);}};
$('importFile').onchange=async event=>{const file=event.target.files[0];event.target.value='';if(!file)return;try{if(file.size>10000000)throw Error('文件超过 10 MB');if(!vault)throw Error('本地存档异常，请先导出恢复备份');state=vault.import(await file.text());page=state?'game':'cover';tab='story';checkpoint();$('settings').close();render();toast('已追加导入，原有分支保持不变。');}catch(e){toast('未导入：'+e.message);}};
const requestedCharacter=new URLSearchParams(window.location.search).get('character');
if(requestedCharacter&&availableCast().some(c=>c.id===requestedCharacter)){selected=requestedCharacter;page='detail';}
render();

