// ---- The Fire Below (D-023, M3.5a): an open lava sea under the land, lava from y3 to FIRE_LV under a rock roof 5 to 16 above it,
// with smooth islands and great rock pillars that flare where they meet the lava and the roof. A per-column pass over the
// chunk's own columns, run after fillCol; every value is a pure function of world coordinates. Every lava block lies on rock
// and beside rock or lava, so none of it hangs in the air (Q87).
const FIRE_LV=8;
function seaCeil(X,Z){const s=sstep(-0.35,0.35,fbm2(X/90,Z/90,2,8101.3));let c=FIRE_LV+5+Math.round(11*s);if(c>13&&mineZone(Math.floor(X/CS),Math.floor(Z/CS)))c=13;return c;}
function seaIsle(X,Z){return fbm2(X/48,Z/48,2,8105.1);}
// pillars: at most one per cell of 28 x 28 blocks, kept inside its cell
const SEA_PG=28;
function seaPillarsNear(X,Z,out){out.length=0;const gx=Math.floor(X/SEA_PG),gz=Math.floor(Z/SEA_PG);
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const px=gx+a,pz=gz+b;if(hsh(px,8121,pz)>0.45)continue;
    const cx=px*SEA_PG+8+hsh(px,8122,pz)*12,cz=pz*SEA_PG+8+hsh(px,8123,pz)*12,r=2.5+hsh(px,8124,pz)*3.5,d=Math.hypot(X+0.5-cx,Z+0.5-cz);if(d<r*2.6)out.push(d,r);}
  return out;}
function seaRock(pl,y,ceil){for(let k=0;k<pl.length;k+=2){const e1=Math.max(0,1-(y-FIRE_LV)/4),e2=Math.max(0,1-(ceil-y)/4);if(pl[k]<pl[k+1]*(1+1.4*e1*e1+1.4*e2*e2))return true;}return false;}
function seaOpen(X,Z){return !seaRock(seaPillarsNear(X,Z,[]),FIRE_LV+2,seaCeil(X,Z));}
const seaPl=[];
function lavaSea(lcx,lcz){
  for(let z=0;z<CS;z++)for(let x=0;x<CS;x++){
    const X=gx0+x,Z=gz0+z,col=lcx*CS+x+W*(lcz*CS+z),WD=W*D,ceil=seaCeil(X,Z),isl=seaIsle(X,Z)>0.3;seaPillarsNear(X,Z,seaPl);
    for(let y=3;y<=ceil;y++){const i=col+WD*y;if(world[i]===BEDROCK)continue;
      if(seaPl.length&&seaRock(seaPl,y,ceil))continue;
      if(y<=FIRE_LV){if(isl)continue;world[i]=LAVA;}else if(!(isl&&y===FIRE_LV+1))world[i]=AIR;lvl[i]=0;}
  }
}
const DEEP_NAMES={lush:'The Mossy Deeps',crystal:'The Crystal Deeps',drip:'The Dripstone Deeps',fungal:'The Fungal Deeps',plain:'The Deep Caverns'};
