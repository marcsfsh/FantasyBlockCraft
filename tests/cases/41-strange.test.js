// Strange lands (M6f): each strange land has its own stuff and its rare find; Starfall Craters have a crater field; signatures in
// each stretch's share, the starmetal heart's crater holds its ore.
setMode('creative');
const ST=['crystal','glowcap','petrified','starfall'];
assert(ST.every(k=>LANDS[LAND_I[k]].built&&FOREST[k]&&LANDS[LAND_I[k]].tier===3),'the four strange lands are built, and rare');
const WANT={crystal:[[AMETH,100],[CALCITE,2000]],glowcap:[[CAPB,5000],[CAPG,500],[MUSHSTEM,500]],petrified:[[PETRIWOOD,1000],[AMBER,5]],starfall:[[SCORCH,500]]};
for(const k of ST){const c=nearestLand(LAND_I[k],0,0,60);regenerateAll(c.X,c.Z);while(genQ.length)processGenQ();
  const cnt={};for(let z=0;z<D;z++)for(let x=0;x<W;x++){const g=ground[x+W*z];for(let y=Math.max(0,g-3);y<Math.min(H,g+20);y++){const id=world[I(x,y,z)];cnt[id]=(cnt[id]||0)+1;}}
  assert(WANT[k].every(([id,n])=>(cnt[id]||0)>=n),LANDS[LAND_I[k]].n+' has its own: '+WANT[k].map(([id])=>nameOf(id)+' '+(cnt[id]||0)).join(', '));}
// the crater field: bowls with raised rims in Starfall Craters
{const c=nearestLand(LAND_I.starfall,0,0,60),o={};let bowls=0,n=0;for(let a=-120;a<120;a+=4)for(let b=-120;b<120;b+=4){colInfo(c.X+a,c.Z+b,o);if(o.land!==LAND_I.starfall)continue;n++;if(o.cr)bowls++;}
  info('crater floor share in Starfall Craters',(100*bowls/Math.max(1,n)).toFixed(1)+'%');assert(bowls/n>0.03,'Starfall Craters are pocked with craters');}
// signatures, and the starmetal heart
{const st={none:0,placed:0,missed:0},kinds=new Set(),roots=new Set();let heart=null;
  for(let i=-50;i<50;i++)for(let j=-50;j<50;j++){const c=stretchCell(landSite(i,j)),L=LANDS[cellLand(c)];if(!ST.includes(L.k))continue;const key=landKey(c.i,c.j);if(roots.has(key))continue;roots.add(key);
    const q=hsh(c.i,8141,c.j),s=sigOf(c);if(q<0.4)st.none++;else if(s){st.placed++;kinds.add(s.kind);if(s.kind==='starheart'&&(!heart||Math.hypot(s.X,s.Z)<Math.hypot(heart.X,heart.Z)))heart=s;}else st.missed++;}
  info('strange stretches',roots.size,JSON.stringify(st),'; kinds',[...kinds].sort().join(' '));
  assert(st.missed<=roots.size*0.1&&kinds.size===8,'nearly every strange stretch that should have a landmark or feature has one, and all 8 kinds appear');
  regenerateAll(heart.X,heart.Z);while(genQ.length)processGenQ();assert(get(heart.X-OX,heart.g-7,heart.Z-OZ)===STARORE&&get(heart.X-OX,heart.g,heart.Z-OZ)===AIR,'the crater of the starmetal heart at X '+heart.X+', Z '+heart.Z+' is open, with starmetal under its floor');}
