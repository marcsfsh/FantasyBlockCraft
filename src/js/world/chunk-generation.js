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
function features(WCX,WCZ,self,noLife){
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
  // boulders and tors where the land is rocky: the moors, the mountains and steep slopes; rare on gentle ground (Q93)
  for(let lz=0;lz<CS;lz++)for(let lx=0;lx<CS;lx++){
    const X=X0+lx,Z=Z0+lz,bq=hsh(X,19,Z);if(bq>=0.008)continue;
    colInfo(X,Z,T2);if(bq>=(T2.b===4?0.008:T2.b===5?0.004:T2.b===7?0.0012:slopeAt(X,Z,T2.h)>=2?0.0015:0.0002))continue;const tb=topBlock(T2);if(![GRASS,SNOWG,SAND].includes(tb)||T2.h<=SEA+1||carved(X,T2.h,Z,T2)||surfTaken(X,Z))continue;
    const br=rngAt(X,20,Z),rad=1.1+br()*0.9+(T2.b===4?0.9:0),m=tb===SAND?SANDSTONE:null;
    for(let dx=-2;dx<=2;dx++)for(let dy=0;dy<=2;dy++)for(let dz=-2;dz<=2;dz++){if(Math.hypot(dx,dy*1.2,dz)>rad)continue;const q=br();PW(X+dx,T2.h+dy,Z+dz,m||(q<0.45?MOSSY:q<0.8?COBBLE:STONE),MODE_SET);}
  }
  // barrows and standing stones, long forgotten: on the Barrow Hills, in clusters (Q94)
  {const bw=barrowAt(WCX,WCZ);if(bw){const rr=rngAt(WCX,6002,WCZ);if(bw.ring)stoneRingP(bw.X,bw.h,bw.Z,rr,bw.sz);else barrowP(bw.X,bw.h,bw.Z,rr,bw);}}
  // Trees on the ground and on sky islands
  for(let lz=0;lz<CS;lz++)for(let lx=0;lx<CS;lx++){
    const X=X0+lx,Z=Z0+lz,hv=hsh(X,1,Z);if(hv>=0.08)continue;
    colInfo(X,Z,T2);const b=T2.b,h=T2.h,tr2=rngAt(X,3,Z);
    const clear=h+12<H&&!carved(X,h,Z,T2)&&!surfTaken(X,Z,3),top=topBlock(T2);
    if(clear){
      // groves and clearings (Q95): trees gather where the grove field is high, thicker in valleys and by water, thinner on steep slopes
      const G=sstep(-0.2,0.25,fbm2(X/70,Z/70,2,4801.3)),grv=(b===3||b===8?0.55+0.8*G:0.15+1.7*G)*(T2.bank||h<SEA+6?1.4:1)*(slopeAt(X,Z,h)>=3?0.4:1);
      if(b===5||b===6){if((top===GRASS||top===SNOWG)&&hv<(b===6?0.03:0.012)*grv)spruceP(X,h+1,Z,tr2,b===6||top===SNOWG);}
      else if(top===GRASS&&b===8){if(hv<0.012+0.043*T2.sw){jungleP(X,h+1,Z,tr2);for(let k=0;k<3;k++){const a=tr2()*6.28,d=1+tr2()*2;PW(X+Math.round(Math.cos(a)*d),h+4+(tr2()*5|0),Z+Math.round(Math.sin(a)*d),COBWEB,MODE_AIR);}}else bushP(X,h+1,Z);}
      else if(top===GRASS&&hv<0.06){const td=((b===2||b===3)?(0.003+0.037*T2.fwd)*(1-T2.pw)*(1-T2.dw*0.8):b===10?0.0011+0.006*(1-T2.pw):b===4?0.0008+0.004*(1-T2.dw):b===7?0.001:b===11?0.004:0)*grv;
        if(hv<td){if(T2.sw>0.25&&hsh(X,3,Z)<T2.sw)jungleP(X,h+1,Z,tr2);else if(b===11)willowP(X,h+1,Z,tr2);else if(b===3&&hsh(X,2,Z)<0.15)treeP(X,h+1,Z,BIRCH,BLEAVES,5,tr2);else if((b===3&&hsh(X,4,Z)<0.35)||(b===10&&hsh(X,4,Z)<0.4))bigOakP(X,h+1,Z,tr2);else treeP(X,h+1,Z,LOG,LEAVES,4,tr2);}
        else if((b===2||b===3)&&hv<td+0.004)leafBushP(X,h+1,Z,tr2);}
    }
  }
  // Structures
  const sr=r(),sx=X0+3+(r()*10|0),sz=Z0+3+(r()*10|0),dr=r(),dy=106+(r()*90|0),dx2=X0+4+(r()*8|0),dz2=Z0+4+(r()*8|0);
  colInfo(sx,sz,T2);const g=T2.h,b=T2.b;
  if(g>SEA+1&&g+20<H&&!carved(sx,g,sz,T2)&&!surfTaken(sx,sz,4)){
    if(b===6&&sr<0.25)spikeP(sx,sz,g,rngAt(sx,13,sz)); // the stray little towers and wells are gone (Q93): ruins on the surface are the named sites
  }
  {const sw=stairwayAt(WCX,WCZ);if(sw)stairwayP(sw,rngAt(WCX,6303,WCZ));}
  {const d=dungeonAt(WCX,WCZ);if(d)dungeonP(d,rngAt(d.X,14,d.Z));} // dr, dy, dx2, dz2 are still drawn above so the stream stays as it was
  if(!self||noLife)return;
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
// Chunk generation is a list of steps, so streaming can spread one chunk over several frames (M3, D-025). Each step works on
// world chunk (WCX,WCZ) at window chunk (lcx,lcz); gx0 and gz0 are set before every step. A step may return false to be called again.
const GEN_STEPS=[
  ...[0,4,8,12].map(z0=>(lcx,lcz)=>{for(let z=z0;z<z0+4;z++)for(let x=0;x<CS;x++){colInfo(gx0+x,gz0+z,T);fillCol(lcx*CS+x,lcz*CS+z,gx0+x,gz0+z,T);}}), // the column fill, four rows at a time
  (lcx,lcz)=>lavaSea(lcx,lcz),
  (lcx,lcz,WCX,WCZ)=>{const rx=Math.floor(WCX/CR),rz=Math.floor(WCZ/CR);let n=0; // cave plans of the regions around, one region at a time
    for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){if(caveBaseC.has(ckey(rx+a,rz+b)))continue;if(++n>1)return false;caveBase(rx+a,rz+b);}},
  ...[0,1,2,3].map(p=>(lcx,lcz,WCX,WCZ)=>carveCaves(WCX,WCZ,p,4)),
  (lcx,lcz,WCX,WCZ)=>caveFormations(WCX,WCZ),
  (lcx,lcz,WCX,WCZ)=>{applyShafts(WCX,WCZ);applyPOIs(WCX,WCZ);applyRemains(WCX,WCZ);},
  (lcx,lcz,WCX,WCZ)=>{genLit=holdNear(WCX,WCZ).inhabited;applyMines(WCX,WCZ);applyRuins(WCX,WCZ);genLit=false;},
  (lcx,lcz,WCX,WCZ)=>{for(let b=-1;b<=1;b++)features(WCX-1,WCZ+b,false);},
  (lcx,lcz,WCX,WCZ)=>{features(WCX,WCZ-1,false);features(WCX,WCZ,true,true);},
  (lcx,lcz,WCX,WCZ)=>caveLife(WCX*CS,WCZ*CS,rngAt(WCX,15,WCZ)), // the chunk's own cave life, in the same place in the order as before
  (lcx,lcz,WCX,WCZ)=>features(WCX,WCZ+1,false),
  (lcx,lcz,WCX,WCZ)=>{for(let b=-1;b<=1;b++)features(WCX+1,WCZ+b,false);},
  (lcx,lcz,WCX,WCZ)=>{applySites(WCX,WCZ);
    // hold gates come last, so no cave, room or ore cuts through the stair (and the ruins' tidy pass never sees it)
    if(gateAt(WCX,WCZ)){genLit=holdNear(WCX,WCZ).inhabited;curI=ruinI(WCX,WCZ);dwGate(gx0+8,gz0+8,rngAt(WCX,1402,WCZ));genLit=false;}},
  (lcx,lcz,WCX,WCZ)=>{drainCaveWater(lcx,lcz);plants(WCX,WCZ);applyRoads(lcx,lcz);
    const m=editsByChunk.get(ckey(WCX,WCZ));
    if(m)m.forEach((v,k)=>{const i=keyToI(k);if(i<0)return;if(v>100&&v<108){world[i]=WATER;lvl[i]=v-100;}else if(BL[v]){world[i]=v;lvl[i]=0;}const t=(i/W)|0;wakeWater(i%W,(t/D)|0,t%D);}); // water next to a player change flows again
    for(let z=0;z<CS;z++)for(let x=0;x<CS;x++){
      const lx=lcx*CS+x,lz=lcz*CS+z;calcHM(lx,lz);
      for(let y=0;y<H;y++){const i=I(lx,y,lz);if(world[i]===TORCH)torches.add(i);else if(isFarm(world[i]))farms.add(i);}
    }}
];
function newGenJob(lcx,lcz){return{cx:lcx,cz:lcz,WCX:OX/CS+lcx,WCZ:OZ/CS+lcz,step:0};}
function genStep(j){gx0=j.WCX*CS;gz0=j.WCZ*CS;if(GEN_STEPS[j.step](j.cx,j.cz,j.WCX,j.WCZ)!==false)j.step++;}
// The whole chunk at once (start-up, travel, tests); the chunk counts as generated only when it is complete
function genChunk(lcx,lcz){const j=newGenJob(lcx,lcz);while(j.step<GEN_STEPS.length)genStep(j);genDone[lcx+lcz*NCX]=1;}
// Underground standing water must lie in a sound basin (D-024, owner's rule): every water block has water or a solid block under
// it and on each side, the block under the water rests on another solid block (or water), and every solid block holding water from
// the side has something under it. Water breaking a rule drains, and the check repeats until nothing changes. The next chunk
// cannot be seen, so water at the chunk's edge drains too, except lakes a cave plan holds in its own hall (plannedWater) and
// on the floors of holds, whose aqueducts and cisterns are walled by the ruins' own tidy pass. Lava outside the holds, their
// mines and the lava sea follows the same rule (Q87).
function drainCaveWater(lcx,lcz){
  const WD=W*D,x0=lcx*CS,z0=lcz*CS,q=[],WCX=OX/CS+lcx,WCZ=OZ/CS+lcz,zone=ruinZone(WCX,WCZ),wild=!zone&&!mineZone(WCX,WCZ);
  for(let z=z0;z<z0+CS;z++)for(let x=x0;x<x0+CS;x++){const g=ground[x+W*z];for(let y=2;y<g-2;y++){const i=I(x,y,z),v=world[i];if(v===WATER||(v===LAVA&&y>FIRE_LV&&wild))q.push(i);}}
  while(q.length){const i=q.pop(),F=world[i];if(F!==WATER&&F!==LAVA)continue;const x=i%W,t=(i/W)|0,z=t%D,y=(t/D)|0;
    // a block is held up when the one under it is solid or the same fluid
    const held=j=>world[j]===F||SOLID[world[j]],rests=j=>j<WD||held(j-WD);
    const sides=[];let edge=false;if(x>x0)sides.push(i-1);else edge=true;if(x<x0+CS-1)sides.push(i+1);else edge=true;if(z>z0)sides.push(i-W);else edge=true;if(z<z0+CS-1)sides.push(i+W);else edge=true;
    const trusted=F===WATER?((zone&&y>=RUIN_Y[0]-7&&y<=RUIN_Y[1]+18)||(edge&&plannedWater(x+OX,y,z+OZ))):plannedLava(x+OX,y,z+OZ);
    const b=i-WD,ok=(F===LAVA&&trusted)||(!(edge&&!trusted)&&held(b)&&(world[b]===F||rests(b))&&sides.every(j=>held(j)&&(world[j]===F||rests(j))));
    if(ok)continue;
    world[i]=AIR;lvl[i]=0;
    // what may have relied on it: fluid above, beside, above-beside, and two above
    for(const j of [i+WD,i+2*WD,...sides,...sides.map(k=>k+WD)])if(j<VOL&&(world[j]===WATER||world[j]===LAVA))q.push(j);}
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
  const s=y>=0?LCURVE[SKL[ci+W*D*y]]:0;
  if(g>=0&&y<hb[ci]){if(y>g)return Math.max(0.74,s);const v=(1-(g-y)*0.13)*0.74;return Math.max(v<0.08?0.08:v,s);}
  const v=1-(h-y)*0.13;return Math.max(v<0.08?0.08:v,s);
}
const LCURVE=new Float32Array(16);for(let i=1;i<16;i++)LCURVE[i]=Math.pow(0.84,15-i);
function bl(x,y,z){if(x<0||z<0||y<0||x>=W||z>=D||y>=H)return 0;return LCURVE[BLK[x+W*(z+D*y)]];}

