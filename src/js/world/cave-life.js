// ---- Underground regions: each stretch of cave has its own character
function caveRegion(X,Z){const a=fbm2(X/110,Z/110,1,3501.1),b=fbm2(X/110,Z/110,1,3507.3);return a>0.17?'lush':b>0.19?'crystal':a<-0.17?'drip':b<-0.19?'fungal':'plain';}
const CAVE_NAMES={lush:'Mossy Caves',crystal:'Crystal Caves',drip:'Dripstone Caves',fungal:'Fungal Caves',plain:'Caves',deep:'Deep Caves'};
function caveLife(X0,Z0,r2){
  cavernDetail(X0,Z0,r2);
  const zone=ruinZone(Math.floor(X0/CS),Math.floor(Z0/CS)),reg=caveRegion(X0+8,Z0+8);
  // floors
  for(let k=0;k<260;k++){
    const X=X0+(r2()*CS|0),Z=Z0+(r2()*CS|0),g=ground[(X-OX)+W*(Z-OZ)],y0=6+(r2()*Math.max(1,g-14)|0);
    let y=y0;while(y>4&&GW(X,y,Z)===AIR&&GW(X,y-1,Z)===AIR)y--;
    const kind=r2(),q=r2();
    if(GW(X,y,Z)!==AIR||!SOLID[Math.max(0,GW(X,y-1,Z))]||y>g-6||(zone&&inRuin(X,y,Z)))continue;
    if(y<=14&&(GW(X+1,y-1,Z)===LAVA||GW(X-1,y-1,Z)===LAVA||GW(X,y-1,Z+1)===LAVA)){PW(X,y-1,Z,OBSID,MODE_SET);continue;}
    if(y<100){ // deep: sparse life, crystals and scorched rock
      if(kind<0.12)PW(X,y,Z,CRYSTAL,MODE_SET);else if(kind<0.18)PW(X,y,Z,GLOWSHROOM,MODE_SET);else if(kind<0.2&&y<g-12)PW(X,y,Z,CRATE,MODE_SET);else if(kind<0.3)PW(X,y-1,Z,OBSID,MODE_STONE);
      continue;
    }
    const patch=(id)=>{for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(q<0.7||a===0||b===0)PW(X+a,y-1,Z+b,id,MODE_STONE);};
    const cluster=(id,n)=>{PW(X,y,Z,id,MODE_SET);for(let t=0;t<n;t++){const XX=X+((r2()*3|0)-1),ZZ=Z+((r2()*3|0)-1),bl=GW(XX,y-1,ZZ);if(bl>0&&SOLID[bl]&&GW(XX,y,ZZ)===AIR)PW(XX,y,ZZ,id,MODE_SET);}};
    if(reg==='lush'){if(kind<0.45){patch(MOSSY);cluster(GLOWSHROOM,4);}else if(kind<0.75)patch(MOSSY);else if(kind<0.8&&GW(X,y,Z+1)===AIR&&GW(X+1,y,Z)===AIR){for(let a=0;a<2;a++)for(let b=0;b<2;b++)PW(X+a,y-1,Z+b,WATER,MODE_STONE);}}
    else if(reg==='crystal'){if(kind<0.55)cluster(CRYSTAL,3);else if(kind<0.8)patch(AMETH);}
    else if(reg==='drip'){if(kind<0.6)PW(X,y,Z,DRIPU,MODE_SET);else if(kind<0.8)patch(CALCITE);}
    else if(reg==='fungal'){
      let room=true;for(let t=1;t<7&&room;t++)if(GW(X,y+t,Z)!==AIR)room=false;
      if(kind<0.18&&room){const hgt=3+(q*3|0);for(let t=0;t<hgt;t++)PW(X,y+t,Z,MUSHSTEM,MODE_SET);for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)if(Math.abs(a)+Math.abs(b)<4)PW(X+a,y+hgt,Z+b,GLOWCAP,MODE_AIR);}
      else if(kind<0.65){patch(MOSSY);cluster(GLOWSHROOM,5);}}
    else{if(kind<0.3)cluster(GLOWSHROOM,3);else if(kind<0.45)cluster(CRYSTAL,2);else if(kind<0.46&&y<g-12)PW(X,y,Z,CRATE,MODE_SET);else if(kind<0.6)PW(X,y-1,Z,MOSSY,MODE_STONE);}
  }
  // walls: moss that glows, amethyst seams, calcite flowstone
  for(let k=0;k<200;k++){
    const X=X0+1+(r2()*(CS-2)|0),Z=Z0+1+(r2()*(CS-2)|0),g=ground[(X-OX)+W*(Z-OZ)],y=8+(r2()*Math.max(1,g-16)|0),q=r2();
    if(GW(X,y,Z)!==AIR||(zone&&inRuin(X,y,Z)))continue;
    for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const c=GW(X+a,y,Z+b);if(c!==STONE&&c!==DEEP)continue;
      let id=0;
      if(y<100)id=q<0.15?OBSID:q<0.22?GLOWMOSS:0;
      else if(reg==='lush')id=q<0.55?GLOWMOSS:q<0.85?MOSSY:0;
      else if(reg==='crystal')id=q<0.5?AMETH:0;
      else if(reg==='drip')id=q<0.45?CALCITE:0;
      else if(reg==='fungal')id=q<0.3?GLOWMOSS:q<0.6?MOSSY:0;
      else id=q<0.07?GLOWMOSS:0;
      if(id){PW(X+a,y,Z+b,id,MODE_STONE);if(q<0.5)PW(X+a,y+1,Z+b,id,MODE_STONE);}
      break;}
  }
}
function topBlock(o){
  const b=o.b,h=o.h;
  if(o.oasis)return GRASS;
  if(o.bank&&h<=SEA+3&&b!==6&&b!==7)return (o.hill>0.1)?GRAVEL:SAND;
  if(b===0)return o.hill>0.08?GRAVEL:(h>SEA-5?SAND:DIRT);
  if(b===1)return o.hill>0.12?GRAVEL:SAND;
  if(b===11)return h<=SEA||o.dn>0.25?DIRT:GRASS;
  if(b===4&&o.rid>0.22)return STONE;
  if(b===4&&o.dn>0.3)return DIRT;
  if(b===8&&o.dn>0.12)return DIRT;
  if(b===3&&o.dn>0.34)return DIRT;
  if(b===5)return h>=SEA+36?SNOWG:(o.rid>0.17?STONE:GRASS);
  if(b===6)return SNOWG;
  return GRASS;
}
const TN={};
const hCache=new Map();
function hAt(X,Z){const k=X*1048576+Z;let h=hCache.get(k);if(h===undefined){if(hCache.size>400000)hCache.clear();h=colInfo(X,Z,TN).h;hCache.set(k,h);}return h;}
function slopeAt(X,Z,h){return Math.max(Math.abs(hAt(X+1,Z)-h),Math.abs(hAt(X-1,Z)-h),Math.abs(hAt(X,Z+1)-h),Math.abs(hAt(X,Z-1)-h));}
function fillCol(x,z,X,Z,o){
  const h=o.h,b=o.b,ci=x+W*z;let top=topBlock(o),soil=3+Math.round(fbm2(X/30,Z/30,1,2401.7)*3);
  if(b!==0&&b!==1&&!o.town&&!o.oasis){const sl=slopeAt(X,Z,h);
    if(sl>=4){top=STONE;soil=0;}
    else if(sl>=3&&(b===5||b===6)){top=hsh(X,9,Z)<0.5?GRAVEL:STONE;soil=1;}}
  if(b===5&&top===GRASS&&h>=SEA+33+Math.floor(hsh(X,10,Z)*6))top=SNOWG;
  biome[ci]=o.lake?9:b;ground[ci]=h;islTop[ci]=o.isl;townCol[ci]=o.town?1:0;entCol[ci]=o.ent?1:0;
  let dl=0; // deepstone line, constant per column: computed once, on first use
  for(let y=0;y<H;y++){
    let id=AIR;
    if(y<=h){
      if(y===0||(y<3&&hsh(X,y,Z)<0.5))id=BEDROCK;
      else{
        if(y===h)id=top;
        else if(y>h-1-soil)id=b===1?SAND:(b===0?(h>SEA-5?SAND:DIRT):DIRT);
        else{if(!dl)dl=DEEPY+Math.round(fbm2(X/40,Z/40,1,3401.7)*6);id=y<dl-1||(y<=dl+1&&hsh(X,y,Z)<0.5)?DEEP:STONE;}
        if(carved(X,y,Z,o))id=y<=7?LAVA:AIR;
      }
    }else if(y<=Math.max(SEA,o.lake))id=(y===Math.max(SEA,o.lake)&&o.cold)?ICE:WATER;
    if(o.isl>=0&&y>=o.iBot&&y<=o.isl)id=y===o.isl?GRASS:y>o.isl-3?DIRT:STONE;
    const i=I(x,y,z);world[i]=id;lvl[i]=0;
  }
}
