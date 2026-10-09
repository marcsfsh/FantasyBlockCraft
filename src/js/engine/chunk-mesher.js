// ---- what to call a place underground, by depth
function layerName(y,X,Z){
  const m=mineName(X,y,Z);if(m)return m;
  if(y<12)return 'The Fire Below';
  if(y<100){const cx=Math.floor(X/CS),cz=Math.floor(Z/CS);if(y>=58&&ruinZone(cx,cz))return 'The Deeps of '+holdOf(cx,cz).name;return mineZone(cx,cz)?'The Mines of '+holdOf(cx,cz).name:DEEP_NAMES[caveRegion(X,Z)];}
  return y<152?'The Great Caverns':y<204?'The Old Workings':y<260?CAVE_NAMES[caveRegion(X,Z)]:'Crawlways';
}
// Only a band of heights around the player is meshed; from near the surface up, the band reaches the top of the world so peaks stay visible
// Above ground (MB.surf) each chunk is also meshed only down to MESH_DEEP blocks under the lowest sky-exposed ground in and around
// it, so cave interiors nobody can see from the surface are skipped (M3, D-025). Underground the band reaches as far as cave fog
// lets you see. Surface or underground is judged against the terrain height, with some give so a doorway does not flip it.
const MESH_DEEP=24,MB={c:SEA,lo:SEA-120,hi:H-1,surf:true};
function meshBand(){
  const px=Math.floor(PL.x),pz=Math.floor(PL.z),g=(px>=0&&pz>=0&&px<W&&pz<D)?ground[px+W*pz]:SEA;
  const surf=MB.surf?PL.y>g-6:PL.y>g-2,half=surf?120:[48,72,118][settings.cave||0],c=Math.round(PL.y/16)*16;
  if(surf===MB.surf&&Math.abs(c-MB.c)<half*0.4)return;
  MB.surf=surf;MB.c=c;MB.lo=c-half;MB.hi=surf&&c>=SEA-60?H-1:c+half;for(let i=0;i<NCX*NCZ;i++)dirty.add(i);
}
function meshFloor(x0,z0){
  let lo=MB.lo;if(!MB.surf)return lo;let ms=H;
  for(let z=Math.max(0,z0-1);z<=Math.min(D-1,z0+CS);z++)for(let x=Math.max(0,x0-1);x<=Math.min(W-1,x0+CS);x++){const h=hm[x+W*z];if(h<ms)ms=h;}
  return Math.max(lo,ms-MESH_DEEP);
}
const MP=CS+2,MID=new Uint8Array(MP*MP*H),MSK=new Float32Array(MP*MP*H),MBL=new Float32Array(MP*MP*H);
function buildChunk(cx,cz){
  const O=newM(),Wt=newM();
  const x0=cx*CS,z0=cz*CS,s1=[0,0,0],s2=[0,0,0];
  let ymax=0;for(let z=z0;z<z0+CS;z++)for(let x=x0;x<x0+CS;x++){let y=H-1;while(y>ymax&&!world[x+W*(z+D*y)])y--;if(y>ymax)ymax=y;}
  const yfl=meshFloor(x0,z0),ytop=Math.min(H-1,ymax+1,MB.hi+1),ylo=Math.max(0,yfl-1);
  for(let y=ylo;y<=ytop;y++)for(let z=z0-1;z<=z0+CS;z++)for(let x=x0-1;x<=x0+CS;x++){const k=(y*MP+(z-z0+1))*MP+(x-x0+1);MID[k]=get(x,y,z);MSK[k]=sky(x,y,z);MBL[k]=bl(x,y,z);}
  const mk=(x,y,z)=>(y<ylo||y>ytop)?-1:(y*MP+(z-z0+1))*MP+(x-x0+1);
  const gid=(x,y,z)=>{const k=mk(x,y,z);return k<0?get(x,y,z):MID[k];},gsky=(x,y,z)=>{const k=mk(x,y,z);return k<0?sky(x,y,z):MSK[k];},gbl=(x,y,z)=>{const k=mk(x,y,z);return k<0?bl(x,y,z):MBL[k];};
  for(let y=Math.max(0,yfl);y<=Math.min(ymax,MB.hi);y++)for(let z=z0;z<z0+CS;z++)for(let x=x0;x<x0+CS;x++){
    const ii=x+W*(z+D*y),id=world[ii];if(!id)continue;
    if(OPQ[id]&&x>0&&x<W-1&&z>0&&z<D-1&&y>0&&y<H-1&&OPQ[world[ii+1]]&&OPQ[world[ii-1]]&&OPQ[world[ii+W]]&&OPQ[world[ii-W]]&&OPQ[world[ii+WD]]&&OPQ[world[ii-WD]])continue;
    const b=BL[id];
    if(b.flat){const L=sky(x,y,z),B=bl(x,y,z),t=b.t[0],base=O.p.length/3,f=1/16;
      for(const c of [[0,f,1,1,1],[1,f,1,0,1],[0,f,0,1,0],[1,f,0,0,0]]){O.p.push(x+c[0],y+c[1],z+c[2]);if(b.rot)pushUV(O.u,t,c[4],c[3]);else pushUV(O.u,t,c[3],c[4]);O.l.push(L);O.b.push(B);O.a.push(1);}
      O.i.push(base,base+1,base+2,base+2,base+1,base+3,base,base+2,base+1,base+2,base+3,base+1);continue;}
    if(b.wall){ // a panel on the first opaque wall beside it (ladders, pitons, the grapnel); upright in the middle when there is none
      let ox=0,oz=0;if(OPQ[get(x+1,y,z)])ox=1;else if(OPQ[get(x-1,y,z)])ox=-1;else if(OPQ[get(x,y,z+1)])oz=1;else if(OPQ[get(x,y,z-1)])oz=-1;
      const L=sky(x,y,z),B=bl(x,y,z),t=b.t[0],base=O.p.length/3,e=1/16;
      for(let k=0;k<4;k++){const a=CUV[k][0],v=CUV[k][1];if(ox)O.p.push(x+(ox>0?1-e:e),y+v,z+a);else O.p.push(x+a,y+v,z+(oz>0?1-e:oz<0?e:0.5));pushUV(O.u,t,a,v);O.l.push(L);O.b.push(B);O.a.push(0.92);}
      O.i.push(base,base+1,base+2,base+2,base+1,base+3,base,base+2,base+1,base+2,base+3,base+1);continue;}
    if(b.cross){
      const L=sky(x,y,z)*0.92,B=b.emit?2:bl(x,y,z)*0.92,t=b.t[0];
      for(let q=0;q<2;q++){const base=O.p.length/3;
        for(let k=0;k<4;k++){const c=CROSS[q][k];O.p.push(x+0.5+(c[0]-0.5)*0.9,y+c[1]*(b.climb?1:0.9),z+0.5+(c[2]-0.5)*0.9);pushUV(O.u,t,CUV[k][0],CUV[k][1]);O.l.push(L);O.b.push(B);O.a.push(b.climb?0.92:c[1]?0.93:0.92);} // tops sway (rope hangs still)
        O.i.push(base,base+1,base+2,base+2,base+1,base+3,base,base+2,base+1,base+2,base+3,base+1);}
      continue;
    }
    const tL=b.emit?1:sky(x,y,z),tB=b.emit?2:bl(x,y,z); // torch and sconce shapes: full bright when lit, lit by their cell when cold
    if(b.sconce){
      let ox=0,oz=0;if(OPQ[get(x+1,y,z)])ox=1;else if(OPQ[get(x-1,y,z)])ox=-1;else if(OPQ[get(x,y,z+1)])oz=1;else if(OPQ[get(x,y,z-1)])oz=-1;
      const bx=x+0.5+ox*0.3,bz=z+0.5+oz*0.3;
      const box=(x0,y0,z0,x1,y1,z1,t,top8)=>{for(const F of FACES){const base=O.p.length/3,top=F.d[1]!==0;
        for(const c of F.c){O.p.push(c[0]?x1:x0,c[1]?y1:y0,c[2]?z1:z0);pushUV(O.u,t,top8?(7+c[3]*2)/16:c[3],top?(top8?(8+c[4]*2)/16:c[4]):(top8?c[4]*10/16:c[4]));O.l.push(tL);O.b.push(tB);O.a.push(1);}
        O.i.push(base,base+1,base+2,base+2,base+1,base+3);}};
      box(bx-1/16,y+0.2,bz-1/16,bx+1/16,y+0.82,bz+1/16,b.t[0],true);
      box(x+0.5+ox*0.42-(oz?0.12:0.04),y+0.15,z+0.5+oz*0.42-(ox?0.12:0.04),x+0.5+ox*0.42+(oz?0.12:0.04),y+0.32,z+0.5+oz*0.42+(ox?0.12:0.04),71,false);
      continue;
    }
    if(b.torch){
      const t=b.t[0];
      for(const F of FACES){const base=O.p.length/3,top=F.d[1]!==0;
        for(const c of F.c){O.p.push(x+7/16+c[0]*2/16,y+c[1]*10/16,z+7/16+c[2]*2/16);pushUV(O.u,t,(7+c[3]*2)/16,top?(8+c[4]*2)/16:c[4]*10/16);O.l.push(tL);O.b.push(tB);O.a.push(1);}
        O.i.push(base,base+1,base+2,base+2,base+1,base+3);}
      continue;
    }
    const isW=id===WATER,M=isW?Wt:O;
    const drop=isW?wDrop(x,y,z):0;
    for(let f=0;f<6;f++){
      const F=FACES[f],d=F.d,nx=x+d[0],ny=y+d[1],nz=z+d[2],nid=gid(nx,ny,nz);
      let draw;
      if(isW)draw=(nid!==WATER&&!OPQ[nid])||(nid===WATER&&!d[1]&&wDrop(nx,ny,nz)>drop+0.01);
      else if(b.opq)draw=!OPQ[nid];
      else draw=!OPQ[nid]&&!(nid===id&&id===GLASS);
      if(!draw)continue;
      const L=b.emit?1:gsky(nx,ny,nz),Bk=b.emit?2:gbl(nx,ny,nz),t=b.t[F.tf],base=M.p.length/3,ao=[3,3,3,3];
      for(let k=0;k<4;k++){
        const c=F.c[k];
        M.p.push(x+c[0],y+c[1]-(c[1]===1?drop:0),z+c[2]);
        pushUV(M.u,t,c[3],c[4]);
        let a=3,vl=L,vb=Bk;
        if(!b.emit&&!isW){
          s1[0]=s1[1]=s1[2]=0;s2[0]=s2[1]=s2[2]=0;
          s1[F.ax[0]]=c[F.ax[0]]?1:-1;s2[F.ax[1]]=c[F.ax[1]]?1:-1;
          const ax=nx+s1[0],ay=ny+s1[1],az=nz+s1[2],bx2=nx+s2[0],by2=ny+s2[1],bz2=nz+s2[2],qx=ax+s2[0],qy=ay+s2[1],qz=az+s2[2];
          const ia=gid(ax,ay,az),ib=gid(bx2,by2,bz2),ic=gid(qx,qy,qz);
          const A=ia&&BL[ia].occ?1:0,B=ib&&BL[ib].occ?1:0,C=ic&&BL[ic].occ?1:0;
          let sl=L,sb=Bk,n=1;
          if(!OPQ[ia]){sl+=gsky(ax,ay,az);sb+=gbl(ax,ay,az);n++;}
          if(!OPQ[ib]){sl+=gsky(bx2,by2,bz2);sb+=gbl(bx2,by2,bz2);n++;}
          if(!(OPQ[ia]&&OPQ[ib])&&!OPQ[ic]){sl+=gsky(qx,qy,qz);sb+=gbl(qx,qy,qz);n++;}
          vl=sl/n;vb=sb/n;
          a=(A&&B)?0:3-A-B-C;
        }
        ao[k]=a;const v=F.s*AOF[a];M.l.push(vl*v);M.b.push(b.emit?(id===LAVA?3:2):vb*v);M.a.push(v);
      }
      if(ao[0]+ao[3]>ao[1]+ao[2])M.i.push(base,base+1,base+2,base+2,base+1,base+3);
      else M.i.push(base,base+1,base+3,base,base+3,base+2);
    }
  }
  // above ground, a dark floor across the chunk where meshing stops: a deep shaft or hole shows darkness there, not the sky behind
  if(MB.surf&&yfl>MB.lo){const t=BL[DEEP].t[0],base=O.p.length/3,F=FACES[3];
    for(const c of F.c){O.p.push(x0+c[0]*CS,yfl,z0+c[2]*CS);pushUV(O.u,t,c[3],c[4]);O.l.push(0);O.b.push(0);O.a.push(1);}
    O.i.push(base,base+1,base+2,base+2,base+1,base+3);}
  const ci=cx+cz*NCX,old=chunks[ci];
  if(old){for(const m of old){scene.remove(m);m.geometry.dispose();}}
  const meshes=[];
  for(const [m,mt] of [[O,matO],[Wt,matW]]){if(!m.p.length)continue;const mesh=new THREE.Mesh(mkGeo(m),mt);mesh.matrixAutoUpdate=false;scene.add(mesh);meshes.push(mesh);}
  chunks[ci]=meshes;
}

