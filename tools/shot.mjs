// Screenshots of the real game in headless Chromium (software WebGL), for checking what changes look like and that the
// shaders compile. Frame rates here mean nothing: the GPU is emulated on the CPU.
//
//   npm run shots                                    the standard views (SHOTS below) for seed 123456789
//   node tools/shot.mjs --seed=4242 --out=tests/.tmp/shots
//   node tools/shot.mjs --view=gate:824,330,1700,3.1,-0.6,0.3     name:X,Y,Z,yaw,pitch[,time of day 0 to 1]
//
// Uses the Playwright that is installed globally on the cloud VM (no project dependency, D-026). Builds a copy of the game
// folder with a hook at the test marker that can move the camera and finish streaming at once; the shipped game is unchanged.
// Exits with 1 on any page error or WebGL shader error.
import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';import {execSync} from 'node:child_process';
import {ROOT,css,template} from './lib.mjs';
import {gameBundle,prepare} from '../tests/harness/prepare.mjs';

const args=Object.fromEntries(process.argv.slice(2).map(a=>{const m=a.match(/^--([^=]+)=?(.*)$/);return m?[m[1],m[2]]:[a,'']}));
const seed=args.seed||'123456789',out=path.resolve(ROOT,args.out||'tests/.tmp/shots');
// The standard views: [name, X, Y, Z, yaw, pitch, time of day]. Yaw 0 looks north (towards -Z); pitch is negative looking down.
const SHOTS=[['spawn-day',0,345,40,0,-0.25,0.3],['spawn-dusk',0,345,40,2.4,-0.15,0.74],['spawn-night',0,345,40,0,0.15,0.95],
  ['mountains',-640,470,-560,2.3,-0.3,0.35],['lake-cavern',-18,82,44,0.6,-0.2,0.3],['lava-sea',70,16,-86,0.8,-0.25,0.3],
  ['gate',824,338,1736,0,-0.55,0.3],['water',60,322,60,-2.2,-0.35,0.45]];
const views=args.view?args.view.split(';').map(v=>{const [n,r]=v.split(':');return [n,...r.split(',').map(Number)];}):SHOTS;

let require;try{require=createRequire(import.meta.url);const g=execSync('npm root -g',{encoding:'utf8'}).trim();require=createRequire(path.join(g,'x.js'));require.resolve('playwright');}
catch(e){console.error('Playwright is not installed globally; tools/shot.mjs needs it (it is on the cloud VM).');process.exit(2);}
const {chromium}=require('playwright');

const HOOK=`window.__fbc={
  go(X,Y,Z,yaw,pitch,t){
    if(Math.abs(X-(OX+W/2))>40||Math.abs(Z-(OZ+D/2))>40)regenerateAll(X,Z);
    if(SURV())setMode('creative');fallTop=null;hp=20;dead=false;$('death').style.display='none';settings.view=2;drawView();
    if(!PL.fly)toggleFly();PL.x=X-OX+0.5;PL.y=Y;PL.z=Z-OZ+0.5;PL.yaw=yaw;PL.pitch=pitch;PL.vx=PL.vy=PL.vz=0;
    if(t!==undefined){settings.time='fixed';tod=t;}settings.weather=false;rainAmt=0;raining=false;
    playing=true;$('overlay').style.display='none';setPhoto(true);
    const real=performance.now;performance.now=()=>0;try{while(genQ.length||genJob)processGenQ();meshBand();for(let k=0;k<4;k++)flush();}finally{performance.now=real;}
    return {fog:FOGF,surf:MB.surf,queued:genQ.length,dirty:dirty.size};
  }
};`;
const page=template().replace('{{STYLE_BLOCK}}',()=>'<style>'+css()+'</style>')
  .replace(/<script src="[^"]*three[^"]*"><\/script>/,()=>'<script>'+fs.readFileSync(path.join(ROOT,'vendor/three.min.js'),'utf8')+'</script>')
  .replace('{{GAME_SCRIPT}}',()=>'<script>'+prepare(gameBundle(),HOOK,seed)+'</script>');
fs.mkdirSync(out,{recursive:true});const html=path.join(out,'shot-page.html');fs.writeFileSync(html,page);

const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:Number(args.w||960),height:Number(args.h||540)}});
const errors=[];p.on('pageerror',e=>errors.push('page error: '+e.message));
p.on('console',m=>{const t=m.text();if(m.type()==='error'||/shader|WebGLProgram|GL_INVALID/i.test(t))errors.push(m.type()+': '+t.slice(0,400));});
await p.goto('file://'+html);
await p.waitForFunction(()=>window.__fbc,null,{timeout:180000});
for(const [name,X,Y,Z,yaw,pitch,t] of views){
  const r=await p.evaluate(a=>window.__fbc.go(...a),[X,Y,Z,yaw,pitch,t]);
  await p.waitForTimeout(1500);
  const file=path.join(out,seed+'-'+name+'.png');await p.screenshot({path:file});
  console.log('shot '+path.relative(ROOT,file)+'  fog '+Math.round(r.fog)+(r.surf?' surface':' cave')+' mode');
}
await b.close();
if(errors.length){console.log(errors.join('\n'));process.exit(1);}
console.log('no page or shader errors');
