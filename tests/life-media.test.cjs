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
      assert.ok(fs.existsSync(dir + 'assets/scene-' + key + '.jpg'));
    }
  }
});

test('scene photos match their manifest and include a vector fallback', () => {
  const manifest = JSON.parse(fs.readFileSync(dir + 'assets/SCENE_ASSET_MANIFEST.json'));
  for (const item of manifest.assets) {
    const image = fs.readFileSync(__dirname + '/../' + item.filename);
    assert.equal(crypto.createHash('sha256').update(image).digest('hex'), item.sha256);
    const html = art.choiceMedia({media:item.media});
    assert.ok(html.includes('assets/scene-' + item.media + '.jpg'));
    assert.match(html, /loading="lazy"/);
    assert.match(html, /<path d=/);
  }
  assert.equal(art.choiceMedia({}), '');
  assert.equal(art.sceneHeading('新场景'), '<h1>新场景</h1>');
});
