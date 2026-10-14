// ---- The mountain dwarves (D-091): the player's standing with the dwarves, and what they offer those they know.
//
// Standing (DW.r, saved as dw) rises with tasks done for them, trade, their places and the prospectors' claims found, the annals
// of their kings heard, creatures of the wastes slain near their folk, the Kindling kept in the great hall, the delving contest
// won; it falls when one of their folk is struck, much further when one is slain, and when the treasury is robbed. Its ranks
// (DW_AT): Stranger, Guest of the Hold, Stone-friend (when the dwarves give the player a name of their own), Friend of the
// Mountain; Oathbound of the Hold only by the oath at a throne of the mountain (DW.sw), and an oathbound friend of great standing
// is made Kin of the Mountain by a king or a queen, given a hall in a hold and its key (the player may rest there and wake there).
// Speaking with the folk (use one of them): they greet in their own tongue (words of our own) and say what it means; then what
// that one can do: merchants trade and the moneychanger buys ore, ingots and gems; the gemcutter cuts rough gems; the brewer sells
// the hold's ales; the smiths mend and forge by rank; the runesmith cuts runes, worn in the rune slot (keenness, warding,
// delving, the lamp, the hearth, stone); the ram-keeper sells great rams and tends them; the farmers sell from the gardens; the
// loremaster and the warden of the tombs tell the annals of the kings; captains, thanes, the warden of the hold and the throne
// give tasks: a writ-stone carried to another hold before time runs out, supplies for the smelters, a miner lost in the mines,
// creatures of the wastes slain, a hold's heirloom brought back from a worked-out claim. Justice: whoever strikes their folk may
// pay the stone-price to a captain or a thane; whoever slays one is banished from that kingdom a while. The horn of the hold calls
// a shield-wall to an oathbound friend.
const DW_AT=[0,10,30,70,140,240],DW_RANK=['Stranger','Guest of the Hold','Stone-friend','Friend of the Mountain','Oathbound of the Hold','Kin of the Mountain'];
const DW_GIFTS=[null,[[465,3],[462,1]],[[466,2],[464,1]],[[470,1],[468,3]],[[474,1],[473,1],[472,1],[480,1]],[[475,1],[476,1],[469,2]]];
let DW=saved&&saved.dw&&typeof saved.dw==='object'?saved.dw:null;
if(!DW)DW={r:0,sw:0,kin:'',kx:0,kz:0,g:0,q:null,qn:0,an:[],ann:{},au:{},out:{},pt:0,hn:-1e9,ki:-1,cw:0,nm:'',sl:0,bath:-1};
const dwarfSave=()=>({dw:DW});
const DWARF_KINDS=new Set(['daxe','dhammer','dxbow','dcapt','dking','dlord','dlady','dminer','dsmith','dqueen','danvil','dhward','dlore','drune','dbrew','dmerch','dmint','dgem','dfarm','dkeep','dchild','dgirl','dramr','dprosp','ddeep','dengin']);
function dwarfPeopleOf(f){if(!f)return false;const C=f.site&&f.site.prov&&f.site.prov.cult;if(C)return C.k==='dwarf';return DWARF_KINDS.has(f.kind);}
const dwarfRank=()=>{let r=0;while(r+1<DW_AT.length&&DW.r>=DW_AT[r+1])r++;return DW.sw?Math.max(4,r):Math.min(3,r);};
const dwarfRankName=()=>DW_RANK[dwarfRank()];
function dwarfGain(n,why){if(!n)return;const r0=dwarfRank();DW.r=Math.max(-80,Math.min(500,DW.r+n));saveDirty=true;const r1=dwarfRank();
  if(why)toast(why+' ('+(n>0?'+':'')+n+' standing with the dwarves)');if(r1>r0)setTimeout(()=>dwarfRankUp(r1),why?1600:0);}
function dwarfRankUp(r){toast('The dwarves now name you '+DW_RANK[r]);
  if(r>=2&&!DW.nm){DW.nm=nameWord('dwarf',mkRng(1+Math.floor(DW.r*7919+DW.qn*31+(DW.pt|0))));saveDirty=true;setTimeout(()=>toast('"Among us you shall be called '+DW.nm+'." The dwarves give you a name of their own'),2600);}
  if(r===3)setTimeout(()=>toast('A friend of the mountain of great standing may swear the oath at a throne of the mountain'),5200);dwarfGift(r);}
function dwarfGift(r){if(DW.g>=r)return;DW.g=r;const L=DW_GIFTS[r];if(!L)return;const got=[];if(SURV())for(const [id,c] of L){const left=addItem(id,c);if(left)toast('No room for '+nameOf(id));got.push((c>1?c+' ':'')+nameOf(id));}
  if(got.length)setTimeout(()=>toast('In token of it the dwarves give you '+got.join(', ')),2400);drawBar(true);saveDirty=true;}
// ---- their tongue: greetings with what they mean
const DWARF_TONGUE=[['Thrumm gar, varrin','Hail, wanderer'],['Durrak hemmar','The stone holds'],['Embrak ul forge','The forge is warm'],['Gromm hethra, varrin','Deep roads to you, wanderer'],
  ['Skaldur thrumm!','A full horn!'],['Haddur vorn, ulmin','Keep the oath, kinsman'],['Fathrak nor sunn','The fathers do not sleep'],['Karrin dur, karrin gald','Iron first, gold after'],['Velk thar ul dun','A light at the deep end'],['Varrin, brok ul ale','Wanderer, share the ale']];
const dwarfTongue=()=>{const t=DWARF_TONGUE[Math.floor(Math.random()*DWARF_TONGUE.length)];return '"'+t[0]+'" ('+t[1]+')';};
function dwarfGreet(f,F){const r=dwarfRank(),who=(f.nm||F.n)+': ';if(r>=4){f.bow=foeClock+2;return who+dwarfTongue()+(DW.kin?' Kinsman'+(DW.nm?' '+DW.nm:'')+'.':' Oathbound.');}
  if(r>=2&&Math.random()<0.6)return who+dwarfTongue()+(DW.nm&&Math.random()<0.5?' Well met, '+DW.nm+'.':'');return null;}
// ---- struck, slain, banished; the treasury robbed
const dwarfOutlaw=f=>!!(f&&f.site&&f.site.prov&&f.site.prov.cult.k==='dwarf'&&(DW.out[f.site.prov.kingdom.key]||0)>DW.pt);
function dwarfStruck(f){if(dwarfPeopleOf(f))dwarfGain(-6,'You struck one of the dwarves');}
function dwarfSlain(f){const F=FOES[f.kind];if(F.folk){if(dwarfPeopleOf(f)&&f.site&&!f.war&&!f.host){dwarfGain(-25,'You slew one of the dwarves');const K=f.site.prov.kingdom;DW.out[K.key]=DW.pt+900;saveDirty=true;
      setTimeout(()=>toast('You are banished from '+K.name.replace(/^The /,'the ')+'. Its axes will be raised against you on sight, unless you pay the stone-price to one of its captains or thanes.'),2400);}return;}
  if(DW.q&&DW.q.k==='bounty'){DW.q.c=Math.max(0,DW.q.c-1);if(!DW.q.c)toast('The dwarves\' bounty is earned; claim it');}
  let near=false;foeNear(f.x,f.z,30,g=>{if(!near&&!g.dead&&FOES[g.kind].folk&&dwarfPeopleOf(g))near=true;},0);if(near){DW.sl++;if(DW.sl%3===0)dwarfGain(1,null);}}
function dwarfAmends(f){const s=f.site,K=s&&s.prov.kingdom,out=K&&(DW.out[K.key]||0)>DW.pt,v=out?200:30;
  if(!payCoin(v))return 'They want '+coinWord(v)+' as the stone-price, and you have not got it.';realmWrath.delete(f.prov);if(out)delete DW.out[K.key];saveDirty=true;
  for(const g of foes)if(g.prov===f.prov&&!g.dead){g.foe=null;if(g.st==='chase'||g.st==='flee'){g.st='return';g.t=4;}}
  dwarfGain(2,null);return 'You pay '+coinWord(v)+'. "The stone-price is paid. The ledger is closed."';}
// a block of gold or a heap of gems taken from one of their holds (from mining.js): the dwarves see it
function dwarfTheft(x,y,z,id){if((id!==GOLDB&&id!==GEMHEAP)||!SURV())return;const X=x+OX,Z=z+OZ,s=realmSiteAt(X,Z,40);if(!s||s.prov.cult.k!=='dwarf')return;
  dwarfGain(-10,'You took from the treasury of '+s.name);let g=null,bd=40;for(const f of foes){if(f.dead||!FOES[f.kind].folk||FOES[f.kind].civ||!dwarfPeopleOf(f))continue;const d=Math.hypot(f.x-PL.x,f.z-PL.z);if(d<bd){bd=d;g=f;}}
  if(g){folkProvoke(g,120);foeAlert(g);toast('"Thief!" The dwarves of '+s.name+' take up their axes.');}}
// ---- the panel and the folk who do more than greet
const DWARF_TASK=new Set(['dcapt','dlord','dhward','dking','dqueen']),DWARF_COURT=new Set(['dking','dqueen']);
function dwarfAct(){const f=foeHit(4.6);if(!f||f.dead||!FOES[f.kind].folk||f.foe&&!folkWrath(f))return false;if(!dwarfPeopleOf(f)||f.war||f.host||f.hst||(f.site&&f.site.k==='wgate'))return false;
  if(folkWrath(f)){if(f.kind==='dcapt'||f.kind==='dlord'||DWARF_COURT.has(f.kind)){dwarfTalk(f,1);return true;}return false;}dwarfTalk(f);return true;}
function dwarfTalk(f,wrath){const F=FOES[f.kind],s=f.site,r=dwarfRank(),spk=f.spk||'',seat=DWARF_COURT.has(f.kind)||spk==='d_dthrone'&&f.kind==='dlord';
  f.st='idle';f.t=6;f.yaw=f.hd=Math.atan2(PL.x-f.x,PL.z-f.z);if(r>=4&&!wrath)f.bow=foeClock+2;
  elfPanel((f.nm||F.n)+(s?', '+s.name:''),U=>{
    if(wrath){U.text('"There is a stone-price owing. Pay it, and the ledger is closed."');const b=U.row();U.btn(b,'Pay the stone-price',()=>dwarfAmends(f));U.btn(b,'Farewell',()=>{closeInv();return false;});return;}
    U.text(dwarfTongue()+' "'+(FOLK_SAY[f.kind]||FOLK_SAY[F.say]||FOLK_SAY.dguard)[Math.floor(Math.random()*3)].replace('{p}',s?s.name:'the mountain').replace('{k}',s?s.prov.kingdom.name.replace(/^The /,'the '):'the mountain')+'"');
    U.text('You are '+DW_RANK[r]+(DW.kin?' (a hall of your own in '+DW.kin+')':'')+(DW.nm?', called '+DW.nm+',':'')+' among the dwarves. Standing '+DW.r+(r<3&&r+1<DW_AT.length?' ('+DW_AT[r+1]+' for '+DW_RANK[r+1]+')':r===3?(DW.r>=DW_AT[4]?' (enough to swear the oath at a throne of the mountain)':' ('+DW_AT[4]+' to swear the oath)'):'')+'.');
    if(DW.q){const q=DW.q;U.text('Your task: '+q.n+'.');const b=U.row();if(dwarfTaskReady(q))U.btn(b,'Tell them the task is done',()=>dwarfTaskDone());U.btn(b,'Give up your task',()=>{DW.q=null;saveDirty=true;return 'You give up the task.';});}
    const b=U.row();
    if(f.kind==='dmerch'||spk==='d_dmarket'||f.kind==='dprosp')U.btn(b,'Trade',()=>{dwarfTradePanel(f,f.kind==='dprosp'?'The prospector\'s goods':'The market of '+(s?s.name:'the mountain'),f.kind==='dprosp'?DWARF_PROSP:DWARF_GOODS,DWARF_BUYS);return false;});
    if(f.kind==='dmint')U.btn(b,'Change ore, ingots and gems for coin',()=>{dwarfTradePanel(f,'The moneychanger of '+(s?s.name:'the mountain'),[],DWARF_MINT);return false;});
    if(f.kind==='dgem'){U.btn(b,'Have a gem cut (2 copper)',()=>dwarfCutGem());U.btn(b,'Trade',()=>{dwarfTradePanel(f,'The gemcutter\'s bench',[[469,24,1],[468,8]],[[468,5],[469,18]]);return false;});}
    if(f.kind==='dbrew'||spk==='d_dale'||spk==='d_dbrew')U.btn(b,'Buy ale and fare',()=>{dwarfTradePanel(f,'The ale-hall of '+(s?s.name:'the mountain'),DWARF_ALE,[]);return false;});
    if(f.kind==='dfarm'||spk==='d_dgarden')U.btn(b,'Buy from the gardens',()=>{dwarfTradePanel(f,'The mushroom gardens of '+(s?s.name:'the mountain'),[[MUSHB,1],[465,2],[467,3],[GLOWSHROOM,3]],[]);return false;});
    if(f.kind==='dsmith'||spk==='d_forge'||spk==='d_dforge'){U.btn(b,'Mend your arms and tools',()=>menMend());U.btn(b,'Have arms forged',()=>{dwarfForgePanel(f);return false;});}
    if(f.kind==='drune'||spk==='d_drunes')U.btn(b,'Have a rune cut',()=>{dwarfRunePanel(f);return false;});
    if(f.kind==='dkeep'||spk==='d_dpen'){U.btn(b,'Buy a great ram',()=>{dwarfRamPanel(f);return false;});U.btn(b,'Tend your ram',()=>dwarfTendRam());}
    if(f.kind==='dlore'||spk==='d_dfathers')U.btn(b,'Ask for the annals of the kings',()=>{dwarfAnnal(s,true);return false;});
    if(f.kind==='dminer'&&(spk==='d_mine'||spk==='d_deep'))U.btn(b,'Ask about the delving contest',()=>dwarfContestAsk(f));
    if(seat)U.btn(b,'Ask for an audience',()=>dwarfAudience(f));
    if((DWARF_TASK.has(f.kind)||seat)&&!DW.q)U.btn(b,'Ask for a task',()=>{const q=dwarfTaskGive(f.site,null,DWARF_COURT.has(f.kind));if(q){closeInv();return false;}return 'There is nothing the hold needs of you now.';});
    U.btn(b,'Farewell',()=>{closeInv();return false;});});
  foeCall(f,'idle');tone(220,294,0.18,0.05);hint('dwarves');}
// ---- trade: [item, price in copper, the least rank]; what they buy
const DWARF_GOODS=[[465,2],[466,3],[462,3],[463,4],[449,4],[200,1],[213,4],[DLAMP,8],[LADDER,1],[468,8,1],[469,24,2],[470,90,2],[471,110,3],[480,60,2],[472,240,4]];
const DWARF_ALE=[[462,3],[463,4],[464,6,1],[465,2],[466,3],[467,3]];
const DWARF_PROSP=[[200,1],[213,4],[214,9],[468,7],[465,2],[DLAMP,8],[LADDER,1],[245,40,1]];
const DWARF_BUYS=[[202,1],[206,2],[350,3],[351,2],[352,3],[223,4],[224,12],[227,10],[415,25],[468,5],[469,18],[485,60],[457,40],[442,60]];
const DWARF_MINT=[[200,1],[210,2],[211,2],[212,2],[213,3],[214,7],[220,4],[221,4],[223,5],[224,14],[225,8],[227,12],[468,6],[469,20]];
const DWARF_BUYK=[1.4,1.2,1,0.9,0.75,0.65],DWARF_SELLK=[0.6,0.75,0.85,0.95,1.05,1.15];
const dwarfPrice=c=>Math.max(1,Math.round(c*DWARF_BUYK[dwarfRank()])),dwarfOffer=c=>Math.max(1,Math.round(c*DWARF_SELLK[dwarfRank()]));
function dwarfBuy(id,c,n){const v=dwarfPrice(c)*n;if(!payCoin(v))return 'You have not the coin ('+coinWord(v)+')';const left=addItem(id,n);if(left)toast('No room for '+nameOf(id));
  drawBar(true);saveDirty=true;if(v>=20)dwarfGain(1,null);return 'You buy '+(n>1?n+' ':'')+nameOf(id)+' for '+coinWord(v);}
function dwarfSell(id,c,n){if(SURV()){if(countOf(id)<n)return 'You have no '+nameOf(id);takeItems(id,n);}const v=dwarfOffer(c)*n;giveCoin(v);saveDirty=true;if(v>=20)dwarfGain(1,null);return 'You sell '+(n>1?n+' ':'')+nameOf(id)+' for '+coinWord(v);}
function dwarfTradePanel(f,title,goods,buys){const r=dwarfRank();elfPanel(title,U=>{
  U.text('Your purse: '+coinWord(purse())+(SURV()?'':' (in creative the dwarves give freely)')+'. Prices for '+DW_RANK[r]+(r<2?': they are better for a friend of the stone.':'.'));
  if(goods.length){U.text('They sell:');for(const [id,c,need] of goods){if((need||0)>r){U.text('  '+nameOf(id)+': for '+DW_RANK[need]+' and above');continue;}const row=U.row();
    U.btn(row,nameOf(id)+' ('+coinWord(dwarfPrice(c))+')',()=>dwarfBuy(id,c,1));if(stackMax(id)>1)U.btn(row,'Four',()=>dwarfBuy(id,c,4));}}
  if(buys.length){const mine=buys.filter(([id])=>!SURV()||countOf(id)>0);U.text(mine.length?'They will buy:':'They would buy ore, ingots, gems, hides and the old treasures; you have none of these.');
    for(const [id,c] of mine){const row=U.row();U.btn(row,'Sell '+nameOf(id)+' ('+coinWord(dwarfOffer(c))+(SURV()?', you have '+countOf(id):'')+')',()=>dwarfSell(id,c,1));if(SURV()&&countOf(id)>=4)U.btn(row,'Four',()=>dwarfSell(id,c,4));}}
  U.btn(U.row(),'Back',()=>{dwarfTalk(f);return false;});});}
function dwarfForgePanel(f){const r=dwarfRank();elfPanel('The forge of '+(f.site?f.site.name:'the mountain'),U=>{U.text('"Iron is honest. Tell me what you need, and I will make it so it outlasts you."');
  for(const [id,c,need] of [[245,30,0],[470,90,2],[471,110,3],[381,60,2],[403,80,3],[472,240,4]]){const row=U.row();if(need>r){U.text('  '+nameOf(id)+': for '+DW_RANK[need]+' and above');continue;}U.btn(row,nameOf(id)+' ('+coinWord(dwarfPrice(c))+')',()=>dwarfBuy(id,c,1));}
  U.btn(U.row(),'Back',()=>{dwarfTalk(f);return false;});});}
// the gemcutter cuts a rough gem for two copper
function dwarfCutGem(){if(SURV()&&countOf(468)<1)return '"Bring me a rough gem from the seams, and I will show you what is inside it."';if(!payCoin(2))return '"Two copper for the cutting."';
  if(SURV())takeItems(468,1);addItem(469,1);drawBar(true);saveDirty=true;burst(0.2,'bandpass',3200,6,0.12);return 'The gemcutter turns the stone on the wheel, and a cut gem lies in your palm.';}
// ---- runes: cut by the runesmith and worn in the rune slot, one at a time ([item, price, the least rank, what it does])
const DWARF_RUNES=[[479,40,1,'your blows strike a quarter harder'],[480,60,2,'a little of every blow is turned from you'],[481,50,1,'you dig and break stone a third faster'],[482,30,1,'a light about you, as a lantern gives'],
  [483,45,2,'hunger comes on you more slowly'],[484,55,3,'a fall does you half the harm']];
function dwarfRunePanel(f){const r=dwarfRank();elfPanel('The runesmith of '+(f.site?f.site.name:'the mountain'),U=>{
  U.text('"A rune is not a trinket. It is cut once, and it holds. Wear one in the rune slot; two would quarrel."');
  for(const [id,c,need,what] of DWARF_RUNES){const row=U.row();if(need>r){U.text('  '+nameOf(id)+' ('+what+'): for '+DW_RANK[need]+' and above');continue;}
    U.btn(row,nameOf(id)+': '+what+' ('+coinWord(dwarfPrice(c))+')',()=>{const m=dwarfBuy(id,c,1);if(/^You buy/.test(m)){tone(523,784,0.5,0.05);for(let k=0;k<12;k++)spawnP(PL.x+(Math.random()-.5),PL.y+1.4,PL.z+(Math.random()-.5),0,1,0,[0.5,0.85,1],0.6,-0.5);}return m;});}
  U.btn(U.row(),'Back',()=>{dwarfTalk(f);return false;});});}
// ---- the great rams: the ram-keeper's rams of three coats, tended
const DWARF_RAMS=[['A pale ram of the heights',0,60],['A brown ram, sure-footed',1,70],['A black ram, strong',2,90]];
function dwarfRamPanel(f){elfPanel('The ram-keeper of '+(f.site?f.site.name:'the mountain'),U=>{U.text('"A ram goes where a horse breaks its legs. Up a cliff, over a scree, along a ledge. Choose."');
  for(const [n,ci,c] of DWARF_RAMS){const row=U.row();U.btn(row,n+' ('+coinWord(dwarfPrice(c))+')',()=>{const v=dwarfPrice(c);if(!payCoin(v))return 'You have not the coin ('+coinWord(v)+')';riderLeadOut('ram',ci);dwarfGain(1,null);return 'The keeper leads the ram out by its horn and puts the rein in your hand. It is yours.';});}
  U.btn(U.row(),'Back',()=>{dwarfTalk(f);return false;});});}
function dwarfTendRam(){let a=null,bd=14;for(const q of animals)if(q.tame&&!q.dead&&q.kind==='ram'){const d=Math.hypot(q.x-PL.x,q.z-PL.z);if(d<bd){bd=d;a=q;}}if(!a)return '"Bring your ram here, and I will see to it."';
  a.hp=ANIMALS.ram.hp;return 'The keeper runs a hand over its horns and its hooves. "Sound, and stubborn. A good ram."';}
// a wild ram lets only a friend of the stone near it (from animalAct)
function ramTame(a){if(dwarfRank()<2){toast('The ram lowers its horns and stamps. It lets no one near but a friend of the dwarves.');alarm(a,PL.x,PL.z,6);return true;}
  if(a.tame)return false;a.tame=true;a.uid=a.uid||(Date.now().toString(36)+'m');a.herd=a.id;a.st='idle';a.t=2;saveDirty=true;animalCall(a,false);dwarfGain(2,'The ram lets you take it by the horn. It is yours');return true;}
// ---- the throne: an audience with the king or the queen (a thane on a lesser seat): a welcome, a gift once for each rank; the
// oath for a friend of great standing; at the last kinship and a hall of one's own
const dwarfSeatLead=s=>{if(!s.prov.capital)return 'dlord';const k=s.prov.kingdom.key;return hsh(k.length,9931,[...k].reduce((a,c)=>a+c.charCodeAt(0),0))<0.5?'dking':'dqueen';};
function dwarfAudience(f){const s=f.site,K=s?s.prov.kingdom:null,r=dwarfRank(),royal=DWARF_COURT.has(f.kind),who=royal?FOES[f.kind].n.replace(/ of the .*$/,'').toLowerCase():'thane of '+(s?s.name:'the hold');if(!K)return 'They nod to you.';
  if(r<1)return 'The '+who+' looks at you for a long moment under heavy brows. "A stranger under the mountain. You may warm yourself at our fires. Come back when the stone knows your name."';
  const given=DW.au[K.key]||0;let msg='The '+who+' lifts a hand. "'+(r>=4?'Our oathbound friend returns.':r>=2?'A friend of the stone is always welcome here.':'Be welcome, guest of the hold.')+'"';
  if(given<r&&r<4){DW.au[K.key]=r;saveDirty=true;const g=[[0,0],[462,2],[466,3],[204,6]][r];if(SURV()&&g[0]){addItem(g[0],g[1]);drawBar(true);}if(g[0])msg+=' A gift from the throne: '+(g[1]>1?g[1]+' ':'')+nameOf(g[0])+'.';dwarfGain(2,null);}
  if(r===3&&DW.r>=DW_AT[4]){closeInv();setTimeout(()=>dwarfOath(f,K),200);return false;}
  if(r>=4&&DW.r>=DW_AT[5]&&!DW.kin&&royal){closeInv();setTimeout(()=>dwarfKin(f,K),200);return false;}
  if(r>=2&&!DW.q)msg+=' "If you would serve the mountain, ask, and there will be work."';return msg;}
// the oath: the player sets a hand on the anvil before the throne and swears
function dwarfOath(f,K){f.bow=foeClock+4;tone(147,196,0.8,0.08);tone(196,247,0.8,0.07,0.7);tone(247,294,1.2,0.07,1.4);
  showText('The oath','You lay your hand on the anvil before the throne of '+K.name.replace(/^The /,'the ')+'. "I will stand where the mountain stands, and strike where it strikes, and keep its secrets and its ledgers while stone is stone." Every axe in the hall is struck once on every shield: "'+DWARF_TONGUE[5][0]+'!"');
  DW.sw=1;saveDirty=true;setTimeout(()=>dwarfGift(4),2600);setTimeout(()=>toast('Blow the horn of the hold, and a shield-wall will come to you'),5200);}
function dwarfKin(f,K){const s=f.site;DW.kin=s.name;DW.kx=s.X;DW.kz=s.Z;saveDirty=true;
  showText('Kin of the Mountain','The '+FOES[f.kind].n.toLowerCase()+' rises from the throne and gives you a brooch of gold and a key of bronze. "There is a hall in '+s.name+' that has stood empty since its last kinsman went down to the fathers. It is yours, and its hearth. Rise, kin of the mountain'+(DW.nm?', '+DW.nm:'')+'."');dwarfGift(5);tone(196,294,1,0.08);}
// the hall-key: in the hold of one's hall, rest and wake there after a fall
function useHallKey(){if(!DW.kin){toast('A key of bronze, cut with runes. It opens nothing you know of.');return true;}const d=Math.hypot(DW.kx-OX-PL.x,DW.kz-OZ-PL.z);
  if(d>90){toast('Your hall is in '+DW.kin+', '+dirWord(DW.kx-OX-PL.x,DW.kz-OZ-PL.z)+', '+Math.round(d)+' blocks off');return true;}
  spawnW=[PL.x+OX,PL.y,PL.z+OZ];if(SURV()){hp=20;food=Math.max(food,14);drawStats();}saveDirty=true;toast('You rest in your hall in '+DW.kin+'. After a fall you will wake here.');tone(294,392,0.5,0.05);return true;}
// ---- tasks: from the captains, thanes, the warden of the hold and the throne
const DWARF_TK=['writ','supply','miner','bounty','heirloom'],DWARF_SUPPLY=[[213,8],[200,12],[210,8],[LOG,16],[468,4]];
function dwarfTaskGive(s,kind,crown){if(DW.q||!s)return null;if(!kind){for(let k=0;k<4;k++){const q=dwarfTaskGive(s,DWARF_TK[Math.floor(Math.random()*DWARF_TK.length)],crown);if(q)return q;}return null;}const K=kind||DWARF_TK[Math.floor(Math.random()*DWARF_TK.length)],X0=PL.x+OX,Z0=PL.z+OZ;
  let q={k:K,from:s.id,fn:s.name,fx:s.X,fz:s.Z,t0:DW.pt,crown:crown?1:0};
  if(K==='writ'){const t=dwarfOtherSite(s);if(!t)return null;const d=Math.hypot(t.X-s.X,t.Z-s.Z),lim=Math.round(80+d/4);Object.assign(q,{X:t.X,Z:t.Z,tn:t.name,lim:lim,n:'carry the writ-stone from '+s.name+' to '+t.name+' within '+Math.round(lim/60*10)/10+' minutes',rw:(crown?50:20)+Math.round(d/35)});if(SURV())addItem(478,1);}
  else if(K==='bounty'){const n=5+Math.floor(Math.random()*4);Object.assign(q,{c:n,n:'slay '+n+' creatures of the wastes for the hold of '+s.name,rw:crown?110:55});}
  else if(K==='supply'){const [it,n]=DWARF_SUPPLY[Math.floor(Math.random()*DWARF_SUPPLY.length)];Object.assign(q,{it:it,need:n,n:'bring '+n+' '+nameOf(it)+' for the smelters of '+s.name,rw:14+n*2});}
  else if(K==='heirloom'){let best=null,bd=1e9;const cx=Math.floor(X0/CS),cz=Math.floor(Z0/CS);for(let r=0;r<=100&&!best;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){if(Math.max(Math.abs(a),Math.abs(b))!==r)continue;const o=claimsAt(cx+a,cz+b);if(!o||!o.ab)continue;const d=Math.hypot(o.X-X0,o.Z-Z0);if(d>60&&d<bd){bd=d;best=o;}}
    if(!best)return null;Object.assign(q,{X:best.X,Z:best.Z,got:0,cn:best.name,n:'bring back the heirloom of '+s.name+' from '+best.name+', where its last keeper went prospecting',rw:crown?120:60});}
  else if(K==='miner'){const t=dwarfMineSite(s);if(!t)return null;const nm=nameWord('dwarf',Math.random);Object.assign(q,{X:t.X,Z:t.Z,tn:t.name,who:nm,found:0,n:'find '+nm+', a miner lost in the mines of '+t.name,rw:crown?80:40});}
  DW.q=q;saveDirty=true;const d=q.X!==undefined?Math.hypot(q.X-X0,q.Z-Z0):0;
  toast((crown?'A task of the throne':'A task of the hold')+': '+q.n+'.'+(q.X!==undefined?' It lies '+dirWord(q.X-X0,q.Z-Z0)+', '+Math.round(d)+' blocks off; sparks rise over it.':''));hint('dtask');return q;}
// another hold, bastion or mining town of the dwarves 150 to 1500 blocks off; a place with mines near by
function dwarfOtherSite(s){const P=s.prov,C=P.cult,ci=Math.floor(s.X/LS),cj=Math.floor(s.Z/LS),seen=new Set(),out=[];
  for(let a=-5;a<=5;a++)for(let b=-5;b<=5;b++){const c=stretchCell(landSite(ci+a,cj+b)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);if(realmHeld(c)!==C)continue;
    for(const t of provinceOf(c.i,c.j).sites)if(t!==s&&(t.k==='city'||t.k==='fort'||t.k==='village')){const d=Math.hypot(t.X-s.X,t.Z-s.Z);if(d>150&&d<1500)out.push([d,t]);}}
  out.sort((a,b)=>a[0]-b[0]);return out.length?out[Math.floor(Math.random()*Math.min(4,out.length))][1]:null;}
function dwarfMineSite(s){let best=null,bd=1e9;for(const t of s.prov.sites){if(t.k!=='village'&&t.k!=='farm'&&t.k!=='city')continue;if(!siteLayout(t).spots.some(p=>p.kind==='deep'))continue;const d=Math.hypot(t.X-s.X,t.Z-s.Z)+(t===s?60:0);if(d<bd){bd=d;best=t;}}return best;}
function dwarfTaskReady(q){if(q.k==='supply')return !SURV()||countOf(q.it)>=q.need;if(q.k==='bounty')return q.c<=0;return false;}
function dwarfTaskDone(){const q=DW.q;if(!q)return '';if(q.k==='supply'&&SURV())takeItems(q.it,q.need);return dwarfReward(q);}
function dwarfReward(q){DW.q=null;DW.qn=(DW.qn||0)+1;saveDirty=true;giveCoin(q.rw);const extra=Math.random()<0.35?[462,466,468][Math.floor(Math.random()*3)]:0;if(extra&&SURV())addItem(extra,1);drawBar(true);
  dwarfGain(q.crown?14:8,null);const msg='Task done: '+q.n.replace(/^./,c=>c.toUpperCase())+'. You are paid '+coinWord(q.rw)+(extra?' and given '+nameOf(extra):'')+'.';toast(msg);tone(392,587,0.35,0.05);return msg;}
function dwarfFail(why){DW.q=null;saveDirty=true;toast(why);}
// once a second: tasks that end where the player goes
let dwarfLost=null,dwarfMk=0;
function dwarfTaskTick(){const q=DW.q;if(!q)return;const X=PL.x+OX,Z=PL.z+OZ;
  if(q.k==='writ'){if(DW.pt-q.t0>q.lim){dwarfFail('Too late: the writ-stone did not come to '+q.tn+' in time');if(SURV()&&countOf(478))takeItems(478,1);drawBar(true);return;}
    if(Math.hypot(q.X-X,q.Z-Z)<30){if(SURV()&&countOf(478)<1){dwarfFail('You have lost the writ-stone');return;}if(SURV())takeItems(478,1);toast('You set the writ-stone in the hands of the captain of '+q.tn+'. He breaks the seal and reads the runes.');dwarfReward(q);}}
  else if(q.k==='heirloom'){if(!q.got&&Math.hypot(q.X-X,q.Z-Z)<12){q.got=1;if(SURV())addItem(485,1);drawBar(true);saveDirty=true;toast('Under the fallen props of '+q.cn+' you find the heirloom of '+q.fn+'. Bring it home');}
    else if(q.got&&Math.hypot(q.fx-X,q.fz-Z)<50){if(SURV()&&countOf(485)<1)return;if(SURV())takeItems(485,1);dwarfReward(q);}}
  else if(q.k==='miner'){const L=dwarfLost&&!dwarfLost.dead&&foes.includes(dwarfLost)?dwarfLost:null,t=realmSiteAt(Math.round(q.X),Math.round(q.Z),4);
    if(!L&&!q.found&&t&&Math.hypot(q.X-X,q.Z-Z)<90){const ds=siteLayout(t).spots.filter(p=>p.kind==='deep'),p=ds[ds.length-1];if(p){const [sx,sz]=siteXZ(t,p.u,p.v),x=sx-OX+0.5,z=sz-OZ+0.5,bx=Math.floor(x),bz=Math.floor(z);
      if(bx>2&&bz>2&&bx<W-3&&bz<D-3&&genDone[(bx>>4)+(bz>>4)*NCX]){dwarfLost=addFoe('dminer',x,p.y,z,{site:t,prov:t.prov.key,st:'idle',t:99});if(dwarfLost){dwarfLost.nm=q.who;dwarfLost.hold=1;dwarfLost.holdSp=0;}}}}
    else if(L&&!q.found&&Math.hypot(L.x-PL.x,L.z-PL.z)<5&&Math.abs(L.y-PL.y)<4){q.found=1;saveDirty=true;L.hold=0;L.st='idle';L.t=3;toast('"'+DWARF_TONGUE[8][0]+'!" '+q.who+' had lost his lamp in a side drift. He takes your light and finds his own way up the shaft.');removeFoe(L);dwarfLost=null;dwarfReward(q);}}}
function dwarfMarks(dt){const q=DW.q;if(!q||(dwarfMk-=dt)>0)return;dwarfMk=0.4;let X,Z;if((q.k==='heirloom'&&!q.got)||q.k==='writ'||q.k==='miner'){X=q.X;Z=q.Z;}else if(q.k==='heirloom'){X=q.fx;Z=q.fz;}else return;
  const x=X-OX,z=Z-OZ,bx=Math.floor(x),bz=Math.floor(z);if(Math.hypot(x-PL.x,z-PL.z)>240||bx<0||bz<0||bx>=W||bz>=D)return;const y=ground[bx+W*bz]+1;
  for(let k=0;k<6;k++)spawnP(x+(Math.random()-.5)*0.6,y+Math.random()*16,z+(Math.random()-.5)*0.6,0,1.5,0,[1,0.7,0.3],1.2,-0.4);}
// ---- the annals of the kings: eight for each kingdom, told by the loremasters and at the lecterns of the Hall of the Fathers
const DWARF_ANN_N=8;
function dwarfKings(key){const r=rngAt(hsh(key.length,9933,0)*1e6|0,9935,[...key].reduce((a,c)=>a*31+c.charCodeAt(0)|0,0)&0xffff),k=[];for(let i=0;i<9;i++)k.push(nameWord('dwarf',r));return k;}
function dwarfAnnals(key,name){const k=dwarfKings(key),realm=name.replace(/^The /,'the ');return [
  ['The First Delving',k[0]+' struck the first blow into the mountain with an axe of stone, and found iron under it, and said: here. The first hall was cut where the blow fell. The axe hangs over the throne of '+realm+' still.'],
  ['The Stone Road',k[1]+' laid the Stone Road from hold to hold so that no dwarf need walk on mud again, and set a waymark every hundred paces and a lamp every forty. It took two hundred years. He did not live to walk it.'],
  ['The Hall of the Fathers','In the days of '+k[2]+' the first king was laid in the deep vault, and a flame was lit at his head that has not gone out. Every king since lies beside him, and the flames are tended day and night.'],
  ['The Great Forge',k[3]+' found the molten iron that rises in the deep places, and let it into a channel down the forge hall, so that the forges of '+realm+' are never cold. The smiths say the mountain itself works with them.'],
  ['The Feud of the Gems','A seam of gems was found where two holds\' delvings met, and '+k[4]+' and his cousin quarrelled over it for forty years. It was ended by a marriage and a ledger, and both are kept in the Hall of the Fathers.'],
  ['The Rams of the Heights',k[5]+' was the first to ride a ram of the heights into battle, up a cliff the orcs thought could not be climbed. The rams have been the mountain\'s ever since, and the keepers say every ram remembers it.'],
  ['The War of the Ash','When the fire came out of the wastes in the days of '+k[6]+', the dwarves marched with men and elves to the Ashen Gate, and dug the mine under it. The mine is still being dug. The war is not over.'],
  ['The Kindling',k[7]+' keeps the throne now. Every fourth evening the hold gathers in the great hall and the forge-fire is kindled anew, and the old names are sung over it, so that no king of '+realm+' is forgotten.']];}
function dwarfAnnal(s,told){if(!s){showText('The annals','The loremaster has no annals to tell tonight.');return;}const K=s.prov.kingdom,T=dwarfAnnals(K.key,K.name),heard=DW.an.filter(x=>x.startsWith(K.key+':')).map(x=>+x.split(':')[1]);
  let k=0;while(k<DWARF_ANN_N&&heard.includes(k))k++;const fresh=k<DWARF_ANN_N;if(!fresh)k=Math.floor(Math.random()*DWARF_ANN_N);
  showText('The annals of '+K.name.replace(/^The /,'the ')+' ('+(k+1)+' of '+DWARF_ANN_N+'): '+T[k][0],T[k][1]+(fresh?'\n\nThe annal is written into your journal.':''));
  if(fresh){DW.an.push(K.key+':'+k);DW.ann[K.key]=K.name;saveDirty=true;dwarfGain(1,null);}[147,165,196,165,147,131,147].forEach((fq,i)=>tone(fq,fq*1.003,0.6,0.04,i*0.5,'triangle'));}
function dwarfJournal(out){const keys=Object.keys(DW.ann);out.push('','THE ANNALS OF THE MOUNTAIN');
  if(!keys.length)out.push('No annals of the dwarves heard yet. Their loremasters tell them, and they are cut at the lecterns of the Hall of the Fathers under every high hold.');
  for(const key of keys){const n=DW.ann[key],T=dwarfAnnals(key,n),got=DW.an.filter(x=>x.startsWith(key+':')).map(x=>+x.split(':')[1]);
    out.push('','The Annals of '+n.replace(/^The /,'')+' ('+got.length+' of '+DWARF_ANN_N+')');for(let k=0;k<DWARF_ANN_N;k++)out.push(got.includes(k)?(k+1)+'. '+T[k][0]+'. '+T[k][1]:(k+1)+'. (not yet heard)');}
  out.push('','YOUR STANDING WITH THE DWARVES',DW_RANK[dwarfRank()]+' ('+DW.r+')'+(DW.nm?'. Called '+DW.nm:'')+(DW.kin?'. Kin of the Mountain, with a hall in '+DW.kin:'')+(DW.cw?'. Delving contests won: '+DW.cw:''));}
// a lectern in the Hall of the Fathers (from openLore): the annals
function dwarfLectern(x,y,z){const X=x+OX,Z=z+OZ,s=realmSiteAt(X,Z,10);if(!s||s.prov.cult.k!=='dwarf'||s.k!=='city')return false;const F=siteLayout(s).fathers;if(!F)return false;const [u,v]=siteUV(s,X,Z);
  if(u<F.u0-1||u>F.u1+1||v<F.v0-1||v>F.v1+1||Math.abs(y-F.y)>4)return false;dwarfAnnal(s,true);return true;}
// ---- blocks: the waymark of the Stone Road, the tomb of a king, the deep drum, the rune forge
function useWaymark(x,y,z){const X=x+OX,Z=z+OZ;let rr=null;for(let d=0;d<=4&&!rr;d++)for(const [a,b] of [[d,0],[-d,0],[0,d],[0,-d]]){rr=realmRoadAt(X+a,Z+b,1);if(rr)break;}
  if(!rr){showText('A waymark','Runes are cut in it, and the four ways on its cap. The road they name is not here.');return true;}const P=rr.rd.P,ends=[rr.rd.a,rr.rd.b].map(e=>{let best=null,bd=1e9;for(const s of P.sites){const d=Math.hypot(s.X-e[0],s.Z-e[1])-s.R;if(d<bd){bd=d;best=s;}}return best;}).filter(Boolean);
  showText('A waymark of '+P.kingdom.name.replace(/^The /,'the '),'Cut in runes: "'+realmRoadName(rr.rd)+', '+P.name+'." Below, and on its cap: '+ends.map(s=>s.name+', '+Math.round(Math.hypot(s.X-X,s.Z-Z)/10)*10+' paces '+dirWord(s.X-X,s.Z-Z)).join('; ')+'.');tone(196,247,0.25,0.05);return true;}
function useTomb(x,y,z){const X=x+OX,Z=z+OZ,s=realmSiteAt(X,Z,10);if(!s||s.prov.cult.k!=='dwarf'){showText('A tomb','A king of the dwarves lies here in granite, his axe at his side. The runes of his name are worn smooth.');return true;}
  const K=s.prov.kingdom,k=dwarfKings(K.key),i=Math.floor(hsh(X,9937,Z)*8);showText('The tomb of '+k[i],'"Here lies '+k[i]+', king under the mountain of '+K.name.replace(/^The /,'the ')+'. '+['He delved deep.','He kept the ledgers true.','He held the gate.','His forge was never cold.','He found the seam.','He rode the heights.','He marched to the Ashen Gate.','He kindled the fire anew.'][i]+'" A flame burns at his head.');
  tone(110,110,1.2,0.05);if(!DW.an.length)hint('dwarves');return true;}
let drumT=0;
function useDeepDrum(x,y,z){if(drumT>foeClock){toast('The drum is still ringing');return true;}drumT=foeClock+4;const at=[x+0.5,y+1,z+0.5];for(let i=0;i<3;i++){burst(0.8,'lowpass',90,0.6,0.5,i*0.7,at);tone(55,50,0.6,0.08,i*0.7,'sine',at);}
  toast('BOOM. BOOM. BOOM. The deep drum sounds through the hold.');return true;}
function useRuneForge(x,y,z){let f=null,bd=12;for(const g of foes)if(!g.dead&&g.kind==='drune'){const d=Math.hypot(g.x-PL.x,g.z-PL.z);if(d<bd){bd=d;f=g;}}if(f&&!folkWrath(f)){dwarfRunePanel(f);return true;}
  showText('The rune forge','The anvil\'s face is cut with runes that glow blue when iron is struck on it. Only a runesmith works here.');return true;}
// ---- the horn of the hold: an oathbound friend blows it and a shield-wall comes (a captain and up to six axeguards, in the dwarves'
// lands; the dwarves' soldiers within 80 elsewhere), who stand with the player for two minutes; once in five minutes
function dwarfHorn(){if(dwarfRank()<4){toast('The horn of the hold answers only an oathbound friend\'s breath');return true;}if(DW.pt-DW.hn<300){toast('The horn\'s call is still echoing in the stone; wait a while before you blow it again');return true;}
  DW.hn=DW.pt;saveDirty=true;tone(98,98,1.4,0.1,0,'sawtooth');tone(131,131,1.8,0.09,1.2,'sawtooth');let n=0;
  for(const f of foes){if(f.dead||!FOES[f.kind].folk||FOES[f.kind].civ||!dwarfPeopleOf(f)||folkWrath(f)||f.war||f.host||Math.hypot(f.x-PL.x,f.z-PL.z)>80)continue;f.aid=MN.pt+120;f.hx=PL.x;f.hz=PL.z;f.st='return';f.t=6;n++;}
  const P=realmOfColumn(Math.floor(PL.x+OX),Math.floor(PL.z+OZ));
  if(n<4&&P&&P.cult.k==='dwarf')for(let k=0;k<10&&n<7;k++){const a=PL.yaw+3.14+(k-5)*0.3,d=14,x=PL.x+Math.sin(a)*d,z=PL.z+Math.cos(a)*d,bx=Math.floor(x),bz=Math.floor(z);
    if(bx<3||bz<3||bx>=W-3||bz>=D-3||!genDone[(bx>>4)+(bz>>4)*NCX])continue;const f=addFoe(n===0?'dcapt':n%3===2?'dhammer':'daxe',x,ground[bx+W*bz]+1,z,{prov:P.key,site:P.sites[0],st:'return',t:6});if(f){f.aid=MN.pt+120;f.hx=PL.x;f.hz=PL.z;n++;}}
  toast(n?'You blow the horn of the hold. Boots on stone, and a shield-wall forms at your side.':'You blow the horn of the hold, but no dwarf is near enough to hear.');return true;}
// ---- coming into a province of the dwarves, and to a hold's great gate
let dwarfProv='',dwarfProvSeen=0,dwarfGateSeen=new Set();
function dwarfBorder(){const X=Math.floor(PL.x+OX),Z=Math.floor(PL.z+OZ),P=realmOfColumn(X,Z),key=P&&P.cult.k==='dwarf'?P.key:'';
  if(key!==dwarfProv||!dwarfProvSeen){const was=dwarfProv;dwarfProv=key;const first=!dwarfProvSeen;dwarfProvSeen=1;if(key&&(was||ready)&&!first)showName(P.name+', '+P.kingdom.name);}
  const s=realmSiteAt(X,Z,0);if(s&&s.prov.cult.k==='dwarf'&&s.k==='city'&&!dwarfGateSeen.has(s.id)){const L=siteLayout(s);if(L.mass){const [u,v]=siteUV(s,X,Z);if(u>L.mass.f-16&&u<L.mass.f&&Math.abs(v)<16){dwarfGateSeen.add(s.id);toast('The great doors of '+s.name+' stand open. Hammers ring somewhere under the mountain.');}}}}
// ---- each frame (from foes.js): the clock, the marks, the life; each second the border, the tasks, the claims found
let dwarfT=0;
function dwarfFrame(dt){if(!ready)return;DW.pt+=dt;dwarfMarks(dt);dwarfLife(dt);if((dwarfT-=dt)>0)return;dwarfT=1;
  dwarfBorder();dwarfTaskTick();
  const o=claimsNear(Math.floor(PL.x+OX),Math.floor(PL.z+OZ),-6);if(o&&discover('c',o.name))dwarfGain(2,null);}
function dwarfPlaceFound(rp){if(rp.s.prov.cult.k==='dwarf')dwarfGain(2,null);}
// ---- the dwarves' new folk (models: dwarf-court-models.js) and where they stand
Object.assign(FOES,{
  dqueen:{n:'Queen of the Mountain',m:'dqueen',hp:34,dmg:2,reach:1.8,walk:1,run:4,sight:20,cd:1.2,wind:0.4,mass:0.3,tall:1.8,folk:1,civ:1,fem:1,drops:[[224,2,4,0.6]],cause:'dwarf'},
  danvil:{n:'Anvilguard of the Throne',m:'danvil',hp:60,dmg:10,reach:2.4,walk:1.1,run:4.2,sight:30,cd:1.2,wind:0.45,block:0.5,mass:0.15,tall:1.8,folk:1,elite:1,say:'danvil',drops:[[223,1,2,0.5],[227,1,1,0.4]],cause:'dwarf'},
  dhward:{n:'Warden of the Hold',m:'dhward',hp:22,dmg:2,reach:1.8,walk:1.05,run:4.1,sight:18,cd:1.2,wind:0.4,mass:0.4,tall:1.7,folk:1,civ:1,drops:[[204,1,3,0.5]],cause:'dwarf'},
  dlore:{n:'Loremaster',m:'dlore',hp:16,dmg:1,reach:1.6,walk:1,run:3.8,sight:16,cd:1.2,wind:0.4,mass:0.45,tall:1.7,folk:1,civ:1,drops:[[203,2,6,0.5]],cause:'dwarf'},
  drune:{n:'Runesmith',m:'drune',hp:24,dmg:3,reach:1.8,walk:1.05,run:4,sight:18,cd:1.2,wind:0.4,mass:0.4,tall:1.7,folk:1,civ:1,drops:[[223,1,1,0.4]],cause:'dwarf'},
  dbrew:{n:'Brewer of the Hold',m:'dbrew',hp:22,dmg:2,reach:1.8,walk:1.05,run:4,sight:18,cd:1.2,wind:0.4,mass:0.4,tall:1.7,folk:1,civ:1,drops:[[462,1,2,0.5]],cause:'dwarf'},
  dmerch:{n:'Merchant of the Mountain',m:'dmerch',hp:18,dmg:1,reach:1.6,walk:1.05,run:4,sight:16,cd:1.2,wind:0.4,mass:0.45,tall:1.7,folk:1,civ:1,drops:[[203,2,6,0.5]],cause:'dwarf'},
  dmint:{n:'Moneychanger',m:'dmerch',hp:16,dmg:1,reach:1.6,walk:1,run:4,sight:16,cd:1.2,wind:0.4,mass:0.45,tall:1.7,folk:1,civ:1,drops:[[204,1,3,0.5]],cause:'dwarf'},
  dgem:{n:'Gemcutter',m:'dgem',hp:16,dmg:1,reach:1.6,walk:1,run:4,sight:16,cd:1.2,wind:0.4,mass:0.45,tall:1.7,folk:1,civ:1,drops:[[468,1,1,0.4]],cause:'dwarf'},
  dfarm:{n:'Mushroom-farmer',m:'dfarm',hp:18,dmg:1,reach:1.6,walk:1.05,run:4,sight:16,cd:1.2,wind:0.4,mass:0.45,tall:1.7,folk:1,civ:1,drops:[[465,1,2,0.5]],cause:'dwarf'},
  dkeep:{n:'Ram-keeper',m:'dfarm',hp:20,dmg:2,reach:1.6,walk:1.05,run:4.2,sight:16,cd:1.2,wind:0.4,mass:0.45,tall:1.7,folk:1,civ:1,drops:[[352,1,1,0.4]],cause:'dwarf'},
  dchild:{n:'Child of the Hold',m:'dchild',hp:6,dmg:0,reach:1,walk:1.3,run:4.6,sight:14,cd:1.5,wind:0.4,mass:0.9,folk:1,civ:1,tall:1.1,say:'dchild',drops:[],cause:'dwarf'},
  dgirl:{n:'Child of the Hold',m:'dgirl',hp:6,dmg:0,reach:1,walk:1.3,run:4.6,sight:14,cd:1.5,wind:0.4,mass:0.9,folk:1,civ:1,fem:1,tall:1.1,say:'dchild',drops:[],cause:'dwarf'},
  dramr:{n:'Ram-rider of the Mountain',m:'dramr',hp:40,dmg:6,reach:2.6,walk:1.5,run:6.5,sight:32,cd:1.2,wind:0.45,block:0.4,mass:0.2,tall:2.4,mount:1,folk:1,say:'dguard',drops:[[223,1,1,0.3],[352,1,1,0.4]],cause:'dwarf'},
  dprosp:{n:'Prospector',m:'dprosp',hp:24,dmg:3,reach:1.8,walk:1.1,run:4.2,sight:18,cd:1.2,wind:0.4,mass:0.4,tall:1.7,folk:1,civ:1,drops:[[468,1,1,0.4]],cause:'dwarf'},
  ddeep:{n:'Deepwarden',m:'ddeep',hp:36,dmg:6,reach:2,walk:1.1,run:4.3,sight:26,cd:0.9,wind:0.35,block:0.35,mass:0.3,tall:1.7,folk:1,say:'ddeep',drops:[[223,1,1,0.4],[DLAMP,1,1,0.3]],cause:'dwarf'},
  dengin:{n:'Engineer of the Hold',m:'dengin',hp:22,dmg:3,reach:1.8,walk:1.05,run:4.1,sight:18,cd:1.2,wind:0.4,mass:0.4,tall:1.7,folk:1,civ:1,drops:[[223,1,1,0.3]],cause:'dwarf'}});
Object.assign(FOE_HOME,{d_dthrone:[['danvil',1]],d_danvil:[['danvil',2]],d_dcourt:[['dlore',1],['dlady',1],['dlord',1]],d_dale:[['dminer',2],['dsmith',1],['daxe',1],['dlady',1]],d_drunes:[['dsmith',1]],d_dbrew:[['dminer',1]],
  d_dmarket:[['dmint',1],['dlady',1],['dminer',1]],d_dgem:[['dlady',1]],d_dstreet:[['dminer',1],['dlady',1],['dchild',0.6],['dgirl',0.5]],d_dgarden:[['dfarm',2]],d_dbath:[['dminer',1],['dlord',1]],d_dvault:[['danvil',2]],
  d_dfathers:[['dlady',1],['dlord',1]],d_dmourn:[['dlady',1],['dlord',1]],d_ddeep:[['ddeep',1],['dminer',1]],d_dpen:[['dminer',1]],d_dengine:[['daxe',1]]});
FOE_HOME.d_street.push(['dchild',0.6],['dgirl',0.5]);FOE_HOME.d_deep.push(['ddeep',0.6]);
Object.assign(FOLK_N,{dthrone:[2,2],danvil:[2,2],dcourt:[3,4],dale:[3,5],drunes:[1,2],dbrew:[2,2],dmarket:[3,4],dgem:[1,2],dstreet:[2,3],dgarden:[2,3],dbath:[2,3],dvault:[2,2],dfathers:[1,2],dmourn:[1,2],ddeep:[2,2],dpen:[1,2],dengine:[1,2]});
Object.assign(FOLK_LEAD,{d_keep:'dcapt',d_dcourt:'dhward',d_dale:'dbrew',d_drunes:'drune',d_dbrew:'dbrew',d_dmarket:'dmerch',d_dgem:'dgem',d_dgarden:'dfarm',d_dfathers:'dlore',d_ddeep:'ddeep',d_dpen:'dkeep',d_dengine:'dengin'});
Object.assign(FOLK_SAY,{dqueen:['Be welcome under the mountain, and keep its peace.','Every lamp in {p} was lit by someone who loved it.','The ledgers say we owe the fire a reckoning. We will pay it.'],
  danvil:['Stand back from the throne.','We have stood here since before your grandfather was born.','The anvil does not move. Neither do we.'],
  dhward:['The keys of {p} are on my belt. All of them.','A hold is a thousand doors, and every one of them must be shut at night.','If you need anything in {p}, you need me first.'],
  dlore:['Shall I tell you of the First Delving? It is a good one.','Every king of {k} is written down. Every one.','The fathers do not sleep. They listen.'],
  drune:['A rune is cut once, and holds forever. Do not ask me to cut a careless one.','Keenness, warding, delving, the lamp. Which do you need?','Feel that? The stone is listening to the iron.'],
  dbrew:['The dark ale is ready. The fire ale is not for the faint.','Sit down before you drink the stout. Trust me.','A hold runs on ale and iron. In that order, some say.'],
  dmerch:['Good iron, fair prices, no haggling. Well, a little haggling.','Gems from the deep seams! Look how they take the light.','Coin is coin, but a dwarf remembers who paid fairly.'],
  dgem:['Hold it to the lamp. See the fire in it? I put that there.','A rough stone is a promise. A cut one is a promise kept.','Mind my wheel.'],
  dfarm:['The glowing ones light the beds. The brown ones you can eat.','Nothing grows without the sun, they say. They have never been down here.','Mind the beds, please.'],
  dkeep:['A ram will go where a horse breaks its legs.','That one bites. That one butts. That one does both.','Up a cliff, over a scree, along a ledge. A ram does not care.'],
  dchild:['Are you a giant? You are very tall.','I am going to be a hammerer when I grow a beard.','Have you seen the rams? I fed one!'],
  dprosp:['There is a seam in this hill. I can smell it.','Two winters I have been digging here. One more, and I will find it.','You would not have a spare lamp, would you?'],
  ddeep:['Who walks in the deep? Name yourself.','Keep to the lamplit ways. The dark ones are dark for a reason.','The mountain is quiet tonight. That is how I like it.'],
  dengin:['The trebuchet throws a stone the weight of a pony two hundred paces. Accurately.','Every wheel in {p} I have greased myself.','Measure twice. Cut once. Then measure again.']});
// ---- the great ram, the caravan pony and the raven
Object.assign(ANIMALS,{
  ram:{n:'Great Ram',hp:16,walk:1.2,run:6.5,shy:5,stride:1.6,amp:0.6,turn:3.4,graze:1,sleeps:1,drops:[[351,2],[352,1]],g:[],herd:[2,4],w:0,youngP:0.2,calls:[18,45],mount:true,gallop:11,leap:12.5,climb:1,ride:'Riding the great ram. It springs up ledges a horse would balk at; sprint to run.'},
  pony:{n:'Caravan Pony',hp:12,walk:1.1,run:4,shy:0,stride:1.4,amp:0.6,turn:3,graze:1,sleeps:1,drops:[],g:[],herd:[1,1],w:0,youngP:0,calls:[30,80]},
  raven:{n:'Raven of the Mountain',hp:3,walk:0.8,run:3,shy:3,stride:0.4,amp:0.8,turn:6,biped:1,graze:0,sleeps:1,drops:[],g:[],herd:[1,2],w:0,youngP:0,calls:[8,20]}});
