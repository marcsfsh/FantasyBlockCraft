// Runs one prepared game bundle headlessly: the DOM, three.js and audio are replaced by
// do-nothing stand-ins, so world generation, lighting, meshing and game logic all run for real.
const mk=()=>{const f=function(){};return new Proxy(f,{get:(t,k)=>{if(k===Symbol.toPrimitive)return()=>1;if(k==='then')return undefined;if(k==='length')return 0;if(k==='matches')return false;if(k==='data')return t.__d||(t.__d=new Uint8ClampedArray(128*128*4));if(k==='forEach')return()=>{};if(k==='getChannelData')return()=>new Float32Array(10);if(k==='querySelectorAll')return()=>[];return t[k]!==undefined?t[k]:(t[k]=mk());},set:(t,k,v)=>{t[k]=v;return true},apply:()=>mk(),construct:()=>mk()});};
global.window=mk();global.document=mk();global.THREE=mk();global.localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
global.addEventListener=()=>{};global.innerWidth=800;global.innerHeight=600;global.requestAnimationFrame=()=>{};global.performance={now:()=>0};global.navigator={};global.location={};
global.setInterval=()=>{};
// snapshot(name,value): compare with tests/snapshots/<case>.json under this seed, or record it with --update-snapshots
const SNAP_FILE=process.env.FBC_SNAPSHOT,SNAP_SEED=process.env.FBC_SEED,SNAP_UPDATE=!!process.env.FBC_UPDATE_SNAPSHOTS,snapNew={};
const snapAll=()=>{try{return JSON.parse(require('fs').readFileSync(SNAP_FILE,'utf8'));}catch(e){return {};}};
global.__fbcSnapshot=(k,v,assert)=>{const old=(snapAll()[SNAP_SEED]||{})[k];
  if(SNAP_UPDATE){snapNew[k]=v;console.log('SNAP '+k+(old===undefined?' recorded ':old===v?' unchanged ':' changed '+JSON.stringify(old)+' -> ')+JSON.stringify(v));return;}
  if(old===undefined){assert(false,'snapshot '+k+' has no recorded value for seed '+SNAP_SEED+' (see docs/TESTING.md: updating snapshots)');return;}
  assert(old===v,'snapshot '+k+(old===v?' matches':' changed: recorded '+JSON.stringify(old)+', now '+JSON.stringify(v)));};
const snapWrite=()=>{if(!SNAP_UPDATE||!Object.keys(snapNew).length)return;const all=snapAll();all[SNAP_SEED]=Object.assign(all[SNAP_SEED]||{},snapNew);
  const sorted={};for(const s of Object.keys(all).sort())sorted[s]=all[s];require('fs').writeFileSync(SNAP_FILE,JSON.stringify(sorted,null,2)+'\n');};
global.__fbcDone=code=>{snapWrite();console.log('FBC_DONE '+code);process.exit(code);};
setTimeout(()=>{console.log('FAIL timed out before the world was ready');process.exit(1);},Number(process.env.FBC_TIMEOUT||540000));
process.on('unhandledRejection',e=>{console.log('FAIL unhandled rejection '+(e&&e.stack||e));process.exit(1);});
const src=require('fs').readFileSync(process.argv[2],'utf8');
try{eval(src);}catch(e){console.log('FAIL load error '+e.stack.split('\n').slice(0,4).join(' | '));process.exit(1);}
