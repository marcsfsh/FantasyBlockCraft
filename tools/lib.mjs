// Shared build helpers. No dependencies beyond Node itself.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const rd=p=>fs.readFileSync(path.join(ROOT,p),'utf8');

export function manifest(){return JSON.parse(rd('src/js/manifest.json'));}
export function bundleJS(){const m=manifest();return m.prefix+m.files.map(f=>rd('src/js/'+f.path)).join('')+m.suffix;}
export function css(){return rd('src/css/style.css');}
export function template(){return rd('src/html/index.template.html');}

// One self-contained HTML file: styles and script inlined.
export function buildSingle(){
  return template().replace('{{STYLE_BLOCK}}',()=>'<style>'+css()+'</style>').replace('{{GAME_SCRIPT}}',()=>'<script>'+bundleJS()+'</script>');
}

// A game directory: index.html, css/, js/ and assets/ when present.
export function buildWeb(out){
  fs.rmSync(out,{recursive:true,force:true});
  fs.mkdirSync(path.join(out,'css'),{recursive:true});fs.mkdirSync(path.join(out,'js'),{recursive:true});
  fs.writeFileSync(path.join(out,'css/style.css'),css());
  fs.writeFileSync(path.join(out,'js/game.js'),bundleJS());
  const html=template().replace('{{STYLE_BLOCK}}',()=>'<link rel="stylesheet" href="css/style.css">').replace('{{GAME_SCRIPT}}',()=>'<script src="js/game.js"></script>');
  fs.writeFileSync(path.join(out,'index.html'),html);
  const assets=path.join(ROOT,'assets');if(fs.existsSync(assets))fs.cpSync(assets,path.join(out,'assets'),{recursive:true});
  const vendor=path.join(ROOT,'vendor');if(fs.existsSync(vendor))fs.cpSync(vendor,path.join(out,'vendor'),{recursive:true});
}
