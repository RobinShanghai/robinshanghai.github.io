/* Discovery is local to this browser; it is an easter egg, not access control. */
(function(root){
const key='life_hidden_robin_v1',id='robin05';
function unlocked(storage){try{return storage?.getItem(key)==='1';}catch{return false;}}
function unlock(storage,rehearsal,validate){if(rehearsal?.step!==4||!validate(rehearsal))throw Error('先完成四个选择，再开启隐藏人生。');storage.setItem(key,'1');if(!unlocked(storage))throw Error('解锁未保存，请检查浏览器存储后重试。');return true;}
function available(cast,isUnlocked,currentId){return cast.filter(c=>!c.hidden||(c.id===id&&(isUnlocked||currentId===id)));}
const api={key,id,unlocked,unlock,available};root.LifeHiddenCharacter=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
