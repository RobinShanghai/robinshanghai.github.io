/* Versioned, append-only checkpoints. Loading always creates a new branch. */
(function(root){
'use strict';
const KEY='life_variables_branches_v2',clone=x=>JSON.parse(JSON.stringify(x));
function create(storage,validate){
 let db={version:2,revision:0,active:null,branches:[],slots:[]};
 const id=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
 const name=s=>String(s||'未命名分支').trim().slice(0,80)||'未命名分支';
 const validState=s=>validate(s)&&(!('rngState'in s)||(Number.isInteger(s.rngState)&&s.rngState>0&&s.rngState<=4294967295));
 function check(d){
  if(!d||d.version!==2||!Number.isInteger(d.revision)||!Array.isArray(d.branches)||!Array.isArray(d.slots))throw Error('存档结构不正确');
  if(d.branches.length>500||d.slots.length>5000)throw Error('存档数量过多，请分批备份');
  const ids=new Set();
  d.branches.forEach(b=>{if(!b||typeof b.id!=='string'||ids.has(b.id)||typeof b.name!=='string'||!validState(b.state)||!validState(b.initial)||typeof b.updated!=='string')throw Error('人生分支已损坏');ids.add(b.id);});
  if(d.active!==null&&!ids.has(d.active))throw Error('当前分支不存在');
  const slots=new Set();d.slots.forEach(s=>{if(!s||typeof s.id!=='string'||slots.has(s.id)||!ids.has(s.branchId)||!validState(s.state)||typeof s.name!=='string'||typeof s.created!=='string')throw Error('检查点已损坏');slots.add(s.id);});return d;
 }
 const raw=storage.getItem(KEY);if(raw)db=check(JSON.parse(raw));
 function tx(fn){
  const latest=storage.getItem(KEY);if(latest&&JSON.parse(latest).revision!==db.revision)throw Error('另一标签页已更新存档，请刷新后继续');
  const next=clone(db);const result=fn(next);next.revision++;check(next);storage.setItem(KEY,JSON.stringify(next));db=next;return result;
 }
 function add(d,state,initial,label,parent=null){const b={id:id(),name:name(label),parent,state:clone(state),initial:clone(initial),updated:new Date().toISOString()};d.branches.push(b);d.active=b.id;return clone(b.state);}
 function checkpoint(d,label,kind){const b=d.branches.find(b=>b.id===d.active);if(!b)throw Error('请先开始人生');if(kind==='auto'&&d.slots.some(s=>s.branchId===b.id&&s.kind==='auto'&&s.state.turns===b.state.turns&&s.state.phase===b.state.phase&&(s.state.storyActive||null)===(b.state.storyActive||null)))return;d.slots.push({id:id(),branchId:b.id,name:name(label),kind,state:clone(b.state),created:new Date().toISOString()});}
 return {
  view:()=>clone(db),current:()=>clone(db.branches.find(b=>b.id===db.active)?.state||null),
  start:(s,label)=>tx(d=>add(d,s,s,label)),
  save:s=>tx(d=>{if(!validState(s))throw Error('游戏状态异常');const b=d.branches.find(b=>b.id===d.active);if(!b)throw Error('当前分支不存在');b.state=clone(s);b.updated=new Date().toISOString();}),
  checkpoint:(label,kind='manual')=>tx(d=>checkpoint(d,label,kind)),
  load:sid=>tx(d=>{const s=d.slots.find(s=>s.id===sid);if(!s)throw Error('检查点不存在');const b=d.branches.find(b=>b.id===s.branchId);return add(d,s.state,b.initial,b.name+' · 新选择',b.id);}),
  resume:bid=>tx(d=>{const b=d.branches.find(b=>b.id===bid);if(!b)throw Error('分支不存在');d.active=bid;return clone(b.state);}),
  replay:()=>tx(d=>{const b=d.branches.find(b=>b.id===d.active);return add(d,b.initial,b.initial,b.name+' · 重新出发',b.id);}),
  rename:(kind,key,label)=>tx(d=>{const item=(kind==='branch'?d.branches:d.slots).find(s=>s.id===key);if(!item)throw Error('存档不存在');item.name=name(label);}),
  remove:(kind,key)=>tx(d=>{if(kind==='branch'){if(key===d.active)throw Error('请先切换分支，再删除此分支');d.branches=d.branches.filter(b=>b.id!==key);d.slots=d.slots.filter(s=>s.branchId!==key);}else d.slots=d.slots.filter(s=>s.id!==key);}),
  export:()=>JSON.stringify({format:'life-variables-branches-2',data:db},null,2),
  import:text=>{const p=JSON.parse(text);if(p.format==='life-variables-web-1'){if(!validState(p.state))throw Error('旧存档损坏');return tx(d=>add(d,p.state,p.state,'导入旧存档（起点为导入时）'));}if(p.format!=='life-variables-branches-2')throw Error('不支持此格式');const incoming=check(p.data);return tx(d=>{const map=new Map(incoming.branches.map(b=>[b.id,id()]));incoming.branches.forEach(b=>d.branches.push({...clone(b),id:map.get(b.id),parent:map.get(b.parent)||null,name:name(b.name+' · 导入')}));incoming.slots.forEach(s=>d.slots.push({...clone(s),id:id(),branchId:map.get(s.branchId)}));if(incoming.active)d.active=map.get(incoming.active);return clone(d.branches.find(b=>b.id===d.active)?.state||null);});}
 };
}
root.LifeSaves={create,KEY};if(typeof module!=='undefined')module.exports=root.LifeSaves;
})(globalThis);

