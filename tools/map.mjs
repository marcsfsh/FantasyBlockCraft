// Top-down maps and cross-sections of the real generated world, for comparing generation before and after a change (D-028).
// Generates square windows of the world headlessly (the test harness) and writes PNGs:
//   <seed>-<label>-height.png   shaded relief of the ground, water blue
//   <seed>-<label>-caves.png    open cave space seen from above in four depth bands (2 x 2 panels), water blue, lava orange
//   <seed>-<label>-section.png  a vertical slice west to east through the middle (full height), and one north to south below it
//
//   npm run map                                  3 x 3 windows (672 x 672 blocks) around spawn, seed 123456789
//   node tools/map.mjs --seed=4242 --x=1500 --z=-900 --tiles=2 --label=after --out=tests/.tmp/maps
import fs from 'node:fs';import path from 'node:path';import zlib from 'node:zlib';import {spawnSync} from 'node:child_process';
import {ROOT} from './lib.mjs';
import {gameBundle,prepare} from '../tests/harness/prepare.mjs';

const args=Object.fromEntries(process.argv.slice(2).map(a=>{const m=a.match(/^--([^=]+)=?(.*)$/);return m?[m[1],m[2]]:[a,'']}));
const seed=args.seed||'123456789',tiles=Number(args.tiles||3),cx=Number(args.x||0),cz=Number(args.z||0),label=args.label||'now';
const out=path.resolve(ROOT,args.out||'tests/.tmp/maps');fs.mkdirSync(out,{recursive:true});
const data=path.join(out,seed+'-'+label+'.bin');

// Runs inside the game at the test marker: generates each window and stores, per column, the ground, the land, and the open
// cells per depth band; and the full columns along the two section lines.
const HOOK=`{
const fs=require('fs'),T=${tiles},S=W,N=T*S,X0=${cx}-Math.floor(N/2),Z0=${cz}-Math.floor(N/2);
const BANDS=[[241,SEA-6],[151,240],[61,150],[9,60]];
const gr=new Int16Array(N*N),bio=new Uint8Array(N*N),band=new Uint16Array(N*N*4),wet=new Uint8Array(N*N*4),hot=new Uint8Array(N*N*4);
const secX=new Uint16Array(N*H),secZ=new Uint16Array(N*H),midZ=Math.floor(N/2),midX=Math.floor(N/2);
for(let tz=0;tz<T;tz++)for(let tx=0;tx<T;tx++){
  regenerateAll(X0+tx*S+S/2,Z0+tz*S+S/2);while(genQ.length)processGenQ();
  for(let z=0;z<S;z++)for(let x=0;x<S;x++){
    const WX=x+OX,WZ=z+OZ,mx=WX-X0,mz=WZ-Z0;if(mx<0||mz<0||mx>=N||mz>=N)continue;const c=mx+N*mz,g=ground[x+W*z];gr[c]=g;bio[c]=biome[x+W*z];
    for(let b=0;b<4;b++){const [lo,hi]=BANDS[b];let n=0,w=0,l=0;for(let y=lo;y<=Math.min(hi,g-3);y++){const v=world[I(x,y,z)];if(v===AIR)n++;else if(v===WATER)w++;else if(v===LAVA)l++;}
      band[c*4+b]=n;wet[c*4+b]=Math.min(255,w);hot[c*4+b]=Math.min(255,l);}
    if(mz===midZ)for(let y=0;y<H;y++)secX[mx*H+y]=world[I(x,y,z)];
    if(mx===midX)for(let y=0;y<H;y++)secZ[mz*H+y]=world[I(x,y,z)];
  }
}
const hdr=new Int32Array([N,H,X0,Z0,SEA,WATER,LAVA,AIR,STONE,DEEP,BEDROCK]);
fs.writeFileSync(${JSON.stringify(data)},Buffer.concat([Buffer.from(hdr.buffer),Buffer.from(gr.buffer),Buffer.from(bio),Buffer.from(band.buffer),Buffer.from(wet),Buffer.from(hot),Buffer.from(secX.buffer),Buffer.from(secZ.buffer),Buffer.from(Uint8Array.from(SOLID))]));
__fbcDone(0);}`;
const tmp=path.join(ROOT,'tests/.tmp');fs.mkdirSync(tmp,{recursive:true});
const file=path.join(tmp,'map-'+seed+'.bundle.js');fs.writeFileSync(file,prepare(gameBundle(),HOOK,seed));
const t0=Date.now();
const p=spawnSync(process.execPath,['--max-old-space-size=6144',path.join(ROOT,'tests/harness/runner.cjs'),file],{encoding:'utf8',timeout:3600000,env:{...process.env,FBC_TIMEOUT:'3500000'}});
if(!(p.stdout||'').includes('FBC_DONE 0')){console.error('map generation failed\n'+p.stdout+p.stderr);process.exit(1);}

// ---- read the data back
const buf=fs.readFileSync(data);let o=0;const take=(n,T)=>{const a=new T(buf.buffer.slice(buf.byteOffset+o,buf.byteOffset+o+n*T.BYTES_PER_ELEMENT));o+=n*T.BYTES_PER_ELEMENT;return a;};
const [N,H,X0,Z0,SEA,WATER,LAVA,AIR,STONE,DEEP,BEDROCK]=take(11,Int32Array);
const gr=take(N*N,Int16Array),bio=take(N*N,Uint8Array),band=take(N*N*4,Uint16Array),wet=take(N*N*4,Uint8Array),hot=take(N*N*4,Uint8Array),secX=take(N*H,Uint16Array),secZ=take(N*H,Uint16Array),SOLID=take(4096,Uint8Array);

// ---- a minimal PNG writer (RGB, no dependencies)
const CRC=new Int32Array(256).map((_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c;});
const crc=b=>{let c=-1;for(const v of b)c=CRC[(c^v)&255]^(c>>>8);return (c^-1)>>>0;};
function png(name,w,h,px){const raw=Buffer.alloc((w*3+1)*h);for(let y=0;y<h;y++){raw[y*(w*3+1)]=0;px.copy(raw,y*(w*3+1)+1,y*w*3,(y+1)*w*3);}
  const chunk=(t,d)=>{const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const td=Buffer.concat([Buffer.from(t),d]),c=Buffer.alloc(4);c.writeUInt32BE(crc(td));return Buffer.concat([l,td,c]);};
  const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=2;
  fs.writeFileSync(path.join(out,name),Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',zlib.deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]));
  console.log('map '+path.relative(ROOT,path.join(out,name))+'  '+w+' x '+h);}
const cl=v=>v<0?0:v>255?255:v|0,put=(px,w,x,y,r,g,b)=>{const i=(y*w+x)*3;px[i]=cl(r);px[i+1]=cl(g);px[i+2]=cl(b);};

// height: hillshade from the north-west over an elevation tint; sea and lakes blue
{const px=Buffer.alloc(N*N*3);
  for(let z=0;z<N;z++)for(let x=0;x<N;x++){const c=x+N*z,g=gr[c];
    if(g<SEA){const d=Math.min(1,(SEA-g)/30);put(px,N,x,z,40-25*d,90-50*d,170-60*d);continue;}
    if(bio[c]===9&&g<=SEA+40){put(px,N,x,z,60,110,190);continue;}
    const gx=gr[Math.min(N-1,x+1)+N*z]-gr[Math.max(0,x-1)+N*z],gz=gr[x+N*Math.min(N-1,z+1)]-gr[x+N*Math.max(0,z-1)],sh=Math.max(0.35,Math.min(1.25,1-0.12*(gx+gz)));
    const e=Math.min(1,(g-SEA)/170),r=(90+120*e)*sh,gg=(140+60*e-60*e*e)*sh,b=(70+130*e*e)*sh;put(px,N,x,z,Math.min(255,r),Math.min(255,gg),Math.min(255,b));}
  png(seed+'-'+label+'-height.png',N,N,px);}
// caves: four panels, one per depth band; brightness = open cells in the column within the band
{const names=['y241 to the surface','y151 to 240','y61 to 150','y9 to 60'],tint=[[255,220,120],[255,160,90],[220,110,200],[140,140,255]],w=N*2+6,h=N*2+6,px=Buffer.alloc(w*h*3,40);
  for(let b=0;b<4;b++){const ox=(b%2)*(N+6),oz=(b>>1)*(N+6),[lo,hi]=b===0?[241,999]:b===1?[151,240]:b===2?[61,150]:[9,60];
    for(let z=0;z<N;z++)for(let x=0;x<N;x++){const c=x+N*z,n=band[c*4+b],wt=wet[c*4+b],lv=hot[c*4+b];
      if(lv){put(px,w,ox+x,oz+z,255,110+Math.min(100,lv*4),20);continue;}
      if(wt){put(px,w,ox+x,oz+z,40,90+Math.min(120,wt*8),230);continue;}
      const f=n?Math.min(1,0.25+Math.log2(1+n)/6):0,base=gr[c]<SEA?18:8;
      put(px,w,ox+x,oz+z,base+tint[b][0]*f,base+tint[b][1]*f,base+tint[b][2]*f);}}
  png(seed+'-'+label+'-caves.png',w,h,px);
  console.log('     panels: top left '+names[0]+', top right '+names[1]+', bottom left '+names[2]+', bottom right '+names[3]);}
// sections: rock grey (darker deeper), sky pale, water blue, lava orange, open cave black
{const w=N,h=H*2+4,px=Buffer.alloc(w*h*3,255);
  const col=(id,y)=>{if(id===AIR)return y>=SEA?[200,225,245]:[0,0,0];if(id===WATER)return [40,90,220];if(id===LAVA)return [255,120,20];if(id===BEDROCK)return [30,30,30];
    if(!SOLID[id])return [120,200,120];const d=y/H;return id===DEEP?[70+40*d,70+40*d,85+40*d]:[110+70*d,105+70*d,100+70*d];};
  for(let s=0;s<2;s++){const sec=s?secZ:secX,oy=s*(H+4);for(let x=0;x<N;x++)for(let y=0;y<H;y++){const [r,g,b]=col(sec[x*H+y],y);put(px,w,x,oy+(H-1-y),r,g,b);}
    for(let x=0;x<N;x++)for(let y=0;y<4&&s===0;y++)put(px,w,x,H+y,255,255,255);}
  png(seed+'-'+label+'-section.png',w,h,px);
  console.log('     sections: top runs west to east along Z '+(Z0+(N>>1))+', bottom north to south along X '+(X0+(N>>1))+'; area X '+X0+' to '+(X0+N-1)+', Z '+Z0+' to '+(Z0+N-1));}
fs.unlinkSync(data);
console.log('done in '+((Date.now()-t0)/1000).toFixed(0)+' s');
