// The life of the white realm (D-089): the tourney at the lists (knights riding bouts down the tilt; the player's own bout, won
// with a lance aimed true); caravans on the king's roads and a wagon guarded to its end; bells at the hours, market day, the night
// watch, a minstrel at the inn of an evening, smoke from the chimneys; beacons lit across a kingdom; the village fair about the
// maypole; shepherds and ploughmen; a cog of the realm putting out from a port; the silver tree in flower; the realm's places
// and the old kingdom's ruins marked on the map with their signs.
setMode('survival');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const B=(X,Y,Z)=>get(X-OX,Y,Z-OZ);const TO=[];toast=m=>{if(m)TO.push(m);};showText=()=>{};
const at=(s,u,v)=>siteXZ(s,u,v).map(Math.round);
const toPL=(X,Z,y)=>{PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=y!==undefined?y:ground[X-OX+W*(Z-OZ)]+1;};
const clear=()=>{for(const f of [...foes])removeFoe(f);foeSpots.clear();for(const a of [...animals])removeAnimal(a);};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT=9;updFoes(0.05);if(fn)fn();}};
MN.r=100;MN.kn=0;MN.q=null;
const seen=new Set(),S={city:null,cap:null,lists:null,village:null,farm:null,port:null,outpost:null};
for(let i=-30;i<30;i++)for(let j=-30;j<30;j++){const c=stretchCell(landSite(i,j)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const C=realmHeld(c);if(!C||C.k!=='white')continue;const P=provinceOf(c.i,c.j);
  for(const s of P.sites){if(s.k==='city'&&!S.city&&siteLayout(s).inn&&siteLayout(s).spots.some(p=>p.kind==='inn'))S.city=s;if(s.k==='city'&&P.capital&&!S.cap)S.cap=s;if(s.k==='lists'&&!S.lists)S.lists=s;
    if(s.k==='village'&&!S.village&&s.R>=24)S.village=s;if(s.k==='farm'&&!S.farm)S.farm=s;if(s.k==='port'&&!S.port&&siteLayout(s).ships.length)S.port=s;if(s.k==='outpost'&&!S.outpost&&P.sites.filter(q=>q.k==='outpost').length>=2)S.outpost=s;}}
const spot=(s,k)=>{const p=siteLayout(s).spots.find(q=>q.kind===k),[X,Z]=at(s,p.u,p.v);return [X,Z,p.y];};
settings.time='cycle';
// ---- the tourney
{const s=S.lists;gen(s.X,s.Z);toPL(s.X,s.Z,s.T+1);clear();tod=0.45;TOUR=null;tourDone.clear();TO.length=0;tourStart(s);const T=TOUR;info('the tourney at',s.name,': knights',T.K.map(f=>f.nm+' ('+FOES[f.kind].n+')').join(', '));
  assert(T.K.length===4&&T.K.every(f=>f.kind==='rjoust'&&!isBlockedName(f.nm.split(' ')[0])),'a tourney: knights in their own colours ride out to the lists, named');
  let passes=0,bouts=0;for(let k=0;k<300&&TOUR&&bouts<2;k++){for(let i=0;i<20;i++)tourFrame(0.05);tourTick();passes=Math.max(passes,TOUR?TOUR.pass:0);bouts=TOUR?TOUR.bout:bouts;}
  info('bouts ridden',bouts,'; what was cried:',TO.filter(m=>/bout|lance|unhorse|glance/.test(m)).slice(0,5).join(' | '));assert(bouts>=2&&TO.some(m=>/has the bout/.test(m)),'the knights ride bouts down the tilt, pass by pass, and the herald cries the victor');
  // the player's bout: mounted, lance in hand, at a gallop, aimed at the knight as they pass
  const k=TOUR?TOUR.K[0]:null;if(!TOUR)tourStart(s);const KK=TOUR.K[0];TOUR.pl={pts:0};TOUR.a=KK;const h=addAnimal('horse',PL.x,PL.y,PL.z,{tame:true});PL.ride=h;inv[sel]={id:413,c:1};
  KK.x=PL.x;KK.z=PL.z-6;PL.yaw=0;PL.pitch=0;PL.vx=0;PL.vz=-7;const dd=camDir();KK.x=PL.x+dd.x*6;KK.z=PL.z+dd.z*6;const seq=[0.1,0.9,0.9];let q=0;const res=tourPlayerPass(KK,()=>seq[q++%3]);
  info('the player\'s pass:',TO[TO.length-1],'->',res);assert(res==='player','a lance aimed true at a gallop unhorses the knight');const c0=countOf(440);MN.tw=0;tourPlayerWins();
  info('the prize: a circlet',countOf(440)-c0,'; tourneys won',MN.tw);assert(countOf(440)===c0+1&&MN.tw===1,'the victor of a bout is given a purse, and the first time the champion\'s circlet');
  PL.ride=null;removeAnimal(h);tourEnd(true);}
// ---- caravans on the king's roads; a wagon guarded to its end
{const s=S.city,P=s.prov,t=P.sites.find(o=>o!==s&&menRouteOf(P,s,o));const route=menRouteOf(P,s,t);info('a road from',s.name,'to',t.name,':',route.length,'points');assert(route.length>=2,'a caravan finds its way along the king\'s roads');
  const [X,Z]=sitePort(s).map(Math.round);gen(X,Z);toPL(X,Z);clear();MN.q=null;menTaskGive(s,'escort');MN.q.tn=t.name;MN.q.X=t.X;MN.q.Z=t.Z;carTick();const C=CARAVANS.find(c=>c.esc);
  info('the escort: a wagon',!!C,'with guards',C&&C.G.map(g=>FOES[g.kind].n).join(', '));assert(C&&C.G.length===2,'the wagon sets out with its guards');
  const p0=MN.r,[x0,z0]=carPos(C);for(let i=0;i<20;i++)carFrame(0.5);const [x1,z1]=carPos(C);info('it goes along the road',Math.round(Math.hypot(x1-x0,z1-z0)),'blocks in ten seconds');assert(Math.hypot(x1-x0,z1-z0)>8,'the wagon goes along the road');
  C.t=0.999;carFrame(0.5);info('arrived: the task done',!MN.q,'; renown',p0,'->',MN.r);assert(!MN.q&&MN.r>p0&&!CARAVANS.includes(C),'a wagon guarded to its end is a task done');}
// ---- the city's day: bells, market day, the watch, a minstrel, chimney smoke
{const s=S.city;gen(s.X,s.Z);const [X,Z,y]=spot(s,'crier');toPL(X,Z,y+1);clear();let tones=0;const t0=tone;tone=(...a)=>{tones++;};menHour=-1;tod=0.49;menBells();tod=0.51;menBells();tone=t0;
  info('at noon the bells ring: strokes',tones);assert(tones>=4,'bells ring the hours from the city\'s towers');
  dayN=3;tod=0.45;MARKET.clear();const n0=foes.length;menMarketDay();info('market day: folk added',foes.length-n0,TO[TO.length-1]);assert(foes.length>n0&&/market day/.test(TO[TO.length-1]),'every third day is market day');
  settings.time='night';WATCH.clear();menWatch();const w=foes.filter(f=>f.kind==='rwatch');info('at night: the watch',w.length);assert(w.length>=2,'the night watch goes round the city with lanterns');
  const W0=[...WATCH.values()][0],p=W0.pts[1];for(const g of W0.G){g.x=p[0];g.z=p[2];}for(let i=0;i<3;i++)menWatch();info('the watch walks its round: waypoint',W0.i);assert(W0.i!==1,'the watch walks its round');settings.time='cycle';
  tod=0.8;MINST.clear();const [IX,IZ,iy]=spot(s,'inn');toPL(IX,IZ,iy+1);menMinstrel();info('of an evening at the inn: a minstrel',foes.some(f=>f.kind==='rminst'));assert(foes.some(f=>f.kind==='rminst'),'a minstrel plays at the inn of an evening');
  SMOKE.clear();const p0=parts.length;smokeT=0;menSmoke(0.6);info('smoke from the chimneys:',parts.length-p0,'puffs from',(SMOKE.get(s.id)||[]).length,'stacks');assert(parts.length>p0,'smoke rises from the chimneys of the realm');clear();WATCH.clear();}
// ---- beacons
{const s=S.outpost;gen(s.X,s.Z);toPL(s.X,s.Z);BEACONS.length=0;TO.length=0;const tw=siteLayout(s).parts.find(p=>p.k==='tower'),[TX,TZ]=at(s,tw.cu,tw.cv);let by=-1;for(let yy=s.T;yy<s.T+40;yy++)if(B(TX,yy,TZ)===BRAZIER)by=yy;
  assert(by>0,'a fire basket burns on the watchtower');const r=useBeacon(TX-OX,by,TZ-OZ);for(let i=0;i<300;i++)beaconFrame(0.1);
  info('the beacon lit: beacons answering',BEACONS.length,'; cried',TO.filter(m=>/beacon/i.test(m)).slice(0,3).join(' | '));assert(r&&BEACONS.length>=2&&TO.some(m=>/The beacon of /.test(m)),'a beacon lit is answered by the beacons of the kingdom, one after another');BEACONS.length=0;clear();}
// ---- the village fair
{const s=S.village;gen(s.X,s.Z);const [X,Z,y]=spot(s,'fair');toPL(X+3,Z+3,y+1);clear();FAIR=null;dayN=5;tod=0.8;fairTick();const F=FAIR;info('the fair at',F&&F.s.name,': dancers',F&&F.G.length);assert(F&&F.G.length>=6,'every fourth evening the village keeps its fair, dancing about the maypole');
  const a0=F.G.map(g=>g.fest.a);for(let i=0;i<200;i++)fairFrame(0.05);const turned=F.G.every((g,i)=>g.fest.a-a0[i]>1);MN.fair=-1;const r0=MN.r;for(let i=0;i<22;i++)fairTick();
  info('the dance turns',turned,'; kept: renown',r0,'->',MN.r);assert(turned&&MN.r>r0&&MN.fair===dayN,'the dancers go round, and whoever keeps the fair is fed and thought the better of');tod=0.3;fairTick();assert(!FAIR,'by day the fair is over');clear();}
// ---- the countryside at work
{const s=S.farm;gen(s.X,s.Z);toPL(s.X,s.Z);clear();WORK.clear();tod=0.45;menWork();const w=foes.filter(f=>f.kind==='rshep'||f.kind==='rfarmer'),an=animals.filter(a=>a.kind==='sheep'||a.kind==='ox');
  info('at work about',s.name,':',w.map(f=>FOES[f.kind].n).join(', '),'with',an.map(a=>ANIMALS[a.kind].n).join(', '));assert(w.length===1&&an.length>=1,'a shepherd with his flock, or a ploughman with his ox, works the fields');clear();}
// ---- a cog at a port
{const s=S.port,L=siteLayout(s);gen(...at(s,L.qL,0));toPL(...at(s,L.qL-4,0),SEA+3);MEN_SHIPS.length=0;mshipT=0;TO.length=0;menShipTick();const sh=MEN_SHIPS[0];assert(!!sh,'a cog of the realm comes or goes at the port');
  const x0=sh.X,z0=sh.Z;for(let i=0;i<200;i++)menShipFrame(0.05);info(TO[0],': it moves',Math.round(Math.hypot(sh.X-x0,sh.Z-z0)),'blocks in ten seconds');assert(Math.hypot(sh.X-x0,sh.Z-z0)>4,'and sails');while(MEN_SHIPS.length)menShipFrame(300);}
// ---- the silver tree in flower
{const s=S.cap,L=siteLayout(s);gen(...at(s,L.tree[0],0));toPL(...at(s,L.tree[0]-6,0),L.tree[2]+1);MN.kn=1;const p0=parts.length;for(let i=0;i<20;i++)menTreeBloom(0.2);info('petals falling from the silver tree',parts.length-p0);assert(parts.length>p0,'the silver tree is in flower for a knight of the realm');MN.kn=0;}
// ---- the map's signs
{places.length=0;notePlace(S.city.name,S.city.X,S.city.Z);let o=null;for(let i=-60;i<60&&!o;i++)for(let j=-60;j<60&&!o;j++)o=oldAt(i,j);notePlace(o.name,o.X,o.Z);const sv=mapSave().pl;
  info('on the map:',sv.map(p=>p[0]+' '+(p[3]||'')).join('; '));assert(sv[0][3]==='m'&&sv[1][3]==='o','the realm\'s places and the old kingdom\'s ruins are marked with their signs');places.length=0;}
setMode('creative');
