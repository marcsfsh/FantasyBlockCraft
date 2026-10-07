// ---- Power tools: drill (3x3), jackhammer (fast stone) and chainsaw (whole trees)
const LOGSET=new Set([LOG,BIRCH,SPRUCE,JLOG]);
function heldCharge(){const q=inv[sel];return SURV()?(q&&q.e)||0:1e9;}
function useCharge(n){
  if(!SURV())return;const q=inv[sel];if(!q)return;q.e=Math.max(0,(q.e||0)-n);
  if(!q.e)toast('Your '+nameOf(q.id)+' is out of charge. Stand next to a powered charger.');drawBar(true);
}
function giveDrops(id,mx,my,mz){
  if(!SURV())return 0;let lost=0;for(const [d,n] of dropsFor(id))lost+=addItem(d,n);return lost;
}
function powerExtras(hit,id){
  const it=ITEMS[curId()];if(!it||!it.power||heldCharge()<=0)return;
  let lost=0,n=0;
  if(it.power==='drill'){
    const nx=hit.px-hit.x,ny=hit.py-hit.y,nz=hit.pz-hit.z;
    for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){
      if(!a&&!b)continue;
      const X=hit.x+(nx?0:a),Y=hit.y+(ny?0:(nx?a:b)),Z=hit.z+(nz?0:b);
      const c=get(X,Y,Z);if(!c||BL[c].liquid||c===BEDROCK)continue;
      const info=mineInfo(c,curId());if(!info)continue;
      if(Math.random()<0.4)breakFx(X,Y,Z,c,4);setBlock(X,Y,Z,AIR);n++;if(info.drop)lost+=giveDrops(c);
    }
    useCharge(3*(n+1));
  }else if(it.power==='saw'&&LOGSET.has(id)){
    const q=[[hit.x,hit.y,hit.z]],seen=new Set([I(hit.x,hit.y,hit.z)]),logs=[];
    while(q.length&&logs.length<160){
      const [x,y,z]=q.shift();
      for(let dy=0;dy<=1;dy++)for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){
        const X=x+dx,Y=y+dy,Z=z+dz;if(X<0||Z<0||Y>=H||X>=W||Z>=D)continue;const j=I(X,Y,Z);if(seen.has(j))continue;seen.add(j);
        if(LOGSET.has(world[j])){logs.push([X,Y,Z,world[j]]);q.push([X,Y,Z]);}
      }
    }
    for(const [X,Y,Z,c] of logs){setBlock(X,Y,Z,AIR);lost+=giveDrops(c);if(Math.random()<0.3)breakFx(X,Y,Z,c,4);n++;}
    // clear the leaves that belonged to the felled tree
    const lq=logs.map(l=>[l[0],l[1],l[2],0]);let cleared=0;
    while(lq.length&&cleared<500){
      const [x,y,z,d]=lq.shift();if(d>=4)continue;
      for(const F of FACES){const X=x+F.d[0],Y=y+F.d[1],Z=z+F.d[2],c=get(X,Y,Z);if(c&&BL[c].leaf){setBlock(X,Y,Z,AIR);lost+=giveDrops(c);cleared++;lq.push([X,Y,Z,d+1]);}}
    }
    if(n)showName('Felled '+(n+1)+' logs');
    useCharge(n+1);
  }else useCharge(1);
  if(lost)toast('Inventory full');
  drawBar(true);
}
function powerBuzz(){const it=ITEMS[curId()];if(!it||!it.power||heldCharge()<=0)return false;tone(it.power==='saw'?140:it.power==='jack'?70:110,it.power==='saw'?160:90,0.09,0.07,0,'sawtooth');return true;}
function mineInfo(id,tool){
  const b=BL[id];if(!b||b.hard<0)return null;
  const it=ITEMS[tool],pick=it&&it.pick,hardMat=b.mat==='stone'||b.mat==='ore'||b.mat==='metal';
  let speed=pick&&hardMat?it.speed:1,tier=pick?it.tier:0;
  if(it&&it.power){speed=1;tier=0;if(heldCharge()>0){if(it.power==='saw'){if(b.mat==='wood')speed=it.speed;}else{tier=it.tier;if(hardMat)speed=it.speed;else if(it.power==='drill'&&b.mat==='soft')speed=it.speed*0.6;}}}
  const ok=b.tier<=tier;
  return{t:b.hard/speed*(ok?1:3.3),drop:ok};
}
let mineI=-1,mineP=0,mineTk=0;
function mineTick(dt){
  const hit=raycast(eyePos(),camDir(),5);
  if(!hit){mineI=-1;mineP=0;crack.visible=false;return;}
  if(hit.id===TNT){prime(hit.x,hit.y,hit.z,4);hold=-1;crack.visible=false;return;}
  if(hit.id===CRATE||hit.id===DWCHEST||hit.id===BARREL){openCrate(hit.x,hit.y,hit.z);hold=-1;crack.visible=false;return;}
  const i=I(hit.x,hit.y,hit.z);if(i!==mineI){mineI=i;mineP=0;}
  const info=mineInfo(hit.id,curId());if(!info){crack.visible=false;return;}
  mineP+=info.t<=0?1:dt/info.t;
  mineTk-=dt;if(mineTk<=0&&powerBuzz()){mineTk=0.08;breakFx(hit.x,hit.y,hit.z,hit.id,1);}
  if(mineTk<=0){mineTk=0.24;swing=1;breakFx(hit.x,hit.y,hit.z,hit.id,2);const sd=SND[BL[hit.id].snd]||SND.stone;burst(0.05,'bandpass',sd[0]*0.8,sd[1],0.12);}
  if(mineP>=1){
    breakFx(hit.x,hit.y,hit.z,hit.id,BL[hit.id].cross?6:16);sfxBlock(hit.id,false);buzz(10);
    const id=hit.id;setBlock(hit.x,hit.y,hit.z,AIR);exh+=0.005;if(BL[id].hard>0)wearHeld(1);if(info.drop)powerExtras(hit,id);
    if(info.drop){let lost=0;for(const [d,n] of dropsFor(id)){lost+=addItem(d,n);showName('+'+n+' '+nameOf(d));}if(lost)toast('Inventory full');drawBar(true);}
    else if(BL[id].tier>0)toast('This needs a better pickaxe');
    mineI=-1;mineP=0;crack.visible=false;return;
  }
  crack.visible=true;crack.position.set(hit.x+.5,hit.y+.5,hit.z+.5);crack.material.opacity=0.2+mineP*0.65;
  const stage=Math.min(3,Math.floor(mineP*4));if(crack.material.map!==crackTex[stage]){crack.material.map=crackTex[stage];crack.material.needsUpdate=true;}
}
function showName(t){const el=$('name');el.textContent=t;el.style.opacity=1;clearTimeout(nameTimer);nameTimer=setTimeout(()=>{el.style.opacity=0;},1400);}
