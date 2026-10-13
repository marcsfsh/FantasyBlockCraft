// The high elves of the elder realms (D-062): about half the stretches of the High Mountains, Alpine Meadows, Karst Crags,
// Fjords and Chalk Cliffs are theirs, as provinces (a hidden city, a fastness, refuges, watch-spires, gardens) joined by the
// elven ways. They build on rough ground: a site's ground is cut into terraces that follow the land, every building on a level
// platform of its own; the plans are pure. The city stands in elvenstone behind a wall with many towers, its halls glazed under
// tracery and roofed in verdigris and shingle, gilt on its rails, lamps lit, statues at its gate; a fastness has its great
// tower; a refuge its halls and trees. The folk are neutral until struck and strong in arms, never hostile in creative.
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const at=(X,y,Z)=>get(X-OX,y,Z-OZ);
const E=REALM_CULTS.elf;
// ---- which stretches are held, and by whom
const elig=new Map();for(let i=-20;i<20;i++)for(let j=-20;j<20;j++){const c=stretchCell(landSite(i,j));if(E.lands.has(LANDS[cellLand(c)].k))elig.set(landKey(c.i,c.j),c);}
const held=[...elig.values()].filter(c=>realmHeld(c)===E),share=held.length/Math.max(1,elig.size);
info('stretches of High Mountains, Alpine Meadows, Karst Crags, Fjords and Chalk Cliffs within 6400 blocks:',elig.size,'; held by the elves:',held.length,'('+Math.round(share*100)+'%)');
assert(elig.size>=30&&share>0.3&&share<0.7,'about half the stretches of the high and rugged lands are held by the elves');
assert(['steppe','green','elder','birch','pine','silver','giant','cloud'].every(k=>!E.lands.has(k)),'the elves hold none of the forests (kept for the wood elves) nor the lands of men');
// ---- provinces
const t0=process.hrtime.bigint(),ps=held.map(c=>provinceOf(c.i,c.j)),ms=Number(process.hrtime.bigint()-t0)/1e6,count={};for(const P of ps)for(const s of P.sites)count[s.k]=(count[s.k]||0)+1;
info('provinces',ps.length,'in',new Set(ps.map(P=>P.kingdom.name)).size,'kingdoms ('+ps.filter(P=>P.capital).length+' with the high seat), planned in',Math.round(ms),'ms; sites:',JSON.stringify(count),'; roads',ps.reduce((n,P)=>n+P.roads.length,0));
info('for example:',ps.slice(0,3).map(P=>P.name+' of '+P.kingdom.name+': '+P.sites.filter(s=>s.k!=='farm').slice(0,5).map(s=>s.name).join(', ')).join(' | '));
assert(ps.every(P=>P.cult===E&&P.kingdom.name.startsWith('The Elder Realm of ')),'every province is of an elder realm');
assert(ps.filter(P=>P.sites.some(s=>s.k==='city')).length>=ps.length*0.6&&count.fort>=3&&count.village>=ps.length&&count.outpost>=ps.length&&count.farm>=ps.length,'hidden cities, fastnesses, refuges, watch-spires and gardens stand across the provinces');
const names=ps.flatMap(P=>[P.kingdom.name,P.name,...P.sites.map(s=>s.name)]);
assert(names.every(n=>!isBlockedName(n.replace(/^The Elder Realm of /,'').replace(/ (Fastness|Spire|Gardens)$/,''))),'no name of the elves is one of Tolkien\'s');
let clash=0;for(const P of ps)for(const s of P.sites){for(const t of P.sites)if(t!==s&&Math.hypot(t.X-s.X,t.Z-s.Z)<t.R+s.R+8)clash++;if(siteNear(s.X,s.Z,s.R)||sigNear(s.X,s.Z,s.R)||smallNear(s.X,s.Z,0))clash++;}
assert(clash===0,'the sites keep apart, and no ruin, landmark or small structure stands on one ('+clash+' clashes)');
{const P=ps[0],key=JSON.stringify(P.sites.map(s=>[s.k,s.X,s.Z,s.R,s.T,s.name,s.dir]));provC.clear();realmTC.clear();const P2=provinceOf(P.root.i,P.root.j);
  assert(JSON.stringify(P2.sites.map(s=>[s.k,s.X,s.Z,s.R,s.T,s.name,s.dir]))===key&&P2.roads.length===P.roads.length,'a province planned again from nothing is the same');}
// ---- rough ground: the elves' cities stand on far rougher ground than the white realm's, cut into terraces that follow it,
// every building on its platform
{const rough=s=>{const a=s.hg.a;let lo=1e9,hi=-1e9;for(let k=0;k<a.length;k++){lo=Math.min(lo,a[k]);hi=Math.max(hi,a[k]);}return hi-lo;};
  const cities=ps.flatMap(P=>P.sites.filter(s=>s.k==='city')),rs=cities.map(rough).sort((a,b)=>a-b),med=rs[rs.length>>1];
  let bad=0,n=0;const lv=new Map();for(const s of cities.slice(0,6)){const L=new Set();for(let k=0;k<24;k++){const a=k/24*6.283,d=s.R*(k%3===0?0.3:k%3===1?0.6:0.85),X=Math.round(s.X+Math.cos(a)*d),Z=Math.round(s.Z+Math.sin(a)*d),o=colInfo(X,Z,{});n++;
    const want=elfGround(s,X,Z);if(o.h!==want)bad++;L.add(o.h);}lv.set(s.name,L.size);}
  info('the elves\' cities: raw ground under them varies by',rs[0].toFixed(0),'to',rs[rs.length-1].toFixed(0),'blocks (median',med.toFixed(0)+'); ground on its terrace or platform:',n-bad,'of',n,'; levels met on 24 samples:',JSON.stringify([...lv.values()]));
  assert(med>=25,'the elves build on rough ground: the median city stands on ground varying by '+med.toFixed(0)+' blocks');
  assert(bad===0,'the ground under every site lies on its terraces and platforms');
  assert([...lv.values()].some(k=>k>=4),'a city climbs its slope in terraces');}
// ---- the nearest city: elvenstone and its courses, carvings, columns, tracery and glass, roofs of verdigris and shingle, gilt,
// lamps lit, banners, statues at the gate, the gate open; none of the white realm's nor the riders' stone
const cities=ps.flatMap(P=>P.sites.filter(s=>s.k==='city')).sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z)),C=cities[0];
gen(C.X,C.Z);
{const cnt={},ids=[EVSTONE,EVBRICK,EVCARVE,EVPILLAR,EVTRACERY,EVGLASS,EVROOF,EVSHINGLE,EVGOLD,EVLAMP,EVBANNER,EVWOOD,EVMOSAIC,SILVL,BLOSSOM,LANTERN,DLANTERN,WSBRICK,FSTONE];for(const id of ids)cnt[id]=0;
  for(let X=C.X-C.R-10;X<=C.X+C.R+10;X++)for(let Z=C.Z-C.R-10;Z<=C.Z+C.R+10;Z++)for(let y=C.T-80;y<C.T+110;y++){const id=at(X,y,Z);if(cnt[id]!==undefined)cnt[id]++;}
  const L=siteLayout(C),k={};for(const p of L.parts)k[p.k]=(k[p.k]||0)+1;
  const g0=elfGround(C,...siteXZ(C,-C.R+1,0)),[gx,gz]=siteXZ(C,-C.R+1,0),gateOpen=[1,2,3,4,5].every(dy=>at(gx,g0+dy,gz)===AIR);
  info(C.name,'('+(C.prov.capital?'the high seat of ':'a hidden city of ')+C.prov.kingdom.name+', '+C.R*2+' across):',JSON.stringify(k),'; platforms',L.pads.length);
  info(ids.map(id=>nameOf(id)+' '+cnt[id]).join(', '),'; gate open',gateOpen);
  const A=C.R*C.R;
  assert(cnt[EVBRICK]>2*A&&cnt[EVCARVE]>0.5*A&&cnt[EVPILLAR]>0.15*A&&cnt[EVGLASS]>0.15*A&&cnt[EVTRACERY]>0.08*A&&cnt[EVROOF]+cnt[EVSHINGLE]>0.5*A,'the city is of elvenstone courses with carved friezes and slender columns, its windows glazed under tracery, roofed in verdigris and shingle');
  assert(cnt[EVGOLD]>0.1*A&&cnt[EVLAMP]>0.02*A&&cnt[EVBANNER]>10&&cnt[DLANTERN]===0&&cnt[SILVL]+cnt[BLOSSOM]>50,'gilt on its rails, its lamps lit, its banners hung, trees on its lawns');
  assert(cnt[WSBRICK]===0&&cnt[FSTONE]===0,'none of the white realm\'s nor the riders\' stone is in it');
  assert(k.ehall>=8&&k.etower>=8&&k.ewall===1&&L.parts.filter(p=>p.k==='estatue'&&!p.king).length===2&&k.eyard>=1,'halls, many towers, the wall, statues at the gate and a training ground: the elves are strong in arms');
  assert(gateOpen,'its gate stands open');
  assert(surfaceName(C.X,C.T+1,C.Z)===C.name&&realmPlace(C.X,C.Z).line.includes(C.prov.kingdom.name.replace(/^The /,'')),'standing in it, the readout names the city and its realm');}
// ---- the folk: warriors many and strong, lords and ladies; neutral until struck; never in creative
{const clear=()=>{for(const f of [...foes])removeFoe(f);for(const a of [...animals])removeAnimal(a);for(const s of [...shots]){scene.remove(s.m);}shots.length=0;foeSpots.clear();realmWrath.clear();};
  const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT=99;hurtCD=Math.max(0,hurtCD-0.05);updFoes(0.05);if(fn)fn();}};
  for(const k of ['espear','esword','ebow','ecapt','eknight','elord','elady','elore','esmith']){const K=AM_KINDS[FOES[k].m];for(let ci=0;ci<K.coats.length;ci++)amBuild(FOES[k].m,ci,{});}
  const hk=amBuild('eknight',0,{}).box,he=amBuild('esword',0,{}).box,hr=amBuild('rsword',0,{}).box;
  info('heights: a bladewarden',he[4].toFixed(2),'(a swordsman of men',hr[4].toFixed(2)+'), a knight',hk[4].toFixed(2));
  assert(he[4]>hr[4]&&hk[4]>2.5&&FOES.eknight.tall===3,'every kind and coat of the elves builds; the elves stand taller than men; a knight rides');
  assert(FOES.esword.hp>FOES.rsword.hp&&FOES.esword.dmg>FOES.rsword.dmg&&FOES.ebow.shot.hi>FOES.rbow.shot.hi&&FOES.ecapt.hp>FOES.rcapt.hp,'the elves\' warriors are stronger than men\'s, their archers\' reach longer');
  const [gx,gz]=siteXZ(C,-C.R+8,0);PL.x=gx-OX+0.5;PL.z=gz-OZ+0.5;PL.y=elfGround(C,gx,gz)+1;PL.vx=PL.vy=PL.vz=0;setMode('survival');hp=20;dead=false;playing=true;settings.time='day';
  clear();foeSpawnTick();const folk=foes.filter(f=>FOES[f.kind].folk),kinds={};for(const f of folk)kinds[f.kind]=(kinds[f.kind]||0)+1;
  const war=folk.filter(f=>!FOES[f.kind].civ).length;info('folk about the gate of',C.name,':',JSON.stringify(kinds),'; warriors',war,'of',folk.length);
  assert(folk.length>=5&&folk.every(f=>f.kind[0]==='e'&&f.prov===C.prov.key)&&war>=folk.length*0.4,'the elves\' warriors and folk are about the gate, warriors many among them');
  const hp0=hp;let chased=0;run(10,()=>{for(const f of foes)if(f.st==='chase')chased++;});
  assert(hp===hp0&&chased===0,'they take no notice of the player who does them no harm');
  const tgt=foes.find(f=>FOES[f.kind].civ)||foes.find(f=>FOES[f.kind].folk);PL.x=tgt.x+1.5;PL.z=tgt.z;PL.y=tgt.y;
  folkProvoke(tgt,90);tgt.hp-=2;foeAlert(tgt);run(1.5);
  const guards=foes.filter(f=>FOES[f.kind].folk&&!FOES[f.kind].civ&&!f.dead),gc=guards.filter(f=>f.st==='chase').length;
  info('struck',FOES[tgt.kind].n,': warriors taking up arms',gc,'of',guards.length);assert(folkWrath(tgt)&&gc>=1,'struck, the elves take up arms');
  clear();setMode('creative');foeSpawnTick();const t2=foes.find(f=>FOES[f.kind].folk);if(t2){folkProvoke(t2,90);foeAlert(t2);run(2);}
  assert(!t2||(!folkWrath(t2)&&foes.every(f=>f.st!=='chase')),'in creative the elves never take up arms');
  assert(['eguard','ecapt','elord','elady','elore','esmith'].every(k=>FOLK_SAY[k]&&FOLK_SAY[k].length>=3),'each of the elves has words for a passer-by');
  clear();}
// ---- a fastness: its wall and great tower; a refuge: its halls and trees
{const F=ps.flatMap(P=>P.sites.filter(s=>s.k==='fort')).sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z))[0];gen(F.X,F.Z);
  const T=siteLayout(F).parts.find(p=>p.k==='etower'&&p.rr===4);let top=0;if(T){const [x,z]=siteXZ(F,T.cu+4,T.cv);for(let y=T.y+1;y<T.y+60;y++)if(at(x,y,z)===EVBRICK||at(x,y,z)===EVCARVE)top=y-T.y;}
  let wall=0;for(let k=0;k<36;k++){const a=k/36*6.283,[x,z]=siteXZ(F,Math.round(Math.cos(a)*(F.R-1)),Math.round(Math.sin(a)*(F.R-1)));const g=elfGround(F,x,z);if(at(x,g+6,z)===EVBRICK||at(x,g+6,z)===EVCARVE)wall++;}
  info(F.name,'(a fastness of '+F.prov.kingdom.name+'): its wall stands at',wall,'of 36 bearings; its great tower',top,'blocks high');
  assert(wall>=24&&top>=30,'the fastness has its wall and its great tower');}
{const V=ps.flatMap(P=>P.sites.filter(s=>s.k==='village')).sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z))[0];gen(V.X,V.Z);
  const cnt={},ids=[EVBRICK,EVGLASS,EVROOF,EVSHINGLE,SILVL,BLOSSOM,EVLAMP];for(const id of ids)cnt[id]=0;
  for(let X=V.X-V.R-6;X<=V.X+V.R+6;X++)for(let Z=V.Z-V.R-6;Z<=V.Z+V.R+6;Z++)for(let y=V.T-60;y<V.T+80;y++){const id=at(X,y,Z);if(cnt[id]!==undefined)cnt[id]++;}
  info(V.name,'(a refuge of '+V.prov.kingdom.name+'):',ids.map(id=>nameOf(id)+' '+cnt[id]).join(', '));
  assert(cnt[EVBRICK]>200&&cnt[EVGLASS]>20&&cnt[EVROOF]+cnt[EVSHINGLE]>80&&cnt[SILVL]+cnt[BLOSSOM]>20&&cnt[EVLAMP]>3,'the refuge has its halls, glazed and roofed, and its trees and lamps');
  assert(surfaceName(V.X,elfGround(V,V.X,V.Z)+1,V.Z)===V.name,'the readout names the refuge');}
