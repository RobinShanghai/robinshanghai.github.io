/* Two new lives; existing character objects are never rewritten.
   Robin: user-authorized parallel-life fiction, not a biography or personal assessment. */
(function(root){
const cast=typeof module!=='undefined'?require('./adversity.js'):root.LifeCharacters;
const context=cast.find(c=>c.id==='chen01');
const common={category:'普通与特殊人生',country:'中国',month:12,currency:'CNY',symbol:'¥',focus:'art',source:context.source,climate:0.02};
const additions=[{
 ...common,id:'zhixia01',name:'周知夏',gender:'女',city:'杭州',birth:1983,start:2001,image:'portrait-zhixia01-v1.jpg',title:'把普通生活录进磁带的人',tags:['普通家庭','声音创作','倾听者'],
 wealth:40,intellect:81,status:38,network:32,looks:80,art:86,sport:48,social:67,health:86,cash:4200,salary:12000,living:800,support:200,
 personality:'观察细腻、慢热，习惯先听完别人说话；不擅长直接拒绝',role:'声音制作学徒',goal:'留下城市里普通人的声音，也找到能长期过下去的日子',
 family:'父亲周建民教数学，母亲许静教语文。收入稳定但没有大笔闲钱；家里愿意留一个房间给你，却希望你尽快有可预测的工作。',
 mentor:'何岚',mentorRole:'音频编辑；重视核实和被采访者的意愿，希望培养能独立交付的新人',friend:'叶舟',friendRole:'印刷学徒兼老同学；喜欢画封面，想有自己的作品，而非一直替别人赶工',lover:'许闻（虚构同龄人）',
 opening:'2001年末，你借到一台旧录音机。何岚可以教你剪辑，叶舟想为声音故事画封面，母亲则带来一家培训机构的助教岗位信息。你想听见别人的人生，也需要安排自己的生活费。',
 opportunity:'一份地方声音节目的公开征稿',special:'街坊愿意讲旧事，但未必愿意让姓名和家庭细节公开。叶舟已经画好封面，何岚等着确认节目能否按期完成。',
 history:context.history.split('。')[0]+'。知夏的社区、岗位和征稿均为虚构；这一宏观变化不等于她能直接获得某个职位。',
 paths:[['学习录音剪辑，兼职维持生活','study','声音制作学徒'],['接受助教工作，周末采集声音','craft','助教与业余记录者'],['与叶舟试做小型声音刊物','venture','声音刊物策划人'],['留在本地工作，先帮助父母安排日常','family','本地机构助理']]
},{
 ...common,id:'robin05',name:'Robin',gender:'男',city:'上海',birth:1987,start:2005,image:null,hidden:true,title:'如果，Robin从这里重新选择',tags:['隐藏人物','平行人生','音乐与探索'],
 wealth:55,intellect:78,status:45,network:42,looks:80,art:82,sport:82,social:65,health:88,cash:12000,salary:18000,living:1200,support:500,
 personality:'好奇、喜欢亲自体验，重视自主空间，也会在多种兴趣之间犹豫（平行人生设定）',role:'寻找方向的上海青年',goal:'探索音乐、表达和实用创作，选择愿意长期过的生活',
 family:'这是以Robin的公开兴趣为灵感的平行人生。模拟中的家庭提供有限生活支持，希望你先安排收入和学习；家庭对话、关系、预算、能力值和青春经历全部是游戏虚构，不代表本人事实。',
 mentor:'顾言',mentorRole:'虚构的录音室老师；希望学生先完成一个小作品，允许兴趣不成为职业',friend:'陆川',friendRole:'虚构的同龄朋友；想尝试舞台，也需要兼顾工作，不愿把所有见面都变成项目',lover:'苏遥（虚构角色）',
 opening:'假设回到2005年末的上海，18岁的Robin还可以重新安排学习与工作。顾言愿意教你做一段录音，陆川邀你旁听排练，你也想学着制作简单网页。此时没有实时AI替你写程序，更没有人知道未来你会过怎样的日子。',
 opportunity:'一项需要提交作品样本的制作助理招募',special:'顾言可以借出一个空闲下午的录音设备，陆川想与你排一个短片段；两件事都要练习，不能靠热情同时答应。',
 history:'中国已于2001年加入世界贸易组织。2005年的Robin只能看到当时的工作与学习环境；上海与澳洲的生活兴趣用于虚构推演，迁居不会自动获批，也不预示本人经历。',
 paths:[['学吉他与录音，同时保留基础工作','study','录音学习者'],['参加业余排练，练习表达与合作','spotlight','业余舞台新人'],['学做简单网页，从小需求开始','venture','网页制作学徒'],['先稳定作息与收入，保留探索时间','craft','工作中的兴趣探索者']]
}];
for(const c of additions)if(!cast.some(x=>x.id===c.id))cast.push(c);
root.LifeCharacters=cast;if(typeof module!=='undefined')module.exports=cast;
})(globalThis);
