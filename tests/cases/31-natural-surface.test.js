// @seed 123456789 4242
// A natural surface (M3.5b, Q89 to Q96): rivers lie in valleys with sloping banks, gentle lands are smooth, mountain ranges have
// peaks without sheer walls, barrows cluster on the Barrow Hills facing their own ways, sites stand on commanding ground, and
// trees gather in groves.
const o={},q={};
// rivers: land beside the water rises gently (before M3.5b a third of river columns had land 8 or more above the water within 5 blocks)
{let rv=0,cliff=0;for(let X=-2400;X<2400;X+=8)for(let Z=-2400;Z<2400;Z+=8){colInfo(X,Z,o);if(!o.river)continue;rv++;let m=0;
  for(let k=0;k<8;k++){const a=k*0.785;colInfo(Math.round(X+Math.cos(a)*5),Math.round(Z+Math.sin(a)*5),q);m=Math.max(m,q.h-SEA);}if(m>8)cliff++;}
  info('river columns',rv,'; with land more than 8 above the water within 5 blocks',(100*cliff/rv).toFixed(1)+'% (34% before M3.5b)');
  assert(rv>500,'rivers still run through the land');assert(cliff/rv<0.03,'rivers lie in valleys, not ravines');}
// smoothness: height against the mean of a 9 x 9 neighbourhood, by land
{const sq={},cnt={};for(let X=-2400;X<2400;X+=32)for(let Z=-2400;Z<2400;Z+=32){colInfo(X,Z,o);if(o.river||o.bank||o.lake||o.b===0||['chalk','isles','fjord','terrace'].includes(LANDS[o.land].k))continue;let m=0,n=0; // the cliff coasts (M6d) and the old terraces (M6g) are stepped on purpose
    for(let a=-4;a<=4;a+=2)for(let b=-4;b<=4;b+=2){m+=colInfo(X+a,Z+b,q).h;n++;}m/=n;sq[o.b]=(sq[o.b]||0)+(o.h-m)*(o.h-m);cnt[o.b]=(cnt[o.b]||0)+1;}
  const rms=b=>Math.sqrt((sq[b]||0)/Math.max(1,cnt[b]||0));
  info('roughness by land:',Object.keys(sq).map(b=>BIOMES[b]+' '+rms(b).toFixed(2)).join(', '));
  assert([2,3,7,10].every(b=>!cnt[b]||rms(b)<0.45),'green hills, elder wood, barrow hills and plains are smooth (about 0.6 to 0.7 before M3.5b)');}
// mountains: high peaks remain, few sheer steps
{let mt=0,steep=0,top=0;for(let X=-3000;X<3000;X+=8)for(let Z=-3000;Z<3000;Z+=8){colInfo(X,Z,o);if(o.b!==5)continue;mt++;top=Math.max(top,o.h);
    colInfo(X+1,Z,q);let s=Math.abs(q.h-o.h);colInfo(X,Z+1,q);s=Math.max(s,Math.abs(q.h-o.h));if(s>=4)steep++;}
  info('mountain columns',mt,'; highest',top,'; with a step of 4 or more',(100*steep/mt).toFixed(2)+'%');
  assert(top>420,'the ranges still rise to high peaks');assert(steep/mt<0.01,'mountain slopes are climbable, with cliffs only in places');}
// barrows: only on the Barrow Hills, mostly in clusters, facing several ways, in several sizes, some broken open
// around the nearest Barrow Hills (an uncommon land since M6a)
{const bs=[],nb=nearestLand(LAND_I.barrow,0,0,40),ca=Math.floor(nb.X/CS),cb=Math.floor(nb.Z/CS);for(let a=ca-120;a<ca+120;a++)for(let b=cb-120;b<cb+120;b++){const s=barrowAt(a,b);if(s)bs.push(s);}
  const rot=new Set(bs.filter(s=>!s.ring).map(s=>s.rot)),sz=bs.map(s=>s.sz),near=bs.filter(s=>bs.some(t=>t!==s&&Math.hypot(t.X-s.X,t.Z-s.Z)<70)).length;
  let off=0;for(const s of bs){colInfo(s.X,s.Z,o);if(!(o.b===7||(o.bw>0.35&&o.dw>0.35)))off++;}
  info('barrows and rings in 240 x 240 chunks',bs.length,'; rings',bs.filter(s=>s.ring).length,'; facings',rot.size,'; sizes',Math.min(...sz).toFixed(2),'to',Math.max(...sz).toFixed(2),'; broken open',bs.filter(s=>s.broken&&!s.ring).length,'; with a neighbour within 70 blocks',near,'; off the downs',off);
  assert(bs.length>20&&off===0,'barrows and rings stand on the Barrow Hills only');
  assert(rot.size>=3&&Math.max(...sz)-Math.min(...sz)>0.4&&bs.some(s=>s.broken&&!s.ring),'barrows face several ways, vary in size, and some are broken open');
  assert(near>bs.length*0.5,'most barrows stand in clusters');}
// sites: never in a hollow; towers and castles on commanding ground
{let n=0,hollow=0,prom=0,pn=0;for(let rx=-6;rx<6;rx++)for(let rz=-6;rz<6;rz++){const s=siteAt(rx,rz);if(!s)continue;n++;let ring=0;for(let k=0;k<8;k++){const a=k*0.785;ring+=hAt(Math.round(s.X+Math.cos(a)*36),Math.round(s.Z+Math.sin(a)*36));}
    const p=s.g-ring/8;if(p<-1)hollow++;if(s.kind!=='keep'){prom+=p;pn++;}}
  info('sites',n,'; in a hollow',hollow,'; mean rise of towers and castles over the land around them',(prom/Math.max(1,pn)).toFixed(1),'blocks');
  assert(hollow===0,'no site stands in a hollow');assert(prom/Math.max(1,pn)>2,'towers and castles stand on high ground');}
// trees gather in groves: trunks by grove field in a window on the nearest Green Hills (woods are thick throughout)
{const ne=nearestLand(LAND_I.green,PL.x+OX,PL.z+OZ,40);regenerateAll(ne.X,ne.Z);while(genQ.length)processGenQ();const TR=new Set([LOG,BIRCH,SPRUCE,JLOG]);let inG=0,inGc=0,outG=0,outGc=0;
  for(let z=0;z<D;z++)for(let x=0;x<W;x++){const g=ground[x+W*z],b=biome[x+W*z];if(![2,3,4,6,10].includes(b))continue;const G=fbm2((x+OX)/70,(z+OZ)/70,2,4801.3),t=TR.has(world[I(x,g+1,z)])?1:0;
    if(G>0.25){inG+=t;inGc++;}else if(G<-0.2){outG+=t;outGc++;}}
  info('trunks per 1000 columns of open land: in groves',(1000*inG/Math.max(1,inGc)).toFixed(1),'; in clearings',(1000*outG/Math.max(1,outGc)).toFixed(1));
  assert(inGc>500&&outGc>500,'the window has open land both in groves and clearings');if(inGc>500&&outGc>500)assert(inG/inGc>3*outG/Math.max(1,outGc),'trees gather in groves, with clearings between');}
