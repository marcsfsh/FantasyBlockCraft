// Lava flows like water (D-053): a source spreads up to four blocks on a floor and falls without limit, more slowly than
// water, makes no new sources, draws lower the further it has flowed, and hardens where it meets water: a source into
// obsidian, flowing lava into basalt. Only the player's own source is saved.
while(genQ.length)processGenQ();setMode('survival');
const clearAt=(x,z)=>{const g=ground[x+W*z];if(g<=SEA+2)return false;for(let dx=-7;dx<=7;dx++)for(let dz=-7;dz<=7;dz++)for(let y=g+1;y<=g+10;y++)if(world[I(x+dx,y,z+dz)]!==AIR)return false;return true;};
let x=W/2+4,z=D/2-8;for(let k=0;k<3600&&!clearAt(x,z);k++){x=W/2-30+(k%60);z=D/2-30+Math.floor(k/60);}
assert(clearAt(x,z),'an open spot for the test');
const g=ground[x+W*z],fy=g+5;
// a stone floor seven blocks across, open above
for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++)setBlock(x+dx,fy,z+dz,STONE,true);
const n0=edits.size;setBlock(x,fy+1,z,LAVA,true);wakeWater(x,fy+1,z);
for(let k=0;k<6;k++)flowStep();
let early=0;for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++)if(world[I(x+dx,fy+1,z+dz)]===LAVA)early++;
for(let k=0;k<120;k++)flowStep();
let cells=0,far=0,lv=new Set();for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++){const i=I(x+dx,fy+1,z+dz);if(world[i]!==LAVA)continue;cells++;lv.add(lvl[i]);far=Math.max(far,Math.abs(dx)+Math.abs(dz));}
info('lava after 6 steps',early,'cells; after 126 steps',cells,'cells, reaching',far,'blocks, levels',[...lv].sort().join(' '),'; edits added',edits.size-n0);
assert(early>1&&early<cells,'lava spreads, more slowly than water');
assert(far===4&&cells===41&&lv.size===5&&edits.size===n0+1,'a lava source spreads four blocks across a floor in levels 1 to 4, and only the source is saved');
assert(lDrop(x,fy+1,z)<lDrop(x+3,fy+1,z),'flowed lava lies lower than its source');
// it falls off an edge
setBlock(x+5,fy,z,AIR,true);setBlock(x+4,fy,z,AIR,true);for(let k=0;k<60;k++)flowStep();
let fell=0;for(let y=fy-6;y<=fy;y++)if(world[I(x+4,y,z)]===LAVA)fell++;
assert(fell>=1,'lava falls through a hole in the floor ('+fell+' cells below)');
// water poured beside it hardens it
setBlock(x+2,fy+1,z+3,WATER,true);wakeWater(x+2,fy+1,z+3);for(let k=0;k<30;k++)flowStep();
let hard=0;for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++){const v=world[I(x+dx,fy+1,z+dz)];if(v===BASALT||v===OBSID)hard++;}
info('cells hardened where water met it',hard);
assert(hard>0,'lava meeting water hardens into basalt or obsidian');
// a lava source meeting water becomes obsidian
for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++)setBlock(x+dx,fy+1,z+dz,AIR,true);
setBlock(x,fy+1,z,LAVA,true);setBlock(x+1,fy+1,z,WATER,true);wakeWater(x,fy+1,z);for(let k=0;k<6;k++)flowStep();
assert(world[I(x,fy+1,z)]===OBSID,'a lava source touched by water turns to obsidian');
// saved lava levels come back
const k=wkey(x+OX,fy+1,z+2+OZ);storeEdit(k,LAVA_LV+3);world[I(x,fy+1,z+2)]=AIR;
assert(edits.get(k)===LAVA_LV+3,'a lava level is saved as its own value');
