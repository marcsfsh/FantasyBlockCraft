// Saving
let skipSave=false,saveWarned=false;
function saveNow(){
  if(!ready||skipSave)return;
  const e=[];edits.forEach((v,k)=>{e.push(k,v);});
  WORLD.mode=mode;WORLD.played=Date.now();lsSet(SAVE_KEY,WIX);
  const ok=lsSet(worldKey(WORLD.id),{v:8,seed:SEED,e:e,spawn:spawnW,p:[+(PL.x+OX).toFixed(2),+PL.y.toFixed(2),+(PL.z+OZ).toFixed(2),+PL.yaw.toFixed(3),+PL.pitch.toFixed(3),PL.fly?1:0,PL.noclip?1:0],hot:hot,mode:mode,inv:inv.map(q=>q?[q.id,q.c,q.d||0]:0),eq:Object.fromEntries(Object.keys(EQUIP_SLOTS).map(s=>[s,equip[s]?[equip[s].id,equip[s].d||0]:0])),hp:hp,food:food,gv:[...graves],cs:boxSave(),at:[...attuned],t:+tod.toFixed(4),dn:dayN});
  if(!ok&&!saveWarned){saveWarned=true;toast('Storage is full, recent changes are not saved');}
  saveDirty=false;
}
// Autosave: within 5 s of a change, and every 30 s while playing (position and time of day) (M3: no constant rewrites)
let lastSaveT=0;setInterval(()=>{const now=Date.now();if(saveDirty||(playing&&now-lastSaveT>30000)){saveNow();lastSaveT=now;}},5000);
// ---- Worlds: create, switch, delete, export and import (one storage entry per world, see core/config.js)
// A seed typed as a whole number is used exactly; any other text is hashed to a seed
function parseSeed(sv){sv=String(sv||'').trim();if(!sv)return 0;if(/^\d+$/.test(sv)){const n=Number(sv);return n>=1&&n<=2147483646?n:n%2147483646+1;}let h=0;for(const ch of sv)h=(Math.imul(31,h)+ch.charCodeAt(0))|0;return Math.abs(h)%2147483646+1;}
function uniqueWorldName(name){const used=new Set(WIX.list.map(w=>w.name));let n=name,k=2;while(used.has(n))n=name+' '+(k++);return n;}
function createWorld(name,seed,mode){const w=newWorldEntry(uniqueWorldName(name||'World '+(WIX.list.length+1)),seed,mode);WIX.list.push(w);lsSet(SAVE_KEY,WIX);return w;}
function switchWorld(id){if(!WIX.list.some(w=>w.id===id))return;saveNow();WIX.active=id;lsSet(SAVE_KEY,WIX);skipSave=true;location.reload();}
function deleteWorld(id){if(id===WIX.active)return false;const i=WIX.list.findIndex(w=>w.id===id);if(i<0)return false;WIX.list.splice(i,1);lsDel(worldKey(id));lsSet(SAVE_KEY,WIX);return true;}
const WORLD_FILE='fantasy-blockcraft-world';
function exportWorld(id){if(id===WIX.active)saveNow();const w=WIX.list.find(x=>x.id===id);if(!w)return null;return JSON.stringify({format:WORLD_FILE,saveKey:SAVE_KEY,world:{name:w.name,seed:w.seed,mode:w.mode},data:lsGet(worldKey(id))});}
// Returns the new world entry, or throws with a message the player can read
function importWorld(text){
  let o;try{o=JSON.parse(text);}catch(e){throw new Error('That file is not a saved world');}
  if(!o||o.format!==WORLD_FILE||!o.world)throw new Error('That file is not a saved world');
  if(o.saveKey!==SAVE_KEY)throw new Error('That world is from another version of the game and cannot be loaded');
  const w=createWorld(o.world.name||'Imported world',o.world.seed,o.world.mode);
  if(o.data&&!lsSet(worldKey(w.id),Object.assign({},o.data,{seed:w.seed}))){deleteWorld(w.id);throw new Error('Storage is full');}
  return w;
}
function downloadText(name,text){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'application/json'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000);}
addEventListener('pagehide',saveNow);
document.addEventListener('visibilitychange',()=>{if(document.hidden)saveNow();});

// Minimap
const mmBase=document.createElement('canvas');mmBase.width=W;mmBase.height=D;
const mmCtx=mmBase.getContext('2d'),mmImg=mmCtx.createImageData(W,D),mmDirty=new Set();
const mmC=$('mm'),mmG=mmC.getContext('2d');let mmZoom=0;const mmView={ox:0,oz:0,span:64};
const tiles=new Map();
// The explored map keeps at most TILE_CAP chunk tiles (about 16 km² of explored ground); the longest unvisited go first (M3)
const TILE_CAP=6000;
function captureTile(lcx,lcz){
  const ck=ckey(OX/CS+lcx,OZ/CS+lcz);let c=tiles.get(ck);
  if(c)tiles.delete(ck);else{c=document.createElement('canvas');c.width=c.height=CS;if(tiles.size>=TILE_CAP)tiles.delete(tiles.keys().next().value);}
  tiles.set(ck,c);
  c.getContext('2d').putImageData(mmImg,-lcx*CS,-lcz*CS,lcx*CS,lcz*CS,CS,CS);
}
mmC.addEventListener('pointerdown',e=>{
  e.stopPropagation();
  if(mmZoom&&waypoints.size){const r=mmC.getBoundingClientRect(),mx=mmView.ox+(e.clientX-r.left)/r.width*mmView.span,mz=mmView.oz+(e.clientY-r.top)/r.height*mmView.span;
    let best=null,bd=mmView.span/22;waypoints.forEach(m=>{const d=Math.hypot(m.position.x-mx,m.position.z-mz);if(d<bd){bd=d;best=m;}});
    if(best){if(canTravel())travelTo(best);return;}}
  mmZoom=(mmZoom+1)%3;
});
let wpIdx=-1,mmShown=true;
function travelTo(m){
  for(let k=0;k<20;k++)spawnP(PL.x,PL.y+1,PL.z,(Math.random()-.5)*4,Math.random()*4,(Math.random()-.5)*4,[.6,.95,1],0.6,2);
  const c=keyXYZ(m.userData.k);let x=c[0]-OX,z=c[2]-OZ;
  if(x<40||z<40||x>W-40||z>D-40){toast('Loading the area');regenerateAll(c[0],c[2]);x=c[0]-OX;z=c[2]-OZ;}
  PL.x=x+0.5;PL.z=z+0.5;PL.y=c[1]+1;PL.vx=PL.vy=PL.vz=0;while(collide()&&PL.y<H)PL.y++;
  gliding=false;tone(400,1600,0.35,0.15);tone(800,2400,0.3,0.08,0.08);toast('You travel to '+wpName(m.userData.k));
  for(let k=0;k<30;k++)spawnP(PL.x,PL.y+1,PL.z,(Math.random()-.5)*5,Math.random()*5,(Math.random()-.5)*5,[.6,.95,1],0.8,2);
}
// ---- Earned travel (M4b, Q15, Q71). Touch an Ancient Waystone to attune it; a Carved Waystone you build is yours at once. In
// survival you travel only from a waystone (standing within 4 blocks of one) to another; creative travels freely, as before.
// Attuned stones are saved with the world (save data `at`) and show a beam like a carved one.
const attuned=new Map(); // world key of the stone's top block -> the name of the place
function wpName(k){if(attuned.has(k))return attuned.get(k);const c=keyXYZ(k);return 'Carved waystone at '+c[0]+', '+c[2];}
const wpDist=m=>{const c=keyXYZ(m.userData.k);return Math.hypot(c[0]-OX+0.5-PL.x,c[2]-OZ+0.5-PL.z);};
function wpHere(){let best=null,bd=1e9;waypoints.forEach(m=>{const c=keyXYZ(m.userData.k),dx=c[0]-OX+0.5-PL.x,dz=c[2]-OZ+0.5-PL.z,dy=c[1]-PL.y;if(Math.abs(dy)>6)return;const d=Math.hypot(dx,dz);if(d<4.5&&d<bd){bd=d;best=m;}});return best;}
function canTravel(){if(!SURV())return true;if(wpHere())return true;toast('Stand by an attuned waystone to travel');return false;}
function stonePlace(X,Y,Z){const s=siteNear(X,Z,1);if(s)return s.name;if(gateNear(X,Z,0))return 'The Gate of '+holdOf(Math.floor(X/CS),Math.floor(Z/CS)).name;return 'A lone waystone at '+X+', '+Z;}
// Using a waystone: attune an ancient one the first time, else open the list of places to travel to
function useWaystone(x,y,z){
  let t=y;if(get(x,t,z)===WAYSTONE){while(get(x,t+1,z)===WAYSTONE)t++;if(get(x,t+1,z)===CALCITE)t++;}
  const k=wkey(x+OX,t,z+OZ);
  if(get(x,y,z)===WAYSTONE&&!attuned.has(k)){
    attuned.set(k,stonePlace(x+OX,t,z+OZ));addWPk(k);saveDirty=true;
    for(let n=0;n<30;n++)spawnP(x+.5,t+1,z+.5,(Math.random()-.5)*3,Math.random()*5,(Math.random()-.5)*3,[.5,.85,1],1,1);
    tone(500,1400,0.5,0.12);tone(750,2100,0.4,0.06,0.1);toast('Attuned: '+attuned.get(k));return;}
  openTravel(k);
}
function openTravel(here){
  invOpen=true;hold=-1;['invgrid','invname','sinv','bplist'].forEach(id=>{$(id).style.display='none';});
  const el=$('lore');el.innerHTML='';el.style.display='block';$('invtitle').textContent=wpName(here);
  const L=[...waypoints.values()].filter(m=>m.userData.k!==here).map(m=>[m,wpDist(m)]).sort((a,b)=>a[1]-b[1]);
  if(!L.length)el.textContent='No other waystone is attuned yet. Touch another Ancient Waystone, or build a Carved Waystone, to travel between them.';
  for(const [m,d] of L){const b=document.createElement('button');b.className='wide';b.textContent=wpName(m.userData.k)+' ('+Math.round(d)+' blocks)';
    b.addEventListener('click',()=>{closeInv();travelTo(m);});el.appendChild(b);el.appendChild(document.createElement('br'));}
  $('inv').style.display='grid';if(document.pointerLockElement)document.exitPointerLock();if(TOUCH)playing=false;
}
function nextWaypoint(){
  if(!canTravel())return;const here=SURV()?wpHere():null,L=[...waypoints.values()].filter(m=>m!==here);
  if(!L.length){toast(SURV()?'No other waystone is attuned yet':'Place a waystone to travel to it');return;}wpIdx=(wpIdx+1)%L.length;travelTo(L[wpIdx]);}
function mmCol(x,z){
  let y=H-1;while(y>0&&world[I(x,y,z)]===AIR)y--;
  const id=world[I(x,y,z)];let r,g,b;
  if(id===WATER){let d=y;while(d>0&&world[I(x,d,z)]===WATER)d--;const s=Math.max(0.45,1-(y-d)*0.045);r=0.2*s;g=0.38*s;b=0.82*s;}
  else{const c=TAVG[BL[id].t[0]],s=Math.max(0.5,Math.min(1.4,0.78+(y-SEA)/60));r=c[0]*s;g=c[1]*s;b=c[2]*s;}
  const i=(z*W+x)*4;mmImg.data[i]=cl(r*255);mmImg.data[i+1]=cl(g*255);mmImg.data[i+2]=cl(b*255);mmImg.data[i+3]=255;
}
function mmAll(){for(let z=0;z<D;z++)for(let x=0;x<W;x++)mmCol(x,z);mmCtx.putImageData(mmImg,0,0);}
function drawMM(){
  const show=carries(325);if(show!==mmShown){mmShown=show;mmC.style.display=show?'':'none';}if(!show)return;
  if(mmPut){mmCtx.putImageData(mmImg,0,0);mmPut=false;} // streamed columns since the last draw
  const S=mmC.width,span=mmZoom===2?512:mmZoom?W:64,ox=mmZoom===1?0:PL.x-span/2,oz=mmZoom===1?0:PL.z-span/2,k=S/span;
  mmView.ox=ox;mmView.oz=oz;mmView.span=span;
  mmG.imageSmoothingEnabled=false;mmG.fillStyle='#1c1810';mmG.fillRect(0,0,S,S);
  if(mmZoom===2){const c0=Math.floor((ox+OX)/CS),c1=Math.floor((ox+OX+span)/CS),r0=Math.floor((oz+OZ)/CS),r1=Math.floor((oz+OZ+span)/CS);
    for(let cz=r0;cz<=r1;cz++)for(let cx=c0;cx<=c1;cx++){const t=tiles.get(ckey(cx,cz));if(t)mmG.drawImage(t,(cx*CS-OX-ox)*k,(cz*CS-OZ-oz)*k,CS*k+0.6,CS*k+0.6);}}
  mmG.drawImage(mmBase,-ox*k,-oz*k,W*k,D*k);
  mmG.fillStyle='#ff4030';for(const p of primed)mmG.fillRect((p.x-ox)*k-2,(p.z-oz)*k-2,5,5);
  waypoints.forEach(m=>{let wx=(m.position.x-ox)*k,wz=(m.position.z-oz)*k;wx=Math.max(5,Math.min(S-5,wx));wz=Math.max(5,Math.min(S-5,wz));
    mmG.fillStyle=m.userData.c;mmG.strokeStyle='#000';mmG.lineWidth=1.5;mmG.beginPath();mmG.moveTo(wx,wz-5);mmG.lineTo(wx+5,wz);mmG.lineTo(wx,wz+5);mmG.lineTo(wx-5,wz);mmG.closePath();mmG.fill();mmG.stroke();});
  const cmp=carries(323);mmG.save();mmG.translate((PL.x-ox)*k,(PL.z-oz)*k);if(!cmp){mmG.fillStyle='#fff';mmG.strokeStyle='#000';mmG.lineWidth=2;mmG.beginPath();mmG.arc(0,0,4,0,6.3);mmG.stroke();mmG.fill();mmG.restore();return;}mmG.rotate(-PL.yaw);
  mmG.fillStyle='#fff';mmG.strokeStyle='#000';mmG.lineWidth=2;mmG.beginPath();mmG.moveTo(0,-9);mmG.lineTo(6,7);mmG.lineTo(0,3);mmG.lineTo(-6,7);mmG.closePath();mmG.stroke();mmG.fill();mmG.restore();
  mmG.fillStyle='#f3efe2';mmG.font='18px VT323, monospace';mmG.fillText('N',S/2-4,16);
}

