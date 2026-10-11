// The realms of men (D-060): about half the stretches of the gentle lands are held by a kingdom; each held stretch is a province
// with a city, a castle, villages, watchtowers and farmsteads joined by roads, on level ground; the plans are pure; the city is
// walled, lit and bannered, with tiers up to its citadel; villages have their cottages, chapel and well; the folk are neutral
// until one is struck, then the guards fight and the townsfolk flee, never in creative; the readout names the places.
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const at=(X,y,Z)=>get(X-OX,y,Z-OZ);
// ---- which stretches are held
// (the white realm's lands only: the riders of the plains have their own case, 53-riders, D-061)
const elig=new Map();for(let i=-20;i<20;i++)for(let j=-20;j<20;j++){const c=stretchCell(landSite(i,j));if(REALM_CULTS.white.lands.has(LANDS[cellLand(c)].k))elig.set(landKey(c.i,c.j),c);}
const held=[...elig.values()].filter(c=>realmHeld(c)===REALM_CULTS.white),share=held.length/Math.max(1,elig.size);
info('stretches of Green Hills, Overgrown Farmland, Wild Orchards, Flower Meadows and Old Terraces within 6400 blocks:',elig.size,'; held by a kingdom:',held.length,'('+Math.round(share*100)+'%)');
assert(elig.size>=30&&share>0.3&&share<0.7,'about half the stretches of the gentle lands are held by a kingdom');
assert([...elig.values()].every(c=>REALM_LANDS.has(LANDS[cellLand(c)].k))&&!held.some(c=>['volcanic','mtn','sea'].includes(LANDS[cellLand(c)].k)),'only the gentle lands are held');
// ---- provinces
const ps=held.map(c=>provinceOf(c.i,c.j)),count={};for(const P of ps)for(const s of P.sites)count[s.k]=(count[s.k]||0)+1;
const kings=new Set(ps.map(P=>P.kingdom.name)),caps=ps.filter(P=>P.capital).length;
info('provinces',ps.length,'in',kings.size,'kingdoms ('+caps+' with the royal city); sites:',JSON.stringify(count),'; roads',ps.reduce((n,P)=>n+P.roads.length,0));
info('for example:',ps.slice(0,3).map(P=>P.name+' of '+P.kingdom.name+': '+P.sites.filter(s=>s.k!=='farm').slice(0,5).map(s=>s.name).join(', ')).join(' | '));
const withCity=ps.filter(P=>P.sites.some(s=>s.k==='city')).length;
const settled=ps.filter(P=>P.sites.some(s=>s.k==='city'||s.k==='village'||s.k==='fort')).length;
assert(settled>=ps.length*0.9&&withCity>=ps.length*0.65,'nearly every province has a city, a castle or villages ('+settled+' of '+ps.length+'; a stretch too small or rough holds none), most a walled city ('+withCity+')');
assert(count.fort>=3&&count.village>=ps.length&&count.outpost>=ps.length&&count.farm>=ps.length,'castles, villages, watchtowers and farmsteads stand across the provinces');
const names=ps.flatMap(P=>[P.kingdom.name,P.name,...P.sites.map(s=>s.name)]);
assert(names.every(n=>!isBlockedName(n.replace(/^(The Kingdom of|Castle) /,'').replace(/ (Watch|Farm)$/,''))),'no name in the realms is one of Tolkien\'s');
// sites keep apart and keep off the old ruins, signatures and small structures
let clash=0;for(const P of ps)for(const s of P.sites){for(const t of P.sites)if(t!==s&&Math.hypot(t.X-s.X,t.Z-s.Z)<t.R+s.R+8)clash++;if(siteNear(s.X,s.Z,s.R)||sigNear(s.X,s.Z,s.R)||smallNear(s.X,s.Z,0))clash++;}
assert(clash===0,'the sites of a province keep apart, and no ruin, landmark or small structure stands on one ('+clash+' clashes)');
// the plans are pure: planned again from nothing, the same
{const P=ps[0],key=JSON.stringify(P.sites.map(s=>[s.k,s.X,s.Z,s.R,s.T,s.name,s.dir]));provC.clear();realmTC.clear();const P2=provinceOf(P.root.i,P.root.j);
  assert(JSON.stringify(P2.sites.map(s=>[s.k,s.X,s.Z,s.R,s.T,s.name,s.dir]))===key&&P2.roads.length===P.roads.length,'a province planned again from nothing is the same');}
// ---- the ground: level under every site's core (a city's in tiers, five blocks a step), never a river or a lake
{let bad=0,n=0;for(const P of ps.slice(0,8))for(const s of P.sites){for(let k=0;k<12;k++){const a=k/12*6.283,d=s.R*(k%2?0.5:0.85),X=Math.round(s.X+Math.cos(a)*d),Z=Math.round(s.Z+Math.sin(a)*d),o=colInfo(X,Z,{});n++;
    const want=s.k==='city'?cityGround(s,X,Z):s.T;if(o.h!==want||o.river||o.lake||o.rvBot<999)bad++;}}
  info('level ground under the sites:',n-bad,'of',n,'samples at their level');assert(bad===0,'the ground under every site is level, a city\'s in tiers');}
// ---- the nearest city: walls, gate, towers, the citadel's tower, lamps lit, banners, houses, the square
const cities=ps.flatMap(P=>P.sites.filter(s=>s.k==='city')).sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z)),C=cities[0];
gen(C.X,C.Z);
{const cnt={},ids=[WSTONE,WSBRICK,WSROUGH,WSTRIM,WSCARVE,WSPILLAR,SLATE,PLASTER,TIMBER,PAVING,COBBLE,LGLASS,LANTERN,DLANTERN,RBANNER,WATER,GRATE];for(const id of ids)cnt[id]=0;
  for(let X=C.X-C.R-4;X<=C.X+C.R+4;X++)for(let Z=C.Z-C.R-4;Z<=C.Z+C.R+4;Z++)for(let y=C.T-6;y<C.T+70;y++){const id=at(X,y,Z);if(cnt[id]!==undefined)cnt[id]++;}
  const [gx,gz]=siteXZ(C,-C.R,0),gateOpen=[1,2,3,4,5,6].every(dy=>at(gx,C.T+dy,gz)===AIR),f=cityFrame(C),[tx,tz]=siteXZ(C,f.cu+f.r2-(C.tiers>=3?4:3)-2,0);let top=0;for(let y=C.T+100;y>C.T;y--)if(at(tx,y,tz)===RBANNER||at(tx,y,tz)===WSPILLAR){top=y-C.T;break;}
  info(C.name,'('+(C.prov.capital?'the royal city of ':'a city of ')+C.prov.kingdom.name+', '+C.R*2+' across, '+C.tiers+' tiers):',ids.map(id=>nameOf(id)+' '+cnt[id]).join(', '),'; gate open',gateOpen,'; the white tower rises',top,'above the gate');
  const A=C.R*C.R; // what a city holds grows with its area
  assert(cnt[WSBRICK]>6*A&&cnt[WSTONE]>A&&cnt[SLATE]>0.25*A&&cnt[PAVING]+cnt[COBBLE]>1.2*A&&cnt[LGLASS]>0.08*A&&cnt[WSCARVE]>50&&cnt[RBANNER]>8,'the city is built of whitestone under slate, paved and cobbled, its windows glazed, its sign carved and its banners hung');
  assert(cnt[WSTRIM]>0.6*A&&cnt[WSROUGH]>0.6*A,'its walls stand in relief: moulded courses, cornices and copings, on rock-faced plinths (D-060)');
  assert(cnt[LANTERN]>0.012*A&&cnt[DLANTERN]===0,'its lamps are lit');
  assert(gateOpen&&top>=35,'its gate stands open and its white tower rises high over the citadel');
  assert(surfaceName(C.X,C.T+1,C.Z)===C.name&&realmPlace(C.X,C.Z).line.includes(C.prov.kingdom.name.replace(/^The /,'')),'standing in it, the readout names the city and its kingdom');}
// ---- the folk: neutral until struck; then the guards fight and the townsfolk flee; never in creative
{const clear=()=>{for(const f of [...foes])removeFoe(f);for(const s of [...shots]){scene.remove(s.m);}shots.length=0;foeSpots.clear();realmWrath.clear();};
  const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT=99;hurtCD=Math.max(0,hurtCD-0.05);updFoes(0.05);if(fn)fn();}};
  const [gx,gz]=siteXZ(C,-C.R+8,0);PL.x=gx-OX+0.5;PL.z=gz-OZ+0.5;PL.y=C.T+1;PL.vx=PL.vy=PL.vz=0;setMode('survival');hp=20;dead=false;playing=true;settings.time='day';
  clear();foeSpawnTick();const folk=foes.filter(f=>FOES[f.kind].folk),kinds={};for(const f of folk)kinds[f.kind]=(kinds[f.kind]||0)+1;
  info('folk about the gate of',C.name,':',JSON.stringify(kinds));
  assert(folk.length>=4&&folk.some(f=>!FOES[f.kind].civ)&&folk.every(f=>f.prov===C.prov.key),'guards and townsfolk are about the gate');
  const hp0=hp;let chased=0;run(10,()=>{for(const f of foes)if(f.st==='chase')chased++;});
  assert(hp===hp0&&chased===0,'they take no notice of the player who does them no harm');
  // strike one: the guards take up arms, the townsfolk flee
  const tgt=foes.find(f=>FOES[f.kind].civ)||foes.find(f=>FOES[f.kind].folk);PL.x=tgt.x+1.5;PL.z=tgt.z;PL.y=tgt.y;PL.yaw=Math.atan2(1,0);PL.pitch=-0.2;
  const before=tgt.hp;folkProvoke(tgt,90);tgt.hp-=2;foeAlert(tgt);
  run(1.5);const guards=foes.filter(f=>FOES[f.kind].folk&&!FOES[f.kind].civ&&!f.dead),civs=foes.filter(f=>FOES[f.kind].civ&&!f.dead);
  const gc=guards.filter(f=>f.st==='chase').length,cf=civs.filter(f=>f.st==='flee'||f.st==='return').length;
  info('struck',FOES[tgt.kind].n,'('+before+' to '+tgt.hp+'): wrath',Math.round(realmWrath.get(C.prov.key)||0),'s; guards chasing',gc,'of',guards.length,'; townsfolk fleeing',cf,'of',civs.length);
  assert(folkWrath(tgt)&&gc>=1,'struck, the realm\'s guards take up arms');
  // in creative the same blow wakes nothing
  clear();setMode('creative');foeSpawnTick();const t2=foes.find(f=>FOES[f.kind].folk);if(t2){folkProvoke(t2,90);foeAlert(t2);run(2);}
  assert(!t2||(!folkWrath(t2)&&foes.every(f=>f.st!=='chase')),'in creative the folk never take up arms');
  // the wrath passes
  setMode('survival');clear();realmWrath.set(C.prov.key,1);run(1.5);assert(!realmWrath.has(C.prov.key),'and the realm\'s wrath passes');clear();setMode('creative');}
// ---- a village: cottages under thatch, plastered and timbered, a chapel with its bell tower, a well with water in it
{const V=ps.flatMap(P=>P.sites.filter(s=>s.k==='village')).sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z))[0];gen(V.X,V.Z);
  const cnt={},ids=[THATCH,PLASTER,TIMBER,COBBLE,WSBRICK,SLATE,WATER,HAYBALE,FARM_D,LANTERN];for(const id of ids)cnt[id]=0;
  for(let X=V.X-V.R-50;X<=V.X+V.R+50;X++)for(let Z=V.Z-V.R-50;Z<=V.Z+V.R+50;Z++)for(let y=V.T-6;y<V.T+24;y++){const id=at(X,y,Z);if(cnt[id]!==undefined)cnt[id]++;}
  info(V.name,'(a village of '+V.prov.kingdom.name+'):',ids.map(id=>nameOf(id)+' '+cnt[id]).join(', '));
  assert(cnt[THATCH]>150&&cnt[PLASTER]>80&&cnt[WSBRICK]>60&&cnt[SLATE]>20&&cnt[WATER]>=1&&cnt[FARM_D]>100,'the village has its thatched cottages, its chapel of white stone, its well and its fields');
  assert(surfaceName(V.X,V.T+1,V.Z)===V.name,'the readout names the village');}
