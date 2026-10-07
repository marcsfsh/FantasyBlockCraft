// Shared build helpers. No dependencies beyond Node itself.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const rd=p=>fs.readFileSync(path.join(ROOT,p),'utf8');

export function manifest(){return JSON.parse(rd('src/js/manifest.json'));}
export function bundleJS(){const m=manifest();return m.prefix+m.files.map(f=>rd('src/js/'+f.path)).join('')+m.suffix;}
// Syntax-check the bundle as a classic script without running it. Returns null, or a message naming the source file and line.
export function syntaxError(code=bundleJS()){
  try{new vm.Script(code,{filename:'bundle.js'});return null;}catch(e){
    const line=+((String(e.stack).match(/bundle\.js:(\d+)/)||[])[1]||0),m=manifest();let at=m.prefix.split('\n').length;
    for(const f of m.files){const n=rd('src/js/'+f.path).split('\n').length-1;if(line<at+n+1)return 'src/js/'+f.path+':'+(line-at+1)+'  '+e.message;at+=n;}
    return 'bundle line '+line+'  '+e.message;
  }
}
export function css(){return rd('src/css/style.css');}
export function template(){return rd('src/html/index.template.html');}

// three.js r128. The template loads it from this CDN address; the game folder swaps in the vendored copy.
export const THREE_VERSION='r128 (npm three@0.128.0)';
export const THREE_CDN='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
export const THREE_VENDOR='vendor/three.min.js';

// One self-contained HTML file: styles and script inlined.
export function buildSingle(){
  return template().replace('{{STYLE_BLOCK}}',()=>'<style>'+css()+'</style>').replace('{{GAME_SCRIPT}}',()=>'<script>'+bundleJS()+'</script>');
}

// A game directory: index.html, css/, js/, vendor/ and assets/ when present.
// three: 'vendor' (default) points the page at vendor/three.min.js so the folder runs offline; 'cdn' keeps the CDN tag.
export function buildWeb(out,{three='vendor'}={}){
  let page=template();
  if(three==='vendor'){
    if(!page.includes(THREE_CDN))throw new Error('The template no longer loads '+THREE_CDN+'; update THREE_CDN in tools/lib.mjs');
    if(!fs.existsSync(path.join(ROOT,THREE_VENDOR)))throw new Error(THREE_VENDOR+' is missing; see vendor/README.md');
    page=page.replace(THREE_CDN,THREE_VENDOR);
  }else if(three!=='cdn')throw new Error('buildWeb: three must be "vendor" or "cdn"');
  fs.rmSync(out,{recursive:true,force:true});
  fs.mkdirSync(path.join(out,'css'),{recursive:true});fs.mkdirSync(path.join(out,'js'),{recursive:true});
  fs.writeFileSync(path.join(out,'css/style.css'),css());
  fs.writeFileSync(path.join(out,'js/game.js'),bundleJS());
  const html=page.replace('{{STYLE_BLOCK}}',()=>'<link rel="stylesheet" href="css/style.css">').replace('{{GAME_SCRIPT}}',()=>'<script src="js/game.js"></script>');
  fs.writeFileSync(path.join(out,'index.html'),html);
  const assets=path.join(ROOT,'assets');if(fs.existsSync(assets))fs.cpSync(assets,path.join(out,'assets'),{recursive:true});
  const vendor=path.join(ROOT,'vendor');if(fs.existsSync(vendor))fs.cpSync(vendor,path.join(out,'vendor'),{recursive:true});
}
