// ---- Wildlife (E1, D-049; Q47, Q48, Q63, Q67): peaceful animals in the lands that suit them. They wander, graze and flee;
// they give wool, milk and eggs, meat and hides to the hunter; wild horses can be ridden, a stray hound fed meat follows you, and
// a wild mule fed crops carries a pack. Animals are not part of generation: they come and go around the player (Math.random is
// fine here), and only the ones you have befriended are saved with the world (an).
const ANIMALS={
  deer:{n:'Deer',col:[150,104,62],head:[124,86,52],sz:[0.6,0.8,1.2],leg:0.7,speed:3.4,shy:9,hp:6,drops:[[350,2],[352,1]],g:['wood','meadow'],herd:[1,3],w:3},
  rabbit:{n:'Rabbit',col:[150,132,112],head:[160,140,120],sz:[0.3,0.3,0.45],leg:0.12,speed:4,shy:6,hp:2,drops:[[353,1]],g:['wood','meadow','dry'],herd:[1,2],w:4},
  sheep:{n:'Sheep',col:[226,222,210],head:[70,64,60],sz:[0.8,0.7,1.1],leg:0.45,speed:1.6,hp:6,drops:[[351,2]],g:['meadow','farm'],herd:[2,5],w:4,shear:WOOLW},
  goat:{n:'Mountain Goat',col:[204,200,190],head:[176,168,156],sz:[0.55,0.65,0.9],leg:0.5,speed:2.6,shy:4,hp:6,drops:[[351,1],[352,1]],g:['high'],herd:[1,3],w:4,milk:true},
  hen:{n:'Wild Hen',col:[176,120,70],head:[200,64,44],sz:[0.32,0.38,0.42],leg:0.2,speed:1.5,hp:2,drops:[[355,1]],g:['farm','wet'],herd:[2,4],w:3,egg:true},
  boar:{n:'Boar',col:[92,68,52],head:[80,60,46],sz:[0.65,0.65,1.1],leg:0.35,speed:2.8,shy:7,hp:8,drops:[[354,2],[352,1]],g:['dark','wood'],herd:[1,3],w:2},
  horse:{n:'Wild Horse',col:[122,86,58],head:[108,76,50],sz:[0.75,1.0,1.6],leg:0.85,speed:2.6,shy:3,hp:10,drops:[],g:['meadow','dry'],herd:[2,4],w:2,mount:true},
  hound:{n:'Stray Hound',col:[142,122,98],head:[122,102,82],sz:[0.42,0.5,0.85],leg:0.35,speed:3.2,hp:6,drops:[],g:['farm','meadow'],herd:[1,1],w:1,tame:[350,351,353,354,356,357,358,359],follow:true},
  mule:{n:'Wild Mule',col:[112,102,94],head:[102,92,86],sz:[0.65,0.9,1.3],leg:0.7,speed:2.2,hp:10,drops:[],g:['dry','high','meadow'],herd:[1,2],w:1,tame:[202,330,331,207],follow:true,pack:true}
};
// which animals live in a land
const WILD_OF={autumn:['wood'],birch:['wood'],pine:['wood','high'],giant:['wood'],yew:['dark','wood'],silver:['wood'],elder:['wood'],green:['meadow','farm'],orchard:['farm'],farm:['farm','meadow'],flower:['meadow'],terrace:['farm','high'],
  moors:['meadow','high'],barrow:['meadow'],shadow:['dark'],willow:['wet','wood'],bog:['wet'],steppe:['dry','meadow'],dry:['dry'],petrified:['dry'],mtn:['high'],alpine:['high','meadow'],karst:['high'],tundra:['high'],glacier:[],fjord:['high'],
  cloud:['wood','high'],chalk:['meadow'],volcanic:[],blight:[],crystal:[],glowcap:[],starfall:['dry'],sea:[],isles:[],kelp:[],blacksand:[]};
const WILD_CAP=22,animals=[],TWL={};let wildT=0,wildId=1;
entityKind({name:'animals',list:animals,update:dt=>updAnimals(dt),clear:()=>{for(let i=animals.length-1;i>=0;i--){const a=animals[i];if(a.tame){continue;}scene.remove(a.m);animals.splice(i,1);}},persist:false});
// a simple body of boxes: body, head, four legs; one material per animal so its light can be set
const boxG=new THREE.BoxGeometry(1,1,1);
function animalMesh(A){
  const mat=new THREE.MeshBasicMaterial({color:new THREE.Color(A.col[0]/255,A.col[1]/255,A.col[2]/255)}),hmat=new THREE.MeshBasicMaterial({color:new THREE.Color(A.head[0]/255,A.head[1]/255,A.head[2]/255)});
  const g=new THREE.Group(),[w,h,l]=A.sz,lg=A.leg,body=new THREE.Mesh(boxG,mat);body.scale.set(w,h*0.6,l);body.position.y=lg+h*0.3;g.add(body);
  const head=new THREE.Mesh(boxG,hmat);const hs=Math.max(0.22,w*0.55);head.scale.set(hs,hs,hs*1.1);head.position.set(0,lg+h*0.55,l*0.5+hs*0.35);g.add(head);
  const legs=[];for(const [sx,sz] of [[-1,-1],[1,-1],[-1,1],[1,1]]){const k=new THREE.Mesh(boxG,mat);k.scale.set(Math.max(0.08,w*0.18),lg,Math.max(0.08,w*0.18));k.position.set(sx*w*0.32,lg/2,sz*l*0.35);g.add(k);legs.push(k);}
  g.userData={mats:[mat,hmat],legs:legs,base:[A.col,A.head]};return g;
}
function addAnimal(kind,x,y,z,o){
  const A=ANIMALS[kind],m=animalMesh(A);m.position.set(x,y,z);scene.add(m);
  const a=Object.assign({id:wildId++,kind:kind,x:x,y:y,z:z,vy:0,yaw:Math.random()*6.283,hp:A.hp,walk:0,t:0,flee:0,m:m,cool:0,ph:0},o||{});animals.push(a);return a;
}
function removeAnimal(a){scene.remove(a.m);const i=animals.indexOf(a);if(i>=0)animals.splice(i,1);if(PL.ride===a)dismount();}
// the ground an animal stands on near height y: the first solid block at or below y+1, with room above
function standY(x,y,z){const bx=Math.floor(x),bz=Math.floor(z);if(bx<0||bz<0||bx>=W||bz>=D)return -1;for(let yy=Math.floor(y)+1;yy>=Math.floor(y)-3;yy--){if(yy<1||yy>=H-2)continue;if(SOLID[get(bx,yy-1,bz)]&&!SOLID[get(bx,yy,bz)]&&!SOLID[get(bx,yy+1,bz)])return yy;}return -1;}
// spawn: a herd now and then, out of sight range but in the loaded window, on open ground of a land that has animals
function spawnTick(){
  const wild=animals.filter(a=>!a.tame).length;if(wild>=WILD_CAP)return;
  const a=Math.random()*6.283,d=28+Math.random()*30,x=PL.x+Math.cos(a)*d,z=PL.z+Math.sin(a)*d,bx=Math.floor(x),bz=Math.floor(z);if(bx<2||bz<2||bx>=W-2||bz>=D-2)return;
  const g=ground[bx+W*bz];if(g<=SEA||!genDone[(bx>>4)+(bz>>4)*NCX]||PL.y<g-12)return;const top=get(bx,g,bz);if(!SOLID[top]||BL[top].liquid||isWetId(get(bx,g+1,bz)))return;
  colInfo(bx+OX,bz+OZ,TWL);const groups=WILD_OF[LANDS[TWL.land].k]||[];if(!groups.length)return;
  const kinds=Object.keys(ANIMALS).filter(k=>ANIMALS[k].g.some(q=>groups.includes(q)));if(!kinds.length)return;
  let tot=0;for(const k of kinds)tot+=ANIMALS[k].w;let v=Math.random()*tot,kind=kinds[0];for(const k of kinds){v-=ANIMALS[k].w;if(v<=0){kind=k;break;}}
  const A=ANIMALS[kind],n=A.herd[0]+Math.floor(Math.random()*(A.herd[1]-A.herd[0]+1));
  for(let i=0;i<n;i++){const xx=x+(Math.random()-.5)*6,zz=z+(Math.random()-.5)*6,yy=standY(xx,g+1,zz);if(yy>0)addAnimal(kind,xx,yy,zz);}
}
// one step of one animal: wander, graze, flee from a running or hunting player, follow a friend; gravity and one-block steps
function stepAnimal(a,dt){
  const A=ANIMALS[a.kind],dx=PL.x-a.x,dz=PL.z-a.z,dp=Math.hypot(dx,dz);
  let sp=0;a.t-=dt;
  if(PL.ride===a)return;
  if(a.tame&&A.follow&&!a.stay){if(dp>40){const y=standY(PL.x,PL.y,PL.z);if(y>0){a.x=PL.x-Math.sin(PL.yaw)*-2;a.z=PL.z;a.y=y;}}else if(dp>3.5){a.yaw=Math.atan2(dx,dz);sp=A.speed*(dp>10?1.6:1);}}
  else if(a.flee>0||(A.shy&&dp<A.shy&&(Math.hypot(PL.vx,PL.vz)>5||a.flee>0))){a.flee=Math.max(a.flee-dt,0);a.yaw=Math.atan2(-dx,-dz)+(Math.random()-.5)*0.4;sp=A.speed*1.8;}
  else{if(a.t<=0){a.t=2+Math.random()*5;a.walk=Math.random()<0.45?1:0;if(a.walk)a.yaw+=(Math.random()-.5)*2.5;}sp=a.walk?A.speed*0.45:0;}
  if(sp>0){const nx=a.x+Math.sin(a.yaw)*sp*dt,nz=a.z+Math.cos(a.yaw)*sp*dt,ny=standY(nx,a.y,nz);
    if(ny>0&&ny-a.y<=1.01&&a.y-ny<=3&&!isWetId(get(Math.floor(nx),ny,Math.floor(nz)))){a.x=nx;a.z=nz;if(ny>a.y)a.y=ny;}else{a.yaw+=1.6+Math.random();a.t=Math.min(a.t,0.5);}
    a.ph+=sp*dt*3.2;}
  // gravity
  const gy=standY(a.x,a.y,a.z);if(gy>0&&gy<a.y){a.vy-=20*dt;a.y=Math.max(gy,a.y+a.vy*dt);if(a.y===gy)a.vy=0;}else a.vy=0;
  a.cool=Math.max(0,a.cool-dt);if(a.shorn&&a.cool<=0)a.shorn=false; // the fleece grows back
}
let wildLT=0;
function updAnimals(dt){
  if(!ready)return;
  wildT-=dt;if(wildT<=0){wildT=1;wildRestore();if(playing)spawnTick();for(const a of animals)if(Math.hypot(a.x-PL.x,a.z-PL.z)<14)discover('a',a.kind);}
  wildLT-=dt;const relight=wildLT<=0;if(relight)wildLT=0.3;
  for(let i=animals.length-1;i>=0;i--){const a=animals[i];
    if(!a.tame&&Math.hypot(a.x-PL.x,a.z-PL.z)>90){removeAnimal(a);continue;}
    stepAnimal(a,dt);
    const m=a.m;m.position.set(a.x,a.y,a.z);m.rotation.y=a.yaw;const sw=Math.sin(a.ph)*0.5;m.userData.legs.forEach((k,j)=>{k.rotation.x=(j===0||j===3)?sw:-sw;});
    if(relight){const L=lightAtCell(Math.floor(a.x),Math.floor(a.y+0.6),Math.floor(a.z));m.userData.mats.forEach((mt,j)=>{const c=m.userData.base[j];mt.color.setRGB(c[0]/255*L,c[1]/255*L,c[2]/255*L);});}}
  if(PL.ride&&(PL.fly||PL.noclip||!animals.includes(PL.ride)))dismount();
  if(PL.ride){const a=PL.ride;a.x=PL.x;a.z=PL.z;a.y=PL.y-0.05;a.yaw=PL.yaw+Math.PI;a.ph+=Math.hypot(PL.vx,PL.vz)*dt*1.4;}
}
// ---- Aiming at an animal: the nearest box the view ray passes through, within reach and nearer than the block in the way
// the distance along a ray to where it enters a box, or -1
function rayBox(o,v,lo,hi,max){let t0=0,t1=max;for(let k=0;k<3;k++){if(Math.abs(v[k])<1e-9){if(o[k]<lo[k]||o[k]>hi[k])return -1;continue;}let ta=(lo[k]-o[k])/v[k],tb=(hi[k]-o[k])/v[k];if(ta>tb){const t=ta;ta=tb;tb=t;}t0=Math.max(t0,ta);t1=Math.min(t1,tb);if(t0>t1)return -1;}return t0;}
function animalHit(reach){
  const e=eyePos(),d=camDir(),o=[e.x,e.y,e.z],v=[d.x,d.y,d.z];let best=null,bt=reach;const bh=raycast(e,d,reach);
  if(bh){const t=rayBox(o,v,[bh.x,bh.y,bh.z],[bh.x+1,bh.y+1,bh.z+1],reach);if(t>=0)bt=Math.min(bt,t);}
  for(const a of animals){if(a===PL.ride)continue;const A=ANIMALS[a.kind],r=Math.max(A.sz[0],A.sz[2])*0.55,t=rayBox(o,v,[a.x-r,a.y,a.z-r],[a.x+r,a.y+A.leg+A.sz[1],a.z+r],bt);if(t>=0&&t<bt){bt=t;best=a;}}
  return best;
}
// how hard the held thing hits: axes best, then pickaxes and shovels, then a bare hand
function hitPower(id){const it=ITEMS[id];if(!it||!it.tool)return 1;return (it.tool==='axe'?3:2)+(it.tier||0)*0.5;}
// Left button: strike. Right button: shear, milk, gather an egg, feed, ride, open a pack, tell a friend to stay or follow.
function animalAct(btn){
  const a=animalHit(4.5);if(!a)return false;const A=ANIMALS[a.kind],held=curId();
  if(btn===0){a.hp-=hitPower(held);a.flee=6;tone(260,180,0.12,0.08,0,'triangle',[a.x,a.y+0.6,a.z]);swing=1;
    for(let k=0;k<6;k++)spawnP(a.x,a.y+A.leg+A.sz[1]*0.5,a.z,(Math.random()-.5)*2,1+Math.random()*2,(Math.random()-.5)*2,[0.6,0.12,0.1],0.5,8);
    if(a.hp<=0){if(a.tame&&!confirmHunt(a))return true;const pk=a.uid&&boxes.get('mule:'+a.uid);if(pk){for(const q of pk)if(q)addItem(q.id,q.c);boxes.delete('mule:'+a.uid);} // what the mule carried comes to you
      for(const [id,n] of A.drops){const left=addItem(id,n);if(left)toast('No room for '+nameOf(id));}drawBar(true);toast(A.drops.length?'You took '+A.drops.map(([id,n])=>n+' '+nameOf(id)).join(' and '):'The '+A.n.toLowerCase()+' is gone');removeAnimal(a);}
    return true;}
  if(btn!==2)return false;
  if(A.shear&&held===321){if(a.shorn){toast('Its fleece has not grown back yet');return true;}a.shorn=true;a.cool=300;addItem(A.shear,2);wearHeld(1);drawBar(true);toast('2 '+nameOf(A.shear));sfxBlock(WOOLW,false,a.x,a.y,a.z);swing=1;return true;}
  if(A.milk&&(!held||!SURV())){if(a.cool>0){toast('The goat has no more milk for now');return true;}a.cool=240;addItem(360,1);drawBar(true);toast("Goat's Milk");return true;}
  if(A.egg&&(!held||!SURV())){if(a.cool>0){toast('No egg yet');return true;}a.cool=300;addItem(355,1);drawBar(true);toast('An egg');return true;}
  if(A.mount){if(PL.ride===a)dismount();else mount(a);return true;}
  if(A.tame&&!a.tame){if(A.tame.includes(held)){const q=inv[sel];if(SURV()){q.c--;if(!q.c)inv[sel]=null;}drawBar(true);a.tame=true;a.uid=a.uid||(Date.now().toString(36)+a.id);a.flee=0;saveDirty=true;toast('The '+A.n.toLowerCase().replace('stray ','').replace('wild ','')+' will follow you now');tone(520,780,0.2,0.06,0,null,[a.x,a.y+0.6,a.z]);}
    else toast('The '+A.n.toLowerCase()+' sniffs your hand. '+(a.kind==='hound'?'It would like some meat.':'It would like some crops.'));return true;}
  if(a.tame&&A.pack&&!keyHeld('sprint')){openPack(a);return true;}
  if(a.tame){a.stay=!a.stay;saveDirty=true;toast(a.stay?'It stays here':'It follows you');return true;}
  return false;
}
function confirmHunt(a){if(a.warned)return true;a.warned=true;a.hp=1;toast('This is your '+ANIMALS[a.kind].n.toLowerCase().replace('stray ','').replace('wild ','')+'. Strike again to part with it.');return false;}
// ---- Riding (Q67): a wild horse can be ridden at once; it is faster and jumps higher. Use it again to get off.
function mount(a){PL.ride=a;a.flee=0;toast('Riding. Use the horse again to get off.');}
function dismount(){const a=PL.ride;PL.ride=null;if(a){a.t=3;a.walk=0;}}
// ---- The mule's pack: a container like a chest, kept under the mule's own key with the other containers (cs)
function openPack(a){if(!SURV()){toast('Packs open in survival');return;}const k='mule:'+a.uid;if(!boxes.has(k))boxes.set(k,new Array(BOX_SLOTS).fill(null));box={k:k,x:Math.floor(a.x),y:Math.floor(a.y),z:Math.floor(a.z)};saveDirty=true;openInv();$('invtitle').textContent="The mule's pack";}
// ---- Saved with the world: the animals you have befriended (world coordinates)
const wildSave=()=>({an:animals.filter(a=>a.tame).map(a=>[a.kind,+(a.x+OX).toFixed(1),+a.y.toFixed(1),+(a.z+OZ).toFixed(1),a.stay?1:0,a.uid])});
let wildPending=saved&&Array.isArray(saved.an)?saved.an:[];
// befriended animals come back once the world around them is loaded
function wildRestore(){if(!wildPending.length||!ready)return;const keep=[];for(const r of wildPending){const [k,X,Y,Z,st,uid]=r,x=X-OX,z=Z-OZ;if(!ANIMALS[k])continue;if(x<0||z<0||x>=W||z>=D){keep.push(r);continue;}
  addAnimal(k,x,Y,z,{tame:true,stay:!!st,uid:String(uid||'')});}wildPending=keep;}
