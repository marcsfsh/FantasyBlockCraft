// Streaming must light chunks exactly as a full recompute would: block light and the sky light that spreads sideways (D-027).
const t0=Date.now();shiftWindow(16,0);while(genQ.length)processGenQ();console.log("shift+gen ms",Date.now()-t0);
const b2=BLK.slice(),s2=SKL.slice();BLK.fill(0);const t1=Date.now();lightAll();console.log("full recompute ms",Date.now()-t1);
let d2=0,ds=0;for(let i=0;i<VOL;i++){if(BLK[i]!==b2[i])d2++;if(SKL[i]!==s2[i])ds++;}
console.log("after streaming, light cells differing from a full recompute:",d2,"sky light cells:",ds);
assert(d2===0,'streamed lighting equals a full recompute');
assert(ds===0,'streamed sky light equals a full recompute');
// Sky light reaches covered cells beside open ones, and fades with distance
let lit=0,deepCov=0;for(let z=0;z<D;z++)for(let x=0;x<W;x++){const h=hm[x+W*z];for(let y=Math.max(0,h-40);y<=h;y++){const i=I(x,y,z);if(OPQ[world[i]])continue;if(SKL[i]>0)lit++;if(SKL[i]===15)deepCov++;}}
info('covered open cells lit from the side',lit);
assert(lit>0,'some covered cells get sky light from the side');assert(deepCov===0,'no covered cell holds full sky light');
// Edits relight exactly: dig shafts that open caves to the sky, put roofs over open ground, carve overhangs
{const r=mkRng(42);let edits=0;
  for(let k=0;k<40;k++){const x=40+(r()*(W-80)|0),z=40+(r()*(D-80)|0),g=hm[x+W*z];if(g<2)continue;
    const kind=k%3;
    if(kind===0)for(let y=g;y>g-25&&y>1;y--){setBlock(x,y,z,AIR,true);edits++;}                   // a shaft down from the surface
    else if(kind===1){const y=g+4+(r()*6|0);if(y<H-1)for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){setBlock(x+a,y,z+b,STONE,true);edits++;}} // a roof over open ground
    else for(let a=0;a<4;a++)for(let y=g-3;y<=g-1;y++){setBlock(x+a,y,z,AIR,true);edits++;}          // a hollow under the surface, open at one side
    if(k%4===3&&lbox){relight(lbox);lbox=null;}}
  if(lbox){relight(lbox);lbox=null;}
  const eb=BLK.slice(),es=SKL.slice();BLK.fill(0);lightAll();let db=0,dsk=0;for(let i=0;i<VOL;i++){if(BLK[i]!==eb[i])db++;if(SKL[i]!==es[i])dsk++;}
  info('edits',edits,'then light cells differing from a full recompute: block',db,'sky',dsk);
  assert(db===0&&dsk===0,'light after edits equals a full recompute');}
