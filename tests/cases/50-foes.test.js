// Foes of the Volcanic Wastes (D-052): orcs, trolls, goblins and the Emberlords. Every kind builds; in creative they take no
// notice of the player; in survival they see, chase, strike, shoot and throw; the player strikes back with swords, a brute's
// shield takes blows from the front, goblins flee when hurt, armour takes a share; places are peopled (warren halls, fortress
// lords), a fallen Emberlord stays fallen, and the foes move with the window.
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const clearFoes=()=>{for(const f of [...foes])removeFoe(f);for(const s of [...shots]){scene.remove(s.m);}shots.length=0;foeSpots.clear();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT=99;hurtCD=Math.max(0,hurtCD-0.05);updFoes(0.05);if(fn&&fn())return true;}return false;};
// every kind and coat builds; what they leave is a real thing
for(const k in FOES){const F=FOES[k],K=AM_KINDS[F.m];assert(K&&K.coats.length&&F.drops.every(([id])=>ITEMS[id]||BL[id]),k+' has a model and real drops');}
{let n=0;for(const k in FOES)for(let ci=0;ci<AM_KINDS[FOES[k].m].coats.length;ci++){const m=amBuild(FOES[k].m,ci,{});if(m.box[4]>0.8)n++;}info('foe models built',n);}
const hgt=k=>amBuild(FOES[k].m,0,{}).box[4];
info('heights in blocks: goblin',hgt('goblin').toFixed(2),'orc',hgt('raider').toFixed(2),'brute',hgt('brute').toFixed(2),'troll',hgt('troll').toFixed(2),'Emberlord',hgt('ember').toFixed(2));
assert(hgt('goblin')<hgt('raider')&&hgt('raider')<hgt('brute')&&hgt('brute')<hgt('troll')&&hgt('troll')<hgt('ember')&&hgt('ember')>3.5,'goblins are small, orcs tall, brutes taller, trolls huge and an Emberlord towers over all');
// an open flat spot on the wastes
gen(3010,800);playing=true;settings.time='day';
let sx=-1,sz=-1;for(let k=0;k<(W-60)*(D-20)&&sx<0;k+=3){const x=30+(k%(W-60)),z=10+Math.floor(k/(W-60)),g=ground[x+W*z];let ok=g>SEA;
  for(let a=-14;a<=14&&ok;a++)for(let b=-3;b<=3&&ok;b++){const gg=ground[x+a+W*(z+b)];if(Math.abs(gg-g)>1||world[I(x+a,gg,z+b)]===LAVA||SOLID[world[I(x+a,gg+1,z+b)]]||SOLID[world[I(x+a,gg+2,z+b)]])ok=false;}if(ok){sx=x;sz=z;}}
assert(sx>0,'an open place on the wastes for the test');
const put=()=>{PL.x=sx+0.5;PL.z=sz+0.5;PL.y=ground[sx+W*sz]+1;PL.vx=PL.vy=PL.vz=0;PL.yaw=Math.PI/2;PL.pitch=0;};
const near=(k,dx)=>{const x=sx+0.5+dx,z=sz+0.5,y=foeStand(x,ground[Math.floor(x)+W*sz]+1,z,FOES[k].tall||2);const f=addFoe(k,x,y,z,{});f.yaw=f.hd=Math.atan2(PL.x-x,PL.z-z);return f;};
// creative: no notice taken
setMode('creative');put();clearFoes();hp=20;
{const a=near('raider',4),b=near('bowman',-12),t=near('troll',-7);let maxShots=0;run(15,()=>{maxShots=Math.max(maxShots,shots.length);});
  info('in creative after 15 s: raider',a.st,'; bowman',b.st,'; troll',t.st,'; shots',maxShots,'; health',hp);
  assert(foes.every(f=>f.st!=='chase'&&f.st!=='flee')&&maxShots===0&&hp===20,'in creative the foes take no notice of the player: no chase, no shot, no harm');}
// survival: they see you, close in and strike; a bowman shoots
setMode('survival');put();clearFoes();hp=20;food=20;dead=false;
{const a=near('raider',6);let hitAt=-1,t=0;run(12,()=>{t+=0.05;if(hp<20&&hitAt<0)hitAt=t;return hp<20;});
  info('in survival a raider six blocks off: state',a.st,'; first blow after',hitAt.toFixed(2),'s; health',hp);
  assert(a.st==='chase'&&hp<20,'in survival an orc raider sees the player, closes in and strikes');}
put();clearFoes();hp=20;
{const b=near('bowman',-14);let n=0,seen=new Set();run(14,()=>{for(const s of shots)if(!seen.has(s)){seen.add(s);n++;}});
  info('a bowman fourteen blocks off: arrows loosed',n,'; health',hp);assert(n>=2&&hp<20,'an orc bowman keeps its distance and shoots arrows that strike');}
// the player strikes back with an iron sword: the goblin falls and leaves its things
put();clearFoes();hp=20;inv.fill(null);sel=0;inv[0]={id:374,c:1};
{const g=near('goblin',2.2);g.hold=1;const aim=f=>{const e=eyePos(),dx=f.x-e.x,dz=f.z-e.z,dy=f.y+f.m.box[4]*0.55-e.y;PL.yaw=Math.atan2(-dx,-dz);PL.pitch=Math.atan2(dy,Math.hypot(dx,dz));};
  aim(g);let n=0;for(let k=0;k<6&&!g.dead;k++){foeHitCD=0;if(foeAct(0))n++;}
  info('an iron sword hits',hitPower(374).toFixed(1),'; blows to fell a goblin cutter',n,'; dead',!!g.dead,'; the sword worn',inv[0]&&inv[0].d);
  assert(g.dead&&n<=2&&inv[0].d>=1,'a sword fells a goblin in a blow or two, and wears');
  // a brute's shield takes most of a blow from the front, none from behind
  const br=near('brute',2.4);br.hold=1;aim(br);const h0=br.hp;foeHitCD=0;foeAct(0);const front=h0-br.hp;br.yaw=br.hd+Math.PI;const h1=br.hp;foeHitCD=0;foeAct(0);const back=h1-br.hp;
  info('a blow on a brute: from the front',front.toFixed(1),'; from behind',back.toFixed(1));assert(front<back*0.5,'a brute\'s shield takes most of a blow from the front');
  // too soon after a blow, the next does nothing
  const h2=br.hp;foeAct(0);assert(br.hp===h2,'blows come no faster than the weapon swings');}
// goblins flee when hurt; armour takes its share
put();clearFoes();hp=20;
{const g=near('goblin',5);g.hp=2;run(3,()=>g.st==='flee');assert(g.st==='flee','a hurt goblin runs');
  equip.body={id:382,c:1,d:0};const cut=armourCut(8);assert(cut===Math.round(8*0.55)&&equip.body.d===1,'steel plate takes nearly half of a blow ('+cut+' of 8) and wears');equip.body=null;}
// death: a foe's blow names it
put();clearFoes();hp=2;{let cause='';const h0=hurt;hurt=(n,c)=>{cause=c;h0(n,c);};const a=near('raider',2);run(8,()=>dead);hurt=h0;info('killed by:',cause,'-',DEATH[cause]);assert(dead&&cause==='orc'&&/orc/i.test(DEATH[cause]),'death by an orc says so');}
dead=false;hp=20;$('death').style.display='none';playing=true;
// the Emberlord: fire in threes
put();clearFoes();{const e=near('ember',-16);e.st='chase';e.vis=true;e.losT=9;e.shotT=0;let most=0;run(3,()=>{e.vis=true;e.losT=9;most=Math.max(most,shots.length);return most>=3;});
  info('an Emberlord sixteen blocks off: fire in flight',most);assert(most>=3,'an Emberlord throws its fire in threes');}
// places are peopled: a goblin warren's halls, and a fortress's lord (not once fallen)
setMode('creative');clearFoes();
{let B=null;for(let rx=5;rx<30&&!B;rx++)for(let rz=-10;rz<10&&!B;rz++)if(warRegion(rx,rz)){const b=caveBase(rx,rz);if(b.war&&b.war.halls.some(ni=>b.ch[b.nodes[ni].ch].wk==='chief'))B=b;}
  const c=B.ch[B.nodes[B.war.halls[0]].ch];gen(Math.round(c.x),Math.round(c.z));PL.x=c.x-OX;PL.z=c.z-OZ;PL.y=c.f+1;foeSpots.clear();foeSpawnTick();
  const kinds={};for(const f of foes)kinds[f.kind]=(kinds[f.kind]||0)+1;info('in',B.war.name,'('+c.wk+' hall):',JSON.stringify(kinds));
  assert(foes.filter(f=>FOES[f.kind].m[0]==='g').length>=3&&(c.wk!=='chief'||kinds.gchief===1),'a warren\'s halls are peopled with goblins, its chief\'s hall by a chieftain');}
clearFoes();
{const g=[...Array(25).keys()].flatMap(i=>[...Array(25).keys()].map(j=>greatOf(stretchCell(landSite(i-12,j-12))))).filter(Boolean).sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z))[0],F=fortOf(g),S=fortSpots(F);
  gen(Math.round(S.lord.x),Math.round(S.lord.z));PL.x=S.lord.x-OX+8;PL.z=S.lord.z-OZ;PL.y=S.lord.y+1;foeSpots.clear();foeSpawnTick();
  const lord=foes.find(f=>f.kind==='ember');info(F.name,': its lord',lord?'waits at X '+Math.round(lord.x+OX)+' y '+lord.y+' Z '+Math.round(lord.z+OZ)+', '+lord.m.box[4].toFixed(1)+' blocks tall, held within '+lord.leash+' of its throne':'is missing');
  assert(lord&&Math.abs(lord.y-S.lord.y)<=1&&lord.m.box[4]>10,'an Emberlord towers over ten blocks tall in its fortress\'s throne hall');
  // it stays near its fortress: it will not follow far beyond the terrace before its gate
  // (tried with a short leash inside the hall: the player well beyond it toward the gate)
  setMode('survival');hp=999;const L0=lord.leash;lord.leash=14;lord.st='chase';lord.vis=true;lord.losT=9;PL.x=lord.hx+F.ox*24;PL.z=lord.hz+F.oz*24;PL.y=S.lord.y;let far=0;
  run(12,()=>{hurtCD=1;lord.vis=true;lord.losT=9;far=Math.max(far,Math.hypot(lord.x-lord.hx,lord.z-lord.hz));});const st1=lord.st;PL.x=lord.hx+F.ox*44;PL.z=lord.hz+F.oz*44;run(2,()=>{lord.vis=true;lord.losT=9;});
  info('chasing a player 24 blocks off with a leash of 14, it went',far.toFixed(1),'from its throne and stopped ('+st1+'); with the player at 44 it',lord.st==='return'||lord.st==='idle'?'turned back':'kept on','(its own leash reaches',L0,'blocks, to the terrace before its gate)');
  assert(far>=8&&far<=14.5&&st1==='chase'&&lord.st!=='chase'&&L0>F.U1,'the Emberlord comes out after the player only so far, and stays near its fortress');hp=20;lord.leash=L0;
  lord.hp=1;inv[0]={id:377,c:1};PL.x=S.lord.x-OX+8;PL.z=S.lord.z-OZ;PL.y=S.lord.y;PL.yaw=Math.PI/2;PL.pitch=0.3;lord.x=PL.x-4;lord.z=PL.z;lord.y=PL.y;lord.hold=1;
  foeHitCD=0;foeAct(0);assert(lord.dead&&fallenLords.size===1&&foeSave().fk.length===1,'a fallen Emberlord is saved as fallen');
  clearFoes();PL.x=S.lord.x-OX+8;PL.z=S.lord.z-OZ;PL.y=S.lord.y+1;foeSpots.clear();foeSpawnTick();assert(!foes.some(f=>f.kind==='ember'),'and does not come back');setMode('creative');
  // a warhold in a lesser volcano is held by orcs under a warchief
  clearFoes();const hv=[];for(let i=-30;i<30;i++)for(let j=-30;j<30;j++){const v=volcAt(i,j);if(v&&fortOf(v))hv.push(v);}hv.sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z));
  const H2=fortOf(hv[0]),S2=fortSpots(H2);gen(Math.round(S2.lord.x),Math.round(S2.lord.z));PL.x=S2.lord.x-OX+3;PL.z=S2.lord.z-OZ;PL.y=S2.lord.y+1;foeSpots.clear();foeSpawnTick();
  const kinds={};for(const f of foes)kinds[f.kind]=(kinds[f.kind]||0)+1;info(H2.name,':',JSON.stringify(kinds));assert(kinds.ochief>=1&&!kinds.ember,'a warhold is held by orcs under a warchief, with no Emberlord');clearFoes();}
// the Ashen Citadel is held by orcs under a warchief
{const find=kind=>{for(let r=0;r<40;r++)for(let i=-r;i<=r;i++)for(let j=-r;j<=r;j++){if(Math.max(Math.abs(i),Math.abs(j))!==r)continue;const s=sigOf(stretchCell(landSite(i,j)));if(s&&s.kind===kind)return s;}return null;};
  const s=find('citadel');clearFoes();gen(s.X,s.Z);PL.x=s.X-OX+20;PL.z=s.Z-OZ;PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+1;foeSpots.clear();foeSpawnTick();
  const kinds={};for(const f of foes)kinds[f.kind]=(kinds[f.kind]||0)+1;info(s.name,'at X',s.X,'Z',s.Z,':',JSON.stringify(kinds));
  assert(kinds.ochief===1&&foes.length>=4,'the Ashen Citadel is held by orcs under a warchief');clearFoes();}
// they move with the window
{clearFoes();put();const a=near('raider',4),x0=a.x;shiftEntities(16,0);assert(Math.abs(a.x-(x0-16))<1e-9,'foes move with the window when it slides');shiftEntities(-16,0);clearFoes();}
