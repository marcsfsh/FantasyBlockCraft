// Usage: node tools/check.mjs   (npm run check)
// Builds both targets, syntax-checks what was built, then runs the smoke test. Exits non-zero on any failure.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';
import {ROOT,THREE_CDN,THREE_VENDOR,bundleJS,syntaxError} from './lib.mjs';
const step=(name,fn)=>{try{const r=fn();console.log('ok    '+name+(r?'  '+r:''));}catch(e){console.log('FAIL  '+name+'  '+e.message);process.exit(1);}};
const need=(c,m)=>{if(!c)throw new Error(m);};
const node=a=>spawnSync(process.execPath,a,{cwd:ROOT,encoding:'utf8'});
step('build both targets',()=>{const r=node(['tools/build.mjs']);need(r.status===0,r.stderr||r.stdout);return r.stdout.trim().split('\n').join('; ');});
const bundle=bundleJS(),single=path.join(ROOT,'dist/single/fantasy-blockcraft.html'),web=path.join(ROOT,'dist/web');
step('bundle syntax',()=>{const e=syntaxError(bundle);need(!e,e);});
step('single file inlines the bundle and loads three.js from the CDN',()=>{const h=fs.readFileSync(single,'utf8');need(h.includes('<script>'+bundle+'</script>'),'bundle not inlined verbatim');need(h.includes(THREE_CDN),'CDN script tag missing');return (h.length/1024).toFixed(0)+' KB';});
step('game folder script matches the bundle',()=>{need(fs.readFileSync(path.join(web,'js/game.js'),'utf8')===bundle,'dist/web/js/game.js differs from the bundle');});
step('game folder loads the vendored three.js',()=>{const h=fs.readFileSync(path.join(web,'index.html'),'utf8');need(h.includes('src="'+THREE_VENDOR+'"'),'index.html does not load '+THREE_VENDOR);need(!h.includes(THREE_CDN),'index.html still loads the CDN copy');new vm.Script(fs.readFileSync(path.join(web,THREE_VENDOR),'utf8'),{filename:THREE_VENDOR});});
const t=spawnSync(process.execPath,['tests/run-tests.mjs','smoke'],{cwd:ROOT,stdio:'inherit'});
if(t.status!==0){console.log('FAIL  smoke test');process.exit(1);}
console.log('check passed');
