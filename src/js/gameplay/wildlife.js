// ---- Wildlife (E1, D-049; Q47, Q48, Q63, Q67): peaceful animals in the lands that suit them. They wander, graze and flee;
// they give wool, milk and eggs, meat and hides to the hunter; wild horses can be ridden, a stray hound fed meat follows you, and
// a wild mule fed crops carries a pack. Animals are not part of generation: they come and go around the player (Math.random is
// fine here), and only the ones you have befriended are saved with the world (an).
const ANIMALS={
  // walk and run in blocks a second; shy: how near a running player may come (half that at a walk); stride: blocks per step
  // cycle; calls: seconds between calls; youngP: the share of young in a herd
  deer:{n:'Deer',hp:6,walk:1.3,run:6.5,shy:11,stride:1.9,amp:0.75,turn:4,graze:1,sleeps:1,drops:[[350,2],[352,1]],g:['wood','meadow'],herd:[2,4],w:3,youngP:0.25,calls:[30,70]},
  rabbit:{n:'Rabbit',hp:2,walk:1.4,run:6,shy:6,stride:0.9,amp:0.9,turn:6,hop:1,graze:1,sleeps:1,drops:[[353,1]],g:['wood','meadow','dry'],herd:[1,3],w:4,youngP:0},
  sheep:{n:'Sheep',hp:6,walk:0.8,run:3.6,shy:0,stride:1.0,amp:0.6,turn:3,graze:1,sleeps:1,drops:[[351,2]],g:['meadow','farm'],herd:[3,6],w:4,youngP:0.3,calls:[14,35],shear:WOOLW},
  goat:{n:'Mountain Goat',hp:6,walk:1,run:4.8,shy:5,stride:1.0,amp:0.65,turn:4,graze:1,sleeps:1,drops:[[351,1],[352,1]],g:['high'],herd:[2,4],w:4,youngP:0.3,calls:[16,40],milk:true},
  hen:{n:'Wild Hen',hp:2,walk:0.9,run:3.6,shy:4,stride:0.5,amp:0.9,turn:6,biped:1,graze:1,sleeps:1,drops:[[355,1]],g:['farm','wet'],herd:[3,5],w:3,youngP:0.35,calls:[6,18],egg:true},
  boar:{n:'Boar',hp:8,walk:1,run:5.5,shy:8,stride:0.9,amp:0.7,turn:4,graze:1,sleeps:1,drops:[[354,2],[352,1]],g:['dark','wood'],herd:[1,4],w:2,youngP:0.4,calls:[10,30]},
  horse:{n:'Wild Horse',hp:10,walk:1.4,run:7,shy:6,stride:2.3,amp:0.6,turn:3,graze:1,sleeps:1,drops:[],g:['meadow','dry'],herd:[3,5],w:2,youngP:0.25,calls:[25,60],mount:true},
  hound:{n:'Stray Hound',hp:6,walk:1.3,run:6,shy:0,stride:1.3,amp:0.8,turn:6,sleeps:1,drops:[],g:['farm','meadow'],herd:[1,1],w:1,youngP:0,calls:[25,70],tame:[350,351,353,354,356,357,358,359],follow:true},
  mule:{n:'Wild Mule',hp:10,walk:1.1,run:4.2,shy:0,stride:1.5,amp:0.6,turn:3,graze:1,sleeps:1,drops:[],g:['dry','high','meadow'],herd:[1,2],w:1,youngP:0,calls:[35,90],tame:[202,330,331,207],follow:true,pack:true}
};
// which animals live in a land
const WILD_OF={autumn:['wood'],birch:['wood'],pine:['wood','high'],giant:['wood'],yew:['dark','wood'],silver:['wood'],elder:['wood'],green:['meadow','farm'],orchard:['farm'],farm:['farm','meadow'],flower:['meadow'],terrace:['farm','high'],
  moors:['meadow','high'],barrow:['meadow'],shadow:['dark'],willow:['wet','wood'],bog:['wet'],steppe:['dry','meadow'],dry:['dry'],petrified:['dry'],mtn:['high'],alpine:['high','meadow'],karst:['high'],tundra:['high'],glacier:[],fjord:['high'],
  cloud:['wood','high'],chalk:['meadow'],volcanic:[],blight:[],crystal:[],glowcap:[],starfall:['dry'],sea:[],isles:[],kelp:[],blacksand:[]};
const WILD_CAP=22,animals=[],TWL={};let wildT=0,wildId=1,wildClock=0;
// The window slides: every animal moves with it. The area is rebuilt elsewhere: the same, and those left outside the window are
// dropped (befriended ones wait in wildPending until you come back).
entityKind({name:'animals',list:animals,update:dt=>updAnimals(dt),persist:true,shift:(dx,dz)=>{for(const a of animals){a.x-=dx;a.z-=dz;if(a.tx!==undefined){a.tx-=dx;a.tz-=dz;}}}});
// the ground an animal stands on near height y: the first solid block at or below y+1, with two blocks of room above
function standY(x,y,z){const bx=Math.floor(x),bz=Math.floor(z);if(bx<0||bz<0||bx>=W||bz>=D)return -1;for(let yy=Math.floor(y)+1;yy>=Math.floor(y)-3;yy--){if(yy<1||yy>=H-2)continue;if(SOLID[get(bx,yy-1,bz)]&&!SOLID[get(bx,yy,bz)]&&!SOLID[get(bx,yy+1,bz)])return yy;}return -1;}
const wetAt=(x,y,z)=>isWetId(get(Math.floor(x),y,Math.floor(z)));
function addAnimal(kind,x,y,z,o){
  o=o||{};const A=ANIMALS[kind],flags={young:!!o.young,stag:kind==='deer'&&!o.young&&(o.stag!==undefined?!!o.stag:Math.random()<0.4)};
  const ci=o.ci!==undefined&&AM_KINDS[kind].coats[o.ci]?o.ci:amCoat(kind,Math.random()),m=amBuild(kind,ci,flags);
  scene.add(m.grp);scene.add(m.shadow);
  const a=Object.assign({id:wildId++,kind:kind,x:x,y:y,z:z,gy:y,vy:0,kvx:0,kvz:0,yaw:Math.random()*6.283,hd:0,sp:0,st:'idle',t:1+Math.random()*3,hp:flags.young?Math.max(1,A.hp>>1):A.hp,
    ph:Math.random()*6,amp:0,gz:0,lk:0,lp:0,lkT:0,lpT:0,sl:0,si:0,hurt:0,cool:0,ct:3+Math.random()*(A.calls?A.calls[0]:30),ef:2+Math.random()*5,eL:1,eB:0,lt:0,herd:0,ci:ci,young:flags.young,stag:flags.stag,m:m},o);
  a.hd=a.yaw;if(!a.herd)a.herd=a.id;animals.push(a);placeModel(a,0);return a;
}
function removeAnimal(a){scene.remove(a.m.grp);scene.remove(a.m.shadow);a.m.mat.dispose();a.m.shadow.material.dispose();const i=animals.indexOf(a);if(i>=0)animals.splice(i,1);if(PL.ride===a)dismount();}
// spawn: a herd now and then, away from where the player looks and out in the loaded window, on open ground of a land with animals
function spawnTick(){
  const wild=animals.filter(a=>!a.tame).length;if(wild>=WILD_CAP)return;
  let x,z,ok=false;for(let k=0;k<4&&!ok;k++){const a=PL.yaw+Math.PI+(Math.random()-0.5)*Math.PI*1.5,d=34+Math.random()*30;x=PL.x-Math.sin(a)*d;z=PL.z-Math.cos(a)*d;ok=true;}
  const bx=Math.floor(x),bz=Math.floor(z);if(bx<2||bz<2||bx>=W-2||bz>=D-2)return;
  const g=ground[bx+W*bz];if(g<=SEA||!genDone[(bx>>4)+(bz>>4)*NCX]||PL.y<g-12)return;const top=get(bx,g,bz);if(!SOLID[top]||BL[top].liquid||isWetId(get(bx,g+1,bz)))return;
  colInfo(bx+OX,bz+OZ,TWL);const groups=WILD_OF[LANDS[TWL.land].k]||[];if(!groups.length)return;
  const kinds=Object.keys(ANIMALS).filter(k=>ANIMALS[k].g.some(q=>groups.includes(q)));if(!kinds.length)return;
  let tot=0;for(const k of kinds)tot+=ANIMALS[k].w;let v=Math.random()*tot,kind=kinds[0];for(const k of kinds){v-=ANIMALS[k].w;if(v<=0){kind=k;break;}}
  const A=ANIMALS[kind],n=A.herd[0]+Math.floor(Math.random()*(A.herd[1]-A.herd[0]+1));let lead=null;
  for(let i=0;i<n;i++){const xx=x+(Math.random()-.5)*7,zz=z+(Math.random()-.5)*7,yy=standY(xx,g+1,zz);if(yy<0||wetAt(xx,yy,zz))continue;
    const o={herd:lead?lead.herd:0,young:!!lead&&Math.random()<A.youngP};if(lead&&Math.random()<0.6)o.ci=lead.ci;const a=addAnimal(kind,xx,yy,zz,o);if(!lead)lead=a;}
}
// ---- Behaviour
const angTo=(a,b)=>{let d=b-a;while(d>Math.PI)d-=6.2832;while(d<-Math.PI)d+=6.2832;return d;};
function herdCentre(a){let n=0,x=0,z=0;for(const b of animals)if(b.herd===a.herd&&!b.dead&&Math.abs(b.x-a.x)<24&&Math.abs(b.z-a.z)<24){n++;x+=b.x;z+=b.z;}return n?[x/n,z/n]:[a.x,a.z];}
// one animal takes fright, and the rest of its herd nearby with it
function alarm(a,fx,fz,secs){for(const b of animals){if(b.dead||b.tame||b===PL.ride)continue;if(b===a||(b.herd===a.herd&&Math.hypot(b.x-a.x,b.z-a.z)<18)){b.st='flee';b.t=secs||(4+Math.random()*2);b.fx=fx;b.fz=fz;b.sl=Math.min(b.sl,0.99);}}}
function setTarget(a,r){const [cx,cz]=herdCentre(a);for(let k=0;k<6;k++){const an=Math.random()*6.283,d=1.5+Math.random()*r,tx=(cx+a.x)/2+Math.sin(an)*d,tz=(cz+a.z)/2+Math.cos(an)*d,ty=standY(tx,a.y,tz);
  if(ty>0&&Math.abs(ty-a.y)<=2&&!wetAt(tx,ty,tz)){a.tx=tx;a.tz=tz;return true;}}return false;}
// what to do next when the current thing is done: walk somewhere near the herd, graze, look about, or sleep at night
function nextState(a){
  const A=ANIMALS[a.kind],night=ambNight(),q=Math.random(),dp=Math.hypot(PL.x-a.x,PL.z-a.z);
  if(a.tame&&A.follow&&!a.stay&&dp>3.5){a.st='follow';a.t=1;return;}
  if(a.tame&&a.stay){a.st=a.kind==='hound'?'sit':A.graze&&q<0.5?'graze':'idle';a.t=4+Math.random()*6;return;}
  if(night&&A.sleeps&&dp>7&&!a.tame&&q<0.8){a.st='sleep';a.t=20+Math.random()*40;return;}
  if(a.tame&&dp<=3.5){a.st=a.kind==='hound'&&q<0.6?'sit':'idle';a.t=3+Math.random()*5;return;}
  if(q<0.42&&setTarget(a,7)){a.st='walk';a.t=10;return;}
  if(A.graze&&q<0.78){a.st='graze';a.t=2+Math.random()*5;return;}
  a.st='idle';a.t=1.5+Math.random()*3;a.lkT=(Math.random()-0.5)*1.4;
}
function stepAnimal(a,dt){
  const A=ANIMALS[a.kind],dx=PL.x-a.x,dz=PL.z-a.z,dp=Math.hypot(dx,dz),ps=Math.hypot(PL.vx,PL.vz);
  a.cool=Math.max(0,a.cool-dt);if(a.shorn&&a.cool<=0)a.shorn=false; // the fleece grows back
  a.hurt=Math.max(0,a.hurt-dt*3);
  if(a.dead){a.dead+=dt;a.sp=0;return;}
  if(a.hold){a.sp=a.holdSp||0;a.hd=a.yaw;return;} // held still (screenshots and tests); holdSp walks it on the spot
  if(PL.ride===a){const v=Math.hypot(PL.vx,PL.vz);a.sp=v;if(v>0.6)a.hd=Math.atan2(PL.vx,PL.vz);a.yaw+=angTo(a.yaw,a.hd)*Math.min(1,dt*8);a.x=PL.x;a.z=PL.z;a.y=a.gy=PL.y;a.st='walk';return;}
  a.t-=dt;
  // fright: a running player inside the shy distance, or any player inside half of it
  if(A.shy&&!a.tame&&a.st!=='flee'&&dp<A.shy&&(ps>4.6||dp<A.shy*0.45)&&Math.abs(PL.y-a.y)<8)alarm(a,PL.x,PL.z);
  if(a.st==='sleep'&&(dp<5||!ambNight()))a.t=0;
  if(a.t<=0&&a.st!=='flee'&&a.st!=='follow')nextState(a);
  if(a.st==='flee'&&a.t<=0){a.st='idle';a.t=1+Math.random()*2;}
  // where to go and how fast
  let want=0;
  if(a.st==='flee'){a.hd=Math.atan2(a.x-a.fx,a.z-a.fz)+Math.sin(wildClock*1.3+a.id)*0.35;want=A.run;}
  else if(a.st==='walk'){const tdx=a.tx-a.x,tdz=a.tz-a.z,d=Math.hypot(tdx,tdz);if(d<0.6||a.t<=0){a.st='idle';a.t=1+Math.random()*3;}else{a.hd=Math.atan2(tdx,tdz);want=A.walk*Math.min(1,d/1.2+0.3);}}
  else if(a.st==='follow'){if(a.stay||dp<3){a.st='idle';a.t=2;}else{
      if(dp>40||a.stuck>2.5){const y=standY(PL.x-Math.sin(PL.yaw+0.6)*2,PL.y,PL.z-Math.cos(PL.yaw+0.6)*2);if(y>0){a.x=PL.x-Math.sin(PL.yaw+0.6)*2;a.z=PL.z-Math.cos(PL.yaw+0.6)*2;a.y=a.gy=y;a.stuck=0;}}
      a.hd=Math.atan2(dx,dz);want=dp>9?A.run*0.9:A.walk*1.6;}}
  // turn toward the heading, slower when the turn is sharp; ease the speed
  const dh=angTo(a.yaw,a.hd);a.yaw+=Math.sign(dh)*Math.min(Math.abs(dh),A.turn*dt*(a.st==='flee'?1.8:1));
  if(Math.abs(dh)>1.2)want*=0.3;a.sp+=(want-a.sp)*Math.min(1,dt*(a.st==='flee'?8:4));if(a.sp<0.01)a.sp=0;
  // move, looking ahead by the body's length: steps of one block up, drops of up to three, never into water
  const mx=Math.sin(a.yaw)*a.sp+a.kvx,mz=Math.cos(a.yaw)*a.sp+a.kvz;a.kvx*=Math.max(0,1-dt*5);a.kvz*=Math.max(0,1-dt*5);
  if(Math.abs(mx)+Math.abs(mz)>1e-4){const nx=a.x+mx*dt,nz=a.z+mz*dt,ml=Math.hypot(mx,mz),rr=Math.max(0.2,a.m.box[5]*0.85),fx=a.x+mx/ml*rr,fz=a.z+mz/ml*rr;
    const gn=standY(nx,a.y+0.05,nz),gf=standY(fx,a.y+0.05,fz),ok=gn>0&&gf>0&&gn-a.y<=1.01&&gf-a.y<=1.01&&a.y-gn<=3&&a.y-gf<=3&&!wetAt(nx,gn,nz)&&!wetAt(fx,gf,fz);
    if(ok){a.x=nx;a.z=nz;a.gy=gn;a.stuck=0;}else{a.sp*=0.2;a.kvx=a.kvz=0;a.stuck=(a.stuck||0)+dt;if(a.st==='walk'){a.st='idle';a.t=0.4;}else if(a.st==='flee')a.hd=a.yaw+(a.id%2?1:-1)*(1.4+Math.random());}}
  // stepping up eases over a moment; falling follows gravity; a struck animal hops
  const gy=standY(a.x,a.y+0.05,a.z);if(gy>0)a.gy=gy;
  if(a.vy>0||a.y>a.gy+0.001){a.vy-=24*dt;a.y+=a.vy*dt;if(a.y<=a.gy){a.y=a.gy;a.vy=0;}}else if(a.y<a.gy)a.y=Math.min(a.gy,a.y+(A.run>5?7:4.5)*dt);
  // keep a little room from the others and from the player
  const r1=Math.max(a.m.box[3],-a.m.box[0])+0.15;
  if(dp<r1+0.35&&dp>0.01&&PL.ride!==a){a.kvx-=dx/dp*2.5*dt*10;a.kvz-=dz/dp*2.5*dt*10;}
  for(const b of animals){if(b===a||b.dead||b===PL.ride)continue;const ex=a.x-b.x,ez=a.z-b.z,e=Math.hypot(ex,ez),rr=r1+Math.max(b.m.box[3],-b.m.box[0]);if(e<rr&&e>0.01){a.kvx+=ex/e*(rr-e)*dt*6;a.kvz+=ez/e*(rr-e)*dt*6;}}
  // where to look: at a nearby player when calm, about now and then otherwise; and the calls
  const calm=a.st!=='flee'&&a.st!=='sleep';
  if(calm&&dp<8&&Math.abs(PL.y-a.y)<4){a.lkT=Math.max(-0.9,Math.min(0.9,angTo(a.yaw,Math.atan2(dx,dz))));a.lpT=Math.max(-0.4,Math.min(0.4,(PL.y+1.4-(a.y+a.m.box[4]))/Math.max(1,dp)));}
  else if(a.st!=='idle'){a.lkT*=0.9;a.lpT=0;}
  a.ct-=dt;if(a.ct<=0){a.ct=A.calls?A.calls[0]+Math.random()*(A.calls[1]-A.calls[0]):999;if(calm&&dp<32&&!(a.kind==='hen'&&ambNight()))animalCall(a,false);}
}
// ---- Movement of the parts: legs in step (a trot, a gallop when running), hops for rabbits, heads that graze and look about,
// ears that flick, tails that swish or wag, legs folded to sleep, a hound that sits, a fall to the side when taken
function placeModel(a,dt){
  const A=ANIMALS[a.kind],M=a.m,P=M.parts,root=M.root,k=Math.min(1,dt*6),sp=a.sp,run=sp>A.walk*1.8;
  a.ph+=sp*dt/A.stride*6.2832;
  a.amp+=((sp>0.05?Math.min(1,0.45+sp/A.run*0.8):0)-a.amp)*k;
  a.gz+=(((a.st==='graze'&&a.sp<0.1)?1:0)-a.gz)*Math.min(1,dt*3);
  a.sl+=(((a.st==='sleep')?1:0)-a.sl)*Math.min(1,dt*1.5);
  a.si+=(((a.st==='sit')?1:0)-a.si)*Math.min(1,dt*4);
  a.lk+=(a.lkT-a.lk)*Math.min(1,dt*4);a.lp+=(a.lpT-a.lp)*Math.min(1,dt*4);
  const amp=a.amp*A.amp,s1=Math.sin(a.ph),s2=Math.sin(a.ph+Math.PI),rest=g=>g.userData.rest;
  const legDrop=(P.legFL||P.legL||P.legBL)?((P.legFL||P.legL||P.legBL).position.y*0.85):0;
  let bob=0,rootX=0;
  if(A.hop){const h=Math.abs(Math.sin(a.ph*0.5));bob=h*0.16*a.amp;rootX=-0.25*Math.sin(a.ph*0.5)*a.amp;for(const n of ['legBL','legBR'])if(P[n])P[n].rotation.x=rest(P[n])[0]-0.9*h*a.amp+a.sl*-0.2;for(const n of ['legFL','legFR'])if(P[n])P[n].rotation.x=0.8*h*a.amp;}
  else if(A.biped){if(P.legL)P.legL.rotation.x=s1*amp;if(P.legR)P.legR.rotation.x=s2*amp;}
  else{const g1=Math.sin(a.ph+0.5),g2=Math.sin(a.ph+Math.PI+0.5),v={legFL:run?s1:s1,legBR:run?s2:s1,legFR:run?g1:s2,legBL:run?g2:s2};
    for(const n in v)if(P[n]){const fold=a.sl*(n[3]==='F'?1.35:-1.35)+a.si*(n[3]==='B'?-1.3:0.5);P[n].rotation.x=rest(P[n])[0]+v[n]*amp+fold;}
    bob=Math.abs(Math.cos(a.ph))*0.012*a.amp*(run?3:1);}
  if(A.biped&&a.sl>0.01){root.position.y=-legDrop*a.sl;}
  // head and neck: grazing lowers them, looking turns them; the hen pecks, the boar roots
  const chew=a.gz*Math.sin(wildClock*9+a.id)*0.06,peck=A.biped&&a.st==='graze'?Math.pow(Math.max(0,Math.sin(wildClock*7+a.id)),3)*1.1:0;
  if(P.neck){P.neck.rotation.x=rest(P.neck)[0]+a.gz*0.95+a.sl*0.45-a.lp*0.5;P.neck.rotation.y=a.lk*0.55;if(P.head){P.head.rotation.x=rest(P.head)[0]+a.gz*0.3+chew-a.lp*0.4;P.head.rotation.y=a.lk*0.35;}}
  else if(P.head){P.head.rotation.x=rest(P.head)[0]+(A.biped?peck:a.gz*0.7)+chew+a.sl*0.3-a.lp;P.head.rotation.y=a.lk;if(A.biped)P.head.position.z=(2+Math.sin(a.ph*2)*0.8*a.amp)*AM_PX;}
  // ears flick now and then; tails swish, or wag for a friend
  a.ef-=dt;const flick=a.ef<0?Math.sin(-a.ef*30)*0.35:0;if(a.ef<-0.2)a.ef=2+Math.random()*6;
  if(P.earL)P.earL.rotation.z=rest(P.earL)[2]+flick;if(P.earR)P.earR.rotation.z=rest(P.earR)[2]-flick*0.6;
  if(P.tail){const wag=a.tame&&a.kind==='hound'&&a.st!=='flee'&&Math.hypot(PL.x-a.x,PL.z-a.z)<8;P.tail.rotation.z=wag?Math.sin(wildClock*16)*0.6:Math.sin(wildClock*1.6+a.id)*0.16;
    P.tail.rotation.x=rest(P.tail)[0]+(a.kind==='horse'||a.kind==='mule'?amp*0.5*(run?1:0.4):0)-(a.st==='flee'&&a.kind==='deer'?0.6:0);}
  if(P.wingL){const fl=a.st==='flee'||a.vy>0?0.35+0.55*Math.abs(Math.sin(wildClock*28)):0;P.wingL.rotation.z=-fl;P.wingR.rotation.z=fl;}
  // the sheep's fleece, the mule's pack
  for(const [g,d] of M.dyn)g.visible=d==='wool'?!a.shorn:d==='pack'?!!a.tame:true;
  // the body: lowered to sleep, tipped back to sit, fallen on its side when taken
  root.position.y=(A.biped?root.position.y:-legDrop*a.sl-a.si*legDrop*0.35)+bob;root.rotation.x=rootX-a.si*0.42;
  if(a.dead){const f=Math.min(1,a.dead/0.35);root.rotation.z=f*1.5708;root.position.y+=f*Math.max(a.m.box[3],-a.m.box[0])-Math.max(0,a.dead-1.3)*0.6;}
  M.grp.position.set(a.x,a.y,a.z);M.grp.rotation.y=a.yaw;
  // light where it stands, eased; the struck flash
  a.lt-=dt;if(a.lt<=0){a.lt=0.25;const lx=Math.floor(a.x),ly=Math.floor(a.y+Math.max(0.5,a.m.box[4]*0.6)),lz=Math.floor(a.z);a.eLT=sky(lx,ly,lz);a.eBT=bl(lx,ly,lz);if(!dt){a.eL=a.eLT;a.eB=a.eBT;}}
  if(a.eLT!==undefined){a.eL+=(a.eLT-a.eL)*Math.min(1,dt*4);a.eB+=(a.eBT-a.eB)*Math.min(1,dt*4);}
  const u=M.mat.uniforms;u.eL.value=a.eL;u.eB.value=a.eB;u.hurt.value=a.hurt;
  // the shadow on the ground beneath, fainter in the dark, in fog and when off the ground
  const sh=M.shadow,b=M.box,dist=Math.hypot(a.x-PL.x,a.z-PL.z);sh.position.set(a.x,a.gy+0.02,a.z);sh.rotation.y=a.yaw;sh.scale.set((b[3]-b[0])*1.25,1,(b[5]-b[2])*1.05);
  sh.material.opacity=a.dead>1?0:0.38*Math.max(0,1-(a.y-a.gy)/2)*Math.max(0,1-dist/Math.max(20,U.fogFar.value))*Math.min(1,a.eL*1.3+a.eB);
  const vis=dist<U.fogFar.value+8;M.grp.visible=vis;sh.visible=vis&&sh.material.opacity>0.01;
}
let wildLT=0;
function updAnimals(dt){
  if(!ready)return;wildClock+=dt;
  wildT-=dt;if(wildT<=0){wildT=1;wildRestore();if(playing)spawnTick();for(const a of animals)if(!a.dead&&Math.hypot(a.x-PL.x,a.z-PL.z)<14)discover('a',a.kind);}
  if(PL.ride&&(PL.fly||PL.noclip||!animals.includes(PL.ride)))dismount();
  for(let i=animals.length-1;i>=0;i--){const a=animals[i];
    if(a.dead>2.4){removeAnimal(a);continue;}
    const out=a.x<0||a.z<0||a.x>=W||a.z>=D;
    if(a.tame&&ANIMALS[a.kind].follow&&!a.stay&&out){a.stuck=99;} // a friend comes along wherever you go
    else if(out||(!a.tame&&Math.hypot(a.x-PL.x,a.z-PL.z)>90)){if(a.tame)wildPending.push(wildRec(a));removeAnimal(a);continue;}
    stepAnimal(a,dt);placeModel(a,dt);}
  // hoofbeats under the rider
  if(PL.ride){const a=PL.ride,c=Math.floor(a.ph/Math.PI);if(c!==a.hc){a.hc=c;if(a.sp>1.5)burst(0.05,'bandpass',900+Math.random()*300,2.5,0.14,0,[a.x,a.y+0.1,a.z]);}}
}
// ---- Calls: each kind's own, from where it stands (synthesized like every sound in the game)
function animalCall(a,hurt){
  if(!AX||!settings.sound)return;const at=[a.x,a.y+a.m.box[4]*0.8,a.z],yg=a.young?1.6:1,p=hurt?1.25:1;
  switch(a.kind){
    case 'sheep':voice(290*yg*p,262*yg*p,hurt?0.35:0.7,0.09,{vib:9,vd:0.07,form:900*yg,q:1.4},at);break;
    case 'goat':voice(430*yg*p,395*yg*p,hurt?0.3:0.6,0.08,{vib:13,vd:0.09,form:1300,q:1.4},at);break;
    case 'hen':if(a.young){for(let i=0;i<3;i++)voice(2300,2900,0.07,0.04,{type:'sine',form:2600,q:1,delay:i*0.16},at);}else for(let i=0;i<(hurt?2:4);i++)voice(540*p,420*p,0.07,0.07,{type:'square',form:1100,q:2,delay:i*(hurt?0.09:0.14)},at);break;
    case 'horse':voice(1150*yg*p,520*yg*p,hurt?0.5:1.1,0.07,{vib:8,vd:0.05,form:1400,q:1},at);if(!hurt)burst(0.22,'lowpass',520,0.7,0.09,1.2,at);break;
    case 'mule':for(let i=0;i<(hurt?2:4);i++)voice(i%2?270:610,i%2?245:560,0.34,0.08,{form:900,q:1.2,delay:i*0.38},at);break;
    case 'deer':voice(250*yg*p,170*yg*p,0.35,0.08,{form:700,q:1.5},at);break;
    case 'boar':for(let i=0;i<(hurt?3:2);i++){burst(0.12,'lowpass',260,1,0.13,i*0.2,at);voice(120*p,88*p,0.15,0.06,{form:300,q:1,delay:i*0.2},at);}break;
    case 'hound':if(a.tame&&!hurt&&Math.random()<0.5)voice(900,1150,0.55,0.04,{type:'sine',form:1200,q:1},at);else for(let i=0;i<2;i++)voice(520*p,360*p,0.12,0.09,{form:900,q:1.4,delay:i*0.25},at);break;
    case 'rabbit':burst(0.06,'lowpass',180,1,0.15,0,at);break;}
}
// ---- Aiming at an animal: the nearest box the view ray passes through, within reach and nearer than the block in the way
// the distance along a ray to where it enters a box, or -1
function rayBox(o,v,lo,hi,max){let t0=0,t1=max;for(let k=0;k<3;k++){if(Math.abs(v[k])<1e-9){if(o[k]<lo[k]||o[k]>hi[k])return -1;continue;}let ta=(lo[k]-o[k])/v[k],tb=(hi[k]-o[k])/v[k];if(ta>tb){const t=ta;ta=tb;tb=t;}t0=Math.max(t0,ta);t1=Math.min(t1,tb);if(t0>t1)return -1;}return t0;}
function animalHit(reach){
  const e=eyePos(),d=camDir(),o=[e.x,e.y,e.z],v=[d.x,d.y,d.z];let best=null,bt=reach;const bh=raycast(e,d,reach);
  if(bh){const t=rayBox(o,v,[bh.x,bh.y,bh.z],[bh.x+1,bh.y+1,bh.z+1],reach);if(t>=0)bt=Math.min(bt,t);}
  // each animal's box at rest, turned with it: the ray is turned into the animal's own frame
  for(const a of animals){if(a===PL.ride||a.dead)continue;const c=Math.cos(a.yaw),s=Math.sin(a.yaw),ox=o[0]-a.x,oz=o[2]-a.z,b=a.m.box;
    const t=rayBox([ox*c-oz*s,o[1]-a.y,ox*s+oz*c],[v[0]*c-v[2]*s,v[1],v[0]*s+v[2]*c],[b[0],b[1],b[2]],[b[3],b[4],b[5]],bt);if(t>=0&&t<bt){bt=t;best=a;}}
  return best;
}
// how hard the held thing hits: axes best, then pickaxes and shovels, then a bare hand
function hitPower(id){const it=ITEMS[id];if(!it||!it.tool)return 1;return (it.tool==='axe'?3:2)+(it.tier||0)*0.5;}
// Left button: strike. Right button: shear, milk, gather an egg, feed, ride, open a pack, tell a friend to stay or follow.
function animalAct(btn){
  const a=animalHit(4.5);if(!a)return false;const A=ANIMALS[a.kind],held=curId();
  if(btn===0){swing=1;const kx=a.x-PL.x,kz=a.z-PL.z,kd=Math.hypot(kx,kz)||1;a.kvx=kx/kd*4;a.kvz=kz/kd*4;a.vy=3.2;a.hurt=1;animalCall(a,true);
    if(!a.tame)alarm(a,PL.x,PL.z,5);
    if(a.young){toast('Too young to take. Let it grow.');return true;}
    a.hp-=hitPower(held);for(let k=0;k<5;k++)spawnP(a.x,a.y+a.m.box[4]*0.6,a.z,(Math.random()-.5)*2,1+Math.random()*2,(Math.random()-.5)*2,[0.6,0.12,0.1],0.5,8);
    if(a.hp<=0){if(a.tame&&!confirmHunt(a))return true;const pk=a.uid&&boxes.get('mule:'+a.uid);if(pk){for(const q of pk)if(q)addItem(q.id,q.c);boxes.delete('mule:'+a.uid);} // what the mule carried comes to you
      for(const [id,n] of A.drops){const left=addItem(id,n);if(left)toast('No room for '+nameOf(id));}drawBar(true);toast(A.drops.length?'You took '+A.drops.map(([id,n])=>n+' '+nameOf(id)).join(' and '):'The '+A.n.toLowerCase()+' is gone');if(PL.ride===a)dismount();a.dead=0.001;a.st='dead';a.sp=0;}
    return true;}
  if(btn!==2)return false;
  if(A.shear&&held===321){if(a.young){toast('A lamb has no fleece to take yet');return true;}if(a.shorn){toast('Its fleece has not grown back yet');return true;}const wl=AM_KINDS.sheep.coats[a.ci][0].black?WOOLK:A.shear;a.shorn=true;a.cool=300;addItem(wl,2);wearHeld(1);drawBar(true);toast('2 '+nameOf(wl));sfxBlock(WOOLW,false,a.x,a.y,a.z);swing=1;return true;}
  if(A.milk&&(!held||!SURV())){if(a.young){toast('Only a grown goat gives milk');return true;}if(a.cool>0){toast('The goat has no more milk for now');return true;}a.cool=240;addItem(360,1);drawBar(true);toast("Goat's Milk");return true;}
  if(A.egg&&(!held||!SURV())){if(a.young){toast('A chick lays no eggs');return true;}if(a.cool>0){toast('No egg yet');return true;}a.cool=300;addItem(355,1);drawBar(true);toast('An egg');return true;}
  if(A.mount){if(a.young){toast('A foal is too small to ride');return true;}if(PL.ride===a)dismount();else mount(a);return true;}
  if(A.tame&&!a.tame){if(A.tame.includes(held)){const q=inv[sel];if(SURV()){q.c--;if(!q.c)inv[sel]=null;}drawBar(true);a.tame=true;a.uid=a.uid||(Date.now().toString(36)+a.id);a.st='follow';a.t=1;a.herd=a.id;saveDirty=true;animalCall(a,false);toast('The '+A.n.toLowerCase().replace('stray ','').replace('wild ','')+' will follow you now');tone(520,780,0.2,0.06,0,null,[a.x,a.y+0.6,a.z]);}
    else toast('The '+A.n.toLowerCase()+' sniffs your hand. '+(a.kind==='hound'?'It would like some meat.':'It would like some crops.'));return true;}
  if(a.tame&&A.pack&&!keyHeld('sprint')){openPack(a);return true;}
  if(a.tame){a.stay=!a.stay;a.t=0;a.st='idle';saveDirty=true;toast(a.stay?'It stays here':'It follows you');return true;}
  return false;
}
function confirmHunt(a){if(a.warned)return true;a.warned=true;a.hp=1;toast('This is your '+ANIMALS[a.kind].n.toLowerCase().replace('stray ','').replace('wild ','')+'. Strike again to part with it.');return false;}
// ---- Riding (Q67): a wild horse can be ridden at once; it is faster and jumps higher. Use it again to get off.
function mount(a){PL.ride=a;a.st='walk';a.sl=a.si=0;PL.x=a.x;PL.z=a.z;PL.y=Math.max(PL.y,a.y);PL.yaw=a.yaw+Math.PI;toast('Riding. Sprint to gallop; use the horse again to get off.');animalCall(a,false);}
function dismount(){const a=PL.ride;PL.ride=null;if(a){a.st='idle';a.t=3;a.sp=0;a.y=a.gy=Math.max(1,standY(a.x,a.y,a.z));}}
// ---- The mule's pack: a container like a chest, kept under the mule's own key with the other containers (cs)
function openPack(a){if(!SURV()){toast('Packs open in survival');return;}const k='mule:'+a.uid;if(!boxes.has(k))boxes.set(k,new Array(BOX_SLOTS).fill(null));box={k:k,x:Math.floor(a.x),y:Math.floor(a.y),z:Math.floor(a.z)};saveDirty=true;openInv();$('invtitle').textContent="The mule's pack";}
// ---- Saved with the world: the animals you have befriended (world coordinates)
const wildRec=a=>[a.kind,+(a.x+OX).toFixed(1),+a.y.toFixed(1),+(a.z+OZ).toFixed(1),a.stay?1:0,a.uid,a.ci,a.young?1:0];
const wildSave=()=>({an:animals.filter(a=>a.tame&&!a.dead).map(wildRec).concat(wildPending)});
let wildPending=saved&&Array.isArray(saved.an)?saved.an:[];
// befriended animals come back once the world around them is loaded
function wildRestore(){if(!wildPending.length||!ready)return;const keep=[];for(const r of wildPending){const [k,X,Y,Z,st,uid,ci,yg]=r,x=X-OX,z=Z-OZ;if(!ANIMALS[k])continue;
  if(x<0||z<0||x>=W||z>=D||!genDone[(Math.floor(x)>>4)+(Math.floor(z)>>4)*NCX]){keep.push(r);continue;}const y=standY(x,Y,z);
  addAnimal(k,x,y>0?y:Y,z,{tame:true,stay:!!st,uid:String(uid||''),ci:ci|0,young:!!yg,st:'idle',t:1});}wildPending=keep;}
