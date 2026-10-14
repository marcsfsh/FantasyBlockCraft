// ---- The life of the dwarves (D-091): what the mountain folk do about the player, day and night.
//
// The delving contest: once a day by daylight at a hold or a mining town with mines, while the player is near: three miners go
// down at the horn, and ninety seconds later whoever has brought out the most ore wins; ask a miner at the headframe to join,
// and every ore and gem the player breaks in that place's mines counts (gold and the golden pick for the winner). The Kindling:
// every fourth evening the hold gathers in the great hall, the deep drum is beaten, the chant goes up, the brewer brings round the
// horn; kept a while, the player is fed and the better thought of. The caravans: trains of ponies with their packs, a caravan
// master and two axeguards, on the Stone Road between the holds by day. The shifts: a horn from the nearest hold or town at dawn
// sends the miners down, another at dusk brings them up, and the hoists clank at the headframes. The engine drill: once a day the
// engineers of a bastion or a hold loose a trebuchet at the range. The deep watch: the deepwardens challenge whoever comes down to
// a hold's deep level. The baths: their hot water heals. Ravens perch on the towers, and bring a friend of the mountain the news.
// Pipe smoke at the gates of an evening; the lamplighter's round at dusk; rams in their pens and wild rams on the heights;
// prospectors at their claims by day; ram-riders on the Stone Road; a low horn for one of their folk fallen near by.
const TDWL={};
// the dwarves' life draws from its own stream, so the shared one (and all that hangs on it elsewhere) runs as before
const dlRnd=mkRng(91021);
function dwarfLandNow(){const P=realmOfColumn(Math.floor(PL.x+OX),Math.floor(PL.z+OZ));return !!(P&&P.cult.k==='dwarf');}
function dwarfSitesNear(m){const X=PL.x+OX,Z=PL.z+OZ;return realmTile(Math.floor(X),Math.floor(Z)).sites.filter(s=>s.prov.cult.k==='dwarf'&&Math.hypot(s.X-X,s.Z-Z)<s.R+m);}
const dwarfAt=(s,u,v,y)=>{const [X,Z]=siteXZ(s,u,v);return [X-OX+0.5,y,Z-OZ+0.5];};
const dwLoaded=(x,z)=>{const bx=Math.floor(x),bz=Math.floor(z);return bx>2&&bz>2&&bx<W-3&&bz<D-3&&genDone[(bx>>4)+(bz>>4)*NCX];};
function dwarfCheer(at,big){for(let i=0;i<(big?12:6);i++)voice(150+dlRnd()*90,130+dlRnd()*80,0.6,0.014,{form:520+dlRnd()*300,q:1,delay:i*0.07},at);}
// ---- the delving contest
let DELVE=null;const delveDone=new Set();
function delveFind(){if(!(curT()>0.3&&curT()<0.68))return null;for(const s of dwarfSitesNear(20))if((s.k==='village'||s.k==='city')&&!delveDone.has(s.id+':'+dayN)&&siteLayout(s).spots.some(p=>p.kind==='mine'))return s;return null;}
function delveStart(s){delveDone.add(s.id+':'+dayN);const K=[0,1,2].map(i=>({nm:nameWord('dwarf',dlRnd),n:0,rate:0.11+dlRnd()*0.06}));
  DELVE={s:s,K:K,ph:'muster',t:20,me:0,pl:0,run:90};toast('The delving contest at '+s.name+'! Three miners are at the headframe. Ask one of them to dig with them.');hint('delve');return DELVE;}
function dwarfContestAsk(f){if(!DELVE||DELVE.s!==f.site)return '"There is no contest today. Come back another day, by daylight."';if(DELVE.ph!=='muster')return '"They are down already! Next time."';
  DELVE.pl=1;return '"Then dig! When the horn sounds, every ore and gem you break in our mines counts. Ninety seconds. The most wins."';}
// an ore or a gem broken by the player (from mining.js): it counts in the contest if it lies in the contest's place
function delveMined(id,x,y,z){const D0=DELVE;if(!D0||D0.ph!=='run'||!D0.pl||!BL[id]||BL[id].mat!=='ore')return;const s=D0.s;if(Math.hypot(s.X-OX-x,s.Z-OZ-z)>s.R+40||y>s.T-3)return;D0.me+=id===GEMORE?2:1;
  if(D0.me%3===0)toast('Your tally: '+D0.me);}
function delveTick(){const D0=DELVE;if(!D0){if(dlRnd()<0.25){const s=delveFind();if(s)delveStart(s);}return;}
  const s=D0.s;if(Math.hypot(s.X-OX-PL.x,s.Z-OZ-PL.z)>s.R+140){DELVE=null;return;}
  if(D0.ph==='muster'){if((D0.t-=1)>0)return;D0.ph='run';tone(110,110,1.2,0.08,0,'sawtooth');tone(147,147,1.4,0.07,1,'sawtooth');toast(D0.pl?'The horn! Dig, '+(DW.nm||'stranger')+'!':'The horn sounds and the miners go down.');return;}
  for(const k of D0.K)if(dlRnd()<k.rate)k.n++;if((D0.run-=1)>0)return;
  const all=[...D0.K.map(k=>({who:k.nm,n:k.n})),...(D0.pl?[{who:'you',n:D0.me,me:1}]:[])].sort((a,b)=>b.n-a.n||(a.me?-1:1)),i=all.findIndex(q=>q.me);
  toast('The delving contest at '+s.name+' is over. '+(all[0].me?'You brought out the most, '+all[0].n+'!':all[0].who+' wins with '+all[0].n+(i>0?'; you came '+['','second','third','fourth'][i]+' with '+D0.me:'')+'.'));
  if(i===0)delveWins();else if(i===1){giveCoin(10);dwarfGain(3,'Second in the delving contest at '+s.name);}dwarfCheer([s.X-OX,s.T+2,s.Z-OZ],true);DELVE=null;}
function delveWins(){DW.cw=(DW.cw||0)+1;saveDirty=true;const got=['3 gold'];giveCoin(30);if(SURV()&&!countOf(477)&&DW.cw===1){addItem(477,1);got.push('the Golden Pick');}drawBar(true);
  dwarfGain(10,'You won the delving contest at '+DELVE.s.name);toast('The miners lift you on their shoulders. Your prize: '+got.join(' and ')+'.');}
// ---- the Kindling in the great hall
let KINDLE=null;const kindleDone=new Set();
function dwarfGreatOf(s){const L=siteLayout(s);return L.hold&&L.hold.find(q=>q.k==='great');}
function dwarfInGreat(s){const q=dwarfGreatOf(s);if(!q)return false;const [u,v]=siteUV(s,Math.floor(PL.x+OX),Math.floor(PL.z+OZ));return u>=q.u0&&u<=q.u1&&v>=q.v0&&v<=q.v1&&Math.abs(PL.y-q.y0)<8;}
function kindleTick(){const t=curT(),on=dayN%4===3&&t>0.74&&t<0.96;if(!on){if(KINDLE)kindleEnd();return;}
  if(KINDLE&&Math.hypot(KINDLE.x-PL.x,KINDLE.z-PL.z)>140)kindleEnd();
  if(!KINDLE){for(const s of dwarfSitesNear(80)){if(s.k!=='city'||kindleDone.has(s.id+':'+dayN))continue;const q=dwarfGreatOf(s);if(!q)continue;kindleDone.add(s.id+':'+dayN);
      const G=[],mv=(q.v0+q.v1)/2;for(let du=4;du<=q.u1-q.u0-8&&G.length<16;du+=3)for(const sd of [1,-1]){const [x,y,z]=dwarfAt(s,q.u0+du,mv+sd*4,q.y0);if(!dwLoaded(x,z))continue;
        const g=spawnGroup('d_kind',1,x,y,z,0.3,{prov:s.prov.key,site:s})[0];if(g){g.hold=1;g.holdSp=0;g.kindle=1;g.x=x;g.z=z;g.yaw=g.hd=Math.atan2(...dirUV(s,0,-sd));G.push(g);}}
      const [bx,by,bz]=dwarfAt(s,q.u1-8,2,q.y0),bearer=addFoe('dbrew',bx,by,bz,{prov:s.prov.key,site:s,st:'idle',t:99});if(bearer){bearer.kindle=1;G.push(bearer);}
      KINDLE={s:s,q:q,x:bx,y:by,z:bz,G:G,kept:0,told:0,drumT:2,chantT:6,bearer:bearer};break;}return;}
  const inHall=dwarfInGreat(KINDLE.s);
  if(inHall&&!KINDLE.told){KINDLE.told=1;toast('The Kindling in the great hall of '+KINDLE.s.name+': the forge-fire is kindled anew, the deep drum beats, and the old names are sung.');hint('kindling');}
  if(inHall&&KINDLE.bearer&&!KINDLE.horn&&Math.hypot(KINDLE.bearer.x-PL.x,KINDLE.bearer.z-PL.z)<8){KINDLE.horn=1;toast('The brewer brings you the horn: "'+DWARF_TONGUE[4][0]+'" ('+DWARF_TONGUE[4][1]+')');tone(392,494,0.4,0.04);}
  if(inHall){KINDLE.kept++;if(KINDLE.kept>=20&&DW.ki!==dayN){DW.ki=dayN;saveDirty=true;if(SURV()){food=Math.min(20,food+8);hp=Math.min(20,hp+4);drawStats();}dwarfGain(3,'You kept the Kindling in the hall of '+KINDLE.s.name);}}}
function kindleFrame(dt){const K=KINDLE;if(!K)return;for(const g of K.G)if(!g.dead&&g.kindle&&dlRnd()<dt*0.1)g.cheer=foeClock+1;const near=Math.hypot(K.x-PL.x,K.z-PL.z)<50;
  if((K.drumT-=dt)<=0){K.drumT=14;if(near)for(let i=0;i<3;i++){burst(0.8,'lowpass',80,0.6,0.4,i*0.75,[K.x,K.y+2,K.z]);tone(55,50,0.6,0.06,i*0.75,'sine',[K.x,K.y+2,K.z]);}}
  if((K.chantT-=dt)<=0){K.chantT=24;if(near)[98,110,131,110,98,87,98,131,147].forEach((fq,i)=>voice(fq,fq*1.01,0.8,0.02,{form:400,q:1,delay:i*0.6},[K.x,K.y+2,K.z]));}
  if(near&&dlRnd()<dt*3){const q=K.q,[x,,z]=dwarfAt(K.s,q.u1-2,(dlRnd()-0.5)*4,0);spawnP(x,q.y0+1.5,z,(dlRnd()-.5)*0.6,1.5+dlRnd(),(dlRnd()-.5)*0.6,[1,0.55+dlRnd()*0.3,0.15],0.7,-1);}}
function kindleEnd(){if(!KINDLE)return;for(const g of KINDLE.G)if(!g.dead&&!g.gone){g.kindle=0;g.hold=0;if(Math.hypot(g.x-PL.x,g.z-PL.z)>40)removeFoe(g);else{g.st='idle';g.t=2;}}KINDLE=null;}
// ---- the caravans on the Stone Road
let CARAVAN=null,caravanT=40;
function caravanTick(){if(CARAVAN){const C=CARAVAN,m=C.G[0];if(!m||m.dead||Math.hypot(m.x-PL.x,m.z-PL.z)>150||(C.age=(C.age||0)+1)>400){caravanEnd();return;}
    for(const a of C.A)if(a.pen&&!a.dead){a.pen.x=m.x;a.pen.z=m.z;}return;}
  if((caravanT-=1)>0)return;caravanT=150+dlRnd()*120;if(ambNight()||!dwarfLandNow())return;
  const X=Math.floor(PL.x+OX),Z=Math.floor(PL.z+OZ);let rr=null;for(let d=0;d<=40&&!rr;d+=4)for(const [a,b] of [[d,0],[-d,0],[0,d],[0,-d]]){const q=realmRoadAt(X+a,Z+b,1);if(q&&q.rd.k==='high'&&q.rd.P.cult.k==='dwarf'){rr=q;break;}}if(!rr)return;
  const R=rr.rd,ex=(R.b[0]-R.a[0])/(R.len||1),ez=(R.b[1]-R.a[1])/(R.len||1),dir=dlRnd()<0.5?1:-1,sx=X-ex*dir*36,sz=Z-ez*dir*36,x=sx-OX,z=sz-OZ;if(!dwLoaded(x,z))return;const y=ground[Math.floor(x)+W*Math.floor(z)]+1;
  const P=R.P,site=P.sites[0],G=[];const tx=x+ex*dir*140,tz=z+ez*dir*140;
  for(const [k,o] of [['dmerch',0],['daxe',2],['daxe',-2]]){const f=addFoe(k,x-ex*dir*o*1.5,y,z-ez*dir*o*1.5,{prov:P.key,site:site,st:'return',t:60});if(f){f.hx=tx;f.hz=tz;f.caravan=1;G.push(f);}}
  if(!G.length)return;const A=[];for(let i=0;i<3;i++){const ax=x-ex*dir*(3+i*2),az=z-ez*dir*(3+i*2);if(!dwLoaded(ax,az))continue;const ay=standY(ax,ground[Math.floor(ax)+W*Math.floor(az)]+2,az);if(ay>0)A.push(addAnimal('pony',ax,ay,az,{pen:{x:x,z:z,r:3},caravan:1}));}
  G[0].nm=nameWord('dwarf',dlRnd);CARAVAN={G:G,A:A};toast('A caravan of the mountain comes along the Stone Road: ponies laden with iron and gems, '+G[0].nm+' the caravan master, and two axeguards.');}
function caravanEnd(){const C=CARAVAN;if(!C)return;for(const f of C.G)if(!f.dead&&Math.hypot(f.x-PL.x,f.z-PL.z)>40)removeFoe(f);else if(!f.dead){f.caravan=0;f.st='idle';f.t=3;}
  for(const a of C.A)if(!a.dead&&animals.includes(a)&&!a.tame)removeAnimal(a);CARAVAN=null;}
// ---- the shifts: a horn at dawn and dusk from the nearest hold or mining town; the hoists clank at the headframes by day
let shiftDay=-1,shiftDusk=-1,hoistT=3;
function dwarfShift(){const t=curT();const dawn=t>=0.24&&t<=0.3&&shiftDay!==dayN,dusk=t>=0.72&&t<=0.76&&shiftDusk!==dayN;if(!dawn&&!dusk)return;
  let s=null,bd=160;for(const q of dwarfSitesNear(160))if(q.k==='city'||q.k==='village'){const d=Math.hypot(q.X-OX-PL.x,q.Z-OZ-PL.z);if(d<bd){bd=d;s=q;}}if(!s)return;
  if(dawn)shiftDay=dayN;else shiftDusk=dayN;const at=dwarfAt(s,0,0,s.T+8);tone(98,98,1.4,0.07,0,'sawtooth',at);tone(98,98,1.4,0.07,1.6,'sawtooth',at);
  toast(dawn?'The shift horn sounds from '+s.name+': the miners go down.':'The shift horn sounds from '+s.name+': the miners come up out of the deep.');}
function dwarfHoists(dt){if((hoistT-=dt)>0)return;hoistT=4+dlRnd()*5;if(ambNight())return;for(const s of dwarfSitesNear(50)){const p=siteLayout(s).parts.find(q=>q.k==='dhead');if(!p)continue;
  const [x,,z]=dwarfAt(s,p.cu,p.cv,0),at=[x,p.y+p.H,z];for(let i=0;i<4;i++)burst(0.06,'bandpass',1800+dlRnd()*600,6,0.08,i*0.18,at);break;}}
// ---- the engine drill: once a day by daylight, a trebuchet of a bastion or a hold looses at the range
const engineDone=new Set();let ENG=null;
function engineTick(){if(ENG||!(curT()>0.35&&curT()<0.65))return;for(const s of dwarfSitesNear(60)){const L=siteLayout(s);if(!L.trebs||engineDone.has(s.id+':'+dayN))continue;engineDone.add(s.id+':'+dayN);
    const T=L.trebs[0],[x,,z]=dwarfAt(s,T.u,T.v,0),[ex,,ez]=dwarfAt(s,T.u-80,T.v*1.5,0);ENG={x:x,y:T.y+12,z:z,ex:ex,ez:ez,t:0,s:s};
    toast('"Loose!" The engineers of '+s.name+' drill the trebuchet at the range.');burst(0.5,'lowpass',160,0.7,0.4,0,[x,T.y+6,z]);break;}}
function engineFrame(dt){const E=ENG;if(!E)return;E.t+=dt;const k=Math.min(1,E.t/3.2),x=E.x+(E.ex-E.x)*k,z=E.z+(E.ez-E.z)*k,y=E.y+Math.sin(k*Math.PI)*30-k*10;spawnP(x,y,z,0,0,0,[0.5,0.48,0.44],0.6,0);
  if(k>=1){const bx=Math.floor(E.ex),bz=Math.floor(E.ez),gy=dwLoaded(E.ex,E.ez)?ground[bx+W*bz]+1:y;for(let i=0;i<24;i++)spawnP(E.ex,gy,E.ez,(dlRnd()-.5)*5,dlRnd()*4,(dlRnd()-.5)*5,[0.55,0.5,0.44],1,6);burst(0.7,'lowpass',120,0.6,0.5,0,[E.ex,gy,E.ez]);ENG=null;}}
// ---- the deep watch: a deepwarden's challenge on coming down to a hold's deep level
const deepDone=new Set();
function deepWatch(){for(const s of dwarfSitesNear(10)){const L=siteLayout(s);if(!L.lv2||deepDone.has(s.id+':'+dayN))continue;if(PL.y>L.lv2.y+6)continue;deepDone.add(s.id+':'+dayN);
  toast(dwarfRank()<1?'A deepwarden steps out of the dark: "Who walks in the deep? Strangers keep to the upper halls, and the lamplit ways." He lets you pass, and watches you go.':'A deepwarden lifts his lantern: "Ah. '+(DW.nm||'Friend')+'. Pass, and mind the side drifts."');}}
// ---- the baths: the hot water heals, and a day's first bath is remembered
let bathT=0;
function bathTick(dt){if((bathT-=dt)>0)return;bathT=2;const x=Math.floor(PL.x),z=Math.floor(PL.z),y=Math.floor(PL.y);if(get(x,y,z)!==WATER&&get(x,y-1,z)!==WATER)return;
  for(const s of dwarfSitesNear(10)){const B=siteLayout(s).bath;if(!B)continue;const [u,v]=siteUV(s,x+OX,z+OZ);if(u<B.u0||u>B.u1||v<B.v0||v>B.v1||Math.abs(y-B.y)>2)continue;
    if(SURV()&&hp<20){hp=Math.min(20,hp+1);drawStats();}if(DW.bath!==dayN){DW.bath=dayN;saveDirty=true;toast('The water is hot from the furnaces\' flues. Your aches go out of you.');dwarfGain(1,null);}return;}}
// steam over the baths
let steamT=0;
function bathSteam(dt){if((steamT-=dt)>0)return;steamT=0.25;for(const s of dwarfSitesNear(0)){const B=siteLayout(s).bath;if(!B)continue;const [x,,z]=dwarfAt(s,B.u0+dlRnd()*(B.u1-B.u0),B.v0+dlRnd()*(B.v1-B.v0),0);
  if(Math.hypot(x-PL.x,z-PL.z)>40)continue;spawnP(x,B.y+1,z,(dlRnd()-.5)*0.2,0.5+dlRnd()*0.3,(dlRnd()-.5)*0.2,[0.86,0.88,0.9],2.4,-0.2);}}
// ---- ravens on the towers of the holds, and the news they bring a friend of the mountain
const RAVENS=new Set();let ravenT=300;
function ravenTick(){if(ambNight())return;for(const s of dwarfSitesNear(90)){if((s.k!=='city'&&s.k!=='fort')||RAVENS.has(s.id))continue;const ws=siteLayout(s).spots.filter(p=>p.kind==='wall').slice(0,2);let n=0;
    for(const p of ws){const [x,y,z]=dwarfAt(s,p.u,p.v,p.y+1);if(!dwLoaded(x,z))continue;const a=addAnimal('raven',x,y,z,{pen:{x:x,z:z,r:1.5}});if(a)n++;}if(n)RAVENS.add(s.id);}
  for(const id of [...RAVENS])if(!dwarfSitesNear(200).some(s=>s.id===id))RAVENS.delete(id);
  if((ravenT-=1)>0)return;ravenT=600+dlRnd()*300;if(dwarfRank()<2||!dwarfLandNow())return;const s=dwarfSitesNear(400).find(q=>q.k==='city'||q.k==='fort');if(!s)return;
  const w=typeof WARS!=='undefined'?[...WARS.values()][0]:null,news=w?'the war at '+w.n+' goes on, and the mine under the gate is '+Math.round(((w.b&&w.b.mine)||0)*100)+' parts in a hundred dug':['a new seam of iron was struck in the deep galleries','the forge hall\'s channel ran over, and the smiths were glad of it','a caravan came in from the far holds with gems and news','the Kindling was kept well, and the old names were sung'][Math.floor(dlRnd()*4)];
  toast('A raven of '+s.name+' lands on your shoulder and croaks its news: '+news+'.');for(let i=0;i<2;i++)voice(620,480,0.22,0.05,{type:'square',form:900,q:2.5,delay:i*0.32});}
// ---- pipe smoke at the gates of an evening; the lamplighter's round at dusk
let pipeT=0;const lampDone=new Set();
function dwarfPipes(dt){if((pipeT-=dt)>0)return;pipeT=0.6;const t=curT();if(t<0.68||t>0.92)return;for(const f of foes){if(f.dead||(f.spk!=='d_gate'&&f.spk!=='d_gatein')||Math.hypot(f.x-PL.x,f.z-PL.z)>30||dlRnd()<0.6)continue;
  spawnP(f.x+Math.sin(f.yaw)*0.4,f.y+1.35,f.z+Math.cos(f.yaw)*0.4,(dlRnd()-.5)*0.2,0.5,(dlRnd()-.5)*0.2,[0.8,0.8,0.82],1.6,-0.15);}}
function lamplighter(){const t=curT();if(t<0.7||t>0.78)return;for(const s of dwarfSitesNear(30)){if(s.k!=='city'&&s.k!=='village'||lampDone.has(s.id+':'+dayN))continue;const p=siteLayout(s).spots.find(q=>q.kind==='street');if(!p)continue;
  const [x,y,z]=dwarfAt(s,p.u,p.v,p.y+1);if(!dwLoaded(x,z))continue;lampDone.add(s.id+':'+dayN);const f=addFoe('dminer',x,y,z,{prov:s.prov.key,site:s,st:'idle',t:6});if(f)f.nm='the lamplighter';
  toast('The lamplighter of '+s.name+' goes round with his pole and his lamp.');break;}}
// ---- rams in their pens; wild rams on the heights; prospectors at their claims by day; ram-riders on the Stone Road
const PENS=new Set(),PROSP=new Map();let wildRamT=30,patrolT=90;
function dwarfPens(){for(const s of dwarfSitesNear(70)){const L=siteLayout(s);if(!L.pens||PENS.has(s.id))continue;let n=0;
    for(const pn of L.pens){const [x,,z]=dwarfAt(s,pn.u,pn.v,0);if(!dwLoaded(x,z))continue;for(let i=0;i<3;i++){const ax=x+(dlRnd()-0.5)*4,az=z+(dlRnd()-0.5)*3,ay=standY(ax,pn.y+2,az);if(ay>0&&addAnimal('ram',ax,ay,az,{pen:{x:x,z:z,r:3}}))n++;}}if(n)PENS.add(s.id);}
  for(const id of [...PENS])if(!dwarfSitesNear(160).some(s=>s.id===id))PENS.delete(id);}
function wildRamTick(){if((wildRamT-=1)>0)return;wildRamT=60+dlRnd()*50;const land=LANDS[colInfo(Math.floor(PL.x+OX),Math.floor(PL.z+OZ),TDWL).land].k;if(!dwarfLandNow()&&!CLAIM_LANDS.has(land)&&land!=='mtn')return;
  let n=0;for(const a of animals)if(a.kind==='ram'&&!a.tame&&!a.pen&&Math.hypot(a.x-PL.x,a.z-PL.z)<120)n++;if(n>=4)return;
  const a0=dlRnd()*6.283,x=PL.x+Math.cos(a0)*55,z=PL.z+Math.sin(a0)*55;if(!dwLoaded(x,z))return;const id=2e6+Math.floor(dlRnd()*1e6),k=2+Math.floor(dlRnd()*3);
  for(let i=0;i<k;i++){const ax=x+(dlRnd()-0.5)*8,az=z+(dlRnd()-0.5)*8,ay=standY(ax,ground[Math.floor(x)+W*Math.floor(z)]+3,az);if(ay<0||wetAt(ax,ay,az))continue;addAnimal('ram',ax,ay,az,{herd:id,young:i>1&&dlRnd()<0.3});}}
function prospectorTick(){if(ambNight()){for(const [k,f] of PROSP){if(!f.dead&&Math.hypot(f.x-PL.x,f.z-PL.z)>30)removeFoe(f);PROSP.delete(k);}return;}
  const o=claimsNear(Math.floor(PL.x+OX),Math.floor(PL.z+OZ),40);if(o&&!o.ab&&!PROSP.has(o.name)){const [fx,fz]=ELD4[o.dir],x=o.X-fx*5-OX+0.5,z=o.Z-fz*5-OZ+0.5;if(dwLoaded(x,z)){const y=standY(x,o.g+2,z);
    const f=addFoe('dprosp',x,y>0?y:o.g+1,z,{st:'idle',t:6});if(f){f.nm=o.who;f.home=[x,z];PROSP.set(o.name,f);}}}
  for(const [k,f] of PROSP)if(f.dead||Math.hypot(f.x-PL.x,f.z-PL.z)>120){if(!f.dead)removeFoe(f);PROSP.delete(k);}}
function patrolTick(){if((patrolT-=1)>0)return;patrolT=200+dlRnd()*150;if(!dwarfLandNow())return;const X=Math.floor(PL.x+OX),Z=Math.floor(PL.z+OZ);let rr=null;for(let d=0;d<=30&&!rr;d+=3)for(const [a,b] of [[d,0],[-d,0],[0,d],[0,-d]]){const q=realmRoadAt(X+a,Z+b,1);if(q&&q.rd.P.cult.k==='dwarf'){rr=q;break;}}if(!rr)return;
  const R=rr.rd,ex=(R.b[0]-R.a[0])/(R.len||1),ez=(R.b[1]-R.a[1])/(R.len||1),dir=dlRnd()<0.5?1:-1,x=X-ex*dir*40-OX,z=Z-ez*dir*40-OZ;if(!dwLoaded(x,z))return;const y=ground[Math.floor(x)+W*Math.floor(z)]+1;let n=0;
  for(let i=0;i<2;i++){const f=addFoe('dramr',x+i*2,y,z,{prov:R.P.key,site:R.P.sites[0],st:'return',t:60});if(f){f.hx=x+ex*dir*160;f.hz=z+ez*dir*160;n++;}}
  if(n)setTimeout(()=>toast('Ram-riders of '+R.P.name+' go by on the Stone Road, their rams\' hooves ringing on the setts.'),1500);}
// ---- a low horn for one of their folk fallen near by
let dpassT=0;
function dwarfPassing(f){if(!f||f.war||f.hst||dpassT>foeClock||!FOES[f.kind].folk||!dwarfPeopleOf(f)||Math.hypot(f.x-PL.x,f.z-PL.z)>50)return;dpassT=foeClock+30;setTimeout(()=>{const at=[f.x,f.y+3,f.z];tone(98,98,2.4,0.07,0,'sawtooth',at);tone(73,73,2.6,0.05,2.2,'sawtooth',at);},1500);}
// ---- each frame (from dwarfFrame)
let dlifeT=0;
function dwarfLife(dt){kindleFrame(dt);engineFrame(dt);bathSteam(dt);dwarfPipes(dt);dwarfHoists(dt);bathTick(dt);if((dlifeT-=dt)>0)return;dlifeT=1;
  delveTick();kindleTick();caravanTick();dwarfShift();engineTick();deepWatch();ravenTick();lamplighter();dwarfPens();wildRamTick();prospectorTick();patrolTick();}
Object.assign(FOE_HOME,{d_kind:[['dminer',2],['dsmith',1],['dlady',2],['daxe',1],['dhammer',0.6],['dlord',0.5]]});
