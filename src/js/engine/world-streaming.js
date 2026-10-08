// Generation
const tick=()=>new Promise(r=>setTimeout(r,0));
function progress(f,msg){$('loadfill').style.width=(f*100).toFixed(1)+'%';if(msg)$('status').textContent=msg;}
function respawn(){
  let x=spawnW[0]-OX,z=spawnW[2]-OZ;
  if(x<40||z<40||x>W-40||z>D-40){regenerateAll(spawnW[0],spawnW[2]);x=spawnW[0]-OX;z=spawnW[2]-OZ;}
  PL.x=x;PL.y=spawnW[1];PL.z=z;PL.vx=PL.vy=PL.vz=0;while(collide()&&PL.y<H)PL.y++;
}
// Rebuild the whole loaded area around a world position
function regenerateAll(X,Z){
  const nOX=Math.floor(X/CS)*CS-W/2,nOZ=Math.floor(Z/CS)*CS-D/2,ddx=nOX-OX,ddz=nOZ-OZ;
  OX=nOX;OZ=nOZ;
  torches.clear();farms.clear();flowQ.clear();fallQ.clear();lbox=null;mmDirty.clear();genQ.length=0;
  for(const p of primed)scene.remove(p.m);primed.length=0;for(const f of falling)scene.remove(f.m);falling.length=0;rockets.length=0;parts.length=0;G.on=false;
  BLK.fill(0);world.fill(0);genDone.fill(0);
  const cm=NCX>>1;
  for(let cz=0;cz<NCZ;cz++)for(let cx=0;cx<NCX;cx++){if(Math.abs(cx-cm)<=3&&Math.abs(cz-cm)<=3)genChunk(cx,cz);else genQ.push([cx,cz]);}
  genQ.sort((a,b)=>Math.hypot(a[0]-cm,a[1]-cm)-Math.hypot(b[0]-cm,b[1]-cm));
  lightAll();mmAll();for(let cz=0;cz<NCZ;cz++)for(let cx=0;cx<NCX;cx++)captureTile(cx,cz);
  waypoints.forEach(m=>{m.position.x-=ddx;m.position.z-=ddz;});
  for(let c=0;c<chunks.length;c++){if(chunks[c])for(const m of chunks[c]){scene.remove(m);m.geometry.dispose();}chunks[c]=undefined;const x=c%NCX,z=(c/NCX)|0;if(Math.abs(x-cm)<=3&&Math.abs(z-cm)<=3)dirty.add(c);}
}
// Slide the loaded area by one chunk and generate the new strip
function shiftIdx(S,dx,dz){const out=[];S.forEach(i=>{const x=i%W-dx,t=(i/W)|0,z=t%D-dz;if(x>=0&&z>=0&&x<W&&z<D)out.push(I(x,(t/D)|0,z));});S.clear();out.forEach(v=>S.add(v));}
function shiftArr(a,delta){if(delta>0)a.copyWithin(0,delta);else a.copyWithin(-delta,0);}
const genQ=[],genDone=new Uint8Array(NCX*NCZ);
function processGenQ(){
  const t0=performance.now();
  while(genQ.length&&performance.now()-t0<5){
    const [cx,cz]=genQ.shift(),x0=cx*CS,z0=cz*CS;
    genChunk(cx,cz);
    lightChunk(x0,z0);
    for(let z=z0;z<z0+CS;z++)for(let x=x0;x<x0+CS;x++)mmCol(x,z);
    mmCtx.putImageData(mmImg,0,0);captureTile(cx,cz);
    for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const nx=cx+a,nz=cz+b;if(nx>=0&&nz>=0&&nx<NCX&&nz<NCZ)dirty.add(nx+nz*NCX);}
  }
}
function shiftWindow(dx,dz){
  { // remember chunks that are about to unload for the explored map
    const cdx=dx/CS,cdz=dz/CS;
    for(let cz=0;cz<NCZ;cz++)for(let cx=0;cx<NCX;cx++){const nx=cx-cdx,nz=cz-cdz;if((nx<0||nz<0||nx>=NCX||nz>=NCZ)&&!genQ.some(q=>q[0]===cx&&q[1]===cz))captureTile(cx,cz);}
  }
  const d3=dx+W*dz;
  shiftArr(world,d3);shiftArr(BLK,d3);shiftArr(lvl,d3);
  for(const a of [hm,hb,hg,ground,biome,entCol])shiftArr(a,d3);
  shiftArr(mmImg.data,d3*4);
  OX+=dx;OZ+=dz;
  const cdx=dx/CS,cdz=dz/CS,old=chunks.slice();
  for(let c=0;c<chunks.length;c++)chunks[c]=undefined;
  for(let ocz=0;ocz<NCZ;ocz++)for(let ocx=0;ocx<NCX;ocx++){
    const ms=old[ocx+ocz*NCX];if(!ms)continue;const ncx=ocx-cdx,ncz=ocz-cdz;
    if(ncx<0||ncz<0||ncx>=NCX||ncz>=NCZ){for(const m of ms){scene.remove(m);m.geometry.dispose();}continue;}
    for(const m of ms){m.position.x-=dx;m.position.z-=dz;m.updateMatrix();}chunks[ncx+ncz*NCX]=ms;
  }
  {const g2=new Uint8Array(NCX*NCZ);for(let z=0;z<NCZ;z++)for(let x=0;x<NCX;x++){const ox=x+cdx,oz=z+cdz;if(ox>=0&&oz>=0&&ox<NCX&&oz<NCZ)g2[x+z*NCX]=genDone[ox+oz*NCX];}genDone.set(g2);}
  const nd=[];dirty.forEach(c=>{const x=c%NCX-cdx,z=((c/NCX)|0)-cdz;if(x>=0&&z>=0&&x<NCX&&z<NCZ)nd.push(x+z*NCX);});dirty.clear();nd.forEach(c=>dirty.add(c));
  shiftIdx(torches,dx,dz);shiftIdx(farms,dx,dz);shiftIdx(flowQ,dx,dz);shiftIdx(fallQ,dx,dz);mmDirty.clear();
  if(lbox){lbox[0]-=dx;lbox[1]-=dx;lbox[4]-=dz;lbox[5]-=dz;}
  // queue the new strip; it is generated a chunk or two per frame
  const keep=genQ.filter(c=>(c[0]-=cdx,c[1]-=cdz,c[0]>=0&&c[1]>=0&&c[0]<NCX&&c[1]<NCZ));genQ.length=0;keep.forEach(c=>genQ.push(c));
  if(cdx>0)for(let c=NCX-cdx;c<NCX;c++)for(let z=0;z<NCZ;z++)genQ.push([c,z]);
  if(cdx<0)for(let c=0;c<-cdx;c++)for(let z=0;z<NCZ;z++)genQ.push([c,z]);
  if(cdz>0)for(let c=NCZ-cdz;c<NCZ;c++)for(let x=0;x<NCX;x++)genQ.push([x,c]);
  if(cdz<0)for(let c=0;c<-cdz;c++)for(let x=0;x<NCX;x++)genQ.push([x,c]);
  // move everything that lives in local coordinates
  PL.x-=dx;PL.z-=dz;G.ax-=dx;G.az-=dz;G.bx-=dx;G.bz-=dz;
  for(const p of primed){p.x-=dx;p.z-=dz;}
  for(const f of falling){f.x-=dx;f.z-=dz;f.m.position.x-=dx;f.m.position.z-=dz;}
  for(const r of rockets){r.x-=dx;r.z-=dz;}
  for(const q of parts){q.x-=dx;q.z-=dz;}
  for(const q of drops){q.x-=dx;q.z-=dz;}
  for(const f of flashes){f.m.position.x-=dx;f.m.position.z-=dz;}
  waypoints.forEach(m=>{m.position.x-=dx;m.position.z-=dz;});
}
function findSpawn(){
  for(let r=0;r<90;r++)for(let a=0;a<24;a++){
    const x=Math.floor(W/2+Math.cos(a/24*6.2832)*r),z=Math.floor(D/2+Math.sin(a/24*6.2832)*r);
    if(x<1||z<1||x>=W-1||z>=D-1)continue;
    const g=ground[x+W*z];
    if(g>SEA&&biome[x+W*z]!==0&&biome[x+W*z]!==9&&SOLID[get(x,g,z)]&&!SOLID[get(x,g+1,z)]&&!SOLID[get(x,g+2,z)])return[x+0.5,g+1,z+0.5];
  }
  return[W/2+0.5,H-4,D/2+0.5];
}
async function generate(){
  const resumed=!!saved&&Array.isArray(saved.e);
  $('seedline').textContent=WORLD.name+(resumed?', seed ':', a new endless world, seed ')+SEED+'.';
  if(resumed){
    const e=saved.e;for(let k=0;k+1<e.length;k+=2){storeEdit(e[k],e[k+1]);if(e[k+1]===WAYPT)addWPk(e[k]);}
    if(typeof saved.t==='number')tod=saved.t;
    if(Array.isArray(saved.spawn))spawnW=saved.spawn;
    if(Array.isArray(saved.p)){OX=Math.floor(saved.p[0]/CS)*CS-W/2;OZ=Math.floor(saved.p[2]/CS)*CS-D/2;waypoints.forEach(m=>{const c=keyXYZ(m.userData.k);m.position.x=c[0]-OX+.5;m.position.z=c[2]-OZ+.5;});}
  }
  let n=0;
  const cm=NCX>>1,RIN=2,near=(cx,cz)=>Math.abs(cx-cm)<=RIN&&Math.abs(cz-cm)<=RIN,inner=(2*RIN+1)*(2*RIN+1);genQ.length=0;
  for(let cz=0;cz<NCZ;cz++)for(let cx=0;cx<NCX;cx++){if(!near(cx,cz)){genQ.push([cx,cz]);continue;}genChunk(cx,cz);if(++n%4===0){progress(n/inner*0.55,'Shaping terrain, caves and ruins');await tick();}}
  genQ.sort((a,b)=>Math.hypot(a[0]-cm,a[1]-cm)-Math.hypot(b[0]-cm,b[1]-cm));
  progress(0.58,'Spreading light from lava');await tick();
  lightAll();mmAll();for(let cz=0;cz<NCZ;cz++)for(let cx=0;cx<NCX;cx++)captureTile(cx,cz);
  n=0;
  for(let cz=0;cz<NCZ;cz++)for(let cx=0;cx<NCX;cx++){if(!near(cx,cz))continue;buildChunk(cx,cz);n++;if(n%4===0){progress(0.6+0.4*n/inner,'Building chunks');await tick();}}
  if(!(resumed&&Array.isArray(saved.spawn))){const sp=findSpawn();spawnW=[sp[0]+OX,sp[1],sp[2]+OZ];}
  respawn();
  PL.yaw=Math.atan2(PL.x-W/2,PL.z-D/2);
  if(resumed&&Array.isArray(saved.p)&&saved.p.length>=5){PL.x=saved.p[0]-OX;PL.y=saved.p[1];PL.z=saved.p[2]-OZ;PL.yaw=saved.p[3];PL.pitch=saved.p[4];if(saved.p[5])toggleFly();}
  progress(1,TOUCH?'Ready. Tap Play.':'Ready. Click Play.');
  $('play').textContent=resumed?'Continue':'Play';
  ready=true;/*@test-hook*/$('play').disabled=false;$('play').focus();
  $('toast').style.display='none';
}

