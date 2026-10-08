// ---- The deep outside the holds (D-023): the lava sea of the Fire Below, two tiers of natural caverns, underground rivers and lakes.
// A per-column pass over the chunk's own columns, run after fillCol and before the worm caves. Every value is a pure function of
// world coordinates; the cavern noise is sampled on a 4-block lattice anchored to world coordinates, so neighbouring chunks agree.
const FIRE_LV=8;          // lava surface of the sea (lava from y3 to y8)
const DEEP_WL=64;         // one water level for every lake and river of the upper tier, so no walls of water stand where they meet
const DC_Y0=16,DC_NY=23;  // cavern lattice: y16 to y104 every 4 blocks
const dcLat=new Float32Array(5*5*DC_NY);
// Cavern density: positive is open. Lower tier around y37 (dry), upper tier around y81 (lakes below DEEP_WL); none inside a hold.
function deepDensity(X,Y,Z,sup){
  const lo=Y<59,t=lo?(Y-37)/20:(Y-81)/20,v=1-t*t;if(v<=0)return -1;
  return noise3(X/52,Y/26,Z/52)*0.8+noise3(X/17,Y/11,Z/17)*0.35+v*0.4-(lo?0.76:0.62)+sup;
}
// How strongly a hold keeps the caverns out at a point (0 far away, -2 inside): holds and their inner mines stay intact
function deepSup(X,Z){const h=holdNear(Math.floor(X/CS),Math.floor(Z/CS)),d=holdReach(h,X/CS-0.5,Z/CS-0.5);return -2*(1-sstep(1.1,1.6,d))+0.12*fbm2(X/380,Z/380,1,8107.3);}
function deepCaves(lcx,lcz){
  // the lattice for this chunk, shared at its edges with the neighbours
  for(let a=0;a<5;a++)for(let b=0;b<5;b++){const X=gx0+a*4,Z=gz0+b*4,sup=deepSup(X,Z);for(let k=0;k<DC_NY;k++)dcLat[(a*5+b)*DC_NY+k]=deepDensity(X,DC_Y0+k*4,Z,sup);}
  for(let z=0;z<CS;z++)for(let x=0;x<CS;x++){
    const X=gx0+x,Z=gz0+z,lx=lcx*CS+x,lz=lcz*CS+z,col=lx+W*lz,WD=W*D;
    // the lava sea: open from y3 up to a ceiling 4 to 16 above the lava, with rock pillars and islands; low under the holds' mines
    if(fbm2(X/13,Z/13,1,8103.7)<0.4){
      const s=sstep(-0.35,0.35,fbm2(X/70,Z/70,2,8101.3)),mz=mineZone(Math.floor(X/CS),Math.floor(Z/CS));
      let ceil=FIRE_LV+4+Math.round(12*s);if(mz&&ceil>13)ceil=13;
      const isl=fbm2(X/36,Z/36,1,8105.1)>0.32;
      for(let y=3;y<=ceil;y++){const i=col+WD*y;if(world[i]===BEDROCK)continue;
        if(y<=FIRE_LV){if(isl&&y>=FIRE_LV-1)continue;world[i]=LAVA;}else if(!(isl&&y===FIRE_LV+1))world[i]=AIR;lvl[i]=0;}
    }
    // caverns, trilinear between lattice points
    const ax=x>>2,az=z>>2,fx=(x&3)/4,fz=(z&3)/4,p00=(ax*5+az)*DC_NY,p10=((ax+1)*5+az)*DC_NY,p01=(ax*5+az+1)*DC_NY,p11=((ax+1)*5+az+1)*DC_NY;
    for(let k=0;k<DC_NY-1;k++){
      const c0=lerp(lerp(dcLat[p00+k],dcLat[p10+k],fx),lerp(dcLat[p01+k],dcLat[p11+k],fx),fz),c1=lerp(lerp(dcLat[p00+k+1],dcLat[p10+k+1],fx),lerp(dcLat[p01+k+1],dcLat[p11+k+1],fx),fz);
      if(c0<=0&&c1<=0)continue;
      for(let j=0;j<4;j++){const y=DC_Y0+k*4+j;if(c0+(c1-c0)*j/4<=0)continue;const i=col+WD*y,id=world[i];if(id===AIR||id===BEDROCK||id===LAVA||id===WATER)continue;
        world[i]=y>=58&&y<=DEEP_WL?WATER:AIR;lvl[i]=0;}
    }
    // underground rivers wind through the upper tier at the lake level
    const rv=Math.abs(fbm2(X/240,Z/240,2,8301.7));
    if(rv<0.026){const c=1-rv/0.026,sup=deepSup(X,Z);if(sup>-0.3){const bed=DEEP_WL-1-Math.round(2*c),top=DEEP_WL+2+Math.round(3*c);
      for(let y=bed;y<=top;y++){const i=col+WD*y;if(world[i]===BEDROCK)continue;world[i]=y<=DEEP_WL?WATER:AIR;lvl[i]=0;}}}
  }
}
const DEEP_NAMES={lush:'The Mossy Deeps',crystal:'The Crystal Deeps',drip:'The Dripstone Deeps',fungal:'The Fungal Deeps',plain:'The Deep Caverns'};
