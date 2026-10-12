// The Emberlords in the war and their fates (W7b, D-075): each war's lord; its roar driving the warhosts; showing itself on the
// gate's wall at the height of an assault; while it lives its mountain rumbles and erupts, ash falls, the sky darkens; the last
// battles: the vents broken one by one until its fire goes out, the hosts' way on to its gate and its sally to meet them; its
// fates: slain alone, slain in the hosts' assault, cast down by a keg near its end, bound by the loremasters' rite; the journal.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT-=0.05;updFoes(0.05);if(fn&&fn())return true;}return false;};
const vc=(X,Z)=>{for(let r=0;r<6;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const c=landSite(Math.floor(X/LS)+a,Math.floor(Z/LS)+b);if(LANDS[cellLand(c)].k==='volcanic')return c;}};
const P=wasteGateOf(wasteBasin(vc(2728,758))),s=wgSite(P),at=(u,v)=>siteXZ(s,u,v).map(Math.round);
const toPL=(X,Z)=>{PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+1;};
const clear=()=>{for(const f of [...foes])removeFoe(f);foeSpots.clear();EMB_HZ.length=0;emberShows.length=0;emberRiteS=null;};
let [X,Z]=at(40,0);gen(X,Z);toPL(X,Z);playing=false;clear();warS.clear();warArmies.length=0;WARS.clear();warPlay=0;warClk=1e9;warStateTick();
const w=WARS.get(P.id),R=warLord(w),F=R.F,E=elOf(w);
info('the war at',P.name,': its lord',R.L.n,'of',F.name);assert(R&&F.great&&R.L===emberLord(F),'each war\'s basin has its lord, the Emberlord of its great volcano');
// its roar drives the warhosts
{const A=warArmy(P,false);emberDrive(A);let bold=0;for(let k=0;k<40&&!bold;k++){warMarch();run(1);emberWarTick();bold=foes.filter(f=>f.army===A&&f.bold&&f.dmgK>=1.15).length;}
  info('a warhost driven: drive',A.drive,'; soldiers made bolder',bold);assert(A.drive&&bold>0,'before a warhost it roars from the mountain and drives them on, bolder');clear();warArmies.length=0;}
// at the height of an assault it shows itself on the gate's wall
{const f=emberShow(w,R);info('it shows itself:',f&&f.show,'at height',f&&(f.y-P.hG).toFixed(0),'over the gate\'s level; its lord',f&&f.L.n);
  assert(f&&f.show&&f.hold&&Math.abs(f.y-P.hG-49)<=3&&f.L===R.L,'at the height of an assault it shows itself on the wall of the Ashen Gate');
  for(let k=0;k<27;k++)emberWarTick();assert(f.gone&&!emberShows.length,'and is gone again in fire');clear();}
// while it lives: its mountain rumbles and erupts, ash falls, the sky darkens near it
{const [x,z]=at(-150,0);gen(x,z);toPL(x,z);emberRumT=emberEruT=emberTauntT=1;emberWarTick();info('in its basin: the sky darkened by',emberSkyK.toFixed(2),'; ash falling for',E.ash);
  assert(emberSkyK>0&&E.ash>0,'while it lives its mountain erupts, ash falls and its sky grows darker near it');E.ash=0;}
// the last battles: the gate fallen and the front at the foot of its mountain; the vents broken one by one, its fire out
warFall(w,false,P);w.b.fr=1;
{const [x,z]=at(60,0);gen(x,z);toPL(x,z);const ways=warFrontWays(P,w).inA,last=ways[ways.length-1],dT=Math.hypot(last[0]-(F.GX+F.ox*12),last[1]-(F.GZ+F.oz*12));
  info('the front',warFront(w).toFixed(2),'; the hosts\' way ends',dT.toFixed(1),'from the terrace before its gate');assert(warFront(w)>=1&&dT<2,'once the front stands at the foot of its mountain the hosts march on to its gate');
  E.ft0=1e9;for(let k=0;k<8&&!E.fate;k++){warPlay+=800;emberWarTick();}const log=w.log.slice(-2).map(l=>l[1]).join(' | ');
  info('the vents broken',E.vents,'; its fate',E.fate,'; the chronicle:',log);assert(E.vents===5&&E.fate==='quenched'&&fallenLords.has(F.id)&&/went out/.test(log),'the dwarves break the mountain\'s five vents one by one, and its fire goes out');}
const reset=()=>{clear();E.fate=null;E.vents=0;E.vt=Math.round(warPlay+1e6);E.ft0=Math.round(warPlay);fallenLords.delete(F.id);const k=emberKnown.get(F.id);if(k)k[2]=undefined;};
const tX=F.GX+F.ox*10,tZ=F.GZ+F.oz*10;gen(tX,tZ);
const sally=()=>{reset();toPL(tX+F.ox*20,tZ+F.oz*20);emberWarTick();return foes.find(f=>isLord(f)&&!f.show&&!f.dead);};
// its sally; slain by the player alone
{const f=sally();info('it sallies:',!!f,f&&f.sally,'at',f&&Math.hypot(f.x+OX-tX,f.z+OZ-tZ).toFixed(1),'from its gate\'s terrace; health',f&&f.hp);assert(f&&f.sally&&Math.hypot(f.x+OX-tX,f.z+OZ-tZ)<6,'in the last battles it comes out of its gate to meet the hosts');
  f.hp=1;foeSlain(f);run(0.2);info('slain by the player alone: its fate',E.fate);assert(E.fate==='alone'&&fallenLords.has(F.id),'slain by the player alone');}
// slain in the hosts' assault
{const f=sally();const k=[0,1,2,3].map(i=>addFoe('rspear',f.x+4+i,f.y,f.z+3,{}));foeHurtFoe(f,99999,k[0],0,0,0);run(0.2);info('slain among the hosts: its fate',E.fate);assert(E.fate==='hosts','slain in the hosts\' final assault');}
// cast down by a keg near its end
{const f=sally();f.hp=Math.round(f.mhp*0.2);run(0.1);explode(f.x+2,f.y+0.5,f.z);const y0=f.y;run(4);info('cast down: sank',(y0-f.y).toFixed(1),'; its fate',E.fate);assert(E.fate==='cast'&&y0-f.y>6,'near its end a blasting keg breaks the floor under it and it is cast down into the lava sea');}
// bound by the loremasters' rite, held by one sworn to the alliance
{reset();SW.on=1;E.rite=-1e9;PL.x=tX+F.ox*14-OX+0.5;PL.z=tZ+F.oz*14-OZ+0.5;PL.y=foeStand(PL.x,F.Fy+3,PL.z,2);emberWarTick();const S=emberRiteS;info('the rite:',!!S,'; loremasters',S&&S.L.map(f=>f.kind).join(' '),'; their guard',S&&S.ring.length);
  assert(S&&S.L.length>=3&&S.L.some(f=>f.kind==='elore')&&S.L.some(f=>f.kind==='dlord'),'the loremasters of the elves and the dwarves come to bind it when one sworn to the alliance is near');
  for(const f of S.L)f.hp=f.mhp=99999;let waves=0;run(160,()=>{if(foes.some(g=>!g.dead&&!FOES[g.kind].folk&&!isLord(g)))waves=1;return !emberRiteS;});
  info('the rite ended: servants came',waves,'; its fate',E.fate);assert(waves&&E.fate==='bound','its servants come against the ring; held to the end, the rite binds it');SW.on=0;}
// the journal tells its fate
{const out=[];emberJournal(out);const line=out.find(l=>/bound .* chains of light/.test(l));info('the journal:',line);assert(!!line&&w.log.some(l=>/chains of light/.test(l[1])),'its fate is written in the chronicle and the journal');}
clear();setMode('creative');playing=false;
