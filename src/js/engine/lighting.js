// Light flood fill: block light (glowstone, lava) in BLK, and sky light that spreads sideways in SKL (Q36, D-027).
// Every open cell above its column's roof (hm) holds sky level 15 and spreads into covered cells like a light source, so
// overhangs and cave mouths are lit from the side. Both stores never enter chunks that are not generated (genDone), so streamed
// light equals a full recompute.
const QS=1<<21,QM=QS-1,Q=new Int32Array(QS);let qh=0,qt=0;
const SKL=new Uint8Array(VOL);
function qpush(i){Q[qt]=i;qt=(qt+1)&QM;}
function tryL(A,j,L){if(A[j]>=L||OPQ[world[j]])return;const x=j%W,z=((j/W)|0)%D;if(!genDone[(x>>4)+(z>>4)*NCX])return;A[j]=L;qpush(j);}
function propagate(A){
  const WD=W*D;
  while(qh!==qt){
    const i=Q[qh];qh=(qh+1)&QM;const L=A[i]-1;if(L<=0)continue;
    const x=i%W,t=(i/W)|0,z=t%D,y=(t/D)|0;
    if(x>0)tryL(A,i-1,L);if(x<W-1)tryL(A,i+1,L);if(z>0)tryL(A,i-W,L);if(z<D-1)tryL(A,i+W,L);if(y>0)tryL(A,i-WD,L);if(y<H-1)tryL(A,i+WD,L);
  }
}
const blkSrc=(i,x,y,z)=>LUM[world[i]],skySrc=(i,x,y,z)=>y>hm[x+W*z]&&!OPQ[world[i]]?15:0;
// Sets the sky level of a column's open cells (cells below are left alone) and queues the open cells that can light a covered
// neighbour: only sideways ones, from the roof up to the highest roof beside it (below an open cell is open or the roof).
function skyCol(x,z){
  const h=hm[x+W*z];let top=h;
  for(let y=h+1;y<H;y++){const i=I(x,y,z);if(!OPQ[world[i]])SKL[i]=15;}
  if(x>0)top=Math.max(top,hm[x-1+W*z]);if(x<W-1)top=Math.max(top,hm[x+1+W*z]);if(z>0)top=Math.max(top,hm[x+W*(z-1)]);if(z<D-1)top=Math.max(top,hm[x+W*(z+1)]);
  for(let y=h+1;y<=top&&y<H;y++){const i=I(x,y,z);if(SKL[i]===15)qpush(i);}
}
const torches=new Set();
// Full recompute, one chunk's sources at a time: seeding the whole window at once (the lava sea alone is some 300 000 emitters)
// overflowed the queue and lost light (D-025). Light spreads to the maximum either way, so the order does not change the result.
// Block light only rises (callers clear BLK first); sky light is cleared here.
function lightAll(){SKL.fill(0);for(let cz=0;cz<NCZ;cz++)for(let cx=0;cx<NCX;cx++){if(!genDone[cx+cz*NCX])continue;qh=qt=0;
  for(let y=0;y<H;y++)for(let z=cz*CS;z<cz*CS+CS;z++)for(let x=cx*CS,i=I(x,y,z),e=i+CS;i<e;i++){const L=LUM[world[i]];if(L){if(BLK[i]<L){BLK[i]=L;qpush(i);}if(world[i]===TORCH)torches.add(i);}}
  propagate(BLK);qh=qt=0;
  for(let z=cz*CS;z<cz*CS+CS;z++)for(let x=cx*CS;x<cx*CS+CS;x++)skyCol(x,z);
  propagate(SKL);}}
const dirty=new Set();let lbox=null;
function lightChunk(x0,z0){
  const x1=x0+CS-1,z1=z0+CS-1,cx=x0/CS,cz=z0/CS,dn=(a,b)=>a>=0&&b>=0&&a<NCX&&b<NCZ&&genDone[a+b*NCX];
  const wE=dn(cx-1,cz),eE=dn(cx+1,cz),nE=dn(cx,cz-1),sE=dn(cx,cz+1);
  // the light already in the generated neighbours, at the chunk's border
  const border=A=>{for(let y=0;y<H;y++){
    for(let z=z0;z<=z1;z++){if(wE){const i=I(x0-1,y,z);if(A[i]>1)qpush(i);}if(eE){const i=I(x1+1,y,z);if(A[i]>1)qpush(i);}}
    for(let x=x0;x<=x1;x++){if(nE){const i=I(x,y,z0-1);if(A[i]>1)qpush(i);}if(sE){const i=I(x,y,z1+1);if(A[i]>1)qpush(i);}}}};
  qh=qt=0;
  for(let y=0;y<H;y++)for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){const i=I(x,y,z),L=LUM[world[i]];BLK[i]=L;SKL[i]=0;if(L)qpush(i);}
  border(BLK);propagate(BLK);
  qh=qt=0;for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++)skyCol(x,z);
  border(SKL);propagate(SKL);
}
// Recompute light in a box around edits: everything within 15 of a changed cell. For sky light the box also holds the cells
// that changed from open to covered or back (setBlock widens it when a column's roof moves).
function relight(b){
  const x0=Math.max(0,b[0]-15),x1=Math.min(W-1,b[1]+15),y0=Math.max(0,b[2]-15),y1=Math.min(H-1,b[3]+15),z0=Math.max(0,b[4]-15),z1=Math.min(D-1,b[5]+15);
  let mx0=1e9,mx1=-1,mz0=1e9,mz1=-1;
  for(const [A,src] of [[BLK,blkSrc],[SKL,skySrc]]){
    const old=new Uint8Array((x1-x0+1)*(y1-y0+1)*(z1-z0+1));let k=0;
    for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){const i=I(x,y,z);old[k++]=A[i];A[i]=0;}
    qh=qt=0;
    for(let y=y0-1;y<=y1+1;y++)for(let z=z0-1;z<=z1+1;z++)for(let x=x0-1;x<=x1+1;x++){
      if(x<0||z<0||y<0||x>=W||z>=D||y>=H)continue;
      const i=I(x,y,z),inside=x>=x0&&x<=x1&&y>=y0&&y<=y1&&z>=z0&&z<=z1;
      if(inside){const L=genDone[(x>>4)+(z>>4)*NCX]?src(i,x,y,z):0;if(L){A[i]=L;qpush(i);}}
      else if(A[i]>1)qpush(i);
    }
    propagate(A);
    k=0;
    for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){if(A[I(x,y,z)]!==old[k]){if(x<mx0)mx0=x;if(x>mx1)mx1=x;if(z<mz0)mz0=z;if(z>mz1)mz1=z;}k++;}
  }
  if(mx1>=0){
    for(let cz=Math.max(0,((mz0-1)/CS)|0);cz<=Math.min(NCZ-1,((mz1+1)/CS)|0);cz++)
      for(let cx=Math.max(0,((mx0-1)/CS)|0);cx<=Math.min(NCX-1,((mx1+1)/CS)|0);cx++)dirty.add(cx+cz*NCX);
  }
}
