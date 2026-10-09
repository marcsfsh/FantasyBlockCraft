// Recipes: [output, count, [[ingredient or list, count]...], station]
const LOGS=[LOG,BIRCH,SPRUCE,JLOG];
const RECIPES=[
  [PLANKS,4,[[LOGS,1]]],[201,4,[[PLANKS,2]]],[TORCH,4,[[200,1],[201,1]]],
  [FURN,1,[[COBBLE,8]]],[SBRICK,4,[[STONE,4]]],
  [STONE,2,[[COBBLE,2],[200,1]],'f'],[GLASS,2,[[SAND,2],[200,1]],'f'],
  [220,2,[[210,2],[200,1]],'f'],[221,2,[[211,2],[200,1]],'f'],[222,2,[[212,2],[200,1]],'f'],[223,2,[[213,2],[200,1]],'f'],[224,2,[[214,2],[200,1]],'f'],[229,2,[[215,2],[200,1]],'f'],
  [225,4,[[220,3],[221,1]],'f'],[226,4,[[220,3],[222,1]],'f'],[227,1,[[223,1],[200,2]],'f'],
  [BLAST,1,[[FURN,1],[227,5],[SBRICK,3]]],[228,2,[[216,2],[200,2]],'b'],
  [247,1,[[229,3],[201,2]]],[320,1,[[224,3],[201,1]]],[321,1,[[225,2]]],[251,1,[[PLANKS,2],[201,2]]],
  // climbing gear and finding the way (M4)
  [LADDER,3,[[201,7]]],[PITON,8,[[223,1]]],[ROPE,2,[[328,3]]],[322,1,[[225,3],[ROPE,1]]],
  [327,4,[[BIRCH,1]]],[325,1,[[327,3],[200,1]]],[323,1,[[220,4],[GLASS,1]]],[324,1,[[226,3],[GLASS,1]]],[326,2,[[201,1],[270,1],[200,1]]],
  [COPB,1,[[220,9]]],[BRONB,1,[[225,9]]],[BRASB,1,[[226,9]]],[STEELB,1,[[227,9]]],[TITB,1,[[228,9]]],[PLATB,1,[[229,9]]],
  [LANTERN,1,[[226,4],[TORCH,1]]],[LANTERN,1,[[DLANTERN,1],[200,1]]],[SCONCE,1,[[DSCONCE,1],[200,1]]],[TORCH,1,[[DTORCH,1],[200,1]]],[GOLDB,1,[[224,9]]],[224,9,[[GOLDB,1]]],[220,9,[[COPB,1]]],[225,9,[[BRONB,1]]],[226,9,[[BRASB,1]]],[227,9,[[STEELB,1]]],[228,9,[[TITB,1]]],[229,9,[[PLATB,1]]],[TNT,1,[[SAND,4],[200,2]]],[WAYPT,1,[[230,2],[229,4],[SBRICK,6],[RUNE,1]]],
  [206,1,[[202,3]],'f'],[269,4,[[209,4],[200,1]],'f'],
  // storage, the worn lamp and cooking (M4b)
  [CHEST,1,[[PLANKS,8]]],[341,1,[[328,12],[ROPE,2]]],[342,1,[[341,1],[225,4],[ROPE,4]]],[343,1,[[328,8],[ROPE,1]]],
  [340,1,[[220,2],[GLASS,1],[201,1]]],[338,1,[[208,6]]],[339,2,[[328,1],[200,1]]],
  [334,2,[[330,2],[200,1]],'f'],[335,2,[[330,1],[331,2],[333,1],[200,1]],'f'],[336,2,[[332,3],[202,2],[200,1]],'f'],[337,2,[[333,3],[200,1]],'f']
];
// The tool ladder (items.js): pickaxe and axe from three of the material, shovel from one, each with two sticks
const LADDER_MAT=[PLANKS,COBBLE,220,225,223,227,228];
LADDER_MAT.forEach((m,i)=>RECIPES.push([240+i,1,[[m,3],[201,2]]],[300+i,1,[[m,3],[201,2]]],[310+i,1,[[m,1],[201,2]]]));
function nearStation(kind){
  const px=Math.floor(PL.x),py=Math.floor(PL.y),pz=Math.floor(PL.z);
  for(let y=py-3;y<=py+4;y++)for(let z=pz-4;z<=pz+4;z++)for(let x=px-4;x<=px+4;x++){const id=get(x,y,z);if(id===BLAST||(kind==='f'&&id===FURN))return true;}
  return false;
}
function canCraft(r){if(r[3]&&!nearStation(r[3]))return false;return r[2].every(([ids,n])=>countOf(ids)>=n);}
function craft(r){
  if(!canCraft(r))return;if(roomFor(r[0])<r[1]){toast('Inventory full');return;}
  r[2].forEach(([ids,n])=>takeItems(ids,n));addItem(r[0],r[1]);
  tone(600,900,0.08,0.1);showName('+'+r[1]+' '+nameOf(r[0]));drawBar(true);renderSInv();
}
// Defined but out of play: coins return with settlement traders (E2). Filtered from recipes, loot and menus.
const BANNED=new Set([203,204,205]);
for(let i=RECIPES.length-1;i>=0;i--){const rc=RECIPES[i];if(BANNED.has(rc[0])||rc[2].some(q=>BANNED.has(q[0])))RECIPES.splice(i,1);}
for(const T of [ARMORY_L,FOOD_L,SCHOLAR_L,SMITH_L,TREASURE_L,DWLOOT,LOOT,BARRELLOOT])for(let i=T.length-1;i>=0;i--)if(BANNED.has(T[i][0]))T.splice(i,1);
