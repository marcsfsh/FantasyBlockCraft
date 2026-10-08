// ---- Cave network: dense, multi-level worm tunnels, rooms, caverns with lakes
const wormCache=new Map(),WORM_R=7;
function wormTunnel(x,y,z,width,yaw,pitch,step,len,room,r,out,depth,steepF,lake,stream,base){
  if(len<=0)len=80+(r()*30|0);
  const branch=(r()*len/2+len/4)|0,steep=steepF!==undefined?steepF:r()<0.2;let dyaw=0,dpitch=0;
  if(room)step=len>>1;
  for(;step<len;step++){
    const rh=(base||1.5)+Math.sin(step*Math.PI/len)*width,rv=rh*(room?0.6:0.85);
    const cp=Math.cos(pitch);x+=Math.cos(yaw)*cp;y+=Math.sin(pitch);z+=Math.sin(yaw)*cp;
    pitch*=steep?0.94:0.6;pitch+=dpitch*0.1;yaw+=dyaw*0.1;dpitch*=0.9;dyaw*=0.75;
    dpitch+=(r()-r())*r()*(steep?2.5:1.2);dyaw+=(r()-r())*r()*4;
    if(y<8){y=8;pitch=Math.abs(pitch);}
    if(!room&&step===branch&&width>0.9&&depth<2){
      wormTunnel(x,y,z,r()*0.8+0.7,yaw-Math.PI/2,pitch/3,step,len,false,r,out,depth+1,undefined,false,stream,base);
      wormTunnel(x,y,z,r()*0.8+0.7,yaw+Math.PI/2,pitch/3,step,len,false,r,out,depth+1,undefined,false,stream,base);
      return;
    }
    if(!room&&r()<0.08)continue;
    out.push(x,y,z,rh,rv,lake?1:stream?4:0);
    if(room)break;
  }
}
function wormsFor(WCX,WCZ){
  const key=ckey(WCX,WCZ);let w=wormCache.get(key);if(w)return w;
  if(wormCache.size>8000)wormCache.clear();
  const r=rngAt(WCX,51,WCZ),out=[];
  const bx=WCX*CS,bz=WCZ*CS;
  // [chance, extra sources, lowest y, highest y, tunnel base radius, width min, width range, room chance, big room chance]
  const LAYERS=[[0.9,3,SEA-70,SEA-24,1.15,0.1,0.45,0,0],[0.78,2,205,258,1.5,1.4,2.2,0.42,0.12],[0.6,2,155,202,1.5,0.9,1.6,0.2,0.04],[0.6,2,102,150,1.6,1.2,2.2,0.35,0.08],[0.3,1,58,98,1.4,0.8,1.2,0.1,0],[0.45,1,14,56,1.5,1.0,1.8,0.2,0.1]];
  for(const [ch,mx,yl,yh,base,w0,wr,rc,bc] of LAYERS){
    const n=r()<ch?1+(r()*mx|0):0;
    for(let i=0;i<n;i++){
      const x=bx+r()*CS,y=yl+r()*(yh-yl),z=bz+r()*CS;let tunnels=1+(r()*2|0);const rr=r();
      if(rr<bc){wormTunnel(x,y,z,8+r()*8,0,0,-1,-1,true,r,out,0,false,true,false,base);tunnels+=2+(r()*3|0);}
      else if(rr<bc+rc){wormTunnel(x,y,z,3+r()*6,0,0,-1,-1,true,r,out,0,undefined,false,false,base);tunnels+=1+(r()*3|0);}
      for(let t=0;t<tunnels;t++){const width=w0+r()*wr,steep=r()<0.18,stream=!steep&&y>110&&r()<0.02;
        wormTunnel(x,y,z,width,r()*Math.PI*2,steep?(r()-0.5)*1.4:(r()-0.5)*0.12,0,0,false,r,out,0,steep,false,stream,base);}
    }
  }
  // steep old passages tie the layers together
  if(r()<0.16){const x=bx+r()*CS,z=bz+r()*CS,y=60+r()*(SEA-80);wormTunnel(x,y,z,0.8+r()*0.8,r()*Math.PI*2,(r()<0.5?1:-1)*(0.7+r()*0.5),0,0,false,r,out,0,true,false,false,1.4);}
  if(r()<0.06){const cx=bx+8,cz=bz+8,cy=108+r()*34;out.push(cx,cy,cz,18+r()*10,9+r()*5,3);}
  if(r()<0.004){const cx=WCX*CS+4+r()*8,cz=WCZ*CS+4+r()*8,o=colInfo(Math.floor(cx),Math.floor(cz),{});
    if(!o.lake&&!o.wet&&o.b!==0){let x=cx,z=cz;for(let y=o.h+3;y>212;y-=2){x+=(r()-0.5)*0.8;z+=(r()-0.5)*0.8;out.push(x,y,z,3+r()*1.5,3,2);}}}
  if(r()<0.12)caveMouth(WCX,WCZ,r(),r(),out);
  w=new Float32Array(out);
  let bx0=1e9,bx1=-1e9,bz0=1e9,bz1=-1e9;for(let k=0;k<w.length;k+=6){const rh=w[k+3];if(w[k]-rh<bx0)bx0=w[k]-rh;if(w[k]+rh>bx1)bx1=w[k]+rh;if(w[k+2]-rh<bz0)bz0=w[k+2]-rh;if(w[k+2]+rh>bz1)bz1=w[k+2]+rh;}
  w.bb=[bx0,bx1,bz0,bz1];wormCache.set(key,w);return w;
}
// A point on an ordinary worm cave that starts in chunk (WCX,WCZ), inside the chunk's middle and within a height band, or null.
// A structure that opens onto it is always connected to the caves (Q22, Q24). Pure: chosen by hash among the candidates.
function caveAnchor(WCX,WCZ,y0,y1,salt){
  const w=wormsFor(WCX,WCZ),c=[],x0=WCX*CS,z0=WCZ*CS;
  for(let k=0;k<w.length;k+=6){if(w[k+5]!==0)continue;const x=w[k],y=w[k+1],z=w[k+2];if(y<y0||y>y1||x<x0+2||x>=x0+14||z<z0+2||z>=z0+14)continue;c.push(k);}
  if(!c.length)return null;const k=c[Math.floor(hsh(WCX,salt,WCZ)*c.length)];
  return{x:Math.floor(w[k]),y:Math.floor(w[k+1]),z:Math.floor(w[k+2])};
}
// A cave mouth in a cliff (Q22): a passage enters the steepest slope of the chunk and winds down, one block per step, to a
// worm cave of the same chunk (always connected). Points are kind 2, which may open at the surface.
function caveMouth(WCX,WCZ,q1,q2,out){
  let best=null;for(let k=0;k<5;k++){const X=WCX*CS+3+Math.floor(hsh(WCX*5+k,6201,WCZ)*10),Z=WCZ*CS+3+Math.floor(hsh(WCX*5+k,6202,WCZ)*10),h=hAt(X,Z),s=slopeAt(X,Z,h);if(!best||s>best.s)best={X:X,Z:Z,h:h,s:s};}
  if(best.s<3)return;const o=colInfo(best.X,best.Z,{});if(o.wet||o.lake||o.river||o.b===0||best.h<SEA+6||o.rvBot<999)return;
  let tgt=null;for(let k=0;k<out.length;k+=6){if(out[k+5]!==0)continue;const y=out[k+1];if(y>best.h-30||y<best.h-110||y<20)continue;if(!tgt||Math.abs(y-(best.h-45))<Math.abs(tgt[1]-(best.h-45)))tgt=[out[k],y,out[k+2]];}
  if(!tgt)return;
  // the low side of the cliff: step out from the steep column toward lower ground, then turn into the hill
  let dx=hAt(best.X+3,best.Z)-hAt(best.X-3,best.Z),dz=hAt(best.X,best.Z+3)-hAt(best.X,best.Z-3);const L=Math.hypot(dx,dz)||1;dx/=L;dz/=L;
  let x=best.X+0.5-dx*3,z=best.Z+0.5-dz*3;const h0=hAt(Math.floor(x),Math.floor(z));let y=h0+1.5,yaw=Math.atan2(dz,dx);const turn=q1<0.5?1:-1;
  const st=0.6; // half-block steps keep the floor a smooth ramp a player can walk
  for(let s=0;s<800;s++){
    const tx=tgt[0]-x,tz=tgt[2]-z,hd=Math.hypot(tx,tz),drop=y-tgt[1];
    if(hd<1.5&&drop<1.5)break;
    if(s<14){y-=0.15;}                                         // straight into the hillside first
    else if(drop>hd+2){yaw+=turn*st*(0.06+0.02*Math.sin(s*0.12+q2*6));y-=st*0.85;} // too high above the target: wind down in a loop
    else{yaw=Math.atan2(tz,tx);y-=st*Math.min(0.85,drop/Math.max(1,hd));}          // then head for it, gentler than one block per block
    x+=Math.cos(yaw)*st;z+=Math.sin(yaw)*st;out.push(x,y,z,2.7,2.6,2);
  }
}
function lakeNear(X,Z,Y){for(const d of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]){const lk=lakeAt(X+d[0],Z+d[1]);if(lk&&lk.L>=Y&&Math.hypot(X+d[0]-lk.cx,Z+d[1]-lk.cz)<lk.R+8)return true;}return false;}
function applyWorms(WCX,WCZ){
  const streamCells=[],zoneR=ruinZone(WCX,WCZ);
  const xa=gx0,xb=gx0+CS,za=gz0,zb=gz0+CS,lakes=[];
  for(let a=-WORM_R;a<=WORM_R;a++)for(let b=-WORM_R;b<=WORM_R;b++){
    const w=wormsFor(WCX+a,WCZ+b);
    if(!w.length||w.bb[1]<xa||w.bb[0]>xb||w.bb[3]<za||w.bb[2]>zb)continue;
    for(let k=0;k<w.length;k+=6){
      const x=w[k],y=w[k+1],z=w[k+2],rh=w[k+3],rv=w[k+4];
      if(x+rh<xa||x-rh>xb||z+rh<za||z-rh>zb||y-rv>H-2)continue;
      const kind=w[k+5];if(kind===1||kind===3)lakes.push(k,w);
      const X0=Math.max(xa,Math.floor(x-rh)),X1=Math.min(xb-1,Math.floor(x+rh)),Z0=Math.max(za,Math.floor(z-rh)),Z1=Math.min(zb-1,Math.floor(z+rh));
      const Y0=Math.max(1,Math.floor(y-rv)),Y1=Math.min(H-2,Math.floor(y+rv));
      for(let X=X0;X<=X1;X++){const dx=(X+.5-x)/rh;for(let Z=Z0;Z<=Z1;Z++){
        const dz=(Z+.5-z)/rh;if(dx*dx+dz*dz>=1)continue;
        const lx=X-OX,lz=Z-OZ,ci=lx+W*lz,gh=ground[ci];
        for(let Y=Y0;Y<=Y1;Y++){
          const dy=(Y+.5-y)/rv;if(dy<=-0.7||dx*dx+dy*dy+dz*dz>=1)continue;
          if(Y>gh-7&&!entCol[ci]&&kind!==2)continue;
          if(gh<SEA+2&&Y>gh-5)continue;
          if(kind===3){const px=Math.floor(X/7),pz=Math.floor(Z/7),ox=px*7+1+hsh(px,3201,pz)*5,oz=pz*7+1+hsh(px,3202,pz)*5;if(hsh(px,3203,pz)<0.3&&Math.hypot(X+.5-ox,Z+.5-oz)<1.3+hsh(px,3204,pz))continue;}
          const i=I(lx,Y,lz),id=world[i];
          if(id===AIR||id===BEDROCK||id===WATER||id===LAVA)continue;
          if(Y+1<H&&world[i+W*D]===WATER)continue;
          if(Y>=SEA&&Y>gh-12&&lakeNear(X,Z,Y))continue;
          if(Y>=58&&Y<=DEEP_WL&&(GW(X+1,Y,Z)===WATER||GW(X-1,Y,Z)===WATER||GW(X,Y,Z+1)===WATER||GW(X,Y,Z-1)===WATER))continue; // leave a rock rim around deep lakes and rivers
          if(kind===4&&Y>110&&dy<=-0.7+1.1/rv){world[i]=WATER;lvl[i]=0;streamCells.push(i);}else{world[i]=Y<=FIRE_LV?LAVA:AIR;lvl[i]=0;}
        }
      }}
    }
  }
  if(fbm2((xa+8)/180,(za+8)/180,1,3301.7)>0.42){
    for(let Z=za;Z<zb;Z++)for(let X=xa;X<xb;X++){
      const wt=203+Math.round(Math.max(0,Math.min(1,(fbm2(X/180,Z/180,1,3301.7)-0.46)*4))*10);if(wt<=203)continue;
      const lx=X-OX,lz=Z-OZ,gh=ground[lx+W*lz],top=Math.min(wt,gh-8);
      for(let Y=200;Y<=top;Y++){const i=I(lx,Y,lz);if(world[i]===AIR&&world[i-W*D]!==AIR){world[i]=WATER;lvl[i]=0;}}
    }
  }
  for(let pass=0;pass<3;pass++)for(const i of streamCells)if(world[i]===WATER&&world[i-W*D]===AIR)world[i]=AIR;
  // underground lakes pool on the floors of the big caverns
  for(let q=0;q<lakes.length;q+=2){
    const w=lakes[q+1],k=lakes[q],x=w[k],y=w[k+1],z=w[k+2],rh=w[k+3],rv=w[k+4],top=Math.floor(y-rv*0.25),fluid=y<60&&hsh(Math.floor(x),5,Math.floor(z))<0.5?LAVA:WATER;if(fluid===WATER&&hsh(Math.floor(x),6,Math.floor(z))>0.12)continue; // most caverns stay dry
    for(let X=Math.max(xa,Math.floor(x-rh));X<=Math.min(xb-1,Math.floor(x+rh));X++)for(let Z=Math.max(za,Math.floor(z-rh));Z<=Math.min(zb-1,Math.floor(z+rh));Z++){
      const dx=(X+.5-x)/rh,dz=(Z+.5-z)/rh;if(dx*dx+dz*dz>=0.8)continue;
      const gtop=Math.min(top,ground[(X-OX)+W*(Z-OZ)]-4);for(let Y=Math.max(1,Math.floor(y-rv));Y<=gtop;Y++){const i=I(X-OX,Y,Z-OZ);if(world[i]===AIR&&world[i-W*D]!==AIR){world[i]=fluid;lvl[i]=0;}}
    }
  }
}
