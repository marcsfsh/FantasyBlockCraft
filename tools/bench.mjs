// Usage: node tools/bench.mjs [--seed=N] [--runs=N] [--json]   (npm run bench; not part of npm test)
// Headless CPU benchmark of startup, chunk generation, streaming one chunk, and chunk meshing, using the
// test harness (no rendering: three.js is stubbed, so meshing measures building vertex buffers only).
// Default seeds: 123456789 and 4242. Record results in docs/PERF.md, with the machine they were taken on.
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT} from './lib.mjs';
import {gameBundle,prepare} from '../tests/harness/prepare.mjs';
const args=process.argv.slice(2),opt=(k,d)=>(args.find(a=>a.startsWith('--'+k+'='))||'').split('=')[1]||d;
const seeds=opt('seed','123456789,4242').split(','),runs=+opt('runs','1'),json=args.includes('--json');
// Runs inside the game's scope at the /*@test-hook*/ marker, once the starting world is ready (a block, so names do not clash).
const BENCH=`{
const now=()=>Number(process.hrtime.bigint())/1e6,startup=now()-globalThis.__benchT0;
const stats=a=>{const s=a.slice().sort((x,y)=>x-y),q=p=>s[Math.min(s.length-1,Math.floor(p*s.length))];return {n:s.length,mean:+(s.reduce((x,y)=>x+y,0)/s.length).toFixed(2),median:+q(0.5).toFixed(2),p95:+q(0.95).toFixed(2),max:+s[s.length-1].toFixed(2)};};
while(genQ.length)processGenQ();
const all=[];for(let cz=0;cz<NCZ;cz++)for(let cx=0;cx<NCX;cx++)all.push([cx,cz]);
for(let k=0;k<20;k++){const [cx,cz]=all[k*7%all.length];genChunk(cx,cz);} // warm up the JIT
const gen=[];for(const [cx,cz] of all){const t=now();genChunk(cx,cz);gen.push(now()-t);}
// one streaming step as processGenQ does it: generate, light, minimap, map tile
const stream=[];for(const [cx,cz] of all){genQ.push([cx,cz]);const t=now();processGenQ();stream.push(now()-t);}
// one frame of streaming as the browser runs it (M3): a fake clock lets each processGenQ call run a single step
const step=[];{const real=performance.now;let fake=0;performance.now=()=>(fake+=3);for(const [cx,cz] of all.slice(0,24))genQ.push([cx,cz]);
  while(genQ.length||genJob){const t=now();processGenQ();step.push(now()-t);}performance.now=real;}
const inner=all.filter(([cx,cz])=>cx>0&&cz>0&&cx<NCX-1&&cz<NCZ-1);
for(let k=0;k<10;k++)buildChunk(...inner[k]);
const mesh=[];for(const [cx,cz] of inner){const t=now();buildChunk(cx,cz);mesh.push(now()-t);}
let t=now();lightAll();const light=now()-t;
console.log('BENCH '+JSON.stringify({seed:SEED,startupMs:+startup.toFixed(0),genChunk:stats(gen),streamChunk:stats(stream),streamStep:stats(step),buildChunk:stats(mesh),lightAllMs:+light.toFixed(0)}));
__fbcDone(0);}`;
const bundle=gameBundle(),tmp=path.join(ROOT,'tests/.tmp');fs.mkdirSync(tmp,{recursive:true});
const results=[];
for(const seed of seeds)for(let r=0;r<runs;r++){
  const file=path.join(tmp,'bench-'+seed+'.bundle.js');fs.writeFileSync(file,'globalThis.__benchT0=Number(process.hrtime.bigint())/1e6;\n'+prepare(bundle,BENCH,seed));
  const p=spawnSync(process.execPath,['--max-old-space-size=4096',path.join(ROOT,'tests/harness/runner.cjs'),file],{encoding:'utf8',timeout:600000});
  const line=(p.stdout||'').split('\n').find(l=>l.startsWith('BENCH '));
  if(!line){console.error('benchmark failed for seed '+seed+'\n'+p.stdout+p.stderr);process.exit(1);}
  results.push(JSON.parse(line.slice(6)));
}
const machine={node:process.version,cpu:(os.cpus()[0]||{}).model,cores:os.cpus().length,platform:os.platform()+' '+os.arch()};
if(json){console.log(JSON.stringify({machine,results},null,2));process.exit(0);}
console.log('machine  '+machine.cpu+', '+machine.cores+' cores, '+machine.platform+', Node '+machine.node);
console.log('seed        startup  genChunk mean/median/p95/max      stream 1 chunk mean/median/p95/max   stream step (one frame)              buildChunk mean/median/p95/max    lightAll');
const f=s=>(s.mean+' / '+s.median+' / '+s.p95+' / '+s.max+' ms').padEnd(36);
for(const r of results)console.log(String(r.seed).padEnd(11)+(r.startupMs+' ms').padEnd(9)+f(r.genChunk)+f(r.streamChunk)+f(r.streamStep)+f(r.buildChunk)+r.lightAllMs+' ms');
