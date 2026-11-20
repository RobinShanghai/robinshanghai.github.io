/* Original procedural sounds; no recordings, downloads or game RNG access. */
(function(root){
const KEY='life_variables_audio_v1';
function sceneFor(s){
 if(!s||s.phase!=='scene')return null;
 if(s.storyActive){const active=s.storyRevision===3&&s.characterId==='chen01'&&s.storyCursor>=3?'chen01_daily_'+(s.storyCursor-1):s.storyActive;if(active==='camille08_daily_1')return 'pool';if(['chen01_daily_0','chen01_daily_3','yusuke91_daily_0','lin01_daily_0'].includes(active))return 'home';return null;}
 return s.storyVersion===1&&s.characterId==='camille08'&&[2,6].includes(s.turns)?'pool':null;
}
function create(env={}){
 const AC=env.AudioContext,doc=env.document||{},storage=env.storage;
 let prefs={enabled:false,ambient:false,volume:.35},ctx=null,master=null,desired=null,active=null,ready=false,pending=null,epoch=0,lastEffect=-Infinity;
 const voices=new Set();let ambience=[];
 try{const p=JSON.parse(storage?.getItem(KEY));if(p&&typeof p==='object'){prefs.enabled=p.enabled===true;prefs.ambient=p.ambient===true;if(Number.isFinite(p.volume))prefs.volume=Math.max(0,Math.min(1,p.volume));}}catch{}
 const visible=()=>!doc.hidden;
 function dispose(v){try{v.source.onended=null;v.source.stop();}catch{}for(const n of v.nodes)try{n.disconnect();}catch{}voices.delete(v);}
 function stopAmbient(){ambience.forEach(dispose);ambience=[];active=null;}
 function stop(){epoch++;stopAmbient();[...voices].forEach(dispose);}
 function remember(){try{storage?.setItem(KEY,JSON.stringify(prefs));}catch{/* Audio preferences never block saves or gameplay. */}}
 function connect(source,nodes){const v={source,nodes:[source,...nodes]};voices.add(v);source.onended=()=>{for(const n of v.nodes)try{n.disconnect();}catch{}voices.delete(v);};return v;}
 function tone(freq,time,duration,level=.09){const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.setValueAtTime(freq,time);gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(level,time+.008);gain.gain.exponentialRampToValueAtTime(.0001,time+duration);osc.connect(gain);gain.connect(master);const v=connect(osc,[gain]);osc.start(time);osc.stop(time+duration+.01);return v;}
 function noiseBuffer(kind){const seconds=kind==='home'?2:6,n=Math.ceil(ctx.sampleRate*seconds),b=ctx.createBuffer(1,n,ctx.sampleRate),data=b.getChannelData(0);let seed=81373,last=0;
  for(let i=0;i<n;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const white=seed/2147483648-1;
   if(kind==='home'){const beat=i%Math.floor(ctx.sampleRate),t=beat/ctx.sampleRate;data[i]=t<.035?white*Math.exp(-t*130)*.17:0;}
   else{last=.985*last+.015*white;const t=i/ctx.sampleRate;data[i]=last*(.45+.25*Math.sin(2*Math.PI*t/3)+.15*Math.sin(2*Math.PI*t/2));}
  }return b;
 }
 function sync(){if(!prefs.enabled||!prefs.ambient||!prefs.volume||!ready||!visible()||ctx?.state!=='running'||!desired){stopAmbient();return;}
  if(active===desired)return;stopAmbient();try{const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();source.buffer=noiseBuffer(desired);source.loop=true;filter.type='lowpass';filter.frequency.value=desired==='home'?1900:850;gain.gain.setValueAtTime(0,ctx.currentTime);gain.gain.linearRampToValueAtTime(desired==='home'?.22:.5,ctx.currentTime+.6);source.connect(filter);filter.connect(gain);gain.connect(master);ambience=[connect(source,[filter,gain])];active=desired;source.start();}catch{stopAmbient();}
 }
 function unlock(){if(!AC||!prefs.enabled||!visible())return Promise.resolve(false);try{if(!ctx){ctx=new AC();master=ctx.createGain();master.gain.value=prefs.volume;master.connect(ctx.destination);}if(ctx.state==='running'){ready=true;sync();return Promise.resolve(true);}if(pending)return pending;
  pending=Promise.resolve(ctx.resume()).then(()=>{ready=ctx.state==='running'&&visible();sync();return ready;},()=>false).finally(()=>{pending=null;});return pending;
 }catch{return Promise.resolve(false);}}
 async function play(kind){if(!['choice','page','save'].includes(kind)||!prefs.enabled||!prefs.volume||!visible())return false;const ticket=epoch;if(!await unlock()||ticket!==epoch||!prefs.enabled||!prefs.volume||!visible())return false;
  try{const t=ctx.currentTime;if(t-lastEffect<.07)return false;lastEffect=t;if(kind==='choice')tone(440,t,.075,.1);else if(kind==='page'){tone(260,t,.09,.06);tone(330,t+.045,.1,.045);}else{tone(523.25,t,.12,.07);tone(659.25,t+.09,.18,.06);}return true;}catch{return false;}
 }
 function configure(change){if(typeof change.enabled==='boolean')prefs.enabled=change.enabled;if(typeof change.ambient==='boolean')prefs.ambient=change.ambient;if(Number.isFinite(change.volume))prefs.volume=Math.max(0,Math.min(1,change.volume));remember();if(master)try{master.gain.setValueAtTime(prefs.volume,ctx.currentTime);}catch{}if(!prefs.enabled||!prefs.volume)stop();else sync();return {...prefs};}
 function setScene(kind){desired=['home','pool'].includes(kind)?kind:null;sync();}
 function pause(){ready=false;stop();try{Promise.resolve(ctx?.suspend()).catch(()=>{});}catch{}}
 doc.addEventListener?.('visibilitychange',()=>{if(!visible())pause();});env.addEventListener?.('pagehide',pause);
 return {supported:!!AC,settings:()=>({...prefs}),configure,unlock,play,setScene,pause};
}
const api={KEY,create,sceneFor};root.LifeAudio=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
