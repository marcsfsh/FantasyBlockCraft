// The riders of the plains (D-061): the second people of the realms of men. About half the stretches of the Golden Steppe, the
// Heath Moors and the Barrow Hills are held by them, as provinces (a hill town, a hold, steadings, horse farms, beacons) joined
// by their roads, on level ground; the plans are pure. The hill town stands in round terraces in a palisade, its longhouses under
// thatch and turf, the golden hall on top; a steading has its longhouses, mead hall, hurdles and paddock; a hold its round wall
// and keep. The folk are neutral until struck (horsemen among the guards), never in creative; paddock horses stay penned.
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const at=(X,y,Z)=>get(X-OX,y,Z-OZ);
const H=REALM_CULTS.horse,Wc=REALM_CULTS.white;
// ---- which stretches are held, and by whom
const elig=new Map();for(let i=-20;i<20;i++)for(let j=-20;j<20;j++){const c=stretchCell(landSite(i,j));if(H.lands.has(LANDS[cellLand(c)].k))elig.set(landKey(c.i,c.j),c);}
const held=[...elig.values()].filter(c=>realmHeld(c)===H),share=held.length/Math.max(1,elig.size);
info('stretches of Golden Steppe, Heath Moors and Barrow Hills within 6400 blocks:',elig.size,'; held by the riders:',held.length,'('+Math.round(share*100)+'%)');
assert(elig.size>=30&&share>0.3&&share<0.7,'about half the stretches of the open lands are held by the riders');
{let cross=0;for(let i=-20;i<20;i++)for(let j=-20;j<20;j++){const c=stretchCell(landSite(i,j)),C=realmHeld(c);if(C&&!C.lands.has(LANDS[cellLand(c)].k)&&!(C.share&&C.share[LANDS[cellLand(c)].k]))cross++;}
  assert(cross===0&&!H.lands.has('green')&&!Wc.lands.has('steppe'),'each people holds only its own lands (and those it shares, D-066)');}
// ---- provinces
const ps=held.map(c=>provinceOf(c.i,c.j)),count={};for(const P of ps)for(const s of P.sites)count[s.k]=(count[s.k]||0)+1;
const kings=new Set(ps.map(P=>P.kingdom.name));
info('provinces',ps.length,'in',kings.size,'kingdoms ('+ps.filter(P=>P.capital).length+' with the king\'s seat); sites:',JSON.stringify(count),'; roads',ps.reduce((n,P)=>n+P.roads.length,0));
info('for example:',ps.slice(0,3).map(P=>P.name+' of '+P.kingdom.name+': '+P.sites.filter(s=>s.k!=='farm').slice(0,5).map(s=>s.name).join(', ')).join(' | '));
assert(ps.every(P=>P.cult===H&&P.kingdom.name.startsWith('The Riders of ')),'every province is of a kingdom of the riders');
assert(ps.filter(P=>P.sites.some(s=>s.k==='city')).length>=ps.length*0.6&&count.fort>=3&&count.village>=ps.length&&count.outpost>=ps.length&&count.farm>=ps.length,'hill towns, holds, steadings, beacons and horse farms stand across the provinces');
const names=ps.flatMap(P=>[P.kingdom.name,P.name,...P.sites.map(s=>s.name)]);
assert(names.every(n=>!isBlockedName(n.replace(/^The Riders of /,'').replace(/ (Hold|Beacon|Stud)$/,''))),'no name of the riders is one of Tolkien\'s');
let clash=0;for(const P of ps)for(const s of P.sites){for(const t of P.sites)if(t!==s&&Math.hypot(t.X-s.X,t.Z-s.Z)<t.R+s.R+8)clash++;if(siteNear(s.X,s.Z,s.R)||sigNear(s.X,s.Z,s.R)||smallNear(s.X,s.Z,0))clash++;}
assert(clash===0,'the sites keep apart, and no ruin, landmark or small structure stands on one ('+clash+' clashes)');
{const P=ps[0],key=JSON.stringify(P.sites.map(s=>[s.k,s.X,s.Z,s.R,s.T,s.name,s.dir]));provC.clear();realmTC.clear();const P2=provinceOf(P.root.i,P.root.j);
  assert(JSON.stringify(P2.sites.map(s=>[s.k,s.X,s.Z,s.R,s.T,s.name,s.dir]))===key&&P2.roads.length===P.roads.length,'a province planned again from nothing is the same');}
// ---- the ground: level under every site, a hill town's in round terraces four blocks a step
{let bad=0,n=0;for(const P of ps.slice(0,8))for(const s of P.sites){for(let k=0;k<12;k++){const a=k/12*6.283,d=s.R*(k%2?0.5:0.85),X=Math.round(s.X+Math.cos(a)*d),Z=Math.round(s.Z+Math.sin(a)*d),o=colInfo(X,Z,{});n++;
    const want=s.k==='city'?cityGround(s,X,Z):s.T;if(o.h!==want||o.river||o.lake||o.rvBot<999)bad++;}}
  info('level ground under the sites:',n-bad,'of',n,'samples at their level');assert(bad===0,'the ground under every site is level, a hill town\'s in terraces');}
// ---- the nearest hill town: its palisade and towers, longhouses under thatch and turf, the golden hall; no heather in its lanes
const towns=ps.flatMap(P=>P.sites.filter(s=>s.k==='city')).sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z)),C=towns[0];
gen(C.X,C.Z);
{const cnt={},ids=[GTHATCH,TURF,WATTLE,CTIMBER,FSTONE,STAKES,LOG,HORNS,HEARTH,GILDED,SHIELDS,TAPESTRY,HBANNER,FENCE,LANTERN,DLANTERN,HEATHER,WSBRICK];for(const id of ids)cnt[id]=0;
  for(let X=C.X-C.R-4;X<=C.X+C.R+4;X++)for(let Z=C.Z-C.R-4;Z<=C.Z+C.R+4;Z++){const inner=Math.hypot(X-C.X,Z-C.Z)<C.R-3;for(let y=C.T-6;y<C.T+60;y++){const id=at(X,y,Z);if(cnt[id]!==undefined&&(id!==HEATHER||inner))cnt[id]++;}}
  const [gx,gz]=siteXZ(C,-C.R+1,0),gateOpen=[1,2,3,4,5].every(dy=>at(gx,C.T+dy,gz)===AIR),houses=siteLayout(C).parts.filter(p=>p.k==='house').length;
  info(C.name,'('+(C.prov.capital?'the king\'s seat of ':'a hill town of ')+C.prov.kingdom.name+', '+C.R*2+' across, '+C.tiers+' terraces, '+houses+' longhouses):',ids.map(id=>nameOf(id)+' '+cnt[id]).join(', '),'; gate open',gateOpen);
  const A=C.R*C.R;
  assert(cnt[LOG]>1.2*A&&cnt[STAKES]>2*C.R&&cnt[FSTONE]>A&&cnt[GTHATCH]+cnt[TURF]>A&&cnt[WATTLE]>0.12*A,'the town stands in a palisade of logs on fieldstone, its longhouses of wattle under thatch and turf');
  assert(houses>=10&&cnt[GILDED]>40&&cnt[HORNS]>=houses&&cnt[HEARTH]>=houses&&cnt[TAPESTRY]>0&&cnt[SHIELDS]>0&&cnt[HBANNER]>8,'longhouses with hearths and horse heads on their gables, the golden hall gilded and hung with tapestries and shields');
  assert(cnt[LANTERN]>0.008*A&&cnt[DLANTERN]===0&&cnt[HEATHER]===0&&cnt[WSBRICK]===0,'its lamps are lit; no heather grows in it and none of the white realm\'s stone is in it');
  assert(gateOpen,'its gate stands open');
  assert(surfaceName(C.X,C.T+1,C.Z)===C.name&&realmPlace(C.X,C.Z).line.includes(C.prov.kingdom.name.replace(/^The /,'')),'standing in it, the readout names the town and its kingdom');}
// ---- the folk: guards and horsemen, freemen and thanes; neutral until struck; never in creative; horses penned
{const clear=()=>{for(const f of [...foes])removeFoe(f);for(const a of [...animals])removeAnimal(a);for(const s of [...shots]){scene.remove(s.m);}shots.length=0;foeSpots.clear();realmWrath.clear();};
  const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT=99;hurtCD=Math.max(0,hurtCD-0.05);updFoes(0.05);updAnimals(0.05);if(fn)fn();}};
  for(const k of ['hspear','hbow','hcapt','hrider','hman','hwoman','hherd','hthane','hsmith']){const K=AM_KINDS[FOES[k].m];for(let ci=0;ci<K.coats.length;ci++)amBuild(FOES[k].m,ci,{});}
  const hr=amBuild('hrider',0,{}).box;info('a horseman stands',hr[4].toFixed(2),'blocks tall and',(hr[5]-hr[2]).toFixed(2),'long; a guard',amBuild('hspear',0,{}).box[4].toFixed(2));
  assert(hr[4]>2.5&&hr[4]<3.2&&hr[5]-hr[2]>1.3&&FOES.hrider.tall===3,'every kind and coat of the riders builds; a horseman is a rider on his horse');
  const [gx,gz]=siteXZ(C,-C.R+8,0);PL.x=gx-OX+0.5;PL.z=gz-OZ+0.5;PL.y=C.T+1;PL.vx=PL.vy=PL.vz=0;setMode('survival');hp=20;dead=false;playing=true;settings.time='day';
  clear();foeSpawnTick();const folk=foes.filter(f=>FOES[f.kind].folk),kinds={};for(const f of folk)kinds[f.kind]=(kinds[f.kind]||0)+1;
  const pens=animals.filter(a=>a.pen);info('folk about the gate of',C.name,':',JSON.stringify(kinds),'; horses in the paddocks',pens.length);
  assert(folk.length>=4&&folk.every(f=>f.kind[0]==='h')&&folk.some(f=>!FOES[f.kind].civ)&&folk.every(f=>f.prov===C.prov.key),'the riders\' guards and folk are about the gate');
  const hp0=hp;let chased=0;run(12,()=>{for(const f of foes)if(f.st==='chase')chased++;});
  const strayed=pens.filter(a=>!a.dead&&Math.hypot(a.x-a.pen.x,a.z-a.pen.z)>a.pen.r+0.6).length;
  assert(hp===hp0&&chased===0,'they take no notice of the player who does them no harm');
  assert(pens.length>=2&&strayed===0,'the horses in the paddock stay in it ('+strayed+' strayed)');
  const tgt=foes.find(f=>FOES[f.kind].civ)||foes.find(f=>FOES[f.kind].folk);PL.x=tgt.x+1.5;PL.z=tgt.z;PL.y=tgt.y;
  folkProvoke(tgt,90);tgt.hp-=2;foeAlert(tgt);run(1.5);
  const guards=foes.filter(f=>FOES[f.kind].folk&&!FOES[f.kind].civ&&!f.dead),gc=guards.filter(f=>f.st==='chase').length;
  info('struck',FOES[tgt.kind].n,': guards chasing',gc,'of',guards.length);assert(folkWrath(tgt)&&gc>=1,'struck, the riders take up arms');
  // a horseman rides the player down at a horse's pace: he keeps up the chase and gains on a guard on foot
  clear();{const [px,pz]=siteXZ(C,-C.R-10,0);PL.x=px-OX+0.5;PL.z=pz-OZ+0.5;PL.y=hAt(px,pz)+1;}const [hx,hz]=siteXZ(C,-C.R-26,0),R1=addFoe('hrider',hx-OX+0.5,hAt(hx,hz)+1,hz-OZ+0.5,{prov:C.prov.key,site:C});realmWrath.set(C.prov.key,60);R1.st='chase';R1.seen=0;let top=0;run(2,()=>{top=Math.max(top,R1.sp);});
  info('a horseman in the chase reaches',top.toFixed(1),'blocks a second (a guard runs',FOES.hspear.run+')');
  assert(R1.st==='chase'&&top>FOES.hspear.run*1.2&&FOES.hrider.run>=FOES.hspear.run*1.4,'a horseman rides the player down faster than a guard can run');
  clear();setMode('creative');foeSpawnTick();const t2=foes.find(f=>FOES[f.kind].folk);if(t2){folkProvoke(t2,90);foeAlert(t2);run(2);}
  assert(!t2||(!folkWrath(t2)&&foes.every(f=>f.st!=='chase')),'in creative the riders never take up arms');
  // their greetings name the place and the kingdom
  assert(['hguard','hcapt','hman','hwoman','hherd','hthane','hsmith'].every(k=>FOLK_SAY[k]&&FOLK_SAY[k].length>=3),'each of the riders has words for a passer-by');
  clear();}
// ---- a steading: longhouses of wattle under turf and thatch round the green, the mead hall, a well, a paddock, hurdles round it
{const V=ps.flatMap(P=>P.sites.filter(s=>s.k==='village')).sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z))[0];gen(V.X,V.Z);
  const cnt={},ids=[WATTLE,GTHATCH,TURF,LOG,HORNS,HEARTH,FENCE,WATER,HAYBALE,FARM_D];for(const id of ids)cnt[id]=0;
  for(let X=V.X-V.R-40;X<=V.X+V.R+40;X++)for(let Z=V.Z-V.R-40;Z<=V.Z+V.R+40;Z++)for(let y=V.T-6;y<V.T+24;y++){const id=at(X,y,Z);if(cnt[id]!==undefined)cnt[id]++;}
  info(V.name,'(a steading of '+V.prov.kingdom.name+'):',ids.map(id=>nameOf(id)+' '+cnt[id]).join(', '));
  assert(cnt[WATTLE]>120&&cnt[GTHATCH]+cnt[TURF]>150&&cnt[HORNS]>=4&&cnt[HEARTH]>=3&&cnt[FENCE]>20&&cnt[WATER]>=1&&cnt[FARM_D]>60,'the steading has its longhouses and hall, a paddock, a well and its fields');
  assert(surfaceName(V.X,V.T+1,V.Z)===V.name,'the readout names the steading');}
// ---- a hold: its round wall of fieldstone, the round keep with its gallery, the gate under the horse heads
{const F=ps.flatMap(P=>P.sites.filter(s=>s.k==='fort')).sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z))[0];gen(F.X,F.Z);
  let wall=0,keep=0;for(let k=0;k<36;k++){const a=k/36*6.283,[x,z]=siteXZ(F,Math.round(Math.cos(a)*(F.R-2)),Math.round(Math.sin(a)*(F.R-2)));if(at(x,F.T+5,z)===FSTONE)wall++;}
  for(let y=F.T+1;y<F.T+40;y++){const [x,z]=siteXZ(F,14,3);if(at(x,y,z)===FSTONE)keep++;}
  info(F.name,'(a hold of '+F.prov.kingdom.name+'): its wall stands at',wall,'of 36 bearings; its keep',keep,'blocks high');
  assert(wall>=28&&keep>=20,'the hold has its round wall and its keep');}
