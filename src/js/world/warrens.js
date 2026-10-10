// ---- The goblin warrens (D-052): under the Volcanic Wastes the crawlways and the upper caves give way to warrens the goblins
// dug in hot black rock. Halls on two levels (the upper among the crawlways, the lower in the upper caves) are joined by low
// tunnels propped with charred timber and lit by torches, magma seams and channels of lava held in the floor. The halls hold
// huts of hide, stores, pens, a forge, a fire shrine and the chief's hall with its hoard. Ways in open on the surface, a goblin
// camp before each; a way down joins the caves below, which begin under the warrens. The warren is planned with the cave
// systems of its region (caveBase), so everything planned after it keeps clear; it is dressed per chunk from the plan (pure).
const WAR_Y0=206,warRegC=new Map(),WAR_KINDS=['den','den','den','store','forge','pen','shrine','lava'],TWR={};
const WAR_ROCK=new Set([STONE,DEEP,DIRT,GRAVEL]);
// Is cave region (rx,rz) a warren? Most of it lies under the wastes, and no hold is near.
function warRegion(rx,rz){
  const k=ckey(rx,rz);if(warRegC.has(k))return warRegC.get(k);if(warRegC.size>4000)warRegC.clear();
  let n=0;for(let a=0;a<5;a++)for(let b=0;b<5;b++){colInfo(rx*CRB+16+a*32,rz*CRB+16+b*32,TWR);if(TWR.wVolc>0.6)n++;}
  const ccx=rx*CR+CR/2,ccz=rz*CR+CR/2,ok=n>=10&&holdReach(holdNear(ccx,ccz),ccx,ccz)>=3.6;
  warRegC.set(k,ok);return ok;
}
// the warren of the region holding (X,Z), or null
function warrenOf(X,Z){const rx=Math.floor(X/CRB),rz=Math.floor(Z/CRB);if(!warRegion(rx,rz))return null;return caveBase(rx,rz).war||null;}
// ---- planning (called by caveBase before the region's cave systems; its own random stream)
// a hall's radius toward `dir`, and a door: a node just inside its wall that way, on its floor, belonging to the hall
function hallR(c,dir){const p=dir-c.ang,ca=Math.cos(p),sa=Math.sin(p);return 1/Math.sqrt((ca/c.a)*(ca/c.a)+(sa/c.b)*(sa/c.b));}
function warDoor(B,ci,dir){const c=B.ch[ci],d=hallR(c,dir)*0.78,X=c.x+Math.cos(dir)*d,Z=c.z+Math.sin(dir)*d,s=chCol(c,Math.floor(X),Math.floor(Z)),ni=caveNode(B,X,s?s[0]:c.f,Z);B.nodes[ni].ch=ci;return ni;}
// a tunnel between two nodes, if it keeps clear of everything planned (and of the fire demons' fortresses)
function warLink(B,a,b,r,rad,o){
  const A=B.nodes[a],Bn=B.nodes[b],hd=Math.hypot(Bn.x-A.x,Bn.z-A.z);if(Math.abs(Bn.y-A.y)>hd*0.9)return false;
  const pts=cavePath(A,Bn,rad,rad,r,'ramp');
  if(!caveCheckPath(B,pts,a,b,o||{}))return false;for(let k=0;k<pts.length;k+=4)if(fortZone(pts[k],pts[k+1],pts[k+2],pts[k+3]+6))return false;
  const e=caveAddEdge(B,a,b,pts,o||{});B.edges[e].war=1;return true;
}
// join halls i and j (chamber indices) through a door in each, trying a few doors; false when no way is clear
function warJoin(B,ci,cj,r){
  const A=B.ch[ci],C=B.ch[cj],d0=Math.atan2(C.z-A.z,C.x-A.x);
  for(const off of [0,0.45,-0.45]){const n0=B.nodes.length,da=warDoor(B,ci,d0+off),db=warDoor(B,cj,d0+Math.PI-off);
    if(warLink(B,da,db,r,1.6+r()*0.5)){A.doors.push(da);C.doors.push(db);return true;}B.nodes.length=n0;}
  return false;
}
// a way in from the surface: the steepest hot hillside among some spots (a mouth into the hill), or a level spot (a pit with a
// ramp spiralling down); never by lava, rivers or water, and away from the other ways in
function warEntrance(B,r){
  let best=null,flat=null;
  for(let k=0;k<36;k++){const X=B.x0+24+Math.floor(r()*(CRB-48)),Z=B.z0+24+Math.floor(r()*(CRB-48)),h=hAt(X,Z);
    if(h<SEA+3)continue;colInfo(X,Z,TWR);if(TWR.wVolc<0.75||TWR.wet||TWR.lake||TWR.river||TWR.vflow||TWR.vfis||TWR.vcr||TWR.vlake||TWR.rvBot<999)continue;
    let hot=false;for(let d=0;d<8&&!hot;d++)for(const rr of [5,10,15]){colInfo(X+Math.round(Math.cos(d*0.785)*rr),Z+Math.round(Math.sin(d*0.785)*rr),TWR);if(TWR.vflow||TWR.vfis||TWR.vlake||TWR.river||TWR.lake){hot=true;break;}}
    if(hot||B.war.ents.some(e=>Math.hypot(e.X-X,e.Z-Z)<40)||fortZone(X,h,Z,24))continue;
    let sl=0;for(let d=0;d<8;d++){const a=d*0.785,rise=hAt(Math.round(X+Math.cos(a)*7),Math.round(Z+Math.sin(a)*7))-h;sl=Math.max(sl,Math.abs(rise));if(rise>=4&&(!best||rise>best.rise))best={X:X,Z:Z,h:h,a:a,rise:rise};}
    if(sl<=2&&!flat)flat={X:X,Z:Z,h:h,a:r()*6.283,flat:true};}
  return best||flat;
}
function warrenPlan(B){
  const r=rngAt(B.rx,7181,B.rz),W0={name:'The Warrens of '+fullName('goblin',r,false),halls:[],ents:[],down:-1};B.war=W0;
  // halls: the first and every other one on the lower tier; the first lower hall is the chief's
  const want=6+Math.floor(r()*4);
  for(let t=0;t<70&&W0.halls.length<want;t++){
    const lower=W0.halls.length%2===0,chief=W0.halls.length===0;
    const a=chief?15+r()*3:8+r()*7,b=chief?15+r()*3:8+r()*7,h=chief?12+r()*2:7+r()*4,R=Math.max(a,b);
    const X=B.x0+R+12+r()*(CRB-2*R-24),Z=B.z0+R+12+r()*(CRB-2*R-24);
    colInfo(X,Z,TWR);if(TWR.wVolc<0.6)continue;
    let gmin=1e9;for(const [px,pz] of [[0,0],[R,0],[-R,0],[0,R],[0,-R],[R*0.7,R*0.7],[-R*0.7,R*0.7],[R*0.7,-R*0.7],[-R*0.7,-R*0.7]])gmin=Math.min(gmin,hAt(Math.floor(X+px),Math.floor(Z+pz)));
    let f=lower?212+Math.floor(r()*24):250+Math.floor(r()*24);const fTop=Math.floor(gmin-h-12);if(f>fTop)f=fTop;if(f<(lower?212:246))continue;
    if(fortZone(X,f,Z,R+10))continue;
    const c={t:0,a:a,b:b,h:h,ang:r()*6.283,x:X,z:Z,f:f,seed:Math.floor(r()*1e6),war:1,wk:chief?'chief':WAR_KINDS[Math.floor(r()*WAR_KINDS.length)],doors:[]};
    const s=chSphere(c);let ok=true;for(const q of B.ch){const t2=chSphere(q);if(Math.hypot(s.x-t2.x,s.y-t2.y,s.z-t2.z)<s.r+t2.r+6){ok=false;break;}}
    if(!ok)continue;
    const ni=caveNode(B,X,f,Z);B.ch.push(c);B.nodes[ni].ch=B.ch.length-1;W0.halls.push(ni);
  }
  // tunnels: the shortest ways that join every hall, then a loop or two
  const HC=W0.halls.map(ni=>B.nodes[ni].ch),pairs=[];
  for(let i=0;i<HC.length;i++)for(let j=i+1;j<HC.length;j++){const p=B.ch[HC[i]],q=B.ch[HC[j]];pairs.push([Math.hypot(p.x-q.x,p.z-q.z)+Math.abs(p.f-q.f)*1.5,i,j]);}
  pairs.sort((u,v)=>u[0]-v[0]);
  const par=HC.map((_,i)=>i),find=i=>par[i]===i?i:(par[i]=find(par[i]));let loops=1+Math.floor(r()*2);
  for(const [d,i,j] of pairs){const join=find(i)!==find(j);if(!join&&(loops<=0||d>110))continue;if(warJoin(B,HC[i],HC[j],r)){if(join)par[find(i)]=find(j);else loops--;}}
  // ways in: a mouth or a pit, then a tunnel to the nearest hall it can reach (the upper halls first), through a spiral down
  // when the way is too steep
  const ne=1+(r()<0.6?1:0)+(r()<0.25?1:0),near=N=>HC.slice().sort((p,q)=>Math.hypot(B.ch[p].x-N.x,B.ch[p].z-N.z)+(B.ch[p].f<246?60:0)-Math.hypot(B.ch[q].x-N.x,B.ch[q].z-N.z)-(B.ch[q].f<246?60:0));
  const toHall=from=>{const N=B.nodes[from];for(const ci of near(N).slice(0,4)){const c=B.ch[ci],n1=B.nodes.length,dr=warDoor(B,ci,Math.atan2(N.z-c.z,N.x-c.x));if(warLink(B,from,dr,r,1.8)){c.doors.push(dr);return true;}B.nodes.length=n1;}return false;};
  for(let k=0;k<ne+4&&W0.ents.length<ne&&HC.length;k++){const ent=warEntrance(B,r);if(!ent)continue;
    const n0=B.nodes.length,e0=B.edges.length,c0=B.caps.length;let inner=-1,en;
    if(!ent.flat){en=caveNode(B,ent.X+0.5-Math.cos(ent.a)*2,ent.h+1,ent.Z+0.5-Math.sin(ent.a)*2);
      for(let t=0;t<4&&inner<0;t++){const hd=14+r()*8,a=ent.a+(r()-0.5)*0.6;inner=caveStep(B,en,a,'ramp',r,{open:true,to:{x:ent.X+Math.cos(a)*hd,y:ent.h-4-r()*4,z:ent.Z+Math.sin(a)*hd}});}}
    else{en=caveNode(B,ent.X+0.5,ent.h+1,ent.Z+0.5);for(let t=0;t<3&&inner<0;t++)inner=caveStep(B,en,ent.a+t*2,'spiral',r,{open:true,drop:16+r()*10});}
    let ok=false;
    if(inner>=0){for(let e=e0;e<B.edges.length;e++)B.edges[e].war=1;ok=toHall(inner);
      for(let t=0;t<3&&!ok;t++){const n1=B.nodes.length,e1=B.edges.length,c1=B.caps.length,N=B.nodes[inner],tg=B.ch[near(N)[0]],drop=Math.max(10,Math.min(46,N.y-tg.f-4));
        const sp=caveStep(B,inner,ent.a+t*2.1+(r()-0.5)*0.5,'spiral',r,{drop:drop});if(sp>=0){B.edges[B.edges.length-1].war=1;ok=toHall(sp);}
        if(!ok){B.nodes.length=n1;B.edges.length=e1;B.caps.length=c1;}}}
    if(ok){const cx=ent.flat?ent.X:ent.X-Math.cos(ent.a)*8,cz=ent.flat?ent.Z:ent.Z-Math.sin(ent.a)*8;W0.ents.push({X:ent.X,Z:ent.Z,h:ent.h,a:ent.a,flat:!!ent.flat,ni:en,cx:cx,cz:cz,cy:hAt(Math.floor(cx),Math.floor(cz))+1});B.ents.push(en);}
    else{B.nodes.length=n0;B.edges.length=e0;B.caps.length=c0;}
  }
  // the way down from the lowest hall, to where the caves below begin
  if(HC.length){const ci=HC.reduce((p,q)=>B.ch[q].f<B.ch[p].f?q:p),c=B.ch[ci],a0=r()*6.283;
    for(let t=0;t<10&&W0.down<0;t++){const dir=a0+t*0.63,n0=B.nodes.length,e0=B.edges.length,c0=B.caps.length,dr=warDoor(B,ci,dir),D0=B.nodes[dr];
      if(t<7){const hd=(D0.y-194)/0.62+4,T=caveNode(B,D0.x+Math.cos(dir)*hd,194,D0.z+Math.sin(dir)*hd);if(warLink(B,dr,T,r,2)){c.doors.push(dr);W0.down=T;break;}}
      else{const nx=caveStep(B,dr,dir,'spiral',r,{drop:D0.y-194});if(nx>=0){B.edges[B.edges.length-1].war=1;c.doors.push(dr);W0.down=nx;break;}}
      B.nodes.length=n0;B.edges.length=e0;B.caps.length=c0;}}
}
// After the region's cave systems: channels of lava across some halls' floors, and lava falls in their walls. A channel is one
// block deep in the flat middle of the floor, rock under it and on every side, with a crossing in the middle; no tunnel may cut
// into the floor anywhere near it, and no gorge come near the hall.
function warrenFinish(B){
  const r=rngAt(B.rx,7187,B.rz);
  for(const ni of B.war.halls){const c=B.ch[B.nodes[ni].ch];if(!['lava','forge','chief'].includes(c.wk)||r()<(c.wk==='lava'?0:0.3))continue;
    const R=Math.max(c.a,c.b);if(ravineIn(c.x-R-4,c.x+R+4,c.z-R-4,c.z+R+4,c.f+c.h+3,2))continue;
    const L=Math.min(c.a,c.b)*0.55,w=c.wk==='lava'?1.5:1;
    for(let t=0;t<6&&!c.chan;t++){const th=c.ang+t*0.5236,ux=Math.cos(th),uz=Math.sin(th);let ok=true;
      for(const e of B.edges){const p=e.pts;for(let k=0;k+4<p.length&&ok;k+=4){const n=Math.max(1,Math.ceil(Math.hypot(p[k+4]-p[k],p[k+6]-p[k+2])));
        for(let s=0;s<=n&&ok;s++){const q=s/n,x=p[k]+(p[k+4]-p[k])*q,y=p[k+1]+(p[k+5]-p[k+1])*q,z=p[k+2]+(p[k+6]-p[k+2])*q,rr=p[k+3]+(p[k+7]-p[k+3])*q;
          if(y>=c.f-0.4||Math.hypot(x-c.x,z-c.z)>R+rr+4)continue;
          const px=x-c.x,pz=z-c.z,u=Math.max(-L,Math.min(L,px*ux+pz*uz));if(Math.hypot(px-u*ux,pz-u*uz)<rr+w+2.5)ok=false;}}}
      if(ok)c.chan={th:th,L:L,w:w};}}
  // lava falls in the walls of the hot halls (the cave plan builds and trusts them)
  for(const ni of B.war.halls){const c=B.ch[B.nodes[ni].ch];if(!['lava','forge','chief','shrine'].includes(c.wk)||r()<0.4)continue;const R=Math.max(c.a,c.b);
    if(ravineIn(c.x-R-4,c.x+R+4,c.z-R-4,c.z+R+4,c.f+c.h+3,2))continue;const fl=caveFall(c,r);if(!fl)continue;
    let ok=true;for(const e of B.edges){const p=e.pts;for(let k=0;k<p.length&&ok;k+=4)if(p[k+1]<fl.fe+0.6&&Math.hypot(p[k]-fl.ex-0.5,p[k+2]-fl.ez-0.5)<p[k+3]+5)ok=false;}
    if(ok&&c.chan&&Math.hypot(fl.ex+0.5-c.x,fl.ez+0.5-c.z)<c.chan.L+3)ok=false;
    if(ok)B.falls.push(fl);}
}
// ---- queries (pure)
function warInPil(c,X,Z,m){const p=hallPillars(c);for(let k=0;k<p.length;k+=3)if(Math.hypot(X+0.5-p[k],Z+0.5-p[k+1])<p[k+2]+(m||0))return true;return false;}
// Is (X,Z) a lava cell of hall c's channel (its lava lies at c.f-1)?
function warChanCell(c,X,Z){const ch=c.chan;if(!ch)return false;const px=X+0.5-c.x,pz=Z+0.5-c.z,ux=Math.cos(ch.th),uz=Math.sin(ch.th),u=px*ux+pz*uz,v=-px*uz+pz*ux;
  if(Math.abs(u)>ch.L||Math.abs(u)<1.6||Math.abs(v)>=ch.w)return false;
  for(const [a,b] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]){const s=chCol(c,X+a,Z+b);if(!s||s[0]!==c.f)return false;}
  return !warInPil(c,X,Z,0.5);}
// Is (X,Y,Z) lava a warren channel holds on purpose (the drain pass trusts it at a chunk edge)?
function warLavaAt(X,Y,Z){const W0=warrenOf(X,Z);if(!W0)return false;const B=caveBase(Math.floor(X/CRB),Math.floor(Z/CRB));
  for(const ni of W0.halls){const c=B.ch[B.nodes[ni].ch];if(c.chan&&Y===c.f-1&&Math.abs(X-c.x)<c.a+c.b&&Math.abs(Z-c.z)<c.a+c.b&&warChanCell(c,X,Z))return true;}return false;}
// the name of the warren at (X,y,Z) underground, or null (the layer's name in the readout and the journal)
function warrenName(X,y,Z){if(y<WAR_Y0-8)return null;const W0=warrenOf(X,Z);return W0?W0.name:null;}
// Is (X,y,Z) in the band of a warren (the crawlways and upper caves under the wastes)? Cave life keeps out of it.
function warBand(X,y,Z){return y>=WAR_Y0-8&&warRegion(Math.floor(X/CRB),Math.floor(Z/CRB));}
// Where goblins live within `rad` of (X,Z): each hall (by kind) and each camp before a way in
function warrenSpots(X,Z,rad){const out=[];
  for(let rx=Math.floor((X-rad)/CRB);rx<=Math.floor((X+rad)/CRB);rx++)for(let rz=Math.floor((Z-rad)/CRB);rz<=Math.floor((Z+rad)/CRB);rz++){if(!warRegion(rx,rz))continue;const B=caveBase(rx,rz);if(!B.war)continue;
    for(const ni of B.war.halls){const c=B.ch[B.nodes[ni].ch];if(Math.hypot(c.x-X,c.z-Z)<rad)out.push({id:'w'+rx+','+rz+','+ni,x:c.x,y:c.f,z:c.z,R:Math.min(c.a,c.b)*0.6,kind:c.wk,hall:c});}
    B.war.ents.forEach((e,k)=>{if(Math.hypot(e.cx-X,e.cz-Z)<rad)out.push({id:'c'+rx+','+rz+','+k,x:e.cx,y:e.cy,z:e.cz,R:5,kind:'camp'});});}
  return out;}
// ---- dressing, per chunk (a generation step after the sites; lit, since the goblins keep their fires)
function warPick(X,Y,Z,side){
  const p=hsh(Math.floor(X/3),Math.floor(Y/3)*7+9203,Math.floor(Z/3)),f=hsh(X,Y*31+9205,Z);
  if(side===0)return f<0.03?SULFUR:f<0.05?MAGMA:p<0.32?BLACKASH:p<0.58?CINDER:p<0.7?ASH:p<0.86?BASALT:f<0.55?LAVACRUST:CINDER;
  if(side===1)return f<0.05?MAGMA:p<0.6?BASALT:p<0.9?CINDER:OBSID;
  return f<0.035?MAGMA:f<0.055?SULFUR:p<0.42?BASALT:p<0.78?CINDER:p<0.9?OBSID:SCORCH;
}
function warSkin(X,Y,Z,side){if(WAR_ROCK.has(GW(X,Y,Z)))PW(X,Y,Z,warPick(X,Y,Z,side),MODE_SET);}
// the floor of hall c at (X,Z): the first open cell, or -1 outside it
function warFloor(c,X,Z){const s=chCol(c,X,Z);return s&&!warInPil(c,X,Z,0.6)?s[0]:-1;}
const warNearDoor=(B,c,X,Z,m)=>c.doors.some(d=>Math.hypot(B.nodes[d].x-X,B.nodes[d].z-Z)<m);
const warInChan=(c,X,Z,m)=>{const ch=c.chan;if(!ch)return false;const px=X+0.5-c.x,pz=Z+0.5-c.z,ux=Math.cos(ch.th),uz=Math.sin(ch.th),u=px*ux+pz*uz,v=-px*uz+pz*ux;return Math.abs(u)<ch.L+m&&Math.abs(v)<ch.w+m;};
// small pieces, built on a floor at fl (only into air, so pillars and walls are kept)
function warPost(X,y,Z,top){PW(X,y,Z,CHARWOOD,MODE_AIR);PW(X,y+1,Z,CHARWOOD,MODE_AIR);if(top)PW(X,y+2,Z,top,MODE_AIR);}
function warHut(X,Z,fl,dx,dz,q){ // a hut of hide on charred posts, its door facing (dx,dz)
  for(let a=-1;a<=2;a++)for(let b=-1;b<=2;b++){const edge=a===-1||a===2||b===-1||b===2,corner=(a===-1||a===2)&&(b===-1||b===2);
    const door=dx?(a===(dx>0?2:-1)&&(b===0||b===1)):(b===(dz>0?2:-1)&&(a===0||a===1));
    if(corner){for(let y=0;y<3;y++)PW(X+a,fl+y,Z+b,CHARWOOD,MODE_AIR);}else if(edge&&!door){PW(X+a,fl,Z+b,HIDE,MODE_AIR);PW(X+a,fl+1,Z+b,HIDE,MODE_AIR);}
    if(!corner)PW(X+a,fl+2,Z+b,HIDE,MODE_AIR);}
  PW(X,fl,Z,q<0.5?HIDE:BONES,MODE_AIR);if(q>0.6)PW(X+1,fl,Z+1,CRATE,MODE_AIR);
}
function warFirePit(X,Z,fl){PW(X,fl-1,Z,MAGMA,MODE_SET);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(a||b)PW(X+a,fl-1,Z+b,BASALT,MODE_SET);PW(X+1,fl,Z+1,BONES,MODE_AIR);PW(X-1,fl,Z,BONES,MODE_AIR);}
function warCage(X,Z,fl){for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const edge=Math.abs(a)===2||Math.abs(b)===2;if(edge){PW(X+a,fl,Z+b,GRATE,MODE_AIR);PW(X+a,fl+1,Z+b,GRATE,MODE_AIR);}PW(X+a,fl+2,Z+b,GRATE,MODE_AIR);}
  PW(X,fl,Z,BONES,MODE_AIR);PW(X-1,fl+1,Z+1,COBWEB,MODE_AIR);PW(X+1,fl,Z-1,BONES,MODE_AIR);}
function warIdol(X,Z,fl){for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)PW(X+a,fl,Z+b,OBSID,MODE_AIR);for(let y=1;y<=5;y++)PW(X,fl+y,Z,OBSID,MODE_AIR);
  PW(X-1,fl+4,Z,MAGMA,MODE_AIR);PW(X+1,fl+4,Z,MAGMA,MODE_AIR);PW(X-1,fl+5,Z,OBSID,MODE_AIR);PW(X+1,fl+5,Z,OBSID,MODE_AIR);PW(X-1,fl+6,Z,OBSID,MODE_AIR);PW(X+1,fl+6,Z,OBSID,MODE_AIR);
  for(let k=0;k<8;k++){const a=k*0.785;PW(X+Math.round(Math.cos(a)*3),fl,Z+Math.round(Math.sin(a)*3),k%2?SKULLS:BONES,MODE_AIR);}}
// Where the chief's throne stands: across the hall from the first door (beside the channel if there is one), on level floor
// for the whole dais, clear of pillars, doors and lava; the first spot that fits (pure, kept on the hall)
function warThroneSpot(B,c){
  if(c.throne!==undefined)return c.throne;c.throne=null;
  const d=c.doors.length?B.nodes[c.doors[0]]:{x:c.x-1,z:c.z},a1=Math.atan2(c.z-d.z,c.x-d.x),pc=c.chan?c.chan.th+Math.PI/2:a1,a0=c.chan?(Math.cos(pc-a1)>=0?pc:pc+Math.PI):a1;
  for(const k of [0,1,-1,2,-2,3,-3,4,-4])for(const f of [0.55,0.45,0.62,0.36]){const a=a0+k*0.35,dd=Math.min(c.a,c.b)*f,X=Math.floor(c.x+Math.cos(a)*dd),Z=Math.floor(c.z+Math.sin(a)*dd),fl=warFloor(c,X,Z);if(fl<0)continue;
    const ix=-Math.cos(a),iz=-Math.sin(a),[dx,dz]=Math.abs(ix)>Math.abs(iz)?[Math.sign(ix),0]:[0,Math.sign(iz)],px=-dz,pz=dx;let ok=true;
    for(let p=-3;p<=3&&ok;p++)for(let q=-2;q<=2&&ok;q++){const x=X+px*p+dx*q,z=Z+pz*p+dz*q;if(warFloor(c,x,z)!==fl||warInChan(c,x,z,1.5)||warNearDoor(B,c,x,z,4))ok=false;}
    if(ok){c.throne={X:X,Z:Z,fl:fl,dx:dx,dz:dz};return c.throne;}}
  return null;
}
function warThrone(X,Z,fl,dx,dz){ // a dais of basalt bricks, an obsidian throne facing (dx,dz), braziers and the hoard behind
  const px=-dz,pz=dx;
  for(let a=-3;a<=3;a++)for(let b=-2;b<=2;b++){const x=X+px*a+dx*b,z=Z+pz*a+dz*b;PW(x,fl,z,BASBRICK,MODE_AIR);if(Math.abs(a)===3&&Math.abs(b)===2){PW(x,fl+1,z,BASBRICK,MODE_AIR);PW(x,fl+2,z,MAGMA,MODE_AIR);}}
  PW(X,fl+1,Z,OBSID,MODE_AIR);for(let y=1;y<=4;y++)PW(X-dx,fl+y,Z-dz,y===4?EMBRICK:OBSID,MODE_AIR);PW(X+px,fl+1,Z+pz,GOLDB,MODE_AIR);PW(X-px,fl+1,Z-pz,GOLDB,MODE_AIR);
  for(const s of [-1,1]){PW(X+px*2*s,fl+1,Z+pz*2*s,BANNER,MODE_AIR);PW(X+px*2*s,fl+2,Z+pz*2*s,BANNER,MODE_AIR);}
  const bx=X-dx*2,bz=Z-dz*2;PW(bx+px,fl+1,bz+pz,DWCHEST,MODE_AIR);PW(bx-px,fl+1,bz-pz,CRATE,MODE_AIR);PW(bx+px*2,fl+1,bz+pz*2,GOLDB,MODE_AIR);PW(bx-px*2,fl+1,bz-pz*2,SKULLS,MODE_AIR);
}
function warrenDress(WCX,WCZ){
  const rx=Math.floor(WCX/CR),rz=Math.floor(WCZ/CR);if(!warRegion(rx,rz))return;const B=caveBase(rx,rz),W0=B.war;if(!W0)return;
  genLit=true;
  try{
    // the rock round every open cell in the band takes on the fire: ash and cinder floors, basalt walls, glowing seams
    for(let lz=0;lz<CS;lz++)for(let lx=0;lx<CS;lx++){const X=gx0+lx,Z=gz0+lz,x=X-OX,z=Z-OZ,g=ground[x+W*z];
      for(let y=WAR_Y0-8;y<g-1;y++){if(world[I(x,y,z)]!==AIR)continue;warSkin(X,y-1,Z,0);warSkin(X,y+1,Z,1);warSkin(X-1,y,Z,2);warSkin(X+1,y,Z,2);warSkin(X,y,Z-1,2);warSkin(X,y,Z+1,2);}}
    const X0=gx0,X1=gx0+CS-1,Z0=gz0,Z1=gz0+CS-1,touch=(x,z,m)=>x+m>=X0&&x-m<=X1&&z+m>=Z0&&z-m<=Z1;
    for(const ni of W0.halls){const c=B.ch[B.nodes[ni].ch],R=Math.max(c.a,c.b)+2;if(!touch(c.x,c.z,R))continue;
      // the channel of lava, with torches at its crossing
      if(c.chan){for(let X=Math.max(X0,Math.floor(c.x-R));X<=Math.min(X1,Math.ceil(c.x+R));X++)for(let Z=Math.max(Z0,Math.floor(c.z-R));Z<=Math.min(Z1,Math.ceil(c.z+R));Z++)if(warChanCell(c,X,Z))PW(X,c.f-1,Z,LAVA,MODE_SET);
        const ux=Math.cos(c.chan.th),uz=Math.sin(c.chan.th);for(const s of [-1,1]){const X=Math.floor(c.x-uz*s*(c.chan.w+1.5)),Z=Math.floor(c.z+ux*s*(c.chan.w+1.5)),fl=warFloor(c,X,Z);if(fl>0)warPost(X,fl,Z,TORCH);}}
      // the pieces on a ring about the middle, by the hall's kind; none by a door, on the channel or in a pillar
      const n=c.wk==='chief'?7:c.wk==='den'?5:4,ph=hsh(c.seed,9211,ni)*6.283,spot=[];
      for(let k=0;k<n;k++){const a=ph+k*6.283/n,d=Math.min(c.a,c.b)*(0.5+hsh(c.seed,9213+k,ni)*0.12),X=Math.floor(c.x+Math.cos(a)*d),Z=Math.floor(c.z+Math.sin(a)*d);
        if(warNearDoor(B,c,X,Z,5)||warInChan(c,X,Z,3))continue;const fl=warFloor(c,X,Z);if(fl<0)continue;spot.push([X,Z,fl,a,hsh(c.seed,9215+k,ni)]);}
      const inward=a=>{const ix=-Math.cos(a),iz=-Math.sin(a);return Math.abs(ix)>Math.abs(iz)?[Math.sign(ix),0]:[0,Math.sign(iz)];};
      spot.forEach(([X,Z,fl,a,q],k)=>{if(!touch(X,Z,4))return;const [dx,dz]=inward(a);
        switch(c.wk){
          case 'den':if(k<3)warHut(X,Z,fl,dx,dz,q);else warPost(X,fl,Z,q<0.5?TORCH:SKULLS);break;
          case 'store':for(let b=-1;b<=1;b++)for(let e=-1;e<=1;e++)if(hsh(X+b,9217,Z+e)<0.6){PW(X+b,fl,Z+e,(b+e)%2?BARREL:CRATE,MODE_AIR);if(hsh(X+b,9219,Z+e)<0.3)PW(X+b,fl+1,Z+e,CRATE,MODE_AIR);}break;
          case 'pen':if(k<2)warCage(X,Z,fl);else warPost(X,fl,Z,TORCH);break;
          case 'forge':if(k===0){PW(X,fl,Z,FURN,MODE_AIR);PW(X+1,fl,Z,FURN,MODE_AIR);PW(X,fl+1,Z,FURN,MODE_AIR);}else if(k===1){PW(X,fl,Z,STEELB,MODE_AIR);PW(X+1,fl,Z,CRATE,MODE_AIR);}else if(k===2){for(let b=-1;b<=1;b++)PW(X+b,fl,Z,BLACKASH,MODE_AIR);PW(X,fl+1,Z,BLACKASH,MODE_AIR);}else warPost(X,fl,Z,TORCH);break;
          case 'shrine':warPost(X,fl,Z,k%2?TORCH:SKULLS);break;
          case 'chief':if(k<4)warPost(X,fl,Z,k%2?TORCH:SKULLS);else{PW(X,fl,Z,BANNER,MODE_AIR);PW(X,fl+1,Z,BANNER,MODE_AIR);}break;
          default:warPost(X,fl,Z,k%2?TORCH:SKULLS);}});
      // the middle: a fire for the dens, an idol for the shrine, the throne for the chief (at the far side from the first door)
      const mfl=warFloor(c,Math.floor(c.x),Math.floor(c.z));
      if(c.wk==='den'&&mfl>0&&!c.chan)warFirePit(Math.floor(c.x),Math.floor(c.z),mfl);
      if(c.wk==='shrine'&&mfl>0)warIdol(Math.floor(c.x),Math.floor(c.z),mfl);
      if(c.wk==='chief'){const t=warThroneSpot(B,c);if(t)warThrone(t.X,t.Z,t.fl,t.dx,t.dz);}
      // banners by the doors, bones about the floor
      for(const di of c.doors){const D0=B.nodes[di],a=Math.atan2(D0.z-c.z,D0.x-c.x);for(const s of [-1,1]){const X=Math.floor(D0.x-Math.cos(a)*1.5-Math.sin(a)*s*2.6),Z=Math.floor(D0.z-Math.sin(a)*1.5+Math.cos(a)*s*2.6);
        if(!touch(X,Z,0))continue;const fl=warFloor(c,X,Z);if(fl>0&&hsh(X,9221,Z)<0.6){PW(X,fl,Z,BANNER,MODE_AIR);PW(X,fl+1,Z,BANNER,MODE_AIR);}}}
      for(let k=0;k<10;k++){const X=Math.floor(c.x+(hsh(c.seed,9223+k,1)-0.5)*c.a*1.6),Z=Math.floor(c.z+(hsh(c.seed,9225+k,2)-0.5)*c.b*1.6);if(!touch(X,Z,0)||warInChan(c,X,Z,1))continue;const fl=warFloor(c,X,Z);if(fl>0)PW(X,fl,Z,k%3?BONES:SKULLS,MODE_AIR);}
    }
    // the tunnels: timber props and torches every few blocks
    for(const e of B.edges){if(!e.war||e.open)continue;const p=e.pts;let run=0;
      for(let k=0;k+4<p.length;k+=4){run+=Math.hypot(p[k+4]-p[k],p[k+6]-p[k+2]);if(run<9)continue;run=0;
        const x=p[k+4],z=p[k+6],rr=p[k+7],dx=p[k+4]-p[k],dz=p[k+6]-p[k+2],dl=Math.hypot(dx,dz)||1,nx=-dz/dl,nz=dx/dl;if(!touch(x,z,rr+2))continue;
        const lit=hsh(Math.floor(x),9227,Math.floor(z))<0.5;
        for(const s of [-1,1]){const X=Math.floor(x+nx*s*(rr-0.7)),Z=Math.floor(z+nz*s*(rr-0.7)),f=edgeFloor(p,X,Z);if(f>=1e9)continue;
          if(lit&&s>0)PW(X,f,Z,TORCH,MODE_AIR);else{PW(X,f,Z,CHARWOOD,MODE_AIR);PW(X,f+1,Z,CHARWOOD,MODE_AIR);}}}}
    // a camp before each way in: a fire, tents of hide, poles of skulls and banners by the mouth, a ring of stakes
    for(const en of W0.ents){if(!touch(en.cx,en.cz,16))continue;warCamp(B,en);}
  }finally{genLit=false;}
}
// Is (X,Z) close to the open way of a warren entrance? (the camp keeps its mouth clear)
function warMouthNear(B,X,Z,m){for(const e of B.edges){if(!e.open||!e.war)continue;const p=e.pts;for(let k=0;k+4<p.length;k+=4)if(ptSegDist(X+0.5,0,Z+0.5,p[k],0,p[k+2],p[k+4],0,p[k+6])<Math.max(p[k+3],p[k+7])+m)return true;}return false;}
function warCamp(B,en){
  const gy=(X,Z)=>hAt(X,Z)+1,put=(X,Z,fn)=>{if(warMouthNear(B,X,Z,1.5))return;fn(gy(X,Z));};
  const ox=en.flat?0:-Math.cos(en.a),oz=en.flat?0:-Math.sin(en.a),px=-Math.sin(en.a),pz=Math.cos(en.a);
  if(!en.flat){ // a mouth: poles of skulls and banners on both sides of it, the camp out in front
    for(const s of [-1,1]){const X=Math.floor(en.X+px*s*3.6+ox),Z=Math.floor(en.Z+pz*s*3.6+oz);put(X,Z,y=>warPost(X,y,Z,SKULLS));
      const X2=Math.floor(en.X+px*s*5.5+ox*2),Z2=Math.floor(en.Z+pz*s*5.5+oz*2);put(X2,Z2,y=>{PW(X2,y,Z2,BANNER,MODE_AIR);PW(X2,y+1,Z2,BANNER,MODE_AIR);});}}
  const cx=Math.floor(en.cx),cz=Math.floor(en.cz);put(cx,cz,y=>warFirePit(cx,cz,y));
  for(const s of [-1,1]){const X=Math.floor(en.cx+px*s*5.5+ox*2),Z=Math.floor(en.cz+pz*s*5.5+oz*2),fx=Math.abs(px)>Math.abs(pz)?-Math.sign(px*s):0,fz=fx?0:-Math.sign(pz*s);
    let ok=true;for(let a=-1;a<=2&&ok;a++)for(let b=-1;b<=2&&ok;b++)if(warMouthNear(B,X+a,Z+b,1.5))ok=false;if(ok){const y=gy(X,Z);warHut(X,Z,y,fx,fz,hsh(X,9229,Z));}}
  for(let k=0;k<3;k++){const X=Math.floor(en.cx+ox*3+px*(k-1)*2),Z=Math.floor(en.cz+oz*3+pz*(k-1)*2);put(X,Z,y=>PW(X,y,Z,k===1?BARREL:CRATE,MODE_AIR));}
  // the stakes: a ring round the camp (and the mouth), open toward the mouth and away from it
  const R=en.flat?9:11,a0=en.flat?0:Math.atan2(oz,ox);
  for(let k=0;k<44;k++){const a=k/44*6.283,rel=Math.abs(angDiffV(a,a0)),back=Math.abs(angDiffV(a,a0+Math.PI));if(rel<0.3||back<0.35)continue;
    const X=Math.floor(en.cx+Math.cos(a)*R),Z=Math.floor(en.cz+Math.sin(a)*R);put(X,Z,y=>{PW(X,y,Z,CHARWOOD,MODE_AIR);if(k%2)PW(X,y+1,Z,CHARWOOD,MODE_AIR);});}
}
