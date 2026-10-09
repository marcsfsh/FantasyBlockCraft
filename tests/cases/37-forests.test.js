// The forests (M6b): each forest land grows its own wood, floor and plants; each stretch has its landmark, its feature or neither;
// the signatures build, keep their ponds full and keep trees off; the new woods craft into planks.
setMode('creative');
const FOREST_LANDS=['autumn','birch','pine','giant','willow','yew','silver'];
assert(FOREST_LANDS.every(k=>LANDS[LAND_I[k]].built&&FOREST[k])&&BIOMES[11]==='Willow Vales','the seven forest lands are built; the Fens are now Willow Vales');
// ---- what grows: a window on the nearest stretch of each forest
const WANT={autumn:[[MAPLE,400],[LITTER,2000],[MAPLEL,2000]],birch:[[BIRCH,400],[BLUEB,150]],pine:[[PINE,800],[NEEDLES,800]],giant:[[GREAT,1500],[FMOSS,800],[FERN,500]],
  willow:[[WILLOW,200],[WILLOWL,4000]],yew:[[YEW,400],[YEWL,4000]],silver:[[SILV,400],[SILVL,4000],[MOONP,15]]};
let genMs=0,chunks=0;
for(const k of FOREST_LANDS){const c=nearestLand(LAND_I[k],0,0,48),t0=Date.now();regenerateAll(c.X,c.Z);while(genQ.length)processGenQ();genMs+=Date.now()-t0;chunks+=NCX*NCZ;
  const cnt={};for(let z=0;z<D;z++)for(let x=0;x<W;x++){const g=ground[x+W*z];for(let y=Math.max(0,g-2);y<Math.min(H,g+50);y++){const id=world[I(x,y,z)];cnt[id]=(cnt[id]||0)+1;}}
  const parts=WANT[k].map(([id,n])=>nameOf(id)+' '+(cnt[id]||0));
  assert(WANT[k].every(([id,n])=>(cnt[id]||0)>=n),LANDS[LAND_I[k]].n+' grows its own: '+parts.join(', '));}
info('forest windows generated at',(genMs/chunks).toFixed(1),'ms a chunk (headless, whole window at once)');
// ---- signatures (Q124): landmark, feature or neither in each stretch
{const st={none:0,landmark:0,feature:0,missed:0},kinds=new Set(),roots=new Set();
  for(let i=-40;i<40;i++)for(let j=-40;j<40;j++){const c=stretchCell(landSite(i,j)),L=LANDS[cellLand(c)];if(!SIGS[L.k])continue;const key=landKey(c.i,c.j);if(roots.has(key))continue;roots.add(key);
    const q=hsh(c.i,8141,c.j),s=sigOf(c);if(q<0.4)st.none++;else if(!s)st.missed++;else{st[q<0.7?'landmark':'feature']++;kinds.add(s.kind);}}
  const n=roots.size;info('forest stretches',n,JSON.stringify(st),'; kinds built',kinds.size);
  assert(Math.abs(st.none/n-0.4)<0.1,'about four stretches in ten have neither landmark nor feature');
  assert(st.missed<=n*0.1,'nearly every stretch that should have one finds level ground for it ('+st.missed+' missed)');
  assert(kinds.size===14,'every forest landmark and feature appears within 12 800 blocks');}
// ---- each built signature stands where it should
const find=kind=>{for(let r=0;r<40;r++)for(let i=-r;i<=r;i++)for(let j=-r;j<=r;j++){if(Math.max(Math.abs(i),Math.abs(j))!==r)continue;const s=sigOf(stretchCell(landSite(i,j)));if(s&&s.kind===kind)return s;}return null;};
for(const [kind,check] of [['lodge',s=>get(s.X-OX,s.g,s.Z-OZ)===MAPLEP&&get(s.X-3-OX,s.g+1,s.Z-2-OZ)===BARREL],['stilt',s=>get(s.X-OX,s.lo+1,s.Z-OZ)===WILLOWP],['post',s=>get(s.X-OX,s.g+5,s.Z-OZ)===LADDER]]){
  const s=find(kind);regenerateAll(s.X,s.Z);while(genQ.length)processGenQ();
  let water=0;for(const [px,pz,R] of sigPonds(s))for(let dx=-R;dx<=R;dx++)for(let dz=-R;dz<=R;dz++)if(get(px+dx-OX,s.lo-1,pz+dz-OZ)===WATER)water++;
  let trunks=0;for(let dx=-s.R+2;dx<=s.R-2;dx++)for(let dz=-s.R+2;dz<=s.R-2;dz++){const id=get(s.X+dx-OX,s.g+2,s.Z+dz-OZ);if(id===LOG||id===BIRCH||id===PINE&&kind!=='post'||id===YEW||id===SILV)trunks++;}
  assert(check(s),s.name+' stands at X '+s.X+', Z '+s.Z);
  if(sigPonds(s).length)assert(water>40,s.name+': its pond holds its water ('+water+' blocks at the surface)');
  assert(trunks===0,s.name+': no tree grows inside it');}
// ---- the new woods
assert(NEW_LOGS.every((l,i)=>RECIPES.some(r=>r[0]===NEW_PLANKS[i]&&r[2][0][0]===l)),'each new log makes its own planks');
inv.fill(null);inv[0]={id:MAPLEP,c:4};assert(canCraft(RECIPES.find(r=>r[0]===201)),'sticks can be made from any planks');inv.fill(null);
