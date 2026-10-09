// Crops grow under a roof when lit; mountain snow starts at the snow line; farmland is tracked through edits and window shifts.
while(genQ.length)processGenQ();
const x=W/2+6,z=D/2+6,g=ground[x+W*z];
// A covered, torch-lit farm: dirt floor, wet farmland, a wheat seedling, stone roof, glowstone for light, water beside it
for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){setBlock(x+dx,g+1,z+dz,STONE,true);for(let dy=2;dy<=4;dy++)setBlock(x+dx,g+dy,z+dz,AIR,true);setBlock(x+dx,g+5,z+dz,STONE,true);}
setBlock(x,g+1,z,FARM_W,true);setBlock(x,g+2,z,WHEAT0,true);setBlock(x+1,g+1,z,WATER,true);setBlock(x-1,g+2,z,GLOW,true);lightAll();
assert(farms.has(I(x,g+1,z)),'farmland placed under a roof is tracked');
assert(hm[x+W*z]>g+2,'the farm is covered (the column top is the roof)');
PL.x=x+0.5;PL.z=z+0.5;PL.y=g+2;
for(let k=0;k<4000&&world[I(x,g+2,z)]!==WHEAT;k++)randomTicks();
info('crop under the roof is now',BL[world[I(x,g+2,z)]].n);
assert(world[I(x,g+2,z)]===WHEAT,'a lit crop under a roof grows to full wheat');
// Snow: High Mountains snow only at or above the snow line; Frozen Tundra (once the Northern Fells) always
const bx=Math.floor(PL.x),bz=Math.floor(PL.z),ci=bx+W*bz,b0=biome[ci];
biome[ci]=5;PL.y=SEA+5;updWeather(0.016,0);const low=snowing;PL.y=SEA+40;updWeather(0.016,0);const high=snowing;biome[ci]=6;PL.y=SEA+5;updWeather(0.016,0);const fells=snowing;biome[ci]=b0;
assert(!low&&high&&fells,'mountain snow starts at the snow line; the fells always snow');
// The farm set follows the window when it slides
const key=wkey(x+OX,g+1,z+OZ);shiftWindow(16,0);
const i2=keyToI(key);assert(i2>=0&&farms.has(i2)&&world[i2]===FARM_W,'tracked farmland moves with a window shift');
