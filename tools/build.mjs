// Usage: node tools/build.mjs [--single] [--web] [--three=vendor|cdn]   (no target flag builds both)
// The single file is also copied to the repository root (fantasy-blockcraft.html), which is committed with every change.
// The single file always loads three.js from the CDN; the game folder uses vendor/three.min.js unless --three=cdn.
import fs from 'node:fs';
import path from 'node:path';
import {ROOT,PLAYABLE,THREE_VERSION,buildSingle,buildWeb,playableStale} from './lib.mjs';
const a=process.argv.slice(2),three=(a.find(x=>x.startsWith('--three='))||'--three=vendor').split('=')[1],both=!a.includes('--single')&&!a.includes('--web');
if(both||a.includes('--single')){const out=path.join(ROOT,'dist/single');fs.mkdirSync(out,{recursive:true});const html=buildSingle();fs.writeFileSync(path.join(out,'fantasy-blockcraft.html'),html);console.log('single file  dist/single/fantasy-blockcraft.html  '+(html.length/1024).toFixed(0)+' KB');
  const stale=playableStale(html);if(stale)fs.writeFileSync(path.join(ROOT,PLAYABLE),html);console.log('playable     '+PLAYABLE+'  '+(stale?'updated: commit it':'unchanged'));}
if(both||a.includes('--web')){buildWeb(path.join(ROOT,'dist/web'),{three});console.log('game folder  dist/web/  (three.js '+THREE_VERSION+' from '+(three==='cdn'?'the CDN':'vendor/')+')');}
