// The life of the elves (D-088): festivals under the stars (dancers circling, singers, lanterns rising; kept with them, the
// player is rested and better thought of, once a night); dawn and dusk with horns and the folk turned to the light; motes of
// light at night in their lands, golden leaves in the wood elves'; the archery contest and its prizes; travellers on their roads,
// some leaving for the havens; a white ship setting sail from a haven; a lament for one of them fallen; their places marked on
// the map with their signs.
setMode('survival');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const TO=[];toast=m=>{if(m)TO.push(m);};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT=9;updFoes(0.05);festFrame(0.05);if(fn)fn();}};
const toPL=(X,Z,y)=>{PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=y!==undefined?y:ground[Math.floor(X-OX)+W*Math.floor(Z-OZ)]+1;};
const clear=()=>{for(const f of [...foes])removeFoe(f);foeSpots.clear();FEST=null;};
const seen=new Set();let eCity=null,wCity=null,hv=null;
for(let i=-25;i<25;i++)for(let j=-25;j<25;j++){const c=stretchCell(landSite(i,j)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const C=realmHeld(c);if(!C)continue;const P=provinceOf(c.i,c.j);
  if(C.k==='elf'&&!eCity)eCity=P.sites.find(s=>s.k==='city'&&siteLayout(s).spots.some(p=>p.kind==='court')&&siteLayout(s).spots.some(p=>p.kind==='drill'));
  if(C.k==='elf'&&!hv)hv=P.sites.find(s=>s.k==='haven');if(C.k==='wood'&&!wCity)wCity=P.sites.find(s=>s.k==='city'&&siteLayout(s).spots.some(p=>p.kind==='range'));}
const spot=(s,k)=>{const p=siteLayout(s).spots.find(q=>q.kind===k),[X,Z]=siteXZ(s,p.u,p.v).map(Math.round);return [X,Z,p.y];};
// ---- a festival on the night of the full moon
{const [X,Z,y]=spot(eCity,'court');gen(X,Z);toPL(X,Z,y+1);clear();settings.time='night';dayN=16;elfLand='e';festT=0;assert(ambNight(),'it is night');festTick();
  const F0=FEST;info('a festival at',F0&&F0.s.name,': dancers',F0?F0.G.filter(g=>g.fest).length:0,'; singers',F0?F0.G.filter(g=>g.sing).length:0,'; the full moon',F0&&F0.moon);
  assert(F0&&F0.G.filter(g=>g.fest).length>=6&&F0.G.filter(g=>g.sing).length>=2,'on the night of the full moon the elves keep festival: a ring of dancers, singers about them');
  const ang=g=>Math.atan2(g.z-(F0.Z-OZ),g.x-(F0.X-OX)),D=F0.G.filter(g=>g.fest),a0=D.map(ang),p0=parts.length;let lan=0;run(20,()=>{lan=Math.max(lan,parts.filter(q=>q.r===1&&q.g>0.8&&q.g<0.85).length);});
  const moved=D.map((g,i)=>{let d=ang(g)-a0[i];while(d<-Math.PI)d+=6.283;while(d>Math.PI)d-=6.283;return d;}),mean=moved.reduce((a,b)=>a+b,0)/moved.length,ring=D.every(g=>Math.abs(Math.hypot(g.x-(F0.X-OX),g.z-(F0.Z-OZ))-F0.r)<2.5);
  info('in twenty seconds the ring turned',mean.toFixed(2),'radians, its dancers on the ring',ring,'; lanterns aloft',lan);assert(mean>1.5&&ring&&lan>=10,'the dancers circle, and lanterns rise into the sky');
  toPL(Math.floor(F0.X),Math.floor(F0.Z),F0.y+1);const s0=EF.e;EF.fe=-1;hp=6;for(let i=0;i<26;i++)festTick();info('kept the festival: standing',s0,'->',EF.e,'; health',hp,'; once a night',EF.fe===dayN);assert(EF.e>s0&&hp===20&&EF.fe===dayN,'keeping the festival with them rests the player, and they think the better of them');
  const s1=EF.e;for(let i=0;i<26;i++)festTick();assert(EF.e===s1,'once a night');
  settings.time='day';festTick();info('at day',FEST);assert(!FEST,'at day the festival is over');clear();}
// ---- dawn and dusk
{const [X,Z,y]=spot(eCity,'court');toPL(X,Z,y+1);settings.time='cycle';foeSpawnTick();const n=foes.filter(f=>!f.dead).length;elfLand='e';elfTod=0.235;tod=0.245;TO.length=0;elfDawnDusk();
  const turned=foes.filter(f=>f.dawn>foeClock).length;info('at dawn:',TO.join(' | '),'; folk turned to the light',turned,'of',n);assert(/dawn/.test(TO.join(' '))&&turned>=Math.min(2,n),'at dawn horns sound and the elves turn to the light to sing');
  elfTod=0.755;tod=0.765;TO.length=0;elfDawnDusk();assert(/dusk/.test(TO.join(' ')),'and at dusk');clear();}
// ---- motes of light, golden leaves
{settings.time='night';elfLand='e';const p0=parts.length;for(let i=0;i<40;i++)elfLights(0.05);const motes=parts.length-p0;elfLand='w';settings.time='day';const p1=parts.length;for(let i=0;i<40;i++)elfLights(0.05);const leaves=parts.length-p1;
  info('motes of light at night',motes,'; golden leaves falling in the wood',leaves);assert(motes>=8&&leaves>=6,'motes of light drift at night in the elves\' lands, golden leaves fall in the wood');settings.time='cycle';}
// ---- the archery contest at the wood's range
{const [X,Z,y]=spot(wCity,'range');gen(X,Z);toPL(X,Z,y+1);clear();foeSpawnTick();const f=foes.find(g=>g.spk==='w_range'&&!FOES[g.kind].civ);assert(!!f,'archers at the range');
  for(let i=0;i<inv.length;i++)inv[i]=null;const r=elfContest(f,'w');const butts=[];for(let dx=-24;dx<=24;dx++)for(let dz=-24;dz<=24;dz++)for(let dy=-4;dy<=6;dy++){const x=Math.floor(f.x)+dx,yy=Math.floor(f.y)+dy,z=Math.floor(f.z)+dz;if(get(x,yy,z)===HAYBALE)butts.push([x,yy,z]);}
  for(let k=0;k<11;k++){const b=butts[k%butts.length];elfArrowIn({x:b[0]+0.5,y:b[1]+0.5,z:b[2]+0.5,byP:1});}const pts=CONTEST.pts;for(let k=0;k<61;k++)contestTick();
  info('the contest: butts',butts.length,'; scored',pts,'; arrows won',countOf(409),'; an elven bow',countOf(407));assert(butts.length>=3&&pts>=10&&countOf(409)===16&&countOf(407)===1&&!CONTEST,'the archery contest scores arrows in the butts and gives its prizes');clear();}
// ---- travellers, the leaving, a white ship
{const [X,Z]=spot(hv,'gate');gen(X,Z);toPL(X,Z);clear();elfLand='e';let G=[];for(let k=0;k<60&&!G.length;k++){travT=0;elfTravel();G=foes.filter(f=>f.trav&&!f.dead);}
  info('travellers on the road:',G.map(f=>FOES[f.kind].n).join(', '),'; leaving for the haven',G.some(f=>f.leave));assert(G.length>=2&&G.every(f=>f.road),'travellers walk the elven ways');
  run(10);const along=G.map(f=>f.road.along);info('their way along the road',along.map(a=>a.toFixed(0)).join(','));clear();
  const L=siteLayout(hv),[QX,QZ]=siteXZ(hv,L.qL,0);toPL(Math.round(QX),Math.round(QZ),SEA+3);shipT=0;TO.length=0;elfShipTick();const S=elfShips[0];assert(!!S,'a white ship sets sail from the haven');
  const x0=S.X,z0=S.Z;for(let i=0;i<400;i++)elfShipFrame(0.05);const [u0]=siteUV(hv,x0,z0),[u1]=siteUV(hv,S.X,S.Z);info('the white ship: out along the harbour',(u1-u0).toFixed(1),'blocks in twenty seconds;',TO[0]);
  assert(u1-u0>15,'the white ship sails out of the haven into the west');while(elfShips.length)elfShipFrame(200);}
// ---- a lament; the map's signs
{const f=addFoe('elady',PL.x+2,PL.y,PL.z,{site:eCity,prov:eCity.prov.key});lamentT=0;elfLament(f);info('a lament is sung',lamentT>foeClock);assert(lamentT>foeClock,'the elves sing a lament for one of them fallen near');removeFoe(f);
  places.length=0;notePlace(eCity.name,eCity.X,eCity.Z);notePlace(wCity.name,wCity.X,wCity.Z);let ru=null;for(let i=-40;i<40&&!ru;i++)for(let j=-40;j<40&&!ru;j++)ru=elderAt(i,j);notePlace(ru.name,ru.X,ru.Z);
  const sv=mapSave().pl;info('on the map:',sv.map(p=>p[0]+' '+(p[3]||'')).join('; '));assert(sv.length===3&&sv[0][3]==='e'&&sv[1][3]==='w'&&sv[2][3]==='r','the elves\' places are marked on the map with their signs');places.length=0;}
setMode('creative');settings.time='cycle';
