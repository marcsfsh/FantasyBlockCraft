// @seed 123456789 4242
// Remains of other peoples in the deep (Q10, Q70, D-024): every kind occurs, some only as leftovers; each sits in a natural cavern.
const S=id=>id>0&&SOLID[id];
const found={};let n=0,tot=0;for(let rx=-8;rx<8;rx++)for(let rz=-8;rz<8;rz++){n++;const s=remainsAt(rx,rz);if(!s)continue;tot++;(found[s.kind]=found[s.kind]||[]).push(s);}
info('sites in',n,'regions of 160 x 160 blocks:',tot,JSON.stringify(Object.fromEntries(Object.entries(found).map(([k,v])=>[k,v.length+' ('+v.filter(s=>s.left).length+' leftovers)']))));
assert(['warren','workshop','drow','nameless'].every(k=>found[k]&&found[k].some(s=>!s.left)&&found[k].some(s=>s.left)),'goblin warrens, gnome workshops, drow halls and nameless ruins all occur, whole and as leftovers');
assert(tot/n>0.12&&tot/n<0.4,'remains are rarer than natural caves (about one region in four)');
let ok=0;
const MARK={warren:[COBBLE,GRAVEL,DIRT,DTORCH],workshop:[BRICK,PLANKS,FURN,BOOKS,COPB],drow:[OBSID,AMETH,DEEP,CRYSTAL],nameless:[CALCITE,SBRICK,MOSSY,RUNE]};
for(const k of ['warren','workshop','drow','nameless']){const s=found[k].filter(q=>!q.left).sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z))[0];
  regenerateAll(s.X,s.Z);while(genQ.length)processGenQ();const x=s.X-OX,z=s.Z-OZ;
  let marks=0;for(let a=-12;a<=12;a++)for(let b=-12;b<=12;b++)for(let dy=-1;dy<=7;dy++)if(MARK[k].includes(world[I(x+a,s.y+dy,z+b)]))marks++;
  // open air connected to the site's middle, within 40 blocks: it lies in a cavern, not sealed in rock
  let sx=x,sy=s.y+4,sz=z;for(let t=0;t<12&&S(world[I(sx,sy,sz)]);t++)sx++; // above the middle, clear of floors, daises and furniture
  const key=(a,b,c)=>a+W*(c+D*b),seen=new Set([key(sx,sy,sz)]),q=[[sx,sy,sz]];
  for(let i=0;i<q.length&&q.length<6000;i++){const [a,b,c]=q[i];for(const [p,u,v] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){const na=a+p,nb=b+u,nc=c+v;if(Math.abs(na-x)>40||Math.abs(nc-z)>40||nb<2)continue;const kk=key(na,nb,nc);if(seen.has(kk)||S(world[I(na,nb,nc)]))continue;seen.add(kk);q.push([na,nb,nc]);}}
  const fine=marks>=40&&seen.size>=3000;if(fine)ok++;
  info(s.name,'at X',s.X,'Y',s.y,'Z',s.Z,': its blocks',marks,'; open air around it',seen.size>=6000?'6000+':seen.size,fine?'':'PROBLEM');}
assert(ok===4,'each kind stands built in an open cavern');
