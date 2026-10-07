// Sound, all synthesized
let AX=null,noiseBuf=null,rainGain=null,windGain=null,dripT=5;
function audioInit(){
  if(!settings.sound)return;
  try{
    if(!AX){AX=new(window.AudioContext||window.webkitAudioContext)();const len=AX.sampleRate*1.6|0;noiseBuf=AX.createBuffer(1,len,AX.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;}
    if(!windGain){const s=AX.createBufferSource();s.buffer=noiseBuf;s.loop=true;const f=AX.createBiquadFilter();f.type='bandpass';f.frequency.value=420;f.Q.value=0.6;windGain=AX.createGain();windGain.gain.value=0;s.connect(f);f.connect(windGain);windGain.connect(AX.destination);s.start();}
    if(!rainGain){const s=AX.createBufferSource();s.buffer=noiseBuf;s.loop=true;const f=AX.createBiquadFilter();f.type='lowpass';f.frequency.value=1300;rainGain=AX.createGain();rainGain.gain.value=0;s.connect(f);f.connect(rainGain);rainGain.connect(AX.destination);s.start();}
    if(AX.state==='suspended')AX.resume();
  }catch(e){AX=null;}
}
function burst(dur,type,freq,q,vol,delay){
  if(!AX||!settings.sound)return;
  const t=AX.currentTime+(delay||0),s=AX.createBufferSource(),f=AX.createBiquadFilter(),g=AX.createGain();
  s.buffer=noiseBuf;f.type=type;f.frequency.value=freq;f.Q.value=q;
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  s.connect(f);f.connect(g);g.connect(AX.destination);s.start(t,Math.random()*Math.max(0,1.5-dur));s.stop(t+dur+0.05);
}
function tone(f0,f1,dur,vol,delay,type){
  if(!AX||!settings.sound)return;
  const t=AX.currentTime+(delay||0),o=AX.createOscillator(),g=AX.createGain();if(type)o.type=type;
  o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.connect(g);g.connect(AX.destination);o.start(t);o.stop(t+dur+0.05);
}
const SND={soft:[700,1.2],wood:[420,2],stone:[1900,1.5],glass:[3600,3]};
function sfxBlock(id,place){
  const s=SND[BL[id].snd]||SND.stone;
  burst(place?0.08:0.15,'bandpass',s[0]*(place?0.75:1)*(0.9+Math.random()*0.2),s[1],place?0.4:0.55);
  if(BL[id].snd==='glass'&&!place)burst(0.3,'highpass',5200,1,0.22,0.03);
}
function sfxBoom(dist){const v=Math.max(0.06,1-dist/80);burst(1.4,'lowpass',420,0.7,0.95*v);burst(0.45,'lowpass',1800,0.5,0.6*v);tone(95,28,1.0,0.9*v);}
function buzz(ms){if(TOUCH&&navigator.vibrate&&!PAD.active)try{navigator.vibrate(ms);}catch(e){}padRumble(0.15,0.35,Math.min(160,ms*3));}
