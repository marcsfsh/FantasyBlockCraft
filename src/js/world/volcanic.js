// ---- The Volcanic Wastes remade (D-051): a burnt land under a black and red sky. Volcanoes rise out of the terrain itself, each
// with a crater holding a lake of lava that spills through a breach in its rim and runs down channels in the flanks; older
// flows lie cooled to glowing crust across the plains; fissures split the ground to fire; the rivers run with lava, cooled to
// obsidian where they meet the water of other lands. The ground is black ash and cinder, with charred trees (some still
// smouldering), basalt spires, obsidian shards and fumaroles ringed with sulphur. All pure functions of the seed.
const VOLC_C=140,volcCandC=new Map(),volcC=new Map(),greatC=new Map(),greatNC=new Map(),TVC={},TVC2={};let volcSkip=false;
// ---- The great volcano (D-054, D-055, D-067): every basin of the wastes has one, near its middle, far larger than the rest,
// the seat of an Emberlord's fortress, rising from the sunken floor high over the ring of ash mountains about it. Placed where
// the floor holds its whole foot with room to spare (the widest that fits, searched first a short way on from the foot of its
// gate's road toward the basin's middle, within 180 and then 360 for the widest and within 180 for the rest, so the way from the
// gate is short: D-083; else from the middle), clear of the way down from its gate (wasteGateOf); its lesser cones about its
// foot. A basin of several stretches has one all the same, in its chief stretch's name (wasteBasin).
const GREAT_R=[250,225,200,175,150,125];
function greatOf(c){
  const key=landKey(c.i,c.j);if(greatC.has(key))return greatC.get(key);let v=null;greatC.set(key,null);
  if(LANDS[cellLand(c)].k==='volcanic'){const B=wasteBasin(c),ch=B.chief;
    if(ch.i===c.i&&ch.j===c.j){const P=wasteGateOf(B),ft=P&&P.ramp.pts[P.ramp.pts.length-1]; // (near the foot of its gate's road, a short way on: D-083)
      if(ft){const ex=B.cx-ft[0],ez=B.cz-ft[1],el=Math.hypot(ex,ez)||1;const at=(R,m)=>{const d=R*1.3+90;return greatTry(c,R,ft[0]+ex/el*d,ft[1]+ez/el*d,[],B,m);};
        for(const [m,big] of [[180,1],[360,1],[180,0]]){for(const R of GREAT_R)if((R>=200)===!!big){v=at(R,m);if(v)break;}if(v)break;}}
      if(!v)for(const R of GREAT_R){v=greatTry(c,R,B.cx,B.cz,[],B);if(v)break;}}}
  greatC.set(key,v);return v;
}
// Is a disc of radius m about (X,Z) on the floor of a basin, and not over the sea?
function onFloor(X,Z,m,k){landsAt(X,Z,TVC);if(TVC.bs>-m-8||TVC.wVolc<0.95)return false;
  for(let q=0;q<k;q++){const a=q*6.2832/k;landsAt(X+Math.round(Math.cos(a)*m),Z+Math.round(Math.sin(a)*m),TVC2);if(TVC2.bs>-8)return false;}return true;}
function greatTry(c,R,cx,cz,G,B,maxd){
  const foot=Math.round(R*1.3)+40;
  for(let k=0;k<40;k++){const a=k*2.4,d=k?k*9:0;if(maxd&&d>maxd)break;const X=Math.round(cx+Math.cos(a)*d),Z=Math.round(cz+Math.sin(a)*d);
    if(G.some(g=>Math.hypot(g.X-X,g.Z-Z)<(g.R+R)*1.3+24))continue;if(!onFloor(X,Z,foot,16))continue;if(B&&wasteGateKeep(B,X,Z,foot+16))continue;
    volcSkip=true;try{const o={};colInfoBase(X,Z,o);if(o.h<o.sl+2||o.river||o.rvBot!==999)continue;
      const r=rngAt(c.i,9131,c.j),Hv=Math.min(H-30-o.h,Math.round(R*(0.95+r()*0.15))),rc=Math.round(R*0.14)+5,cd=12+Math.floor(r()*6);
      const fl=[],nf=4+Math.floor(r()*3),a0=r()*6.283;for(let q=0;q<nf;q++)fl.push({a:a0+q*6.283/nf+(r()-0.5)*0.6,len:0.85+r()*0.4});const old=[];for(let q=0;q<5;q++)old.push(r()*6.283);
      const v={great:1,key:'g'+c.i+','+c.j,i:c.i,j:c.j,X:X,Z:Z,R:R,pri:2,base:o.h,Hv:Hv,rc:rc,cd:cd,rimTop:o.h+Hv,lake:o.h+Hv-cd,fl:fl,old:old,name:'The Burning Mountain of '+fullName('drow',r,false),sats:[]};
      // lesser cones about its foot, where the floor holds them, clear of each other and of the stronger great volcanoes
      const s0=r()*6.283;for(let q=0;q<18&&v.sats.length<4;q++){const sa=s0+q*0.75+(r()-0.5)*0.3,sR=30+Math.floor(r()*28),sd=R*1.15+sR*1.1+10+(q%2)*20+r()*14,sX=Math.round(X+Math.cos(sa)*sd),sZ=Math.round(Z+Math.sin(sa)*sd),sh=r(),sn=fullName('drow',r,false);
        if(v.sats.some(t=>Math.hypot(t.X-sX,t.Z-sZ)<(t.R+sR)*1.3+12)||G.some(g=>Math.hypot(g.X-sX,g.Z-sZ)<(g.R+sR)*1.3+16)||!onFloor(sX,sZ,Math.round(sR*1.3)+6,8)||B&&wasteGateKeep(B,sX,sZ,Math.round(sR*1.45)+12))continue;
        const so={};colInfoBase(sX,sZ,so);if(so.h<so.sl+2||so.river||so.rvBot!==999)continue;
        const sHv=Math.min(H-50-so.h,Math.round(sR*(0.62+sh*0.26))),src=Math.round(sR*0.15)+3,scd=7+Math.floor(sh*5),sfl=[],snf=2+Math.floor(sh*2.9),sa0=sh*6.283;for(let t=0;t<snf;t++)sfl.push({a:sa0+t*6.283/snf,len:0.8+((sh*7.31+t*0.37)%1)*0.5});
        v.sats.push({sat:1,key:'s'+c.i+','+c.j+','+q,i:c.i*16+q,j:c.j,X:sX,Z:sZ,R:sR,pri:1,base:so.h,Hv:sHv,rc:src,cd:scd,rimTop:so.h+sHv,lake:so.h+sHv-scd,fl:sfl,old:[sa0+1,sa0+3,sa0+5],name:'Mount '+sn});}
      return v;}finally{volcSkip=false;}}
  return null;
}
// the great volcanoes whose works may reach within r of (X,Z), with their lesser cones (cached by 32-block tile for the terrain):
// the basins of the volcanic cells about it, each once
function greatNear(X,Z,r){
  const tk=(X>>5)*65536+(Z>>5)+(r>200?0.5:0);if(r<=200){const c=greatNC.get(tk);if(c)return c;}if(greatNC.size>40000)greatNC.clear();
  const out=[],seen=new Set(),ci=Math.floor(X/LS),cj=Math.floor(Z/LS),n=r>200?Math.min(6,Math.ceil(r/LS)+1):2;
  for(let a=-n;a<=n;a++)for(let b=-n;b<=n;b++){const d=landSite(ci+a,cj+b);if(LANDS[cellLand(d)].k!=='volcanic')continue;const B=wasteBasin(d);if(seen.has(B.key))continue;seen.add(B.key);
    const g=greatOf(B.chief);if(g&&Math.hypot(g.X-X,g.Z-Z)<Math.max(r,200)+g.R*1.45+120){out.push(g);for(const t of g.sats)out.push(t);}}
  if(r<=200)greatNC.set(tk,out);return out;
}
// a candidate: one per grid cell where the land is wholly volcanic for its whole width (no base height yet)
function volcCand(i,j){
  const key=i*65536+j;if(volcCandC.has(key))return volcCandC.get(key);let v=null;
  if(hsh(i,9101,j)<0.95){const X=Math.floor((i+0.15+hsh(i,9103,j)*0.7)*VOLC_C),Z=Math.floor((j+0.15+hsh(i,9105,j)*0.7)*VOLC_C),R=34+Math.floor(hsh(i,9107,j)*30);
    let ok=onFloor(X,Z,Math.round(R*1.3)+6,8); // on a basin's floor, its foot and flows too (D-055)
    if(ok)for(const g of greatNear(X,Z,200))if(Math.hypot(g.X-X,g.Z-Z)<(g.great?g.R*1.15+R*0.9+8:(g.R+R)*1.3+12))ok=false; // clear of the great volcano
    if(ok&&wasteGateNear(X,Z,Math.round(R*1.45)+12))ok=false; // clear of the gate, its yard, the way down and the camps (D-067)
    if(ok)v={i:i,j:j,key:i+','+j,X:X,Z:Z,R:R,pri:hsh(i,9113,j)};}
  volcCandC.set(key,v);return v;
}
// a volcano: a candidate not crowded by a stronger neighbour, with its heights fixed from the ground at its heart
function volcAt(i,j){
  const key=i*65536+j;if(volcC.has(key))return volcC.get(key);let v=null;const c=volcCand(i,j);
  if(c){let ok=true;for(let a=-1;a<=1&&ok;a++)for(let b=-1;b<=1&&ok;b++){if(!a&&!b)continue;const n=volcCand(i+a,j+b);if(n&&n.pri>c.pri&&Math.hypot(n.X-c.X,n.Z-c.Z)<(n.R+c.R)*1.3+12)ok=false;}
    if(ok){volcSkip=true;const o={};colInfoBase(c.X,c.Z,o);volcSkip=false;
      if(o.h>=o.sl+2&&!o.river&&o.rvBot===999){const Hv=Math.min(H-50-o.h,Math.round(c.R*(0.58+hsh(i,9109,j)*0.24))),rc=Math.round(c.R*0.15)+3,cd=7+Math.floor(hsh(i,9111,j)*5),r=rngAt(i,9115,j);
        const fl=[],nf=2+Math.floor(r()*3),a0=r()*6.283;for(let k=0;k<nf;k++)fl.push({a:a0+k*6.283/nf+(r()-0.5)*0.9,len:0.8+r()*0.55});
        const old=[];for(let k=0;k<3;k++)old.push(r()*6.283);
        v=Object.assign({},c,{base:o.h,Hv:Hv,rc:rc,cd:cd,rimTop:o.h+Hv,lake:o.h+Hv-cd,fl:fl,old:old,name:'Mount '+fullName('drow',r,false)});}}}
  volcC.set(key,v);return v;
}
function volcanoesNear(X,Z,r){const out=[],n=Math.ceil(r/VOLC_C)+1,ci=Math.floor(X/VOLC_C),cj=Math.floor(Z/VOLC_C);
  for(const g of greatNear(X,Z,r))if(Math.hypot(g.X-X,g.Z-Z)<r+g.R)out.push(g);
  for(let a=-n;a<=n;a++)for(let b=-n;b<=n;b++){const v=volcAt(ci+a,cj+b);if(v&&Math.hypot(v.X-X,v.Z-Z)<r+v.R)out.push(v);}return out;}
const angDiffV=(a,b)=>{let d=b-a;while(d>Math.PI)d-=6.2832;while(d<-Math.PI)d+=6.2832;return d;};
// The shape of a volcano (D-056): no cone is round or upright. Its foot is warped by angle, its upper part leans so the crater
// stands off its middle, it is steeper on some sides than others, gullies of uneven spacing and depth score it, its rim is
// jagged; a great one has a scar where a flank fell away (its first flow runs down it) and lesser cones on its shoulders.
function volcShape(v){
  if(v.shp)return v.shp;const r=k=>hsh(v.i,9301+k,v.j),G=!!v.great;
  const S={a:G?[0.1+0.08*r(1),0.06+0.06*r(2),0.04+0.04*r(3)]:[0.07+0.05*r(1),0.04+0.04*r(2),0.03+0.03*r(3)],p:[r(4)*6.2832,r(5)*6.2832,r(6)*6.2832],
    e0:1.1+0.3*r(7),e1:G?0.2+0.25*r(8):0.25*r(8),ep:r(9)*6.2832,rv:G?22:6,thc:v.fl.length?v.fl[0].a:r(12)*6.2832,col:G?0.2+0.1*r(13):0,par:[]};
  const oa=r(10)*6.2832,om=(G?0.1+0.05*r(11):0.03+0.03*r(11))*v.R;S.ox=Math.cos(oa)*om;S.oz=Math.sin(oa)*om;S.cx=v.X+S.ox;S.cz=v.Z+S.oz;
  // a great one has a second summit high on one shoulder and a lesser cone lower on another
  if(G){const a1=S.thc+1.6+r(20)*1.2,a2=a1+2+r(21)*1.5;
    S.par.push({x:v.X+Math.cos(a1)*v.R*(0.33+0.12*r(22)),z:v.Z+Math.sin(a1)*v.R*(0.33+0.12*r(22)),r:v.R*(0.2+0.05*r(24)),h:v.Hv*(0.18+0.08*r(26))});
    S.par.push({x:v.X+Math.cos(a2)*v.R*(0.52+0.12*r(23)),z:v.Z+Math.sin(a2)*v.R*(0.52+0.12*r(23)),r:v.R*(0.12+0.04*r(25)),h:v.Hv*(0.08+0.04*r(27))});}
  return v.shp=S;}
// a point in the cone's own frame, [distance as on a round upright cone, angle]: the warp of its foot and the lean of its top undone
function volcFrame(v,S,X,Z){
  const w0=th=>1+S.a[0]*Math.sin(th+S.p[0])+S.a[1]*Math.sin(2*th+S.p[1])+S.a[2]*Math.sin(3*th+S.p[2]);
  let dx=X-v.X,dz=Z-v.Z,th=Math.atan2(dz,dx);const d0=Math.hypot(dx,dz)/w0(th),s0=d0<v.rc?1:d0<v.R?1-(d0-v.rc)/(v.R-v.rc):0,lw=Math.pow(s0,1.5);
  dx-=S.ox*lw;dz-=S.oz*lw;th=Math.atan2(dz,dx);return [Math.hypot(dx,dz)/w0(th),th];}
// the cone's height over its base at a point of its frame (without the flows). The gullies run straight down the flank, each a
// trough with a flat floor (D-064: wider toward the foot) between steep sides; VCG tells volcTerrain where the point lies in one
const VCG={lat:1e9,fw:0,k:0,s:0};
function volcCone(v,S,d,th,X,Z){
  VCG.lat=1e9;const rv=S.rv*Math.max(0,0.7*Math.sin(2*th+S.p[2])+0.5*Math.sin(5*th+S.p[0])+0.2*Math.sin(11*th+S.p[1]));
  if(d<v.rc){const q=d/v.rc;return v.Hv-(v.cd+3)+(v.cd+3)*Math.pow(q,4)+rv*Math.pow(q,8);}
  if(d>=v.R)return 0;
  const n=v.great?9:6,gnf=t=>fbm2(Math.cos(t)*3+v.i*0.37,Math.sin(t)*3+v.j*0.37,2,9311.3),s=1-(d-v.rc)/(v.R-v.rc),e=S.e0+S.e1*Math.sin(th+S.ep),g0=gnf(th),ph=th*n+g0*5,
    dph=Math.max(0.3,Math.abs(n+(gnf(th+0.002)-g0)*2500)),k=Math.round(ph/Math.PI),off=Math.abs(ph-k*Math.PI),fw=v.great?3+4*(1-s):1.5+1.6*(1-s),
    gul=Math.sin(Math.max(0,off-fw*dph/d)),deep=Math.max(6,v.R*0.07)*4*s*(1-s);
  VCG.lat=off/dph*d;VCG.fw=fw;VCG.k=((k%(2*n))+2*n)%(2*n);VCG.s=s;
  let hh=Math.pow(s,e)*v.Hv+rv*sstep(0.86,1,s)-(1-gul)*(1-gul)*(1-gul)*deep+fbm2(X/29,Z/29,2,9315.7)*(v.great?7:3)*4*s*(1-s)+fbm2(X/11,Z/11,1,9119.3)*1.8;
  if(S.col){const k=sstep(0.55,0.2,Math.abs(angDiffV(th,S.thc)))*sstep(0.1,0.32,s)*sstep(0.96,0.78,s);hh-=k*S.col*v.Hv;} // the fallen flank
  for(const p of S.par){const dp=Math.hypot(X-p.x,Z-p.z);if(dp<p.r){const u=1-dp/p.r;hh+=p.h*Math.pow(u,1.3)-(u>0.78?p.h*0.4*(u-0.78)/0.22:0);}} // shoulder cones
  return hh;}
// Does gully k (counted round the cone) of volcano v carry lava? Most do; never those near the quarter of its fortress
function gullyLava(v,S,k,th){if(hsh(v.i*7+k,9333,v.j)>=(v.great?0.88:0.7))return false;if(S.fq===undefined)S.fq=fortQuarters(v)[0].th;return Math.abs(angDiffV(th,S.fq))>(v.great?0.4:0.6);}
// The ground's height and its fire, called by colInfoBase for every column touched by the volcanic land. Every volcano whose reach
// covers the column is worked out and the highest ground wins, its fire with it (D-067: before, the first to reach a column took
// it, so a cone overlapping another's reach was cut off along that line)
const TVA={},TVB={};
function volcOne(v,X,Z,h,T){
  T.vflow=T.vcrust=T.vcr=T.vgul=T.nr=false;T.vlake=0;T.vs=0;T.vn=0;
  const dx=X-v.X,dz=Z-v.Z;
  if(v.reach===undefined)v.reach=v.R*Math.max(1.3,1+0.6*Math.max(...v.fl.map(f=>f.len-1),0));const rx=v.reach*1.3+v.R*0.1;if(Math.abs(dx)>=rx||Math.abs(dz)>=rx||Math.hypot(dx,dz)>=rx)return null;
  const S=volcShape(v),[d,th]=volcFrame(v,S,X,Z);if(d>=v.reach)return null;T.vn=sstep(v.reach,v.R*1.05,d); // gorges ease out before it (D-067)
  // the cone: the ground near it eases to the volcano's own base, so its crater and rim keep their heights
  const fb=sstep(v.R*1.3,v.R*0.75,d);let hh=h+(v.base-h)*fb;if(fb>0.3)T.nr=true; // no river climbs a volcano
  if(d<v.R){hh+=volcCone(v,S,d,th,X,Z);if(d<v.rc){T.vcr=true;T.vs=1;if(hh<v.lake)T.vlake=v.lake;}else T.vs=1-(d-v.rc)/(v.R-v.rc);
    // a gully's floor (D-064, D-067): most carry a stream of lava three deep from high on the flank, thinning to one at the
    // foot, its face a block under the gully's floor; the rest a floor of glowing crust; none on the quarter the mountain's
    // fortress faces
    if(VCG.lat<VCG.fw-0.35&&VCG.s>0.03&&VCG.s<0.9){if(gullyLava(v,S,VCG.k,th)){const f=Math.round(hh);hh=f-(VCG.s<0.07?1:VCG.s<0.13?2:3);T.vlake=f-1;T.vflow=true;T.vgul=true;}else T.vcrust=true;}}
  // the flows: out through a breach in the rim at the lake's level, then down the flank and out onto the plain
  if(d>=v.rc*0.9)for(let k=0;k<v.fl.length;k++){const f=v.fl[k],dmax=v.R*f.len;if(d>dmax+3)continue;
    const ca=f.a+0.33*Math.sin(d/11+k*2.1)+0.12*Math.sin(d/4.3+k),lat=Math.abs(angDiffV(th,ca))*d,w=(0.8+Math.min(d/v.R,1.2)*1.7+(d>v.R?(d-v.R)*0.1:0))*(v.great?1.6:1);
    if(lat<w&&d<dmax){hh=Math.min(Math.round(hh)-1,Math.round(v.lake-Math.max(0,d-v.rc)*0.55));T.vflow=true;T.vlake=0;T.vgul=false;break;}
    if(lat<w+2.2)T.vcrust=true;}
  if(!T.vflow&&d>v.rc&&d<v.R*0.95)for(const a0 of v.old)if(Math.abs(angDiffV(th,a0+0.2*Math.sin(d/9)))*d<1.4+d/v.R*1.6)T.vcrust=true; // old flows, cooled
  return hh;}
function volcTerrain(X,Z,o,h){
  if(volcSkip||o.wVolc<0.05)return h;
  const ci=Math.floor(X/VOLC_C),cj=Math.floor(Z/VOLC_C),G=greatNear(X,Z,0);let B=null,bh=-1e9,nr=false,T=TVA;
  for(let q=-G.length;q<9;q++){const v=q<0?G[q+G.length]:volcAt(ci+(q%3)-1,cj+Math.floor(q/3)-1);if(!v)continue;
    const hh=volcOne(v,X,Z,h,T);if(hh===null)continue;if(T.nr)nr=true;if(T.vn>o.vnear)o.vnear=T.vn;if(hh>bh){bh=hh;B=T;T=T===TVA?TVB:TVA;}}
  if(B){if(nr){o.river=false;o.bank=false;}o.vflow=B.vflow;o.vcrust=B.vcrust;o.vcr=B.vcr;o.vgul=B.vgul;o.vlake=B.vlake;o.vs=B.vs;return bh;}
  // fissures across the plains: narrow, a few blocks deep, lava at the bottom (none on the gate's way, D-067)
  if(o.wVolc>0.55&&h>o.sl+3&&!o.wgate){const q=Math.abs(fbm2(X/85,Z/85,2,9121.3));if(q<0.0075+0.006*(o.wVolc-0.55)){o.vfis=true;return h-4-Math.floor(hsh(X>>2,9123,Z>>2)*4);}}
  return h;
}
// Fumaroles: here and there a smoking vent, sulphur round it
const ventAt=(X,Z)=>hsh(X,9141,Z)<0.0025;
function ventNear(X,Z){for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if((a||b)&&ventAt(X+a,Z+b))return true;return false;}
// ---- Charred trees, basalt spires, obsidian shards
function charP(X,y,Z,r){
  if(r()<0.2){const ax=r()<0.5,len=3+(r()*3|0);for(let t=0;t<len;t++)PW(ax?X+t:X,y,ax?Z:Z+t,CHARWOOD,MODE_SET);return;} // fallen
  const th=3+(r()*5|0);if(y+th+2>=H)return;for(let i=0;i<th;i++)PW(X,y+i,Z,i===th-1&&r()<0.35?SMOULDER:CHARWOOD,MODE_SET);
  for(let k=0;k<1+(r()*3|0);k++){const a=r()*6.283,by=y+th-1-(r()*3|0),len=1+(r()*2|0);for(let t=1;t<=len;t++)PW(X+Math.round(Math.cos(a)*t),by+(t>1?1:0),Z+Math.round(Math.sin(a)*t),r()<0.12?SMOULDER:CHARWOOD,MODE_SET);}
}
function shardP(X,y,Z,r){const h=3+(r()*5|0),lx=r()<0.5?1:-1,lz=r()<0.5?1:-1;let x=X,z=Z;for(let i=-1;i<h;i++){if(i>0&&i%2===0){if(r()<0.6)x+=lx;else z+=lz;}PW(x,y+i,z,OBSID,MODE_SET);if(i<1)PW(x+lx,y+i,z,OBSID,MODE_SET);}}
FLOORS.add(BLACKASH);FLOORS.add(CINDER);
FOREST.volcanic={trees:0.007,banks:true,
  tree:(X,y,Z,r)=>{const q=hsh(X,9161,Z);if(q<0.55)charP(X,y,Z,r);else if(q<0.8)spireP(X,y,Z,r,BASALT);else shardP(X,y,Z,r);},
  top:o=>{if(o.vflow||o.vfis)return LAVA;if(o.vcrust)return LAVACRUST;if(o.vcr)return CINDER;if(ventAt(o.X,o.Z))return VENT;if(ventNear(o.X,o.Z))return SULFUR;
    if(o.vs>0.6)return o.dn>0.1?CINDER:BLACKASH;{const fld=fbm2(o.X/90,o.Z/90,2,9133.3);if(fld>0.42&&hsh(o.X,9135,o.Z)<0.35+(fld-0.42)*2)return LAVACRUST;if(Math.abs(fbm2(o.X/52,o.Z/52,2,9131.7))<0.009)return LAVACRUST;}return o.dn>0.36?CINDER:o.dn<-0.42?ASH:BLACKASH;},
  shore:o=>o.dn>0.2?CINDER:BASALT,rock:BASALT,soil:CINDER,floors:new Set([BLACKASH,CINDER,ASH]),
  plant:r=>r<0.008?DBUSH:0};
// The rivers and lakes of the volcanic land run with lava; where its weight thins toward another land the channel is cooled to
// a dry floor of obsidian, so lava never meets water. Read by fillCol.
function liquidOf(o){if(o.wVolc>0.5&&o.wS<0.04)return LAVA;if(o.wVolc>0.3&&o.wS<0.2)return OBSID;return WATER;}
// Lava a landmark holds in its own walls (the citadel's moat, the rift's river), trusted by the underground check at a chunk's edge
function sigLavaAt(X,y,Z){for(const s of sigsNear(Math.floor(X/CS),Math.floor(Z/CS)))if((s.kind==='rift'||s.kind==='citadel')&&y<s.g&&y>=s.g-32&&Math.max(Math.abs(X-s.X),Math.abs(Z-s.Z))<=s.R+2)return true;return false;}
// ---- Landmark and feature
SIGS.volcanic=[['citadel','The Ashen Citadel',15],['rift','Rift of Fire',13]];
function volcBuild(s,r){
  const X=s.X,Z=s.Z,g=s.g;
  switch(s.kind){
    case 'citadel':{ // a ruined black citadel: curtain walls and corner towers round a tall spire crowned with fire, a moat of lava
      const face=Math.floor(s.seed*4),rx=(a,b)=>face===0?a:face===1?-b:face===2?-a:b,rz=(a,b)=>face===0?b:face===1?a:face===2?-b:-a;
      const P=(a,y,b,id)=>PW(X+rx(a,b),y,Z+rz(a,b),id,MODE_SET),stone=()=>{const q=r();return q<0.14?OBSID:q<0.36?CINDER:BASALT;},gap=(a,b,y,top)=>hsh(X+a*7,y,Z+b*5)<0.04+0.3*Math.max(0,(y-g)/top-0.6);
      sigFloor(X-15,Z-15,X+15,Z+15,g,BASALT,14);
      for(let a=-16;a<=16;a++)for(let b=-16;b<=16;b++){const m=Math.max(Math.abs(a),Math.abs(b));
        if(m===16){for(let y=g-3;y<g;y++)P(a,y,b,BASALT);continue;} // the moat's outer wall: its lava is held whatever the ground does
        if(m>=14){if(b>=12&&Math.abs(a)<=1){P(a,g,b,BASALT);continue;} // the causeway over the moat
          P(a,g-3,b,BASALT);P(a,g-2,b,LAVA);P(a,g-1,b,LAVA);P(a,g,b,AIR);}else if(m<=10&&hsh(X+a,9171,Z+b)<0.12)P(a,g,b,LAVACRUST);}
      // the curtain wall with its crenels and the gate in the near side
      for(let a=-12;a<=12;a++)for(let b=-12;b<=12;b++){const m=Math.max(Math.abs(a),Math.abs(b));if(m<11)continue;const wh=7+(hsh(X+a,9173,Z+b)<0.25?-2:0);
        for(let y=g+1;y<=g+wh;y++){if(b>=11&&Math.abs(a)<=1&&y<=g+5)continue;if(!gap(a,b,y,wh))P(a,y,b,stone());}
        if(m===12&&(a+b)%2===0)P(a,g+wh+1,b,stone());}
      // corner and gate towers: hollow, crenelated, a brazier of magma on each
      for(const [ca,cb,th] of [[-12,-12,15],[12,-12,15],[-12,12,14],[12,12,14],[-3,12,12],[3,12,12]])for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const e=Math.abs(a)===2||Math.abs(b)===2;
        for(let y=g+1;y<=g+th;y++)if(e&&!gap(ca+a,cb+b,y,th))P(ca+a,y,cb+b,stone());if(e&&(a+b)%2===0)P(ca+a,g+th+1,cb+b,stone());if(!a&&!b){P(ca,g+th-1,cb,BASALT);P(ca,g+th,cb,MAGMA);}}
      // the spire: stepping in as it rises, slit windows lit from within, a crown of obsidian spikes round a fire at the top
      const tiers=[[4,12],[3,24],[2,34],[1,40]];let y0=g+1;
      for(const [hw,top] of tiers){for(let y=y0;y<=g+top;y++)for(let a=-hw;a<=hw;a++)for(let b=-hw;b<=hw;b++){const e=Math.abs(a)===hw||Math.abs(b)===hw;
          if(!e){P(a,y,b,(y-g)%6===0?BASALT:AIR);continue;}const win=(y-g)%6===3&&(a===0||b===0)&&hw>1;P(a,y,b,win?AIR:stone());if(win)P(Math.sign(a)*(hw-1),y-1,Math.sign(b)*(hw-1),LAVACRUST);}
        y0=g+top+1;}
      for(let y=g+1;y<=g+3;y++)P(0,y,4,AIR); // the spire's door, toward the gate
      for(const [a,b] of [[-1,-1],[1,-1],[-1,1],[1,1]])for(let y=g+41;y<=g+45;y++)if(y<g+44||hsh(X+a,y,Z+b)<0.6)P(a,y,b,OBSID);
      P(0,g+41,0,MAGMA);P(0,g+42,0,LAVACRUST);
      // rubble below the broken walls
      for(let k=0;k<40;k++){const a=-11+(r()*23|0),b=-11+(r()*23|0);if(Math.max(Math.abs(a),Math.abs(b))>5)P(a,g+1,b,r()<0.6?CINDER:BASALT);}
      break;}
    case 'rift':{ // a rift: walls dropping in ledges to a river of fire twenty and more blocks down, a black arch across it
      const ang=hsh(X,9151,Z)*Math.PI,ux=Math.cos(ang),uz=Math.sin(ang),dep=20+Math.floor(hsh(X,9153,Z)*8);
      for(let dx=-14;dx<=14;dx++)for(let dz=-14;dz<=14;dz++){const t=dx*ux+dz*uz,c=-dx*uz+dz*ux;if(Math.abs(t)>13.5)continue;const f=Math.sqrt(Math.max(0,1-(t/13.5)*(t/13.5))),hw=1.5+3.5*f+fbm2((X+dx)/4,(Z+dz)/4,1,9155.1)*0.8;
        if(Math.abs(c)>hw+2)continue;const x=X+dx,z=Z+dz,bot=g-Math.round(dep*Math.min(1,f*1.6)); // a flat bottom along the middle, so the lava lies level
        if(Math.abs(c)>hw){PW(x,g,z,hsh(x,9157,z)<0.5?LAVACRUST:CINDER,MODE_SET);continue;}
        for(let y=g+6;y>bot;y--){const open=Math.abs(c)<=hw-(g-y)/7;if(open)PW(x,y,z,AIR,MODE_SET);}
        if(bot===g-dep&&Math.abs(c)<=hw-dep/7){PW(x,bot,z,LAVA,MODE_SET);PW(x,bot-1,z,LAVA,MODE_SET);PW(x,bot-2,z,MAGMA,MODE_SET);}}
      // the arch: a span of basalt across the middle, a little below the rim
      for(let k=-8;k<=8;k++){const a=-Math.round(k*uz),b=Math.round(k*ux),sag=Math.round(Math.cos(k/8*1.5708)*2);for(let y=g-6+sag;y<=g-4+sag;y++)PW(X+a,y,Z+b,y===g-4+sag?CINDER:BASALT,MODE_SET);}
      break;}
  }
}
