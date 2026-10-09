// Streaming spreads a chunk over several frames (M3, D-025): one generation step at a time, then light, then the map.
// The result equals generating each chunk at once, even when the window slides while a chunk is half made; and light stays exact.
while(genQ.length)processGenQ();
const ALL=[];for(let cz=0;cz<NCZ;cz++)for(let cx=0;cx<NCX;cx++)ALL.push([cx,cz]);
function chunkHash(cx,cz){let h=0x811c9dc5;for(let y=0;y<H;y++)for(let z=cz*CS;z<cz*CS+CS;z++){const r=I(cx*CS,y,z);for(let x=0;x<CS;x++){h=Math.imul(h^world[r+x],16777619);h=Math.imul(h^lvl[r+x],16777619);}}return h>>>0;}
const key=(cx,cz)=>(cx+OX/CS)+','+(cz+OZ/CS);
// a fake clock that moves 3 ms per reading, so each processGenQ call runs exactly one step
const realNow=performance.now;let fake=0;performance.now=()=>(fake+=3);
regenerateAll(3000,-1800);let frames=0,shifts=0,maxSteps=0;
while(genQ.length||genJob){processGenQ();frames++;
  if(frames===40||frames===300){shiftWindow(CS,0);shifts++;}if(frames===500){shiftWindow(0,-CS);shifts++;}}
performance.now=realNow;
const streamed=new Map();for(const [cx,cz] of ALL)streamed.set(key(cx,cz),chunkHash(cx,cz));
const lightStreamed=BLK.slice();
info('frames to stream the window one step per frame',frames,'(window slid',shifts,'times while streaming), steps per chunk',GEN_STEPS.length+2);
assert(frames>=(NCX*NCZ-49)*(GEN_STEPS.length+2)/3,'each streamed chunk took several frames (up to three steps a frame while the queue is long)');
// generate every chunk at once in a fresh window at the same place, and compare
for(const [cx,cz] of ALL)for(let y=0;y<H;y++)for(let z=cz*CS;z<cz*CS+CS;z++){const r=I(cx*CS,y,z);world.fill(0,r,r+CS);lvl.fill(0,r,r+CS);}
genDone.fill(0);for(const [cx,cz] of ALL)genChunk(cx,cz);
let same=0,diff=0;for(const [cx,cz] of ALL){if(streamed.get(key(cx,cz))===chunkHash(cx,cz))same++;else diff++;}
info('streamed chunks equal to whole-chunk generation',same,'different',diff);
assert(diff===0,'streaming step by step gives the same world, also across window slides');
lightAll();let ld=0;for(let i=0;i<VOL;i++)if(lightStreamed[i]!==BLK[i])ld++;
info('block light cells differing from a full recompute',ld);
assert(ld===0,'light streamed step by step equals a full recompute');
// how long the steps take on this machine (process time; the browser budget is 4 ms a frame)
const times=[];regenerateAll(-2600,4100);
{const job=()=>genJob;let t=process.hrtime.bigint();performance.now=()=>(fake+=3);
  while(genQ.length||genJob){const a=process.hrtime.bigint();processGenQ();times.push(Number(process.hrtime.bigint()-a)/1e6);}performance.now=realNow;}
times.sort((a,b)=>a-b);const q=p=>times[Math.min(times.length-1,Math.floor(times.length*p))].toFixed(2);
info('one streaming step: median',q(0.5),'ms, p95',q(0.95),'ms, worst',times[times.length-1].toFixed(1),'ms over',times.length,'steps');
assert(+q(0.5)<4,'a typical streaming step fits the per-frame budget');
// Travel (and respawn far away) makes only the 3 x 3 chunks around the arrival at once; the rest stream in
regenerateAll(-9000,7000);{let made=0;for(let i=0;i<NCX*NCZ;i++)if(genDone[i])made++;info('chunks made at once on travel',made,'queued',genQ.length);
  assert(made===9&&genQ.length===NCX*NCZ-9,'travel makes the 3 x 3 chunks around the arrival at once and streams the rest');}
while(genQ.length)processGenQ();lightAll();
// The explored map is capped
{const ox=OX,oz=OZ;for(let k=0;k<TILE_CAP+500;k++){OX=k*CS*CS;captureTile(0,0);}info('explored map tiles after',TILE_CAP+500,'captures:',tiles.size);OX=ox;OZ=oz;
  assert(tiles.size<=TILE_CAP,'the explored map keeps at most '+TILE_CAP+' tiles');}
