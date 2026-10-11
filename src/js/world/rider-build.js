// ---- Building the riders of the plains (D-061): their hill towns, holds, steadings, beacons and horse farms, in the same frame
// and parts as the white realm's (realm-build.js): a layout of parts, each a box in the site's own frame (u toward its back from
// the side its road comes in on, v across) with a column builder; a chunk builds its own columns. Their ways: timber and wattle
// under golden thatch or turf, their halls carved and gilded with crossed horse heads on the gables; fieldstone for footings,
// terraces and the round walls of their holds; palisades of sharpened logs on an earth bank over a ditch; paddocks of horses.
// the ground of a hill town: grass on its terraces, lanes of beaten earth round each (p.lanes: their radii about the hall's
// middle), the way up of fieldstone flags; where a terrace rises over the one below, a fieldstone wall under a turf edge with a
// rail fence along it
RB.hground=(s,p,u,v,X,Z)=>{const d=Math.hypot(u,v);if(d>s.R-3)return;const f=cityFrame(s),t=cityTier(s,u,v),g=s.T+t*f.step;
  let lo=t;for(const [du,dv] of [[1,0],[-1,0],[0,1],[0,-1]])lo=Math.min(lo,cityTier(s,u+du,v+dv));
  if(lo<t){RBS(X,Z,s.T+lo*f.step+1,g-1,FSTONE);RBP(X,g,Z,GRASS);if(!p.stair(u,v)&&!p.way(u,v))RBP(X,g+1,Z,FENCE);return;}
  if(p.way(u,v)){RBP(X,g,Z,Math.abs(v)===2||hsh(X,9601,Z)>0.25?FSTONE:GRAVEL);return;}
  const dc=Math.hypot(u-f.cu,v),lane=p.lanes.some(q=>Math.abs(dc-q)<1.2);
  RBP(X,g,Z,lane?(hsh(X,9603,Z)<0.3?GRAVEL:PATH):GRASS);
  if(!lane&&hsh(X,9605,Z)<0.06)RBP(X,g+1,Z,hsh(X,9607,Z)<0.5?TGRASS:[OXEYE,FLOWY,LAVENDER][(hsh(X,9609,Z)*3)|0]);};
// the way up a terrace: steps of fieldstone between carved posts, a lamp on each post
RB.hstair=(s,p,u,v,X,Z)=>{const k=u-p.u0,yl=p.y,av=Math.abs(v),st=cityFrame(s).step;
  if(av<=2){if(k<st)RBS(X,Z,yl+1,yl+k+1,FSTONE);RBS(X,Z,yl+Math.min(k,st)+2,yl+st+6,AIR);}
  else if(av===3&&k<st){RBS(X,Z,yl+1,yl+k+1,FSTONE);if(k===0||k===st-1){RBS(X,Z,yl+k+2,yl+k+3,CTIMBER);RBP(X,yl+k+4,Z,LANTERN);}}};
// A palisade round a town or a beacon (p.r its line, p.H high): logs on a fieldstone footing, sharpened at the top; with p.walk a
// walk of planks behind it on posts; with p.ditch an earth bank faced in fieldstone at its foot and a ditch outside, left
// whole before the gate (a causeway); the gate's passage (p.gw either side of the middle, toward -u) is open
RB.palisade=(s,p,u,v,X,Z)=>{const d=Math.hypot(u,v),R=p.r,g=p.y;if(u<0&&Math.abs(v)<=p.gw)return;const t=Math.round(Math.atan2(v,u)*R);
  if(d>=R-0.7&&d<R+0.7){RBP(X,g+1,Z,FSTONE);RBS(X,Z,g+2,g+p.H,LOG);RBP(X,g+p.H+1,Z,STAKES);return;}
  if(p.walk&&d>=R-2.2&&d<R-0.7){RBP(X,g+p.H-2,Z,PLANKS);if(((t%6)+6)%6===0)RBS(X,Z,g+1,g+p.H-3,LOG);return;}
  if(p.ditch&&d>=R+0.7&&d<R+1.8){RBP(X,g+1,Z,FSTONE);return;}
  if(p.ditch&&d>=R+2.6&&d<R+5.6){const o=colInfo(X,Z,TRB);if(o.wet||o.river||o.lake)return;RBS(X,Z,o.h-1,o.h+2,AIR);RBP(X,o.h-2,Z,GRASS);}};
// A square timber tower (half-width p.h2, platform p.H over p.y): log posts at its corners, a rail low down, a platform of planks
// with stakes round it and a ladder up the middle, a steep pyramid of golden thatch over it out one past its posts, the riders'
// banner on a pole at its peak
RB.ptower=(s,p,u,v,X,Z)=>{const a=v-p.cv,b=u-p.cu,m=Math.max(Math.abs(a),Math.abs(b)),g=p.y,h=p.h2,top=g+p.H;if(m>h+1)return;
  if(m<=h){const cor=Math.abs(a)===h&&Math.abs(b)===h;if(cor)RBS(X,Z,g+1,top+2,LOG);else if(m===h){RBP(X,top-4,Z,LOG);RBP(X,top+1,Z,STAKES);}
    RBP(X,top,Z,PLANKS);if(a===0&&b===0)RBS(X,Z,g+1,top,LADDER);}
  const ry=top+3+(h+1-m)*2;RBS(X,Z,ry-1,ry,GTHATCH);if(m===0){RBP(X,ry+1,Z,LOG);RBP(X,ry+2,Z,HBANNER);RBP(X,ry+3,Z,HBANNER);}};
// the bridge over a gate between its towers: a carved lintel, a walk of planks with stakes along its front, the horse heads
RB.gatebeam=(s,p,u,v,X,Z)=>{const g=p.y,top=g+p.H,av=Math.abs(v);RBS(X,Z,top-3,top-2,av<=p.gw?CTIMBER:LOG);RBP(X,top-1,Z,PLANKS);
  if(u===p.u0){RBP(X,top,Z,STAKES);if(v===0){RBP(X,top,Z,CTIMBER);RBP(X,top+1,Z,HORNS);}}};
// The king's golden hall (a thane's hall in a lesser town): on a fieldstone terrace with steps before it, a long hall (p.W across,
// p.D deep, p.sh to its eaves) of carved and gilded oak under a steep roof of golden thatch, its ridge gilded, crossed horse heads
// on its gables; a porch on carved pillars before its doors; within, two rows of carved pillars under the open roof, a long hearth
// down the middle, tapestries and shields on the walls, lamps, and at the far end a dais with the high seat under the banners
RB.ghall=(s,p,u,v,X,Z)=>{const [a,b]=partAB(p,u,v),tm=2,pr=3,W=p.W,D=p.D,TW=W+2*tm,TD=D+pr+2*tm,ca=a-tm,cb=b-tm-pr,g=p.y,fl=g+2,eave=fl+p.sh,mid=(W-1)/2;
  if(a<0||b<0||a>=TW||b>=TD)return;const inA=ca>=0&&ca<W,core=inA&&cb>=0&&cb<D,porch=inA&&cb>=-pr&&cb<0,dm=Math.abs(ca-mid);
  // the steps up to the terrace, the terrace, its low wall and lamps
  if(b<tm&&dm<=2){RBP(X,g,Z,FSTONE);if(b===1)RBP(X,g+1,Z,FSTONE);RBS(X,Z,b===1?g+2:g+1,g+5,AIR);return;}
  RBS(X,Z,g,fl,FSTONE);const roofed=ca>=-1&&ca<=W&&cb>=-pr&&cb<=D;
  if(!roofed){if(a===0||b===0||a===TW-1||b===TD-1){if((a+b)%2===0)RBP(X,fl+1,Z,FSTONE);if((a===0||a===TW-1)&&(b===0||b===TD-1)){RBP(X,fl+1,Z,CTIMBER);RBP(X,fl+2,Z,LANTERN);}}return;}
  const pos=ca,ry=eave+1+Math.min(pos,W-1-pos)*2,ridge=Math.abs(pos-mid)<0.6;
  if(porch){ // pillars along its front, a gilded beam over them, the roof carried over it with its gable closed above the beam
    const col=cb===-pr&&(ca%3===0||ca===W-1);RBP(X,fl,Z,PLANKS);for(let y=fl+1;y<eave;y++)RBP(X,y,Z,col?CTIMBER:AIR);RBP(X,eave,Z,col||cb===-pr?GILDED:PLANKS);
    for(let y=eave+1;y<ry-1;y++)RBP(X,y,Z,cb===-pr?(dm<0.6&&y===eave+2?SHIELDS:PLANKS):AIR);}
  else if(core){const wall=ca===0||ca===W-1||cb===0||cb===D-1,cor=(ca===0||ca===W-1)&&(cb===0||cb===D-1),side=ca===0||ca===W-1,pa=side?cb:ca;
    RBP(X,fl,Z,wall?FSTONE:PLANKS);
    for(let y=fl+1;y<=eave;y++){const dy=y-fl;let id=AIR;
      if(wall){const post=cor||pa%3===0;id=y===eave?GILDED:dy===1?CTIMBER:post?CTIMBER:PLANKS;
        if(!post&&side&&pa%3===2&&dy===3)id=SHIELDS;if(!post&&side&&pa%3===1&&dy>=p.sh-2&&dy<p.sh)id=LGLASS;
        if(cb===0&&dm<=1&&dy<=4)id=AIR;else if(cb===0&&dm<=1&&dy===5)id=GILDED;else if(cb===0&&dm===2&&dy<=5)id=CTIMBER;} // the doors
      else{const dais=cb>=D-4;
        if(dais&&dy===1)id=PLANKS;
        if((ca===2||ca===W-3)&&cb%3===1&&cb<D-4)id=CTIMBER; // the pillars
        else if(dm<0.6&&cb>=3&&cb<=D-7&&dy===0)id=HEARTH;
        else if((ca===1||ca===W-2)&&cb%4===2&&cb<D-4&&dy>=2&&dy<=4)id=TAPESTRY;
        else if(dm<0.6&&cb===D-3&&dy===2)id=GILDED; // the high seat
        else if(dm<0.6&&cb===D-2&&dy>=2&&dy<=4)id=GILDED;
        else if(Math.abs(dm-2)<0.6&&cb===D-2&&dy>=3&&dy<=5)id=HBANNER;
        else if((ca===2||ca===W-3)&&cb%6===4&&y===eave)id=LANTERN;}
      if(id!==AIR||!wall)RBP(X,y,Z,id);else RBP(X,y,Z,AIR);}
    if(!(cb===0||cb===D-1))for(let y=eave+1;y<ry-1;y++)RBP(X,y,Z,AIR);
    else for(let y=eave+1;y<ry-1;y++)RBP(X,y,Z,dm<0.6&&y===eave+3?SHIELDS:y===ry-2?GILDED:PLANKS);} // the gables
  else if(cb===D&&inA){for(let y=eave+1;y<ry-1;y++)RBP(X,y,Z,AIR);} // the eaves out behind
  RBP(X,ry,Z,ridge?GILDED:GTHATCH);RBP(X,ry-1,Z,GTHATCH);
  if(ridge&&(cb===-pr||cb===D))RBP(X,ry+1,Z,HORNS);};
// A paddock: grass in a rail fence with a gap at its front for a gate, a trough of water at the back, hay in a corner
RB.paddock=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,edge=a===0||b===0||a===W-1||b===D-1;RBP(X,g,Z,GRASS);RBS(X,Z,g+1,g+3,AIR);
  if(edge){if(!(b===0&&Math.abs(a-(W>>1))<=1))RBP(X,g+1,Z,FENCE);return;}
  if(b===D-2&&a>=2&&a<=4)RBP(X,g,Z,WATER);else if(b===D-2&&(a===1||a===5))RBP(X,g+1,Z,PLANKS);
  if(a===W-2&&b===1)RBS(X,Z,g+1,g+2,HAYBALE);else if(a===W-3&&b===1)RBP(X,g+1,Z,HAYBALE);};
// A king's mound beside the road before the royal seat: a grassy barrow, white flowers on it
RB.mound=(s,p,u,v,X,Z)=>{const d=Math.hypot(u-p.cu,v-p.cv);if(d>p.r)return;const o=colInfo(X,Z,TRB);if(o.wet||o.river||o.lake)return;const g=o.h,h=Math.round(p.hm*(1-(d/p.r)*(d/p.r)));
  if(h<=0)return;RBS(X,Z,g,g+h-1,DIRT);RBP(X,g+h,Z,GRASS);RBP(X,g+h+1,Z,hsh(X,9611,Z)<0.22?OXEYE:AIR);};
// A beacon: a ring of fieldstone, a crib of logs stacked within it, the fire basket on top, kept lit
RB.pyre=(s,p,u,v,X,Z)=>{const d=Math.max(Math.abs(u-p.cu),Math.abs(v-p.cv)),g=p.y;if(d>2)return;RBP(X,g+1,Z,FSTONE);if(d===2)return;
  RBS(X,Z,g+2,g+3,LOG);if(d===0){RBS(X,Z,g+4,g+5,LOG);RBP(X,g+6,Z,BRAZIER);}else if(((u+v)%2+2)%2===0)RBP(X,g+4,Z,LOG);};
// A hold's round wall (p.r its outer face, p.H high, three thick): fieldstone on a battered foot, loops near its top, merlons
// along its outer edge over a walk, the gate's arch at -u (p.gw either side) under a carved lintel with the horse heads over it;
// outside, a ditch, left whole before the gate
RB.rwall=(s,p,u,v,X,Z)=>{const d=Math.hypot(u,v),R=p.r,g=p.y,top=g+p.H,t=Math.round(Math.atan2(v,u)*R),gate=u<0&&Math.abs(v)<=p.gw;
  if(d<R-2.6||d>=R+6.6)return;
  if(d>=R+2.6){if(gate||d<R+3.4)return;const o=colInfo(X,Z,TRB);if(o.wet||o.river||o.lake)return;RBS(X,Z,o.h-1,o.h+2,AIR);RBP(X,o.h-2,Z,GRASS);return;}
  if(d>=R+0.6){if(!gate){RBP(X,g+1,Z,FSTONE);if(d<R+1.5)RBP(X,g+2,Z,FSTONE);}return;}
  for(let y=g+1;y<=top;y++){let id=FSTONE;
    if(gate){const dy=y-g,arch=Math.abs(v)===p.gw?p.gh-1:p.gh;if(dy<=arch)id=AIR;else if(dy===arch+1)id=CTIMBER;}
    else if(d>=R-0.6&&y>=top-3&&y<=top-2&&((t%5)+5)%5===0)id=AIR;
    RBP(X,y,Z,id);}
  if(gate)RBP(X,g,Z,FSTONE);
  if(d>=R-0.6&&((t%2)+2)%2===0)RBP(X,top+1,Z,FSTONE);
  if(gate&&d>=R-0.6&&v===0){RBP(X,top+1,Z,CTIMBER);RBP(X,top+2,Z,HORNS);}};
// A round tower of fieldstone (p.rr its radius, p.H high): a battered foot, slits at the four quarters, floors, lamps and a
// ladder within, a door toward the front (p.door), a gallery of planks carried out round its top on brackets with stakes; p.roof
// a cone of golden thatch over it, else merlons and the riders' banner
RB.rtower=(s,p,u,v,X,Z)=>{const a=u-p.cu,b=v-p.cv,d=Math.hypot(a,b),rr=p.rr,g=p.y,top=g+p.H,t=Math.round(Math.atan2(b,a)*rr);if(d>rr+1.6)return;
  if(p.roof&&d<=rr+1.6){const ry=top+2+Math.round((rr+1.6-d)*1.3);RBS(X,Z,Math.max(top+2,ry-1),ry,GTHATCH);if(d<0.6){RBP(X,ry+1,Z,LOG);RBP(X,ry+2,Z,HBANNER);RBP(X,ry+3,Z,HBANNER);}}
  if(d>rr+0.5){RBP(X,g+1,Z,FSTONE);if(((t%2)+2)%2===0)RBP(X,top-1,Z,LOG);RBP(X,top,Z,PLANKS);RBP(X,top+1,Z,STAKES);return;}
  const ring=d>rr-0.9,lad=Math.abs(a-(Math.round(rr)-2))<0.5&&Math.abs(b)<0.5;
  for(let y=g+1;y<=top;y++){const dy=y-g;let id;
    if(ring){id=FSTONE;if((Math.abs(a)<0.6||Math.abs(b)<0.6)&&dy%6>=3&&dy%6<=4&&y<top-2)id=AIR;if(p.door&&a<0&&Math.abs(b)<=1&&dy<=3)id=dy===3?CTIMBER:AIR;}
    else id=lad?LADDER:dy%6===0?PLANKS:dy%6===5&&d<0.6?LANTERN:AIR;
    RBP(X,y,Z,id);}
  RBP(X,g,Z,FSTONE);
  if(!p.roof){if(ring&&((t%2)+2)%2===0)RBP(X,top+1,Z,FSTONE);if(d<0.6){RBS(X,Z,top+1,top+2,LOG);RBS(X,Z,top+3,top+4,HBANNER);}}
  if(ring&&!p.roof)RBP(X,top,Z,FSTONE);else if(!ring)RBP(X,top,Z,lad?LADDER:PLANKS);};
// a ring of sand for training horses and riders, a rail fence round it
RB.tring=(s,p,u,v,X,Z)=>{const d=Math.hypot(u-p.cu,v-p.cv),g=p.y;if(d>p.r+0.5)return;RBP(X,g,Z,d>p.r-0.6?GRASS:hsh(X,9613,Z)<0.6?SAND:GRAVEL);RBS(X,Z,g+1,g+3,AIR);
  if(d>p.r-0.6&&!(Math.abs(v-p.cv)<=1&&u<p.cu))RBP(X,g+1,Z,FENCE);};
// ---- Layouts of the riders' places
function riderLayout(s,L,r){if(s.k==='city')riderTown(s,L,r);else if(s.k==='fort')riderHold(s,L,r);else if(s.k==='village')riderSteading(s,L,r);else if(s.k==='farm')riderStud(s,L,r);else riderBeacon(s,L,r);}
// a longhouse of the riders: wattle and daub under turf or golden thatch, a steep roof with the horse heads on its gables, carved
// door posts, a hearth within; on its core (u0..u1, v0..v1), its front facing f
// (its ridge runs along its longer side, so the roof spans the shorter)
const longhouse=(u0,u1,v0,v1,f,o)=>{const W=f<2?v1-v0+1:u1-u0+1,D=f<2?u1-u0+1:v1-v0+1;
  return housePart(u0,u1,v0,v1,f,[1,1,1,1],Object.assign({st:1,sh:4,mat:'wattle',roof:TURF,pitch:2,horns:true,hearth:true,ridge:W>D?'a':'b',lamp:true},o));};
// The hill town: a round town on a hill in terraces (cityGround), a palisade on an earth bank round it over a ditch, timber towers
// along it and a gatehouse of two towers; the way up from the gate by stairs to the golden hall on the top terrace; longhouses in
// rings round each terrace facing its lane; by the gate stables, a paddock, a smithy, a few stalls and a well; before the royal
// seat the kings' mounds along the road
function riderTown(s,L,r){
  const R=s.R,f=cityFrame(s),cu=f.cu,P=L.parts,g0=s.T,tierY=t=>g0+t*f.step,taken=[],top=s.tiers>=3?2:1,rt=top===2?f.r2:f.r1;
  const free=(a0,a1,b0,b1)=>!taken.some(q=>!(a1<q[0]||a0>q[1]||b1<q[2]||b0>q[3])),take=(a0,a1,b0,b1)=>taken.push([a0,a1,b0,b1]);
  const tierOfBox=(a0,a1,b0,b1)=>{const ts=new Set();for(const [uu,vv] of [[a0-1,b0-1],[a1+1,b0-1],[a0-1,b1+1],[a1+1,b1+1],[(a0+a1)>>1,(b0+b1)>>1],[a0-1,(b0+b1)>>1],[a1+1,(b0+b1)>>1],[(a0+a1)>>1,b0-1],[(a0+a1)>>1,b1+1]])ts.add(cityTier(s,uu,vv));return ts.size===1?[...ts][0]:-1;};
  const bounds=[{r:f.r1,t:1}];if(top===2)bounds.push({r:f.r2,t:2});
  const stairAt=(u,v)=>Math.abs(v)<=3&&bounds.some(B=>u>=cu-B.r-f.step&&u<=cu-B.r);
  const lanes=[];
  // the golden hall on the top terrace, its front toward the gate; as long as the terrace allows
  let D=Math.min(25,Math.max(13,Math.round(rt*1.3)|1)),W=D>=21?13:11;while(D>13&&Math.hypot((D+3+4)/2,(W+4)/2)>rt-1)D-=2;
  const hu0=Math.round(cu-(D+3+4)/2),hu1=hu0+D+3+4-1;P.push({k:'ghall',u0:hu0,u1:hu1,v0:-(W>>1)-2,v1:(W>>1)+2,f:0,W:W,D:D,y:tierY(top),sh:6});take(hu0-1,hu1+1,-(W>>1)-3,(W>>1)+3);
  P.unshift({k:'hground',u0:-R,u1:R,v0:-R,v1:R,f:0,stair:stairAt,way:(u,v)=>Math.abs(v)<=2&&u<hu0+1,lanes:lanes});
  take(-R,hu0,-4,4); // the way up
  for(const B of bounds){const u0=cu-B.r-f.step;P.push({k:'hstair',u0:u0,u1:u0+f.step-1,v0:-3,v1:3,f:0,y:tierY(B.t-1)});}
  // longhouses in a ring round each terrace below the hall's, their long sides facing a lane along its inner edge, smaller
  // houses where the ring turns (a house's box keeps to the site's axes)
  for(let t=top-1;t>=0;t--){const rI=t===top-1?rt:bounds.find(B=>B.t===t+1).r,rO=t===0?R-4:bounds.find(B=>B.t===t).r,rin=rI+2,avail=rO-2-rin;if(avail<7)continue;
    lanes.push(rin+1);const D0=Math.min(7,avail-2);
    for(let ang=-Math.PI;ang<Math.PI;ang+=12/(rin+6)){const ca=Math.cos(ang),sa=Math.sin(ang);if(ca<-0.8&&Math.abs(sa*(rin+6))<9)continue; // the way
      const fu=Math.abs(ca)>=Math.abs(sa),f0=fu?(ca>0?0:1):(sa>0?2:3);
      for(const [w,dd] of [[11,D0],[9,D0],[7,Math.min(D0,5)],[5,5]]){const rm=rin+3+(dd-1)/2,uc=Math.round(cu+ca*rm),vc=Math.round(sa*rm),hu=fu?dd:w,hv=fu?w:dd,a0=uc-(hu>>1),a1=a0+hu-1,b0=vc-(hv>>1),b1=b0+hv-1;
        if(!free(a0-1,a1+1,b0-1,b1+1)||tierOfBox(a0-1,a1+1,b0-1,b1+1)!==t||Math.hypot(Math.max(Math.abs(a0),Math.abs(a1))+1,Math.max(Math.abs(b0),Math.abs(b1))+1)>R-5)continue;
        const q=hsh(uc,9615,vc);P.push(longhouse(a0,a1,b0,b1,f0,{y:tierY(t),door:w>>1,roof:q<0.55?TURF:GTHATCH,chim:null,lamp:w>=9}));take(a0-1,a1+1,b0-1,b1+1);
        if(q>0.7)L.spots.push({kind:'street',u:Math.round(cu+ca*(rin+1)),v:Math.round(sa*(rin+1)),y:tierY(t)});break;}}}
  // by the gate: stables and a paddock on one side, a smithy and stalls on the other, a well by the way
  const sg=r()<0.5?1:-1,gu=-R+8;
  if(free(gu,gu+8,sg*6,sg*20)){const a=sg>0?6:-20;P.push({k:'stable',u0:gu,u1:gu+5,v0:a,v1:a+14,f:0,y:g0,roof:TURF});P.push({k:'paddock',u0:gu+7,u1:gu+15,v0:a,v1:a+14,f:0,y:g0});take(gu-1,gu+16,a-1,a+15);
    L.spots.push({kind:'stable',u:gu-2,v:a+7,y:g0},{kind:'paddock',u:gu+11,v:a+7,y:g0,horses:3});}
  if(free(gu,gu+6,-sg*18,-sg*6)){const a=sg>0?-13:7;P.push({k:'smithy',u0:gu,u1:gu+5,v0:a,v1:a+6,f:3*(sg>0?1:0)+2*(sg>0?0:1),y:g0,roof:GTHATCH});take(gu-1,gu+6,a-1,a+7);L.spots.push({kind:'smithy',u:gu+2,v:a+(sg>0?8:-2),y:g0});
    for(let k=0;k<2;k++){const u0=gu+8+k*5;P.push({k:'stall',u0:u0,u1:u0+2,v0:sg>0?-9:5,v1:sg>0?-6:8,f:sg>0?3:2,y:g0,wool:[WOOLG,WOOLY][k],c:k});}
    L.spots.push({kind:'market',u:gu+11,v:-sg*5,y:g0});}
  P.push({k:'well',u0:gu+16,u1:gu+18,v0:-sg*7-1,v1:-sg*7+1,cu:gu+17,cv:-sg*7,y:g0,roof:GTHATCH});
  // the palisade on its bank, timber towers along it, the gatehouse
  P.push({k:'palisade',u0:-R-6,u1:R+6,v0:-R-6,v1:R+6,f:0,r:R-1,H:7,gw:2,walk:true,ditch:true,y:g0});
  const n=Math.max(6,Math.round(2*Math.PI*R/26));for(let k=1;k<n;k++){const a=Math.PI+k*2*Math.PI/n,cu0=Math.round(Math.cos(a)*(R-1)),cv0=Math.round(Math.sin(a)*(R-1));
    if(Math.abs(cv0)<8&&cu0<0)continue;P.push({k:'ptower',u0:cu0-3,u1:cu0+3,v0:cv0-3,v1:cv0+3,cu:cu0,cv:cv0,h2:2,H:9,y:g0});}
  for(const sd of [1,-1])P.push({k:'ptower',u0:-R-3,u1:-R+3,v0:sd*5-3,v1:sd*5+3,cu:-R,cv:sd*5,h2:2,H:9,y:g0});
  P.push({k:'gatebeam',u0:-R-1,u1:-R+1,v0:-2,v1:2,f:0,y:g0,H:9,gw:2});
  for(const vv of [8,-8])P.push({k:'ladder',u0:-R+3,u1:-R+3,v0:vv,v1:vv,f:0,y0:g0+1,y1:g0+5});
  // the kings' mounds along the road before the royal seat
  if(s.prov.capital)for(let k=0;k<6;k++){const sd=k%2?1:-1,cu0=-R-12-Math.floor(k/2)*11,cv0=sd*(11+(k%3)*2);P.push({k:'mound',u0:cu0-5,u1:cu0+5,v0:cv0-5,v1:cv0+5,cu:cu0,cv:cv0,r:5,hm:4});}
  L.spots.push({kind:'gate',u:-R-8,v:0,y:g0},{kind:'gatein',u:-R+6,v:0,y:g0},{kind:'hall',u:hu0+(D>>1)+5,v:0,y:tierY(top)+2},{kind:'citgate',u:hu0-1,v:0,y:tierY(top)},{kind:'street',u:Math.round(cu-f.r1-8),v:0,y:g0});
}
// The hold: a round wall of fieldstone on its bank over a ditch, the gate in it under the horse heads; within, a round keep at
// the back with a gallery round its top, a hall (a longhouse), stables, a ring for training, a well, hay
function riderHold(s,L,r){
  const R=s.R,g=s.T,P=L.parts;
  P.push({k:'lane',u0:-R+2,u1:4,v0:-2,v1:2,f:0,y:g,id:FSTONE});
  P.push({k:'rtower',u0:4,u1:16,v0:-6,v1:6,cu:10,cv:0,rr:5,H:24,y:g,door:true});
  P.push(longhouse(-9,3,-15,-9,3,{y:g,roof:GTHATCH,door:3,chim:null}));
  P.push({k:'stable',u0:-10,u1:3,v0:8,v1:13,f:2,y:g,roof:TURF});
  P.push({k:'tring',u0:-16,u1:-6,v0:-5,v1:5,cu:-11,cv:0,r:4,y:g});
  P.push({k:'well',u0:4,u1:6,v0:-12,v1:-10,cu:5,cv:-11,y:g,roof:GTHATCH});P.push({k:'hay',u0:5,u1:9,v0:7,v1:11,cu:7,cv:9,y:g});
  P.push({k:'rwall',u0:-R-7,u1:R+7,v0:-R-7,v1:R+7,r:R-1,H:10,gw:2,gh:6,y:g});
  for(const sd of [1,-1]){const a=Math.PI+sd*0.42;P.push({k:'rtower',u0:Math.round(Math.cos(a)*(R-1))-4,u1:Math.round(Math.cos(a)*(R-1))+4,v0:Math.round(Math.sin(a)*(R-1))-4,v1:Math.round(Math.sin(a)*(R-1))+4,cu:Math.round(Math.cos(a)*(R-1)),cv:Math.round(Math.sin(a)*(R-1)),rr:3,H:14,y:g,roof:true});}
  L.spots.push({kind:'gate',u:-R-8,v:0,y:g},{kind:'gatein',u:-R+5,v:0,y:g},{kind:'keep',u:2,v:0,y:g},{kind:'barracks',u:-3,v:-7,y:g},{kind:'drill',u:-11,v:0,y:g},{kind:'stable',u:-3,v:6,y:g});
}
// A steading: longhouses round a green with a thatched well, the mead hall at its back under golden thatch, a smithy, a paddock
// of horses, haystacks; a fence of wattle hurdles round it, open where the lanes run; fields and pasture about it
function riderSteading(s,L,r){
  const R=s.R,g=s.T,P=L.parts,small=R<20,rg=small?5:7,rs=small?10:15;
  for(const [a0,a1,b0,b1] of [[-R,-rg+2,-1,1],[rg-2,R-2,-1,1],[-1,1,-R+3,-rg+2],[-1,1,rg-2,R-3]])P.push({k:'lane',u0:a0,u1:a1,v0:b0,v1:b1,f:0,y:g});
  P.push({k:'ring',u0:-rg,u1:rg,v0:-rg,v1:rg,f:0,y:g,r:rg});P.push({k:'well',u0:-1,u1:1,v0:-1,v1:1,cu:0,cv:0,y:g,roof:GTHATCH});
  P.push({k:'hurdle',u0:-R,u1:R,v0:-R,v1:R,f:0,y:g,r:R-1});
  const slots=[];for(let k=0;k<8;k++){const a=(k*45+22.5)*Math.PI/180,rd=rs+(k%2)*2,cu0=Math.round(Math.cos(a)*rd),cv0=Math.round(Math.sin(a)*rd);slots.push([cu0,cv0,Math.abs(cu0)>Math.abs(cv0)?(cu0<0?1:0):(cv0<0?3:2)]);}
  const order=slots.map((q,i)=>[q,hsh(i,9617,Math.round(s.X))]).sort((a,b)=>a[1]-b[1]).map(q=>q[0]),kinds=['hall','smithy','paddock'];
  order.forEach((q,i)=>{const [cu0,cv0,f]=q,kind=kinds[i]||'house';
    if(kind==='smithy'){if(Math.max(Math.abs(cu0),Math.abs(cv0))+4>R-2)return;P.push(partC('smithy',cu0,cv0,7,6,f,{y:g,roof:GTHATCH}));L.spots.push({kind:'smithy',u:cu0,v:cv0,y:g});return;}
    if(kind==='paddock'){if(Math.max(Math.abs(cu0),Math.abs(cv0))+5>R-2)return;P.push(partC('paddock',cu0,cv0,9,9,f,{y:g}));L.spots.push({kind:'paddock',u:cu0,v:cv0,y:g,horses:small?2:3});return;}
    const hall=kind==='hall',w=hall?9:7,d=hall?15:11;if(Math.max(Math.abs(cu0),Math.abs(cv0))+Math.max(w,d)/2>R-2)return;
    P.push(partC('house',cu0,cv0,w+2,d+2,f,{W:w,D:d,mg:[1,1,1,1],y:g,st:1,sh:hall?5:4,mat:'wattle',roof:hall?GTHATCH:hsh(i,9619,Math.round(s.Z))<0.5?TURF:GTHATCH,pitch:2,horns:true,hearth:true,ridge:'b',door:w>>1,dw:hall?2:1,dh:hall?3:2,lamp:hall}));
    if(hall)L.spots.push({kind:'green',u:cu0*0.55,v:cv0*0.55,y:g});
    const bu=f===0?cu0+d/2+2:f===1?cu0-d/2-2:cu0,bv=f===2?cv0+d/2+2:f===3?cv0-d/2-2:cv0;if(Math.max(Math.abs(bu),Math.abs(bv))<R-3&&hsh(i,9621,Math.round(s.Z))<0.5)P.push({k:'hay',u0:Math.round(bu)-2,u1:Math.round(bu)+2,v0:Math.round(bv)-2,v1:Math.round(bv)+2,cu:Math.round(bu),cv:Math.round(bv),y:g});});
  L.spots.push({kind:'green',u:-3,v:3,y:g},{kind:'green',u:3,v:-3,y:g},{kind:'lane',u:-R+4,v:0,y:g});
  fieldsRound(s,L,r,3);
}
// a fence of wattle hurdles round a steading (p.r its line), open where the lanes leave it
RB.hurdle=(s,p,u,v,X,Z)=>{const d=Math.hypot(u,v);if(d<p.r-0.7||d>=p.r+0.7||Math.abs(u)<=2||Math.abs(v)<=2)return;RBP(X,p.y+1,Z,WATTLE);if(hsh(X,9623,Z)<0.3)RBP(X,p.y+2,Z,STAKES);};
// A horse farm: a long stable under turf, the farmhouse (a longhouse), two paddocks of horses with their troughs, hay
function riderStud(s,L,r){
  const g=s.T,P=L.parts;P.push({k:'lane',u0:-s.R,u1:-2,v0:-1,v1:1,f:0,y:g});
  P.push(longhouse(-6,4,-12,-6,3,{y:g,door:3,chim:null}));
  P.push({k:'stable',u0:-1,u1:12,v0:-4,v1:1,f:2,y:g,roof:TURF});
  P.push({k:'paddock',u0:-12,u1:-4,v0:3,v1:12,f:3,y:g});P.push({k:'paddock',u0:0,u1:9,v0:4,v1:13,f:3,y:g});
  P.push({k:'hay',u0:5,u1:9,v0:-12,v1:-8,cu:7,cv:-10,y:g});
  L.spots.push({kind:'farm',u:-3,v:-2,y:g},{kind:'paddock',u:-8,v:7,y:g,horses:3},{kind:'paddock',u:4,v:8,y:g,horses:3});
  fieldsRound(s,L,r,2);
}
// A beacon on the heights: a palisade ring of stakes, the beacon (a crib of logs under its fire basket, kept lit), a timber
// lookout and a hut of turf
function riderBeacon(s,L,r){
  const R=s.R,g=s.T,P=L.parts;P.push({k:'lane',u0:-R+1,u1:R-1,v0:-R+1,v1:R-1,f:0,y:g,id:PATH});
  P.push({k:'palisade',u0:-R-1,u1:R+1,v0:-R-1,v1:R+1,f:0,r:R-1,H:3,gw:1,y:g});
  P.push({k:'pyre',u0:0,u1:4,v0:-2,v1:2,cu:2,cv:0,y:g});
  P.push({k:'ptower',u0:-5,u1:-1,v0:1,v1:5,cu:-3,cv:3,h2:1,H:8,y:g});
  P.push(housePart(-5,-2,-5,-2,3,[0,0,0,0],{y:g,st:1,sh:3,mat:'wattle',roof:TURF,pitch:2,horns:true,ridge:'b',door:1}));
  L.spots.push({kind:'post',u:-1,v:0,y:g});
}
// ---- Roads of the riders: a broad track of beaten earth with gravel in its ruts and grass along its crown (the riders' road),
// lanes of earth; timber bridges on piles of logs; beside the riders' road a carved post with the horse heads every 72 blocks
function riderRoadCol(X,Z,x,z,rr){
  const o=colInfo(X,Z,TRB),g=o.h,rd=rr.rd,hi=rd.k==='high',ao=Math.abs(rr.off),wet=o.wet||o.river||o.lake||o.b===0||g<o.sl+1;
  if(ao>rd.w+0.5){if(hi&&!wet&&ao<=rd.w+1.5&&rr.off>0&&Math.floor(rr.along)%72===36){RBS(X,Z,g+1,g+2,CTIMBER);RBP(X,g+3,Z,HORNS);}return;}
  if(wet){const y=Math.max(o.sl,o.lake||0)+2,edge=ao>rd.w-0.5;RBP(X,y,Z,PLANKS);if(edge)RBP(X,y+1,Z,LOG);RBS(X,Z,y+(edge?2:1),y+3,AIR);
    if(Math.floor(rr.along)%5===0)for(let yy=y-1;yy>=Math.max(1,g-1);yy--)RBP(X,yy,Z,LOG);return;}
  const top=world[I(x,g,z)];if(top===AIR||top===WATER)return;
  const rut=hi&&ao>rd.w-1.5&&ao<rd.w-0.5,crown=hi&&ao<0.5;
  RBP(X,g,Z,hi?(crown?GRASS:rut&&hsh(X,9625,Z)<0.45?GRAVEL:PATH):hsh(X,9627,Z)<0.12?GRAVEL:PATH);
  for(let y=g+1;y<=g+3;y++){const id=world[I(x,y,z)];if(id&&!SOLID[id])RBP(X,y,Z,AIR);else if(SOLID[id]&&y===g+1)RBP(X,y,Z,AIR);}
}
