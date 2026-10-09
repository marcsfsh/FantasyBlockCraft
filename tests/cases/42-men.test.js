// Old lands of men (M6g): farmland furrows, orchard rows, flower bands, stepped terraces with stone walls; small structures across the
// lands; dry-stone walls; signatures; orchard leaves give apples.
setMode('creative');
const MEN=['farm','orchard','flower','terrace'];
assert(MEN.every(k=>LANDS[LAND_I[k]].built&&FOREST[k]),'the four old lands of men are built');
assert(LANDS.every(L=>L.built),'every land of the registry is built');
const WANT={farm:[[FARM_D,3000],[WHEAT,800]],orchard:[[FRUITL,5000],[BLOSSOM,500]],flower:[[OXEYE,2000],[LAVENDER,500],[BLUEB,1000]],terrace:[[COBBLE,2000]]};
for(const k of MEN){const c=nearestLand(LAND_I[k],0,0,60);regenerateAll(c.X,c.Z);while(genQ.length)processGenQ();
  const cnt={};for(let z=0;z<D;z++)for(let x=0;x<W;x++){const g=ground[x+W*z];for(let y=Math.max(0,g-3);y<Math.min(H,g+12);y++){const id=world[I(x,y,z)];cnt[id]=(cnt[id]||0)+1;}}
  assert(WANT[k].every(([id,n])=>(cnt[id]||0)>=n),LANDS[LAND_I[k]].n+' has its own: '+WANT[k].map(([id])=>nameOf(id)+' '+(cnt[id]||0)).join(', '));
  if(k==='orchard'){let rows=0,tr=0;for(let z=0;z<D;z++)for(let x=0;x<W;x++){const g=ground[x+W*z];if(world[I(x,g+1,z)]===LOG){tr++;if((x+OX)%7===0&&(z+OZ)%7===0)rows++;}}assert(tr>20&&rows/tr>0.7,'orchard trees stand in rows ('+rows+' of '+tr+' on the grid)');}}
// small structures (Q123, Q125)
{let n=0;const kinds={};for(let a=-150;a<150;a++)for(let b=-150;b<150;b++){const s=smallAt(a,b);if(s){n++;kinds[s.kind]=(kinds[s.kind]||0)+1;}}
  info('small structures in 300 x 300 chunks',n,JSON.stringify(kinds));assert(Object.keys(kinds).length===8&&n>200,'all eight kinds of small structure stand across the lands');
  const find=k=>{for(let r=0;r<80;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){if(Math.max(Math.abs(a),Math.abs(b))!==r)continue;const s=smallAt(a,b);if(s&&s.kind===k)return s;}return null;};
  const ch=find('chapel');regenerateAll(ch.X,ch.Z);while(genQ.length)processGenQ();let graves=0;for(let dx=-6;dx<=6;dx++)for(let dz=3;dz<=10;dz++)for(let y=ch.g-3;y<=ch.g+4;y++)if(get(ch.X+dx-OX,y,ch.Z+dz-OZ)===GRAVE)graves++;
  assert(graves>=3&&surfaceName(ch.X,ch.g+1,ch.Z)===SMALL_NAMES.chapel,'the chapel at X '+ch.X+', Z '+ch.Z+' has its graveyard ('+graves+' graves) and its name');
  const br=find('bridge');regenerateAll(br.X,br.Z);while(genQ.length)processGenQ();assert(get(br.X-OX,SEA+2,br.Z-OZ)===PLANKS,'the bridge at X '+br.X+', Z '+br.Z+' spans its river');}
// signatures
{const st={none:0,placed:0,missed:0},kinds=new Set(),roots=new Set();
  for(let i=-50;i<50;i++)for(let j=-50;j<50;j++){const c=stretchCell(landSite(i,j)),L=LANDS[cellLand(c)];if(!MEN.includes(L.k))continue;const key=landKey(c.i,c.j);if(roots.has(key))continue;roots.add(key);
    const q=hsh(c.i,8141,c.j),s=sigOf(c);if(q<0.4)st.none++;else if(s){st.placed++;kinds.add(s.kind);}else st.missed++;}
  info('old lands of men stretches',roots.size,JSON.stringify(st),'; kinds',[...kinds].sort().join(' '));
  assert(st.missed<=roots.size*0.1&&kinds.size===8,'nearly every stretch of the old lands of men has its signature, and all 8 kinds appear');}
// apples from orchard leaves
{let apples=0;for(let k=0;k<400;k++)for(const [d] of dropsFor(FRUITL))if(d===207)apples++;assert(apples>60,'orchard leaves give apples ('+apples+' in 400)');}
