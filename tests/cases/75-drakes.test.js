// The drakes and the night (W8e, D-082): an ash drake circles high over the field, dives on the hosts' soldiers burning them, is
// shot down and falls, leaves its scales to the player, and runs when its heart is gone; drakescale mail keeps off its fire; at
// night the folk see and shoot less far and loose fire arrows, torches burn among the soldiers; rain weakens the shamans' fire and
// puts out fire arrows; fog cuts the archers' reach; smoke rises over what burns; the orcs chant.
setMode('creative');
const gen=()=>{while(genQ.length)processGenQ();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT-=0.05;updFoes(0.05);if(fn&&fn())return true;}return false;};
const clear=()=>{hostDismiss(null);for(const f of [...foes])removeFoe(f);foeSpots.clear();for(const s of [...shots])scene.remove(s.m);shots.length=0;};
const t=landTour(LANDS.findIndex(L=>/Golden Steppe/.test(L.n)));gen();PL.pitch=-0.05;PL.yaw=0;playing=false;warClk=1e9;clear();settings.time='day';raining=false;rainAmt=0;warSkyTick();
const gy=(x,z)=>ground[Math.floor(x)+W*Math.floor(z)];
const add=(k,x,z,o)=>addFoe(k,x,foeStand(x,gy(x,z)+2,z,FOES[k].tall||2),z,Object.assign({st:'idle',t:99,hold:1},o||{}));
// the drake and its things
{info('the drake',FOES.drake&&FOES.drake.n,'; its scales',ITEMS[415]&&ITEMS[415].n,'; the mail',ITEMS[416]&&ITEMS[416].n);
  assert(FOES.drake&&AM_KINDS.drake&&ITEMS[415]&&ITEMS[416]&&ITEMS[416].equip==='body'&&ITEMS[416].fireproof&&RECIPES.some(r=>r[0]===416)&&HOST_UNITS.o.some(u=>u[0]==='od'),'the ash drake, its scales and drakescale mail exist; drakes may be summoned with a host of the wastes');}
// it circles high, then dives on a soldier of the hosts and burns it
{const cx=PL.x+10,cz=PL.z-10,S=[0,1,2,3].map(i=>add('rsword',cx+(i%2)*2,cz+Math.floor(i/2)*2)),d=drakeSpawn(cx,cz,null);d.dT=6;let lo=99,path=0,px=d.x,pz=d.z,minH=99,hurt=0;
  run(5,()=>{path+=Math.hypot(d.x-px,d.z-pz);px=d.x;pz=d.z;lo=Math.min(lo,d.y-d.gy);});const high=lo;
  d.dT=0;run(14,()=>{minH=Math.min(minH,d.y-d.gy);hurt=S.filter(f=>f.hp<f.mhp).length;return hurt>0&&d.st!=='dive';});
  info('circling: flew',path.toFixed(0),'blocks, never lower than',high.toFixed(1),'above the ground ; diving: down to',minH.toFixed(1),'; soldiers burned',hurt);
  assert(path>40&&high>15&&minH<9&&hurt>=1,'a drake circles high over the field, then dives low on the hosts\' soldiers and burns them');
// shot down by the hosts: it falls and crashes
  d.hp=1;foeHurtFoe(d,5,S[0],1,0,2);run(4,()=>d.crash);info('struck down: dead',!!d.dead,'; crashed',!!d.crash,'at',(d.y-d.gy).toFixed(1),'above the ground');
  assert(d.dead&&d.crash&&d.y-d.gy<0.5,'shot down, a drake falls from the sky and crashes');clear();}
// slain by the player it leaves its scales; drakescale mail keeps off its fire; with no heart left it flies away
{setMode('survival');playing=true;inv.fill(null);hp=20;const d=drakeSpawn(PL.x,PL.z-10,null);d.hold=1;foeStruck(d,999,0,1,{});info('slain by the player: scales',countOf(415));
  equip.body={id:416,c:1,d:0};hp=20;hurtCD=0;foeHurtPlayer(4,'drake',0,1,3,d);const kept=hp;equip.body=null;hp=20;hurtCD=0;foeHurtPlayer(4,'drake',0,1,3,d);const bare=hp;
  info('a drake\'s fire on drakescale mail: health',kept,'; bare',bare);assert(countOf(415)>=2&&kept===20&&bare<20,'a drake slain by the player leaves its scales; drakescale mail keeps off its fire');
  clear();inv.fill(null);setMode('creative');playing=false;hp=20;
  const r=drakeSpawn(PL.x,PL.z,null);r.rout=foeClock+30;const gone=run(30,()=>r.gone);info('its heart gone, the drake flies off: gone',gone);assert(gone,'a drake that has lost heart flies away');clear();}
// the night: the folk see and shoot less far, the orcs do not; fire arrows; torches
{settings.time='night';warSkyTick();const hiF=warShotHi(FOES.rbow,30),hiO=warShotHi(FOES.bowman,30);
  const a=add('rbow',PL.x+3,PL.z-3),o=add('raider',PL.x+3,PL.z-20);a.foe=o;let fire=0;for(let i=0;i<40;i++){foeShoot(a,FOES.rbow.shot,0);if(shots[shots.length-1].fireA)fire++;}
  const p0=parts.length;a.war=1;for(let i=0;i<5;i++)warNightFrame(0.2);const torch=parts.length>p0;
  info('at night: a bowman of the realm reaches',hiF,'; an orc bowman',hiO,'; fire arrows',fire,'of 40 ; torches',torch);
  assert(warNightK===1&&hiF===22.5&&hiO===30&&fire>=10&&fire<=30&&torch,'at night the folk shoot less far, the orcs do not, the hosts loose fire arrows and soldiers carry torches');
// rain: no fire arrows, the shamans' fire weakened; fog
  raining=true;rainAmt=1;warSkyTick();fire=0;for(let i=0;i<20;i++){foeShoot(a,FOES.rbow.shot,0);if(shots[shots.length-1].fireA)fire++;}const sh=add('oshaman',PL.x-3,PL.z-3);sh.foe=a;foeShoot(sh,FOES.oshaman.shot,0);const sd=shots[shots.length-1].dmg;
  raining=false;rainAmt=0;settings.time='day';const fog0=U.fogFar.value;U.fogFar.value=30;warSkyTick();const fogHi=warShotHi(FOES.rbow,32);U.fogFar.value=fog0;warSkyTick();
  info('in rain: fire arrows',fire,'; a shaman\'s fire',sd,'of',FOES.oshaman.shot.dmg,'; in fog a bowman reaches',fogHi.toFixed(1));
  assert(fire===0&&sd<FOES.oshaman.shot.dmg&&fogHi<=25.5,'rain puts out fire arrows and weakens the shamans\' fire; fog cuts the archers\' reach');clear();}
// smoke rises over what burns; the orcs chant
{const w={X:0,Z:0,bn:[[Math.round(PL.x+OX+40)+','+Math.round(PL.y)+','+Math.round(PL.z+OZ),PLANKS,Math.round(warPlay)-1,0]],rb:[]};WARS.set('smoke-test',w);const p0=parts.length;warSmokeT=0;warNightFrame(0.1);const smoke=parts.length-p0;WARS.delete('smoke-test');
  warChant(PL.x+20,PL.y,PL.z);info('smoke over a fire 40 off:',smoke,'puffs');assert(smoke>0,'smoke rises in columns over what burns, seen from afar');}
settings.time='cycle';warSkyTick();clear();
