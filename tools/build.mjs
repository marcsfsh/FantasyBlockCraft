// Usage: node tools/build.mjs [--single] [--web]   (no flag builds both)
import fs from 'node:fs';
import path from 'node:path';
import {ROOT,buildSingle,buildWeb} from './lib.mjs';
const a=process.argv.slice(2),both=!a.includes('--single')&&!a.includes('--web');
if(both||a.includes('--single')){const out=path.join(ROOT,'dist/single');fs.mkdirSync(out,{recursive:true});const html=buildSingle();fs.writeFileSync(path.join(out,'fantasy-blockcraft.html'),html);console.log('single file  dist/single/fantasy-blockcraft.html  '+(html.length/1024).toFixed(0)+' KB');}
if(both||a.includes('--web')){buildWeb(path.join(ROOT,'dist/web'));console.log('game folder  dist/web/');}
