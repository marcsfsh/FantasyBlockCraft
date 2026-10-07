// ---- Paved roads between neighbouring towns, raised over valleys and water
const roadCache=new Map();
function makeRoad(a,b,ax,r,sg){
  sg=sg||1;
  const A=ax==='x'?[a.cx+sg*(a.R+1),a.cz]:[a.cx,a.cz+sg*(a.R+1)],B=ax==='x'?[b.cx-sg*(b.R+1),b.cz]:[b.cx,b.cz-sg*(b.R+1)];
  const dv=ax==='x'?[sg,0]:[0,sg],A2=[A[0]+dv[0]*14,A[1]+dv[1]*14],B2=[B[0]-dv[0]*14,B[1]-dv[1]*14];
  const len0=Math.hypot(B2[0]-A2[0],B2[1]-A2[1])||1,nx=-(B2[1]-A2[1])/len0,nz=(B2[0]-A2[0])/len0,off=(r()-.5)*Math.min(70,len0*0.35);
  const M=[(A2[0]+B2[0])/2+nx*off,(A2[1]+B2[1])/2+nz*off],pts=[A,A2,M,B2,B],cum=[0];
  for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
  const L=cum[cum.length-1],n=Math.ceil(L/4)+1,prof=new Float32Array(n);
  const ptAt=s=>{let i=1;while(i<pts.length-1&&cum[i]<s)i++;const f=(s-cum[i-1])/Math.max(1e-6,cum[i]-cum[i-1]);return[pts[i-1][0]+(pts[i][0]-pts[i-1][0])*f,pts[i-1][1]+(pts[i][1]-pts[i-1][1])*f];};
  for(let i=0;i<n;i++){const p=ptAt(Math.min(L,i*4));{const q=colInfo(Math.round(p[0]),Math.round(p[1]),T4);prof[i]=Math.max(SEA+2,q.h,q.lake?q.lake+2:0);}}
  const fix=i=>i*4<=6?a.g0:i*4>=L-6?b.g0:null;
  for(let pass=0;pass<3;pass++){const c=prof.slice();for(let i=0;i<n;i++){if(fix(i)!==null){prof[i]=fix(i);continue;}let s2=0,m=0;for(let k=-4;k<=4;k++){const j=Math.max(0,Math.min(n-1,i+k));s2+=c[j];m++;}prof[i]=s2/m;}}
  for(let i=1;i<n;i++)prof[i]=Math.max(prof[i-1]-1,Math.min(prof[i-1]+1,prof[i]));
  for(let i=n-2;i>=0;i--)prof[i]=Math.max(prof[i+1]-1,Math.min(prof[i+1]+1,prof[i]));
  for(let i=0;i<n;i++)prof[i]=Math.max(SEA+2,Math.round(prof[i]));
  let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;for(const p of pts){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);z0=Math.min(z0,p[1]);z1=Math.max(z1,p[1]);}
  return{pts:pts,cum:cum,prof:prof,box:[x0-4,z0-4,x1+4,z1+4]};
}
function nearestTown(RX,RZ){
  const a=townPlan(RX,RZ);if(!a)return null;let best=null,bd=1000;
  for(let x=RX-2;x<=RX+2;x++)for(let z=RZ-2;z<=RZ+2;z++){if(x===RX&&z===RZ)continue;const t=townPlan(x,z);if(!t)continue;const d=Math.hypot(t.cx-a.cx,t.cz-a.cz);if(d<bd){bd=d;best={t:t,RX:x,RZ:z};}}
  return best;
}
function regionRoads(RX,RZ){return [];
  const key=ckey(RX,RZ);if(roadCache.has(key))return roadCache.get(key);
  const list=[],a=townPlan(RX,RZ);
  if(a){
    const nb=nearestTown(RX,RZ);
    if(nb){const back=nearestTown(nb.RX,nb.RZ),mutual=back&&back.RX===RX&&back.RZ===RZ;
      if(!mutual||ckey(RX,RZ)<ckey(nb.RX,nb.RZ)){const b=nb.t,dx=b.cx-a.cx,dz=b.cz-a.cz,ax=Math.abs(dx)>=Math.abs(dz)?'x':'z';list.push(makeRoad(a,b,ax,rngAt(RX,41,RZ),ax==='x'?Math.sign(dx):Math.sign(dz)));}}
  }
  roadCache.set(key,list);return list;
}
const RINFO={d:0,s:0,deck:0};
function roadAt(X,Z,maxd){return false;
  const rx=Math.floor(X/TR),rz=Math.floor(Z/TR);let best=maxd||2.6,found=null;
  for(let RX=rx-2;RX<=rx+2;RX++)for(let RZ=rz-2;RZ<=rz+2;RZ++)for(const rd of regionRoads(RX,RZ)){
    if(X<rd.box[0]||X>rd.box[2]||Z<rd.box[1]||Z>rd.box[3])continue;
    for(let i=1;i<rd.pts.length;i++){
      const p=rd.pts[i-1],q=rd.pts[i],vx=q[0]-p[0],vz=q[1]-p[1],l2=vx*vx+vz*vz||1;
      let u=((X+.5-p[0])*vx+(Z+.5-p[1])*vz)/l2;u=Math.max(0,Math.min(1,u));
      const d=Math.hypot(X+.5-p[0]-vx*u,Z+.5-p[1]-vz*u);
      if(d<best){best=d;const s=rd.cum[i-1]+u*Math.sqrt(l2),f=s/4,i0=Math.min(rd.prof.length-1,Math.floor(f)),i1=Math.min(rd.prof.length-1,i0+1);
        RINFO.d=d;RINFO.s=s;RINFO.deck=Math.round(rd.prof[i0]+(rd.prof[i1]-rd.prof[i0])*(f-i0));found=RINFO;}
    }
  }
  return found;
}
function applyRoads(){
  for(let lz=0;lz<CS;lz++)for(let lx=0;lx<CS;lx++){
    const X=gx0+lx,Z=gz0+lz;if(townAt(X,Z,1))continue;
    const ri=roadAt(X,Z);if(!ri)continue;
    const D=ri.deck,edge=ri.d>1.5,rail=ri.d>2.0;
    for(let y=D+1;y<=D+5;y++)PW(X,y,Z,AIR,MODE_SET);
    PW(X,D,Z,edge?COBBLE:SBRICK,MODE_SET);
    let gap=0;for(let y=D-1;y>0;y--){const c=GW(X,y,Z);if(c<0||SOLID[c])break;gap++;if(gap>60)break;}
    if(gap<=3)for(let k=1;k<=gap;k++)PW(X,D-k,Z,COBBLE,MODE_SET);
    else if(Math.floor(ri.s)%12<2)for(let k=1;k<=gap;k++)PW(X,D-k,Z,SBRICK,MODE_SET);
    else PW(X,D-1,Z,SBRICK,MODE_SET);
    if(rail){
      if(Math.floor(ri.s)%36===0){for(let y=D+1;y<=D+3;y++)PW(X,y,Z,SBRICK,MODE_SET);PW(X,D+4,Z,LANTERN,MODE_SET);}
      else if(gap>=2)PW(X,D+1,Z,COBBLE,MODE_SET);
    }
  }
}
function spikeP(X,Z,g,r){
  const h=8+(r()*10|0),r0=1+r()*1.4;
  for(let k=0;k<h&&g+1+k<H-1;k++){const rr=r0*(1-k/h)+0.4;for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)if(Math.hypot(dx,dz)<=rr)PW(X+dx,g+1+k,Z+dz,ICE,MODE_SET);}
}
function dungeonP(X,y,Z,r){
  for(let dx=-3;dx<=3;dx++)for(let dy=0;dy<=5;dy++)for(let dz=-3;dz<=3;dz++){
    const wall=Math.abs(dx)===3||Math.abs(dz)===3||dy===0||dy===5,m=r()<.5;
    PW(X+dx,y+dy,Z+dz,wall?(m?MOSSY:COBBLE):AIR,MODE_SET);
  }
  PW(X,y+5,Z,GLOW,MODE_SET);PW(X+2,y+1,Z+2,CRATE,MODE_SET);PW(X-2,y+1,Z+2,TNT,MODE_SET);PW(X-2,y+1,Z-2,CRATE,MODE_SET);PW(X+2,y+1,Z-2,BOOKS,MODE_SET);
}
function flatOK(X,Z,g){for(let dx=-3;dx<=3;dx+=3)for(let dz=-3;dz<=3;dz+=3){if(!dx&&!dz)continue;if(Math.abs(colInfo(X+dx,Z+dz,T3).h-g)>2)return false;}return true;}
