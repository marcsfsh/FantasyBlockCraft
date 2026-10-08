// World data
const entCol=new Uint8Array(W*D),world=new Uint8Array(VOL),BLK=new Uint8Array(VOL),hm=new Int16Array(W*D),ground=new Int16Array(W*D),biome=new Uint8Array(W*D),hb=new Int16Array(W*D),hg=new Int16Array(W*D).fill(-1);
const I=(x,y,z)=>x+W*(z+D*y);
function get(x,y,z){return(x<0||z<0||y<0||x>=W||z>=D||y>=H)?0:world[x+W*(z+D*y)];}

// ---- Endless world: everything below is a pure function of world coordinates and the seed,
// so any chunk can be generated on demand and always comes out the same.
let OX=-W/2,OZ=-D/2;
function hsh(a,b,c){let h=(Math.imul(a|0,374761393)+Math.imul(b|0,668265263)+Math.imul(c|0,1274126177)+Math.imul(SEED,1442695041))|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return(h>>>0)/4294967296;}
function rngAt(a,b,c){return mkRng(1+Math.floor(hsh(a,b,c)*2147483640));}
const T={},T2={},T3={},TTP={},TP={};
function colInfoBase(X,Z,o){
  const jit=fbm2(X/48,Z/48,2,977.1)*0.03+fbm2(X/9,Z/9,1,979.3)*0.005; // ragged, organic edges between lands
  const cont=fbm2(X/480,Z/480,3,11.3),hill=fbm2(X/90,Z/90,3,37.7),mtn=fbm2(X/360,Z/360,2,73.1)+jit*0.6,rid=fbm2(X/40,Z/40,2,91.4);
  const temp=fbm2(X/1100,Z/1100,2,151.9)+jit,hum=fbm2(X/900,Z/900,2,701.9)+jit;
  // Most land is gentle: rolling hills only where the "hilliness" field allows them
  const rough=sstep(-0.05,0.22,fbm2(X/420,Z/420,2,881.3));
  let h=SEA+6+cont*34+hill*(4+10*rough);
  const mf=sstep(0.08,0.32,mtn);
  h+=mf*mf*(32+18*(0.5-Math.abs(rid)));
  const pk=sstep(0.22,0.5,mtn);if(pk>0)h+=pk*pk*(70+40*fbm2(X/150,Z/150,2,7301.3)); // the high peaks at the hearts of the ranges (the world is 512 tall, D-023)
  const warmF=sstep(-0.26,-0.14,temp),sw=sstep(0.04,0.2,hum)*sstep(-0.08,0.04,temp)*(1-mf); // sw: damp, mild shadowed forest
  const dw=sstep(0.02,0.26,temp)*(1-mf)*(1-sw);
  h=h*(1-dw)+(SEA+14+hill*9+Math.abs(rid)*6)*dw; // heath moors: open uplands
  const bw=dw*sstep(-0.1,0.1,fbm2(X/420,Z/420,2,601.1));
  if(bw>0.01)h=h*(1-bw)+(SEA+10+hill*12+cont*4)*bw; // barrow hills: smooth grassy downs
  const pw=sstep(-0.02,0.16,fbm2(X/1100,Z/1100,2,3901.7))*(1-mf)*(1-dw)*warmF*(1-sw);
  if(pw>0.01)h=h*(1-pw)+(SEA+7+hill*3+cont*5)*pw;
  const fen=sstep(0.08,0.3,fbm2(X/800,Z/800,2,4101.3))*(1-mf)*(1-dw)*warmF; // fens: low wet ground with pools
  if(fen>0.01){const pool=fbm2(X/13,Z/13,2,4107.9)>0.1;h=h*(1-fen)+(pool&&fen>0.6?SEA-1:SEA+1+hill*1.5)*fen;}
  const fwd=sstep(-0.1,0.14,fbm2(X/520,Z/520,2,201.3)+jit); // elder wood against green hills
  const open=(1-mf)*(1-dw)*(1-pw)*(1-fen)*(1-sw)*warmF;
  h+=open*(1-fwd)*fbm2(X/60,Z/60,2,4601.3)*7;   // green hills: soft rolling swells
  h+=open*fwd*fbm2(X/48,Z/48,2,4613.1)*4;       // elder wood: uneven old ground
  h+=sw*fbm2(X/22,Z/22,2,4607.9)*3;             // shadowed forest: hummocks and hollows
  h+=pw*fbm2(X/140,Z/140,1,4619.7)*3;           // windswept plains: long low waves
  const rv2=Math.abs(fbm2(X/260,Z/260,3,511.3)),rw=0.022;
  o.river=false;o.bank=false;
  if(rv2<rw&&h>SEA-3){const c=1-rv2/rw,f=sstep(0,0.6,c)*(1-mf*0.85),bed=SEA-2-Math.round(3*c);h=h+(bed-h)*f;o.river=f>0.5;o.bank=f>0.08&&f<=0.5;}
  h=Math.max(SEA-56,Math.min(H-14,Math.round(h)));
  const cold=temp<-0.2;
  let b;
  if(fen>0.5&&h>=SEA-2&&!cold)b=11;else if(h<SEA)b=0;else if(dw>0.5)b=bw>0.5?7:4;else if(mf>0.8&&h>=SEA+8)b=5;else if(h<=SEA+1+Math.round(1.2+1.2*fbm2(X/40,Z/40,1,2601.3)))b=1;else if(cold)b=6;else if(sw>0.5)b=8;else if(pw>0.5)b=10;else b=fwd>0.5?3:2;
  o.dw=dw;o.bw=bw;o.pw=pw;o.fen=fen;o.sw=sw;o.fwd=fwd;o.dn=fbm2(X/11,Z/11,1,4501.7);
  o.h=h;o.b=b;o.cold=cold;o.hill=hill;o.rid=rid;o.wet=h<SEA+3;
  o.ent=fbm2(X/70,Z/70,1,1201.7)>0.44;
  const rv=Math.abs(fbm2(X/70,Z/70,2,401.1));
  o.rvBot=(!o.wet&&rv<0.008&&fbm2(X/180,Z/180,2,433.7)>0.28)?Math.max(SEA-56,h-Math.round(6+(1-rv/0.012)*22)):999;
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
    if(![0,1,5,7].includes(b.b)&&!b.river&&b.h>=SEA+3&&b.h<=SEA+40&&(b.b!==4||r()<0.5)){
      let ok=true;for(let k=0;k<12&&ok;k++){const a=k/12*6.283;if(colInfoBase(cx+Math.round(Math.cos(a)*(R+3)),cz+Math.round(Math.sin(a)*(R+3)),TL).h<L)ok=false;}
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
