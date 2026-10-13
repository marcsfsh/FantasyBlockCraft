// ---- The white realm enlarged (D-089): what the cities and villages of the high men gain, and three new places of theirs.
//
// In every city the great hall holds the throne of the realm on a dais under the tapestry of the realm, shields and banners
// about it, a black runner to it from the door, and the kings of old in stone along its walls (mthrone); in the royal city the
// silver tree stands in the citadel's court in a ring of white stone where the king's statue stood elsewhere (mtree). A house
// of healing (beds along its walls, heartsease in planters down its middle) stands by the gate; one house on the avenue is
// the inn (tables, a counter and casks, beds upstairs) under its sign; a notice board stands in the square. Villages gain a
// maypole and a notice board on the green, their inn's furnishings and sign, the smith's sign, and a churchyard behind the
// chapel. The new places (MEN_LAYOUT, from siteLayout):
//   the lists by a city: a sanded field fenced about with the tilt barrier down its middle, stands of planks under striped
//     awnings on either side (the royal box in the far one), the knights' pavilions at either end, a gate of posts and banners
//   the hallows of a royal province: a walled close of yews and graves, the silent street paved between lamps, tombs of white
//     stone with little domes either side of it, an effigy in each, and at its end the house of the kings under its dome, the
//     kings lying in two rows and the lectern of their chronicle between them
//   a port where a province meets the sea (port-build in this file, below)
const partAt=(p,a,b)=>p.f===0?[p.u0+b,p.v0+a]:p.f===1?[p.u1-b,p.v1-a]:p.f===2?[p.u1-a,p.v0+b]:[p.u0+a,p.v1-b];
const hMg=h=>h.mg||[h.ov||0,h.ov||0,h.ov||0,h.ov||0];
// the furnishings of a house (kind: heal, inn), as a part over its box laid after it
function menInside(h,kind){return {k:'minside',u0:h.u0,u1:h.u1,v0:h.v0,v1:h.v1,f:h.f,W:h.W,D:h.D,mg:hMg(h),porch:h.porch||0,y:h.y,st:h.st,sh:h.sh||4,door:h.door,kind:kind};}
// a hanging sign beside a house's door, over head height, one out from its front
function menSign(h,id){const mg=hMg(h),[u,v]=partAt(h,mg[0]+Math.max(0,h.door-(h.dw||1)-1),mg[2]+(h.porch||0)-1);return {k:'msign',u0:u,u1:u,v0:v,v1:v,y:h.y+3,id:id};}
RB.msign=(s,p,u,v,X,Z)=>{RBP(X,p.y,Z,p.id);};
RB.minside=(s,p,u,v,X,Z)=>{const [a,b]=partAB(p,u,v),ca=a-p.mg[0],cb=b-p.mg[2]-p.porch,W=p.W,D=p.D,g=p.y;if(ca<1||ca>W-2||cb<1||cb>D-2||(ca===1&&cb===D-2))return;
  const nearDoor=cb<=2&&Math.abs(ca-p.door)<=2;
  if(p.kind==='heal'){ // beds of white wool along the long walls, heartsease in carved planters down the middle; beds above too
    if((cb===D-2||cb===1&&!nearDoor)&&ca%2===0)RBP(X,g+1,Z,WOOLW);
    else if(cb===(D>>1)&&ca%3===0&&ca>1&&ca<W-2){RBP(X,g+1,Z,WSCARVE);RBP(X,g+2,Z,HEARTSEASE);}
    if(p.st>1&&(cb===D-2||cb===1)&&ca%2===0)RBP(X,g+1+p.sh,Z,WOOLW);return;}
  if(p.kind==='inn'){ // a counter across the back with casks behind it, tables down the room, the hearth by a side wall; beds upstairs
    if(cb===D-3&&ca>=2&&ca<=W-3)RBP(X,g+1,Z,PLANKS);
    else if(cb===D-2&&ca%2===0)RBP(X,g+1,Z,BARREL);
    else if(ca===W-2&&cb===(D>>1)-1){RBP(X,g,Z,HEARTH);}
    else if(cb>=2&&cb<=D-5&&ca%3===2&&cb%3===2&&!nearDoor)RBP(X,g+1,Z,PLANKS);
    for(let k=1;k<p.st;k++)if((cb===D-2||cb===1)&&ca%2===0&&ca<W-2)RBP(X,g+1+k*p.sh,Z,WOOLR);}};
// the throne of the realm at the back of a great hall (hf its front wall, hb its back wall, hw its half-width): a carved dais five
// wide and three deep, the throne on it with its high back, the tapestry of the realm hung over it, shields and banners either
// side, lamps on posts at the dais's corners, a black runner to it from the door; the kings of old in stone along the walls,
// crowned, a shoulder either side, between the windows
RB.mthrone=(s,p,u,v,X,Z)=>{const g=p.y,av=Math.abs(v),hb=p.hb,cb=u-p.hf,D=hb-p.hf+1;
  if(v===0&&u<hb-3)RBP(X,g,Z,WOOLK);
  if(u>=hb-3&&u<=hb-1&&av<=2){RBP(X,g+1,Z,u===hb-3||av===2?WSTRIM:WSCARVE);if(v===0&&u===hb-2)RBP(X,g+2,Z,RTHRONE);if(v===0&&u===hb-1)RBS(X,Z,g+2,g+3,RTHRONE);}
  if(u===hb-1&&v===0)RBS(X,Z,g+4,g+6,RTAP);
  if(u===hb-1&&av===2)RBP(X,g+5,Z,WSHIELD);
  if(u===hb-1&&av===4)RBS(X,Z,g+3,g+6,RBANNER);
  if(u===hb-3&&av===3){RBP(X,g+1,Z,WSPILLAR);RBP(X,g+2,Z,LANTERN);}
  if(av===p.hw-1&&cb>=4&&cb<=D-6){const q=cb%4;if(q===0){RBP(X,g+1,Z,WSROUGH);RBS(X,Z,g+2,g+4,WSTONE);RBP(X,g+5,Z,WSCARVE);RBP(X,g+6,Z,WSTONE);RBP(X,g+7,Z,GOLDB);}
    else if(q===1||q===3)RBP(X,g+5,Z,WSTONE);}};
// the silver tree in the royal citadel's court: a lawn in a ring of white stone (a gap toward the gate), white flowers in it, the
// trunk of silver bark, its boughs and a crown of silver leaves (p.rc across)
RB.mtree=(s,p,u,v,X,Z)=>{const du=u-p.cu,dv=v-p.cv,m=Math.max(Math.abs(du),Math.abs(dv)),d=Math.hypot(du,dv),g=p.y,rc=p.rc;
  if(m===3){RBP(X,g,Z,PAVING);if(!(du===-3&&dv===0))RBP(X,g+1,Z,WSTRIM);}else if(m<3){RBP(X,g,Z,GRASS);if(m>=1&&hsh(X,9871,Z)<0.35)RBP(X,g+1,Z,OXEYE);}
  if(m===0)RBS(X,Z,g+1,g+7,SILVBARK);else if(m===1&&(du===0||dv===0))RBP(X,g+6,Z,SILVBARK);
  for(let y=g+6;y<=g+12;y++){const e=Math.hypot(du,dv,(y-g-8.5)*1.3);if(e<=rc&&!(m===0&&y<=g+7)&&!(m===1&&(du===0||dv===0)&&y===g+6)&&hsh(X*7+y,9873,Z)>0.08)RBP(X,y,Z,SILVLEAF);}};
// a notice board on a post under a little roof
RB.mnotice=(s,p,u,v,X,Z)=>{const g=p.y;RBS(X,Z,g+1,g+2,NOTICE);RBP(X,g+3,Z,SLATE);};
// the maypole on a village green, wound with ribbons, a garland about its head
RB.mpole=(s,p,u,v,X,Z)=>{const du=u-p.cu,dv=v-p.cv,m=Math.max(Math.abs(du),Math.abs(dv)),g=p.y;if(m===0){RBS(X,Z,g+1,g+8,MAYPOLE);RBP(X,g+9,Z,WOOLW);}else if(m===1&&(du===0||dv===0))RBP(X,g+8,Z,BLOSSOM);};
// a churchyard behind a chapel, on the ground as it lies: a low wall of cobble with a gap toward the chapel, grass, headstones in
// rows, a yew in its far corner
RB.mgraves=(s,p,u,v,X,Z)=>{if(realmRoadAt(X,Z,1))return;const o=colInfo(X,Z,TRB);if(o.wet||o.river||o.lake||o.b===0||o.h<o.sl+2)return;const g=o.h;
  const [a,b,W,D]=partAB(p,u,v),edge=a===0||b===0||a===W-1||b===D-1;RBP(X,g,Z,GRASS);RBS(X,Z,g+1,g+3,AIR);
  if(edge){if(!(b===0&&Math.abs(a-(W>>1))<=0))RBP(X,g+1,Z,COBBLE);return;}
  if(a===W-2&&b===D-2){RBS(X,Z,g+1,g+2,YEW);RBS(X,Z,g+3,g+5,YEWL);return;}
  if(a%2===1&&b%3===2&&!(a===W-2&&b>=D-3))RBP(X,g+1,Z,HEADSTONE);else if(hsh(X,9875,Z)<0.12)RBP(X,g+1,Z,OXEYE);};
// ---- The lists (p.y the ground): the field from -11 to 11 across u and -21 to 21 along v, sanded, gravel on the way in from
// the gate; grass about it, a few flowers
RB.mlground=(s,p,u,v,X,Z)=>{const g=p.y,au=Math.abs(u),av=Math.abs(v);if(Math.max(au,av)>s.R-1)return;
  RBP(X,g,Z,au<=10&&av<=20?(hsh(X,9877,Z)<0.25?GRAVEL:SAND):u<-10&&av<=2?GRAVEL:GRASS);RBS(X,Z,g+1,g+4,AIR);
  if(!(au<=12&&av<=22)&&hsh(X,9879,Z)<0.04)RBP(X,g+1,Z,[FLOWR,FLOWY,OXEYE][(hsh(X,9881,Z)*3)|0]);};
// the tilt barrier down the field's middle, its ends capped
RB.mtilt=(s,p,u,v,X,Z)=>{const g=p.y;RBP(X,g+1,Z,TILTRAIL);if(v===p.v0||v===p.v1)RBP(X,g+2,Z,WSPILLAR);};
// the fence about the field, gaps at the way in and at either end for the knights
RB.mfence=(s,p,u,v,X,Z)=>{const g=p.y,onU=u===p.u0||u===p.u1,onV=v===p.v0||v===p.v1;if(!onU&&!onV)return;
  if(u===p.u0&&Math.abs(v)<=2||onV&&Math.abs(u)<=2)return;RBP(X,g+1,Z,FENCE);if(onU&&onV){RBP(X,g+2,Z,WSPILLAR);RBP(X,g+3,Z,LANTERN);}};
// a stand of tiers, its front toward the field (f): planks a step higher each row back, posts and a striped awning over it,
// a back wall; p.royal a box in its middle (raised, a parapet before it, the throne, banners and a black and white awning)
RB.mstand=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,mid=(W-1)/2,roy=p.royal&&Math.abs(a-mid)<=3,top=g+9;
  if(b<D-1){const h=roy&&b>=2?g+4:g+1+b;RBS(X,Z,g+1,h,PLANKS);RBS(X,Z,h+1,top-1,AIR);
    if(roy&&b===1){RBS(X,Z,g+1,g+3,WSBRICK);RBP(X,g+4,Z,WSTRIM);}
    if(roy&&b===D-2&&a===Math.round(mid))RBP(X,g+5,Z,RTHRONE);
    if(b===0&&a%6===0)RBS(X,Z,g+2,top-1,LOG);}
  else RBS(X,Z,g+1,top-1,roy?WSBRICK:PLANKS);
  RBP(X,top,Z,roy?((a+b)%2?WOOLK:WOOLW):(a>>1)%2?WOOLW:p.cloth||WOOLR);
  if(roy&&b===D-1&&Math.abs(a-mid)===3)RBS(X,Z,top+1,top+2,RBANNER);};
// a knight's pavilion: a round tent of striped cloth (p.c, banded with white), its door toward the field, a cone of a roof, the
// pole through it with a pennant
RB.mpav=(s,p,u,v,X,Z)=>{const du=u-p.cu,dv=v-p.cv,d=Math.hypot(du,dv),g=p.y;if(d>3.2)return;
  const door=(p.cv>0?dv<0:dv>0)&&Math.abs(du)<=0.6&&d>2.2,band=((Math.round(Math.atan2(dv,du)/6.283*12)%2)+2)%2===0,cl=band?p.c:WOOLW;
  if(d>2.2){for(let y=g+1;y<=g+3;y++)RBP(X,y,Z,door?AIR:cl);}else RBS(X,Z,g+1,g+3,AIR);
  const ry=g+4+Math.round((3.2-d)*1.2);RBP(X,ry,Z,cl);if(d<0.5){RBS(X,Z,g+1,ry+2,LOG);RBP(X,ry+3,Z,p.c);}};
// the lists' gate: two posts carrying banners, a beam across
RB.mlgate=(s,p,u,v,X,Z)=>{const av=Math.abs(v),g=p.y;if(av===3){RBS(X,Z,g+1,g+5,LOG);RBP(X,g+6,Z,LANTERN);}else if(av<3&&u===p.u0)RBP(X,g+5,Z,LOG);if(av===2&&u===p.u0)RBS(X,Z,g+3,g+4,RBANNER);};
function listsLayout(s,L,r){const R=s.R,g=s.T,P=L.parts,cl=[WOOLR,WOOLB,WOOLY,WOOLG,PAVCLOTH,WOOLK];
  P.push({k:'mlground',u0:-R,u1:R,v0:-R,v1:R,f:0,y:g});
  P.push({k:'mtilt',u0:0,u1:0,v0:-16,v1:16,f:0,y:g});
  P.push({k:'mfence',u0:-11,u1:11,v0:-21,v1:21,f:0,y:g});
  P.push({k:'mstand',u0:14,u1:19,v0:-17,v1:17,f:0,y:g,royal:1,cloth:WOOLR});
  for(const sg of [1,-1])P.push({k:'mstand',u0:-19,u1:-14,v0:sg>0?4:-17,v1:sg>0?17:-4,f:1,y:g,cloth:WOOLB});
  let n=0;for(const sg of [1,-1])for(const cu of [-7,0,7]){P.push({k:'mpav',u0:cu-3,u1:cu+3,v0:sg*25-3,v1:sg*25+3,cu:cu,cv:sg*25,y:g,c:cl[(n+Math.floor(r()*6))%6]});n++;}
  P.push({k:'mlgate',u0:-R,u1:-R+1,v0:-3,v1:3,f:0,y:g});
  L.tilt={v0:-16,v1:16,y:g};
  L.spots.push({kind:'stands',u:-16,v:10,y:g+2},{kind:'stands',u:-16,v:-10,y:g+2},{kind:'stands',u:16,v:10,y:g+3},{kind:'stands',u:16,v:-10,y:g+3},
    {kind:'royal',u:17,v:0,y:g+4},{kind:'pavil',u:0,v:21,y:g},{kind:'pavil',u:0,v:-21,y:g},{kind:'herald',u:-9,v:0,y:g},{kind:'lgate',u:-R-2,v:0,y:g});}
// ---- The hallows (p.y the ground): grass in the close, the silent street paved between kerbs, a few yews; graves in rows
// behind the tombs
RB.mhground=(s,p,u,v,X,Z)=>{const g=p.y,av=Math.abs(v);if(Math.max(Math.abs(u),av)>s.R-2)return;RBS(X,Z,g+1,g+5,AIR);
  if(av<=2&&u<s.R-17){RBP(X,g,Z,av===2?WSBRICK:PAVING);return;}RBP(X,g,Z,GRASS);
  if(av>=14&&av<=s.R-3&&u>-s.R+3&&u<s.R-19&&((u%3)+3)%3===0&&av%2===0){RBP(X,g+1,Z,HEADSTONE);return;}
  for(const [yu,yv] of p.yews)if(u===yu&&Math.abs(v)===yv){RBS(X,Z,g+1,g+2,YEW);RBS(X,Z,g+3,g+6,YEWL);return;}
  for(const [yu,yv] of p.yews)if(Math.abs(u-yu)<=1&&Math.abs(av-yv)<=1&&!(u===yu&&av===yv)){RBS(X,Z,g+3,g+5,YEWL);return;}
  if(hsh(X,9883,Z)<0.05)RBP(X,g+1,Z,OXEYE);};
// a tomb (7 by 7, its door toward the street): a rock-faced plinth, walls of white courses between pillars, a window of stained
// glass in each side, a carved lintel over the open door, a cornice, a little stepped dome with a lamp on its crown; inside, the
// effigy on its bier and a lamp
RB.mtomb=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,ea=a===0||a===W-1,eb=b===0||b===D-1,m=Math.max(Math.abs(a-3),Math.abs(b-3));RBP(X,g,Z,WSTONE);
  if(ea||eb){const cor=ea&&eb,door=b===0&&a===3,win=ea&&b===3;RBP(X,g+1,Z,door?AIR:WSROUGH);
    for(let y=g+2;y<=g+5;y++)RBP(X,y,Z,cor?WSPILLAR:door&&y<=g+3?AIR:door&&y===g+4?WSCARVE:win&&(y===g+3||y===g+4)?STGLASS:WSBRICK);RBP(X,g+6,Z,WSTRIM);return;}
  RBS(X,Z,g+1,g+5,AIR);if(a===3&&b===4)RBP(X,g+1,Z,EFFIGY);if(a===3&&b===3)RBP(X,g+1,Z,WSCARVE);if(a===3&&b===4)RBP(X,g+5,Z,LANTERN);
  RBP(X,g+6,Z,WSTONE);if(m<=2)RBP(X,g+7,Z,m===2?WSTRIM:SLATE);if(m<=1)RBP(X,g+8,Z,m===1?SLATE:WSTRIM);if(m===0){RBP(X,g+9,Z,WSPILLAR);RBP(X,g+10,Z,LANTERN);}};
// the kings lying in the house of the kings (inside its dome, about p.cu, p.cv): two rows of effigies on their biers, the lectern
// of their chronicle at the back between them, banners on the walls
RB.mkings=(s,p,u,v,X,Z)=>{const dz=u-p.cu,dx=v-p.cv,g=p.y;if(Math.abs(dx)===3&&(dz===-3||dz===-1||dz===1||dz===3))RBP(X,g+1,Z,EFFIGY);
  if(dx===0&&dz===4)RBP(X,g+1,Z,LECTERN);if(Math.abs(dx)===5&&dz===0)RBS(X,Z,g+3,g+5,RBANNER);};
function hallowsLayout(s,L,r){const R=s.R,g=s.T,P=L.parts;
  P.push({k:'mhground',u0:-R,u1:R,v0:-R,v1:R,f:0,y:g,yews:[[-R+3,5],[R-19,5],[-R+3,R-4],[R-19,R-4]]});
  P.push({k:'cwall',u0:-R,u1:R,v0:-R,v1:R,f:0,r:R,H:4,gw:2,gh:4,low:true});
  let n=0;for(let k=0;k<3;k++)for(const sg of [1,-1]){const cu=-R+6+k*9;P.push({k:'mtomb',u0:cu-3,u1:cu+3,v0:sg>0?5:-11,v1:sg>0?11:-5,f:sg>0?2:3,y:g,n:n++});}
  P.push({k:'dome',u0:R-17,u1:R-3,v0:-7,v1:7,f:0,y:g,H:8});P.push({k:'mkings',u0:R-15,u1:R-5,v0:-5,v1:5,cu:R-10,cv:0,y:g});
  for(let u=-R+4;u<R-18;u+=8)for(const vv of [3,-3])P.push({k:'lamp',u0:u,u1:u,v0:vv,v1:vv,f:0,y:g});
  L.tombs=n;L.spots.push({kind:'hgate',u:-R+3,v:0,y:g},{kind:'tombs',u:0,v:0,y:g},{kind:'kings',u:R-12,v:0,y:g});}
const MEN_LAYOUT={lists:listsLayout,hallows:hallowsLayout,port:portLayout};
// ---- additions to a village (from villageLayout): the maypole and the notice board on the green, the inn's furnishings and
// sign, the smith's sign, a churchyard behind the chapel
function menVillage(s,L,rg,small){const P=L.parts,g=s.T,mp=small?3:4;
  P.push({k:'mpole',u0:mp-1,u1:mp+1,v0:mp-1,v1:mp+1,cu:mp,cv:mp,y:g});L.spots.push({kind:'fair',u:mp,v:mp,y:g});
  P.push({k:'mnotice',u0:-mp,u1:-mp,v0:-mp,v1:-mp,y:g});
  for(const h of P.filter(q=>q.inn)){P.push(menInside(h,'inn'),menSign(h,INNSIGN));const mg=hMg(h),[fu,fv]=partAt(h,mg[0]+h.door,mg[2]-2);L.spots.push({kind:'inn',u:fu,v:fv,y:g});}
  for(const h of P.filter(q=>q.k==='smithy')){const [fu,fv]=partAt(h,0,-1);P.push({k:'msign',u0:fu,u1:fu,v0:fv,v1:fv,y:g+3,id:SMITHSIGN});}
  // the churchyard behind the chapel, or beside it where a road runs behind: the side with the fewest road columns and no house
  for(const h of P.filter(q=>q.chapel)){const [W,D]=h.f<2?[h.v1-h.v0+1,h.u1-h.u0+1]:[h.u1-h.u0+1,h.v1-h.v0+1],fl=[3,2,0,1],fr=[2,3,1,0];let best=null;
    for(const [a0,b0,a1,b1,f] of [[-1,D+1,W,D+7,h.f],[-8,1,-2,D-2,fl[h.f]],[W+1,1,W+7,D-2,fr[h.f]]]){const c1=partAt(h,a0,b0),c2=partAt(h,a1,b1),q={k:'mgraves',u0:Math.min(c1[0],c2[0]),u1:Math.max(c1[0],c2[0]),v0:Math.min(c1[1],c2[1]),v1:Math.max(c1[1],c2[1]),f:f,y:g};
      if(P.some(o=>o!==h&&(o.k==='house'||o.k==='smithy'||o.k==='tower'||o.k==='hay'||o.k==='well')&&!(o.u1<q.u0-1||o.u0>q.u1+1||o.v1<q.v0-1||o.v0>q.v1+1)))continue;
      let rd=0;for(let u=q.u0;u<=q.u1;u+=2)for(let v=q.v0;v<=q.v1;v+=2){const [X,Z]=siteXZ(s,u,v);if(realmRoadAt(Math.round(X),Math.round(Z),1))rd++;}if(!best||rd<best.rd)best={q:q,rd:rd};}
    if(best)P.push(best.q);}}
// ---- A port of the white realm (D-089), where a province meets the sea: a terraced town like the elves' havens (its terraces
// follow the land, a platform under each building, its harbour dredged before the quay), built in white stone: the quay at the
// water's edge with bollards, cranes, crates and casks and a fish market, two piers of stone with ships of the realm moored at
// them (round-bellied cogs with castles fore and aft and a square sail with the sign, and a long galley with its oars run out),
// a mole along one side with a lighthouse at its end (a white tower with a beacon on its top), warehouses and the harbour
// master's hall over the quay facing the sea, houses up the terraces, a gate of posts and banners where the road comes in
function menKit(s,L){const P=L.parts,taken=[],R=s.R,lvl=(u,v)=>s.T+Math.round((evRaw(s,u,v)-s.T)/s.terr)*s.terr;
  const free=(a0,a1,b0,b1)=>!taken.some(q=>!(a1<q[0]||a0>q[1]||b1<q[2]||b0>q[3]))&&Math.hypot(Math.max(Math.abs(a0),Math.abs(a1)),Math.max(Math.abs(b0),Math.abs(b1)))<R-2;
  const take=(a0,a1,b0,b1)=>taken.push([a0,a1,b0,b1]);
  const pad=(u0,u1,v0,v1,y)=>{L.pads.push({u0:u0,u1:u1,v0:v0,v1:v1,y:y});take(u0-1,u1+1,v0-1,v1+1);};
  // a house of the realm centred on (cu, cv), its core W across and D deep, facing f, on its platform, steps from its door
  const house=(cu,cv,W,D,f,o)=>{const ac=f<2,hu=(ac?D:W)+2,hv=(ac?W:D)+2,u0=Math.round(cu-hu/2),v0=Math.round(cv-hv/2),u1=u0+hu-1,v1=v0+hv-1;
    if(!free(u0-1,u1+1,v0-1,v1+1))return null;const y=o.y!==undefined?o.y:lvl((u0+u1)/2,(v0+v1)/2);
    const h=housePart(u0+1,u1-1,v0+1,v1-1,f,[1,1,1,1],Object.assign({y:y,door:Math.floor(W/2)},o));P.push(h);pad(u0,u1,v0,v1,y);
    const sp=f===0?{u0:u0-8,u1:u0-1,v0:v0,v1:v1}:f===1?{u0:u1+1,u1:u1+8,v0:v0,v1:v1}:f===2?{u0:u0,u1:u1,v0:v0-8,v1:v0-1}:{u0:u0,u1:u1,v0:v1+1,v1:v1+8};
    P.push(Object.assign({k:'mstep',f:f,y:y,w:1.6},sp));if(f===0)take(u0-3,u0-1,v0,v1);else if(f===1)take(u1+1,u1+3,v0,v1);else if(f===2)take(u0,u1,v0-3,v0-1);else take(u0,u1,v1+1,v1+3);
    h.front=f===0?[u0-3,Math.round((v0+v1)/2)]:f===1?[u1+3,Math.round((v0+v1)/2)]:f===2?[Math.round((u0+u1)/2),v0-3]:[Math.round((u0+u1)/2),v1+3];return h;};
  return {P:P,R:R,lvl:lvl,free:free,take:take,pad:pad,house:house};}
// the ground of a terraced site of the realm: lawns on its terraces; where a terrace or a platform stands over the ground beside
// it, a retaining wall of rock-faced white stone under a moulded coping; the way from the gate paved, climbing by stairs between
// parapets where it meets a terrace's edge, lamps along it; fruit trees here and there on the lawns
function menGroundPart(s,L,uEnd,ww){const cache=new Map(),onWay=u=>u>=-s.R&&u<=uEnd,
  stairs=u=>{let h=cache.get(u);if(h!==undefined)return h;h=EVG(s,u,0);for(let k=1;k<=14;k++){h=Math.max(h,EVG(s,u+k,0)-k,EVG(s,u-k,0)-k);}cache.set(u,h);return h;};
  L.parts.unshift({k:'mground',u0:-s.R,u1:s.R,v0:-s.R,v1:s.R,f:0,ww:ww,onWay:onWay,way:(u,v)=>onWay(u)&&Math.abs(v)<=ww,stairs:stairs});}
RB.mground=(s,p,u,v,X,Z)=>{const d=Math.hypot(u,v);if(d>s.R-1.5)return;const g=EVG(s,u,v),av=Math.abs(v);
  if(p.way(u,v)){const h=Math.max(g,p.stairs(u));if(h>g)RBS(X,Z,g+1,h-1,WSBRICK);
    RBP(X,h,Z,av===p.ww?WSBRICK:PAVING);RBS(X,Z,h+1,h+5,AIR);
    if(av===p.ww&&h===g&&((u%10)+10)%10===5){RBS(X,Z,h+1,h+2,WSPILLAR);RBP(X,h+3,Z,LANTERN);}return;}
  if(av===p.ww+1&&p.onWay(u)){const h=p.stairs(u);if(h>g){RBS(X,Z,g+1,h,WSBRICK);RBP(X,h+1,Z,WSTRIM);return;}}
  let lo=g;for(const [du,dv] of [[1,0],[-1,0],[0,1],[0,-1]])lo=Math.min(lo,EVG(s,u+du,v+dv));const pd=elfPad(s,u,v);
  if(lo<g){for(let y=lo+1;y<g;y++)RBP(X,y,Z,WSROUGH);RBP(X,g,Z,WSTRIM);return;}
  if(pd&&u>=pd.u0&&u<=pd.u1&&v>=pd.v0&&v<=pd.v1)return;
  RBP(X,g,Z,GRASS);const q=hsh(X,9885,Z);if(q<0.05)RBP(X,g+1,Z,[FLOWR,FLOWY,LAVENDER,OXEYE][(hsh(X,9887,Z)*4)|0]);else if(q<0.09)RBP(X,g+1,Z,TGRASS);
  const cu=Math.round((u-3)/8)*8+3,cv=Math.round((v-3)/8)*8+3,du=Math.abs(u-cu),dv=Math.abs(v-cv),m=Math.max(du,dv);
  if(m>2||du===2&&dv===2||hsh(cu,9889,cv)>=0.25||Math.hypot(cu,cv)>s.R-5||p.way(cu,cv)||EVG(s,cu,cv)!==g||elfPad(s,cu,cv))return;
  const lf=hsh(cu,9891,cv)<0.4?BLOSSOM:FRUITL;if(m===0)RBS(X,Z,g+1,g+3,LOG);RBS(X,Z,g+3+(m===0?1:0),g+4,lf);if(m<=1)RBP(X,g+5,Z,lf);};
// steps from a house's door out to the terrace before it: down where its platform stands higher, cut up where it stands lower
RB.mstep=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),k=D-b,t=evTerr(s,u,v),dm=Math.abs(a-(W-1)/2);if(t===p.y||dm>p.w+1.01)return;
  const gp=siteLayout(s).parts[0];if(elfPad(s,u,v)||gp.k==='mground'&&gp.way(u,v))return;
  const h=p.y>t?Math.max(t,p.y-k):Math.min(t,p.y+k);
  if(h>t){if(dm>p.w){if(h-1>t){RBS(X,Z,t+1,h,WSROUGH);RBP(X,h+1,Z,WSTRIM);}return;}RBS(X,Z,t+1,h-1,WSBRICK);RBP(X,h,Z,PAVING);RBS(X,Z,h+1,h+4,AIR);return;}
  if(dm>p.w){RBS(X,Z,h+1,t,WSROUGH);return;}RBP(X,h,Z,PAVING);RBS(X,Z,h+1,Math.max(t,h)+4,AIR);};
// the quay: its edge coursed down to the floor of the harbour under a moulded kerb, bollards along it; paving behind with crates
// and casks stacked here and there, lamps on posts
RB.mquay=(s,p,u,v,X,Z)=>{const y=p.y,k=u-p.u0;
  if(u===p.u1){for(let yy=SEA-6;yy<y;yy++)RBP(X,yy,Z,WSBRICK);RBP(X,y,Z,WSTRIM);RBP(X,y+1,Z,((v%6)+6)%6===0?LOG:AIR);RBS(X,Z,y+2,y+4,AIR);return;}
  RBP(X,y,Z,k===p.u1-p.u0-2?WSBRICK:PAVING);RBS(X,Z,y+1,y+5,AIR);
  if(k===1&&((v%12)+12)%12===0){RBS(X,Z,y+1,y+2,WSPILLAR);RBP(X,y+3,Z,LANTERN);}
  else if(k<=3&&((v%5)+5)%5<2&&hsh(Math.floor(v/5),9893,Math.round(s.X))<0.45){RBP(X,y+1,Z,hsh(X,9895,Z)<0.5?BARREL:CRATE);if(k===2&&hsh(X,9897,Z)<0.4)RBP(X,y+2,Z,CRATE);}};
// a crane on the quay's edge: a post, its jib out over the water, a rope hanging from its end
RB.mcrane=(s,p,u,v,X,Z)=>{const y=p.y,k=u-p.u0;if(v!==p.cv)return;if(k===0)RBS(X,Z,y+1,y+7,LOG);RBP(X,y+7,Z,LOG);if(k===p.u1-p.u0)RBS(X,Z,y+3,y+6,ROPE);};
// a pier of white stone out over the harbour: a deck of courses on piers to the floor every four, a moulded edge, bollards,
// lamps at its head
RB.mpier=(s,p,u,v,X,Z)=>{const y=p.y,a=Math.abs(v-p.cv),k=u-p.u0,head=u===p.u1;
  if(a<2&&!head){RBP(X,y,Z,PAVING);RBS(X,Z,y+1,y+4,AIR);return;}
  RBP(X,y,Z,WSTRIM);RBS(X,Z,y+2,y+4,AIR);
  if(k%4===0||head){const f=colInfo(X,Z,TRB).h;for(let yy=Math.min(f,SEA-5)+1;yy<y;yy++)RBP(X,yy,Z,WSROUGH);}
  if(head&&a===2){RBP(X,y+1,Z,WSPILLAR);RBP(X,y+2,Z,LANTERN);}else RBP(X,y+1,Z,k%6===3?LOG:AIR);};
// a ship of the realm moored along +u (p.u0 its stern, p.L long, p.cv its keel's line). A cog: a round-bellied hull of tarred
// planks standing out of the water, castles fore and aft with rails, a mast with a yard and the square sail of the realm, a
// pennant at its head, a lamp at the stern. A galley (p.gal): long and low, its oars run out along both sides
RB.mship=(s,p,u,v,X,Z)=>{const t=u-p.u0,c=v-p.cv,Ls=p.L,ac=Math.abs(c),gal=p.gal,dk=SEA+(gal?2:3);
  const hw=t<0||t>=Ls?-1:gal?Math.min(1.6,t<2?0.8+t*0.4:(Ls-1-t)*0.45+0.5):Math.min(2.5,t<3?1.2+t*0.45:(Ls-1-t)*0.6+0.6);
  if(hw>=0&&ac<=hw+0.01){const edge=ac>=hw-0.5,cas=!gal&&(t<=2||t>=Ls-3);
    for(let y=SEA-2;y<=dk;y++){const k=dk-y,w=k>=4?Math.min(hw,0.6):k===3?Math.min(hw,1.4):hw;if(ac<=w+0.01)RBP(X,y,Z,y===dk&&!edge?PLANKS:TARHULL);}
    if(cas){RBP(X,dk+1,Z,edge?TARHULL:PLANKS);RBP(X,dk+2,Z,edge?(t%2?LOG:TARHULL):AIR);}else if(edge)RBP(X,dk+1,Z,gal&&t%2?LOG:TARHULL);}
  if(gal&&t%2===0&&t>2&&t<Ls-3&&hw>=0){const h0=Math.min(1.6,(Ls-1-t)*0.45+0.5);if(ac>h0+0.01&&ac<=h0+3.01)RBP(X,dk-Math.round((ac-h0)/2),Z,LOG);}
  if(c===0&&t===0){RBS(X,Z,dk+(gal?1:3),dk+(gal?2:4),LOG);RBP(X,dk+(gal?3:5),Z,LANTERN);}
  const mt=p.mt,top=dk+(gal?11:14);if(c===0&&t===mt){RBS(X,Z,dk+1,top,LOG);RBP(X,top+1,Z,RBANNER);}
  if(t===mt+1&&ac<=(gal?3:4)){RBP(X,top-1,Z,LOG);if(ac<=(gal?2:3))RBS(X,Z,dk+(gal?4:5),top-2,RSAIL);}
  if(c===0){if(t===Ls)RBS(X,Z,dk-1,dk+2,TARHULL);if(t===Ls+1)RBP(X,dk+(gal?1:3),Z,LOG);}};
// the mole: a breakwater five wide from the quay along one side of the harbour, coursed from the floor, a parapet along its
// seaward edge, lamps along it
RB.mmole=(s,p,u,v,X,Z)=>{const y=p.y,a=v-p.cv,f=colInfo(X,Z,TRB).h,k=u-p.u0;for(let yy=Math.min(f,SEA-5)+1;yy<y;yy++)RBP(X,yy,Z,WSROUGH);
  RBP(X,y,Z,Math.abs(a)===2?WSTRIM:PAVING);RBS(X,Z,y+2,y+5,AIR);
  if(Math.abs(a)===2&&k%10===5){RBP(X,y+1,Z,WSPILLAR);RBP(X,y+2,Z,LANTERN);}else RBP(X,y+1,Z,a*p.side>=2?WSBRICK:AIR);};
// the lighthouse's foot, built up from the floor of the sea
RB.mfound=(s,p,u,v,X,Z)=>{const d=Math.hypot(u-p.cu,v-p.cv);if(d>p.r+0.5)return;const f=colInfo(X,Z,TRB).h;for(let yy=Math.min(f,SEA-5)+1;yy<p.y;yy++)RBP(X,yy,Z,WSROUGH);RBP(X,p.y,Z,d>p.r-1?WSTRIM:PAVING);RBS(X,Z,p.y+1,p.y+3,AIR);};
function portLayout(s,L,r){
  const R=s.R,M=s.M,y=SEA+2,side=r()<0.5?1:-1,K=menKit(s,L),P=K.P;
  let qL=R-2;for(const v of [-12,0,12])for(let u=-R+16;u<R+M-4;u++)if(evRaw(s,u,v)<SEA+1){qL=Math.min(qL,u-1);break;}
  qL=Math.max(-R+22,Math.min(R-2,qL));const hw=R-6,uMax=R+M+4;L.qL=qL;L.hw=hw;
  K.pad(qL-7,qL,-hw,hw,y);P.push({k:'mquay',u0:qL-7,u1:qL+1,v0:-hw,v1:hw,y:y,f:0});
  menGroundPart(s,L,qL-8,2);K.take(-R,qL-8,-3,3);
  const gy=K.lvl(-R,0);P.push({k:'mlgate',u0:-R,u1:-R+1,v0:-3,v1:3,f:0,y:gy});L.spots.push({kind:'gate',u:-R-2,v:0,y:gy});
  // cranes on the quay's edge, the fish market's stalls on the quay
  for(const cv of [Math.round(hw*0.35),-Math.round(hw*0.35)])P.push({k:'mcrane',u0:qL+1,u1:qL+4,v0:cv,v1:cv,cv:cv,y:y});
  const fv=side*Math.round(hw*0.65);for(let k=0;k<2;k++){const v0=fv+(k?4:-4)-1;P.push({k:'stall',u0:qL-6,u1:qL-4,v0:v0,v1:v0+3,f:1,y:y,wool:k?WOOLB:WOOLW,c:k});}
  L.spots.push({kind:'market',u:qL-3,v:fv,y:y+1});
  // the piers and the ships at them (cogs; at the second pier a galley), the mole and the lighthouse
  const deep=(u,v)=>u<=R+M?evRaw(s,u,v)<SEA+1:evRaw(s,u,v)<SEA-4,ships=[];
  for(const [pv,sv,gal] of [[-side*12,[-side*6,-side*18],0],[side*6,[side*12],1]]){const u1=Math.min(uMax-2,qL+24);if(u1-qL<10||!deep(qL+4,pv))continue;
    P.push({k:'mpier',u0:qL+2,u1:u1,v0:pv-2,v1:pv+2,cv:pv,y:y});L.spots.push({kind:'pier',u:u1-2,v:pv,y:y+1});
    for(const cv of sv){let Ls=Math.min(gal?22:16,uMax-qL-9);while(Ls>=12&&!(deep(qL+4,cv)&&deep(qL+4+Ls,cv)))Ls-=2;if(Ls<12)continue;
      P.push({k:'mship',u0:qL+4,u1:qL+6+Ls,v0:cv-5,v1:cv+5,cv:cv,L:Ls,mt:Math.round(Ls*0.5),gal:gal});ships.push([qL+4+Ls/2,cv,gal]);}}
  L.ships=ships;
  const mv=-side*(hw+2),uE=Math.min(uMax,qL+30);P.push({k:'mmole',u0:qL+1,u1:uE,v0:mv-2,v1:mv+2,cv:mv,side:-side,y:y});
  const lu=uE+3,LH=26;P.push({k:'mfound',u0:lu-5,u1:lu+5,v0:mv-5,v1:mv+5,cu:lu,cv:mv,r:4,y:y});
  P.push({k:'tower',u0:lu-3,u1:lu+3,v0:mv-3,v1:mv+3,cu:lu,cv:mv,h2:3,H:LH,y:y,fire:true,batt:true,hollow:true,band:Math.round(LH*0.55)});L.light=[lu,mv,y+LH+3];
  L.spots.push({kind:'light',u:uE-2,v:mv,y:y+1});
  for(const v of [-Math.round(hw*0.6),0,Math.round(hw*0.6)])L.spots.push({kind:'quay',u:qL-3,v:v,y:y+1});
  // the warehouses and the harbour master's hall over the quay, facing the sea (the first place each fits, the larger first);
  // houses up the terraces
  const over=(sg,list,spot)=>{for(const [W,D,o] of list)for(const du of [14,15,13,16,12])for(const dv of [10,12,8,14,16,6]){const h=K.house(qL-du,sg*dv,W,D,1,o);if(h){L.spots.push({kind:spot,u:h.front[0],v:h.front[1],y:h.y+1});return h;}}return null;};
  const wh={st:2,sh:4,mat:'timber',roof:SLATE,dw:2,dh:3,ridge:'a',lamp:true};
  over(-side,[[11,9,wh],[9,7,wh]],'warehouse');over(-side,[[9,7,wh],[7,7,wh]],'warehouse');
  over(side,[[11,9,{st:2,sh:5,mat:'stone',roof:SLATE,dw:2,dh:3,ridge:'a',lamp:true,pil:true,chim:[2,6]}],[9,7,{st:2,sh:4,mat:'stone',roof:SLATE,lamp:true,ridge:'a'}]],'harbour');
  const spots=[];for(let cu=-R+5;cu<qL-9;cu+=5)for(let cv=-R+4;cv<R-4;cv+=5){if(Math.abs(cv)<5||Math.hypot(cu,cv)>R-5)continue;spots.push([cu,cv,hsh(cu,9899,cv)]);}spots.sort((a,b)=>a[2]-b[2]);
  let nh=0;for(const [cu,cv] of spots){if(nh>=6)break;const f=Math.abs(cv)>Math.abs(cu)*0.6?(cv>0?2:3):1,st=hsh(cu,9901,cv)<0.5?2:1,mat=hsh(cu,9903,cv)<0.5?'stone':'timber';
    const h=K.house(cu,cv,7,9,f,{st:st,sh:4,mat:mat,roof:SLATE,ridge:'b',lamp:true,chim:[1,7]})||K.house(cu,cv,5,7,f,{st:1,sh:4,mat:'cottage',roof:THATCH,ridge:'b',xchim:true});
    if(!h)continue;nh++;L.spots.push({kind:'street',u:h.front[0],v:h.front[1],y:EVG(s,h.front[0],h.front[1])+1});}
}
