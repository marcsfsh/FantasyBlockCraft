// ---- The life of the riders (D-090): what the horse-lords do about the player, day and night.
//
// The race: once a day at each race course, while the player is near by daylight, four riders in their silks line up at the
// chalk line and ride two laps of the oval, the stands cheering as they pass; ask the judge, be mounted at the line when the horn
// sounds, and ride it with them (pass the pennons in order round the track). The feast: every evening the golden hall fills,
// the boards are crowded, the cup goes round, the lay-singer sings; keep the feast and you are fed, and a boast made before the
// high seat while the feast is on is a task worth twice as much (and costs a little standing if it is not made good). The horse
// fair every third day by the paddock at a hill town's gate: dealers and horses for sale. The wild herds of the plains: a herd
// of wild horses now and then on the riders' lands, and with a few of them a windsteed, which lets only a sworn rider lay a hand
// on it. The herders at work: horse-herds with their horses, cowherds with steppe cattle, at the farms and steadings by day.
// Sparring at the drill ring with a shieldmaiden or a marshal: three touches wins. The riders of the border ride up to see who
// comes into their lands. A horn at dawn from the walls of the hill towns and holds; smoke from the golden hall of an evening;
// wolves howling far off at night; a low horn for one of the folk fallen near by.
const TRLH={};
// the riders' life draws from its own stream, so the shared one (and all that hangs on it elsewhere) runs as before
const rlRnd=mkRng(90931);
function riderLandNow(){const P=realmOfColumn(Math.floor(PL.x+OX),Math.floor(PL.z+OZ));return !!(P&&P.cult.k==='horse');}
function riderSitesNear(m){const X=PL.x+OX,Z=PL.z+OZ;return realmTile(Math.floor(X),Math.floor(Z)).sites.filter(s=>s.prov.cult.k==='horse'&&Math.hypot(s.X-X,s.Z-Z)<s.R+m);}
const riderAt=(s,u,v,y)=>{const [X,Z]=siteXZ(s,u,v);return [X-OX+0.5,y,Z-OZ+0.5];};
function riderCheer(at,big){for(let i=0;i<(big?14:7);i++)voice(300+rlRnd()*240,280+rlRnd()*220,0.5,0.012,{form:860+rlRnd()*600,q:1,delay:i*0.06},at);}
// ---- the race
let RACE=null;const raceDone=new Set();
const trackLen=T=>4*T.Ls+2*Math.PI*T.Rr;
// a point on the oval (u, v in the course's frame), p blocks along it from the chalk line, `lane` out from its middle line
function trackPt(T,p,lane){const L=trackLen(T);p=((p%L)+L)%L;const R=T.Rr+lane;
  if(p<T.Ls)return [p,R];p-=T.Ls;if(p<Math.PI*T.Rr){const a=Math.PI/2-p/T.Rr;return [T.Ls+Math.cos(a)*R,Math.sin(a)*R];}
  p-=Math.PI*T.Rr;if(p<2*T.Ls)return [T.Ls-p,-R];p-=2*T.Ls;if(p<Math.PI*T.Rr){const a=-Math.PI/2-p/T.Rr;return [-T.Ls+Math.cos(a)*R,Math.sin(a)*R];}
  p-=Math.PI*T.Rr;return [-T.Ls+p,R];}
function raceFind(){if(!(curT()>0.3&&curT()<0.68))return null;for(const s of riderSitesNear(60))if(s.k==='course'&&!raceDone.has(s.id+':'+dayN))return s;return null;}
function raceStart(s){raceDone.add(s.id+':'+dayN);const L=siteLayout(s),T=L.track,y=T.y+1,K=[];
  for(let i=0;i<4;i++){const lane=-1.5+i,[u,v]=trackPt(T,-3,lane),[x,,z]=riderAt(s,u,v,y),f=addFoe('hracer',x,foeStand(x,y+1,z,3)>0?foeStand(x,y+1,z,3):y,z,{site:s,prov:s.prov.key,ci:(i+dayN)%6,st:'idle',t:99});if(!f)continue;
    f.nm=nameWord('rider',Math.random);f.race=1;f.hold=1;f.holdSp=0;f.lane=lane;f.p=-3;f.sp=7+rlRnd()*1.4;K.push(f);}
  RACE={s:s,T:T,K:K,laps:2,ph:'muster',t:8,done:[],pl:null,plWant:0,cheerT:0};
  toast('A race at '+s.name+'! The riders line up at the chalk line.');hint('race');return RACE;}
function racePlace(f,p){const R=RACE,[u,v]=trackPt(R.T,p,f.lane),[x,,z]=riderAt(R.s,u,v,R.T.y+1),dx=x-f.x,dz=z-f.z;if(Math.hypot(dx,dz)>0.02)f.yaw=f.hd=Math.atan2(dx,dz);f.x=x;f.z=z;const ny=foeStand(x,R.T.y+2,z,3);if(ny>0)f.y=f.gy=ny;}
function raceFrame(dt){const R=RACE;if(!R)return;if(R.K.some(f=>f.dead||f.foe)){raceEnd(true);return;}const Lp=trackLen(R.T),goal=R.laps*Lp;
  for(const f of R.K){if(R.ph==='run'&&f.p<goal){f.sp=Math.max(6.2,Math.min(9.2,f.sp+(rlRnd()-0.5)*dt*2));f.p+=f.sp*dt;if(f.p>=goal){f.p=goal;R.done.push({who:f.nm,t:R.time});}}
    racePlace(f,f.p);f.holdSp=R.ph==='run'&&f.p<goal?f.sp:0;}
  if(R.ph==='run'){R.time+=dt;if((R.cheerT-=dt)<=0){R.cheerT=3;const [x,,z]=riderAt(R.s,0,-R.T.Rr-6,R.T.y+3);if(R.K.some(f=>Math.hypot(f.x-x,f.z-z)<14))riderCheer([x,R.T.y+3,z],false);}
    const P=R.pl;if(P&&!P.fin){const [u,v]=trackPt(R.T,P.cp*Lp/8+Lp/8,0),[x,,z]=riderAt(R.s,u,v,0);if(Math.hypot(x-PL.x,z-PL.z)<7&&PL.ride){P.cp++;if(P.cp>=R.laps*8){P.fin=1;R.done.push({who:'you',t:R.time,me:1});}}}}}
// once a second: the race's order (the line-up, the horn, the finish, the player's place)
function raceTick(){const R=RACE;if(!R){if(rlRnd()<0.2){const s=raceFind();if(s&&folkCount()<FOLK_CAP+8)raceStart(s);}return;}
  const s=R.s;if(Math.hypot(s.X-OX-PL.x,s.Z-OZ-PL.z)>s.R+120){raceEnd(true);return;}
  if(R.ph==='muster'){if((R.t-=1)>0)return;if(R.plWant){const [u,v]=trackPt(R.T,0,0),[x,,z]=riderAt(s,u,v,0);if(PL.ride&&Math.hypot(x-PL.x,z-PL.z)<14){R.pl={cp:0,fin:0};toast('You are at the line with them.');}else toast('You are not mounted at the chalk line; the race goes without you.');}
    R.ph='run';R.time=0;tone(196,262,0.9,0.08);tone(262,330,1,0.07,0.5);toast('The horn! The riders are away.');riderCheer(riderAt(s,0,-R.T.Rr-6,R.T.y+3),true);return;}
  if(R.ph==='run'){const all=R.K.every(f=>f.p>=R.laps*trackLen(R.T)),plDone=!R.pl||R.pl.fin||R.time>R.laps*trackLen(R.T)/5.2;if(!all||!plDone)return;
    const order=R.done.slice().sort((a,b)=>a.t-b.t),i=order.findIndex(q=>q.me);toast('The race at '+s.name+' is run. '+(order[0].me?'You are first past the line!':order[0].who+' wins'+(i>0?'; you came in '+['','second','third','fourth','fifth'][i]:'')+'.'));
    if(i===0)racePlayerWins();else if(i===1){giveCoin(10);riderGain(3,'Second in the race at '+s.name);}riderCheer(riderAt(s,0,-R.T.Rr-6,R.T.y+3),true);raceEnd(false);}}
function racePlayerWins(){RH.rw=(RH.rw||0)+1;saveDirty=true;const got=['3 gold'];giveCoin(30);if(SURV()&&!countOf(456)&&RH.rw===1){addItem(456,1);got.push("the Winner's Bridle");}drawBar(true);
  riderGain(10,'You won the race at '+RACE.s.name);toast('The stands roar. Your prize: '+got.join(' and ')+'.');}
function raceEnd(abort){const R=RACE;if(!R)return;for(const f of R.K)if(!f.dead){f.hold=0;f.race=0;if(Math.hypot(f.x-PL.x,f.z-PL.z)>40)removeFoe(f);else{f.st='idle';f.t=3;}}RACE=null;}
function riderRaceAsk(f){if(!RACE)return '"There is no race today. Come back another day, by daylight."';if(RACE.ph!=='muster')return '"They are away already! Wait for the next one."';
  RACE.plWant=1;return '"Then ride! Be mounted at the chalk line when the horn sounds, and pass every pennon of the course, twice round."';}
// ---- the feast in the golden hall
let FEAST=null;const feastDone=new Set();
function feastTick(){const t=curT(),on=t>0.74&&t<0.96;if(!on){if(FEAST)feastEnd();return;}
  if(FEAST&&Math.hypot(FEAST.x-PL.x,FEAST.z-PL.z)>130)feastEnd();
  if(!FEAST){for(const s of riderSitesNear(70)){if(s.k!=='city'||feastDone.has(s.id+':'+dayN))continue;const L=siteLayout(s),H=L.hall;if(!H)continue;feastDone.add(s.id+':'+dayN);
      const vf=(H.W-1)/2-4,G=[];for(let cb=3;cb<=H.D-7;cb+=2){if(cb%6===0)continue;for(const sd of [1,-1]){if(G.length>=14)break;const [x,y,z]=riderAt(s,H.u0+cb,sd*vf,H.y+1),g=spawnGroup('h_feast',1,x,y,z,0.3,{prov:s.prov.key,site:s})[0];
        if(g){g.hold=1;g.holdSp=0;g.feast=1;g.x=x;g.z=z;g.yaw=g.hd=sd>0?Math.atan2(...dirUV(s,0,1)):Math.atan2(...dirUV(s,0,-1));G.push(g);}}}
      const [bx,by,bz]=riderAt(s,H.u1-5,0,H.y+1),bearer=addFoe(s.prov.capital&&riderSeatLead(s)==='hking'?'hqueen':'hwoman',bx,by,bz,{prov:s.prov.key,site:s,st:'idle',t:99});if(bearer){bearer.feast=1;G.push(bearer);}
      FEAST={s:s,x:bx,y:by,z:bz,G:G,kept:0,told:0,songT:4,bearer:bearer};break;}return;}
  const inHall=riderHallAt(Math.floor(PL.x+OX),Math.floor(PL.z+OZ))===FEAST.s;
  if(inHall&&!FEAST.told){FEAST.told=1;toast('The hall of '+FEAST.s.name+' keeps its feast: the boards are full, the hearth roars, and the cup goes round. Make a boast before the high seat, if you dare.');}
  if(inHall&&FEAST.bearer&&!FEAST.cup&&Math.hypot(FEAST.bearer.x-PL.x,FEAST.bearer.z-PL.z)<7){FEAST.cup=1;toast((FEAST.bearer.kind==='hqueen'?'The queen':'The lady of the hall')+' brings you the cup: "'+RIDER_TONGUE[4][0]+'" ('+RIDER_TONGUE[4][1]+')');tone(523,659,0.4,0.04);}
  if(inHall){FEAST.kept++;if(FEAST.kept>=20&&RH.fe!==dayN){RH.fe=dayN;saveDirty=true;if(SURV()){food=Math.min(20,food+8);hp=Math.min(20,hp+4);drawStats();}riderGain(3,'You kept the feast in the hall of '+FEAST.s.name);}}}
function feastFrame(dt){const F=FEAST;if(!F)return;for(const g of F.G)if(!g.dead&&g.feast&&rlRnd()<dt*0.12)g.cheer=foeClock+1;
  if((F.songT-=dt)<=0){F.songT=22;if(Math.hypot(F.x-PL.x,F.z-PL.z)<40){[392,440,494,523,494,440,392,330,392].forEach((fq,i)=>tone(fq,fq*1.004,0.55,0.022,i*0.5,'triangle',[F.x,F.y+1.5,F.z]));riderCheer([F.x,F.y+1.5,F.z],false);}}}
function feastEnd(){if(!FEAST)return;for(const g of FEAST.G)if(!g.dead&&!g.gone){g.feast=0;g.hold=0;if(Math.hypot(g.x-PL.x,g.z-PL.z)>40)removeFoe(g);else{g.st='idle';g.t=2;}}FEAST=null;}
// the way the site's +u and +v point in the world (for facing)
const dirUV=(s,du,dv)=>{const [a,b]=siteXZ(s,0,0),[c,d]=siteXZ(s,du,dv);return [c-a,d-b];};
function riderBoast(f){if(!FEAST||FEAST.s!==f.site)return '"Boasts are made at the feast."';if(RH.boast===dayN)return '"You have made your boast tonight. Make it good."';if(RH.q)return '"Make good the task you have before you boast another."';
  RH.boast=dayN;saveDirty=true;const q=riderTaskGive(f.site,null,0,1);if(!q)return '"Nothing to boast of tonight? Then drink."';riderCheer([PL.x,PL.y+2,PL.z],true);closeInv();return false;}
// ---- the horse fair: every third day by daylight, dealers and horses by the paddock at a hill town's gate
let FAIRH=null;
function horseFairTick(){const on=dayN%3===2&&curT()>0.3&&curT()<0.7;if(!on){if(FAIRH)horseFairEnd();return;}if(FAIRH){if(Math.hypot(FAIRH.x-PL.x,FAIRH.z-PL.z)>140)horseFairEnd();return;}
  for(const s of riderSitesNear(60)){if(s.k!=='city')continue;const L=siteLayout(s);if(!L.fair)continue;const [x,y,z]=riderAt(s,L.fair.u,L.fair.v,L.fair.y+1),bx=Math.floor(x),bz=Math.floor(z);if(bx<3||bz<3||bx>=W-3||bz>=D-3||!genDone[(bx>>4)+(bz>>4)*NCX])continue;
    const G=spawnGroup('h_fair',3,x-6,y,z,2,{prov:s.prov.key,site:s,lead:'hdealer'}),A=[];for(let i=0;i<5;i++){const ax=x+(rlRnd()-0.5)*6,az=z+(rlRnd()-0.5)*6,ay=standY(ax,y+1,az);if(ay>0)A.push(addAnimal('horse',ax,ay,az,{pen:{x:x,z:z,r:4},fair:1}));}
    FAIRH={s:s,x:x,z:z,G:G,A:A};toast('It is the horse fair at '+s.name+'. The dealers have brought their best.');break;}}
function horseFairEnd(){if(!FAIRH)return;for(const g of FAIRH.G)if(!g.dead&&Math.hypot(g.x-PL.x,g.z-PL.z)>40)removeFoe(g);for(const a of FAIRH.A)if(!a.tame&&!a.dead&&animals.includes(a)&&PL.ride!==a)removeAnimal(a);FAIRH=null;}
// ---- the wild herds of the plains and the windsteeds
let herdT=20;
function wildHerdTick(){if((herdT-=1)>0)return;herdT=50+rlRnd()*50;if(!riderLandNow()&&!['steppe','moors','barrow'].includes(LANDS[colInfo(Math.floor(PL.x+OX),Math.floor(PL.z+OZ),TRLH).land].k))return;
  let n=0;for(const a of animals)if(a.kind==='horse'&&!a.tame&&Math.hypot(a.x-PL.x,a.z-PL.z)<120)n++;if(n>=6)return;
  const a0=rlRnd()*6.283,x=PL.x+Math.cos(a0)*60,z=PL.z+Math.sin(a0)*60,bx=Math.floor(x),bz=Math.floor(z);if(bx<4||bz<4||bx>=W-4||bz>=D-4||!genDone[(bx>>4)+(bz>>4)*NCX])return;
  const id=1e6+Math.floor(rlRnd()*1e6),k=6+Math.floor(rlRnd()*4),ws=!animals.some(a=>a.kind==='windsteed'&&!a.tame)&&rlRnd()<0.22;
  for(let i=0;i<k;i++){const ax=x+(rlRnd()-0.5)*10,az=z+(rlRnd()-0.5)*10,ay=standY(ax,ground[bx+W*bz]+3,az);if(ay<0||wetAt(ax,ay,az))continue;addAnimal(i===0&&ws?'windsteed':'horse',ax,ay,az,{herd:id,young:i>2&&rlRnd()<0.3});}
  if(ws)toast('Far off across the grass a great horse runs with a wild herd, silver as spray.');}
// a windsteed: only a sworn rider may lay a hand on it (from animalAct)
function windTame(a){if(riderRank()<4){toast('The windsteed tosses its head and wheels away. It lets no one near but a sworn rider of the riders.');alarm(a,PL.x,PL.z,8);return true;}
  if(a.tame)return false;a.tame=true;a.uid=a.uid||(Date.now().toString(36)+'w');a.herd=a.id;a.st='idle';a.t=2;saveDirty=true;animalCall(a,false);riderGain(5,'The windsteed lets you lay a hand on its neck. It is yours');return true;}
// ---- the herders at work: a horse-herd with horses or a cowherd with steppe cattle, at the farms and steadings by day
const HWORK=new Set();
function riderWork(){if(ambNight())return;for(const s of riderSitesNear(70)){if((s.k!=='farm'&&s.k!=='village')||HWORK.has(s.id))continue;const q=siteLayout(s).spots.find(p=>p.kind==='field');if(!q)continue;
    const [X,Z]=siteXZ(s,q.u,q.v),x=X-OX+0.5,z=Z-OZ+0.5,bx=Math.floor(x),bz=Math.floor(z);if(bx<3||bz<3||bx>=W-3||bz>=D-3||!genDone[(bx>>4)+(bz>>4)*NCX])continue;HWORK.add(s.id);const y=ground[bx+W*bz]+1;
    const kine=hsh(Math.round(s.X),9927,Math.round(s.Z))<0.5;addFoe('hherd',x,y,z,{prov:s.prov.key,site:s,st:'idle',t:3,spk:'h_field'});
    for(let i=0;i<4;i++){const ax=x+2+rlRnd()*4,az=z+rlRnd()*4-2,ay=standY(ax,y+1,az);if(ay>0)addAnimal(kine?'kine':'horse',ax,ay,az,{pen:{x:x,z:z,r:8},young:i===3&&rlRnd()<0.5});}}
  for(const id of [...HWORK]){if(!riderSitesNear(160).some(s=>s.id===id))HWORK.delete(id);}}
// ---- sparring: three touches wins; the opponent stands and swings, the player's guard turns a swing
let SPAR=null;
function riderSpar(f){if(SPAR)return;f.spar={me:0,them:0,t:45,sw:2.2};f.hold=1;f.holdSp=0;SPAR=f;toast('"With the flat of the blade, then. Three touches!" Strike when you can; raise your guard when they swing.');tone(330,440,0.3,0.05);}
function riderSparHit(f){const S=f.spar;if(!S)return false;S.me++;tone(660,880,0.15,0.05);toast('A touch! ('+S.me+' to '+S.them+')');f.kvx=(f.x-PL.x)*2;f.kvz=(f.z-PL.z)*2;if(S.me>=3)sparEnd(f,1);return true;}
function sparFrame(dt){const f=SPAR;if(!f)return;const S=f.spar;if(!S||f.dead){SPAR=null;return;}const d=Math.hypot(f.x-PL.x,f.z-PL.z);f.yaw=f.hd=Math.atan2(PL.x-f.x,PL.z-f.z);
  if(d>12||(S.t-=dt)<=0){sparEnd(f,0);return;}if((S.sw-=dt)>0)return;S.sw=1.8+rlRnd()*0.8;f.cheer=foeClock+0.6;
  if(d<3.6){const guard=typeof armsGuarding==='function'&&armsGuarding();if(guard){tone(900,700,0.12,0.05);toast('You turn the blade on your guard.');}else{S.them++;tone(220,180,0.2,0.05);toast('Touched! ('+S.me+' to '+S.them+')');if(S.them>=3)sparEnd(f,-1);}}}
function sparEnd(f,res){f.spar=null;f.hold=0;f.st='idle';f.t=2;SPAR=null;
  if(res>0){RH.sp=(RH.sp||0)+1;saveDirty=true;riderGain(4,'You won the bout with '+(f.nm||FOES[f.kind].n));}else toast(res<0?'"Three touches. Again tomorrow?"':'"Enough for today. A fair bout."');}
// ---- the riders of the border: a few horsemen ride up when the player comes into a province of theirs (once in ten minutes)
let borderT=-1e9;
function riderBorderRiders(P){if(RH.pt-borderT<600)return;borderT=RH.pt;const a=PL.yaw,x=PL.x-Math.sin(a)*30,z=PL.z-Math.cos(a)*30,bx=Math.floor(x),bz=Math.floor(z);
  if(bx<3||bz<3||bx>=W-3||bz>=D-3||!genDone[(bx>>4)+(bz>>4)*NCX])return;let n=0;
  for(let i=0;i<3;i++){const f=addFoe(i?'hrider':'hcapt',x+i*2,ground[bx+W*bz]+1,z,{prov:P.key,site:P.sites[0],st:'return',t:6});if(f){f.aid=MN.pt+25;f.hx=PL.x;f.hz=PL.z;n++;}}
  if(n)setTimeout(()=>toast('Riders of '+P.name+' come up at a gallop: "Halt and be known! You ride in '+P.kingdom.name.replace(/^The /,'the ')+'." '+(riderRank()>=2?'They know you, and ride on with a salute.':'They look you over, and let you pass.')),2500);}
// ---- the dawn horn, the hall's smoke, wolves at night, the passing horn
let dawnDay=-1,wolfT=40,hsmokeT=0;
function riderDawn(){const t=curT();if(t<0.24||t>0.3||dawnDay===dayN)return;let s=null,bd=150;for(const q of riderSitesNear(150))if(q.k==='city'||q.k==='fort'){const d=Math.hypot(q.X-OX-PL.x,q.Z-OZ-PL.z);if(d<bd){bd=d;s=q;}}
  if(!s)return;dawnDay=dayN;const at=riderAt(s,0,0,s.T+8);tone(196,262,1.4,0.06,0,'sawtooth',at);tone(262,294,1.6,0.05,1.2,'sawtooth',at);toast('A horn sounds at dawn from the walls of '+s.name);}
function riderHallSmoke(dt){if((hsmokeT-=dt)>0)return;hsmokeT=0.3;const t=curT();if(t>0.3&&t<0.7)return;for(const s of riderSitesNear(90)){if(s.k!=='city')continue;const H=siteLayout(s).hall;if(!H)continue;const [x,,z]=riderAt(s,(H.u0+H.u1)/2,0,0);
  spawnP(x+(rlRnd()-.5),H.y+14+rlRnd(),z+(rlRnd()-.5),(rlRnd()-.5)*0.3,0.8+rlRnd()*0.4,(rlRnd()-.5)*0.3,[0.62,0.6,0.58],3,-0.15);}}
function riderWolves(dt){if((wolfT-=dt)>0)return;wolfT=60+rlRnd()*80;if(!ambNight())return;const land=LANDS[colInfo(Math.floor(PL.x+OX),Math.floor(PL.z+OZ),TRLH).land].k;if(!riderLandNow()&&!['steppe','moors','barrow','tundra'].includes(land))return;
  const a=rlRnd()*6.283,at=[PL.x+Math.cos(a)*90,PL.y+4,PL.z+Math.sin(a)*90];tone(440,620,1.2,0.03,0,'sine',at);tone(620,380,1.8,0.03,1.1,'sine',at);if(rlRnd()<0.5)tone(520,700,1,0.02,2.6,'sine',at);}
let rpassT=0;
function riderPassing(f){if(!f||f.war||f.hst||rpassT>foeClock||!FOES[f.kind].folk||!riderPeopleOf(f)||Math.hypot(f.x-PL.x,f.z-PL.z)>50)return;rpassT=foeClock+30;setTimeout(()=>{const at=[f.x,f.y+4,f.z];tone(147,147,2.2,0.07,0,'sawtooth',at);tone(110,110,2.4,0.05,2,'sawtooth',at);},1500);}
// ---- each frame (from riderFrame)
let rlifeT=0;
function riderLife(dt){raceFrame(dt);feastFrame(dt);sparFrame(dt);riderHallSmoke(dt);riderWolves(dt);if((rlifeT-=dt)>0)return;rlifeT=1;
  raceTick();feastTick();horseFairTick();wildHerdTick();riderWork();riderDawn();}
Object.assign(FOE_HOME,{h_feast:[['hman',2],['hwoman',2],['hspear',1],['hmaid',0.6],['hthane',0.4]]});
