// The land list and transition map for the owner's approval (M6a, Q134, D-039): draws the land layout of a wide square of the
// world from the real game code and writes docs/LANDS.md from the registry, so the document always matches the code.
//   docs/lands/land-map.png     the layout, one pixel per 10 blocks, each land in its colour with its number on it
//   docs/lands/legend.png       each land's number beside its colour
//   docs/LANDS.md               the land list (families, tiers, climate, signatures), the transition map, sizes and shares
//
//   npm run lands                                seed 123456789, 16000 x 16000 blocks around X 0, Z 0
//   node tools/lands.mjs --seed=4242 --size=24000 --out=tests/.tmp/lands   (writes nothing into docs/ when --out is given)
import fs from 'node:fs';import path from 'node:path';import zlib from 'node:zlib';import {spawnSync} from 'node:child_process';
import {ROOT} from './lib.mjs';
import {gameBundle,prepare} from '../tests/harness/prepare.mjs';

const args=Object.fromEntries(process.argv.slice(2).map(a=>{const m=a.match(/^--([^=]+)=?(.*)$/);return m?[m[1],m[2]]:[a,'']}));
const seed=args.seed||'123456789',size=Number(args.size||16000),px=10,N=Math.round(size/px),toDocs=!args.out;
const out=path.resolve(ROOT,args.out||'docs/lands');fs.mkdirSync(out,{recursive:true});
const tmp=path.join(ROOT,'tests/.tmp');fs.mkdirSync(tmp,{recursive:true});
const data=path.join(tmp,'lands-'+seed+'.json');

// Runs inside the game: the land of the cell under every pixel, the registry and the transition map
const HOOK=`{
const fs=require('fs'),N=${N},P=${px},X0=-${size/2},Z0=-${size/2},g=new Array(N*N),o={};
for(let j=0;j<N;j++)for(let i=0;i<N;i++)g[i+N*j]=landsAt(X0+i*P+P/2,Z0+j*P+P/2,o).area;
fs.writeFileSync(${JSON.stringify(data)},JSON.stringify({N:N,P:P,X0:X0,Z0:Z0,g:g,fam:LAND_FAM,tiers:TIERS,LS:LS,
  lands:LANDS.map(L=>({k:L.k,n:L.n,fam:L.fam,tier:L.tier,t:L.t,m:L.m,r:L.r,look:BIOMES[L.look],shown:landShown(L),built:L.built,sea:L.sea,coast:L.coast,s:L.s,never:L.never,was:L.was||'',p:L.p})),
  meet:LAND_MEET}));
__fbcDone(0);}`;
const file=path.join(tmp,'lands-'+seed+'.bundle.js');fs.writeFileSync(file,prepare(gameBundle(),HOOK,seed));
const t0=Date.now();
const p=spawnSync(process.execPath,['--max-old-space-size=6144',path.join(ROOT,'tests/harness/runner.cjs'),file],{encoding:'utf8',timeout:1800000,env:{...process.env,FBC_TIMEOUT:'1700000'}});
if(!(p.stdout||'').includes('FBC_DONE 0')){console.error('land map failed\n'+p.stdout+p.stderr);process.exit(1);}
const D=JSON.parse(fs.readFileSync(data,'utf8'));fs.unlinkSync(data);
const {g,lands,meet}=D;

// ---- colours: a hue per family, varied within it; the old lands keep the colours of the world map
const COL={sea:[52,92,150],green:[112,158,82],elder:[62,112,58],moors:[138,112,122],mtn:[150,150,156],barrow:[122,148,92],shadow:[46,76,52],
  steppe:[214,184,92],willow:[96,150,120],tundra:[214,226,236],
  autumn:[196,110,48],birch:[178,206,140],pine:[40,96,80],giant:[24,64,30],yew:[70,90,40],silver:[170,196,200],
  alpine:[150,200,120],glacier:[236,246,255],cloud:[120,170,150],karst:[176,170,150],
  chalk:[236,232,214],isles:[86,120,140],fjord:[60,80,120],blacksand:[60,56,60],kelp:[40,120,120],bog:[120,104,70],
  dry:[230,200,130],volcanic:[150,50,30],blight:[110,100,90],
  crystal:[160,120,230],glowcap:[90,200,190],petrified:[180,150,120],starfall:[90,60,130],
  farm:[200,190,110],orchard:[220,150,170],flower:[240,200,230],terrace:[170,140,90]};
const colOf=k=>COL[lands[k].k]||[255,0,255];

// ---- a minimal PNG writer (RGB) and a 3 x 5 digit font
const CRC=new Int32Array(256).map((_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c;});
const crc=b=>{let c=-1;for(const v of b)c=CRC[(c^v)&255]^(c>>>8);return (c^-1)>>>0;};
function png(name,w,h,pxs){const raw=Buffer.alloc((w*3+1)*h);for(let y=0;y<h;y++){raw[y*(w*3+1)]=0;pxs.copy(raw,y*(w*3+1)+1,y*w*3,(y+1)*w*3);}
  const chunk=(t,d)=>{const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const td=Buffer.concat([Buffer.from(t),d]),c=Buffer.alloc(4);c.writeUInt32BE(crc(td));return Buffer.concat([l,td,c]);};
  const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=2;
  fs.writeFileSync(path.join(out,name),Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]));
  console.log('wrote '+path.relative(ROOT,path.join(out,name))+'  '+w+' x '+h);}
const DIG=['111101101101111','010110010010111','111001111100111','111001111001111','101101111001001','111100111001111','111100111101111','111001001001001','111101111101111','111101111001111'];
const put=(b,w,x,y,c)=>{if(x<0||y<0||x>=w||y*w*3+x*3>=b.length)return;const i=(y*w+x)*3;b[i]=c[0];b[i+1]=c[1];b[i+2]=c[2];};
function text(b,w,x,y,s,sc,fg,bg){const cw=4*sc;x-=Math.round(s.length*cw/2);y-=Math.round(2.5*sc);
  for(let pass=0;pass<2;pass++)for(let k=0;k<s.length;k++){const d=DIG[+s[k]];for(let r=0;r<5;r++)for(let c=0;c<3;c++)if(d[r*3+c]==='1')
    for(let a=0;a<sc;a++)for(let e=0;e<sc;e++){if(pass===0){for(let u=-1;u<=1;u++)for(let v=-1;v<=1;v++)put(b,w,x+k*cw+c*sc+a+u,y+r*sc+e+v,bg);}else put(b,w,x+k*cw+c*sc+a,y+r*sc+e,fg);}}}

// ---- regions (4-connected), their area, and a label point far from their edges
const lab=new Int32Array(N*N).fill(-1),regs=[],q=new Int32Array(N*N);
for(let s=0;s<N*N;s++){if(lab[s]>=0)continue;const L=g[s];let h=0,t=0,edge=false;q[t++]=s;lab[s]=regs.length;
  while(h<t){const c=q[h++],x=c%N,z=(c-x)/N;if(x===0||z===0||x===N-1||z===N-1)edge=true;for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,zz=z+dz;if(xx<0||zz<0||xx>=N||zz>=N)continue;const k=xx+N*zz;if(lab[k]<0&&g[k]===L){lab[k]=regs.length;q[t++]=k;}}}
  regs.push({L:L,a:t,edge:edge||t*px*px<900,tip:t*px*px<900,best:-1,bd:-1});}
const tips=regs.filter(r=>r.tip).length; // corner tips where cells meet, under 30 x 30 blocks, lost in the border blend: not lands
// chamfer distance to the edge of each region
const dist=new Float32Array(N*N).fill(1e9);
for(let z=0;z<N;z++)for(let x=0;x<N;x++){const s=x+N*z;for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,zz=z+dz;if(xx<0||zz<0||xx>=N||zz>=N||lab[xx+N*zz]!==lab[s]){dist[s]=0;break;}}}
for(let z=0;z<N;z++)for(let x=0;x<N;x++){const s=x+N*z;if(x)dist[s]=Math.min(dist[s],dist[s-1]+1);if(z)dist[s]=Math.min(dist[s],dist[s-N]+1);if(x&&z)dist[s]=Math.min(dist[s],dist[s-N-1]+1.414);if(z&&x<N-1)dist[s]=Math.min(dist[s],dist[s-N+1]+1.414);}
for(let z=N-1;z>=0;z--)for(let x=N-1;x>=0;x--){const s=x+N*z;if(x<N-1)dist[s]=Math.min(dist[s],dist[s+1]+1);if(z<N-1)dist[s]=Math.min(dist[s],dist[s+N]+1);if(x<N-1&&z<N-1)dist[s]=Math.min(dist[s],dist[s+N+1]+1.414);if(z<N-1&&x)dist[s]=Math.min(dist[s],dist[s+N-1]+1.414);}
for(let s=0;s<N*N;s++){const r=regs[lab[s]];if(dist[s]>r.bd){r.bd=dist[s];r.best=s;}}

// ---- the map picture
{const b=Buffer.alloc(N*N*3);
  for(let s=0;s<N*N;s++){const x=s%N,z=(s-x)/N,c=colOf(g[s]);let k=1;
    if((x<N-1&&g[s+1]!==g[s])||(z<N-1&&g[s+N]!==g[s]))k=0.55;
    put(b,N,x,z,[c[0]*k,c[1]*k,c[2]*k]);}
  // a cross at the world's middle (X 0, Z 0) and a scale bar of 1000 blocks
  for(let k=-8;k<=8;k++){put(b,N,N/2+k,N/2,[255,0,0]);put(b,N,N/2,N/2+k,[255,0,0]);}
  for(let x=20;x<20+1000/px;x++)for(let y=N-24;y<N-20;y++)put(b,N,x,y,[0,0,0]);
  for(const r of regs){if(r.bd<8)continue;const x=r.best%N,z=(r.best-x)/N,c=colOf(r.L),light=c[0]+c[1]+c[2]>380;text(b,N,x,z,String(r.L+1),2,light?[0,0,0]:[255,255,255],light?[255,255,255]:[0,0,0]);}
  png('land-map.png',N,N,b);}
// ---- the legend: number and colour for each land, in rows of ten
{const cols=4,rows=Math.ceil(lands.length/cols),cw=150,rh=34,w=cols*cw,h=rows*rh,b=Buffer.alloc(w*h*3,255);
  lands.forEach((L,k)=>{const cx=(k%cols)*cw,cy=Math.floor(k/cols)*rh,c=colOf(k);
    for(let x=cx+60;x<cx+140;x++)for(let y=cy+6;y<cy+rh-6;y++)put(b,w,x,y,(y===cy+6||y===cy+rh-7||x===cx+60||x===cx+139)?[0,0,0]:c);
    text(b,w,cx+30,cy+rh/2,String(k+1),3,[0,0,0],[255,255,255]);});
  png('legend.png',w,h,b);}

// ---- statistics: share of the land (sea lands share of the whole), regions inside the square, and their sizes
const st=lands.map(()=>({n:0,regs:[]}));let landPix=0;
for(let s=0;s<N*N;s++){st[g[s]].n++;if(!lands[g[s]].sea)landPix++;}
for(const r of regs)if(!r.edge)st[r.L].regs.push(Math.sqrt(r.a)*px);
const med=a=>{a=a.slice().sort((x,y)=>x-y);return a.length?Math.round(a[a.length>>1]):0;};
const BANDS=['cold','cool','temperate','warm','hot'],DAMP=['dry','middling','wet'];
const rng=(r,names)=>r[0]===r[1]?names[r[0]]:names[r[0]]+' to '+names[r[1]];
const relief=r=>[r&1?'low':'',r&2?'hills':'',r&4?'high':''].filter(Boolean).join(', ');
const allInner=regs.filter(r=>!r.edge).map(r=>Math.sqrt(r.a)*px).sort((a,b)=>a-b);

if(toDocs){
  const F=Object.keys(D.fam);let md='';
  md+=`# Lands: list and transition map, for approval (M6a)\n\n`;
  md+=`Generated by \`npm run lands\` (\`tools/lands.mjs\`) from the game's land registry (\`src/js/world/lands.js\`), seed ${seed}, over ${size} x ${size} blocks around X 0, Z 0. Do not edit by hand: change the registry and run the tool again. Decision D-039; questions Q108, Q118, Q119, Q124, Q131 and Q134 in \`docs/DIRECTION_QA.md\`.\n\n`;
  md+=`**For the owner to approve before M6b starts (Q134):** the land list (families, tiers, climate), the transition map, the signature landmark and feature of each land, and the layout in the picture below. Each family's PR builds its lands' looks in the places shown here.\n\n`;
  md+=`## Open questions\n\n`;
  md+=`1. **Elder Wood and Ancient Giant Wood overlap.** Both are old, damp temperate woods. The draft keeps both: Elder Wood stays the common mixed old wood (oaks, birches, undergrowth), and Ancient Giant Wood is a rare land of giant trees over forty blocks tall. The alternative is to rework Elder Wood into Ancient Giant Wood, as the Fens become Willow Vales.\n`;
  md+=`2. **The Grey Shore and the Lake are edges, not lands.** The Grey Shore is the beach wherever land meets the sea, and lakes lie inside other lands, so neither has a size or neighbours. Coast lands (Chalk Cliffs, Fjords, Black Sand Shores) replace the grey beach along their own coasts when they are built in M6d.\n`;
  md+=`3. **Names are drafts.** Each stretch's name uses the naming style of a people (the \`p\` column). Human, halfling, elf, gnome, orc, drow and beastfolk styles are still drafts awaiting approval (Q28).\n\n`;
  md+=`## How lands are laid out\n\n`;
  md+=`- **Cells.** The world is cut into cells about ${D.LS} blocks across, each centre shifted by up to a quarter of a cell, with borders warped so they wander. Each cell takes one land.\n`;
  md+=`- **Climate.** Each cell's land is drawn from the lands that best fit the climate at its centre: warmth (cold, cool, temperate, warm, hot), damp (dry, middling, wet), relief (low, hills, high) and whether it is sea, or land beside the sea. Within the best fits the draw is weighted by tier: common ${'6'}, uncommon ${'2'}, rare ${'1'}.\n`;
  md+=`- **Common lands grow.** A cell takes a settled neighbour's land eight times in ten when that land is common and suits it (two in ten when uncommon, never when rare), so common lands spread over several cells and rare ones stay single cells.\n`;
  md+=`- **Borders blend.** Ground heights blend over about 35 blocks either side of a border (55 at the sea and moors, 110 at mountains), and the two lands mix in patches across the band.\n`;
  md+=`- **Until a land is built** it shows as the old land in the "Shown as" column, so the world stays playable and each family's PR changes only how its lands look, never where they are.\n\n`;
  md+=`## The map\n\n![Land layout](lands/land-map.png)\n\nEach number is a land from the list below; the colours are in the legend. One pixel is ${px} blocks; the red cross is X 0, Z 0 (north is up); the black bar is 1000 blocks.\n\n![Legend](lands/legend.png)\n\n`;
  md+=`## The land list\n\nShare: of all land on the map (for sea lands, of the whole map). Regions: lands wholly inside the map, with the median side of a square of the same area.\n\n`;
  md+=`| # | Land | Family | Tier | Warmth | Damp | Relief | Shown as until built | Signature landmark | Signature feature | Share | Regions (median side) |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n`;
  lands.forEach((L,k)=>{const S=st[k];md+=`| ${k+1} | ${L.n}${L.was?' (was '+L.was+')':''} | ${D.fam[L.fam]} | ${D.tiers[L.tier]} | ${rng(L.t,BANDS)} | ${L.sea?'sea':rng(L.m,DAMP)} | ${L.sea?(L.coast?'sea by the coast':'open sea'):relief(L.r)+(L.coast?', beside the sea':'')} | ${L.built?'built':L.shown} | ${L.s[0]} | ${L.s[1]} | ${(100*S.n/(L.sea?N*N:landPix)).toFixed(1)}% | ${S.regs.length} (${med(S.regs)}) |\n`;});
  md+=`\nEvery land is shown somewhere within 25600 blocks of the middle on this seed (checked by \`36-lands\`). Lands with no region inside the map above are further out.\n\n`;
  md+=`## Sizes (Q118)\n\nNo land may be smaller than 215 x 215 blocks or narrower than 115. On this map the smallest land wholly inside it is ${Math.round(allInner[0])} blocks on a side (as a square of the same area), the median ${med(allInner)}. Common lands: median ${med(regs.filter(r=>!r.edge&&lands[r.L].tier===1).map(r=>Math.sqrt(r.a)*px))}; uncommon ${med(regs.filter(r=>!r.edge&&lands[r.L].tier===2).map(r=>Math.sqrt(r.a)*px))}; rare ${med(regs.filter(r=>!r.edge&&lands[r.L].tier===3).map(r=>Math.sqrt(r.a)*px))}. Corner tips where four cells meet, under 30 x 30 blocks and lost in the border blend, are not counted as lands (${tips} on this map). The test \`36-lands\` checks width: every part of a land lies inside a 115-block circle of that land except the tips of its corners, and a few lands meet another stretch of the same kind at a narrow pinch (counted in the test's output).\n\n`;
  md+=`## The transition map (Q108)\n\nTwo lands may border each other when their warmth is at most one band apart and their damp at most one band apart, unless one of them names the other below. The sea may meet any land. The table lists, for each land, the lands it may **not** border; every other pair may meet.\n\n| # | Land | Warmth | May not border |\n|---|---|---|---|\n`;
  lands.forEach((L,k)=>{const no=lands.filter((M,j)=>!meet[k][j]).map(M=>M.n);md+=`| ${k+1} | ${L.n} | ${rng(L.t,BANDS)} | ${no.length?no.join(', '):'none'} |\n`;});
  md+=`\nOn the map every pair of neighbouring lands is allowed by this table (checked by \`36-lands\` over a wider area).\n`;
  fs.writeFileSync(path.join(ROOT,'docs/LANDS.md'),md);console.log('wrote docs/LANDS.md');
}
console.log('corner tips',tips,'; smallest land inside the map',Math.round(allInner[0]),'blocks a side; regions',allInner.length,'; done in '+((Date.now()-t0)/1000).toFixed(0)+' s');
