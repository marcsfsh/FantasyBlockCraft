// Particles
const MAXP=2400,pPos=new Float32Array(MAXP*3),pCol=new Float32Array(MAXP*3),parts=[];
const pGeo=new THREE.BufferGeometry();
pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3).setUsage(THREE.DynamicDrawUsage));
pGeo.setAttribute('color',new THREE.BufferAttribute(pCol,3).setUsage(THREE.DynamicDrawUsage));
const pts=new THREE.Points(pGeo,new THREE.PointsMaterial({size:0.16,vertexColors:true,sizeAttenuation:true}));pts.frustumCulled=false;scene.add(pts);
function spawnP(x,y,z,vx,vy,vz,c,life,grav,sz){if(parts.length>=MAXP)parts.shift();parts.push({x:x,y:y,z:z,vx:vx,vy:vy,vz:vz,r:c[0],g:c[1],b:c[2],life:life,grav:grav});}
function lightAtCell(x,y,z){return Math.max(sky(x,y,z)*U.skyMul.value,bl(x,y,z),0.2);}
function breakFx(x,y,z,id,n){
  const c=TAVG[BL[id].t[2]],L=lightAtCell(x,y,z);
  for(let k=0;k<n;k++){const v=0.75+Math.random()*0.45;spawnP(x+Math.random(),y+Math.random(),z+Math.random(),(Math.random()-.5)*3,Math.random()*3.5,(Math.random()-.5)*3,[c[0]*v*L,c[1]*v*L,c[2]*v*L],0.6+Math.random()*0.5,14);}
}
function updParts(dt){
  for(let i=parts.length-1;i>=0;i--){
    const p=parts[i];p.life-=dt;
    if(p.life<=0){parts[i]=parts[parts.length-1];parts.pop();continue;}
    p.vy-=p.grav*dt;
    const nx=p.x+p.vx*dt,ny=p.y+p.vy*dt,nz=p.z+p.vz*dt;
    if(SOLID[get(Math.floor(nx),Math.floor(ny),Math.floor(nz))]){p.vx*=0.3;p.vz*=0.3;p.vy=0;}else{p.x=nx;p.y=ny;p.z=nz;}
  }
  for(let i=0;i<parts.length;i++){const p=parts[i];pPos[i*3]=p.x;pPos[i*3+1]=p.y;pPos[i*3+2]=p.z;pCol[i*3]=p.r;pCol[i*3+1]=p.g;pCol[i*3+2]=p.b;}
  pGeo.setDrawRange(0,parts.length);pGeo.attributes.position.needsUpdate=true;pGeo.attributes.color.needsUpdate=true;
}

// TNT
function tileCanvas(t){const c=document.createElement('canvas');c.width=c.height=16;c.getContext('2d').drawImage(atlas,(t%AC)*16,((t/AC)|0)*16,16,16,0,0,16,16);return c;}
function tntMats(white){return[31,31,32,33,31,31].map(t=>{const tx=new THREE.CanvasTexture(tileCanvas(t));tx.magFilter=tx.minFilter=THREE.NearestFilter;tx.generateMipmaps=false;const m=new THREE.MeshBasicMaterial({map:tx});if(white)m.color.setRGB(2.6,2.6,2.6);return m;});}
const tntN=tntMats(false),tntW=tntMats(true),tntGeo=new THREE.BoxGeometry(0.98,0.98,0.98);
const primed=[],flashes=[];
const flashGeo=new THREE.SphereGeometry(1,14,10);
let shake=0;
function prime(x,y,z,fuse){
  setBlock(x,y,z,AIR);
  const m=new THREE.Mesh(tntGeo,tntN);scene.add(m);
  primed.push({x:x+.5,y:y,z:z+.5,vx:(Math.random()-.5)*1.2,vy:3.2,vz:(Math.random()-.5)*1.2,fuse:fuse,m:m});
  burst(0.7,'highpass',4200,0.8,0.14);
}
function explode(cx,cy,cz){
  const R=4,bx=Math.floor(cx),by=Math.floor(cy),bz=Math.floor(cz);
  const pdx=PL.x-cx,pdy=PL.y+0.9-cy,pdz=PL.z-cz,pd=Math.hypot(pdx,pdy,pdz)||0.01;
  sfxBoom(pd);shake=Math.max(shake,Math.min(1.2,1.4*(1-pd/45)));buzz(pd<20?60:20);
  for(let dy=-R;dy<=R;dy++)for(let dz=-R;dz<=R;dz++)for(let dx=-R;dx<=R;dx++){
    const d=Math.sqrt(dx*dx+dy*dy+dz*dz);if(d>R+0.5-Math.random()*1.4)continue;
    const x=bx+dx,y=by+dy,z=bz+dz;if(x<0||z<0||y<0||x>=W||z>=D||y>=H)continue;
    const id=world[I(x,y,z)];if(!id||id===BEDROCK||id===OBSID||BL[id].liquid)continue;
    if(id===TNT){prime(x,y,z,0.5+Math.random()*1.0);continue;}
    if(id===GRAVE||id===CRATE||id===DWCHEST||id===BARREL)continue; // blasts never destroy graves or containers (their contents would be lost or teleported)
    if(Math.random()<0.35){const c=TAVG[BL[id].t[2]];for(let k=0;k<2;k++)spawnP(x+.5,y+.5,z+.5,dx*2.2+(Math.random()-.5)*3,dy*1.5+3+Math.random()*4,dz*2.2+(Math.random()-.5)*3,c,1+Math.random()*0.8,16);}
    setBlock(x,y,z,AIR);
  }
  for(let k=0;k<70;k++){const g=0.45+Math.random()*0.35,a=Math.random()*6.283,s=Math.random()*3.5;spawnP(cx+(Math.random()-.5)*3,cy+(Math.random()-.5)*3,cz+(Math.random()-.5)*3,Math.cos(a)*s,1+Math.random()*2.5,Math.sin(a)*s,[g,g,g],1.2+Math.random()*1.2,-1.2);}
  for(let k=0;k<26;k++)spawnP(cx,cy,cz,(Math.random()-.5)*10,Math.random()*8,(Math.random()-.5)*10,[1,0.75+Math.random()*0.2,0.3],0.35+Math.random()*0.3,4);
  const fm=new THREE.Mesh(flashGeo,new THREE.MeshBasicMaterial({color:0xffd27a,transparent:true,opacity:0.9,depthWrite:false}));
  fm.position.set(cx,cy,cz);scene.add(fm);flashes.push({m:fm,t:0});
  if(pd<R*2.2)hurt(Math.round((1-pd/(R*2.2))*22),'blew up');
  if(pd<R*2.4){const f=(1-pd/(R*2.4))*15;PL.vx+=pdx/pd*f;PL.vy+=pdy/pd*f*0.7+f*0.35;PL.vz+=pdz/pd*f;PL.ground=false;}
  for(const p of primed){const ex=p.x-cx,ey=p.y+.5-cy,ez=p.z-cz,e=Math.hypot(ex,ey,ez)||0.01;if(e<R*2){const f=(1-e/(R*2))*9;p.vx+=ex/e*f;p.vy+=ey/e*f+2;p.vz+=ez/e*f;}}
}
function updTNT(dt){
  for(let i=primed.length-1;i>=0;i--){
    const p=primed[i];p.fuse-=dt;
    p.vy-=20*dt;
    const ny=p.y+p.vy*dt;
    if(p.vy<0&&SOLID[get(Math.floor(p.x),Math.floor(ny),Math.floor(p.z))]){p.y=Math.floor(ny)+1;p.vy=0;p.vx*=Math.max(0,1-6*dt);p.vz*=Math.max(0,1-6*dt);}
    else if(p.vy>0&&SOLID[get(Math.floor(p.x),Math.floor(ny+0.98),Math.floor(p.z))])p.vy=0;
    else p.y=ny;
    const nx=p.x+p.vx*dt,nz=p.z+p.vz*dt;
    if(!SOLID[get(Math.floor(nx),Math.floor(p.y+0.5),Math.floor(p.z))]&&nx>0.5&&nx<W-0.5)p.x=nx;else p.vx=0;
    if(!SOLID[get(Math.floor(p.x),Math.floor(p.y+0.5),Math.floor(nz))]&&nz>0.5&&nz<D-0.5)p.z=nz;else p.vz=0;
    if(p.y<-10)p.fuse=0;
    p.m.position.set(p.x,p.y+0.49,p.z);
    p.m.material=(p.fuse%0.5)<0.22?tntW:tntN;
    if(Math.random()<0.6)spawnP(p.x+(Math.random()-.5)*.2,p.y+1.02,p.z+(Math.random()-.5)*.2,(Math.random()-.5)*1.5,1.5+Math.random()*1.5,(Math.random()-.5)*1.5,Math.random()<.5?[1,.95,.6]:[.55,.55,.55],0.35,6);
    p.m.scale.setScalar(p.fuse<0.6?1+(0.6-p.fuse)*0.3:1);
    if(p.fuse<=0){scene.remove(p.m);primed.splice(i,1);beginAct();explode(p.x,p.y+0.5,p.z);endAct();}
  }
  for(let i=flashes.length-1;i>=0;i--){const f=flashes[i];f.t+=dt;f.m.scale.setScalar(1+f.t*22);f.m.material.opacity=Math.max(0,0.9-f.t*3.2);if(f.t>0.3){scene.remove(f.m);f.m.material.dispose();flashes.splice(i,1);}}
}

