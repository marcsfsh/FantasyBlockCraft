// ---- Building the wood elves of the forest kingdoms (D-065), in the frame and parts of realm-build.js. They build in and under
// the trees, on the ground as it lies: their cities stand in goldboughs (great trees of silver bark and golden leaves) with
// platforms of pale planks about the trunks at the same heights across the city, stairs winding up the trunks, houses wrapped
// round the trunks under cones of leaf thatch, bridges with woven rails from tree to tree, lamps of pale light everywhere; a
// clipped hedge rings a city, its gate between two trees joined by a bridge over the way; the king's halls lie under a hill,
// a gate of rootstone in its face over a stream, a great hall within on pillars like trees, the king's seat crowned with
// branching antlers of wood, a cellar of casks; tree-villages gather round a feasting glade; watch-trees stand alone with a high
// platform; the glades have long tables under lamps, a fire and casks. The forest's own trees grow on between their works
// (woodBusy keeps them off what the layout marks clear, its paths and hedge, and the goldboughs and bridges overhead).
// Columns build on their own ground (hAt: as it lies, or a pad, or the halls' hill); a layout reads only the raw samples (elfRaw).
const WTAU=6.2832;
const wvRaw=(s,u,v)=>{const [X,Z]=siteXZ(s,u,v);return Math.round(elfRaw(s,X,Z));};
const wAng=(a,b)=>{let d=(a-b)%WTAU;if(d<-Math.PI)d+=WTAU;if(d>Math.PI)d-=WTAU;return d;};
const wFrac=(a,a0)=>((((a-a0)%WTAU)+WTAU)%WTAU)/WTAU;
// A goldbough: the trunk (p.tr across its middle) flaring into roots at its foot; platforms p.fl ({y, r, house, hall}) of planks
// about it, each edged in carved wood with a woven rail and lamps at its quarters, or a house wrapped round the trunk (walls of
// carved wood with windows and a door toward the stair, a cone of leaf thatch, lamps within); a stair winding up the trunk from
// its foot to the highest platform (p.P blocks a turn, from angle p.a0) with a carved edge and a rail, lamps at every quarter
// turn; above, boughs into a crown of golden leaves (p.cr wide, from p.c0 to p.c1)
RB.wtree=(s,p,u,v,X,Z)=>{const du=u-p.cu,dv=v-p.cv,d=Math.hypot(du,dv);if(d>p.ext)return;const a=Math.atan2(dv,du),g=hAt(X,Z),top=p.c1-2;
  if(d<=p.tr){for(let y=Math.min(g,p.base)-2;y<=top;y++)RBP(X,y,Z,WBARK);return;}
  if(d<=p.tr+2.6&&Math.abs(Math.sin(a*p.nr+p.ph))>0.55){const rh=p.base+Math.round(3-(d-p.tr)*1.3);for(let y=Math.min(g,p.base)-1;y<=rh;y++)RBP(X,y,Z,WBARK);}
  for(const f of p.fl){if(d>f.r+0.5)continue;
    RBP(X,f.y,Z,d>f.r-0.7?WCARVE:WPLANK);
    if(f.house){const hr=f.r-1.5,ry=f.y+5+Math.round((f.r+0.5-d)*(f.hall?0.7:0.55));
      if(d<=f.r+0.5&&d>p.tr)RBP(X,ry,Z,WTHATCH);
      if(d<hr+0.5)for(let y=f.y+1;y<ry;y++)RBP(X,y,Z,AIR);
      if(d>hr-0.5&&d<=hr+0.5){const door=Math.abs(wAng(a,p.a0))*d<1.3,win=Math.abs(Math.sin(a*(f.hall?6:4)+p.ph*2))<0.3;
        for(let y=f.y+1;y<=f.y+4;y++)RBP(X,y,Z,door&&y<=f.y+3?AIR:win&&y>=f.y+2&&y<=f.y+3&&!door?AIR:y===f.y+4?WPLANK:WCARVE);}
      else if(d>f.r-0.7)RBP(X,f.y+1,Z,(wFrac(a,p.ph)*8|0)%2===0&&wFrac(a,p.ph)*8%1<0.15?WLAMP:WRAIL);
      else if(d>p.tr+3.1&&d<hr-0.5&&Math.abs(wAng(a,p.a0+Math.PI))*d<0.8)RBP(X,f.y+1,Z,WLAMP);
      if(f.hall&&d<hr-1&&d>p.tr+3.1&&Math.abs(wAng(a,p.a0+Math.PI))*d<1.5){RBP(X,f.y+1,Z,WCARVE);RBP(X,f.y+2,Z,WPLANK);} // the lord's seat, across from the door
      continue;}
    if(d>f.r-0.7){const q=wFrac(a,p.ph)*4;RBP(X,f.y+1,Z,q%1<0.08?WLAMP:WRAIL);}}
  // the stair: a plank step on each turn at this angle, headroom over it; its carved edge and rail outside
  if(p.P&&d>p.tr+0.5&&d<p.tr+3.1){const t=wFrac(a,p.a0),edge=d>=p.tr+2.3;
    for(let y=p.base+1+Math.round(t*p.P);y<=p.sy1;y+=p.P){if(edge){if(!p.fl.some(f=>Math.abs(f.y-y)<=1&&d<=f.r)){RBP(X,y,Z,WCARVE);RBP(X,y+1,Z,(Math.round(t*16)%4===0)?WLAMP:WRAIL);}}
      else{RBP(X,y,Z,WPLANK);RBS(X,Z,y+1,y+3,AIR);}}}
  // boughs into the crown, and the crown of golden leaves (a shell three deep, its edge ragged)
  if(d<p.cr*0.8)for(const b of p.bough){if(Math.abs(wAng(a,b))*d<1.1){const y=Math.round(p.c0-2+(d-p.tr)/(p.cr*0.8-p.tr)*((p.c0+p.c1)/2-p.c0+2));RBP(X,y,Z,WBARK);RBP(X,y+1,Z,WBARK);}}
  const cy=(p.c0+p.c1)/2,ch=(p.c1-p.c0)/2,hd=d/(p.cr*(1+0.12*Math.sin(a*5+p.ph)));if(hd<1){const e=ch*Math.sqrt(1-hd*hd),th=3/ch;
    for(let y=Math.round(cy-e);y<=Math.round(cy+e);y++){const q=Math.hypot(hd,(y-cy)/ch);if(q>1-th-(hsh(X,y*13,Z)<0.2?0.08:0))RBP(X,y,Z,WLEAF);}}
};
// A bridge from platform to platform at p.y: planks a block either side of its line, a carved edge and a woven rail beside them,
// lamps on the rail at its middle; the way above it cleared (so it opens a door where it meets a house)
RB.wbridge=(s,p,u,v,X,Z)=>{const ux=p.ub-p.ua,vx=p.vb-p.va,L=Math.hypot(ux,vx)||1,t=((u-p.ua)*ux+(v-p.va)*vx)/L,off=Math.abs(-(u-p.ua)*vx+(v-p.va)*ux)/L;
  if(t<p.ia||t>L-p.ib||off>1.9)return;if(off<=1.1){RBP(X,p.y,Z,WPLANK);RBS(X,Z,p.y+1,p.y+3,AIR);return;}
  if(t>=p.ra-0.5&&t<=L-p.rb+0.5){RBP(X,p.y,Z,WCARVE);RBP(X,p.y+1,Z,Math.abs(t-L/2)<0.8?WLAMP:WRAIL);}};
// The ground of a city or village: its paths (L.paths: segments of leaf litter with a mossy edge) with carved posts bearing lamps
// along them; flowers and ferns elsewhere, left as the forest grows them
RB.wground=(s,p,u,v,X,Z)=>{const d=Math.hypot(u,v);if(d>s.R+2)return;let best=9,along=0;
  for(const q of p.paths){const ux=q[2]-q[0],vx=q[3]-q[1],L=Math.hypot(ux,vx)||1,t=Math.max(0,Math.min(L,((u-q[0])*ux+(v-q[1])*vx)/L)),pu=q[0]+ux*t/L,pv=q[1]+vx*t/L,o=Math.hypot(u-pu,v-pv)-q[4];
    if(o<best){best=o;along=t;}}
  if(best>1.6)return;const g=hAt(X,Z);
  if(best<=0){RBP(X,g,Z,hsh(X,9741,Z)<0.25?FMOSS:LITTER);RBS(X,Z,g+1,g+4,AIR);return;}
  if(best<=1){RBP(X,g,Z,FMOSS);if(Math.round(along)%10===5&&hsh(Math.round(along),9743,Math.round(u+v))<0.6){RBS(X,Z,g+1,g+2,WCARVE);RBP(X,g+3,Z,WLAMP);}}};
// The hedge round a city (p.r its outer edge): two thick and three high, clipped flat, a gap for the gate at u = -R
RB.whedge=(s,p,u,v,X,Z)=>{const d=Math.hypot(u,v);if(d<p.r-1.8||d>p.r||(u<0&&Math.abs(v)<=3))return;const g=hAt(X,Z);RBS(X,Z,g+1,g+3,WHEDGE);RBP(X,g+4,Z,AIR);};
// The gate: two carved posts with lamps either side of the way, a carved beam over it hung with the banner of the wood
RB.wgate=(s,p,u,v,X,Z)=>{const av=Math.abs(v),g=hAt(X,Z),gy=p.y;if(av===3){RBS(X,Z,g+1,gy+6,WCARVE);RBP(X,gy+7,Z,WLAMP);return;}
  if(av<3){RBP(X,gy+6,Z,WCARVE);if(av===0)RBP(X,gy+5,Z,WBANNER);}};
// A spring: a round pool held in rootstone on its pad, a lamp on a rootstone post in its middle
RB.wpool=(s,p,u,v,X,Z)=>{const d=Math.hypot(u-p.cu,v-p.cv),y=p.y;if(d>p.rp+1)return;
  if(d<0.8){RBS(X,Z,y-2,y+1,WROOT);RBP(X,y+2,Z,WLAMP);return;}
  if(d<p.rp){RBP(X,y-2,Z,WROOT);RBP(X,y-1,Z,WATER);RBP(X,y,Z,WATER);RBS(X,Z,y+1,y+3,AIR);return;}
  RBP(X,y,Z,WROOT);if(hsh(X,9745,Z)<0.25)RBP(X,y+1,Z,[FERN,BLUEB,FLOWY][(hsh(X,9747,Z)*3)|0]);};
// An archery range on its pad: a mossy lawn, a woven rail at the shooting line, three targets (hay on carved stands)
RB.wrange=(s,p,u,v,X,Z)=>{const y=p.y,[a,b]=[u-p.u0,v-p.v0];RBP(X,y,Z,b%5===2?FMOSS:GRASS);RBS(X,Z,y+1,y+4,AIR);
  if(a===1&&b%2===0)RBP(X,y+1,Z,WRAIL);
  if(a===p.u1-p.u0-1&&b%5===2){RBP(X,y+1,Z,WCARVE);RBP(X,y+2,Z,HAYBALE);RBP(X,y+3,Z,WCARVE);}};
// A glade for feasting: lamps on carved posts round its edge (p.rr), long tables of planks on carved trestles with benches of
// rails, a fire on rootstone in the middle, casks by the tables; the ground mossy
RB.wglade=(s,p,u,v,X,Z)=>{const du=u-p.cu,dv=v-p.cv,d=Math.hypot(du,dv);if(d>p.rr+0.6)return;const g=hAt(X,Z);
  if(d>p.rr-0.6){if(Math.round(Math.atan2(dv,du)/WTAU*p.nl*4)%4===0){RBS(X,Z,g+1,g+2,WCARVE);RBP(X,g+3,Z,WLAMP);}return;}
  RBP(X,g,Z,hsh(X,9749,Z)<0.4?FMOSS:GRASS);RBS(X,Z,g+1,g+4,AIR);
  if(d<1.2){RBP(X,g,Z,WROOT);RBP(X,g+1,Z,HEARTH);return;}if(d<2.2){RBP(X,g,Z,WROOT);return;}
  for(const t of p.tables){const a=du*Math.cos(t)+dv*Math.sin(t),b=-du*Math.sin(t)+dv*Math.cos(t);
    if(a>=p.ti&&a<=p.to){if(Math.abs(b)<0.5){RBP(X,g+1,Z,(Math.round(a)%3===0)?WCARVE:WPLANK);return;}if(Math.abs(Math.abs(b)-1.5)<0.5){RBP(X,g+1,Z,WRAIL);return;}}
    if(Math.abs(a-p.to-1.5)<0.6&&Math.abs(b)<1.6&&Math.abs(b)>0.5){RBP(X,g+1,Z,BARREL);return;}}};
// A small house of carved wood on the ground: round, its door toward the glade, windows, a cone of leaf thatch, a lamp inside
RB.whut=(s,p,u,v,X,Z)=>{const du=u-p.cu,dv=v-p.cv,d=Math.hypot(du,dv);if(d>p.rh+1)return;const y=p.y,a=Math.atan2(dv,du),ry=y+5+Math.round((p.rh+1-d)*0.7);
  if(d<=p.rh+1){RBP(X,ry,Z,WTHATCH);}
  if(d<p.rh+0.5){RBP(X,y,Z,WPLANK);for(let yy=y+1;yy<ry;yy++)RBP(X,yy,Z,AIR);for(let yy=hAt(X,Z)+1;yy<y;yy++)RBP(X,yy,Z,WROOT);}
  if(d>p.rh-0.5&&d<p.rh+0.5){const door=Math.abs(wAng(a,p.da))*d<1,win=Math.abs(Math.sin(a*3+1))<0.25;for(let yy=y+1;yy<=y+4;yy++)RBP(X,yy,Z,door&&yy<=y+3?AIR:win&&yy===y+2?AIR:yy===y+4?WPLANK:WCARVE);}
  if(d<0.8)RBP(X,y+1,Z,WLAMP);};
// ---- The king's halls: a hill raised over them (L.mound in realms.js), its face cut where the way arrives (u = m.face); the
// forecourt on its pad before it, crossed by a stream held in rootstone under a bridge; the gate a pointed arch of rootstone in
// the face between carved pillars, lamps either side, the banner over it, carved doors standing open; within, a great hall
// (p.hu0 to p.hu1, p.hw either side, its vault p.hh high) floored in rootstone on pillars like trees that branch into the vault,
// lamps on them; at its back a dais and the king's seat of carved wood crowned with branching antlers; to one side a cellar of
// casks, to the other a guardroom, each through a door in the hall's side
RB.whalls=(s,p,u,v,X,Z)=>{const T=s.T,av=Math.abs(v),g=hAt(X,Z),m=siteLayout(s).mound;
  // the stream across the forecourt, and the bridge over it
  if(u>=p.su0&&u<=p.su1&&av<=p.sw){if(av<=2){RBP(X,T,Z,WROOT);RBS(X,Z,T+1,T+4,AIR);if(av===2)RBP(X,T+1,Z,WRAIL);}else{RBP(X,T-3,Z,WROOT);RBP(X,T-2,Z,WATER);RBP(X,T-1,Z,WATER);RBS(X,Z,T,T+3,AIR);}
    if(av===p.sw)for(let y=T-3;y<=T;y++)RBP(X,y,Z,WROOT);return;}
  if(u>=p.su0-1&&u<=p.su1+1&&av<=p.sw&&(u===p.su0-1||u===p.su1+1)){for(let y=T-3;y<=T;y++)RBP(X,y,Z,WROOT);return;}
  // the forecourt: a path of rootstone to the gate, moss either side, lamps on posts along it
  if(u<m.face&&u>=-s.R){if(av<=2)RBP(X,T,Z,WROOT);else if(av<=8)RBP(X,T,Z,FMOSS);if(av<=8)RBS(X,Z,T+1,T+5,AIR);if(av===4&&(((u-m.face)%5)+5)%5===2){RBS(X,Z,T+1,T+2,WCARVE);RBP(X,T+3,Z,WLAMP);}return;}
  // the face and the gate: rootstone carved about a pointed arch, pillars either side, the doors open, lamps and the banner
  const gw=3,gh=7,ah=y=>{const k=y-T-4;return k<=0?gw:Math.max(0,gw-Math.round(k*k*0.35));};
  if(u>=m.face&&u<m.face+3){const gate=av<=gw;
    for(let y=T;y<=T+12;y++){const open=gate&&y>T&&y<=T+gh&&av<=ah(y);if(open){RBP(X,y,Z,AIR);continue;}
      if(u===m.face&&av<=gw+3)RBP(X,y,Z,(av===gw+1||av===gw+2)&&y<=T+10?WCARVE:y===T+11&&av<=gw+2?WCARVE:WROOT);
      else if(av<=gw+3&&y<=T+9)RBP(X,y,Z,WROOT);}
    if(u===m.face&&av===gw+2){RBP(X,T+11,Z,WLAMP);}if(u===m.face&&av===0)RBP(X,T+10,Z,WBANNER);
    if(u===m.face+2&&av===gw&&g>T)RBS(X,Z,T+1,T+gh-2,WCARVE); // the doors, folded back
    if(gate)RBP(X,T,Z,WROOT);return;}
  // within: the passage from the gate, the great hall and its vault
  const inHall=u>=p.hu0&&u<=p.hu1&&av<=p.hw,vault=y=>T+p.hh-Math.round((av/p.hw)*(av/p.hw)*3);
  if(u>=m.face+3&&u<p.hu0&&av<=gw+1){RBP(X,T,Z,WROOT);RBS(X,Z,T+1,T+gh,av<=gw?AIR:WROOT);RBP(X,T+gh+1,Z,WROOT);return;}
  if((u===p.hu0-1||u===p.hu1+1)&&av<=p.hw+1){RBS(X,Z,T,vault(Math.min(av,p.hw))+1,WROOT);return;} // the hall's end walls
  if(av===p.hw+1&&u>=p.hu0&&u<=p.hu1){const door=u>=p.du-1&&u<=p.du+1;RBP(X,T,Z,WROOT);RBS(X,Z,T+1,vault(p.hw)+1,WROOT);if(door)RBS(X,Z,T+1,T+3,AIR);return;} // its side walls, doors through them
  if(inHall){const top=vault(0),vt=vault(av);RBP(X,T-1,Z,WROOT);RBP(X,T,Z,(u+av)%4===0?WCARVE:WROOT);RBS(X,Z,T+1,vt,AIR);RBP(X,vt+1,Z,WROOT);
    // the pillars: trunks of carved wood two square, branching into the vault in boughs of bark, a lamp on each
    for(const [pu,pv] of p.pil){const dd=Math.max(Math.abs(u-pu),Math.abs(av-pv));
      if(dd===0){RBS(X,Z,T+1,vt,WCARVE);}
      else if(dd===1&&((u-pu)===0||(av-pv)===0)){RBP(X,T+1,Z,WCARVE);RBP(X,vt,Z,WBARK);RBP(X,vt-1,Z,WBARK);if(u-pu===-1&&av===pv)RBP(X,T+4,Z,WLAMP);}
      else if(dd===2&&((u-pu)===0||(av-pv)===0))RBP(X,vt,Z,WBARK);}
    // the dais and the king's seat with its antlers
    if(u>=p.hu1-4){RBP(X,T+1,Z,WROOT);if(u>=p.hu1-2)RBP(X,T+2,Z,WROOT);
      if(u===p.hu1&&av<=1){RBS(X,Z,T+3,T+5,WCARVE);}
      if(u===p.hu1-1&&av===0){RBP(X,T+3,Z,WPLANK);}
      if(u===p.hu1-1&&av===1)RBP(X,T+3,Z,WCARVE);
      if(u===p.hu1&&av>=1&&av<=4){const tine=av===2?T+7:av===3?T+8:av===4?T+9:T+6;RBS(X,Z,T+6,tine,WPLANK);if(av===3)RBP(X,T+10,Z,WPLANK);}
      if(u===p.hu1-3&&av===3){RBP(X,T+2,Z,WLAMP);}}
    if(av===p.hw&&u===p.du+3)RBP(X,T+3,Z,WLAMP);
    return;}
  // the cellar (v < 0) and the guardroom (v > 0): low rooms through the doors, casks along the cellar's walls, lamps
  if(u>=p.du-4&&u<=p.du+4&&av>p.hw+1&&av<=p.hw+8){const side=v<0,wall=av===p.hw+8||u===p.du-4||u===p.du+4;RBP(X,T,Z,WROOT);
    if(wall){RBS(X,Z,T+1,T+5,WROOT);return;}RBS(X,Z,T+1,T+4,AIR);RBP(X,T+5,Z,WROOT);
    if(side&&(av===p.hw+7||((u===p.du-3||u===p.du+3)&&av>p.hw+3))){RBP(X,T+1,Z,BARREL);if(av===p.hw+7&&u%2===0)RBP(X,T+2,Z,BARREL);}
    if(!side&&av===p.hw+7&&Math.abs(u-p.du)<=2&&u%2===0)RBP(X,T+1,Z,WCARVE);
    if(u===p.du&&av===p.hw+4)RBP(X,T+4,Z,WLAMP);}
};
// ---- Layouts
function woodLayout(s,L,r){if(s.k==='city')woodCity(s,L,r);else if(s.k==='fort')woodHalls(s,L,r);else if(s.k==='village')woodVillage(s,L,r);else if(s.k==='farm')woodGlade(s,L,r);else woodWatch(s,L,r);}
// the kit: goldboughs and bridges between them, the ground's paths, pads, spots
function woodKit(s,L,r){
  const P=L.parts,trees=[],R=s.R;L.paths=[];
  // a goldbough at (cu, cv): trunk tr across its middle, its platforms at the levels given (above the site's level T) where they
  // stand six or more over its foot; its stair begins toward the site's way
  const tree=(cu,cv,tr,lv,o)=>{o=o||{};const base=wvRaw(s,cu,cv),fl=[];
    for(const q of lv){const y=s.T+q.y;if(y<base+6)continue;fl.push({y:y,r:tr+(q.house?(q.hall?9:6):4),house:!!q.house,hall:!!q.hall});}
    if(!fl.length)return null;const sy1=Math.max(...fl.map(f=>f.y)),cr=o.cr||Math.round(tr*3+4),c0=sy1+(fl.some(f=>f.y===sy1&&f.hall)?14:fl.some(f=>f.y===sy1&&f.house)?10:5),c1=Math.max(c0+Math.round(cr*0.9),base+(o.H||0));
    const a0=Math.atan2(-cv,-cu-R*0.3),ext=Math.ceil(Math.max(cr*1.15,...fl.map(f=>f.r+1),tr+3.2))+1,bough=[];for(let k=0;k<5;k++)bough.push(r()*WTAU);
    const p={k:'wtree',u0:cu-ext,u1:cu+ext,v0:cv-ext,v1:cv+ext,cu:cu,cv:cv,tr:tr,base:base,fl:fl,sy1:sy1,P:Math.max(10,Math.round(WTAU*(tr+1.5)*0.62)),a0:a0,
      cr:cr,c0:c0,c1:c1,ext:ext,nr:5+(r()*3|0),ph:r()*WTAU,bough:bough,keep:Math.max(...fl.map(f=>f.r))+2};P.push(p);trees.push(p);return p;};
  const far=(cu,cv,m)=>trees.every(t=>Math.hypot(t.cu-cu,t.cv-cv)>=m);
  // bridges: each tree to its nearest neighbours that share a level, rim to rim
  const bridges=(maxD,per)=>{const n=new Map();for(const a of trees)for(const b of trees){if(a===b||(n.get(a)||0)>=per||(n.get(b)||0)>=per)continue;if(trees.indexOf(b)<trees.indexOf(a))continue;
    const D=Math.hypot(a.cu-b.cu,a.cv-b.cv);if(D>maxD)continue;const lv=a.fl.find(f=>b.fl.some(g=>g.y===f.y));if(!lv)continue;const fb=b.fl.find(g=>g.y===lv.y);if(D<lv.r+fb.r+3)continue;
    P.push({k:'wbridge',u0:Math.min(a.cu,b.cu)-2,u1:Math.max(a.cu,b.cu)+2,v0:Math.min(a.cv,b.cv)-2,v1:Math.max(a.cv,b.cv)+2,ua:a.cu,va:a.cv,ub:b.cu,vb:b.cv,y:lv.y,ra:lv.r,rb:fb.r,ia:lv.r-(lv.house?2.2:1.2),ib:fb.r-(fb.house?2.2:1.2)});
    n.set(a,(n.get(a)||0)+1);n.set(b,(n.get(b)||0)+1);}};
  const path=(u0,v0,u1,v1,w)=>L.paths.push([u0,v0,u1,v1,w||1]);
  // a path to each tree's stair from the nearest point of the main way (v = 0, from the gate to uEnd)
  const toStairs=(uEnd)=>{for(const t of trees){const sx=t.cu+Math.cos(t.a0)*(t.tr+1.5),sz=t.cv+Math.sin(t.a0)*(t.tr+1.5);path(Math.max(-R,Math.min(uEnd,Math.round(sx))),0,Math.round(sx),Math.round(sz),0.6);}};
  const ground=()=>{P.unshift({k:'wground',u0:-R-2,u1:R+2,v0:-R-2,v1:R+2,paths:L.paths});};
  const pad=(u0,u1,v0,v1,y)=>L.pads.push({u0:u0,u1:u1,v0:v0,v1:v1,y:y});
  const spot=(kind,u,v,y,o)=>L.spots.push(Object.assign({kind:kind,u:u,v:v,y:y},o||{}));
  // the forest keeps off the paths, the hedge, the goldboughs out to their platforms' rims and the bridges (woodBusy)
  const seg=(u,v,q)=>{const ux=q[2]-q[0],vx=q[3]-q[1],l=Math.hypot(ux,vx)||1,t=Math.max(0,Math.min(l,((u-q[0])*ux+(v-q[1])*vx)/l));return Math.hypot(u-q[0]-ux*t/l,v-q[1]-vx*t/l);};
  L.busy=(u,v,m)=>{if(L.hedge&&Math.abs(Math.hypot(u,v)-L.hedge+1)<2+m)return true;for(const q of L.paths)if(seg(u,v,q)<q[4]+2+m)return true;
    for(const t of trees)if(Math.hypot(u-t.cu,v-t.cv)<t.keep+m)return true;for(const b of P)if(b.k==='wbridge'&&seg(u,v,[b.ua,b.va,b.ub,b.vb])<3+m)return true;return false;};
  return {P:P,R:R,trees:trees,tree:tree,far:far,bridges:bridges,path:path,toStairs:toStairs,ground:ground,pad:pad,spot:spot};}
// The city in the trees: a clipped hedge round it with its gate between two goldboughs joined by a bridge over the way; the
// king's tree at the back, greatest of all, with an open platform, a house and his hall high in it; goldboughs about the city
// on a loose grid, their platforms at three heights, bridges between them; a spring and an archery range by the way
function woodCity(s,L,r){const K=woodKit(s,L,r),R=s.R,big=s.prov.capital;L.hedge=R;
  K.P.push({k:'whedge',u0:-R,u1:R,v0:-R,v1:R,r:R});
  // the gate trees and their bridge over the way
  const g1=K.tree(-R+3,-6,2,[{y:14}],{cr:8}),g2=K.tree(-R+3,6,2,[{y:14}],{cr:8});
  if(g1&&g2&&g1.fl[0].y===g2.fl[0].y)K.P.push({k:'wbridge',u0:-R,u1:-R+6,v0:-8,v1:8,ua:-R+3,va:-6,ub:-R+3,vb:6,y:g1.fl[0].y,ra:g1.fl[0].r,rb:g2.fl[0].r,ia:g1.fl[0].r-1.2,ib:g2.fl[0].r-1.2,clear:1});
  K.P.push({k:'wgate',u0:-R-1,u1:-R+1,v0:-3,v1:3,y:wvRaw(s,-R,0)});
  // the king's tree
  const ku=Math.round(R*0.45),king=K.tree(ku,0,big?4:3,[{y:18},{y:30,house:1},{y:44,house:1,hall:1}],{cr:big?17:14,H:big?78:66});
  // goldboughs on a loose grid, off the way and clear of each other
  const sp=21,n0=Math.ceil(R/sp);for(let a=-n0;a<=n0;a++)for(let b=-n0;b<=n0;b++){const cu=a*sp+Math.round((r()-0.5)*6),cv=b*sp+Math.round((r()-0.5)*6),tr=r()<0.3?3:2;
    if(Math.hypot(cu,cv)>R-12||(Math.abs(cv)<9&&cu<ku+6)||!K.far(cu,cv,19))continue;
    const lv=[{y:16},{y:26,house:r()<0.55},{y:36,house:r()<0.4}].filter(()=>r()<0.8);if(!lv.length)lv.push({y:26,house:1});K.tree(cu,cv,tr,lv);}
  K.bridges(30,3);
  // the way from the gate to the king's tree, paths to every stair; the spring and the range beside the way
  K.path(-R-2,0,ku-6,0,1.5);K.toStairs(ku-6);
  const pu=Math.round(-R*0.4),pv=10;if(K.far(pu,pv,9)){K.P.push({k:'wpool',u0:pu-5,u1:pu+5,v0:pv-5,v1:pv+5,cu:pu,cv:pv,rp:3,y:s.T,clear:1});K.pad(pu-5,pu+5,pv-5,pv+5,s.T);K.path(pu,1,pu,pv-4,0.6);K.spot('garden',pu,pv-6,s.T);}
  const ru=Math.round(-R*0.4),rv=-14;if(K.far(ru+5,rv-3,10)){K.P.push({k:'wrange',u0:ru,u1:ru+12,v0:rv-8,v1:rv,y:s.T,clear:1});K.pad(ru,ru+12,rv-8,rv,s.T);K.spot('range',ru+2,rv-4,s.T);}
  K.ground();
  // where the folk are: the gate, its bridge, the way, the platforms, the king's hall
  K.spot('gate',-R+2,0,wvRaw(s,-R+2,0));if(g1)K.spot('deck',-R+3,0,g1.fl[0].y,{R:2});K.spot('street',Math.round(-R*0.15),0,wvRaw(s,Math.round(-R*0.15),0));
  if(king){const h=king.fl[king.fl.length-1];K.spot('hall',ku+Math.round(Math.cos(king.a0)*(king.tr+3)),Math.round(Math.sin(king.a0)*(king.tr+3)),h.y,{R:2});K.spot('deck',ku+Math.round(Math.cos(king.a0)*(king.tr+3)),Math.round(Math.sin(king.a0)*(king.tr+3)),king.fl[0].y,{R:2});}
  for(const t of K.trees.filter(t=>t!==king&&t!==g1&&t!==g2).slice(0,big?4:3)){const f=t.fl[0];K.spot('deck',t.cu+Math.round(Math.cos(t.a0+1)*(t.tr+2.5)),t.cv+Math.round(Math.sin(t.a0+1)*(t.tr+2.5)),f.y,{R:1.5});}
}
// The king's halls under the hill: the hill's face toward the way, the forecourt with its stream and bridge, the gate, the hall,
// the cellar and the guardroom; goldboughs on the hill's shoulders
function woodHalls(s,L,r){const K=woodKit(s,L,r),R=s.R,face=-Math.round(R*0.45);
  L.mound={cu:2,cv:0,R:R,H:Math.min(20,Math.round(R*0.75)),face:face,gw:7};
  K.pad(-R-2,face-1,-9,9,s.T);
  const hu0=face+7,hu1=Math.min(Math.round(R*0.6),face+30),pil=[];for(let u=hu0+3;u<=hu1-6;u+=5)pil.push([u,5]);
  K.P.push({k:'whalls',u0:-R-2,u1:hu1+2,v0:-19,v1:19,su0:face-11,su1:face-9,sw:7,hu0:hu0,hu1:hu1,hw:9,hh:9,pil:pil,du:Math.round((hu0+hu1)/2),clear:0});
  // keep the forest off the forecourt
  K.P.push({k:'wnone',u0:-R-2,u1:face+2,v0:-10,v1:10,clear:1});
  K.tree(Math.round(R*0.3),-Math.round(R*0.7),2,[{y:L.mound.H+10}],{cr:9});K.tree(Math.round(R*0.3),Math.round(R*0.7),2,[{y:L.mound.H+10}],{cr:9});
  K.spot('gate',face-4,0,s.T);K.spot('keep',Math.round((hu0+hu1)/2),0,s.T,{R:3});K.spot('cellar',Math.round((hu0+hu1)/2),-(9+5),s.T,{R:2});
}
RB.wnone=()=>{};
// A tree-village: goldboughs in a ring round a feasting glade, platforms at two heights with houses on the higher, bridges
// between neighbours; a house or two of carved wood on the ground by the glade
function woodVillage(s,L,r){const K=woodKit(s,L,r),R=s.R,n=4+(r()*2|0),gr=Math.round(R*0.32),a0=r()*WTAU;
  for(let k=0;k<n;k++){const a=a0+k*WTAU/n+(r()-0.5)*0.2,d=R*0.78+(r()-0.5)*3;K.tree(Math.round(Math.cos(a)*d),Math.round(Math.sin(a)*d),2,[{y:13},{y:22,house:1}],{cr:9});}
  K.bridges(R*1.2,2);
  K.P.push({k:'wglade',u0:-gr-1,u1:gr+1,v0:-gr-1,v1:gr+1,cu:0,cv:0,rr:gr,nl:6,tables:[0.4,0.4+Math.PI],ti:3,to:gr-3,clear:1});
  for(const [hu,hv] of [[Math.round(-gr-6),Math.round(gr*0.6)],[Math.round(gr*0.3),-gr-6]])if(K.far(hu,hv,8)){const y=wvRaw(s,hu,hv);K.P.push({k:'whut',u0:hu-4,u1:hu+4,v0:hv-4,v1:hv+4,cu:hu,cv:hv,rh:3,y:y+1,da:Math.atan2(-hv,-hu),clear:1});}
  K.path(-R,0,-gr,0,1);K.toStairs(-gr);K.ground();
  K.spot('glade',0,2,wvRaw(s,0,2),{R:3});for(const t of K.trees.slice(0,2)){const f=t.fl[t.fl.length-1];K.spot('deck',t.cu+Math.round(Math.cos(t.a0+1)*(t.tr+2.5)),t.cv+Math.round(Math.sin(t.a0+1)*(t.tr+2.5)),f.y,{R:1.5});}
}
// A watch-tree: one goldbough with a platform low and a watch platform high, its stair, a lamp
function woodWatch(s,L,r){const K=woodKit(s,L,r),t=K.tree(0,0,2,[{y:14},{y:28}],{cr:9,H:42});K.path(-s.R-6,0,0,0,0.6);K.ground();
  if(t){const f=t.fl[t.fl.length-1];K.spot('post',Math.round(Math.cos(t.a0+1)*(t.tr+2.5)),Math.round(Math.sin(t.a0+1)*(t.tr+2.5)),f.y,{R:1.5});}}
// A glade: lamps round a clearing, long tables with benches and casks, a fire; a house of carved wood at its edge, a goldbough
function woodGlade(s,L,r){const K=woodKit(s,L,r),R=s.R,gr=R-3;
  K.P.push({k:'wglade',u0:-gr-1,u1:gr+1,v0:-gr-1,v1:gr+1,cu:0,cv:0,rr:gr,nl:9,tables:[0.3,0.3+2.094,0.3+4.189],ti:3,to:gr-3,clear:1});
  const hu=Math.round(gr*0.2),hv=gr+5;K.P.push({k:'whut',u0:hu-4,u1:hu+4,v0:hv-4,v1:hv+4,cu:hu,cv:hv,rh:3,y:wvRaw(s,hu,hv)+1,da:Math.atan2(-hv,-hu),clear:1});
  K.path(-R-4,0,-gr,0,1);K.ground();K.spot('glade',0,2,wvRaw(s,0,2),{R:3});}
// ---- The wood elves' roads: the lamplit way of leaf litter edged in moss, a lamp on a carved post beside it every 32 blocks;
// woodland paths of litter; bridges of planks with woven rails on posts of bark
function woodRoadCol(X,Z,x,z,rr){
  const o=colInfo(X,Z,TRB),g=o.h,rd=rr.rd,hi=rd.k==='high',ao=Math.abs(rr.off),wet=o.wet||o.river||o.lake||o.b===0||g<o.sl+1;
  if(ao>rd.w+0.5){if(hi&&!wet&&ao<=rd.w+1.5&&rr.off>0&&Math.floor(rr.along)%32===16){RBS(X,Z,g+1,g+2,WCARVE);RBP(X,g+3,Z,WLAMP);}return;}
  if(wet){const y=Math.max(o.sl,o.lake||0)+2,edge=ao>rd.w-0.5;RBP(X,y,Z,edge?WCARVE:WPLANK);if(edge)RBP(X,y+1,Z,WRAIL);RBS(X,Z,y+(edge?2:1),y+3,AIR);
    if(Math.floor(rr.along)%6===0)for(let yy=y-1;yy>=Math.max(1,g-1);yy--)RBP(X,yy,Z,WBARK);return;}
  const top=world[I(x,g,z)];if(top===AIR||top===WATER)return;
  RBP(X,g,Z,hi&&ao>rd.w-0.5?FMOSS:hsh(X,9751,Z)<0.2?FMOSS:LITTER);
  for(let y=g+1;y<=g+3;y++){const id=world[I(x,y,z)];if(id&&!SOLID[id])RBP(X,y,Z,AIR);else if(SOLID[id]&&y===g+1)RBP(X,y,Z,AIR);}
}
