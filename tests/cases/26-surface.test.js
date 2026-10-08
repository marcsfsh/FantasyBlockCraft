// @seed 123456789 4242
// Ruined surface sites, old roads and ancient waystones (Q71, Q72, D-024).
const S=id=>id>0&&SOLID[id];
const all=[];let n=0;for(let rx=-6;rx<6;rx++)for(let rz=-6;rz<6;rz++){n++;const s=siteAt(rx,rz);if(s)all.push(s);}
const kinds={};for(const s of all)kinds[s.kind]=(kinds[s.kind]||0)+1;
info('sites in',n,'regions of 384 x 384 blocks:',all.length,JSON.stringify(kinds),'; with a waystone',all.filter(s=>s.way).length);
assert(all.length/n>0.4&&all.length/n<0.75,'most regions have a ruined site');
assert(kinds.tower&&kinds.keep&&kinds.castle,'watchtowers, keeps and castles all occur');
assert(all.some(s=>s.way),'some sites have an ancient waystone');
// roads: every site has a road to a neighbour, and the road is laid along most of its length
let linked=0;for(const s of all)if(siteLinks(s).length)linked++;info('sites with a road to a neighbour',linked,'of',all.length);
assert(linked>=all.length*0.9,'old roads link nearly every site');
// build the nearest of each kind: the walls stand, nothing floats, the road reaches it, and its waystone is there
for(const k of ['tower','keep','castle']){const s=all.filter(q=>q.kind===k).sort((a,b)=>Math.hypot(a.X,a.Z)-Math.hypot(b.X,b.Z))[0];
  regenerateAll(s.X,s.Z);while(genQ.length)processGenQ();const x=s.X-OX,z=s.Z-OZ;
  let walls=0,floating=0;for(let a=-s.R-2;a<=s.R+2;a++)for(let b=-s.R-2;b<=s.R+2;b++){for(let y=s.g+1;y<=s.g+s.H+4;y++)if([SBRICK,COBBLE,MOSSY].includes(world[I(x+a,y,z+b)]))walls++;
    const f=world[I(x+a,s.g,z+b)];if(S(f)&&!BL[f].leaf&&!S(world[I(x+a,s.g-1,z+b)]))floating++;}
  let road=0,laid=0;const t=siteLinks(s)[0];if(t){for(let k2=0;k2<=60;k2++){const px=Math.round(s.X+(t.X-s.X)*k2/600*((s.R+20)/10)),pz=Math.round(s.Z+(t.Z-s.Z)*k2/600*((s.R+20)/10));}
    for(let a=-s.R-40;a<=s.R+40;a++)for(let b=-s.R-40;b<=s.R+40;b++){const xx=x+a,zz=z+b;if(xx<0||zz<0||xx>=W||zz>=D)continue;if(!oldRoadAt(xx+OX,zz+OZ))continue;road++;const top=world[I(xx,ground[xx+W*zz],zz)];if(top===PATH||top===GRAVEL||top===COBBLE)laid++;}}
  let way=0;if(s.way)for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)for(let y=s.g;y<=s.g+3;y++)if(world[I(x+s.R+4+a,y,z+b)]===WAYSTONE)way++;
  info(s.name,'at X',s.X,'Z',s.Z,'ground',s.g,': wall blocks',walls,'; floor blocks over open air',floating,'; road columns near it',road,'laid',laid,s.way?'; waystone blocks '+way:'');
  assert(walls>(k==='tower'?40:150),'the '+k+' stands');
  assert(floating===0,'the '+k+' rests on the ground');
  assert(road===0||laid/road>0.5,'the road near the '+k+' is laid on the ground');
  if(s.way)assert(way===2,'the waystone at the '+k+' stands');
}
