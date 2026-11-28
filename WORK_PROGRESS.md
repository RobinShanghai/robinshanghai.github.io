# 人生的变量 V3.0 · 青年篇
## 发布与恢复
开发基线 bebcd143b601d8229c0777fd919396346ffb6fb8。首个远端断点 0f6ba520e1245c607a3c5f8678fe5539cb533606。以 main 中标题为「Publish narrative youth chapter for all sixteen lives」的提交为本次游戏稳定版，后续部署记录见本页末尾。
## 已完成
- 15位公开人物和隐藏Robin。每人12个重大节点及原有日常。后台资源、健康、关系、魅力、判断、家庭与经历影响行动。日常和重大行为均可改变后续邀约。前台只呈现当前能采取的行动。新局标记 narrativeVersion:1，既有分支继续原有节点。
- 全员时代抉择，每人4个常规行动与1个条件行动，共80个具体行动，每个行动都有独立回访。时代史料随事件展示。
- 16个专属机会场景，各有沟通、观察两条条件邀约及后续履约行动。修正逆境人物工作、关怀、进修的结果错配，去除合并人物的重复关系条目。
- 核查15张公开档案照、90张成长照和原场景图，新增圣保罗跑道，更新图注和主题映射。25岁照片需同时符合年龄与在做的工作；中晚年相册为可能人生。Robin保留身份卡。
- 游戏、短篇及个人站的入口同步。旧版和新版均隐藏人物数值，检查点、手动存档、多分支、导入导出保留。
## 文件入口
剧情规则见 life/era-crossroads.js、opportunities.js、character-engine.js、story-engine.js。早期内容修正在 adversity-events.js、cast-{daily,depth}.js、continued-dialogue.js、new-lives-stories.js、personal-followups.js、relationship-events.js、story-events.js。
界面见 life/app.js、style.css、robin.{html,js}、life/index.html 与根 index.html。图像对应关系见 scene-art.js、stage-albums.js、assets/SCENE_ASSET_MANIFEST.json 和 scene-track-sampa.jpg。
## 验证
82项自动化测试全部通过。包括16人各6条路径完成整章、每次重大选择至少3项、分支存读、邀约出现与履约、旧档兼容、媒体加载和界面入口。本轮新增 tests/life-narrative.test.cjs，更新已有剧情和媒体测试。浏览器实测周知夏选角、开局、图片和选择反馈，390像素框架内可用内容宽375像素，无横向溢出。未使用实体iPhone。
## 后续
本轮需求已实现；若继续扩展中晚年，从现有分支编号另开章节。请先读最新 main 和本页，避免重复生成成长照片。发布状态在下方补记。

- 稳定版 6ce8ce0412ec568046443d55e9d7fdeb0d7dc351 已发布到 main。GitHub Pages 运行 46148066755 完成并成功；同期的个人站家庭手记已保留。线上入口 https://robinshanghai.github.io/life/ 。
