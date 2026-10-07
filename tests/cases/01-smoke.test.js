// The starting world generates, the frame loop runs, and core tables are intact.
while(genQ.length)processGenQ();
let solid=0;for(let i=0;i<VOL;i+=97)if(world[i])solid++;
info('sampled solid blocks',solid);
assert(solid>1000,'world has terrain');
frame(16);frame(33);assert(true,'frames run without throwing');
assert(BIOMES.length===12,'twelve biome names');
assert(H===384&&SEA===310,'world height and sea level');
assert(RECIPES.every(r=>!BANNED.has(r[0])),'no banned items are craftable');
assert(townPlan(0,0)===null&&roadAt(0,0,5)===false,'towns and roads are off');
