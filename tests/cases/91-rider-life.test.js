// The life of the riders (D-090): the race at the course (four riders, two laps, the finish; the player's own race, ridden past
// every pennon, won); the feast in the golden hall (the boards full, the cup brought, kept and fed; a boast); the horse fair;
// the wild herds and a windsteed among them; herders at work; sparring to three touches; the riders of the border; the dawn
// horn; wolves at night; the passing horn; the riders' beacons lit across a kingdom; the map's signs.
setMode('survival');settings.time='cycle';
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const TO=[];toast=m=>{if(m)TO.push(m);};let shown=null;showText=(t,x)=>{shown=[t,x];};let tones=0;const tone0=tone;tone=(...a)=>{tones++;};
const at=(s,u,v)=>siteXZ(s,u,v).map(Math.round);
const toPL=(X,Z,y)=>{PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=y!==undefined?y:ground[X-OX+W*(Z-OZ)]+1;};
const clear=()=>{for(const f of [...foes])removeFoe(f);foeSpots.clear();for(const a of [...animals])removeAnimal(a);};
RH.r=40;RH.sw=0;RH.th='';RH.q=null;RH.rw=0;RH.sp=0;RH.fe=-1;for(let i=0;i<inv.length;i++)inv[i]=null;
const seen=new Set(),S={city:[],course:[],farm:[],outpost:[],village:[]};
for(let i=-30;i<30;i++)for(let j=-30;j<30;j++){const c=stretchCell(landSite(i,j)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const C=realmHeld(c);if(!C||C.k!=='horse')continue;
  for(const s of provinceOf(c.i,c.j).sites)if(S[s.k])S[s.k].push(s);}
// ---- the race
{const s=S.course[0],T=siteLayout(s).track;gen(s.X,s.Z);toPL(s.X,s.Z);clear();tod=0.45;RACE=null;const R=raceStart(s);info('the race at',s.name,':',R.K.map(f=>f.nm).join(', '));
  assert(R.K.length===4&&R.K.every(f=>f.kind==='hracer'&&!isBlockedName(f.nm)),'a race: four riders in their silks at the chalk line');
  for(let i=0;i<9;i++)raceTick();assert(RACE.ph==='run','the horn, and they are away');let k=0;for(;k<2000&&RACE&&!RACE.K.every(f=>f.p>=RACE.laps*trackLen(T));k++)raceFrame(0.05);
  const lap=Math.max(...RACE.K.map(f=>f.p))/trackLen(T);TO.length=0;raceTick();info('ridden in',(k*0.05).toFixed(1),'seconds,',lap.toFixed(2),'laps; ',TO.join(' | '));assert(!RACE&&lap>=2&&TO.some(m=>/race at .* is run/.test(m)),'two laps of the oval, and a winner past the line');
  // the player's race
  clear();RACE=null;raceStart(s);const j=foes.find(f=>f.kind==='hracer');const r=riderRaceAsk(j);const h=riderLeadOut('horse',2);PL.ride=h;const [u0,v0]=trackPt(T,0,0),[X0,Z0]=siteXZ(s,u0,v0);toPL(Math.round(X0),Math.round(Z0),T.y+1);
  for(let i=0;i<9;i++)raceTick();assert(RACE.pl,'mounted at the chalk line, the player rides the race');let p=0;
  for(let i=0;i<4000&&RACE&&!RACE.pl.fin;i++){p+=10*0.05;const [u,v]=trackPt(T,p,0),[X,Z]=siteXZ(s,u,v);PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;raceFrame(0.05);}
  info('the player\'s race: pennons passed',RACE&&RACE.pl.cp,'finished',RACE&&RACE.pl.fin);for(let i=0;i<4000&&RACE&&!RACE.K.every(f=>f.p>=RACE.laps*trackLen(T));i++)raceFrame(0.05);TO.length=0;raceTick();
  info(TO.join(' | '),'; races won',RH.rw,'; the winner\'s bridle',countOf(456));assert(RH.rw===1&&countOf(456)===1,'the player who rides past every pennon first wins the race and the winner\'s bridle');PL.ride=null;clear();}
// ---- the feast
{const s=S.city.find(c=>c.prov.capital),L=siteLayout(s),H=L.hall,[X,Z]=at(s,(H.u0+H.u1)>>1,1);gen(X,Z);toPL(X,Z,H.y+1);clear();tod=0.8;FEAST=null;feastDone.clear();TO.length=0;feastTick();
  info('the feast at',s.name,': at the boards',FEAST&&FEAST.G.length,'; the cup-bearer',FEAST&&FEAST.bearer&&FOES[FEAST.bearer.kind].n);assert(FEAST&&FEAST.G.length>=8&&FEAST.bearer,'the golden hall keeps its feast, the boards full, the cup going round');
  const b=FEAST.bearer;PL.x=b.x+1;PL.z=b.z;const f0=(food=4);for(let i=0;i<21;i++)feastTick();info(TO.slice(0,3).join(' | '),'; food',f0,'->',food);assert(FEAST.cup&&RH.fe===dayN&&food>f0,'the cup is brought, and whoever keeps the feast is fed and the better thought of');
  const [sx,sz]=at(s,siteLayout(s).spots.find(p=>p.kind==='seat').u,0);foeSpawnTick();const ruler=foes.find(f=>f.spk==='h_seat'&&(f.kind==='hking'||f.kind==='hqueen'||f.kind==='hthane'));RH.q=null;RH.boast=-1;
  if(ruler){riderBoast(ruler);info('a boast:',RH.q&&RH.q.n);assert(RH.q&&RH.q.boast,'a boast made before the high seat at the feast');RH.q=null;}
  tod=0.5;feastTick();assert(!FEAST,'the feast ends with the night');clear();}
// ---- the horse fair
{const s=S.city[0],L=siteLayout(s);const [X,Z]=at(s,L.fair.u,L.fair.v);gen(X,Z);toPL(X,Z);clear();tod=0.5;while(dayN%3!==2)dayN++;FAIRH=null;TO.length=0;horseFairTick();
  info('the horse fair at',s.name,': dealers',FAIRH&&FAIRH.G.filter(f=>f.kind==='hdealer').length,'; horses',FAIRH&&FAIRH.A.length);assert(FAIRH&&FAIRH.G.some(f=>f.kind==='hdealer')&&FAIRH.A.length>=3,'the horse fair: dealers and their horses by the paddock');
  dayN++;horseFairTick();assert(!FAIRH,'the fair is over the next day');clear();}
// ---- the wild herds and a windsteed
{const s=S.farm[0];gen(s.X+80,s.Z);toPL(s.X+80,s.Z);clear();let ws=null,n=0;for(let k=0;k<40&&!ws;k++){for(const a of [...animals])removeAnimal(a);herdT=0;wildHerdTick();n=Math.max(n,animals.filter(a=>a.kind==='horse').length);ws=animals.find(a=>a.kind==='windsteed');}
  info('a wild herd of',n,'horses; a windsteed with one',!!ws);assert(n>=5&&ws&&!ws.tame,'wild herds run on the riders\' lands, and now and then a windsteed with them');clear();}
// ---- herders at work
{const s=S.farm[0];gen(s.X,s.Z);toPL(s.X,s.Z);clear();tod=0.5;HWORK.clear();riderWork();const h=foes.find(f=>f.kind==='hherd'&&f.spk==='h_field'),A=animals.filter(a=>(a.kind==='kine'||a.kind==='horse')&&a.pen);
  info('at',s.name,': a herd',!!h,'; beasts',A.map(a=>a.kind).join(','));assert(h&&A.length>=3,'herders at work with horses or steppe cattle');clear();}
// ---- sparring
{const s=S.city[0];toPL(s.X,s.Z);const f=addFoe('hmaid',PL.x+2,PL.y,PL.z,{site:s,prov:s.prov.key,st:'idle',t:9});const r0=RH.r;riderSpar(f);f.spar.sw=0;sparFrame(0.1);const them=f.spar.them;
  for(let i=0;i<3;i++)foeStruck(f,5,1,0);info('sparring: touched',them,'; won',RH.sp,'; standing',r0,'->',RH.r,'; health',f.hp);assert(them===1&&RH.sp===1&&RH.r>r0&&f.hp===FOES.hmaid.hp&&!folkWrath(f),'sparring to three touches: no harm done, the bout won');clear();}
// ---- the riders of the border
{const s=S.village[0];gen(s.X,s.Z);toPL(s.X,s.Z);clear();riderProv='elsewhere';riderBorderSeen=1;borderT=-1e9;riderBorder();const R=foes.filter(f=>(f.kind==='hrider'||f.kind==='hcapt')&&f.aid>MN.pt);info('riders of the border come up:',R.length);assert(R.length>=2,'the riders of the border ride up to see who comes');clear();}
// ---- the dawn horn, wolves at night, the passing horn
{const s=S.city[0];gen(s.X,s.Z);toPL(s.X+30,s.Z);tod=0.26;dawnDay=-1;TO.length=0;riderDawn();info(TO.join(' | '));assert(TO.some(m=>/horn sounds at dawn/.test(m)),'a horn at dawn from the walls of the hill town');
  tod=0.9;wolfT=0;tones=0;riderWolves(0.1);info('wolves howl:',tones,'notes');assert(tones>=2,'wolves howl far off on the plains at night');
  const f=addFoe('hman',PL.x+3,PL.y,PL.z,{site:s,prov:s.prov.key,st:'idle',t:9});rpassT=0;riderPassing(f);assert(rpassT>foeClock,'a low horn for one of the folk fallen near by');clear();}
// ---- the riders' beacons
{const s=S.outpost[0],L=siteLayout(s),p=L.parts.find(q=>q.k==='pyre');gen(s.X,s.Z);const [X,Z]=at(s,p.cu,p.cv);let y=0;for(let yy=s.T;yy<s.T+12;yy++)if(get(X-OX,yy,Z-OZ)===BRAZIER)y=yy;
  toPL(X+3,Z);BEACONS.length=0;TO.length=0;const r0=RH.r;useBeacon(X-OX,y,Z-OZ);info(TO[0],'; beacons',BEACONS.length);assert(BEACONS.length>=2&&RH.r>r0,'a beacon of the riders lit is answered across the kingdom');BEACONS.length=0;clear();}
// ---- the map's signs
{const s=S.village[0];places.length=0;notePlace(s.name,s.X,s.Z);let o=null;for(let i=-90;i<90&&!o;i++)for(let j=-90;j<90&&!o;j++){const q=fathersAt(i,j);if(q&&q.name)o=q;}notePlace(o.name,o.X,o.Z);
  info('the map:',places.map(p=>p.n+' ('+p.e+')').join(', '));assert(places[0].e==='h'&&places[1].e==='g','the riders\' places and the forefathers\' ruins have their signs on the map');}
tone=tone0;setMode('creative');
