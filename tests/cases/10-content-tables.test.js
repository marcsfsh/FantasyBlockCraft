// Content tables stay consistent: block and item ids, texture tiles, recipes and loot. Prints free ids and tiles.
const blocks=[];BL.forEach((b,i)=>{if(b)blocks.push(i);});
const known=id=>!!(BL[id]||ITEMS[id]||TOOLS[id]);
assert(blocks.every(i=>i>=0&&i<256),'every block id fits the world array (0 to 255)');
assert(!blocks.some(i=>i>100&&i<108),'no block uses ids 101 to 107 (saves store water levels there)');
assert(!Object.keys(ITEMS).some(i=>BL[i])&&!Object.keys(TOOLS).some(i=>BL[i]),'item and tool ids never collide with block ids');
const noHard=blocks.filter(i=>typeof BL[i].hard!=='number'||typeof BL[i].tier!=='number'||!BL[i].mat);
assert(noHard.length===0,'every block has a hardness, a material and a pickaxe tier'+(noHard.length?' (missing: '+noHard.map(i=>BL[i].n).join(', ')+')':''));
assert(blocks.every(i=>BL[i].t.length===3&&BL[i].t.every(t=>Number.isInteger(t)&&t>=0&&t<AC*AR)),'every block has three texture tiles inside the atlas');
const ingr=r=>r[2].flatMap(([x])=>Array.isArray(x)?x:[x]);
const badR=RECIPES.filter(r=>!known(r[0])||!ingr(r).every(known));
assert(badR.length===0,'every recipe output and ingredient exists'+(badR.length?' (bad: '+badR.map(r=>r[0]).join(',')+')':''));
assert(RECIPES.every(r=>!ingr(r).some(i=>BANNED.has(i))),'no recipe needs a banned item');
const LOOTS={LOOT,BARRELLOOT,DWLOOT,ARMORY_L,FOOD_L,SCHOLAR_L,SMITH_L,TREASURE_L};
for(const [name,T] of Object.entries(LOOTS)){
  assert(T.length>0&&T.every(e=>known(e[0])&&!BANNED.has(e[0])&&e[1]<=e[2]&&e[3]>0),'loot table '+name+' has only existing, allowed items with sane counts and weights');}
// For adding content: free block ids and atlas tiles not referenced by any block, item or tool
const used=new Set();blocks.forEach(i=>BL[i].t.forEach(t=>used.add(t)));Object.values(ITEMS).forEach(it=>{if(it.tile!==undefined)used.add(it.tile);});Object.values(TOOLS).forEach(t=>{used.add(t[1]);used.add(t[2]);});
const freeIds=[];for(let i=1;i<200;i++)if(!BL[i]&&!(i>100&&i<108)&&!TOOLS[i])freeIds.push(i);
const freeT=[];for(let t=0;t<AC*AR;t++)if(!used.has(t))freeT.push(t);
info('blocks',blocks.length,'items',Object.keys(ITEMS).length,'recipes',RECIPES.length);
info('free block ids below 200 (first 12):',freeIds.slice(0,12).join(','));
info('atlas tiles not referenced',freeT.length,'of',AC*AR,'(first 12):',freeT.slice(0,12).join(','),'; check atlas.js before using one, a few are painted for icons');
// Removed for the setting (D-019, M1): power, trading counters, ore processing and rails never come back by accident
const GONE=/wire|generator|water wheel|solar|battery|electric|charger|rails|crusher|sluice|trading counter|coin mint|gold pan|drill|jackhammer|chainsaw|nugget|crushed/i;
const back=[...blocks.map(i=>BL[i].n),...Object.values(ITEMS).map(it=>it.n)].filter(n=>GONE.test(n));
assert(back.length===0,'no power, trade, ore-processing or rail blocks or items exist'+(back.length?' ('+back.join(', ')+')':''));
