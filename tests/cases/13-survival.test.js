// Survival fixes: crate loot is never lost (and containers keep leftovers, M4b), creative only looks into crates, blasts spare graves, using a block beats using the held item.
while(genQ.length)processGenQ();
setMode('survival');
const x=W/2+8,z=D/2-6,g=ground[x+W*z],y=g+1;
const place=(id)=>{setBlock(x,y,z,id,true);return world[I(x,y,z)]===id;};
// 1. A full inventory leaves the crate and its loot untouched (M4b: containers keep what is left)
place(CRATE);for(let i=0;i<36;i++)inv[i]={id:STONE,c:64};
openBox(x,y,z);const before=boxes.get(wkey(x+OX,y,z+OZ)).filter(Boolean).reduce((s,q)=>s+q.c,0);boxTakeAll();
const after=boxes.get(wkey(x+OX,y,z+OZ)).filter(Boolean).reduce((s,q)=>s+q.c,0);
assert(world[I(x,y,z)]===CRATE&&before>0&&after===before&&inv.slice(0,36).every(q=>q&&q.id===STONE&&q.c===64),'with a full inventory the crate keeps all its loot and nothing is lost');
// 2. With room, everything in the crate is taken; the empty crate stays and can now be broken
inv.fill(null);boxTakeAll();const got=inv.filter(Boolean).reduce((s,q)=>s+q.c,0);box=null;
info('items taken from the crate',got);
assert(world[I(x,y,z)]===CRATE&&got===before&&!boxBusy(x,y,z),'with room the crate is emptied into the inventory and stays, empty');
// 3. Creative only looks inside: nothing is taken and nothing is recorded
inv.fill(null);place(BARREL);setMode('creative');openBox(x,y,z);
assert(world[I(x,y,z)]===BARREL&&inv.every(q=>!q)&&!boxes.has(wkey(x+OX,y,z+OZ)),'in creative a crate shows its contents but nothing is taken');
setMode('survival');
// 4. A blast next to a grave leaves the grave and its contents where they are
place(GRAVE);graves.set(wkey(x+OX,y,z+OZ),[[COAL,5,0]]);inv.fill(null);
explode(x+1.5,y+0.5,z+0.5);
assert(world[I(x,y,z)]===GRAVE&&graves.has(wkey(x+OX,y,z+OZ))&&inv.every(q=>!q),'a blast leaves a grave and its contents in place');
// 5. Using a lectern wins over the held item
let opened=0;const keep=openLore;openLore=()=>{opened++;};
inv[sel]={id:206,c:3}; // bread in hand
const used=useBlock({id:LECTERN,x:x,y:y,z:z});openLore=keep;
assert(used&&opened===1,'right-clicking a lectern opens it even with food in hand');
// 6. Hunger stays non-lethal and no death message promises otherwise
assert(!('starved' in DEATH),'no unreachable starvation death message');
