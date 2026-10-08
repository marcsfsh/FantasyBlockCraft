// Editing
const edits=new Map(),editsByChunk=new Map();let saveDirty=false;
// World key: X and Z in 21 bits each, y in 9 bits (heights 0 to 511), so keys stay exact below 2^53
const KOFF=1048576,KY=512,wkey=(X,y,Z)=>((X+KOFF)*2097152+(Z+KOFF))*KY+y,ckey=(cx,cz)=>(cx+65536)*131072+(cz+65536);
function keyXYZ(k){const y=k%KY,r=(k-y)/KY,Z=r%2097152-KOFF,X=Math.floor(r/2097152)-KOFF;return[X,y,Z];}
function iToKey(i){const x=i%W,t=(i/W)|0;return wkey(x+OX,(t/D)|0,(t%D)+OZ);}
function keyToI(k){const c=keyXYZ(k),x=c[0]-OX,z=c[2]-OZ;if(x<0||z<0||x>=W||z>=D)return -1;return I(x,c[1],z);}
function storeEdit(k,v){edits.set(k,v);const c=keyXYZ(k),ck=ckey(Math.floor(c[0]/CS),Math.floor(c[2]/CS));let m=editsByChunk.get(ck);if(!m)editsByChunk.set(ck,m=new Map());m.set(k,v);}
function recordEdit(i,v){storeEdit(iToKey(i),v);saveDirty=true;}
function put(i,v){world[i]=v;recordEdit(i,v);}
const undoStack=[];let curAct=null;
function beginAct(){curAct=[];}
function endAct(){if(curAct&&curAct.length){undoStack.push(curAct);if(undoStack.length>80)undoStack.shift();}curAct=null;}
function undo(){
  if(creativeOnly())return;
  const a=undoStack.pop();if(!a){toast('Nothing to undo');return;}
  for(let k=a.length-2;k>=0;k-=2){const i=keyToI(a[k]);if(i<0)continue;const t=(i/W)|0;setBlock(i%W,(t/D)|0,t%D,a[k+1],true);}
  toast('Undid '+(a.length/2)+' block'+(a.length>2?'s':''));tone(500,700,0.12,0.15);
}
function nbLight(x,y,z){let m=0;for(const F of FACES){const X=x+F.d[0],Y=y+F.d[1],Z=z+F.d[2];if(X<0||Z<0||Y<0||X>=W||Z>=D||Y>=H)continue;const L=BLK[I(X,Y,Z)];if(L>m)m=L;}return m;}
// Water flows: sources (level 0) spread up to 7 blocks sideways and fall without limit
const lvl=new Uint8Array(VOL),flowQ=new Set();let flowT=0;
const WD=W*D,flowInto=id=>id===AIR||BL[id].cross||BL[id].torch;
function wakeWater(x,y,z){
  for(let k=-1;k<6;k++){const X=k<0?x:x+FACES[k].d[0],Y=k<0?y:y+FACES[k].d[1],Z=k<0?z:z+FACES[k].d[2];
    if(X<0||Z<0||Y<0||X>=W||Z>=D||Y>=H)continue;const j=I(X,Y,Z);if(world[j]===WATER)flowQ.add(j);}
}
function setLvl(i,L){lvl[i]=L;recordEdit(i,L?100+L:WATER);const x=i%W,t=(i/W)|0;dirty.add(((x/CS)|0)+(((t%D)/CS)|0)*NCX);wakeWater(x,(t/D)|0,t%D);}
function waterAt(x,y,z,L){setBlock(x,y,z,WATER,true);const i=I(x,y,z);if(world[i]===WATER&&L)setLvl(i,L);}
function flowStep(){
  let n=0;const q=[];for(const i of flowQ){q.push(i);if(++n>=600)break;}
  for(const i of q)flowQ.delete(i);
  for(const i of q){
    if(world[i]!==WATER)continue;
    const x=i%W,t=(i/W)|0,z=t%D,y=(t/D)|0;let L=lvl[i];
    const above=y+1<H&&world[i+WD]===WATER,below=y>0?world[i-WD]:BEDROCK;
    if(L>0){
      let best=99,src=0;
      for(let k=0;k<6;k++){if(FACES[k].d[1])continue;const X=x+FACES[k].d[0],Z=z+FACES[k].d[2];if(X<0||Z<0||X>=W||Z>=D)continue;const j=I(X,y,Z);if(world[j]===WATER){if(lvl[j]<best)best=lvl[j];if(lvl[j]===0)src++;}}
      if(src>=2&&(SOLID[below]||(below===WATER&&lvl[i-WD]===0))){setLvl(i,0);L=0;}
      else{const want=above?1:best+1;if(want>7){setBlock(x,y,z,AIR,true);continue;}if(want!==L){setLvl(i,want);L=want;}}
    }
    if(y>0&&flowInto(below)){waterAt(x,y-1,z,1);continue;}
    if(y>0&&below===WATER&&lvl[i-WD]>0)continue;
    if(L<7)for(let k=0;k<6;k++){
      if(FACES[k].d[1])continue;const X=x+FACES[k].d[0],Z=z+FACES[k].d[2];if(X<0||Z<0||X>=W||Z>=D)continue;
      const j=I(X,y,Z),id=world[j];
      if(flowInto(id))waterAt(X,y,Z,L+1);else if(id===WATER&&lvl[j]>L+1)setLvl(j,L+1);
    }
  }
}
function setBlock(x,y,z,v,force){
  if(x<0||z<0||y<0||x>=W||z>=D||y>=H)return;
  const i=I(x,y,z),old=world[i];
  if(old===v)return;
  if(curAct)curAct.push(iToKey(i),old);
  put(i,v);
  if(!SOLID[v]&&y+1<H&&(BL[world[I(x,y+1,z)]].cross||BL[world[I(x,y+1,z)]].torch)){const j=I(x,y+1,z);if(curAct)curAct.push(iToKey(j),world[j]);put(j,AIR);}
  if(OPQ[v]&&y>0){const j=i-WD,bb=world[j];if(bb===GRASS||bb===SNOWG){if(curAct)curAct.push(iToKey(j),bb);put(j,DIRT);}}
  calcHM(x,z);mmDirty.add(x+W*z);
  fallQ.add(i);if(y+1<H)fallQ.add(I(x,y+1,z));
  if(old===WAYPT)delWP(i);if(v===WAYPT)addWP(i);
  if(old===TORCH)torches.delete(i);if(v===TORCH)torches.add(i);if(isFarm(old))farms.delete(i);if(isFarm(v))farms.add(i);
  if(old===GRAVE&&v!==GRAVE){const k=iToKey(i),items=graves.get(k);if(items&&SURV()){for(const q of items)addItem(q[0],q[1]);graves.delete(k);toast('You got your things back');}}
  lvl[i]=0;wakeWater(x,y,z);
  for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){const X=x+dx,Z=z+dz;if(X<0||Z<0||X>=W||Z>=D)continue;dirty.add(((X/CS)|0)+((Z/CS)|0)*NCX);}
  if(LUM[old]||LUM[v]||(OPQ[old]!==OPQ[v]&&(BLK[i]>0||nbLight(x,y,z)>0))){
    if(!lbox)lbox=[x,x,y,y,z,z];else{lbox[0]=Math.min(lbox[0],x);lbox[1]=Math.max(lbox[1],x);lbox[2]=Math.min(lbox[2],y);lbox[3]=Math.max(lbox[3],y);lbox[4]=Math.min(lbox[4],z);lbox[5]=Math.max(lbox[5],z);}
  }
}
// Sand and gravel fall when nothing holds them up
const falling=[],fallQ=new Set(),fallGeo={};
function updFalling(dt){
  if(fallQ.size){const q=[...fallQ];fallQ.clear();
    for(const i of q){const id=world[i];if(!BL[id].fall)continue;const x=i%W,t=(i/W)|0,z=t%D,y=(t/D)|0;
      if(y===0||SOLID[world[I(x,y-1,z)]])continue;
      setBlock(x,y,z,AIR,true);
      const m=new THREE.Mesh(fallGeo[id]||(fallGeo[id]=handGeo(id)),matO);m.position.set(x+.5,y+.5,z+.5);scene.add(m);
      falling.push({x:x,y:y,z:z,vy:0,id:id,m:m});}}
  for(let k=falling.length-1;k>=0;k--){
    const f=falling[k];f.vy=Math.max(f.vy-28*dt,-40);const ny=f.y+f.vy*dt;
    if(ny<0){scene.remove(f.m);falling.splice(k,1);continue;}
    if(SOLID[get(f.x,Math.floor(ny),f.z)]){
      const ly=Math.floor(ny)+1,tg=get(f.x,ly,f.z);
      if(ly<H&&(tg===AIR||BL[tg].liquid||BL[tg].cross)){setBlock(f.x,ly,f.z,f.id,true);sfxBlock(f.id,true);}
      else breakFx(f.x,ly,f.z,f.id,8);
      scene.remove(f.m);falling.splice(k,1);continue;
    }
    f.y=ny;f.m.position.y=ny+.5;
  }
}
// Waypoint beams
const waypoints=new Map(),beamGeo=new THREE.BoxGeometry(0.36,1,0.36),BEAMC=['#5ff2ff','#ff6ad5','#9cff57','#ffd23f'];
function addWPk(k){
  if(waypoints.has(k))return;const c=keyXYZ(k),X=c[0],y=c[1],Z=c[2],col=BEAMC[(((X*7+Z*13)%4)+4)%4];
  const m=new THREE.Mesh(beamGeo,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.35,blending:THREE.AdditiveBlending,depthWrite:false}));
  const h=H+70-(y+1);m.scale.y=h;m.position.set(X-OX+.5,y+1+h/2,Z-OZ+.5);m.userData={y:y,c:col,k:k};scene.add(m);waypoints.set(k,m);
}
function addWP(i){addWPk(iToKey(i));}
function delWP(i){const k=iToKey(i),m=waypoints.get(k);if(m){scene.remove(m);m.material.dispose();waypoints.delete(k);}}
function flush(){
  if(lbox){relight(lbox);lbox=null;}
  if(dirty.size){
    const arr=[...dirty],pcx=PL.x/CS-.5,pcz=PL.z/CS-.5,dd=c=>{const a=c%NCX-pcx,b=((c/NCX)|0)-pcz;return a*a+b*b;};
    arr.sort((a,b)=>dd(a)-dd(b));const t0=performance.now();
    for(const ci of arr){
      // wait until this chunk and every loaded neighbour hold real terrain, so each chunk is meshed once instead of once per neighbour
      const cx=ci%NCX,cz=(ci/NCX)|0;let ready2=genDone[ci];
      for(let a=-1;a<=1&&ready2;a++)for(let b=-1;b<=1;b++){const nx=cx+a,nz=cz+b;if(nx>=0&&nz>=0&&nx<NCX&&nz<NCZ&&!genDone[nx+nz*NCX]){ready2=0;break;}}
      if(!ready2)continue;
      buildChunk(cx,cz);dirty.delete(ci);if(performance.now()-t0>7)break;
    }
  }
  if(mmDirty.size){mmDirty.forEach(c=>mmCol(c%W,(c/W)|0));mmDirty.clear();mmCtx.putImageData(mmImg,0,0);}
}
function raycast(o,d,max){
  let x=Math.floor(o.x),y=Math.floor(o.y),z=Math.floor(o.z);
  const sx=Math.sign(d.x),sy=Math.sign(d.y),sz=Math.sign(d.z);
  const tdx=sx?Math.abs(1/d.x):Infinity,tdy=sy?Math.abs(1/d.y):Infinity,tdz=sz?Math.abs(1/d.z):Infinity;
  let tmx=sx>0?(x+1-o.x)*tdx:sx<0?(o.x-x)*tdx:Infinity;
  let tmy=sy>0?(y+1-o.y)*tdy:sy<0?(o.y-y)*tdy:Infinity;
  let tmz=sz>0?(z+1-o.z)*tdz:sz<0?(o.z-z)*tdz:Infinity;
  let px=x,py=y,pz=z,t=0;
  while(t<=max){
    const id=get(x,y,z);
    if(id&&!BL[id].liquid)return{x:x,y:y,z:z,px:px,py:py,pz:pz,id:id};
    px=x;py=y;pz=z;
    if(tmx<tmy&&tmx<tmz){x+=sx;t=tmx;tmx+=tdx;}else if(tmy<tmz){y+=sy;t=tmy;tmy+=tdy;}else{z+=sz;t=tmz;tmz+=tdz;}
  }
  return null;
}

