// Main loop
let caveF=0,cullT=0;const caveDark=new THREE.Color(0.035,0.04,0.06),caveFogC=new THREE.Color();
const ropeV=new THREE.Vector3(),ropeGeo=new THREE.BufferGeometry();
ropeGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(6),3));
const rope=new THREE.Line(ropeGeo,new THREE.LineBasicMaterial({color:0x2a1c10}));rope.frustumCulled=false;rope.visible=false;scene.add(rope);
const hookTip=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.2,0.2),new THREE.MeshBasicMaterial({color:0xa8aeb8}));hookTip.visible=false;scene.add(hookTip);
let last=performance.now(),infoT=0,fc=0,fps=0,ft=0;
const tint=$('tint'),HAND0=TOUCH?new THREE.Vector3(0.5,-0.62,-1.05):new THREE.Vector3(0.56,-0.5,-0.95);
function update(dt){
  const shift=keys.ShiftLeft||keys.ShiftRight;
  const fwd=((keys.KeyW||keys.ArrowUp)?1:0)-((keys.KeyS||keys.ArrowDown)?1:0)-tch.jy-PAD.ly;
  const str=((keys.KeyD||keys.ArrowRight)?1:0)-((keys.KeyA||keys.ArrowLeft)?1:0)+tch.jx+PAD.lx;
  const jump=keys.Space||tch.jump||PAD.jump,down=(PL.fly&&shift)||tch.down||PAD.down;
  const inLiq=liquidAt(PL.x,PL.y+0.3,PL.z)||liquidAt(PL.x,PL.y+1.0,PL.z);
  const sprint=!PL.fly&&(!SURV()||food>6)&&(shift||sprintLatch||PAD.sprint||(TOUCH&&Math.hypot(tch.jx,tch.jy)>0.96));
  const flyFast=sprintLatch||PAD.sprint||(TOUCH&&Math.hypot(tch.jx,tch.jy)>0.96);
  const speed=PL.fly?(flyFast?20:11):inLiq?2.4:sprint?5.7:4.3;
  const sy=Math.sin(PL.yaw),cy=Math.cos(PL.yaw);
  let wx=-sy*fwd+cy*str,wz=-cy*fwd-sy*str;const wl=Math.hypot(wx,wz);if(wl>1){wx/=wl;wz/=wl;}
  const onIce=PL.ground&&get(Math.floor(PL.x),Math.floor(PL.y-0.05),Math.floor(PL.z))===ICE;
  if(PL.ground||PL.fly||inLiq)gliding=false;
  const hooked=G.on&&G.t>=1;
  if(gliding){const gs=9+Math.max(0,-PL.pitch)*10,kk=Math.min(1,1.6*dt);PL.vx+=(-sy*gs+cy*str*3-PL.vx)*kk;PL.vz+=(-cy*gs-sy*str*3-PL.vz)*kk;}
  else if(!hooked){
    const acc=PL.fly?14:onIce?1.5:PL.ground?14:inLiq?6:3.2,k=Math.min(1,acc*dt);
    PL.vx+=(wx*speed*(onIce?1.25:1)-PL.vx)*k;PL.vz+=(wz*speed*(onIce?1.25:1)-PL.vz)*k;
  }
  if(PL.fly){const tv=((jump?1:0)-(down?1:0))*speed;PL.vy+=(tv-PL.vy)*Math.min(1,10*dt);}
  else if(inLiq){PL.vy-=7*dt;if(jump)PL.vy=Math.min(PL.vy+22*dt,3.4);PL.vy*=1-Math.min(1,2.2*dt);if(PL.vy<-3.5)PL.vy=-3.5;}
  else{PL.vy-=28*dt;if(jump&&(PL.ground||airT<0.1)&&PL.vy<=0.5){PL.vy=8.4;airT=1;exh+=0.05;}if(gliding)PL.vy=Math.max(PL.vy,-(2.2+Math.max(0,-PL.pitch)*7));if(PL.vy<-50)PL.vy=-50;}
  if(G.on){
    if(G.t<1)G.t=Math.min(1,G.t+dt*60/Math.max(1,G.len));
    else if(!SOLID[get(G.bx,G.by,G.bz)])releaseHook(false);
    else{
      let dx=G.ax-PL.x,dy=G.ay-(PL.y+1.0),dz=G.az-PL.z;const d=Math.hypot(dx,dy,dz);
      if(d<1.5)releaseHook(true);
      else{dx/=d;dy/=d;dz/=d;const a=50*dt;PL.vx+=dx*a+wx*6*dt;PL.vy+=dy*a+21*dt;PL.vz+=dz*a+wz*6*dt;
        const s=Math.hypot(PL.vx,PL.vy,PL.vz);if(s>22){PL.vx*=22/s;PL.vy*=22/s;PL.vz*=22/s;}}
    }
  }
  const n=Math.max(1,Math.ceil(Math.max(Math.abs(PL.vx),Math.abs(PL.vy),Math.abs(PL.vz))*dt/0.35)),h=dt/n;
  const wasGround=PL.ground;PL.ground=false;let wallHit=false;
  for(let i=0;i<n;i++){
    if(moveAxis('y',PL.vy*h)){if(PL.vy<0)PL.ground=true;PL.vy=0;}
    const bx=moveAxis('x',PL.vx*h),bz=moveAxis('z',PL.vz*h);if(bx||bz)wallHit=true;
    if(bx)PL.vx=0;if(bz)PL.vz=0;
    if((bx||bz)&&TOUCH&&wasGround&&!PL.fly&&wl>0.3&&!SOLID[get(Math.floor(PL.x+wx*0.6),Math.floor(PL.y+1.5),Math.floor(PL.z+wz*0.6))])PL.vy=8.4;
  }
  if(PL.y<-20){if(SURV())hurt(999,'void');else respawn();}
  survivalTick(dt,inLiq,Math.hypot(PL.vx,PL.vz)*dt,sprint);
  if(PL.ground)airT=0;else airT+=dt;
  if(inLiq&&wallHit&&jump)PL.vy=Math.max(PL.vy,5.6);
  if(TOUCH&&look.id!==null&&!look.moved&&!look.breaking&&performance.now()-look.t0>380){look.breaking=true;act(0);hold=0;holdT=0.25;}
  panCool=Math.max(0,panCool-dt);tickSluices(dt);powerTick(dt);
  if(SURV()&&hold===0)mineTick(dt);else if(mineI>=0){mineI=-1;mineP=0;crack.visible=false;}
  if(hold>=0&&!(hold===2&&isTool(curId()))&&!(SURV()&&hold===0)){holdT-=dt;if(holdT<=0){act(hold);holdT=brushR?0.32:0.22;}}
  const mv=Math.hypot(PL.vx,PL.vz);if(PL.ground&&mv>0.5)bob+=mv*dt*1.9;
  if(PL.ground&&mv>1){stepD+=mv*dt;if(stepD>1.9){stepD=0;const under=get(Math.floor(PL.x),Math.floor(PL.y-0.05),Math.floor(PL.z)),sd=SND[BL[under].snd]||SND.stone;burst(0.07,'bandpass',sd[0]*0.55*(0.9+Math.random()*0.2),sd[1],0.13);}}
  if(inLiq&&!wasLiq&&PL.vy<-3){burst(0.4,'lowpass',1200,0.6,0.3);for(let k=0;k<26;k++)spawnP(PL.x,PL.y+0.3,PL.z,(Math.random()-.5)*4,2+Math.random()*4,(Math.random()-.5)*4,[.75,.85,1],0.7,14);}
  wasLiq=inLiq;
}
function frame(now){
  requestAnimationFrame(frame);
  const dt=Math.min(0.05,(now-last)/1000);last=now;
  pollPad(dt);
  if(ready)meshBand();
  U.time.value=now/1000;
  if(ready&&playing){update(dt);
    const ex=PL.x-W/2,ez=PL.z-D/2;
    if(ex>CS)shiftWindow(CS,0);else if(ex<-CS)shiftWindow(-CS,0);else if(ez>CS)shiftWindow(0,CS);else if(ez<-CS)shiftWindow(0,-CS);}
  if(ready){processGenQ();if(playing&&settings.time==='cycle')tod=(tod+dt/DAYLEN)%1;if(playing){updTNT(dt);updFalling(dt);updRockets(dt);flowT-=dt;if(flowT<=0){flowT=0.2;flowStep();}}if(playing){tickT-=dt;if(tickT<=0){tickT=0.3;randomTicks();}}torchFx(dt);flush();updParts(dt);updWeather(dt,now);}
  const dayL=updSky();
  camera.position.set(PL.x,PL.y+EYE,PL.z);
  if(shake>0){camera.position.x+=(Math.random()-.5)*shake*0.3;camera.position.y+=(Math.random()-.5)*shake*0.3;camera.position.z+=(Math.random()-.5)*shake*0.3;shake=Math.max(0,shake-dt*2.2);}
  camera.rotation.set(PL.pitch,PL.yaw,0);
  {let sy2=-1;const fx=Math.floor(PL.x),fz=Math.floor(PL.z);for(let y=Math.floor(PL.y+0.01);y>=Math.floor(PL.y)-24&&y>=0;y--){if(SOLID[get(fx,y,fz)]){sy2=y+1;break;}}
   if(sy2<0||photo||!ready){pShadow.visible=false;}else{const dd=PL.y-sy2;pShadow.visible=true;pShadow.position.set(PL.x,sy2+0.015,PL.z);pShadow.material.opacity=Math.max(0,0.5-dd*0.025);pShadow.scale.setScalar(1+dd*0.03);}}
  const F0=settings.fov,tf=gliding||G.on?F0+13:PL.fly||(Math.hypot(PL.vx,PL.vz)>5)?F0+7:F0;
  if(Math.abs(camera.fov-tf)>0.1){camera.fov+=(tf-camera.fov)*Math.min(1,dt*8);camera.updateProjectionMatrix();}
  // held block
  swing=Math.max(0,swing-dt*5);const sw=Math.sin(swing*Math.PI),mv=Math.min(1,Math.hypot(PL.vx,PL.vz)/4);
  let dyaw=PL.yaw-lastYaw;if(dyaw>Math.PI)dyaw-=Math.PI*2;if(dyaw<-Math.PI)dyaw+=Math.PI*2;
  lagX=Math.max(-0.09,Math.min(0.09,lagX*Math.pow(0.0005,dt)+dyaw*0.5));lagY=Math.max(-0.07,Math.min(0.07,lagY*Math.pow(0.0005,dt)-(PL.pitch-lastPitch)*0.4));lastYaw=PL.yaw;lastPitch=PL.pitch;
  hand.position.set(HAND0.x+Math.cos(bob)*0.025*mv-sw*0.08+lagX,HAND0.y+Math.abs(Math.sin(bob))*0.035*mv-sw*0.14+lagY,HAND0.z+sw*0.1);
  hand.rotation.set(-sw*0.7,-0.62,0.06);hand.scale.setScalar(TOUCH?0.34:0.42);
  handItem.position.set(hand.position.x+0.02,hand.position.y+0.08,hand.position.z);handItem.rotation.set(-sw*0.9-0.1,-0.35,0.25-sw*0.4);handItem.scale.setScalar(TOUCH?0.48:0.56);
  if(G.on){
    camera.updateMatrixWorld(true);hand.getWorldPosition(ropeV);
    const t=G.t,hx=ropeV.x+(G.ax-ropeV.x)*t,hy=ropeV.y+(G.ay-ropeV.y)*t,hz=ropeV.z+(G.az-ropeV.z)*t,ra=rope.geometry.attributes.position.array;
    ra[0]=ropeV.x;ra[1]=ropeV.y;ra[2]=ropeV.z;ra[3]=hx;ra[4]=hy;ra[5]=hz;rope.geometry.attributes.position.needsUpdate=true;
    rope.visible=hookTip.visible=true;hookTip.position.set(hx,hy,hz);
  }else rope.visible=hookTip.visible=false;
  const ex=Math.floor(PL.x),ey=Math.floor(PL.y+EYE),ez=Math.floor(PL.z);
  caveF+=((ready&&sky(ex,ey,ez)<0.3?1:0)-caveF)*Math.min(1,dt*1.5);
  matHand.uniforms.bright.value=Math.max(0.22,Math.min(1,Math.max(sky(ex,ey,ez)*U.skyMul.value,bl(ex,ey,ez))));handItem.material.color.setScalar(matHand.uniforms.bright.value);
  const head=get(Math.floor(camera.position.x),Math.floor(camera.position.y),Math.floor(camera.position.z));
  if(head===WATER){U.fogColor.value.setHex(0x1d4c8a).multiplyScalar(Math.max(0.2,U.skyMul.value));U.fogNear.value=1;U.fogFar.value=24;renderer.setClearColor(U.fogColor.value);tint.style.display='block';tint.style.background='rgba(24,70,170,.3)';}
  else if(head===LAVA){U.fogColor.value.setHex(0xc84a10);U.fogNear.value=0;U.fogFar.value=4;renderer.setClearColor(0xc84a10);tint.style.display='block';tint.style.background='rgba(220,90,20,.4)';}
  else{
    const CV=[[0.0,0.78,13,40],[0.12,0.95,20,64],[0.62,1.0,26,110]][settings.cave||0];
    U.caveMin.value=CV[0]*caveF;U.lamp.value=CV[1];U.lampR.value=CV[2];
    caveFogC.copy(skyC).lerp(caveDark,caveF);U.fogColor.value.copy(caveFogC);
    U.fogNear.value=lerp(FOGN*(1-0.3*rainAmt),CV[3]*0.35,caveF);U.fogFar.value=lerp(FOGF*(1-0.25*rainAmt),CV[3],caveF);renderer.setClearColor(caveFogC);tint.style.display='none';}
  cullT-=dt;if(cullT<=0){cullT=0.25;const lim=(U.fogFar.value+24)*(U.fogFar.value+24),pcx=PL.x,pcz=PL.z;
    for(let c=0;c<chunks.length;c++){const ms=chunks[c];if(!ms)continue;const x=(c%NCX)*CS+8-pcx,z=((c/NCX)|0)*CS+8-pcz,v=x*x+z*z<lim;for(const m of ms)m.visible=v;}}
  sun.position.copy(camera.position).addScaledVector(sunDir,420);sun.lookAt(camera.position);
  halo.position.copy(camera.position).addScaledVector(sunDir,410);halo.lookAt(camera.position);
  dome.position.copy(camera.position);dome.visible=head!==WATER&&head!==LAVA;
  moon.position.copy(camera.position).addScaledVector(sunDir,-420);moon.lookAt(camera.position);
  stars.position.copy(camera.position);stars.rotation.y=curT()*Math.PI*2;
  waypoints.forEach(m=>{m.material.opacity=0.28+0.1*Math.sin(now*0.003+m.position.x);});
  clouds.position.x=PL.x;clouds.position.z=PL.z;ctex.offset.x=PL.x/768+now*0.0000025;ctex.offset.y=-PL.z/768;
  if(ready){const hit=raycast(eyePos(),camDir(),6);updBpPreview();if(hit&&!isTool(curId())&&!photo){selBox.visible=true;selBox.position.set(hit.x+.5,hit.y+.5,hit.z+.5);selBox.scale.setScalar(brushR*2+1);
      faceN.set(hit.px-hit.x,hit.py-hit.y,hit.pz-hit.z);
      if(faceN.lengthSq()===1&&!swapMode&&!BL[hit.id].cross){faceHi.visible=true;faceHi.position.set(hit.x+.5+faceN.x*.502,hit.y+.5+faceN.y*.502,hit.z+.5+faceN.z*.502);faceHi.lookAt(faceHi.position.x+faceN.x,faceHi.position.y+faceN.y,faceHi.position.z+faceN.z);}else faceHi.visible=false;
    }else{selBox.visible=false;faceHi.visible=false;}drawMM();}
  renderer.render(scene,camera);
  fc++;ft+=dt;infoT-=dt;
  if(infoT<=0&&ready){infoT=0.25;fps=Math.round(fc/Math.max(ft,0.001));fc=0;ft=0;
    const bx=Math.floor(PL.x),bz=Math.floor(PL.z),inside=bx>=0&&bz>=0&&bx<W&&bz<D;
    let where='';
    if(inside){const ci=bx+W*bz,yy=Math.floor(PL.y);where=hg[ci]>=0&&yy>hm[ci]?'Sky Island':(yy<hm[ci]&&!(hg[ci]>=0&&yy>hg[ci]))?(ruinAt(bx+OX,yy,bz+OZ)||(q=>q?POI_NAMES[q.tp]:layerName(yy,bx+OX,bz+OZ))(poiNear(bx+OX,yy,bz+OZ))):townAt(bx+OX,bz+OZ,0)?'Town':BIOMES[biome[ci]];
      if(where!=='Underground'&&where!=='Caves'&&where!==lastWhere&&now-lastWhereT>5000){if(lastWhere)showBiome(where);lastWhere=where;lastWhereT=now;}}
    $('info').textContent=fps+' fps\nXYZ '+(bx+OX)+' '+Math.floor(PL.y)+' '+(bz+OZ)+'\n'+where+(brushR?'\nBrush '+(brushR*2+1)+'x':'')+(gliding?'\nGliding':'')+(G.on?'\nHooked':'')+(primed.length?'\nKegs lit: '+primed.length:'')+infoExtra();}
}
let lastWhere='',lastWhereT=0;
function showBiome(n){const el=$('name');el.textContent=n;el.style.opacity=1;clearTimeout(nameTimer);nameTimer=setTimeout(()=>{el.style.opacity=0;},2200);}
function infoExtra(){
  const t=curT()*24,hh=Math.floor(t),mi=Math.floor((t-hh)*60);
  let s='\n'+(hh<10?'0':'')+hh+':'+(mi<10?'0':'')+mi+(rainAmt>0.3?(snowing?', snow':', rain'):'');
  let best=1e9;waypoints.forEach(m=>{const d=Math.hypot(m.position.x-PL.x,m.position.z-PL.z);if(d<best)best=d;});
  if(best<1e9)s+='\nWaypoint '+Math.round(best)+' blocks';
  return s;
}
addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();});
setMode(mode);$('name').style.opacity=0;saveDirty=false;
requestAnimationFrame(frame);
generate();
