// ---- The Gate of the Wastes (D-067): every basin of the Volcanic Wastes has one way in for an army. Where the ring of ash
// mountains faces the nearest realm, a pass is cut through it down to the level of the lands outside, and the orcs have shut it
// with a gate between two towers; one leaf hangs ajar. Inside, a yard is cut into the inner wall for the orcs' camp, and from it a
// broad road runs down to the floor in one straight line at one in two, toward the great volcano's fortress (D-083, D-087; winding along the wall at one in eight before). Outside, the pass opens onto the siege lines and the camp of
// the allied hosts, levelled at the gate's height. Plans are pure functions of the seed and the land layout, read from the
// ground before any volcano, realm or gate touches it (wgRaw, never cached); colInfoBase shapes the ground to them (wgMask,
// wgShape). Everything else keeps off them (wasteGateNear); the great volcano and its cones too (wasteGateKeep).
//
// The gate's frame: u from the gate outward (toward the camp), v across; the gate faces one of the four ways (dir, DIRS), so its
// works stand square in the world. Inside the ring u is negative.
const WG_STEP_MS=6,WG_GRADE=1/2,WG_RW=12,WG_WY=50,WG_WG=34,WG_CAMP=[250,125],wgC=new Map(),wgJ=new Map(),wgTC=new Map(),TWG={},TWG2={};let wgSkip=false;
// the ground before the gate's works, the volcanoes and the realms shape it (so the plan cannot depend on itself)
function wgRaw(X,Z){const a=volcSkip,b=wgSkip,c=realmSkip;volcSkip=wgSkip=realmSkip=true;try{return colInfoBase(Math.round(X),Math.round(Z),TWG);}finally{volcSkip=a;wgSkip=b;realmSkip=c;}}
const wgBs=(X,Z)=>{landsAt(Math.round(X),Math.round(Z),TWG2);return TWG2.bs;};
// (the same frame as siteUV gives a site facing inward, DIRS[P.din], so the realms' column builders serve the gate's works)
const wgUV=(P,X,Z)=>{const dx=X-P.X,dz=Z-P.Z;return [dx*P.dx+dz*P.dz,dx*P.dz-dz*P.dx];};
const wgXZ=(P,u,v)=>[P.X+u*P.dx+v*P.dz,P.Z+u*P.dz-v*P.dx];
// ---- The plan of a basin's gate (null if no side of it will do)
function wasteGateOf(B){
  if(wgC.has(B.key))return wgC.get(B.key);const g=wgJ.get(B.key)||planGate(B);wgJ.delete(B.key);let r;while(!(r=g.next()).done);
  if(wgC.size>400)wgC.clear();wgC.set(B.key,r.value);return r.value;}
function* planGate(B){
  // from the cell of the basin nearest its middle (its centre lies on the floor), toward the nearest stretch any realm holds
  let O=B.cells[0];for(const c of B.cells)if(Math.hypot(c.x-B.cx,c.z-B.cz)<Math.hypot(O.x-B.cx,O.z-B.cz))O=c;
  let tg=null,td=1e9;const ci=Math.floor(O.x/LS),cj=Math.floor(O.z/LS);
  for(let a=-9;a<=9;a++)for(let b=-9;b<=9;b++){const c=landSite(ci+a,cj+b);if(LANDS[cellLand(c)].k==='volcanic'||!realmHeld(stretchCell(c)))continue;const d=Math.hypot(c.x-O.x,c.z-O.z);if(d<td&&wgBs(c.x,c.z)>WB_END){td=d;tg=c;}}
  const ta=tg?Math.atan2(tg.z-O.z,tg.x-O.x):hsh(O.i,9701,O.j)*6.2832,mid=WB_IN+WB_CR/2;
  // candidates: rays out from there to the middle of the ring's crest; the gate faces the nearest of the four ways to the ring's
  // own outward line there. Each is scored by the ground its camp would stand on (out of every basin and its ring, land, as
  // level as may be), how high the crest stands over it, and how near it faces the realm
  let best=null;
  for(let k=0;k<24;k++){yield;const a=k/24*6.2832,ux=Math.cos(a),uz=Math.sin(a);let d=0;
    for(;d<2600;d+=16)if(wgBs(O.x+ux*d,O.z+uz*d)>=mid)break;if(d>=2600)continue;
    let lo=Math.max(0,d-16),hi=d;for(let q=0;q<5;q++){const m=(lo+hi)/2;if(wgBs(O.x+ux*m,O.z+uz*m)>=mid)hi=m;else lo=m;}
    const X=Math.round(O.x+ux*hi),Z=Math.round(O.z+uz*hi),na=Math.atan2(wgBs(X,Z+6)-wgBs(X,Z-6),wgBs(X+6,Z)-wgBs(X-6,Z));
    let dir=0,sk=9;for(let q=0;q<4;q++){const e=Math.abs(angDiffV(na,Math.atan2(DIRS[q][1],DIRS[q][0])));if(e<sk){sk=e;dir=q;}}
    const P={X:X,Z:Z,dir:dir,din:(dir+2)%4,dx:DIRS[dir][0],dz:DIRS[dir][1]},hs=[];let bad=false,wet=0,sea=0;
    for(let i=0;i<5&&!bad;i++)for(let j=0;j<5&&!bad;j++){const [sx,sz]=wgXZ(P,150+i*60,(j-2)*60);if(wgBs(sx,sz)<WB_END+10){bad=true;break;}const ws=TWG2.wS,o=wgRaw(sx,sz);
      if(ws>0.15||o.b===0&&o.h<SEA){sea++;hs.push(SEA+3);continue;}if(o.river||o.lake||o.h<SEA+2)wet++;hs.push(o.h);}
    if(bad)continue;hs.sort((p,q)=>p-q);const hm=hs[12],sp=hs[20]-hs[4],cr=wgRaw(X,Z).h;
    // a side whose camp would stand in the sea is taken only if no other will do (its camp is built up out of the shallows)
    const sc=-Math.abs(angDiffV(a,ta))*25-sk*30-sp*1.5-wet*4+Math.min(50,cr-hm)*0.3-(sea||wet>8?1000+sea*30+wet*4:0);
    if(!best||sc>best.sc)best={sc:sc,P:P,hm:hm,cr:cr};}
  if(!best)return null;
  const P=best.P,r=rngAt(P.X,9703,P.Z);
  Object.assign(P,{key:B.key,B:B,hG:Math.max(SEA+3,Math.min(best.cr-14,best.hm))});const hG=P.hG;
  // the yard: in from the gate to where the inner wall has fallen to the gate's height (across its width), at least 70 deep
  // (banked out over the wall if need be, for the orcs' camp)
  P.uY=-110;for(let u=-8;u>=-110;u-=2){let ok=false;for(const v of [-WG_WY+6,0,WG_WY-6])if(wgRaw(...wgXZ(P,u,v)).h<hG+1)ok=true;if(ok){P.uY=Math.min(-70,u);break;}}
  // the ring's outer foot (uF), past which the ground before the camp (the siege lines) is levelled gently, not cut
  yield;P.uF=170;for(let u=10;u<=170;u+=3)if(wgBs(...wgXZ(P,u,0))>=WB_END||wgRaw(...wgXZ(P,u,0)).h<=hG+1){P.uF=Math.max(60,u);break;}
  P.uC0=P.uF+64;P.uC1=P.uC0+WG_CAMP[0];
  // the road down: from the yard's inner corner on one side, one straight line down the inner wall, falling one in two, until
  // it meets the floor (D-083, D-087)
  const side0=hsh(P.X,9705,P.Z)<0.5?1:-1;let path=null;
  for(const side of [side0,-side0]){yield;path=yield* wgTrace(P,side);if(path){P.side=side;break;}}
  if(!path)return null;P.ramp=path;path.all=path.pts.slice(1).map((_,i)=>i);
  // the reach of the works, for the tiles
  let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;const grow=(x,z,m)=>{x0=Math.min(x0,x-m);x1=Math.max(x1,x+m);z0=Math.min(z0,z-m);z1=Math.max(z1,z+m);};
  for(const [u,v] of [[P.uY,-WG_WY],[P.uY,WG_WY],[P.uC1,-WG_CAMP[1]],[P.uC1,WG_CAMP[1]]])grow(...wgXZ(P,u,v),100);for(const p of path.pts)grow(p[0],p[1],70);
  P.box=[x0,z0,x1,z1];
  P.name='The Ashen Gate of '+fullName('orc',r,false);P.camp='The Leaguer of '+nameWord('realm',r);P.ram=nameWord('dwarf',r)+' the Gatebreaker';P.yard='The Gatewarden\'s Camp';P.road='The Long Descent';
  P.id='wg'+P.X+','+P.Z;P.seed=hsh(P.X,9707,P.Z);
  return P;
}
// The road's line (D-083, D-087): one straight line from the yard's inner corner, falling one in two, cut down through the inner
// wall and banked out over lower ground until it meets the floor; steps of six. It runs straight in, the way the gate faces, where
// it comes down within 160 of the floor's edge (the great volcano stands on its line, its fortress facing it: greatOf); else it
// slants toward its side, the least that brings it down by the floor's edge. Null if no line keeps it inside the ring.
function* wgTrace(P,side){
  const hG=P.hG,[sx,sz]=wgXZ(P,P.uY+8,side*(WG_WY-WG_RW-2)),ix=-P.dx,iz=-P.dz,ax=P.dz*side,az=-P.dx*side;let pts=null,best=-1e9;
  for(const a of [0,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1,1.1,1.2,1.3]){const dx=ix*Math.cos(a)+ax*Math.sin(a),dz=iz*Math.cos(a)+az*Math.sin(a);let x=sx,z=sz,L=0,bs=0;const pp=[[x,z]];
    for(let k=0;k<160;k++){if(k%4===0)yield;x+=dx*6;z+=dz*6;L+=6;const y=hG-L*WG_GRADE;bs=wgBs(x,z);if(bs>WB_IN+WB_CR){pp.length=0;break;}pp.push([x,z]);
      if(bs<-8&&wgRaw(x,z).h>=y-1)break;} // the floor: the road is down
    if(pp.length>=8&&a===0&&bs>=-160){pts=pp;break;}
    if(pp.length>=8&&bs>best){best=bs;pts=pp;if(bs>=-40)break;}}
  if(!pts)return null;
  // smooth the line, then its lengths and heights; the road levels out on the floor
  const sm=pts.map((p,i)=>{if(i<2||i>pts.length-3)return p;let ax=0,az=0;for(let q=-2;q<=2;q++){ax+=pts[i+q][0]/5;az+=pts[i+q][1]/5;}return [ax,az];});
  const out=[];let l=0,yF=Math.round(wgRaw(...sm[sm.length-1]).h);
  for(let i=0;i<sm.length;i++){if(i)l+=Math.hypot(sm[i][0]-sm[i-1][0],sm[i][1]-sm[i-1][1]);out.push([sm[i][0],sm[i][1],l,Math.max(yF,hG-l*WG_GRADE)]);}
  // a stretch on along the floor past the foot of the wall
  const a=out[out.length-1],b=out[out.length-2],dl=Math.hypot(a[0]-b[0],a[1]-b[1])||1;for(let q=1;q<=3;q++)out.push([a[0]+(a[0]-b[0])/dl*8*q,a[1]+(a[1]-b[1])/dl*8*q,a[2]+8*q,a[3]]);
  let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;for(const p of out){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);z0=Math.min(z0,p[1]);z1=Math.max(z1,p[1]);}
  // which side of the line the drop to the floor lies on (the side the ring's outward line points away from), in the sign
  // wgRoadNear gives
  const p3=out[3],p4=out[4],ex=p4[0]-p3[0],ez=p4[1]-p3[1],gx=wgBs(p3[0]+6,p3[1])-wgBs(p3[0]-6,p3[1]),gz=wgBs(p3[0],p3[1]+6)-wgBs(p3[0],p3[1]-6);
  return {pts:out,len:out[out.length-1][2],yF:a[3],box:[x0,z0,x1,z1],drop:(ex*(-gz)-ez*(-gx))>=0?1:-1};
}
// ---- Lookups: the gates whose works may reach a tile of 64 blocks (the basins of the volcanic cells four about it), with the
// road's segments near it
function wgBasins(tx,tz){const ci=Math.floor((tx*64+32)/LS),cj=Math.floor((tz*64+32)/LS),out=[],seen=new Set();
  for(let a=-4;a<=4;a++)for(let b=-4;b<=4;b++){const c=landSite(ci+a,cj+b);if(LANDS[cellLand(c)].k!=='volcanic')continue;const B=wasteBasin(c);if(!seen.has(B.key)){seen.add(B.key);out.push(B);}}return out;}
function wgTile(X,Z){
  const tx=X>>6,tz=Z>>6,tk=tx*65536+tz;let T=wgTC.get(tk);if(T)return T;if(wgTC.size>20000)wgTC.clear();T=[];
  for(const B of wgBasins(tx,tz)){const P=wasteGateOf(B);if(!P)continue;const b=P.box;if(b[2]<tx*64||b[0]>tx*64+63||b[3]<tz*64||b[1]>tz*64+63)continue;
    const segs=[],p=P.ramp.pts;for(let i=0;i+1<p.length;i++){const m=80;if(Math.max(p[i][0],p[i+1][0])+m<tx*64||Math.min(p[i][0],p[i+1][0])-m>tx*64+63||Math.max(p[i][1],p[i+1][1])+m<tz*64||Math.min(p[i][1],p[i+1][1])-m>tz*64+63)continue;segs.push(i);}
    T.push({P:P,segs:segs});}
  wgTC.set(tk,T);return T;}
// Streaming (a step of its own, before a chunk's columns, like realmPrep): the gates of the basins about the chunk are planned a
// slice at a time, WG_STEP_MS to a call. True once all are planned
function wgPrep(X,Z){const tx=X>>6,tz=Z>>6;if(wgTC.has(tx*65536+tz))return true;
  for(const B of wgBasins(tx,tz)){if(wgC.has(B.key))continue;let g=wgJ.get(B.key);if(!g){if(wgJ.size>4)wgJ.clear();g=planGate(B);wgJ.set(B.key,g);}
    const t0=performance.now();let r;while(!(r=g.next()).done)if(performance.now()-t0>WG_STEP_MS)return false;
    wgJ.delete(B.key);if(wgC.size>400)wgC.clear();wgC.set(B.key,r.value);return false;}
  return true;}
// the nearest point of a gate's road to (X,Z) over the segments listed: [distance, length along, height there, side of the line]
const WGN=[0,0,0,0];
function wgRoadNear(P,segs,X,Z){const p=P.ramp.pts;let bd=1e9;
  for(const i of segs){const a=p[i],b=p[i+1],ex=b[0]-a[0],ez=b[1]-a[1],l2=ex*ex+ez*ez||1,t=Math.max(0,Math.min(1,((X-a[0])*ex+(Z-a[1])*ez)/l2)),qx=a[0]+ex*t,qz=a[1]+ez*t,d=Math.hypot(X-qx,Z-qz);
    if(d<bd){bd=d;WGN[0]=d;WGN[1]=a[2]+(b[2]-a[2])*t;WGN[2]=a[3]+(b[3]-a[3])*t;WGN[3]=(ex*(Z-a[1])-ez*(X-a[0]))>=0?1:-1;}}
  if(bd===1e9)WGN[0]=1e9;return WGN;}
// The level works (all at the gate's height hG), as boxes in the gate's frame [u0,u1,half-width at u0, at u1, cut slope, fill
// slope, how far out they reach]: the yard, the throat of the gate, the pass widening out through the ring, the field of the
// siege lines before the camp (graded gently), the camp
function wgPieces(P){if(P.pc)return P.pc;
  return P.pc=[[P.uY,-6,WG_WY,WG_WY,3,1.3,60],[-6,6,WG_WG,WG_WG,3.4,1.3,60],[6,P.uF,WG_WG,60,2.6,1.2,60],[P.uF,P.uC0,60,WG_CAMP[1],0.7,0.7,80],[P.uC0,P.uC1,WG_CAMP[1],WG_CAMP[1],0.6,0.6,90]];}
// how far (u,v) lies outside a piece, 0 inside
function wgOut(q,u,v){const hw=u<=q[0]?q[2]:u>=q[1]?q[3]:q[2]+(q[3]-q[2])*(u-q[0])/(q[1]-q[0]),eu=Math.max(q[0]-u,0,u-q[1]),ev=Math.max(Math.abs(v)-hw,0);return Math.hypot(eu,ev);}
// ---- The ground. Before the rivers (wgMask): o.wgate, how far the column is under the works (1 on them, fading out over their
// reach), which keeps rivers, gorges, lakes and fissures off; o.wg the tile's gates. After the volcanoes (wgShape): each work
// is levelled, cut down into the land with steep walls and banked out over lower ground, easing back to the land over its reach;
// o.wroad, how far from the road's middle (on it), o.wlvl 1 on the level works
function wgMask(X,Z,o){o.wgate=0;o.wg=null;o.wroad=-1;o.wlvl=0;if(wgSkip)return;const T=wgTile(X,Z);if(!T.length)return;o.wg=T;
  for(const t of T){const P=t.P,[u,v]=wgUV(P,X,Z);for(const q of wgPieces(P)){const e=wgOut(q,u,v);if(e<q[6])o.wgate=Math.max(o.wgate,sstep(q[6],q[6]*0.4,e));}
    if(t.segs.length){const n=wgRoadNear(P,t.segs,X,Z);if(n[0]<WG_RW+50)o.wgate=Math.max(o.wgate,sstep(WG_RW+50,WG_RW+16,n[0]));}}}
function wgShape(X,Z,o,h){
  for(const t of o.wg){const P=t.P,hG=P.hG,[u,v]=wgUV(P,X,Z);let lo=-1e9,hi=1e9;
    for(const q of wgPieces(P)){const e=wgOut(q,u,v);if(e>=q[6])continue;const f=sstep(q[6]*0.7,q[6],e)*400;hi=Math.min(hi,hG+e*q[4]+f);lo=Math.max(lo,hG-e*q[5]-f);if(e===0)o.wlvl=1;}
    if(lo>-1e9)h=Math.max(lo,Math.min(hi,h));
    if(t.segs.length){const n=wgRoadNear(P,t.segs,X,Z),e=Math.max(0,n[0]-WG_RW);if(e<50){const y=Math.round(n[2]),f=sstep(35,50,e)*400;
      h=Math.max(y-e*1.3-f,Math.min(y+e*2.5+f,h));if(n[0]<=WG_RW){o.wroad=n[0];o.wlvl=1;}}}}
  return h;}
// ---- Queries
// Is (X,Z) on (or within m of) any gate's works: its level works or its road?
function wasteGateNear(X,Z,m){m=m||0;if(wgSkip)return false;for(const t of wgTile(X,Z)){const P=t.P,[u,v]=wgUV(P,X,Z);for(const q of wgPieces(P))if(wgOut(q,u,v)<=m)return true;
  if(wgRoadNear(P,P.ramp.all,X,Z)[0]<=WG_RW+12+m)return true;}return false;}
// Is a disc of radius m about (X,Z) clear of basin B's gate? (the great volcano and its cones keep off; they lie on the floor,
// where only the road's foot reaches)
function wasteGateKeep(B,X,Z,m){const P=wasteGateOf(B);if(!P)return false;const b=P.ramp.box;if(X+m<b[0]-WG_RW-20||X-m>b[2]+WG_RW+20||Z+m<b[1]-WG_RW-20||Z-m>b[3]+WG_RW+20)return false;
  return wgRoadNear(P,P.ramp.all,X,Z)[0]<=WG_RW+20+m;}
// the gate whose works hold (X,Z) (within m), for names and spawns
function wasteGateAt(X,Z,m){if(wgSkip)return null;for(const t of wgTile(X,Z)){const P=t.P,[u,v]=wgUV(P,X,Z);for(const q of wgPieces(P))if(wgOut(q,u,v)<=(m||0))return P;}return null;}
