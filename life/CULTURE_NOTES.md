# 信念、环境压力与选择：小范围试点（2026-11-20）

## 文化资料与使用边界
|文化素材|依据|本轮范围|
|---|---|---|
|华人家庭中的生辰八字合婚|教育部台湾客语辞典“合婚”：https://hakkadict.moe.edu.tw/search_result/?id=9304 |陈晓雨亲友聚餐。辞典证实此习俗，不证明当代上海家庭的普及率；具体家庭、意见与对话均虚构。|
|日本神社的御神签|日本观光厅 Omikuji and Omigokoro：https://www.mlit.go.jp/tagengo-db/en/H30-00533.html |佐藤与妹妹散步。使用虚构签文，不冒用神社原文；未指定明治神宫，避免混同其诗签形式。|
|英美报纸星座专栏|Columbia Journalism Review历史回顾：https://www.cjr.org/analysis/horoscopes_astrology.php ；英国报纸档案：https://www.britishnewspaperarchive.com/blog/daily-express-sunday-express |Ethan与Ben看报纸，采用1970年代可见媒介，不使用现代App。英国角色后续再扩展。|
|当代美国占星、塔罗与算命参与|Pew 2025发布、2024调查：https://www.pewresearch.org/religion/2025/05/21/3-in-10-americans-consult-astrology-tarot-cards-or-fortune-tellers/ |只供当代文化参考，不把比例倒推到1973年，不作为游戏概率。娱乐参与不等于相信或据此作重大决定。|
|部分印度教社群的Jyotisha、本命盘与合婚|Hinduism Today 2015宗教自述：https://www.himalayanacademy.com/media/books/jyotisha-hindu-astrology_ei/jyotisha-hindu-astrology_ei.pdf |记录为后续素材，当前无印度角色，不新增人物凑事件。此资料只说明信仰者如何理解传统，不采用其超自然、科学或预测效力主张，也不代表全体印度人。|

## 已实现
- 只按具体角色生活圈触发，不按种族统一赋予信念。不生成四柱、星盘或“命好命差”隐藏属性。
- 新开陈晓雨/佐藤/Ethan使用storyRevision:3：保留原4日常，在第5重大节点之前增加1日常（每次4个有效选择）；第10重大节点增加记忆回访与1个可调整应对的选项。原重大节点仍12个，总日常27件。
- 描述读取现有压力stress及早期边界/相处标记，提供不同的内心反应；不诊断心理疾病，不锁死玩家选择。cultureApproach/Pressure/RememberedSupport/Revisited写入原flags，与关系、压力、自主权等一起存档。
- 数值变化均为游戏设计估计，不是心理学测量；占卜不更改RNG、历史事件或成功概率。日常影响现实状态，后续仍使用原概率机制。
- 玩家真实朋友的姓名、经历和私密信息未写入。恋爱晚、外貌、性别、是否发生亲密行为不触发自动自卑、创伤或不幸。
- 没有设“相信=失败、拒绝=胜利”。仪式可以成为交流机会，也可以拒绝；影响来自行动与社会回应，而非宇宙判定。

## 兼容与后续
- 旧storyRevision缺省/2继续4日常，不迁移、不插入新事件；新revision3是5日常。存储key、12重大节点和概率版本不变。陈晓雨后两个日常顺移后，音效按原场景映射。
- 原测试明确固定revision2用于回归，新增life-culture.test.cjs测试revision3及完整流程、回访、旧档、分支、导入导出、随机状态与音效映射。
- 尚未实现出生/小学章节、完整心理性格模型、八字/星盘计算。下一步先设计童年章节与存档兼容，再做一位角色试点；不把青年时的选择伪称为童年记忆。
