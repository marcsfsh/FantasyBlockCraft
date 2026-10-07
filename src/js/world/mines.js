// ---- The dwarven mines: worked galleries on three levels and great stepped pits beneath the city
const MINE_LV=[20,32,44];
function mineZone(cx,cz){return fbm2(cx/9,cz/9,2,909.1)>-0.2;}
function galRow(cz,k){return hsh(cz,5100+k*7,17)<0.55;}
function galCol(cx,k){return hsh(cx,5200+k*7,29)<0.55;}
const pitC=new Map();
function pitAt(rx,rz){
  const key=ckey(rx,rz);if(pitC.has(key))return pitC.get(key);if(pitC.size>20000)pitC.clear();
  const r=rngAt(rx,5301,rz);let p=null;
  if(r()<0.5){const x=rx*80+26+(r()*28|0),z=rz*80+26+(r()*28|0);if(mineZone(Math.floor(x/CS),Math.floor(z/CS)))p={x:x,z:z,R:26+r()*8,top:53,bot:17,a0:r()*6.283,id:rx*7919+rz};}
  pitC.set(key,p);return p;
}
function pitsNear(cx,cz){const out=[],rx=Math.floor(cx/5),rz=Math.floor(cz/5);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const p=pitAt(rx+a,rz+b);if(p&&Math.abs(cx*CS+8-p.x)<p.R+14&&Math.abs(cz*CS+8-p.z)<p.R+14)out.push(p);}return out;}
function pitR(p,y){return p.R-3*Math.floor((p.top-y)/4);}
function pitEdge(p,X,Z){return Math.hypot(X+.5-p.x,Z+.5-p.z)+fbm2(X/7,Z/7,1,5311.3+p.id%97)*2.2;}
function inPit(X,Y,Z){if(Y<15||Y>54)return null;for(const p of pitsNear(Math.floor(X/CS),Math.floor(Z/CS)))if(Y>=p.bot-1&&Y<=p.top&&pitEdge(p,X,Z)<pitR(p,Y)+1)return p;return null;}
function inMineCell(X,Y,Z){
  if(Y<15||Y>57)return false;const cx=Math.floor(X/CS),cz=Math.floor(Z/CS);if(!mineZone(cx,cz))return inPit(X,Y,Z)!==null;
  for(let k=0;k<3;k++){const f=MINE_LV[k];if(Y<f-1||Y>f+5)continue;const lx=X-cx*CS,lz=Z-cz*CS;
    if(galRow(cz,k)&&Math.abs(lz-8)<=5)return true;if(galCol(cx,k)&&Math.abs(lx-8)<=5)return true;}
  return inPit(X,Y,Z)!==null;
}
function mineName(X,Y,Z){
  if(Y<15||Y>57)return null;const cx=Math.floor(X/CS),cz=Math.floor(Z/CS);
  if(inPit(X,Y,Z))return 'The Great Pit of '+holdOf(cx,cz).name;
  if(inMineCell(X,Y,Z))return 'The Deep Mines of '+holdOf(cx,cz).name;
  return null;
}
function mineGallery(WCX,WCZ,f,alongX,k,I){
  const c=alongX?gz0+8:gx0+8;
  for(let t=0;t<CS;t++){
    const X=alongX?gx0+t:c,Z=alongX?c:gz0+t,along=alongX?X:Z;
    for(let w=-1;w<=1;w++){const XX=alongX?X:X+w,ZZ=alongX?Z+w:Z;for(let y=f;y<f+4;y++)PW(XX,y,ZZ,AIR,MODE_SET);
      const q=hsh(XX,f,ZZ);PW(XX,f-1,ZZ,q<0.35?COBBLE:q<0.55?GRAVEL:q<0.8?DEEP:DWTILE,MODE_SET);}
    if(((along%4)+4)%4===0){
      for(const w of [-2,2]){const XX=alongX?X:X+w,ZZ=alongX?Z+w:Z;for(let y=f;y<f+4;y++)PW(XX,y,ZZ,hsh(along,k,w)<0.6?DWPILLAR:LOG,MODE_SET);}
      const broken=hsh(along,k+9,c)<0.35*I;
      for(let w=-2;w<=2;w++){const XX=alongX?X:X+w,ZZ=alongX?Z+w:Z;if(!(broken&&Math.abs(w)<=1))PW(XX,f+4,ZZ,PLANKS,MODE_SET);}
      if(!broken&&hsh(along,k+3,c)<0.05)PW(X,f+3,Z,LANTERN,MODE_SET);
      if(hsh(along,k+5,c)<0.3*I)PW(alongX?X:X+1,f+3,alongX?Z+1:Z,COBWEB,MODE_SET);
    }
    const q2=hsh(X,f+2,Z);
    if(q2>0.25*I)PW(X,f,Z,alongX?RAILX:RAILZ,MODE_SET);else if(q2<0.08)PW(X,f,Z,GRAVEL,MODE_SET);
    if(hsh(X,f+8,Z)<0.015)PW(X,f,Z,BARREL,MODE_SET);
    if(hsh(X,f+11,Z)<0.012*I)PW(alongX?X:X-1,f,alongX?Z-1:Z,BONES,MODE_SET);
  }
  // a partial cave-in: one side heaped two high, the middle a low step, the far side clear
  if(hsh(WCX*3+k,5401,WCZ*3+(alongX?1:2))<0.3*I){const t0=3+Math.floor(hsh(WCX,5402+k,WCZ)*9),side=hsh(WCX,5403+k,WCZ)<0.5?-1:1;
    for(let t=t0;t<t0+4;t++)for(const w of [side,0]){const hgt=w===side?2:1,XX=alongX?gx0+t:c+w,ZZ=alongX?c+w:gz0+t;for(let y=f;y<f+hgt;y++)PW(XX,y,ZZ,y===f?GRAVEL:COBBLE,MODE_SET);}}
}
function mineJunction(WCX,WCZ,f,k,I){
  const cx=gx0+8,cz=gz0+8,r=rngAt(WCX,5501+k,WCZ),kind=r();
  for(let a=-4;a<=4;a++)for(let b=-4;b<=4;b++){for(let y=f;y<f+5;y++)PW(cx+a,y,cz+b,AIR,MODE_SET);PW(cx+a,f-1,cz+b,(a+b)&1?DEEP:DWTILE,MODE_SET);PW(cx+a,f+5,cz+b,DWBRICK,MODE_SET);}
  for(const a of [-3,3])for(const b of [-3,3])for(let y=f;y<f+5;y++)PW(cx+a,y,cz+b,DWPILLAR,MODE_SET);
  if(kind<0.3){ // an old smelting floor
    for(let a=-2;a<=2;a+=2)PW(cx+a,f,cz-4,FURN,MODE_SET);PW(cx-4,f,cz+3,CRUSHER,MODE_SET);
    for(let a=2;a<=3;a++)for(let b=1;b<=2;b++)PW(cx+a,f-1,cz+b,LAVA,MODE_SET);
    if(r()<0.6)PW(cx-4,f,cz-3,DWCHEST,MODE_SET);
  }else if(kind<0.55){ // ore store
    for(let b=-3;b<=3;b++)if(r()<0.7)PW(cx+4,f,cz+b,BARREL,MODE_SET);if(r()<0.5)PW(cx-4,f,cz+4,DWCHEST,MODE_SET);
  }else if(kind<0.7){ // a shrine to the miners' patron
    statueP(cx,f,cz-4,CALCITE);if(r()>0.5*I)brazierP(cx-2,f,cz-4);
  }
  if(r()>0.7*I)PW(cx,f+4,cz,LANTERN,MODE_SET);
  if(r()<0.4*I){for(let a=-4;a<=-1;a++)for(let b=1;b<=4;b++){const hgt=Math.max(0,3-Math.max(-1-a,b-1));for(let y=f;y<f+hgt;y++)PW(cx+a,y,cz+b,y===f?GRAVEL:COBBLE,MODE_SET);}}
}
function mineInclines(WCX,WCZ){ // stair drifts beside a row gallery, climbing from one level to the next
  for(const ax of [WCX-1,WCX])for(let k=0;k<2;k++){
    if(!(galRow(WCZ,k)&&galRow(WCZ,k+1)&&mineZone(ax,WCZ)&&mineZone(ax+1,WCZ)&&hsh(ax,5601+k,WCZ)<0.45))continue;
    const f=MINE_LV[k],z0=WCZ*CS+8;
    for(let t=0;t<=12;t++){const X=ax*CS+10+t,fl=f-1+t;
      for(let w=3;w<=5;w++){PW(X,fl,z0+w,DWTILE,MODE_SET);for(let y=fl+1;y<=fl+4;y++)PW(X,y,z0+w,AIR,MODE_SET);}
      PW(X,fl+5,z0+4,(t%3===0)?PLANKS:STONE,MODE_STONE);}
    for(const t of [0,1])for(let y=f;y<f+4;y++)PW(ax*CS+10+t,y,z0+2,AIR,MODE_SET);
    for(const t of [11,12])for(let y=MINE_LV[k+1];y<MINE_LV[k+1]+4;y++)PW(ax*CS+10+t,y,z0+2,AIR,MODE_SET);
  }
}
function carvePit(p){
  const I=ruinI(Math.floor(p.x/CS),Math.floor(p.z/CS));
  for(let Z=gz0;Z<gz0+CS;Z++)for(let X=gx0;X<gx0+CS;X++){
    const d=pitEdge(p,X,Z);if(d>p.R+1)continue;
    for(let y=p.bot;y<=p.top;y++)if(d<pitR(p,y))PW(X,y,Z,AIR,MODE_SET);
    if(d<pitR(p,p.bot)){PW(X,p.bot-1,Z,hsh(X,p.bot,Z)<0.4?GRAVEL:DEEP,MODE_SET);if(hsh(X,p.bot+1,Z)<0.06*I)PW(X,p.bot,Z,GRAVEL,MODE_SET);}
  }
  // stair notches from each bench down to the next
  const n=Math.floor((p.top-p.bot)/4);
  for(let j=0;j<n;j++){const walk=p.top-4*j-3,Rin=p.R-3*(j+1),th=p.a0+j*2.1;
    for(let s=0;s<4;s++)for(let w=0;w<2;w++){const rr=Rin+0.6+w,ang=th+s*1.05/rr,X=Math.floor(p.x+Math.cos(ang)*rr),Z=Math.floor(p.z+Math.sin(ang)*rr);
      for(let y=walk-1-s;y<walk;y++)PW(X,y,Z,AIR,MODE_SET);PW(X,walk-2-s,Z,DWTILE,MODE_SET);}}
  // cranes leaning out over the pit, chains still hanging
  for(let c=0;c<3;c++){const ang=p.a0+1+c*2.09,rr=p.R-1.5,mx=Math.floor(p.x+Math.cos(ang)*rr),mz=Math.floor(p.z+Math.sin(ang)*rr),fy=p.top-3;
    for(let y=fy;y<=p.top+3;y++)PW(mx,y,mz,DWPILLAR,MODE_SET);
    for(let s=1;s<=6;s++){const X=Math.floor(p.x+Math.cos(ang)*(rr-s)),Z=Math.floor(p.z+Math.sin(ang)*(rr-s));PW(X,p.top,Z,PLANKS,MODE_SET);
      if(s===6&&hsh(mx,c,mz)>0.4*I){for(let y=p.top-1;y>=p.top-9;y--)PW(X,y,Z,STEELB,MODE_SET);PW(X,p.top-10,Z,BARREL,MODE_SET);}}}
  // rubble slides and abandoned barrows on the benches
  for(let j=0;j<n;j++){const walk=p.top-4*j-3;for(let q=0;q<5;q++){const ang=p.a0+j*1.3+q*1.257,rr=p.R-3*j-1.5,X=Math.floor(p.x+Math.cos(ang)*rr),Z=Math.floor(p.z+Math.sin(ang)*rr),h=hsh(X,walk,Z);
    if(h<0.35*I){for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)PW(X+a,walk,Z+b,GRAVEL,MODE_AIR);PW(X,walk+1,Z,COBBLE,MODE_AIR);}else if(h<0.5)PW(X,walk,Z,BARREL,MODE_AIR);else if(h<0.55)PW(X,walk,Z,DWCHEST,MODE_AIR);}}
}
function applyMines(WCX,WCZ){
  if(mineZone(WCX,WCZ)){const I=ruinI(WCX,WCZ);
    for(let k=0;k<3;k++){const f=MINE_LV[k],row=galRow(WCZ,k),col=galCol(WCX,k);
      if(row)mineGallery(WCX,WCZ,f,true,k,I);if(col)mineGallery(WCX,WCZ,f,false,k,I);if(row&&col)mineJunction(WCX,WCZ,f,k,I);}
    mineInclines(WCX,WCZ);}
  for(const p of pitsNear(WCX,WCZ))carvePit(p);
}
// a stairwell from an avenue of the lower deep down into the top mine gallery
function descentAt(cx,cz,L,axX){return L===0&&mineZone(cx,cz)&&(axX?galRow(cz,2):galCol(cx,2))&&hsh(cx,4301,cz)<0.4;}
function dwDescent(cx,cz,yb,axX){
  const P=(a,c)=>[cx+(axX?a:c),cz+(axX?c:a)],gf=MINE_LV[2]-1;
  for(let a=-7;a<=2;a++)for(let c=3;c<=5;c++){const [X,Z]=P(a,c);for(let y=yb;y<yb+6;y++)PW(X,y,Z,AIR,MODE_SET);}
  for(let t=0;t<=8;t++){const a=2-t,fl=yb-1-t;for(let c=3;c<=5;c++){const [X,Z]=P(a,c);PW(X,fl,Z,DWTILE,MODE_SET);for(let y=fl+1;y<yb;y++)PW(X,y,Z,AIR,MODE_SET);}
    for(const c of [2,6]){const [X,Z]=P(a,c);for(let y=fl;y<yb-1;y++)PW(X,y,Z,DWBRICK,MODE_SET);}}
  const land=yb-11;for(let c=-1;c<=5;c++){const [X,Z]=P(-7,c);PW(X,land,Z,DWTILE,MODE_SET);for(let y=land+1;y<=land+4;y++)PW(X,y,Z,AIR,MODE_SET);}
  for(let t=0;land-1-t>=gf;t++){const a=-6+t,fl=land-1-t;for(let c=-1;c<=1;c++){const [X,Z]=P(a,c);PW(X,fl,Z,DWTILE,MODE_SET);for(let y=fl+1;y<=fl+4;y++)PW(X,y,Z,AIR,MODE_SET);}
    for(const c of [-2,2]){const [X,Z]=P(a,c);for(let y=fl;y<=fl+4;y++)if(GW(X,y,Z)===AIR||y>=gf+5)PW(X,y,Z,DWBRICK,MODE_SET);}}
  for(let a=-7;a<=1;a++){const [X,Z]=P(a,2);PW(X,yb,Z,DWBRICK,MODE_SET);}
  for(let a=-7;a<=2;a++){const [X,Z]=P(a,6);PW(X,yb,Z,DWBRICK,MODE_SET);}
  for(let c=3;c<=5;c++){const [X,Z]=P(-8,c);PW(X,yb,Z,DWBRICK,MODE_SET);}
}
