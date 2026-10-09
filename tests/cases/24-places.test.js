// @seed 123456789 4242
// Dungeon rooms and points of interest are rarer and always connected to a cave (Q24, D-024).
const S=id=>id>0&&SOLID[id];
const standable=(x,y,z)=>x>0&&z>0&&x<W-1&&z<D-1&&y>0&&y<H-2&&!S(world[I(x,y,z)])&&!S(world[I(x,y+1,z)])&&(S(world[I(x,y-1,z)])||world[I(x,y-1,z)]===WATER);
function walkFrom(sx,sy,sz,lim){const key=(x,y,z)=>x+W*(z+D*y),seen=new Set([key(sx,sy,sz)]),q=[[sx,sy,sz]];
  for(let i=0;i<q.length&&q.length<lim;i++){const [x,y,z]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,nz=z+b;
    for(const dy of [1,0,-1,-2,-3]){const ny=y+dy;if(dy===1&&S(world[I(x,y+2,z)]))continue;if(standable(nx,ny,nz)){const k=key(nx,ny,nz);if(!seen.has(k)){seen.add(k);q.push([nx,ny,nz]);}break;}if(dy<=0&&S(world[I(nx,ny,nz)]))break;}}}
  return {seen,key};}
// how common (the floor moved from 1% to 0.8% in M6d, D-042: more of seed 4242 is sea)
let nd=0,np=0,n=0;const kinds={};for(let a=-50;a<50;a++)for(let b=-50;b<50;b++){n++;const d=dungeonAt(a,b);if(d){nd++;kinds[d.kind]=(kinds[d.kind]||0)+1;}if(poiFor(a,b))np++;}
info('per 100 chunks: dungeon rooms',(100*nd/n).toFixed(1),JSON.stringify(kinds),'; points of interest',(100*np/n).toFixed(1));
assert(nd/n<0.06&&nd/n>0.008,'dungeon rooms are rare (was 20% of chunks before M2b)');
assert(np/n<0.16&&np/n>0.04,'points of interest are rarer (was 32% of chunks)');
assert(Object.keys(kinds).length===4,'all four kinds of dungeon room occur');
// every room in the loaded window opens onto its cave
let checked=0,ok=0;const bad=[];
function room(p,x,y,z,ax,ay,az,name){
  if(x<20||z<20||x>W-20||z>D-20)return;
  let st=null;for(let r=0;r<3&&!st;r++)for(const [a,b] of [[0,0],[r,0],[-r,0],[0,r],[0,-r]]){for(let yy=y+3;yy>=y-1;yy--)if(standable(x+a,yy,z+b)){st=[x+a,yy,z+b];break;}if(st)break;}
  checked++;if(!st){bad.push(name+' (no floor)');return;}
  const w=walkFrom(st[0],st[1],st[2],60000);let reach=false;for(let yy=ay-3;yy<=ay+1&&!reach;yy++)for(let a=-1;a<=1&&!reach;a++)for(let b=-1;b<=1&&!reach;b++)if(w.seen.has(w.key(ax+a,yy,az+b)))reach=true;
  if(reach)ok++;else bad.push(name+' at '+(x+OX)+','+y+','+(z+OZ));}
function survey(){for(let cz=0;cz<NCZ;cz++)for(let cx=0;cx<NCX;cx++){const WX=cx+OX/CS,WZ=cz+OZ/CS;
  const d=dungeonAt(WX,WZ);if(d)room(d,d.X-OX,d.y+1,d.Z-OZ,d.a.x-OX,d.a.y,d.a.z-OZ,DUNGEON_NAMES[d.kind]);
  const p=poiFor(WX,WZ);if(p&&p.a)room(p,p.x-OX,p.y+1,p.z-OZ,p.a.x-OX,p.a.y,p.a.z-OZ,POI_NAMES[p.tp]);}}
while(genQ.length)processGenQ();survey();
regenerateAll(1500,-900);while(genQ.length)processGenQ();survey();
regenerateAll(-1400,2200);while(genQ.length)processGenQ();survey();
regenerateAll(2600,1400);while(genQ.length)processGenQ();survey();
// built places are rarer since the caves are (D-029), so more windows keep the check meaningful
for(const [X,Z] of [[-2400,-1800],[900,2900],[-3100,600],[3300,-2600]]){regenerateAll(X,Z);while(genQ.length)processGenQ();survey();}
info('rooms checked',checked,'opening onto their cave',ok,bad.length?'; not: '+bad.join(', '):'');
assert(checked>=8,'enough rooms were checked');
assert(ok===checked,'every dungeon room and built point of interest opens onto a cave');
