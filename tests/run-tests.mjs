// Usage: node tests/run-tests.mjs [name-filter ...] [--seed=N] [--update-snapshots]
// Each tests/cases/*.test.js file is pasted into the game at the /*@test-hook*/ marker, so it runs
// inside the game's own scope right after the starting world is ready. Use assert(cond,'what').
// A case may pin its seed with a comment: // @seed 777   (several seeds, "// @seed 1 2", run it once per seed)
// snapshot('name',value) compares value with tests/snapshots/<case>.json; --update-snapshots rewrites it instead.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT} from '../tools/lib.mjs';
import {gameBundle,pinnedSeeds,prepare} from './harness/prepare.mjs';
const args=process.argv.slice(2),only=args.filter(a=>!a.startsWith('--')),seedArg=(args.find(a=>a.startsWith('--seed='))||'').split('=')[1],update=args.includes('--update-snapshots');
const dir=path.join(ROOT,'tests/cases');let files=fs.readdirSync(dir).filter(f=>f.endsWith('.test.js')).sort();
if(only.length)files=files.filter(f=>only.some(o=>f.includes(o)));
const bundle=gameBundle();
const tmp=path.join(ROOT,'tests/.tmp');fs.mkdirSync(tmp,{recursive:true});
let failed=0,runs=0;
for(const f of files){
  const code=fs.readFileSync(path.join(dir,f),'utf8'),pinned=pinnedSeeds(code),seeds=pinned.length?pinned:[seedArg||'123456789'];
  const pre="const __fails=[];const assert=(c,m)=>{if(c)console.log('PASS '+m);else{console.log('FAIL '+m);__fails.push(m);}};const info=(...a)=>console.log('INFO '+a.join(' '));const snapshot=(k,v)=>__fbcSnapshot(k,v,assert);";
  for(const seed of seeds){
    runs++;
    const src=prepare(bundle,'try{'+pre+'\n'+code+'\n;__fbcDone(__fails.length?1:0);}catch(e){console.log("FAIL exception "+(e&&e.stack||e));__fbcDone(1);}',seed);
    const file=path.join(tmp,f.replace('.test.js',(seeds.length>1?'-'+seed:'')+'.bundle.js'));fs.writeFileSync(file,src);
    const env={...process.env,FBC_SEED:seed,FBC_SNAPSHOT:path.join(ROOT,'tests/snapshots',f.replace('.test.js','.json')),FBC_UPDATE_SNAPSHOTS:update?'1':''};
    const t0=Date.now(),r=spawnSync(process.execPath,['--max-old-space-size=4096',path.join(ROOT,'tests/harness/runner.cjs'),file],{encoding:'utf8',timeout:600000,env});
    const out=(r.stdout||'')+(r.stderr||''),ok=r.status===0&&out.includes('FBC_DONE 0');if(!ok)failed++;
    console.log((ok?'ok   ':'FAIL ')+f+'  seed '+seed+'  '+((Date.now()-t0)/1000).toFixed(1)+'s');
    for(const l of out.split('\n'))if(/^(PASS|FAIL|INFO|SNAP)/.test(l))console.log('     '+l);
  }
}
console.log(failed?failed+' of '+runs+' test runs failed':'all '+files.length+' test files passed'+(runs>files.length?' ('+runs+' runs)':''));
process.exit(failed?1:0);
