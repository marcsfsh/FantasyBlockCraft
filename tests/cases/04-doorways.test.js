// @seed 4242 777
// Every open doorway between two built rooms can be walked through (steps of one block allowed).
// The loaded window is moved to the centre of the hold of region (0,0) (holds are rare, D-023).
{const HH=holdAt(0,0);regenerateAll(HH.cx*CS+8,HH.cz*CS+8);info('hold of region 0,0 at X',HH.cx*CS+8,'Z',HH.cz*CS+8,HH.inhabited?'(inhabited)':'');}
while(genQ.length)processGenQ();
const Y0=54,Y1=104,NY=Y1-Y0;
const S=(id)=>id>0&&SOLID[id];
function SH(X,Z,L){const t=ruinType(X,Z,L)||'hall';if(atriumAt(X,Z))return{h:7,yo:0};if(['avenue','plaza','stair','chasm','minehall'].includes(t))return{h:7,yo:0};return cellShape(X,Z,L,t);}
function idx(x,y,z){return x+W*(z+D*(y-Y0));}
const seen=new Uint8Array(W*D*NY);const q=new Int32Array(W*D*NY);let qh=0,qt=0;
const walk=(x,y,z)=>x>0&&z>0&&x<W-1&&z<D-1&&y>Y0&&y<Y1-2&&!S(world[I(x,y,z)])&&!S(world[I(x,y+1,z)])&&(S(world[I(x,y-1,z)])||world[I(x,y-1,z)]===WATER||world[I(x,y,z)]===WATER);
// seeds: avenue cell centres on both levels, central 10x10 chunks
for(let cz=2;cz<NCZ-2;cz++)for(let cx=2;cx<NCX-2;cx++){const WX=cx+OX/CS,WZ=cz+OZ/CS;if(!isAvenue(WX,WZ))continue;for(let L=0;L<2;L++){if(!ruinActive(WX,WZ,L))continue;const x=cx*CS+8,z=cz*CS+8;for(let y=RUIN_Y[L]-3;y<RUIN_Y[L]+4;y++)if(walk(x,y,z)&&!seen[idx(x,y,z)]){seen[idx(x,y,z)]=1;q[qt++]=idx(x,y,z);}}}
info('seeds',qt);
while(qh<qt){const k=q[qh++],x=k%W,z=((k/W)|0)%D,y=((k/W/D)|0)+Y0;
  for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,nz=z+b;
    if(S(world[I(nx,y,nz)])){if(!S(world[I(x,y+2,z)])&&walk(nx,y+1,nz)){const j=idx(nx,y+1,nz);if(!seen[j]){seen[j]=1;q[qt++]=j;}}continue;}for(const dy of [0,-1,-2,-3]){const ny=y+dy;if(ny<=Y0)break;if(walk(nx,ny,nz)){const j=idx(nx,ny,nz);if(!seen[j]){seen[j]=1;q[qt++]=j;}break;}if(dy<0&&S(world[I(nx,ny,nz)]))break;}}
  // straight down (falling through holes)
  if(!S(world[I(x,y-1,z)])&&world[I(x,y-1,z)]!==WATER){let ny=y-1;while(ny>Y0+1&&!S(world[I(x,ny-1,z)])&&world[I(x,ny-1,z)]!==WATER)ny--;if(walk(x,ny,z)){const j=idx(x,ny,z);if(!seen[j]){seen[j]=1;q[qt++]=j;}}}
}
let rooms=0,unreached=0,types={},samples=[];
for(let cz=3;cz<NCZ-3;cz++)for(let cx=3;cx<NCX-3;cx++){const WX=cx+OX/CS,WZ=cz+OZ/CS;for(let L=0;L<2;L++){const t=ruinType(WX,WZ,L);if(!t||t==='avenue'||t==='plaza'||t==='delf'||t==='chasm'||megaAt(WX,WZ,L))continue;
  const sh=SH(WX,WZ,L),fy=RUIN_Y[L]+sh.yo;let any=false;
  for(let dx=-sh.h+1;dx<=sh.h-1&&!any;dx++)for(let dz=-sh.h+1;dz<=sh.h-1&&!any;dz++)for(let y=fy-4;y<=fy+4&&!any;y++){const x=cx*CS+8+dx,z=cz*CS+8+dz;if(y>Y0&&y<Y1&&seen[idx(x,y,z)])any=true;}
  rooms++;if(!any){unreached++;types[t]=(types[t]||0)+1;let open=0;for(const [a,b] of DIRS4)if(edgeOpen(WX,WZ,a,b,L))open++;if(samples.length<6)samples.push(t+'/L'+L+'/open'+open+'/h'+sh.h+'/yo'+sh.yo);}}}
let isl=0;for(let cz=4;cz<NCZ-4;cz++)for(let cx=4;cx<NCX-4;cx++)for(let L=0;L<2;L++){const WX=cx+OX/CS,WZ=cz+OZ/CS;if(ruinActive(WX,WZ,L)&&avDist(WX,WZ,L)===99)isl++;}info("cells with no avenue within reach",isl);
info("rooms checked",rooms,"unreachable",unreached,JSON.stringify(types),samples.join(' '));

const obst={};let edgesBad=0,edgesChecked=0;
function localBFS(cxA,czA,L,cxB,czB){ // flood within two cells from A interior; true if B interior reached
  const shA=SH(cxA+OX/CS,czA+OZ/CS,L),fA=RUIN_Y[L]+shA.yo;
  const shB=SH(cxB+OX/CS,czB+OZ/CS,L),fB=RUIN_Y[L]+shB.yo;
  const x0=Math.min(cxA,cxB)*CS,x1=Math.max(cxA,cxB)*CS+15,z0=Math.min(czA,czB)*CS,z1=Math.max(czA,czB)*CS+15;
  const vis=new Set();const qq=[];
  for(let dx=-shA.h+2;dx<=shA.h-2;dx++)for(let dz=-shA.h+2;dz<=shA.h-2;dz++)for(let y=fA-2;y<=fA+3;y++){const x=cxA*CS+8+dx,z=czA*CS+8+dz;if(walk(x,y,z)){const k=x+','+y+','+z;if(!vis.has(k)){vis.add(k);qq.push([x,y,z]);}}}
  for(let i=0;i<qq.length;i++){const [x,y,z]=qq[i];
    if(Math.abs(x-(cxB*CS+8))<=shB.h-2&&Math.abs(z-(czB*CS+8))<=shB.h-2&&Math.abs(y-fB)<=3)return true;
    for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,nz=z+b;if(nx<x0||nx>x1||nz<z0||nz>z1)continue;
      const push=(X,Y,Z)=>{const k=X+','+Y+','+Z;if(!vis.has(k)){vis.add(k);qq.push([X,Y,Z]);}};
      if(S(world[I(nx,y,nz)])){if(!S(world[I(x,y+2,z)])&&walk(nx,y+1,nz))push(nx,y+1,nz);continue;}
      for(const dy of [0,-1,-2,-3]){const ny=y+dy;if(walk(nx,ny,nz)){push(nx,ny,nz);break;}if(dy<0&&S(world[I(nx,ny,nz)]))break;}}}
  return false;
}
for(let cz=3;cz<NCZ-3;cz++)for(let cx=3;cx<NCX-3;cx++)for(let L=0;L<2;L++){const WX=cx+OX/CS,WZ=cz+OZ/CS;const t=ruinType(WX,WZ,L);if(!t||megaAt(WX,WZ,L)||t==='chasm'||inDelf(WX,WZ))continue;
  for(const [dx,dz] of [[1,0],[0,1]]){if(!edgeOpen(WX,WZ,dx,dz,L))continue;const t2=ruinType(WX+dx,WZ+dz,L);if(!t2||megaAt(WX+dx,WZ+dz,L)||t2==='chasm'||inDelf(WX+dx,WZ+dz))continue;edgesChecked++;
    if(!localBFS(cx,cz,L,cx+dx,cz+dz)){edgesBad++;const key=t+'>'+t2+'('+edgeKind(WX,WZ,dx,dz,L)+')';obst[key]=(obst[key]||0)+1;}}}
info("edges",edgesChecked,"impassable",edgesBad,JSON.stringify(obst));

assert(edgesChecked>20,'enough doorways were checked');
assert(edgesBad/Math.max(1,edgesChecked)<=0.02,'at most 2% of doorways are blocked');
