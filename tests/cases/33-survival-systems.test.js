// Survival systems (M4b): chests and world containers that keep items, packs and the satchel, the worn lamp and darker deeps,
// earned travel between waystones, and food (crops, foraging, cooking).
while(genQ.length)processGenQ();
const x0=W/2,z0=D/2,y0=H-30;
let open=true;for(let y=y0-1;y<y0+8;y++)for(let z=z0-4;z<=z0+4;z++)for(let x=x0-40;x<=x0+40;x++)if(world[I(x,y,z)])open=false;
assert(open,'the test site is open air');
for(let z=z0-4;z<=z0+4;z++)for(let x=x0-40;x<=x0+40;x++)setBlock(x,y0,z,STONE);
setMode('survival');inv.fill(null);for(const s in equip)equip[s]=null;
const store={};localStorage.setItem=(k,v)=>{store[k]=v;};
const saveData=()=>{saveNow();return JSON.parse(store[worldKey(WORLD.id)]||'null');};
// ---- a chest you build keeps what you put in it, is saved, and cannot be broken while it holds anything
setBlock(x0,y0+1,z0,CHEST);inv[0]={id:COBBLE,c:40};inv[1]={id:241,c:1,d:30};
openBox(x0,y0+1,z0);assert(box&&boxes.has(wkey(x0+OX,y0+1,z0+OZ)),'opening a chest in survival opens it on the inventory screen');
boxGive(0);boxGive(1);const a=boxes.get(box.k);
assert(!inv[0]&&!inv[1]&&a.some(q=>q&&q.id===COBBLE&&q.c===40)&&a.some(q=>q&&q.id===241&&q.d===30),'stacks move into the chest, tools with their wear');
assert(boxBusy(x0,y0+1,z0),'a chest holding something cannot be broken');
const sv=saveData();assert(sv&&sv.v>=8&&Array.isArray(sv.cs)&&sv.cs.some(([k,sl])=>k===box.k&&sl.length===2),'the chest and its contents are saved with the world');
boxTakeAll();assert(inv.some(q=>q&&q.id===COBBLE&&q.c===40)&&inv.some(q=>q&&q.id===241&&q.d===30)&&!boxBusy(x0,y0+1,z0),'taking everything empties the chest, and then it can be broken');
closeInv();assert(box===null,'closing the inventory closes the chest');
setBlock(x0,y0+1,z0,AIR);assert(!boxes.has(wkey(x0+OX,y0+1,z0+OZ)),'a broken container forgets its contents');
// ---- a world crate is busy until opened and emptied
setBlock(x0+2,y0+1,z0,DWCHEST);assert(boxBusy(x0+2,y0+1,z0),'an unopened world chest cannot be broken (open it first)');setBlock(x0+2,y0+1,z0,AIR);
// ---- packs and the satchel add slots; a smaller pack is refused while the slots it would lose hold anything
inv.fill(null);assert(invCap()===36,'36 slots without a pack');
for(let i=0;i<36;i++)inv[i]={id:STONE,c:64};assert(addItem(DIRT,5)===5,'with 36 full slots and no pack nothing more fits');
inv[35]={id:341,c:1};assert(equipFrom(35)&&invCap()===45,'a woven pack adds 9 slots');
inv[35]={id:STONE,c:64};assert(addItem(DIRT,5)===0&&inv[36]&&inv[36].id===DIRT,'the new slots take items');
inv[40]={id:342,c:1};assert(equipFrom(40)&&invCap()===54&&inv[40]&&inv[40].id===341,'a sturdy pack replaces the woven one (54 slots) and the woven one goes into the pack');
inv[50]={id:COBBLE,c:3};inv[41]={id:343,c:1};assert(equipFrom(41)&&invCap()===63,'the satchel adds 9 more (63 slots)');
assert(!unequip('pack')&&equip.pack.id===342,'the sturdy pack cannot come off while its extra slots hold things');
inv[50]=null;inv[41]=null;inv[2]=null;
assert(equipFrom(40)&&equip.pack.id===341&&invCap()===54,'with the extra slots empty the woven pack can go back on');
inv.fill(null);for(const s in equip)equip[s]=null;
// ---- the worn lamp: a lantern burns fuel in the dark and takes more from the pack; without it only a held light helps
PL.x=x0+0.5;PL.z=z0+0.5;PL.y=30;sel=0; // deep in rock: dark
assert(lampDark(),'deep in rock it is dark');
assert(lampLevel()[0]===0,'in survival with no lantern and nothing lit in hand there is no light around the player');
inv[sel]={id:TORCH,c:4};const torch=lampLevel();assert(torch[0]>0,'a torch in hand still gives light (reach '+torch[1].toFixed(1)+' blocks)');inv[sel]=null;
inv[3]={id:340,c:1};assert(equipFrom(3)&&equip.belt.id===340,"the Miner's Lantern goes in the belt slot");
inv[4]={id:338,c:1};inv[5]={id:339,c:2};
lampTick(1);assert(equip.belt.d>1100&&countOf(338)===0,'the lantern takes lamp oil from the pack (20 minutes of light)');
const lit=lampLevel();assert(lit[0]===1&&lit[1]>torch[1],'a lit lantern gives more light than a torch (reach '+lit[1]+')');
lampTick(1200);assert(countOf(339)===1&&equip.belt.d>0,'when the oil runs out a pitch candle is taken');
lampTick(480);lampTick(480);lampTick(1);assert(countOf(339)===0&&equip.belt.d===0&&lampLevel()[0]===0,'with no fuel left the lantern goes out');
info('lantern fuel text when out:',lampFuelText());
PL.y=y0+1;inv[4]={id:338,c:1};lampTick(0.1);const d1=equip.belt.d;lampTick(30);
info('in daylight on the test site: dark',lampDark(),'; fuel before',d1.toFixed(1),'after 30 s',equip.belt.d.toFixed(1));
assert(!lampDark()&&equip.belt.d===d1,'in daylight the lantern does not burn its fuel');
assert(depthDim(300)===1&&depthDim(160)<1&&depthDim(60)===0.25&&depthDim(20)===0.25,'cave light falls with depth: full above y260, a quarter by y60 ('+depthDim(160).toFixed(2)+' at y160)');
setMode('creative');const cl=lampLevel();assert(cl[0]>0.9&&cl[1]>=20,'creative keeps the carried lamp');setMode('survival');
inv.fill(null);for(const s in equip)equip[s]=null;
// ---- earned travel: R refuses in survival; touch an ancient waystone to attune it; travel only from beside a waystone
PL.x=x0+0.5;PL.y=y0+1;PL.z=z0+0.5;runAction('respawn');assert(PL.x===x0+0.5&&PL.z===z0+0.5,'R does not teleport in survival');
const sx=x0-30,sz=z0;setBlock(sx,y0+1,sz,WAYSTONE);setBlock(sx,y0+2,sz,WAYSTONE);setBlock(sx,y0+3,sz,CALCITE);
const before=waypoints.size;useBlock({id:WAYSTONE,x:sx,y:y0+1,z:sz});
const ak=wkey(sx+OX,y0+3,sz+OZ);
assert(attuned.has(ak)&&waypoints.size===before+1,'touching an ancient waystone attunes it ('+attuned.get(ak)+')');
setBlock(x0+30,y0+1,z0,WAYPT);assert(waypoints.size===before+2,'a carved waystone is a travel point as soon as it is placed');
PL.x=x0+0.5;PL.z=z0+0.5;PL.y=y0+1;nextWaypoint();assert(Math.abs(PL.x-(x0+0.5))<0.01,'away from any waystone there is no travel in survival');
PL.x=sx+2.5;PL.z=sz+0.5;PL.y=y0+1;nextWaypoint();
info('travel from the attuned stone: arrived at x',(PL.x-x0).toFixed(1),'y',(PL.y-y0).toFixed(1),'(relative to the site)');
assert(Math.abs(PL.x-(x0+30.5))<1&&Math.abs(PL.z-(z0+0.5))<1,'from beside the attuned stone the player travels to the carved one');
assert(saveData().at.some(([k])=>k===ak),'attuned stones are saved with the world');
setMode('creative');PL.x=x0+0.5;PL.z=z0+3.5;nextWaypoint();assert(Math.abs(PL.x-(x0+0.5))>5,'creative travels from anywhere');setMode('survival');
// ---- food: turnips and beans grow from what you plant; the sickle replants them; dishes cook at a furnace
for(const [dx,seed] of [[-6,330],[-4,331]]){setBlock(x0+dx,y0,z0+2,FARM_W);inv[sel]={id:seed,c:2};farmUse({x:x0+dx,y:y0,z:z0+2,py:y0+1,id:FARM_W},seed);}
assert(get(x0-6,y0+1,z0+2)===TURN0&&get(x0-4,y0+1,z0+2)===BEAN0,'turnips and beans are planted as they are');
for(let k=0;k<300;k++){farmTick(x0-6,y0,z0+2,FARM_W,get(x0-6,y0+1,z0+2));farmTick(x0-4,y0,z0+2,FARM_W,get(x0-4,y0+1,z0+2));}
assert(get(x0-6,y0+1,z0+2)===TURN2&&get(x0-4,y0+1,z0+2)===BEAN2,'both crops grow to ripeness in the light');
const cut=sickleSweep(x0-5,y0+1,z0+2);
assert(get(x0-6,y0+1,z0+2)===TURN0&&get(x0-4,y0+1,z0+2)===BEAN0&&cut.some(e=>e[0]===330&&e[1]>0)&&cut.some(e=>e[0]===331&&e[1]>0),'the sickle harvests ripe turnips and beans and replants them');
const cooked=[334,335,336,337].every(id=>RECIPES.some(r=>r[0]===id&&r[3]==='f')&&FOOD[id]>FOOD[330]);
assert(cooked&&FOOD[335]===9,'four dishes cook at a furnace and feed more than raw food (pottage 9)');
// ---- foraging: wild bilberries, mushrooms and turnips in the generated world
const cnt={[BERRYB]:0,[MUSHB]:0,[WTURN]:0},by={};let cols=0;
for(const k of ['elder','moors','green']){const c=nearestLand(LAND_I[k],0,0,40);regenerateAll(c.X,c.Z); // windows on the woods, the moors and open countrywhile(genQ.length)processGenQ();
  for(let z=0;z<D;z++)for(let x=0;x<W;x++){const g=ground[x+W*z],id=world[I(x,g+1,z)];cols++;if(cnt[id]!==undefined){cnt[id]++;const b=BIOMES[biome[x+W*z]];by[b]=(by[b]||0)+1;}}}
info('forage in',cols,'columns: bilberry bushes',cnt[BERRYB],'brown mushrooms',cnt[MUSHB],'wild turnips',cnt[WTURN],'; by land',JSON.stringify(by));
assert(cnt[BERRYB]>0&&cnt[MUSHB]>0&&cnt[WTURN]>0,'bilberries, mushrooms and wild turnips grow in the world');
setMode('creative');
