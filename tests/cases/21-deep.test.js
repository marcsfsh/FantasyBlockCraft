// @seed 123456789 4242
// The deep outside the holds (D-023): an open lava sea at the bottom, natural caverns in two tiers, lakes and rivers at one level.
const WD=W*D,held=j=>world[j]===WATER||SOLID[world[j]],rests=j=>held(j-WD);
function unsound(){let n=0;for(let z=1;z<D-1;z++)for(let x=1;x<W-1;x++){const g=ground[x+W*z];for(let y=3;y<g-2;y++){const i=I(x,y,z);if(world[i]!==WATER)continue;const b=i-WD;
  if(!(held(b)&&(world[b]===WATER||rests(b))&&[i+1,i-1,i+W,i-W].every(j=>held(j)&&(world[j]===WATER||rests(j)))))n++;}}return n;}
function survey(){const r={sea:0,lavaHigh:0,lo:0,up:0,wl:0,wHigh:0,deco:0,n:W*D};
  for(let z=0;z<D;z++)for(let x=0;x<W;x++){
    if(world[I(x,FIRE_LV,z)]===LAVA&&world[I(x,FIRE_LV+1,z)]===AIR)r.sea++;
    for(let y=17;y<=57;y++)if(world[I(x,y,z)]===AIR)r.lo++;
    for(let y=58;y<=101;y++){const v=world[I(x,y,z)];if(v===AIR)r.up++;else if(v===WATER){if(y<=DEEP_WL)r.wl++;else r.wHigh++;}else if(v===CRYSTAL||v===GLOWCAP||v===AMETH||v===DRIPU||v===GLOWSHROOM)r.deco++;}}
  return r;}
while(genQ.length)processGenQ();
const o=survey();
info('spawn area: lava sea open over',(100*o.sea/o.n).toFixed(0)+'% of columns; open space lower tier',(100*o.lo/(o.n*41)).toFixed(1)+'%, upper tier',(100*o.up/(o.n*44)).toFixed(1)+'%; deep water at the lake level',o.wl,'above it',o.wHigh,'; cave life in the upper tier',o.deco);
assert(o.sea/o.n>0.5,'the lava sea lies open under most of the land');
assert(o.lo/(o.n*41)>0.15&&o.up/(o.n*44)>0.12,'natural caverns fill both deep tiers');
assert(o.wl>500,'lakes and rivers lie in the upper tier');
assert(o.wHigh<o.wl*0.05,'deep water stands at one level, with only small pools above it');
assert(o.deco>200,'the deep caverns have cave life');
{const u=unsound();info('underground water not in a sound basin (spawn area)',u);assert(u===0,'every underground lake and river is held in sound rock, across chunk borders too');}
const lavaWall=(()=>{let n=0;for(let z=1;z<D-1;z++)for(let x=1;x<W-1;x++)for(let y=FIRE_LV+1;y<=FIRE_LV+3;y++)if(world[I(x,y,z)]===LAVA&&world[I(x,y-1,z)]===AIR)n++;return n;})();
info('lava blocks hanging over open air just above the sea',lavaWall);
assert(lavaWall<20,'no lava hangs over the sea');
// Under a hold the sea is still there, but the hold's own deeps keep out the natural caverns
const HH=holdAt(0,0);regenerateAll(HH.cx*CS+8,HH.cz*CS+8);while(genQ.length)processGenQ();
const h=survey();
info('under the hold of region 0,0: lava sea open over',(100*h.sea/h.n).toFixed(0)+'%; deep water at the lake level',h.wl);
assert(h.sea/h.n>0.5,'the lava sea runs under the holds too');
{const u=unsound();info('underground water not in a sound basin (hold)',u);assert(u===0,'water in and around a hold is held in sound stone');}
