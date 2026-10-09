// World data. Two bytes per block since M6a (Q120): block ids run 0 to 199 and from 1024 up (NID), items 200 to 1023.
const entCol=new Uint8Array(W*D),world=new Uint16Array(VOL),BLK=new Uint8Array(VOL),hm=new Int16Array(W*D),ground=new Int16Array(W*D),biome=new Uint8Array(W*D),hb=new Int16Array(W*D),hg=new Int16Array(W*D).fill(-1);
const I=(x,y,z)=>x+W*(z+D*y);
function get(x,y,z){return(x<0||z<0||y<0||x>=W||z>=D||y>=H)?0:world[x+W*(z+D*y)];}

// ---- Endless world: everything below is a pure function of world coordinates and the seed,
// so any chunk can be generated on demand and always comes out the same.
let OX=-W/2,OZ=-D/2;
function hsh(a,b,c){let h=(Math.imul(a|0,374761393)+Math.imul(b|0,668265263)+Math.imul(c|0,1274126177)+Math.imul(SEED,1442695041))|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return(h>>>0)/4294967296;}
function rngAt(a,b,c){return mkRng(1+Math.floor(hsh(a,b,c)*2147483640));}
const T={},T2={},T3={},TTP={},TP={},TGC={};
function colInfoBase(X,Z,o){
  // Lands (M6a, D-039) come from the land layout (lands.js): the weights of nearby lands by look shape the ground below, so each
  // old land keeps its look and lands blend across their borders.
  landsAt(X,Z,o);o.X=X;o.Z=Z;
  const cont=fbm2(X/480,Z/480,3,11.3),hill=fbm2(X/110,Z/110,2,37.7),rid=fbm2(X/40,Z/40,2,91.4);
  // Most land is gentle: rolling hills only where the "hilliness" field allows them
  const rough=sstep(-0.05,0.22,fbm2(X/420,Z/420,2,881.3));
  let h=SEA+6+Math.max(-0.1,cont)*34+hill*(3+9*rough); // smooth: no fine bumps outside the lands that call for them (Q91)
  const mf=o.w5;
  // Mountain ranges (Q90): long ridgelines with valleys between, saddles where a range can be crossed, and the high peaks only
  // on the ridges at the hearts of the ranges (the world is 512 tall, D-023)
  let ridge=0;
  if(mf>0){const rg=1-Math.abs(fbm2(X/230,Z/230,3,91.7)),pass=0.5+0.5*sstep(-0.3,0.3,fbm2(X/420,Z/420,1,93.1));ridge=rg*rg*rg*pass;
    h+=mf*mf*(24+46*ridge)+mf*fbm2(X/34,Z/34,2,95.3)*2.5;
    const pk=sstep(30,150,o.mdep)*sstep(0.35,0.8,ridge);if(pk>0)h+=pk*pk*(60+40*fbm2(X/170,Z/170,1,7301.3));}
  const warmF=1-o.w6,sw=o.w8,dw=o.w4+o.w7; // sw: damp, mild shadowed forest; warmF: not the cold fells
  h=h*(1-dw)+(SEA+14+hill*9+Math.abs(rid)*6)*dw; // heath moors: open uplands
  const bw=o.w7;
  if(bw>0.01)h=h*(1-bw)+(SEA+10+hill*12+cont*4)*bw; // barrow hills: smooth grassy downs
  const pw=o.w10;
  if(pw>0.01)h=h*(1-pw)+(SEA+7+hill*3+cont*5)*pw;
  const fen=o.w11; // fens: low wet ground with pools
  if(fen>0.01){const pool=fbm2(X/13,Z/13,2,4107.9)>0.1;h=h*(1-fen)+(pool&&fen>0.6?SEA-1:SEA+1+hill*1.5)*fen;}
  const fwd=o.w3/(o.w2+o.w3+1e-6); // elder wood against green hills
  const open=(1-mf)*(1-dw)*(1-pw)*(1-fen)*(1-sw)*warmF;
  h+=open*(1-fwd)*fbm2(X/80,Z/80,2,4601.3)*7;   // green hills: soft rolling swells
  h+=open*fwd*fbm2(X/56,Z/56,1,4613.1)*3.5;     // elder wood: uneven old ground
  h+=sw*fbm2(X/22,Z/22,2,4607.9)*3;             // shadowed forest: hummocks and hollows
  h+=pw*fbm2(X/140,Z/140,1,4619.7)*3;           // windswept plains: long low waves
  // Coast shapes (M6d): chalk downs stand higher; fjords cut sea inlets into their mountains
  if(o.wChalk>0)h+=o.wChalk*14;
  if(o.wDry>0)h+=o.wDry*Math.abs(fbm2(X/34,Z/22,2,8501.1))*7; // dunes in the drylands (M6e)
  if(o.wVolc>0)h+=o.wVolc*fbm2(X/60,Z/60,2,8503.3)*8; // broken volcanic ground
  if(o.wTerr>0)h=h*(1-o.wTerr)+(Math.round((h-SEA)/3)*3+SEA)*o.wTerr; // the old terraces step down their hillsides
  o.cr=false;if(o.wStar>0)h+=craterAt(X,Z,o)*o.wStar; // the crater field (M6f)
  if(o.wFjord>0){const q=Math.abs(fbm2(X/240,Z/240,2,8311.3)),ch=sstep(0.075,0.03,q)*o.wFjord;if(ch>0)h=h*(1-ch)+(SEA-14+fbm2(X/40,Z/40,1,8313.1)*3)*ch;}
  // the sea: lands fall away to its floor across the coast blend; the kelp shallows are shallow, the rocky isles rise out of it,
  // and chalk and fjord coasts keep their height to the water's edge and drop sheer
  if(o.wS>0){let sf=SEA-9-Math.abs(fbm2(X/300,Z/300,2,8301.1))*26+hill*3;const ks=o.wKelp/o.wS,is=o.wIsle/o.wS;
    if(ks>0)sf=sf*(1-ks)+(SEA-4-Math.abs(fbm2(X/90,Z/90,2,8303.3))*5)*ks;
    if(is>0){const n=fbm2(X/70,Z/70,2,8305.7),ih=n>0.08?Math.min(SEA+22,SEA-4+(n-0.08)*140):sf;sf=sf*(1-is)+Math.max(sf,ih)*is;}
    const soft=h*(1-o.wS)+sf*o.wS,cl=Math.min(1,o.wChalk+o.wFjord);
    if(cl>0){const t=0.5+fbm2(X/30,Z/30,1,8307.9)*0.15;h=soft*(1-cl)+(o.wS<t?h:sf)*cl;}else h=soft;}
  // Rivers follow valleys (Q89): they rise in the hills and never cross a range; the higher the land beside a river, the wider
  // and gentler the valley it lies in, so banks slope down to the water instead of standing as ravine walls.
  const rv2=Math.abs(fbm2(X/260,Z/260,3,511.3)),rw=0.022,relief=Math.max(0,h-SEA-3),on=(1-sstep(0.3,0.65,mf))*(1-sstep(34,60,relief)),vw=rw+Math.min(0.24,relief*0.0075);
  o.river=false;o.bank=false;
  if(on>0&&rv2<vw&&h>SEA-3){
    // the channel shelves up into its bank, and the bank slopes up to the land
    const c=Math.max(0,1-rv2/rw),bed=SEA-2-Math.round(3*c),bankH=SEA+1+(h-SEA-1)*Math.pow(sstep(rw*1.1,vw,rv2),1.3),tgt=bed+(bankH-bed)*sstep(rw*0.4,rw*1.1,rv2);
    h=h+(Math.min(h,tgt)-h)*on;o.river=on>0.5&&tgt<SEA-0.5;o.bank=!o.river&&rv2<rw*2.2&&on>0.08;}
  h=Math.max(SEA-56,Math.min(H-14,Math.round(h)));
  // The column's land decides its look; height still decides the sea, the shore and the mountain tops.
  const cold=o.tb===0,lk=LANDS[o.land].look;
  let b;
  if(lk===11&&h>=SEA-2)b=11;else if(h<SEA)b=0;else if(lk===4||lk===7)b=lk;else if(lk===5&&h>=SEA+8)b=5;else if(h<=SEA+1+Math.round(1.2+1.2*fbm2(X/40,Z/40,1,2601.3)))b=1;
  else if(lk===0||lk===5)b=cold?6:2;else b=lk;
  o.dw=dw;o.bw=bw;o.pw=pw;o.fen=fen;o.sw=sw;o.fwd=fwd;o.dn=fbm2(X/11,Z/11,1,4501.7);
  o.h=h;o.b=b;o.cold=cold;o.hill=hill;o.rid=b===5?ridge*0.6-0.1:rid;o.wet=h<SEA+3;o.mf=mf;
  o.ent=fbm2(X/70,Z/70,1,1201.7)>0.44;
  // Gorges (M6a, Q137; once the hairline ravines of M2b): fewer and wider, along a slow noise line where the land allows them.
  // The floor is at least 7 blocks wide, the walls step back in ledges of 5 to a rim 16 to 40 across, and the depth (up to about
  // 60, so some reach the crawlways, Q22) eases to nothing at the ends. None by water or the sea.
  o.rvBot=999;
  if(!o.wet&&!o.river&&o.gz>0.05){
    const gv=fbm2(X/150,Z/150,2,401.1),av=Math.abs(gv);
    if(av<0.09){ // near the line. How deep the gorge runs is read on its centre line, so its ends cut straight across it; it
      // eases out before water (rivers, the sea, low wet ground) so it never ends in a point
      const gx=(fbm2((X+2)/150,Z/150,2,401.1)-fbm2((X-2)/150,Z/150,2,401.1))/4,gzz=(fbm2(X/150,(Z+2)/150,2,401.1)-fbm2(X/150,(Z-2)/150,2,401.1))/4,g2=Math.max(1e-9,gx*gx+gzz*gzz);
      const d=av/Math.sqrt(g2),cX=X-gv*gx/g2,cZ=Z-gv*gzz/g2;landsAt(cX,cZ,TGC);
      const rf=sstep(0.24,0.4,fbm2(cX/420,cZ/420,2,433.7)+(TGC.gz-1)*0.25)*sstep(0.03,0,TGC.wS)*sstep(SEA+4,SEA+12,h)*(on>0?sstep(vw+0.01,vw+0.09,Math.abs(fbm2(cX/260,cZ/260,3,511.3))):1);
      if(rf>0){const WT=8+12*rf,WF=3.5,Dm=8+52*rf;
        if(d<WT){const p=d<WF?1:(WT-d)/(WT-WF),dep=Math.floor(Dm*Math.pow(p,0.8)/5)*5;if(dep>=5)o.rvBot=Math.max(SEA-56,h-dep);}}}}
  return o;
}
const colCache=new Map();
function colInfo(X,Z,o){
  const key=X*1048576+Z,c=colCache.get(key);
  if(c){for(const k in c)o[k]=c[k];return o;}
  colInfoCompute(X,Z,o);
  if(colCache.size>160000)colCache.clear();
  const cp={};for(const k in o)cp[k]=o[k];colCache.set(key,cp);return o;
}
const lakeC=new Map(),TL={},LG=96;
function lakeAt(X,Z){
  const gx=Math.floor(X/LG),gz=Math.floor(Z/LG),key=ckey(gx,gz);if(lakeC.has(key))return lakeC.get(key);if(lakeC.size>20000)lakeC.clear();
  let lk=null;const r=rngAt(gx,2501,gz);
  if(r()<0.4){
    const cx=gx*LG+24+(r()*48|0),cz=gz*LG+24+(r()*48|0),R=8+r()*10,b=colInfoBase(cx,cz,TL),L=b.h-1;
    if(![0,1,5,7].includes(b.b)&&!b.river&&b.rvBot===999&&b.h>=SEA+3&&b.h<=SEA+40&&(b.b!==4||r()<0.5)){
      let ok=true;for(let k=0;k<12&&ok;k++){const a=k/12*6.283;{const e=colInfoBase(cx+Math.round(Math.cos(a)*(R+3)),cz+Math.round(Math.sin(a)*(R+3)),TL);if(e.h<L||e.rvBot<999)ok=false;}}
      if(ok)lk={cx:cx,cz:cz,R:b.b===4?R*0.6:R,L:L};
    }
  }
  lakeC.set(key,lk);return lk;
}
function colInfoCompute(X,Z,o){
  colInfoBase(X,Z,o);o.lake=0;
  const lk=lakeAt(X,Z);
  if(lk){const d=Math.hypot(X-lk.cx,(Z-lk.cz)*1.15)+fbm2(X/9,Z/9,1,2503.1)*3;
    if(d<lk.R){const f=1-d/lk.R,bottom=lk.L-1-Math.round(f*f*5+f*2);if(o.h>bottom)o.h=bottom;o.lake=lk.L;o.b=0;o.wet=true;o.river=false;o.rvBot=999;o.ent=false;}
    else if(d<lk.R+5){if(o.h<lk.L)o.h=lk.L;o.rvBot=999;o.ent=false;o.wet=true;}}
  return o;
}
function carved(X,y,Z,o){return y>=o.rvBot;}
