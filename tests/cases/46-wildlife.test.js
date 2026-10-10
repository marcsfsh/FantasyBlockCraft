// Wildlife (E1): animals live in the lands that suit them, wander on the ground and flee; they can be hunted for meat and hides,
// shorn, milked and gathered from; a wild horse can be ridden; a hound and a mule befriended follow you, the mule carries a pack;
// befriended animals are saved with the world.
setMode('survival');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
assert(LANDS.every(L=>Array.isArray(WILD_OF[L.k]))&&Object.values(ANIMALS).every(A=>A.g.every(g=>Object.values(WILD_OF).some(l=>l.includes(g)))),'every land says which animals live in it, and every animal has a land');
// put the player on open ground in a land
const standAt=k=>{const c=nearestLand(LAND_I[k],0,0,48);gen(c.X,c.Z);let bx=c.X-OX,bz=c.Z-OZ;PL.x=bx+0.5;PL.z=bz+0.5;PL.y=ground[bx+W*bz]+1;PL.vx=PL.vz=0;LWX.t=0;landWeather(0.1);return c;};
const clearAll=()=>{for(const a of [...animals])removeAnimal(a);};
// ---- herds by land
{standAt('birch');playing=true;clearAll();for(let i=0;i<120;i++){wildT=0;updAnimals(0.05);}
  const kinds=new Set(animals.map(a=>a.kind)),ok=animals.every(a=>ANIMALS[a.kind].g.some(g=>WILD_OF.birch.includes(g)));
  const grounded=animals.every(a=>SOLID[get(Math.floor(a.x),Math.floor(a.y)-1,Math.floor(a.z))]);
  info('animals in the Birch Glades',animals.length,[...kinds].join(' '));
  assert(animals.length>=6&&animals.length<=WILD_CAP+5&&ok&&grounded,'herds of the wood come to the Birch Glades, standing on the ground');
  standAt('sea');clearAll();for(let i=0;i<60;i++){wildT=0;updAnimals(0.05);}assert(animals.length===0,'nothing walks on the open sea');}
// ---- wandering and fleeing
{standAt('green');clearAll();const g=ground[Math.floor(PL.x)+W*Math.floor(PL.z)];
  const s=addAnimal('sheep',PL.x+8,standY(PL.x+8,g+2,PL.z),PL.z);s.t=0;const x0=s.x,z0=s.z;for(let i=0;i<400;i++)updAnimals(0.05);
  assert(Math.hypot(s.x-x0,s.z-z0)>0.5&&SOLID[get(Math.floor(s.x),Math.floor(s.y)-1,Math.floor(s.z))],'a sheep wanders and stays on the ground ('+Math.hypot(s.x-x0,s.z-z0).toFixed(1)+' blocks in 20 s)');
  const d=addAnimal('deer',PL.x+4,standY(PL.x+4,g+2,PL.z),PL.z),d0=Math.hypot(d.x-PL.x,d.z-PL.z);PL.vx=6;for(let i=0;i<40;i++)updAnimals(0.05);PL.vx=0;
  assert(Math.hypot(d.x-PL.x,d.z-PL.z)>d0+2,'a deer runs from a running player');}
// aim at an animal's middle
const aim=a=>{const A=ANIMALS[a.kind],e=eyePos(),cy=a.y+A.leg+A.sz[1]*0.4,dx=a.x-e.x,dy=cy-e.y,dz=a.z-e.z;PL.yaw=Math.atan2(-dx,-dz);PL.pitch=Math.atan2(dy,Math.hypot(dx,dz));};
const place=(k,dist)=>{const g=ground[Math.floor(PL.x)+W*Math.floor(PL.z)];let x=PL.x+dist,y=standY(x,g+2,PL.z);return addAnimal(k,x,y,PL.z);};
// ---- hunting
{clearAll();inv.fill(null);const b=place('boar',2.5);b.walk=0;b.t=99;let n=0;while(animals.includes(b)&&n<20){aim(b);act(0);n++;}
  info('strikes to take a boar with a bare hand',n,'; inventory',inv.filter(Boolean).map(q=>q.c+' '+nameOf(q.id)).join(', '));
  assert(!animals.includes(b)&&inv.some(q=>q&&q.id===354)&&inv.some(q=>q&&q.id===352),'a boar hunted gives pork and a hide');
  assert([[350,356],[351,357],[353,358],[354,359],[352,362]].every(([raw,done])=>RECIPES.some(r=>r[0]===done&&r[2][0][0]===raw&&r[3]==='f'))&&FOOD[356]>FOOD[350],'raw meat roasts and hides cure at a furnace; roasts feed more');}
// ---- shearing, milking, eggs
{clearAll();inv.fill(null);const s=place('sheep',2.2);s.walk=0;s.t=99;inv[sel]={id:321,c:1,d:0};aim(s);act(2);
  assert(s.shorn&&inv.some(q=>q&&q.id===WOOLW&&q.c===2),'shears take two white wool from a sheep');aim(s);act(2);assert(inv.filter(q=>q&&q.id===WOOLW).reduce((t,q)=>t+q.c,0)===2,'a shorn sheep has nothing more until its fleece grows back');
  removeAnimal(s);inv[sel]=null;sel=5;const gt=place('goat',2.2);gt.t=99;aim(gt);act(2);removeAnimal(gt);const h=place('hen',2);h.t=99;aim(h);act(2);
  assert(inv.some(q=>q&&q.id===360)&&inv.some(q=>q&&q.id===355),"goats give milk and hens an egg to an empty hand");sel=0;}
// ---- riding
{clearAll();inv.fill(null);const hz=place('horse',2.5);hz.t=99;aim(hz);act(2);assert(PL.ride===hz,'a wild horse can be ridden');
  PL.vx=3;updAnimals(0.05);assert(Math.abs(hz.x-PL.x)<1e-6&&eyePos().y>PL.y+EYE+0.5,'the horse goes where its rider goes, and the rider sits high');
  dismount();assert(!PL.ride,'and you can get off');PL.vx=0;}
// ---- a hound and a mule befriended; saved with the world
{clearAll();inv.fill(null);const hd=place('hound',2.5);hd.t=99;aim(hd);act(2);assert(!hd.tame,'a stray hound will not follow an empty hand');
  inv[sel]={id:350,c:2};aim(hd);act(2);assert(hd.tame&&inv[sel].c===1,'a stray hound fed meat follows you');
  PL.x+=20;for(let i=0;i<200;i++)updAnimals(0.05);assert(Math.hypot(hd.x-PL.x,hd.z-PL.z)<6,'the hound keeps up with you');
  const mu=place('mule',2.5);mu.t=99;inv[sel]={id:202,c:3};aim(mu);act(2);assert(mu.tame,'a wild mule fed wheat carries for you');
  inv[sel]=null;aim(mu);act(2);assert(box&&box.k==='mule:'+mu.uid&&invOpen,"the mule's pack opens like a chest");boxPut(boxes.get(box.k),COBBLE,10,0);closeInv();
  const store={};localStorage.setItem=(k,v)=>{store[k]=v;};saveNow();const sv=JSON.parse(store[worldKey(WORLD.id)]);
  assert(sv.an.length===2&&sv.an.some(r=>r[0]==='mule'&&r[5]===mu.uid)&&sv.cs.some(([k])=>k==='mule:'+mu.uid),'befriended animals and the mule\'s pack are saved with the world');
  clearAll();assert(animals.length===0,'clear');wildPending=sv.an;wildRestore();const back=animals.filter(a=>a.tame).map(a=>a.kind).sort().join(' ');
  assert(back==='hound mule'&&animals.find(a=>a.kind==='mule').uid===mu.uid,'and they come back when the world is loaded ('+back+')');}
assert(JN.d.a.length>=3,'the animals you meet go into the discovery log ('+JN.d.a.join(', ')+')');
