// Writes from features are clipped to the chunk being generated
let gx0=0,gz0=0,genLit=false; // genLit: generation is building an inhabited hold, whose lamps still burn
const MODE_SET=0,MODE_AIR=1,MODE_STONE=2,MODE_FILL=3;
function PW(X,Y,Z,id,m){
  if(X<gx0||X>=gx0+CS||Z<gz0||Z>=gz0+CS||Y<0||Y>=H)return;
  const i=I(X-OX,Y,Z-OZ),cur=world[i];
  if(m===MODE_AIR&&cur!==AIR)return;if(m===MODE_STONE&&cur!==STONE&&cur!==DEEP)return;if(m===MODE_FILL&&SOLID[cur])return;
  if(COLD_OF[id]&&!genLit)id=COLD_OF[id]; // the old lamps went out long ago (Q8)
  world[i]=id;lvl[i]=0;
}
function GW(X,Y,Z){if(X<gx0||X>=gx0+CS||Z<gz0||Z>=gz0+CS||Y<0||Y>=H)return -1;return world[I(X-OX,Y,Z-OZ)];}
function treeP(X,y,Z,log,leaf,minH,r){
  const th=minH+(r()*3|0);if(y+th+2>=H)return;
  PW(X,y-1,Z,DIRT,MODE_SET);
  for(let i=0;i<th;i++)PW(X,y+i,Z,log,MODE_SET);
  const top=y+th;
  for(let dy=-2;dy<=1;dy++){const rr=dy<0?2:1;
    for(let dx=-rr;dx<=rr;dx++)for(let dz=-rr;dz<=rr;dz++){
      const skip=rr===2&&Math.abs(dx)===2&&Math.abs(dz)===2&&r()<.6;
      if(skip||(dy===1&&Math.abs(dx)+Math.abs(dz)>1))continue;
      PW(X+dx,top+dy,Z+dz,leaf,MODE_AIR);
    }}
}
function bigOakP(X,y,Z,r){
  const th=7+(r()*3|0);if(y+th+5>=H)return;
  PW(X,y-1,Z,DIRT,MODE_SET);for(let i=0;i<th;i++)PW(X,y+i,Z,LOG,MODE_SET);
  const blob=(cx,cy,cz,rad)=>{for(let dx=-3;dx<=3;dx++)for(let dy=-2;dy<=2;dy++)for(let dz=-3;dz<=3;dz++){const d=Math.hypot(dx,dy*1.4,dz);if(d<=rad&&!(d>rad-0.6&&r()<0.5))PW(cx+dx,cy+dy,cz+dz,LEAVES,MODE_AIR);}};
  const arms=2+(r()*2|0);
  for(let k=0;k<arms;k++){const a=r()*Math.PI*2,len=2+(r()*2|0),by=y+th-3-(r()*2|0);let bx=X,bz=Z,yy=by;
    for(let t=1;t<=len;t++){bx=X+Math.round(Math.cos(a)*t);bz=Z+Math.round(Math.sin(a)*t);yy=by+(t>1?1:0);PW(bx,yy,bz,LOG,MODE_SET);}
    blob(bx,yy+1,bz,2.3);}
  blob(X,y+th,Z,3);
}
function leafBushP(X,y,Z,r){PW(X,y,Z,LEAVES,MODE_AIR);if(r()<0.6)PW(X+1,y,Z,LEAVES,MODE_AIR);if(r()<0.6)PW(X,y,Z+1,LEAVES,MODE_AIR);if(r()<0.4)PW(X,y+1,Z,LEAVES,MODE_AIR);}
// ---- Ancient things on the old hills: barrows and rings of standing stones
// Where a barrow or ring stands, if any, for chunk (WCX,WCZ): only on the Barrow Hills (and the downs blending into them), mostly in
// clusters (old burial grounds, and beside the old roads), on the highest of a few spots, facing its own way, in varied sizes;
// some long, some broken open (Q94). Pure, so neighbouring chunks agree.
const barrowC=new Map(),TB={};
function barrowAt(WCX,WCZ){
  const key=ckey(WCX,WCZ);if(barrowC.has(key))return barrowC.get(key);if(barrowC.size>8000)barrowC.clear();
  let best=null;
  for(let k=0;k<3;k++){const X=WCX*CS+4+Math.floor(hsh(WCX*3+k,6003,WCZ)*8),Z=WCZ*CS+4+Math.floor(hsh(WCX*3+k,6004,WCZ)*8);colInfo(X,Z,TB);
    if(!(TB.b===7||(TB.bw>0.35&&TB.dw>0.35))||TB.wet||carved(X,TB.h,Z,TB)||surfTaken(X,Z,9))continue;if(!best||TB.h>best.h)best={X:X,Z:Z,h:TB.h};}
  let s=null;
  if(best){const zone=fbm2(best.X/220,best.Z/220,1,6011.3)>0.05,road=oldRoadAt(best.X+12,best.Z)||oldRoadAt(best.X-12,best.Z)||oldRoadAt(best.X,best.Z+12)||oldRoadAt(best.X,best.Z-12);
    if(hsh(WCX,6001,WCZ)<(zone?0.42:0.05)+(road?0.2:0)){const q=hsh(WCX,6005,WCZ);
      s={X:best.X,Z:best.Z,h:best.h,ring:q<0.3,rot:Math.floor(hsh(WCX,6006,WCZ)*4),sz:0.7+hsh(WCX,6007,WCZ)*0.7,long:hsh(WCX,6008,WCZ)<0.35,broken:hsh(WCX,6009,WCZ)<0.3};}}
  barrowC.set(key,s);return s;
}
function barrowP(X,h,Z,r,o){
  const ca=[1,0,-1,0][o.rot],sa=[0,1,0,-1][o.rot],L=Math.max(4,Math.round(6*o.sz*(o.long?1.6:1))),Wd=Math.max(4,Math.round(6*o.sz)),Hm=Math.max(3,Math.round(3.4*o.sz+(o.long?0.5:0)));
  const P=(u,v)=>[X+u*ca-v*sa,Z+u*sa+v*ca]; // u along the barrow (its entrance at +u), v across
  // the mound, resting on the ground under every column of it
  const tops={};for(let u=-L;u<=L;u++)for(let v=-Wd;v<=Wd;v++){const d=Math.hypot(u/L,v/Wd);if(d>=1)continue;const [x,z]=P(u,v),gl=colInfo(x,z,T3).h,top=h+Math.round(Hm*(1-d*d));tops[u+','+v]=top;
    for(let y=Math.min(gl+1,h+1);y<=top;y++)PW(x,y,z,y===top?GRASS:DIRT,MODE_SET);}
  // the chamber, and the passage to the entrance
  for(let v=-2;v<=2;v++)for(let u=-2;u<=1;u++){const edge=Math.abs(v)===2||u===-2||u===1,[x,z]=P(u,v);for(let y=h;y<=h+2;y++)PW(x,y,z,y===h?STONE:edge?(r()<0.4?MOSSY:COBBLE):AIR,MODE_SET);
    if(o.broken&&!edge)for(let y=h+3;y<=(tops[u+','+v]||h+3);y++)PW(x,y,z,AIR,MODE_SET);} // the roof has fallen in
  for(let u=1;u<=L;u++)for(let v=-1;v<=1;v++){if(u===1&&v!==0)continue;const [x,z]=P(u,v);for(let y=h+1;y<=h+2;y++)PW(x,y,z,AIR,MODE_SET);PW(x,h,z,STONE,MODE_SET);}
  for(const v of [-2,2]){const [x,z]=P(L,v);for(let y=h+1;y<=h+3;y++)PW(x,y,z,MOSSY,MODE_SET);}for(let v=-2;v<=2;v++){const [x,z]=P(L,v);PW(x,h+3,z,STONE,MODE_SET);}
  {let [x,z]=P(-1,0);PW(x,h+1,z,CALCITE,MODE_SET);[x,z]=P(-1,1);PW(x,h+1,z,CALCITE,MODE_SET);[x,z]=P(0,-1);PW(x,h+1,z,DWCHEST,MODE_SET);[x,z]=P(0,1);PW(x,h+1,z,BONES,MODE_SET);}
  if(o.broken)for(let k=0;k<3;k++){const [x,z]=P(-1+(r()*2|0),(r()*3|0)-1);PW(x,h+1,z,COBBLE,MODE_AIR);}
}
function stoneRingP(X,h,Z,r,sz){
  const n=7+(r()*3|0),R=(5+r()*1.5)*(sz||1);
  for(let k=0;k<n;k++){const a=k/n*6.283+r()*0.2,sx=X+Math.round(Math.cos(a)*R),sz=Z+Math.round(Math.sin(a)*R);colInfo(sx,sz,T3);const g=T3.h;
    if(r()<0.25){const dx=Math.round(Math.cos(a+1.57)),dz=Math.round(Math.sin(a+1.57));PW(sx,g+1,sz,MOSSY,MODE_SET);PW(sx+dx,g+1,sz+dz,STONE,MODE_SET);}
    else{const hg=2+(r()*3|0);for(let y=g;y<=g+hg;y++)PW(sx,y,sz,y===g?STONE:(r()<0.35?MOSSY:STONE),MODE_SET);}}
  PW(X,h+1,Z,STONE,MODE_SET);PW(X+1,h+1,Z,STONE,MODE_SET);
}
// willows of the fens: a low crown with strands of leaves hanging down
function willowP(X,y,Z,r,log,leaf){
  log=log||LOG;leaf=leaf||LEAVES;const th=4+(r()*2|0);if(y+th+3>=H)return;PW(X,y-1,Z,DIRT,MODE_SET);for(let i=0;i<th;i++)PW(X,y+i,Z,log,MODE_SET);
  const top=y+th;for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++)for(let dy=-1;dy<=1;dy++){const d=Math.hypot(dx,dz,dy*1.6);if(d<=3.1&&!(d>2.6&&r()<0.4))PW(X+dx,top+dy,Z+dz,leaf,MODE_AIR);}
  for(let k=0;k<10;k++){const a=k/10*6.283,sx=X+Math.round(Math.cos(a)*3),sz=Z+Math.round(Math.sin(a)*3),len=2+(r()*3|0);for(let t=1;t<=len;t++)PW(sx,top-t,sz,leaf,MODE_AIR);}
}
function spruceP(X,y,Z,r,snowy){
  const th=6+(r()*4|0);if(y+th+2>=H)return;const SL=snowy?SNOWLEAF:SLEAVES;
  PW(X,y-1,Z,DIRT,MODE_SET);
  for(let i=0;i<th;i++)PW(X,y+i,Z,SPRUCE,MODE_SET);
  PW(X,y+th,Z,SL,MODE_AIR);PW(X,y+th+1,Z,SL,MODE_AIR);
  for(let yy=y+th-1;yy>=y+2;yy--){
    const k=y+th-1-yy,rr=k===0?1:(k%2?2:1)+(k>4?1:0);
    for(let dx=-rr;dx<=rr;dx++)for(let dz=-rr;dz<=rr;dz++){if(rr>1&&Math.abs(dx)===rr&&Math.abs(dz)===rr)continue;PW(X+dx,yy,Z+dz,SL,MODE_AIR);}
  }
}
function jungleP(X,y,Z,r){
  const th=8+(r()*7|0);if(y+th+3>=H)return;
  PW(X,y-1,Z,DIRT,MODE_SET);
  for(let i=0;i<th;i++)PW(X,y+i,Z,JLOG,MODE_SET);
  const top=y+th;
  for(let dy=-2;dy<=1;dy++){const rr=dy<=-1?3:dy===0?2:1;
    for(let dx=-rr;dx<=rr;dx++)for(let dz=-rr;dz<=rr;dz++){if(Math.hypot(dx,dz)>rr+0.3)continue;PW(X+dx,top+dy,Z+dz,JLEAVES,MODE_AIR);}}
  for(let k=0;k<4;k++){const dx=k<2?(k?1:-1):0,dz=k>=2?(k===3?1:-1):0;if(r()<0.5)for(let dy=1;dy<=2;dy++)PW(X+dx*3,top-2-dy,Z+dz*3,JLEAVES,MODE_AIR);}
}
function bushP(X,y,Z){PW(X,y,Z,JLOG,MODE_SET);for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){if(dx||dz)PW(X+dx,y,Z+dz,JLEAVES,MODE_AIR);}PW(X,y+1,Z,JLEAVES,MODE_AIR);}
// Ice spikes of the fells, old sealed rooms deep down, and a flatness check for surface structures
function spikeP(X,Z,g,r){
  const h=8+(r()*10|0),r0=1+r()*1.4;
  for(let k=0;k<h&&g+1+k<H-1;k++){const rr=r0*(1-k/h)+0.4;for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)if(Math.hypot(dx,dz)<=rr)PW(X+dx,g+1+k,Z+dz,ICE,MODE_SET);}
}
// ---- Ruined stairways (Q22): a small walled shaft on open ground, its stair winding down to a worm cave of the chunk
const stairwayC=new Map();
function stairwayAt(WCX,WCZ){
  const key=ckey(WCX,WCZ);if(stairwayC.has(key))return stairwayC.get(key);if(stairwayC.size>8000)stairwayC.clear();
  let s=null;
  if(hsh(WCX,6301,WCZ)<0.15){const X=WCX*CS+8,Z=WCZ*CS+8,o=colInfo(X,Z,{});
    let rise=0;for(let k=0;k<8;k++){const a=k*0.785;rise=Math.max(rise,hAt(Math.round(X+Math.cos(a)*9),Math.round(Z+Math.sin(a)*9))-o.h);} // at the foot of a slope
    if(rise>=2&&!o.wet&&!o.lake&&!o.river&&o.rvBot===999&&o.b!==0&&o.b!==1&&o.b!==5&&o.h>SEA+2&&!ruinZone(WCX,WCZ)&&flatOK(X,Z,o.h)){
      const a=caveAnchor(WCX,WCZ,o.h-90,o.h-24,6302);if(a&&Math.max(Math.abs(a.x-X),Math.abs(a.z-Z))>=4)s={X:X,Z:Z,g:o.h,a:a};}}
  stairwayC.set(key,s);return s;
}
function stairwayNear(X,Z,m){const cx=Math.floor(X/CS),cz=Math.floor(Z/CS);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const s=stairwayAt(cx+a,cz+b);if(s&&Math.abs(X-s.X)<=3+m&&Math.abs(Z-s.Z)<=3+m)return true;}return false;}
// Surface columns that structures have claimed: trees, boulders and other surface features keep off them
function surfTaken(X,Z,m){m=m||0;return gateNear(X,Z,m)||stairwayNear(X,Z,m)||!!siteNear(X,Z,m)||oldRoadAt(X,Z)||caveMouthNear(X,Z,m);}
const SW_RING=[[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
function stairwayP(s,r){
  const X=s.X,Z=s.Z,g=s.g,a=s.a,ys=a.y-1,wall=()=>{const q=r();return q<0.4?SBRICK:q<0.75?MOSSY:COBBLE;};
  // the shaft: walls of old stone, a core, a floor at the bottom; one step up per block of height, the last at g-1
  for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){const m=Math.max(Math.abs(dx),Math.abs(dz));
    for(let y=ys-1;y<=g;y++)PW(X+dx,y,Z+dz,m===2?wall():m===0?(y===ys-1?COBBLE:SBRICK):(y===ys-1?COBBLE:AIR),MODE_SET);
    for(let y=g+1;y<=g+5;y++)PW(X+dx,y,Z+dz,AIR,MODE_SET);}
  for(let y=ys;y<=g;y++){const [dx,dz]=SW_RING[(y-ys)%8];PW(X+dx,y-1,Z+dz,y%5===0?MOSSY:SBRICK,MODE_SET);}
  // the ruin above ground: broken corner posts and a little fallen wall (low enough to step over)
  for(const [dx,dz] of [[-2,-2],[2,-2],[-2,2],[2,2]]){const hgt=1+(r()*4|0);for(let y=g+1;y<=g+hgt;y++)PW(X+dx,y,Z+dz,wall(),MODE_SET);}
  for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)if(Math.max(Math.abs(dx),Math.abs(dz))===2&&Math.abs(dx)!==Math.abs(dz)&&r()<0.35)PW(X+dx,g+1,Z+dz,wall(),MODE_SET);
  // a door at the bottom on the side facing the cave (east, south or west: the north door would open under the second step)
  const ddx=a.x-X,ddz=a.z-Z,side=Math.abs(ddx)>=Math.abs(ddz)||ddz<0?(ddx>=0?[1,0]:[-1,0]):[0,1];
  const cell=(x,z)=>{PW(x,ys-1,z,COBBLE,MODE_FILL);for(let y=ys;y<ys+3;y++)PW(x,y,z,AIR,MODE_SET);};
  // a passage from the door to the cave: out past the wall, across, then along
  let x=X+side[0]*2,z=Z+side[1]*2;cell(x,z);
  if(side[0]){x+=side[0];cell(x,z);while(side[0]>0?x<Math.max(a.x,X+3):x>Math.min(a.x,X-3)){x+=side[0];cell(x,z);}while(z!==a.z){z+=Math.sign(a.z-z);cell(x,z);}while(x!==a.x){x+=Math.sign(a.x-x);cell(x,z);}}
  else{z+=1;cell(x,z);while(z<Math.max(a.z,Z+3)){z++;cell(x,z);}while(x!==a.x){x+=Math.sign(a.x-x);cell(x,z);}while(z!==a.z){z+=Math.sign(a.z-z);cell(x,z);}}
}
// A passage from a room to a cave: along X, then along Z, rising or falling evenly, on a floor that fills any gap under it
// (`skip` steps without a floor at the start)
function tunnelTo(x0,y0,z0,x1,y1,z1,skip,floor){
  const n=Math.abs(x1-x0)+Math.abs(z1-z0);let x=x0,z=z0;
  for(let t=0;t<=n;t++){const y=Math.round(y0+(y1-y0)*(n?t/n:1));
    for(let k=0;k<3;k++)PW(x,y+k,z,AIR,MODE_SET);if(t>=skip)PW(x,y-1,z,floor,MODE_FILL);
    if(x!==x1)x+=Math.sign(x1-x);else if(z!==z1)z+=Math.sign(z1-z);}
}
// ---- Old dungeon rooms (Q24): rarer, in four kinds and sizes, each joined by a passage to a worm cave of its chunk
const DUNGEON_KINDS=['crypt','store','cells','chapel'],DUNGEON_NAMES={crypt:'Forgotten Crypt',store:'Old Storeroom',cells:'Old Cells',chapel:'Sunken Chapel'};
const dungC=new Map();
function dungeonAt(WCX,WCZ){
  const key=ckey(WCX,WCZ);if(dungC.has(key))return dungC.get(key);if(dungC.size>8000)dungC.clear();
  let d=null;
  if(hsh(WCX,6401,WCZ)<0.14){const a=caveAnchor(WCX,WCZ,106,196,6402);
    if(a){const ang=hsh(WCX,6403,WCZ)*6.283,X=a.x+Math.round(Math.cos(ang)*9),Z=a.z+Math.round(Math.sin(ang)*9),y=a.y-2;
      let clash=false;for(let c=-2;c<=2&&!clash;c++)for(let e=-2;e<=2&&!clash;e++){const q=poiFor(WCX+c,WCZ+e);if(q&&Math.abs(q.x-X)<20&&Math.abs(q.z-Z)<20&&Math.abs(q.y-y)<16)clash=true;} // places come first
      if(!clash&&hAt(X,Z)-y>=16&&!ruinZone(Math.floor(X/CS),Math.floor(Z/CS)))d={kind:DUNGEON_KINDS[hsh(WCX,6404,WCZ)*4|0],X:X,Z:Z,y:y,hw:3+(hsh(WCX,6405,WCZ)*3|0),hh:4+(hsh(WCX,6406,WCZ)*2|0),a:a};}}
  dungC.set(key,d);return d;
}
function dungeonNear(X,Y,Z){const cx=Math.floor(X/CS),cz=Math.floor(Z/CS);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const d=dungeonAt(cx+a,cz+b);if(d&&Math.abs(X-d.X)<=d.hw&&Math.abs(Z-d.Z)<=d.hw&&Y>=d.y&&Y<=d.y+d.hh)return d;}return null;}
function dungeonP(d,r){
  const {X,Z,y,hw,hh}=d,k=d.kind,wallOf=()=>{const q=r();return k==='store'?(q<0.6?PLANKS:COBBLE):k==='chapel'?(q<0.5?CALCITE:SBRICK):k==='crypt'?(q<0.5?SBRICK:MOSSY):(q<0.5?COBBLE:MOSSY);};
  for(let dx=-hw;dx<=hw;dx++)for(let dz=-hw;dz<=hw;dz++)for(let dy=0;dy<=hh;dy++){
    const wall=Math.abs(dx)===hw||Math.abs(dz)===hw||dy===0||dy===hh;PW(X+dx,y+dy,Z+dz,wall?wallOf():AIR,MODE_SET);}
  const fl=(dx,dz,id)=>PW(X+dx,y+1,Z+dz,id,MODE_SET),e=hw-1;
  if(k==='crypt'){for(let a=-e+1;a<=e-1;a+=2){fl(a,-e,CALCITE);fl(a,e,CALCITE);}fl(0,0,BONES);fl(1,-1,BONES);PW(X,y+hh-1,Z,RUNE,MODE_SET);fl(e,0,CRATE);}
  else if(k==='store'){for(let a=-e;a<=e;a++){if(r()<0.6)fl(a,-e,BARREL);if(r()<0.5)fl(a,e,r()<0.5?CRATE:BARREL);}if(r()<0.4)fl(-e,0,TNT);PW(X,y+hh-1,Z,LANTERN,MODE_SET);}
  else if(k==='cells'){for(let a=-e;a<=e;a+=2)for(const b of [-e,e]){fl(a,b,BONES);PW(X+a,y+2,Z+b,COBWEB,MODE_SET);}fl(0,e,CRATE);PW(X,y+hh-1,Z,TORCH,MODE_SET);}
  else{for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)PW(X+a,y,Z+b-e+1,AMETH,MODE_SET);fl(0,-e,CALCITE);PW(X,y+2,Z-e,RUNE,MODE_SET);fl(e,e,CRATE);fl(-e,e,BOOKS);PW(X,y+hh-1,Z,GLOW,MODE_SET);}
  tunnelTo(X,y+1,Z,d.a.x,d.a.y-1,d.a.z,0,COBBLE);
}
function flatOK(X,Z,g){for(let dx=-3;dx<=3;dx+=3)for(let dz=-3;dz<=3;dz+=3){if(!dx&&!dz)continue;if(Math.abs(colInfo(X+dx,Z+dz,T3).h-g)>2)return false;}return true;}
