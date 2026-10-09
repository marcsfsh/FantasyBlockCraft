// ---- Survival mining: hold to break, time from hardness and the held tool, drops only with a good enough pickaxe
// A tool speeds the materials it is made for (items.js): pickaxe stone, ore and metal; axe wood; shovel earth and sand; shears
// leaves, cloth and soft plants. Only a pickaxe's tier lets ore and stone drop.
function toolFits(it,b){
  if(!it||!it.tool)return false;
  switch(it.tool){case 'pick':return b.mat==='stone'||b.mat==='ore'||b.mat==='metal';case 'axe':return b.mat==='wood';
    case 'shovel':return b.mat==='soft'&&!b.cross&&!b.leaf;case 'shears':return b.leaf||b.mat==='cloth'||(b.cross&&b.mat==='soft');}
  return false;
}
function mineInfo(id,tool){
  const b=BL[id];if(!b||b.hard<0)return null;
  const it=ITEMS[tool],speed=toolFits(it,b)?it.speed:1,tier=it&&it.tool==='pick'?it.tier:0,ok=b.tier<=tier;
  return{t:b.hard/speed*(ok?1:3.3),drop:ok};
}
// The sickle cuts every soft plant within two blocks in one stroke; ripe wheat and potatoes are harvested and replanted
const SICKLE_CUT=new Set([TGRASS,FLOWR,FLOWY,DBUSH,HEATHER,WHEAT,POT3]);
function sickleSweep(cx,cy,cz){
  const out=[];
  for(let y=cy-1;y<=cy+1;y++)for(let z=cz-2;z<=cz+2;z++)for(let x=cx-2;x<=cx+2;x++){const id=get(x,y,z);if(!SICKLE_CUT.has(id))continue;
    const d=dropsFor(id,320);if(id===WHEAT||id===POT3){const seed=id===WHEAT?208:209,q=d.find(e=>e[0]===seed);if(q)q[1]--;setBlock(x,y,z,id===WHEAT?WHEAT0:POT0);}else setBlock(x,y,z,AIR);
    breakFx(x,y,z,id,4);for(const e of d)if(e[1]>0)out.push(e);}
  return out;
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
    const id=hit.id,tool=curId(),sick=ITEMS[tool]&&ITEMS[tool].tool==='sickle'&&SICKLE_CUT.has(id);if(!sick)setBlock(hit.x,hit.y,hit.z,AIR);exh+=0.005;if(BL[id].hard>0||sick)wearHeld(1);
    if(info.drop){let lost=0;const got=sick?sickleSweep(hit.x,hit.y,hit.z):id===ROPE||id===GRAPNEL?ropeTake(id,hit.x,hit.y,hit.z):dropsFor(id,tool);
      for(const [d,n] of got){lost+=addItem(d,n);showName('+'+n+' '+nameOf(d));}if(lost)toast('Inventory full');drawBar(true);}
    else if(BL[id].tier>0)toast('This needs a better pickaxe');
    mineI=-1;mineP=0;crack.visible=false;return;
  }
  crack.visible=true;crack.position.set(hit.x+.5,hit.y+.5,hit.z+.5);crack.material.opacity=0.2+mineP*0.65;
  const stage=Math.min(3,Math.floor(mineP*4));if(crack.material.map!==crackTex[stage]){crack.material.map=crackTex[stage];crack.material.needsUpdate=true;}
}
