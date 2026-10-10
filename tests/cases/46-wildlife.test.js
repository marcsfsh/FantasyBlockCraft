// Wildlife (E1, refined in 0.26.0): animals live in the lands that suit them, built from textured pixel boxes for every kind and
// coat; they wander in herds, turn smoothly, take fright together, sleep at night and move their legs as they go; they can be
// hunted (not the young), shorn, milked and gathered from; a wild horse can be ridden; a hound and a mule befriended follow you, the
// mule carries a pack; befriended animals are saved with the world; each kind has its call.
setMode('survival');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
assert(LANDS.every(L=>Array.isArray(WILD_OF[L.k]))&&Object.values(ANIMALS).every(A=>A.g.every(g=>Object.values(WILD_OF).some(l=>l.includes(g)))),'every land says which animals live in it, and every animal has a land');
// ---- models: every kind, coat and the young build, fit their texture and stand a sensible height
{let built=0,bad=[];const ht={};
  for(const k in ANIMALS){const K=AM_KINDS[k];if(!K){bad.push(k+' has no model');continue;}
    for(let ci=0;ci<K.coats.length;ci++)for(const yg of [false,true]){const m=amBuild(k,ci,{young:yg,stag:k==='deer'&&!yg});built++;const h=m.box[4];if(!yg&&ci===0)ht[k]=h;
      if(!(h>0.2&&h<2.8)||!Object.keys(m.parts).length||!m.mat.uniforms.map.value)bad.push(k+' '+ci+(yg?' young':'')+' height '+h.toFixed(2));if(yg&&!(h<ht[k]))bad.push(k+' young is not smaller');}}
  info('models built',built,'; heights',Object.entries(ht).map(([k,h])=>k+' '+h.toFixed(2)).join(', '));
  assert(!bad.length&&ht.horse>ht.deer&&ht.deer>ht.sheep&&ht.sheep>ht.hen&&ht.hen>0,'every kind and coat builds, the young smaller, a horse taller than a deer than a sheep than a hen '+bad.join('; '));
  // every face of every part painted: no pixel left clear inside the layout
  let holes=0;for(const k in AM_KINDS){const L=amLayout(AM_KINDS[k]),Dt=amTexture(k,0,{}).amData;for(const n in L){const [u,v,b]=L[n];for(const f of ['L','F','R','B','T','D']){const R=amRect(f,u,v,b[3],b[4],b[5]);for(let t=0;t<R[3];t++)for(let q=0;q<R[2];q++)if(Dt[((R[1]+t)*AM_TEX+R[0]+q)*4+3]!==255)holes++;}}}
  assert(holes===0&&amTexture('horse',0,{})===amTexture('horse',0,{}),'each coat is painted whole on its own texture, made once and shared');}
const standAt=k=>{const c=nearestLand(LAND_I[k],0,0,48);gen(c.X,c.Z);let bx=c.X-OX,bz=c.Z-OZ;PL.x=bx+0.5;PL.z=bz+0.5;PL.y=ground[bx+W*bz]+1;PL.vx=PL.vz=0;LWX.t=0;landWeather(0.1);return c;};
const clearAll=()=>{for(const a of [...animals])removeAnimal(a);};
const onGround=a=>SOLID[get(Math.floor(a.x),Math.floor(a.y)-1,Math.floor(a.z))];
// ---- herds by land
{standAt('birch');playing=true;settings.time='day';clearAll();for(let i=0;i<120;i++){wildT=0;updAnimals(0.05);}
  const kinds=new Set(animals.map(a=>a.kind)),ok=animals.every(a=>ANIMALS[a.kind].g.some(g=>WILD_OF.birch.includes(g))),herds=new Set(animals.map(a=>a.herd));
  info('animals in the Birch Glades',animals.length,[...kinds].join(' '),'; herds',herds.size,'; young',animals.filter(a=>a.young).length);
  assert(animals.length>=6&&animals.length<=WILD_CAP+5&&ok&&animals.every(onGround)&&herds.size<animals.length,'herds of the wood come to the Birch Glades, standing on the ground, several to a herd');
  standAt('sea');clearAll();for(let i=0;i<60;i++){wildT=0;updAnimals(0.05);}assert(animals.length===0,'nothing walks on the open sea');}
const place=(k,dist,o)=>{const g=ground[Math.floor(PL.x)+W*Math.floor(PL.z)];let x=PL.x+dist,y=standY(x,g+2,PL.z);const a=addAnimal(k,x,y,PL.z,o);a.t=99;return a;};
// ---- wandering, turning, and fright that spreads through a herd
{standAt('green');clearAll();const s=place('sheep',8);s.st='walk';s.tx=s.x+5;s.tz=s.z+5;s.t=10;let maxTurn=0,y0=s.yaw;
  for(let i=0;i<300;i++){updAnimals(0.05);maxTurn=Math.max(maxTurn,Math.abs(angTo(y0,s.yaw)));y0=s.yaw;}
  info('sheep walked to',(s.x-PL.x).toFixed(1),(s.z-PL.z).toFixed(1),'; largest turn in a twentieth of a second',maxTurn.toFixed(3));
  assert(Math.hypot(s.x-PL.x-8,s.z-PL.z)>2&&onGround(s)&&maxTurn<=ANIMALS.sheep.turn*0.05+1e-6,'a sheep walks where it means to go, turning smoothly, and stays on the ground');
  const d1=place('deer',4),d2=place('deer',6,{herd:d1.herd}),r1=Math.hypot(d2.x-PL.x,d2.z-PL.z);PL.vx=6;for(let i=0;i<40;i++)updAnimals(0.05);PL.vx=0;
  assert(d1.st==='flee'&&d2.st==='flee'&&Math.hypot(d2.x-PL.x,d2.z-PL.z)>r1+2,'a deer runs from a running player, and its herd runs with it');}
// ---- legs move as it walks; it sleeps at night
{clearAll();const h=place('horse',6);const legRest=h.m.parts.legFL.rotation.x;h.hold=1;h.holdSp=ANIMALS.horse.walk;let sw=0;for(let i=0;i<30;i++){updAnimals(0.05);sw=Math.max(sw,Math.abs(h.m.parts.legFL.rotation.x-legRest));}
  assert(sw>0.2,'a walking horse swings its legs ('+sw.toFixed(2)+' radians)');h.hold=0;h.holdSp=0;
  settings.time='night';const dr=place('deer',30);dr.t=0;for(let i=0;i<200&&dr.st!=='sleep';i++)updAnimals(0.05);for(let i=0;i<60;i++)updAnimals(0.05);
  assert(dr.st==='sleep'&&dr.m.root.position.y<-0.3,'at night a deer lies down to sleep');settings.time='day';}
// aim at the middle of an animal's body
const aim=a=>{const b=a.m.box,cz=(b[2]+b[5])/2,e=eyePos(),cx=a.x+Math.sin(a.yaw)*cz,cy=a.y+(b[1]+b[4])*0.45,czz=a.z+Math.cos(a.yaw)*cz,dx=cx-e.x,dy=cy-e.y,dz=czz-e.z;PL.yaw=Math.atan2(-dx,-dz);PL.pitch=Math.atan2(dy,Math.hypot(dx,dz));};
// ---- hunting; the young are let be
{clearAll();inv.fill(null);const b=place('boar',2.5);let n=0,flash=0;while(!b.dead&&n<20){aim(b);act(0);updAnimals(0.02);flash=Math.max(flash,b.m.mat.uniforms.hurt.value);n++;}
  info('strikes to take a boar with a bare hand',n,'; inventory',inv.filter(Boolean).map(q=>q.c+' '+nameOf(q.id)).join(', '));
  assert(b.dead&&flash>0.5&&inv.some(q=>q&&q.id===354)&&inv.some(q=>q&&q.id===352),'a boar hunted flashes when struck and gives pork and a hide');
  for(let i=0;i<70;i++)updAnimals(0.05);assert(!animals.includes(b)&&Math.abs(b.m.root.rotation.z-1.5708)<0.01,'it falls on its side and is gone a moment later');
  const pig=place('boar',2.5,{young:true});aim(pig);act(0);act(0);act(0);assert(!pig.dead&&pig.st==='flee','a piglet cannot be taken: it runs');
  assert([[350,356],[351,357],[353,358],[354,359],[352,362]].every(([raw,done])=>RECIPES.some(r=>r[0]===done&&r[2][0][0]===raw&&r[3]==='f'))&&FOOD[356]>FOOD[350],'raw meat roasts and hides cure at a furnace; roasts feed more');}
// ---- shearing, milking, eggs
{clearAll();inv.fill(null);const s=place('sheep',2.2,{ci:0});inv[sel]={id:321,c:1,d:0};aim(s);act(2);updAnimals(0.01);
  assert(s.shorn&&inv.some(q=>q&&q.id===WOOLW&&q.c===2)&&!s.m.parts.wool.visible,'shears take two white wool from a sheep, and it stands shorn');aim(s);act(2);assert(inv.filter(q=>q&&q.id===WOOLW).reduce((t,q)=>t+q.c,0)===2,'a shorn sheep has nothing more until its fleece grows back');
  removeAnimal(s);const bk=place('sheep',2.2,{ci:2});aim(bk);act(2);assert(inv.some(q=>q&&q.id===WOOLK),'a black sheep gives black wool');removeAnimal(bk);
  inv[sel]=null;sel=5;const gt=place('goat',2.2);aim(gt);act(2);removeAnimal(gt);const h=place('hen',2);aim(h);act(2);
  assert(inv.some(q=>q&&q.id===360)&&inv.some(q=>q&&q.id===355),"goats give milk and hens an egg to an empty hand");sel=0;}
// ---- riding
{clearAll();inv.fill(null);const hz=place('horse',2.5);aim(hz);act(2);assert(PL.ride===hz,'a wild horse can be ridden');
  PL.vx=3;updAnimals(0.05);assert(Math.abs(hz.x-PL.x)<1e-6&&eyePos().y>PL.y+EYE+0.5&&hz.sp>2,'the horse goes where its rider goes at the rider\'s pace, and the rider sits high');
  dismount();assert(!PL.ride,'and you can get off');PL.vx=0;}
// ---- a hound and a mule befriended; saved with the world
{clearAll();inv.fill(null);const hd=place('hound',2.5);aim(hd);act(2);assert(!hd.tame,'a stray hound will not follow an empty hand');
  inv[sel]={id:350,c:2};aim(hd);act(2);assert(hd.tame&&inv[sel].c===1,'a stray hound fed meat follows you');
  PL.x+=20;for(let i=0;i<240;i++)updAnimals(0.05);assert(Math.hypot(hd.x-PL.x,hd.z-PL.z)<6,'the hound keeps up with you ('+Math.hypot(hd.x-PL.x,hd.z-PL.z).toFixed(1)+' blocks behind)');
  const mu=place('mule',2.5);inv[sel]={id:202,c:3};aim(mu);act(2);updAnimals(0.01);assert(mu.tame&&mu.m.parts.bagL.visible,'a wild mule fed wheat carries for you, and wears its packs');
  inv[sel]=null;mu.st='idle';mu.t=99;aim(mu);act(2);assert(box&&box.k==='mule:'+mu.uid&&invOpen,"the mule's pack opens like a chest");boxPut(boxes.get(box.k),COBBLE,10,0);closeInv();
  const store={};localStorage.setItem=(k,v)=>{store[k]=v;};saveNow();const sv=JSON.parse(store[worldKey(WORLD.id)]);
  assert(sv.an.length===2&&sv.an.some(r=>r[0]==='mule'&&r[5]===mu.uid&&r[6]===mu.ci)&&sv.cs.some(([k])=>k==='mule:'+mu.uid),'befriended animals, their coats and the mule\'s pack are saved with the world');
  clearAll();assert(animals.length===0,'clear');wildPending=sv.an;wildRestore();const back=animals.filter(a=>a.tame).map(a=>a.kind).sort().join(' ');
  assert(back==='hound mule'&&animals.find(a=>a.kind==='mule').uid===mu.uid&&animals.find(a=>a.kind==='mule').ci===mu.ci,'and they come back when the world is loaded, in the same coats ('+back+')');
  const x0=animals[0].x;shiftEntities(16,0);assert(Math.abs(animals[0].x-(x0-16))<1e-9,'they move with the window when it slides');shiftEntities(-16,0);}
assert(JN.d.a.length>=3,'the animals you meet go into the discovery log ('+JN.d.a.join(', ')+')');
// ---- each kind has its call (a stand-in AudioContext counts the voices)
{let osc=0;const P=v=>({value:v,setValueAtTime(){},exponentialRampToValueAtTime(){}}),node=o=>Object.assign({connect(t){return t;},start(){},stop(){}},o);
  class FakeAudio{constructor(){this.sampleRate=8000;this.currentTime=0;this.state='running';this.destination=node({});this.listener={positionX:P(0),positionY:P(0),positionZ:P(0),forwardX:P(0),forwardY:P(0),forwardZ:P(0),upX:P(0),upY:P(1),upZ:P(0)};}
    createBuffer(c,len){return {getChannelData:()=>new Float32Array(len)};}createGain(){return node({gain:P(1)});}createBiquadFilter(){return node({frequency:P(0),Q:P(1)});}
    createBufferSource(){osc++;return node({});}createOscillator(){osc++;return node({frequency:P(0)});}createPanner(){return node({positionX:P(0),positionY:P(0),positionZ:P(0)});}resume(){}}
  window.AudioContext=FakeAudio;settings.sound=true;AX=null;windGain=rainGain=null;audioInit();clearAll();const quiet=[];
  for(const k in ANIMALS){const a=place(k,3),n0=osc;animalCall(a,false);if(osc===n0)quiet.push(k);removeAnimal(a);}
  assert(!quiet.length,'every kind has a call of its own '+quiet.join(' '));}
