// ---- Building the high elves of the elder realms (D-062), in the frame and parts of realm-build.js. The elves need no level
// ground: a site's ground is cut into terraces that follow the land (elfTerrace in realms.js), and every building stands on a
// platform of its own (the layout's pads, levelled by realmGround), its edges dressed as retaining walls. Their ways: pale
// elvenstone in long fine courses, carved friezes of vines, slender columns, tall windows of stained glass under pointed tracery,
// roofs of verdigris copper or dark shingles swept up from low eaves, gilt filigree on every rail and balcony, lamps of pale
// light; slender round towers with open belvederes under swept cones; round pavilions under domes; pools with lamps standing
// in them; gardens of silver-leaved trees; and, for they are strong in arms, walls with tall merlons, many towers, a great
// pointed gate between towers and statues of warriors, barracks and training grounds.
// A part's own frame is partAB's (a across its front, b back from its front); a building's box is its core grown by one (the
// ring its roof overhangs) and by its porch.
const EVG=(s,u,v)=>siteG(s,u,v);
const evTerr=(s,u,v)=>{const [X,Z]=siteXZ(s,u,v);return elfTerrace(s,X,Z);};
const evRaw=(s,u,v)=>{const [X,Z]=siteXZ(s,u,v);return elfRaw(s,X,Z);};
// a swept roof's rise at `pos` blocks in from its eave (concave: low at the eaves, steep toward the ridge)
const evSweep=pos=>pos<0?-1:Math.round(0.12*pos*pos+0.55*pos);
// The ground of a terraced site: lawns on the terraces, and where a terrace (or a platform) stands over the ground beside it, a
// retaining wall of elvenstone courses under a carved coping, gilt filigree along its top. The way from the gate climbs by
// stairs where it meets a terrace's edge (p.stairs: the stair's top at u along the way), between parapets, lamps along it.
RB.eground=(s,p,u,v,X,Z)=>{const d=Math.hypot(u,v);if(d>s.R-1.5)return;const g=EVG(s,u,v),av=Math.abs(v);
  if(p.way(u,v)){const h=Math.max(g,p.stairs(u));if(h>g)RBS(X,Z,g+1,h-1,EVBRICK);
    RBP(X,h,Z,av===p.ww?EVBRICK:h===g&&((u%6)+6)%6===0?EVMOSAIC:EVSTONE);RBS(X,Z,h+1,h+5,AIR);
    if(av===p.ww&&h===g&&((u%8)+8)%8===4){RBS(X,Z,h+1,h+3,EVPILLAR);RBP(X,h+4,Z,EVLAMP);}return;}
  if(av===p.ww+1&&p.onWay(u)){const h=p.stairs(u);if(h>g){RBS(X,Z,g+1,h,EVBRICK);RBP(X,h+1,Z,EVCARVE);return;}}
  let lo=g;for(const [du,dv] of [[1,0],[-1,0],[0,1],[0,-1]])lo=Math.min(lo,EVG(s,u+du,v+dv));const pd=elfPad(s,u,v);
  if(lo<g){for(let y=lo+1;y<g;y++)RBP(X,y,Z,(y-lo)%5===0?EVCARVE:EVBRICK);RBP(X,g,Z,EVCARVE);if(!pd&&d<s.R-3)RBP(X,g+1,Z,EVGOLD);return;}
  if(pd&&u>=pd.u0&&u<=pd.u1&&v>=pd.v0&&v<=pd.v1)return;
  RBP(X,g,Z,GRASS);const q=hsh(X,9701,Z);
  if(q<0.05)RBP(X,g+1,Z,[FLOWR,FLOWY,LAVENDER,BLUEB,OXEYE][(hsh(X,9703,Z)*5)|0]);else if(q<0.09)RBP(X,g+1,Z,TGRASS);
  // trees on the lawns, silver-leaved or in blossom, one at most to each cell of seven (p.trees: how many of the cells have one)
  const cu=Math.round((u-3)/7)*7+3,cv=Math.round((v-3)/7)*7+3,du=Math.abs(u-cu),dv=Math.abs(v-cv),m=Math.max(du,dv);
  if(m>2||du===2&&dv===2||hsh(cu,9743,cv)>=p.trees||Math.hypot(cu,cv)>s.R-5||p.way(cu,cv)||EVG(s,cu,cv)!==g||elfPad(s,cu,cv))return;
  const k=hsh(cu,9745,cv)<0.4,lf=k?BLOSSOM:SILVL;if(m===0)RBS(X,Z,g+1,g+4,k?BIRCH:SILV);RBS(X,Z,g+4+(m===0?1:0),g+5,lf);if(m<=1)RBP(X,g+6,Z,lf);};
// steps from a building's door out to the ground before it (p.y the platform; a front of p.w either side of the middle, out
// to p.n blocks): down where the platform stands higher than the terrace, cut up into it where it stands lower; lamps at its foot
RB.estep=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),k=D-b,t=evTerr(s,u,v),dm=Math.abs(a-(W-1)/2);if(t===p.y||dm>p.w+1.01)return;
  const gp=siteLayout(s).parts[0];if(elfPad(s,u,v)||gp.k==='eground'&&gp.way(u,v))return;
  const h=p.y>t?Math.max(t,p.y-k):Math.min(t,p.y+k);
  if(h>t){if(dm>p.w){if(h-1>t){RBS(X,Z,t+1,h,EVBRICK);RBP(X,h+1,Z,EVCARVE);}return;}RBS(X,Z,t+1,h-1,EVBRICK);RBP(X,h,Z,EVSTONE);RBS(X,Z,h+1,h+4,AIR);return;}
  if(dm>p.w){RBS(X,Z,h+1,t,EVBRICK);return;}RBP(X,h,Z,EVSTONE);RBS(X,Z,h+1,Math.max(t,h)+4,AIR);};
// A hall of the elves (p.W across, p.D deep, p.st storeys of p.sh, its floor p.y, its front facing p.f): slender columns at its
// corners, walls of elvenstone courses in bays, each bay a tall window of stained glass on a carved sill under pointed tracery,
// piers between, a carved frieze at each floor and at the eaves; a door three wide under an arched fanlight; on an upper storey a
// balcony of filigree on a carved ledge; with p.porch, rows of columns before the front under the roof carried out over them;
// a roof of p.roof swept up from low eaves to a ridge crested in gilt, its gables in courses with a round window, its corners
// turned up; inside, floors of mosaic and golden wood, columns down a wide hall, lamps, banners at the back, books along the walls
RB.ehall=(s,p,u,v,X,Z)=>{const [a0,b0]=partAB(p,u,v),pr=p.porch||0,a=a0-1,b=b0-1-pr,W=p.W,D=p.D,g=p.y,st=p.st||1,sh=p.sh||6,eave=g+st*sh,mid=(W-1)/2,dm=Math.abs(a-mid),roof=p.roof||EVROOF;
  const inA=a>=0&&a<W,core=inA&&b>=0&&b<D,porch=inA&&b<0&&b>=-pr,wall=core&&(a===0||a===W-1||b===0||b===D-1);
  // the ground of the platform and the porch
  RBP(X,g,Z,core?EVMOSAIC:porch?(b===-pr?EVCARVE:EVMOSAIC):EVSTONE);
  if(core){
    if(wall){const cor=(a===0||a===W-1)&&(b===0||b===D-1),side=a===0||a===W-1,pa=side?b:a,pier=cor||pa%3===0;
      for(let y=g+1;y<=eave;y++){const k=Math.floor((y-g-1)/sh),ry=(y-g-1)%sh;let id;
        if(cor)id=EVPILLAR;else if(ry===sh-1)id=EVCARVE;else if(pier)id=EVBRICK;else if(ry===0)id=EVCARVE;else if(ry===sh-2)id=EVTRACERY;else id=EVGLASS;
        if(b===0&&!cor&&k===0&&dm<=1.01){id=ry<4?AIR:ry===4?EVTRACERY:EVCARVE;} // the door and its fanlight
        RBP(X,y,Z,id);}}
    else{RBS(X,Z,g+1,eave,AIR);
      for(let k=1;k<st;k++){const fy=g+k*sh;RBP(X,fy,Z,a===1&&b===D-2?AIR:EVWOOD);}
      if(a===1&&b===D-2&&st>1)RBS(X,Z,g+1,g+(st-1)*sh,LADDER);
      if(W>=13&&(a===3||a===W-4)&&b%4===2&&b<D-2)RBS(X,Z,g+1,g+sh-1,EVPILLAR); // columns down a wide hall
      for(let k=0;k<st;k++){const cy=g+k*sh+sh-1;if(a%4===2&&b%5===2&&!(W>=13&&(a===3||a===W-4)))RBP(X,cy,Z,EVLAMP);}
      if(b===D-2&&Math.abs(dm-2)<0.6)RBS(X,Z,g+2,g+3,EVBANNER);
      if(p.books&&(a===1||a===W-2)&&b%3===1&&b<D-2)RBS(X,Z,g+1,g+2,BOOKS);}}
  else{RBS(X,Z,g+1,eave,AIR);
    if(porch&&b===-pr){if(a%3===0||a===W-1)RBS(X,Z,g+1,eave-1,EVPILLAR);else{RBP(X,eave-2,Z,EVTRACERY);RBP(X,eave-1,Z,EVCARVE);}RBP(X,eave,Z,EVCARVE);} // an arcade of pointed arches
    // a balcony along the upper storey of the front, where there is no porch
    if(!pr&&st>1&&b===-1&&a>=1&&a<=W-2){RBP(X,g+sh,Z,EVCARVE);RBP(X,g+sh+1,Z,EVGOLD);}}
  // the roof: its ridge along the depth, over the porch and one out all round
  const pos=Math.min(a+1,W-a),rb=Math.min(b+pr+1,D-b),gable=b===-pr-1||b===D,ry=eave+evSweep(pos);
  RBS(X,Z,eave+evSweep(pos-1)+1,ry,roof);
  if(pos===0&&(b===-pr-1||b===D))RBP(X,eave+1,Z,roof); // the corners turned up
  if(Math.abs(a-mid)<0.6&&rb>0)RBP(X,ry+1,Z,EVGOLD); // the ridge's cresting
  // the gables: courses under the roof, a round window in each, a carved rake
  if(inA&&(b===0||b===D-1)){for(let y=eave+1;y<eave+evSweep(pos);y++){const win=dm<=1.01&&y>=eave+2&&y<=eave+3;RBP(X,y,Z,win?EVGLASS:y===eave+evSweep(pos)-1?EVCARVE:EVBRICK);}}
  if(gable&&Math.abs(a-mid)<0.6){RBS(X,Z,ry+1,ry+2,EVPILLAR);RBP(X,ry+3,Z,EVLAMP);}};
// A slender round tower (p.rr its radius, p.H to its gallery over p.y): a flared foot, courses with carved bands, tall narrow windows
// at the quarters, a door toward p.door; corbels under a gallery with a filigree rail, an open belvedere of columns above, a cone of
// p.roof swept out at its foot, its finial a lamp or the elves' banner (p.flag); within, golden-wood floors, a ladder, lamps. Its
// shaft goes down to the ground wherever the ground falls away under it.
RB.etower=(s,p,u,v,X,Z)=>{const a=u-p.cu,b=v-p.cv,d=Math.hypot(a,b),rr=p.rr,g=p.y,top=g+p.H,Rr=rr+1.7;if(d>Rr+0.3)return;const t=Math.round(Math.atan2(b,a)*rr*1.5);
  const roofH=p.rh||Math.round(rr*3.4),base=top+4,cone=q=>q<0?-1:Math.round(roofH*Math.pow(q,1.7));
  const q0=(Rr-d)/Rr,q1=(Rr-d-1)/Rr;RBS(X,Z,base+cone(q1)+1,base+cone(q0),p.roof||EVROOF);
  if(d<0.6){RBS(X,Z,base+roofH+1,base+roofH+2,EVPILLAR);RBP(X,base+roofH+3,Z,p.flag?EVBANNER:EVLAMP);}
  const gnd=EVG(s,u,v);
  if(d>rr+0.5){ // the gallery on its corbels, and the flared foot
    if(d<=rr+1.6){RBP(X,top,Z,EVCARVE);if(((t%2)+2)%2===0)RBP(X,top-1,Z,EVCARVE);RBP(X,top+1,Z,d>rr+1?EVGOLD:AIR);}
    if(d<=rr+1.1){if(gnd<g)RBS(X,Z,gnd+1,g,EVBRICK);RBS(X,Z,g+1,g+2,EVBRICK);RBP(X,g+3,Z,EVCARVE);}return;}
  const ring=d>rr-0.9,quarter=Math.abs(a)<0.6||Math.abs(b)<0.6,dir=p.door||0,door=(dir===0?a<-rr+1.2&&Math.abs(b)<=1:dir===1?a>rr-1.2&&Math.abs(b)<=1:dir===2?b<-rr+1.2&&Math.abs(a)<=1:b>rr-1.2&&Math.abs(a)<=1);
  if(gnd<g)RBS(X,Z,gnd+1,g-1,EVBRICK);RBP(X,g,Z,ring?EVBRICK:EVMOSAIC);
  const lad=Math.abs(a-(Math.round(rr)-1.5))<0.6&&Math.abs(b)<0.6;
  for(let y=g+1;y<=top+3;y++){const dy=y-g;let id;
    if(y>top){id=ring&&((t%3)+3)%3===0?EVPILLAR:y===top+3&&ring?EVCARVE:AIR;} // the belvedere
    else if(ring){id=dy%6===0?EVCARVE:EVBRICK;if(quarter&&dy%6>=2&&dy%6<=4&&y<top-2)id=dy%6===4?EVTRACERY:EVGLASS;if(door&&dy<=4)id=dy<=3?AIR:EVTRACERY;}
    else id=lad&&y<top?LADDER:dy%6===0?EVWOOD:dy%6===5&&d<0.6?EVLAMP:AIR;
    RBP(X,y,Z,id);}
  if(!ring)RBP(X,top,Z,lad?LADDER:EVWOOD);};
// A round pavilion (p.rp its radius): a floor of mosaic on a carved step, eight slender columns, a carved ring beam, a dome of
// p.roof with a lamp at its top, another hung within
RB.epav=(s,p,u,v,X,Z)=>{const a=u-p.cu,b=v-p.cv,d=Math.hypot(a,b),rp=p.rp,g=p.y,Rd=rp+1;if(d>Rd+0.5)return;
  const dh=x=>x>Rd?-1:Math.round(Math.sqrt(Math.max(0,Rd*Rd-x*x))*0.85),top=g+5;
  RBS(X,Z,top+1+dh(d+1)+1,top+1+dh(d),p.roof||EVROOF);if(d<0.6){RBP(X,top+2+dh(0),Z,EVPILLAR);RBP(X,top+3+dh(0),Z,EVLAMP);}
  if(d>rp+0.5){RBP(X,g,Z,EVCARVE);RBS(X,Z,g+1,top,AIR);return;}
  RBP(X,g,Z,EVMOSAIC);const ang=Math.atan2(b,a),col=Math.abs(d-rp)<0.6&&Math.abs(Math.sin(ang*4))<0.25;
  for(let y=g+1;y<=top;y++)RBP(X,y,Z,col?EVPILLAR:y===top&&d>rp-1.2?EVCARVE:AIR);
  if(d<0.6)RBP(X,top,Z,EVLAMP);};
// A pool: a carved rim on a stone kerb round water over a floor of mosaic, a column in its middle bearing a lamp
RB.epool=(s,p,u,v,X,Z)=>{const d=Math.hypot(u-p.cu,v-p.cv),rp=p.rp,g=p.y;if(d>rp+0.5)return;
  if(d>rp-0.6){RBP(X,g,Z,EVSTONE);RBP(X,g+1,Z,EVCARVE);RBS(X,Z,g+2,g+4,AIR);return;}
  RBP(X,g-1,Z,EVMOSAIC);if(d<0.6){RBS(X,Z,g,g+2,EVPILLAR);RBP(X,g+3,Z,EVLAMP);return;}RBP(X,g,Z,WATER);RBS(X,Z,g+1,g+4,AIR);};
// A garden: lawn with beds of flowers, a cross of paths, silver-leaved trees and blossom (p.trees)
RB.egarden=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,path=Math.abs(a-(W-1)/2)<1||Math.abs(b-(D-1)/2)<1;RBS(X,Z,g+1,g+6,AIR);
  RBP(X,g,Z,path?EVSTONE:GRASS);if(!path&&hsh(X,9705,Z)<0.4)RBP(X,g+1,Z,[FLOWR,BLUEB,LAVENDER,OXEYE,MOONP][(hsh(X,9707,Z)*5)|0]);
  for(const [tu,tv,k] of p.trees){const da=Math.abs(u-tu),db=Math.abs(v-tv),m=Math.max(da,db);if(m>2)continue;
    if(m===0)RBS(X,Z,g+1,g+4,k?BIRCH:SILV);const lf=k?BLOSSOM:SILVL;if(m<=2&&!(da===2&&db===2))RBS(X,Z,g+4+(m===0?1:0),g+5,lf);if(m<=1)RBP(X,g+6,Z,lf);}};
// A training ground: sand within a filigree rail, butts of straw with painted faces at the back, racks of golden wood
RB.eyard=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,edge=a===0||b===0||a===W-1||b===D-1;RBP(X,g,Z,hsh(X,9709,Z)<0.7?SAND:GRAVEL);RBS(X,Z,g+1,g+5,AIR);
  if(edge){if(!(b===0&&Math.abs(a-(W-1)/2)<=1.5))RBP(X,g+1,Z,EVGOLD);return;}
  if(b===D-2&&a%3===1){RBP(X,g+1,Z,HAYBALE);RBP(X,g+2,Z,WOOLR);}else if(a===1&&b%2===0)RBS(X,Z,g+1,g+2,EVWOOD);};
// A warrior of stone on a plinth, facing p.f: a long robe flaring to his feet, a mail coat and pauldrons, his hands together on
// the hilt of a sword set point down before him, long hair and a crested helm (5 across, 4 deep, 14 high)
RB.estatue=(s,p,u,v,X,Z)=>{const [a,b]=partAB(p,u,v),g=p.y,gnd=colInfo(X,Z,TRB).h,y0=g+3;RBS(X,Z,Math.min(gnd+1,g+1),g+2,EVBRICK);RBP(X,g+3,Z,EVCARVE);RBS(X,Z,g+4,g+17,AIR);
  const at=(dy,id)=>RBP(X,y0+dy,Z,id);
  if(b>=1&&b<=3&&(a>=1&&a<=3||(a===0||a===4)&&b>=2)){for(let dy=1;dy<=4;dy++)at(dy,dy===1?EVCARVE:EVSTONE);} // the robe, flaring
  if(a>=1&&a<=3&&b>=2&&b<=3)for(let dy=5;dy<=8;dy++)at(dy,dy===5?EVCARVE:EVBRICK); // the coat
  if((a===0||a===4)&&b===2){at(7,EVSTONE);at(8,EVCARVE);} // the arms, and the pauldrons over them
  if((a===1||a===3)&&b===1)at(6,EVSTONE); // the forearms, brought forward
  if(a===2&&b===0){for(let dy=1;dy<=5;dy++)at(dy,EVPILLAR);at(6,EVCARVE);at(7,EVSTONE);at(8,EVCARVE);} // blade, guard, hands, pommel
  if((a===1||a===3)&&b===0)at(6,EVCARVE); // the guard's quillons
  if(a===2&&b>=2&&b<=3){at(9,EVSTONE);at(10,EVSTONE);at(11,EVCARVE);} // the head under the helm
  if(a===2&&b===1)at(11,EVCARVE);if(a===2&&b===4)at(10,EVCARVE); // the crest, swept back
  if((a===1||a===3)&&b===3)at(9,EVSTONE);}; // the hair at the shoulders
// A wall round a city or a fastness (p.r its line, three thick, p.H over the ground at each column, so it steps with the land):
// courses on a carved plinth, a carved band near the top, a walk behind tall merlons with filigree between; the gate's passage
// (p.gw either side of the middle, toward -u) open under its arch (p.gh)
RB.ewall=(s,p,u,v,X,Z)=>{const d=Math.hypot(u,v),R=p.r;if(d<R-1.5||d>=R+1.5)return;const g=EVG(s,u,v),top=g+p.H,av=Math.abs(v),gate=u<0&&av<=p.gw+0.5,t=Math.round(Math.atan2(v,u)*R);
  if(gate){const ah=g+p.gh-Math.round(Math.pow(av/(p.gw+0.5),2)*2.5);RBP(X,g,Z,EVSTONE);RBS(X,Z,g+1,ah,AIR);RBP(X,ah+1,Z,EVCARVE);RBS(X,Z,ah+2,top,EVBRICK);RBP(X,top+1,Z,EVCARVE);
    if(av<0.6&&d>=R+0.5){RBS(X,Z,top-3,top-1,EVBANNER);}return;}
  for(let y=g+1;y<=top;y++)RBP(X,y,Z,y===g+1?EVCARVE:y===top-2?EVCARVE:EVBRICK);
  if(d>=R+0.5){const m=((t%4)+4)%4;if(m<2){RBP(X,top+1,Z,EVBRICK);RBP(X,top+2,Z,EVCARVE);}else if(m===2)RBP(X,top+1,Z,EVGOLD);}
  else RBP(X,top,Z,EVSTONE);};
// ---- Layouts
function elfLayout(s,L,r){if(s.k==='city')elfCity(s,L,r);else if(s.k==='fort')elfFastness(s,L,r);else if(s.k==='village')elfRefuge(s,L,r);else if(s.k==='farm')elfGardens(s,L,r);else elfSpire(s,L,r);}
// the shared toolkit of a layout: the ground's level, boxes taken, platforms, halls with their steps, towers and the rest
function elfKit(s,L){
  const P=L.parts,taken=[],R=s.R,lvl=(u,v)=>s.T+Math.round((evRaw(s,u,v)-s.T)/s.terr)*s.terr;
  const free=(a0,a1,b0,b1)=>!taken.some(q=>!(a1<q[0]||a0>q[1]||b1<q[2]||b0>q[3]))&&Math.hypot(Math.max(Math.abs(a0),Math.abs(a1)),Math.max(Math.abs(b0),Math.abs(b1)))<R-3;
  const take=(a0,a1,b0,b1)=>taken.push([a0,a1,b0,b1]);
  const pad=(u0,u1,v0,v1,y)=>{L.pads.push({u0:u0,u1:u1,v0:v0,v1:v1,y:y});take(u0-1,u1+1,v0-1,v1+1);};
  // which way the land falls at (u, v): the side a building there should face (toward the view)
  const downhill=(u,v)=>{const gu=evRaw(s,u+6,v)-evRaw(s,u-6,v),gv=evRaw(s,u,v+6)-evRaw(s,u,v-6);return Math.abs(gu)>=Math.abs(gv)?(gu>0?0:1):(gv>0?2:3);};
  // a hall centred on (cu, cv), W across and D deep, facing f, on its platform, with steps from its door
  const hall=(cu,cv,W,D,f,o,need)=>{const pr=(o&&o.porch)||0,bw=W+2,bd=D+2+pr,ac=f<2,hu=ac?bd:bw,hv=ac?bw:bd,u0=Math.round(cu-hu/2),v0=Math.round(cv-hv/2),u1=u0+hu-1,v1=v0+hv-1;
    const su=f===0?[u0-8,u0-1]:f===1?[u1+1,u1+8]:[u0,u1],sv=f===2?[v0-8,v0-1]:f===3?[v1+1,v1+8]:[v0,v1];
    if(!free(u0-1,u1+1,v0-1,v1+1)||(need&&!need(u0,u1,v0,v1)))return null;const y=lvl((u0+u1)/2,(v0+v1)/2);
    const p=Object.assign({k:'ehall',u0:u0,u1:u1,v0:v0,v1:v1,f:f,W:W,D:D,y:y},o||{});P.push(p);pad(u0,u1,v0,v1,y);
    const sp=f===0?{u0:su[0],u1:su[1],v0:v0,v1:v1}:f===1?{u0:su[0],u1:su[1],v0:v0,v1:v1}:{u0:u0,u1:u1,v0:sv[0],v1:sv[1]};
    P.push(Object.assign({k:'estep',f:f,y:y,w:1.6},sp));if(f===0)take(u0-3,u0-1,v0,v1);else if(f===1)take(u1+1,u1+3,v0,v1);else if(f===2)take(u0,u1,v0-3,v0-1);else take(u0,u1,v1+1,v1+3);
    const [du,dv]=f===0?[-1,0]:f===1?[1,0]:f===2?[0,-1]:[0,1],fu=f<2?(f===0?u0-3:u1+3):(u0+u1)/2,fv=f<2?(v0+v1)/2:(f===2?v0-3:v1+3);
    p.front=[Math.round(fu),Math.round(fv)];p.dd=[du,dv];return p;};
  const tower=(cu,cv,rr,H,o,force)=>{const e=Math.ceil(rr+2);if(!force&&!free(cu-e,cu+e,cv-e,cv+e))return null;const y=o&&o.y!==undefined?o.y:lvl(cu,cv);
    const p=Object.assign({k:'etower',u0:cu-e,u1:cu+e,v0:cv-e,v1:cv+e,cu:cu,cv:cv,rr:rr,H:H,y:y},o||{});P.push(p);if(o&&o.nopad)take(cu-e,cu+e,cv-e,cv+e);else pad(cu-e+1,cu+e-1,cv-e+1,cv+e-1,y);return p;};
  const pav=(cu,cv,rp,o)=>{const e=rp+2;if(!free(cu-e,cu+e,cv-e,cv+e))return null;const y=lvl(cu,cv);P.push(Object.assign({k:'epav',u0:cu-e,u1:cu+e,v0:cv-e,v1:cv+e,cu:cu,cv:cv,rp:rp,y:y},o||{}));pad(cu-rp-1,cu+rp+1,cv-rp-1,cv+rp+1,y);return y;};
  const pool=(cu,cv,rp)=>{const e=rp+1;if(!free(cu-e-1,cu+e+1,cv-e-1,cv+e+1))return null;const y=lvl(cu,cv);P.push({k:'epool',u0:cu-e,u1:cu+e,v0:cv-e,v1:cv+e,cu:cu,cv:cv,rp:rp,y:y});pad(cu-e,cu+e,cv-e,cv+e,y);return y;};
  const garden=(cu,cv,w,d,trees)=>{const u0=cu-(d>>1),v0=cv-(w>>1);if(!free(u0-1,u0+d,v0-1,v0+w))return null;const y=lvl(cu,cv);P.push({k:'egarden',u0:u0,u1:u0+d-1,v0:v0,v1:v0+w-1,f:0,y:y,trees:trees.map(([a,b,k])=>[u0+a,v0+b,k])});pad(u0,u0+d-1,v0,v0+w-1,y);return y;};
  const yard=(cu,cv,w,d,f)=>{const ac=f<2,hu=ac?d:w,hv=ac?w:d,u0=Math.round(cu-hu/2),v0=Math.round(cv-hv/2);if(!free(u0-1,u0+hu,v0-1,v0+hv))return null;const y=lvl(cu,cv);
    P.push({k:'eyard',u0:u0,u1:u0+hu-1,v0:v0,v1:v0+hv-1,f:f,y:y});pad(u0,u0+hu-1,v0,v0+hv-1,y);return y;};
  return {P:P,R:R,lvl:lvl,free:free,take:take,pad:pad,downhill:downhill,hall:hall,tower:tower,pav:pav,pool:pool,garden:garden,yard:yard};}
// the ground part with its way: from the gate (u = -R) up to uEnd, ww either side of the middle; the stairs' tops along it, cached
function elfGroundPart(s,L,uEnd,ww,trees){const cache=new Map(),onWay=u=>u>=-s.R&&u<=uEnd,
  stairs=u=>{let h=cache.get(u);if(h!==undefined)return h;h=EVG(s,u,0);for(let k=1;k<=14;k++){h=Math.max(h,EVG(s,u+k,0)-k,EVG(s,u-k,0)-k);}cache.set(u,h);return h;};
  L.parts.unshift({k:'eground',u0:-s.R,u1:s.R,v0:-s.R,v1:s.R,f:0,ww:ww,trees:trees||0.3,onWay:onWay,way:(u,v)=>onWay(u)&&Math.abs(v)<=ww,stairs:stairs});}
// The hidden city: terraces down the mountainside inside a wall with many towers and a great gate between statues; the way
// climbs from the gate to the high hall (the king's at the high seat) with its porch and great tower; halls about the
// terraces each facing out over the valley, slender towers, pavilions at the viewpoints, pools and gardens; by the gate the
// barracks, the armoury and a training ground
function elfCity(s,L,r){
  const K=elfKit(s,L),R=s.R,P=K.P;
  // the high hall: on the highest ground it can find along the middle of the city's back half
  const W=s.prov.capital?17:15,D=s.prov.capital?25:21,pr=3,bd=D+2+pr;let best=null;
  for(let u0=Math.round(-R*0.15);u0+bd<R-8;u0+=2){const uc=u0+bd/2;if(Math.hypot(Math.max(Math.abs(u0),Math.abs(u0+bd)),W/2+2)>R-7)continue;const sc=evRaw(s,uc,0)+uc*0.08;if(!best||sc>best.sc)best={u0:u0,sc:sc};}
  const hu0=best?best.u0:Math.round(R*0.05);
  const H=K.hall(hu0+bd/2,0,W,D,0,{porch:pr,st:2,sh:7,books:1,roof:EVROOF});
  const wayEnd=H?H.u0-1:R-12;K.take(-R,wayEnd,-4,4);elfGroundPart(s,L,wayEnd,2,0.35);
  if(H){K.tower(H.u1-4,-(W>>1)-6,3.5,s.prov.capital?44:36,{roof:EVSHINGLE,flag:1,door:3,y:H.y},true);L.spots.push({kind:'hall',u:H.u0+6,v:0,y:H.y+1},{kind:'hall',u:H.u0-3,v:2,y:EVG(s,H.u0-3,2)+1});}
  // by the gate: barracks either side of the way, a training ground, the armoury
  const gu=-R+12;for(const sg of [1,-1]){const b=K.hall(gu,sg*13,9,15,sg>0?2:3,{st:2,sh:6,roof:EVSHINGLE});if(b)L.spots.push({kind:'barracks',u:b.front[0],v:b.front[1],y:b.y+1});}
  const ys=r()<0.5?1:-1,yu=gu+16;const yy=K.yard(yu,ys*15,13,17,ys>0?2:3);if(yy!==null)L.spots.push({kind:'drill',u:yu,v:ys*15,y:yy+1});
  const ar=K.hall(yu,-ys*12,7,11,ys>0?3:2,{st:1,sh:6,roof:EVSHINGLE});if(ar)L.spots.push({kind:'smithy',u:ar.front[0],v:ar.front[1],y:ar.y+1});
  // slender towers where the land is steepest and pavilions at the viewpoints: a few before the halls, more after if there is room
  const cand=[];for(let k=0;k<28;k++){const a=k/28*6.283,rd=R*(0.35+0.4*hsh(k,9721,s.seed*1000|0)),cu=Math.round(Math.cos(a)*rd),cv=Math.round(Math.sin(a)*rd);
    const gu=evRaw(s,cu+4,cv)-evRaw(s,cu-4,cv),gv=evRaw(s,cu,cv+4)-evRaw(s,cu,cv-4);cand.push({cu:cu,cv:cv,steep:Math.hypot(gu,gv),hi:evRaw(s,cu,cv)});}
  const apart=(c,list,m)=>list.every(q=>Math.hypot(q[0]-c.cu,q[1]-c.cv)>=m),tl=[],pl=[],bySteep=[...cand].sort((x,y)=>y.steep-x.steep),byHigh=[...cand].sort((x,y)=>y.hi-x.hi);
  const towers=n=>{for(const c of bySteep){if(tl.length>=n)break;if(!apart(c,tl,R*0.45))continue;if(K.tower(c.cu,c.cv,2.5+hsh(c.cu,9723,c.cv),24+Math.round(hsh(c.cu,9725,c.cv)*10),{roof:hsh(c.cv,9727,c.cu)<0.5?EVROOF:EVSHINGLE,door:K.downhill(c.cu,c.cv)}))tl.push([c.cu,c.cv]);}};
  const pavs=n=>{for(const c of byHigh){if(pl.length>=n)break;if(!apart(c,pl,R*0.4))continue;const y=K.pav(c.cu,c.cv,3);if(y!==null){pl.push([c.cu,c.cv]);L.spots.push({kind:'garden',u:c.cu,v:c.cv,y:y+1});}}};
  towers(2);pavs(1);
  // halls about the terraces, each facing where the land falls away: tried on a fine grid in a shuffled order, the larger where
  // they fit, the smaller where they do not
  const spots=[];for(let cu=-R+10;cu<R-6;cu+=7)for(let cv=-R+6;cv<R-6;cv+=7){if(Math.abs(cv)<9||Math.hypot(cu,cv)>R-9)continue;spots.push([cu,cv,hsh(cu,9711,cv)]);}spots.sort((a,b)=>a[2]-b[2]);
  let nh=0;const nmax=Math.round(R*R/220);for(const [cu,cv] of spots){if(nh>=nmax)break;const f=K.downhill(cu,cv),q=hsh(cu,9715,cv),roof=hsh(cu,9717,cv)<0.6?EVROOF:EVSHINGLE;
    const h=K.hall(cu,cv,11,15,f,{st:2,sh:6,roof:roof})||K.hall(cu,cv,9,13,f,{st:q<0.5?2:1,sh:6,roof:roof})||K.hall(cu,cv,7,9,f,{st:1,sh:6,roof:roof});
    if(!h)continue;nh++;if(q<0.6)L.spots.push({kind:'street',u:h.front[0],v:h.front[1],y:EVG(s,h.front[0],h.front[1])+1});}
  towers(s.prov.capital?6:4);pavs(3);
  // pools and gardens near the way, wherever there is room
  const near=[];for(let cu=-R+16;cu<R-12;cu+=6)for(const cv of [-10,-14,-18,10,14,18])near.push([cu,cv,hsh(cu,9747,cv)]);near.sort((a,b)=>a[2]-b[2]);
  let npo=0,ng=0;for(const [cu,cv] of near){if(npo<3){const y=K.pool(cu,cv,3);if(y!==null){npo++;L.spots.push({kind:'garden',u:cu,v:cv+(cv>0?5:-5),y:y+1});continue;}}
    if(ng<2&&K.garden(cu,cv,11,11,[[2,2,0],[8,2,1],[2,8,1],[8,8,0]])!==null)ng++;}
  // the wall, its towers, the great gate between two towers, statues of warriors before it
  const WH=13;P.push({k:'ewall',u0:-R-2,u1:R+2,v0:-R-2,v1:R+2,f:0,r:R-1,H:WH,gw:2,gh:8});
  const n=Math.max(6,Math.round(2*Math.PI*R/30));for(let k=1;k<n;k++){const a=Math.PI+k*2*Math.PI/n,cu=Math.round(Math.cos(a)*(R-1)),cv=Math.round(Math.sin(a)*(R-1));if(Math.abs(cv)<10&&cu<0)continue;
    K.tower(cu,cv,3,WH+9,{roof:EVSHINGLE,nopad:1,door:cu>0?0:1},true);}
  for(const sg of [1,-1]){K.tower(-R+1,sg*6,3,WH+12,{roof:EVROOF,nopad:1,flag:1,door:2+(sg>0?0:1)},true);
    P.push({k:'estatue',u0:-R-9,u1:-R-5,v0:sg*11-2,v1:sg*11+2,f:0,y:EVG(s,-R-7,sg*11)});}
  L.spots.push({kind:'gate',u:-R-6,v:0,y:EVG(s,-R-6,0)+1},{kind:'gatein',u:-R+5,v:0,y:EVG(s,-R+5,0)+1});
  for(let u=-R+18;u<wayEnd-4;u+=16)L.spots.push({kind:'street',u:u,v:0,y:EVG(s,u,0)+1});
}
// The fastness: a great tower at the back of a walled court, the wall high with towers and a gate between statues; a hall for the
// garrison, a training ground, a pool
function elfFastness(s,L,r){
  const K=elfKit(s,L),R=s.R,P=K.P;elfGroundPart(s,L,R-12,1,0.12);K.take(-R,R-12,-3,3);
  const T=K.tower(R-11,0,4,36,{roof:EVSHINGLE,flag:1,door:0,rh:16},true);if(T)L.spots.push({kind:'keep',u:R-15,v:0,y:T.y+1});
  const sg=r()<0.5?1:-1;const h=K.hall(-2,sg*10,7,13,sg>0?2:3,{st:2,sh:6,roof:EVROOF});if(h)L.spots.push({kind:'barracks',u:h.front[0],v:h.front[1],y:h.y+1});
  const y=K.yard(-2,-sg*10,7,11,sg>0?3:2);if(y!==null)L.spots.push({kind:'drill',u:-2,v:-sg*10,y:y+1});
  P.push({k:'ewall',u0:-R-2,u1:R+2,v0:-R-2,v1:R+2,f:0,r:R-1,H:14,gw:1,gh:7});
  for(const a of [0.75,1.25,1.75,0.25].map(q=>q*Math.PI)){const cu=Math.round(Math.cos(a)*(R-1)),cv=Math.round(Math.sin(a)*(R-1));K.tower(cu,cv,2.5,22,{roof:EVROOF,nopad:1,door:cu>0?0:1},true);}
  for(const sg2 of [1,-1]){K.tower(-R+1,sg2*4,2.5,24,{roof:EVROOF,nopad:1,flag:1,door:2+(sg2>0?0:1)},true);P.push({k:'estatue',u0:-R-8,u1:-R-4,v0:sg2*8-2,v1:sg2*8+2,f:0,y:EVG(s,-R-6,sg2*8)});}
  L.spots.push({kind:'gate',u:-R-5,v:0,y:EVG(s,-R-5,0)+1},{kind:'gatein',u:-R+4,v:0,y:EVG(s,-R+4,0)+1});
}
// A refuge: a house of the elves at the head of its way, halls about it facing the view, a pavilion, a pool and a garden, a tower
function elfRefuge(s,L,r){
  const K=elfKit(s,L),R=s.R,small=R<22;
  const H=K.hall(Math.round(R*0.3),0,small?9:11,small?13:15,0,{st:2,sh:6,porch:small?0:2,roof:EVROOF,books:1});const wayEnd=H?H.u0-1:R-8;K.take(-R,wayEnd,-3,3);elfGroundPart(s,L,wayEnd,1,0.55);
  if(H)L.spots.push({kind:'hall',u:H.u0-3,v:2,y:EVG(s,H.u0-3,2)+1});
  for(const [cu,cv] of [[-6,-12],[-6,12],[8,-13],[8,13]]){const h=K.hall(cu,cv,7,11,K.downhill(cu,cv),{st:1,sh:6,roof:hsh(cu,9729,cv)<0.5?EVROOF:EVSHINGLE});if(h)L.spots.push({kind:'green',u:h.front[0],v:h.front[1],y:EVG(s,h.front[0],h.front[1])+1});}
  const py=K.pav(-Math.round(R*0.45),-9,3);if(py!==null)L.spots.push({kind:'garden',u:-Math.round(R*0.45),v:-9,y:py+1});
  const qy=K.pool(-Math.round(R*0.4),8,2);if(qy!==null)L.spots.push({kind:'green',u:-Math.round(R*0.4),v:4,y:EVG(s,-Math.round(R*0.4),4)+1});
  K.garden(Math.round(R*0.05),-15,9,9,[[2,2,1],[6,6,0]]);
  K.tower(Math.round(R*0.55),14,2.5,22,{roof:EVSHINGLE,flag:1,door:K.downhill(Math.round(R*0.55),14)});
  L.spots.push({kind:'lane',u:-R+3,v:0,y:EVG(s,-R+3,0)+1});
}
// A watch-spire: a tall slender tower on the heights, a pavilion beside it
function elfSpire(s,L,r){const K=elfKit(s,L),R=s.R;elfGroundPart(s,L,-R+1,1);
  const T=K.tower(1,0,3,30,{roof:EVSHINGLE,flag:1,door:0,rh:12},true);if(T)L.spots.push({kind:'post',u:-4,v:0,y:T.y+1});}
// The gardens of the elves: terraced orchards of silver-leaved trees and blossom on the lawns, walled beds of flowers, a summer
// pavilion over the view, a house for the gardeners at the back
function elfGardens(s,L,r){const K=elfKit(s,L),R=s.R;elfGroundPart(s,L,-R+3,1,0.9);
  const h=K.hall(Math.round(R*0.45),0,7,9,0,{st:1,sh:6,roof:EVROOF});if(h)L.spots.push({kind:'farm',u:h.front[0],v:h.front[1],y:EVG(s,h.front[0],h.front[1])+1});
  const pv=K.pav(-2,-Math.round(R*0.5),2);if(pv!==null)L.spots.push({kind:'field',u:-2,v:-Math.round(R*0.5)+4,y:pv+1});
  for(const [cu,cv] of [[-Math.round(R*0.35),Math.round(R*0.4)],[Math.round(R*0.1),Math.round(R*0.55)]])if(K.garden(cu,cv,7,7,[[1,1,0],[5,5,1]])!==null)L.spots.push({kind:'field',u:cu,v:cv,y:EVG(s,cu,cv)+1});
}
// ---- The elves' roads: the elven way paved in elvenstone between kerbs of courses, a lamp on a column beside it every 48 blocks;
// hidden paths of gravel and stepping stones; bridges of elvenstone on slender piers with filigree rails
function elfRoadCol(X,Z,x,z,rr){
  const o=colInfo(X,Z,TRB),g=o.h,rd=rr.rd,hi=rd.k==='high',ao=Math.abs(rr.off),wet=o.wet||o.river||o.lake||o.b===0||g<o.sl+1;
  if(ao>rd.w+0.5){if(hi&&!wet&&ao<=rd.w+1.5&&rr.off>0&&Math.floor(rr.along)%48===24){RBS(X,Z,g+1,g+3,EVPILLAR);RBP(X,g+4,Z,EVLAMP);}return;}
  if(wet){const y=Math.max(o.sl,o.lake||0)+2,edge=ao>rd.w-0.5;RBP(X,y,Z,edge?EVCARVE:EVBRICK);if(edge)RBP(X,y+1,Z,EVGOLD);RBS(X,Z,y+(edge?2:1),y+3,AIR);
    if(Math.floor(rr.along)%6===0)for(let yy=y-1;yy>=Math.max(1,g-1);yy--)RBP(X,yy,Z,EVPILLAR);return;}
  const top=world[I(x,g,z)];if(top===AIR||top===WATER)return;
  RBP(X,g,Z,hi?(ao>rd.w-0.5?EVBRICK:EVSTONE):hsh(X,9731,Z)<0.18?EVSTONE:GRAVEL);
  for(let y=g+1;y<=g+3;y++){const id=world[I(x,y,z)];if(id&&!SOLID[id])RBP(X,y,Z,AIR);else if(SOLID[id]&&y===g+1)RBP(X,y,Z,AIR);}
}
