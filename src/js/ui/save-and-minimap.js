// Saving
let skipSave=false,saveWarned=false;
function saveNow(){
  if(!ready||skipSave)return;
  const e=[];edits.forEach((v,k)=>{e.push(k,v);});
  const ok=lsSet(SAVE_KEY,{v:2,seed:SEED,e:e,spawn:spawnW,p:[+(PL.x+OX).toFixed(2),+PL.y.toFixed(2),+(PL.z+OZ).toFixed(2),+PL.yaw.toFixed(3),+PL.pitch.toFixed(3),PL.fly?1:0],hot:hot,mode:mode,sl:[...sluiceStore].map(([k,v])=>[k,v.g,v.p]),bat:[...batCharge].map(([k,v])=>[k,Math.round(v)]),fuel:[...genFuel],inv:inv.map(q=>q?[q.id,q.c,q.d||0,Math.round(q.e||0)]:0),hp:hp,food:food,gv:[...graves],t:+tod.toFixed(4)});
  if(!ok&&!saveWarned){saveWarned=true;toast('Storage is full, recent changes are not saved');}
  saveDirty=false;
}
setInterval(()=>{if(saveDirty||playing)saveNow();},5000);
addEventListener('pagehide',saveNow);
document.addEventListener('visibilitychange',()=>{if(document.hidden)saveNow();});

// Minimap
const mmBase=document.createElement('canvas');mmBase.width=W;mmBase.height=D;
const mmCtx=mmBase.getContext('2d'),mmImg=mmCtx.createImageData(W,D),mmDirty=new Set();
const mmC=$('mm'),mmG=mmC.getContext('2d');let mmZoom=0;const mmView={ox:0,oz:0,span:64};
const tiles=new Map();
function captureTile(lcx,lcz){
  const ck=ckey(OX/CS+lcx,OZ/CS+lcz);let c=tiles.get(ck);
  if(!c){c=document.createElement('canvas');c.width=c.height=CS;tiles.set(ck,c);}
  c.getContext('2d').putImageData(mmImg,-lcx*CS,-lcz*CS,lcx*CS,lcz*CS,CS,CS);
}
mmC.addEventListener('pointerdown',e=>{
  e.stopPropagation();
  if(mmZoom&&waypoints.size){const r=mmC.getBoundingClientRect(),mx=mmView.ox+(e.clientX-r.left)/r.width*mmView.span,mz=mmView.oz+(e.clientY-r.top)/r.height*mmView.span;
    let best=null,bd=mmView.span/22;waypoints.forEach(m=>{const d=Math.hypot(m.position.x-mx,m.position.z-mz);if(d<bd){bd=d;best=m;}});
    if(best){travelTo(best);return;}}
  mmZoom=(mmZoom+1)%3;
});
let wpIdx=-1;
function travelTo(m){
  for(let k=0;k<20;k++)spawnP(PL.x,PL.y+1,PL.z,(Math.random()-.5)*4,Math.random()*4,(Math.random()-.5)*4,[.6,.95,1],0.6,2);
  if(m.position.x<40||m.position.z<40||m.position.x>W-40||m.position.z>D-40){toast('Loading the area');const c=keyXYZ(m.userData.k);regenerateAll(c[0],c[2]);}
  PL.x=m.position.x;PL.z=m.position.z;PL.y=m.userData.y+1;PL.vx=PL.vy=PL.vz=0;while(collide()&&PL.y<H)PL.y++;
  G.on=false;gliding=false;tone(400,1600,0.35,0.15);tone(800,2400,0.3,0.08,0.08);toast('Traveled to waypoint');
  for(let k=0;k<30;k++)spawnP(PL.x,PL.y+1,PL.z,(Math.random()-.5)*5,Math.random()*5,(Math.random()-.5)*5,[.6,.95,1],0.8,2);
}
function nextWaypoint(){const L=[...waypoints.values()];if(!L.length){toast('Place a waypoint block to travel to it');return;}wpIdx=(wpIdx+1)%L.length;travelTo(L[wpIdx]);}
function mmCol(x,z){
  let y=H-1;while(y>0&&world[I(x,y,z)]===AIR)y--;
  const id=world[I(x,y,z)];let r,g,b;
  if(id===WATER){let d=y;while(d>0&&world[I(x,d,z)]===WATER)d--;const s=Math.max(0.45,1-(y-d)*0.045);r=0.2*s;g=0.38*s;b=0.82*s;}
  else{const c=TAVG[BL[id].t[0]],s=Math.max(0.5,Math.min(1.4,0.78+(y-SEA)/60));r=c[0]*s;g=c[1]*s;b=c[2]*s;}
  const i=(z*W+x)*4;mmImg.data[i]=cl(r*255);mmImg.data[i+1]=cl(g*255);mmImg.data[i+2]=cl(b*255);mmImg.data[i+3]=255;
}
function mmAll(){for(let z=0;z<D;z++)for(let x=0;x<W;x++)mmCol(x,z);mmCtx.putImageData(mmImg,0,0);}
function drawMM(){
  const S=mmC.width,span=mmZoom===2?512:mmZoom?W:64,ox=mmZoom===1?0:PL.x-span/2,oz=mmZoom===1?0:PL.z-span/2,k=S/span;
  mmView.ox=ox;mmView.oz=oz;mmView.span=span;
  mmG.imageSmoothingEnabled=false;mmG.fillStyle='#1c1810';mmG.fillRect(0,0,S,S);
  if(mmZoom===2){const c0=Math.floor((ox+OX)/CS),c1=Math.floor((ox+OX+span)/CS),r0=Math.floor((oz+OZ)/CS),r1=Math.floor((oz+OZ+span)/CS);
    for(let cz=r0;cz<=r1;cz++)for(let cx=c0;cx<=c1;cx++){const t=tiles.get(ckey(cx,cz));if(t)mmG.drawImage(t,(cx*CS-OX-ox)*k,(cz*CS-OZ-oz)*k,CS*k+0.6,CS*k+0.6);}}
  mmG.drawImage(mmBase,-ox*k,-oz*k,W*k,D*k);
  {const r0x=Math.floor((ox+OX)/TR),r1x=Math.floor((ox+OX+span)/TR),r0z=Math.floor((oz+OZ)/TR),r1z=Math.floor((oz+OZ+span)/TR);
   for(let rz=r0z;rz<=r1z;rz++)for(let rx=r0x;rx<=r1x;rx++){const v=townPlan(rx,rz);if(!v)continue;const vx=(v.cx-OX-ox)*k,vz=(v.cz-OZ-oz)*k;if(vx<-6||vz<-6||vx>S+6||vz>S+6)continue;
     mmG.fillStyle='#f3efe2';mmG.strokeStyle='#000';mmG.lineWidth=1.5;mmG.beginPath();mmG.moveTo(vx,vz-7);mmG.lineTo(vx+6,vz-1);mmG.lineTo(vx+4,vz-1);mmG.lineTo(vx+4,vz+5);mmG.lineTo(vx-4,vz+5);mmG.lineTo(vx-4,vz-1);mmG.lineTo(vx-6,vz-1);mmG.closePath();mmG.fill();mmG.stroke();}}
  if(mmZoom){const c0=Math.floor((ox+OX)/CS),c1=Math.floor((ox+OX+span)/CS),r0=Math.floor((oz+OZ)/CS),r1=Math.floor((oz+OZ+span)/CS);
    for(let cz2=r0;cz2<=r1;cz2++)for(let cx2=c0;cx2<=c1;cx2++)if(gateAt(cx2,cz2)){const gx=(cx2*CS+8-OX-ox)*k,gz=(cz2*CS+8-OZ-oz)*k;mmG.fillStyle='#ffaa46';mmG.strokeStyle='#000';mmG.lineWidth=1.5;mmG.fillRect(gx-5,gz-5,10,3);mmG.fillRect(gx-5,gz-5,3,10);mmG.fillRect(gx+2,gz-5,3,10);mmG.strokeRect(gx-5,gz-5,10,10);}}
  mmG.fillStyle='#ff4030';for(const p of primed)mmG.fillRect((p.x-ox)*k-2,(p.z-oz)*k-2,5,5);
  if(G.on){mmG.fillStyle='#fff6c8';mmG.fillRect((G.ax-ox)*k-2,(G.az-oz)*k-2,5,5);}
  waypoints.forEach(m=>{let wx=(m.position.x-ox)*k,wz=(m.position.z-oz)*k;wx=Math.max(5,Math.min(S-5,wx));wz=Math.max(5,Math.min(S-5,wz));
    mmG.fillStyle=m.userData.c;mmG.strokeStyle='#000';mmG.lineWidth=1.5;mmG.beginPath();mmG.moveTo(wx,wz-5);mmG.lineTo(wx+5,wz);mmG.lineTo(wx,wz+5);mmG.lineTo(wx-5,wz);mmG.closePath();mmG.fill();mmG.stroke();});
  mmG.save();mmG.translate((PL.x-ox)*k,(PL.z-oz)*k);mmG.rotate(-PL.yaw);
  mmG.fillStyle='#fff';mmG.strokeStyle='#000';mmG.lineWidth=2;mmG.beginPath();mmG.moveTo(0,-9);mmG.lineTo(6,7);mmG.lineTo(0,3);mmG.lineTo(-6,7);mmG.closePath();mmG.stroke();mmG.fill();mmG.restore();
  mmG.fillStyle='#f3efe2';mmG.font='18px VT323, monospace';mmG.fillText('N',S/2-4,16);
}

