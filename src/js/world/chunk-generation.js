const ORE_SPAN=382; // ore veins fall in y 1 to 382, as before the world grew to 512
// Features rooted in world chunk (WCX,WCZ); only the parts landing in the target chunk are written
function veinP(x,y,z,t,n,r,ok){
  const a=r()*Math.PI,dx=Math.sin(a)*n/8,dz=Math.cos(a)*n/8,dy=(r()-0.5)*2;
  const ext=Math.abs(dx)+n/16+2;if(x+ext<gx0||x-ext>=gx0+CS||z+Math.abs(dz)+n/16+2<gz0||z-Math.abs(dz)-n/16-2>=gz0+CS){for(let k=0;k<=n;k++)r();return;} // nothing of it lands in this chunk: keep the random sequence, skip the work
  for(let k=0;k<=n;k++){
    const f=k/n,px=x+dx*(1-2*f),py=y+dy*(1-2*f),pz=z+dz*(1-2*f),rad=((Math.sin(f*Math.PI)+1)*r()*n/16+1)/2;
    if(!ok)continue;
    const R=Math.ceil(rad);
    for(let ix=-R;ix<=R;ix++)for(let iy=-R;iy<=R;iy++)for(let iz=-R;iz<=R;iz++){
      const X=Math.floor(px)+ix,Y=Math.floor(py)+iy,Z=Math.floor(pz)+iz;
      const ddx=(X+.5-px)/rad,ddy=(Y+.5-py)/rad,ddz=(Z+.5-pz)/rad;if(ddx*ddx+ddy*ddy+ddz*ddz<1)PW(X,Y,Z,t,MODE_STONE);
    }
  }
}
function features(WCX,WCZ,self){
  const X0=WCX*CS,Z0=WCZ*CS,r=rngAt(WCX,11,WCZ);
  // Ore veins
  for(let v=0;v<48;v++){
    let x=X0+(r()*CS|0),y=1+(r()*ORE_SPAN|0),z=Z0+(r()*CS|0);const t0=r();let t,n,ok=true;
    if(t0<.5){t=COAL;n=10;ok=y>=90;}else if(t0<.78){ok=y<=260;t=IRON;n=7;}else if(t0<.92){ok=y<=150;t=GOLD;n=6;}else{ok=y<=70;t=DIAMOND;n=5;}
    veinP(x,y,z,t,n,r,ok);
  }
  const r3=rngAt(WCX,16,WCZ);
  for(let v=0;v<36;v++){
    let x=X0+(r3()*CS|0),y=1+(r3()*ORE_SPAN|0),z=Z0+(r3()*CS|0);const t0=r3();let t,n,ok;
    if(t0<.34){t=COPO;n=9;ok=y<=290;}else if(t0<.56){t=TINO;n=7;ok=y<=270;}else if(t0<.76){t=ZINO;n=7;ok=y<=240;}else if(t0<.9){t=PLATO;n=4;ok=y<=100;}else{t=TITO;n=4;ok=y<=60;}
    veinP(x,y,z,t,n,r3,ok);
  }
  // pockets of dirt and gravel give the rock some texture
  const r4=rngAt(WCX,17,WCZ);
  for(let v=0;v<14;v++){const x=X0+(r4()*CS|0),y=8+(r4()*(SEA-30)|0),z=Z0+(r4()*CS|0),t=r4()<0.5?DIRT:GRAVEL;veinP(x,y,z,t,22,r4,true);}
  if(mineZone(WCX,WCZ)){const r5=rngAt(WCX,18,WCZ);for(let v=0;v<14;v++){const x=X0+(r5()*CS|0),y=14+(r5()*44|0),z=Z0+(r5()*CS|0),t0=r5(),t=t0<0.3?IRON:t0<0.55?GOLD:t0<0.7?PLATO:t0<0.85?TITO:t0<0.93?DIAMOND:COPO;veinP(x,y,z,t,6+(r5()*5|0),r5,true);}}
  // the odd mossy boulder on open ground
  for(let lz=0;lz<CS;lz++)for(let lx=0;lx<CS;lx++){
    const X=X0+lx,Z=Z0+lz,bq=hsh(X,19,Z);if(bq>=0.008)continue;
    colInfo(X,Z,T2);if(bq>=(T2.b===4?0.008:T2.b===7?0.004:0.0022))continue;const tb=topBlock(T2);if(![GRASS,SNOWG,SAND].includes(tb)||T2.h<=SEA+1||carved(X,T2.h,Z,T2))continue;
    const br=rngAt(X,20,Z),rad=1.1+br()*0.9+(T2.b===4?0.9:0),m=tb===SAND?SANDSTONE:null;
    for(let dx=-2;dx<=2;dx++)for(let dy=0;dy<=2;dy++)for(let dz=-2;dz<=2;dz++){if(Math.hypot(dx,dy*1.2,dz)>rad)continue;const q=br();PW(X+dx,T2.h+dy,Z+dz,m||(q<0.45?MOSSY:q<0.8?COBBLE:STONE),MODE_SET);}
  }
  // barrows and standing stones, long forgotten
  {const q=hsh(WCX,6001,WCZ);if(q<0.3){const cx=X0+8,cz=Z0+8;colInfo(cx,cz,T2);
    if((T2.b===7||(T2.b===4&&q<0.1)||(T2.b===10&&q<0.05))&&!T2.wet&&!carved(cx,T2.h,cz,T2)){const rr=rngAt(WCX,6002,WCZ),hh=T2.h;if(q<0.14&&T2.b===7)barrowP(cx,hh,cz,rr);else stoneRingP(cx,hh,cz,rr);}}}
  // Trees on the ground and on sky islands
  for(let lz=0;lz<CS;lz++)for(let lx=0;lx<CS;lx++){
    const X=X0+lx,Z=Z0+lz,hv=hsh(X,1,Z);if(hv>=0.08)continue;
    colInfo(X,Z,T2);const b=T2.b,h=T2.h,tr2=rngAt(X,3,Z);
    const clear=h+12<H&&!carved(X,h,Z,T2),top=topBlock(T2);
    if(clear){
      if(b===5||b===6){if((top===GRASS||top===SNOWG)&&hv<(b===6?0.03:0.012))spruceP(X,h+1,Z,tr2,b===6||top===SNOWG);}
      else if(top===GRASS&&b===8){if(hv<0.012+0.043*T2.sw){jungleP(X,h+1,Z,tr2);for(let k=0;k<3;k++){const a=tr2()*6.28,d=1+tr2()*2;PW(X+Math.round(Math.cos(a)*d),h+4+(tr2()*5|0),Z+Math.round(Math.sin(a)*d),COBWEB,MODE_AIR);}}else bushP(X,h+1,Z);}
      else if(top===GRASS&&hv<0.04){const td=(b===2||b===3)?(0.003+0.037*T2.fwd)*(1-T2.pw)*(1-T2.dw*0.8):b===10?0.0011+0.006*(1-T2.pw):b===4?0.0008+0.004*(1-T2.dw):b===7?0.001:b===11?0.004:0;
        if(hv<td){if(T2.sw>0.25&&hsh(X,3,Z)<T2.sw)jungleP(X,h+1,Z,tr2);else if(b===11)willowP(X,h+1,Z,tr2);else if(b===3&&hsh(X,2,Z)<0.15)treeP(X,h+1,Z,BIRCH,BLEAVES,5,tr2);else if((b===3&&hsh(X,4,Z)<0.35)||(b===10&&hsh(X,4,Z)<0.4))bigOakP(X,h+1,Z,tr2);else treeP(X,h+1,Z,LOG,LEAVES,4,tr2);}
        else if((b===2||b===3)&&hv<td+0.004)leafBushP(X,h+1,Z,tr2);}
    }
  }
  // Structures
  const sr=r(),sx=X0+3+(r()*10|0),sz=Z0+3+(r()*10|0),dr=r(),dy=106+(r()*90|0),dx2=X0+4+(r()*8|0),dz2=Z0+4+(r()*8|0);
  colInfo(sx,sz,T2);const g=T2.h,b=T2.b;
  if(g>SEA+1&&g+20<H&&!carved(sx,g,sz,T2)){
    if((b===2||b===3)&&sr<0.05&&flatOK(sx,sz,g))towerP(sx,sz,g,rngAt(sx,12,sz));
    else if(b===4&&sr<0.06&&flatOK(sx,sz,g))wellP(sx,sz,g);
    else if(b===6&&sr<0.25)spikeP(sx,sz,g,rngAt(sx,13,sz));
  }
  if(dr<0.2&&colInfo(dx2,dz2,T2).h-dy>=12&&!(ruinZone(Math.floor(dx2/CS),Math.floor(dz2/CS))&&dy>=RUIN_Y[0]-12&&dy<=RUIN_Y[1]+16))dungeonP(dx2,dy,dz2,rngAt(dx2,14,dz2));
  if(!self)return;
  // Moss, obsidian and crystals only touch the chunk itself
  const r2=rngAt(WCX,15,WCZ);
  caveLife(X0,Z0,r2);
}
function plants(WCX,WCZ){
  for(let lz=0;lz<CS;lz++)for(let lx=0;lx<CS;lx++){
    const X=WCX*CS+lx,Z=WCZ*CS+lz,x=X-OX,z=Z-OZ,ci=x+W*z,g=ground[ci],b=biome[ci];
    if(g+12<H&&world[I(x,g+1,z)]===AIR){
      const top=world[I(x,g,z)],r=hsh(X,5,Z);
      if(top===GRASS&&b!==5&&b!==6){colInfo(X,Z,TP);
        const heath=b===4?1:Math.max(0,(TP.dw-0.2)*1.6),reed=b===11?1:Math.max(0,(TP.fen-0.25)*1.6),dark=b===8?1:Math.max(0,(TP.sw-0.25)*1.6);
        let acc=0,id=0;for(const [pp,k] of [[0.24*heath,HEATHER],[0.07*heath,DBUSH],[0.42*reed,TGRASS],[0.05*reed,DBUSH],[0.012*dark,GLOWSHROOM],[0.09*dark,DBUSH],[b===3?0.05*TP.fwd:0,DBUSH]]){acc+=pp;if(r<acc){id=k;break;}}
        if(id)world[I(x,g+1,z)]=id;
        else if(b===2&&TP.fwd<0.4&&Math.abs(fbm2(X/46,Z/46,1,4201.1))<0.011){world[I(x,g+1,z)]=LEAVES;if(r<0.7&&g+2<H)world[I(x,g+2,z)]=LEAVES;} // hedgerows
        else if(b!==10&&b!==4&&b!==11&&b!==8){
          const fade=(1-TP.pw)*(1-heath)*(1-reed),thick=0.45+1.1*(0.5+fbm2(X/20,Z/20,1,1907.7)),gr=(b===2?0.16:b===3?0.08:0.07)*thick*fade,meadow=b===2&&fbm2(X/14,Z/14,1,1901.3)>0.2&&r<0.3*fade;
          const kind=hsh(Math.floor(X/12),1903,Math.floor(Z/12))<0.5?FLOWR:FLOWY;
          if(meadow)world[I(x,g+1,z)]=kind;else if(r<gr)world[I(x,g+1,z)]=TGRASS;else if(r<gr+0.006*fade)world[I(x,g+1,z)]=hsh(X,6,Z)<.5?FLOWR:FLOWY;}}
    }
  }
}
function genChunk(lcx,lcz){
  genDone[lcx+lcz*NCX]=1;
  const WCX=OX/CS+lcx,WCZ=OZ/CS+lcz;gx0=WCX*CS;gz0=WCZ*CS;
  for(let z=0;z<CS;z++)for(let x=0;x<CS;x++){colInfo(gx0+x,gz0+z,T);fillCol(lcx*CS+x,lcz*CS+z,gx0+x,gz0+z,T);}
  deepCaves(lcx,lcz);applyWorms(WCX,WCZ);applyShafts(WCX,WCZ);applyPOIs(WCX,WCZ);genLit=holdNear(WCX,WCZ).inhabited;applyMines(WCX,WCZ);applyRuins(WCX,WCZ);genLit=false;
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)features(WCX+a,WCZ+b,a===0&&b===0);
  plants(WCX,WCZ);
  const m=editsByChunk.get(ckey(WCX,WCZ));
  if(m)m.forEach((v,k)=>{const i=keyToI(k);if(i<0)return;if(v>100&&v<108){world[i]=WATER;lvl[i]=v-100;}else if(BL[v]){world[i]=v;lvl[i]=0;}const t=(i/W)|0;wakeWater(i%W,(t/D)|0,t%D);}); // water next to a player change flows again
  for(let z=0;z<CS;z++)for(let x=0;x<CS;x++){
    const lx=lcx*CS+x,lz=lcz*CS+z;calcHM(lx,lz);
    for(let y=0;y<H;y++){const i=I(lx,y,lz);if(world[i]===TORCH)torches.add(i);else if(isFarm(world[i]))farms.add(i);}
  }
}
const roof=id=>id&&OPQ[id]&&!BL[id].leaf&&id!==LAVA;
function calcHM(x,z){
  let y=H-1;for(;y>=0;y--)if(roof(world[I(x,y,z)]))break;
  const ci=x+W*z;hm[ci]=y;hg[ci]=-1;if(y<0){hb[ci]=0;return;}
  let b=y;while(b>0&&roof(world[I(x,b-1,z)]))b--;hb[ci]=b;
  // A thin slab with a tall open gap under it (a sky island) only casts a soft shadow
  if(y-b+1<=14){let g=b-1;while(g>=0&&!roof(world[I(x,g,z)]))g--;if(b-1-g>=10)hg[ci]=g;}
}
function sky(x,y,z){
  if(x<0||z<0||x>=W||z>=D)return 1;
  const ci=x+W*z,h=hm[ci];if(y>h)return 1;
  const g=hg[ci];
  if(g>=0&&y<hb[ci]){if(y>g)return 0.74;const v=(1-(g-y)*0.13)*0.74;return v<0.08?0.08:v;}
  const v=1-(h-y)*0.13;return v<0.08?0.08:v;
}
const LCURVE=new Float32Array(16);for(let i=1;i<16;i++)LCURVE[i]=Math.pow(0.84,15-i);
function bl(x,y,z){if(x<0||z<0||y<0||x>=W||z>=D||y>=H)return 0;return LCURVE[BLK[x+W*(z+D*y)]];}

