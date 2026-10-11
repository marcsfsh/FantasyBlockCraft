// Equipment slots (belt, pack, bag, and body since D-052): equip and unequip, saved with the world, and dropped into the grave on death.
setMode('survival');inv.fill(null);
item(299,'Test Lantern','lump',[200,180,90],{equip:'belt'});item(298,'Test Lantern 2','lump',[200,180,90],{equip:'belt'});
assert(Object.keys(EQUIP_SLOTS).join()==='belt,pack,bag,body'&&Object.values(equip).every(q=>q===null),'four empty equipment slots: belt, pack, bag and body (armour since D-052)');
{inv[2]={id:381,c:1};assert(equipFrom(2)&&equip.body.id===381&&inv[2]===null,'a coat of armour goes into the body slot');equip.body=null;}
inv[3]={id:299,c:1};assert(equipFrom(3)&&equip.belt.id===299&&inv[3]===null,'an item goes into the slot it names');
inv[4]={id:298,c:1};assert(equipFrom(4)&&equip.belt.id===298&&inv[4]&&inv[4].id===299,'equipping a second belt item swaps the first back into the inventory');
inv[5]={id:STONE,c:5};assert(!equipFrom(5),'items without an equipment slot cannot be equipped');
assert(unequip('belt')&&equip.belt===null&&inv.some(q=>q&&q.id===298),'unequipping returns the item to the inventory');
// Saved with the world
equipFrom(inv.findIndex(q=>q&&q.id===298));
const store={};localStorage.setItem=(k,v)=>{store[k]=v;};saveNow();
const data=JSON.parse(store[worldKey(WORLD.id)]||'null');
assert(data&&data.eq&&data.eq.belt&&data.eq.belt[0]===298&&data.eq.pack===0,'equipment is saved with the world');
// Dropped into the grave on death
while(genQ.length)processGenQ();
PL.x=W/2+0.5;PL.z=D/2+0.5;PL.y=ground[(W/2)+W*(D/2)]+1;die('fell');
const gv=[...graves.values()].pop()||[];
assert(equip.belt===null&&gv.some(q=>q[0]===298),'equipment goes into the grave on death');
