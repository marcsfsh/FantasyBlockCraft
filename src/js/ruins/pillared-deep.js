// ---- The Pillared Deep: a 3x3-chunk hall rising through both levels, a forest of giant columns
const delfC=new Map();
function delfAt(cx,cz){
  const ax=Math.floor(cx/3)*3,az=Math.floor(cz/3)*3,key=ckey(ax,az);
  if(delfC.has(key))return delfC.get(key);if(delfC.size>20000)delfC.clear();
  let d=null;
  if(hsh(ax,2001,az)<0.05){let ok=true;for(let a=0;a<3&&ok;a++)for(let b=0;b<3&&ok;b++)if(!ruinZone(ax+a,az+b))ok=false;
    if(ok)d={ax:ax,az:az,x0:ax*CS,x1:ax*CS+47,z0:az*CS,z1:az*CS+47,cx:ax*CS+24,cz:az*CS+24};}
  delfC.set(key,d);return d;
}
function inDelf(cx,cz){return !!delfAt(cx,cz);}
function buildDelf(d,WCX,WCZ){
  const y0=RUIN_Y[0],top=y0+31,r=rngAt(d.ax,2002,d.az),I=ruinI(d.ax+1,d.az+1);
  for(let X=Math.max(gx0,d.x0);X<=Math.min(gx0+CS-1,d.x1);X++)for(let Z=Math.max(gz0,d.z0);Z<=Math.min(gz0+CS-1,d.z1);Z++){
    const edge=X===d.x0||X===d.x1||Z===d.z0||Z===d.z1,dx=X-d.cx,dz=Z-d.cz;
    PW(X,y0-2,Z,DWBRICK,MODE_FILL);
    let fl=edge?DWBRICK:(Math.abs(dx)===Math.abs(dz)||dx===0||dz===0)?CALCITE:DWTILE;if(!edge&&hsh(X,y0,Z)<0.18*I)fl=GRAVEL;
    PW(X,y0-1,Z,fl,MODE_SET);
    for(let y=y0;y<top;y++){let id=AIR;if(edge){const al=(X===d.x0||X===d.x1)?Z:X;id=al%4===0?DWPILLAR:hsh(X,y,Z)<0.25*I?DWCRACK:DWBRICK;if(y===y0+3&&al%4===2)id=RUNE;}PW(X,y,Z,id,MODE_SET);}
    PW(X,top,Z,DWBRICK,MODE_SET);
  }
  // the columns
  for(let px=8;px<=40;px+=8)for(let pz=8;pz<=40;pz+=8){
    const X=d.x0+px,Z=d.z0+pz,hb=hsh(X,2003,Z),broken=hb<0.28*I,hgt=broken?3+Math.floor(hsh(X,2004,Z)*7):top-y0;
    for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){for(let y=y0;y<y0+hgt;y++)PW(X+a,y,Z+b,(a&&b)?DWBRICK:DWPILLAR,MODE_SET);PW(X+a,y0,Z+b,DWBRICK,MODE_SET);}
    for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)if(Math.max(Math.abs(a),Math.abs(b))===2)PW(X+a,y0,Z+b,DWBRICK,MODE_SET);
    if(!broken){for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){PW(X+a,top-1,Z+b,DWBRICK,MODE_SET);if(Math.abs(a)<2&&Math.abs(b)<2)PW(X+a,top-2,Z+b,DWBRICK,MODE_SET);}
      if(hsh(X,2005,Z)>0.55+0.3*I)PW(X+2,y0+6,Z,SCONCE,MODE_SET);}
    else{const dir=hsh(X,2006,Z)<0.5?1:-1,alongX=hsh(X,2007,Z)<0.5,len=4+Math.floor(hsh(X,2008,Z)*4);
      for(let k=2;k<2+len;k++)for(let w=-1;w<=0;w++){const XX=X+(alongX?dir*k:w),ZZ=Z+(alongX?w:dir*k);PW(XX,y0,ZZ,DWPILLAR,MODE_SET);if(w===0)PW(XX,y0+1,ZZ,DWPILLAR,MODE_SET);}
      for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const hi=2-Math.max(Math.abs(a),Math.abs(b))+(hsh(X+a,y0,Z+b)<0.5?1:0);for(let y=0;y<hi;y++)PW(X+a+(alongX?0:3),y0+y,Z+b+(alongX?3:0),y?COBBLE:GRAVEL,MODE_SET);}
      for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(let y=top-3;y<=top+2;y++)PW(X+a,y,Z+b,AIR,MODE_SET);}
  }
  // the tomb at the heart of the hall
  for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++){const g=Math.max(Math.abs(a),Math.abs(b));PW(d.cx+a,y0,d.cz+b,g<=3?CALCITE:AIR,MODE_SET);if(g<=2)PW(d.cx+a,y0+1,d.cz+b,CALCITE,MODE_SET);}
  PW(d.cx,y0+2,d.cz,CALCITE,MODE_SET);PW(d.cx,y0+2,d.cz+1,CALCITE,MODE_SET);PW(d.cx,y0+3,d.cz,RUNE,MODE_SET);
  PW(d.cx-2,y0+2,d.cz-2,LECTERN,MODE_SET);PW(d.cx+2,y0+2,d.cz+2,DWCHEST,MODE_SET);
  for(const [a,b] of [[-3,1],[2,-3],[3,3],[-1,3]])PW(d.cx+a,y0+1,d.cz+b,BONES,MODE_SET);
  // doorways and overlooks where the surrounding city meets the hall
  const side=(outX,outZ,inX,inZ,midX,midZ,alongX)=>{
    if(ruinActive(outX,outZ,0)&&!inDelf(outX,outZ))for(let w=-2;w<=2;w++)for(let y=y0;y<y0+6;y++)PW(midX+(alongX?w:0),y,midZ+(alongX?0:w),AIR,MODE_SET);
    if(ruinActive(outX,outZ,1)&&!inDelf(outX,outZ)){const yb=RUIN_Y[1];for(let w=-2;w<=2;w++){for(let y=yb;y<yb+5;y++)PW(midX+(alongX?w:0),y,midZ+(alongX?0:w),AIR,MODE_SET);PW(midX+(alongX?w:0),yb-1,midZ+(alongX?0:w),DWTILE,MODE_SET);PW(midX+(alongX?w:0),yb,midZ+(alongX?0:w),DWBRICK,MODE_SET);}}
  };
  const cX=WCX,cZ=WCZ,mx=gx0+8,mz=gz0+8;
  if(cX===d.ax)side(cX-1,cZ,cX,cZ,d.x0,mz,false);if(cX===d.ax+2)side(cX+1,cZ,cX,cZ,d.x1,mz,false);
  if(cZ===d.az)side(cX,cZ-1,cX,cZ,mx,d.z0,true);if(cZ===d.az+2)side(cX,cZ+1,cX,cZ,mx,d.z1,true);
  // remains and webs scattered about the floor edges
  for(let k=0;k<12;k++){const X=gx0+(hsh(WCX,2100+k,WCZ)*16|0),Z=gz0+(hsh(WCX,2200+k,WCZ)*16|0);if(GW(X,y0,Z)===AIR&&GW(X,y0-1,Z)>0&&SOLID[GW(X,y0-1,Z)])PW(X,y0,Z,k%3?GRAVEL:BONES,MODE_SET);}
}
// Heavier decay: several collapses per room, gutted furniture, bones and cobwebs
const FURNISH=new Set([PLANKS,BARREL,BOOKS,WOOLR,WOOLB,WOOLG,WOOLY,WOOLW,FURN,STEELB,BRASB,COPB,BRONB]);
function dwRuin(cx,cz,yb,h,hh,I,seed){
  const q=(k)=>hsh(seed,k,cz*7+cx);
  const events=1+Math.floor(I*3);
  for(let e=0;e<events;e++){
    const kind=q(10+e),sx=q(20+e)<0.5?-1:1,sz=q(30+e)<0.5?-1:1,off=Math.floor(q(40+e)*(h-3));
    if(kind<0.4){const alongX=q(50+e)<0.5,len=2+Math.floor(q(60+e)*4),hgt=2+Math.floor(q(70+e)*(hh-2));
      for(let k=0;k<len;k++){const X=alongX?cx+sx*(off-k):cx+sx*h,Z=alongX?cz+sz*h:cz+sz*(off-k);for(let y=yb+hh-hgt;y<=yb+hh;y++)PW(X,y,Z,AIR,MODE_SET);PW(X,yb,Z,GRAVEL,MODE_SET);}}
    else if(kind<0.8){const bx=cx+sx*(h-2-Math.min(off,2)),bz=cz+sz*(h-2);
      for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){for(let y=yb+hh-1;y<=yb+hh+2;y++)PW(bx+a,y,bz+b,AIR,MODE_SET);}
      for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const X=bx+a,Z=bz+b;if(Math.max(Math.abs(X-cx),Math.abs(Z-cz))>=h)continue;const hi=3-Math.max(Math.abs(a),Math.abs(b));for(let y=0;y<hi;y++)PW(X,yb+y,Z,y?COBBLE:GRAVEL,MODE_SET);}}
    else{const alongX=q(80+e)<0.5;for(let k=0;k<5;k++){const X=alongX?cx-sx*(h-2-k):cx-sx*(h-1),Z=alongX?cz-sz*(h-1):cz-sz*(h-2-k);PW(X,yb,Z,DWPILLAR,MODE_SET);}}
  }
  for(let dx=-h+1;dx<=h-1;dx++)for(let dz=-h+1;dz<=h-1;dz++){
    const X=cx+dx,Z=cz+dz,ring=Math.max(Math.abs(dx),Math.abs(dz)),v=hsh(X,yb+31,Z);
    for(let y=yb;y<yb+3;y++){const c=GW(X,y,Z);if(c>0&&FURNISH.has(c)&&hsh(X,y,Z)<0.45*I)PW(X,y,Z,y===yb&&hsh(X,y+1,Z)<0.5?GRAVEL:AIR,MODE_SET);}
    if(ring===h-1&&GW(X,yb,Z)===AIR&&v<0.06*I)PW(X,yb,Z,BONES,MODE_SET);
    else if(ring>=h-2&&GW(X,yb,Z)===AIR&&v<0.12*I)PW(X,yb,Z,GRAVEL,MODE_SET);
    if(ring===h-1&&GW(X,yb+hh-2,Z)===AIR&&hsh(X,yb+hh,Z)<0.25*I)PW(X,yb+hh-2,Z,COBWEB,MODE_SET);
  }
}
function dwBreach(cx,cz,yb,h,WCX,WCZ,L){
  if(hsh(WCX,L*97+91,WCZ)>0.65)return;
  const sides=[[1,0],[-1,0],[0,1],[0,-1]],start=Math.floor(hsh(WCX,L*97+92,WCZ)*4);
  for(let s2=0;s2<4;s2++){const [sx,sz]=sides[(start+s2)%4];
    for(let t=-h+2;t<=h-2;t++){
      const wx=cx+(sx?sx*h:t),wz=cz+(sz?sz*h:t),ox=wx+sx,oz=wz+sz;
      if(GW(ox,yb,oz)!==AIR||GW(ox,yb+1,oz)!==AIR||GW(wx-sx,yb,wz-sz)!==AIR)continue;
      for(let w=0;w<2;w++)for(let y=yb;y<yb+3;y++){const X=wx+(sx?0:w),Z=wz+(sz?0:w);if(Math.abs(X-cx)<=h&&Math.abs(Z-cz)<=h)PW(X,y,Z,AIR,MODE_SET);}
      PW(wx-sx,yb,wz-sz,GRAVEL,MODE_SET);PW(wx,yb+3,wz,DWCRACK,MODE_SET);
      return;
    }}
}
// ---- Final tidy of a ruin chunk: nothing floats, hanging chains reach a ceiling, and sunken water never opens into the caves
const TIDY_DROP=new Set([GRAVEL,BONES,GLOWSHROOM,BARREL]);
function dwTidy(){
  const yA=RUIN_Y[0]-7,yB=RUIN_Y[1]+18,isS=(id)=>id>0&&SOLID[id];
  // sunken water: wall it in wherever it meets open air below the floors
  for(let y=yA;y<=yB;y++){if(!(y<=RUIN_Y[0]-1||(y>=RUIN_Y[1]-6&&y<=RUIN_Y[1]-1)))continue;
    for(let Z=gz0;Z<gz0+CS;Z++)for(let X=gx0;X<gx0+CS;X++){if(GW(X,y,Z)!==WATER)continue;
      for(const [a,b,c] of [[1,0,0],[-1,0,0],[0,0,1],[0,0,-1],[0,-1,0]])if(GW(X+a,y+b,Z+c)===AIR)PW(X+a,y+b,Z+c,DWBRICK,MODE_SET);}}
  // stray cave water hanging into the ruins (a cavern lake cut open by a collapse or a passage) becomes rock at its edge
  for(let y=yA;y<=yB;y++){if(y<=RUIN_Y[0]+2||(y>=RUIN_Y[1]-6&&y<=RUIN_Y[1]+2))continue;
    for(let Z=gz0;Z<gz0+CS;Z++)for(let X=gx0;X<gx0+CS;X++){if(GW(X,y,Z)!==WATER)continue;
      for(const [a,b,c] of [[1,0,0],[-1,0,0],[0,0,1],[0,0,-1],[0,-1,0]])if(GW(X+a,y+b,Z+c)===AIR){PW(X,y,Z,y<DEEPY?DEEP:STONE,MODE_SET);break;}}}
  // loose things resting on nothing
  for(let y=yA;y<=yB;y++)for(let Z=gz0;Z<gz0+CS;Z++)for(let X=gx0;X<gx0+CS;X++){
    const id=GW(X,y,Z);if(id<=0)continue;const bl=GW(X,y-1,Z);if(bl<0)continue;
    if(TIDY_DROP.has(id)&&!isS(bl)&&(bl!==WATER||id!==GRAVEL))PW(X,y,Z,AIR,MODE_SET);
    else if((id===DWCHEST||id===LECTERN)&&bl===AIR)PW(X,y-1,Z,DWTILE,MODE_SET);
    else if((id===COBBLE||id===DWCRACK)&&bl===AIR&&!isS(GW(X,y+1,Z))){let side=false;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])if(isS(GW(X+a,y,Z+b)))side=true;if(!side)PW(X,y,Z,AIR,MODE_SET);}
  }
  // chains and lanterns: keep only what hangs from a ceiling, stands on a floor, or hangs off a kept chain
  const chain=(id)=>id===STEELB||id===LANTERN,anchorS=(id)=>id>0&&SOLID[id]&&id!==STEELB;
  const runs=[];
  for(let Z=gz0;Z<gz0+CS;Z++)for(let X=gx0;X<gx0+CS;X++){let y=yA;while(y<=yB){if(!chain(GW(X,y,Z))){y++;continue;}let y1=y;while(y1+1<=yB&&chain(GW(X,y1+1,Z)))y1++;
    let ok=anchorS(GW(X,y1+1,Z))||anchorS(GW(X,y-1,Z));
    for(let k=y;k<=y1&&!ok;k++)for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const n=GW(X+a,k,Z+b);if(n<0||anchorS(n)){ok=true;break;}}
    runs.push({X,Z,y0:y,y1,ok});y=y1+1;}}
  for(let pass=0;pass<3;pass++)for(const r of runs){if(r.ok)continue;
    for(const s of runs){if(!s.ok)continue;if(Math.abs(s.X-r.X)+Math.abs(s.Z-r.Z)!==1)continue;if(s.y0<=r.y1&&s.y1>=r.y0){r.ok=true;break;}}}
  for(const r of runs)if(!r.ok)for(let y=r.y0;y<=r.y1;y++)PW(r.X,y,r.Z,AIR,MODE_SET);
}
const postFns=[],roomRecs=[];
function secretEdge(cx,cz,dx,dz,L){
  if(dx<0||dz<0)return secretEdge(cx+dx,cz+dz,-dx,-dz,L);
  if(hsh(cx*2+dx,L*97+111,cz*2+dz)>=0.25||edgeOpen(cx,cz,dx,dz,L))return false;
  for(const [a,b] of [[cx,cz],[cx+dx,cz+dz]]){if(!ruinActive(a,b,L)||isAvenue(a,b)||inDelf(a,b)||megaAt(a,b,L)||atriumAt(a,b))return false;const t=ruinType(a,b,L);if(t==='chasm'||t==='stair'||t==='vault')return false;if(cellShape(a,b,L,t).yo!==0)return false;}
  return true;
}
function dwSecret(cx,cz,yb,h,WCX,WCZ,L){
  for(const [dx,dz] of DIRS4){if(!secretEdge(WCX,WCZ,dx,dz,L))continue;
    const wx=cx+dx*h,wz=cz+dz*h;PW(wx,yb,wz,DWCRACK,MODE_SET);PW(wx,yb+1,wz,DWCRACK,MODE_SET);
    for(let k=h+1;k<=8;k++){const X=cx+dx*k,Z=cz+dz*k;if(X<gx0||X>=gx0+CS||Z<gz0||Z>=gz0+CS)break;
      PW(X,yb-1,Z,DWTILE,MODE_SET);PW(X,yb,Z,AIR,MODE_SET);PW(X,yb+1,Z,AIR,MODE_SET);PW(X,yb+2,Z,DWBRICK,MODE_SET);
      for(const sd of [-1,1]){const SX=X+(dz?sd:0),SZ=Z+(dx?sd:0);for(let y=yb;y<yb+2;y++)PW(SX,y,SZ,DWBRICK,MODE_SET);}
      if(k===8||(X===gx0||X===gx0+CS-1||Z===gz0||Z===gz0+CS-1)){if(hsh(X,yb,Z)<0.4)PW(X,yb,Z,BONES,MODE_SET);}}
  }
}
let curI=0,curH=0,curHH=0;
function applyRuins(WCX,WCZ){
  const cx=gx0+8,cz=gz0+8;
  const st=stairAt(WCX,WCZ),atr=atriumAt(WCX,WCZ);
  curI=ruinI(WCX,WCZ);curDist=districtOf(WCX,WCZ);
  for(let L=0;L<2;L++){
    const t=ruinType(WCX,WCZ,L);if(!t)continue;
    const yb=RUIN_Y[L],r=rngAt(WCX,L*31+600,WCZ),m=megaAt(WCX,WCZ,L);
    if(t==='delf'){buildDelf(delfAt(WCX,WCZ),WCX,WCZ);continue;}
    if(m){
      buildMega(m,L);dwRuin(gx0+8,gz0+8,yb,7,12,ruinI(WCX,WCZ),WCX*31+L);
      const hh=15;
      if(WCX===m.ax+1&&edgeOpen(WCX,WCZ,1,0,L))dwOpening('e',cx,cz,yb,hh,edgeKind(WCX,WCZ,1,0,L)==='grand',0,0,m.x0,m.x1,m.z0,m.z1);
      if(WCX===m.ax&&edgeOpen(WCX,WCZ,-1,0,L))dwOpening('w',cx,cz,yb,hh,edgeKind(WCX,WCZ,-1,0,L)==='grand',0,0,m.x0,m.x1,m.z0,m.z1);
      if(WCZ===m.az+1&&edgeOpen(WCX,WCZ,0,1,L))dwOpening('s',cx,cz,yb,hh,edgeKind(WCX,WCZ,0,1,L)==='grand',0,0,m.x0,m.x1,m.z0,m.z1);
      if(WCZ===m.az&&edgeOpen(WCX,WCZ,0,-1,L))dwOpening('n',cx,cz,yb,hh,edgeKind(WCX,WCZ,0,-1,L)==='grand',0,0,m.x0,m.x1,m.z0,m.z1);
      continue;
    }
    let sh=cellShape(WCX,WCZ,L,t);
    if(t==='avenue'||t==='plaza'||t==='stair'||t==='chasm'||t==='minehall')sh={h:7,yo:0,hh:ROOM_H[t]};
    if(atr)sh={h:7,yo:0,hh:L===0?RUIN_Y[1]-RUIN_Y[0]+11:11};
    const h=sh.h,yo=sh.yo,hh=sh.hh,fy=yb+yo;curDeco=['hall','throne','barracks','armory','statuary','tavern','archive','junction'].includes(t);
    curH=h;curHH=hh;
    if(atr){if(L===0)dwAtrium(cx,cz,r);}
    else if(t==='avenue'||t==='plaza'){const l=aveLinks(WCX,WCZ),axX=(l&3)&&!(l&12)?true:(l&12)&&!(l&3)?false:true;dwAvenue(cx,cz,yb,r,t==='plaza'||((l&3)&&(l&12)),axX);}
    else if(t==='stair')dwShell(cx,cz,h,yb,hh,r,null,true);
    else if(t==='chasm')dwChasm(cx,cz,yb,r,L,WCX,WCZ);
    else if(['quarters','office','tavern','bath','games','arena','shrine','mineworks','minehall','cistern','kitchen','armory','statuary'].includes(t))dwRoom2(t,cx,cz,fy,r);
    else dwRoom(t,cx,cz,fy,r);
    curH=0;curHH=0;curDeco=false;
    const X0=cx-h,X1=cx+h,Z0=cz-h,Z1=cz+h,g=(dx,dz)=>{const k=edgeKind(WCX,WCZ,dx,dz,L);return t==='vault'||h<7?false:k==='full'?'full':k==='grand';};
    const ohh=Math.min(hh,14);
    if(edgeOpen(WCX,WCZ,1,0,L))dwOpening('e',cx,cz,yb,ohh,g(1,0),0,0,X0,X1,Z0,Z1,yo);
    if(edgeOpen(WCX,WCZ,-1,0,L))dwOpening('w',cx,cz,yb,ohh,g(-1,0),0,0,X0,X1,Z0,Z1,yo);
    if(edgeOpen(WCX,WCZ,0,1,L))dwOpening('s',cx,cz,yb,ohh,g(0,1),0,0,X0,X1,Z0,Z1,yo);
    if(edgeOpen(WCX,WCZ,0,-1,L)&&!['hall','throne','shrine','crypt'].includes(t))dwOpening('n',cx,cz,yb,ohh,g(0,-1),0,0,X0,X1,Z0,Z1,yo);
    const simple=!atr&&!['stair','mineworks','chasm','arena','bath','farm','avenue','plaza','minehall'].includes(t);
    if(simple&&h===7&&hsh(WCX,L*97+77,WCZ)<0.18)dwCellar(cx,cz,fy,h);
    if(simple&&t!=='junction'){const c=hsh(WCX,L*97+55,WCZ);const lushR=['lush','fungal'].includes(caveRegion(cx,cz)),wetR=L===0&&fbm2(cx/180,cz/180,1,3301.7)>0.2;
      dwCondition(cx,cz,fy,h,wetR&&c<0.7?'flooded':(c<0.06+0.25*curI||(lushR&&c<0.6))?'overgrown':'');}
    if(t!=='chasm'&&t!=='stair')roomRecs.push([cx,cz,fy,h,WCX,WCZ,L]);
    if(!atr&&t!=='chasm'&&t!=='stair'){dwDecay(cx,cz,fy,h,hh,curI,WCX,WCZ,L);dwRuin(cx,cz,fy,h,hh,curI,WCX*31+L);dwBreach(cx,cz,fy,h,WCX,WCZ,L);if(fy===yb)dwSecret(cx,cz,fy,h,WCX,WCZ,L);}
  }
  if(holeAt(WCX,WCZ))dwHole(cx,cz);
  for(const f of postFns)f();postFns.length=0;
  // keep a walkable way from every doorway to the middle of the room: decay rubble along it is cleared, up to and including the wall line
  for(const [cx,cz,fy,h,WX,WZ,L] of roomRecs)for(const [dx,dz] of DIRS4){if(!edgeOpen(WX,WZ,dx,dz,L))continue;
    for(let k=0;k<=h;k++)for(let w=-1;w<=1;w++){const X=cx+dx*k+(dz?w:0),Z=cz+dz*k+(dx?w:0);for(let y=fy;y<fy+3;y++){const c=GW(X,y,Z);if(c===GRAVEL||c===COBBLE||c===DWCRACK)PW(X,y,Z,AIR,MODE_SET);}}}
  roomRecs.length=0;
  dwTidy();
  // sconces whose wall was knocked out by decay come down with it
  for(let y=RUIN_Y[0]-2;y<=RUIN_Y[1]+16;y++)for(let Z=gz0;Z<gz0+CS;Z++)for(let X=gx0;X<gx0+CS;X++){
    if(GW(X,y,Z)!==SCONCE)continue;let held=false;
    for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const c=GW(X+a,y,Z+b);if(c<0||OPQ[c]){held=true;break;}}
    if(!held)PW(X,y,Z,AIR,MODE_SET);
  }
  if(st){
    dwStair(cx,cz,rngAt(WCX,707,WCZ));
    for(const yb of RUIN_Y)for(const [a,b] of [[3,0],[-3,0],[0,3],[0,-3]])for(let y=yb;y<yb+3;y++)PW(cx+a,y,cz+b,AIR,MODE_SET);
  }
}
