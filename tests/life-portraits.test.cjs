const {test}=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs');
const E=require('../life/story-engine.js'),S=require('../life/saves.js');
const manifest=require('../life/assets/PORTRAIT_ASSET_MANIFEST.json');
test('all 14 characters have distinct portrait paths; new six have packaged JPEGs',()=>{
  a.equal(E.characters.length,14);
  a.equal(new Set(E.characters.map(c=>c.image)).size,14);
  for(const c of E.characters)a.match(c.image,/^[\w-]+\.jpg$/);
  a.equal(manifest.assets.length,6);
  for(const asset of manifest.assets){
    a.equal(E.characters.find(c=>c.id===asset.characterId).image,asset.file);
    const data=fs.readFileSync(__dirname+'/../life/assets/'+asset.file);
    a.equal(data.readUInt16BE(0),0xffd8);a.ok(data.length<120000);
  }
});
test('existing character saves gain portraits without rewriting their personality or random state',()=>{
  for(const {characterId} of manifest.assets){
    const s=E.createCharacter(characterId,918737);
    s.personality='认真、珍惜身边的人，也有自己的边界';
    const before=JSON.parse(JSON.stringify(s));
    const m=new Map(),v=S.create({getItem:k=>m.get(k)||null,setItem:(k,x)=>m.set(k,x)},E.validateCharacter);
    v.start(s,'已有分支');v.checkpoint('原决策前');
    const restored=v.load(v.view().slots[0].id);
    a.deepEqual(restored,before);a.match(E.profile(restored).image,/^portrait-/);
    E.choose(s,0);E.choose(restored,0);a.deepEqual(restored,s);
    a.notEqual(E.createCharacter(characterId,918737).personality,before.personality);
  }
});
