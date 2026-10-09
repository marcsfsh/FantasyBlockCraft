// Highlands and cold (M6c): each highland land grows its own ground and plants; signatures in every stretch's share; the great
// sinkhole reaches a cave passage; waterfalls cascade down steep ground to a pool; the Northern Fells are now Frozen Tundra.
setMode('creative');
const HI=['alpine','glacier','cloud','karst','tundra'];
assert(HI.every(k=>LANDS[LAND_I[k]].built&&FOREST[k])&&BIOMES[6]==='Frozen Tundra','the five highland lands are built; the Northern Fells are now Frozen Tundra');
const WANT={alpine:[[GENTIAN,100],[EDELW,50]],glacier:[[GLACIER,3000],[PSNOW,3000]],cloud:[[MISTW,1000],[MISTL,5000],[FMOSS,3000]],karst:[[LIMESTONE,3000]],tundra:[[TMOSS,1500],[SNOWG,5000]]};
for(const k of HI){const c=nearestLand(LAND_I[k],0,0,48);regenerateAll(c.X,c.Z);while(genQ.length)processGenQ();
  const cnt={};for(let z=0;z<D;z++)for(let x=0;x<W;x++){const g=ground[x+W*z];for(let y=Math.max(0,g-1);y<Math.min(H,g+30);y++){const id=world[I(x,y,z)];cnt[id]=(cnt[id]||0)+1;}}
  assert(WANT[k].every(([id,n])=>(cnt[id]||0)>=n),LANDS[LAND_I[k]].n+' grows its own: '+WANT[k].map(([id])=>nameOf(id)+' '+(cnt[id]||0)).join(', '));}
// signatures, the High Mountains included
{const st={none:0,placed:0,missed:0},kinds=new Set(),roots=new Set();
  for(let i=-40;i<40;i++)for(let j=-40;j<40;j++){const c=stretchCell(landSite(i,j)),L=LANDS[cellLand(c)];if(!HI.includes(L.k)&&L.k!=='mtn')continue;const key=landKey(c.i,c.j);if(roots.has(key))continue;roots.add(key);
    const q=hsh(c.i,8141,c.j),s=sigOf(c);if(q<0.4)st.none++;else if(s){st.placed++;kinds.add(s.kind);}else st.missed++;}
  info('highland and mountain stretches',roots.size,JSON.stringify(st),'; kinds',[...kinds].sort().join(' '));
  assert(st.missed<=roots.size*0.1&&kinds.size>=11,'nearly every highland stretch that should have a landmark or feature has one, and every kind appears');}
// the great sinkhole goes down to the caves (Q132)
{let s=null;for(let r=0;r<40&&!s;r++)for(let i=-r;i<=r&&!s;i++)for(let j=-r;j<=r;j++){if(Math.max(Math.abs(i),Math.abs(j))!==r)continue;const t=sigOf(stretchCell(landSite(i,j)));if(t&&t.kind==='sinkhole'){s=t;break;}}
  regenerateAll(s.X,s.Z);while(genQ.length)processGenQ();let air=0;for(let y=s.a.y+1;y<s.g;y++)if(get(s.X-OX,y,s.Z-OZ)===AIR)air++;
  assert(air===s.g-s.a.y-1&&s.g-s.a.y>=25,'the great sinkhole at X '+s.X+', Z '+s.Z+' is open all '+(s.g-s.a.y)+' blocks down to a cave passage');}
// waterfalls (Q126): planned down the steepest way, water over a stony bed, a pool at the foot
{let f=null,n=0;for(let a=-150;a<150;a++)for(let b=-150;b<150;b++){const t=fallAt(a,b);if(t){n++;if(!f)f=t;}}
  info('waterfalls in 300 x 300 chunks',n);assert(n>=5,'waterfalls are found in the high lands');
  regenerateAll(f.X,f.Z);while(genQ.length)processGenQ();let w=0;for(const [x,z,h] of f.path)if(get(x-OX,h+1,z-OZ)===WATER)w++;
  const drop=f.path[0][2]-f.end[2];
  assert(w>=f.path.length*0.9&&drop>=10&&get(f.end[0]-OX,f.end[2],f.end[1]-OZ)===WATER,'a waterfall at X '+f.X+', Z '+f.Z+' falls '+drop+' blocks over '+f.path.length+' with water all the way to its pool');}
assert(NEW_LOGS.includes(MISTW)&&RECIPES.some(r=>r[0]===MISTP),'mistwood makes planks');
