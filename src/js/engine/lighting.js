// Block light flood fill (glowstone, lava)
const QS=1<<21,QM=QS-1,Q=new Int32Array(QS);let qh=0,qt=0;
function qpush(i){Q[qt]=i;qt=(qt+1)&QM;}
function tryL(j,L){if(BLK[j]>=L||OPQ[world[j]])return;const x=j%W,z=((j/W)|0)%D;if(!genDone[(x>>4)+(z>>4)*NCX])return;BLK[j]=L;qpush(j);}
function propagate(){
  const WD=W*D;
  while(qh!==qt){
    const i=Q[qh];qh=(qh+1)&QM;const L=BLK[i]-1;if(L<=0)continue;
    const x=i%W,t=(i/W)|0,z=t%D,y=(t/D)|0;
    if(x>0)tryL(i-1,L);if(x<W-1)tryL(i+1,L);if(z>0)tryL(i-W,L);if(z<D-1)tryL(i+W,L);if(y>0)tryL(i-WD,L);if(y<H-1)tryL(i+WD,L);
  }
}
const torches=new Set();
function lightAll(){qh=qt=0;for(let i=0;i<VOL;i++){const L=LUM[world[i]];if(L){BLK[i]=L;qpush(i);if(world[i]===TORCH)torches.add(i);}}propagate();}
const dirty=new Set();let lbox=null;
function lightChunk(x0,z0){
  const x1=x0+CS-1,z1=z0+CS-1;qh=qt=0;
  for(let y=0;y<H;y++)for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){const i=I(x,y,z),L=LUM[world[i]];BLK[i]=L;if(L)qpush(i);}
  const cx=x0/CS,cz=z0/CS,dn=(a,b)=>a>=0&&b>=0&&a<NCX&&b<NCZ&&genDone[a+b*NCX];
  const wE=dn(cx-1,cz),eE=dn(cx+1,cz),nE=dn(cx,cz-1),sE=dn(cx,cz+1);
  for(let y=0;y<H;y++){
    for(let z=z0;z<=z1;z++){if(wE){const i=I(x0-1,y,z);if(BLK[i]>1)qpush(i);}if(eE){const i=I(x1+1,y,z);if(BLK[i]>1)qpush(i);}}
    for(let x=x0;x<=x1;x++){if(nE){const i=I(x,y,z0-1);if(BLK[i]>1)qpush(i);}if(sE){const i=I(x,y,z1+1);if(BLK[i]>1)qpush(i);}}
  }
  propagate();
}
function relight(b){
  const x0=Math.max(0,b[0]-15),x1=Math.min(W-1,b[1]+15),y0=Math.max(0,b[2]-15),y1=Math.min(H-1,b[3]+15),z0=Math.max(0,b[4]-15),z1=Math.min(D-1,b[5]+15);
  const old=new Uint8Array((x1-x0+1)*(y1-y0+1)*(z1-z0+1));let k=0;
  for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){const i=I(x,y,z);old[k++]=BLK[i];BLK[i]=0;}
  qh=qt=0;
  for(let y=y0-1;y<=y1+1;y++)for(let z=z0-1;z<=z1+1;z++)for(let x=x0-1;x<=x1+1;x++){
    if(x<0||z<0||y<0||x>=W||z>=D||y>=H)continue;
    const i=I(x,y,z),inside=x>=x0&&x<=x1&&y>=y0&&y<=y1&&z>=z0&&z<=z1;
    if(inside){const L=LUM[world[i]];if(L){BLK[i]=L;qpush(i);}}
    else if(BLK[i]>1)qpush(i);
  }
  propagate();
  let mx0=1e9,mx1=-1,mz0=1e9,mz1=-1;k=0;
  for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){if(BLK[I(x,y,z)]!==old[k]){if(x<mx0)mx0=x;if(x>mx1)mx1=x;if(z<mz0)mz0=z;if(z>mz1)mz1=z;}k++;}
  if(mx1>=0){
    for(let cz=Math.max(0,((mz0-1)/CS)|0);cz<=Math.min(NCZ-1,((mz1+1)/CS)|0);cz++)
      for(let cx=Math.max(0,((mx0-1)/CS)|0);cx<=Math.min(NCX-1,((mx1+1)/CS)|0);cx++)dirty.add(cx+cz*NCX);
  }
}

