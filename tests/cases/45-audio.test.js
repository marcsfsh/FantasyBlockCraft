// Audio (M8): effects and ambience under a master, each with its own volume; soundscapes by land and layer; positional sound.
// The headless harness has no sound, so a small stand-in AudioContext records the graph the game builds.
while(genQ.length)processGenQ();
const made={panner:[],osc:0,src:0};
const P=v=>({value:v,setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){}});
const node=o=>Object.assign({connect(t){this.to=t;return t;},disconnect(){},start(){},stop(){}},o);
class FakeAudio{constructor(){this.sampleRate=8000;this.currentTime=0;this.state='running';this.destination=node({});
    this.listener={positionX:P(0),positionY:P(0),positionZ:P(0),forwardX:P(0),forwardY:P(0),forwardZ:P(-1),upX:P(0),upY:P(1),upZ:P(0)};}
  createBuffer(c,len){return {getChannelData:()=>new Float32Array(len)};}
  createGain(){return node({gain:P(1)});}createBiquadFilter(){return node({frequency:P(0),Q:P(1),type:''});}
  createBufferSource(){made.src++;return node({buffer:null,loop:false});}createOscillator(){made.osc++;return node({frequency:P(0),type:'sine'});}
  createPanner(){const p=node({positionX:P(0),positionY:P(0),positionZ:P(0)});made.panner.push(p);return p;}resume(){}}
window.AudioContext=FakeAudio;settings.sound=true;settings.vol={m:0.8,s:1,a:0.7};audioInit();
assert(AX&&BUS_M&&BUS_S.to===BUS_M&&BUS_A.to===BUS_M&&BUS_M.to===AX.destination,'effects and ambience each have a bus under the master');
assert(windGain&&rainGain&&AMB.surf&&AMB.rumble&&AMB.lava&&AMB.stream,'the ambient loops are built: wind, rain, surf, rumble, lava, running water');
// volume sliders
setVol('m',0.5);setVol('a',0.25);assert(BUS_M.gain.value===0.5&&BUS_A.gain.value===0.25&&BUS_S.gain.value===1&&settings.vol.m===0.5,'the master, effects and ambience volumes follow their sliders and are kept in the settings');
settings.sound=false;applyVol();assert(BUS_M.gain.value===0,'sound off silences everything');settings.sound=true;applyVol();
// positional sound: a block broken somewhere is heard from there, and the listener follows the eye
{const n=made.panner.length;sfxBlock(STONE,false,10,300,20);const p=made.panner[made.panner.length-1];
  assert(made.panner.length>n&&p.positionX.value===10.5&&p.positionY.value===300.5&&p.positionZ.value===20.5&&p.to===BUS_S,'a sound in the world comes through a panner where it happened, into the effects bus');
  audioListen();const e=eyePos();assert(Math.abs(AX.listener.positionX.value-e.x)<1e-6&&Math.abs(AX.listener.positionY.value-e.y)<1e-6,'the listener stands at the eye');}
// soundscapes by land and layer
{const prof=(k,y,night)=>{LWX.k=k;settings.time=night?'night':'day';PL.y=y;ambT=0;ambTick(0.01);return AMB.cur;};
  const g=ground[Math.floor(PL.x)+W*Math.floor(PL.z)];
  const wood=prof('birch',g+2),woodN=prof('birch',g+2,true),sea=prof('sea',g+2),bog=prof('bog',g+2,true),high=prof('mtn',g+2),fire=prof('volcanic',g+2);
  const cave=prof('birch',230),deep=prof('birch',60),fireB=prof('birch',8);settings.time='cycle';
  info('day woods',JSON.stringify(wood.ev),'night woods',JSON.stringify(woodN.ev),'cave',JSON.stringify(cave),'the fire below',JSON.stringify(fireB));
  assert(wood.ev.bird>0&&!woodN.ev.bird&&woodN.ev.cricket>0,'birds sing in the woods by day, crickets by night');
  assert(sea.surf>0&&sea.ev.gull>0&&bog.ev.frog>0&&high.wind>0.05&&fire.lava>0,'surf and gulls by the sea, frogs in the bogs, wind on the heights, lava in the volcanic wastes');
  assert(cave.under&&cave.ev.drip>0&&deep.rumble>cave.rumble&&fireB.lava>deep.lava,'underground: drips in the caves, a deeper rumble lower down, lava near the fire below');
  assert(Object.values(AMB_LAND).every(p=>p.day&&p.night)&&LANDS.every(L=>ambLand(L.k)),'every land has a soundscape by day and by night');}
// events fire, each from its own place around the player
{LWX.k='birch';settings.time='day';PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+2;playing=true;for(const k in AMB_STATS.ev)AMB_STATS.ev[k]=0;const n=made.panner.length;
  ambT=0;for(let i=0;i<1200;i++)ambTick(0.1);settings.time='cycle';
  info('ambient sounds in two minutes of birch wood by day',JSON.stringify(AMB_STATS.ev),'; panners',made.panner.length-n);
  assert(AMB_STATS.ev.bird>=10&&made.panner.length-n===Object.values(AMB_STATS.ev).reduce((a,b)=>a+b,0),'birds sing now and then, each song from one place around the player');}
assert(!/music/i.test(Object.keys(AMB_EV).join(' ')),'no music (Q57)');
