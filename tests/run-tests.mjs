// Usage: node tests/run-tests.mjs [name-filter ...] [--seed=N]
// Each tests/cases/*.test.js file is pasted into the game at the /*@test-hook*/ marker, so it runs
// inside the game's own scope right after the starting world is ready. Use assert(cond,'what').
// A case may pin its seed with a comment: // @seed 777
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT,bundleJS} from '../tools/lib.mjs';
const args=process.argv.slice(2),only=args.filter(a=>!a.startsWith('--')),seedArg=(args.find(a=>a.startsWith('--seed='))||'').split('=')[1];
const dir=path.join(ROOT,'tests/cases');let files=fs.readdirSync(dir).filter(f=>f.endsWith('.test.js')).sort();
if(only.length)files=files.filter(f=>only.some(o=>f.includes(o)));
const bundle=bundleJS(),HOOK='/*@test-hook*/';if(!bundle.includes(HOOK))throw new Error('The /*@test-hook*/ marker is missing from the game source');
const SEED_RE=/const SEED=saved&&saved\.seed\?saved\.seed:\(nextSeed\|\|\(\(Math\.random\(\)\*2147483000\|0\)\+1\)\);/;
if(!SEED_RE.test(bundle))throw new Error('The SEED line changed; update SEED_RE in tests/run-tests.mjs');
const tmp=path.join(ROOT,'tests/.tmp');fs.mkdirSync(tmp,{recursive:true});
let failed=0;
for(const f of files){
  const code=fs.readFileSync(path.join(dir,f),'utf8'),seed=(code.match(/@seed\s+(\d+)/)||[])[1]||seedArg||'123456789';
  const pre="const __fails=[];const assert=(c,m)=>{if(c)console.log('PASS '+m);else{console.log('FAIL '+m);__fails.push(m);}};const info=(...a)=>console.log('INFO '+a.join(' '));";
  const src=bundle.replace(SEED_RE,'const SEED='+seed+';').replace(HOOK,()=>'try{'+pre+'\n'+code+'\n;__fbcDone(__fails.length?1:0);}catch(e){console.log("FAIL exception "+(e&&e.stack||e));__fbcDone(1);}');
  const file=path.join(tmp,f.replace('.test.js','.bundle.js'));fs.writeFileSync(file,src);
  const t0=Date.now(),r=spawnSync(process.execPath,['--max-old-space-size=4096',path.join(ROOT,'tests/harness/runner.cjs'),file],{encoding:'utf8',timeout:600000});
  const out=(r.stdout||'')+(r.stderr||''),ok=r.status===0&&out.includes('FBC_DONE 0');if(!ok)failed++;
  console.log((ok?'ok   ':'FAIL ')+f+'  seed '+seed+'  '+((Date.now()-t0)/1000).toFixed(1)+'s');
  for(const l of out.split('\n'))if(/^(PASS|FAIL|INFO)/.test(l))console.log('     '+l);
}
console.log(failed?failed+' test file(s) failed':'all '+files.length+' test files passed');
process.exit(failed?1:0);
