// Strife (D-063): the creatures of the Volcanic Wastes and the folk of the realms (men, riders and elves) are foes to each other
// wherever they meet, in creative too. They see each other, close in, strike and shoot until one falls; a blow lands on a big
// creature's near side; shots strike the other side and pass their own; townsfolk flee; the folk never turn on a player who
// does them no harm, and what falls to the other side leaves the player nothing. Each side keeps the peace within itself.
// Now and then a host of the nearest people marches through the wastes against their creatures.
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const clearFoes=()=>{for(const f of [...foes])removeFoe(f);for(const s of [...shots]){scene.remove(s.m);}shots.length=0;foeSpots.clear();realmWrath.clear();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT=99;hurtCD=Math.max(0,hurtCD-0.05);updFoes(0.05);if(fn&&fn())return true;}return false;};
// an open flat spot on the wastes, the player well off to the side
playing=true;settings.time='day';
let sx=-1,sz=-1;for(const [WX,WZ] of [[3010,800],[3250,520],[3150,300],[2700,300]]){if(sx>=0)break;gen(WX,WZ); // (the first of these windows of the main basin's floor that has one)
for(let k=0;k<(W-60)*(D-20)&&sx<0;k+=3){const x=30+(k%(W-60)),z=10+Math.floor(k/(W-60)),g=ground[x+W*z];let ok=g>SEA-WB_DEP&&biome[x+W*z]===4;
  for(let a=-14;a<=14&&ok;a++)for(let b=-3;b<=3&&ok;b++){const gg=ground[x+a+W*(z+b)];if(Math.abs(gg-g)>1||world[I(x+a,gg,z+b)]===LAVA||SOLID[world[I(x+a,gg+1,z+b)]]||SOLID[world[I(x+a,gg+2,z+b)]])ok=false;}
  // and level, dry ground all round out to 64 (the hosts come from behind the player, a warband meets them halfway; no river
  // valley or flank between them)
  const o={};for(let r=16;r<=64&&ok;r+=12)for(let q=0;q<12&&ok;q++){const X=x+OX+Math.round(Math.cos(q*0.5236)*r),Z=z+OZ+Math.round(Math.sin(q*0.5236)*r);colInfo(X,Z,o);if(o.river||o.bank||o.vflow||o.vfis||Math.abs(o.h-g)>6)ok=false;}
  if(ok){sx=x;sz=z;}}}
assert(sx>0,'an open place on the wastes for the test');
const put=(dx)=>{PL.x=sx+0.5+(dx||0);PL.z=sz+0.5;PL.y=ground[Math.floor(PL.x)+W*sz]+1;PL.vx=PL.vy=PL.vz=0;PL.yaw=Math.PI/2;PL.pitch=0;};
const near=(k,dx)=>{const x=sx+0.5+dx,z=sz+0.5,y=foeStand(x,ground[Math.floor(x)+W*sz]+1,z,FOES[k].tall||2);const f=addFoe(k,x,y,z,{st:'idle',t:3});f.yaw=f.hd=Math.atan2(-dx,0);return f;};
// ---- in creative: a swordsman of the realm and an orc raider meet and fight until one falls; the player is left alone
setMode('creative');put(-13);clearFoes();hp=20;
{const a=near('rsword',-2),b=near('raider',8);let met=0,t=0;const done=run(60,()=>{t+=0.05;if(a.foe===b&&b.foe===a)met++;return a.dead||b.dead;});
  info('a swordsman of the realm and an orc raider ten blocks apart: fighting each other for',(met*0.05).toFixed(1),'s; the',a.dead?'raider':'swordsman','stands after',t.toFixed(1),'s with',(a.dead?b:a).hp.toFixed(0),'health; the player has',hp);
  assert(met>0&&done&&hp===20,'in creative a swordsman of the realm and an orc raider see each other, close in and fight until one falls; the player is left alone');}
// each people against each kind: men, riders and elves fight orcs, goblins and trolls; the elves are the strongest
put(-13);clearFoes();
{const res=[];for(const [fk,ok] of [['rspear','raider'],['hspear','goblin'],['esword','raider'],['espear','brute'],['eknight','raider']]){clearFoes();const a=near(fk,-3),b=near(ok,4);let hits=0,h0=a.hp+b.hp;run(40,()=>{return a.dead||b.dead;});
    res.push(fk+' v '+ok+': '+(a.dead?ok:b.dead?fk:'none')+' wins ('+a.hp.toFixed(0)+'/'+b.hp.toFixed(0)+')');if(a.hp+b.hp<h0)hits++;assert(hits>0&&(a.dead||b.dead),FOES[fk].n+' and '+FOES[ok].n.toLowerCase()+' fight to a fall');}
  info(res.join('; '));
  clearFoes();let ew=0;for(let k=0;k<4;k++){clearFoes();const a=near('esword',-3),b=near('raider',4);run(40,()=>a.dead||b.dead);if(b.dead&&!a.dead)ew++;}
  assert(ew>=3,'a bladewarden of the elves beats an orc raider ('+ew+' of 4)');}
// a blow lands on a big creature's near side: a bladewarden reaches a held Emberlord and a troll
put(-13);clearFoes();
{const e=near('ember',8);e.hold=1;const a=near('esword',-4),h0=e.hp;run(12);info('a bladewarden against an Emberlord (held): its health',h0,'to',e.hp.toFixed(0));
  assert(e.hp<h0,'a bladewarden\'s blows reach an Emberlord\'s near side');
  clearFoes();const t=near('troll',6);t.hold=1;const b=near('esword',-4),t0=t.hp;run(8);assert(t.hp<t0,'and a troll\'s');}
// shots: an orc bowman's arrow passes an orc in its way and strikes an elf; an elf's arrow passes a player it does not hunt
setMode('survival');put(-13);clearFoes();hp=20;dead=false;
{const bw=near('bowman',8),rd=near('raider',2),el=near('esword',-6);for(const f of [bw,rd,el])f.hold=1;bw.foe=el;bw.yaw=Math.atan2(el.x-bw.x,el.z-bw.z);foeShoot(bw,FOES.bowman.shot,0);
  let n=0;while(shots.length&&n++<60)updShots(0.05);info('an orc arrow across an orc to an elf: the orc',rd.hp+'/'+rd.mhp,'; the elf',el.hp.toFixed(0)+'/'+el.mhp);
  assert(rd.hp===rd.mhp&&el.hp<el.mhp,'an orc\'s arrow passes an orc in its way and strikes the elf it was loosed at');
  clearFoes();put(0);const ar=near('ebow',-9),og=near('raider',9);ar.hold=og.hold=1;ar.foe=og;ar.yaw=Math.atan2(og.x-ar.x,og.z-ar.z);PL.y=ar.y+0.3;foeShoot(ar,FOES.ebow.shot,0);
  n=0;while(shots.length&&n++<60)updShots(0.05);info('an elven arrow through the player to an orc: the player',hp,'; the orc',og.hp.toFixed(0)+'/'+og.mhp);
  assert(hp===20&&og.hp<og.mhp,'an elf\'s arrow passes a player it does not hunt and strikes the orc');}
// townsfolk flee from the creatures; the folk who fight them in survival never turn on a player who does them no harm
put(-13);clearFoes();hp=20;
{const r=near('rman',-2),o=near('raider',6);o.hold=1;const d0=Math.hypot(r.x-o.x,r.z-o.z);run(3);const d1=Math.hypot(r.x-o.x,r.z-o.z);
  info('a townsman six blocks from an orc: state',r.st,'; distance',d0.toFixed(1),'to',d1.toFixed(1));assert(r.st==='flee'&&r.foe===o&&d1>d0+3,'a townsman flees from an orc');}
put(-13);clearFoes();hp=20;
{const g=[near('espear',-3),near('ebow',-6)],o=near('goblin',5);o.hold=1;let turned=0;run(12,()=>{for(const f of g)if(f.st==='chase'&&!f.foe)turned++;});
  info('elves against a goblin beside the player in survival: the goblin',o.dead?'falls':o.hp.toFixed(0)+' health','; the player',hp);
  assert(o.dead&&turned===0&&hp===20,'in survival the elves strike the goblin down and never the player beside them');}
// what falls to the other side leaves the player nothing; a creature the player strikes turns from an elf to the player
put(-13);clearFoes();inv.fill(null);
{const o=near('ochief',4),el=near('esword',-2);o.hold=el.hold=1;foeHurtFoe(o,999,el,1,0,1,true);assert(o.dead&&inv.every(q=>!q),'an orc warchief slain by an elf leaves the player nothing');
  clearFoes();put(0);sel=0;inv[0]={id:374,c:1};const r=near('raider',2.2),e2=near('esword',5);e2.hold=r.hold=1;r.foe=e2;r.st='chase';{const e=eyePos(),dx=r.x-e.x,dz=r.z-e.z,dy=r.y+r.m.box[4]*0.55-e.y;PL.yaw=Math.atan2(-dx,-dz);PL.pitch=Math.atan2(dy,Math.hypot(dx,dz));}foeHitCD=0;
  const hit=foeAct(0);info('the player strikes an orc fighting an elf:',hit?'hit':'missed','; it now',r.foe?'fights the elf':'hunts the player');assert(hit&&!r.foe&&r.st==='chase','an orc the player strikes turns from the elf to the player');}
// each side keeps the peace within itself: orcs and goblins, men and elves
setMode('creative');put(-13);clearFoes();
{const a=near('raider',-2),b=near('goblin',2),c=near('rsword',-8),d=near('esword',-5);let n=0;run(6,()=>{for(const f of [a,b,c,d])if(f.foe&&(f===a||f===b?(f.foe===a||f.foe===b):(f.foe===c||f.foe===d)))n++;});
  assert(n===0&&[a,b].every(f=>f.foe===c||f.foe===d||!f.foe),'orcs do not fight goblins, nor men elves');}
// ---- the hosts: in the wastes the nearest people now and then sends a host through, out of sight behind the player to as far
// beyond; it meets a warband
setMode('survival');put(0);clearFoes();hp=20;
{const H=hostOf(PL.x+OX,PL.z+OZ);info('the wastes at X',Math.round(PL.x+OX),'Z',Math.round(PL.z+OZ),': the hosts come from',H?H.k+' ('+H.C.k+')':'none');
  assert(H&&H.C&&H.k,'the wastes have a people near enough to send hosts');
  let host=[];for(let k=0;k<40&&!host.length;k++){hostT=0;foeSpawnTick();host=foes.filter(f=>f.host);}
  const kinds={};for(const f of host)kinds[f.kind]=(kinds[f.kind]||0)+1;info('a host:',JSON.stringify(kinds));
  const c=host.reduce((a,f)=>[a[0]+f.x/host.length,a[1]+f.z/host.length],[0,0]),hm=host.reduce((a,f)=>[a[0]+f.hx/host.length,a[1]+f.hz/host.length],[0,0]);
  const back=(c[0]-PL.x)*(hm[0]-PL.x)+(c[1]-PL.z)*(hm[1]-PL.z)<0;
  assert(host.length>=4&&host.every(f=>f.kind[0]===H.C.fp[0]&&f.prov===H.key&&f.st==='return')&&back&&Math.hypot(c[0]-PL.x,c[1]-PL.z)>40,'a host of that people comes from out of sight and marches past the player to the far side');
  const again=foes.length;hostT=0;foeSpawnTick();assert(foes.filter(f=>f.host).length===host.length,'one host at a time');
  // a warband between them
  const mx=(c[0]+PL.x)/2,mz=(c[1]+PL.z)/2,band=spawnGroup('band',4,mx,ground[Math.floor(mx)+W*Math.floor(mz)],mz,4,{});
  let fought=0;run(60,()=>{if(host.some(f=>f.foe)&&band.some(f=>f.foe))fought=1;return band.every(f=>f.dead)||host.every(f=>f.dead);});
  info('the host and a warband of',band.length,':',host.filter(f=>!f.dead).length,'of the host stand,',band.filter(f=>!f.dead).length,'of the warband');
  assert(fought&&(band.some(f=>f.dead)||host.some(f=>f.dead)),'the host and a warband of orcs fall upon each other');}
