// Coasts and waters (M6d): each coast land has its own shore, rock, plants or shape; chalk and fjord coasts drop sheer; signatures
// in the sea and on the coasts; water plants grow inside the water and count as water; lily pads on lakes and pools.
setMode('creative');
const CO=['chalk','isles','fjord','blacksand','kelp','bog'];
assert(CO.every(k=>LANDS[LAND_I[k]].built&&FOREST[k]),'the six coast and water lands are built');
const WANT={chalk:[[CHALK,3000]],isles:[[GRAVEL,5000]],blacksand:[[BLACKSAND,3000],[BASALT,500]],kelp:[[KELP,2000],[SEAGRASS,2000]],bog:[[PEAT,5000],[BOGMOSS,3000],[COTTONG,300]],sea:[[SEAGRASS,200],[KELP,200]]};
for(const k of Object.keys(WANT)){const c=nearestLand(LAND_I[k],0,0,48);regenerateAll(c.X,c.Z);while(genQ.length)processGenQ();
  const cnt={};for(let z=0;z<D;z++)for(let x=0;x<W;x++){const g=ground[x+W*z];for(let y=Math.max(0,g-3);y<Math.min(H,g+30);y++){const id=world[I(x,y,z)];cnt[id]=(cnt[id]||0)+1;}}
  assert(WANT[k].every(([id,n])=>(cnt[id]||0)>=n),LANDS[LAND_I[k]].n+' has its own: '+WANT[k].map(([id])=>nameOf(id)+' '+(cnt[id]||0)).join(', '));}
// chalk cliffs: within a few blocks the land drops from its downs to the sea floor
{const find=kind=>{for(let r=0;r<40;r++)for(let i=-r;i<=r;i++)for(let j=-r;j<=r;j++){if(Math.max(Math.abs(i),Math.abs(j))!==r)continue;const s=sigOf(stretchCell(landSite(i,j)));if(s&&s.kind===kind)return s;}return null;};
  const s=find('chalkarch'),o={};let maxDrop=0;for(let t=-30;t<0;t++){const a=colInfo(s.X+s.dx*t,s.Z+s.dz*t,o).h,b=colInfo(s.X+s.dx*(t+3),s.Z+s.dz*(t+3),o).h;maxDrop=Math.max(maxDrop,a-b);}
  assert(maxDrop>=15,'the chalk cliffs behind the arch at X '+s.X+', Z '+s.Z+' drop '+maxDrop+' blocks within three');
  regenerateAll(s.X,s.Z);while(genQ.length)processGenQ();const ax=s.dx===0;assert(get(s.X+(ax?3:0)-OX,SEA+4,s.Z+(ax?0:3)-OZ)===CHALK&&get(s.X+(ax?-3:0)-OX,SEA+4,s.Z+(ax?0:-3)-OZ)===CHALK,'the chalk arch stands in the sea on two legs');}
// signatures in the sea and on the coasts
{const st={none:0,placed:0,missed:0},kinds=new Set(),roots=new Set();
  for(let i=-40;i<40;i++)for(let j=-40;j<40;j++){const c=stretchCell(landSite(i,j)),L=LANDS[cellLand(c)];if(!CO.includes(L.k)&&L.k!=='sea')continue;const key=landKey(c.i,c.j);if(roots.has(key))continue;roots.add(key);
    const q=hsh(c.i,8141,c.j),s=sigOf(c);if(q<0.4)st.none++;else if(s){st.placed++;kinds.add(s.kind);}else st.missed++;}
  info('coast and sea stretches',roots.size,JSON.stringify(st),'; kinds',[...kinds].sort().join(' '));
  assert(st.missed<=roots.size*0.12&&kinds.size===14,'nearly every coast and sea stretch that should have a landmark or feature has one, and all 14 kinds appear');}
// water plants are water to swim in; lily pads float on lakes and pools
assert(isWetId(KELP)&&isWetId(SEAGRASS)&&!isWetId(LILYPAD)&&BL[LILYPAD].pad,'kelp and seagrass count as water; lily pads lie on it');
{const x=W/2,z=D/2,y=H-6;world[I(x,y,z)]=KELP;assert(liquidAt(x+0.5,y+0.5,z+0.5)===1,'a swimmer in kelp is in water');world[I(x,y,z)]=AIR;}
{let pads=0;for(const k of ['willow','bog']){const c=nearestLand(LAND_I[k],0,0,48);regenerateAll(c.X,c.Z);while(genQ.length)processGenQ();for(let i=0;i<VOL;i+=1)if(world[i]===LILYPAD)pads++;}
  assert(pads>=5,'lily pads float on the pools of the vales and bogs ('+pads+')');}
