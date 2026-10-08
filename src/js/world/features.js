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
function barrowP(X,h,Z,r){
  for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++){const d=Math.hypot(dx,dz*1.2);if(d>=6)continue;const hh=Math.round(3.4*(1-(d/6)*(d/6)));for(let y=h+1;y<=h+hh;y++)PW(X+dx,y,Z+dz,y===h+hh?GRASS:DIRT,MODE_SET);}
  for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=1;dz++){const edge=Math.abs(dx)===2||dz===-2||dz===1;for(let y=h;y<=h+2;y++)PW(X+dx,y,Z+dz,y===h?STONE:edge?(r()<0.4?MOSSY:COBBLE):AIR,MODE_SET);}
  for(let dz=1;dz<=6;dz++)for(let dx=-1;dx<=1;dx++){if(dz===1&&dx!==0)continue;for(let y=h+1;y<=h+2;y++)PW(X+dx,y,Z+dz,AIR,MODE_SET);PW(X+dx,h,Z+dz,STONE,MODE_SET);}
  for(const dx of [-2,2])for(let y=h+1;y<=h+3;y++)PW(X+dx,y,Z+6,MOSSY,MODE_SET);for(let dx=-2;dx<=2;dx++)PW(X+dx,h+3,Z+6,STONE,MODE_SET);
  PW(X,h+1,Z-1,CALCITE,MODE_SET);PW(X+1,h+1,Z-1,CALCITE,MODE_SET);PW(X-1,h+1,Z,DWCHEST,MODE_SET);PW(X+1,h+1,Z,BONES,MODE_SET);
}
function stoneRingP(X,h,Z,r){
  const n=7+(r()*3|0),R=5+r()*1.5;
  for(let k=0;k<n;k++){const a=k/n*6.283+r()*0.2,sx=X+Math.round(Math.cos(a)*R),sz=Z+Math.round(Math.sin(a)*R);colInfo(sx,sz,T3);const g=T3.h;
    if(r()<0.25){const dx=Math.round(Math.cos(a+1.57)),dz=Math.round(Math.sin(a+1.57));PW(sx,g+1,sz,MOSSY,MODE_SET);PW(sx+dx,g+1,sz+dz,STONE,MODE_SET);}
    else{const hg=2+(r()*3|0);for(let y=g;y<=g+hg;y++)PW(sx,y,sz,y===g?STONE:(r()<0.35?MOSSY:STONE),MODE_SET);}}
  PW(X,h+1,Z,STONE,MODE_SET);PW(X+1,h+1,Z,STONE,MODE_SET);
}
// willows of the fens: a low crown with strands of leaves hanging down
function willowP(X,y,Z,r){
  const th=4+(r()*2|0);if(y+th+3>=H)return;PW(X,y-1,Z,DIRT,MODE_SET);for(let i=0;i<th;i++)PW(X,y+i,Z,LOG,MODE_SET);
  const top=y+th;for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++)for(let dy=-1;dy<=1;dy++){const d=Math.hypot(dx,dz,dy*1.6);if(d<=3.1&&!(d>2.6&&r()<0.4))PW(X+dx,top+dy,Z+dz,LEAVES,MODE_AIR);}
  for(let k=0;k<10;k++){const a=k/10*6.283,sx=X+Math.round(Math.cos(a)*3),sz=Z+Math.round(Math.sin(a)*3),len=2+(r()*3|0);for(let t=1;t<=len;t++)PW(sx,top-t,sz,LEAVES,MODE_AIR);}
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
function towerP(X,Z,g,r){
  const h=7+(r()*7|0);
  for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++){
    const d=Math.hypot(dx,dz);if(d>3.4)continue;
    for(let y=g-1;y>g-7;y--)PW(X+dx,y,Z+dz,COBBLE,MODE_FILL);
    PW(X+dx,g,Z+dz,d<2.5?(r()<.3?MOSSY:COBBLE):SBRICK,MODE_SET);
    for(let y=g+1;y<g+h+3;y++){
      if(d<2.5||y>=g+h){PW(X+dx,y,Z+dz,AIR,MODE_SET);continue;}
      const gap=r()<0.08+(y-g)/h*0.4,pick=r(),pick2=r();
      if(gap||((y-g)%4===2&&(dx===0||dz===0))){PW(X+dx,y,Z+dz,AIR,MODE_SET);continue;}
      PW(X+dx,y,Z+dz,pick<.35?MOSSY:pick2<.5?SBRICK:COBBLE,MODE_SET);
    }
  }
  PW(X,g+1,Z,TORCH,MODE_SET);
}
function wellP(X,Z,g,m,post){
  m=m||SANDSTONE;post=post||m;
  for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){for(let y=g-1;y>g-5;y--)PW(X+dx,y,Z+dz,m,MODE_FILL);PW(X+dx,g,Z+dz,m,MODE_SET);for(let y=g+1;y<=g+4;y++)PW(X+dx,y,Z+dz,AIR,MODE_SET);}
  PW(X,g,Z,WATER,MODE_SET);PW(X,g-1,Z,WATER,MODE_SET);
  for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){if(dx||dz)PW(X+dx,g+1,Z+dz,m,MODE_SET);PW(X+dx,g+4,Z+dz,m,MODE_SET);if(dx&&dz){PW(X+dx,g+2,Z+dz,post,MODE_SET);PW(X+dx,g+3,Z+dz,post,MODE_SET);}}
}
// Ice spikes of the fells, old sealed rooms deep down, and a flatness check for surface structures
function spikeP(X,Z,g,r){
  const h=8+(r()*10|0),r0=1+r()*1.4;
  for(let k=0;k<h&&g+1+k<H-1;k++){const rr=r0*(1-k/h)+0.4;for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)if(Math.hypot(dx,dz)<=rr)PW(X+dx,g+1+k,Z+dz,ICE,MODE_SET);}
}
function dungeonP(X,y,Z,r){
  for(let dx=-3;dx<=3;dx++)for(let dy=0;dy<=5;dy++)for(let dz=-3;dz<=3;dz++){
    const wall=Math.abs(dx)===3||Math.abs(dz)===3||dy===0||dy===5,m=r()<.5;
    PW(X+dx,y+dy,Z+dz,wall?(m?MOSSY:COBBLE):AIR,MODE_SET);
  }
  PW(X,y+5,Z,GLOW,MODE_SET);PW(X+2,y+1,Z+2,CRATE,MODE_SET);PW(X-2,y+1,Z+2,TNT,MODE_SET);PW(X-2,y+1,Z-2,CRATE,MODE_SET);PW(X+2,y+1,Z-2,BOOKS,MODE_SET);
}
function flatOK(X,Z,g){for(let dx=-3;dx<=3;dx+=3)for(let dz=-3;dz<=3;dz+=3){if(!dx&&!dz)continue;if(Math.abs(colInfo(X+dx,Z+dz,T3).h-g)>2)return false;}return true;}
