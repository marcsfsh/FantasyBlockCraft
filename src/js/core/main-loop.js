// Main loop
let caveF=0,cullT=0,wasWall=false;const caveDark=new THREE.Color(0.035,0.04,0.06),caveFogC=new THREE.Color();
let last=performance.now(),infoT=0,fc=0,fps=0,ft=0,mmT=0;
const tint=$('tint'),HAND0=TOUCH?new THREE.Vector3(0.5,-0.62,-1.05):new THREE.Vector3(0.56,-0.5,-0.95);
function update(dt){
  const shift=keyHeld('sprint');
  const fwd=(keyHeld('forward')?1:0)-(keyHeld('back')?1:0)-tch.jy-PAD.ly;
  const str=(keyHeld('right')?1:0)-(keyHeld('left')?1:0)+tch.jx+PAD.lx;
  const jump=keyHeld('jump')||tch.jump||PAD.jump,down=(PL.fly&&shift)||tch.down||PAD.down;
  const inLiq=liquidAt(PL.x,PL.y+0.3,PL.z)||liquidAt(PL.x,PL.y+1.0,PL.z);
  const sprint=!PL.fly&&(!SURV()||food>6)&&(shift||sprintLatch||PAD.sprint||(TOUCH&&Math.hypot(tch.jx,tch.jy)>0.96));
  const flyFast=sprintLatch||PAD.sprint||(TOUCH&&Math.hypot(tch.jx,tch.jy)>0.96);
  const speed=PL.fly?(flyFast?20:11):inLiq?2.4:sprint?5.7:4.3;
  const sy=Math.sin(PL.yaw),cy=Math.cos(PL.yaw);
  let wx=-sy*fwd+cy*str,wz=-cy*fwd-sy*str;const wl=Math.hypot(wx,wz);if(wl>1){wx/=wl;wz/=wl;}
  const onIce=PL.ground&&get(Math.floor(PL.x),Math.floor(PL.y-0.05),Math.floor(PL.z))===ICE;
  if(PL.ground||PL.fly||inLiq)gliding=false;
  if(gliding){const gs=9+Math.max(0,-PL.pitch)*10,kk=Math.min(1,1.6*dt);PL.vx+=(-sy*gs+cy*str*3-PL.vx)*kk;PL.vz+=(-cy*gs-sy*str*3-PL.vz)*kk;}
  else{
    const acc=PL.fly?14:onIce?1.5:PL.ground?14:inLiq?6:3.2,k=Math.min(1,acc*dt);
    PL.vx+=(wx*speed*(onIce?1.25:1)-PL.vx)*k;PL.vz+=(wz*speed*(onIce?1.25:1)-PL.vz)*k;
  }
  if(PL.fly){const tv=((jump?1:0)-(down?1:0))*speed;PL.vy+=(tv-PL.vy)*Math.min(1,10*dt);}
  else if(inLiq){PL.vy-=7*dt;if(jump)PL.vy=Math.min(PL.vy+22*dt,3.4);PL.vy*=1-Math.min(1,2.2*dt);if(PL.vy<-3.5)PL.vy=-3.5;}
  else{PL.vy-=28*dt;if(jump&&(PL.ground||airT<0.1)&&PL.vy<=0.5){PL.vy=8.4;airT=1;exh+=0.05;}if(gliding)PL.vy=Math.max(PL.vy,-(2.2+Math.max(0,-PL.pitch)*7));if(PL.vy<-50)PL.vy=-50;}
  // climbing (M4): on a ladder, piton or rope, jump climbs, down or sprint descends, and nothing holds the player still
  const climb=!PL.fly&&!inLiq&&onClimb();
  if(climb){gliding=false;PL.vy=jump||(fwd>0.3&&wasWall)?3.2:(shift||tch.down||PAD.down)?-3.6:0;}
  if(climb!==PL.climb){PL.climb=climb;$('tDown').style.display=PL.fly||climb?'grid':'none';}
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
  wasWall=wallHit;
  if(TOUCH&&look.id!==null&&!look.moved&&!look.breaking&&performance.now()-look.t0>380){look.breaking=true;act(0);hold=0;holdT=0.25;}
  if(SURV()&&hold===0)mineTick(dt);else if(mineI>=0){mineI=-1;mineP=0;crack.visible=false;}
  if(hold>=0&&!(hold===2&&oneShot(curId()))&&!(SURV()&&hold===0)){holdT-=dt;if(holdT<=0){act(hold);holdT=brushR?0.32:0.22;}}
  const mv=Math.hypot(PL.vx,PL.vz);if(PL.ground&&mv>0.5)bob+=mv*dt*1.9;
  if(PL.ground&&mv>1){stepD+=mv*dt;if(stepD>1.9){stepD=0;const under=get(Math.floor(PL.x),Math.floor(PL.y-0.05),Math.floor(PL.z)),sd=SND[BL[under].snd]||SND.stone;burst(0.07,'bandpass',sd[0]*0.55*(0.9+Math.random()*0.2),sd[1],0.13);}}
  if(inLiq&&!wasLiq&&PL.vy<-3){burst(0.4,'lowpass',1200,0.6,0.3);for(let k=0;k<26;k++)spawnP(PL.x,PL.y+0.3,PL.z,(Math.random()-.5)*4,2+Math.random()*4,(Math.random()-.5)*4,[.75,.85,1],0.7,14);}
  wasLiq=inLiq;
}
// Auto view distance: every two seconds take the median frame time. The best median seen stands for the screen's refresh
// (60 or 120 Hz alike); pull the fog in when frames run 15% slower than that, push it out when they keep pace with time to
// spare (frame work under half a frame). Medians shrug off single slow or fast frames.
const AV_S=[];
function autoView(raw,work){
  const A=AUTO_VIEW;AV_S.push(raw);A.t+=raw;A.work=Math.max(A.work,work);if(A.t<2)return;
  AV_S.sort((a,b)=>a-b);const med=AV_S[AV_S.length>>1];AV_S.length=0;
  if(med<A.refresh||A.fast)A.refresh=Math.min(A.fast?1:A.refresh,med);A.fast=0;
  // slow: pull the view in to 72 blocks first, then lower the resolution, then the view to 56; smooth: resolution back first
  if(med>A.refresh*1.15){if(A.far>72)A.far=Math.max(72,A.far-6);else if(!resStep(-0.25)&&A.far>56)A.far=Math.max(56,A.far-6);}
  else if(med<A.refresh*1.05&&A.work<A.refresh*500){if(!resStep(0.25)&&A.far<104)A.far=Math.min(104,A.far+3);}
  A.t=A.work=0;if(settings.view<0){FOGF=A.far;FOGN=FOGF*0.55;}
}
let fmax=0,fwork=0;
function frame(now){
  requestAnimationFrame(frame);
  const raw=(now-last)/1000,dt=Math.min(0.05,raw);last=now;const w0=performance.now();
  if(raw>fmax)fmax=raw;
  pollPad(dt);
  if(ready)meshBand();
  U.time.value=now/1000;
  if(ready&&playing){update(dt);
    const ex=PL.x-W/2,ez=PL.z-D/2;
    if(ex>CS)shiftWindow(CS,0);else if(ex<-CS)shiftWindow(-CS,0);else if(ez>CS)shiftWindow(0,CS);else if(ez<-CS)shiftWindow(0,-CS);}
  if(ready){processGenQ();if(playing&&settings.time==='cycle'){tod+=dt/DAYLEN;if(tod>=1){tod-=1;dayN++;}}if(playing){updateEntities(dt);flowT-=dt;if(flowT<=0){flowT=0.2;flowStep();}}if(playing){tickT-=dt;if(tickT<=0){tickT=0.3;randomTicks();}}torchFx(dt);flush();updParts(dt);updWeather(dt,now);}
  const dayL=updSky();
  camera.position.set(PL.x,PL.y+EYE,PL.z);
  if(shake>0){camera.position.x+=(Math.random()-.5)*shake*0.3;camera.position.y+=(Math.random()-.5)*shake*0.3;camera.position.z+=(Math.random()-.5)*shake*0.3;shake=Math.max(0,shake-dt*2.2);}
  camera.rotation.set(PL.pitch,PL.yaw,0);
  {let sy2=-1;const fx=Math.floor(PL.x),fz=Math.floor(PL.z);for(let y=Math.floor(PL.y+0.01);y>=Math.floor(PL.y)-24&&y>=0;y--){if(SOLID[get(fx,y,fz)]){sy2=y+1;break;}}
   if(sy2<0||photo||!ready){pShadow.visible=false;}else{const dd=PL.y-sy2;pShadow.visible=true;pShadow.position.set(PL.x,sy2+0.015,PL.z);pShadow.material.opacity=Math.max(0,0.5-dd*0.025);pShadow.scale.setScalar(1+dd*0.03);}}
  const F0=settings.fov,tf=gliding?F0+13:PL.fly||(Math.hypot(PL.vx,PL.vz)>5)?F0+7:F0;
  if(Math.abs(camera.fov-tf)>0.1){camera.fov+=(tf-camera.fov)*Math.min(1,dt*8);camera.updateProjectionMatrix();}
  // held block
  swing=Math.max(0,swing-dt*5);const sw=Math.sin(swing*Math.PI),mv=Math.min(1,Math.hypot(PL.vx,PL.vz)/4);
  let dyaw=PL.yaw-lastYaw;if(dyaw>Math.PI)dyaw-=Math.PI*2;if(dyaw<-Math.PI)dyaw+=Math.PI*2;
  lagX=Math.max(-0.09,Math.min(0.09,lagX*Math.pow(0.0005,dt)+dyaw*0.5));lagY=Math.max(-0.07,Math.min(0.07,lagY*Math.pow(0.0005,dt)-(PL.pitch-lastPitch)*0.4));lastYaw=PL.yaw;lastPitch=PL.pitch;
  hand.position.set(HAND0.x+Math.cos(bob)*0.025*mv-sw*0.08+lagX,HAND0.y+Math.abs(Math.sin(bob))*0.035*mv-sw*0.14+lagY,HAND0.z+sw*0.1);
  hand.rotation.set(-sw*0.7,-0.62,0.06);hand.scale.setScalar(TOUCH?0.34:0.42);
  handItem.position.set(hand.position.x+0.02,hand.position.y+0.08,hand.position.z);handItem.rotation.set(-sw*0.9-0.1,-0.35,0.25-sw*0.4);handItem.scale.setScalar(TOUCH?0.48:0.56);
  const ex=Math.floor(PL.x),ey=Math.floor(PL.y+EYE),ez=Math.floor(PL.z);
  caveF+=((ready&&sky(ex,ey,ez)<0.3?1:0)-caveF)*Math.min(1,dt*1.5);
  matHand.uniforms.bright.value=Math.max(0.22,Math.min(1,Math.max(sky(ex,ey,ez)*U.skyMul.value,bl(ex,ey,ez))));handItem.material.color.setScalar(matHand.uniforms.bright.value);
  const head=get(Math.floor(camera.position.x),Math.floor(camera.position.y),Math.floor(camera.position.z));
  if(isWetId(head)){U.fogColor.value.setHex(0x1d4c8a).multiplyScalar(Math.max(0.2,U.skyMul.value));U.fogNear.value=1;U.fogFar.value=24;renderer.setClearColor(U.fogColor.value);tint.style.display='block';tint.style.background='rgba(24,70,170,.3)';}
  else if(head===LAVA){U.fogColor.value.setHex(0xc84a10);U.fogNear.value=0;U.fogFar.value=4;renderer.setClearColor(0xc84a10);tint.style.display='block';tint.style.background='rgba(220,90,20,.4)';}
  else{
    const CV=[[0.0,0.78,13,40],[0.12,0.95,20,64],[0.62,1.0,26,110]][settings.cave||0];
    const lmp=lampLevel();U.caveMin.value=CV[0]*caveF*(SURV()?depthDim(PL.y):1);U.lamp.value=lmp[0];U.lampR.value=lmp[1];
    caveFogC.copy(skyC).lerp(caveDark,caveF);U.fogColor.value.copy(caveFogC);
    U.fogNear.value=lerp(Math.max(Math.min(6,FOGN),FOGN*(1-0.3*rainAmt)*(1-0.6*LWX.fog)),CV[3]*0.35,caveF);U.fogFar.value=lerp(Math.max(Math.min(38,FOGF),FOGF*(1-0.25*rainAmt)*(1-0.55*LWX.fog)),CV[3],caveF);renderer.setClearColor(caveFogC);tint.style.display='none';} // mist by land (M6h)
  cullT-=dt;if(cullT<=0){cullT=0.25;const lim=(U.fogFar.value+24)*(U.fogFar.value+24),pcx=PL.x,pcz=PL.z;
    for(let c=0;c<chunks.length;c++){const ms=chunks[c];if(!ms)continue;const x=(c%NCX)*CS+8-pcx,z=((c/NCX)|0)*CS+8-pcz,v=x*x+z*z<lim;for(const m of ms)m.visible=v;}}
  sun.position.copy(camera.position).addScaledVector(sunDir,420);sun.lookAt(camera.position);
  halo.position.copy(camera.position).addScaledVector(sunDir,410);halo.lookAt(camera.position);
  // deep in a cave the sky is hidden, so the far edge of the loaded area shows cave darkness, not the sky (M3b)
  const skyOn=caveF<0.6;dome.position.copy(camera.position);dome.visible=!isWetId(head)&&head!==LAVA&&skyOn;sun.visible=sun.visible&&skyOn;halo.visible=halo.visible&&skyOn;stars.visible=skyOn;clouds.visible=skyOn;
  moon.visible=moon.visible&&skyOn;moon.position.copy(camera.position).addScaledVector(sunDir,-420);moon.lookAt(camera.position);
  stars.position.copy(camera.position);stars.rotation.y=curT()*Math.PI*2;
  waypoints.forEach(m=>{m.material.opacity=0.28+0.1*Math.sin(now*0.003+m.position.x);});
  placeClouds(PL.x+OX,PL.z+OZ,now/1000);
  if(ready){const hit=raycast(eyePos(),camDir(),6);updBpPreview();updFillBox();if(hit&&!isTool(curId())&&!photo){selBox.visible=true;selBox.position.set(hit.x+.5,hit.y+.5,hit.z+.5);selBox.scale.setScalar(brushR*2+1);
      faceN.set(hit.px-hit.x,hit.py-hit.y,hit.pz-hit.z);
      if(faceN.lengthSq()===1&&!swapMode&&!BL[hit.id].cross){faceHi.visible=true;faceHi.position.set(hit.x+.5+faceN.x*.502,hit.y+.5+faceN.y*.502,hit.z+.5+faceN.z*.502);faceHi.lookAt(faceHi.position.x+faceN.x,faceHi.position.y+faceN.y,faceHi.position.z+faceN.z);}else faceHi.visible=false;
    }else{selBox.visible=false;faceHi.visible=false;}mmT-=dt;if(mmT<=0){mmT=0.1;drawMM();}} // the minimap redraws ten times a second
  renderer.render(scene,camera);
  fc++;ft+=dt;infoT-=dt;
  if(infoT<=0&&ready){infoT=0.25;hintTick(0.25,playing&&SURV()?raycast(eyePos(),camDir(),6):null);fps=Math.round(fc/Math.max(ft,0.001));fc=0;ft=0;
    const bx=Math.floor(PL.x),bz=Math.floor(PL.z),inside=bx>=0&&bz>=0&&bx<W&&bz<D;
    let where='';
    if(inside){const ci=bx+W*bz,yy=Math.floor(PL.y);where=(yy<hm[ci]&&!(hg[ci]>=0&&yy>hg[ci]))?(ruinAt(bx+OX,yy,bz+OZ)||(q=>q?POI_NAMES[q.tp]:(d=>d?DUNGEON_NAMES[d.kind]:(m=>m?m.name:layerName(yy,bx+OX,bz+OZ))(remainsNear(bx+OX,yy,bz+OZ)))(dungeonNear(bx+OX,yy,bz+OZ)))(poiNear(bx+OX,yy,bz+OZ))):surfaceName(bx+OX,yy,bz+OZ);
      if(where)notePlace(where,bx+OX,bz+OZ);else where=landPlaceName(bx+OX,bz+OZ); // lands and their stretches are not places
      if(where!=='Underground'&&where!=='Caves'&&where!==lastWhere&&now-lastWhereT>5000){if(lastWhere)showBiome(where);lastWhere=where;lastWhereT=now;}}
    const fms=1000/Math.max(1,fps);
    $('info').textContent=fps+' fps  '+fms.toFixed(1)+' ms (worst '+Math.round(fmax*1000)+', work '+fwork.toFixed(1)+')'+(settings.view<0?'  view '+AUTO_VIEW.far:'')+'  res '+Math.round(RES.ratio/DPR*100)+'%'+(genQ.length?'  streaming '+genQ.length:'')+navLine(bx,bz)+'\n'+where+(brushR?'\nBrush '+(brushR*2+1)+'x':'')+(gliding?'\nGliding':'')+(PL.noclip?'\nNoclip':'')+(PL.climb?'\nClimbing':'')+(primed.length?'\nKegs lit: '+primed.length:'')+infoExtra();fmax=0;}
  {const work=performance.now()-w0;fwork=fwork*0.9+work*0.1;if(ready&&playing)autoView(raw,work);}}
let lastWhere='',lastWhereT=0;
function navLine(bx,bz){
  const yy=Math.floor(PL.y),g=bx>=0&&bz>=0&&bx<W&&bz<D?ground[bx+W*bz]:yy,c=carries(323),d=carries(324);
  if(!c&&!d)return '';
  return '\n'+(c?'X '+(bx+OX)+' Z '+(bz+OZ)+', facing '+heading():'')+(c&&d?'  ':'')+(d?'Y '+yy+(yy<g-2?' ('+(g-yy)+' below the surface)':''):'');
}
function showBiome(n){const el=$('name');el.textContent=n;el.style.opacity=1;clearTimeout(nameTimer);nameTimer=setTimeout(()=>{el.style.opacity=0;},2200);}
function infoExtra(){
  const t=curT()*24,hh=Math.floor(t),mi=Math.floor((t-hh)*60);
  let s='\n'+(hh<10?'0':'')+hh+':'+(mi<10?'0':'')+mi+(rainAmt>0.3?(snowing?', snow':', rain'):'');
  let best=1e9;waypoints.forEach(m=>{const d=Math.hypot(m.position.x-PL.x,m.position.z-PL.z);if(d<best)best=d;});
  if(best<1e9)s+='\nWaystone '+Math.round(best)+' blocks';
  if(SURV()&&equip.belt&&ITEMS[equip.belt.id].lamp)s+='\nLantern: '+lampFuelText();
  return s;
}
addEventListener('resize',()=>{DPR=(d=>typeof d==='number'&&d>0?d:1)(window.devicePixelRatio);setRes(RES.ratio);renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();});
setMode(mode);$('name').style.opacity=0;saveDirty=false;
requestAnimationFrame(frame);
generate();
