// ---- The white realm (D-089): the player's renown among the high men, and what the realm offers those it knows.
//
// Renown (MN.r, saved as mn) rises with tasks done for the realm, trade, its places found and the old kingdom's ruins, its
// chronicles read, creatures of the wastes slain near its folk, the tourney and the fair; it falls when one of its folk is struck
// and much further when one is slain. Its ranks (MEN_AT): Stranger, Freeman, Friend of the Realm, Esquire; a knight is made only
// by the dubbing at a throne of the realm (MN.kn), and a knight of great renown is raised to Lord. Each rank brings a gift.
// Speaking with the folk (use one of them): a greeting by the player's standing, then what that one can do: merchants trade
// for coin; innkeepers give a bed for the night (the player wakes there after a fall), a meal and the rumours of the roads;
// healers heal and sell heartsease salve; smiths mend arms and tools and forge the realm's arms for those it trusts; grooms sell
// horses and keep a knight's charger; the crier tells the news; captains, lords, the herald and the throne give tasks, and the
// throne grants audiences, knighthood (with arms of the player's own choosing, painted on a banner of their arms) and lordship.
// Notice boards in the markets and on the greens offer tasks too: writs to carry, bounties on the wastes' creatures, supplies to
// bring, venison for a lord's table, a lost child to find, a relic of the old kings, a caravan to guard on the road (men-life.js).
// Justice: whoever strikes the realm's folk may pay amends to a captain or a lord; whoever slays one is outlawed in that kingdom
// for a while (its guards take them on sight) unless they pay the heavier fine. The horn of the realm calls its soldiers.
const MEN_AT=[0,10,30,70,140,240],MEN_RANK=['Stranger','Freeman of the Realm','Friend of the Realm','Esquire of the Realm','Knight of the Realm','Lord of the Realm'];
const MEN_GIFTS=[null,[[206,4],[431,2]],[[436,1],[433,3]],[[437,1],[401,1]],[[438,1],[MYARMS,4],[445,1]],[[441,1],[205,2]]];
let MN=saved&&saved.mn&&typeof saved.mn==='object'?saved.mn:null;
if(!MN)MN={r:0,kn:0,g:0,q:null,qn:0,tl:[],tln:{},au:{},out:{},arms:null,inn:-99,hl:-1e9,pt:0,hn:-1e9,tw:0,fair:-1,lord:'',sl:0};
const menSave=()=>({mn:MN});
const MEN_KINDS=new Set(['rspear','rsword','rbow','rcapt','rman','rwoman','rmerch','rsmith','rfarmer','rnoble','rking','rqueen','rcguard','rherald','rheal','rinn','rminst','rcrier','rwatch','rchild','rgirl','rshep','rsailor','rwarden','rjoust']);
function menPeopleOf(f){if(!f)return false;const C=f.site&&f.site.prov&&f.site.prov.cult;if(C)return C.k==='white';return MEN_KINDS.has(f.kind);}
const menRank=()=>{let r=0;while(r+1<MEN_AT.length&&MN.r>=MEN_AT[r+1])r++;return MN.kn?Math.max(4,r):Math.min(3,r);};
const menRankName=()=>MEN_RANK[menRank()];
function menGain(n,why){if(!n)return;const r0=menRank();MN.r=Math.max(-80,Math.min(500,MN.r+n));saveDirty=true;const r1=menRank();
  if(why)toast(why+' ('+(n>0?'+':'')+n+' renown in the realm)');if(r1>r0)setTimeout(()=>menRankUp(r1),why?1600:0);}
function menRankUp(r){toast('The realm now names you '+MEN_RANK[r]);if(r===3)setTimeout(()=>toast('An esquire of great renown may ask for knighthood at a throne of the realm'),2600);menGift(r);}
function menGift(r){if(MN.g>=r)return;MN.g=r;const L=MEN_GIFTS[r];if(!L)return;const got=[];if(SURV())for(const [id,c] of L){const left=addItem(id,c);if(left)toast('No room for '+nameOf(id));got.push((c>1?c+' ':'')+nameOf(id));}
  if(got.length)setTimeout(()=>toast('In token of it the realm gives you '+got.join(', ')),2400);drawBar(true);saveDirty=true;}
const menTitle=()=>MN.kn?(MN.lord?'Lord of '+MN.lord:'Sir Knight'):'';
// ---- greetings, by the player's standing (a knight is bowed to; a stranger hears the old greetings, FOLK_SAY)
const MEN_HAIL=['Well met, {t}.','Good morrow to you, {t}.','The realm is glad of you, {t}.','Your servant, {t}.','Welcome back to {p}, {t}.'];
function menGreet(f,F){const r=menRank(),who=(f.nm||F.n)+': ',p=f.site?f.site.name:'the realm';
  if(r>=4){f.bow=foeClock+2;return who+'"'+MEN_HAIL[Math.floor(Math.random()*MEN_HAIL.length)].replace('{t}',MN.lord?'my lord':'good knight').replace('{p}',p)+'"';}
  if(r>=2&&Math.random()<0.6)return who+'"'+MEN_HAIL[Math.floor(Math.random()*3)].replace('{t}','friend').replace('{p}',p)+'"';
  return null;}
// ---- struck, slain, outlawed
const menOutlaw=f=>!!(f&&f.site&&f.site.prov&&f.site.prov.cult.k==='white'&&(MN.out[f.site.prov.kingdom.key]||0)>MN.pt);
function menStruck(f){if(menPeopleOf(f))menGain(-6,'You struck one of the realm\'s folk');}
function menSlain(f){const F=FOES[f.kind];if(F.folk){if(menPeopleOf(f)&&f.site&&!f.war&&!f.host){menGain(-25,'You slew one of the realm\'s folk');const K=f.site.prov.kingdom;MN.out[K.key]=MN.pt+900;saveDirty=true;
      setTimeout(()=>toast('You are outlawed in '+K.name.replace(/^The /,'the ')+'. Its guards will take you on sight, unless you pay the fine at one of its captains or lords.'),2400);}return;}
  if(MN.q&&MN.q.k==='bounty'){MN.q.c=Math.max(0,MN.q.c-1);if(!MN.q.c)toast('The bounty is earned; claim it from the realm');}
  let near=false;foeNear(f.x,f.z,30,g=>{if(!near&&!g.dead&&FOES[g.kind].folk&&menPeopleOf(g))near=true;},0);if(near){MN.sl++;if(MN.sl%3===0)menGain(1,null);}}
// amends: a captain or a lord takes the fine and the province's wrath (and the kingdom's outlawry) is ended
function menAmends(f){const s=f.site,K=s&&s.prov.kingdom,out=K&&(MN.out[K.key]||0)>MN.pt,v=out?200:30;
  if(!payCoin(v))return 'They want '+coinWord(v)+' in amends, and you have not got it.';realmWrath.delete(f.prov);if(out)delete MN.out[K.key];saveDirty=true;
  for(const g of foes)if(g.prov===f.prov&&!g.dead){g.foe=null;if(g.st==='chase'||g.st==='flee'){g.st='return';g.t=4;}}
  menGain(2,null);return 'You pay '+coinWord(v)+' in amends. "It is paid. The king\'s peace is on you again; keep it."';}
// ---- the panel (the elves' panel, D-088) and the folk who do more than greet
const MEN_TRADE=new Set(['rmerch']),MEN_TASK=new Set(['rcapt','rnoble','rherald','rking','rqueen']),MEN_COURT=new Set(['rking','rqueen']);
function menAct(){const f=foeHit(4.6);if(!f||f.dead||!FOES[f.kind].folk||f.foe&&!folkWrath(f))return false;if(!menPeopleOf(f)||f.war||f.host||f.hst||(f.site&&f.site.k==='wgate'))return false;
  if(folkWrath(f)){if(f.kind==='rcapt'||f.kind==='rnoble'||MEN_COURT.has(f.kind)){menTalk(f,1);return true;}return false;}menTalk(f);return true;}
function menTalk(f,wrath){const F=FOES[f.kind],s=f.site,r=menRank(),spk=f.spk||'',heal=f.kind==='rheal'||spk==='r_heal',inn=f.kind==='rinn'||spk==='r_inn',smith=f.kind==='rsmith'||spk==='r_smithy',stab=spk==='r_stable',throne=MEN_COURT.has(f.kind)||spk==='r_throne'&&F.civ;
  f.st='idle';f.t=6;f.yaw=f.hd=Math.atan2(PL.x-f.x,PL.z-f.z);if(r>=4&&!wrath)f.bow=foeClock+2;
  elfPanel((f.nm||F.n)+(s?', '+s.name:''),U=>{
    if(wrath){U.text('"You have broken the king\'s peace here. Pay what is owed, and it is mended."');const b=U.row();U.btn(b,'Pay amends',()=>menAmends(f));U.btn(b,'Farewell',()=>{closeInv();return false;});return;}
    U.text('"'+(FOLK_SAY[f.kind]||FOLK_SAY[F.say]||FOLK_SAY.guard)[Math.floor(Math.random()*3)].replace('{p}',s?s.name:'the realm').replace('{k}',s?s.prov.kingdom.name.replace(/^The /,'the '):'the realm')+'"');
    U.text('You are '+MEN_RANK[r]+(menTitle()?' ('+menTitle()+')':'')+' in the realm. Renown '+MN.r+(r<3&&r+1<MEN_AT.length?' ('+MEN_AT[r+1]+' for '+MEN_RANK[r+1]+')':r===3?(MN.r>=MEN_AT[4]?' (enough to ask for knighthood at a throne)':' ('+MEN_AT[4]+' to ask for knighthood)'):'')+'.');
    if(MN.q){const q=MN.q;U.text('Your task: '+q.n+'.');const b=U.row();if(menTaskReady(q))U.btn(b,'Tell them the task is done',()=>menTaskDone());U.btn(b,'Give up your task',()=>{MN.q=null;saveDirty=true;return 'You give up the task.';});}
    const b=U.row();
    if(MEN_TRADE.has(f.kind)||spk==='r_market')U.btn(b,'Trade',()=>{menTradePanel(f);return false;});
    if(inn){U.btn(b,'Take a room for the night ('+coinWord(r>=4?0:6)+')',()=>menInn(f));U.btn(b,'Buy a meal (4 copper)',()=>menMeal());U.btn(b,'Hear the rumours',()=>menRumour());}
    if(heal){U.btn(b,'Ask to be healed'+(r>=2?'':' (4 copper)'),()=>menHeal());U.btn(b,'Buy heartsease salve (12 copper)',()=>menBuy(435,12,1,true));}
    if(smith){U.btn(b,'Mend your arms and tools',()=>menMend());U.btn(b,'Have arms forged',()=>{menForgePanel(f);return false;});}
    if(stab){U.btn(b,'Buy a horse (80 copper)',()=>menHorse());if(MN.kn)U.btn(b,'Ask for your charger',()=>menCharger(f));}
    if(f.kind==='rcrier')U.btn(b,'Hear the news',()=>menNews());
    if(f.kind==='rwarden'||spk==='r_kings')U.btn(b,'Ask of the kings who lie here',()=>{menChronicle(s,true);return false;});
    if(throne)U.btn(b,'Ask for an audience',()=>menAudience(f));
    if((MEN_TASK.has(f.kind)||throne)&&!MN.q)U.btn(b,'Ask for a task',()=>{const q=menTaskGive(f.site,null,MEN_COURT.has(f.kind));if(q){closeInv();return false;}return 'There is nothing the realm needs of you now.';});
    if(spk==='r_pavil'||spk==='r_herald')U.btn(b,'Ask about the tourney',()=>menTourneyAsk(f));
    U.btn(b,'Farewell',()=>{closeInv();return false;});});
  foeCall(f,'idle');tone(520,660,0.16,0.05);hint('men');}
// ---- the market: the realm's goods ([item, price in copper, the least rank]) and what it buys
const MEN_GOODS=[[206,2],[431,3],[432,2],[433,5],[434,8],[435,12],[409,1],[338,3],[406,40,1],[401,50,1],[381,60,1],[436,90,2],[382,120,2],[413,70,3],[437,160,3],[438,280,4],[MYARMS,8,4]];
const MEN_BUYS=[[202,1],[207,1],[350,3],[351,2],[352,3],[362,6],[WOOLW,2],[223,4],[224,12],[227,10],[228,30],[230,40],[415,25],[386,20],[442,90],[443,60],[444,70],[440,50]];
const MEN_BUYK=[1.4,1.2,1,0.9,0.75,0.65],MEN_SELLK=[0.6,0.75,0.85,0.95,1.05,1.15];
const menPrice=c=>Math.max(1,Math.round(c*MEN_BUYK[menRank()])),menOffer=c=>Math.max(1,Math.round(c*MEN_SELLK[menRank()]));
function menBuy(id,c,n,fixed){const v=(fixed?c:menPrice(c))*n;if(!payCoin(v))return 'You have not the coin ('+coinWord(v)+')';const left=addItem(id,n);if(left)toast('No room for '+nameOf(id));
  drawBar(true);saveDirty=true;if(v>=20)menGain(1,null);return 'You buy '+(n>1?n+' ':'')+nameOf(id)+' for '+coinWord(v);}
function menSell(id,c,n){if(SURV()){if(countOf(id)<n)return 'You have no '+nameOf(id);takeItems(id,n);}const v=menOffer(c)*n;giveCoin(v);saveDirty=true;if(v>=20)menGain(1,null);return 'You sell '+(n>1?n+' ':'')+nameOf(id)+' for '+coinWord(v);}
function menTradePanel(f){const r=menRank();elfPanel('The market of '+(f.site?f.site.name:'the realm'),U=>{
  U.text('Your purse: '+coinWord(purse())+(SURV()?'':' (in creative the realm gives freely)')+'. Prices for '+MEN_RANK[r]+(r<2?': they are better for a friend of the realm.':'.'));
  U.text('They sell:');for(const [id,c,need] of MEN_GOODS){if((need||0)>r){U.text('  '+nameOf(id)+': for '+MEN_RANK[need]+' and above');continue;}const row=U.row();
    U.btn(row,nameOf(id)+' ('+coinWord(menPrice(c))+')',()=>menBuy(id,c,1));if(stackMax(id)>1)U.btn(row,'Four',()=>menBuy(id,c,4));}
  const mine=MEN_BUYS.filter(([id])=>!SURV()||countOf(id)>0);U.text(mine.length?'They will buy:':'They would buy grain, wool, hides and leather, ingots, gems, drake scales and the relics of the old kings; you have none of these.');
  for(const [id,c] of mine){const row=U.row();U.btn(row,'Sell '+nameOf(id)+' ('+coinWord(menOffer(c))+(SURV()?', you have '+countOf(id):'')+')',()=>menSell(id,c,1));}
  U.btn(U.row(),'Back',()=>{menTalk(f);return false;});});}
// ---- the inn: a bed (the night passes, the player wakes there after a fall), a meal, the rumours of the roads
function menInn(f){const v=menRank()>=4?0:6;if(MN.inn===dayN&&!ambNight())return 'Your room is kept for you tonight.';if(v&&!payCoin(v))return 'A room is '+coinWord(v)+', and you have not got it.';
  MN.inn=dayN;spawnW=[PL.x+OX,PL.y,PL.z+OZ];if(SURV()){hp=20;food=Math.max(food,14);drawStats();}
  if(settings.time==='cycle'&&ambNight()){if(tod>0.5)dayN++;tod=0.26;}saveDirty=true;
  return 'You sleep under the inn\'s roof'+(settings.time==='cycle'?' and wake at dawn':'')+', rested. Should you fall in your travels, you will wake here.';}
function menMeal(){if(!payCoin(4))return 'A meal is 4 copper, and you have not got it.';if(SURV()){food=Math.min(20,food+10);hp=Math.min(20,hp+2);drawStats();}return 'A meat pie and a cup of ale. You feel better for it.';}
// the rumours: of the old kingdom's nearest ruin, the nearest lists or port, the war in the east, the elves and the dwarves; a
// place spoken of is marked on the map
function menRumour(){const X=PL.x+OX,Z=PL.z+OZ,cx=Math.floor(X/CS),cz=Math.floor(Z/CS),opts=[];
  {let best=null,bd=1e9;for(let a=-40;a<=40;a++)for(let b=-40;b<=40;b++){const o=oldAt(cx+a,cz+b);if(!o)continue;const d=Math.hypot(o.X-X,o.Z-Z);if(d>40&&d<bd){bd=d;best=o;}}
    if(best)opts.push(['A carter swears there are stones of the old kings out '+dirWord(best.X-X,best.Z-Z)+', some '+Math.round(bd/10)*10+' paces off: '+best.name+'. "Nobody goes there," he says, "but there might be gold."',best]);}
  for(const s of realmTile(Math.floor(X),Math.floor(Z)).sites)if(s.k==='lists'||s.k==='port')opts.push([s.k==='lists'?'There will be jousting at '+s.name+', they say, when the knights come.':'The ships are in at '+s.name+', and the fish is cheap.',s]);
  const w=WARS&&Object.values(WARS)[0];if(w)opts.push(['Word from the east: the hosts still lie before the Ashen Gate, and the fires of the wastes burn on.',null]);
  opts.push(['A traveller from the mountains says the elves are leaving: their white ships sail west and do not come back.',null],['The dwarves sell good steel, if you can stand their haggling.',null],['The king\'s granaries are full this year. Bread is cheap.',null]);
  const [t,pl]=opts[Math.floor(Math.random()*Math.min(opts.length,3))];if(pl&&notePlace(pl.name,pl.X,pl.Z))return t+' (marked on your map)';return t;}
// ---- healers, smiths, grooms, the crier
function menHeal(){if(menRank()<2&&!payCoin(4))return 'The healer asks 4 copper for her herbs, and you have not got it.';if(SURV()){hp=20;drawStats();}let msg='The healer binds your wounds with heartsease. You are whole again.';
  if(menRank()>=2&&MN.pt-MN.hl>600){MN.hl=MN.pt;if(SURV())addItem(435,1);msg+=' "Take this for the road." (Heartsease Salve)';drawBar(true);}saveDirty=true;tone(780,1040,0.35,0.05);return msg;}
function menMend(){const L=[...inv.filter(q=>q&&q.d&&durOf(q.id)),...Object.values(equip).filter(q=>q&&q.d)];if(!L.length)return 'Nothing of yours wants mending.';
  const v=Math.max(2,Math.round(L.reduce((a,q)=>a+q.d,0)/25));if(!payCoin(v))return 'The smith asks '+coinWord(v)+', and you have not got it.';for(const q of L)q.d=0;drawBar(true);saveDirty=true;burst(0.3,'bandpass',2400,4,0.2);return 'The smith mends '+L.length+' of your things for '+coinWord(v)+'. They are as good as new.';}
function menForgePanel(f){const r=menRank();elfPanel('The forge of '+(f.site?f.site.name:'the realm'),U=>{U.text('"I forge the realm\'s arms for those the realm trusts."');
  for(const [id,c,need] of [[381,60,1],[401,50,1],[382,120,2],[413,70,3],[437,160,3],[438,280,4]]){const row=U.row();if(need>r){U.text('  '+nameOf(id)+': for '+MEN_RANK[need]+' and above');continue;}U.btn(row,nameOf(id)+' ('+coinWord(menPrice(c))+')',()=>menBuy(id,c,1));}
  U.btn(U.row(),'Back',()=>{menTalk(f);return false;});});}
function menHorse(){if(!payCoin(80))return 'A horse is 80 copper, and you have not got it.';const a=PL.yaw,x=PL.x-Math.sin(a+0.8)*2.5,z=PL.z-Math.cos(a+0.8)*2.5,y=standY(x,PL.y+1,z);
  const h=addAnimal('horse',x,y>0?y:PL.y,z,{tame:true,uid:Date.now().toString(36)+'h',st:'idle',t:2});h.yaw=h.hd=Math.atan2(PL.x-x,PL.z-z);saveDirty=true;animalCall(h,false);return 'The groom leads out a horse and puts its rein in your hand. It is yours.';}
const menCharger=()=>{const have=animals.find(a=>a.tame&&!a.dead&&a.kind==='charger')||wildPending.some(q=>q[0]==='charger');if(have)return '"Your charger knows you. Whistle, and it will come."';
  const a=PL.yaw,x=PL.x-Math.sin(a+0.8)*2.5,z=PL.z-Math.cos(a+0.8)*2.5,y=standY(x,PL.y+1,z),ci=MN.arms?[0,1,2,0,0,1][MN.arms.f]:0;
  const h=addAnimal('charger',x,y>0?y:PL.y,z,{tame:true,uid:Date.now().toString(36)+'c',ci:ci,st:'idle',t:2});h.yaw=h.hd=Math.atan2(PL.x-x,PL.z-z);saveDirty=true;animalCall(h,false);if(SURV()&&countOf(445)<1)addItem(445,1);drawBar(true);
  return 'The grooms lead out a charger in its caparison. "Your charger, good knight. It will come when you whistle." (a Groom\'s Whistle)';};
function menNews(){const L=[];for(const w of Object.values(WARS||{})){L.push(w.s>=2?'The Ashen Gate has fallen! The hosts march on into the burning lands.':'The hosts of the three peoples still lie before the Ashen Gate.');
    if(w.rd&&w.rd.length)L.push('Raiders out of the wastes have burned farms on the border. The beacons were lit.');}
  if(fallenLords&&fallenLords.size)L.push('An Emberlord has fallen! The silver tree in the king\'s court is in flower.');
  L.push('By order of the king: the roads are to be kept, and the beacons manned.','Hear ye: there will be jousting at the lists when the knights are come.');
  return 'The crier rings his bell. "Hear ye! '+L[Math.floor(Math.random()*Math.min(L.length,3))]+'"';}
// ---- the court: an audience at a throne (the king or queen of a royal city, the lord of the province elsewhere): a welcome by
// the player's renown, a gift once in each kingdom for each rank; knighthood for an esquire of great renown, with arms of their
// choosing; at the last a lordship
function menAudience(f){const s=f.site,K=s?s.prov.kingdom:null,r=menRank(),royal=MEN_COURT.has(f.kind),who=royal?FOES[f.kind].n.replace(/ of the .*$/,'').toLowerCase():'lord of '+(s?s.prov.name:'the province');if(!K)return 'They nod to you.';
  if(r<1)return 'The '+who+' regards you. "You are a stranger in my hall. Keep the king\'s peace, and be welcome. Come again when the realm knows your name."';
  const given=MN.au[K.key]||0;let msg='The '+who+' rises to greet you. "'+(r>=4?'Our knight returns to us.':r>=2?'A friend of the realm is always welcome here.':'Be welcome, freeman.')+'"';
  if(given<r&&r<4){MN.au[K.key]=r;saveDirty=true;const g=[[0,0],[431,3],[434,2],[204,6]][r];if(SURV()&&g[0]){addItem(g[0],g[1]);drawBar(true);}if(g[0])msg+=' A gift from the throne: '+(g[1]>1?g[1]+' ':'')+nameOf(g[0])+'.';menGain(2,null);}
  if(r===3&&MN.r>=MEN_AT[4]){closeInv();setTimeout(()=>menDub(f,K),200);return false;}
  if(r>=4&&MN.r>=MEN_AT[5]&&!MN.lord&&royal){closeInv();setTimeout(()=>menLordship(f,K),200);return false;}
  if(r>=2&&!MN.q)msg+=' "If you would serve the realm, ask, and I will give you a task."';return msg;}
// the dubbing: the player kneels before the throne and is made a knight; then the heralds ask what arms they will bear
function menDub(f,K){f.bow=foeClock+4;tone(392,523,0.6,0.06);tone(523,659,0.6,0.06,0.6);tone(659,784,0.9,0.06,1.2);
  showText('Knighthood','You kneel on the dais of '+K.name.replace(/^The /,'the ')+'. The sword of the realm touches your right shoulder, then your left. "Rise, knight of the realm. Keep faith with the king, the roads and the weak, and stand against the fire in the east." The hall rings with the knights\' acclaim.');
  MN.kn=1;saveDirty=true;setTimeout(()=>menArmsPanel(),2600);setTimeout(()=>menGift(4),3200);setTimeout(()=>toast('Ask at the stables of any city of the realm for your charger'),5200);}
const ARMS_F=[['Black',[24,24,32]],['Red',[160,32,36]],['Blue',[40,64,150]],['Green',[40,110,60]],['White',[236,236,240]],['Gold',[214,176,84]]];
const ARMS_T=[['Silver',[236,238,244]],['Gold',[226,186,80]],['Black',[24,24,30]]];
const ARMS_C=['a star','a tower','a sword','a tree','a ship','a crown'];
function menArmsPanel(){const A=MN.arms||(MN.arms={f:0,c:0,t:0});elfPanel('The heralds of the realm',U=>{U.text('"What arms will you bear, good knight?" Your arms: '+armsWord(A)+'.');
  let row=U.row();ARMS_F.forEach(([n],i)=>U.btn(row,n+' field',()=>{A.f=i;armsPaint();return 'Your arms: '+armsWord(A)+'.';}));
  row=U.row();ARMS_C.forEach((n,i)=>U.btn(row,n[0].toUpperCase()+n.slice(1),()=>{A.c=i;armsPaint();return 'Your arms: '+armsWord(A)+'.';}));
  row=U.row();ARMS_T.forEach(([n],i)=>U.btn(row,'In '+n.toLowerCase(),()=>{A.t=i;armsPaint();return 'Your arms: '+armsWord(A)+'.';}));
  U.btn(U.row(),'So be it',()=>{saveDirty=true;armsPaint();closeInv();toast('The heralds write your arms in the roll of the realm: '+armsWord(A));return false;});});armsPaint();}
const armsWord=A=>ARMS_C[A.c]+' in '+ARMS_T[A.t][0].toLowerCase()+' on '+ARMS_F[A.f][0].toLowerCase();
function menLordship(f,K){const vs=[];for(const P of [f.site.prov])for(const s of P.sites)if(s.k==='village')vs.push(s);const v=vs[0]||f.site;MN.lord=v.name;saveDirty=true;
  showText('A lordship','The '+FOES[f.kind].n.toLowerCase()+' takes a chain of office from the herald and lays it on your shoulders. "For your deeds in the realm\'s service, the lands of '+v.name+' are yours to keep. Rise, Lord of '+v.name+'."');menGift(5);tone(523,784,1,0.06);}
// the banner of the player's arms: its tile in the atlas painted with their field, charge and tincture (the GPU's copy too)
function armsPaint(){const A=MN.arms;if(!A)return;const F=ARMS_F[A.f][1],T=ARMS_T[A.t][1],t=399,charge=(x,y)=>{const dx=x-8.5,dy=y-6.5;
    switch(A.c){case 0:{const r=Math.hypot(dx,dy),a=Math.atan2(dy,dx);return r<(Math.abs(Math.cos(a*4))>0.9?4.6:1.6);}
      case 1:return y>=3&&y<=11&&x>=7&&x<=10&&!(y===3&&(x===8||x===9)&&false)||y===2&&(x===7||x===10)||y===11&&x>=6&&x<=11;
      case 2:return x>=8&&x<=9&&y>=2&&y<=11||y===4&&x>=6&&x<=11||y>=12&&y<=13&&x>=8&&x<=9;
      case 3:return Math.hypot(dx,dy+1.5)<3.4||x>=8&&x<=9&&y>=6&&y<=12;
      case 4:return y>=9&&y<=11&&Math.abs(dx)<4.5-(y-9)*0.8||x===8&&y>=2&&y<=9||y>=3&&y<=7&&x>=9&&x<=11+(y>4?1:0)-(y>6?1:0);
      default:return y>=6&&y<=9&&x>=5&&x<=12||y>=3&&y<6&&(x===5||x===8||x===9||x===12);}};
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){let c=null,a=255;
    if(x===1)c=[110,84,52];else if(y===0)c=[150,140,110];else if(x>=2&&!(y>12&&Math.abs(x-8.5)<(y-12)*1.5)){c=x===2||x===15||y===1||y===15||(y>12&&Math.abs(Math.abs(x-8.5)-(y-12)*1.5)<1)?T:charge(x,y)?T:F;}else{c=[0,0,0];a=0;}
    const X=(t%AC)*TS+x,Y=((t/AC)|0)*TS+y,i=(Y*AW+X)*4;dat[i]=c[0];dat[i+1]=c[1];dat[i+2]=c[2];dat[i+3]=a;}
  const g=gpuAtlas.getContext('2d'),c=t%AC,r=(t/AC)|0,o=g.createImageData(ACELL,ACELL);
  for(let y=0;y<ACELL;y++)for(let x=0;x<ACELL;x++){const sx=Math.min(TS-1,Math.max(0,x-APAD)),sy=Math.min(TS-1,Math.max(0,y-APAD)),si=((r*TS+sy)*AW+c*TS+sx)*4,di=(y*ACELL+x)*4;for(let k=0;k<4;k++)o.data[di+k]=dat[si+k];}
  g.putImageData(o,c*ACELL,r*ACELL);tex.needsUpdate=true;}
// ---- tasks: from a notice board, a captain, a lord, the herald or the throne
const MEN_TK=['writ','bounty','supply','hunt','lost','relic','escort'],MEN_SUPPLY=[[202,8],[WOOLW,6],[223,4],[207,8],[352,4]],MEN_RELIC=[442,443,444];
function menTaskGive(s,kind,crown){if(MN.q||!s)return null;const K=kind||MEN_TK[Math.floor(Math.random()*MEN_TK.length)],X0=PL.x+OX,Z0=PL.z+OZ;
  let q={k:K,from:s.id,fn:s.name,fx:s.X,fz:s.Z,t0:MN.pt,crown:crown?1:0};
  if(K==='writ'){const t=menOtherSite(s);if(!t)return null;Object.assign(q,{X:t.X,Z:t.Z,tn:t.name,n:'carry a writ of the realm from '+s.name+' to '+t.name,rw:(crown?60:20)+Math.round(Math.hypot(t.X-s.X,t.Z-s.Z)/40)});if(SURV())addItem(439,1);}
  else if(K==='bounty'){const n=5+Math.floor(Math.random()*4);Object.assign(q,{c:n,n:'slay '+n+' creatures of the wastes and claim the bounty of '+s.name,rw:crown?110:55});}
  else if(K==='supply'){const [it,n]=MEN_SUPPLY[Math.floor(Math.random()*MEN_SUPPLY.length)];Object.assign(q,{it:it,need:n,n:'bring '+n+' '+nameOf(it)+' to '+s.name,rw:12+n*2});}
  else if(K==='hunt')Object.assign(q,{it:350,need:4,n:'bring 4 Raw Venison for the table of '+s.name,rw:22});
  else if(K==='relic'){let best=null,bd=1e9;const cx=Math.floor(X0/CS),cz=Math.floor(Z0/CS);for(let a=-45;a<=45;a++)for(let b=-45;b<=45;b++){const o=oldAt(cx+a,cz+b);if(!o)continue;const d=Math.hypot(o.X-X0,o.Z-Z0);if(d>60&&d<bd){bd=d;best=o;}}
    if(!best)return null;const it=MEN_RELIC[Math.floor(Math.random()*3)];Object.assign(q,{X:best.X,Z:best.Z,it:it,got:0,n:'bring the '+nameOf(it)+' from '+best.name+' to '+s.name,rw:crown?120:55});}
  else if(K==='lost'){let pt=null;for(let k=0;k<30&&!pt;k++){const a=Math.random()*6.283,d=100+Math.random()*120,X=Math.round(s.X+Math.cos(a)*d),Z=Math.round(s.Z+Math.sin(a)*d),o=colInfo(X,Z,TEL);if(!o.wet&&!o.river&&!o.lake&&o.h>o.sl+2&&!realmSiteAt(X,Z,10)&&!wasteGateNear(X,Z,40)&&o.wVolc<0.2)pt=[X,Z];}
    if(!pt)return null;const who=nameWord('human',Math.random);Object.assign(q,{X:pt[0],Z:pt[1],who:who,found:0,n:'find '+who+', a child of '+s.name+' who wandered off, and bring them home',rw:crown?90:40});}
  else if(K==='escort'){const t=menOtherSite(s,true);if(!t)return null;Object.assign(q,{X:t.X,Z:t.Z,tn:t.name,n:'guard a merchant\'s wagon on the road from '+s.name+' to '+t.name,rw:40+Math.round(Math.hypot(t.X-s.X,t.Z-s.Z)/30)});}
  MN.q=q;saveDirty=true;const d=q.X!==undefined?Math.hypot(q.X-X0,q.Z-Z0):0;
  toast((crown?'A task of the crown':'A task of the realm')+': '+q.n+'.'+(q.X!==undefined&&K!=='escort'?' It lies '+dirWord(q.X-X0,q.Z-Z0)+', '+Math.round(d)+' blocks off; sparks rise over it.':''));hint('mtask');return q;}
// another place of the realm to carry a writ to (or a caravan's end: one joined to this place by a road), 150 to 1500 blocks off
function menOtherSite(s,road){const P=s.prov,C=P.cult,ci=Math.floor(s.X/LS),cj=Math.floor(s.Z/LS),seen=new Set(),out=[];
  if(road){for(const rd of P.roads)for(const [a,b] of [[rd.a,rd.b],[rd.b,rd.a]])if(Math.hypot(a[0]-sitePort(s)[0],a[1]-sitePort(s)[1])<20){const t=P.sites.find(t=>t!==s&&Math.hypot(sitePort(t)[0]-b[0],sitePort(t)[1]-b[1])<20&&t.k!=='outpost'&&t.k!=='lists'&&t.k!=='hallows');if(t)out.push([0,t]);}
    return out.length?out[Math.floor(Math.random()*out.length)][1]:null;}
  for(let a=-5;a<=5;a++)for(let b=-5;b<=5;b++){const c=stretchCell(landSite(ci+a,cj+b)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);if(realmHeld(c)!==C)continue;
    for(const t of provinceOf(c.i,c.j).sites)if(t!==s&&t.k!=='farm'&&t.k!=='outpost'&&t.k!=='lists'){const d=Math.hypot(t.X-s.X,t.Z-s.Z);if(d>150&&d<1500)out.push([d,t]);}}
  out.sort((a,b)=>a[0]-b[0]);return out.length?out[Math.floor(Math.random()*Math.min(4,out.length))][1]:null;}
function menTaskReady(q){if(q.k==='supply'||q.k==='hunt')return !SURV()||countOf(q.it)>=q.need;if(q.k==='bounty')return q.c<=0;return false;}
function menTaskDone(){const q=MN.q;if(!q)return '';if(q.k==='supply'||q.k==='hunt'){if(SURV())takeItems(q.it,q.need);}return menReward(q);}
function menReward(q){MN.q=null;MN.qn=(MN.qn||0)+1;saveDirty=true;giveCoin(q.rw);const extra=Math.random()<0.35?[433,434,431][Math.floor(Math.random()*3)]:0;if(extra&&SURV())addItem(extra,1);drawBar(true);
  menGain(q.crown?14:8,null);const msg='Task done: '+q.n.replace(/^./,c=>c.toUpperCase())+'. You are paid '+coinWord(q.rw)+(extra?' and given '+nameOf(extra):'')+'.';toast(msg);tone(587,880,0.35,0.05);return msg;}
// once a second: tasks that end where the player goes (a writ carried, a relic found and brought back, a lost child led home)
let menLostF=null,menMk=0;
function menTaskTick(){const q=MN.q;if(!q)return;const X=PL.x+OX,Z=PL.z+OZ;
  if(q.k==='writ'&&Math.hypot(q.X-X,q.Z-Z)<30){if(SURV()&&countOf(439)<1){toast('You have lost the writ');MN.q=null;saveDirty=true;return;}if(SURV())takeItems(439,1);toast('You put the writ into the hands of the reeve of '+q.tn);menReward(q);}
  else if(q.k==='relic'){if(!q.got&&Math.hypot(q.X-X,q.Z-Z)<10){q.got=1;if(SURV())addItem(q.it,1);drawBar(true);saveDirty=true;toast('Among the old stones you find the '+nameOf(q.it)+'. Bring it to '+q.fn);}
    else if(q.got&&Math.hypot(q.fx-X,q.fz-Z)<45){if(SURV()&&countOf(q.it)<1)return;if(SURV())takeItems(q.it,1);menReward(q);}}
  else if(q.k==='lost'){const L=menLostF&&!menLostF.dead&&!menLostF.gone?menLostF:null;
    if(!L&&Math.hypot(q.X-X,q.Z-Z)<70){const x=(q.found?PL.x+2:q.X-OX+0.5),z=(q.found?PL.z+2:q.Z-OZ+0.5),bx=Math.floor(x),bz=Math.floor(z);
      if(bx>2&&bz>2&&bx<W-3&&bz<D-3&&genDone[(bx>>4)+(bz>>4)*NCX]){const y=foeStand(x,ground[bx+W*bz]+1,z,2);if(y>0)menLostF=addFoe(Math.random()<0.5?'rchild':'rgirl',x,y,z,{st:'idle',t:99,lost:1,nm:q.who});}}
    else if(L&&!q.found&&Math.hypot(L.x-PL.x,L.z-PL.z)<5){q.found=1;saveDirty=true;toast(q.who+': "I\'m lost! Will you take me home?"');}
    if(L&&q.found){L.hx=PL.x;L.hz=PL.z;if(Math.hypot(L.x-PL.x,L.z-PL.z)>3){L.st='return';L.t=3;}if(Math.hypot(L.x+OX-q.fx,L.z+OZ-q.fz)<40){L.lost=0;menLostF=null;toast(q.who+' runs home');menReward(q);}}}}
function menMarks(dt){const q=MN.q;if(!q||(menMk-=dt)>0)return;menMk=0.4;let X,Z;if((q.k==='relic'&&!q.got)||q.k==='writ'||(q.k==='lost'&&!q.found)){X=q.X;Z=q.Z;}else if(q.k==='relic'||q.k==='lost'){X=q.fx;Z=q.fz;}else return;
  const x=X-OX,z=Z-OZ,bx=Math.floor(x),bz=Math.floor(z);if(Math.hypot(x-PL.x,z-PL.z)>240||bx<0||bz<0||bx>=W||bz>=D)return;const y=ground[bx+W*bz]+1;
  for(let k=0;k<6;k++)spawnP(x+(Math.random()-.5)*0.6,y+Math.random()*16,z+(Math.random()-.5)*0.6,0,1.5,0,[1,0.86,0.5],1.2,-0.4);}
// ---- a notice board: three tasks offered by the place it stands in (the same through a day), or the bounty claimed
function useNotice(x,y,z){const s=realmSiteAt(x+OX,z+OZ,6);if(!s||s.prov.cult.k!=='white'){showText('A notice board','Its notices have blown away.');return true;}
  if(MN.q&&menTaskReady(MN.q)){const m=menTaskDone();showText('The notice board of '+s.name,m);return true;}
  if(MN.q){showText('The notice board of '+s.name,'You have a task already: '+MN.q.n+'.');return true;}
  const r=rngAt(Math.round(s.X)+dayN,9905,Math.round(s.Z)),ks=[...MEN_TK].sort(()=>r()-0.5).slice(0,3);
  elfPanel('The notice board of '+s.name,U=>{U.text('Notices are pinned to the board, some fresh, some weathered:');for(const k of ks){const row=U.row();
    U.btn(row,{writ:'Wanted: a rider to carry a writ',bounty:'A bounty on the creatures of the wastes',supply:'Wanted: goods for the town',hunt:'Venison wanted for the lord\'s table',lost:'A child is missing',relic:'A reward for relics of the old kings',escort:'Guards wanted for a merchant\'s wagon'}[k],()=>{const q=menTaskGive(s,k,0);if(q){closeInv();return false;}return 'That notice is stale; nothing comes of it.';});}
    U.btn(U.row(),'Leave the board',()=>{closeInv();return false;});});tone(440,520,0.12,0.04);return true;}
// ---- a milestone of the king's roads: the road, and how far to the places at either end
function useMilestone(x,y,z){const X=x+OX,Z=z+OZ;let rr=null;for(let d=0;d<=4&&!rr;d++)for(const [a,b] of [[d,0],[-d,0],[0,d],[0,-d]]){rr=realmRoadAt(X+a,Z+b,1);if(rr)break;}
  if(!rr){showText('A milestone','Its letters are worn away.');return true;}const P=rr.rd.P,ends=[rr.rd.a,rr.rd.b].map(e=>{let best=null,bd=1e9;for(const s of P.sites){const d=Math.hypot(s.X-e[0],s.Z-e[1])-s.R;if(d<bd){bd=d;best=s;}}return best;}).filter(Boolean);
  showText('A milestone of '+P.kingdom.name.replace(/^The /,'the '),'Cut under the star and the tower: "'+realmRoadName(rr.rd)+', '+P.name+'." And beneath, '+ends.map(s=>s.name+', '+Math.round(Math.hypot(s.X-X,s.Z-Z)/10)*10+' paces '+dirWord(s.X-X,s.Z-Z)).join('; ')+'.');tone(480,560,0.2,0.05);return true;}
// ---- the chronicles of the kings: eight for each kingdom, read at the lecterns of the realm (the house of the kings) and told by
// the wardens of the hallows; their kings lie under the effigies
const MEN_TALE_N=8;
function menKings(key){const r=rngAt(hsh(key.length,9907,0)*1e6|0,9909,[...key].reduce((a,c)=>a*31+c.charCodeAt(0)|0,0)&0xffff),k=[];for(let i=0;i<9;i++)k.push(nameWord('realm',r));return k;}
function menTales(key,name){const k=menKings(key),realm=name.replace(/^The /,'the ');return [
  ['The Founding','When the old kingdom fell, '+k[0]+' gathered its last lords at the fords of the south and raised the white tower. The star over the tower was his sign, and it is the sign of '+realm+' still.'],
  ['The Silver Tree',k[1]+' brought a seedling of silver from the ruins of the old kings and set it in the citadel\'s court. It is said that while the tree lives the line of the kings will not fail, and that it flowers when the realm is saved.'],
  ['The Kings\' Gate','Two kings of stone stand where the old road crosses the hills, their hands raised against the east. Nobody now living knows their names. '+k[2]+' had their faces cleaned of moss, and wept.'],
  ['The War of the Ash','In the days of '+k[3]+' the fire of the wastes came west, and the realm stood with the elves and the dwarves before the Ashen Gate. '+k[3]+' did not come home. His shield hangs in the great hall.'],
  ['The Beacons',''+k[4]+' set beacons on every height from the border to the royal city, so that a fire lit at the edge of the realm is seen at the king\'s window before the night is out.'],
  ['The Long Peace','Under '+k[5]+' the roads were paved and kerbed, a lamp on every milestone, and a child could walk from the border to the sea with a purse of gold and keep it.'],
  ['The Ships of '+k[6],k[6]+' built the harbours and the cogs of the realm, and sent them to every shore that would trade. Some of them have not come back, and their names are read in the hallows every spring.'],
  ['The Dwindling','The realm is smaller than it was. '+k[7]+' keeps the throne now, and the lists, the courts and the markets are as they were. But the old kingdom\'s cities are grass, and the east is burning.']];}
function menChronicle(s,told){if(!s){showText('A chronicle','The pages are blank.');return;}const K=s.prov.kingdom,T=menTales(K.key,K.name),read=MN.tl.filter(x=>x.startsWith(K.key+':')).map(x=>+x.split(':')[1]);
  let k=0;while(k<MEN_TALE_N&&read.includes(k))k++;const fresh=k<MEN_TALE_N;if(!fresh)k=Math.floor(Math.random()*MEN_TALE_N);
  showText((told?'A tale of ':'The chronicle of ')+K.name.replace(/^The /,'the ')+' ('+(k+1)+' of '+MEN_TALE_N+'): '+T[k][0],T[k][1]+(fresh?'\n\nThe tale is written into your journal.':''));
  if(fresh){MN.tl.push(K.key+':'+k);MN.tln[K.key]=K.name;saveDirty=true;menGain(1,null);}tone(440,550,0.25,0.06);}
// a lectern in one of the realm's halls (from openLore)
function menLectern(x,y,z){const s=realmSiteAt(x+OX,z+OZ,4);if(!s||s.prov.cult.k!=='white')return false;menChronicle(s,false);return true;}
// an effigy: who lies there (a king of the realm in the hallows, a forgotten king in the old kingdom's tombs, a lord elsewhere)
function useEffigy(x,y,z){const X=x+OX,Z=z+OZ,s=realmSiteAt(X,Z,4),o=oldNear(X,Z,2);
  if(o){showText(o.name,'A king lies carved on the stone, his hands on his sword. His name is worn away; the realm calls him '+o.name.replace(/^The Tomb of /,'')+'.');return true;}
  if(s&&s.prov.cult.k==='white'){const k=menKings(s.prov.kingdom.key),i=Math.abs((X*7+Z*13)|0)%k.length;showText('Here lies King '+k[i],'Of '+s.prov.kingdom.name.replace(/^The /,'the ')+', of the line of '+k[0]+'. The stone is cold, and someone has left flowers.');return true;}
  showText('A tomb effigy','A figure carved in stone, at rest.');return true;}
function menJournal(out){const keys=Object.keys(MN.tln);out.push('','THE CHRONICLES OF THE KINGS');
  if(!keys.length)out.push('No chronicles of the realm read yet. The lecterns in the house of the kings keep them, and the wardens of the hallows tell them.');
  for(const key of keys){const n=MN.tln[key],T=menTales(key,n),got=MN.tl.filter(x=>x.startsWith(key+':')).map(x=>+x.split(':')[1]);
    out.push('','The Chronicle of '+n.replace(/^The /,'')+' ('+got.length+' of '+MEN_TALE_N+')');for(let k=0;k<MEN_TALE_N;k++)out.push(got.includes(k)?(k+1)+'. '+T[k][0]+'. '+T[k][1]:(k+1)+'. (not yet read)');}
  out.push('','YOUR RENOWN IN THE REALM',MEN_RANK[menRank()]+' ('+MN.r+')'+(MN.kn?'. Your arms: '+(MN.arms?armsWord(MN.arms):'not yet chosen'):'')+(MN.lord?'. Lord of '+MN.lord:'')+(MN.tw?'. Tourneys won: '+MN.tw:''));}
// ---- the horn of the realm: the realm's soldiers near come to the one who blows it and fight beside them a while (once in
// four minutes); in its lands, if none are near, a patrol rides up
function menHorn(){if(MN.pt-MN.hn<240){toast('The horn\'s note is still in the hills; wait a while before you blow it again');return true;}MN.hn=MN.pt;saveDirty=true;
  tone(196,262,0.8,0.08);tone(262,330,1.2,0.07,0.6);let n=0;
  for(const f of foes){if(f.dead||!FOES[f.kind].folk||FOES[f.kind].civ||!menPeopleOf(f)||folkWrath(f)||f.war||f.host||Math.hypot(f.x-PL.x,f.z-PL.z)>80)continue;f.aid=MN.pt+90;f.hx=PL.x;f.hz=PL.z;f.st='return';f.t=6;n++;}
  const P=realmOfColumn(Math.floor(PL.x+OX),Math.floor(PL.z+OZ));
  for(let k=0;k<12&&!n&&P&&P.cult.k==='white';k++){const a=PL.yaw+k*0.52,d=k<6?16:9,x=PL.x+Math.sin(a)*d,z=PL.z+Math.cos(a)*d,bx=Math.floor(x),bz=Math.floor(z); // (a patrol rides up from wherever there is room)
    if(bx>3&&bz>3&&bx<W-3&&bz<D-3&&genDone[(bx>>4)+(bz>>4)*NCX]){const G=spawnGroup('r_patrol',3,x,ground[bx+W*bz]+1,z,2,{prov:P.key,site:P.sites[0],lead:'rcapt'});for(const f of G){f.aid=MN.pt+90;f.hx=PL.x;f.hz=PL.z;f.st='return';f.t=6;}n=G.length;}}
  toast(n?'You blow the horn of the realm. Its soldiers come to your side.':'You blow the horn of the realm, but none of its soldiers are near enough to hear.');return true;}
// soldiers answering the horn keep with the player
function menAidTick(){for(const f of foes){if(!f.aid||f.dead)continue;if(f.aid<MN.pt){f.aid=0;continue;}if(!f.foe&&Math.hypot(f.x-PL.x,f.z-PL.z)>4){f.hx=PL.x;f.hz=PL.z;f.st='return';f.t=3;}}}
// ---- coming into a province of the realm: its name and the kingdom's
let menProv='';
function menBorder(){const P=realmOfColumn(Math.floor(PL.x+OX),Math.floor(PL.z+OZ)),key=P&&P.cult.k==='white'?P.key:'';if(key===menProv)return;const was=menProv;menProv=key;if(!key||!was&&!ready)return;showName(P.name+', '+P.kingdom.name);}
// ---- each frame (from foes.js): the clock, the marks; each second the border, the tasks, the horn's soldiers, the old ruins found
let menT=0;
function menFrame(dt){if(!ready)return;MN.pt+=dt;menMarks(dt);menLife(dt);if((menT-=dt)>0)return;menT=1;
  menBorder();menTaskTick();menAidTick();
  const o=oldNear(Math.floor(PL.x+OX),Math.floor(PL.z+OZ),-2);if(o&&discover('k',o.name))menGain(2,null);}
// one of the realm's places found (discoverTick)
function menPlaceFound(rp){if(rp.s.prov.cult.k==='white')menGain(2,null);}
// ---- the realm's new folk (models: men-court-models.js) and where they stand
Object.assign(FOES,{
  rking:{n:'King of the Realm',m:'rking',hp:44,dmg:3,reach:2,walk:1.05,run:4.4,sight:20,cd:1.2,wind:0.4,mass:0.6,folk:1,civ:1,drops:[[224,2,4,0.6]],cause:'guard'},
  rqueen:{n:'Queen of the Realm',m:'rqueen',hp:40,dmg:2,reach:1.8,walk:1.05,run:4.4,sight:20,cd:1.2,wind:0.4,mass:0.65,folk:1,civ:1,fem:1,drops:[[224,2,4,0.6]],cause:'guard'},
  rcguard:{n:'Guard of the Citadel',m:'rcguard',hp:40,dmg:7,reach:2.8,walk:1.3,run:4.6,sight:26,cd:1.2,wind:0.45,block:0.55,mass:0.45,folk:1,say:'guard',drops:[[223,1,2,0.4],[206,1,2,0.5]],cause:'guard'},
  rherald:{n:'Herald of the Realm',m:'rherald',hp:16,dmg:1,reach:1.6,walk:1.15,run:4.6,sight:18,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,drops:[[204,1,1,0.4]],cause:'guard'},
  rheal:{n:'Healer of the Realm',m:'rheal',hp:12,dmg:1,reach:1.6,walk:1.1,run:4.4,sight:16,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,fem:1,heal:1,drops:[[435,1,1,0.4]],cause:'guard'},
  rinn:{n:'Innkeeper',m:'rinn',hp:14,dmg:1,reach:1.6,walk:1.1,run:4.2,sight:16,cd:1.2,wind:0.4,mass:0.65,folk:1,civ:1,drops:[[432,1,2,0.5]],cause:'guard'},
  rminst:{n:'Minstrel',m:'rminst',hp:10,dmg:1,reach:1.6,walk:1.2,run:4.6,sight:16,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,drops:[[203,2,6,0.5]],cause:'guard'},
  rcrier:{n:'Town Crier',m:'rcrier',hp:12,dmg:1,reach:1.6,walk:1.1,run:4.2,sight:16,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,drops:[[203,2,5,0.5]],cause:'guard'},
  rwatch:{n:'Watchman of the Realm',m:'rwatch',hp:22,dmg:4,reach:2.4,walk:1.2,run:4.5,sight:24,cd:1.3,wind:0.45,mass:0.55,folk:1,say:'guard',drops:[[338,1,1,0.4]],cause:'guard'},
  rchild:{n:'Child of the Realm',m:'rchild',hp:6,dmg:0,reach:1,walk:1.3,run:5,sight:14,cd:1.5,wind:0.4,mass:0.9,folk:1,civ:1,tall:1.2,say:'rchild',drops:[],cause:'guard'},
  rgirl:{n:'Child of the Realm',m:'rgirl',hp:6,dmg:0,reach:1,walk:1.3,run:5,sight:14,cd:1.5,wind:0.4,mass:0.9,folk:1,civ:1,fem:1,tall:1.2,say:'rchild',drops:[],cause:'guard'},
  rshep:{n:'Shepherd',m:'rshep',hp:10,dmg:1,reach:1.8,walk:1.1,run:4.4,sight:16,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,say:'rfarmer',drops:[[351,1,1,0.4]],cause:'guard'},
  rsailor:{n:'Sailor of the Realm',m:'rsailor',hp:14,dmg:2,reach:1.7,walk:1.2,run:4.6,sight:18,cd:1.2,wind:0.4,mass:0.65,folk:1,civ:1,drops:[[203,1,4,0.5]],cause:'guard'},
  rwarden:{n:'Warden of the Hallows',m:'rwarden',hp:14,dmg:1,reach:1.6,walk:1,run:4,sight:16,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,drops:[[338,1,1,0.4]],cause:'guard'},
  rjoust:{n:'Knight of the Tourney',m:'rjoust',hp:56,dmg:9,reach:3.6,walk:1.8,run:7.5,sight:34,cd:1.4,wind:0.5,block:0.5,mass:0.2,tall:3,mount:1,folk:1,say:'rjoust',drops:[[223,1,2,0.4],[204,1,2,0.5]],cause:'knight'}});
Object.assign(FOE_HOME,{r_throne:[['rcguard',1]],r_court:[['rnoble',2],['rwoman',1],['rherald',1]],r_heal:[['rheal',1],['rwoman',0.5]],r_inn:[['rman',2],['rwoman',1]],r_crier:[['rman',1],['rwoman',1]],
  r_fair:[['rman',1],['rwoman',1],['rchild',1],['rgirl',1]],r_stands:[['rman',2],['rwoman',2],['rchild',1],['rgirl',0.6],['rnoble',0.5]],r_royal:[['rnoble',2],['rwoman',1],['rcguard',1]],
  r_pavil:[['rman',1]],r_herald:[['rspear',1]],r_lgate:[['rspear',2]],r_hgate:[['rcguard',1]],r_tombs:[['rwarden',1],['rwoman',1]],r_kings:[['rnoble',0.5],['rwoman',0.5]],
  r_pier:[['rsailor',2]],r_quay:[['rsailor',2],['rman',1],['rmerch',0.5]],r_light:[['rspear',1],['rsailor',1]],r_warehouse:[['rman',2],['rsailor',1]],r_harbour:[['rsailor',1],['rspear',1]],r_stable:[['rman',1]]});
FOE_HOME.r_street.push(['rchild',0.7],['rgirl',0.5]);FOE_HOME.r_green.push(['rchild',1],['rgirl',0.8]);FOE_HOME.r_field.push(['rshep',0.6]);FOE_HOME.r_farm.push(['rshep',0.5]);
Object.assign(FOLK_N,{throne:[3,3],court:[3,4],heal:[2,3],inn:[2,3],crier:[2,2],fair:[3,5],stands:[3,5],royal:[2,3],pavil:[2,2],herald:[2,2],lgate:[2,2],hgate:[2,2],tombs:[1,2],kings:[2,2],pier:[2,2],quay:[2,3],light:[1,2],warehouse:[2,2],harbour:[2,2],stable:[1,1]});
Object.assign(FOLK_LEAD,{r_heal:'rheal',r_inn:'rinn',r_crier:'rcrier',r_pavil:'rjoust',r_herald:'rherald',r_hgate:'rwarden',r_kings:'rwarden',r_harbour:'rnoble',r_stable:'rfarmer',r_court:'rnoble'});
// the throne's lead: the king or the queen in the royal city (by its kingdom), the lord of the province elsewhere
function menThroneLead(s){if(!s.prov.capital)return 'rnoble';const k=s.prov.kingdom.key;return hsh(k.length,9911,[...k].reduce((a,c)=>a+c.charCodeAt(0),0))<0.5?'rking':'rqueen';}
Object.assign(FOLK_SAY,{rking:['Be welcome in {p}, traveller. The king\'s peace is on you here.','My fathers held these lands when the old kingdom was young.','The east burns. We will not let it reach the sea.'],
  rqueen:['Be welcome in {p}. Sit, if you are weary.','The silver tree has not flowered in my lifetime. I hope to see it.','{k} is older than its walls.'],
  rherald:['Hear ye! The king\'s court sits in {p}.','I bear the king\'s word to every hall of {k}.','The heralds keep the roll of every knight of the realm.'],
  rheal:['Sit, and let me see that wound.','Heartsease for the hurt, and rest for the weary.','The houses of healing are open to all.'],
  rinn:['Come in, come in! Ale, a pie, a bed?','The road is long and the beds are soft.','Mind the minstrel; he sings for coin.'],
  rminst:['Shall I sing of the Kings\' Gate? Or of the War of the Ash?','A coin for a song, good traveller!','Every song I know is older than I am.'],
  rcrier:['Hear ye, hear ye!','News from the east, news from the court!','By order of the king!'],
  rchild:['Are you a knight? Have you got a sword?','We\'re playing at the War of the Ash! I\'m the king!','My mother says not to talk to strangers.'],
  rsailor:['Fair wind today.','The cogs are in. Fish is cheap.','Ever been to sea? You should.'],
  rwarden:['Speak softly. The kings sleep here.','I keep the lamps of the hallows. They never go out.','Every king of {k} lies here, but the first.'],
  rjoust:['Will you ride against me at the lists?','My lance is sound and my horse is fresh.','There is no shame in a fall at the tilt; only in not riding.'],
  rcguard:['The citadel of {p}. Keep your blade sheathed.','We guard the king and the silver tree.','Pass, and be welcome.'],
  rwatch:['The tenth hour, and all is well.','Keep to the lamplit streets, friend.','The watch is set. Sleep easy.']});
// ---- the charger and the ox
Object.assign(ANIMALS,{
  charger:{n:'Charger',hp:22,walk:1.5,run:8,shy:0,stride:2.4,amp:0.6,turn:3.2,graze:1,sleeps:0,drops:[],g:[],herd:[1,1],w:0,youngP:0,calls:[30,80],mount:true,gallop:14,steed:1,ride:'Riding your charger. Sprint to gallop; use it again to get down.'},
  ox:{n:'Ox',hp:24,walk:0.9,run:3.4,shy:0,stride:1.7,amp:0.5,turn:2.2,graze:1,sleeps:1,drops:[[352,2],[354,3]],g:[],herd:[1,2],w:0,youngP:0,calls:[40,100]}});
// the banner of the player's arms, if they have them, is painted as the world is loaded
if(MN.arms)try{armsPaint();}catch(e){}
