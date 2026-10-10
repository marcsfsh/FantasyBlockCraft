// ---- Cave systems (M3.5a, D-028): planned in place of noise. Each region of CR x CR chunks holds one main system and sometimes
// a smaller one: a trunk that winds down from an entrance on a hillside, through the depths, to the Fire Below, with branches
// that end in chambers, some loops back into the trunk, and chambers along the way. Passages meet only at their nodes and keep
// at least three blocks of rock from everything else, so nothing cuts through anything. Passages widen and chambers grow with
// depth. Plans are pure functions of the region; a chunk carves the parts of the plans around it that reach into it.
const CR=10,CRB=CR*CS,caveBaseC=new Map(),cavePlanC=new Map(),caveLinkC=new Map();
// passage half-width by depth (Q84: mostly 3 to 6 wide near the surface, sometimes 2 to 4; wider further down)
function caveRad(y,r){return y>240?(r()<0.25?1.1+r()*0.8:1.6+r()*1.3):y>150?1.8+r()*1.6:y>60?2.4+r()*2.2:2.8+r()*2.4;}
// closest distance between segments p0-p1 and q0-q1
function segDist(ax,ay,az,bx,by,bz,cx,cy,cz,dx,dy,dz){
  const ux=bx-ax,uy=by-ay,uz=bz-az,vx=dx-cx,vy=dy-cy,vz=dz-cz,wx=ax-cx,wy=ay-cy,wz=az-cz;
  const a=ux*ux+uy*uy+uz*uz,b=ux*vx+uy*vy+uz*vz,c=vx*vx+vy*vy+vz*vz,d=ux*wx+uy*wy+uz*wz,e=vx*wx+vy*wy+vz*wz,D=a*c-b*b;
  let s,t;if(a<1e-6&&c<1e-6){s=0;t=0;}else if(a<1e-6){s=0;t=Math.max(0,Math.min(1,e/c));}else if(c<1e-6){t=0;s=Math.max(0,Math.min(1,-d/a));}
  else{s=D<1e-6?0:Math.max(0,Math.min(1,(b*e-c*d)/D));t=(b*s+e)/c;if(t<0){t=0;s=Math.max(0,Math.min(1,-d/a));}else if(t>1){t=1;s=Math.max(0,Math.min(1,(b-d)/a));}}
  const px=wx+s*ux-t*vx,py=wy+s*uy-t*vy,pz=wz+s*uz-t*vz;return Math.sqrt(px*px+py*py+pz*pz);
}
function ptSegDist(px,py,pz,ax,ay,az,bx,by,bz){return segDist(px,py,pz,px,py,pz,ax,ay,az,bx,by,bz);}
// Is a point at depth under a hold or its mines? The deep parts of a system keep out (the holds keep their own deeps).
function caveHoldFree(x,y,z){if(y>=125)return true;const cx=Math.floor(x/CS),cz=Math.floor(z/CS);return holdReach(holdNear(cx,cz),cx,cz)>=2.05;}
// A chamber's bounding sphere, for keeping things apart
function chSphere(c){return c.t===1?{x:c.x,y:c.f+c.h*0.5,z:c.z,r:Math.max(c.L,c.h*0.5)+1}:{x:c.x,y:c.f+c.h*0.35,z:c.z,r:Math.max(c.a,c.b,c.h*0.6)+1};}
// ---- planning
// B: the plan under way: nodes {x,y,z (floor level: the first open cell),ch}, caps (capsules: a and b floor points, radii, edge),
// chambers, edges. `others` are plans whose geometry must also be kept clear (links between regions).
function caveCheckPath(B,pts,a,b,o){
  const x0=B.x0+4,x1=B.x0+CRB-4,z0=B.z0+4,z1=B.z0+CRB-4,na=a>=0?B.nodes[a]:null,nb=b>=0?B.nodes[b]:null;
  for(let k=0;k<pts.length;k+=4){const x=pts[k],y=pts[k+1],z=pts[k+2],rr=pts[k+3];
    if(!o.link&&(x-rr<x0||x+rr>x1||z-rr<z0||z+rr>z1))return false;
    if(y<FIRE_LV+2||y+rr*2.4>H-8)return false;
    if(o.hold?(y>52&&ruinZone(Math.floor(x/CS),Math.floor(z/CS))):!caveHoldFree(x,y,z))return false;
    if(!o.open&&y>SEA-140&&k%8===0&&y+rr*2.4+7>hAt(Math.floor(x),Math.floor(z)))return false;}
  // keep clear of everything not joined to this path (near a shared node, the path may meet its other edges)
  const near=(x,y,z,n,m)=>n&&Math.hypot(x-n.x,y-n.y,z-n.z)<m;
  let bx0=1e9,bx1=-1e9,by0=1e9,by1=-1e9,bz0=1e9,bz1=-1e9,rm=0;for(let k=0;k<pts.length;k+=4){bx0=Math.min(bx0,pts[k]);bx1=Math.max(bx1,pts[k]);by0=Math.min(by0,pts[k+1]);by1=Math.max(by1,pts[k+1]);bz0=Math.min(bz0,pts[k+2]);bz1=Math.max(bz1,pts[k+2]);rm=Math.max(rm,pts[k+3]);}
  for(const P of [B].concat(o.others||[])){
    for(const c of P.caps){
      const m=c.r+rm+4;if(Math.min(c.ax,c.bx)>bx1+m||Math.max(c.ax,c.bx)<bx0-m||Math.min(c.az,c.bz)>bz1+m||Math.max(c.az,c.bz)<bz0-m||Math.min(c.ay,c.by)>by1+m+rm*2||Math.max(c.ay,c.by)<by0-m-rm*2)continue;
      const sharedA=P===B&&(c.na===a||c.nb===a),sharedB=P===B&&(c.na===b||c.nb===b);
      for(let k=0;k+4<pts.length;k+=4){const ax=pts[k],ay=pts[k+1],az=pts[k+2],bx=pts[k+4],by=pts[k+5],bz=pts[k+6],rr=Math.max(pts[k+3],pts[k+7]);
        if(sharedA&&(near(ax,ay,az,na,c.r+rr+12)||near(bx,by,bz,na,c.r+rr+12)))continue;
        if(sharedB&&(near(ax,ay,az,nb,c.r+rr+12)||near(bx,by,bz,nb,c.r+rr+12)))continue;
        if(segDist(ax,ay+rr,az,bx,by+rr,bz,c.ax,c.ay+c.r,c.az,c.bx,c.by+c.r,c.bz)<rr+c.r+3.5)return false;}}
    for(let ci=0;ci<P.ch.length;ci++){const ch=P.ch[ci];if(P===B&&((na&&na.ch===ci)||(nb&&nb.ch===ci)||o.skipCh===ci))continue;const s=chSphere(ch),m=s.r+rm+4;
      if(s.x>bx1+m||s.x<bx0-m||s.z>bz1+m||s.z<bz0-m||s.y>by1+m+rm*2||s.y<by0-m-rm*2)continue;
      for(let k=0;k+4<pts.length;k+=4)if(ptSegDist(s.x,s.y,s.z,pts[k],pts[k+1]+pts[k+3],pts[k+2],pts[k+4],pts[k+5]+pts[k+7],pts[k+6])<s.r+Math.max(pts[k+3],pts[k+7])+3)return false;}
  }
  return true;
}
// A gently curving path between two floor points, sampled about every 3 blocks: [x,y,z,r, ...]
function cavePath(A,Bp,r0,r1,r,kind){
  const dx=Bp.x-A.x,dz=Bp.z-A.z,hd=Math.hypot(dx,dz)||1,nx=-dz/hd,nz=dx/hd,pts=[];
  if(kind==='shaft'){for(let k=0;k<=1;k++){const t=k;pts.push(A.x+dx*t,A.y+(Bp.y-A.y)*t,A.z+dz*t,r0+(r1-r0)*t);}return pts;}
  const o1=(r()-0.5)*0.5*hd,o2=(r()-0.5)*0.5*hd,bulge=r()*0.35,ph=r()*6.28,n=Math.max(2,Math.ceil(hd*1.15/3));
  const p1x=A.x+dx/3+nx*o1,p1z=A.z+dz/3+nz*o1,p2x=A.x+2*dx/3+nx*o2,p2z=A.z+2*dz/3+nz*o2;
  for(let k=0;k<=n;k++){const t=k/n,u=1-t,x=u*u*u*A.x+3*u*u*t*p1x+3*u*t*t*p2x+t*t*t*Bp.x,z=u*u*u*A.z+3*u*u*t*p1z+3*u*t*t*p2z+t*t*t*Bp.z;
    const ty=t*t*(3-2*t)*0.35+t*0.65; // a little flatter at the ends, so passages meet chambers level
    pts.push(x,A.y+(Bp.y-A.y)*ty,z,(r0+(r1-r0)*t)*(1+bulge*Math.sin(Math.PI*t)*(0.7+0.3*Math.sin(ph+t*9))));}
  return pts;
}
// A spiral descent around a centre beside A: [path, end point]
function caveSpiral(A,drop,rr,r,dir){
  const R=5.5+r()*3,cx=A.x+Math.cos(dir+1.5708)*R,cz=A.z+Math.sin(dir+1.5708)*R,a0=Math.atan2(A.z-cz,A.x-cx),sgn=r()<0.5?1:-1,turns=drop/(0.42*2*Math.PI*R),n=Math.ceil(turns*2*Math.PI*R/3),pts=[];
  for(let k=0;k<=n;k++){const t=k/n,ang=a0+sgn*t*turns*2*Math.PI;pts.push(cx+Math.cos(ang)*R,A.y-drop*t,cz+Math.sin(ang)*R,rr);}
  return pts;
}
function caveAddEdge(B,a,b,pts,o){
  const e=B.edges.length;B.edges.push({a:a,b:b,pts:pts,open:!!o.open,fill:!!o.fill});
  for(let k=0;k+4<pts.length;k+=4)B.caps.push({ax:pts[k],ay:pts[k+1],az:pts[k+2],bx:pts[k+4],by:pts[k+5],bz:pts[k+6],r:Math.max(pts[k+3],pts[k+7]),e:e,na:a,nb:b});
  return e;
}
function caveNode(B,x,y,z){B.nodes.push({x:x,y:y,z:z,ch:-1});return B.nodes.length-1;}
// Chambers: t 0 domed hall (a,b radii, h height, angle), 1 rift (L half-length, w half-width, h height), 2 stepped hall
function caveChamber(B,ni,r,dir,big){
  const n=B.nodes[ni],y=n.y;let c;
  const q=r();
  if(y>240)c={t:0,a:4+r()*4,b:4+r()*4,h:4+r()*3};
  else if(y>150)c=q<0.22?{t:1,L:12+r()*10,w:2+r()*1.5,h:14+r()*12}:{t:0,a:8+r()*9,b:8+r()*9,h:8+r()*8};
  else c=q<0.25?{t:1,L:18+r()*18,w:3+r()*2,h:22+r()*28}:q<0.5?{t:2,a:12+r()*12,b:12+r()*12,h:12+r()*12}:{t:0,a:18+r()*20,b:18+r()*20,h:18+r()*22};
  if(big&&c.t===0){c.a*=1.2;c.b*=1.2;c.h*=1.15;}
  c.ang=c.t===1?dir+1.5708*(r()<0.5?1:-1)*0.6:c.t===2?dir:r()*6.283;c.x=n.x;c.z=n.z;c.seed=Math.floor(r()*1e6);
  c.f=Math.round(y);if(c.t===2){c.s=4+Math.floor(r()*3);c.drop=Math.floor(2*c.a/c.s);c.f0=c.f+Math.floor(c.a/c.s);} // a stepped hall's node sits on its middle terrace
  // floor at the node: for a stepped hall the node sits on its middle terrace
  for(let tries=0;tries<3;tries++){
    const s=chSphere(c);let ok=true;
    const R=c.t===1?c.L:Math.max(c.a,c.b);
    if(c.x-R<B.x0+5||c.x+R>B.x0+CRB-5||c.z-R<B.z0+5||c.z+R>B.z0+CRB-5)ok=false;
    if(ok&&c.f+c.h+9>SEA-140)for(const [px,pz] of [[0,0],[R,0],[-R,0],[0,R],[0,-R]])if(c.f+c.h+9>hAt(Math.floor(c.x+px),Math.floor(c.z+pz))){ok=false;break;}
    if(ok&&!(caveHoldFree(c.x-R,c.f,c.z)&&caveHoldFree(c.x+R,c.f,c.z)&&caveHoldFree(c.x,c.f,c.z-R)&&caveHoldFree(c.x,c.f,c.z+R)))ok=false;
    if(ok&&c.f<FIRE_LV+18)ok=false;
    if(ok)for(const cap of B.caps){if(cap.na===ni||cap.nb===ni)continue;if(ptSegDist(s.x,s.y,s.z,cap.ax,cap.ay+cap.r,cap.az,cap.bx,cap.by+cap.r,cap.bz)<s.r+cap.r+3){ok=false;break;}}
    if(ok)for(const o of B.ch){const t=chSphere(o);if(Math.hypot(s.x-t.x,s.y-t.y,s.z-t.z)<s.r+t.r+4){ok=false;break;}}
    if(ok){B.ch.push(c);n.ch=B.ch.length-1;return true;}
    if(c.t===1){c.L*=0.7;c.h*=0.75;}else{c.a*=0.7;c.b*=0.7;c.h*=0.8;}
    if(c.t===2){c.drop=Math.floor(2*c.a/c.s);c.f0=c.f+Math.floor(c.a/c.s);}
    if((c.t===1?c.L:c.a)<4)break;
  }
  return false;
}
// Try a step of the trunk (or a branch) from node ni in direction dir, going down by about `drop`: returns the new node or -1
function caveStep(B,ni,dir,kind,r,o){
  const n=B.nodes[ni],y=n.y,r0=caveRad(y,r);let pts,end;
  if(kind==='spiral'){const drop=o.drop||18+r()*20;pts=caveSpiral(n,drop,r0,r,dir);const L=pts.length;end={x:pts[L-4],y:pts[L-3],z:pts[L-2]};}
  else{
    const hd=kind==='steep'?14+r()*12:(y>240?20+r()*16:y>150?24+r()*18:28+r()*22),slope=kind==='steep'?0.75+r()*0.25:kind==='flat'?(r()-0.6)*0.25:0.22+r()*0.33;
    end={x:n.x+Math.cos(dir)*hd,y:Math.max(o.floorY||0,y-hd*slope),z:n.z+Math.sin(dir)*hd};if(o.to){end=o.to;}
    pts=cavePath(n,end,r0,caveRad(end.y,r),r,kind);}
  const bi=o.toNode!==undefined?o.toNode:-1;
  if(!caveCheckPath(B,pts,ni,bi,o))return -1;
  const nb=bi>=0?bi:caveNode(B,end.x,end.y,end.z);caveAddEdge(B,ni,nb,pts,o);return nb;
}
// The entrance: the steepest dry hillside among some spots of the region, a passage into the hill from its foot
// (a mouth), or failing that a level dry spot (a sinkhole with a spiral way down), or null (all water)
function caveEntrance(B,r,mx){
  let best=null,flat=null;const o={};
  for(let k=0;k<28;k++){const X=B.x0+mx+Math.floor(r()*(CRB-2*mx)),Z=B.z0+mx+Math.floor(r()*(CRB-2*mx)),h=hAt(X,Z);
    if(h<SEA+3)continue;colInfo(X,Z,o);if(o.wet||o.lake||o.river||o.b===0||o.rvBot<999||ruinZone(Math.floor(X/CS),Math.floor(Z/CS)))continue;
    let sl=0;for(let d=0;d<8;d++){const a=d*0.785,ux=Math.cos(a),uz=Math.sin(a),rise=hAt(Math.round(X+ux*7),Math.round(Z+uz*7))-h;sl=Math.max(sl,Math.abs(rise));
      if(rise>=4&&(!best||rise>best.rise))best={X:X,Z:Z,h:h,a:a,rise:rise};}
    if(sl<=2&&!flat)flat={X:X,Z:Z,h:h,a:r()*6.283,flat:true};}
  return best||flat;
}
function caveSystem(B,r,kind){
  const main=kind===0,mx=main?16:22,ent=B.war?null:(main||r()<0.15)?caveEntrance(B,r,mx):null; // under a warren the ways in are the warren's (D-052)
  const s0=B.nodes.length;let cur=-1;
  if(ent&&!ent.flat){ // a mouth at the foot of a slope, then into the hill, gently down
    const e=caveNode(B,ent.X+0.5-Math.cos(ent.a)*2,ent.h+1,ent.Z+0.5-Math.sin(ent.a)*2);
    for(let t=0;t<4&&cur<0;t++){const hd=14+r()*8,a=ent.a+(r()-0.5)*0.6;cur=caveStep(B,e,a,'ramp',r,{open:true,to:{x:ent.X+Math.cos(a)*hd,y:ent.h-4-r()*4,z:ent.Z+Math.sin(a)*hd}});}
    if(cur>=0)B.ents.push(e);else B.nodes.length=s0;}
  else if(ent){ // a sinkhole: a round pit with a ramp spiralling down its wall
    const e=caveNode(B,ent.X+0.5,ent.h+1,ent.Z+0.5);for(let t=0;t<3&&cur<0;t++)cur=caveStep(B,e,ent.a+t*2,'spiral',r,{open:true,drop:16+r()*10});
    if(cur>=0)B.ents.push(e);else B.nodes.length=s0;}
  if(cur<0&&B.war&&main&&B.war.down>=0)cur=B.war.down; // the main system goes on down from the foot of the warren's way down
  if(cur<0){ // no way in from here: the system starts in the rock (other ways down may reach it), under the warren if there is one
    const X=B.cx+(r()-0.5)*40,Z=B.cz+(r()-0.5)*40,y=Math.min(hAt(Math.floor(X),Math.floor(Z))-30,SEA-20,B.war?WAR_Y0-14:1e9);cur=caveNode(B,X,y,Z);}
  const ent2=ent||{a:r()*6.283};
  // the trunk winds down; the main one reaches the Fire Below, a smaller one stops in the middle depths
  const bottom=main?30+r()*14:kind===1?40+r()*140:150+r()*90,trunk=[cur];let dir=ent2.a,fails=0;
  while(B.nodes[cur].y>bottom+3&&trunk.length<40&&fails<3){
    const y=B.nodes[cur].y,q=r(),kind=q<(y>240?0.12:0.22)?'spiral':q<0.42?'steep':'ramp';let nx=-1;
    for(let t=0;t<10&&nx<0;t++){
      let d=dir+(r()-0.5)*(1.2+t*0.4);const n=B.nodes[cur],cxr=B.cx-n.x,czr=B.cz-n.z;
      if(Math.hypot(cxr,czr)>CRB*0.4&&t%2===1)d=Math.atan2(czr,cxr)+(r()-0.5)*0.8; // turn back toward the middle of the region
      nx=caveStep(B,cur,d,t>6&&kind==='spiral'?'ramp':kind,r,{floorY:bottom});
      if(nx>=0)dir=kind==='spiral'?Math.atan2(B.nodes[nx].z-B.nodes[cur].z,B.nodes[nx].x-B.nodes[cur].x)+(r()-0.5):d;}
    if(nx<0){fails++;dir+=2;continue;}
    trunk.push(nx);cur=nx;
    const yy=B.nodes[nx].y;if(r()<(yy>240?0.3:yy>150?0.45:0.6))caveChamber(B,nx,r,dir,false);
  }
  if(main&&B.nodes[cur].y<bottom+12){B.deep=cur;if(B.nodes[cur].ch<0)caveChamber(B,cur,r,dir,true);if(r()<0.5)caveGorge(B,cur,r);caveToFire(B,cur,r);}
  // a stream: pools stepping down a run of the trunk, to follow down (Q83)
  if(r()<0.6){const i0=1+Math.floor(r()*Math.max(1,trunk.length-4));for(let i=i0;i<i0+4&&i<trunk.length;i++){const e=B.edges.find(q=>q.b===trunk[i]&&q.a===trunk[i-1]);if(e&&e.pts.length>12&&B.nodes[trunk[i]].y>70)e.stream=true;}}
  // branches: a short way off the trunk, ending in a chamber, a loop back into the trunk, or a drop down a shaft
  for(let i=1;i<trunk.length;i++){
    const ti=trunk[i],y=B.nodes[ti].y;if(r()>(y>240?0.45:0.6))continue;
    let b=ti,len=1+Math.floor(r()*3),d=r()*6.283;
    for(let k=0;k<len;k++){let nx=-1;for(let t=0;t<6&&nx<0;t++){d+=(r()-0.5)*1.4;nx=caveStep(B,b,d,'flat',r,{});}if(nx<0)break;b=nx;}
    if(b===ti)continue;
    const nb=B.nodes[b];let done=false;
    // a loop: back into a later trunk node nearby, if the way is clear and not too steep (Q81)
    for(let j=i+2;j<trunk.length&&!done;j++){const tn=B.nodes[trunk[j]],hd=Math.hypot(tn.x-nb.x,tn.z-nb.z),dy=nb.y-tn.y;
      if(hd<8&&dy>12&&dy<60&&r()<0.5){if(caveStep(B,b,0,'shaft',r,{to:tn,toNode:trunk[j]})>=0)done=true;}                // a shaft straight down
      else if(hd>12&&hd<46&&Math.abs(dy)<hd*0.8){if(caveStep(B,b,0,'ramp',r,{to:tn,toNode:trunk[j]})>=0)done=true;}}
    if(!done&&r()<0.75)caveChamber(B,b,r,d,false);
  }
  // a high window into a rift: a passage from higher up ends in the rift's wall, looking down into it (chasms, Q83)
  for(let ci=0;ci<B.ch.length;ci++){const c=B.ch[ci];if(c.t!==1||c.h<20||r()>0.6)continue;
    const side=r()<0.5?1:-1,wy=Math.floor(c.f+c.h*(0.55+r()*0.15)),u=c.L*0.4*(r()<0.5?1:-1),wx=c.x+Math.cos(c.ang)*u-Math.sin(c.ang)*side*(c.w+1),wz=c.z+Math.sin(c.ang)*u+Math.cos(c.ang)*side*(c.w+1);
    let from=-1,bd=1e9;for(let k=s0;k<B.nodes.length;k++){const n=B.nodes[k];if(n.y<wy+2||n.y>wy+30||n.ch===ci)continue;const d=Math.hypot(n.x-wx,n.z-wz);if(d>18&&d<60&&d<bd){bd=d;from=k;}}
    if(from<0)continue;
    const tgt=caveNode(B,wx,wy,wz),pts=cavePath(B.nodes[from],{x:wx,y:wy,z:wz},caveRad(wy,r),2,r,'ramp');
    if(caveCheckPath(B,pts,from,tgt,{skipCh:ci}))caveAddEdge(B,from,tgt,pts,{});else B.nodes.pop();
  }
}
// A gorge beside the deepest hall: a rift that drops from a crack in the hall's floor to the lava sea, so a river of lava
// runs along its bottom (Q87). Kept clear of everything but its hall.
function caveGorge(B,ni,r){
  const n=B.nodes[ni],hc=B.ch[n.ch];if(!hc||hc.t===1)return;
  const dir=r()*6.283,L=18+r()*12,f=FIRE_LV+1,h=Math.min(80,(hc.f-f+8)/0.9);
  const c={t:1,L:L,w:2.5+r()*1.8,h:h,ang:dir,x:hc.x+Math.cos(dir)*L*0.35,z:hc.z+Math.sin(dir)*L*0.35,f:f,seed:Math.floor(r()*1e6),gorge:true};
  if(c.x-L<B.x0+5||c.x+L>B.x0+CRB-5||c.z-L<B.z0+5||c.z+L>B.z0+CRB-5)return;
  const ex=Math.cos(dir)*L,ez=Math.sin(dir)*L;
  for(const [a,b] of [[c.x-ex,c.z-ez],[c.x,c.z],[c.x+ex,c.z+ez]])if(!caveHoldFree(a,f,b))return;
  for(const cap of B.caps){if(cap.na===ni||cap.nb===ni)continue;
    for(const fr of [0.2,0.5,0.8]){const y=f+h*fr;if(segDist(c.x-ex,y,c.z-ez,c.x+ex,y,c.z+ez,cap.ax,cap.ay+cap.r,cap.az,cap.bx,cap.by+cap.r,cap.bz)<c.w+cap.r+6)return;}}
  for(const o of B.ch){if(o===hc)continue;const t=chSphere(o);if(ptSegDist(t.x,t.y,t.z,c.x-ex,f+h*0.5,c.z-ez,c.x+ex,f+h*0.5,c.z+ez)<t.r+c.w+h*0.5)return;}
  B.ch.push(c);hc.gorge=B.ch.length-1;
}
// A lava fall in the wall of a deep hall: lava wells from a slot in the rock and pours into a small pool sunk in the floor,
// rimmed with stone. The slot's open face is the only one; source and pool are held in rock (Q87).
function caveFall(c,r){
  const th=r()*6.283,ux=Math.cos(th),uz=Math.sin(th),ax=Math.abs(ux)>=Math.abs(uz),dx=ax?Math.sign(ux):0,dz=ax?0:Math.sign(uz),sx=ax?0:1,sz=ax?1:0;
  let E=null;for(let s=0;s<Math.max(c.a,c.b)*1.4;s+=0.5){const X=Math.floor(c.x+ux*s),Z=Math.floor(c.z+uz*s),q=chCol(c,X,Z);if(!q)break;E=[X,Z,q];}
  if(!E||E[2][1]-E[2][0]<4)return null;
  const fe=E[2][0],WX=E[0]+dx,WZ=E[1]+dz,S=chSphere(c);
  for(const [a,b] of [[WX,WZ],[WX+sx,WZ+sz],[WX-sx,WZ-sz],[WX+dx,WZ+dz]])if(chCol(c,a,b))return null;
  if(Math.hypot(WX+dx+0.5-S.x,WZ+dz+0.5-S.z)>S.r-1)return null;
  for(const [a,b] of [[E[0]+sx,E[1]+sz],[E[0]-sx,E[1]-sz]]){const q=chCol(c,a,b);if(!q||q[0]<fe||q[0]>fe+1)return null;}
  // the rim: where the floor beside the pool is open at the pool's level, a stone lip holds it (resting on rock)
  const rim=[];for(const [a,b] of [[E[0]-dx,E[1]-dz],[E[0]-dx+sx,E[1]-dz+sz],[E[0]-dx-sx,E[1]-dz-sz],[E[0]+2*sx,E[1]+2*sz],[E[0]-2*sx,E[1]-2*sz]]){const q=chCol(c,a,b);if(!q)continue;if(q[0]<fe-1)return null;if(q[0]<=fe-1)rim.push(a,b);}
  return {t:3,wx:WX,wz:WZ,ex:E[0],ez:E[1],sx:sx,sz:sz,fe:fe,hs:Math.max(5,Math.min(10,E[2][1]-fe-1)),rim:rim};
}
// The last way down: from the deepest hall to an island of the lava sea, on a causeway of fallen rock where it crosses the sea
function caveToFire(B,ni,r){
  const n=B.nodes[ni];let best=null;
  for(let k=0;k<40;k++){const a=r()*6.283,d=24+r()*44,X=Math.floor(n.x+Math.cos(a)*d),Z=Math.floor(n.z+Math.sin(a)*d);
    if(X<B.x0+8||X>B.x0+CRB-8||Z<B.z0+8||Z>B.z0+CRB-8||!seaOpen(X,Z))continue;const v=seaIsle(X,Z);if(v>0.36&&(!best||v>best.v))best={X:X,Z:Z,v:v};}
  if(!best)return;
  const to={x:best.X+0.5,y:FIRE_LV+2,z:best.Z+0.5},hd=Math.hypot(to.x-n.x,to.z-n.z);if(n.y-to.y>hd*1.0)return;
  const pts=cavePath(n,to,caveRad(n.y,r),3,r,'ramp');
  // only the part above the sea's ceiling has to keep clear of the plan; below it is the open sea
  const keep=[];for(let k=0;k<pts.length;k+=4)if(pts[k+1]>seaCeil(Math.floor(pts[k]),Math.floor(pts[k+2]))+2)keep.push(pts[k],pts[k+1],pts[k+2],pts[k+3]);
  if(keep.length>=8&&!caveCheckPath(B,keep,ni,-1,{}))return;
  const e=caveNode(B,to.x,to.y,to.z);caveAddEdge(B,ni,e,pts,{fill:true});B.fire=e;
}
function caveBase(rx,rz){
  const key=ckey(rx,rz);let B=caveBaseC.get(key);if(B)return B;if(caveBaseC.size>600)caveBaseC.clear();
  const r=rngAt(rx,7101,rz);B={rx:rx,rz:rz,x0:rx*CRB,z0:rz*CRB,nodes:[],edges:[],caps:[],ch:[],ents:[],deep:-1,fire:-1};
  B.cx=B.x0+CRB/2+(r()-0.5)*70;B.cz=B.z0+CRB/2+(r()-0.5)*70; // the systems wander around a point off the middle, so regions do not show as a grid
  if(warRegion(rx,rz))warrenPlan(B); // the goblin warrens under the Volcanic Wastes come first (D-052)
  caveSystem(B,r,0);if(r()<0.85)caveSystem(B,r,1);if(r()<0.5)caveSystem(B,r,2);
  // other peoples' remains stand in some of the great halls away from the holds (D-024)
  const rr=rngAt(rx,6501,rz);if(rr()<0.42){const halls=B.ch.filter(c=>c.t===0&&c.a>=11&&c.b>=11&&c.f<104&&c.h>=10&&c.gorge===undefined);if(halls.length)halls[Math.floor(rr()*halls.length)].rem=rr();}
  // a stepped hall stays dry when one of its own passages runs low beside the water (anything else keeps its distance)
  for(let ni=0;ni<B.nodes.length;ni++){const c=B.ch[B.nodes[ni].ch];if(!c||c.t!==2)continue;const L=caveLake(c),R=Math.max(c.a,c.b)*1.25+2,wet=[];
    for(let X=Math.floor(c.x-R);X<=c.x+R;X++)for(let Z=Math.floor(c.z-R);Z<=c.z+R;Z++){const q=chCol(c,X,Z);if(q&&q[0]<L)wet.push(X+0.5,Z+0.5);}
    for(const e of B.edges){if(c.dry||(e.a!==ni&&e.b!==ni))continue;for(let k=0;k<e.pts.length&&!c.dry;k+=4){if(e.pts[k+1]>=L+2)continue;const rr=e.pts[k+3]+2.5;
      for(let w=0;w<wet.length;w+=2)if(Math.hypot(wet[w]-e.pts[k],wet[w+1]-e.pts[k+2])<rr){c.dry=true;break;}}}}
  B.falls=[];const rf=rngAt(rx,7161,rz);for(const c of B.ch){if(c.t!==0||c.f>=80||c.rem!==undefined||rf()>0.45)continue;const fl=caveFall(c,rf);if(fl)B.falls.push(fl);}
  if(B.war)warrenFinish(B);
  caveBaseC.set(key,B);return B;
}
// A link from a system down into the upper gallery (y44) of a hold's mines nearby, so a hold can be found from below (Q99)
function caveHoldLink(rx,rz){
  const key=ckey(rx,rz)+'h';if(caveLinkC.has(key))return caveLinkC.get(key);if(caveLinkC.size>1200)caveLinkC.clear();
  let L=null;const r=rngAt(rx,7171,rz),B=caveBase(rx,rz),ccx=rx*CR+CR/2,ccz=rz*CR+CR/2,h=holdNear(ccx,ccz);
  if(r()<0.7&&holdReach(h,ccx,ccz)<3.6){
    const cand=[];
    for(let cx=rx*CR-CR+1;cx<rx*CR+2*CR-1;cx++)for(let cz=rz*CR-CR+1;cz<rz*CR+2*CR-1;cz++){if(!galRow(cz,2)||!mineZone(cx,cz)||ruinZone(cx,cz))continue;
      const tx=cx*CS+8,tz=cz*CS+8;
      for(let ni=0;ni<B.nodes.length;ni++){const n=B.nodes[ni];if(n.y<52||n.y>130||!caveHoldFree(n.x,n.y,n.z))continue;const hd=Math.hypot(tx-n.x,tz-n.z),dy=n.y-44;
        if(hd>20&&hd<120&&dy<hd*0.8)cand.push({ni:ni,tx:tx,tz:tz,hd:hd});}}
    cand.sort((a,b)=>a.hd-b.hd);const others=[];for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(a||b)others.push(caveBase(rx+a,rz+b));
    for(let k=0;k<Math.min(6,cand.length)&&!L;k++){const c=cand[k],n=B.nodes[c.ni],ux=(c.tx+0.5-n.x)/c.hd,uz=(c.tz+0.5-n.z)/c.hd;
      // down to the gallery's level a little short of it, then level into the gallery
      const pts=cavePath(n,{x:c.tx+0.5-ux*12,y:44,z:c.tz+0.5-uz*12},caveRad(n.y,r),2.2,r,'ramp');for(let t=1;t<=4;t++)pts.push(c.tx+0.5-ux*(12-3*t),44,c.tz+0.5-uz*(12-3*t),2.2);
      // keep out of the mines' great pits, which would leave the way down without a floor
      let pit=false;for(let q=0;q<pts.length&&!pit;q+=4)if(pts[q+1]<60)for(const dy of [0,-2,-5])if(inPit(Math.floor(pts[q]),Math.floor(pts[q+1])+dy,Math.floor(pts[q+2]))){pit=true;break;}
      if(!pit&&caveCheckPath(B,pts,c.ni,-1,{link:true,hold:true,others:others}))L={pts:pts};}}
  caveLinkC.set(key,L);return L;
}
// A deep way between the deepest halls of neighbouring regions (east: dx 1, south: dz 1), kept clear of both plans
function caveLink(rx,rz,dx,dz){
  const key=ckey(rx,rz)+(dx?'e':'s');if(caveLinkC.has(key))return caveLinkC.get(key);if(caveLinkC.size>1200)caveLinkC.clear();
  let L=null;const r=rngAt(rx*2+dx,7131,rz*2+dz);
  if(r()<0.6){const A=caveBase(rx,rz),Bq=caveBase(rx+dx,rz+dz);
    if(A.deep>=0&&Bq.deep>=0){const a=A.nodes[A.deep],b=Bq.nodes[Bq.deep],hd=Math.hypot(b.x-a.x,b.z-a.z);
      if(Math.abs(a.y-b.y)<hd*0.45){const pts=cavePath(a,b,caveRad(a.y,r),caveRad(b.y,r),r,'ramp');
        const tmp={x0:A.x0,z0:A.z0,nodes:A.nodes,caps:A.caps,ch:A.ch};
        // the two ends are the halls themselves; everything else in both regions must stay clear
        if(caveCheckPath(tmp,pts,A.deep,-1,{link:true,others:[{caps:Bq.caps.filter(c=>c.na!==Bq.deep&&c.nb!==Bq.deep),ch:Bq.ch.filter((c,i)=>i!==Bq.nodes[Bq.deep].ch)}]}))L={pts:pts};}}}
  caveLinkC.set(key,L);return L;
}
// The full plan of a region: its systems and the links it owns, as carving elements indexed by the chunks they reach
function cavePlan(rx,rz){
  const key=ckey(rx,rz);let P=cavePlanC.get(key);if(P)return P;if(cavePlanC.size>300)cavePlanC.clear();
  const B=caveBase(rx,rz),els=[],byChunk=new Map();
  const index=(el,x0,x1,z0,z1)=>{els.push(el);for(let a=Math.floor(x0/CS);a<=Math.floor(x1/CS);a++)for(let b=Math.floor(z0/CS);b<=Math.floor(z1/CS);b++){const k=ckey(a,b);let l=byChunk.get(k);if(!l)byChunk.set(k,l=[]);l.push(el);}};
  const addPath=(pts,open,fill)=>{for(let k=0;k+4<pts.length;k+=4){const r=Math.max(pts[k+3],pts[k+7])+1;
    index({t:9,ax:pts[k],ay:pts[k+1],az:pts[k+2],bx:pts[k+4],by:pts[k+5],bz:pts[k+6],ra:pts[k+3],rb:pts[k+7],open:open,fill:fill},Math.min(pts[k],pts[k+4])-r,Math.max(pts[k],pts[k+4])+r,Math.min(pts[k+2],pts[k+6])-r,Math.max(pts[k+2],pts[k+6])+r);}};
  for(const e of B.edges)addPath(e.pts,e.open,e.fill);
  for(const c of B.ch){const R=(c.t===1?c.L:Math.max(c.a,c.b))*1.25+3;index(c,c.x-R,c.x+R,c.z-R,c.z+R);}
  for(const [dx,dz] of [[1,0],[0,1]]){const L=caveLink(rx,rz,dx,dz);if(L)addPath(L.pts,false,false);}
  {const L=caveHoldLink(rx,rz);if(L)addPath(L.pts,false,false);}
  for(const f of B.falls)index(f,Math.min(f.wx,f.ex)-3,Math.max(f.wx,f.ex)+3,Math.min(f.wz,f.ez)-3,Math.max(f.wz,f.ez)+3);
  // pools down a stream: each sunk two deep below the lowest floor around it, so rock holds it on every side
  for(const e of B.edges){if(!e.stream)continue;const p=e.pts;
    const floorAt=(X,Z)=>edgeFloor(p,X,Z);
    for(let k=12;k+12<p.length;k+=16){const cx=Math.floor(p[k]),cz=Math.floor(p[k+2]);let Lw=1e9;
      for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++)if(a*a+b*b<=7)Lw=Math.min(Lw,floorAt(cx+a,cz+b));
      if(Lw>=1e9)continue;const cells=[];for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)if(a*a+b*b<=2.6&&floorAt(cx+a,cz+b)<1e9)for(let y=Lw-2;y<Lw;y++)cells.push(cx+a,y,cz+b);
      if(cells.length)index({t:4,cells:cells,x:cx,z:cz},cx-3,cx+3,cz-3,cz+3);}}
  // where to stand in a passage: points every few blocks, for places that open onto a cave (caveAnchor)
  const anchors=new Map();
  for(const e of B.edges){if(e.open||e.fill||e.war)continue;for(let k=0;k<e.pts.length;k+=8){const x=Math.floor(e.pts[k]),z=Math.floor(e.pts[k+2]),f=edgeFloor(e.pts,x,z);if(f>=1e9||B.ch.some(c=>chCol(c,x,z)))continue;const y=f+1,ck=ckey(Math.floor(x/CS),Math.floor(z/CS));let l=anchors.get(ck);if(!l)anchors.set(ck,l=[]);l.push(x,y,z);}}
  P={B:B,els:els,byChunk:byChunk,anchors:anchors};cavePlanC.set(key,P);return P;
}
// The real floor of a passage at a column: the lowest cell its capsules open (the same test as carveCap), or 1e9 if none.
// On a slope it lies a block or two under the floor line.
function edgeFloor(p,X,Z){let lo=1e9;for(let k=0;k+4<p.length;k+=4){const e={ax:p[k],ay:p[k+1],az:p[k+2],bx:p[k+4],by:p[k+5],bz:p[k+6],ra:p[k+3],rb:p[k+7]},R=Math.max(e.ra,e.rb)+1;
  if(X+0.5<Math.min(e.ax,e.bx)-R||X+0.5>Math.max(e.ax,e.bx)+R||Z+0.5<Math.min(e.az,e.bz)-R||Z+0.5>Math.max(e.az,e.bz)+R)continue;
  for(let Y=Math.floor(Math.min(e.ay,e.by))-3;Y<=Math.ceil(Math.max(e.ay,e.by))+3&&Y<lo;Y++)if(capOpens(e,X,Y,Z)){lo=Y;break;}}return lo;}
// Is (X,Z) at or near the opening of a cave entrance (a mouth or sinkhole)? Surface features keep off it (surfTaken).
function caveMouthNear(X,Z,m){
  const rx=Math.floor(X/CRB),rz=Math.floor(Z/CRB);
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const B=caveBase(rx+a,rz+b);
    for(const e of B.edges){if(!e.open)continue;const p=e.pts;
      for(let k=0;k+4<p.length;k+=4){const rr=Math.max(p[k+3],p[k+7])+m+1.5;if(Math.min(p[k],p[k+4])>X+rr||Math.max(p[k],p[k+4])<X-rr||Math.min(p[k+2],p[k+6])>Z+rr||Math.max(p[k+2],p[k+6])<Z-rr)continue;
        if(ptSegDist(X+0.5,0,Z+0.5,p[k],0,p[k+2],p[k+4],0,p[k+6])<rr&&p[k+1]>hAt(X,Z)-8)return true;}}}
  return false;
}
// A point in a passage of a cave system inside chunk (WCX,WCZ)'s middle and within a height band, or null; y is one above the
// floor (the place's passage ends on y-1). A structure that opens onto it is always connected to the caves (Q22, Q24).
function caveAnchor(WCX,WCZ,y0,y1,salt){
  const P=cavePlan(Math.floor(WCX/CR),Math.floor(WCZ/CR)),l=P.anchors.get(ckey(WCX,WCZ));if(!l)return null;
  const x0=WCX*CS,z0=WCZ*CS,c=[];
  for(let k=0;k<l.length;k+=3){const x=l[k],y=l[k+1],z=l[k+2];if(y<y0||y>y1||x<x0+2||x>=x0+14||z<z0+2||z>=z0+14)continue;c.push(k);}
  if(!c.length)return null;const k=c[Math.floor(hsh(WCX,salt,WCZ)*c.length)];return{x:l[k],y:l[k+1],z:l[k+2]};
}
// ---- carving
function caveEls(WCX,WCZ){const rx=Math.floor(WCX/CR),rz=Math.floor(WCZ/CR),out=[],k=ckey(WCX,WCZ);
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const l=cavePlan(rx+a,rz+b).byChunk.get(k);if(l)for(const e of l)out.push(e);}return out;}
function lakeNear(X,Z,Y){for(const d of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]){const lk=lakeAt(X+d[0],Z+d[1]);if(lk&&lk.L>=Y&&Math.hypot(X+d[0]-lk.cx,Z+d[1]-lk.cz)<lk.R+8)return true;}return false;}
// open one cell, unless it must stay: bedrock, fluids, what holds up water above, the shores of surface lakes, or (away from
// entrances) the last seven blocks under the ground
function caveCut(X,Y,Z,gh,open){
  if(Y<1||Y>H-2||(!open&&Y>gh-7)||(gh<SEA+2&&Y>gh-5))return;
  const i=I(X-OX,Y,Z-OZ),id=world[i];if(id===AIR||id===BEDROCK||id===WATER||id===LAVA)return;
  if(Y+1<H&&world[i+W*D]===WATER)return;if(Y>=SEA&&Y>gh-12&&lakeNear(X,Z,Y))return;
  world[i]=AIR;lvl[i]=0;
}
// Is a cell inside capsule e: 0 outside, 1 inside below the floor line, 2 open. The floor line runs through the floor points; the
// passage is an ellipse above it, flat at the bottom. Sets capH (horizontal distance squared, in radii) and capFy (floor height).
let capH=0,capFy=0;
function capTest(e,X,Y,Z,dx,dy,dz,L2,RV){
  const px=X+0.5,pz=Z+0.5;let t=((px-e.ax)*dx+(Y+0.5-e.ay-RV*0.6)*dy+(pz-e.az)*dz)/L2;t=t<0?0:t>1?1:t;
  const r=e.ra+(e.rb-e.ra)*t,rv=Math.max(1.7,r*1.05),fy=e.ay+dy*t,cy=fy+rv*0.62,hx=(px-e.ax-dx*t)/r,hz=(pz-e.az-dz*t)/r,vy=(Y+0.5-cy)/rv;
  capH=hx*hx+hz*hz;capFy=fy;if(capH+vy*vy>=1)return 0;return Y+0.5<fy?1:2;
}
function capOpens(e,X,Y,Z){const dx=e.bx-e.ax,dy=e.by-e.ay,dz=e.bz-e.az,L2=dx*dx+dy*dy+dz*dz||1e-6,RV=Math.max(1.7,Math.max(e.ra,e.rb))*1.05;return capTest(e,X,Y,Z,dx,dy,dz,L2,RV)===2;}
function carveCap(e){
  const xa=gx0,xb=gx0+CS-1,za=gz0,zb=gz0+CS-1,R=Math.max(e.ra,e.rb),RV=Math.max(1.7,R)*1.05;
  const X0=Math.max(xa,Math.floor(Math.min(e.ax,e.bx)-R)),X1=Math.min(xb,Math.ceil(Math.max(e.ax,e.bx)+R)),Z0=Math.max(za,Math.floor(Math.min(e.az,e.bz)-R)),Z1=Math.min(zb,Math.ceil(Math.max(e.az,e.bz)+R));
  if(X0>X1||Z0>Z1)return;
  const dx=e.bx-e.ax,dy=e.by-e.ay,dz=e.bz-e.az,L2=dx*dx+dy*dy+dz*dz||1e-6,Y0=Math.floor(Math.min(e.ay,e.by)-1),Y1=Math.ceil(Math.max(e.ay,e.by)+RV*2+1);
  for(let X=X0;X<=X1;X++)for(let Z=Z0;Z<=Z1;Z++){const gh=ground[(X-OX)+W*(Z-OZ)];let fillTop=-1;
    for(let Y=Y0;Y<=Y1;Y++){
      const v=capTest(e,X,Y,Z,dx,dy,dz,L2,RV);if(!v)continue;
      if(v===1){if(e.fill&&capH<0.8)fillTop=Math.max(fillTop,Y);continue;}
      caveCut(X,Y,Z,gh,e.open);
      if(e.fill&&Y===Math.ceil(capFy-0.5)&&capH<0.8)fillTop=Y-1;}
    // a causeway of fallen rock under the last way down, where it crosses the open sea
    if(fillTop>=0)for(let Y=fillTop;Y>FIRE_LV&&Y>fillTop-16;Y--){const i=I(X-OX,Y,Z-OZ);if(world[i]===AIR){world[i]=Y>fillTop-2?GRAVEL:STONE;lvl[i]=0;}else if(world[i]!==LAVA)break;}
  }
}
// the shape of a chamber at column (X,Z): [floor, top] (top <= floor: nothing open), or null outside it
function chCol(c,X,Z){
  const px=X+0.5-c.x,pz=Z+0.5-c.z,ca=Math.cos(c.ang),sa=Math.sin(c.ang),u=px*ca+pz*sa,v=-px*sa+pz*ca,wob=fbm2(X/7,Z/7,1,7301.3+c.seed%97);
  if(c.t===1){
    if(Math.abs(u)>=c.L)return null;const hh=c.h*Math.sqrt(1-(u/c.L)*(u/c.L));return [Math.floor(c.f+Math.max(0,Math.abs(u)/c.L-0.6)*4),Math.floor(c.f+hh+wob*2),u,v];}
  const q=(u/c.a)*(u/c.a)+(v/c.b)*(v/c.b),qq=q*(1+0.22*wob);if(qq>=1)return null;
  const top=Math.floor((c.t===2?c.f0:c.f)+c.h*Math.sqrt(1-qq)+fbm2(X/6,Z/6,1,7311.7+c.seed%89)*1.5);
  let fl=c.f+Math.floor(Math.max(0,qq-0.62)*5);                            // the floor rises gently toward the walls
  if(c.t===2)fl=c.f0-Math.min(c.drop,Math.floor((u+c.a)/c.s))+Math.floor(Math.max(0,qq-0.7)*5); // terraces stepping down along the hall
  return [fl,top,u,v];
}
function rifW(c,Y,u,v,top,X,Z){const rel=(Y-c.f)/Math.max(1,top-c.f);let w=c.w*(1+0.18*fbm2(X/5,Y/5,1,7321.1))+(rel>0.35?1.4:0)+(rel>0.68?1.4:0);if(rel>0.82)w*=Math.max(0,(1-rel)/0.18);return w;}
// natural pillars in the big halls: jittered on a grid, wider where they meet floor and roof
function hallPillars(c){
  if(c.pil)return c.pil;const out=[];if(c.t===0&&c.a>=12&&c.b>=12){const g=11;for(let a=-4;a<=4;a++)for(let b=-4;b<=4;b++){
    const s=hsh(c.seed+a*31,7341,b*17);if(s>0.42)continue;const px=a*g+(hsh(c.seed+a,7342,b)-0.5)*5,pz=b*g+(hsh(c.seed+a,7343,b)-0.5)*5;
    if((px/c.a)*(px/c.a)+(pz/c.b)*(pz/c.b)>0.55)continue;if(c.rem!==undefined&&Math.hypot(px,pz)<15)continue;
    const ca=Math.cos(c.ang),sa=Math.sin(c.ang);out.push(c.x+px*ca-pz*sa,c.z+px*sa+pz*ca,1.4+hsh(c.seed+a,7344,b)*1.8);}}
  c.pil=out;return out;
}
function carveCh(c){
  const R=(c.t===1?c.L:Math.max(c.a,c.b))*1.25+2,X0=Math.max(gx0,Math.floor(c.x-R)),X1=Math.min(gx0+CS-1,Math.ceil(c.x+R)),Z0=Math.max(gz0,Math.floor(c.z-R)),Z1=Math.min(gz0+CS-1,Math.ceil(c.z+R));
  const pil=hallPillars(c);
  for(let X=X0;X<=X1;X++)for(let Z=Z0;Z<=Z1;Z++){const s=chCol(c,X,Z);if(!s)continue;const [fl,top,u,v]=s,gh=ground[(X-OX)+W*(Z-OZ)];
    let pd=1e9,pr=0;for(let k=0;k<pil.length;k+=3){const d=Math.hypot(X+0.5-pil[k],Z+0.5-pil[k+1]);if(d-pil[k+2]<pd-pr){pd=d;pr=pil[k+2];}}
    for(let Y=fl;Y<top;Y++){
      if(c.t===1&&Math.abs(v)>=rifW(c,Y,u,v,top,X,Z))continue;
      if(pr){const e1=Math.max(0,1-(Y-fl)/4),e2=Math.max(0,1-(top-1-Y)/4);if(pd<pr*(1+1.3*e1*e1+1.3*e2*e2))continue;}
      caveCut(X,Y,Z,gh,false);}}
}
// lakes on the low terraces of stepped halls (Q85): level two above the lowest floor, held by the hall's own rock
function caveLake(c){if(c.t!==2||c.dry||c.gorge!==undefined)return -1;return c.f0-c.drop+2;}
function fillLakes(els){
  const own=(X,Z)=>X>=gx0&&X<gx0+CS&&Z>=gz0&&Z<gz0+CS;
  for(const e of els){
    if(e.t===4){if(!poolOK(e))continue;for(let k=0;k<e.cells.length;k+=3){const X=e.cells[k],Y=e.cells[k+1],Z=e.cells[k+2];if(own(X,Z)){const i=I(X-OX,Y,Z-OZ);if(world[i]!==BEDROCK&&world[i]!==AIR){world[i]=WATER;lvl[i]=0;}}}}
    else if(e.t===3){const fe=e.fe;
      for(let k=0;k<e.rim.length;k+=2)PW(e.rim[k],fe-1,e.rim[k+1],STONE,MODE_AIR);
      for(const s of [-1,0,1])PW(e.ex+e.sx*s,fe-1,e.ez+e.sz*s,LAVA,MODE_SET);
      for(let Y=fe;Y<fe+e.hs;Y++)PW(e.ex,Y,e.ez,AIR,MODE_SET);
      for(let Y=fe-1;Y<fe+e.hs;Y++)PW(e.wx,Y,e.wz,LAVA,MODE_SET);}}
  for(const c of els){if(c.t!==2||!lakeOK(c))continue;const L=caveLake(c);
    const R=Math.max(c.a,c.b)+2,X0=Math.max(gx0,Math.floor(c.x-R)),X1=Math.min(gx0+CS-1,Math.ceil(c.x+R)),Z0=Math.max(gz0,Math.floor(c.z-R)),Z1=Math.min(gz0+CS-1,Math.ceil(c.z+R));
    for(let X=X0;X<=X1;X++)for(let Z=Z0;Z<=Z1;Z++){const s=chCol(c,X,Z);if(!s)continue;for(let Y=s[0];Y<L;Y++){const i=I(X-OX,Y,Z-OZ);if(world[i]===AIR){world[i]=WATER;lvl[i]=0;}}}}
}
// Does any place built after the caves (a point of interest, dungeon room, ruined stairway, mineshaft or remains, with the passage
// to its cave) reach into this box? Pools and lakes there are left dry, so no later digging opens them at a chunk edge. Pure.
function placesTouch(x0,x1,y0,y1,z0,z1){
  const hit=(a0,a1,b0,b1,c0,c1)=>a0<=x1&&a1>=x0&&b0<=y1&&b1>=y0&&c0<=z1&&c1>=z0,cx=Math.floor((x0+x1)/2/CS),cz=Math.floor((z0+z1)/2/CS);
  const tun=(ax,ay,az,bx,by,bz,m)=>hit(Math.min(ax,bx)-m,Math.max(ax,bx)+m,Math.min(ay,by)-m,Math.max(ay,by)+3+m,Math.min(az,bz)-m,Math.max(az,bz)+m);
  for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++){
    const p=poiFor(cx+a,cz+b);if(p&&(hit(p.x-13,p.x+13,p.y-3,p.y+10,p.z-13,p.z+13)||(p.a&&tun(p.x,p.y,p.z,p.a.x,p.a.y,p.a.z,2))))return true;
    const d=dungeonAt(cx+a,cz+b);if(d&&(hit(d.X-d.hw-1,d.X+d.hw+1,d.y-1,d.y+d.hh+1,d.Z-d.hw-1,d.Z+d.hw+1)||tun(d.X,d.y,d.Z,d.a.x,d.a.y,d.a.z,2)))return true;
    const w=stairwayAt(cx+a,cz+b);if(w&&(hit(w.X-3,w.X+3,w.a.y-3,w.g+5,w.Z-3,w.Z+3)||tun(w.X,w.a.y,w.Z,w.a.x,w.a.y,w.a.z,3)))return true;}
  for(let a=-5;a<=5;a++)for(let b=-5;b<=5;b++)for(const [ax,sx,sz,L,y] of shaftsFor(cx+a,cz+b)){const ex=ax==='x'?sx+L:sx,ez=ax==='z'?sz+L:sz;if(hit(Math.min(sx,ex)-2,Math.max(sx,ex)+2,y-2,y+3,Math.min(sz,ez)-2,Math.max(sz,ez)+2))return true;}
  const rx=Math.floor((x0+x1)/2/CRB),rz=Math.floor((z0+z1)/2/CRB);
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const m=remainsAt(rx+a,rz+b);if(m&&hit(m.X-24,m.X+24,m.y-10,m.y+12,m.Z-24,m.Z+24))return true;}
  return false;
}
// ...or a ravine cut down from the surface (the river ravines of the terrain)
function ravineIn(x0,x1,z0,z1,y,step){const o={};for(let X=Math.floor(x0);X<=x1;X+=step)for(let Z=Math.floor(z0);Z<=z1;Z+=step){colInfo(X,Z,o);if(o.rvBot<=y)return true;}return false;}
function poolOK(e){if(e.ok===undefined){let y0=1e9,y1=-1e9;for(let k=1;k<e.cells.length;k+=3){y0=Math.min(y0,e.cells[k]);y1=Math.max(y1,e.cells[k]);}
  e.ok=!placesTouch(e.x-4,e.x+4,y0-2,y1+2,e.z-4,e.z+4)&&!ravineIn(e.x-3,e.x+3,e.z-3,e.z+3,y1+4,1)&&!caveOpensNear(e.x,e.z,3,y0-1,y1,e);}return e.ok;}
// Does any passage or chamber open a cell within r columns of (X,Z) between y0 and y1 (other than the pool's own disc)?
// Rock holding a pool must be whole, with rock under it too.
function caveOpensNear(X,Z,r,y0,y1,pool){
  const inDisc=(x,z)=>{for(let k=0;k<pool.cells.length;k+=3)if(pool.cells[k]===x&&pool.cells[k+2]===z)return true;return false;};
  for(let x=X-r;x<=X+r;x++)for(let z=Z-r;z<=Z+r;z++){if((x-X)*(x-X)+(z-Z)*(z-Z)>7)continue;const l=caveEls(Math.floor(x/CS),Math.floor(z/CS));
    for(const e of l){if(e.t===9){for(let y=y0;y<=y1;y++)if(capOpens(e,x,y,z)&&!(inDisc(x,z)&&y===y1+1))return true;}
      else if(e.t<3){const q=chCol(e,x,z);if(q&&q[0]<=y1&&q[1]>y0)return true;}}}
  return false;
}
function lakeOK(c){if(c.lok===undefined){const R=Math.max(c.a,c.b)*1.25+3,L=caveLake(c);c.lok=L>=0&&!placesTouch(c.x-R,c.x+R,c.f0-c.drop-3,L+2,c.z-R,c.z+R)&&!ravineIn(c.x-R,c.x+R,c.z-R,c.z+R,L+4,2);}return c.lok;}
// Is (X,Y,Z) water that a plan put there on purpose (a lake held by its hall), so the drain pass can trust it at a chunk edge?
function plannedWater(X,Y,Z){
  const cx=Math.floor(X/CS),cz=Math.floor(Z/CS),rx=Math.floor(cx/CR),rz=Math.floor(cz/CR),k=ckey(cx,cz);
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const l=cavePlan(rx+a,rz+b).byChunk.get(k);if(!l)continue;
    for(const c of l){if(c.t===4){if(!poolOK(c))continue;for(let k=0;k<c.cells.length;k+=3)if(c.cells[k]===X&&c.cells[k+1]===Y&&c.cells[k+2]===Z)return true;continue;}
      if(c.t!==2||!lakeOK(c))continue;const L=caveLake(c);if(Y>=L)continue;const s=chCol(c,X,Z);if(s&&Y>=s[0])return true;}}
  return false;
}
// Is (X,Y,Z) the open face of a lava fall (its slot faces the hall)? The drain pass leaves it.
function plannedLava(X,Y,Z){
  const cx=Math.floor(X/CS),cz=Math.floor(Z/CS),rx=Math.floor(cx/CR),rz=Math.floor(cz/CR),k=ckey(cx,cz);
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const l=cavePlan(rx+a,rz+b).byChunk.get(k);if(!l)continue;for(const e of l)if(e.t===3&&e.wx===X&&e.wz===Z&&Y>=e.fe-1&&Y<e.fe+e.hs)return true;}
  return false;
}
// In parts, for streaming (part 0 to parts-1, in order): each carves a share of the elements; the last also fills the lakes
let caveElList=[];
function carveCaves(WCX,WCZ,part,parts){
  if(part===0)caveElList=caveEls(WCX,WCZ);
  const els=caveElList;
  for(let k=part;k<els.length;k+=parts){const e=els[k];if(e.t===9)carveCap(e);else if(e.t<3)carveCh(e);}
  if(part===parts-1)fillLakes(els);
}
// Natural formations in the halls and rifts: stalagmites, stalactites and the odd column, placed by position (pure)
function caveFormations(WCX,WCZ){
  for(const c of caveEls(WCX,WCZ)){if(c.t>2||c.war)continue;const R=(c.t===1?c.L:Math.max(c.a,c.b))+2;
    const gx0c=Math.floor((c.x-R)/5),gx1c=Math.floor((c.x+R)/5),gz0c=Math.floor((c.z-R)/5),gz1c=Math.floor((c.z+R)/5);
    for(let gx=gx0c;gx<=gx1c;gx++)for(let gz=gz0c;gz<=gz1c;gz++){const q=hsh(gx,7351,gz);if(q>0.3)continue;
      const X=gx*5+Math.floor(hsh(gx,7352,gz)*5),Z=gz*5+Math.floor(hsh(gx,7353,gz)*5);if(X<gx0||X>=gx0+CS||Z<gz0||Z>=gz0+CS)continue;
      const s=chCol(c,X,Z);if(!s||s[1]-s[0]<6)continue;const [fl,top]=s;if(c.t===2&&caveLake(c)>fl)continue;
      if(GW(X,fl,Z)!==AIR||GW(X,top-1,Z)!==AIR)continue;
      const hg=1+Math.floor(hsh(gx,7354,gz)*Math.min(5,(top-fl)/4));
      if(q<0.12){for(let k=0;k<hg;k++)PW(X,fl+k,Z,k===hg-1?DRIPU:CALCITE,MODE_AIR);}
      else if(q<0.24){for(let k=0;k<hg;k++)PW(X,top-1-k,Z,k===hg-1?DRIPD:CALCITE,MODE_AIR);}
      else if(top-fl<14){for(let Y=fl;Y<top;Y++)PW(X,Y,Z,CALCITE,MODE_AIR);}}}
}
