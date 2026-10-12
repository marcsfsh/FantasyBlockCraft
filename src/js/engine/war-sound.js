// ---- The sound of the war (W1, D-068; Q160: "Design these sounds carefully, by hand"). All synthesized like the rest of the
// game's sound. Each people's horn and its signals (muster, advance, volley, retreat); the war cries of a charge; the din of a
// battle that grows with the fight (a bed of noise and the ring of steel on steel and on shields); and battle music on its own bus
// (`BUS_U`, the Music slider): slow war drums, a low drone and horn phrases in a minor key, rising as a battle starts and fading
// after it. The game had no music (Q57); the owner asked for it for the war.
// A horn's note: a sawtooth with a triangle an octave up through a lowpass that opens as the note speaks and closes as it dies, the
// pitch rising into the note (a brass attack); the dwarves' and the orcs' have a growl an octave down
function hornNote(f,dur,vol,delay,at,H){
  if(!AX||!settings.sound)return;const t=AX.currentTime+(delay||0),o1=AX.createOscillator(),o2=AX.createOscillator(),lp=AX.createBiquadFilter(),g=AX.createGain(),out=outAt(at);
  o1.type=H.w||'sawtooth';o2.type='triangle';o1.frequency.setValueAtTime(f*0.94,t);o1.frequency.exponentialRampToValueAtTime(f,t+0.07);o2.frequency.setValueAtTime(f*1.88,t);o2.frequency.exponentialRampToValueAtTime(f*2,t+0.07);
  const g2=AX.createGain();g2.gain.value=0.3;lp.type='lowpass';lp.Q.value=1.2;lp.frequency.setValueAtTime(H.lp*0.2,t);lp.frequency.exponentialRampToValueAtTime(H.lp,t+0.09);lp.frequency.setValueAtTime(H.lp,t+dur*0.75);lp.frequency.exponentialRampToValueAtTime(H.lp*0.3,t+dur);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+0.05);g.gain.setValueAtTime(vol*0.9,t+dur*0.7);g.gain.exponentialRampToValueAtTime(0.0001,t+dur+0.2);
  o1.connect(lp);o2.connect(g2);g2.connect(lp);
  if(H.sub){const o3=AX.createOscillator(),g3=AX.createGain();o3.type='triangle';o3.frequency.value=f/2;g3.gain.value=0.5;o3.connect(g3);g3.connect(lp);o3.start(t);o3.stop(t+dur+0.3);}
  lp.connect(g);g.connect(out);o1.start(t);o2.start(t);o1.stop(t+dur+0.3);o2.stop(t+dur+0.3);
}
// each people's horn (its three notes, its tone, how loud): the men's silver horn, the riders' long low horn, the elves' clear
// high one, the wood elves' three rising notes, the dwarves' deep horn, the orcs' war horns
const WAR_HORNS={r:{n:[392,523.25,659.25],w:'sawtooth',lp:2600,v:0.07},h:{n:[146.83,196,220],w:'sawtooth',lp:1200,v:0.09},e:{n:[440,659.25,880],w:'triangle',lp:3400,v:0.065},
  w:{n:[329.63,392,493.88],w:'triangle',lp:2800,v:0.065},d:{n:[98,110,146.83],w:'sawtooth',lp:760,v:0.1,sub:1},o:{n:[116.54,138.59,155.56],w:'sawtooth',lp:900,v:0.11,sub:1}};
// the signals: notes of the horn's three, each with its length, played one after another
const WAR_SIGNALS={muster:[[0,1.3],[1,1.9]],advance:[[0,0.32],[1,0.32],[2,1.5]],volley:[[2,0.16],[2,0.16],[2,0.55]],retreat:[[2,0.8],[1,0.8],[0,1.7]]};
function warSignal(kind,people,at){const H=WAR_HORNS[people]||WAR_HORNS.r,S=WAR_SIGNALS[kind];if(!H||!S)return;let t=0;
  for(const [i,d] of S){hornNote(H.n[i],d,H.v,t,at,H);t+=d+(kind==='volley'?0.1:0.16);}
  if(people==='o'&&kind!=='volley')AMB_EV.drums(Array.isArray(at)?at:[PL.x,PL.y,PL.z]);}
// A war cry: many voices at once from about one place (one panner for all): the hosts' a rising shout, the orcs' a falling howl,
// rough and growling, with the breath of it
function warCry(orc,n,x,y,z){
  if(!AX||!settings.sound||Math.hypot(x-PL.x,z-PL.z)>90)return;const p=panner(x,y,z);
  for(let i=0;i<n;i++){const d=Math.random()*0.6;
    if(orc){const f=90+Math.random()*80;voice(f,f*0.72,1+Math.random()*0.7,0.03,{type:Math.random()<0.5?'square':'sawtooth',form:420+Math.random()*260,q:1.6,vib:5+Math.random()*5,vd:0.08,delay:d},p);}
    else{const f=170+Math.random()*150;voice(f,f*1.18,0.8+Math.random()*0.6,0.026,{form:650+Math.random()*500,q:1.5,vib:4,vd:0.03,delay:d},p);}}
  burst(1.2,'bandpass',orc?700:1200,0.8,0.05,0.1,p);}
// ---- The din of a battle: a bed of noise whose loudness follows how many fight near the player, and the ring of steel among them
let warDinG=null,warDinT=0;
function warDin(fighters,dt){
  if(!AX||!settings.sound)return;if(!warDinG)warDinG=noiseLoop('bandpass',620,0.5,BUS_A);const n=fighters.length;
  warDinG.gain.setTargetAtTime(0.07*Math.min(1,n/45),AX.currentTime,0.8);
  warDinT-=dt;if(warDinT>0||!n)return;warDinT=Math.max(0.12,1.6/Math.min(12,n));
  const f=fighters[Math.floor(Math.random()*n)],at=[f.x,f.y+1.2,f.z];if(Math.hypot(f.x-PL.x,f.z-PL.z)>70)return;
  if(Math.random()<0.6){burst(0.05,'bandpass',2800+Math.random()*1800,7,0.05,0,at);burst(0.04,'bandpass',4200+Math.random()*1500,9,0.03,0.03,at);} // steel on steel
  else burst(0.1,'lowpass',380+Math.random()*200,1,0.06,0,at);} // a blow on a shield
// ---- Battle music (Q160): 78 beats a minute in four; war drums on the first and third beats with a pickup before the bar, a frame
// drum on the second and fourth, a roll at the end of every fourth bar when the fight is hot; a drone on A and E; every fourth bar a
// horn phrase in A minor, and when the fight is great a low choir under it. Scheduled a bar ahead on the music bus.
const WM_BEAT=60/78,WM_PHR=[[220,261.63,293.66,329.63],[329.63,293.66,261.63,220],[220,329.63,293.66,261.63,293.66,220],[196,220,261.63,246.94,220]];
const WMU={lvl:0,want:0,quietT:0,next:0,bar:0,drone:null};
function wmDrum(t,f,v){if(!BUS_U)return;const o=AX.createOscillator(),g=AX.createGain();o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*0.62,t+0.3);
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.45);o.connect(g);g.connect(BUS_U);o.start(t);o.stop(t+0.5);
  const s=AX.createBufferSource(),fl=AX.createBiquadFilter(),g2=AX.createGain();s.buffer=noiseBuf;fl.type='lowpass';fl.frequency.value=240;g2.gain.setValueAtTime(v*0.6,t);g2.gain.exponentialRampToValueAtTime(0.001,t+0.2);
  s.connect(fl);fl.connect(g2);g2.connect(BUS_U);s.start(t,Math.random());s.stop(t+0.25);}
function wmSnare(t,v,f){const s=AX.createBufferSource(),fl=AX.createBiquadFilter(),g=AX.createGain();s.buffer=noiseBuf;fl.type='bandpass';fl.frequency.value=f||1700;fl.Q.value=0.9;
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);s.connect(fl);fl.connect(g);g.connect(BUS_U);s.start(t,Math.random());s.stop(t+0.15);}
function wmHorn(f,t,dur,v){const H={w:'sawtooth',lp:1300,sub:1};const o=AX.createOscillator(),lp=AX.createBiquadFilter(),g=AX.createGain(),o3=AX.createOscillator(),g3=AX.createGain();
  o.type='sawtooth';o.frequency.setValueAtTime(f*0.95,t);o.frequency.exponentialRampToValueAtTime(f,t+0.08);o3.type='triangle';o3.frequency.value=f/2;g3.gain.value=0.5;
  lp.type='lowpass';lp.frequency.setValueAtTime(260,t);lp.frequency.exponentialRampToValueAtTime(H.lp,t+0.12);lp.frequency.setValueAtTime(H.lp,t+dur*0.7);lp.frequency.exponentialRampToValueAtTime(300,t+dur);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+0.08);g.gain.setValueAtTime(v*0.85,t+dur*0.75);g.gain.exponentialRampToValueAtTime(0.0001,t+dur+0.15);
  o.connect(lp);o3.connect(g3);g3.connect(lp);lp.connect(g);g.connect(BUS_U);o.start(t);o3.start(t);o.stop(t+dur+0.2);o3.stop(t+dur+0.2);}
function wmChoir(t,dur,v){for(const f of [110,130.81,164.81,220]){const o=AX.createOscillator(),fl=AX.createBiquadFilter(),g=AX.createGain(),l=AX.createOscillator(),lg=AX.createGain();
  o.type='sawtooth';o.frequency.value=f;l.frequency.value=4.5+Math.random();lg.gain.value=f*0.012;l.connect(lg);lg.connect(o.frequency);fl.type='bandpass';fl.frequency.value=720;fl.Q.value=2.2;
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+0.8);g.gain.setValueAtTime(v,t+dur-1);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(fl);fl.connect(g);g.connect(BUS_U);o.start(t);l.start(t);o.stop(t+dur+0.1);l.stop(t+dur+0.1);}}
function wmDroneOn(){if(WMU.drone)return;const g=AX.createGain(),lp=AX.createBiquadFilter(),l=AX.createOscillator(),lg=AX.createGain();g.gain.value=0;lp.type='lowpass';lp.frequency.value=320;l.frequency.value=0.07;lg.gain.value=120;l.connect(lg);lg.connect(lp.frequency);
  const os=[55,55.4,82.41].map(f=>{const o=AX.createOscillator();o.type='sawtooth';o.frequency.value=f;o.connect(lp);o.start();return o;});lp.connect(g);g.connect(BUS_U);l.start();WMU.drone={g:g,os:os.concat([l])};}
function wmDroneOff(){const D=WMU.drone;if(!D)return;WMU.drone=null;const t=AX.currentTime;D.g.gain.setTargetAtTime(0,t,1.2);setTimeout(()=>{for(const o of D.os)try{o.stop();}catch(e){}},6000);}
// every frame: the music's level eases toward what the fight wants; while it plays, the next bar is scheduled a little ahead
function warMusicTick(dt,fights){
  if(!AX||!settings.sound||!BUS_U)return;
  if(fights>=10){WMU.want=fights>=28?1:0.65;WMU.quietT=0;}else if((WMU.quietT+=dt)>15)WMU.want=0;
  WMU.lvl+=(WMU.want-WMU.lvl)*Math.min(1,dt*(WMU.want>WMU.lvl?0.4:0.15));
  if(WMU.lvl<0.02){if(WMU.drone)wmDroneOff();WMU.next=0;return;}
  wmDroneOn();WMU.drone.g.gain.setTargetAtTime(0.05*WMU.lvl,AX.currentTime,0.6);
  const now=AX.currentTime;if(!WMU.next||WMU.next<now)WMU.next=now+0.1;if(WMU.next-now>1.2)return;
  const t=WMU.next,b=WMU.bar++,L=WMU.lvl,B=WM_BEAT;
  wmDrum(t,66,0.32*L);wmDrum(t+2*B,62,0.26*L);if(b%2)wmDrum(t+3.5*B,70,0.16*L);wmSnare(t+B,0.06*L,240);wmSnare(t+3*B,0.06*L,240);
  if(L>0.8&&b%4===3)for(let k=0;k<6;k++)wmSnare(t+3*B+k*B/6,0.03+0.012*k,1800);
  if(b%4===0){const P=WM_PHR[(b>>2)%WM_PHR.length],d=4*B/P.length;P.forEach((f,i)=>wmHorn(f,t+i*d,i===P.length-1?d*1.6:d*0.9,0.05*L));}
  if(L>0.8&&b%8===4)wmChoir(t,8*B,0.018);
  WMU.next=t+4*B;}
// paused, the battle music and the din fall silent (they are driven from the foes' update, which stops with the game)
setInterval(()=>{if(playing||!AX)return;if(WMU.drone)wmDroneOff();WMU.lvl=WMU.want=0;WMU.next=0;if(warDinG)warDinG.gain.setTargetAtTime(0,AX.currentTime,0.3);},1000);
