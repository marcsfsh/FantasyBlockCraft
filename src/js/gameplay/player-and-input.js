// Player
const PL={x:0,y:0,z:0,vx:0,vy:0,vz:0,yaw:0,pitch:-0.15,ground:false,fly:false,noclip:false,climb:false};
let spawnW=[0.5,H-5,0.5];
const HW=0.3,PH=1.8,EYE=1.62;
function solidAt(x,y,z){if(x<0||z<0||x>=W||z>=D)return true;if(y<0||y>=H)return false;return SOLID[world[I(x,y,z)]]===1;}
function collide(){
  if(PL.noclip)return false; // noclip (creative): the player passes through blocks
  const x0=Math.floor(PL.x-HW),x1=Math.floor(PL.x+HW),y0=Math.floor(PL.y),y1=Math.floor(PL.y+PH),z0=Math.floor(PL.z-HW),z1=Math.floor(PL.z+HW);
  for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++)if(solidAt(x,y,z))return true;
  return false;
}
function moveAxis(a,d){
  if(!d)return false;
  const old=PL[a];PL[a]+=d;
  if(!collide())return false;
  if(a==='y')PL.y=d<0?Math.floor(PL.y)+1:Math.floor(PL.y+PH)-PH-0.001;
  else PL[a]=d>0?Math.floor(PL[a]+HW)-HW-0.001:Math.floor(PL[a]-HW)+1+HW+0.001;
  if(collide())PL[a]=old;
  return true;
}
function liquidAt(x,y,z){return BL[get(Math.floor(x),Math.floor(y),Math.floor(z))].liquid;}
function hitsPlayer(x,y,z){return x+1>PL.x-HW&&x<PL.x+HW&&y+1>PL.y&&y<PL.y+PH&&z+1>PL.z-HW&&z<PL.z+HW;}

// Held block in view
const hand=new THREE.Mesh(new THREE.BufferGeometry(),matHand);
hand.renderOrder=999;hand.frustumCulled=false;camera.add(hand);
const handItem=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({transparent:true,alphaTest:0.5,depthTest:false,depthWrite:false,side:THREE.DoubleSide}));
handItem.renderOrder=1000;handItem.frustumCulled=false;handItem.visible=false;camera.add(handItem);
const itemTexC={};
function itemTex(id){if(!itemTexC[id]){const t=new THREE.CanvasTexture(itemIcon(id));t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;itemTexC[id]=t;}return itemTexC[id];}
const crackTex=[0,1,2,3].map(stage=>{const c=document.createElement('canvas');c.width=c.height=16;const g=c.getContext('2d'),r=mkRng(99+stage);g.fillStyle='#000';
  for(let k=0;k<3+stage*3;k++){let x=7+(r()*3|0),y=7+(r()*3|0);for(let s2=0;s2<4+stage*2;s2++){g.fillRect(x,y,1,1);x+=(r()*3|0)-1;y+=(r()*3|0)-1;}}
  const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;return t;});
const crack=new THREE.Mesh(new THREE.BoxGeometry(1.01,1.01,1.01),new THREE.MeshBasicMaterial({map:crackTex[0],transparent:true,depthWrite:false,opacity:0}));
crack.visible=false;scene.add(crack);
let swing=0,bob=0;
function handGeo(id){
  const m=newM();
  if(isTool(id)){for(const F of FACES){const base=m.p.length/3;for(const c of F.c){m.p.push((c[0]-.5)*0.22,(c[1]-.5)*0.22,(c[2]-.5)*1.3);pushUV(m.u,TOOLS[id][2],c[3],c[4]);m.l.push(F.s);m.b.push(0);m.a.push(F.s);}m.i.push(base,base+1,base+2,base+2,base+1,base+3);}return mkGeo(m);}
  const b=BL[id];
  if(b.cross||b.torch){for(let k=0;k<4;k++){const c=CUV[k];m.p.push(c[0]-.5,c[1]-.5,0);pushUV(m.u,b.t[0],c[0],c[1]);m.l.push(1);m.b.push(b.emit?2:0);m.a.push(1);}m.i.push(0,1,2,2,1,3,0,2,1,2,3,1);}
  else for(const F of FACES){const base=m.p.length/3;for(const c of F.c){m.p.push(c[0]-.5,c[1]-.5,c[2]-.5);pushUV(m.u,b.t[F.tf],c[3],c[4]);m.l.push(b.emit?1:F.s);m.b.push(b.emit?2:0);m.a.push(F.s);}m.i.push(base,base+1,base+2,base+2,base+1,base+3);}
  return mkGeo(m);
}
function updateHand(){
  const id=curId();hand.geometry.dispose();
  if(id>0&&id<200){hand.geometry=handGeo(id);hand.visible=!photo;handItem.visible=false;}
  else{hand.geometry=new THREE.BufferGeometry();hand.visible=false;
    if(id>=200){handItem.material.map=itemTex(id);handItem.material.needsUpdate=true;handItem.visible=!photo;}else handItem.visible=false;}
}

// Input
const keys={},tch={jump:false,down:false,jx:0,jy:0};
let playing=false,invOpen=false,ready=false,hold=-1,holdT=0,lastSpace=0;
const hot=(saved&&Array.isArray(saved.hot)&&saved.hot.length===9&&saved.seed===SEED)?saved.hot.filter(id=>isTool(id)||ITEMS[id]||(BL[id]&&BL[id].place)):[GRASS,STONE,PLANKS,LOG,GLASS,TORCH,TNT,WAYPT,322];
while(hot.length<9)hot.push(STONE);
let mode=saved&&saved.mode?saved.mode:WORLD.mode;
const SURV=()=>mode==='survival';
const inv=new Array(36).fill(null);
if(saved&&Array.isArray(saved.inv))saved.inv.forEach((q,i)=>{if(q&&i<36&&(ITEMS[q[0]]||BL[q[0]]))inv[i]={id:q[0],c:q[1],d:q[2]||0};});
// A new survival world starts with a small kit (M4, Q59): wooden pickaxe and axe, a map, torches and bread
const START_KIT=[[240,1],[300,1],[325,1],[TORCH,8],[206,4]];
if(!saved&&mode==='survival')START_KIT.forEach(([id,c],i)=>{inv[i]={id:id,c:c,d:0};});
// Finding the way in survival (M4, Q66): the minimap needs a map, X and Z and the heading a compass, the height a depth gauge.
// Creative always shows everything.
const carries=id=>!SURV()||inv.some(q=>q&&q.id===id);
const HEADINGS=['north','north-west','west','south-west','south','south-east','east','north-east'];
const heading=()=>HEADINGS[((Math.round(PL.yaw/(Math.PI/4))%8)+8)%8];
// Equipment: a belt (a lantern that lights the way), a pack and a bag (more room); filled in M4. An item goes in the slot
// its ITEMS entry names with {equip:'belt'|'pack'|'bag'}. Equipped items are saved and go to the grave on death.
const EQUIP_SLOTS={belt:'Belt',pack:'Pack',bag:'Bag'},equip={belt:null,pack:null,bag:null};
const equipSlotOf=id=>(ITEMS[id]&&ITEMS[id].equip)||null;
if(saved&&saved.eq)for(const s in EQUIP_SLOTS){const q=saved.eq[s];if(q&&equipSlotOf(q[0])===s)equip[s]={id:q[0],c:1,d:q[1]||0};}
const stackMax=id=>ITEMS[id]&&(ITEMS[id].dur||ITEMS[id].one)?1:ITEMS[id]&&ITEMS[id].kind==='grapnel'?8:64;
function roomFor(id){let n=0;for(const q of inv)n+=!q?stackMax(id):q.id===id?stackMax(id)-q.c:0;return n;}
function addItem(id,n){
  for(const q of inv)if(n>0&&q&&q.id===id&&q.c<stackMax(id)){const k=Math.min(n,stackMax(id)-q.c);q.c+=k;n-=k;}
  for(let i=0;i<36&&n>0;i++)if(!inv[i]){const k=Math.min(n,stackMax(id));inv[i]={id:id,c:k};n-=k;}
  saveDirty=true;return n;
}
// Would every [id,count] in the list fit in the inventory? (addItem's rules, on a copy)
function fitsAll(list){const tmp=inv.map(q=>q&&{id:q.id,c:q.c});for(let [id,n] of list){for(const q of tmp)if(n>0&&q&&q.id===id&&q.c<stackMax(id)){const k=Math.min(n,stackMax(id)-q.c);q.c+=k;n-=k;}for(let i=0;i<36&&n>0;i++)if(!tmp[i]){const k=Math.min(n,stackMax(id));tmp[i]={id:id,c:k};n-=k;}if(n>0)return false;}return true;}
// Put inventory slot i into its equipment slot (what was there goes back to the inventory); false if it does not fit
function equipFrom(i){
  const q=inv[i],s=q&&equipSlotOf(q.id);if(!s)return false;const old=equip[s];
  if(q.c>1){if(old&&!inv.some(x=>!x))return false;q.c--;if(old)inv[inv.findIndex(x=>!x)]={id:old.id,c:1,d:old.d};}
  else inv[i]=old?{id:old.id,c:1,d:old.d}:null;
  equip[s]={id:q.id,c:1,d:q.d||0};saveDirty=true;return true;
}
function unequip(s){const q=equip[s],i=inv.findIndex(x=>!x);if(!q||i<0)return false;inv[i]={id:q.id,c:1,d:q.d};equip[s]=null;saveDirty=true;return true;}
const asList=x=>Array.isArray(x)?x:[x];
function countOf(ids){ids=asList(ids);let n=0;for(const q of inv)if(q&&ids.includes(q.id))n+=q.c;return n;}
function takeItems(ids,n){ids=asList(ids);for(let i=0;i<36&&n>0;i++){const q=inv[i];if(q&&ids.includes(q.id)){const k=Math.min(n,q.c);q.c-=k;n-=k;if(!q.c)inv[i]=null;}}saveDirty=true;}
function curId(){if(SURV()){const q=inv[sel];return q?q.id:0;}return hot[sel];}
function setMode(m){
  mode=m;settings.newMode=m;lsSet(SET_KEY,settings);
  if(SURV()){if(PL.noclip)toggleNoclip();if(PL.fly)toggleFly();gliding=false;brushR=0;$('tBrush').textContent='1x';if(swapMode)toggleSwap();}
  ['tUndo','tSwap','tBrush','tFly','tClip'].forEach(id=>{$(id).style.display=SURV()?'none':'';});$('clipseg').style.display=SURV()?'none':'';
  document.body.classList.toggle('surv',SURV());fallTop=null;
  drawMode();drawBar();drawStats();saveDirty=true;
}
function creativeOnly(){if(SURV()){toast('That is a creative mode tool');return true;}return false;}
// What breaking a block gives. Shears keep leaves, cobwebs and soft plants whole; by hand grasses and bracken give plant fibre.
const SHEAR_KEEP=new Set([TGRASS,FLOWR,FLOWY,DBUSH,HEATHER,COBWEB]);
function dropsFor(id,tool){
  if(ITEMS[tool]&&ITEMS[tool].tool==='shears'&&(BL[id].leaf||SHEAR_KEEP.has(id)))return[[id,1]];
  switch(id){
    case DBUSH:return Math.random()<0.5?[[328,1]]:[];case HEATHER:return Math.random()<0.3?[[328,1]]:[];case ROPE:case GRAPNEL:return[];
    case STONE:return[[COBBLE,1]];case GRASS:case SNOWG:return[[DIRT,1]];case COAL:return[[200,1+(Math.random()<0.25?1:0)]];
    case COPO:return[[210,1]];case TINO:return[[211,1]];case ZINO:return[[212,1]];case IRON:return[[213,1]];case GOLD:return[[214,1]];
    case GLOWSHROOM:return Math.random()<0.7?[[270,1]]:[[GLOWSHROOM,1]];case CRATE:case DWCHEST:case BARREL:return[];case GLOWCAP:return Math.random()<0.5?[[270,1]]:[];
    case PATH:case FARM_D:case FARM_W:return[[DIRT,1]];case WHEAT:return[[202,1],[208,1+(Math.random()<0.5?1:0)]];case WHEAT0:case WHEAT1:case WHEAT2:return[[208,1]];case POT0:case POT1:case POT2:return[[209,1]];case POT3:return[[209,1+(Math.random()*3|0)]];case TGRASS:{const r=Math.random();return r<0.12?[[208,1]]:r<0.15?[[209,1]]:r<0.45?[[328,1]]:[];}case PLATO:return[[215,1]];case TITO:return[[216,1]];case DIAMOND:return[[230,1]];case GLASS:case ICE:return[];case CRYSTAL:return[[CRYSTAL,1]];
  }
  if(id===GRAVE)return[];
  if(BL[id].leaf){const r=Math.random();return r<0.05?[[207,1]]:r<0.15?[[201,1]]:[];}
  if(BL[id].cross)return[];
  return[[id,1]];
}
