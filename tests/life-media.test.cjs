const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const engine = require('../life/story-engine');
const dir = __dirname + '/../life/';
const art = vm.createContext({esc: x => x});
vm.runInContext(fs.readFileSync(dir + 'scene-art.js', 'utf8'), art);

test('every opening has a scene and a thumbnail for each action', () => {
  for (const character of engine.characters) {
    const state = engine.createCharacter(character.id, 715);
    const scene = engine.getScene(state);
    const keys = art.eventArt(scene, character.id);
    assert.equal(keys.length, scene.choices.length + 1, character.name);
    for (const key of keys) {
      assert.match(art.choiceMedia({}, key), /<svg/);
      assert.ok(fs.existsSync(dir + art.scenePhoto(key)));
    }
  }
});

test('scene photos match their manifest and include a vector fallback', () => {
  const manifest = JSON.parse(fs.readFileSync(dir + 'assets/SCENE_ASSET_MANIFEST.json'));
  for (const item of manifest.assets) {
    const image = fs.readFileSync(__dirname + '/../' + item.filename);
    assert.equal(crypto.createHash('sha256').update(image).digest('hex'), item.sha256);
    const html = art.choiceMedia({media:item.media});
    assert.ok(html.includes(item.filename.replace(/^life\//, '')));
    assert.match(html, /loading="lazy"/);
    assert.match(html, /<path d=/);
  }
  assert.equal(art.choiceMedia({}), '');
  assert.equal(art.sceneHeading('新场景'), '<h1>新场景</h1>');
});

test('scene pictures follow the setting, including authored turning points and optional art', () => {
  const key = (scene, id) => art.eventArt(scene, id)?.[0];
  assert.equal(key({title: '家宴厨房里的志浩', daily: true}, 'jieun97'), 'home');
  assert.equal(key({title: '客户带着旧纸条回来', daily: true}, 'aki91'), 'electronics');
  assert.equal(key({title: '一场没有观众的晚饭', daily: true}, 'noah73'), 'home');
  assert.equal(key({title: '试训时间与工作班次冲突'}, 'ana94'), 'track');
  const historyScene = {id: 'character_7', title: '给未来的自己', media: 'design'};
  assert.equal(key(historyScene, 'chen01'), 'design');
  assert.equal(key({title: '没有实物可配的回忆'}), undefined);
  assert.equal(key({...historyScene, media: '../elsewhere'}), undefined);
  assert.match(art.sceneHeading('训练场边', 'track'), /scene-track-sampa\.jpg/);
  assert.match(art.sceneHeading('训练场边', 'track'), /alt="[^"]*跑鞋/);
});

test('the 15 picture albums match their character and age, with three distinct imagined paths at 35', () => {
  const albums = vm.runInNewContext(fs.readFileSync(dir + 'stage-albums.js', 'utf8') + ';stageAlbums');
  const publicCast = engine.characters.filter(c => !c.hidden);
  assert.deepEqual(Object.keys(albums).sort(), publicCast.map(c => c.id).sort());
  const imageHashes = new Set();
  for (const character of publicCast) {
    const pictures = albums[character.id];
    assert.deepEqual(Array.from(pictures, p => p.age), [25, 35, 35, 35, 50, 65]);
    assert.equal(new Set(pictures.map(p => p.label)).size, 6);
    for (const image of pictures) {
      assert.ok(image.file.startsWith('portraits/' + character.id + '/' + character.id + '-age' + image.age + '-'));
      const data = fs.readFileSync(dir + 'assets/stages/' + image.file);
      assert.equal(data.readUInt16BE(0), 0xffd8, image.file);
      imageHashes.add(crypto.createHash('sha256').update(data).digest('hex'));
    }
  }
  assert.equal(imageHashes.size, 90);
});
