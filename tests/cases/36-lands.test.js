// Lands (M6a): the registry, the transition map, the layout's sizes and widths, gorges in place of the hairline ravines,
// stretch names, the land tour, and two bytes per block.
// ---- the registry (Q105 to Q116, Q119, Q124)
const KEPT=LANDS.filter(L=>L.fam==='kept'),NEW=LANDS.filter(L=>L.fam!=='kept');
assert(NEW.length===30&&KEPT.length===7,'30 new lands and 7 old ones kept ('+NEW.length+' new, '+KEPT.length+' kept)');
assert(['Windswept Plains','Fens','Northern Fells'].every(n=>LANDS.some(L=>L.was===n)),'Windswept Plains, Fens and Northern Fells rework into new lands (Q119)');
assert(LANDS.every(L=>L.s.length===2&&L.s.every(x=>typeof x==='string'&&x.length>3)),'every land has a signature landmark and a signature feature (Q124)');
assert(LANDS.every(L=>PEOPLES[L.p]&&L.tier>=1&&L.tier<=3&&BIOMES[L.look]&&LAND_FAM[L.fam]),'every land has a people for its names, a tier, a family and a look');
assert(LANDS.every(L=>!isBlockedName(L.n)),'no land is named after Tolkien\'s works');
// ---- the transition map (Q108): symmetric, and no cold land beside a hot one
assert(LAND_MEET.every((r,a)=>r.every((v,b)=>v===LAND_MEET[b][a])),'the transition map is symmetric');
const LK=k=>LAND_I[k];
assert(!LAND_MEET[LK('tundra')][LK('dry')]&&!LAND_MEET[LK('glacier')][LK('steppe')]&&!LAND_MEET[LK('pine')][LK('volcanic')],'no winter land borders a desert or a volcanic waste');
assert(!LAND_MEET[LK('flower')][LK('blight')]&&LAND_MEET[LK('green')][LK('elder')]&&LAND_MEET[LK('sea')][LK('mtn')],'never lists hold (flower meadows never meet blighted lands); ordinary neighbours may meet');
// ---- the layout over 12 000 x 12 000 blocks (8 blocks a sample): every neighbouring pair allowed, sizes and widths (Q118)
const N=1500,ST=8,X0=-6000,Z0=-6000,grid=new Int16Array(N*N),o={};
for(let j=0;j<N;j++)for(let i=0;i<N;i++)grid[i+N*j]=landsAt(X0+i*ST+4,Z0+j*ST+4,o).area;
let bad=0;const badP=new Set();for(let j=0;j<N-1;j++)for(let i=0;i<N-1;i++){const a=grid[i+N*j];for(const b of [grid[i+1+N*j],grid[i+N*(j+1)]])if(a!==b&&!LAND_MEET[a][b]){bad++;badP.add(LANDS[a].k+'/'+LANDS[b].k);}}
assert(bad===0,'every pair of neighbouring lands is allowed by the transition map ('+bad+' bad borders'+(bad?': '+[...badP].join(' '):'')+')');
const lab=new Int32Array(N*N).fill(-1),regs=[],q=new Int32Array(N*N);
for(let s=0;s<N*N;s++){if(lab[s]>=0)continue;const L=grid[s];let h=0,t=0,edge=false;q[t++]=s;lab[s]=regs.length;
  while(h<t){const c=q[h++],x=c%N,z=(c-x)/N;if(x===0||z===0||x===N-1||z===N-1)edge=true;for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,zz=z+dz;if(xx<0||zz<0||xx>=N||zz>=N)continue;const k=xx+N*zz;if(lab[k]<0&&grid[k]===L){lab[k]=regs.length;q[t++]=k;}}}
  regs.push({L:L,a:t*ST*ST,edge:edge});}
const tips=regs.filter(r=>!r.edge&&r.a<900),inner=regs.filter(r=>!r.edge&&r.a>=900).sort((a,b)=>a.a-b.a);
const side=r=>Math.round(Math.sqrt(r.a)),med=a=>{a=a.slice().sort((x,y)=>x-y);return a[a.length>>1];};
info('lands wholly inside:',inner.length,'; smallest',inner.slice(0,5).map(r=>LANDS[r.L].k+' '+side(r)).join(', '),'; corner tips under 30 x 30 blocks:',tips.length);
assert(side(inner[0])>=215,'no land is smaller than 215 x 215 blocks (smallest '+side(inner[0])+' a side)');
assert(tips.length<=inner.length*0.05,'corner tips where cells meet are few ('+tips.length+')');
const byT=[1,2,3].map(t=>med(inner.filter(r=>LANDS[r.L].tier===t).map(side)));
info('median side by tier: common',byT[0],'uncommon',byT[1],'rare',byT[2]);
assert(byT[0]>byT[1]&&byT[1]>=byT[2]*0.95,'common lands are larger than uncommon ones, and rare ones no larger');
// width: every sample of a land lies in a 115-block circle of that land, except the tips of corners; few lands pinch
{const R=7,disc=[];for(let a=-R;a<=R;a++)for(let b=-R;b<=R;b++)if(a*a+b*b<=R*R)disc.push([a,b]);
  const cen=new Uint8Array(N*N),cov=new Uint8Array(N*N);
  for(let z=R;z<N-R;z++)for(let x=R;x<N-R;x++){const L=grid[x+N*z];let ok=true;for(const [a,b] of disc)if(grid[x+a+N*(z+b)]!==L){ok=false;break;}if(ok)cen[x+N*z]=1;}
  for(let z=R;z<N-R;z++)for(let x=R;x<N-R;x++)if(cen[x+N*z])for(const [a,b] of disc)cov[x+a+N*(z+b)]=1;
  let tot=0,un=0;for(let z=2*R;z<N-2*R;z++)for(let x=2*R;x<N-2*R;x++){tot++;if(!cov[x+N*z])un++;}
  // a land pinches where its part that circles reach falls into pieces
  const l2=new Int32Array(N*N).fill(-1);for(let s=0;s<N*N;s++){if(!cov[s]||l2[s]>=0)continue;let h=0,t=0;q[t++]=s;l2[s]=s;while(h<t){const c=q[h++],x=c%N,z=(c-x)/N;for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,zz=z+dz;if(xx<0||zz<0||xx>=N||zz>=N)continue;const k=xx+N*zz;if(l2[k]<0&&cov[k]&&lab[k]===lab[s]){l2[k]=s;q[t++]=k;}}}}
  const parts=new Map();for(let s=0;s<N*N;s++)if(cov[s]){if(!parts.has(lab[s]))parts.set(lab[s],new Set());parts.get(lab[s]).add(l2[s]);}
  let pinch=0;for(const [r,set] of parts)if(!regs[r].edge&&set.size>1)pinch++;
  info('samples outside every 115-block circle of their land (corner tips):',(100*un/tot).toFixed(2)+'%; lands with a pinch:',pinch,'of',inner.length);
  assert(un/tot<0.03,'all but the corner tips of every land lie within a 115-block circle of that land');
  assert(pinch<=Math.ceil(inner.length*0.04),'few lands pinch where two stretches of the same kind meet ('+pinch+')');}
// shares: no land takes over
{const sh={};let land=0;for(let s=0;s<N*N;s++){const L=LANDS[grid[s]];if(L.sea&&L.k==='sea')continue;sh[L.k]=(sh[L.k]||0)+1;land++;}
  const top=Object.entries(sh).sort((a,b)=>b[1]-a[1]);info('largest shares of land:',top.slice(0,6).map(e=>e[0]+' '+(100*e[1]/land).toFixed(1)+'%').join(', '));
  assert(top[0][1]/land<0.14,'no land covers more than 14% of the land');}
{const seen={};for(let i=-40;i<40;i++)for(let j=-40;j<40;j++)seen[cellLand(landSite(i,j))]=1;const miss=LANDS.filter(L=>!seen[L.i]).map(L=>L.k);
  assert(miss.length===0,'every land appears within 12 800 blocks of the middle'+(miss.length?' (missing '+miss.join(', ')+')':''));}
// ---- gorges (Q137): fewer than the old ravines, at least 7 blocks across except at their rounded ends, some reaching the caves
{const cutAt=(X,Z)=>{colInfo(X,Z,o);return o.rvBot<999&&o.rvBot<=o.h-3;};
  const run=(X,Z,dx,dz)=>{let n=1;for(let k=1;k<80&&cutAt(X+dx*k,Z+dz*k);k++)n++;for(let k=1;k<80&&cutAt(X-dx*k,Z-dz*k);k++)n++;return n;};
  let land=0,cut=0,cross=0,oldCross=0,was=false,wasOld=false;const w=[],dep=[];
  for(let line=0;line<40;line++){const Z=line*151-3000;for(let X=-3000;X<3000;X++){colInfo(X,Z,o);if(o.h>=SEA)land++;const c=o.rvBot<999&&o.rvBot<=o.h-3;
    const old=!o.wet&&Math.abs(fbm2(X/70,Z/70,2,401.1))<0.008&&fbm2(X/180,Z/180,2,433.7)>0.28; // the M2b ravine line, for comparison
    if(c&&!was)cross++;if(old&&!wasOld)oldCross++;was=c;wasOld=old;
    if(c){cut++;dep.push(o.h-o.rvBot+1);if(X%3===0)w.push(Math.min(run(X,Z,1,0),run(X,Z,0,1),Math.round(run(X,Z,1,1)*1.41),Math.round(run(X,Z,1,-1)*1.41)));}}}
  const narrow=w.filter(x=>x<7).length;
  info('gorges:',(100*cut/land).toFixed(2)+'% of land columns;',cross,'crossings against',oldCross,'for the old ravines; width median',med(w),'; under 7 wide',narrow,'of',w.length,'(rounded ends); depth median',med(dep),'max',Math.max(...dep));
  assert(cross>0&&cross<oldCross*0.75,'gorges are fewer than the old ravines');
  assert(narrow<=w.length*0.06&&med(w)>=12,'gorges are at least 7 blocks across except at their rounded ends');
  assert(Math.max(...dep)>=45&&Math.max(...dep)<=62,'the deepest gorges cut down 45 to 62 blocks, into the crawlways');}
// ---- stretch names (Q131)
{const a=landsAt(100,100,{}),n1=stretchName(a.lcell),b=landsAt(4100,-3900,{}),n2=stretchName(b.lcell);
  info('stretch names:',n1,'/',n2,'/',landPlaceName(PL.x+OX,PL.z+OZ));
  assert(/ of [A-Z][a-z]+$/.test(n1)&&n1!==n2,'each stretch has its own name: the land and a place name');
  assert(stretchName(a.lcell)===n1&&!isBlockedName(n1.split(' of ').pop()),'stretch names are stable and never Tolkien\'s');
  const c=landSite(Math.floor(100/LS),Math.floor(100/LS)),L=LANDS[cellLand(c)];
  assert(stretchName(landKey(c.i,c.j)).startsWith(L.sea?'The Sea of':(landShown(L).replace(/^The /,''))),'a stretch is named after the land it shows as');}
// ---- the land tour (Q136): takes the player into the nearest stretch of the chosen land
setMode('creative');
for(const k of ['elder','giant']){const r=landTour(LAND_I[k]);
  assert(r&&landsAt(PL.x+OX,PL.z+OZ,{}).area===LAND_I[k]&&!collide(),'the land tour goes to '+LANDS[LAND_I[k]].n+(LANDS[LAND_I[k]].built?'':' (planned)')+' ('+(r?r.d:'-')+' blocks)');}
setMode('survival');assert(landTour(LAND_I.elder)===null,'the land tour is creative only');setMode('creative');
// ---- two bytes per block (Q120)
{const x=W/2,z=D/2,y=H-3,i=I(x,y,z),was=world[i];world[i]=1500;assert(get(x,y,z)===1500,'the world holds block ids above 255');world[i]=was;}
