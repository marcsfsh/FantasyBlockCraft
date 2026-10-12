// The soldier's arms (W8a, D-078): shields worn on the arm and the guard (caught blows and shots, the parry and the stagger);
// bows drawn and loosed, the crossbow loaded and loosed through two foes, javelins thrown; arrows that strike home recovered,
// spent arrows stuck in the ground, game hunted with a bow; the running blow, the bash, the axe's cleave, the lance from a
// galloping horse and the trampling; recipes and icons for all of it.
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT-=0.05;updFoes(0.05);armsTick(0.05);updateEntities(0.0);if(fn&&fn())return true;}return false;};
const clear=()=>{for(const f of [...foes])removeFoe(f);foeSpots.clear();for(const s of [...shots]){scene.remove(s.m);}shots.length=0;};
let gnd=(x,z)=>ground[Math.floor(x)+W*Math.floor(z)]+1;
const ahead=(d,s)=>{const fx=-Math.sin(PL.yaw),fz=-Math.cos(PL.yaw);return [PL.x+fx*d-fz*(s||0),PL.z+fz*d+fx*(s||0)];};
const orc=(d,s,k)=>{const [x,z]=ahead(d,s);const f=addFoe(k||'raider',x,foeStand(x,gnd(x,z)+1,z,2),z,{st:'idle',t:99});f.yaw=f.hd=Math.atan2(PL.x-x,PL.z-z);f.hold=1;return f;};
const look=f=>{const e=eyePos();PL.yaw=Math.atan2(-(f.x-PL.x),-(f.z-PL.z));PL.pitch=Math.atan2(f.y+1-e.y,Math.hypot(f.x-PL.x,f.z-PL.z));};
setMode('survival');playing=true;dead=false;clear();PL.y=gnd(PL.x,PL.z);PL.yaw=0;PL.pitch=0;inv.fill(null);for(const k in equip)equip[k]=null;
// a level field ahead of the player, 24 long and 9 wide, so that nothing stands between them and their marks
{const y0=Math.floor(PL.y),bx=Math.floor(PL.x),bz=Math.floor(PL.z);for(let dz=-24;dz<=3;dz++)for(let dx=-4;dx<=4;dx++){for(let y=y0-3;y<y0;y++)setBlock(bx+dx,y,bz+dz,STONE);for(let y=y0;y<y0+6;y++)setBlock(bx+dx,y,bz+dz,AIR);}PL.y=y0;gnd=()=>y0;}
// the arms exist, can be made and are drawn
{const ids=[400,401,402,403,404,405,406,407,408,409,410,411,412,413];let bad=[];for(const id of ids){if(!ITEMS[id])bad.push(id+' missing');else{const c=itemIcon(id);if(!c)bad.push(id+' icon');}}
  const made=ids.filter(id=>RECIPES.some(r=>r[0]===id));info('arms',ids.length,'; made at the bench',made.length,'; slots',Object.keys(EQUIP_SLOTS).join(','));
  assert(!bad.length&&made.length===13&&EQUIP_SLOTS.arm&&ids.slice(0,5).every(id=>equipSlotOf(id)==='arm'),'shields for the arm slot, bows, a crossbow, arrows, bolts, javelins, throwing axes and a lance, made at the bench '+bad.join(' '));}
// the guard: a raised shield catches blows and shots from the front; a parry staggers; from behind it does nothing
{equip.arm={id:401,c:1,d:0};inv[sel]={id:374,c:1,d:0};const f=orc(2);hold=2;armsTick(0.05);guardT0=-9;
  const fx=-Math.sin(PL.yaw),fz=-Math.cos(PL.yaw),front=[-fx,-fz];
  hp=20;hurtCD=0;foeHurtPlayer(10,'orc',front[0],front[1],5,f);const blocked=20-hp;
  hp=20;hurtCD=0;guardT0=armsClk;foeHurtPlayer(10,'orc',front[0],front[1],5,f);const parried=20-hp,stag=f.stagger>foeClock;guardT0=-9;
  hp=20;hurtCD=0;foeHurtPlayer(3,'arrow',front[0],front[1],2,{life:3,k:'arrow'});const arrow=20-hp;
  hp=20;hurtCD=0;foeHurtPlayer(10,'orc',fx,fz,5,f);const back=20-hp;hold=-1;armsTick(0.05);const down=guardOn;
  hp=20;hurtCD=0;foeHurtPlayer(10,'orc',front[0],front[1],5,f);const bare=20-hp;
  info('a blow of 10: guarded',blocked,'; parried',parried,'(the orc staggered',stag+') ; an arrow',arrow,'; from behind',back,'; the shield lowered',bare,'; worn',equip.arm.d);
  assert(blocked===3&&parried===0&&stag&&arrow===0&&back===10&&!down&&bare===10&&equip.arm.d===4,'a raised shield catches most of a blow and every arrow from the front, a timely raise parries and staggers the foe; behind or lowered it does nothing');
  hold=2;armsTick(0.05);info('moving behind it at',armsSlow(),'of the pace');assert(armsSlow()===ITEMS[401].slow,'behind a raised shield the player moves slower');hold=-1;armsTick(0.05);clear();hp=20;}
// a staggered foe does not strike
{const f=orc(2.2);f.hold=0;f.foe=null;f.st='chase';f.vis=true;f.stagger=foeClock+1.5;f.atkT=0;let swung=0;run(1.2,()=>{if(f.atk>0)swung=1;});info('staggered: it wound up a blow',swung);assert(!swung,'a staggered foe cannot strike');clear();}
// a bow drawn and loosed: the longer the draw, the harder; it takes an arrow and strikes the orc
{inv[sel]={id:406,c:1,d:0};inv[1]={id:409,c:10,d:0};const f=orc(14);f.hp=f.mhp=99;look(f);hold=2;act(2);run(1.3);const drawn=bowD;hold=-1;armsTick(0.05);const s=shots.find(q=>q.byP);
  run(1.5,()=>f.hp<99);info('drawn',drawn.toFixed(2),'s ; loosed',!!s,'; the orc',f.hp.toFixed(1),'of 99 ; arrows left',countOf(409));
  assert(drawn>=1.1&&s&&f.hp<=99-8&&countOf(409)===9,'drawn full, the longbow looses an arrow that strikes hard, and takes an arrow');
  bowD=0;hold=-1;act(2);run(1.5);const s2=shots.filter(q=>q.byP).length;info('a tap: drawn full and loosed',s2,'; arrows left',countOf(409));assert(countOf(409)===8,'a tap of the button draws the bow full and looses');
  f.arw=4;f.hp=1;armsHit(f,{vx:1,vz:0,dmg:5,k:'arrow',arw:409,byP:1});info('slain with arrows in it: arrows now',countOf(409));assert(countOf(409)>=9,'arrows that struck home are recovered from the slain');clear();}
// spent arrows stick where they fall
{inv[sel]={id:406,c:1,d:0};PL.pitch=-0.6;const n0=armsStuck.length;hold=2;act(2);run(1.2);hold=-1;armsTick(0.05);run(2);info('arrows in the ground',armsStuck.length-n0);assert(armsStuck.length>n0,'a spent arrow sticks in the ground a while');PL.pitch=0;clear();}
// the crossbow: loaded, then loosed; its bolt passes through the first foe into the second
{inv[sel]={id:408,c:1,d:0};inv[2]={id:410,c:5,d:0};const a=orc(10),b=orc(13);for(const f of [a,b])f.hp=f.mhp=99;look(a);act(2);run(2);const loaded=xReady;act(2);run(1.5,()=>b.hp<99);
  info('loaded',loaded,'; the first',a.hp.toFixed(0),'; the second',b.hp.toFixed(0),'; bolts left',countOf(410));assert(loaded&&a.hp<=88&&b.hp<=88&&countOf(410)===4,'the crossbow is loaded, then its bolt strikes through the first foe into the one behind');clear();}
// javelins thrown
{inv[sel]={id:411,c:3,d:0};const f=orc(9);f.hp=f.mhp=99;look(f);act(2);run(1.5,()=>f.hp<99);info('a javelin: the orc',f.hp.toFixed(0),'; javelins left',inv[sel]&&inv[sel].c);assert(f.hp<=92&&inv[sel].c===2,'a javelin is thrown and strikes');clear();}
// hunting with a bow
{inv[sel]={id:405,c:1,d:0};inv[1]={id:409,c:10,d:0};const [x,z]=ahead(10);const a=addAnimal('deer',x,gnd(x,z),z,{});a.hold=1;a.st='idle';a.t=99;const h0=a.hp;const e=eyePos();PL.yaw=Math.atan2(-(a.x-PL.x),-(a.z-PL.z));PL.pitch=Math.atan2(a.y+0.9-e.y,10);
  hold=2;act(2);run(1);hold=-1;armsTick(0.05);run(1.5,()=>a.hp<h0||a.dead);info('a deer shot: health',h0,'->',a.hp);assert(a.hp<h0||a.dead,'arrows strike game: the bow hunts');removeAnimal(a);clear();}
// blows: the running blow, the bash, the axe's cleave
{inv[sel]={id:374,c:1,d:0};const f=orc(2);f.hp=f.mhp=99;PL.vx=PL.vz=0;armsBlow(f,374);const still=99-f.hp;f.hp=99;const fx=-Math.sin(PL.yaw),fz=-Math.cos(PL.yaw);PL.vx=fx*6;PL.vz=fz*6;armsBlow(f,374);const running=99-f.hp;PL.vx=PL.vz=0;
  equip.arm={id:400,c:1,d:0};hold=2;armsTick(0.05);f.hp=99;f.stagger=0;f.kvx=f.kvz=0;armsBlow(f,374);const bash=99-f.hp,kb=Math.hypot(f.kvx,f.kvz),st=f.stagger>foeClock;hold=-1;armsTick(0.05);
  info('a blow standing',still.toFixed(1),'; running',running.toFixed(1),'; a bash',bash.toFixed(1),'shoving',kb.toFixed(1),'staggered',st);assert(running>still*1.3&&bash<still&&kb>5&&st,'a running blow strikes harder; the bash strikes less but shoves and staggers');clear();
  inv[sel]={id:304,c:1,d:0};const a=orc(2),b=orc(2.3,1.3);a.hp=a.mhp=b.hp=b.mhp=99;look(a);armsBlow(a,304);info('an axe: the first',a.hp.toFixed(1),'; the one beside it',b.hp.toFixed(1));assert(a.hp<99&&b.hp<99,'an axe cleaves into a second foe beside the first');clear();}
// from the saddle: the lance at a gallop, the trampling horse
{const [x,z]=ahead(-3);const h=addAnimal('horse',x,gnd(x,z),z,{});mount(h);inv[sel]={id:413,c:1,d:0};const fx=-Math.sin(PL.yaw),fz=-Math.cos(PL.yaw);PL.vx=fx*9;PL.vz=fz*9;
  const f=orc(4);f.hp=f.mhp=99;armsBlow(f,413);const lance=99-f.hp;PL.vx=PL.vz=0;f.hp=99;armsBlow(f,413);const slow=99-f.hp;info('the lance at a gallop',lance.toFixed(1),'; at a stand',slow.toFixed(1),'; its reach',armsReach());
  assert(lance>=25&&lance>slow*3&&armsReach()>5,'the Knight\'s Lance couched at a gallop strikes very hard, and reaches far');clear();
  const g=orc(1.2,0,'goblin');g.hp=g.mhp=50;PL.vx=fx*9;PL.vz=fz*9;run(0.1);info('a goblin in the way: health',g.hp.toFixed(1),'; staggered',g.stagger>foeClock);assert(g.hp<50&&g.stagger>foeClock,'a galloping horse tramples small foes in its way');
  dismount();removeAnimal(h);PL.vx=PL.vz=0;clear();}
setMode('creative');inv.fill(null);for(const k in equip)equip[k]=null;hp=20;
