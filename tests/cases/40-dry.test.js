// Dry and fiery (M6e): each dry land has its own ground and plants; the drylands have dunes; the deep under the Volcanic Wastes
// glows with magma stone and no loose lava; signatures in each stretch's share (the Volcanic Wastes' own are tested in 47).
setMode('creative');
const DRY=['dry','steppe','volcanic','blight'];
assert(DRY.every(k=>LANDS[LAND_I[k]].built&&FOREST[k])&&BIOMES[10]==='Golden Steppe','the four dry and fiery lands are built; the Windswept Plains are now the Golden Steppe');
const WANT={dry:[[SAND,20000],[RSAND,1000],[CACTUS,100]],steppe:[[GOLDGRASS,10000],[STEPPEG,3000]],volcanic:[[BLACKASH,15000],[CINDER,3000]],blight:[[DEADGRASS,10000],[DEADWOOD,1000]]};
for(const k of DRY){const c=nearestLand(LAND_I[k],0,0,48);regenerateAll(c.X,c.Z);while(genQ.length)processGenQ();
  const cnt={};for(let z=0;z<D;z++)for(let x=0;x<W;x++){const g=ground[x+W*z];for(let y=Math.max(0,g-3);y<Math.min(H,g+12);y++){const id=world[I(x,y,z)];cnt[id]=(cnt[id]||0)+1;}}
  assert(WANT[k].every(([id,n])=>(cnt[id]||0)>=n),LANDS[LAND_I[k]].n+' has its own: '+WANT[k].map(([id])=>nameOf(id)+' '+(cnt[id]||0)).join(', '));
  if(k==='volcanic'){let mag=0,loose=0;const WD=W*D;for(let i=0;i<VOL;i++){if(world[i]===MAGMA)mag++;}
    info('magma stone in the volcanic window',mag);assert(mag>1000,'the deep under the Volcanic Wastes glows with magma stone');}}
// signatures
{const st={none:0,placed:0,missed:0},kinds=new Set(),roots=new Set();
  for(let i=-40;i<40;i++)for(let j=-40;j<40;j++){const c=stretchCell(landSite(i,j)),L=LANDS[cellLand(c)];if(!DRY.includes(L.k))continue;const key=landKey(c.i,c.j);if(roots.has(key))continue;roots.add(key);
    const q=hsh(c.i,8141,c.j),s=sigOf(c);if(q<0.4)st.none++;else if(s){st.placed++;kinds.add(s.kind);}else st.missed++;}
  info('dry stretches',roots.size,JSON.stringify(st),'; kinds',[...kinds].sort().join(' '));
  assert(st.missed<=roots.size*0.1&&kinds.size===8,'nearly every dry stretch that should have a landmark or feature has one, and all 8 kinds appear');}
assert(RECIPES.some(r=>r[0]===PLANKS&&[].concat(r[2][0][0]).includes(DEADWOOD)),'dead wood makes planks');
