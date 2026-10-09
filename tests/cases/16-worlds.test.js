// Save format v3: several worlds, export and import, and saves that hold player changes only.
while(genQ.length)processGenQ();
// In-memory browser storage for this test
const mem=new Map();globalThis.localStorage={getItem:k=>mem.has(k)?mem.get(k):null,setItem:(k,v)=>{mem.set(k,String(v));},removeItem:k=>{mem.delete(k);}};
lsSet(SAVE_KEY,WIX);
// 1. Worlds: create, export, import, delete
const a=createWorld('Highland',parseSeed('777'),'survival'),b=createWorld('Highland',parseSeed('my seed'),'creative');
assert(a.seed===777,'a typed whole-number seed is used exactly (777 stays 777)');
assert(b.name==='Highland 2'&&b.seed>0&&b.mode==='creative','names stay unique and text seeds hash to a valid seed');
assert(worldIndex().list.length===WIX.list.length&&worldIndex().list.some(w=>w.id===a.id),'the world index is stored');
lsSet(worldKey(a.id),{v:12,seed:a.seed,e:[wkey(1,320,2),BRICK],inv:[]});
const file=exportWorld(a.id),imp=importWorld(file);
assert(imp.id!==a.id&&imp.seed===777&&imp.name==='Highland 3','importing an exported world makes a new world with the same seed');
assert(JSON.stringify(lsGet(worldKey(imp.id)).e)===JSON.stringify([wkey(1,320,2),BRICK]),'an imported world keeps its edits');
let err='';try{importWorld(JSON.stringify({format:'fantasy-blockcraft-world',saveKey:'fantasy-blockcraft-save-v1',world:{name:'x',seed:1}}));}catch(e){err=e.message;}
assert(/another version/.test(err),'a world from another save version is refused with a message');
assert(deleteWorld(a.id)&&!mem.has(worldKey(a.id))&&!deleteWorld(WIX.active),'deleting removes a world and its data; the world being played cannot be deleted');
// 2. Saves hold player changes only
// a dry, open spot near the middle, with nothing above it (the terrain changes between versions)
const clearAt=(x,z)=>{const g=ground[x+W*z];if(g<=SEA+2)return false;for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++)for(let y=g+1;y<=g+7;y++)if(world[I(x+dx,y,z+dz)]!==AIR)return false;return true;};
let x=W/2+4,z=D/2-8;for(let k=0;k<1600&&!clearAt(x,z);k++){x=W/2-20+(k%40);z=D/2-20+Math.floor(k/40);}
const g=ground[x+W*z];
const n0=edits.size;
autoEdit=true;setBlock(x,g+3,z,STONE,true);autoEdit=false;
assert(edits.size===n0,'an automatic change to an untouched block is not saved');
setBlock(x,g+3,z,BRICK,true);const n1=edits.size;autoEdit=true;setBlock(x,g+3,z,GLASS,true);autoEdit=false;
assert(edits.size===n1&&edits.get(wkey(x+OX,g+3,z+OZ))===GLASS,'an automatic change to a block the player changed is saved');
// Water poured by the player spreads, but only the source is saved
for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++){setBlock(x+dx,g+5,z+dz,STONE,true);setBlock(x+dx,g+6,z+dz,AIR,true);}
const n2=edits.size;setBlock(x,g+6,z,WATER,true);wakeWater(x,g+6,z);for(let k=0;k<40;k++)flowStep();
let spread=0;for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++)if(world[I(x+dx,g+6,z+dz)]===WATER)spread++;
info('water cells after flowing',spread,'; edits added',edits.size-n2);
assert(spread>1&&edits.size===n2+1,'flowing water from a placed source adds no saved edits beyond the source');
