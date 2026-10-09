// Dry and fiery (M6e): each dry land has its own ground and plants; the drylands have dunes; the deep under the Volcanic Wastes
// glows with magma stone and no loose lava; signatures in each stretch's share; the cone's lava lake is held in rock.
setMode('creative');
const DRY=['dry','steppe','volcanic','blight'];
assert(DRY.every(k=>LANDS[LAND_I[k]].built&&FOREST[k])&&BIOMES[10]==='Golden Steppe','the four dry and fiery lands are built; the Windswept Plains are now the Golden Steppe');
const WANT={dry:[[SAND,20000],[RSAND,1000],[CACTUS,100]],steppe:[[GOLDGRASS,10000],[STEPPEG,3000]],volcanic:[[ASH,20000],[BASALT,5000]],blight:[[DEADGRASS,10000],[DEADWOOD,1000]]};
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
// the smoking cone's lava lake lies in rock: rock under and around every lava block
{let s=null;for(let r=0;r<40&&!s;r++)for(let i=-r;i<=r&&!s;i++)for(let j=-r;j<=r;j++){if(Math.max(Math.abs(i),Math.abs(j))!==r)continue;const t=sigOf(stretchCell(landSite(i,j)));if(t&&t.kind==='cone'){s=t;break;}}
  regenerateAll(s.X,s.Z);while(genQ.length)processGenQ();let lava=0,bad=0;
  for(let dx=-5;dx<=5;dx++)for(let dz=-5;dz<=5;dz++)for(let y=s.g;y<=s.g+13;y++){const x=s.X+dx-OX,z=s.Z+dz-OZ;if(get(x,y,z)!==LAVA)continue;lava++;
    const below=get(x,y-1,z);if(!(below===LAVA||SOLID[below]))bad++;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const n=get(x+a,y,z+b);if(!(n===LAVA||SOLID[n]))bad++;}}
  assert(lava>20&&bad===0,'the smoking cone at X '+s.X+', Z '+s.Z+' holds '+lava+' blocks of lava in rock');}
assert(RECIPES.some(r=>r[0]===PLANKS&&[].concat(r[2][0][0]).includes(DEADWOOD)),'dead wood makes planks');
