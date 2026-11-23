/* Version-gated authored dialogue. Existing saves retain their earlier choices. */
(function(root){
const ids=['noah73','ana94'],enabled=s=>ids.includes(s.characterId)&&s.flags.continuedDialogue==='1';
const responses={
noah73:[
 ['June 记得你说起想家：“你愿意听听我为什么想继续护士培训吗？我不能每次都替你跑演出。”',[
 ['先听姐姐的培训安排，再谈自己的演出',{family:5,stress:-3},'你们把各自重要的日子写下。亲近不等于随时有空。','schedule'],
 ['承认自己太依赖她，接回联系场地的事情',{skills:4,freedom:3},'你开始自己处理演出联络，让姐姐的时间回到她手里。','independent'],
 ['今晚先只做姐弟，暂时不安排任何工作',{health:3,family:4},'她讲起培训中的小事，没有新的合作承诺。','rest']]],
 ['June 提起你上次答应先听她的旋律：“今天能先听完，再谈改编吗？”',[
 ['完整听一遍，把想改的地方先记在自己纸上',{skills:4,family:3},'她愿意以后与你共同试唱，但不承诺替你处理其他事务。','collaborate'],
 ['问她想要建议，还是只需要一个听众',{family:5,freedom:2},'她今天只想有人听。你尊重了这个回答。','listen'],
 ['承认自己更想练独唱，分别安排练习',{skills:3,freedom:4},'你们保留各自的曲目，不必用合作证明感情。','independent']]],
 ['June 把唱片留在桌边：“上次你说累，我没有生气。但改约之后，别一直让我猜。”',[
 ['给一个自己能做到的日期，并写进日程',{family:4,skills:2},'约定变得具体，也给她留下自己的安排空间。','schedule'],
 ['坦白本周无法约定，先把唱片归还',{freedom:4,stress:-3},'你没有用新的承诺遮住疲惫。','rest'],
 ['问能否现在听一首，由她决定',{family:3,network:2},'她选了一首短曲，你没有要求她取消原来的计划。','listen']]]],
ana94:[
 ['Beatriz 记得你放慢脚步：“我愿意轮流帮忙，但弟妹的安排不能只靠我们临时猜。”',[
 ['各自写出能互助的时段，留出退出余地',{family:4,skills:3},'你们得到一份有限的互助安排，不是全天候的承诺。','schedule'],
 ['这次只听她说，暂不承担新的照护任务',{family:4,freedom:3},'你承认自己的时间有限，仍愿意关心她。','listen'],
 ['提议各自训练，每周交换记录',{skills:4,freedom:3},'伙伴关系不再要求每次一起到场。','independent']]],
 ['Beatriz 问：“你说练完再聊，我可以等，但能不能告诉我大概多久？”',[
 ['约定明确结束时间，让 Teresa 帮忙核对计划',{skills:4,network:2},'训练有了边界，你不用靠临时加量证明认真。','schedule'],
 ['道歉上次让她等，今天先听她的近况',{family:5,stress:-2},'她讲完以后自己决定下一步，你没有替她安排。','listen'],
 ['说明固定训练更适合自己，另约休息日相见',{skills:3,freedom:4},'友谊保留，训练时间不必完全相同。','independent']]],
 ['Beatriz 想起你们上次一起早点回家：“休息以后好一点了吗？我不想每次见面都比较谁更能撑。”',[
 ['一起把休息也写进下周安排',{health:5,skills:2},'计划里终于有不训练的时段。','recovery'],
 ['承认仍然疲惫，今天不加练',{health:5,stress:-4},'你没有得到额外成绩，也没有因此失去全部机会。','rest'],
 ['各自记录状态，之后再交流',{skills:4,freedom:3},'真实记录比相互催促更能帮助下一次安排。','independent']]]]
};
function day(s,sc){if(!enabled(s)||s.storyCursor!==1)return sc;const r=responses[s.characterId][Number(s.flags.everyday0)];if(!r)return sc;return{...sc,text:sc.text+'\n'+r[0],choices:[...sc.choices,...r[1].map(([label,effect,result,route])=>({label,effect,result,months:0,flag:{dialogueDirection:route},bond:1,media:s.characterId==='noah73'?'theatre':'street'}))]};}
function major(s,step,sc,ch){if(!enabled(s))return sc;const route=s.flags.dialogueDirection;if(step===8&&route){const noah=s.characterId==='noah73';const eligible=noah?['schedule','collaborate'].includes(route):['schedule','recovery'].includes(route);
 const result={...sc,text:sc.text+'\n'+(noah?'June 还记得你们如何安排听歌和培训时间。':'Beatriz 想起你们对训练、照护和休息的约定。')};
 if(eligible)result.choices=[...sc.choices,ch(noah?'先核对姐姐的培训日程，试排一首短合唱':'按互助与恢复计划试训，请教练复核负荷',noah?{skills:6,family:5,stress:1}:{skills:5,health:4,stress:-2},noah?'你们只约定一首歌，合写部分明确署名。June 的培训优先；排练不等于保证登台。':'你按能承担的时间试训。Teresa 看过记录再调整目标，没有承诺名次。',{flag:{dialogueOpportunity:true},bond:1,media:noah?'theatre':'street',require:x=>x.relations[1].closeness>=60&&(noah||x.health>=45),requireText:noah?'与 June 的关系至少60':'与 Beatriz 的关系至少60，健康至少45'})];return result;}
 if(step===9&&s.flags.dialogueOpportunity)return{...sc,text:sc.text+'\n'+(s.characterId==='noah73'?'那次短合唱排练已留下共同署名的记录；June 仍在继续自己的培训。':'那份试训与恢复记录还在，Beatriz 的互助有边界，你也能重新调整训练目标。')};return sc;}
function sync(s){if(enabled(s)&&s.storyPeople?.[0]&&s.relations?.[1])s.storyPeople[0].closeness=s.relations[1].closeness;}
const api={ids,enabled,day,major,sync};root.LifeContinuedDialogue=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
