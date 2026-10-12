// ---- The sunken wastes (D-055): the Volcanic Wastes lie in basins sunk about 90 blocks below the lands around them, walled by
// a ring of ash mountains about 90 blocks above those lands, so the way in climbs some 90 blocks to a crest and falls some 180 to
// the floor. A basin is the union of discs WB_R across about the centres of the volcanic cells, so each is at least 800 wide and
// neighbouring stretches of the wastes share one; its edge is warped. Inside the ring the land is wholly volcanic, and the
// level that is the sea elsewhere lies WB_DEP lower (o.sl): rivers there run with lava at that level, and nothing below it is
// water. Pure functions of the seed and the land layout. landsAt reads the basin (wasteAt, wasteLand); colInfoBase shapes the
// ground (wasteTerrain).
const WB_R=430,WB_IN=125,WB_CR=18,WB_OUT=105,WB_DEP=90,WB_END=WB_IN+WB_CR+WB_OUT,WB_K=40,WB_FAR=950,wasteTC=new Map();
// the volcanic cells whose basins may reach a 64-block tile (every one within WB_FAR of any of its columns)
function wasteCells(X,Z){
  const tk=(X>>6)*65536+(Z>>6);let L=wasteTC.get(tk);if(L)return L;if(wasteTC.size>20000)wasteTC.clear();
  L=[];const cx=(X>>6)*64+32,cz=(Z>>6)*64+32,ci=Math.floor(cx/LS),cj=Math.floor(cz/LS);
  for(let a=-4;a<=4;a++)for(let b=-4;b<=4;b++){const c=landSite(ci+a,cj+b);if(LANDS[cellLand(c)].k==='volcanic'&&Math.hypot(c.x-cx,c.z-cz)<WB_FAR+50)L.push(c);}
  wasteTC.set(tk,L);return L;
}
// The basin a volcanic cell lies in (D-067): the volcanic cells joined to it, each within 900 of the next (so their discs run
// together), their middle and their chief (the stretch of most priority among them, which names the basin's great volcano and
// its gate). The same object for every cell of the basin; key is the chief's.
const wasteBC=new Map();
function wasteBasin(c){
  const k0=landKey(c.i,c.j);let B=wasteBC.get(k0);if(B)return B;if(LANDS[cellLand(c)].k!=='volcanic')return null;if(wasteBC.size>4000)wasteBC.clear();
  const cells=[c],seen=new Set([k0]);
  for(let q=0;q<cells.length&&cells.length<400;q++){const a=cells[q];for(let di=-3;di<=3;di++)for(let dj=-3;dj<=3;dj++){const d=landSite(a.i+di,a.j+dj),k=landKey(d.i,d.j);
    if(seen.has(k)||LANDS[cellLand(d)].k!=='volcanic'||Math.hypot(a.x-d.x,a.z-d.z)>=900)continue;seen.add(k);cells.push(d);}}
  let cx=0,cz=0,ch=null;for(const d of cells){cx+=d.x/cells.length;cz+=d.z/cells.length;const sc=stretchCell(d);if(!ch||sc.pr>ch.pr||sc.pr===ch.pr&&landKey(sc.i,sc.j)<landKey(ch.i,ch.j))ch=sc;}
  B={key:'b'+landKey(ch.i,ch.j),cells:cells,cx:cx,cz:cz,chief:ch};for(const d of cells)wasteBC.set(landKey(d.i,d.j),B);return B;
}
// The basin at a column, from the warped coordinates landsAt reads cells by: o.bs, how far outside the edge of the basin's
// floor (negative inside it), and o.bc, the nearest volcanic cell; o.bs is 1e9 where no basin reaches. The distance is a soft
// minimum over the cells (each fading out by WB_FAR, so it never jumps), which rounds the joins between their discs.
function wasteAt(wx,wz,o){
  o.bs=1e9;o.bc=null;const L=wasteCells(Math.floor(wx),Math.floor(wz));if(!L.length)return;
  let d1=1e9,bc=null;for(const c of L){const d=Math.hypot(wx-c.x,wz-c.z);if(d<d1){d1=d;bc=c;}}
  if(d1>=WB_FAR)return;let s=0;for(const c of L){const d=Math.hypot(wx-c.x,wz-c.z);if(d<WB_FAR)s+=Math.exp(-(d-d1)/WB_K)*sstep(WB_FAR,WB_FAR-120,d);}
  o.bs=d1-WB_K*Math.log(Math.max(1e-9,s))-WB_R-fbm2(wx/260,wz/260,2,9201.3)*40;o.bc=bc;
}
// Inside the ring (and down the top of its outer slope) the land is the wastes': their weights take over from the layout's
function wasteLand(X,Z,o){
  const wb=sstep(WB_IN+WB_CR+WB_OUT*0.8,WB_IN+WB_CR,o.bs);if(wb<=0)return;const k=1-wb,V=LAND_I.volcanic;
  o.wS*=k;o.wKelp*=k;o.wIsle*=k;o.wChalk*=k;o.wFjord*=k;o.wDry*=k;o.wStar*=k;o.wTerr*=k;o.wVolc=o.wVolc*k+wb;
  o.w2*=k;o.w3*=k;o.w5*=k;o.w6*=k;o.w7*=k;o.w8*=k;o.w10*=k;o.w11*=k;o.w4=o.w4*k+wb;o.gz=o.gz*k+LANDS[V].gorge*wb;
  if(o.land!==V&&wb>0.5+fbm2(X/16,Z/16,1,2711.3)*0.4){o.land=V;o.lcell=landKey(o.bc.i,o.bc.j);o.tb=o.bc.cl.tb;}
}
// How much of the ring a column is on (1 from just before the foot of the inner wall to partway down the outer slope): no
// rivers, gorges or lakes there
const wasteRing=s=>sstep(-40,-12,s)*(1-sstep(WB_IN+WB_CR+WB_OUT*0.5,WB_END,s));
// The ground: the floor is the wastes' own ground sunk WB_DEP; the inner wall climbs from it in cliffs and shelves to a jagged
// crest with lower saddles here and there; the outer slope falls to the lands around. Sets o.sl, the column's liquid level.
function wasteTerrain(X,Z,o,h){
  const s=o.bs;if(s>=WB_END)return h;const fl=h-WB_DEP;
  if(s<WB_IN+WB_CR*0.5)o.sl=SEA-WB_DEP;
  if(s<=0)return fl;
  const rg=1-Math.abs(fbm2(X/70,Z/70,2,9203.1)),cr=SEA+78+rg*rg*rg*42-sstep(0.2,0.5,fbm2(X/300,Z/300,1,9205.7))*30+fbm2(X/23,Z/23,1,9207.3)*5;
  if(s<WB_IN){const t=s/WB_IN,p=t*t*(3-2*t)*0.7+t*0.3,y=fl+(cr-fl)*p,st=13,q=(y-fl+fbm2(X/40,Z/40,1,9209.9)*5)/st,led=fl+(Math.floor(q)+sstep(0.5,0.92,q-Math.floor(q)))*st;
    return y*0.4+led*0.6+fbm2(X/9,Z/9,1,9211.3)*1.5;}
  if(s<WB_IN+WB_CR)return cr;
  const u=(s-WB_IN-WB_CR)/WB_OUT,p=1-u*u*(3-2*u);return Math.max(h,h+(cr-h)*p);
}
