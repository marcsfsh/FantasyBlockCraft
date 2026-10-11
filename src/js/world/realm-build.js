// ---- Building the realms of men (D-060). Every site has a layout of parts (walls, towers, houses, halls, lanes, wells, fields
// and the rest), each a box in the site's own frame (u from the side its road arrives on, at u = -R, toward the back; v across)
// with a column builder. A chunk builds its own columns only: for each column, every part whose box holds it writes that
// column's blocks, in the layout's order (so later parts stand over earlier ones). Pure functions of the plan; the ground under
// every site is already level (realmGround), a city's in tiers. Lamps are lit (genLit). Where folk stand is part of the layout.
const RBP=(X,y,Z,id)=>PW(X,y,Z,id,MODE_SET),RBS=(X,Z,y0,y1,id)=>{for(let y=y0;y<=y1;y++)PW(X,y,Z,id,MODE_SET);};
function siteFrame(s){if(s.fr)return s.fr;const d=DIRS[s.dir];return s.fr={fx:-d[0],fz:-d[1],sx:-d[1],sz:d[0]};}
const siteUV=(s,X,Z)=>{const f=siteFrame(s),dx=X-s.X,dz=Z-s.Z;return [dx*f.fx+dz*f.fz,dx*f.sx+dz*f.sz];};
const siteXZ=(s,u,v)=>{const f=siteFrame(s);return [s.X+u*f.fx+v*f.sx,s.Z+u*f.fz+v*f.sz];};
// the ground of a site at local (u, v): its level, a city's by tier
const siteG=(s,u,v)=>s.k==='city'&&Math.max(Math.abs(u),Math.abs(v))<=s.R?s.T+cityTier(s,u,v)*5:s.T;
// A part's own frame: a across its front, b back from its front; f is the side its front faces (0 toward -u, 1 +u, 2 -v, 3 +v)
function partAB(p,u,v){switch(p.f){case 0:return [v-p.v0,u-p.u0,p.v1-p.v0+1,p.u1-p.u0+1];case 1:return [p.v1-v,p.u1-u,p.v1-p.v0+1,p.u1-p.u0+1];
  case 2:return [p.u1-u,v-p.v0,p.u1-p.u0+1,p.v1-p.v0+1];default:return [u-p.u0,p.v1-v,p.u1-p.u0+1,p.v1-p.v0+1];}}
// a part centred on (u, v), w across and d deep, its front facing f
function partC(k,u,v,w,d,f,o){const ac=f<2,hw=Math.floor((ac?w:d)/2),hd=Math.floor((ac?d:w)/2);const W2=ac?w:d,D2=ac?d:w;
  return Object.assign({k:k,u0:u-hd,u1:u-hd+D2-1,v0:v-hw,v1:v-hw+W2-1,f:f},o||{});}
// ---- Column builders
const RB={};
const lit=(X,y,Z)=>RBP(X,y,Z,LANTERN);
// A house or hall: a core of p.W by p.D with storeys of p.sh, walls by p.mat (stone: white ashlar with quoins and bands;
// timber: a stone ground storey and plaster in timbers above; cottage: a cobble footing, plaster and timber, a thatched roof),
// leaded windows, a door, a gable roof along its depth (p.ridge 'a' for along its width) with eaves of p.ov, a chimney, floors
// and a ladder inside, lamps, a few furnishings; p.porch rows of pillars before the front; p.pil rows of pillars inside.
RB.house=(s,p,u,v,X,Z)=>{
  const [a,b,TW,TD]=partAB(p,u,v),ov=p.ov||0,pr=p.porch||0,ca=a-ov,cb=b-ov-pr,W=p.W,D=p.D,g=p.y,st=p.st,sh=p.sh||4,eave=g+st*sh,r=hsh(X,9501,Z);
  const inA=ca>=0&&ca<W,inB=cb>=0&&cb<D,core=inA&&inB,edgeA=ca===0||ca===W-1,edgeB=cb===0||cb===D-1,wall=core&&(edgeA||edgeB),corner=core&&edgeA&&edgeB;
  const alongB=p.ridge!=='a',span=alongB?W:D,pos=alongB?ca:cb,ry=eave+Math.min(pos+ov,span-1-pos+ov)+(span%2?0:0),gable=alongB?(inA&&edgeB):(inB&&edgeA);
  // the porch: pillars before the front under a lintel, a step of white stone
  if(cb<0&&cb>=-pr&&inA){RBP(X,g,Z,WSTONE);if(cb===-pr&&(ca%2===0||ca===W-1)){RBS(X,Z,g+1,eave-1,WSPILLAR);RBP(X,eave,Z,WSCARVE);}else if(cb===-pr)RBP(X,eave,Z,WSBRICK);
    if(cb>-pr)RBP(X,eave,Z,WSBRICK);for(let y=g+1;y<eave;y++)if(!(cb===-pr&&(ca%2===0||ca===W-1)))RBP(X,y,Z,AIR);return;}
  const roofOnly=!core;
  if(!roofOnly){
    RBP(X,g,Z,wall?(p.mat==='cottage'?COBBLE:WSBRICK):p.floor||PLANKS);
    for(let k=0;k<st;k++){const y0=g+1+k*sh,y1=g+(k+1)*sh;
      for(let y=y0;y<=y1;y++){let id=AIR;const dy=y-y0,top=y===y1&&k<st-1;
        if(wall){const pa=edgeB?ca:cb,win=!corner&&pa%3===1&&dy>=1&&dy<=2&&!(edgeB&&cb===0&&Math.abs(ca-p.door)<=(p.dw||1)-1);
          if(p.mat==='stone')id=corner?WSTONE:top||y===y1?WSTONE:win?LGLASS:WSBRICK;
          else if(p.mat==='timber')id=k===0?(corner?WSTONE:win?LGLASS:WSBRICK):corner?LOG:y===y1?PLANKS:win?LGLASS:(pa%3===2?TIMBER:PLASTER);
          else id=corner?LOG:y===g+1?COBBLE:y===y1?PLANKS:win?LGLASS:(pa%3===0?TIMBER:PLASTER);
          // the door, a lintel over it and a lamp beside it
          if(edgeB&&cb===0&&k===0){const dd=Math.abs(ca-p.door);if(dd<(p.dw||1)&&dy<=(p.dh||2)-1)id=AIR;else if(dd<(p.dw||1)&&dy===(p.dh||2))id=p.mat==='cottage'?LOG:WSTONE;else if(p.lamp&&dd===(p.dw||1)&&dy===2)id=LANTERN;}}
        else if(top)id=PLANKS;
        else if(p.pil&&dy<sh&&ca>0&&ca<W-1&&cb>1&&cb<D-2&&(ca===2||ca===W-3)&&cb%3===1)id=WSPILLAR; // pillars down a hall
        RBP(X,y,Z,id);}
      // inside: a ladder up the side wall, a lamp under each ceiling, now and then a barrel, a crate or a shelf of books
      if(core&&!wall){if(ca===1&&cb===D-2&&st>1&&k<st-1){for(let y=y0;y<=y1;y++)RBP(X,y,Z,LADDER);}
        else{if(ca===Math.floor(W/2)&&cb===Math.floor(D/2))RBP(X,y1-(k<st-1?1:0),Z,LANTERN);
          else if((ca===1||ca===W-2)&&(cb===1||cb===D-2)&&r<0.5)RBP(X,y0,Z,r<0.18?BARREL:r<0.34?CRATE:BOOKS);}}}
    // under the roof: the gable ends walled up, the loft open
    for(let y=eave+1;y<ry;y++)RBP(X,y,Z,gable?(p.mat==='stone'?WSBRICK:p.mat==='timber'?PLASTER:PLASTER):AIR);
    if(gable&&ry-eave>=3&&pos===Math.floor(span/2))RBP(X,eave+2,Z,LGLASS);}
  // the roof, and the chimney through it
  RBP(X,ry,Z,p.roof||SLATE);if(core&&!wall&&ry>eave+1)RBP(X,eave,Z,PLANKS); // the loft's floor
  if(p.chim&&core&&ca===p.chim[0]&&cb===p.chim[1])RBS(X,Z,g+1,ry+2,p.mat==='stone'?SBRICK:COBBLE);
};
// A square tower of half-width p.h2 rising p.H: white ashlar with quoins, slit windows lit within, a band of carving below the top,
// battlements; p.ban a banner on its roof, p.roof a slate spire, p.fire a beacon basket, p.hollow floors and a ladder inside
RB.tower=(s,p,u,v,X,Z)=>{const a=v-p.cv,b=u-p.cu,m=Math.max(Math.abs(a),Math.abs(b)),h2=p.h2,g=p.y,top=g+p.H;if(m>h2)return;
  const ring=m===h2,cor=Math.abs(a)===h2&&Math.abs(b)===h2,mid=ring&&Math.min(Math.abs(a),Math.abs(b))===0;
  RBP(X,g,Z,WSBRICK);
  for(let y=g+1;y<=top;y++){const dy=y-g;let id;
    if(ring)id=cor?WSTONE:y===top-2?WSCARVE:mid&&dy%6===4&&y<top-3?LGLASS:dy%6===0?WSTONE:WSBRICK;
    else if(p.hollow){const lad=Math.abs(a)===h2-1&&b===0;id=lad?LADDER:y===top?WSBRICK:dy%6===0?PLANKS:dy%6===5&&a===0&&b===0?LANTERN:AIR;}
    else id=WSBRICK;
    RBP(X,y,Z,id);}
  if(ring&&!cor&&(Math.abs(a)+Math.abs(b))%2===0&&!p.roof)RBP(X,top+1,Z,WSBRICK);
  if(cor&&!p.roof){RBP(X,top+1,Z,WSBRICK);RBP(X,top+2,Z,WSBRICK);}
  if(p.roof&&m<=h2){const ry=top+1+(h2-m);RBP(X,ry,Z,m===0?WSPILLAR:SLATE);if(m===0){RBP(X,ry+1,Z,WSPILLAR);RBP(X,ry+2,Z,RBANNER);RBP(X,ry+3,Z,RBANNER);}}
  if(!p.roof&&a===0&&b===0){if(p.fire){RBP(X,top+1,Z,LOG);RBP(X,top+2,Z,BRAZIER);}else if(p.ban){RBS(X,Z,top+1,top+2,WSPILLAR);RBS(X,Z,top+3,top+4,RBANNER);}}
  if(p.fire&&!p.roof&&m===1&&!cor)RBP(X,top+1,Z,LOG);
};
// A curtain wall round a square site, p.r its outer edge, three thick and p.H high: a plinth, white ashlar, battlements on the
// outer edge, a walk along the top; the gate through it at the middle of the front (p.gw wide, p.gh high, a portcullis drawn up)
// with the realm's sign over it and banners either side; ladders up its inner face beside the gate
RB.cwall=(s,p,u,v,X,Z)=>{const m=Math.max(Math.abs(u),Math.abs(v)),R=p.r;if(m>R||m<R-2)return;const g=siteG(s,u,v),top=g+p.H,outer=m===R;
  const gateRow=-u>=R-2&&Math.abs(v)<=p.gw&&Math.abs(u)>=Math.abs(v);
  for(let y=g+1;y<=top;y++){let id=y<=g+2?WSTONE:(y===top-3&&outer?WSTONE:WSBRICK);
    if(gateRow){const dy=y-g,arch=Math.abs(v)===p.gw?p.gh-1:p.gh;if(dy<=arch)id=AIR;else if(dy===arch+1&&Math.abs(v)<p.gw&&u===-R+1)id=GRATE;}
    RBP(X,y,Z,id);}
  if(gateRow)RBP(X,g,Z,p.low?GRAVEL:PAVING); // the gateway paved
  if(gateRow&&u===-R){if(v===0)RBP(X,g+p.gh+3,Z,WSCARVE);}
  if(outer&&!gateRow&&(Math.abs(u)+Math.abs(v))%2===0)RBP(X,top+1,Z,WSBRICK);
  if(!outer&&m===R-2)RBP(X,top,Z,WSBRICK);
};
// banners hung on the outer face of a wall: two blocks long, at p.y
RB.banner=(s,p,u,v,X,Z)=>{RBS(X,Z,p.y,p.y+(p.n||2)-1,RBANNER);};
// a ladder up a face from p.y0 to p.y1
RB.ladder=(s,p,u,v,X,Z)=>{RBS(X,Z,p.y0,p.y1,LADDER);};
// a lamp on a white post
RB.lamp=(s,p,u,v,X,Z)=>{const g=p.y;RBP(X,g,Z,WSBRICK);RBS(X,Z,g+1,g+2,WSPILLAR);RBP(X,g+3,Z,LANTERN);};
// the ground inside a city's walls: paving everywhere but the gardens; retaining walls where a tier rises over the one below,
// with a parapet; lanes of plain paving, the avenue and the square of dressed flagstones
RB.cground=(s,p,u,v,X,Z)=>{const m=Math.max(Math.abs(u),Math.abs(v));if(m>s.R-3)return;const t=cityTier(s,u,v),g=s.T+t*5;
  let low=t;for(const [du,dv] of [[1,0],[-1,0],[0,1],[0,-1]])low=Math.min(low,cityTier(s,u+du,v+dv));
  if(low<t){RBS(X,Z,s.T+low*5+1,g,WSBRICK);if(!p.stair(u,v))RBP(X,g+1,Z,WSBRICK);if(!p.stair(u,v)&&(u+v)%14===0)RBP(X,g+2,Z,LANTERN);return;}
  if(p.garden(u,v))return;RBP(X,g,Z,Math.abs(v)<=3||p.square(u,v)?PAVING:hsh(X,9503,Z)<0.12?COBBLE:PAVING);
};
// stairs up the avenue where it climbs a tier: five steps of one block, an arch over the top
RB.cstair=(s,p,u,v,X,Z)=>{const k=u-p.u0,yl=p.y;if(Math.abs(v)<=3){if(k<5){RBS(X,Z,yl+1,yl+k+1,WSBRICK);RBP(X,yl+k+1,Z,PAVING);}RBS(X,Z,yl+k+2,yl+12,AIR);}
  if(k===5&&Math.abs(v)===4){RBS(X,Z,yl+6,yl+11,WSPILLAR);RBP(X,yl+12,Z,WSCARVE);}if(k===5&&Math.abs(v)<4)RBP(X,yl+12,Z,Math.abs(v)===0?WSCARVE:WSBRICK);};
// a garden: grass left as it grows, a fruit tree in blossom or a white-leafed one, a box hedge round it
RB.garden=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,edge=a===0||b===0||a===W-1||b===D-1;
  RBP(X,g,Z,GRASS);if(edge){if(!(b===0&&Math.abs(a-(W>>1))<=1))RBP(X,g+1,Z,LEAVES);return;}
  const cx=W>>1,cz=D>>1,d=Math.hypot(a-cx,b-cz);if(d<0.5){RBS(X,Z,g+1,g+3,LOG);}
  if(d<=2.3)for(let y=g+3;y<=g+5;y++){const e=Math.hypot(a-cx,(y-g-4)*1.3,b-cz);if(e<=2.4&&!(d<0.5&&y<g+4))RBP(X,y,Z,p.bl?BLOSSOM:FRUITL);}
  else if(hsh(X,9505,Z)<0.3)RBP(X,g+1,Z,[FLOWR,FLOWY,LAVENDER,OXEYE][(hsh(X,9507,Z)*4)|0]);};
// a fountain: a basin of white stone holding water, and in its middle a carved column with the realm's sign
RB.fountain=(s,p,u,v,X,Z)=>{const a=v-p.cv,b=u-p.cu,m=Math.max(Math.abs(a),Math.abs(b)),g=p.y;if(m>3)return;
  if(m===3){RBP(X,g,Z,WSBRICK);RBP(X,g+1,Z,WSBRICK);return;}RBP(X,g-1,Z,WSBRICK);RBP(X,g,Z,WATER);
  if(m===0){RBS(X,Z,g,g+2,WSPILLAR);RBP(X,g+3,Z,WSCARVE);RBP(X,g+4,Z,LANTERN);}};
// a market stall: posts and a striped awning, a counter of planks with wares on it
RB.stall=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,post=(a===0||a===W-1)&&(b===0||b===D-1);
  if(post)RBS(X,Z,g+1,g+3,LOG);RBP(X,g+4,Z,(a+(p.c||0))%2?WOOLW:p.wool||WOOLR);
  if(b===0&&!post){RBP(X,g+1,Z,PLANKS);const w=hsh(X,9509,Z);RBP(X,g+2,Z,w<0.3?FLOWR:w<0.5?WHEAT:w<0.65?POT3:AIR);}
  if(b===D-1&&!post&&hsh(X,9511,Z)<0.6)RBP(X,g+1,Z,hsh(X,9513,Z)<0.5?BARREL:CRATE);};
// a well: a ring of stone round water, posts and a little roof
RB.well=(s,p,u,v,X,Z)=>{const a=v-p.cv,b=u-p.cu,m=Math.max(Math.abs(a),Math.abs(b)),g=p.y;if(m>1)return;
  if(m===0){RBS(X,Z,g-4,g-1,WATER);RBP(X,g,Z,WATER);RBS(X,Z,g+1,g+3,AIR);RBP(X,g+4,Z,p.roof||PLANKS);return;}
  RBP(X,g,Z,COBBLE);RBP(X,g+1,Z,COBBLE);const cor=Math.abs(a)===1&&Math.abs(b)===1;if(cor)RBS(X,Z,g+2,g+3,LOG);RBP(X,g+4,Z,p.roof||PLANKS);
  RBS(X,Z,g-4,g-1,COBBLE);};
// a statue of a king of old on a plinth: white stone, the realm's sign on his breast, a crown of gold
RB.statue=(s,p,u,v,X,Z)=>{const a=v-p.cv,b=u-p.cu,g=p.y;if(Math.abs(a)>1||Math.abs(b)>1)return;RBP(X,g+1,Z,WSBRICK);if(a!==0||b!==0)return;
  RBP(X,g+2,Z,WSBRICK);RBS(X,Z,g+3,g+4,WSTONE);RBP(X,g+5,Z,WSCARVE);RBP(X,g+6,Z,WSTONE);RBP(X,g+7,Z,GOLDB);};
// lanes and paths: a strip of path (p.id), the grass cleared of its plants above
RB.lane=(s,p,u,v,X,Z)=>{RBP(X,p.y,Z,p.id||PATH);RBP(X,p.y+1,Z,AIR);};
// a domed hall of white stone: square walls with pillars at the corners and tall windows, a dome stepped in rings, a lantern on top
RB.dome=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,H=p.H,c=(W-1)/2,dx=a-c,dz=b-(D-1)/2,m=Math.max(Math.abs(dx),Math.abs(dz)),edge=m>=c-0.1,cor=Math.abs(dx)>=c-0.1&&Math.abs(dz)>=c-0.1;
  RBP(X,g,Z,edge?WSBRICK:WSTONE);
  for(let y=g+1;y<=g+H;y++){let id=AIR;const dy=y-g;
    if(edge){id=cor?WSPILLAR:dy<=1?WSTONE:y===g+H?WSCARVE:(Math.min(Math.abs(dx),Math.abs(dz))%3===1&&dy>=3&&dy<=H-2)?LGLASS:WSBRICK;
      if(dz<-c+0.5&&Math.abs(dx)<=1&&dy<=4)id=AIR;}
    else if(dy===H-1&&Math.abs(dx)<0.6&&Math.abs(dz)<0.6)id=LANTERN;
    RBP(X,y,Z,id);}
  const rr=c+0.5,d=Math.hypot(dx,dz);if(d<=rr){const ry=g+H+Math.round(Math.sqrt(Math.max(0,rr*rr-d*d))*0.9);RBP(X,ry,Z,d<1?WSPILLAR:WSTONE);if(d<1){RBP(X,ry+1,Z,WSPILLAR);RBP(X,ry+2,Z,LANTERN);}
    if(d<rr-1.2)for(let y=g+H+1;y<ry;y++)RBP(X,y,Z,AIR);}};
// a smithy: a stone hearth with its fire, a furnace, an anvil of iron, water to quench in, under a roof on posts open at the front
RB.smithy=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,back=b===D-1,side=a===0||a===W-1;RBP(X,g,Z,COBBLE);
  for(let y=g+1;y<=g+4;y++)RBP(X,y,Z,back||(side&&b>0)?(y===g+4?PLANKS:COBBLE):(side&&b===0?LOG:AIR));
  const ry=g+5+Math.min(a,W-1-a);RBP(X,ry,Z,SLATE);
  if(b===D-2&&a===1){RBP(X,g+1,Z,COBBLE);RBP(X,g+2,Z,BRAZIER);}if(b===D-2&&a===2)RBP(X,g+1,Z,FURN);if(b===2&&a===2)RBP(X,g+1,Z,STEELB);if(b===D-2&&a===W-2)RBP(X,g+1,Z,BARREL);
  if(b===1&&a===W-2){RBP(X,g,Z,COBBLE);RBP(X,g+1,Z,WATER);}};
// a training yard: sand, straw men on posts, archery butts
RB.yard=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y;RBP(X,g,Z,a===0||b===0||a===W-1||b===D-1?WSBRICK:hsh(X,9515,Z)<0.5?SAND:GRAVEL);
  if(a%4===2&&b===3){RBP(X,g+1,Z,LOG);RBP(X,g+2,Z,HAYBALE);RBP(X,g+3,Z,WOOLW);}
  if(b===D-2&&a%4===1&&a<W-1){RBS(X,Z,g+1,g+2,HAYBALE);RBP(X,g+3,Z,WOOLR);}};
// stables: stalls under a slate roof on posts, hay and a water trough
RB.stable=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,back=b===D-1;RBP(X,g,Z,back?COBBLE:hsh(X,9517,Z)<0.4?HAYBALE:DIRT);
  for(let y=g+1;y<=g+3;y++)RBP(X,y,Z,back||a===0||a===W-1?(y===g+3?PLANKS:PLANKS):(b===0&&a%3===0?LOG:a%3===0&&b<D-1&&y===g+1?PLANKS:AIR));
  RBP(X,g+4+Math.min(b,D-1-b)*0,Z,SLATE);if(b===D-2&&a%3===2)RBP(X,g+1,Z,HAYBALE);if(b===1&&a%3===2){RBP(X,g,Z,COBBLE);RBP(X,g+1,Z,WATER);}};
// a haystack
RB.hay=(s,p,u,v,X,Z)=>{const a=v-p.cv,b=u-p.cu,g=p.y,m=Math.abs(a)+Math.abs(b);if(m>2)return;RBS(X,Z,g+1,g+(m===0?3:m===1?2:1),HAYBALE);};
// a field: tilled earth on the land as it lies, crops in rows, a hedge round it with a gap at the front
RB.field=(s,p,u,v,X,Z)=>{if(realmRoadAt(X,Z,1)||realmSiteAt(X,Z,2))return;const o=colInfo(X,Z,TRB);if(o.wet||o.river||o.lake||o.b===0||o.h<o.sl+2)return;const g=o.h;if(slopeAt(X,Z,g)>1)return;
  const [a,b,W,D]=partAB(p,u,v),edge=a===0||b===0||a===W-1||b===D-1;
  if(edge){if(!(b===0&&Math.abs(a-(W>>1))<=1)){RBP(X,g,Z,GRASS);RBP(X,g+1,Z,LEAVES);if(hsh(X,9519,Z)<0.4)RBP(X,g+2,Z,LEAVES);}return;}
  if(a%5===0){RBP(X,g,Z,FARM_W);RBP(X,g+1,Z,AIR);return;}RBP(X,g,Z,FARM_D);RBP(X,g+1,Z,p.crop);RBP(X,g+2,Z,AIR);};
const TRB={};
// ---- Layouts
function siteLayout(s){if(s.lay)return s.lay;const L={parts:[],spots:[]};s.lay=L;
  const r=rngAt(Math.round(s.X),9521,Math.round(s.Z));
  if(s.k==='city')cityLayout(s,L,r);else if(s.k==='village')villageLayout(s,L,r);else if(s.k==='farm')farmLayout(s,L,r);else if(s.k==='fort')fortLayout(s,L,r);else outpostLayout(s,L,r);
  for(const p of L.parts){p.bu0=Math.min(p.u0,p.u1);p.bu1=Math.max(p.u0,p.u1);p.bv0=Math.min(p.v0,p.v1);p.bv1=Math.max(p.v0,p.v1);}
  return L;}
// The city: walls and towers round it, the gatehouse at the front, the avenue up through the tiers to the citadel; a square with
// a fountain and a market where the avenue crosses the first row of lanes; houses in a grid of lots between lanes (stone and
// timbered, two and three storeys), gardens among them; barracks and a training yard, a smithy and stables by the gate, an inn,
// the domed Hall of Lamps; in the citadel the great hall with its porch, the white tower, a court with a king's statue
function cityLayout(s,L,r){
  const R=s.R,f=cityFrame(s),cu=f.cu,rt=s.tiers>=3?f.r2:f.r1,P=L.parts,g0=s.T,tierY=t=>g0+t*5;
  const bounds=[];if(s.tiers>=3)bounds.push({r:f.r1,t:1},{r:f.r2,t:2});else bounds.push({r:f.r1,t:1});
  // where the avenue climbs: five rows before each boundary along it
  const stairAt=(u,v)=>Math.abs(v)<=4&&bounds.some(B=>u>=cu-B.r-5&&u<=cu-B.r);
  const lots=[],taken=(u0,u1,v0,v1)=>lots.some(q=>!(u1<q[0]||u0>q[1]||v1<q[2]||v0>q[3]));
  const fb=cu-f.r1,sq={u0:-R+28,u1:Math.min(-R+43,fb-7),v:22}; // the square: astride the avenue, behind the barracks rows
  if(sq.u1-sq.u0<10){sq.u0=-R+17;sq.u1=Math.min(-R+32,fb-7);}
  const gardens=[];
  P.push({k:'cground',u0:-R,u1:R,v0:-R,v1:R,f:0,stair:stairAt,garden:(u,v)=>gardens.some(q=>u>=q[0]&&u<=q[1]&&v>=q[2]&&v<=q[3]),square:(u,v)=>u>=sq.u0&&u<=sq.u1&&Math.abs(v)<=sq.v});
  lots.push([sq.u0,sq.u1,-sq.v,sq.v]);
  // the citadel's ground is its own
  const cit=[cu-rt,cu+rt,-rt,rt];lots.push(cit);
  // stairs and arches up the avenue
  for(const B of bounds){const u0=cu-B.r-5;P.push({k:'cstair',u0:u0,u1:u0+5,v0:-4,v1:4,f:0,y:tierY(B.t-1)});lots.push([u0-1,u0+6,-5,5]);}
  // lots: 9 by 9 in cells of 12, lanes of 3 between them; the first column beside the avenue faces it, the rest face the gate
  const cells=[];
  for(let cuI=0;;cuI++){const u0=-R+5+cuI*12,u1=u0+8;if(u1>R-5)break;
    for(let cvI=0;;cvI++){const v0=5+cvI*12,v1=v0+8;if(v1>R-5)break;for(const sg of [1,-1]){const a0=sg>0?v0:-v1,a1=sg>0?v1:-v0;cells.push({u0:u0,u1:u1,v0:a0,v1:a1,ci:cuI,cj:cvI,sg:sg});}}}
  const tierOf=(c)=>{const ts=new Set();for(const [uu,vv] of [[c.u0-1,c.v0-1],[c.u1+1,c.v0-1],[c.u0-1,c.v1+1],[c.u1+1,c.v1+1],[(c.u0+c.u1)>>1,(c.v0+c.v1)>>1]])ts.add(cityTier(s,uu,vv));return ts.size===1?[...ts][0]:-1;};
  // the special buildings by the gate and on the avenue
  const special=new Map(),want=(ci,cj,sg,k)=>{special.set(ci+','+cj+','+sg,k);};
  const sgA=r()<0.5?1:-1;want(0,0,sgA,'barracks');want(0,1,sgA,'barracks2');want(1,0,sgA,'yard');want(1,1,sgA,'yard2');want(0,0,-sgA,'smithy');want(0,1,-sgA,'stable');
  for(const c of cells){if(taken(c.u0,c.u1,c.v0,c.v1))continue;const t=tierOf(c);if(t<0)continue;const g=tierY(t),key=c.ci+','+c.cj+','+c.sg,sp=special.get(key);
    const faceAv=c.cj===0?(c.sg>0?2:3):0; // toward the avenue, or toward the gate
    if(sp==='barracks'||sp==='barracks2'){if(sp==='barracks'){const other=cells.find(q=>q.ci===c.ci&&q.cj===1&&q.sg===c.sg);if(other&&tierOf(other)===t&&!taken(other.u0,other.u1,other.v0,other.v1)){
        const v0=Math.min(c.v0,other.v0),v1=Math.max(c.v1,other.v1);P.push({k:'house',u0:c.u0,u1:c.u1,v0:v0,v1:v1,f:0,W:v1-v0+1,D:9,y:g,st:2,sh:5,mat:'stone',ov:0,roof:SLATE,door:Math.floor((v1-v0)/2),dw:2,dh:3,lamp:true,ridge:'a',chim:[2,8],pil:true});
        L.spots.push({kind:'barracks',u:c.u0-2,v:(v0+v1)/2,y:g});lots.push([c.u0,c.u1,v0,v1]);}}continue;}
    if(sp==='yard'||sp==='yard2'){if(sp==='yard'){const other=cells.find(q=>q.ci===c.ci&&q.cj===1&&q.sg===c.sg);if(other&&tierOf(other)===t){const v0=Math.min(c.v0,other.v0),v1=Math.max(c.v1,other.v1);
        P.push({k:'yard',u0:c.u0,u1:c.u1,v0:v0,v1:v1,f:0,y:g});L.spots.push({kind:'drill',u:(c.u0+c.u1)/2,v:(v0+v1)/2,y:g});lots.push([c.u0,c.u1,v0,v1]);}}continue;}
    if(sp==='smithy'){P.push({k:'smithy',u0:c.u0,u1:c.u1,v0:c.v0,v1:c.v1,f:faceAv,y:g});L.spots.push({kind:'smithy',u:(c.u0+c.u1)/2,v:c.sg*3,y:g});continue;}
    if(sp==='stable'){P.push({k:'stable',u0:c.u0,u1:c.u1,v0:c.v0,v1:c.v1,f:0,y:g});continue;}
    const q=r();
    if(q<0.11){gardens.push([c.u0,c.u1,c.v0,c.v1]);P.push({k:'garden',u0:c.u0,u1:c.u1,v0:c.v0,v1:c.v1,f:0,y:g,bl:r()<0.5});continue;}
    if(q<0.4&&c.cj>0){ // two narrow houses side by side, their gables to the lane
      const w1=4+(r()<0.5?1:0),f0=faceAv;const st1=r()<0.5?3:2,st2=r()<0.5?3:2,m1=r()<0.5?'stone':'timber',m2=r()<0.5?'stone':'timber';
      P.push({k:'house',u0:c.u0,u1:c.u1,v0:c.v0,v1:c.v0+w1-1,f:f0,W:w1,D:9,y:g,st:st1,sh:4,mat:m1,ov:0,roof:SLATE,door:Math.floor(w1/2),lamp:true,ridge:'b',chim:[1,8]});
      P.push({k:'house',u0:c.u0,u1:c.u1,v0:c.v0+w1,v1:c.v1,f:f0,W:9-w1,D:9,y:g,st:st2,sh:4,mat:m2,ov:0,roof:SLATE,door:Math.floor((9-w1)/2),lamp:true,ridge:'b',chim:[1,8]});
      L.spots.push({kind:'street',u:c.u0-2,v:(c.v0+c.v1)/2,y:g});continue;}
    const st=r()<0.45?3:2,mat=r()<0.55?'stone':'timber';
    P.push({k:'house',u0:c.u0,u1:c.u1,v0:c.v0,v1:c.v1,f:faceAv,W:9,D:9,y:g,st:st,sh:4,mat:mat,ov:0,roof:SLATE,door:4,lamp:true,ridge:r()<0.5?'a':'b',chim:[1,8]});
    if(q>0.75)L.spots.push({kind:'street',u:c.u0-2,v:(c.v0+c.v1)/2,y:g});}
  // the square: flagstones, the fountain, stalls round it, lamps
  const scu=(sq.u0+sq.u1)>>1,sg0=tierY(cityTier(s,scu,0));
  P.push({k:'fountain',u0:scu-3,u1:scu+3,v0:-3,v1:3,cu:scu,cv:0,y:sg0});
  const wools=[WOOLR,WOOLB,WOOLY,WOOLG];let nst=0;
  for(const sg of [1,-1])for(let k=0;k<3;k++){const v0=sg>0?8+k*5:-(8+k*5)-3,u0=sq.u0+1;P.push({k:'stall',u0:u0,u1:u0+2,v0:v0,v1:v0+3,f:0,y:sg0,wool:wools[(nst++)%4],c:k});
    P.push({k:'stall',u0:sq.u1-3,u1:sq.u1-1,v0:v0,v1:v0+3,f:1,y:sg0,wool:wools[(nst++)%4],c:k});}
  L.spots.push({kind:'market',u:scu,v:12,y:sg0},{kind:'market',u:scu,v:-12,y:sg0},{kind:'street',u:scu-6,v:0,y:sg0});
  for(const [uu,vv] of [[sq.u0,sq.v],[sq.u0,-sq.v],[sq.u1,sq.v],[sq.u1,-sq.v]])P.push({k:'lamp',u0:uu,u1:uu,v0:vv,v1:vv,f:0,y:sg0});
  // lamps up the avenue, on both sides, every ten blocks (not on the stairs)
  for(let u=-R+6;u<cu-rt-2;u+=10)for(const vv of [4,-4]){if(stairAt(u,vv)||(u>=sq.u0&&u<=sq.u1))continue;P.push({k:'lamp',u0:u,u1:u,v0:vv,v1:vv,f:0,y:tierY(cityTier(s,u,vv))});}
  L.spots.push({kind:'street',u:-R+8,v:0,y:g0},{kind:'street',u:Math.round((sq.u1+cu-rt)/2),v:0,y:tierY(cityTier(s,Math.round((sq.u1+cu-rt)/2),0))});
  // the Hall of Lamps: a domed hall on a lot beside the avenue in the upper ring (or the lower), and an inn on the avenue
  {let best=null;for(const c of cells){if(c.sg!==1&&c.sg!==-1)continue;const q=[c,...[[1,0],[0,1],[1,1]].map(([a,b])=>cells.find(x=>x.ci===c.ci+a&&x.cj===c.cj+b&&x.sg===c.sg))];
      if(q.some(x=>!x)||q.some(x=>special.has(x.ci+','+x.cj+','+x.sg)))continue;const u0=c.u0,u1=c.u0+20,v0=Math.min(...q.map(x=>x.v0)),v1=Math.max(...q.map(x=>x.v1));
      if(v1-v0!==20||taken(u0-1,u1+1,v0,v1))continue;const t=tierOf({u0:u0,u1:u1,v0:v0,v1:v1});if(t<0)continue;const sc=-c.cj*3-Math.abs(c.ci-2)+hsh(c.ci,9529,c.cj);if(!best||sc>best.sc)best={u0:u0,u1:u1,v0:v0,v1:v1,t:t,sg:c.sg,cj:c.cj,sc:sc};}
    if(best){const g=tierY(best.t);for(let k=P.length-1;k>=0;k--){const q=P[k];if((q.k==='house'||q.k==='garden')&&q.u0>=best.u0&&q.u1<=best.u1&&Math.min(q.v0,q.v1)>=best.v0&&Math.max(q.v0,q.v1)<=best.v1)P.splice(k,1);}
      for(let k=gardens.length-1;k>=0;k--){const q=gardens[k];if(q[0]>=best.u0&&q[1]<=best.u1&&q[2]>=best.v0&&q[3]<=best.v1)gardens.splice(k,1);}
      lots.push([best.u0,best.u1,best.v0,best.v1]);P.push({k:'dome',u0:best.u0,u1:best.u1,v0:best.v0,v1:best.v1,f:best.cj===0?(best.sg>0?2:3):0,y:g,H:9});
      L.spots.push({kind:'street',u:best.u0-2,v:(best.v0+best.v1)/2,y:g});}}
  // the citadel: a court before the great hall, the white tower behind it, gardens either side; guards at its arch
  {const ct=s.tiers>=3?2:1,g=tierY(ct),tw=s.tiers>=3?4:3,tu=cu+rt-tw-2,hu1=tu-tw-2,hw=Math.min(7,rt-5),hd=Math.max(7,Math.min(18,hu1-(cu-rt+8)-2)),hu0=hu1-hd-1;
    P.push({k:'house',u0:hu0,u1:hu1,v0:-hw,v1:hw,f:0,W:2*hw+1,D:hd,y:g,st:1,sh:8,mat:'stone',ov:0,roof:SLATE,door:hw,dw:2,dh:4,lamp:true,ridge:'b',porch:2,pil:true,floor:WSTONE});
    P.push({k:'tower',u0:tu-tw,u1:tu+tw,v0:-tw,v1:tw,cu:tu,cv:0,h2:tw,H:s.tiers>=3?40:30,y:g,roof:true});
    P.push({k:'statue',u0:hu0-6,u1:hu0-4,v0:-1,v1:1,cu:hu0-5,cv:0,y:g});
    for(const sg of [1,-1]){const gv0=sg>0?hw+3:-rt+2,gv1=sg>0?rt-2:-hw-3;if(gv1-gv0>=4){gardens.push([cu-rt+3,cu+rt-3,gv0,gv1]);P.push({k:'garden',u0:cu-rt+3,u1:cu+rt-3,v0:gv0,v1:gv1,f:0,y:g,bl:true});}}
    for(const vv of [3,-3])P.push({k:'lamp',u0:hu0-3,u1:hu0-3,v0:vv,v1:vv,f:0,y:g});
    L.spots.push({kind:'citadel',u:hu0-8,v:0,y:g},{kind:'hall',u:hu0+Math.round(hd/2),v:0,y:g},{kind:'citgate',u:cu-rt+2,v:0,y:g});}
  // walls, towers at the corners and along the sides, the gatehouse; banners, ladders
  P.push({k:'cwall',u0:-R,u1:R,v0:-R,v1:R,f:0,r:R,H:11,gw:2,gh:7});
  const tw=(cu0,cv0,h2,H,o)=>P.push(Object.assign({k:'tower',u0:cu0-h2,u1:cu0+h2,v0:cv0-h2,v1:cv0+h2,cu:cu0,cv:cv0,h2:h2,H:H,y:siteG(s,cu0,cv0)},o||{}));
  for(const [a,b] of [[-1,-1],[-1,1],[1,-1],[1,1]])tw(a*(R-1),b*(R-1),4,17,{ban:true});
  const n=Math.max(1,Math.round(2*R/30));for(let k=1;k<n;k++){const t2=Math.round(-R+k*2*R/n);for(const sd of [-1,1]){tw(t2,sd*(R-1),3,15);if(Math.abs(t2)>8)tw(sd*(R-1),t2,3,15);}}
  tw(-(R-1),6,3,19,{ban:true});tw(-(R-1),-6,3,19,{ban:true});
  for(const vv of [6,-6])P.push({k:'banner',u0:-R-3,u1:-R-3,v0:vv,v1:vv,f:0,y:g0+10,n:3});
  for(const vv of [10,-10])P.push({k:'ladder',u0:-R+3,u1:-R+3,v0:vv,v1:vv,f:0,y0:g0+1,y1:g0+11});
  L.spots.push({kind:'gate',u:-R-3,v:0,y:g0},{kind:'gatein',u:-R+5,v:0,y:g0});
}
// A village: a green with a well in the middle, lanes out to the road and back, cottages round the green facing it (timbered
// plaster on cobble, thatched), an inn, a chapel of white stone with a bell tower, a smithy; haystacks and kitchen gardens
function villageLayout(s,L,r){
  const R=s.R,g=s.T,P=L.parts,small=R<24,rg=small?6:9,rs=small?11:17; // a hamlet (small) has a smaller green and its cottages closer in
  P.push({k:'lane',u0:-R,u1:-rg+2,v0:-1,v1:1,f:0,y:g});P.push({k:'lane',u0:rg-2,u1:R-2,v0:-1,v1:1,f:0,y:g});P.push({k:'lane',u0:-1,u1:1,v0:-R+3,v1:-rg+2,f:0,y:g});P.push({k:'lane',u0:-1,u1:1,v0:rg-2,v1:R-3,f:0,y:g});
  P.push({k:'ring',u0:-rg,u1:rg,v0:-rg,v1:rg,f:0,y:g,r:rg});
  P.push({k:'well',u0:-1,u1:1,v0:-1,v1:1,cu:0,cv:0,y:g,roof:THATCH});
  const slots=[];for(let k=0;k<8;k++){const a=(k*45+22.5)*Math.PI/180,rd=rs+(k%2)*2,cu0=Math.round(Math.cos(a)*rd),cv0=Math.round(Math.sin(a)*rd);
    slots.push([cu0,cv0,Math.abs(cu0)>Math.abs(cv0)?(cu0<0?1:0):(cv0<0?3:2)]);}
  const kinds=['chapel','inn','smithy'];
  const order=slots.map((q,i)=>[q,hsh(i,9523,Math.round(s.X))]).sort((a,b)=>a[1]-b[1]).map(q=>q[0]);
  order.forEach((q,i)=>{const [cu0,cv0,f]=q,kind=kinds[i]||'cottage',w=kind==='chapel'?7:kind==='inn'?9:7,d=kind==='chapel'?11:kind==='inn'?11:9;
    if(Math.max(Math.abs(cu0),Math.abs(cv0))+Math.max(w,d)/2>R-1)return;
    if(kind==='smithy'){P.push(partC('smithy',cu0,cv0,7,6,f,{y:g}));L.spots.push({kind:'smithy',u:cu0,v:cv0,y:g});return;}
    if(kind==='chapel'){P.push(partC('house',cu0,cv0,w,d,f,{W:w,D:d,y:g,st:1,sh:6,mat:'stone',ov:0,roof:SLATE,door:3,dw:1,dh:3,lamp:true,ridge:'b',pil:false,floor:WSTONE}));
      const p=P[P.length-1],bt=f===0?[p.u1-1,cv0]:f===1?[p.u0+1,cv0]:f===2?[cu0,p.v1-1]:[cu0,p.v0+1];P.push({k:'tower',u0:bt[0]-1,u1:bt[0]+1,v0:bt[1]-1,v1:bt[1]+1,cu:bt[0],cv:bt[1],h2:1,H:11,y:g,roof:true});return;}
    const ov=1,W=w-2*ov,D=d-2*ov;P.push(partC('house',cu0,cv0,w,d,f,{W:W,D:D,y:g,st:kind==='inn'?2:1,sh:4,mat:kind==='inn'?'timber':'cottage',ov:ov,roof:THATCH,door:Math.floor(W/2),dw:1,dh:2,lamp:kind==='inn',ridge:'b',chim:[1,D-1]}));
    if(kind==='inn')L.spots.push({kind:'green',u:cu0*0.6,v:cv0*0.6,y:g});
    // a kitchen garden or a haystack behind
    const bu=f===0?cu0+d/2+2:f===1?cu0-d/2-2:cu0,bv=f===2?cv0+d/2+2:f===3?cv0-d/2-2:cv0;if(Math.max(Math.abs(bu),Math.abs(bv))<R-2){if(hsh(i,9525,Math.round(s.Z))<0.5)P.push({k:'hay',u0:Math.round(bu)-2,u1:Math.round(bu)+2,v0:Math.round(bv)-2,v1:Math.round(bv)+2,cu:Math.round(bu),cv:Math.round(bv),y:g});}});
  L.spots.push({kind:'green',u:-4,v:4,y:g},{kind:'green',u:4,v:-4,y:g},{kind:'lane',u:-R+4,v:0,y:g});
  fieldsRound(s,L,r,6);
}
// A farmstead: a farmhouse and a great barn across a yard, a well, haystacks; its fields about it
function farmLayout(s,L,r){
  const g=s.T,P=L.parts;
  P.push({k:'lane',u0:-s.R,u1:-3,v0:-1,v1:1,f:0,y:g});
  P.push(partC('house',-1,-7,9,11,3,{W:7,D:9,y:g,st:1,sh:4,mat:'cottage',ov:1,roof:THATCH,door:3,ridge:'b',chim:[1,8]}));
  P.push(partC('house',1,8,11,13,2,{W:9,D:11,y:g,st:1,sh:6,mat:'cottage',ov:1,roof:SLATE,door:4,dw:2,dh:4,ridge:'b'}));
  P.push({k:'well',u0:-5,u1:-3,v0:2,v1:4,cu:-4,cv:3,y:g});P.push({k:'hay',u0:6,u1:10,v0:-4,v1:0,cu:8,cv:-2,y:g});
  L.spots.push({kind:'farm',u:-4,v:0,y:g});
  fieldsRound(s,L,r,4);
}
// fields in a ring about an open site: n rectangles beyond its edge, each a different crop
function fieldsRound(s,L,r,n){const base=s.R+s.M,crops=[WHEAT,WHEAT,POT3,TURN2,BEAN2,WHEAT];
  for(let k=0;k<n;k++){const a=(k+0.3+r()*0.4)/n*6.283,d=base+4+r()*10,u=Math.round(Math.cos(a)*d),v=Math.round(Math.sin(a)*d),w=10+Math.floor(r()*8),dd=8+Math.floor(r()*6),f=Math.abs(Math.cos(a))>Math.abs(Math.sin(a))?(Math.cos(a)>0?0:1):(Math.sin(a)>0?2:3);
    L.parts.push(partC('field',u,v,w,dd,f,{crop:crops[(k+(r()*6|0))%6]}));if(k<2)L.spots.push({kind:'field',u:u,v:v,y:-1});}}
// A castle: a curtain wall with towers at its corners and a gatehouse, a keep at the back with turrets and the realm's banner,
// barracks along one wall, stables along the other, a well and a training yard in the bailey
function fortLayout(s,L,r){
  const R=s.R,g=s.T,P=L.parts;
  P.push({k:'lane',u0:-R+3,u1:1,v0:-2,v1:2,f:0,y:g,id:PAVING});
  P.push({k:'house',u0:2,u1:14,v0:-6,v1:6,f:0,W:13,D:13,y:g,st:4,sh:5,mat:'stone',ov:0,roof:SLATE,door:6,dw:2,dh:3,lamp:true,ridge:'b',chim:[2,12],pil:true,floor:WSTONE});
  for(const [a,b] of [[2,-6],[2,6],[14,-6],[14,6]])P.push({k:'tower',u0:a-1,u1:a+1,v0:b-1,v1:b+1,cu:a,cv:b,h2:1,H:24,y:g,ban:a===14});
  P.push({k:'house',u0:-14,u1:9,v0:13,v1:18,f:2,W:24,D:6,y:g,st:2,sh:4,mat:'stone',ov:0,roof:SLATE,door:12,lamp:true,ridge:'a',chim:[2,5]});
  P.push({k:'stable',u0:-14,u1:5,v0:-18,v1:-13,f:3,y:g});
  P.push({k:'yard',u0:-15,u1:-6,v0:-9,v1:6,f:0,y:g});
  P.push({k:'well',u0:-3,u1:-1,v0:8,v1:10,cu:-2,cv:9,y:g});
  P.push({k:'cwall',u0:-R,u1:R,v0:-R,v1:R,f:0,r:R,H:12,gw:2,gh:6});
  const tw=(cu0,cv0,h2,H,o)=>P.push(Object.assign({k:'tower',u0:cu0-h2,u1:cu0+h2,v0:cv0-h2,v1:cv0+h2,cu:cu0,cv:cv0,h2:h2,H:H,y:g},o||{}));
  for(const [a,b] of [[-1,-1],[-1,1],[1,-1],[1,1]])tw(a*(R-1),b*(R-1),4,19,{ban:true});
  tw(-(R-1),5,3,18,{ban:true});tw(-(R-1),-5,3,18,{ban:true});
  for(const vv of [5,-5])P.push({k:'banner',u0:-R-3,u1:-R-3,v0:vv,v1:vv,f:0,y:g+9,n:3});
  P.push({k:'ladder',u0:-R+3,u1:-R+3,v0:9,v1:9,f:0,y0:g+1,y1:g+12});
  L.spots.push({kind:'gate',u:-R-3,v:0,y:g},{kind:'drill',u:-10,v:-2,y:g},{kind:'keep',u:-1,v:0,y:g},{kind:'barracks',u:-6,v:10,y:g});
}
// A watchtower: a tall tower with a beacon on its roof inside a low walled yard, a guardhouse of timber, hay and barrels
function outpostLayout(s,L,r){
  const R=s.R,g=s.T,P=L.parts;
  P.push({k:'lane',u0:-R+1,u1:R-1,v0:-R+1,v1:R-1,f:0,y:g,id:GRAVEL});
  P.push({k:'cwall',u0:-R,u1:R,v0:-R,v1:R,f:0,r:R,H:3,gw:1,gh:3,low:true});
  P.push({k:'tower',u0:0,u1:6,v0:-3,v1:3,cu:3,cv:0,h2:3,H:22,y:g,hollow:true,fire:true});
  P.push({k:'house',u0:-6,u1:-2,v0:-6,v1:-2,f:3,W:5,D:5,y:g,st:1,sh:4,mat:'timber',ov:0,roof:SLATE,door:2,ridge:'b'});
  P.push({k:'hay',u0:-5,u1:-1,v0:3,v1:7,cu:-3,cv:5,y:g});
  L.spots.push({kind:'post',u:-2,v:0,y:g});
}
// ---- the ring path round a village green
RB.ring=(s,p,u,v,X,Z)=>{const d=Math.hypot(u,v);if(d>=p.r-1.5&&d<p.r+0.5)RBP(X,p.y,Z,PATH);};
// ---- Roads: paved with flagstones between kerbs of white stone (the king's roads), lanes of beaten earth; a bridge of stone
// or planks where a road crosses water; on the king's roads a white milestone with a lamp every 72 blocks
function realmRoadCol(X,Z,x,z){
  const rr=realmRoadAt(X,Z,1);if(!rr)return;const s=realmSiteAt(X,Z,0);if(s)return;const o=colInfo(X,Z,TRB),g=o.h,rd=rr.rd,hi=rd.k==='high',ao=Math.abs(rr.off);
  const wet=o.wet||o.river||o.lake||o.b===0||g<o.sl+1;
  if(ao>rd.w+0.5){ // just beside the road: the milestones
    if(hi&&!wet&&ao<=rd.w+1.5&&rr.off>0&&Math.floor(rr.along)%72===36){RBP(X,g,Z,WSBRICK);RBS(X,Z,g+1,g+2,WSPILLAR);RBP(X,g+3,Z,LANTERN);}return;}
  if(wet){const y=Math.max(o.sl,o.lake||0)+2,edge=ao>rd.w-0.5;RBP(X,y,Z,hi?WSBRICK:PLANKS);if(edge)RBP(X,y+1,Z,hi?WSBRICK:PLANKS);RBS(X,Z,y+(edge?2:1),y+3,AIR);
    if(Math.floor(rr.along)%6===0)for(let yy=y-1;yy>=Math.max(1,g-1);yy--)RBP(X,yy,Z,hi?WSBRICK:LOG);return;}
  const top=world[I(x,g,z)];if(top===AIR||top===WATER)return;
  RBP(X,g,Z,hi?(ao>rd.w-0.5?WSBRICK:PAVING):hsh(X,9527,Z)<0.15?GRAVEL:PATH);for(let y=g+1;y<=g+3;y++){const id=world[I(x,y,z)];if(id&&!SOLID[id])RBP(X,y,Z,AIR);else if(SOLID[id]&&y===g+1)RBP(X,y,Z,AIR);}
}
// ---- Per chunk: every site that reaches the chunk builds the parts over its columns; then the roads
function applyRealms(WCX,WCZ){
  const x0=WCX*CS,z0=WCZ*CS,T=realmTile(x0,z0);if(!T.sites.length&&!T.roads.length)return;
  genLit=true;
  try{
    for(const s of T.sites){const e=s.R+s.M+40;if(s.X+e<x0||s.X-e>x0+CS-1||s.Z+e<z0||s.Z-e>z0+CS-1)continue;const L=siteLayout(s);
      // the chunk's box in the site's frame, and the parts it meets
      let u0=1e9,u1=-1e9,v0=1e9,v1=-1e9;for(const [X,Z] of [[x0,z0],[x0+CS-1,z0],[x0,z0+CS-1],[x0+CS-1,z0+CS-1]]){const [u,v]=siteUV(s,X,Z);u0=Math.min(u0,u);u1=Math.max(u1,u);v0=Math.min(v0,v);v1=Math.max(v1,v);}
      const ps=L.parts.filter(p=>!(p.bu1<u0||p.bu0>u1||p.bv1<v0||p.bv0>v1));if(!ps.length)continue;
      for(let lz=0;lz<CS;lz++)for(let lx=0;lx<CS;lx++){const X=x0+lx,Z=z0+lz,[u,v]=siteUV(s,X,Z);
        for(const p of ps)if(u>=p.bu0&&u<=p.bu1&&v>=p.bv0&&v<=p.bv1)RB[p.k](s,p,u,v,X,Z);}}
    if(T.roads.length)for(let lz=0;lz<CS;lz++)for(let lx=0;lx<CS;lx++)realmRoadCol(x0+lx,z0+lz,x0+lx-OX,z0+lz-OZ);
  }finally{genLit=false;}
}
