// The wood elves of the forest kingdoms (D-065): about half the stretches of the Elder Wood, Autumn Woods, Birch Glades, Ancient
// Giant Wood, Yew Wood and Silverwood are theirs, as provinces (a city in the trees, the king's halls under a hill, tree-villages,
// watch-trees, glades) joined by their lamplit ways. Their ground is left as it lies (save the halls' hill and a few platforms),
// and the forest grows on among their works; the plans are pure. A city stands in goldboughs (silver bark, golden crowns) with
// platforms at shared heights, stairs winding up the trunks, houses round them, bridges between, lamps lit, a hedge round it and
// a gate; the halls have their hill, gate, hall and the king's seat. The folk are neutral until struck, never hostile in creative.
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const at=(X,y,Z)=>get(X-OX,y,Z-OZ);
const E=REALM_CULTS.wood;
// ---- which stretches are held, and by whom
const elig=new Map();for(let i=-20;i<20;i++)for(let j=-20;j<20;j++){const c=stretchCell(landSite(i,j));if(E.lands.has(LANDS[cellLand(c)].k))elig.set(landKey(c.i,c.j),c);}
const held=[...elig.values()].filter(c=>realmHeld(c)===E),share=held.length/Math.max(1,elig.size);
info('stretches of the Elder Wood, Autumn Woods, Birch Glades, Ancient Giant Wood, Yew Wood and Silverwood within 6400 blocks:',elig.size,'; held by the wood elves:',held.length,'('+Math.round(share*100)+'%)');
assert(elig.size>=30&&share>0.3&&share<0.7,'about half the stretches of the woods are held by the wood elves');
assert(['pine','willow','shadow','mtn','green','steppe'].every(k=>!E.lands.has(k))&&Object.values(REALM_CULTS).filter(C=>C!==E).every(C=>[...E.lands].every(k=>!C.lands.has(k))),'the wood elves hold no land of another people, nor the pinewoods, the willow vales or the shadowed forest');
// ---- provinces
const t0=process.hrtime.bigint(),ps=held.map(c=>provinceOf(c.i,c.j)),ms=Number(process.hrtime.bigint()-t0)/1e6,count={};for(const P of ps)for(const s of P.sites)count[s.k]=(count[s.k]||0)+1;
info('provinces',ps.length,'in',new Set(ps.map(P=>P.kingdom.name)).size,'kingdoms ('+ps.filter(P=>P.capital).length+' with the king\'s wood), planned in',Math.round(ms),'ms; sites:',JSON.stringify(count),'; roads',ps.reduce((n,P)=>n+P.roads.length,0));
info('for example:',ps.slice(0,3).map(P=>P.name+' of '+P.kingdom.name+': '+P.sites.filter(s=>s.k!=='farm').slice(0,5).map(s=>s.name).join(', ')).join(' | '));
assert(ps.every(P=>P.cult===E&&P.kingdom.name.startsWith('The Forest Kingdom of ')),'every province is of a forest kingdom');
assert(ps.filter(P=>P.sites.some(s=>s.k==='city')).length>=ps.length*0.6&&count.fort>=3&&count.village>=ps.length&&count.outpost>=ps.length&&count.farm>=ps.length,'cities in the trees, the king\'s halls, tree-villages, watch-trees and glades stand across the provinces');
const names=ps.flatMap(P=>[P.kingdom.name,P.name,...P.sites.map(s=>s.name)]);
assert(names.every(n=>!isBlockedName(n.replace(/^The Forest Kingdom of /,'').replace(/^The Halls of /,'').replace(/ (Watch-tree|Glade)$/,''))),'no name of the wood elves is one of Tolkien\'s');
let clash=0;for(const P of ps)for(const s of P.sites){for(const t of P.sites)if(t!==s&&Math.hypot(t.X-s.X,t.Z-s.Z)<t.R+s.R+8)clash++;if(siteNear(s.X,s.Z,s.R)||sigNear(s.X,s.Z,s.R)||smallNear(s.X,s.Z,0))clash++;}
assert(clash===0,'the sites keep apart, and no ruin, landmark or small structure stands on one ('+clash+' clashes)');
{const P=ps[0],key=JSON.stringify(P.sites.map(s=>[s.k,s.X,s.Z,s.R,s.T,s.name,s.dir]));provC.clear();realmTC.clear();const P2=provinceOf(P.root.i,P.root.j);
  assert(JSON.stringify(P2.sites.map(s=>[s.k,s.X,s.Z,s.R,s.T,s.name,s.dir]))===key&&P2.roads.length===P.roads.length,'a province planned again from nothing is the same');}
// ---- the ground as it lies: in a city off its pads, every column stands at the raw ground's height
const cities=ps.flatMap(P=>P.sites.filter(s=>s.k==='city')).sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z)),C=cities[0];
{let n=0,raw=0;for(let k=0;k<40;k++){const a=k/40*6.283,d=C.R*(k%2?0.4:0.8),X=Math.round(C.X+Math.cos(a)*d),Z=Math.round(C.Z+Math.sin(a)*d),[u,v]=siteUV(C,X,Z);
    if(siteLayout(C).pads.some(p=>u>=p.u0&&u<=p.u1&&v>=p.v0&&v<=p.v1))continue;n++;if(colInfo(X,Z,{}).h===realmRaw(X,Z).h)raw++;}
  info(C.name,': columns at their raw height',raw,'of',n);assert(n>20&&raw===n,'the wood elves leave the ground as it lies');}
// ---- the nearest city: goldboughs with platforms, stairs, houses and bridges, lamps, the hedge and its gate; forest trees among them
gen(C.X,C.Z);
{const cnt={},ids=[WBARK,WPLANK,WLEAF,WLAMP,WRAIL,WCARVE,WTHATCH,WHEDGE,WBANNER,EVSTONE,WSBRICK,FSTONE,DLANTERN];for(const id of ids)cnt[id]=0;let natural=0;
  for(let X=C.X-C.R-10;X<=C.X+C.R+10;X++)for(let Z=C.Z-C.R-10;Z<=C.Z+C.R+10;Z++){const inside=Math.hypot(X-C.X,Z-C.Z)<C.R-4;for(let y=C.T-30;y<C.T+110;y++){const id=at(X,y,Z);if(cnt[id]!==undefined)cnt[id]++;else if(inside&&BL[id]&&(NEW_LOGS.includes(id)||id===LOG||id===BIRCH)&&id!==WBARK)natural++;}}
  const L=siteLayout(C),k={};for(const p of L.parts)k[p.k]=(k[p.k]||0)+1;const lv=new Set(L.parts.filter(p=>p.k==='wtree').flatMap(p=>p.fl.map(f=>f.y-C.T)));
  info(C.name,'('+(C.prov.capital?'the king\'s wood of ':'a city in the trees of ')+C.prov.kingdom.name+', '+C.R*2+' across):',JSON.stringify(k),'; platform heights over its level',JSON.stringify([...lv].sort((a,b)=>a-b)));
  info(ids.map(id=>nameOf(id)+' '+cnt[id]).join(', '),'; logs of the forest\'s own trees inside the hedge',natural);
  assert(k.wtree>=6&&k.wbridge>=3&&k.whedge===1&&k.wgate===1&&lv.size>=3,'goldboughs stand about the city, their platforms at shared heights, bridges between them, a hedge round it with its gate');
  assert(cnt[WBARK]>2000&&cnt[WLEAF]>3000&&cnt[WPLANK]>800&&cnt[WRAIL]>300&&cnt[WTHATCH]>100&&cnt[WCARVE]>200,'the goldboughs have silver bark and golden crowns, plank platforms with woven rails, houses under leaf thatch');
  assert(cnt[WLAMP]>60&&cnt[DLANTERN]===0&&cnt[WHEDGE]>400&&cnt[WBANNER]>=1,'its lamps are lit, its hedge clipped, the banner of the wood over its gate');
  assert(cnt[EVSTONE]===0&&cnt[WSBRICK]===0&&cnt[FSTONE]===0,'none of the other peoples\' stone is in it');
  assert(natural>20,'the forest\'s own trees grow on in the city');
  // a stair winds up a trunk: on one goldbough, a step on each of several turns
  const t=L.parts.find(p=>p.k==='wtree'&&p.fl.length>=2);let steps=0;if(t){for(let y=t.base+1;y<=t.sy1;y++){const a=t.a0+((y-t.base-1)%t.P)/t.P*6.2832,[x,z]=siteXZ(C,Math.round(t.cu+Math.cos(a)*(t.tr+1.4)),Math.round(t.cv+Math.sin(a)*(t.tr+1.4)));if(at(x,y,z)===WPLANK)steps++;}}
  info('the stair up one goldbough: steps found',steps,'from',t&&t.base+1,'to',t&&t.sy1);assert(steps>=8,'a stair winds up the trunk to its platforms');
  const [gx,gz]=siteXZ(C,-C.R,0),g0=colInfo(gx,gz,{}).h,gateOpen=[1,2,3,4].every(dy=>at(gx,g0+dy,gz)===AIR);assert(gateOpen,'its gate stands open');
  assert(surfaceName(C.X,C.T+1,C.Z)===C.name&&realmPlace(C.X,C.Z).line.includes(C.prov.kingdom.name.replace(/^The /,'')),'standing in it, the readout names the city and its kingdom');}
// ---- the folk: wardens and guards, lords and ladies, the folk of the glades; neutral until struck; never in creative
{const clear=()=>{for(const f of [...foes])removeFoe(f);for(const a of [...animals])removeAnimal(a);for(const s of [...shots]){scene.remove(s.m);}shots.length=0;foeSpots.clear();realmWrath.clear();};
  const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT=99;hurtCD=Math.max(0,hurtCD-0.05);updFoes(0.05);if(fn)fn();}};
  const kinds0=['wbow','wknife','wguard','wcapt','wking','wlord','wlady','wfolk'];for(const k of kinds0){const K=AM_KINDS[FOES[k].m];for(let ci=0;ci<K.coats.length;ci++)amBuild(FOES[k].m,ci,{});}
  const hb=amBuild('wbow',0,{}).box,hr=amBuild('rsword',0,{}).box;info('heights: a warden',hb[4].toFixed(2),'(a swordsman of men',hr[4].toFixed(2)+')');
  assert(hb[4]>hr[4],'every kind and coat of the wood elves builds; they stand taller than men');
  assert(FOES.wbow.sight>=FOES.ebow.sight&&FOES.wbow.shot.hi>FOES.rbow.shot.hi&&FOES.wknife.cd<FOES.esword.cd&&FOES.wcapt.hp>FOES.rcapt.hp,'their wardens see farthest and shoot far, their blades strike quickest');
  const [gx,gz]=siteXZ(C,-C.R+6,0);PL.x=gx-OX+0.5;PL.z=gz-OZ+0.5;PL.y=colInfo(gx,gz,{}).h+1;PL.vx=PL.vy=PL.vz=0;setMode('survival');hp=20;dead=false;playing=true;settings.time='day';
  clear();foeSpawnTick();const folk=foes.filter(f=>FOES[f.kind].folk),kinds={};for(const f of folk)kinds[f.kind]=(kinds[f.kind]||0)+1;
  const high=folk.filter(f=>f.y>colInfo(Math.floor(f.x)+OX,Math.floor(f.z)+OZ,{}).h+8).length;
  info('folk about the gate of',C.name,':',JSON.stringify(kinds),'; up on the platforms',high);
  assert(folk.length>=4&&folk.every(f=>f.kind[0]==='w'&&f.prov===C.prov.key)&&high>=1,'the wood elves are about the gate, some up on the platforms');
  const hp0=hp;let chased=0;run(10,()=>{for(const f of foes)if(f.st==='chase')chased++;});
  assert(hp===hp0&&chased===0,'they take no notice of the player who does them no harm');
  const tgt=foes.find(f=>FOES[f.kind].folk&&Math.abs(f.y-PL.y)<4)||foes.find(f=>FOES[f.kind].folk);PL.x=tgt.x+1.5;PL.z=tgt.z;PL.y=tgt.y;
  folkProvoke(tgt,90);tgt.hp-=2;foeAlert(tgt);run(1.5);
  const guards=foes.filter(f=>FOES[f.kind].folk&&!FOES[f.kind].civ&&!f.dead),gc=guards.filter(f=>f.st==='chase').length;
  info('struck',FOES[tgt.kind].n,': wardens and guards taking up arms',gc,'of',guards.length);assert(folkWrath(tgt)&&gc>=1,'struck, the wood elves take up arms');
  clear();setMode('creative');foeSpawnTick();const t2=foes.find(f=>FOES[f.kind].folk);if(t2){folkProvoke(t2,90);foeAlert(t2);run(2);}
  assert(!t2||(!folkWrath(t2)&&foes.every(f=>f.st!=='chase')),'in creative the wood elves never take up arms');
  assert(['wguard','wcapt','wking','wlord','wlady','wfolk'].every(k=>FOLK_SAY[k]&&FOLK_SAY[k].length>=3),'each of the wood elves has words for a passer-by');
  clear();}
// ---- the king's halls: the hill over them, the gate in its face, the hall within, the king's seat with its antlers, the cellar
{const F=ps.flatMap(P=>P.sites.filter(s=>s.k==='fort')).sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z))[0];gen(F.X,F.Z);const L=siteLayout(F),m=L.mound,p=L.parts.find(q=>q.k==='whalls');
  const top=colInfo(...siteXZ(F,m.cu,m.cv),{}).h-F.T,[hx,hz]=siteXZ(F,Math.round((p.hu0+p.hu1)/2),0),[cx,cz]=siteXZ(F,p.du,-(p.hw+5)),[ax,az]=siteXZ(F,p.hu1,3);
  let room=0;for(let y=F.T+1;y<=F.T+p.hh;y++)if(at(hx,y,hz)===AIR)room++;let casks=0;for(let du=-3;du<=3;du++)for(let dv=p.hw+2;dv<=p.hw+7;dv++){const [x,z]=siteXZ(F,p.du+du,-dv);if(at(x,F.T+1,z)===BARREL)casks++;}
  info(F.name,'('+F.prov.kingdom.name+'): the hill',top,'over the hall\'s floor; open over the hall',room,'; casks in the cellar',casks,'; the antlers',nameOf(at(ax,F.T+8,az)));
  assert(top>=12&&room>=p.hh-1&&casks>=6&&at(ax,F.T+8,az)===WPLANK,'the king\'s halls lie under their hill: a great hall within, casks in the cellar, the king\'s seat crowned with antlers');
  const [fx,fz]=siteXZ(F,m.face+1,0);assert([1,2,3,4,5].every(dy=>at(fx,F.T+dy,fz)===AIR)&&surfaceName(fx,F.T+1,fz)===F.name,'its gate stands open in the hill\'s face, and the readout names the halls');}
// ---- a tree-village round its glade; a watch-tree; a glade
{const V=ps.flatMap(P=>P.sites.filter(s=>s.k==='village')).sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z))[0];gen(V.X,V.Z);
  const L=siteLayout(V),k={};for(const p of L.parts)k[p.k]=(k[p.k]||0)+1;let lamps=0;for(let X=V.X-V.R-10;X<=V.X+V.R+10;X++)for(let Z=V.Z-V.R-10;Z<=V.Z+V.R+10;Z++)for(let y=V.T-20;y<V.T+60;y++)if(at(X,y,Z)===WLAMP)lamps++;
  info(V.name,'(a tree-village of',V.prov.kingdom.name+'):',JSON.stringify(k),'; lamps',lamps);
  assert(k.wtree>=4&&k.wglade===1&&lamps>=20,'a tree-village has its goldboughs round a feasting glade, lamps lit');
  const O=ps.flatMap(P=>P.sites.filter(s=>s.k==='outpost'))[0],G=ps.flatMap(P=>P.sites.filter(s=>s.k==='farm'))[0];
  assert(siteLayout(O).parts.some(p=>p.k==='wtree'&&p.fl.length===2)&&siteLayout(G).parts.some(p=>p.k==='wglade'),'a watch-tree has its two platforms, a glade its tables');}
