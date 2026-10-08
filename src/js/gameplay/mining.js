// ---- Survival mining: hold to break, time from hardness and pickaxe tier, drops only with a good enough pickaxe
function mineInfo(id,tool){
  const b=BL[id];if(!b||b.hard<0)return null;
  const it=ITEMS[tool],pick=it&&it.pick,hardMat=b.mat==='stone'||b.mat==='ore'||b.mat==='metal';
  let speed=pick&&hardMat?it.speed:1,tier=pick?it.tier:0;
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
  mineTk-=dt;
  if(mineTk<=0){mineTk=0.24;swing=1;breakFx(hit.x,hit.y,hit.z,hit.id,2);const sd=SND[BL[hit.id].snd]||SND.stone;burst(0.05,'bandpass',sd[0]*0.8,sd[1],0.12);}
  if(mineP>=1){
    breakFx(hit.x,hit.y,hit.z,hit.id,BL[hit.id].cross?6:16);sfxBlock(hit.id,false);buzz(10);
    const id=hit.id;setBlock(hit.x,hit.y,hit.z,AIR);exh+=0.005;if(BL[id].hard>0)wearHeld(1);
    if(info.drop){let lost=0;for(const [d,n] of dropsFor(id)){lost+=addItem(d,n);showName('+'+n+' '+nameOf(d));}if(lost)toast('Inventory full');drawBar(true);}
    else if(BL[id].tier>0)toast('This needs a better pickaxe');
    mineI=-1;mineP=0;crack.visible=false;return;
  }
  crack.visible=true;crack.position.set(hit.x+.5,hit.y+.5,hit.z+.5);crack.material.opacity=0.2+mineP*0.65;
  const stage=Math.min(3,Math.floor(mineP*4));if(crack.material.map!==crackTex[stage]){crack.material.map=crackTex[stage];crack.material.needsUpdate=true;}
}
