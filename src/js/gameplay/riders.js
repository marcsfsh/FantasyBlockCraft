// ---- The riders of the plains (D-090): the player's standing with the horse-lords, and what they offer those they know.
//
// Standing (RH.r, saved as rh) rises with tasks done for them, trade, their places and the forefathers' ruins found, the songs of
// their kings heard, creatures of the wastes slain near their folk, the feast kept in the hall, races won and bouts sparred; it
// falls when one of their folk is struck and much further when one is slain. Its ranks (RH_AT): Stranger, Guest of the Hall,
// Hall-friend, Friend of the Riders; a Sworn Rider only by the oath at a high seat of the riders (RH.sw), and a sworn rider of
// great standing is made a Thane by a king or a queen, given a steading to keep. Each rank brings a gift.
// Speaking with the folk (use one of them): they greet in their own tongue (words of our own) and say what it means; then what
// that one can do: merchants trade; the horse-dealer sells horses; the horse-healer tends your horse, shoes it (a shod horse
// gallops a tenth faster) and puts barding on it (a barded horse takes a third off the blows its rider takes); smiths mend and
// forge the riders' arms; herds name your horse; the lay-singer and the warden of the mounds sing the songs of the kings; the
// marshals, thanes, the counsellor and the high seat give tasks: the war-arrow carried to another place before time runs out, a
// strayed horse found and led home, creatures of the wastes slain, supplies, venison, a relic of the forefathers. The doorwardens
// keep the peace of the golden hall: no blow is struck within it. Justice: whoever strikes their folk may pay amends to a marshal
// or a thane; whoever slays one is banished from that kingdom a while. The war-horn of the riders calls a riding to a sworn rider.
const RH_AT=[0,10,30,70,140,240],RH_RANK=['Stranger','Guest of the Hall','Hall-friend','Friend of the Riders','Sworn Rider','Thane of the Riders'];
const RH_GIFTS=[null,[[448,3],[446,1]],[[447,2],[449,3]],[[450,1],[409,12]],[[454,1],[453,1],[451,1],[452,1]],[[455,1],[205,2]]];
let RH=saved&&saved.rh&&typeof saved.rh==='object'?saved.rh:null;
if(!RH)RH={r:0,sw:0,th:'',g:0,q:null,qn:0,sg:[],sgn:{},au:{},out:{},pt:0,hn:-1e9,fe:-1,rw:0,sp:0,boast:0,sl:0};
const riderSave=()=>({rh:RH});
const RIDER_KINDS=new Set(['hspear','hbow','hcapt','hrider','hman','hwoman','hherd','hthane','hsmith','hking','hqueen','hdoor','hcouns','hmaid','hscop','hleech','hdealer','hchild','hgirl','hwarden','hracer','hlancer','hharch','hout']);
function riderPeopleOf(f){if(!f)return false;const C=f.site&&f.site.prov&&f.site.prov.cult;if(C)return C.k==='horse';return RIDER_KINDS.has(f.kind);}
const riderRank=()=>{let r=0;while(r+1<RH_AT.length&&RH.r>=RH_AT[r+1])r++;return RH.sw?Math.max(4,r):Math.min(3,r);};
const riderRankName=()=>RH_RANK[riderRank()];
function riderGain(n,why){if(!n)return;const r0=riderRank();RH.r=Math.max(-80,Math.min(500,RH.r+n));saveDirty=true;const r1=riderRank();
  if(why)toast(why+' ('+(n>0?'+':'')+n+' standing with the riders)');if(r1>r0)setTimeout(()=>riderRankUp(r1),why?1600:0);}
function riderRankUp(r){toast('The riders now name you '+RH_RANK[r]);if(r===3)setTimeout(()=>toast('A friend of the riders of great standing may swear the oath at a high seat of the riders'),2600);riderGift(r);}
function riderGift(r){if(RH.g>=r)return;RH.g=r;const L=RH_GIFTS[r];if(!L)return;const got=[];if(SURV())for(const [id,c] of L){const left=addItem(id,c);if(left)toast('No room for '+nameOf(id));got.push((c>1?c+' ':'')+nameOf(id));}
  if(got.length)setTimeout(()=>toast('In token of it the riders give you '+got.join(', ')),2400);drawBar(true);saveDirty=true;}
// ---- their tongue: greetings with what they mean
const RIDER_TONGUE=[['Holdra venn, ferrin','Well met, wayfarer'],['Grasa ronn thi helda','The grass and the wind keep you'],['Sela una hrosk','Hearth and horse'],['Vindr tharn, ferrin','Ride swift, wayfarer'],
  ['Medra fullan!','A full cup!'],['Holdu wethra, skildra','Keep the oath, shield-friend'],['Ernas oldra sweran','The old ones sleep in the mounds'],['Tharn hrosk, varm heorth','A swift horse and a warm hearth'],['Vela sunnar','Fair sun to you'],['Ferrin, saeta oss','Wayfarer, sit with us']];
const riderTongue=()=>{const t=RIDER_TONGUE[Math.floor(Math.random()*RIDER_TONGUE.length)];return '"'+t[0]+'" ('+t[1]+')';};
function riderGreet(f,F){const r=riderRank(),who=(f.nm||F.n)+': ';if(r>=4){f.bow=foeClock+2;return who+riderTongue()+(RH.th?' My lord thane.':' Sworn rider.');}
  if(r>=2&&Math.random()<0.6)return who+riderTongue();return null;}
// ---- struck, slain, banished
const riderOutlaw=f=>!!(f&&f.site&&f.site.prov&&f.site.prov.cult.k==='horse'&&(RH.out[f.site.prov.kingdom.key]||0)>RH.pt);
function riderStruck(f){if(riderPeopleOf(f))riderGain(-6,'You struck one of the riders\' folk');}
function riderSlain(f){const F=FOES[f.kind];if(F.folk){if(riderPeopleOf(f)&&f.site&&!f.war&&!f.host){riderGain(-25,'You slew one of the riders\' folk');const K=f.site.prov.kingdom;RH.out[K.key]=RH.pt+900;saveDirty=true;
      setTimeout(()=>toast('You are banished from '+K.name.replace(/^The /,'the ')+'. Its riders will take you on sight, unless you pay the blood-price to one of its marshals or thanes.'),2400);}return;}
  if(RH.q&&RH.q.k==='bounty'){RH.q.c=Math.max(0,RH.q.c-1);if(!RH.q.c)toast('The riders\' bounty is earned; claim it');}
  let near=false;foeNear(f.x,f.z,30,g=>{if(!near&&!g.dead&&FOES[g.kind].folk&&riderPeopleOf(g))near=true;},0);if(near){RH.sl++;if(RH.sl%3===0)riderGain(1,null);}}
function riderAmends(f){const s=f.site,K=s&&s.prov.kingdom,out=K&&(RH.out[K.key]||0)>RH.pt,v=out?200:30;
  if(!payCoin(v))return 'They want '+coinWord(v)+' as the blood-price, and you have not got it.';realmWrath.delete(f.prov);if(out)delete RH.out[K.key];saveDirty=true;
  for(const g of foes)if(g.prov===f.prov&&!g.dead){g.foe=null;if(g.st==='chase'||g.st==='flee'){g.st='return';g.t=4;}}
  riderGain(2,null);return 'You pay '+coinWord(v)+'. "It is paid, and it is forgotten. Ride in peace."';}
// ---- the peace of the golden hall: within a hall of the riders no blow is struck at their folk
let peaceT=0;
function riderHallAt(X,Z){const s=realmSiteAt(X,Z,2);if(!s||s.prov.cult.k!=='horse'||s.k!=='city')return null;const H=siteLayout(s).hall;if(!H)return null;const [u,v]=siteUV(s,X,Z);
  return u>=H.u0&&u<=H.u1&&Math.abs(v)<=(H.W>>1)?s:null;}
function riderHallPeace(f){if(!riderPeopleOf(f)||f.war||f.host||folkWrath(f)||!SURV())return false;if(!riderHallAt(Math.floor(PL.x+OX),Math.floor(PL.z+OZ)))return false;
  if(peaceT<=foeClock){peaceT=foeClock+4;toast('The doorwardens\' eyes are on you. No blade is drawn in the golden hall.');}return true;}
// ---- the panel and the folk who do more than greet
const RIDER_TASK=new Set(['hcapt','hthane','hking','hqueen','hcouns']),RIDER_COURT=new Set(['hking','hqueen']);
function riderAct(){const f=foeHit(4.6);if(!f||f.dead||!FOES[f.kind].folk||f.foe&&!folkWrath(f))return false;if(!riderPeopleOf(f)||f.war||f.host||f.hst||f.race||(f.site&&f.site.k==='wgate'))return false;
  if(folkWrath(f)){if(f.kind==='hcapt'||f.kind==='hthane'||RIDER_COURT.has(f.kind)){riderTalk(f,1);return true;}return false;}riderTalk(f);return true;}
function riderTalk(f,wrath){const F=FOES[f.kind],s=f.site,r=riderRank(),spk=f.spk||'',seat=RIDER_COURT.has(f.kind)||spk==='h_seat'&&f.kind==='hthane';
  f.st='idle';f.t=6;f.yaw=f.hd=Math.atan2(PL.x-f.x,PL.z-f.z);if(r>=4&&!wrath)f.bow=foeClock+2;
  elfPanel((f.nm||F.n)+(s?', '+s.name:''),U=>{
    if(wrath){U.text('"You owe a blood-price here. Pay it, and ride in peace again."');const b=U.row();U.btn(b,'Pay the blood-price',()=>riderAmends(f));U.btn(b,'Farewell',()=>{closeInv();return false;});return;}
    U.text(riderTongue()+' "'+(FOLK_SAY[f.kind]||FOLK_SAY[F.say]||FOLK_SAY.hguard)[Math.floor(Math.random()*3)].replace('{p}',s?s.name:'the plains').replace('{k}',s?s.prov.kingdom.name.replace(/^The /,'the '):'the plains')+'"');
    U.text('You are '+RH_RANK[r]+(RH.th?' (Thane of '+RH.th+')':'')+' among the riders. Standing '+RH.r+(r<3&&r+1<RH_AT.length?' ('+RH_AT[r+1]+' for '+RH_RANK[r+1]+')':r===3?(RH.r>=RH_AT[4]?' (enough to swear the oath at a high seat)':' ('+RH_AT[4]+' to swear the oath)'):'')+'.');
    if(RH.q){const q=RH.q;U.text('Your task: '+q.n+'.');const b=U.row();if(riderTaskReady(q))U.btn(b,'Tell them the task is done',()=>riderTaskDone());U.btn(b,'Give up your task',()=>{RH.q=null;saveDirty=true;return 'You give up the task.';});}
    const b=U.row();
    if(spk==='h_market'||spk==='h_stall')U.btn(b,'Trade',()=>{riderTradePanel(f);return false;});
    if(f.kind==='hdealer'||spk==='h_fair')U.btn(b,'Buy a horse',()=>{riderHorsePanel(f);return false;});
    if(f.kind==='hleech'||spk==='h_leech'){U.btn(b,'Tend your horse',()=>riderTend(0));U.btn(b,'Shoe your horse (6 copper)',()=>riderTend(1));U.btn(b,'Buy barding (60 copper)',()=>riderBuy(452,60,1));}
    if(f.kind==='hsmith'||spk==='h_smithy'){U.btn(b,'Mend your arms and tools',()=>menMend());U.btn(b,'Have arms forged',()=>{riderForgePanel(f);return false;});}
    if(f.kind==='hherd'||spk==='h_stable'||spk==='h_paddock')U.btn(b,'Ask them to name your horse',()=>riderNameHorse());
    if(f.kind==='hscop'||f.kind==='hwarden'||spk==='h_scop')U.btn(b,'Ask for a song of the kings',()=>{riderSong(s,true);return false;});
    if(f.kind==='hmaid'||f.kind==='hcapt'&&(spk==='h_drill'||spk==='h_keep'))U.btn(b,'Spar with them',()=>{closeInv();riderSpar(f);return false;});
    if(spk==='h_cjudge'||spk==='h_cpav')U.btn(b,'Ask about the race',()=>riderRaceAsk(f));
    if(seat)U.btn(b,'Ask for an audience',()=>riderAudience(f));
    if((RIDER_TASK.has(f.kind)||seat)&&!RH.q)U.btn(b,'Ask for a task',()=>{const q=riderTaskGive(f.site,null,RIDER_COURT.has(f.kind));if(q){closeInv();return false;}return 'There is nothing the riders need of you now.';});
    U.btn(b,'Farewell',()=>{closeInv();return false;});});
  foeCall(f,'idle');tone(440,554,0.16,0.05);hint('riders');}
// ---- trade: the riders' goods ([item, price in copper, the least rank]) and what they buy
const RIDER_GOODS=[[448,2],[449,4],[447,3],[446,4],[206,2],[409,1],[461,8],[405,30,1],[450,70,2],[452,60,2],[453,90,3],[451,220,4]];
const RIDER_BUYS=[[202,1],[350,3],[351,2],[352,3],[WOOLW,2],[223,4],[224,12],[227,10],[415,25],[457,60],[458,90],[459,70],[456,40]];
const RIDER_BUYK=[1.4,1.2,1,0.9,0.75,0.65],RIDER_SELLK=[0.6,0.75,0.85,0.95,1.05,1.15];
const riderPrice=c=>Math.max(1,Math.round(c*RIDER_BUYK[riderRank()])),riderOffer=c=>Math.max(1,Math.round(c*RIDER_SELLK[riderRank()]));
function riderBuy(id,c,n,fixed){const v=(fixed?c:riderPrice(c))*n;if(!payCoin(v))return 'You have not the coin ('+coinWord(v)+')';const left=addItem(id,n);if(left)toast('No room for '+nameOf(id));
  drawBar(true);saveDirty=true;if(v>=20)riderGain(1,null);return 'You buy '+(n>1?n+' ':'')+nameOf(id)+' for '+coinWord(v);}
function riderSell(id,c,n){if(SURV()){if(countOf(id)<n)return 'You have no '+nameOf(id);takeItems(id,n);}const v=riderOffer(c)*n;giveCoin(v);saveDirty=true;if(v>=20)riderGain(1,null);return 'You sell '+(n>1?n+' ':'')+nameOf(id)+' for '+coinWord(v);}
function riderTradePanel(f){const r=riderRank();elfPanel('The stalls of '+(f.site?f.site.name:'the riders'),U=>{
  U.text('Your purse: '+coinWord(purse())+(SURV()?'':' (in creative the riders give freely)')+'. Prices for '+RH_RANK[r]+(r<2?': they are better for a friend of the hall.':'.'));
  U.text('They sell:');for(const [id,c,need] of RIDER_GOODS){if((need||0)>r){U.text('  '+nameOf(id)+': for '+RH_RANK[need]+' and above');continue;}const row=U.row();
    U.btn(row,nameOf(id)+' ('+coinWord(riderPrice(c))+')',()=>riderBuy(id,c,1));if(stackMax(id)>1)U.btn(row,'Four',()=>riderBuy(id,c,4));}
  const mine=RIDER_BUYS.filter(([id])=>!SURV()||countOf(id)>0);U.text(mine.length?'They will buy:':'They would buy grain, wool, hides and leather, ingots, drake scales and the relics of the forefathers; you have none of these.');
  for(const [id,c] of mine){const row=U.row();U.btn(row,'Sell '+nameOf(id)+' ('+coinWord(riderOffer(c))+(SURV()?', you have '+countOf(id):'')+')',()=>riderSell(id,c,1));}
  U.btn(U.row(),'Back',()=>{riderTalk(f);return false;});});}
function riderForgePanel(f){const r=riderRank();elfPanel('The forge of '+(f.site?f.site.name:'the riders'),U=>{U.text('"Shoes for horses and heads for spears, and mail for those who ride with us."');
  for(const [id,c,need] of [[405,30,1],[450,70,2],[381,60,2],[451,220,4]]){const row=U.row();if(need>r){U.text('  '+nameOf(id)+': for '+RH_RANK[need]+' and above');continue;}U.btn(row,nameOf(id)+' ('+coinWord(riderPrice(c))+')',()=>riderBuy(id,c,1));}
  U.btn(U.row(),'Back',()=>{riderTalk(f);return false;});});}
// ---- horses: the dealer's horses of four breeds; the horse-healer's tending, shoeing and barding; the herds' names
const RIDER_BREEDS=[['A dun of the steppe, hardy',3,60],['A grey, quick',2,90],['A bay, steady',0,70],['A black, strong',4,110]];
function riderHorsePanel(f){elfPanel('The horse-dealer of '+(f.site?f.site.name:'the riders'),U=>{U.text('"Every horse here was foaled on the grass. Choose, and she is yours."');
  for(const [n,ci,c] of RIDER_BREEDS){const row=U.row();U.btn(row,n+' ('+coinWord(riderPrice(c))+')',()=>{const v=riderPrice(c);if(!payCoin(v))return 'You have not the coin ('+coinWord(v)+')';riderLeadOut('horse',ci);riderGain(1,null);return 'The dealer leads out the horse and puts its rein in your hand. It is yours.';});}
  U.btn(U.row(),'Back',()=>{riderTalk(f);return false;});});}
function riderLeadOut(kind,ci){const a=PL.yaw,x=PL.x-Math.sin(a+0.8)*2.5,z=PL.z-Math.cos(a+0.8)*2.5,y=standY(x,PL.y+1,z);
  const h=addAnimal(kind,x,y>0?y:PL.y,z,{tame:true,uid:Date.now().toString(36)+'r',ci:ci|0,st:'idle',t:2});h.yaw=h.hd=Math.atan2(PL.x-x,PL.z-z);saveDirty=true;animalCall(h,false);return h;}
const riderMyHorse=()=>{let b=null,bd=14;for(const a of animals)if(a.tame&&!a.dead&&ANIMALS[a.kind].mount&&!ANIMALS[a.kind].boat){const d=Math.hypot(a.x-PL.x,a.z-PL.z);if(d<bd){bd=d;b=a;}}return b;};
function riderTend(k){const a=riderMyHorse();if(!a)return 'Bring your horse to me, and I will see to it.';
  if(k===0){a.hp=ANIMALS[a.kind].hp;return 'The horse-healer runs her hands down its legs and looks at its teeth. "Sound, and well."';}
  if(a.shod)return '"Its shoes are good for a while yet."';if(!payCoin(6))return 'Shoeing is 6 copper, and you have not got it.';a.shod=1;saveDirty=true;burst(0.3,'bandpass',2400,4,0.2);return 'Your horse is shod with the riders\' iron. It will gallop the better for it.';}
const RIDER_HNAMES=['Swiftmane','Windfoot','Grassrunner','Greyflank','Sunmane','Stormhoof','Fleetwind','Duskmane','Brightfoot','Hillrunner'];
function riderNameHorse(){const a=riderMyHorse();if(!a)return '"Bring your horse here, and I will give it a name."';if(a.nm)return '"Its name is '+a.nm+'. It knows it well."';
  a.nm=RIDER_HNAMES[Math.floor(Math.random()*RIDER_HNAMES.length)];saveDirty=true;animalCall(a,false);return '"A horse should have a name." They whisper it into its ear: '+a.nm+'.';}
// barding put on the horse you are near (use it while holding it)
function useBarding(){const a=riderMyHorse();if(!a){toast('Barding is put on a horse of your own; stand by it');return true;}if(a.bard){toast('Your horse is barded already');return true;}
  if(SURV()){const q=inv[sel];q.c--;if(!q.c)inv[sel]=null;}a.bard=1;saveDirty=true;drawBar(true);toast('You put the riders\' barding on your horse. Blows meant for its rider will be the lighter.');return true;}
// ---- the high seat: an audience with the king or the queen (a thane on a lesser seat): a welcome by the player's standing, a
// gift once for each rank; the oath for a friend of great standing; at the last the thaneship and a steading to keep
const riderSeatLead=s=>{if(!s.prov.capital)return 'hthane';const k=s.prov.kingdom.key;return hsh(k.length,9921,[...k].reduce((a,c)=>a+c.charCodeAt(0),0))<0.5?'hking':'hqueen';};
function riderAudience(f){const s=f.site,K=s?s.prov.kingdom:null,r=riderRank(),royal=RIDER_COURT.has(f.kind),who=royal?FOES[f.kind].n.replace(/ of the .*$/,'').toLowerCase():'thane of '+(s?s.prov.name:'the province');if(!K)return 'They nod to you.';
  if(r<1)return 'The '+who+' looks long at you. "A stranger in the golden hall. Sit by the fire and be welcome; come again when the riders know your name."';
  const given=RH.au[K.key]||0;let msg='The '+who+' rises. "'+(r>=4?'Our sworn rider returns.':r>=2?'A friend of the hall is ever welcome.':'Be welcome, guest.')+'"';
  if(given<r&&r<4){RH.au[K.key]=r;saveDirty=true;const g=[[0,0],[446,2],[449,3],[204,6]][r];if(SURV()&&g[0]){addItem(g[0],g[1]);drawBar(true);}if(g[0])msg+=' A gift from the high seat: '+(g[1]>1?g[1]+' ':'')+nameOf(g[0])+'.';riderGain(2,null);}
  if(r===3&&RH.r>=RH_AT[4]){closeInv();setTimeout(()=>riderOath(f,K),200);return false;}
  if(r>=4&&RH.r>=RH_AT[5]&&!RH.th&&royal){closeInv();setTimeout(()=>riderThane(f,K),200);return false;}
  if(r>=2&&!RH.q)msg+=' "If you would serve the riders, ask, and you shall have a task."';return msg;}
// the oath: the player kneels before the high seat with a hand on the hilt held out to them, and swears
function riderOath(f,K){f.bow=foeClock+4;tone(294,392,0.6,0.07);tone(392,494,0.6,0.07,0.6);tone(494,587,1,0.07,1.2);
  showText('The oath','You kneel before the high seat of '+K.name.replace(/^The /,'the ')+' and lay your hand on the hilt held out to you. "I will ride when the riders ride, and hold where they hold, and keep faith with the high seat while the grass grows." The hall answers with a shout and the stamping of feet: "'+RIDER_TONGUE[5][0]+'!"');
  RH.sw=1;saveDirty=true;setTimeout(()=>riderGift(4),2600);setTimeout(()=>toast('Blow the war-horn of the riders, and a riding will come to you'),5200);}
function riderThane(f,K){const vs=f.site.prov.sites.filter(s=>s.k==='village'),v=vs[0]||f.site;RH.th=v.name;saveDirty=true;
  showText('A thaneship','The '+FOES[f.kind].n.toLowerCase()+' takes a brooch of gold from the counsellor and pins it to your cloak. "For your deeds the steading of '+v.name+' is yours to keep, and its hearth and its herds. Rise, Thane of '+v.name+'."');riderGift(5);tone(392,587,1,0.07);}
// ---- tasks: from the marshals, thanes, the counsellor and the high seat (and the boast at the feast, rider-life.js)
const RIDER_TK=['arrow','stray','bounty','supply','hunt','relic'],RIDER_SUPPLY=[[HAYBALE,6],[202,8],[352,4],[447,3],[WOOLW,6]],RIDER_RELIC=[457,458,459];
function riderTaskGive(s,kind,crown,boast){if(RH.q||!s)return null;const K=kind||RIDER_TK[Math.floor(Math.random()*RIDER_TK.length)],X0=PL.x+OX,Z0=PL.z+OZ;
  let q={k:K,from:s.id,fn:s.name,fx:s.X,fz:s.Z,t0:RH.pt,crown:crown?1:0,boast:boast?1:0};
  if(K==='arrow'){const t=riderOtherSite(s);if(!t)return null;const d=Math.hypot(t.X-s.X,t.Z-s.Z),lim=Math.round(60+d/5);Object.assign(q,{X:t.X,Z:t.Z,tn:t.name,lim:lim,n:'carry the war-arrow from '+s.name+' to '+t.name+' within '+Math.round(lim/60*10)/10+' minutes',rw:(crown?50:20)+Math.round(d/35)});if(SURV())addItem(460,1);}
  else if(K==='bounty'){const n=5+Math.floor(Math.random()*4);Object.assign(q,{c:n,n:'slay '+n+' creatures of the wastes for the riders of '+s.name,rw:crown?110:55});}
  else if(K==='supply'){const [it,n]=RIDER_SUPPLY[Math.floor(Math.random()*RIDER_SUPPLY.length)];Object.assign(q,{it:it,need:n,n:'bring '+n+' '+nameOf(it)+' to '+s.name,rw:12+n*2});}
  else if(K==='hunt')Object.assign(q,{it:350,need:4,n:'bring 4 Raw Venison for the hall of '+s.name,rw:22});
  else if(K==='relic'){let best=null,bd=1e9;const cx=Math.floor(X0/CS),cz=Math.floor(Z0/CS);for(let a=-50;a<=50;a++)for(let b=-50;b<=50;b++){const o=fathersAt(cx+a,cz+b);if(!o||!o.name)continue;const d=Math.hypot(o.X-X0,o.Z-Z0);if(d>60&&d<bd){bd=d;best=o;}}
    if(!best)return null;const it=RIDER_RELIC[Math.floor(Math.random()*3)];Object.assign(q,{X:best.X,Z:best.Z,it:it,got:0,n:'bring the '+nameOf(it)+' from '+best.name+' to '+s.name,rw:crown?120:55});}
  else if(K==='stray'){let pt=null;for(let k=0;k<30&&!pt;k++){const a=Math.random()*6.283,d=100+Math.random()*120,X=Math.round(s.X+Math.cos(a)*d),Z=Math.round(s.Z+Math.sin(a)*d),o=colInfo(X,Z,TEL);if(!o.wet&&!o.river&&!o.lake&&o.h>o.sl+2&&!realmSiteAt(X,Z,10)&&!wasteGateNear(X,Z,40)&&o.wVolc<0.2)pt=[X,Z];}
    if(!pt)return null;const nm=RIDER_HNAMES[Math.floor(Math.random()*RIDER_HNAMES.length)];Object.assign(q,{X:pt[0],Z:pt[1],who:nm,found:0,n:'find '+nm+', a horse of '+s.name+' that strayed, and lead it home',rw:crown?80:36});}
  if(boast)q.rw*=2;RH.q=q;saveDirty=true;const d=q.X!==undefined?Math.hypot(q.X-X0,q.Z-Z0):0;
  toast((boast?'Your boast':crown?'A task of the high seat':'A task of the riders')+': '+q.n+'.'+(q.X!==undefined?' It lies '+dirWord(q.X-X0,q.Z-Z0)+', '+Math.round(d)+' blocks off; sparks rise over it.':''));hint('htask');return q;}
// another place of the riders (a hall, a hold or a steading) 150 to 1500 blocks off
function riderOtherSite(s){const P=s.prov,C=P.cult,ci=Math.floor(s.X/LS),cj=Math.floor(s.Z/LS),seen=new Set(),out=[];
  for(let a=-5;a<=5;a++)for(let b=-5;b<=5;b++){const c=stretchCell(landSite(ci+a,cj+b)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);if(realmHeld(c)!==C)continue;
    for(const t of provinceOf(c.i,c.j).sites)if(t!==s&&(t.k==='city'||t.k==='fort'||t.k==='village')){const d=Math.hypot(t.X-s.X,t.Z-s.Z);if(d>150&&d<1500)out.push([d,t]);}}
  out.sort((a,b)=>a[0]-b[0]);return out.length?out[Math.floor(Math.random()*Math.min(4,out.length))][1]:null;}
function riderTaskReady(q){if(q.k==='supply'||q.k==='hunt')return !SURV()||countOf(q.it)>=q.need;if(q.k==='bounty')return q.c<=0;return false;}
function riderTaskDone(){const q=RH.q;if(!q)return '';if(q.k==='supply'||q.k==='hunt'){if(SURV())takeItems(q.it,q.need);}return riderReward(q);}
function riderReward(q){RH.q=null;RH.qn=(RH.qn||0)+1;saveDirty=true;giveCoin(q.rw);const extra=Math.random()<0.35?[446,449,447][Math.floor(Math.random()*3)]:0;if(extra&&SURV())addItem(extra,1);drawBar(true);
  riderGain(q.crown||q.boast?14:8,null);const msg=(q.boast?'Your boast is made good: ':'Task done: ')+q.n.replace(/^./,c=>c.toUpperCase())+'. You are paid '+coinWord(q.rw)+(extra?' and given '+nameOf(extra):'')+'.';toast(msg);tone(587,880,0.35,0.05);return msg;}
function riderFail(why){const q=RH.q;RH.q=null;saveDirty=true;toast(why);if(q&&q.boast)riderGain(-4,'An empty boast');}
// once a second: tasks that end where the player goes
let riderStray=null,riderMk=0;
function riderTaskTick(){const q=RH.q;if(!q)return;const X=PL.x+OX,Z=PL.z+OZ;
  if(q.k==='arrow'){if(RH.pt-q.t0>q.lim){riderFail('Too late: the war-arrow did not come to '+q.tn+' in time');if(SURV()&&countOf(460))takeItems(460,1);drawBar(true);return;}
    if(Math.hypot(q.X-X,q.Z-Z)<30){if(SURV()&&countOf(460)<1){riderFail('You have lost the war-arrow');return;}if(SURV())takeItems(460,1);toast('You put the war-arrow into the hands of the marshal of '+q.tn+'. The riders there make ready.');riderReward(q);}}
  else if(q.k==='relic'){if(!q.got&&Math.hypot(q.X-X,q.Z-Z)<10){q.got=1;if(SURV())addItem(q.it,1);drawBar(true);saveDirty=true;toast('Among the old stones you find the '+nameOf(q.it)+'. Bring it to '+q.fn);}
    else if(q.got&&Math.hypot(q.fx-X,q.fz-Z)<45){if(SURV()&&countOf(q.it)<1)return;if(SURV())takeItems(q.it,1);riderReward(q);}}
  else if(q.k==='stray'){const L=riderStray&&!riderStray.dead&&animals.includes(riderStray)?riderStray:null;
    if(!L&&Math.hypot(q.X-X,q.Z-Z)<70){const x=(q.found?PL.x+2:q.X-OX+0.5),z=(q.found?PL.z+2:q.Z-OZ+0.5),bx=Math.floor(x),bz=Math.floor(z);
      if(bx>2&&bz>2&&bx<W-3&&bz<D-3&&genDone[(bx>>4)+(bz>>4)*NCX]){const y=standY(x,ground[bx+W*bz]+2,z);if(y>0){riderStray=addAnimal('horse',x,y,z,{stray:1,st:'idle',t:9});riderStray.nm=q.who;}}}
    else if(L&&!q.found&&Math.hypot(L.x-PL.x,L.z-PL.z)<5){q.found=1;saveDirty=true;L.tame=true;L.st='follow';L.t=1;toast(q.who+' knows the riders\' halter. It follows you.');}
    if(L&&q.found){if(L.st!=='follow'&&Math.hypot(L.x-PL.x,L.z-PL.z)>4){L.st='follow';L.t=1;}if(Math.hypot(L.x+OX-q.fx,L.z+OZ-q.fz)<40){removeAnimal(L);riderStray=null;toast(q.who+' trots home to the paddock');riderReward(q);}}}}
function riderMarks(dt){const q=RH.q;if(!q||(riderMk-=dt)>0)return;riderMk=0.4;let X,Z;if((q.k==='relic'&&!q.got)||q.k==='arrow'||(q.k==='stray'&&!q.found)){X=q.X;Z=q.Z;}else if(q.k==='relic'||q.k==='stray'){X=q.fx;Z=q.fz;}else return;
  const x=X-OX,z=Z-OZ,bx=Math.floor(x),bz=Math.floor(z);if(Math.hypot(x-PL.x,z-PL.z)>240||bx<0||bz<0||bx>=W||bz>=D)return;const y=ground[bx+W*bz]+1;
  for(let k=0;k<6;k++)spawnP(x+(Math.random()-.5)*0.6,y+Math.random()*16,z+(Math.random()-.5)*0.6,0,1.5,0,[0.6,1,0.5],1.2,-0.4);}
// ---- the songs of the kings: eight for each kingdom, sung by the lay-singers in the halls and the wardens of the mounds
const RIDER_SONG_N=8;
function riderKings(key){const r=rngAt(hsh(key.length,9923,0)*1e6|0,9925,[...key].reduce((a,c)=>a*31+c.charCodeAt(0)|0,0)&0xffff),k=[];for(let i=0;i<9;i++)k.push(nameWord('rider',r));return k;}
function riderSongs(key,name){const k=riderKings(key),realm=name.replace(/^The /,'the ');return [
  ['The Coming out of the North',k[0]+' led the riders down out of the cold north with their herds, a hundred winters ago and more, and the grass of the plains was the sea they had dreamed of. Where his horse first drank, the first hall stood.'],
  ['The White Horse on the Hill','On the hills they found the horses of their forefathers, cut white into the chalk, and '+k[1]+' said: here our fathers rode before us. The white horse running became the sign of '+realm+'.'],
  ['The Golden Hall',k[2]+' raised the golden hall on the hill, its posts carved with every horse he had loved, its roof gilded, so that a rider on the plain could see it shining from a day away.'],
  ['The Windsteed','A great horse ran with the wild herds, silver as spray, and no one could come near it. '+k[3]+' walked after it for a summer, and at the end of the summer it let him lay a hand on its neck. The windsteeds carry only those who are sworn.'],
  ['The Long Ride','When the white realm was hard pressed, '+k[4]+' rode with every horse in the land, three days and three nights across the plains, and came to the field at dawn. The songs of the white realm remember it too.'],
  ['The Mounds of the Kings',k[5]+' was laid in the first of the great mounds, his horse beside him, and the barrowbloom came up white on it the next spring. It has bloomed on the mounds of the kings ever since.'],
  ['The War of the Ash','In the days of '+k[6]+' the fire came west out of the wastes, and the riders rode with the elves and the dwarves to the Ashen Gate. Many horses came back without their riders. The war is not over.'],
  ['The Grass Grows Long',k[7]+' keeps the high seat now. The herds are fewer than they were, and the halls of the forefathers are ash on the hills. But the grass grows long, and the riders still ride.']];}
function riderSong(s,told){if(!s){showText('A song','The singer has no song tonight.');return;}const K=s.prov.kingdom,T=riderSongs(K.key,K.name),heard=RH.sg.filter(x=>x.startsWith(K.key+':')).map(x=>+x.split(':')[1]);
  let k=0;while(k<RIDER_SONG_N&&heard.includes(k))k++;const fresh=k<RIDER_SONG_N;if(!fresh)k=Math.floor(Math.random()*RIDER_SONG_N);
  showText('A song of '+K.name.replace(/^The /,'the ')+' ('+(k+1)+' of '+RIDER_SONG_N+'): '+T[k][0],T[k][1]+(fresh?'\n\nThe song is written into your journal.':''));
  if(fresh){RH.sg.push(K.key+':'+k);RH.sgn[K.key]=K.name;saveDirty=true;riderGain(1,null);}[392,440,494,440,392,330,392].forEach((fq,i)=>tone(fq,fq*1.005,0.5,0.03,i*0.45,'triangle'));}
function riderJournal(out){const keys=Object.keys(RH.sgn);out.push('','THE SONGS OF THE RIDERS');
  if(!keys.length)out.push('No songs of the riders heard yet. Their lay-singers sing them in the golden halls, and the wardens of the mounds.');
  for(const key of keys){const n=RH.sgn[key],T=riderSongs(key,n),got=RH.sg.filter(x=>x.startsWith(key+':')).map(x=>+x.split(':')[1]);
    out.push('','The Songs of '+n.replace(/^The /,'')+' ('+got.length+' of '+RIDER_SONG_N+')');for(let k=0;k<RIDER_SONG_N;k++)out.push(got.includes(k)?(k+1)+'. '+T[k][0]+'. '+T[k][1]:(k+1)+'. (not yet heard)');}
  out.push('','YOUR STANDING WITH THE RIDERS',RH_RANK[riderRank()]+' ('+RH.r+')'+(RH.th?'. Thane of '+RH.th:'')+(RH.rw?'. Races won: '+RH.rw:'')+(RH.sp?'. Bouts won at sparring: '+RH.sp:''));}
// ---- a horse stone beside the riders' road: the road, and how far to the places at either end
function useHorseStone(x,y,z){const X=x+OX,Z=z+OZ;let rr=null;for(let d=0;d<=4&&!rr;d++)for(const [a,b] of [[d,0],[-d,0],[0,d],[0,-d]]){rr=realmRoadAt(X+a,Z+b,1);if(rr)break;}
  if(!rr){showText('A horse stone','A horse is cut in the stone, running. The rest is worn away.');return true;}const P=rr.rd.P,ends=[rr.rd.a,rr.rd.b].map(e=>{let best=null,bd=1e9;for(const s of P.sites){const d=Math.hypot(s.X-e[0],s.Z-e[1])-s.R;if(d<bd){bd=d;best=s;}}return best;}).filter(Boolean);
  showText('A horse stone of '+P.kingdom.name.replace(/^The /,'the '),'Under the running horse: "'+realmRoadName(rr.rd)+', '+P.name+'." Below, cut deep, '+ends.map(s=>s.name+', '+Math.round(Math.hypot(s.X-X,s.Z-Z)/10)*10+' paces '+dirWord(s.X-X,s.Z-Z)).join('; ')+'.');tone(392,440,0.2,0.05);return true;}
// a picture stone: what is carved on it
function usePicStone(x,y,z){const o=fathersNear(x+OX,z+OZ,3);showText(o&&o.name||'A picture stone','Carved in panels down the stone: a sun over the sea; a ship with a great square sail and her oars out; riders with spears, their horses running; and at the foot a horse with no rider. Traces of red and white paint are left in the cuts.');tone(330,392,0.3,0.05);return true;}
// a bee skep: honey once a day (from a steading's or a farm's; the bees mind)
let skepDay={};
function useSkep(x,y,z){const k=(x+OX)+','+y+','+(z+OZ);if(skepDay[k]===dayN){toast('The bees are busy; there is no more honey to take today');return true;}skepDay[k]=dayN;
  if(SURV()){addItem(447,1);drawBar(true);if(Math.random()<0.25)hurt(1,'stung');}for(let i=0;i<8;i++)spawnP(x+0.5,y+0.8,z+0.5,(Math.random()-.5)*2,Math.random(),(Math.random()-.5)*2,[0.9,0.75,0.2],0.15,0);
  burst(0.6,'bandpass',220,8,0.1);toast('Honey from the skep');return true;}
// ---- the war-horn of the riders: a sworn rider blows it and a riding comes (eight horsemen and a marshal, in their lands; the
// riders' folk near by elsewhere) and rides with the player for two minutes; once in five minutes
function riderHorn(){if(riderRank()<4){toast('The war-horn of the riders answers only a sworn rider\'s breath');return true;}if(RH.pt-RH.hn<300){toast('The horn\'s call is still in the hills; wait a while before you blow it again');return true;}
  RH.hn=RH.pt;saveDirty=true;tone(147,196,1.2,0.09);tone(196,247,1.6,0.08,0.9);let n=0;
  for(const f of foes){if(f.dead||!FOES[f.kind].folk||FOES[f.kind].civ||!riderPeopleOf(f)||folkWrath(f)||f.war||f.host||f.race||Math.hypot(f.x-PL.x,f.z-PL.z)>80)continue;f.aid=MN.pt+120;f.hx=PL.x;f.hz=PL.z;f.st='return';f.t=6;n++;}
  const P=realmOfColumn(Math.floor(PL.x+OX),Math.floor(PL.z+OZ));
  if(n<4&&P&&P.cult.k==='horse')for(let k=0;k<12&&n<9;k++){const a=PL.yaw+3.14+(k-6)*0.25,d=26,x=PL.x+Math.sin(a)*d,z=PL.z+Math.cos(a)*d,bx=Math.floor(x),bz=Math.floor(z);
    if(bx<3||bz<3||bx>=W-3||bz>=D-3||!genDone[(bx>>4)+(bz>>4)*NCX])continue;const f=addFoe(n===0?'hcapt':'hrider',x,ground[bx+W*bz]+1,z,{prov:P.key,site:P.sites[0],st:'return',t:6,riding:1});if(f){f.aid=MN.pt+120;f.hx=PL.x;f.hz=PL.z;n++;}}
  toast(n?'You blow the war-horn of the riders. A riding comes over the grass to your side.':'You blow the war-horn of the riders, but no rider is near enough to hear.');return true;}
// ---- coming into a province of the riders: its name, and the riders of its border come to see who rides there (rider-life.js)
let riderProv='',riderBorderSeen=0; // (the first look only notes where the player is: no riders come to one already within)
function riderBorder(){const P=realmOfColumn(Math.floor(PL.x+OX),Math.floor(PL.z+OZ)),key=P&&P.cult.k==='horse'?P.key:'';if(key===riderProv&&riderBorderSeen)return;const was=riderProv,first=!riderBorderSeen;riderProv=key;riderBorderSeen=1;if(!key||!was&&!ready)return;showName(P.name+', '+P.kingdom.name);if(!first)riderBorderRiders(P);}
// ---- each frame (from foes.js): the clock, the marks, the life; each second the border, the tasks, the forefathers' ruins found
let riderT=0;
function riderFrame(dt){if(!ready)return;RH.pt+=dt;riderMarks(dt);riderLife(dt);if((riderT-=dt)>0)return;riderT=1;
  riderBorder();riderTaskTick();
  const o=fathersNear(Math.floor(PL.x+OX),Math.floor(PL.z+OZ),-2);if(o&&o.name&&discover('g',o.name))riderGain(2,null);}
function riderPlaceFound(rp){if(rp.s.prov.cult.k==='horse')riderGain(2,null);}
// ---- the riders' new folk (models: rider-court-models.js) and where they stand
Object.assign(FOES,{
  hking:{n:'King of the Riders',m:'hking',hp:44,dmg:4,reach:2,walk:1.05,run:4.4,sight:20,cd:1.2,wind:0.4,mass:0.6,folk:1,civ:1,drops:[[224,2,4,0.6]],cause:'rider'},
  hqueen:{n:'Queen of the Riders',m:'hqueen',hp:40,dmg:2,reach:1.8,walk:1.05,run:4.4,sight:20,cd:1.2,wind:0.4,mass:0.65,folk:1,civ:1,fem:1,drops:[[224,2,4,0.6]],cause:'rider'},
  hdoor:{n:'Doorwarden of the Hall',m:'hdoor',hp:36,dmg:6,reach:2.8,walk:1.3,run:4.6,sight:24,cd:1.2,wind:0.45,block:0.5,mass:0.45,folk:1,say:'hdoor',drops:[[223,1,2,0.4],[206,1,2,0.5]],cause:'rider'},
  hcouns:{n:'Counsellor of the King',m:'hcouns',hp:14,dmg:1,reach:1.6,walk:1,run:4,sight:16,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,drops:[[204,1,2,0.5]],cause:'rider'},
  hmaid:{n:'Shieldmaiden of the Riders',m:'hmaid',hp:26,dmg:5,reach:2.8,walk:1.35,run:4.8,sight:26,cd:1.1,wind:0.4,block:0.5,mass:0.55,folk:1,fem:1,say:'hmaid',drops:[[223,1,1,0.3],[206,1,2,0.5]],cause:'rider'},
  hscop:{n:'Lay-singer',m:'hscop',hp:10,dmg:1,reach:1.6,walk:1.1,run:4.4,sight:16,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,drops:[[203,2,6,0.5]],cause:'rider'},
  hleech:{n:'Horse-healer',m:'hleech',hp:12,dmg:1,reach:1.6,walk:1.1,run:4.4,sight:16,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,fem:1,heal:1,drops:[[447,1,1,0.4]],cause:'rider'},
  hdealer:{n:'Horse-dealer',m:'hdealer',hp:14,dmg:1,reach:1.6,walk:1.15,run:4.5,sight:16,cd:1.2,wind:0.4,mass:0.65,folk:1,civ:1,drops:[[203,2,6,0.5]],cause:'rider'},
  hchild:{n:'Child of the Riders',m:'hchild',hp:6,dmg:0,reach:1,walk:1.3,run:5,sight:14,cd:1.5,wind:0.4,mass:0.9,folk:1,civ:1,tall:1.2,say:'hchild',drops:[],cause:'rider'},
  hgirl:{n:'Child of the Riders',m:'hgirl',hp:6,dmg:0,reach:1,walk:1.3,run:5,sight:14,cd:1.5,wind:0.4,mass:0.9,folk:1,civ:1,fem:1,tall:1.2,say:'hchild',drops:[],cause:'rider'},
  hwarden:{n:'Warden of the Mounds',m:'hwarden',hp:14,dmg:1,reach:1.6,walk:1,run:4,sight:16,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,drops:[[446,1,1,0.4]],cause:'rider'},
  hracer:{n:'Rider of the Race',m:'hracer',hp:30,dmg:3,reach:2.4,walk:1.7,run:8,sight:30,cd:1.3,wind:0.4,mass:0.25,tall:3,mount:1,folk:1,civ:1,say:'hracer',drops:[[206,1,2,0.5]],cause:'horse'}});
Object.assign(FOE_HOME,{h_seat:[['hdoor',1]],h_hdoor:[['hdoor',2]],h_hcourt:[['hthane',1],['hmaid',1],['hwoman',1]],h_scop:[['hman',1]],h_leech:[['hherd',1]],
  h_cstand:[['hman',2],['hwoman',2],['hchild',1],['hgirl',1]],h_cjudge:[['hman',1]],h_cpav:[['hherd',1],['hman',1]],h_bwarden:[['hman',1]],h_bmourn:[['hwoman',1],['hman',0.6]],h_fair:[['hman',1],['hherd',1]]});
FOE_HOME.h_street.push(['hchild',0.7],['hgirl',0.5]);FOE_HOME.h_green.push(['hchild',1],['hgirl',0.8]);FOE_HOME.h_drill.push(['hmaid',1]);FOE_HOME.h_barracks.push(['hmaid',0.8]);FOE_HOME.h_gatein.push(['hmaid',0.5]);
Object.assign(FOLK_N,{seat:[2,2],hdoor:[2,2],hcourt:[3,4],scop:[1,1],leech:[1,1],cstand:[3,5],cjudge:[1,2],cpav:[2,2],bwarden:[1,1],bmourn:[1,2]});
Object.assign(FOLK_LEAD,{h_hcourt:'hcouns',h_scop:'hscop',h_leech:'hleech',h_cjudge:'hthane',h_bwarden:'hwarden',h_fair:'hdealer'});
Object.assign(FOLK_SAY,{hking:['Be welcome in {p}, traveller. Sit by the fire.','My fathers came out of the north with nothing but their horses.','The east is burning. When the war-arrow comes, we ride.'],
  hqueen:['Drink, and be welcome in {p}.','The cup goes round the hall, and every rider drinks from it.','{k} is the grass and the horses. The rest is only wood and gold.'],
  hdoor:['Lay aside your blade at the door. It will be here when you come out.','No blade is drawn in the golden hall.','Go in, and keep the peace of the hall.'],
  hcouns:['The king hears all who come with respect.','Words are weighed in this hall more carefully than gold.','I have counselled two kings of {k}. They both listened, mostly.'],
  hmaid:['I ride with the riders of {p}. Do not look so surprised.','Will you spar with me? I promise to be gentle.','My shield has turned an orc\'s axe. It will turn yours.'],
  hscop:['Shall I sing of the Long Ride? Or of the windsteed?','A song for a cup of mead, wayfarer.','Every horse in the songs was real once.'],
  hleech:['Bring me your horse, and I will look it over.','A lame horse is a lost rider.','Steady now. Let me see that hoof.'],
  hdealer:['Every horse here was foaled on the grass. Choose well.','A grey for speed, a black for strength, a dun for the long road.','You will not find a better horse this side of the mountains.'],
  hchild:['Are you a rider? Where is your horse?','I am a king of the riders and this is my horse!','My father rides with the marshal!'],
  hwarden:['Walk softly. The kings sleep under the grass.','The barrowbloom came up white again this spring.','Every king of {k} lies here, but the last.'],
  hracer:['I will win the race this time. You will see.','The grey is quick, but my mare has heart.','The course is long. Keep something for the last bend.']});
// ---- the windsteed and the steppe cattle
Object.assign(ANIMALS,{
  windsteed:{n:'Windsteed',hp:22,walk:1.6,run:9,shy:9,stride:2.5,amp:0.6,turn:3.4,graze:1,sleeps:0,drops:[],g:[],herd:[1,1],w:0,youngP:0,calls:[30,80],mount:true,gallop:16,steed:1,ride:'Riding the windsteed. Sprint to gallop; no horse runs faster.'},
  kine:{n:'Steppe Cattle',hp:14,walk:0.9,run:4,shy:4,stride:1.6,amp:0.5,turn:2.4,graze:1,sleeps:1,drops:[[352,2],[354,3]],g:[],herd:[3,6],w:0,youngP:0.3,calls:[20,50]}});
