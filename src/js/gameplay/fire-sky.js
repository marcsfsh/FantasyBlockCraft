// ---- The sky over the Volcanic Wastes (D-051): smoke-black overhead, a red glow along the horizon, a dull red sun; dry lightning
// in blue-white bolts that strike the plains and the craters; a plume of smoke over every volcano, lit red from the crater; lava
// thrown up from the craters; embers rising from the lava and smoke from the vents. All cosmetic, none of it saved. Storms
// elsewhere get visible bolts too.
const burnSky=new THREE.Color(),burnTint=new THREE.Color(1,0.52,0.4),burnSun=new THREE.Color(0.5,0.1,0.04),burnCloud=new THREE.Color(),blueFlash=new THREE.Color(0.5,0.6,1);
// the sky's colours, called from updSky once the day's own colours are set (d: daylight 0 to 1)
function burnSkyTick(d){
  const b=LWX.burn;flashC.setHex(0xdfe6ff).lerp(blueFlash,b);if(b<0.002)return;
  U.skyMul.value*=1-0.42*b;U.skyTint.value.lerp(burnTint,0.75*b);
  skyC.lerp(burnSky.setRGB(0.17,0.05,0.035).multiplyScalar(0.4+0.6*d),0.9*b);
  stars.material.opacity*=1-b;clouds.material.color.lerp(burnCloud.setRGB(0.2,0.09,0.07).multiplyScalar(0.5+0.5*d),0.85*b);
  sun.material.color.lerp(burnSun,0.85*b);if(b>0.5)halo.visible=false;
}
// the dome: near black overhead, red low down where the glow of the lava lights the smoke
const burnZen=[0.05,0.016,0.013];
function burnDome(i,t){const b=LWX.burn;if(b<0.002)return;const g=Math.pow(1-t,2.6)*b*(0.6+0.4*U.skyMul.value),k=b*Math.min(1,0.35+t*1.2);
  for(let c=0;c<3;c++)domeCol[i*3+c]=domeCol[i*3+c]*(1-k)+burnZen[c]*k+[0.42,0.07,0.025][c]*g;}
// ---- Lightning: a jagged bolt with branches, drawn as ribbons turned to face the camera, a core and a wide glow, flickering
const bolts=[],boltCore=new THREE.MeshBasicMaterial({color:0xeef3ff,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}),
  boltGlow=new THREE.MeshBasicMaterial({color:0x4d6cff,transparent:true,opacity:0.3,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
const BOLT_FLICK=[1,0.12,0.95,0.08,0.75,0.3,0.6,0];
function makeBolt(X0,Y0,Z0,X1,Y1,Z1,storm){
  const segs=[],walk=(x,y,z,tx,ty,tz,n,w,jit)=>{let px=x,py=y,pz=z,ox=0,oz=0;for(let i=1;i<=n;i++){const f=i/n;ox+=(Math.random()-0.5)*jit;oz+=(Math.random()-0.5)*jit;if(i===n){ox*=0;oz*=0;}
      const nx=x+(tx-x)*f+ox*(1-f*0.6),ny=y+(ty-y)*f+(Math.random()-0.5)*jit*0.3,nz=z+(tz-z)*f+oz*(1-f*0.6);segs.push([px,py,pz,nx,ny,nz,w*(1-f*0.4)]);
      if(w>0.2&&i>2&&i<n-2&&Math.random()<0.18){const a=Math.random()*6.28,l=(Y0-Y1)*(0.15+Math.random()*0.2);walk(nx,ny,nz,nx+Math.cos(a)*l*0.6,ny-l,nz+Math.sin(a)*l*0.6,5+(Math.random()*3|0),w*0.45,jit*0.7);}
      px=nx;py=ny;pz=nz;}};
  walk(X0,Y0,Z0,X1,Y1,Z1,18,0.5,(Y0-Y1)/9);
  const mk=(mat,k)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(segs.length*18),3).setUsage(THREE.DynamicDrawUsage));const m=new THREE.Mesh(g,mat.clone());m.frustumCulled=false;m.userData.k=k;scene.add(m);return m;};
  const b={segs:segs,t:0,core:mk(boltCore,1),glow:mk(boltGlow,5)};if(storm)b.core.material.color.setHex(0xffffff);bolts.push(b);return b;
}
function drawBolt(b){
  const cx=camera.position.x+OX,cy=camera.position.y,cz=camera.position.z+OZ;
  for(const m of [b.core,b.glow]){const P=m.geometry.attributes.position.array,k=m.userData.k;let o=0;
    for(const [ax,ay,az,bx,by,bz,w0] of b.segs){const dx=bx-ax,dy=by-ay,dz=bz-az,vx=(ax+bx)/2-cx,vy=(ay+by)/2-cy,vz=(az+bz)/2-cz;
      let px=dy*vz-dz*vy,py=dz*vx-dx*vz,pz=dx*vy-dy*vx;const l=Math.hypot(px,py,pz)||1,w=Math.max(w0*1.4,Math.hypot(vx,vy,vz)*0.007*w0*2)*k*0.5;px*=w/l;py*=w/l;pz*=w/l; // a few pixels wide however far
      const q=[[ax-px,ay-py,az-pz],[ax+px,ay+py,az+pz],[bx-px,by-py,bz-pz],[ax+px,ay+py,az+pz],[bx+px,by+py,bz+pz],[bx-px,by-py,bz-pz]];
      for(const v of q){P[o++]=v[0]-OX;P[o++]=v[1];P[o++]=v[2]-OZ;}}
    m.geometry.attributes.position.needsUpdate=true;}
}
// strike: within a plume over a crater when one is near, otherwise somewhere ahead on the plain; thunder follows by distance
let fireBoltT=3;
function strike(storm,ahead){
  const X=PL.x+OX,Z=PL.z+OZ;let X1,Y1,Z1,top;
  const vs=storm||ahead?[]:volcanoesNear(X,Z,170);
  if(vs.length&&Math.random()<0.5){const v=vs[Math.random()*vs.length|0],a=Math.random()*6.28,r=Math.random()*v.rc;X1=v.X+Math.cos(a)*r;Z1=v.Z+Math.sin(a)*r;Y1=v.rimTop-2;top=Y1+30+Math.random()*30;}
  else{const yaw=PL.yaw+(ahead?0.15:(Math.random()-0.5)*2.6),d=ahead?70:35+Math.random()*110;X1=X-Math.sin(yaw)*d;Z1=Z-Math.cos(yaw)*d;Y1=hAt(Math.round(X1),Math.round(Z1))+1;top=Math.min(H-4,Y1+60+Math.random()*40);}
  const b=makeBolt(X1+(Math.random()-0.5)*20,top,Z1+(Math.random()-0.5)*20,X1,Y1,Z1,storm);b.at=[X1-OX,Y1,Z1-OZ];
  const dist=Math.hypot(X1-X,Z1-Z);flash=Math.max(flash,Math.min(1,1.3-dist/180));
  const v=Math.max(0.15,1-dist/220),dl=dist/343;burst(2.2,'lowpass',150,0.5,0.75*v,dl,b.at);burst(0.8,'lowpass',520,0.6,0.4*v,dl,b.at);if(dist<45)burst(0.18,'highpass',2600,0.7,0.35,dl,b.at);
  drawBolt(b);buzz(dist<60?30:10);return b;
}
function updBolts(dt){
  for(let i=bolts.length-1;i>=0;i--){const b=bolts[i];if(!b.hold)b.t+=dt; // held: a screenshot catches it
   const k=Math.floor(b.t/0.06);
    if(k>=BOLT_FLICK.length){scene.remove(b.core);scene.remove(b.glow);b.core.geometry.dispose();b.glow.geometry.dispose();b.core.material.dispose();b.glow.material.dispose();bolts.splice(i,1);continue;}
    b.core.material.opacity=BOLT_FLICK[k];b.glow.material.opacity=0.3*BOLT_FLICK[k];drawBolt(b);}
}
// ---- Plumes: soft puffs of smoke rising from each crater nearby, lit red where they leave it, drifting on the wind
let puffTex=null;
function puffTexture(){if(puffTex)return puffTex;const cv=document.createElement('canvas');cv.width=cv.height=64;const g=cv.getContext('2d');
  for(let k=0;k<7;k++){const x=20+Math.random()*24,y=20+Math.random()*24,r=12+Math.random()*12,gr=g.createRadialGradient(x,y,1,x,y,r);gr.addColorStop(0,'rgba(255,255,255,0.55)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);}
  puffTex=new THREE.CanvasTexture(cv);return puffTex;}
const plumes=new Map(),PUFFS=34,smokeC=new THREE.Color(0.15,0.12,0.11),fireC=new THREE.Color(0.85,0.3,0.1);
function newPuff(p,v,age){p.age=age;p.life=36+Math.random()*24;p.X=v.X+(Math.random()-0.5)*v.rc;p.Z=v.Z+(Math.random()-0.5)*v.rc;p.Y=v.lake+2;p.vy=4+Math.random()*2;p.s0=10+Math.random()*6;p.s1=42+Math.random()*24;
  for(let t=0;t<age;t+=0.5)movePuff(p,0.5);}
function movePuff(p,dt){p.Y+=p.vy*dt;p.vy=Math.max(1.2,p.vy-dt*0.15);p.X+=1.6*dt;p.Z+=0.6*dt;}
function updPlumes(dt){
  const X=PL.x+OX,Z=PL.z+OZ,near=LWX.burn>0.05||plumes.size?volcanoesNear(X,Z,300):[],keep=new Set();
  for(const v of near){const k=v.i+','+v.j;keep.add(k);let pl=plumes.get(k);
    if(!pl){pl={v:v,puffs:[]};for(let n=0;n<PUFFS;n++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:puffTexture(),transparent:true,depthWrite:false,color:smokeC.clone()}));scene.add(s);const p={s:s};newPuff(p,v,Math.random()*50);pl.puffs.push(p);}plumes.set(k,pl);}
    for(const p of pl.puffs){p.age+=dt;movePuff(p,dt);if(p.age>p.life)newPuff(p,v,0);const f=p.age/p.life,sz=p.s0+(p.s1-p.s0)*Math.sqrt(f),d=Math.hypot(p.X-X,p.Z-Z);
      p.s.position.set(p.X-OX,p.Y,p.Z-OZ);p.s.scale.set(sz,sz,1);p.s.material.color.copy(smokeC).lerp(fireC,Math.max(0,1-p.age/7)).multiplyScalar(0.55+0.45*U.skyMul.value+0.3*Math.max(0,1-p.age/7));
      p.s.material.opacity=0.82*Math.min(1,p.age/3)*Math.min(1,(p.life-p.age)/8)*(1-sstep(U.fogFar.value*2.2,U.fogFar.value*3.2,d));}}
  for(const [k,pl] of plumes)if(!keep.has(k)){for(const p of pl.puffs){scene.remove(p.s);p.s.material.dispose();}plumes.delete(k);}
}
// vent smoke: a pool of small soft puffs that rise, spread and fade
const vpuffs=[];
function ventPuff(s){let p=vpuffs.find(q=>q.age>=q.life);if(!p){if(vpuffs.length>=60)return;p={s:new THREE.Sprite(new THREE.SpriteMaterial({map:puffTexture(),transparent:true,depthWrite:false,color:new THREE.Color(0.5,0.47,0.42)}))};scene.add(p.s);vpuffs.push(p);}
  p.age=0;p.life=4+Math.random()*3;p.X=s[0]+OX+0.5;p.Y=s[1]+1.2;p.Z=s[2]+OZ+0.5;p.s.visible=true;}
function updVentPuffs(dt){for(const p of vpuffs){if(p.age>=p.life){p.s.visible=false;continue;}p.age+=dt;p.Y+=1.3*dt;p.X+=0.4*dt;const f=p.age/p.life,sz=0.9+3.2*f;
  p.s.position.set(p.X-OX,p.Y,p.Z-OZ);p.s.scale.set(sz,sz,1);p.s.material.opacity=0.55*Math.min(1,p.age*2)*(1-f);p.s.material.color.setRGB(0.5,0.47,0.42).multiplyScalar(0.5+0.5*U.skyMul.value);}}
// ---- Embers over the lava, smoke from the vents, lava thrown from the craters near you
let fireScanT=0,lavaSpots=[],ventSpots=[],bombT=4;
function fireScan(){lavaSpots=[];ventSpots=[];const px=Math.floor(PL.x),pz=Math.floor(PL.z);
  for(let dz=-22;dz<=22;dz+=2)for(let dx=-22;dx<=22;dx+=2){const x=px+dx,z=pz+dz;if(x<0||z<0||x>=W||z>=D)continue;const ci=x+W*z,y=hm[ci],id=world[I(x,y,z)];
    if(id===LAVA)lavaSpots.push([x,y,z]);else if(id===VENT||world[I(x,ground[ci],z)]===VENT)ventSpots.push([x,ground[ci],z]);}}
function fireTick(dt){
  if(!ready)return;updBolts(dt);updPlumes(dt);updVentPuffs(dt);
  const b=LWX.burn;if(b<0.05||!playing)return;
  fireBoltT-=dt;if(fireBoltT<=0){fireBoltT=1.5+Math.random()*5;if(sky(Math.floor(PL.x),Math.floor(PL.y+EYE),Math.floor(PL.z))>0.4)strike(false);}
  fireScanT-=dt;if(fireScanT<=0){fireScanT=1;fireScan();}
  for(let k=0;k<lavaSpots.length*dt*0.6;k++){const s=lavaSpots[Math.random()*lavaSpots.length|0];spawnP(s[0]+Math.random(),s[1]+1.05,s[2]+Math.random(),(Math.random()-0.5)*0.8+0.4,1.2+Math.random()*2.2,(Math.random()-0.5)*0.8,[1,0.35+Math.random()*0.35,0.08],1.2+Math.random()*2,-0.5);}
  for(let k=0;k<12*dt*b;k++)spawnP(PL.x+(Math.random()-0.5)*30,PL.y+Math.random()*8-2,PL.z+(Math.random()-0.5)*30,0.6+Math.random()*0.4,0.4+Math.random()*0.8,(Math.random()-0.5)*0.5,[1,0.42,0.1],2+Math.random()*2,-0.15); // embers on the wind
  for(const s of ventSpots)if(Math.random()<dt*2.5)ventPuff(s);
  bombT-=dt;if(bombT<=0){bombT=3+Math.random()*6;for(const v of volcanoesNear(PL.x+OX,PL.z+OZ,130)){const at=[v.X-OX,v.lake+1,v.Z-OZ];
      for(let k=0;k<14;k++){const a=Math.random()*6.28,s=2+Math.random()*5;spawnP(at[0]+(Math.random()-0.5)*v.rc*0.8,at[1],at[2]+(Math.random()-0.5)*v.rc*0.8,Math.cos(a)*s,12+Math.random()*12,Math.sin(a)*s,[1,0.5+Math.random()*0.3,0.1],3.5,9);}
      burst(1.2,'lowpass',110,0.6,0.4*Math.max(0.1,1-Math.hypot(v.X-PL.x-OX,v.Z-PL.z-OZ)/200),0,at);}}
}
