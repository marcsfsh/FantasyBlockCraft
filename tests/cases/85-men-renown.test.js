// Renown in the white realm (D-089): its ranks and their gifts; speaking with its folk and their greetings; trade for coin; the
// inn's bed, meal and rumours; healers, smiths and grooms; the crier; justice (amends for a blow, outlawry for a death and its
// fine); notice boards and the realm's tasks (a writ carried, a bounty earned, supplies brought, a relic of the old kings, a lost
// child led home); the horn of the realm; milestones; the chronicles of the kings at a lectern and in the journal; effigies; the
// ruins of the old kingdom in the discovery log.
setMode('survival');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const B=(X,Y,Z)=>get(X-OX,Y,Z-OZ);const TO=[];toast=m=>{if(m)TO.push(m);};let shown=null;showText=(t,x)=>{shown=[t,x];};
const reset=()=>{MN.r=0;MN.kn=0;MN.g=0;MN.q=null;MN.tl=[];MN.tln={};MN.au={};MN.out={};MN.lord='';for(let i=0;i<inv.length;i++)inv[i]=null;};
const at=(s,u,v)=>siteXZ(s,u,v).map(Math.round);
const toPL=(X,Z,y)=>{PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=y!==undefined?y:ground[X-OX+W*(Z-OZ)]+1;};
const clear=()=>{for(const f of [...foes])removeFoe(f);foeSpots.clear();};
reset();
const seen=new Set();let city=null,hal=null;
for(let i=-30;i<30;i++)for(let j=-30;j<30;j++){const c=stretchCell(landSite(i,j)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const C=realmHeld(c);if(!C||C.k!=='white')continue;const P=provinceOf(c.i,c.j);
  if(!city)city=P.sites.find(s=>s.k==='city'&&['market','heal','inn','stable','crier','smithy'].every(q=>siteLayout(s).spots.some(p=>p.kind===q)));if(!hal)hal=P.sites.find(s=>s.k==='hallows');}
const spot=(s,k)=>{const p=siteLayout(s).spots.find(q=>q.kind===k),[X,Z]=at(s,p.u,p.v);return [X,Z,p.y];};
const folkAt=(s,k,kind)=>{const [X,Z,y]=spot(s,k);gen(X,Z);toPL(X,Z,y+1);clear();foeSpawnTick();return foes.find(f=>!f.dead&&(kind?f.kind===kind:f.spk==='r_'+k));};
// ---- ranks and gifts
{assert(menRank()===0&&menRankName()==='Stranger','a stranger to the realm at first');menGain(12,null);menRankUp(1);const ch=countOf(431);menGain(20,null);menRankUp(2);
  info('renown',MN.r,'(',menRankName(),'); cheese given',ch,'; the horn of the realm',countOf(436));assert(menRank()===2&&ch>=2&&countOf(436)===1,'renown rises through the ranks, each with its gift');
  MN.r=200;assert(menRank()===3,'no one is a knight of the realm but by the dubbing');MN.kn=1;assert(menRank()===4,'a knight once dubbed');MN.r=300;assert(menRank()===5,'a knight of great renown is a lord');MN.kn=0;MN.r=32;}
// ---- speaking with them; greetings; trade
{const m=folkAt(city,'market','rmerch');assert(!!m,'merchants keep the market');menTalk(m);info('speaking with',FOES[m.kind].n,': the panel open',invOpen);assert(invOpen,'speaking with one of them opens what they will say and do');closeInv();
  addItem(204,10);const mp=countOf(433),p0=purse(),r=menBuy(433,5,2),p1=purse();addItem(352,4);const r2=menSell(352,3,4),p2=purse();
  info('trade:',r,'; purse',p0,'->',p1,';',r2,'; purse',p2);assert(p1===p0-menPrice(5)*2&&p2===p1+menOffer(3)*4&&countOf(433)===mp+2,'the realm\'s merchants trade for coin, buying and selling');
  MN.kn=1;const g=menGreet(m,FOES[m.kind]);info('a knight is greeted:',g,'; bowing',m.bow>foeClock);assert(/good knight|my lord/.test(g)&&m.bow>foeClock,'the folk bow to a knight of the realm');MN.kn=0;}
// ---- the inn, the healer, the smith, the groom, the crier
{const k=folkAt(city,'inn','rinn');assert(!!k,'an innkeeper keeps the inn');settings.time='cycle';tod=0.9;const d0=dayN;addItem(204,5);const r=menInn(k);info('the inn:',r,'; spawn',spawnW.map(Math.round).join(','),'; time',tod.toFixed(2),'day',d0,'->',dayN);
  assert(Math.hypot(spawnW[0]-(PL.x+OX),spawnW[2]-(PL.z+OZ))<1&&tod<0.3&&dayN===d0+1,'a bed at the inn: the night passes and the player will wake there');
  food=5;const r2=menMeal();info(r2,'; food',food);assert(food>=15,'a meal at the inn');TO.length=0;const r3=menRumour();info('a rumour:',r3);assert(r3.length>20,'the inn has its rumours');
  const h=folkAt(city,'heal','rheal');assert(!!h,'a healer keeps the house of healing');hp=5;const r4=menHeal();info(r4,'; health',hp);assert(hp===20,'the healers heal');
  inv[0]={id:437,c:1,d:900};const r5=menMend();info(r5,'; wear',inv[0].d);assert(inv[0].d===0,'the smiths mend arms and tools');
  addItem(205,1);const n0=animals.filter(a=>a.tame&&a.kind==='horse').length,r6=menHorse();info(r6);assert(animals.filter(a=>a.tame&&a.kind==='horse').length===n0+1,'the grooms sell horses');
  const c=folkAt(city,'crier','rcrier');assert(!!c,'the crier stands by the notice board');info(menNews());}
// ---- justice: amends for a blow, outlawry for a death
{const g=folkAt(city,'market','rmerch'),r0=MN.r;menStruck(g);info('struck one of the folk: renown',r0,'->',MN.r);assert(MN.r<r0,'striking the realm\'s folk costs renown');
  menSlain(g);const K=g.site.prov.kingdom;info('slew one: outlawed in',K.name,menOutlaw(g),'; the folk turn on the player',folkWrath(g));assert(menOutlaw(g)&&folkWrath(g),'whoever slays one of its folk is outlawed in the kingdom');
  addItem(205,3);const r=menAmends(g);info(r,'; still outlawed',menOutlaw(g));assert(!menOutlaw(g)&&!folkWrath(g),'a fine paid at a captain or a lord ends the outlawry');MN.r=40;}
// ---- the notice board and the realm's tasks
{const [X,Z,y]=spot(city,'crier');gen(X,Z);let nb=null;for(let dx=-4;dx<=4&&!nb;dx++)for(let dz=-4;dz<=4&&!nb;dz++)for(let dy=-1;dy<=3;dy++)if(B(X+dx,y+dy,Z+dz)===NOTICE){nb=[X+dx-OX,y+dy,Z+dz-OZ];break;}
  assert(!!nb,'a notice board stands in the square');invOpen=false;useNotice(...nb);info('the notice board: the panel open',invOpen);assert(invOpen,'the notice board offers the realm\'s tasks');closeInv();
  const s=city;let q=menTaskGive(s,'writ');info('a task:',q&&q.n);assert(q&&countOf(439)===1,'a writ to carry, put in the hand');toPL(Math.round(q.X),Math.round(q.Z),SEA+40);const r0=MN.r,p0=purse();menTaskTick();
  info('the writ delivered: renown',r0,'->',MN.r,'; paid',purse()-p0);assert(!MN.q&&MN.r>r0&&purse()>p0&&countOf(439)===0,'a writ carried to its place is paid for');
  q=menTaskGive(s,'bounty');const n=q.c;for(let i=0;i<n;i++)menSlain({kind:'raider',x:PL.x,z:PL.z,y:PL.y});info('the bounty: creatures left',MN.q.c,'; ready',menTaskReady(MN.q));assert(menTaskReady(MN.q),'creatures of the wastes slain earn the bounty');menTaskDone();
  q=menTaskGive(s,'supply');addItem(q.it,q.need);assert(menTaskReady(MN.q),'supplies brought');menTaskDone();assert(!MN.q&&countOf(q.it)===0,'and handed over');
  q=menTaskGive(s,'relic');info('a relic:',q.n);gen(Math.round(q.X),Math.round(q.Z));toPL(Math.round(q.X),Math.round(q.Z));menTaskTick();const got=countOf(q.it);toPL(Math.round(q.fx),Math.round(q.fz),SEA+40);menTaskTick();
  info('found',got,'; brought back, the task done',!MN.q);assert(got===1&&!MN.q,'a relic of the old kings found in their ruins and brought back');
  q=menTaskGive(s,'lost');gen(Math.round(q.X),Math.round(q.Z));toPL(Math.round(q.X),Math.round(q.Z));clear();menTaskTick();const L=menLostF;info('a lost child:',L&&FOES[L.kind].n,L&&L.nm);assert(L&&(L.kind==='rchild'||L.kind==='rgirl'),'the lost child is found where the task leads');
  L.x=PL.x+1;L.z=PL.z;menTaskTick();assert(MN.q.found,'and follows');L.x=q.fx-OX;L.z=q.fz-OZ;menTaskTick();info('brought home: the task done',!MN.q);assert(!MN.q,'and is brought home');}
// ---- the horn of the realm
{const [X,Z,y]=spot(city,'market');gen(X,Z);toPL(X,Z,y+1);clear();MN.hn=-1e9;const r=menHorn(),G=foes.filter(f=>f.aid>MN.pt&&!f.dead);info('the horn of the realm: soldiers come',G.map(f=>FOES[f.kind].n).join(', '));assert(r&&G.length>=2,'the horn of the realm calls its soldiers');clear();}
// ---- a milestone; the chronicles of the kings; an effigy; the old kingdom's ruins found
{const rd=city.prov.roads.find(r=>r.k==='high'&&r.len>100),mid=[Math.round((rd.a[0]+rd.b[0])/2),Math.round((rd.a[1]+rd.b[1])/2)];gen(mid[0],mid[1]);let ms=null;
  for(let dx=-80;dx<=80&&!ms;dx++)for(let dz=-80;dz<=80&&!ms;dz++){const x=mid[0]+dx-OX,z=mid[1]+dz-OZ;if(x<0||z<0||x>=W||z>=D)continue;const g=ground[x+W*z];for(let yy=g-3;yy<=g+3;yy++)if(get(x,yy,z)===MILESTONE){ms=[x,yy,z];break;}}
  assert(!!ms,'a milestone stands beside the king\'s road');shown=null;useMilestone(...ms);info('the milestone:',shown&&shown[1]);assert(shown&&/paces/.test(shown[1]),'its letters tell the road and the way to the places at its ends');
  const L=siteLayout(hal),k=L.parts.find(p=>p.k==='mkings'),[X,Z]=at(hal,k.cu+4,k.cv);gen(X,Z);shown=null;const n0=MN.tl.length;openLore(X-OX,k.y+1,Z-OZ);
  info('the lectern in the house of the kings:',shown&&shown[0]);assert(shown&&/chronicle/i.test(shown[0])&&MN.tl.length===n0+1,'the chronicles of the kings are read at the lectern of their house');
  const out=[];menJournal(out);info('the journal:',out.slice(0,4).join(' | '));assert(out.includes('THE CHRONICLES OF THE KINGS')&&out.some(l=>/^1\. The Founding/.test(l)),'and kept in the journal');
  const [EX,EZ]=at(hal,k.cu-3,k.cv+3);shown=null;useEffigy(EX-OX,k.y+1,EZ-OZ);info('an effigy:',shown&&shown[0]);assert(shown&&/^Here lies King /.test(shown[0])&&!isBlockedName(shown[0].replace('Here lies King ','')),'the kings lie under their effigies, named');
  let o=null;for(let i=-60;i<60&&!o;i++)for(let j=-60;j<60&&!o;j++)o=oldAt(i,j);gen(o.X,o.Z);toPL(o.X,o.Z,o.g+2);JN.d.k=JN.d.k.filter(x=>x!==o.name);const r0=MN.r;menT=0;menFrame(0.01);
  info('found',o.name,': in the discovery log',JN.d.k.includes(o.name),'; renown',r0,'->',MN.r);assert(JN.d.k.includes(o.name)&&MN.r>r0,'the ruins of the old kingdom go into the discovery log');}
setMode('creative');
