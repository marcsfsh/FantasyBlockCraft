// ---- Abandoned mineshafts: timbered corridors with lanterns and supply crates
const shaftCache=new Map();
function shaftsFor(WCX,WCZ){
  const key=ckey(WCX,WCZ);let s=shaftCache.get(key);if(s)return s;
  if(shaftCache.size>8000)shaftCache.clear();
  s=[];const r=rngAt(WCX,71,WCZ);
  if(r()<0.18){
    const x=WCX*CS+8,z=WCZ*CS+8,y=158+(r()*38|0),ax=r()<0.5?'x':'z',L=20+(r()*30|0);
    s.push([ax,x-(ax==='x'?L:0),z-(ax==='z'?L:0),L*2,y]);
    const nb=2+(r()*3|0);
    for(let b=0;b<nb;b++){const o=Math.floor((r()*2-1)*L),bl=12+(r()*28|0),sg=r()<0.5?-1:1,bx=ax==='x'?x+o:x,bz=ax==='z'?z+o:z,bax=ax==='x'?'z':'x';
      s.push([bax,bax==='x'?(sg>0?bx:bx-bl):bx,bax==='z'?(sg>0?bz:bz-bl):bz,bl,y]);}
  }
  shaftCache.set(key,s);return s;
}
function applyShafts(WCX,WCZ){
  for(let a=-4;a<=4;a++)for(let b=-4;b<=4;b++)for(const [ax,sx,sz,L,y] of shaftsFor(WCX+a,WCZ+b)){
    if(ax==='x'){if(sx+L<gx0||sx>gx0+CS||sz+1<gz0||sz-1>gz0+CS)continue;}else{if(sz+L<gz0||sz>gz0+CS||sx+1<gx0||sx-1>gx0+CS)continue;}
    for(let t=0;t<=L;t++)for(let p=-1;p<=1;p++){
      const X=ax==='x'?sx+t:sx+p,Z=ax==='x'?sz+p:sz+t;
      if(X<gx0||X>=gx0+CS||Z<gz0||Z>=gz0+CS)continue;
      const gh=ground[(X-OX)+W*(Z-OZ)];if(y+3>gh-3||inRuin(X,y,Z)||inRuin(X,y+2,Z))continue;
      for(let h=0;h<3;h++){const c=GW(X,y+h,Z);if(c!==WATER&&c!==LAVA)PW(X,y+h,Z,AIR,MODE_SET);}
      PW(X,y-1,Z,PLANKS,MODE_FILL);
      const along=ax==='x'?X:Z;
      if(along%4===0){if(p)PW(X,y,Z,LOG,MODE_SET),PW(X,y+1,Z,LOG,MODE_SET);PW(X,y+2,Z,(!p&&along%12===0)?LANTERN:PLANKS,MODE_SET);}
      else if(p&&hsh(X,y,Z)<0.02)PW(X,y,Z,CRATE,MODE_SET);
      if(!p&&GW(X,y,Z)===AIR&&hsh(X,y+5,Z)>0.12)PW(X,y,Z,ax==='x'?RAILX:RAILZ,MODE_SET);
    }
  }
}
// ---- Supply crates hold a random haul, decided by where they sit
const BARRELLOOT=[[206,1,3,6],[269,2,5,6],[207,2,5,5],[270,2,6,5],[202,3,8,4],[200,2,6,4]];
const LOOT=[[203,8,24,10],[204,1,5,5],[200,4,12,10],[220,1,4,7],[223,1,4,6],[225,1,3,4],[226,1,3,4],[227,1,2,3],[206,1,3,6],[269,2,4,5],[208,3,8,4],[209,2,5,4],
  [TORCH,4,12,8],[TNT,1,2,3],[201,4,8,4],[268,1,3,3],[267,2,6,4],[230,1,1,1.2],[228,1,1,0.6],[244,1,1,1],[245,1,1,0.4],[WIRE,4,8,2],[270,2,5,3]];
function openCrate(X,Y,Z){
  const dw=world[I(X,Y,Z)]===DWCHEST,TBL=dw?(ROOM_LOOT[roomAt(X+OX,Y,Z+OZ)]||DWLOOT):world[I(X,Y,Z)]===BARREL?BARRELLOOT:LOOT,WX=X+OX,WZ=Z+OZ,r=rngAt(WX,Y*13+7,WZ),rolls=(dw?4:2)+(r()*3|0),got=[];let tot=0;for(const l of TBL)tot+=l[3];
  const loot=[];for(let k=0;k<rolls;k++){let v=r()*tot,it=TBL[0];for(const l of TBL){v-=l[3];if(v<=0){it=l;break;}}const n=it[1]+Math.floor(r()*(it[2]-it[1]+1));loot.push([it[0],n]);got.push(n+' '+nameOf(it[0]));}
  // Creative only looks inside; survival takes everything or nothing (the roll depends only on position, so it is the same next time)
  if(!SURV()){toast('Inside: '+got.join(', '));return;}
  if(!fitsAll(loot)){toast('Not enough room to take what is inside');return;}
  for(const [id,n] of loot)addItem(id,n);
  setBlock(X,Y,Z,AIR,true);breakFx(X,Y,Z,CRATE,12);sfxBlock(PLANKS,false);tone(900,1500,0.15,0.1);
  toast('Found '+got.join(', '));drawBar(true);
}
// ---- Glow mushroom groves light up the deep caves
// ---- Points of interest underground: natural formations and lost places
const POI_TYPES=[['geode',2],['fossil',1.3],['grove',1.6],['camp',1.5],['ruins',1.1],['lab',0.7],['outpost',0.8],['shrine',1.4],['forge',0.9]];
const POI_NAMES={geode:'Crystal Geode',fossil:'Fossil',grove:'Mushroom Grove',camp:'Miners\u2019 Camp',ruins:'Ancient Ruins',lab:'Alchemist\'s Cellar',outpost:'Deep Outpost',shrine:'Crystal Shrine',forge:'Lava Forge'};
const poiCache=new Map();
function poiFor(WCX,WCZ){
  const key=ckey(WCX,WCZ);if(poiCache.has(key))return poiCache.get(key);
  if(poiCache.size>8000)poiCache.clear();
  let p=null;const r=rngAt(WCX,81,WCZ);
  if(r()<0.32){
    let tot=0;for(const t of POI_TYPES)tot+=t[1];let v=r()*tot,tp=POI_TYPES[0][0];for(const t of POI_TYPES){v-=t[1];if(v<=0){tp=t[0];break;}}
    const x=WCX*CS+4+(r()*8|0),z=WCZ*CS+4+(r()*8|0),gh=colInfo(x,z,{}).h,top=gh-14;
    {const band=['camp','lab','outpost','forge'].includes(tp)?[156,196]:['ruins','shrine'].includes(tp)?[106,146]:[208,252],y=band[0]+(r()*(band[1]-band[0])|0);p={tp:tp,x:x,y:y,z:z,seed:r()};}
  }
  poiCache.set(key,p);return p;
}
function poiNear(X,Y,Z){
  const cx=Math.floor(X/CS),cz=Math.floor(Z/CS);
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const p=poiFor(cx+a,cz+b);if(p&&Math.abs(X-p.x)<=12&&Math.abs(Z-p.z)<=12&&Math.abs(Y-p.y)<=9)return p;}
  return null;
}
function roomP(x0,y0,z0,x1,y1,z1,floor,wall){
  for(let X=x0;X<=x1;X++)for(let Y=y0;Y<=y1;Y++)for(let Z=z0;Z<=z1;Z++){
    const edge=X===x0||X===x1||Z===z0||Z===z1||Y===y0||Y===y1;
    PW(X,Y,Z,Y===y0?floor:edge?wall:AIR,MODE_SET);
  }
}
function crateP(X,Y,Z){PW(X,Y,Z,CRATE,MODE_SET);}
function buildPOI(p){
  const r=mkRng(Math.floor(p.seed*1e9)+3),x=p.x,y=p.y,z=p.z;
  switch(p.tp){
    case 'geode':{const R=4+r()*2.5;
      for(let dx=-7;dx<=7;dx++)for(let dy=-7;dy<=7;dy++)for(let dz=-7;dz<=7;dz++){const d=Math.hypot(dx,dy,dz);if(d>R)continue;const X=x+dx,Y=y+dy,Z=z+dz;
        if(d>R-1)PW(X,Y,Z,CALCITE,MODE_SET);else if(d>R-2)PW(X,Y,Z,AMETH,MODE_SET);else PW(X,Y,Z,(dy<0&&d>R-3&&r()<0.5)?CRYSTAL:AIR,MODE_SET);}
      break;}
    case 'fossil':{const ax=r()<0.5,L=8+(r()*6|0);
      for(let t=-L;t<=L;t++){const X=x+(ax?t:0),Z=z+(ax?0:t),Y=y+Math.round(Math.sin(t/L*1.6)*1.5);PW(X,Y,Z,CALCITE,MODE_STONE);
        if(Math.abs(t)<L-2&&t%2===0)for(let k=1;k<=3;k++){PW(X+(ax?0:k),Y-k+1,Z+(ax?k:0),CALCITE,MODE_STONE);PW(X-(ax?0:k),Y-k+1,Z-(ax?k:0),CALCITE,MODE_STONE);}}
      for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)PW(x+(ax?L+1:0)+dx,y+1,z+(ax?0:L+1)+dz,CALCITE,MODE_STONE);
      break;}
    case 'grove':{const R=10;
      for(let dx=-R;dx<=R;dx++)for(let dz=-R;dz<=R;dz++){const d=Math.hypot(dx,dz);if(d>R)continue;const hh=Math.round(Math.sqrt(1-(d/R)*(d/R))*7)+1;
        PW(x+dx,y-1,z+dz,MOSSY,MODE_SET);for(let Y=0;Y<hh;Y++)PW(x+dx,y+Y,z+dz,AIR,MODE_SET);
        if(d<R-1&&r()<0.12)PW(x+dx,y,z+dz,GLOWSHROOM,MODE_SET);}
      for(let m=0;m<4;m++){const mx=x+((r()*12|0)-6),mz=z+((r()*12|0)-6),h=3+(r()*3|0),cr=1.6+r()*1.2;
        for(let Y=0;Y<h;Y++)PW(mx,y+Y,mz,MUSHSTEM,MODE_SET);
        for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++)if(Math.hypot(dx,dz)<=cr){PW(mx+dx,y+h,mz+dz,GLOWCAP,MODE_SET);if(Math.hypot(dx,dz)<cr-1)PW(mx+dx,y+h+1,mz+dz,GLOWCAP,MODE_SET);}}
      for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)PW(x+dx+4,y-1,z+dz-3,WATER,MODE_SET);
      break;}
    case 'camp':{roomP(x-4,y,z-4,x+4,y+4,z+4,PLANKS,AIR);
      for(const [a,b] of [[-4,-4],[4,-4],[-4,4],[4,4]])for(let Y=y+1;Y<=y+3;Y++)PW(x+a,Y,z+b,LOG,MODE_SET);
      for(let X=x-4;X<=x+4;X++)PW(X,y+4,z,PLANKS,MODE_SET);
      PW(x,y+3,z,LANTERN,MODE_SET);PW(x-3,y+1,z-3,FURN,MODE_SET);crateP(x+3,y+1,z-3);crateP(x+3,y+1,z+2);
      PW(x-3,y+1,z+2,WOOLR,MODE_SET);PW(x-3,y+1,z+3,WOOLR,MODE_SET);PW(x-2,y+1,z+3,WOOLW,MODE_SET);PW(x,y+1,z+3,COBBLE,MODE_SET);PW(x+1,y+1,z+3,TORCH,MODE_SET);
      break;}
    case 'ruins':{const ax=r()<0.5,L=10,Wd=4;
      for(let t=-L;t<=L;t++)for(let w=-Wd;w<=Wd;w++)for(let Y=0;Y<=7;Y++){
        const X=x+(ax?t:w),Z=z+(ax?w:t),edge=Math.abs(w)===Wd||Math.abs(t)===L||Y===7,decay=r()<0.18;
        let id=Y===0?(decay?COBBLE:(t+w)&1?SBRICK:STONE):edge?(decay?MOSSY:SBRICK):AIR;
        if(!edge&&Y>0&&Math.abs(w)===Wd-1&&t%4===0)id=Y===5?LANTERN:SBRICK;
        if(edge&&Y>0&&Y<7&&r()<0.07)id=AIR;
        PW(X,y+Y,Z,id,MODE_SET);}
      const ex=x+(ax?L-2:0),ez=z+(ax?0:L-2);
      PW(ex,y+1,ez,PLATB,MODE_SET);PW(ex,y+2,ez,CRYSTAL,MODE_SET);
      crateP(ex+(ax?0:2),y+1,ez+(ax?2:0));crateP(ex-(ax?0:2),y+1,ez-(ax?2:0));
      PW(x-(ax?L:0),y+1,z-(ax?0:L),AIR,MODE_SET);PW(x-(ax?L:0),y+2,z-(ax?0:L),AIR,MODE_SET);
      break;}
    case 'lab':{roomP(x-5,y,z-4,x+5,y+5,z+4,STEELB,STEELB);
      for(let X=x-4;X<=x+4;X++)for(let Z=z-3;Z<=z+3;Z++)PW(X,y,Z,(X+Z)&1?SBRICK:STEELB,MODE_SET);
      PW(x-2,y+4,z,LANTERN,MODE_SET);PW(x+2,y+4,z,LANTERN,MODE_SET);
      PW(x-4,y+1,z-3,BATTERY,MODE_SET);PW(x-3,y+1,z-3,WIRE,MODE_SET);PW(x-2,y+1,z-3,CHARGER,MODE_SET);PW(x+4,y+1,z-3,COALGEN,MODE_SET);
      PW(x+4,y+1,z+3,EFURN,MODE_SET);PW(x+3,y+1,z+3,LAMP_OFF,MODE_SET);crateP(x-4,y+1,z+3);crateP(x,y+1,z+3);
      for(let Y=y+1;Y<=y+2;Y++)PW(x,Y,z-4,AIR,MODE_SET);
      break;}
    case 'outpost':{const R=10;
      for(let dx=-R;dx<=R;dx++)for(let dz=-R;dz<=R;dz++){if(Math.hypot(dx,dz)>R)continue;PW(x+dx,y-1,z+dz,COBBLE,MODE_SET);for(let Y=0;Y<7;Y++)PW(x+dx,y+Y,z+dz,AIR,MODE_SET);}
      for(const [hx,hz] of [[-6,-3],[2,-7],[3,4]]){roomP(x+hx-2,y-1,z+hz-2,x+hx+2,y+3,z+hz+2,PLANKS,r()<0.5?PLANKS:COBBLE);for(let Y=y;Y<=y+1;Y++)PW(x+hx,Y,z+hz-2,AIR,MODE_SET);PW(x+hx,y+2,z+hz,LANTERN,MODE_SET);}
      PW(x,y,z,TRADER,MODE_SET);PW(x+1,y,z,PLANKS,MODE_SET);PW(x-1,y,z,PLANKS,MODE_SET);
      for(const [a,b] of [[-3,3],[4,-1],[-2,-6]]){for(let Y=y;Y<=y+2;Y++)PW(x+a,Y,z+b,LOG,MODE_SET);PW(x+a,y+3,z+b,LANTERN,MODE_SET);}
      crateP(x+3,y+1,z+5);crateP(x-6,y,z-1);
      break;}
    case 'shrine':{roomP(x-3,y,z-3,x+3,y+5,z+3,SBRICK,CALCITE);
      for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)PW(x+dx,y+1,z+dz,AMETH,MODE_SET);PW(x,y+2,z,CRYSTAL,MODE_SET);PW(x,y+5,z,GLOW,MODE_SET);
      crateP(x+2,y+1,z+2);for(let Y=y+1;Y<=y+2;Y++)PW(x,Y,z-3,AIR,MODE_SET);
      break;}
    case 'forge':{roomP(x-5,y,z-4,x+5,y+6,z+4,COBBLE,SBRICK);
      for(let X=x-3;X<=x+3;X++)PW(X,y,z,LAVA,MODE_SET);
      PW(x-4,y+1,z-3,FURN,MODE_SET);PW(x-3,y+1,z-3,FURN,MODE_SET);PW(x+4,y+1,z-3,BLAST,MODE_SET);
      PW(x+4,y+1,z+3,pick([COPB,BRONB,BRASB,STEELB],r),MODE_SET);PW(x+3,y+1,z+3,pick([COPB,BRONB,BRASB],r),MODE_SET);crateP(x-4,y+1,z+3);
      PW(x,y+5,z-2,LANTERN,MODE_SET);PW(x,y+5,z+2,LANTERN,MODE_SET);
      for(let Y=y+1;Y<=y+2;Y++)PW(x-5,Y,z,AIR,MODE_SET);
      break;}
  }
}
function applyPOIs(WCX,WCZ){
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const p=poiFor(WCX+a,WCZ+b);if(!p)continue;
    if(p.x+16<gx0||p.x-16>gx0+CS||p.z+16<gz0||p.z-16>gz0+CS)continue;buildPOI(p);}
}
// ---- Dripstone and springs in the existing caves
function cavernDetail(X0,Z0,r2){
  const zone2=ruinZone(Math.floor(X0/CS),Math.floor(Z0/CS)),drip=caveRegion(X0+8,Z0+8)==='drip';
  for(let k=0;k<(drip?300:150);k++){
    const X=X0+(r2()*CS|0),Z=Z0+(r2()*CS|0),g=ground[(X-OX)+W*(Z-OZ)],y=8+(r2()*Math.max(1,g-18)|0),c=GW(X,y,Z);
    if(c!==AIR||inRuin(X,y,Z))continue;
    if(SOLID[Math.max(0,GW(X,y+1,Z))]&&GW(X,y-1,Z)===AIR){
      if(r2()<0.004&&y>20&&!ruinZone(Math.floor(X/CS),Math.floor(Z/CS))){const i=I(X-OX,y+1,Z-OZ);if(world[i]===STONE&&y+2<g-6){world[i]=WATER;lvl[i]=0;flowQ.add(i);}}
      else if(y<48&&r2()<0.06){let f=y;while(f>2&&GW(X,f-1,Z)===AIR)f--;if(y-f>=5&&!(zone2&&inRuin(X,f,Z))){for(let t=f;t<=y;t++)PW(X,t,Z,LAVA,MODE_SET);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){PW(X+a,f-1,Z+b,LAVA,MODE_STONE);PW(X+a,f-2,Z+b,OBSID,MODE_STONE);}}}
      else{PW(X,y,Z,DRIPD,MODE_SET);if(r2()<0.4&&GW(X,y-1,Z)===AIR&&GW(X,y-2,Z)===AIR)PW(X,y-1,Z,DRIPD,MODE_SET);}
    }else if(SOLID[Math.max(0,GW(X,y-1,Z))]&&GW(X,y+1,Z)===AIR)PW(X,y,Z,DRIPU,MODE_SET);
  }
}
