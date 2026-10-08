// @seed 123456789 4242
// The old lamps went out long ago (Q8, D-023): generation leaves cold lanterns, sconces, torches and dim glowstone, except in
// inhabited holds. Runes, crystals and glowing fungi still shine.
const LIT=[LANTERN,SCONCE,TORCH,GLOW],COLD=[DLANTERN,DSCONCE,DTORCH,DGLOW],EERIE=[RUNE,CRYSTAL,GLOWSHROOM,GLOWCAP,GLOWMOSS,AMETH];
function count(){const c={lit:0,cold:0,eerie:0},s=new Set(LIT),k=new Set(COLD),e=new Set(EERIE);for(let i=0;i<VOL;i++){const v=world[i];if(s.has(v))c.lit++;else if(k.has(v))c.cold++;else if(e.has(v))c.eerie++;}return c;}
function goTo(h){regenerateAll(h.cx*CS+8,h.cz*CS+8);while(genQ.length)processGenQ();return count();}
let dead=null,live=null;
for(let rx=-3;rx<=3&&(!dead||!live);rx++)for(let rz=-3;rz<=3;rz++){const h=holdAt(rx,rz);if(h.inhabited&&!live)live={h};else if(!h.inhabited&&!dead)dead={h};}
dead.c=goTo(dead.h);live.c=goTo(live.h);
info('abandoned hold at X',dead.h.cx*CS+8,'Z',dead.h.cz*CS+8,': lit lamps',dead.c.lit,'cold',dead.c.cold,'eerie lights',dead.c.eerie);
info('inhabited hold at X',live.h.cx*CS+8,'Z',live.h.cz*CS+8,': lit lamps',live.c.lit,'cold',live.c.cold);
assert(dead.c.lit===0&&dead.c.cold>100,'an abandoned hold has only cold lamps');
assert(dead.c.eerie>100,'runes, crystals and glowing fungi still shine');
assert(live.c.lit>100&&live.c.cold<live.c.lit*0.2,'an inhabited hold keeps its lamps lit');
assert(RECIPES.some(r=>r[0]===LANTERN&&r[2].some(q=>q[0]===DLANTERN))&&RECIPES.some(r=>r[0]===TORCH&&r[2].some(q=>q[0]===DTORCH)),'coal relights a cold lantern or a burnt-out torch');
