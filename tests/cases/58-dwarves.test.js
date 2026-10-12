// The mountain dwarves (D-066): the High Mountains the high elves leave, and one stretch in two of the Pine Highlands and the
// Glacier Fields, are provinces of mountain kingdoms: holds under a massif with their great gate, bastions, mining towns,
// lookouts and mines, joined by their stone roads, on terraces cut into the land. Under each hold its workings go down into the
// mountain (as much under it as stands over it): the gate hall, the great hall and the king's seat, barracks, the shaft with its
// hoist through every level, the forge hall with its channel of molten iron, the cistern, the smelting hall and the mines; they are
// walled all round, so no cave's water or lava reaches in. Their folk are short and broad, strong in arms, neutral until struck.
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const at=(X,y,Z)=>get(X-OX,y,Z-OZ);
const E=REALM_CULTS.dwarf,EL=REALM_CULTS.elf;
// ---- which stretches are held, and by whom: the High Mountains shared with the elves
const st=new Map();for(let i=-20;i<20;i++)for(let j=-20;j<20;j++){const c=stretchCell(landSite(i,j)),k=LANDS[cellLand(c)].k;if(k==='mtn'||E.lands.has(k))st.set(landKey(c.i,c.j),c);}
const by={},held={};for(const c of st.values()){const k=LANDS[cellLand(c)].k,H=realmHeld(c);by[k]=(by[k]||0)+1;const w=H===E?'dwarf':H===EL?'elf':'none';held[k+':'+w]=(held[k+':'+w]||0)+1;}
info('stretches within 6400 blocks:',JSON.stringify(by),'; held:',JSON.stringify(held));
const mtn=[...st.values()].filter(c=>LANDS[cellLand(c)].k==='mtn');
assert(mtn.every(c=>realmHeld(c)===(hsh(c.i,9401,c.j)<0.5?EL:E))&&mtn.some(c=>realmHeld(c)===E)&&mtn.some(c=>realmHeld(c)===EL),'the high elves keep their High Mountains, and the dwarves hold the rest');
const others=[...st.values()].filter(c=>LANDS[cellLand(c)].k!=='mtn'),oh=others.filter(c=>realmHeld(c)===E).length;
assert(others.length>=10&&oh/others.length>0.3&&oh/others.length<0.7&&Object.values(REALM_CULTS).filter(C=>C!==E).every(C=>[...E.lands].every(k=>!C.lands.has(k))),'one stretch in two of the Pine Highlands and the Glacier Fields is theirs, and no other people\'s land');
// ---- provinces
const held2=[...st.values()].filter(c=>realmHeld(c)===E),t0=process.hrtime.bigint(),ps=held2.map(c=>provinceOf(c.i,c.j)),ms=Number(process.hrtime.bigint()-t0)/1e6,count={};
for(const P of ps)for(const s of P.sites)count[s.k]=(count[s.k]||0)+1;
info('provinces',ps.length,'in',new Set(ps.map(P=>P.kingdom.name)).size,'kingdoms ('+ps.filter(P=>P.capital).length+' with the high hold), planned in',Math.round(ms),'ms; sites:',JSON.stringify(count));
info('for example:',ps.slice(0,3).map(P=>P.name+' of '+P.kingdom.name+': '+P.sites.filter(s=>s.k!=='farm').slice(0,5).map(s=>s.name).join(', ')).join(' | '));
assert(ps.every(P=>P.cult===E&&P.kingdom.name.startsWith('The Mountain Kingdom of ')),'every province is of a mountain kingdom');
assert(count.city>=ps.length*0.5&&count.fort>=3&&count.village>=ps.length&&count.outpost>=ps.length&&count.farm>=ps.length,'mountain holds, bastions, mining towns, lookouts and mines stand across the provinces');
const names=ps.flatMap(P=>[P.kingdom.name,P.name,...P.sites.map(s=>s.name)]);
assert(names.every(n=>!isBlockedName(n.replace(/^The Mountain Kingdom of /,'').replace(/ (Bastion|Lookout|Mine)$/,''))),'no name of the dwarves is one of Tolkien\'s');
let clash=0;for(const P of ps)for(const s of P.sites){for(const t of P.sites)if(t!==s&&Math.hypot(t.X-s.X,t.Z-s.Z)<t.R+s.R+8)clash++;if(siteNear(s.X,s.Z,s.R)||sigNear(s.X,s.Z,s.R)||smallNear(s.X,s.Z,0))clash++;}
assert(clash===0,'the sites keep apart, and no ruin, landmark or small structure stands on one ('+clash+' clashes)');
{const P=ps[0],key=JSON.stringify(P.sites.map(s=>[s.k,s.X,s.Z,s.R,s.T,s.name,s.dir]));provC.clear();realmTC.clear();const P2=provinceOf(P.root.i,P.root.j);
  assert(JSON.stringify(P2.sites.map(s=>[s.k,s.X,s.Z,s.R,s.T,s.name,s.dir]))===key&&P2.roads.length===P.roads.length,'a province planned again from nothing is the same');}
// ---- the nearest hold in the High Mountains: its ground, its gate and face, its works above; its workings below
const C=ps.flatMap(P=>P.sites.filter(s=>s.k==='city'&&s.prov.L.k==='mtn')).sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z))[0],L=siteLayout(C),M=L.mass;
{let n=0,ok=0;for(let k=0;k<48;k++){const a=k/48*6.283,d=C.R*(k%3===0?0.3:k%3===1?0.6:0.85),X=Math.round(C.X+Math.cos(a)*d),Z=Math.round(C.Z+Math.sin(a)*d),[u,v]=siteUV(C,X,Z),p=elfPad(C,u,v);n++;
    const h=colInfo(X,Z,{}).h;if(p?h===p.y:h===Math.max(elfTerrace(C,X,Z),massifAt(M,u,v)))ok++;}
  info(C.name,'('+(C.prov.capital?'the high hold of ':'a mountain hold of ')+C.prov.kingdom.name+', '+C.R*2+' across): ground on its terraces, platforms or massif',ok,'of',n,'; the massif',M.H,'over the gate\'s floor');
  assert(ok===n,'the hold\'s ground is cut into terraces, a platform under each building, the massif raised at its back');}
gen(C.X,C.Z);
const pk={};for(const p of L.parts)pk[p.k]=(pk[p.k]||0)+1;const hk={};for(const q of L.hold)hk[q.k]=(hk[q.k]||0)+1;
info('its parts',JSON.stringify(pk),'; its workings',JSON.stringify(hk));
// what stands over the ground (blocks the builders laid) against what is carved under it (the workings' air)
{let above=0,below=0,bad=0;const ins=(u,v,y)=>L.hold.some(q=>{const iv=dIv(q,u,v);return iv&&y>=iv[0]&&y<=iv[1];});const laid=id=>id>=1159&&id<=1173||[SLATE,PAVING,GRATE,PLANKS,LADDER,CHAIN,BRAZIER,BARREL,CRATE,HIDE,STEELB,WOOLB,GOLDB].includes(id);
  for(let X=C.X-C.R-60;X<=C.X+C.R+60;X++)for(let Z=C.Z-C.R-60;Z<=C.Z+C.R+60;Z++){const [u,v]=siteUV(C,X,Z),g=colInfo(X,Z,{}).h;
    for(let y=g+1;y<g+50;y++)if(laid(at(X,y,Z)))above++;
    if(u<-C.R-60||u>C.R+60||v<-C.R-60||v>C.R+60)continue;
    for(let y=M.y-70;y<=g;y++){const id=at(X,y,Z);if(id===AIR&&ins(u,v,y)){below++;for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){const n=at(X+dx,y+dy,Z+dz);if(n===LAVA||n===WATER&&!dwarfWaterAt(X+dx,y+dy,Z+dz))bad++;}}}}
  info('built over the ground',above,'blocks; carved under it',below,'blocks; water or lava touching the workings',bad);
  assert(below>=above,'as much is worked under the mountain as is built over it');
  assert(bad===0,'the workings are walled all round: no cave\'s water or lava reaches into them');}
{const [gx,gz]=siteXZ(C,M.f-3,0),[hx,hz]=siteXZ(C,M.f+20,0),Y=M.y;
  const [ix,iz]=siteXZ(C,M.f+2,0),gate=[1,2,3,4,5,6].every(d=>at(gx,Y+d,gz)===AIR)&&[1,2,3,4,5,6,7,8].every(d=>at(ix,Y+d,iz)===AIR);
  const hall=[1,2,3,5,10,14].every(d=>at(hx,Y+d,hz)===AIR)&&at(hx,Y,hz)===DFLAG,[tx,tz]=siteXZ(C,L.hold.find(q=>q.k==='great').u1,0),throne=at(tx,Y+7,tz)===GOLDB;
  let st=0;for(const q of L.parts.filter(p=>p.k==='dstatue')){const [x,z]=siteXZ(C,q.u0+2,(q.v0+q.v1)>>1);for(let y=Y+4;y<Y+28;y++)if(at(x,y,z)!==AIR)st++;}
  info('the gate open',gate,'; the great hall',hall,'; the king\'s seat crowned in gold',throne,'; the statues\' height',st);
  assert(gate&&hall&&throne&&st>=30,'the great gate stands open between two colossal kings of stone, the great hall within, the king\'s seat at its back');
  assert(surfaceName(hx,Y+1,hz)===C.name&&surfaceName(gx,Y+1,gz)===C.name,'the readout names the hold, under the mountain as before its gate');}
{const fg=L.hold.find(q=>q.k==='forge'),sh=L.hold.find(q=>q.k==='shaft'&&q.r>2),ci=L.hold.find(q=>q.k==='cistern'),sm=L.hold.find(q=>q.k==='smelt');
  const [fx,fz]=siteXZ(C,(fg.u0+fg.u1)>>1,0),[sx,sz]=siteXZ(C,Math.round(sh.cu),Math.round(sh.cv));let chain=0;for(let y=sh.y0;y<=sh.y1;y++)if(at(sx,y,sz)===CHAIN)chain++;
  let water=0;if(ci)for(const w of L.water)for(let u=w.u0;u<=w.u1;u++)for(let v=w.v0;v<=w.v1;v++){const [x,z]=siteXZ(C,u,v);for(let y=w.y0;y<=w.y1;y++)if(at(x,y,z)===WATER)water++;}
  let molten=0,anv=0,ore=0,props=0;for(let X=C.X-C.R-60;X<=C.X+C.R+60;X++)for(let Z=C.Z-C.R-60;Z<=C.Z+C.R+60;Z++)for(let y=M.y-60;y<M.y;y++){const id=at(X,y,Z);if(id===DMOLTEN)molten++;else if(id===DANVIL)anv++;else if(id===DPROP)props++;}
  const gal=L.hold.filter(q=>q.k==='gal');for(const q of gal){for(let u=q.u0-1;u<=q.u1+1;u++)for(let v=q.v0-1;v<=q.v1+1;v++){const [x,z]=siteXZ(C,u,v);for(let y=q.y0-1;y<=q.y1+1;y++){const id=at(x,y,z);if(id===IRON||id===COAL||id===COPO||id===GOLD||id===TINO)ore++;}}}
  info('the forge hall\'s channel',nameOf(at(fx,fg.y0-1,fz)),'; molten iron below the gate',molten,'; anvils',anv,'; the hoist\'s chain',chain,'of',sh.y1-sh.y0+1,'; the cistern\'s water',water,'; the smelting hall',!!sm,'; galleries',gal.length,'with props',props,'and ore in their walls',ore);
  assert(at(fx,fg.y0-1,fz)===DMOLTEN&&molten>=100&&anv>=4,'under the great hall the forge hall, a channel of molten iron down its middle, forges and anvils along it');
  assert(chain===sh.y1-sh.y0+1&&sh.y1-sh.y0>=45,'the shaft goes down through every level, its hoist\'s chain the whole way');
  assert(water>=60&&!!sm&&gal.length>=10&&props>=200&&ore>=10,'the cistern holds its water, the smelting hall glows, the mines spread with their timbers and ore');}
// ---- the folk: short and broad, strong in arms; about the gate and down in the halls; neutral until struck; never in creative
{const clear=()=>{for(const f of [...foes])removeFoe(f);for(const a of [...animals])removeAnimal(a);for(const s of [...shots]){scene.remove(s.m);}shots.length=0;foeSpots.clear();realmWrath.clear();};
  const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT=99;hurtCD=Math.max(0,hurtCD-0.05);updFoes(0.05);if(fn)fn();}};
  const kinds0=['daxe','dhammer','dxbow','dcapt','dking','dlord','dlady','dminer','dsmith'];for(const k of kinds0){const K=AM_KINDS[FOES[k].m];for(let ci=0;ci<K.coats.length;ci++)amBuild(FOES[k].m,ci,{});}
  const hb=amBuild('dhammer',0,{}).box,hr=amBuild('rsword',0,{}).box;info('heights: a hammerer',hb[4].toFixed(2),'(a swordsman of men',hr[4].toFixed(2)+')');
  assert(hb[4]<hr[4]*0.85,'every kind and coat of the dwarves builds; they stand a head and more shorter than men');
  const folkK=Object.keys(FOES).filter(k=>FOES[k].folk&&!FOES[k].civ&&!/capt$/.test(k)&&!FOES[k].elite); // (the lords' elite guards hit harder by design, D-070)
  assert(folkK.every(k=>FOES[k].dmg<=FOES.dhammer.dmg)&&FOES.daxe.hp>FOES.rsword.hp&&FOES.dxbow.shot.dmg>=FOES.rbow.shot.dmg&&FOES.daxe.mass<FOES.rsword.mass,'their hammerers strike the heaviest blows of any folk under a captain and the lords\' guards, their axeguards outlast men, their bolts hit hard');
  const [gx,gz]=siteXZ(C,M.f-6,0);PL.x=gx-OX+0.5;PL.z=gz-OZ+0.5;PL.y=M.y+1;PL.vx=PL.vy=PL.vz=0;setMode('survival');hp=20;dead=false;playing=true;settings.time='day';
  clear();foeSpawnTick();const folk=foes.filter(f=>FOES[f.kind].folk),kinds={};for(const f of folk)kinds[f.kind]=(kinds[f.kind]||0)+1;
  const under=folk.filter(f=>f.y<colInfo(Math.floor(f.x)+OX,Math.floor(f.z)+OZ,{}).h-3).length;
  info('folk about the gate of',C.name,':',JSON.stringify(kinds),'; under the mountain',under);
  assert(folk.length>=6&&folk.every(f=>f.kind[0]==='d'&&f.prov===C.prov.key)&&under>=3,'the dwarves are about the great gate, and down in their halls under the mountain');
  const hp0=hp;let chased=0;run(10,()=>{for(const f of foes)if(f.st==='chase')chased++;});
  assert(hp===hp0&&chased===0,'they take no notice of the player who does them no harm');
  const tgt=foes.find(f=>FOES[f.kind].folk&&Math.abs(f.y-PL.y)<4)||foes.find(f=>FOES[f.kind].folk);PL.x=tgt.x+1.5;PL.z=tgt.z;PL.y=tgt.y;
  folkProvoke(tgt,90);tgt.hp-=2;foeAlert(tgt);run(1.5);
  const guards=foes.filter(f=>FOES[f.kind].folk&&!FOES[f.kind].civ&&!f.dead),gc=guards.filter(f=>f.st==='chase').length;
  info('struck',FOES[tgt.kind].n,': guards taking up arms',gc,'of',guards.length);assert(folkWrath(tgt)&&gc>=1,'struck, the dwarves take up arms');
  clear();setMode('creative');foeSpawnTick();const t2=foes.find(f=>FOES[f.kind].folk);if(t2){folkProvoke(t2,90);foeAlert(t2);run(2);}
  assert(!t2||(!folkWrath(t2)&&foes.every(f=>f.st!=='chase')),'in creative the dwarves never take up arms');
  assert(['dguard','dcapt','dking','dlord','dlady','dminer','dsmith'].every(k=>FOLK_SAY[k]&&FOLK_SAY[k].length>=3),'each of the dwarves has words for a passer-by');
  clear();setMode('survival');}
// ---- a bastion with its garrison below, a mining town over its mines, a lookout, a mine
{const nearest=k=>ps.flatMap(P=>P.sites.filter(s=>s.k===k)).sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z))[0];
  const B=nearest('fort'),LB=siteLayout(B),V=nearest('village'),LV=siteLayout(V),O=nearest('outpost'),G=nearest('farm');
  const bk={},vk={};for(const p of LB.parts)bk[p.k]=(bk[p.k]||0)+1;for(const p of LV.parts)vk[p.k]=(vk[p.k]||0)+1;
  info(B.name,JSON.stringify(bk),'below:',LB.hold.map(q=>q.k).join(','),'|',V.name,JSON.stringify(vk),'below: levels',new Set(LV.hold.filter(q=>q.k==='landing').map(q=>q.y0)).size,', galleries',LV.hold.filter(q=>q.k==='gal').length);
  assert(bk.dwall===1&&bk.dtower>=6&&LB.parts.some(p=>p.k==='dtower'&&p.h2>=5&&p.ball)&&LB.parts.some(p=>p.k==='dtower'&&p.ball),'a bastion has its walls and towers with their ballistae and its keep');
  assert(vk.dhead===1&&vk.dsmelt>=1&&(vk.dhouse||0)>=3&&new Set(LV.hold.filter(q=>q.k==='landing').map(q=>q.y0)).size===2&&LV.hold.filter(q=>q.k==='gal').length>=8,'a mining town has its headframe over a shaft down to two levels of mines, its furnace and its houses');
  assert(siteLayout(O).parts.some(p=>p.k==='dtower'&&p.fire&&p.ball)&&siteLayout(G).parts.some(p=>p.k==='dhead')&&siteLayout(G).hold.some(q=>q.k==='gal'),'a lookout has its tower with a ballista and a beacon, a mine its headframe and galleries');
  gen(V.X,V.Z);const sh=LV.hold.find(q=>q.k==='shaft'),[sx,sz]=siteXZ(V,sh.cu,sh.cv);let ch=0;for(let y=sh.y0;y<=sh.y1;y++)if(at(sx,y,sz)===CHAIN)ch++;
  assert(ch===sh.y1-sh.y0+1&&[1,2,3].every(d=>at(sx,sh.y1+d,sz)===CHAIN),'the mining town\'s hoist hangs from its headframe down its shaft');}
