// Usage: node tools/build.mjs [--single] [--web] [--three=vendor|cdn]   (no target flag builds both)
// The single file always loads three.js from the CDN; the game folder uses vendor/three.min.js unless --three=cdn.
import fs from 'node:fs';
import path from 'node:path';
import {ROOT,THREE_VERSION,buildSingle,buildWeb} from './lib.mjs';
const a=process.argv.slice(2),three=(a.find(x=>x.startsWith('--three='))||'--three=vendor').split('=')[1],both=!a.includes('--single')&&!a.includes('--web');
if(both||a.includes('--single')){const out=path.join(ROOT,'dist/single');fs.mkdirSync(out,{recursive:true});const html=buildSingle();fs.writeFileSync(path.join(out,'fantasy-blockcraft.html'),html);console.log('single file  dist/single/fantasy-blockcraft.html  '+(html.length/1024).toFixed(0)+' KB');}
if(both||a.includes('--web')){buildWeb(path.join(ROOT,'dist/web'),{three});console.log('game folder  dist/web/  (three.js '+THREE_VERSION+' from '+(three==='cdn'?'the CDN':'vendor/')+')');}
