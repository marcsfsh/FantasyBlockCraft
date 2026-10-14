// ---- Building the mountain dwarves (D-066), in the frame and parts of realm-build.js. They live on and in the mountains: their
// sites are cut into terraces like the elves' (elfTerrace), every building on a platform of its own, and under them they delve.
// Above: walls of dressed granite with square towers bearing ballistae, a gatehouse with its portcullis, houses of granite under
// steep slate, smithies, smelting furnaces of firebrick glowing at their mouths, headframes over the shafts with their wheels,
// treadwheel cranes, trebuchets, heaps of slag and spoil; at the back of a city a massif of rock (L.mass, massifAt) with the great
// gate cut in its face between two colossal statues. Below (L.hold, RB.dhold): the gate hall, the great hall on its pillars with
// the king's seat, barracks, the shaft with its hoist down through every level, the forge hall with its channel of molten iron,
// the cistern, and deep down the smelting hall and the mines; a town or a mine has its shaft and galleries. Their works are
// tools and arms of the age (wheels, cranes, engines of war); nothing in them is powered or runs on rails (D-019).
// A layout reads only the raw samples (dvRaw); builders read the ground through siteG (DVG) and hAt.
const DVG=(s,u,v)=>siteG(s,u,v);
const dvRaw=(s,u,v)=>{const [X,Z]=siteXZ(s,u,v);return elfRaw(s,X,Z);};
const dvLvl=(s,u,v)=>s.T+Math.round((dvRaw(s,u,v)-s.T)/s.terr)*s.terr;
// the ground a layout may count on over (u, v): its terrace or the massif inside the site (less a little for the platforms and
// retaining walls), the raw ground beyond it
const dvGnd=(s,L,u,v)=>Math.hypot(u,v)>s.R-2?dvRaw(s,u,v):Math.max(Math.min(dvLvl(s,u,v),dvRaw(s,u,v))-2,L.mass?massifAt(L.mass,u,v):-1);
// ---- Below the mountain. A site's workings are shapes in its frame, y in world heights: boxes (t 'b', a vault rising p.vr
// across p.vax), stairs (t 's', along ax from a0 to a1, the floor y0 at a0 rising dir a block a step, h clear) and shafts (t 'c',
// round). Their interiors are carved as one; every block beside an interior that is not itself interior is walled (st 1: dressed
// granite, flagstones under, granite over; st 2: the rock as it stands, filled where a cave or water touches it, ore in it here
// and there), so no cave's water or lava reaches in; above the ground nothing is walled. Each shape's kind (k) furnishes it.
function dIv(q,u,v){
  if(q.t==='b'){if(u<q.u0||u>q.u1||v<q.v0||v>q.v1)return null;let top=q.y1;
    if(q.vr){const a=q.vax==='v'?v:u,c=q.vax==='v'?(q.v0+q.v1)/2:(q.u0+q.u1)/2,h=(q.vax==='v'?q.v1-q.v0:q.u1-q.u0)/2+1,d=(a-c)/h;top+=Math.round(q.vr*Math.sqrt(Math.max(0,1-d*d)));}
    return [q.y0,top];}
  if(q.t==='s'){const a=q.ax==='u'?u:v,c=q.ax==='u'?v:u;if(a<q.a0||a>q.a1||c<q.c0||c>q.c1)return null;const f=q.y0+q.dir*(a-q.a0);return [f+1,f+q.h];}
  if(Math.hypot(u-q.cu,v-q.cv)>q.r)return null;return [q.y0,q.y1];}
function dBox(q){
  if(q.t==='b'){q.bu0=q.u0;q.bu1=q.u1;q.bv0=q.v0;q.bv1=q.v1;q.by0=q.y0;q.by1=q.y1+(q.vr||0);}
  else if(q.t==='s'){const e=q.y0+q.dir*(q.a1-q.a0);if(q.ax==='u'){q.bu0=q.a0;q.bu1=q.a1;q.bv0=q.c0;q.bv1=q.c1;}else{q.bv0=q.a0;q.bv1=q.a1;q.bu0=q.c0;q.bu1=q.c1;}q.by0=Math.min(q.y0,e)+1;q.by1=Math.max(q.y0,e)+q.h;}
  else{const r=Math.ceil(q.r);q.bu0=Math.floor(q.cu)-r;q.bu1=Math.ceil(q.cu)+r;q.bv0=Math.floor(q.cv)-r;q.bv1=Math.ceil(q.cv)+r;q.by0=q.y0;q.by1=q.y1;}
  return q;}
const DORE=[COAL,COAL,IRON,IRON,COPO,TINO,GOLD];
RB.dhold=(s,p,u,v,X,Z)=>{const near=[];for(const q of p.S)if(u>=q.bu0-1&&u<=q.bu1+1&&v>=q.bv0-1&&v<=q.bv1+1)near.push(q);if(!near.length)return;
  let lo=1e9,hi=-1e9;for(const q of near){lo=Math.min(lo,q.by0);hi=Math.max(hi,q.by1);}lo--;hi++;const n=hi-lo+1;
  const col=(cu,cv)=>{let a=null;for(const q of near){const iv=dIv(q,cu,cv);if(!iv)continue;if(!a)a=new Uint8Array(n);for(let y=iv[0];y<=iv[1];y++){const k=y-lo;if(!a[k]||q.st<a[k])a[k]=q.st;}}return a;};
  const me=col(u,v),nb=[col(u+1,v),col(u-1,v),col(u,v+1),col(u,v-1)];if(!me&&!nb.some(Boolean))return;const g=hAt(X,Z);
  for(let k=0;k<n;k++){const y=lo+k;if(me&&me[k]){RBP(X,y,Z,AIR);continue;}
    const up=me&&k+1<n?me[k+1]:0,dn=me&&k>0?me[k-1]:0;let st=up||dn||0;for(const c of nb)if(c&&c[k]&&(!st||c[k]<st))st=c[k];
    if(!st||y>g)continue;const cur=GW(X,y,Z);
    if(st===2){if(!SOLID[cur])RBP(X,y,Z,up?COBBLE:STONE);else if(!up&&(cur===STONE||cur===DEEP)){const h=hsh(X*7+y,9465,Z);if(h<0.045)RBP(X,y,Z,h<0.006?GEMORE:DORE[(h*155)|0]);}continue;}
    RBP(X,y,Z,up?DFLAG:dn?DGRAN:y<=lo+1?DGRAN:(((y-p.y0)%6)+6)%6===4?DKNOT:DCOURSE);}
  // each shape furnishes its own interior
  for(const q of near){const D=DEC[q.k];if(!D)continue;const iv=dIv(q,u,v);if(iv)D(s,p,q,u,v,X,Z,iv);}};
// hanging lamps: a chain from the top of an interior, the lamp under it
const dHang=(X,Z,top,n)=>{if(n>0)RBS(X,Z,top-n+1,top,CHAIN);RBP(X,top-n,Z,DLAMP);};
const DEC={};
// the gate hall: columns against its walls, banners between, lamps hung from its vault; the bronze doors stand open against
// its walls at the front
DEC.gate=(s,p,q,u,v,X,Z,iv)=>{const y=q.y0,a=v-(q.v0+q.v1)/2,hv=(q.v1-q.v0)/2,av=Math.abs(a),du=u-q.u0;
  if(av>hv-0.6){if(du>=1&&du<=3&&y<=iv[1])RBS(X,Z,y,y+8,DBRONZE);else if(du%4===0&&du>3)RBS(X,Z,y,iv[1],DCOL);else if(du%4===2&&du>3)RBS(X,Z,y+3,y+5,DBANNER);return;}
  if(av<0.6&&du%5===2)dHang(X,Z,iv[1],2);};
// the great hall: two rows of great square columns with knotwork capitals, long tables down its nave, lamps hung from the vault
// between the rows and on brackets along the aisles; at the back a dais and the king's seat of granite and bronze crowned with
// gold, braziers either side, the banners of the mountain behind
DEC.great=(s,p,q,u,v,X,Z,iv)=>{const y=q.y0,a=v-(q.v0+q.v1)/2,av=Math.abs(a),hv=(q.v1-q.v0)/2,du=u-q.u0,dd=q.u1-u,top=iv[1];
  if(dd<=4&&av<=6.5){RBP(X,y,Z,dd===4||av>6?DKNOT:DFLAG);
    if(dd===0&&av<0.6){RBS(X,Z,y+1,y+3,DGRAN);RBS(X,Z,y+4,y+5,DBRONZE);RBP(X,y+6,Z,GOLDB);}
    else if(dd===0&&av<1.6){RBS(X,Z,y+1,y+4,DBRONZE);RBP(X,y+5,Z,DKNOT);}
    else if(dd===1&&av<0.6)RBP(X,y+1,Z,DGRAN);else if(dd===1&&av<1.6)RBS(X,Z,y+1,y+2,DKNOT);
    else if(dd===2&&Math.abs(av-4.5)<0.6)RBP(X,y+1,Z,BRAZIER);else if(dd===0&&Math.abs(av-3.5)<0.6)RBS(X,Z,y+3,y+7,DBANNER);return;}
  const pr=hv-4,ip=Math.abs(av-pr)<=1.01&&du>=3&&dd>=7&&(du%7>=3&&du%7<=5);
  if(ip){RBP(X,y,Z,DGRAN);RBS(X,Z,y+1,top-2,DCOL);RBS(X,Z,top-1,top,DKNOT);return;}
  if((av<0.6&&du%7===4||Math.abs(av-4)<0.6&&du%7===1)&&dd>8)dHang(X,Z,top,Math.max(1,top-y-9));else if(Math.abs(av-(hv-2))<0.6&&du%7===4&&dd>6)dHang(X,Z,top,Math.max(1,top-y-7));
  if(Math.abs(av-2.5)<0.6&&du>=4&&dd>=9&&du%7!==4)RBP(X,y,Z,PLANKS);
  if(av>hv-0.6&&du%7===0&&du>0){RBP(X,y+4,Z,DGRAN);RBP(X,y+5,Z,DLAMP);}};
// barracks: bunks in two tiers along the far wall between posts, racks of arms along the ends, lamps
DEC.barracks=(s,p,q,u,v,X,Z,iv)=>{const y=q.y0,du=u-q.u0;
  if(v===q.far){if(du%3===0)RBS(X,Z,y,y+3,DPROP);else{RBP(X,y,Z,WOOLB);RBP(X,y+2,Z,WOOLB);}return;}
  if((u===q.u0||u===q.u1)&&Math.abs(v-q.far)>2){RBP(X,y,Z,DPROP);RBP(X,y+1,Z,(v&1)?STEELB:DBRONZE);return;}
  if(Math.abs(v-q.far)===3&&du%5===2)dHang(X,Z,iv[1],1);};
// a store: barrels and crates stacked in rows with aisles between
DEC.store=(s,p,q,u,v,X,Z,iv)=>{const y=q.y0,du=u-q.u0,dv=Math.abs(v-q.far);if(dv<=1&&du%4!==3){const h=hsh(X,9475,Z);RBP(X,y,Z,h<0.5?BARREL:CRATE);if(h<0.3)RBP(X,y+1,Z,h<0.15?BARREL:CRATE);}
  else if(dv===3&&du%6===3)dHang(X,Z,iv[1],1);};
// a stair: lamps over it every six steps
DEC.stair=(s,p,q,u,v,X,Z,iv)=>{const a=q.ax==='u'?u:v,c=q.ax==='u'?v:u;if(Math.abs(c-(q.c0+q.c1)/2)<0.6&&((a-q.a0)%6+6)%6===3)RBP(X,iv[1],Z,DLAMP);};
// the forge hall: a channel of molten iron down its middle between knotwork kerbs; forges along both walls every eight, each a
// hearth of firebrick glowing at its mouth under a hood and a flue to the vault, bellows of hide beside it, a quench barrel, an
// anvil before it; ore carts by the channel, chains hung from the vault, lamps
DEC.forge=(s,p,q,u,v,X,Z,iv)=>{const y=q.y0,a=v-(q.v0+q.v1)/2,av=Math.abs(a),hv=(q.v1-q.v0)/2,du=u-q.u0,top=iv[1],k=du%8;
  if(av<=1.01){RBP(X,y-1,Z,DMOLTEN);return;}if(av<=2.01){RBP(X,y,Z,DKNOT);return;}
  if(du<2||q.u1-u<2)return;
  if(av>=hv-2.01&&k>=2&&k<=4){const c=k===3,back=av>hv-0.6,mid=Math.abs(av-(hv-1))<0.6,front=Math.abs(av-(hv-2))<0.6;
    RBP(X,y,Z,DFORGE);RBP(X,y+1,Z,c&&(mid||front)?DMOLTEN:DFORGE);RBP(X,y+2,Z,DFORGE);if(!front)RBP(X,y+3,Z,DFORGE);if(c&&back)RBS(X,Z,y+4,top,DFORGE);return;}
  if(av>hv-0.6&&k===1)RBS(X,Z,y,y+1,HIDE);else if(av>hv-0.6&&k===5)RBP(X,y,Z,BARREL);
  else if(Math.abs(av-(hv-4))<0.6&&k===3)RBP(X,y,Z,DANVIL);
  else if(Math.abs(av-3)<0.6&&k===6&&hsh(X,9477,Z)<0.5)RBP(X,y,Z,DCART);
  else if(Math.abs(av-4)<0.6&&k===7)dHang(X,Z,top,2);else if(Math.abs(av-(hv-6))<0.6&&k===0)RBS(X,Z,top-3,top,CHAIN);};
// the cistern: a basin two deep held in granite over the floor, columns standing in the water, lamps hung over it
DEC.cistern=(s,p,q,u,v,X,Z,iv)=>{const y=q.y0,du=u-q.u0,dv=v-q.v0,W=q.u1-q.u0,Dv=q.v1-q.v0,inB=du>=2&&du<=W-2&&dv>=2&&dv<=Dv-2;
  RBP(X,y-3,Z,DGRAN);RBP(X,y-2,Z,DGRAN);if(!inB)return;RBS(X,Z,y-2,y-1,WATER);
  if(du%4===0&&dv%4===0){RBS(X,Z,y-2,iv[1]-1,DCOL);RBP(X,iv[1],Z,DKNOT);}else if(du%4===2&&dv%4===2)dHang(X,Z,iv[1],2);};
// a landing about a shaft: a rail of iron round the shaft but where its ladder is, crates, barrels and carts by its walls, a
// winding drum with its cogwheels beside the shaft at the top, lamps
DEC.landing=(s,p,q,u,v,X,Z,iv)=>{const y=q.y0,S=q.sh;
  if(S){const d=Math.hypot(u-S.cu,v-S.cv);if(d<=S.r)return;if(d<=S.r+1.2){if(!(u>S.cu+0.5&&Math.abs(v-S.cv)<1.5))RBP(X,y,Z,GRATE);return;}
    if(q.drum&&Math.abs(u-S.cu)<0.6&&Math.abs(Math.abs(v-S.cv)-S.r-2)<0.6){RBP(X,y,Z,DPROP);RBP(X,y+1,Z,DGEAR);RBP(X,y+2,Z,DPROP);return;}
    if(q.drum&&Math.abs(u-S.cu)<0.6&&Math.abs(v-S.cv)>S.r+1.2&&Math.abs(v-S.cv)<S.r+2){RBP(X,y+1,Z,DPROP);return;}}
  const edge=u===q.u0||u===q.u1||v===q.v0||v===q.v1,h=hsh(X,9479,Z);
  if(edge&&h<0.3){RBP(X,y,Z,[CRATE,BARREL,DCART][(h*10)|0]);return;}
  if(((u-q.u0)%5+5)%5===2&&((v-q.v0)%5+5)%5===2)dHang(X,Z,iv[1],1);};
// a shaft: the hoist's chain down its middle, a ladder down its side
DEC.shaft=(s,p,q,u,v,X,Z,iv)=>{const a=u-q.cu,b=v-q.cv;if(Math.abs(a)<0.6&&Math.abs(b)<0.6){RBS(X,Z,q.y0,q.y1,CHAIN);return;}
  if(Math.abs(a-(Math.floor(q.r)))<0.6&&Math.abs(b)<0.6)RBS(X,Z,q.y0,q.y1,LADDER);};
// a gallery of the mines (along ax): a set of timbers every four (two props and a cap), a lamp hung from every other cap's
// middle, an ore cart standing here and there
DEC.gal=(s,p,q,u,v,X,Z,iv)=>{const y=q.y0,a=q.ax==='u'?u-q.u0:v-q.v0,c=q.ax==='u'?v-q.v0:u-q.u0,cw=q.ax==='u'?q.v1-q.v0:q.u1-q.u0,top=iv[1];
  if(a%4===0){if(c===0||c===cw)RBS(X,Z,y,top-1,DPROP);RBP(X,top,Z,DPROP);return;}
  if(a%8===2&&c===(cw>>1))RBP(X,top,Z,DLAMP);else if(a%8===6&&c===0&&hsh(X,9481,Z)<0.4)RBP(X,y,Z,DCART);};
// the smelting hall: great furnaces of firebrick (q.fs) glowing within and at their mouths, channels of molten iron run from
// them across the floor, heaps of slag in its corners, carts of ore, lamps
DEC.smelt=(s,p,q,u,v,X,Z,iv)=>{const y=q.y0,top=iv[1];
  for(const [fu,fv] of q.fs){const a=u-fu,b=v-fv,d=Math.hypot(a,b);
    if(d<=3.5){for(let yy=y;yy<=top-2;yy++){const r=3.5-(yy-y)/(top-y)*1.2;if(d>r+0.4)continue;RBP(X,yy,Z,d<r-0.9?(yy<=y+3?DMOLTEN:AIR):yy===y+3?DKNOT:DFORGE);}
      if(a<-2.4&&Math.abs(b)<0.6){RBP(X,y,Z,DMOLTEN);RBP(X,y+1,Z,DMOLTEN);RBP(X,y+2,Z,DKNOT);}return;}
    if(Math.abs(b)<0.6&&a<-3.5&&a>=-9){RBP(X,y-1,Z,DMOLTEN);return;}if(Math.abs(Math.abs(b)-1)<0.6&&a<-3.5&&a>=-9){RBP(X,y,Z,DKNOT);return;}}
  const cnr=(u-q.u0<3||q.u1-u<3)&&(v-q.v0<3||q.v1-v<3);if(cnr){const h=Math.max(0,3-Math.min(u-q.u0,q.u1-u,v-q.v0,q.v1-v));RBS(X,Z,y,y+h,DSLAG);return;}
  if((v===q.v0||v===q.v1)&&hsh(X,9483,Z)<0.25)RBP(X,y,Z,DCART);else if(((u-q.u0)%6+6)%6===3&&(v===q.v0+2||v===q.v1-2))dHang(X,Z,top,2);};
// ---- Above the ground
// The ground of a terraced site: paving, gravel and setts on the terraces, and where a terrace stands over the ground beside it
// a retaining wall of granite courses under a knotwork coping (a parapet on the higher ones); the way from the gate is paved in
// flagstones and climbs by stairs where it meets a terrace's edge, between walls, with lamps on columns. The massif is left as
// it stands.
RB.dground=(s,p,u,v,X,Z)=>{const d=Math.hypot(u,v);if(d>s.R-1.5)return;const L=siteLayout(s);if(L.mass&&massifAt(L.mass,u,v)>=dvLvl(s,u,v))return;const g=DVG(s,u,v),av=Math.abs(v);
  if(p.way(u,v)){const h=Math.max(g,p.stairs(u));if(h>g)RBS(X,Z,g+1,h-1,DCOURSE);RBP(X,h,Z,av===p.ww?DCOURSE:DFLAG);RBS(X,Z,h+1,h+5,AIR);
    if(av===p.ww&&h===g&&((u%8)+8)%8===4){RBS(X,Z,h+1,h+3,DCOL);RBP(X,h+4,Z,DLAMP);}return;}
  if(av===p.ww+1&&p.onWay(u)){const h=p.stairs(u);if(h>g){RBS(X,Z,g+1,h,DCOURSE);RBP(X,h+1,Z,DKNOT);return;}}
  let lo=g;for(const [du,dv] of [[1,0],[-1,0],[0,1],[0,-1]])lo=Math.min(lo,DVG(s,u+du,v+dv));const pd=elfPad(s,u,v);
  if(lo<g){for(let y=lo+1;y<g;y++)RBP(X,y,Z,DCOURSE);RBP(X,g,Z,DKNOT);if(!pd&&g-lo>=3&&d<s.R-3&&(((u+v)%2)+2)%2===0)RBP(X,g+1,Z,DGRAN);return;}
  const q=hsh(X,9471,Z);RBP(X,g,Z,q<0.6?PAVING:q<0.85?GRAVEL:COBBLE);RBS(X,Z,g+1,g+3,AIR);};
// steps from a building's door out to the terrace before it (as the elves' estep, in granite)
RB.dstep=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),k=D-b,t=dvLvl(s,u,v),dm=Math.abs(a-(W-1)/2);if(t===p.y||dm>p.w+1.01)return;
  const gp=siteLayout(s).parts[0];if(elfPad(s,u,v)||gp.k==='dground'&&gp.way(u,v))return;
  const h=p.y>t?Math.max(t,p.y-k):Math.min(t,p.y+k);
  if(h>t){if(dm>p.w){if(h-1>t){RBS(X,Z,t+1,h,DCOURSE);RBP(X,h+1,Z,DKNOT);}return;}RBS(X,Z,t+1,h-1,DCOURSE);RBP(X,h,Z,DFLAG);RBS(X,Z,h+1,h+4,AIR);return;}
  if(dm>p.w){RBS(X,Z,h+1,t,DCOURSE);return;}RBP(X,h,Z,DFLAG);RBS(X,Z,h+1,Math.max(t,h)+4,AIR);};
// A house of the dwarves (p.W across, p.D deep, p.st storeys of five, its floor p.y, its front facing p.f): granite courses on a
// footing of dressed granite, quoins at its corners, a knotwork band under the eaves, small windows barred in iron, a door under a
// knotwork lintel with a lamp beside it; a steep roof of slate between granite gables, a knotwork ridge, a chimney of firebrick;
// inside, flagstones, timber floors and a ladder, a fire basket on the hearth, barrels, a lamp to each storey
RB.dhouse=(s,p,u,v,X,Z)=>{const [a0,b0]=partAB(p,u,v),a=a0-1,b=b0-1,W=p.W,D=p.D,g=p.y,st=p.st||1,sh=5,eave=g+st*sh,mid=(W-1)/2,dm=Math.abs(a-mid);
  const inA=a>=0&&a<W,core=inA&&b>=0&&b<D,wall=core&&(a===0||a===W-1||b===0||b===D-1);
  RBP(X,g,Z,core?DFLAG:PAVING);
  if(core){if(wall){const cor=(a===0||a===W-1)&&(b===0||b===D-1),side=a===0||a===W-1,pa=side?b:a;
      for(let y=g+1;y<=eave;y++){const ry=(y-g-1)%sh;let id=y===g+1||cor?DGRAN:ry===sh-1?DKNOT:DCOURSE;
        if(!cor&&ry===2&&pa%3===1&&!(b===0&&dm<=1.01))id=GRATE;
        if(b===0&&dm<=0.51&&y<=g+3)id=AIR;if(b===0&&dm<=1.01&&y===g+4)id=DKNOT;
        RBP(X,y,Z,id);}}
    else{RBS(X,Z,g+1,eave,AIR);for(let k=1;k<st;k++)RBP(X,g+k*sh,Z,a===1&&b===D-2?AIR:PLANKS);if(a===1&&b===D-2&&st>1)RBS(X,Z,g+1,g+(st-1)*sh,LADDER);
      if(a===W-2&&b===D-2)RBP(X,g+1,Z,BRAZIER);else if(a===W-2&&b===1)RBP(X,g+1,Z,BARREL);
      for(let k=0;k<st;k++)if(Math.abs(a-mid)<0.6&&Math.abs(b-(D>>1))<0.6)RBP(X,g+k*sh+sh-1,Z,DLAMP);}}
  else if(b===-1&&Math.abs(dm-2)<0.6)RBP(X,g+3,Z,DLAMP);
  // the roof: its ridge along the depth, a block out over the walls all round
  const pos=Math.min(a+1,W-a),ry=eave+pos;if(pos>=0&&b>=-1&&b<=D)RBS(X,Z,Math.max(eave,ry-1),ry,dm<0.6?DKNOT:SLATE);
  if(inA&&(b===0||b===D-1))for(let y=eave+1;y<ry;y++)RBP(X,y,Z,DGRAN);
  if(a===W-2&&b===D-1)RBS(X,Z,eave+1,eave+Math.ceil(W/2)+2,DFORGE);};
// A square tower (half-width p.h2, p.H over p.y): a battered foot of dressed granite reaching down to the ground, courses with a
// knotwork band every six, arrow slits in the middle of each face, a door toward p.door; corbels under a parapet of merlons round
// a platform of flagstones; on the platform a ballista (p.ball, aimed toward -u), a beacon (p.fire) or the banner (p.flag);
// inside, timber floors every six and a ladder
RB.dtower=(s,p,u,v,X,Z)=>{const a=u-p.cu,b=v-p.cv,aa=Math.abs(a),ab=Math.abs(b),m=Math.max(aa,ab),h2=p.h2,g=p.y,top=g+p.H;if(m>h2+1)return;const gnd=DVG(s,u,v);
  if(m>h2){if(gnd<g)RBS(X,Z,gnd+1,g,DGRAN);RBS(X,Z,g+1,g+2,DGRAN);RBP(X,top-1,Z,DKNOT);RBP(X,top,Z,DGRAN);
    const t=(a+b+h2*4)%2===0;RBP(X,top+1,Z,t?DGRAN:AIR);if(t)RBP(X,top+2,Z,DKNOT);return;}
  if(gnd<g)RBS(X,Z,gnd+1,g-1,DGRAN);RBP(X,g,Z,DFLAG);const dr=p.door||0,door=(dr===0?a===-h2:dr===1?a===h2:dr===2?b===-h2:b===h2)&&(dr<2?ab:aa)<1.01;
  const lad=a===h2-1&&b===0;
  for(let y=g+1;y<=top;y++){const dy=y-g;let id;
    if(m===h2){id=aa===h2&&ab===h2?DGRAN:dy%6===0?DKNOT:DCOURSE;if((aa<0.6||ab<0.6)&&dy%6>=3&&dy%6<=4&&y<top-2)id=AIR;if(door&&dy<=3)id=AIR;}
    else id=lad&&y<top?LADDER:y===top?DFLAG:dy%6===0?PLANKS:dy%6===5&&a===0&&b===0?DLAMP:AIR;
    RBP(X,y,Z,id);}
  if(m<h2&&lad)RBP(X,top,Z,LADDER);
  // the platform's piece
  if(p.ball&&ab<=1&&a<=1&&a>=-h2){if(a===1&&b===0)RBP(X,top+1,Z,DPROP);if(a===0&&b===0){RBP(X,top+1,Z,DPROP);RBP(X,top+2,Z,DGEAR);}
    if(a===-1&&ab<=1)RBP(X,top+2,Z,ab===1?DBRONZE:DPROP);if(a<-1&&b===0)RBP(X,top+2,Z,a===-h2?STEELB:DPROP);}
  if(p.fire&&a===0&&b===0)RBP(X,top+1,Z,BRAZIER);
  if(p.flag&&a===1-h2&&b===h2-1)RBS(X,Z,top+1,top+5,DCOL);if(p.flag&&a===1-h2&&b===h2-2)RBS(X,Z,top+3,top+5,DBANNER);};
// A wall round a city or a bastion (p.r its line, four thick, p.H over the ground at each column, so it steps with the land; not
// where the massif stands): a footing of dressed granite, courses with knotwork bands, a walk of flagstones behind merlons on its
// outer edge; the gate's passage (p.gw either side of the middle, toward -u) under its portcullis, drawn up
RB.dwall=(s,p,u,v,X,Z)=>{const d=Math.hypot(u,v),R=p.r;if(d<R-2||d>=R+2)return;const L=siteLayout(s);if(L.mass&&massifAt(L.mass,u,v)>=0)return;
  const g=DVG(s,u,v),top=g+p.H,av=Math.abs(v),gate=u<0&&av<=p.gw+0.5;
  if(gate){RBP(X,g,Z,DFLAG);RBS(X,Z,g+1,g+p.gh-1,AIR);RBP(X,g+p.gh,Z,GRATE);RBP(X,g+p.gh+1,Z,DKNOT);RBS(X,Z,g+p.gh+2,top,DCOURSE);RBP(X,top,Z,DFLAG);return;}
  for(let y=g+1;y<=top;y++)RBP(X,y,Z,y<=g+2?DGRAN:(y-g)%6===0?DKNOT:DCOURSE);
  if(d>=R+1){const t=Math.round(Math.atan2(v,u)*R),k=((t%3)+3)%3;if(k<2)RBP(X,top+1,Z,DGRAN);if(k===0)RBP(X,top+2,Z,DKNOT);}else RBP(X,top,Z,DFLAG);};
// A smithy (p.W by p.D, its front open toward p.f): columns at its corners, walls of courses to the eaves at the sides and back,
// a roof of slate; at the back a hearth of firebrick glowing at its mouth with a chimney up through the roof, bellows of hide,
// anvils before it, a quench barrel, an ore cart and crates
RB.dforge=(s,p,u,v,X,Z)=>{const [a0,b0]=partAB(p,u,v),a=a0-1,b=b0-1,W=p.W,D=p.D,g=p.y,eave=g+5,mid=(W-1)/2,dm=Math.abs(a-mid),inA=a>=0&&a<W,core=inA&&b>=0&&b<D;
  RBP(X,g,Z,core?DFLAG:PAVING);if(!core){if(b===-1||b===D||a===-1||a===W)RBP(X,eave,Z,SLATE);return;}
  const cor=(a===0||a===W-1)&&(b===0||b===D-1),side=(a===0||a===W-1||b===D-1)&&b>0;
  for(let y=g+1;y<eave;y++)RBP(X,y,Z,cor?DCOL:side?(y===eave-1?DKNOT:DCOURSE):AIR);RBP(X,eave,Z,cor||dm<0.6?DKNOT:SLATE);
  if(b>=D-3&&b<=D-2&&dm<=1.01){RBP(X,g+1,Z,DFORGE);RBP(X,g+2,Z,dm<0.6&&b===D-3?DMOLTEN:DFORGE);RBP(X,g+3,Z,DFORGE);if(b===D-2&&dm<0.6)RBS(X,Z,g+4,eave+4,DFORGE);else RBP(X,g+4,Z,DFORGE);return;}
  if(b===D-3&&Math.abs(dm-2)<0.6&&a<mid)RBS(X,Z,g+1,g+2,HIDE);else if(b===D-3&&Math.abs(dm-2)<0.6)RBP(X,g+1,Z,BARREL);
  else if(b===2&&Math.abs(dm-1.5)<0.6)RBP(X,g+1,Z,DANVIL);else if(b===1&&a===0)RBP(X,g+1,Z,DCART);else if(b===1&&a===W-1)RBP(X,g+1,Z,CRATE);
  else if(dm<0.6&&b===1)RBP(X,eave-1,Z,DLAMP);};
// A smelting furnace (round, about (p.cu, p.cv), p.H high, narrowing as it rises): firebrick with a knotwork band, molten iron
// within it glowing at its mouth (toward -u) and at its top; a ladder and a deck of timber at its back for charging it
RB.dsmelt=(s,p,u,v,X,Z)=>{const a=u-p.cu,b=v-p.cv,d=Math.hypot(a,b),g=p.y,H=p.H;if(d>4.6)return;RBP(X,g,Z,DFLAG);
  for(let y=g+1;y<=g+H;y++){const r=3.6-(y-g)/H*1.6;if(d>r+0.5){if(y>g+3)continue;RBP(X,y,Z,AIR);continue;}const shell=d>r-0.9;
    RBP(X,y,Z,shell?(y===g+4?DKNOT:DFORGE):y<g+H-1?DMOLTEN:AIR);}
  if(a<-2.4&&Math.abs(b)<0.6){RBP(X,g+1,Z,DMOLTEN);RBP(X,g+2,Z,DMOLTEN);RBP(X,g+3,Z,DKNOT);}
  if(a>3.4&&a<4.6&&Math.abs(b)<0.6)RBS(X,Z,g+1,g+H-4,LADDER);if(a>2.4&&Math.abs(b)<=1.01&&d>3)RBP(X,g+H-4,Z,DPROP);};
// A headframe over a shaft (about (p.cu, p.cv), the shaft p.r across, its mouth at p.y): a collar of flagstones railed in iron
// but on the ladder's side, four legs of timber leaning in to a deck p.H up, braced every five, and over the deck the sheave
// wheel standing across v on its iron axle; the hoist's chain from the wheel down into the shaft
RB.dhead=(s,p,u,v,X,Z)=>{const a=u-p.cu,b=v-p.cv,g=p.y,H=p.H,aa=Math.abs(a),ab=Math.abs(b),d=Math.hypot(a,b);if(aa>5||ab>5)return;
  if(d>p.r&&d<=p.r+1.3){RBP(X,g,Z,DFLAG);if(!(a>0&&ab<1.5))RBP(X,g+1,Z,GRATE);}
  for(let y=g+1;y<=g+H;y++){const t=(y-g-1)/(H-1),e=Math.round(4.6-1.6*t);if(aa===e&&ab===e)RBP(X,y,Z,DPROP);if((y-g)%5===0&&((aa===e&&ab<=e)||(ab===e&&aa<=e))&&d>p.r)RBP(X,y,Z,DPROP);}
  if(aa<=3&&ab<=3&&!(aa<1&&ab<1))RBP(X,g+H,Z,DPROP);
  if(aa<0.6){const cy=g+H+4.5;for(let y=g+H+1;y<=g+H+9;y++){const r=Math.hypot(b,y-cy);if(Math.abs(r-3.4)<0.6||r<3.4&&(Math.abs(b)<0.6||Math.abs(y-cy)<0.6))RBP(X,y,Z,r<0.8?DGEAR:DPROP);}}
  if(aa<0.6&&ab<0.6)RBS(X,Z,g+1,g+H+1,CHAIN);};
// A treadwheel crane (about (p.cu, p.cv)): the great wheel of timber standing across v between two rims, its spokes and iron
// axle; two posts carrying a beam out to the jib, a chain hung from its end and a block of granite on it
RB.dcrane=(s,p,u,v,X,Z)=>{const a=u-p.cu,b=v-p.cv,aa=Math.abs(a),g=p.y,cy=g+5.5;if(aa>1||b<-6||b>9)return;
  if(aa===1&&Math.abs(b)<=5){for(let y=g+1;y<=g+10;y++){const r=Math.hypot(b,y-cy),sp=r<4.3&&(Math.abs(b)<0.6||Math.abs(y-cy)<0.6||Math.abs(Math.abs(b)-Math.abs(y-cy))<0.6);if(Math.abs(r-4.3)<0.6||sp)RBP(X,y,Z,DPROP);}}
  if(aa===0&&b===0)RBP(X,Math.round(cy),Z,DGEAR);
  if(aa===0&&Math.abs(b)===6)RBS(X,Z,g+1,g+11,DPROP);if(aa===0&&b>=-6&&b<=9)RBP(X,g+12,Z,DPROP);
  if(aa===0&&b===9){RBS(X,Z,g+6,g+11,CHAIN);RBP(X,g+5,Z,DGRAN);}};
// A trebuchet (its front toward p.f, 7 across and 12 deep): two frames of timber on their sills, the axle across them, the arm
// drawn down to the back with its sling and a stone in it, the counterweight of bronze hung high at its front
RB.dtreb=(s,p,u,v,X,Z)=>{const [a,b]=partAB(p,u,v),g=p.y;
  if((a===1||a===5)&&b>=2&&b<=10)RBP(X,g+1,Z,DPROP);
  if(a===1||a===5){for(let y=g+2;y<=g+8;y++){const t=(y-g-2)/6,f=Math.round(3+3*t),k=Math.round(9-3*t);if(b===f||b===k)RBP(X,y,Z,DPROP);}}
  if(a>=1&&a<=5&&b===6)RBP(X,g+9,Z,a===3?DGEAR:DPROP);
  if(a===3){for(let bb=2;bb<=11;bb++)if(b===bb){const y=Math.round(g+9+(6-bb)*1.2);if(y>g)RBP(X,y,Z,DPROP);}
    if(b===2)RBS(X,Z,g+11,g+13,CHAIN);if(b===11)RBP(X,g+1,Z,DGRAN);}
  if(a>=2&&a<=4&&b>=1&&b<=3)RBS(X,Z,g+8,g+10,DBRONZE);};
// a heap of slag (p.slag) or of spoil from the mines, its ore showing here and there
RB.dheap=(s,p,u,v,X,Z)=>{const d=Math.hypot(u-p.cu,v-p.cv);if(d>p.r)return;const h=Math.round(p.H*(1-d/p.r)),g=p.y;
  for(let y=g+1;y<=g+h;y++)RBP(X,y,Z,p.slag?(hsh(X*3+y,9485,Z)<0.1?COBBLE:DSLAG):(hsh(X*3+y,9487,Z)<0.07?IRON:GRAVEL));};
// The forecourt before the great gate: flagstones within a knotwork border, fire baskets on granite blocks at its corners
RB.dcourt=(s,p,u,v,X,Z)=>{const g=p.y,edge=u===p.u0||u===p.u1||v===p.v0||v===p.v1;RBP(X,g,Z,edge?DKNOT:DFLAG);RBS(X,Z,g+1,g+6,AIR);
  if((u===p.u0||u===p.u1)&&(v===p.v0||v===p.v1)){RBP(X,g+1,Z,DGRAN);RBP(X,g+2,Z,BRAZIER);}};
// The face of the massif over the great gate (p.f the face's u, |v| up to p.w): dressed in courses with knotwork bands; columns
// standing out before it either side of the gate under a great knotwork lintel; pilasters along it; over the lintel the sign of
// the mountain worked in bronze and granite, banners either side; lamps on brackets by the gate
RB.dfacade=(s,p,u,v,X,Z)=>{const F=p.f,av=Math.abs(v),Y=p.y,g=u===F?hAt(X,Z):Math.max(Y,massifAt(siteLayout(s).mass,F,v));
  if(u===F){for(let y=Y+1;y<=Math.min(g,Y+40);y++){if(GW(X,y,Z)===AIR)continue;RBP(X,y,Z,(y-Y)%12===0?DKNOT:DCOURSE);}return;}
  if(u!==F-1)return;
  if(av>=6&&av<=7){RBS(X,Z,Y+1,Y+11,DCOL);RBP(X,Y+12,Z,DKNOT);return;}
  if(av<=7&&av<6){RBS(X,Z,Y+11,Y+13,DKNOT);}
  if(av<6&&av>=0){ // the sign over the lintel: the anvil in bronze under three peaks of granite
    const k=v;if(Y+16<=g){if(Math.abs(k)<=1)RBP(X,Y+15,Z,DBRONZE);if(k===0)RBP(X,Y+16,Z,DBRONZE);if(Math.abs(k)<=3||k===-4)RBP(X,Y+17,Z,GOLDB);
      for(let y=Y+19;y<=Y+24;y++){if(Math.abs(k)<=Math.max(0,(Y+24-y)*0.7))RBP(X,y,Z,y>=Y+23?PSNOW:DGRAN);if(Math.abs(Math.abs(k)-4)<=Math.max(0,(Y+22-y)*0.7)&&y<=Y+22)RBP(X,y,Z,DGRAN);}}}
  if(av===8)RBS(X,Z,Y+3,Y+9,DBANNER);
  if(av>=12&&av%8===4&&av<=p.w){RBS(X,Z,Y+1,Math.min(g,Y+28),DCOL);RBP(X,Math.min(g,Y+28)+0,Z,DKNOT);}};
// A colossal statue of a dwarf king of old (9 across, 6 deep, facing p.f), on a plinth of courses: booted feet, a mail skirt,
// a broad body belted in knotwork, a beard falling to the belt between two braids, the great axe held head-down before him with
// both hands on its haft, knotwork pauldrons, a stern face under a crested helm, a cloak behind
RB.dstatue=(s,p,u,v,X,Z)=>{const [a,b]=partAB(p,u,v),g=p.y,y0=g+4,at=(dy,id)=>RBP(X,y0+dy,Z,id);
  RBS(X,Z,g+1,g+2,DCOURSE);RBP(X,g+3,Z,DKNOT);RBS(X,Z,y0,y0+24,AIR);
  if(b>=1&&b<=4&&(a>=1&&a<=3||a>=5&&a<=7))for(let dy=0;dy<=1;dy++)at(dy,DGRAN); // the boots
  if(b>=1&&b<=4&&a>=1&&a<=7)for(let dy=2;dy<=7;dy++)at(dy,dy===2?DKNOT:DCOURSE); // the mail skirt
  if(b>=1&&b<=4&&a>=0&&a<=8)for(let dy=8;dy<=13;dy++)at(dy,dy===8?DKNOT:DGRAN); // the body, the belt
  if(b>=1&&b<=4&&a>=0&&a<=8)for(let dy=14;dy<=15;dy++)at(dy,DKNOT); // the pauldrons
  if(b===5&&a>=1&&a<=7)for(let dy=4;dy<=15;dy++)at(dy,DCOURSE); // the cloak
  if(b===0&&a===4)for(let dy=2;dy<=13;dy++)at(dy,DCOL); // the haft
  if(b===0&&a>=2&&a<=6)for(let dy=1;dy<=3;dy++)if(Math.abs(a-4)<=(dy===2?2:1))at(dy,DGRAN); // the axe's head, down
  if(b===0&&a>=3&&a<=5)for(let dy=12;dy<=13;dy++)at(dy,DGRAN); // the hands on the haft
  if(b===0)for(let dy=8;dy<=15;dy++){const w=dy>=14?2:dy>=11?1.5:1;if(Math.abs(a-4)<=w&&!(a===4&&dy<=13))at(dy,DCOURSE);} // the beard
  if(b===0&&(a===2||a===6))for(let dy=9;dy<=13;dy++)at(dy,dy%2?DKNOT:DCOURSE); // the braids
  if(b>=1&&b<=4&&a>=2&&a<=6)for(let dy=16;dy<=19;dy++)at(dy,DGRAN); // the head
  if(b===0&&a===4){at(16,DGRAN);at(17,DGRAN);} // the nose
  if(b===0&&(a===3||a===5))at(18,DKNOT); // the brows
  if(b>=0&&b<=5&&a>=1&&a<=7)at(20,DKNOT); // the helm's rim
  if(b>=1&&b<=4&&a>=2&&a<=6)at(21,DGRAN);if(b>=2&&b<=3&&a>=3&&a<=5)at(22,DGRAN); // the helm
  if(a===4&&b>=1&&b<=4)at(23,DKNOT);}; // its crest
// ---- Layouts
function dwarfLayout(s,L,r){L.water=[];if(s.k==='city')dwarfCity(s,L,r);else if(s.k==='fort')dwarfBastion(s,L,r);else if(s.k==='village')dwarfTown(s,L,r);else if(s.k==='farm')dwarfMine(s,L,r);else dwarfLookout(s,L,r);
  if(L.hold&&L.hold.length){let y0=1e9,y1=-1e9,u0=1e9,u1=-1e9,v0=1e9,v1=-1e9;for(const q of L.hold){u0=Math.min(u0,q.bu0);u1=Math.max(u1,q.bu1);v0=Math.min(v0,q.bv0);v1=Math.max(v1,q.bv1);}
    // the workings are carved after the ground and before the buildings
    L.parts.splice(1,0,{k:'dhold',u0:u0-1,u1:u1+1,v0:v0-1,v1:v1+1,S:L.hold,y0:L.holdY||s.T});}}
// the toolkit: the ground's level, boxes taken, platforms, buildings with their steps, and the workings below with their cover
function dwKit(s,L){
  const P=L.parts,taken=[],R=s.R,lvl=(u,v)=>dvLvl(s,u,v);L.hold=L.hold||[];
  const inM=(u,v)=>!!L.mass&&massifAt(L.mass,u,v)>=0;
  const free=(a0,a1,b0,b1)=>{if(taken.some(q=>!(a1<q[0]||a0>q[1]||b1<q[2]||b0>q[3])))return false;if(Math.hypot(Math.max(Math.abs(a0),Math.abs(a1)),Math.max(Math.abs(b0),Math.abs(b1)))>=R-2)return false;
    for(let a=a0;a<=a1+2;a+=3)for(let b=b0;b<=b1+2;b+=3)if(inM(Math.min(a,a1),Math.min(b,b1)))return false;return true;};
  const take=(a0,a1,b0,b1)=>taken.push([a0,a1,b0,b1]);
  const pad=(u0,u1,v0,v1,y)=>{L.pads.push({u0:u0,u1:u1,v0:v0,v1:v1,y:y});take(u0-1,u1+1,v0-1,v1+1);};
  const downhill=(u,v)=>{const gu=dvRaw(s,u+6,v)-dvRaw(s,u-6,v),gv=dvRaw(s,u,v+6)-dvRaw(s,u,v-6);return Math.abs(gu)>=Math.abs(gv)?(gu>0?0:1):(gv>0?2:3);};
  // a building on its platform (k its builder), W across and D deep, facing f, with steps from its door
  const bld=(k,cu,cv,W,D,f,o)=>{const bw=W+2,bd=D+2,ac=f<2,hu=ac?bd:bw,hv=ac?bw:bd,u0=Math.round(cu-hu/2),v0=Math.round(cv-hv/2),u1=u0+hu-1,v1=v0+hv-1;
    const su=f===0?[u0-8,u0-1]:f===1?[u1+1,u1+8]:[u0,u1],sv=f===2?[v0-8,v0-1]:f===3?[v1+1,v1+8]:[v0,v1];
    if(!free(u0-1,u1+1,v0-1,v1+1))return null;const y=lvl((u0+u1)/2,(v0+v1)/2);
    const p=Object.assign({k:k,u0:u0,u1:u1,v0:v0,v1:v1,f:f,W:W,D:D,y:y},o||{});P.push(p);pad(u0,u1,v0,v1,y);
    P.push(Object.assign({k:'dstep',f:f,y:y,w:1.6},f<2?{u0:su[0],u1:su[1],v0:v0,v1:v1}:{u0:u0,u1:u1,v0:sv[0],v1:sv[1]}));
    if(f===0)take(u0-3,u0-1,v0,v1);else if(f===1)take(u1+1,u1+3,v0,v1);else if(f===2)take(u0,u1,v0-3,v0-1);else take(u0,u1,v1+1,v1+3);
    const fu=f<2?(f===0?u0-3:u1+3):(u0+u1)/2,fv=f<2?(v0+v1)/2:(f===2?v0-3:v1+3);p.front=[Math.round(fu),Math.round(fv)];return p;};
  const tower=(cu,cv,h2,H,o,force)=>{const e=o&&o.nopad?h2+1:h2+2;if(!force&&!free(cu-e,cu+e,cv-e,cv+e))return null;const y=o&&o.y!==undefined?o.y:lvl(cu,cv);
    const p=Object.assign({k:'dtower',u0:cu-h2-1,u1:cu+h2+1,v0:cv-h2-1,v1:cv+h2+1,cu:cu,cv:cv,h2:h2,H:H,y:y},o||{});P.push(p);if(o&&o.nopad)take(cu-e,cu+e,cv-e,cv+e);else pad(cu-h2-1,cu+h2+1,cv-h2-1,cv+h2+1,y);return p;};
  const round=(k,cu,cv,e,o)=>{if(!free(cu-e,cu+e,cv-e,cv+e))return null;const y=lvl(cu,cv);const p=Object.assign({k:k,u0:cu-e,u1:cu+e,v0:cv-e,v1:cv+e,cu:cu,cv:cv,y:y},o||{});P.push(p);pad(cu-e,cu+e,cv-e,cv+e,y);return p;};
  const smelt=(cu,cv)=>round('dsmelt',cu,cv,5,{H:13});
  const heap=(cu,cv,r,H,slag)=>{const e=Math.ceil(r);if(!free(cu-e,cu+e,cv-e,cv+e))return null;const y=lvl(cu,cv);P.push({k:'dheap',u0:cu-e,u1:cu+e,v0:cv-e,v1:cv+e,cu:cu,cv:cv,r:r,H:H,slag:slag,y:y});pad(cu-e,cu+e,cv-e,cv+e,y);return y;};
  const crane=(cu,cv)=>{if(!free(cu-2,cu+2,cv-7,cv+10))return null;const y=lvl(cu,cv);P.push({k:'dcrane',u0:cu-1,u1:cu+1,v0:cv-6,v1:cv+9,cu:cu,cv:cv,y:y});pad(cu-1,cu+1,cv-6,cv+9,y);return y;};
  const treb=(cu,cv,f)=>{const ac=f<2,hu=ac?12:7,hv=ac?7:12,u0=cu-(hu>>1),v0=cv-(hv>>1);if(!free(u0-1,u0+hu,v0-1,v0+hv))return null;const y=lvl(cu,cv);
    P.push({k:'dtreb',u0:u0,u1:u0+hu-1,v0:v0,v1:v0+hv-1,f:f,y:y});pad(u0,u0+hu-1,v0,v0+hv-1,y);return y;};
  // the workings: a shape is kept where the ground over it stands four or more above its interior (or where it is open, o.open)
  const covered=q=>{if(q.open)return true;for(let u=q.bu0;u<=q.bu1+2;u+=3)for(let v=q.bv0;v<=q.bv1+2;v+=3){const uu=Math.min(u,q.bu1),vv=Math.min(v,q.bv1),iv=dIv(q,uu,vv);if(!iv)continue;if(dvGnd(s,L,uu,vv)<iv[1]+4)return false;}return true;};
  const ug=(q,force)=>{dBox(q);if(!force&&!covered(q))return null;L.hold.push(q);return q;};
  const room=(k,u0,u1,v0,v1,y,h,o)=>ug(Object.assign({t:'b',k:k,st:1,u0:u0,u1:u1,v0:v0,v1:v1,y0:y+1,y1:y+h},o||{}),o&&o.force);
  // a gallery from (u, v) along ax (+1 or -1 by dir) up to len, three wide and four high, kept as far as its cover holds; side
  // drifts off it every eight, alternately left and right
  const gallery=(u,v,y,ax,dir,len,side)=>{let n=0;for(let k=4;k<=len;k+=4){const a0=dir>0?0:-k+1,a1=dir>0?k-1:0,q=ax==='u'?{t:'b',k:'gal',st:2,ax:'u',u0:u+a0,u1:u+a1,v0:v-1,v1:v+1,y0:y+1,y1:y+4}:{t:'b',k:'gal',st:2,ax:'v',v0:v+a0,v1:v+a1,u0:u-1,u1:u+1,y0:y+1,y1:y+4};
      dBox(q);if(!covered(q))break;n=k;}
    if(n<4)return 0;const a0=dir>0?0:-n+1,a1=dir>0?n-1:0;ug(ax==='u'?{t:'b',k:'gal',st:2,ax:'u',u0:u+a0,u1:u+a1,v0:v-1,v1:v+1,y0:y+1,y1:y+4}:{t:'b',k:'gal',st:2,ax:'v',v0:v+a0,v1:v+a1,u0:u-1,u1:u+1,y0:y+1,y1:y+4},true);
    if(side)for(let k=8;k<n-2;k+=8){const sd=(k/8)%2?1:-1,l=side+((hsh(u+k,9489,v)*6)|0),pu=ax==='u'?u+dir*k:u,pv=ax==='v'?v+dir*k:v;
      if(ax==='u')gallery(pu,pv+sd*2,y,'v',sd,l,0);else gallery(pu+sd*2,pv,y,'u',sd,l,0);}
    return n;};
  const shaft=(cu,cv,y0,y1,r)=>ug({t:'c',k:'shaft',st:1,cu:cu,cv:cv,r:r||2.5,y0:y0,y1:y1,open:1},true);
  return {P:P,R:R,lvl:lvl,free:free,take:take,pad:pad,downhill:downhill,bld:bld,tower:tower,smelt:smelt,heap:heap,crane:crane,treb:treb,covered:covered,ug:ug,room:room,gallery:gallery,shaft:shaft,inM:inM};}
// the ground part with its way: from the gate (u = -R) up to uEnd, ww either side of the middle, its stairs' tops cached
function dwGroundPart(s,L,uEnd,ww){const cache=new Map(),onWay=u=>u>=-s.R&&u<=uEnd,
  stairs=u=>{let h=cache.get(u);if(h!==undefined)return h;h=DVG(s,u,0);for(let k=1;k<=14;k++){h=Math.max(h,DVG(s,u+k,0)-k,DVG(s,u-k,0)-k);}cache.set(u,h);return h;};
  L.parts.unshift({k:'dground',u0:-s.R,u1:s.R,v0:-s.R,v1:s.R,f:0,ww:ww,onWay:onWay,way:(u,v)=>onWay(u)&&Math.abs(v)<=ww,stairs:stairs});}
// a mine under a headframe: the frame over a shaft from the ground (y) down to its levels (each `dep` below the last), a
// landing about the shaft at each with galleries out from it as far as the rock covers them
function dwMineHead(K,s,L,cu,cv,y,levels,dep,glen){
  const sh={cu:cu,cv:cv,r:1.5};let yb=y;const hubs=[];
  for(let l=1;l<=levels;l++){const yl=y-dep*l,hub=K.room('landing',cu-4,cu+4,cv-4,cv+4,yl,5,{sh:sh});if(!hub)break;yb=yl;hubs.push(yl);
    const n=K.gallery(cu+5,cv,yl,'u',1,glen,8)+K.gallery(cu-5,cv,yl,'u',-1,glen,8)+K.gallery(cu,cv+5,yl,'v',1,glen,8)+K.gallery(cu,cv-5,yl,'v',-1,glen,8);
    L.spots.push({kind:'deep',u:cu+3,v:cv+3,y:yl+1});if(!n)break;}
  if(!hubs.length)return null;K.shaft(cu,cv,yb+1,y,1.5);
  L.parts.push({k:'dhead',u0:cu-5,u1:cu+5,v0:cv-5,v1:cv+5,cu:cu,cv:cv,r:1.5,y:y,H:12});L.spots.push({kind:'mine',u:cu-5,v:cv+2,y:y});return hubs;}
// The mountain hold: terraces up to a forecourt under the massif at the back, the great gate cut in its face between two
// colossal kings of stone; inside the walls (and the towers with their ballistae, the gatehouse with its portcullis and banners)
// houses of granite on the terraces, smithies, smelting furnaces with their heaps of slag, a headframe over the city's mine,
// treadwheel cranes, trebuchets behind the gate. Under the massif: the gate hall, the great hall with the king's seat, the
// barracks, the shaft with its hoist and landings down through every level; below, the forge hall with its channel of molten
// iron, the cistern; deep down the smelting hall and the mines spreading from the shaft
function dwarfCity(s,L,r){
  const K=dwKit(s,L),R=s.R,P=K.P,cap=s.prov.capital,F=Math.round(R*0.08),Y0=K.lvl(F-7,0),Lg=cap?34:30;
  L.mass={f:F,b:R-8,w:Math.max(20,Math.round(R*0.38)),m:14,H:34,y:Y0};L.holdY=Y0;
  dwGroundPart(s,L,F-14,2);K.take(-R,F-14,-4,4);
  // the forecourt and the face, the statues before it
  K.pad(F-13,F-1,-15,15,Y0);P.push({k:'dcourt',u0:F-13,u1:F-1,v0:-15,v1:15,y:Y0});
  P.push({k:'dfacade',u0:F-1,u1:F,v0:-L.mass.w,v1:L.mass.w,f:F,y:Y0,w:L.mass.w});
  for(const sg of [1,-1])P.push({k:'dstatue',u0:F-7,u1:F-2,v0:sg*13-4,v1:sg*13+4,f:0,y:Y0});
  L.spots.push({kind:'door',u:F-6,v:0,y:Y0+1},{kind:'court',u:F-10,v:dwSide(r)*8,y:Y0+1});
  // level 0: the gate hall, the great hall, the barracks, the shaft's landing with its winding drum
  const Yf=Y0-22,Yd=Y0-46,sv=-19,su=F+Lg-4,sh={cu:su,cv:sv,r:2.5};
  K.room('gate',F,F+11,-5,5,Y0,9,{vr:2,vax:'v',open:1,force:1});
  K.room('great',F+12,F+11+Lg,-12,12,Y0,14,{vr:5,vax:'v',force:1});
  L.spots.push({kind:'hall',u:F+16,v:4,y:Y0+1},{kind:'hall',u:F+Lg-6,v:-6,y:Y0+1}); // (the throne's court: dwarfHoldMore, D-091)
  if(K.room('barracks',F+16,F+28,-24,-15,Y0,6,{far:-24})){K.room('door',F+21,F+23,-14,-13,Y0,4,{force:1});L.spots.push({kind:'barracks',u:F+22,v:-19,y:Y0+1});}
  K.room('landing',su-4,su+4,sv-4,sv+4,Y0,7,{sh:sh,drum:1,force:1});K.room('door',su-1,su+1,-14,-13,Y0,4,{force:1});
  // the stair down beside the great hall to the forge hall
  K.room('landing',F+Lg-3,F+Lg+1,13,19,Y0,6,{force:1});
  K.ug({t:'s',k:'stair',st:1,ax:'u',a0:F+Lg-26,a1:F+Lg-4,c0:15,c1:19,y0:Yf,dir:1,h:6},true);
  K.room('landing',F+Lg-31,F+Lg-27,13,19,Yf,6,{force:1});K.room('door',F+Lg-30,F+Lg-28,10,12,Yf,4,{force:1});
  // level 1: the forge hall, the cistern, the shaft's landing
  K.room('forge',F+2,F+Lg+4,-9,9,Yf,10,{vr:2,vax:'v',force:1});L.spots.push({kind:'dforge',u:F+12,v:5,y:Yf+1},{kind:'dforge',u:F+Lg-6,v:-5,y:Yf+1});
  const ci=K.room('cistern',F+3,F+18,-24,-13,Yf,8);if(ci){K.room('door',F+10,F+12,-12,-10,Yf,4,{force:1});L.water.push({u0:F+5,u1:F+16,v0:-22,v1:-15,y0:Yf-1,y1:Yf});}
  K.room('landing',su-4,su+4,sv-4,sv+4,Yf,6,{sh:sh,force:1});K.room('door',su-1,su+1,-14,-10,Yf,4,{force:1});
  // level 2: the shaft's landing, the smelting hall beside it, the mines out from both
  K.room('landing',su-5,su+5,sv-5,sv+5,Yd,7,{sh:sh,force:1});L.spots.push({kind:'deep',u:su+3,v:sv+4,y:Yd+1});
  const sm=K.room('smelt',F-12,su-9,-16,4,Yd,10,{fs:[[F-6,-6],[F+4,-6],[F+14,-6]].filter(f=>f[0]<su-12)});
  if(sm){K.room('door',su-8,su-6,-16,-14,Yd,4,{force:1});L.spots.push({kind:'smelt',u:F,v:0,y:Yd+1});K.gallery(F-13,-6,Yd,'u',-1,40,10);}
  K.gallery(su+6,sv,Yd,'u',1,44,10);K.gallery(su,sv-6,Yd,'v',-1,40,10);K.gallery(su,sv+6,Yd,'v',1,8,0);
  K.shaft(su,sv,Yd+1,Y0+6,2.5);
  dwarfHoldMore(K,s,L,{F:F,Lg:Lg,Y0:Y0,Yf:Yf,Yd:Yd}); // the court, the halls along the streets below, the Hall of the Fathers (D-091)
  // the wall, its towers, the gatehouse
  const WH=15;P.push({k:'dwall',u0:-R-2,u1:R+2,v0:-R-2,v1:R+2,f:0,r:R-1,H:WH,gw:3,gh:8});
  const n=Math.max(6,Math.round(2*Math.PI*R/30));for(let k=1;k<n;k++){const a=Math.PI+k*2*Math.PI/n,cu=Math.round(Math.cos(a)*(R-1)),cv=Math.round(Math.sin(a)*(R-1));if(Math.abs(cv)<12&&cu<0||K.inM(cu,cv))continue;
    K.tower(cu,cv,3,WH+5,{nopad:1,ball:1,door:cu>0?0:1},true);}
  for(const sg of [1,-1]){const t=K.tower(-R+1,sg*8,4,WH+8,{nopad:1,ball:1,flag:1,door:2+(sg>0?0:1)},true);L.spots.push({kind:'wall',u:-R+1,v:sg*8,y:t.y+WH+8});}
  L.spots.push({kind:'gate',u:-R-6,v:0,y:DVG(s,-R-6,0)},{kind:'gatein',u:-R+6,v:0,y:DVG(s,-R+6,0)});
  // trebuchets behind the gate
  for(const sg of [1,-1]){const y=K.treb(-R+16,sg*16,0);if(y!==null){(L.trebs=L.trebs||[]).push({u:-R+16,v:sg*16,y:y});L.spots.push({kind:'dengine',u:-R+16,v:sg*10,y:y});}} // (their engineers: D-091)
  // the city's works: smelting furnaces with their slag, smithies, a headframe over its mine, cranes
  const spots=[];for(let cu=-R+10;cu<F-16;cu+=5)for(let cv=-R+6;cv<R-6;cv+=5){if(Math.abs(cv)<8||Math.hypot(cu,cv)>R-9)continue;spots.push([cu,cv,hsh(cu,9491,cv)]);}spots.sort((a,b)=>a[2]-b[2]);
  let ns=0,nf=0,nm=0,nc=0,np=0;
  for(const [cu,cv] of spots){
    if(nm<1){const y=K.lvl(cu,cv);if(K.free(cu-6,cu+6,cv-6,cv+6)&&dwMineHead(K,s,L,cu,cv,y,1,22,26)){K.pad(cu-5,cu+5,cv-5,cv+5,y);nm++;K.heap(cu+8,cv+(cv>0?-8:8),4.5,4,0);continue;}}
    if(ns<2&&K.smelt(cu,cv)){ns++;L.spots.push({kind:'forge',u:cu-6,v:cv,y:K.lvl(cu,cv)});K.heap(cu+3,cv+(cv>0?7:-7),3.5,3,1);continue;}
    if(nf<2){const f=K.bld('dforge',cu,cv,7,9,K.downhill(cu,cv));if(f){nf++;L.spots.push({kind:'forge',u:f.front[0],v:f.front[1],y:f.y});continue;}}
    if(nc<1&&K.crane(cu,cv)!==null){nc++;continue;}
    if(np<1&&dwPen(K,L,cu,cv)){np++;continue;}}
  // houses on the terraces facing the view; barracks by the gate
  for(const sg of [1,-1]){const b=K.bld('dhouse',-R+12,sg*24,9,15,sg>0?2:3,{st:2});if(b)L.spots.push({kind:'barracks',u:b.front[0],v:b.front[1],y:b.y});}
  const hs=[];for(let cu=-R+7;cu<R-7;cu+=4)for(let cv=-R+5;cv<R-5;cv+=4){if(Math.abs(cv)<7||Math.hypot(cu,cv)>R-8)continue;hs.push([cu,cv,hsh(cu,9493,cv)]);}hs.sort((a,b)=>a[2]-b[2]);
  let nh=0;const nmax=Math.round(R*R/170);for(const [cu,cv] of hs){if(nh>=nmax)break;const f=K.downhill(cu,cv),q=hsh(cu,9495,cv);
    const h=K.bld('dhouse',cu,cv,9,11,f,{st:q<0.5?2:1})||K.bld('dhouse',cu,cv,7,9,f,{st:q<0.3?2:1})||K.bld('dhouse',cu,cv,7,7,f,{st:1});if(!h)continue;nh++;if(q<0.5)L.spots.push({kind:'street',u:h.front[0],v:h.front[1],y:h.y});}
  for(let u=-R+16;u<F-16;u+=14)L.spots.push({kind:'street',u:u,v:0,y:DVG(s,u,0)});}
const dwSide=r=>r()<0.5?1:-1;
// The bastion: a squat keep at the back of a walled court with towers at its corners and a gatehouse, ballistae on them all,
// trebuchets in the court, a barracks hall and a smithy; a stair cut down into the rock of the court to the garrison's hall and
// the armoury below
function dwarfBastion(s,L,r){
  const K=dwKit(s,L),R=s.R,P=K.P,sg=dwSide(r);dwGroundPart(s,L,R-16,1);K.take(-R,R-16,-3,3);
  const kp=K.tower(R-9,0,5,22,{ball:1,flag:1,door:0},true);L.spots.push({kind:'keep',u:R-17,v:0,y:kp.y},{kind:'wall',u:R-9,v:0,y:kp.y+22});
  P.push({k:'dwall',u0:-R-2,u1:R+2,v0:-R-2,v1:R+2,f:0,r:R-1,H:13,gw:2,gh:7});
  for(const a of [0.75,1.25,1.75,0.25].map(q=>q*Math.PI))K.tower(Math.round(Math.cos(a)*(R-1)),Math.round(Math.sin(a)*(R-1)),3,18,{nopad:1,ball:1,door:Math.cos(a)>0?0:1},true);
  for(const g of [1,-1]){const t=K.tower(-R+1,g*5,3,20,{nopad:1,ball:1,flag:1,door:2+(g>0?0:1)},true);L.spots.push({kind:'wall',u:-R+1,v:g*5,y:t.y+20});}
  {const y=K.treb(-4,-sg*11,0);if(y!==null){L.trebs=[{u:-4,v:-sg*11,y:y}];L.spots.push({kind:'dengine',u:-4,v:-sg*5,y:y});}} // (its engineer: D-091)
  const b=K.bld('dhouse',6,-sg*13,7,9,sg>0?3:2,{st:2});if(b)L.spots.push({kind:'barracks',u:b.front[0],v:b.front[1],y:b.y});
  const f=K.bld('dforge',-6,sg*12,7,7,sg>0?2:3);if(f)L.spots.push({kind:'forge',u:f.front[0],v:f.front[1],y:f.y});
  L.spots.push({kind:'gate',u:-R-5,v:0,y:DVG(s,-R-5,0)},{kind:'gatein',u:-R+4,v:0,y:DVG(s,-R+4,0)},{kind:'drill',u:-2,v:0,y:DVG(s,-2,0)});
  // the garrison below: a stair cut down from the court beside the keep's door to the garrison's hall under the keep (under its
  // platform, so the rock over it is certain), the armoury beside it
  const y=K.lvl(R-22,sg*6),yb=Math.min(kp.y,y)-10,n=y-yb,a0=R-15-n;L.holdY=yb;
  if(K.free(a0-1,R-17,sg*6-2,sg*6+2)){K.take(a0-1,R-17,sg*6-2,sg*6+2);
    K.ug({t:'s',k:'stair',st:1,ax:'u',a0:a0,a1:R-15,c0:sg*6-1,c1:sg*6+1,y0:y,dir:-1,h:6,open:1},true);
    P.push({k:'dcourt',u0:a0-1,u1:a0-1,v0:sg*6-2,v1:sg*6+2,y:y});
    K.room('barracks',R-14,R-4,-5,5,yb,6,{far:-5*sg,force:1});
    if(K.room('store',R-14,R-6,sg>0?-11:7,sg>0?-7:11,yb,5,{far:sg>0?-11:11}))K.room('door',R-11,R-9,sg>0?-6:6,sg>0?-6:6,yb,4,{force:1});
    L.spots.push({kind:'barracks',u:R-9,v:0,y:yb+1});}}
// A mining town: a headframe in its middle over a shaft down to two levels of mines, smelting furnaces and a smithy, a crane,
// heaps of slag and spoil, houses of granite round it on the terraces
function dwarfTown(s,L,r){
  const K=dwKit(s,L),R=s.R,P=K.P;dwGroundPart(s,L,-8,1);K.take(-R,-8,-3,3);
  const y=K.lvl(0,0);if(dwMineHead(K,s,L,0,0,y,2,16,30))K.pad(-6,6,-6,6,y);
  const sm=K.smelt(0,-14)||K.smelt(0,14);if(sm){L.spots.push({kind:'forge',u:sm.cu-6,v:sm.cv,y:sm.y});K.heap(sm.cu+7,sm.cv,3,3,1);}
  const f=K.bld('dforge',-11,sm&&sm.cv>0?-12:12,7,7,sm&&sm.cv>0?3:2);if(f)L.spots.push({kind:'forge',u:f.front[0],v:f.front[1],y:f.y});
  K.heap(10,-10,3.5,3,0);
  for(let k=0;k<8;k++){const a=k/8*6.283+1.1,cu=Math.round(Math.cos(a)*(R-13)),cv=Math.round(Math.sin(a)*(R-13));if(cu<-R*0.4&&Math.abs(cv)<8)continue;if(dwPen(K,L,cu,cv))break;} // the rams' pen (D-091)
  let n=0;for(let k=0;k<16&&n<9;k++){const a=k/16*6.283+0.2,rd=R-11,cu=Math.round(Math.cos(a)*rd),cv=Math.round(Math.sin(a)*rd);if(cu<-R*0.4&&Math.abs(cv)<6)continue;
    const h=K.bld('dhouse',cu,cv,7,7,K.downhill(cu,cv),{st:hsh(cu,9497,cv)<0.4?2:1})||K.bld('dhouse',cu,cv,5,7,K.downhill(cu,cv),{st:1});if(!h)continue;n++;if(n%3===1)L.spots.push({kind:'street',u:h.front[0],v:h.front[1],y:h.y});}
  L.spots.push({kind:'street',u:-R+4,v:0,y:DVG(s,-R+4,0)});}
// A mine: a headframe over its shaft with a level of galleries below, heaps of spoil, a shed, ore carts at the shaft's mouth
function dwarfMine(s,L,r){
  const K=dwKit(s,L),R=s.R;dwGroundPart(s,L,-R+3,1);const y=K.lvl(1,0);K.pad(-5,7,-6,6,y);dwMineHead(K,s,L,1,0,y,1,14,24);
  K.heap(-2,R-6,4,4,0)||K.heap(-2,-R+6,4,4,0);K.bld('dhouse',Math.round(R*0.4),-Math.round(R*0.45),7,7,K.downhill(Math.round(R*0.4),-Math.round(R*0.45)),{st:1});
  L.spots.push({kind:'mine',u:-6,v:2,y:y});}
// A lookout: a square tower on the heights with a ballista and a beacon, a low wall round its yard, a hut
function dwarfLookout(s,L,r){
  const K=dwKit(s,L),R=s.R,P=K.P;dwGroundPart(s,L,-R+2,1);
  const t=K.tower(1,0,3,18,{ball:1,fire:1,flag:1,door:0},true);if(t)L.spots.push({kind:'post',u:-4,v:0,y:t.y},{kind:'wall',u:1,v:0,y:t.y+18});
  P.push({k:'dwall',u0:-R-2,u1:R+2,v0:-R-2,v1:R+2,f:0,r:R-1,H:3,gw:1,gh:3});}
// ---- The dwarves' roads: the stone road paved in setts between kerbs of courses, a lamp on a column every 40 blocks; miners'
// tracks of gravel; bridges of granite on piers where they cross water
function dwarfRoadCol(X,Z,x,z,rr){
  const o=colInfo(X,Z,TRB),g=o.h,rd=rr.rd,hi=rd.k==='high',ao=Math.abs(rr.off),wet=o.wet||o.river||o.lake||o.b===0||g<o.sl+1;
  if(ao>rd.w+0.5){if(hi&&!wet&&ao<=rd.w+1.5&&rr.off>0&&Math.floor(rr.along)%40===20){RBS(X,Z,g+1,g+3,DCOL);RBP(X,g+4,Z,DLAMP);}
    else if(!wet&&ao<=rd.w+1.5&&rr.off<0&&Math.floor(rr.along)%120===60){RBP(X,g+1,Z,DGRAN);RBP(X,g+2,Z,DWAY);} // a waymark that tells the way (D-091)
    return;}
  if(wet){const y=Math.max(o.sl,o.lake||0)+2,edge=ao>rd.w-0.5;RBP(X,y,Z,edge?DCOURSE:DFLAG);if(edge)RBP(X,y+1,Z,DKNOT);RBS(X,Z,y+(edge?2:1),y+3,AIR);
    if(Math.floor(rr.along)%7===0)for(let yy=y-1;yy>=Math.max(1,g-1);yy--)RBP(X,yy,Z,DGRAN);return;}
  const top=world[I(x,g,z)];if(top===AIR||top===WATER)return;
  RBP(X,g,Z,hi?(ao>rd.w-0.5?DCOURSE:PAVING):hsh(X,9499,Z)<0.2?COBBLE:GRAVEL);
  for(let y=g+1;y<=g+3;y++){const id=world[I(x,y,z)];if(id&&!SOLID[id])RBP(X,y,Z,AIR);else if(SOLID[id]&&y===g+1)RBP(X,y,Z,AIR);}
}
// The water the dwarves hold under the ground (their cisterns): drainCaveWater trusts it where a chunk's edge cuts a basin
function dwarfWaterAt(X,y,Z){for(const s of realmTile(X,Z).sites){if(s.prov.cult.k!=='dwarf'||Math.hypot(s.X-X,s.Z-Z)>s.R+20)continue;const L=siteLayout(s);if(!L.water||!L.water.length)continue;const [u,v]=siteUV(s,X,Z);
  for(const w of L.water)if(u>=w.u0&&u<=w.u1&&v>=w.v0&&v<=w.v1&&y>=w.y0&&y<=w.y1)return true;}return false;}
