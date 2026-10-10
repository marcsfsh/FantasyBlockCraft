// Sound, all synthesized; no music (Q57). Since M8 (D-048): effects and ambience run through their own buses under a master, each
// with a volume slider; ambient soundscapes follow the land and the layer (Q57); sounds in the world come from where they happen
// (a panner per sound, and a listener that follows the camera).
let AX=null,noiseBuf=null,rainGain=null,windGain=null,BUS_M=null,BUS_S=null,BUS_A=null;
const VOL_DEF={m:0.8,s:1,a:0.7};
function vol(k){const v=settings.vol&&settings.vol[k];return typeof v==='number'?Math.max(0,Math.min(1,v)):VOL_DEF[k];}
function setVol(k,v){settings.vol=Object.assign({},VOL_DEF,settings.vol||{});settings.vol[k]=Math.max(0,Math.min(1,+v));lsSet(SET_KEY,settings);applyVol();}
function applyVol(){if(!BUS_M)return;BUS_M.gain.value=settings.sound?vol('m'):0;BUS_S.gain.value=vol('s');BUS_A.gain.value=vol('a');}
const AMB={}; // the ambient loops: surf, rumble, lava, stream (with its panner)
function noiseLoop(type,freq,q,out){const s=AX.createBufferSource();s.buffer=noiseBuf;s.loop=true;const f=AX.createBiquadFilter();f.type=type;f.frequency.value=freq;f.Q.value=q;const g=AX.createGain();g.gain.value=0;s.connect(f);f.connect(g);g.connect(out);s.start();return g;}
function audioInit(){
  if(!settings.sound)return;
  try{
    if(!AX){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;AX=new C();const len=AX.sampleRate*1.6|0;noiseBuf=AX.createBuffer(1,len,AX.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
      BUS_M=AX.createGain();BUS_M.connect(AX.destination);BUS_S=AX.createGain();BUS_S.connect(BUS_M);BUS_A=AX.createGain();BUS_A.connect(BUS_M);
      windGain=noiseLoop('bandpass',420,0.6,BUS_A);rainGain=noiseLoop('lowpass',1300,1,BUS_A);
      AMB.surf=noiseLoop('lowpass',480,0.7,BUS_A);AMB.rumble=noiseLoop('lowpass',90,0.8,BUS_A);AMB.lava=noiseLoop('lowpass',170,1.4,BUS_A);
      AMB.pan=panner(0,0,0,BUS_A);AMB.stream=noiseLoop('bandpass',950,0.45,AMB.pan);applyVol();}
    if(AX.state==='suspended')AX.resume();
  }catch(e){AX=null;}
}
// A panner at a place in the window (local coordinates), feeding the effects bus unless told otherwise
function setPos(p,x,y,z){if(p.positionX){p.positionX.value=x;p.positionY.value=y;p.positionZ.value=z;}else if(p.setPosition)p.setPosition(x,y,z);}
function panner(x,y,z,out){const p=AX.createPanner();p.panningModel='HRTF';p.distanceModel='inverse';p.refDistance=3;p.maxDistance=80;p.rolloffFactor=1;setPos(p,x,y,z);p.connect(out||BUS_S);return p;}
// The listener stands at the eye and faces the way the camera looks; called every frame
function audioListen(){
  if(!AX)return;const L=AX.listener,e=eyePos(),d=camDir();
  if(L.positionX){L.positionX.value=e.x;L.positionY.value=e.y;L.positionZ.value=e.z;L.forwardX.value=d.x;L.forwardY.value=d.y;L.forwardZ.value=d.z;L.upX.value=0;L.upY.value=1;L.upZ.value=0;}
  else if(L.setPosition){L.setPosition(e.x,e.y,e.z);L.setOrientation(d.x,d.y,d.z,0,1,0);}
}
// where a sound goes: the effects bus, a panner made for it, or a panner a sound event already made (several notes, one place)
const outAt=at=>!at?BUS_S:at.connect?at:panner(at[0],at[1],at[2]);
function burst(dur,type,freq,q,vol,delay,at){
  if(!AX||!settings.sound)return;
  const t=AX.currentTime+(delay||0),s=AX.createBufferSource(),f=AX.createBiquadFilter(),g=AX.createGain();
  s.buffer=noiseBuf;f.type=type;f.frequency.value=freq;f.Q.value=q;
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  s.connect(f);f.connect(g);g.connect(outAt(at));s.start(t,Math.random()*Math.max(0,1.5-dur));s.stop(t+dur+0.05);
}
function tone(f0,f1,dur,vol,delay,type,at){
  if(!AX||!settings.sound)return;
  const t=AX.currentTime+(delay||0),o=AX.createOscillator(),g=AX.createGain();if(type)o.type=type;
  o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.connect(g);g.connect(outAt(at));o.start(t);o.stop(t+dur+0.05);
}
// A voice: an oscillator with vibrato through a formant filter, swelling in and fading out (the animals' calls, E1)
function voice(f0,f1,dur,vol,o,at){
  if(!AX||!settings.sound)return;o=o||{};
  const t=AX.currentTime+(o.delay||0),osc=AX.createOscillator(),f=AX.createBiquadFilter(),g=AX.createGain();osc.type=o.type||'sawtooth';
  osc.frequency.setValueAtTime(f0,t);osc.frequency.exponentialRampToValueAtTime(f1,t+dur);
  if(o.vib){const l=AX.createOscillator(),lg=AX.createGain();l.frequency.value=o.vib;lg.gain.value=f0*(o.vd||0.04);l.connect(lg);lg.connect(osc.frequency);l.start(t);l.stop(t+dur+0.05);}
  f.type='bandpass';f.frequency.value=o.form||f0*2.5;f.Q.value=o.q||1.2;
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+Math.min(0.05,dur*0.3));g.gain.setValueAtTime(vol,t+dur*0.7);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  osc.connect(f);f.connect(g);g.connect(outAt(at));osc.start(t);osc.stop(t+dur+0.05);
}
const SND={soft:[700,1.2],wood:[420,2],stone:[1900,1.5],glass:[3600,3]};
function sfxBlock(id,place,x,y,z){
  if(!AX||!settings.sound)return;
  const s=SND[BL[id].snd]||SND.stone,at=x===undefined?null:panner(x+0.5,y+0.5,z+0.5);
  burst(place?0.08:0.15,'bandpass',s[0]*(place?0.75:1)*(0.9+Math.random()*0.2),s[1],place?0.4:0.55,0,at);
  if(BL[id].snd==='glass'&&!place)burst(0.3,'highpass',5200,1,0.22,0.03,at);
}
function sfxBoom(dist,p){if(!AX||!settings.sound)return;const at=p?panner(p[0],p[1],p[2]):null,v=Math.max(0.06,1-dist/80);burst(1.4,'lowpass',420,0.7,0.95*v,0,at);burst(0.45,'lowpass',1800,0.5,0.6*v,0,at);tone(95,28,1.0,0.9*v,0,null,at);}
function buzz(ms){if(TOUCH&&navigator.vibrate&&!PAD.active)try{navigator.vibrate(ms);}catch(e){}padRumble(0.15,0.35,Math.min(160,ms*3));}
// ---- Ambient soundscapes (Q57): loops for surf, rumble, lava and running water, and sounds now and then (birds, crickets, frogs,
// gulls, drips, bubbles, far hammers, chimes, creaks), each from somewhere around the player. A profile per land and per layer.
const AMB_EV={
  bird:at=>{const f=2200+Math.random()*1400,n=2+(Math.random()*3|0);for(let i=0;i<n;i++)tone(f,f*1.25,0.07,0.05,i*0.11,null,at);},
  cricket:at=>{for(let i=0;i<4;i++)tone(4300,4250,0.025,0.018,i*0.06,'square',at);},
  frog:at=>{tone(190,120,0.14,0.09,0,'triangle',at);tone(185,115,0.14,0.08,0.22,'triangle',at);},
  gull:at=>{tone(1900,1100,0.32,0.05,0,'triangle',at);tone(1800,1000,0.28,0.04,0.4,'triangle',at);},
  drip:at=>{const f=1500+Math.random()*900;tone(f,f*0.6,0.09,0.05,0,null,at);tone(f,f*0.6,0.09,0.018,0.22,null,at);},
  bubble:at=>{tone(110,260,0.09,0.07,0,null,at);tone(140,300,0.07,0.05,0.12,null,at);},
  hammer:at=>{for(let i=0;i<3;i++){burst(0.05,'bandpass',2300,4,0.12,i*0.55,at);tone(880,860,0.25,0.025,i*0.55,null,at);}},
  chime:at=>{const f=[880,990,1175,1320][Math.random()*4|0];tone(f,f,1.4,0.03,0,null,at);tone(f*1.5,f*1.5,1.1,0.015,0.05,null,at);},
  creak:at=>{tone(150,95,0.7,0.035,0,'sawtooth',at);},
  wind:at=>{burst(1.6,'bandpass',300+Math.random()*200,0.8,0.08,0,at);}
};
// Profiles: loop levels {surf, rumble, lava, wind} and events per minute; day and night may differ
const AMB_LAND={
  wood:{day:{bird:14},night:{cricket:16,creak:1},wind:0.02},
  sea:{surf:0.22,day:{gull:5},night:{},wind:0.05},
  wet:{day:{bird:8,frog:2},night:{frog:14,cricket:8},wind:0.01},
  high:{wind:0.11,day:{wind:4},night:{wind:4}},
  dry:{wind:0.07,day:{cricket:3,wind:3},night:{cricket:8}},
  fire:{rumble:0.14,lava:0.06,day:{bubble:6},night:{bubble:6},wind:0.04},
  grey:{wind:0.04,day:{creak:2},night:{creak:3}},
  ring:{wind:0.02,day:{chime:5},night:{chime:7}}
};
const AMB_OF={sea:'sea',isles:'sea',kelp:'sea',chalk:'sea',fjord:'sea',blacksand:'sea',willow:'wet',bog:'wet',moors:'high',mtn:'high',alpine:'high',glacier:'high',tundra:'high',karst:'high',cloud:'wet',
  dry:'dry',steppe:'dry',petrified:'dry',volcanic:'fire',blight:'grey',shadow:'grey',barrow:'grey',crystal:'ring',starfall:'ring',glowcap:'ring'};
const ambLand=k=>AMB_LAND[AMB_OF[k]||'wood'];
// Underground by layer, and in the holds
function ambLayer(y,inHold,inhabited){
  if(y<14)return {rumble:0.35,lava:0.3,ev:{bubble:14,drip:2}};
  if(inHold)return inhabited?{rumble:0.06,ev:{hammer:6,drip:3}}:{rumble:0.08,ev:{drip:10,creak:1}};
  if(y<100)return {rumble:0.2,lava:0.05,ev:{drip:8,bubble:1}};
  if(y<204)return {rumble:0.12,ev:{drip:10,wind:1}};
  return {rumble:0.05,ev:{drip:6}};
}
const ambNight=()=>{const t=curT();return t<0.23||t>0.77;};
// What should be heard where the player is: loop levels and event rates per minute
function ambProfile(){
  const bx=Math.floor(PL.x),bz=Math.floor(PL.z),yy=Math.floor(PL.y),inside=bx>=0&&bz>=0&&bx<W&&bz<D,g=inside?ground[bx+W*bz]:yy;
  if(yy<g-4){const X=bx+OX,Z=bz+OZ,cx=Math.floor(X/CS),cz=Math.floor(Z/CS),hold=yy<100&&yy>=20&&ruinZone(cx,cz),L=ambLayer(yy,hold,hold&&holdNear(cx,cz).inhabited);
    return {surf:0,rumble:L.rumble||0,lava:L.lava||0,wind:0,ev:L.ev,under:true};}
  const P=ambLand(LWX.k),night=ambNight(),ev=Object.assign({},night?P.night:P.day);
  if(rainAmt>0.4)for(const k of ['bird','gull','cricket'])if(ev[k])ev[k]*=0.2;
  return {surf:P.surf||0,rumble:P.rumble||0,lava:P.lava||0,wind:(P.wind||0)*(1+Math.max(0,yy-SEA-40)/80),ev:ev,under:false};
}
// Running and lapping water near the player: how much, and where (sampled twice a second)
function waterNearby(){
  let n=0,sx=0,sy=0,sz=0;const px=Math.floor(PL.x),pz=Math.floor(PL.z);
  for(let k=0;k<40;k++){const a=k*2.4,d=2+(k%10)*1.3,x=Math.round(px+Math.cos(a)*d),z=Math.round(pz+Math.sin(a)*d);if(x<0||z<0||x>=W||z>=D)continue;
    const y=Math.min(H-2,Math.max(1,Math.floor(PL.y)));for(let dy=-4;dy<=3;dy++){const id=get(x,y+dy,z);if(id===WATER){n++;sx+=x;sy+=y+dy;sz+=z;break;}}}
  return n?{n:n,x:sx/n+0.5,y:sy/n+0.5,z:sz/n+0.5}:{n:0};
}
const AMB_STATS={ev:{}};let ambT=0,ambW={n:0};
function ambTick(dt){
  const on=!!(AX&&settings.sound&&playing);
  ambT-=dt;if(ambT<=0){ambT=0.5;AMB.cur=ambProfile();ambW=waterNearby();}
  const P=AMB.cur;if(!P)return;
  if(AX){const f=Math.min(1,dt*0.8),lv=(g,v)=>{if(g)g.gain.value+=((on?v:0)-g.gain.value)*f;};
    lv(AMB.surf,P.surf);lv(AMB.rumble,P.rumble);lv(AMB.lava,P.lava);lv(AMB.stream,Math.min(0.22,ambW.n*0.012));if(ambW.n&&AMB.pan)setPos(AMB.pan,ambW.x,ambW.y,ambW.z);}
  for(const k in P.ev){if(Math.random()<P.ev[k]/60*dt){const a=Math.random()*6.283,d=6+Math.random()*16,at=[PL.x+Math.cos(a)*d,PL.y+1+(P.under?Math.random()*6-2:2+Math.random()*6),PL.z+Math.sin(a)*d];
    AMB_STATS.ev[k]=(AMB_STATS.ev[k]||0)+1;if(on)AMB_EV[k](panner(at[0],at[1],at[2]));}}
}
