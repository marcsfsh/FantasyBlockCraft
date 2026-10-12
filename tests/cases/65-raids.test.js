// Raids on the bordering realms (W6, D-073): the provinces nearest a gate are its border; a raid the player misses is settled
// and told in the chronicle, and the buildings it burned are found burned when its place is loaded, then rebuilt; a raid near the
// player is fought out: the warband marches in and fires the buildings, the beacons are lit, the realm rides out and the folk
// flee; wolf riders roam the borderlands; orcs lie in wait on the roads; in survival the raiders hunt the player, in creative not.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const run=(sec,fn)=>{for(let i=0;i<Math.round(sec/0.05);i++){foeT-=0.05;updFoes(0.05);if(fn&&fn())return true;}return false;};
const vc=(X,Z)=>{for(let r=0;r<6;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){const c=landSite(Math.floor(X/LS)+a,Math.floor(Z/LS)+b);if(LANDS[cellLand(c)].k==='volcanic')return c;}};
const P=wasteGateOf(wasteBasin(vc(2728,758))),s0=wgSite(P),at=(u,v)=>siteXZ(s0,u,v).map(Math.round);
const toPL=(X,Z)=>{PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+1;};
const [cX,cZ]=at(P.uC0+60,0);gen(cX,cZ);toPL(cX,cZ);playing=false;
const clear=()=>{for(const f of [...foes])removeFoe(f);foeSpots.clear();RAID_LIVE.clear();};clear();warS.clear();warArmies.length=0;WARS.clear();warPlay=0;warClk=1e9;
warStateTick();const w=WARS.get(P.id);
// the border
let B=null;for(let k=0;k<4000&&!B;k++)B=warBorder(w);
info('the border:',B.P.map(p=>p.pv.name+' ('+p.pv.cult.k+', '+Math.round(p.d)+' off)').join('; '),'; sites',B.S.length,':',B.S.slice(0,6).map(e=>e.s.k+' '+e.s.name+' '+Math.round(e.d)).join(', '));
assert(B.P.length>=1&&B.P.length<=3&&B.S.some(e=>RAID_MAX[e.s.k]>0),'the provinces nearest the gate are its border, with places to raid');
// a raid missed: settled when it would have come, told in the chronicle; what it burned found burned, then rebuilt
const R=w.rd;let r=null;for(let k=0;k<12;k++){R.nx=warPlay;R.n=k*4;warRaidsTick();const q=R.L[R.L.length-1];warPlay+=160;warRaidsTick();if(q&&q.out==='burned'){r=q;break;}}
const log=w.log[w.log.length-1][1];info('a raid missed:',r&&r.out,r&&r.b,'; chronicle:',log);
assert(r&&r.b>=1&&/raided .* burned/.test(log)&&R.bs.length>=1,'a raid the player misses is settled and written in the chronicle');
{const s=raidSite(B,r.s);gen(s.X,s.Z);toPL(s.X,s.Z);const n0=(w.rb||[]).length;warRaidsTick();const E=(w.rb||[]).slice(n0);
  const burnt=E.filter(e=>{const [X,Y,Z]=e[0].split(',').map(Number);const b=get(X-OX,Y,Z-OZ);return b===CHARWOOD||b===AIR;}).length;
  warPlay+=RAID_REB+30;warFireT=0;warFireFrame(1.1);const back=E.filter(e=>{const [X,Y,Z]=e[0].split(',').map(Number);return get(X-OX,Y,Z-OZ)===e[1];}).length;
  info('found at',s.name,': cells burned',E.length,', charred or gone',burnt,'; rebuilt',back);
  assert(E.length>20&&burnt===E.length&&back===E.length,'the buildings it burned are found burned when its place is loaded, and rebuilt half an hour later');}
// a raid fought out near the player
{clear();const e=B.S.find(e=>e.s.k==='village')||B.S.find(e=>RAID_MAX[e.s.k]>0),s=e.s;gen(s.X,s.Z);toPL(s.X,s.Z);playing=true;
  const q={i:900,k:'raid',s:s.id,X:Math.round(s.X),Z:Math.round(s.Z),t0:Math.round(warPlay),out:null,b:0,hb:[]};R.L.push(q);
  let raiders=0,rel=0,ref=0;for(let t=0;t<320;t++){warPlay+=1;warRaidsTick();run(1);raiders=Math.max(raiders,foes.filter(f=>f.raid===900&&!f.dead).length);if(foes.some(f=>f.rel))rel=1;if(foes.some(f=>f.ref))ref=1;if(q.b>=1&&rel&&t>40)break;}
  const L=RAID_LIVE.get(w.id+':900');info('a raid on',s.name,'(',s.k,'): raiders',raiders,'; buildings fired',q.b,'; beacons',R.bk.length,'; the realm rode out',rel,'; refugees',ref,'; out',q.out);
  assert(raiders>=6&&q.b>=1&&rel,'near the player the warband marches in and fires the buildings, and the realm rides out to meet it');playing=false;clear();}
// a siege: a warhost before a city's gate, and the realm riding to its relief
{const e=B.S.find(e=>e.s.k==='city'||e.s.k==='fort'),s=e.s,[px,pz]=sitePort(s);gen(px,pz);toPL(px,pz);playing=true;const q={i:901,k:'siege',s:s.id,X:Math.round(s.X),Z:Math.round(s.Z),t0:Math.round(warPlay),out:null,b:0,hb:[]};R.L.push(q);
  let host=0,rel=0;for(let t=0;t<60;t++){warPlay+=1;warRaidsTick();run(1);host=Math.max(host,foes.filter(f=>f.raid===901&&!f.dead).length);if(foes.some(f=>f.rel))rel=1;if(rel&&t>30)break;}
  info('a siege of',s.name,'(',s.k,'): the warhost',host,'; the realm rode out',rel);assert(host>=20&&rel,'now and then a warhost lays siege to a city or castle, and the realm rides to its relief');playing=false;clear();}
// wolf riders roam the borderlands; an ambush on the road
{const pv=B.P[0].pv,rd=pv.roads[Math.floor(pv.roads.length/2)],mX=Math.round((rd.a[0]+rd.b[0])/2),mZ=Math.round((rd.a[1]+rd.b[1])/2);gen(mX,mZ);toPL(mX,mZ);
  let onRoad=!!realmRoadAt(mX,mZ,1);raidRoamT=0;warRaidsTick();const roam=foes.filter(f=>f.roam&&f.kind==='wolfrid').length;clear();
  raidAmbT=0;raidRoamT=999;warRaidsTick();const trav=foes.filter(f=>f.ref).length,amb=foes.filter(f=>f.roam&&f.foe).length;run(6);const fought=foes.some(f=>f.roam&&f.st==='chase'&&f.foe);
  info('on',pv.name,'(road',onRoad,'): wolf riders',roam,'; the ambush: travellers',trav,', ambushers',amb,', fighting',fought);
  assert(roam>=3&&trav>=3&&amb>=3,'wolf riders roam the borderlands and orcs lie in wait on the roads');clear();}
// in survival the raiders hunt the player; in creative they do not
{const f=addFoe('raider',PL.x+6,foeStand(PL.x+6,PL.y+2,PL.z,2),PL.z,{});f.yaw=f.hd=Math.atan2(PL.x-f.x,PL.z-f.z);f.hp=f.mhp=9999;playing=true;run(3);const cr=!!f.vis||f.st==='chase'&&!f.foe;
  setMode('survival');run(4);const sv=!!f.vis;setMode('creative');playing=false;info('a raider by the player: creative',cr,'; survival',sv);
  assert(!cr&&sv,'in survival the raiders hunt the player, never in creative');clear();}
// saved
{const sv=JSON.parse(JSON.stringify(warSave())),x=sv.wr.find(q=>q.id===w.id);assert(x.rd&&x.rd.L.length&&Array.isArray(x.rb),'the raids and what they burned are saved with the war');
  const out=[];warJournal(out);assert(out.some(l=>/^Raids on the bordering realms: /.test(l)),'the journal counts the raids');}
