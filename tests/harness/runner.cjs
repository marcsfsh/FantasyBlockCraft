// Runs one prepared game bundle headlessly: the DOM, three.js and audio are replaced by
// do-nothing stand-ins, so world generation, lighting, meshing and game logic all run for real.
const mk=()=>{const f=function(){};return new Proxy(f,{get:(t,k)=>{if(k===Symbol.toPrimitive)return()=>1;if(k==='then')return undefined;if(k==='length')return 0;if(k==='matches')return false;if(k==='data')return t.__d||(t.__d=new Uint8ClampedArray(128*128*4));if(k==='forEach')return()=>{};if(k==='getChannelData')return()=>new Float32Array(10);if(k==='querySelectorAll')return()=>[];return t[k]!==undefined?t[k]:(t[k]=mk());},set:(t,k,v)=>{t[k]=v;return true},apply:()=>mk(),construct:()=>mk()});};
global.window=mk();global.document=mk();global.THREE=mk();global.localStorage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
global.addEventListener=()=>{};global.innerWidth=800;global.innerHeight=600;global.requestAnimationFrame=()=>{};global.performance={now:()=>0};global.navigator={};global.location={};
global.setInterval=()=>{};
global.__fbcDone=code=>{console.log('FBC_DONE '+code);process.exit(code);};
setTimeout(()=>{console.log('FAIL timed out before the world was ready');process.exit(1);},Number(process.env.FBC_TIMEOUT||540000));
process.on('unhandledRejection',e=>{console.log('FAIL unhandled rejection '+(e&&e.stack||e));process.exit(1);});
const src=require('fs').readFileSync(process.argv[2],'utf8');
try{eval(src);}catch(e){console.log('FAIL load error '+e.stack.split('\n').slice(0,4).join(' | '));process.exit(1);}
