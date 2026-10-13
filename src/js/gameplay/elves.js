// ---- The elves (D-088): the player's standing with each people of the elves, and what they share with a friend.
//
// Standing: the high elves (of the elder realms, e) and the wood elves (of the forest kingdoms, w) each keep a count of the
// player's deeds (EF.e, EF.w, saved as ef), and call the player by it: Stranger, Guest, Friend, Trusted, and at the last Star-kin
// or Leaf-kin (ELF_AT). It rises with tasks done for them, with trade, with their places and the ruins of their elder days
// found, with tales read at their lecterns, with creatures of the wastes slain near them and festivals kept with them
// (elf-life.js); it falls when one of them is struck, and much further when one is slain. Each new rank brings a gift from that
// people (ELF_GIFTS); at Friend they give the player a name in their tongue, and from Trusted they bow in greeting.
// Talking (use one of their folk): a greeting in their tongue, with its meaning; then what that one can do: merchants trade
// (coin comes back to the world with them: copper, gold and platinum; prices by standing), healers heal, loremasters tell
// the tales of their realm and give tasks, lords and captains give tasks, the king, queen or lord on the throne grants an
// audience. Tasks (EF.q): a relic to bring from a ruin of the elder days, elven plants to gather, a letter to carry to another of
// their places, creatures of the wastes to slay, a lost one to bring home, venison for the wood elves' feast; sparks rise over
// where a task leads. Wardens meet the player who comes into one of their realms. Moonwells heal once a night; a leaf-stone tells
// the way; the lecterns in their halls keep the histories of each realm (EF.tl, the journal's Elder Days).
const ELF_AT=[0,10,30,70,140];
const ELF_P={e:{k:'elf',n:'the high elves',ranks:['Stranger','Guest of the Elder Realms','Friend of the Elder Realms','Trusted of the Elder Realms','Star-kin'],names:'elder',realm:'the Elder Realms'},
  w:{k:'wood',n:'the wood elves',ranks:['Stranger','Guest of the Woods','Friend of the Woods','Trusted of the Woods','Leaf-kin'],names:'woodelf',realm:'the Forest Kingdoms'}};
// what each rank is given: [[item, count]...]
const ELF_GIFTS={e:[null,[[417,4],[418,2]],[[421,1],[420,2]],[[423,1],[422,1],[429,1]],[[407,1],[MOONSTONE,6],[STARLAMP,3],[427,1]]],
  w:[null,[[417,4],[419,3]],[[407,1],[409,32]],[[424,1],[429,1],[420,2]],[[422,1],[402,1],[WLAMP,6]]]};
let EF=saved&&saved.ef&&typeof saved.ef==='object'?saved.ef:null;
if(!EF)EF={e:0,w:0,ne:'',nw:'',ge:0,gw:0,q:null,qn:0,tl:[],fe:0,dr:-1,hl:-1e9,au:{},pt:0,sl:0};
const elfSave=()=>({ef:EF}),elfMet=new Set();
// the people a folk belongs to (by its place's realm, or its kind), or null
const ELF_KINDS={e:new Set(['espear','esword','ebow','ecapt','eknight','elord','elady','elore','esmith','eheal','eking','equeen','eherald','emerch','emariner']),w:new Set(['wbow','wknife','wguard','wcapt','wking','wlord','wlady','wfolk','wmerch'])};
function elfPeopleOf(f){const C=f&&f.site&&f.site.prov&&f.site.prov.cult;if(C&&C.k==='elf')return 'e';if(C&&C.k==='wood')return 'w';if(!f)return null;return ELF_KINDS.e.has(f.kind)?'e':ELF_KINDS.w.has(f.kind)?'w':null;}
const elfRank=p=>{let r=0;while(r+1<ELF_AT.length&&EF[p]>=ELF_AT[r+1])r++;return r;};
const elfRankName=p=>ELF_P[p].ranks[elfRank(p)];
const elfName=p=>EF[p==='e'?'ne':'nw']||'';
function elfGain(p,n,why){if(!p||!n)return;const r0=elfRank(p);EF[p]=Math.max(-60,Math.min(400,EF[p]+n));saveDirty=true;const r1=elfRank(p);
  if(why)toast(why+' ('+(n>0?'+':'')+n+' with '+ELF_P[p].n+')');
  if(r1>r0)setTimeout(()=>elfRankUp(p,r1),why?1600:0);}
function elfRankUp(p,r){toast(ELF_P[p].n[0].toUpperCase()+ELF_P[p].n.slice(1)+' now call you '+ELF_P[p].ranks[r]);if(r>=2&&!elfName(p))elfNaming(p);
  const gk=p==='e'?'ge':'gw';if(EF[gk]>=r)return;EF[gk]=r;const L=ELF_GIFTS[p][r];if(!L)return;const got=[];if(SURV())for(const [id,c] of L){const left=addItem(id,c);if(left)toast('No room for '+nameOf(id));got.push((c>1?c+' ':'')+nameOf(id));}
  if(got.length)setTimeout(()=>toast('In token of it '+ELF_P[p].n+' give you '+got.join(', ')),2400);drawBar(true);saveDirty=true;}
// the name they give a friend: a word of their tongue (the same in every world of this seed) and what it means
const ELF_EPI={e:['Starwalker','the Far-come','Friend of the Lamps','the Wayfarer','Light-bearer'],w:['Leaf-walker','the Quiet Foot','Friend of the Boughs','Bright-eye','the Wanderer']};
function elfNaming(p){const r=rngAt(SEED&0xffff,p==='e'?9811:9813,(SEED>>16)&0xffff),w=nameWord(ELF_P[p].names,r),ep=ELF_EPI[p][Math.floor(r()*ELF_EPI[p].length)];
  EF[p==='e'?'ne':'nw']=w+' '+ep;saveDirty=true;setTimeout(()=>showText('A name among '+ELF_P[p].n,'The elves gather about you, and the eldest of them speaks. "Among us you will be '+w+', '+ep+'. It is not given lightly, and it will not be forgotten while '+(p==='e'?'the stars turn':'the woods stand')+'."'),3200);}
// ---- their tongue: greetings and sayings, each with its meaning (its words checked against the blocklist, 15-names)
const ELF_TONGUE=[['Saelith ynnor','Well met beneath the stars'],['Tavael oressa, quilar','Walk in light, traveller'],['Liathe nysse sorae','The road is long, but the night is kind'],
  ['Faerel auvrin vael','Rest here; the watch is kept'],['Ynnor saeth, vaelis','The stars keep you, friend'],['Orrin tavael quessa','Go in peace, and come again'],['Sylvar ithae','The leaves remember'],
  ['Shaen tavrel, ynnor sael','Go softly; the trees will know you'],['Quessa naeth oryn','Our hall is open to you'],['Vaelis, auvrin tae','Friend, sit with us']];
const elfSay=k=>{const t=ELF_TONGUE[k%ELF_TONGUE.length];return '"'+t[0]+'" ('+t[1]+')';};
// a greeting from one of their folk, by the player's standing; a bow from Trusted on
function elfGreet(f,F){const p=elfPeopleOf(f),r=elfRank(p),nm=elfName(p),k=Math.floor(Math.random()*ELF_TONGUE.length),who=(f.nm||F.n)+': ';
  if(r>=3){f.bow=foeClock+2;return who+elfSay(k).replace(/\)$/,', '+(nm.split(' ')[0])+')');}
  if(r>=1&&Math.random()<0.6)return who+elfSay(k)+(nm?' Welcome back, '+nm.split(' ')[0]+'.':'');
  return null;} // a stranger hears the old greetings (FOLK_SAY)
// ---- struck and slain
function elfStruck(f){const p=elfPeopleOf(f);if(p)elfGain(p,-6,'You struck one of '+ELF_P[p].n);}
function elfSlain(f){const F=FOES[f.kind],p=elfPeopleOf(f);if(F.folk){if(p)elfGain(p,-20,'You slew one of '+ELF_P[p].n);return;}
  if(EF.q&&EF.q.k==='slay'){EF.q.c=Math.max(0,EF.q.c-1);if(!EF.q.c)toast('Enough of the wastes\' creatures are slain; tell the elves of it');}
  let near=null;foeNear(f.x,f.z,30,g=>{if(!near&&!g.dead&&FOES[g.kind].folk)near=elfPeopleOf(g);},0);if(near){EF.sl++;if(EF.sl%3===0)elfGain(near,1,null);}}
// ---- the coin of the world (Q7: it comes back with the folk who trade): copper, gold (ten) and platinum (a hundred)
const COIN=[[205,100],[204,10],[203,1]];
const purse=()=>COIN.reduce((a,[id,v])=>a+countOf(id)*v,0);
function payCoin(v){if(!SURV())return true;const have=purse();if(have<v)return false;for(const [id] of COIN)takeItems(id,countOf(id));giveCoin(have-v);return true;}
function giveCoin(v){if(!SURV())return;for(const [id,c] of COIN){const n=Math.floor(v/c);if(n){const left=addItem(id,n);if(left)toast('No room for '+nameOf(id));v-=n*c;}}drawBar(true);}
const coinWord=v=>{const p=[];for(const [id,c] of COIN){const n=Math.floor(v/c);if(n){p.push(n+' '+['platinum','gold','copper'][COIN.findIndex(q=>q[0]===id)]);v-=n*c;}}return p.length?p.join(', '):'nothing';};
// what their merchants sell ([item, price in copper, the least standing]) and buy ([item, price])
const ELF_GOODS={e:[[417,6],[418,8],[419,5],[420,15],[409,1],[STARBLOOM,2],[SILVFERN,2],[DAWNLILY,2],[MOONSTONE,4],[STARLAMP,12],[EVLAMP,8],[421,60,1],[407,80,2],[423,140,2],[422,180,3],[430,40,2]],
  w:[[417,6],[418,7],[419,4],[420,15],[409,1],[SILVFERN,2],[STARBLOOM,2],[WLAMP,6],[407,70,1],[402,90,2],[424,150,2],[421,70,3],[430,40,2]]};
const ELF_BUYS=[[352,3],[362,6],[350,3],[202,1],[207,2],[332,1],[WOOLW,2],[223,4],[224,12],[228,30],[230,40],[415,25],[386,20],[425,60],[426,50],[427,90],[STARBLOOM,1],[DAWNLILY,1]];
const ELF_BUYK=[1.5,1.25,1,0.85,0.7],ELF_SELLK=[0.6,0.75,0.9,1,1.1];
const elfPrice=(p,c)=>Math.max(1,Math.round(c*ELF_BUYK[elfRank(p)])),elfOffer=(p,c)=>Math.max(1,Math.round(c*ELF_SELLK[elfRank(p)]));
function elfBuy(p,id,c,n){const v=elfPrice(p,c)*n;if(!payCoin(v))return 'You have not the coin ('+coinWord(v)+')';const left=SURV()?addItem(id,n):0;if(left)toast('No room for '+nameOf(id));if(!SURV())addItem(id,n);
  drawBar(true);saveDirty=true;if(v>=20)elfGain(p,1,null);return 'You buy '+(n>1?n+' ':'')+nameOf(id)+' for '+coinWord(v);}
function elfSell(p,id,c,n){if(SURV()){if(countOf(id)<n)return 'You have no '+nameOf(id);takeItems(id,n);}const v=elfOffer(p,c)*n;giveCoin(v);saveDirty=true;if(v>=20)elfGain(p,1,null);return 'You sell '+(n>1?n+' ':'')+nameOf(id)+' for '+coinWord(v);}
// ---- the panel: who speaks, what they say, and buttons for what they will do
function elfPanel(title,render){invOpen=true;hold=-1;['invgrid','invname','sinv','bplist','invsearch'].forEach(id=>{$(id).style.display='none';});$('lore').style.display='block';$('invtitle').textContent=title;
  const draw=msg=>{const el=$('lore');el.innerHTML='';if(msg){const m=document.createElement('div');m.textContent=msg;m.style.marginBottom='8px';m.style.fontStyle='italic';el.appendChild(m);}
    const text=t=>{const d=document.createElement('div');d.textContent=t;d.style.marginBottom='6px';el.appendChild(d);return d;};
    const row=()=>{const r=document.createElement('div');r.className='wcrow';el.appendChild(r);return r;};
    const btn=(r,label,fn)=>{const b=document.createElement('button');b.className='wide';b.style.marginTop='0';b.textContent=label;b.addEventListener('click',()=>{const m2=fn();if(m2!==false)draw(typeof m2==='string'?m2:'');});r.appendChild(b);return b;};
    render({text:text,row:row,btn:btn,redraw:draw});};
  draw('');$('inv').style.display='grid';if(document.pointerLockElement)document.exitPointerLock();if(TOUCH)playing=false;}
const ELF_TRADE=new Set(['emerch','wmerch']),ELF_TASK=new Set(['elore','elord','ecapt','wcapt','wlord','eherald','emariner']),ELF_COURT=new Set(['eking','equeen','wking']);
// using one of their folk (from act): true if it was one of them
function elfAct(){const f=foeHit(4.6);if(!f||f.dead||!FOES[f.kind].folk||f.foe||folkWrath(f))return false;const p=elfPeopleOf(f);if(!p||f.war||f.host||f.hst||(f.site&&f.site.k==='wgate'))return false;elfTalk(f,p);return true;}
function elfTalk(f,p){const F=FOES[f.kind],s=f.site,r=elfRank(p),heal=F.heal||(f.spk&&/_heal$/.test(f.spk)),k=Math.floor(Math.random()*ELF_TONGUE.length);
  f.st='idle';f.t=6;f.yaw=f.hd=Math.atan2(PL.x-f.x,PL.z-f.z);if(r>=3)f.bow=foeClock+2;
  elfPanel((f.nm||F.n)+(s?', '+s.name:''),U=>{
    U.text((r>=1?elfSay(k):'"'+(FOLK_SAY[f.kind]||FOLK_SAY[F.say]||FOLK_SAY.guard)[0].replace('{p}',s?s.name:'the realm').replace('{k}',s?s.prov.kingdom.name.replace(/^The /,'the '):'the realm')+'"'));
    U.text('You are '+ELF_P[p].ranks[r]+' among '+ELF_P[p].n+(elfName(p)?', and they call you '+elfName(p):'')+'. Standing '+EF[p]+(r+1<ELF_AT.length?' ('+ELF_AT[r+1]+' for '+ELF_P[p].ranks[r+1]+')':'')+'.');
    if(EF.q){const q=EF.q;U.text('Your task: '+q.n+'.');const b=U.row();if(q.p===p&&elfTaskReady(q))U.btn(b,'Tell them the task is done',()=>elfTaskDone(f));U.btn(b,'Give up your task',()=>{EF.q=null;saveDirty=true;return 'You give up the task. The elves say nothing of it.';});}
    const b=U.row();
    if(ELF_TRADE.has(f.kind))U.btn(b,'Trade',()=>{elfTrade(f,p);return false;});
    if(heal)U.btn(b,'Ask to be healed',()=>elfHeal(p));
    if(f.kind==='elore'||f.kind==='emariner')U.btn(b,'Ask for a tale',()=>{elfTale(s,p,true);return false;});
    if(ELF_COURT.has(f.kind)||(s&&f.spk&&/_(throne|seat)$/.test(f.spk)&&F.civ))U.btn(b,'Ask for an audience',()=>elfAudience(f,p));
    if((ELF_TASK.has(f.kind)||ELF_COURT.has(f.kind))&&!EF.q)U.btn(b,'Ask for a task',()=>{const q=elfTaskGive(f,p);if(q){closeInv();return false;}return 'There is nothing they need of you now.';});
    if(f.spk&&/_stable$/.test(f.spk))U.btn(b,'Ask for a steed',()=>elfSteedAsk(f,p));
    if(f.spk&&/_(range|drill)$/.test(f.spk)&&!F.civ)U.btn(b,'Enter the archery contest',()=>elfContest(f,p));
    U.btn(b,'Farewell',()=>{closeInv();return false;});});
  foeCall(f,'idle');tone(640,820,0.18,0.05);hint('elves');}
// the market: their goods, and what they will buy of the player's
function elfTrade(f,p){elfPanel('The market of '+(f.site?f.site.name:ELF_P[p].realm),U=>{
  U.text('Your purse: '+coinWord(purse())+(SURV()?'':' (in creative the elves give freely)')+'. Prices for '+ELF_P[p].ranks[elfRank(p)]+(elfRank(p)<2?': they are better for a friend.':'.'));
  U.text('They sell:');for(const [id,c,need] of ELF_GOODS[p]){const r=U.row();if((need||0)>elfRank(p)){U.text('  '+nameOf(id)+': for '+ELF_P[p].ranks[need]+' and above');continue;}
    U.btn(r,nameOf(id)+' ('+coinWord(elfPrice(p,c))+')',()=>elfBuy(p,id,c,1));if(stackMax(id)>1)U.btn(r,'Four',()=>elfBuy(p,id,c,4));}
  const mine=ELF_BUYS.filter(([id])=>!SURV()||countOf(id)>0);U.text(mine.length?'They will buy:':'They would buy hides and leather, ingots, gems, drake scales, relics of the elder days and the like; you have none of these.');
  for(const [id,c] of mine){const r=U.row();U.btn(r,'Sell '+nameOf(id)+' ('+coinWord(elfOffer(p,c))+(SURV()?', you have '+countOf(id):'')+')',()=>elfSell(p,id,c,1));}
  U.btn(U.row(),'Back',()=>{elfTalk(f,p);return false;});});}
// a healer's care: whole again; from Friend a draught to take away, once in a while
function elfHeal(p){if(SURV()){hp=20;drawStats();}let msg='The healer lays cool hands on your wounds, and they close. You are whole again.';
  if(elfRank(p)>=2&&EF.pt-EF.hl>600){EF.hl=EF.pt;if(SURV())addItem(420,2);msg+=' "Take these for the road." (2 Elven Draughts)';drawBar(true);}saveDirty=true;tone(880,1320,0.4,0.05);return msg;}
// ---- the moonwells: a drink of their water heals, once a night
function moonwellAt(x,y,z){for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++)if(get(x+dx,y+dy,z+dz)===MOONSTONE&&get(x+dx,y+dy+1,z+dz)===WATER)return true;return false;}
function useMoonwell(x,y,z){if(!moonwellAt(x,y,z))return false;if(EF.dr===dayN){toast('The moonwell\'s water is still; it has given you what it can tonight');return true;}
  EF.dr=dayN;saveDirty=true;if(SURV()){hp=20;food=Math.min(20,food+6);drawStats();}toast('You drink from the moonwell. The water is cold and tastes of starlight; your wounds close and your weariness lifts');
  for(let k=0;k<30;k++)spawnP(PL.x+(Math.random()-.5)*2,PL.y+Math.random()*2,PL.z+(Math.random()-.5)*2,(Math.random()-.5)*0.6,0.8+Math.random(),(Math.random()-.5)*0.6,[0.8,0.9,1],1.4,-0.2);tone(990,1480,0.6,0.05);return true;}
// ---- a leaf-stone: which way its road runs, and how far to the places at either end
function useLeafStone(x,y,z){const X=x+OX,Z=z+OZ;let rr=null;for(let d=0;d<=4&&!rr;d++)for(const [a,b] of [[d,0],[-d,0],[0,d],[0,-d]]){rr=realmRoadAt(X+a,Z+b,1);if(rr)break;}
  if(!rr){showText('A leaf-stone','Its letters are worn too smooth to read.');return true;}
  const P=rr.rd.P,ends=[rr.rd.a,rr.rd.b].map(e=>{let best=null,bd=1e9;for(const s of P.sites){const d=Math.hypot(s.X-e[0],s.Z-e[1])-s.R;if(d<bd){bd=d;best=s;}}return best;}).filter(Boolean);
  const lines=ends.map(s=>s.name+', '+Math.round(Math.hypot(s.X-X,s.Z-Z)/10)*10+' paces to the '+dirWord(s.X-X,s.Z-Z));
  showText('A leaf-stone of '+P.kingdom.name.replace(/^The /,'the '),'Under the carved leaf, in the letters of the elves: "'+realmRoadName(rr.rd)+'." And beneath, '+lines.join('; ')+'. '+elfSay(Math.floor(X+Z)&7));tone(520,640,0.2,0.05);return true;}
// ---- the histories of a realm, read at the lecterns in their halls and told by their loremasters: eight tales for each kingdom,
// in the same order wherever they are read; the journal keeps those read (the Elder Days)
const ELF_TALE_N=8;
function elfTales(key,name,p){const r=rngAt(hsh(key.length,9821,0)*1e6|0,9823,[...key].reduce((a,c)=>a*31+c.charCodeAt(0)|0,0)&0xffff),nm=()=>nameWord(p==='w'?'woodelf':'elder',r),k1=nm(),k2=nm(),k3=nm(),q1=nm(),st=nm(),rr=nm(),hv=nm();
  const realm=name.replace(/^The /,'the ');
  return p==='w'?[
    ['The Waking of the Wood','Before there were kings, '+realm+' was only the wood, and the wood was full of song. '+k1+', who heard it first, gathered the wanderers under one bough and named it a kingdom.'],
    ['The First Goldbough','The first goldbough was planted by '+q1+' over the grave of a friend. Every great tree of the kingdom is said to be grown from its seed, and every lamp in its boughs lit from its first lamp.'],
    ['The Long Hunt','In the days of '+k2+' the dark things came up out of the old woods, and the wardens hunted them for seven years. The bows of the wood were made then, and the wardens have never put them down.'],
    ['The Halls under the Hill','When the hunt was over, '+k2+' raised a hill over his halls, so that his people would always have a place no fire could reach. The hill still stands, and the king still sits in it.'],
    ['The Feast of '+st,'Once in every year the wood keeps the feast of '+st+', who sang for nine nights without rest. Whoever comes to the glades that night is fed, stranger or friend.'],
    ['The Fire in the East','The fire of the wastes has burned in the east since before '+k3+' was born. The wood elves send their wardens to stand with men and dwarves against it, though they love the trees more than any war.'],
    ['The Stars over the Wood','The wood elves name the stars after the trees: the Silver Bough in the north, '+rr+'\'s Crown overhead in summer, and low in the west the Falling Leaf, which they say is the last star of autumn.'],
    ['The Leaving','Some of the wood\'s people grow weary of the long years and go west to the sea, to the havens of their kin, and are not seen again. The wood is quieter every age; its lamps are fewer. It is not yet empty.']]:[
    ['The Founding','In the elder days '+k1+' led the people of '+realm+' up out of the lowlands into the mountains, and founded the high seat where the light of the stars falls first.'],
    ['The Lamps of '+q1,q1+', the wisest of the loremasters, made the first starglass from the light of a falling star. Every elven lamp since was lit from hers, and none has gone out.'],
    ['The War of the Fire','When the Emberlords first came up out of the deep, the elves of the elder realms met them in the burning lands with the men of the south. '+k2+' fell there, and was carried home on the shields of his guard.'],
    ['The Elder Realms','Once the elves held many lands that are empty now: towers on every height, theatres in the woods, moonwells under the hills. Their ruins still stand, and their names are kept in the halls of '+realm+'.'],
    ['The Moonwells','Where the elves found water that held the light of the moon, they set moonstone under it and built a shrine over it. A drink from a moonwell heals; once in a night, they say, and no more.'],
    ['The Stars of the Elves','The elves name the stars: the Lamp of '+q1+' in the north, which never sets; '+st+'\'s Crown in summer; the Long Road across the sky, which the dead walk; and the Ship, low over the sea in autumn.'],
    ['The Haven of '+hv,'At '+hv+' the white ships were built, with swans at their prows. From there the elves who are weary of the world sail west, and do not come back.'],
    ['The Dwindling','The elves are fewer every age. '+k3+' keeps the high seat now, and the watch on the walls is kept as it always was. But the halls are quieter than they were, and many of the lamps burn in empty rooms.']];}
function elfTale(s,p,told){if(!s){showText('A tale','The elf smiles, and says nothing.');return;}const K=s.prov.kingdom,T=elfTales(K.key,K.name,p),read=EF.tl.filter(x=>x.startsWith(K.key+':')).map(x=>+x.split(':')[1]);
  let k=0;while(k<ELF_TALE_N&&read.includes(k))k++;const fresh=k<ELF_TALE_N;if(!fresh)k=Math.floor(Math.random()*ELF_TALE_N);
  showText((told?'A tale of ':'The histories of ')+K.name.replace(/^The /,'the ')+' ('+(k+1)+' of '+ELF_TALE_N+'): '+T[k][0],T[k][1]+(fresh?'\n\nThe tale is written into your journal.':''));
  if(fresh){EF.tl.push(K.key+':'+k);EF.tln=EF.tln||{};EF.tln[K.key]=[K.name,p];saveDirty=true;elfGain(p,1,null);}tone(500,620,0.25,0.06);}
// a lectern in one of their halls (from openLore): the histories of its realm
function elfLectern(x,y,z){const s=realmSiteAt(x+OX,z+OZ,4),C=s&&s.prov.cult;if(!C||(C.k!=='elf'&&C.k!=='wood'))return false;elfTale(s,C.k==='elf'?'e':'w',false);return true;}
function elfJournal(out){const keys=[...new Set(EF.tl.map(x=>x.split(':')[0]))];out.push('','THE ELDER DAYS');
  if(!keys.length)out.push('No histories of the elves read yet. The lecterns in their halls keep the tales of each realm, and their loremasters tell them.');
  for(const key of keys){const [n,p]=EF.tln&&EF.tln[key]||['A realm of the elves','e'],T=elfTales(key,n,p),got=EF.tl.filter(x=>x.startsWith(key+':')).map(x=>+x.split(':')[1]);
    out.push('','The Histories of '+n.replace(/^The /,'')+' ('+got.length+' of '+ELF_TALE_N+')');for(let k=0;k<ELF_TALE_N;k++)out.push(got.includes(k)?(k+1)+'. '+T[k][0]+'. '+T[k][1]:(k+1)+'. (a tale not yet read)');}
  out.push('','YOUR STANDING WITH THE ELVES');for(const p of ['e','w'])out.push(ELF_P[p].n[0].toUpperCase()+ELF_P[p].n.slice(1)+': '+elfRankName(p)+' ('+EF[p]+')'+(elfName(p)?', called '+elfName(p):''));}
// ---- an audience at the throne: the ruler's welcome by the player's standing, a royal gift once in each kingdom for each rank
// from Guest, the naming from Friend if not yet named, and a task of the crown from Trusted
function elfAudience(f,p){const s=f.site,K=s?s.prov.kingdom:null,r=elfRank(p),F=FOES[f.kind],who=F.n.replace(/ of the .*$/,'');if(!K)return 'They nod to you.';
  if(r<1)return 'The '+who.toLowerCase()+' of '+K.name.replace(/^The /,'the ')+' regards you a long moment. "You are a stranger in my halls. Be welcome, and keep our peace. When the elves know you better, come again."';
  const key=K.key,given=EF.au[key]||0;let msg='The '+who.toLowerCase()+' of '+K.name.replace(/^The /,'the ')+' rises to greet you. "'+(r>=3?'Our trusted friend returns. ':r>=2?'A friend of the elves is always welcome at this throne. ':'Be welcome, guest. ')+'"';
  if(given<r){EF.au[key]=r;saveDirty=true;const g=[[0,0],[417,6],[421,1],[STARLAMP,4],[423,1]][r],gift=r>=4&&p==='w'?[424,1]:g;if(SURV()&&gift[0]){addItem(gift[0],gift[1]);drawBar(true);}if(gift[0])msg+=' A gift from the throne: '+(gift[1]>1?gift[1]+' ':'')+nameOf(gift[0])+'.';elfGain(p,2,null);}
  if(r>=2&&!elfName(p))elfNaming(p);
  if(r>=3&&!EF.q)msg+=' "If you would serve the throne, ask, and I will give you a task of the crown."';return msg;}
// ---- tasks
// what each giver may ask: the loremasters relics and tales' plants, the lords letters and lost ones, the captains the wastes
const ELF_TK={elore:['relic','gather','relic'],emariner:['letter','gather'],elord:['letter','lost','gather'],eherald:['letter'],ecapt:['slay','lost','relic'],wcapt:['slay','hunt','lost'],wlord:['hunt','letter','lost'],eking:['relic','letter','slay'],equeen:['relic','lost','letter'],wking:['hunt','relic','slay']};
const ELF_RELIC=[425,426,427];
function elfTaskGive(f,p,kind){if(EF.q)return null;const s=f.site;if(!s)return null;const ks=ELF_TK[f.kind]||['gather'],K=kind||ks[Math.floor(Math.random()*ks.length)],X0=PL.x+OX,Z0=PL.z+OZ,crown=ELF_COURT.has(f.kind);
  let q={k:K,p:p,from:s.id,fn:s.name,fx:s.X,fz:s.Z,t0:EF.pt,crown:crown?1:0};
  if(K==='relic'){let best=null,bd=1e9;const cx=Math.floor(X0/CS),cz=Math.floor(Z0/CS);for(let a=-45;a<=45;a++)for(let b=-45;b<=45;b++){const e=elderAt(cx+a,cz+b);if(!e)continue;const d=Math.hypot(e.X-X0,e.Z-Z0);if(d>60&&d<bd){bd=d;best=e;}}
    if(!best)return null;const it=ELF_RELIC[Math.floor(Math.random()*3)];Object.assign(q,{X:best.X,Z:best.Z,it:it,got:0,n:'bring the '+nameOf(it)+' from '+best.name+' back to '+s.name,rw:crown?120:50});}
  else if(K==='gather'){const it=[STARBLOOM,SILVFERN,DAWNLILY][Math.floor(Math.random()*3)],n=4+Math.floor(Math.random()*3);Object.assign(q,{it:it,need:n,n:'gather '+n+' '+nameOf(it)+' for '+s.name,rw:20});}
  else if(K==='letter'){const t=elfOtherSite(s,p);if(!t)return null;Object.assign(q,{X:t.X,Z:t.Z,tn:t.name,n:'carry a letter from '+s.name+' to '+t.name,rw:crown?80:30+Math.round(Math.hypot(t.X-s.X,t.Z-s.Z)/40)});if(SURV())addItem(428,1);}
  else if(K==='slay'){const n=5+Math.floor(Math.random()*4);Object.assign(q,{c:n,n:'slay '+n+' creatures of the wastes and tell '+s.name+' of it',rw:crown?120:60});}
  else if(K==='hunt'){Object.assign(q,{it:350,need:4,n:'bring 4 Raw Venison to '+s.name+' for the feast',rw:20});}
  else if(K==='lost'){let pt=null;for(let k=0;k<30&&!pt;k++){const a=Math.random()*6.283,d=120+Math.random()*130,X=Math.round(s.X+Math.cos(a)*d),Z=Math.round(s.Z+Math.sin(a)*d),o=colInfo(X,Z,TEL);if(!o.wet&&!o.river&&!o.lake&&o.h>o.sl+2&&!realmSiteAt(X,Z,10)&&!wasteGateNear(X,Z,40)&&o.wVolc<0.2)pt=[X,Z];}
    if(!pt)return null;const who=nameWord(ELF_P[p].names,Math.random);Object.assign(q,{X:pt[0],Z:pt[1],who:who,found:0,n:'find '+who+', who went out from '+s.name+' and has not come home, and bring '+who+' back',rw:crown?100:45});}
  EF.q=q;EF.qn=(EF.qn||0);saveDirty=true;const d=q.X!==undefined?Math.hypot(q.X-X0,q.Z-Z0):0;
  toast((crown?'A task of the crown':'A task of the elves')+': '+q.n+'.'+(q.X!==undefined?' It lies '+dirWord(q.X-X0,q.Z-Z0)+', '+Math.round(d)+' blocks off; sparks rise over it.':''));hint('etask');return q;}
const TEL={};
// another place of the same people to carry a letter to: within 1500 blocks, not the giver's own
function elfOtherSite(s,p){const C=s.prov.cult,ci=Math.floor(s.X/LS),cj=Math.floor(s.Z/LS),seen=new Set(),out=[];
  for(let a=-5;a<=5;a++)for(let b=-5;b<=5;b++){const c=stretchCell(landSite(ci+a,cj+b)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);if(realmHeld(c)!==C)continue;
    for(const t of provinceOf(c.i,c.j).sites)if(t!==s&&t.k!=='farm'&&t.k!=='outpost'){const d=Math.hypot(t.X-s.X,t.Z-s.Z);if(d>200&&d<1500)out.push([d,t]);}}
  out.sort((a,b)=>a[0]-b[0]);return out.length?out[Math.floor(Math.random()*Math.min(4,out.length))][1]:null;}
// is the task ready to be told as done (to any of its people)?
function elfTaskReady(q){if(q.k==='gather'||q.k==='hunt')return !SURV()||countOf(q.it)>=q.need;if(q.k==='slay')return q.c<=0;return false;}
function elfTaskDone(f){const q=EF.q;if(!q)return '';if(q.k==='gather'||q.k==='hunt'){if(SURV())takeItems(q.it,q.need);}return elfReward(q);}
function elfReward(q){EF.q=null;EF.qn=(EF.qn||0)+1;saveDirty=true;giveCoin(q.rw);const extra=Math.random()<0.4?[417,420,419][Math.floor(Math.random()*3)]:0;if(extra&&SURV())addItem(extra,1);drawBar(true);
  elfGain(q.p,q.crown?16:10,null);const msg='Task done: '+q.n.replace(/^./,c=>c.toUpperCase())+'. They give you '+coinWord(q.rw)+(extra?' and '+nameOf(extra):'')+'.';toast(msg);
  ['e'].forEach(()=>tone(660,990,0.35,0.05));return msg;}
// once a second: the tasks that end where the player goes (a relic found and brought back, a letter carried, a lost one led home)
let elfMk=0,elfLost=null;
function elfTaskTick(){const q=EF.q;if(!q)return;const X=PL.x+OX,Z=PL.z+OZ;
  if(q.k==='relic'){if(!q.got&&Math.hypot(q.X-X,q.Z-Z)<9){q.got=1;if(SURV())addItem(q.it,1);drawBar(true);saveDirty=true;toast('Among the stones you find the '+nameOf(q.it)+'. Bring it back to '+q.fn);}
    else if(q.got&&Math.hypot(q.fx-X,q.fz-Z)<40){if(SURV()&&countOf(q.it)<1)return;if(SURV())takeItems(q.it,1);elfReward(q);}}
  else if(q.k==='letter'&&Math.hypot(q.X-X,q.Z-Z)<30){if(SURV()&&countOf(428)<1){toast('You have lost the letter');EF.q=null;saveDirty=true;return;}if(SURV())takeItems(428,1);toast('You give the letter into the hands of the elves of '+q.tn);elfReward(q);}
  else if(q.k==='lost'){const L=elfLost&&!elfLost.dead&&!elfLost.gone?elfLost:null;
    if(!L&&Math.hypot(q.X-X,q.Z-Z)<70){const x=(q.found?PL.x+2:q.X-OX+0.5),z=(q.found?PL.z+2:q.Z-OZ+0.5),bx=Math.floor(x),bz=Math.floor(z);
      if(bx>2&&bz>2&&bx<W-3&&bz<D-3&&genDone[(bx>>4)+(bz>>4)*NCX]){const y=foeStand(x,ground[bx+W*bz]+1,z,2);if(y>0){elfLost=addFoe(q.p==='e'?'elady':'wfolk',x,y,z,{st:'idle',t:99,lost:1,nm:q.who});}}}
    else if(L&&!q.found&&Math.hypot(L.x-PL.x,L.z-PL.z)<5){q.found=1;saveDirty=true;toast(q.who+': "You have come for me? Then I will follow you home."');}
    if(L&&q.found){L.hx=PL.x;L.hz=PL.z;if(Math.hypot(L.x-PL.x,L.z-PL.z)>3){L.st='return';L.t=3;}if(Math.hypot(L.x+OX-q.fx,L.z+OZ-q.fz)<35){L.lost=0;elfLost=null;toast(q.who+' is home');elfReward(q);}}}}
// the sparks over where a task leads (every frame, from elfFrame)
function elfMarks(dt){const q=EF.q;if(!q||(elfMk-=dt)>0)return;elfMk=0.4;let X,Z;if((q.k==='relic'&&!q.got)||q.k==='letter'||(q.k==='lost'&&!q.found)){X=q.X;Z=q.Z;}else if(q.k==='relic'||q.k==='lost'){X=q.fx;Z=q.fz;}else return;
  const x=X-OX,z=Z-OZ,bx=Math.floor(x),bz=Math.floor(z);if(Math.hypot(x-PL.x,z-PL.z)>240||bx<0||bz<0||bx>=W||bz>=D)return;const y=ground[bx+W*bz]+1;
  for(let k=0;k<6;k++)spawnP(x+(Math.random()-.5)*0.6,y+Math.random()*16,z+(Math.random()-.5)*0.6,0,1.5,0,[0.75,0.9,1],1.2,-0.4);}
// ---- wardens at the border: the first time the player comes into one of their provinces (each time the world is loaded), two
// wardens come out to meet them and hail them by their standing; the realm's name on the screen
let elfProv='',elfBorderT=0;
function elfBorder(){const X=Math.floor(PL.x+OX),Z=Math.floor(PL.z+OZ),P=realmOfColumn(X,Z),C=P&&P.cult,p=C&&(C.k==='elf'?'e':C.k==='wood'?'w':null);
  const key=p?P.key:'';if(key===elfProv)return;const was=elfProv;elfProv=key;if(!p||elfMet.has(key))return;elfMet.add(key);
  showName(P.kingdom.name);if(!was||!playing)return;
  const a=PL.yaw,d=16,x=PL.x-Math.sin(a)*d,z=PL.z-Math.cos(a)*d,bx=Math.floor(x),bz=Math.floor(z);if(bx<3||bz<3||bx>=W-3||bz>=D-3||!genDone[(bx>>4)+(bz>>4)*NCX])return;
  const G=spawnGroup(C.fp+'ward',2,x,ground[bx+W*bz]+1,z,2,{prov:P.key,site:P.sites[0]});for(const f of G){f.ward=1;f.hx=PL.x;f.hz=PL.z;f.st='return';f.t=12;f.yaw=f.hd=Math.atan2(PL.x-f.x,PL.z-f.z);}
  if(G.length)elfWard={G:G,p:p,P:P,t:20};}
let elfWard=null;
function elfWardTick(){const W0=elfWard;if(!W0)return;W0.t-=1;const f=W0.G.find(g=>!g.dead&&!g.gone);if(!f||W0.t<=0){elfWard=null;return;}
  for(const g of W0.G){g.hx=PL.x;g.hz=PL.z;}if(Math.hypot(f.x-PL.x,f.z-PL.z)>5)return;elfWard=null;const r=elfRank(W0.p),nm=elfName(W0.p),K=W0.P.kingdom.name.replace(/^The /,'the ');
  for(const g of W0.G){g.st='idle';g.t=8;g.yaw=g.hd=Math.atan2(PL.x-g.x,PL.z-g.z);if(r>=3)g.bow=foeClock+2;}
  toast(FOES[f.kind].n+': '+(r<1?'"Halt, stranger. You have come into '+K+'. Strangers walk here by our leave: keep to the ways and draw no blade, and you will come to no harm."':
    r<2?elfSay(0)+' "Go freely, guest of '+K+'."':elfSay(4)+' "Welcome home, '+(nm?nm.split(' ')[0]:'friend')+'. The watch is glad of you."'));foeCall(f,'idle');}
// ---- each second (from elfFrame): the clock, the border, the wardens, the tasks; the ruins found
let elfT=0;
function elfFrame(dt){if(!ready)return;EF.pt+=dt;elfMarks(dt);elfLife(dt);if((elfT-=dt)>0)return;elfT=1;
  elfBorder();elfWardTick();elfTaskTick();
  const X=Math.floor(PL.x+OX),Z=Math.floor(PL.z+OZ),er=elderNear(X,Z,-2);if(er&&discover('e',er.name))elfGain('e',1,null);
}
// one of their places found (discoverTick): they hear of it
function elfPlaceFound(rp){const C=rp.s.prov.cult;if(C.k==='elf'||C.k==='wood')elfGain(C.k==='elf'?'e':'w',2,null);}
// ---- their folk: the court, the merchants, the mariners, the wardens at the border
Object.assign(FOE_HOME,{e_ward:[['ebow',1],['espear',1]],w_ward:[['wbow',1],['wknife',1]]});
Object.assign(FOES,{
  eking:{n:'King of the Elder Realm',m:'eking',hp:44,dmg:3,reach:2,walk:1.1,run:4.6,sight:20,cd:1.2,wind:0.4,mass:0.6,folk:1,civ:1,drops:[[224,2,4,0.6]],cause:'elf'},
  equeen:{n:'Queen of the Elder Realm',m:'equeen',hp:40,dmg:2,reach:1.8,walk:1.1,run:4.6,sight:20,cd:1.2,wind:0.4,mass:0.65,folk:1,civ:1,fem:1,drops:[[224,2,4,0.6]],cause:'elf'},
  eherald:{n:'Herald of the Court',m:'eherald',hp:20,dmg:2,reach:1.8,walk:1.15,run:4.8,sight:20,cd:1.2,wind:0.4,mass:0.65,folk:1,civ:1,drops:[[206,1,2,0.4]],cause:'elf'},
  emerch:{n:'Merchant of the Elves',m:'emerch',hp:16,dmg:1,reach:1.6,walk:1.1,run:4.6,sight:18,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,drops:[[204,1,2,0.5]],cause:'elf'},
  emariner:{n:'Mariner of the Elves',m:'emariner',hp:20,dmg:2,reach:1.8,walk:1.15,run:4.8,sight:22,cd:1.2,wind:0.4,mass:0.6,folk:1,civ:1,drops:[[206,1,2,0.4]],cause:'elf'},
  wmerch:{n:'Merchant of the Wood',m:'wmerch',hp:16,dmg:1,reach:1.6,walk:1.15,run:5,sight:18,cd:1.2,wind:0.4,mass:0.7,folk:1,civ:1,drops:[[204,1,2,0.5]],cause:'wood'}});
Object.assign(FOE_HOME,{e_market:[['emerch',2],['elady',1]],w_market:[['wmerch',2],['wfolk',1]],e_throne:[['eherald',1],['esword',1]],e_court:[['elord',2],['elady',2],['eherald',1],['elore',1]],
  e_quay:[['emariner',2],['elady',1],['elord',1]],e_pier:[['emariner',2],['elord',0.5]]});
Object.assign(FOLK_N,{ward:[2,2]});Object.assign(FOLK_LEAD,{e_market:'emerch',w_market:'wmerch',e_quay:'emariner'});
Object.assign(FOLK_SAY,{eking:['Be welcome in {p}. The light of {k} is yours to share.','My fathers held these mountains when the stars were young.','The world grows quieter every year. We remember it loud.'],
  equeen:['Be welcome in {p}, traveller. Stay as long as you will.','The lamps of {k} were lit long before your kingdom was founded.','Every age is shorter than the last, they say. I do not believe it.'],
  eherald:['You stand in the court of {k}. Bow, if you will, and be welcome.','The throne hears all who come in peace.','I bear the word of the throne to every hall of {k}.'],
  emerch:['Fine things from every hall of {k}. Look, and take your time.','Coin is coin, but a friend pays less.','Starglass, waybread, wine of the mountains. What will you have?'],
  emariner:['The sea calls, they say. It has called me a long while.','The white ships go west and do not come back.','Mind the ropes on the quay.'],
  wmerch:['Honeycakes, wine, arrows straight as moonbeams. Come and see.','Coin is welcome here, and so are friends.','The wood is generous, if you know where to look.']});
// ---- the steeds of the elves and the swan boat (D-088): an elven horse from the stables of the high elves, a great elk from
// the wood elves' pens, for a Friend; the whistle calls it from wherever it was left; a swan boat set on the water carries the
// player over it, faster when they row hard, and never onto land
Object.assign(ANIMALS,{
  ehorse:{n:'Elven Horse',hp:16,walk:1.5,run:8,shy:0,stride:2.4,amp:0.6,turn:3.4,graze:1,sleeps:0,drops:[],g:[],herd:[1,1],w:0,youngP:0,calls:[30,80],mount:true,gallop:15,steed:1,ride:'Riding the elven horse. Sprint to gallop; use it again to get down.'},
  elk:{n:'Great Elk',hp:20,walk:1.4,run:7,shy:0,stride:2.8,amp:0.7,turn:3,graze:1,sleeps:0,drops:[],g:[],herd:[1,1],w:0,youngP:0,calls:[40,90],mount:true,gallop:13,leap:14,steed:1,ride:'Riding the great elk. Sprint to run; it leaps high. Use it again to get down.'},
  swanboat:{n:'Swan Boat',hp:12,walk:0.1,run:0.1,shy:0,stride:2,amp:0,turn:3,drops:[[430,1]],g:[],herd:[1,1],w:0,youngP:0,mount:true,boat:1,ride:'In the swan boat. Move to row, sprint to row hard; use the boat again to step out.'}});
const elfSteedOf=()=>animals.find(a=>a.tame&&!a.dead&&ANIMALS[a.kind].steed);
function elfSteedAsk(f,p){const r=elfRank(p),kind=p==='e'?'ehorse':'elk',nm=ANIMALS[kind].n.toLowerCase();
  if(r<2)return '"We do not give our '+(p==='e'?'horses':'elk')+' to those we do not know. Come back as a friend of '+ELF_P[p].n+'."';
  if(elfSteedOf()||wildPending.some(q=>ANIMALS[q[0]]&&ANIMALS[q[0]].steed))return '"Your '+nm+' knows you already. Whistle, and it will come."';
  const a=PL.yaw,x=PL.x-Math.sin(a+0.8)*2.5,z=PL.z-Math.cos(a+0.8)*2.5,y=standY(x,PL.y+1,z);if(y<0)return '"There is no room here to bring it out."';
  const s=addAnimal(kind,x,y,z,{tame:true,uid:Date.now().toString(36)+'s',st:'idle',t:2});s.yaw=s.hd=Math.atan2(PL.x-x,PL.z-z);saveDirty=true;animalCall(s,false);
  if(SURV()&&countOf(429)<1)addItem(429,1);drawBar(true);return 'They lead out '+(p==='e'?'a silver '+nm:'a '+nm+' with antlers like a crown')+' and put its rein in your hand. "It is yours, and it will come when you whistle." (an Elven Whistle)';}
// the whistle: the steed comes, from wherever it is in the world
function elfWhistle(){const s=elfSteedOf();tone(1800,2400,0.25,0.06);tone(2400,1900,0.2,0.05,0.25);
  if(s){s.stay=false;s.st='follow';s.t=1;if(Math.hypot(s.x-PL.x,s.z-PL.z)>40)s.stuck=99;toast('You whistle, and your '+ANIMALS[s.kind].n.toLowerCase()+' comes');return true;}
  const i=wildPending.findIndex(q=>ANIMALS[q[0]]&&ANIMALS[q[0]].steed);if(i<0){toast('You whistle, but no steed of yours hears it. The stables of the elves keep them for their friends.');return true;}
  const q=wildPending.splice(i,1)[0],x=PL.x-Math.sin(PL.yaw+0.8)*2.5,z=PL.z-Math.cos(PL.yaw+0.8)*2.5,y=standY(x,PL.y+1,z);
  addAnimal(q[0],x,y>0?y:PL.y,z,{tame:true,uid:String(q[5]||''),ci:q[6]|0,st:'idle',t:2});saveDirty=true;toast('You whistle, and after a while your '+ANIMALS[q[0]].n.toLowerCase()+' comes running');return true;}
// the swan boat: set on open water where the player looks, the boat floating on it
function boatPlace(){const e=eyePos(),d=camDir();for(let t=1;t<7;t+=0.25){const x=Math.floor(e.x+d.x*t),y=Math.floor(e.y+d.y*t),z=Math.floor(e.z+d.z*t),id=get(x,y,z);
    if(SOLID[id]&&!isWetId(id))break;if(isWetId(id)&&!isWetId(get(x,y+1,z))&&!SOLID[get(x,y+1,z)]){if(SURV()){const q=inv[sel];q.c--;if(!q.c)inv[sel]=null;drawBar(true);}
      const b=addAnimal('swanboat',x+0.5,y+0.65,z+0.5,{tame:true,uid:Date.now().toString(36)+'b',st:'idle',t:9});b.yaw=b.hd=PL.yaw+Math.PI;saveDirty=true;toast('The swan boat floats on the water. Use it to step in.');return true;}}
  toast('A swan boat must be set on open water');return true;}
// rowing: over water only (a bump at the shore), level on its surface
function boatStep(dt,wx,wz,sprint){const a=PL.ride,sp=sprint?9:5.5,k=Math.min(1,2.6*dt);PL.vx+=(wx*sp-PL.vx)*k;PL.vz+=(wz*sp-PL.vz)*k;PL.vy=0;PL.ground=true;
  const wy=Math.floor(a.y-0.65),v=Math.hypot(PL.vx,PL.vz),ok=(x,z)=>isWetId(get(Math.floor(x),wy,Math.floor(z)))&&!SOLID[get(Math.floor(x),wy+1,Math.floor(z))];
  if(v>0.01){const nx=PL.x+PL.vx*dt,nz=PL.z+PL.vz*dt,fx=nx+PL.vx/v*1.4,fz=nz+PL.vz/v*1.4;if(ok(nx,nz)&&ok(fx,fz)){PL.x=nx;PL.z=nz;}else{PL.vx*=-0.2;PL.vz*=-0.2;}}
  PL.y=wy+0.65;a.x=PL.x;a.z=PL.z;a.y=a.gy=PL.y;if(v>2&&Math.random()<dt*6)spawnP(PL.x-PL.vx/v*1.5,wy+1.05,PL.z-PL.vz/v*1.5,(Math.random()-.5)*0.5,0.4,(Math.random()-.5)*0.5,[0.85,0.92,1],0.5,6);}
// stepping out of the boat: onto the nearest dry ground beside it, if there is any
function boatLeave(a){const wy=Math.floor(a.y-0.65);for(let r=1;r<=4;r++)for(let k=0;k<12;k++){const an=k/12*6.283,x=a.x+Math.cos(an)*r,z=a.z+Math.sin(an)*r,y=standY(x,wy+2,z);if(y>0&&!wetAt(x,y,z)&&!isWetId(get(Math.floor(x),y-1,Math.floor(z)))){PL.x=x;PL.z=z;PL.y=y;return;}}}
// a warden's cloak in the body slot: the wastes' creatures see its wearer at half their sight (foes.js)
function cloakHide(){const q=equip.body;return q&&ITEMS[q.id]&&ITEMS[q.id].hide?ITEMS[q.id].hide:1;}
