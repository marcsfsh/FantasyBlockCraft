// Screenshots of the real game in headless Chromium (software WebGL), for checking what changes look like and that the
// shaders compile. Frame rates here mean nothing: the GPU is emulated on the CPU.
//
//   npm run shots                                    the standard views (SHOTS below) for seed 123456789
//   node tools/shot.mjs --seed=4242 --out=tests/.tmp/shots
//   node tools/shot.mjs --view=gate:824,330,1700,3.1,-0.6,0.3     name:X,Y,Z,yaw,pitch[,time of day 0 to 1]
//   node tools/shot.mjs --view=... --animals[=deer.s,sheep.y,horse.2,hen.w]   animals lined up in front of the camera (E1), held
//   node tools/shot.mjs --view=... --bolt     a lightning bolt strikes just before the shot (the Volcanic Wastes, D-051)
//   node tools/shot.mjs --view=... --foes[=troll,raider.a,goblin.w,ember]   foes lined up (D-052): .a winding up a blow or shot, .w walking, .z asleep;
//        a third part turns it (ember.w.90: side on), .c2 takes coat 2 (an Emberlord's fire, W7a), --far=30 stands an Emberlord further off, --near=2 the others closer
//   node tools/shot.mjs --tiles=258-269,254      atlas tiles enlarged side by side, to tiles.png (no views unless --view is given)
//   node tools/shot.mjs --view=... --army=al:70   an army at the gate of the wastes about the camera (D-067), the hosts' (al), the wastes' (orc) or both (W1),
//        marched on that many seconds before the shot
//   node tools/shot.mjs --view=... --siege=0.55,0.6,0.55   the works of the war at the gate about the camera (W2): the ram's, the mine's and the
//        walls' efforts (0 to 1), --siege=fall for the gate fallen, --siege=front for its first forward camp on the basin's floor (W5), --siege=raid for the nearest farmstead of its border burned by a raid (W6), --siege=lord for its Emberlord showing itself on the gate's wall (W7b), or --siege=dead for its lord fallen: the mountain dead and the monument on its rim (W7c)
//   --area=0|1|2 starts with the loaded area Near, Far or Farthest (224, 320, 416; D-057), --viewd=0..4 picks the view distance (Far, 2, by default)
//                                         still; after a dot: y young, s stag, d hind, a coat number, w walking, r running, g grazing, z asleep
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
  ['gate',824,338,1736,0,-0.55,0.3],['sea',119,318,-91,0.8,-0.4,0.45]];
const views=args.view?args.view.split(';').map(v=>{const [n,r]=v.split(':');return [n,...r.split(',').map(Number)];}):args.tiles!==undefined?[]:SHOTS;

let require;try{require=createRequire(import.meta.url);const g=execSync('npm root -g',{encoding:'utf8'}).trim();require=createRequire(path.join(g,'x.js'));require.resolve('playwright');}
catch(e){console.error('Playwright is not installed globally; tools/shot.mjs needs it (it is on the cloud VM).');process.exit(2);}
const {chromium}=require('playwright');

const HOOK=`window.__fbc={
  go(X,Y,Z,yaw,pitch,t){
    if(Math.abs(X-(OX+W/2))>40||Math.abs(Z-(OZ+D/2))>40)regenerateAll(X,Z);
    if(SURV())setMode('creative');fallTop=null;hp=20;dead=false;$('death').style.display='none';settings.view=${Number(args.viewd??2)};drawView();
    if(!PL.fly)toggleFly();PL.x=X-OX+0.5;PL.y=Y;PL.z=Z-OZ+0.5;PL.yaw=yaw;PL.pitch=pitch;PL.vx=PL.vy=PL.vz=0;
    if(t!==undefined){settings.time='fixed';tod=t;}settings.weather=false;rainAmt=0;raining=false;
    playing=true;$('overlay').style.display='none';setPhoto(true);landWeatherNow();
    const real=performance.now;performance.now=()=>0;try{while(genQ.length||genJob)processGenQ();meshBand();for(let k=0;k<4;k++)flush();}finally{performance.now=real;}
    return {fog:FOGF,surf:MB.surf,queued:genQ.length,dirty:dirty.size};
  },
  tiles(ts){const c=document.createElement('canvas'),s=8;c.width=ts.length*(16*s+8);c.height=16*s;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle='#7a7a7a';x.fillRect(0,0,c.width,c.height);
    ts.forEach((t,i)=>x.drawImage(atlas,(t%AC)*16,((t/AC)|0)*16,16,16,i*(16*s+8),0,16*s,16*s));return c.toDataURL();},
  bolt(){flash=0;const b=strike(false,true);b.hold=1;flash=0.2;},
  // foes in a row (or two) ahead of the camera, three-quarter on, held still: walking, winding up, asleep (D-052)
  stageFoes(kinds,sec){
    foeT=999;for(const f of [...foes])removeFoe(f);const ks=kinds.length?kinds:Object.keys(FOES),cols=Math.ceil(ks.length/2);
    const fx=-Math.sin(PL.yaw),fz=-Math.cos(PL.yaw),rx=Math.cos(PL.yaw),rz=-Math.sin(PL.yaw);
    ks.forEach((k,i)=>{const [kk,md,turn]=k.split('.'),big=FOES[kk].tall>2,huge=FOES[kk].tall>6,row=ks.length<4?0:i%2,col=ks.length<4?i:Math.floor(i/2),n=ks.length<4?ks.length:cols,side=(col-(n-1)/2)*(big?4.2:${Number(args.near||3.6)<3?1.4:2.2}),d=(huge?${Number(args.far||20)}:big?7:${Number(args.near||3.6)})+row*3;
      const x=PL.x+fx*d+rx*side,z=PL.z+fz*d+rz*side,g=ground[Math.floor(x)+W*Math.floor(z)],y=foeStand(x,PL.y<g-3?PL.y-1:g+1,z,FOES[kk].tall||2);if(y<0)return; // underground, on the floor near the camera
      const f=addFoe(kk,x,y,z,md==='z'?{st:'sleep',t:999}:/^c[0-9]/.test(md||'')?{ci:+md.slice(1)}:{});f.yaw=f.hd=PL.yaw+(turn!==undefined?+turn*Math.PI/180:((i%3)-1)*0.45);f.hold=1;if(md==='w')f.holdSp=FOES[kk].walk;if(md==='a'){f.atkK=FOES[kk].shot&&kk!=='troll'?'shot':'blow';f.holdAtk=(FOES[kk].wind||0.4)*0.35;}});
    for(let i=0;i<Math.round((sec||0.5)/0.02);i++)updFoes(0.02);return foes.length;
  },
  // an army at the gate of the wastes about the camera (D-067): the hosts' (al) or the wastes', marched on for sec seconds
  army(al,sec){const P=wasteGateAt(Math.floor(PL.x+OX),Math.floor(PL.z+OZ),200);if(!P)return -1;for(const f of [...foes])removeFoe(f);foeSpots.clear();warArmies.length=0;warClk=1e9;if(al==='both'){warArmy(P,true);warArmy(P,false);}else warArmy(P,al);
    const real=performance.now;performance.now=()=>0;try{for(let i=0;i<Math.round(sec/0.05);i++){foeT-=0.05;updFoes(0.05);}}finally{performance.now=real;}return warLive();},
  // the works of the war at the gate about the camera (W2): its efforts set (the ram, the mine, the walls, each 0 to 1) or its fall,
  // and the works made at once, the siege tower in place
  siege(spec){const P=wasteGateAt(Math.floor(PL.x+OX),Math.floor(PL.z+OZ),200);if(!P)return -1;const w=warFound(P);
    if(spec==='dead'){const R=warLord(w);if(!R)return -3;fallenLords.add(R.F.id);emberFate(w,R,'hosts',null);const [mx,mz]=emberMonumentAt({G:R.G,P:P}),gen=()=>{const real=performance.now;performance.now=()=>0;try{while(genQ.length||genJob)processGenQ();}finally{performance.now=real;}};
      regenerateAll(mx,mz);gen();PL.x=mx-OX+0.5;PL.z=mz-OZ+0.5;PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+1;for(let i=0;i<3;i++){emberAfterTick();let k=0;while(WJ.length&&k++<5000)warJobsFrame();}emberReload=0;
      const S=volcShape(R.G),dx=mx-S.cx,dz=mz-S.cz,dl=Math.hypot(dx,dz)||1;const gy=ground[mx-OX+W*(mz-OZ)];PL.x=mx-OX-dx/dl*15+0.5;PL.z=mz-OZ-dz/dl*15+0.5;PL.y=gy+9;PL.yaw=Math.atan2(-dx,-dz);PL.pitch=-0.3;landWeatherNow();
      const r2=performance.now;performance.now=()=>0;try{meshBand();for(let k=0;k<6;k++)flush();}finally{performance.now=r2;}return elOf(w).mon;}
    if(spec==='lord'){const R=warLord(w),f=R&&emberShow(w,R);updateEntities(0.01);for(let i=0;i<10;i++)updFoes(0.02);const r2=performance.now;performance.now=()=>0;try{for(let k=0;k<6;k++)flush();}finally{performance.now=r2;}return f?1:0;}
    if(spec==='raid'){let B=null;for(let k=0;k<20000&&!B;k++)B=warBorder(w);const e=B&&B.S.find(e=>e.s.k==='farm')||B&&B.S.find(e=>RAID_MAX[e.s.k]>0);if(!e)return -2;const s=e.s,R=w.rd||(warRaidsTick(),w.rd);
      R.bs.push({s:s.id,t:Math.round(warPlay),b:RAID_MAX[s.k]});const gen=X=>{const real=performance.now;performance.now=()=>0;try{while(genQ.length||genJob)processGenQ();}finally{performance.now=real;}};regenerateAll(s.X,s.Z);gen();
      raidApply(w,B,R);PL.x=s.X-OX+18.5;PL.z=s.Z-OZ+18.5;PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+10;PL.yaw=Math.atan2(18,18);PL.pitch=-0.4;
      const r2=performance.now;performance.now=()=>0;try{meshBand();for(let k=0;k<6;k++)flush();}finally{performance.now=r2;}console.log('raid: '+s.name+' at '+Math.round(s.X)+' '+Math.round(s.Z));return (w.rb||[]).length;}
    if(spec==='fall'||spec==='front'){w.b={ram:1,mine:1,walls:1,sally:1};w.f=warPlay;warFall(w,false,P);}
    if(spec==='front'){warPlay+=4000;const C=warCampAt(P,0);regenerateAll(C[0]+16,C[1]+16);const real=performance.now;performance.now=()=>0;try{while(genQ.length||genJob)processGenQ();}finally{performance.now=real;}
      for(let i=0;i<6;i++){warFrontTick(P,w);let k=0;while(WJ.length&&k++<5000)warJobsFrame();}PL.x=C[0]-OX+16.5;PL.z=C[1]-OZ+16.5;PL.y=C[3]+9;PL.yaw=Math.atan2(16,16);PL.pitch=-0.35;
      const r2=performance.now;performance.now=()=>0;try{meshBand();for(let k=0;k<6;k++)flush();}finally{performance.now=r2;}return w.ap.fc;}else{const [r,m,l]=spec.split(',').map(Number);w.b={ram:r||0,mine:m||0,walls:l||0,sally:0};w.f=warPlay;}
    for(let i=0;i<24;i++){warWorksTick(P,w);let k=0;while(WJ.length&&k++<5000)warJobsFrame();}for(const T of warTowers)T.k=1;updateEntities(0.01);
    const real=performance.now;performance.now=()=>0;try{for(let k=0;k<6;k++)flush();}finally{performance.now=real;}return edits.size;},
  // animals in two rows ahead of the camera, side on or three-quarter, still; then a few frames of their update
  stage(kinds,sec){
    for(const a of [...animals])removeAnimal(a);const ks=kinds.length?kinds:Object.keys(ANIMALS),cols=Math.ceil(ks.length/2);
    const fx=-Math.sin(PL.yaw),fz=-Math.cos(PL.yaw),rx=Math.cos(PL.yaw),rz=-Math.sin(PL.yaw),near=ks.length<3?3.2:5;
    ks.forEach((k,i)=>{const row=ks.length<3?0:i%2,col=ks.length<3?i:Math.floor(i/2),side=(col-((ks.length<3?ks.length:cols)-1)/2)*(ks.length<3?2.6:2.4),d=near+row*3.4;
      const x=PL.x+fx*d+rx*side,z=PL.z+fz*d+rz*side,y=standY(x,ground[Math.floor(x)+W*Math.floor(z)]+1,z);if(y<0)return;
      const [kk,md]=k.split('.'),o={};if(md==='y')o.young=1;else if(md==='s')o.stag=1;else if(md==='d')o.stag=0;else if(md==='w'||md==='r'||md==='g'||md==='z'){o.st={w:'walk',r:'walk',g:'graze',z:'sleep'}[md];}else if(md)o.ci=+md;
      const a=addAnimal(kk,x,y,z,o);a.yaw=PL.yaw+Math.PI/2+((i%3)-1)*0.55;a.t=99;a.hold=1;if(md==='w')a.holdSp=ANIMALS[kk].walk;if(md==='r')a.holdSp=ANIMALS[kk].run;});
    for(let i=0;i<Math.round((sec||0.5)/0.02);i++)updAnimals(0.02);return animals.length;
  }
};`
const page=template().replace('{{STYLE_BLOCK}}',()=>'<style>'+css()+'</style>')
  .replace(/<script src="[^"]*three[^"]*"><\/script>/,()=>'<script>'+fs.readFileSync(path.join(ROOT,'vendor/three.min.js'),'utf8')+'</script>')
  .replace('{{GAME_SCRIPT}}',()=>'<script>'+prepare(gameBundle(),HOOK,seed)+'</script>');
fs.mkdirSync(out,{recursive:true});const html=path.join(out,'shot-page.html');fs.writeFileSync(html,page);

const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:Number(args.w||960),height:Number(args.h||540)}});
const errors=[];p.on('pageerror',e=>errors.push('page error: '+e.message+(process.env.FBC_STACK?' '+e.stack:'')));
p.on('console',m=>{const t=m.text();if(m.type()==='error'||/shader|WebGLProgram|GL_INVALID/i.test(t))errors.push(m.type()+': '+t.slice(0,400));});
if(args.area!==undefined)await p.addInitScript(a=>{try{localStorage.setItem('blockcraft-settings-v1',JSON.stringify({area:a}));}catch(e){}},Number(args.area)); // the loaded area (D-057), read at start
await p.goto('file://'+html);
await p.waitForFunction(()=>window.__fbc,null,{timeout:180000});
if(args.tiles!==undefined){const ts=args.tiles.split(',').flatMap(r=>{const [a,b]=r.split('-').map(Number);return b===undefined?[a]:Array.from({length:b-a+1},(_,i)=>a+i);});
  const d=await p.evaluate(t=>window.__fbc.tiles(t),ts),file=path.join(out,'tiles.png');fs.writeFileSync(file,Buffer.from(d.split(',')[1],'base64'));console.log('tiles '+ts.join(',')+' to '+path.relative(ROOT,file));}
for(const [name,X,Y,Z,yaw,pitch,t] of views){
  const r=await p.evaluate(a=>window.__fbc.go(...a),[X,Y,Z,yaw,pitch,t]);
  if(args.animals!==undefined)await p.evaluate(k=>window.__fbc.stage(k?k.split(','):[],1),args.animals);
  await p.waitForTimeout(1500);
  if(args.bolt!==undefined)await p.evaluate(()=>window.__fbc.bolt());
  if(args.foes!==undefined)await p.evaluate(k=>window.__fbc.stageFoes(k?k.split(','):[],1),args.foes);
  if(args.siege!==undefined){const n=await p.evaluate(k=>window.__fbc.siege(k),args.siege);console.log('siege '+args.siege+': '+n+' edits');await p.waitForTimeout(1500);}
  if(args.army!==undefined){const [k,sec]=args.army.split(':'),n=await p.evaluate(a=>window.__fbc.army(a[0]==='both'?'both':a[0]==='al',a[1]),[k,Number(sec||60)]);console.log('army '+k+': '+n+' marching');}
  const file=path.join(out,seed+'-'+name+'.png');await p.screenshot({path:file});
  console.log('shot '+path.relative(ROOT,file)+'  fog '+Math.round(r.fog)+(r.surf?' surface':' cave')+' mode');
}
await b.close();
if(errors.length){console.log(errors.join('\n'));process.exit(1);}
console.log('no page or shader errors');
