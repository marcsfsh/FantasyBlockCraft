// Survival items (M4a): the metal ladder, the broader tool kit, climbing gear, finding the way, signal flares, the starting kit.
while(genQ.length)processGenQ();
// ---- the ladder: wood, stone, copper, bronze, iron, steel, moonsilver, each strictly better (Q19)
const kinds={pick:240,axe:300,shovel:310};
for(const [k,base] of Object.entries(kinds)){let ok=true;
  for(let i=0;i<7;i++){const t=ITEMS[base+i];if(!t||t.tool!==k||t.tier!==i+1)ok=false;if(i&&(t.speed<=ITEMS[base+i-1].speed||t.dur<=ITEMS[base+i-1].dur))ok=false;}
  assert(ok,'the '+k+' ladder has seven tiers, each faster and longer lasting than the one before');}
info('pickaxes',TOOL_LADDER.map((m,i)=>m[0]+' tier '+(i+1)+' speed '+m[2]+' lasts '+m[3]).join('; '));
// each pickaxe is the first that can mine the next metal's ore
const ORES=[[COAL,'coal'],[COPO,'copper'],[TINO,'tin'],[IRON,'iron'],[PLATO,'platinum'],[TITO,'moonsilver'],[OBSID,'obsidian']];
let gate=true;ORES.forEach(([o,n],i)=>{if(BL[o].tier!==i+1||mineInfo(o,240+i).drop!==true||(i>0&&mineInfo(o,240+i-1).drop!==false))gate=false;});
assert(gate,'each pickaxe on the ladder is the first to mine the next ore: '+ORES.map(([o,n],i)=>n+' needs '+ITEMS[240+i].n).join(', '));
let faster=true;for(let i=1;i<7;i++)if(mineInfo(STONE,240+i).t>=mineInfo(STONE,240+i-1).t)faster=false;
assert(faster,'stone breaks faster with each pickaxe up the ladder');
const tm=(id,tool)=>mineInfo(id,tool).t.toFixed(2);
info('seconds to break: oak log by hand',tm(LOG,0),'stone axe',tm(LOG,301),'stone pickaxe',tm(LOG,241),'; dirt by hand',tm(DIRT,0),'stone shovel',tm(DIRT,311),'; leaves by hand',tm(LEAVES,0),'shears',tm(LEAVES,321));
assert(mineInfo(LOG,301).t<mineInfo(LOG,0).t&&mineInfo(LOG,241).t===mineInfo(LOG,0).t,'an axe speeds wood; a pickaxe does not');
assert(mineInfo(DIRT,311).t<mineInfo(DIRT,0).t&&mineInfo(LEAVES,321).t<mineInfo(LEAVES,0).t,'a shovel speeds earth and shears speed leaves');
assert(ITEMS[247].tool==='pick'&&ITEMS[247].speed>ITEMS[246].speed&&ITEMS[247].dur<ITEMS[242].dur,'the platinum pickaxe is a special tool: the fastest made pickaxe, and soon worn');
// shears keep leaves and plants whole; plants give fibre by hand
let fibre=0,leafHand=0;for(let k=0;k<400;k++){if(dropsFor(TGRASS).some(d=>d[0]===328))fibre++;if(dropsFor(LEAVES).some(d=>d[0]===LEAVES))leafHand++;}
assert(dropsFor(LEAVES,321)[0][0]===LEAVES&&dropsFor(COBWEB,321)[0][0]===COBWEB&&leafHand===0,'shears keep leaves and cobwebs; by hand leaves never drop');
assert(fibre>60,'tall grass gives plant fibre by hand ('+fibre+' of 400)');
// ---- recipes reachable from the starting kit and what the world gives (Q59)
const have=new Set(START_KIT.map(e=>e[0]));
const NATURAL=[LOG,BIRCH,SPRUCE,JLOG,SAND,GRAVEL,STONE,COAL,COPO,TINO,ZINO,IRON,GOLD,PLATO,DIAMOND,TITO,OBSID,TGRASS,DBUSH,HEATHER,GLOWSHROOM,DLANTERN,DSCONCE,DTORCH,LEAVES,WHEAT,POT3,RUNE,BERRYB,MUSHB,WTURN];
const pickTier=()=>Math.max(0,...[...have].map(id=>ITEMS[id]&&ITEMS[id].tool==='pick'?ITEMS[id].tier:0));
let grew=true,rounds=0;
while(grew&&rounds<60){grew=false;rounds++;const T=pickTier();
  for(const b of NATURAL)if(BL[b].tier<=T)for(let k=0;k<40;k++)for(const [d] of dropsFor(b))if(!have.has(d)){have.add(d);grew=true;}
  for(const r of RECIPES){if(have.has(r[0]))continue;if(r[3]==='f'&&!have.has(FURN)&&!have.has(BLAST))continue;if(r[3]==='b'&&!have.has(BLAST))continue;
    if(r[2].every(([ids])=>[].concat(ids).some(i=>have.has(i)))){have.add(r[0]);grew=true;}}}
const unreached=RECIPES.filter(r=>!have.has(r[0]));
info('from the starting kit:',have.size,'things reachable in',rounds,'rounds');
assert(unreached.length===0,'every recipe can be made starting from the kit and the natural world'+(unreached.length?' (not: '+unreached.map(r=>nameOf(r[0])).join(', ')+')':''));
assert(have.has(245)&&have.has(246),'the steel and moonsilver pickaxes are reachable from the kit');
assert(!RECIPES.some(r=>r[0]===BPTOOL),'the Blueprint Tool has no recipe: it is creative only (Q42)');
// ---- the hook and fireworks are gone; the keg has one name (Q44, Q45)
assert(!TOOLS[100]&&!TOOLS[101]&&!Object.values(ITEMS).some(it=>/hook|firework/i.test(it.n)),'the grappling hook and fireworks are gone');
assert(BL[TNT].n==='Blasting Keg'&&![...BL.filter(Boolean).map(b=>b.n),...Object.values(ITEMS).map(it=>it.n)].some(n=>/tnt/i.test(n)),'the Blasting Keg has one name');
// ---- a test site high in the open air: a stone floor and a stone block 6 high and 3 deep to the east
const x0=W/2,z0=D/2,y0=H-30;
let open=true;for(let y=y0-1;y<y0+10;y++)for(let z=z0-3;z<=z0+3;z++)for(let x=x0-7;x<=x0+3;x++)if(world[I(x,y,z)])open=false;
assert(open,'the test site is open air');
setMode('creative');
for(let z=z0-3;z<=z0+3;z++){for(let x=x0-7;x<=x0+3;x++)setBlock(x,y0,z,STONE);for(let y=y0+1;y<=y0+6;y++)for(let x=x0+1;x<=x0+3;x++)setBlock(x,y,z,STONE);}
// ladders lean on a wall and stand on the ground or a ladder; pitons go into rock
assert(canHang(LADDER,x0,y0+1,z0)&&!canHang(LADDER,x0,y0+3,z0)&&!canHang(LADDER,x0-3,y0+1,z0),'a ladder needs a wall beside it and the ground or a ladder below');
setBlock(x0,y0+1,z0,LADDER);assert(canHang(LADDER,x0,y0+2,z0),'a ladder can stand on a ladder');setBlock(x0,y0+1,z0,AIR);
assert(canHang(PITON,x0,y0+4,z0)&&!canHang(PITON,x0-3,y0+4,z0),'a piton holds on a rock wall at any height, and not in the open');
// climbing a ladder: Space climbs, nothing holds still, Shift climbs down, and climbing down does no harm
setMode('survival');hp=20;
for(let y=y0+1;y<=y0+6;y++)setBlock(x0,y,z0,LADDER);
const stepN=(n,k)=>{for(const c in keys)keys[c]=false;for(const c of k)keys[c]=true;for(let i=0;i<n;i++)update(0.05);for(const c in keys)keys[c]=false;};
PL.x=x0+0.5;PL.z=z0+0.5;PL.y=y0+1;PL.vx=PL.vy=PL.vz=0;PL.yaw=-Math.PI/2;PL.pitch=0;
stepN(20,['Space']);const up=PL.y;
stepN(20,[]);const still=PL.y;
info('ladder: start y',y0+1,'after 1 s of Space',up.toFixed(2),'after 1 s with no input',still.toFixed(2));
assert(up>y0+3&&PL.climb,'Space climbs the ladder');
assert(Math.abs(still-up)<0.05,'with no input the player holds still on the ladder');
stepN(60,['ShiftLeft']);
assert(PL.y<y0+1.1&&hp===20,'Shift climbs down to the ground with no fall damage (y '+PL.y.toFixed(2)+', health '+hp+')');
for(let y=y0+1;y<=y0+6;y++)setBlock(x0,y,z0,AIR);
// rope unrolls downward as far as there is rope, and comes back down with what hangs below
inv.fill(null);inv[0]={id:ROPE,c:3};sel=0;
setBlock(x0-3,y0+7,z0,STONE);placeRope(x0-3,y0+6,z0);
let hung=0;for(let y=y0+1;y<=y0+6;y++)if(get(x0-3,y,z0)===ROPE)hung++;
assert(hung===3&&countOf(ROPE)===0,'placing rope hangs as much as you carry (3 of 6 blocks) and uses it up');
setBlock(x0-3,y0+6,z0,AIR);const back=ropeTake(ROPE,x0-3,y0+6,z0);
assert(back.length===1&&back[0][0]===ROPE&&back[0][1]===3&&get(x0-3,y0+4,z0)===AIR,'taking the top rope brings down all of it (3)');
setBlock(x0-3,y0+7,z0,AIR);
// the grapnel: thrown at the wall below the ledge, it catches the lip and rope hangs to the floor; then climb up and onto it
inv.fill(null);inv[0]={id:322,c:1};inv[1]={id:ROPE,c:10};sel=0;
PL.x=x0-3.5;PL.z=z0+0.5;PL.y=y0+1;PL.vx=PL.vy=PL.vz=0;PL.yaw=-Math.PI/2;PL.pitch=Math.atan2(1.9,4.5);
camera.position.set(PL.x,PL.y+EYE,PL.z);camera.rotation.set(PL.pitch,PL.yaw,0);camera.updateMatrixWorld(true);
act(2);
let rope=0;for(let y=y0+1;y<y0+6;y++)if(get(x0,y,z0)===ROPE)rope++;
info('grapnel: hook at y',[...Array(10).keys()].map(k=>y0+k).find(y=>get(x0,y,z0)===GRAPNEL),'; rope blocks',rope,'; rope left',countOf(ROPE),'; grapnels left',countOf(322));
assert(get(x0,y0+6,z0)===GRAPNEL&&rope===5,'the grapnel catches the top of the wall and hangs 5 blocks of rope down to the floor');
assert(countOf(ROPE)===5&&countOf(322)===0,'throwing uses the grapnel and the rope that was hung');
PL.x=x0+0.5;PL.z=z0+0.5;PL.y=y0+1;PL.vx=PL.vy=PL.vz=0;
let steps=0;for(;steps<120&&!(PL.ground&&PL.y>=y0+7-0.01&&PL.x>x0+1.3);steps++)stepN(1,['Space','KeyW']);
info('climbing the rope towards the wall took',(steps*0.05).toFixed(2),'s; standing at x',(PL.x-x0).toFixed(2),'y',(PL.y-y0).toFixed(2),'(relative to the site)');
assert(PL.y>=y0+7-0.01&&PL.x>x0+1,'the player climbs the rope and steps onto the ledge');
inv.fill(null);
setBlock(x0,y0+6,z0,AIR);const got=ropeTake(GRAPNEL,x0,y0+6,z0);
assert(got.some(e=>e[0]===322)&&got.some(e=>e[0]===ROPE&&e[1]===5),'taking the grapnel gives it back with all its rope');
// ---- finding the way: the map shows the minimap, the compass X, Z and heading, the depth gauge the height (Q66)
setMode('survival');inv.fill(null);drawMM();
assert(!mmShown&&navLine(x0,z0)==='','in survival with no map, compass or gauge there is no minimap and no position');
inv[0]={id:325,c:1};drawMM();assert(mmShown,'carrying a map shows the minimap');
inv[1]={id:323,c:1};PL.yaw=0;const nc=navLine(x0,z0);assert(/X -?\d+ Z -?\d+, facing north/.test(nc)&&!/Y /.test(nc),'a compass shows X, Z and the heading ('+nc.trim()+')');
inv[2]={id:324,c:1};assert(/Y \d+/.test(navLine(x0,z0)),'a depth gauge shows the height');
PL.yaw=Math.PI/2;const w=heading();PL.yaw=-Math.PI/2;const e=heading();assert(w==='west'&&e==='east','the heading follows the view (west '+w+', east '+e+')');
setMode('creative');inv.fill(null);drawMM();assert(mmShown&&/facing/.test(navLine(x0,z0)),'creative always shows the minimap and position');
// ---- the sickle cuts plants around it and replants ripe crops
for(let z=z0-1;z<=z0+1;z++)for(let x=x0-5;x<=x0-3;x++){setBlock(x,y0+1,z,FARM_D);setBlock(x,y0+2,z,WHEAT);}
const cut=sickleSweep(x0-4,y0+2,z0);let sprouts=0;for(let z=z0-1;z<=z0+1;z++)for(let x=x0-5;x<=x0-3;x++)if(get(x,y0+2,z)===WHEAT0)sprouts++;
const wheat=cut.filter(e=>e[0]===202).reduce((a,e)=>a+e[1],0);
assert(sprouts===9&&wheat===9,'one stroke of the sickle harvests 9 ripe wheat and replants all 9 ('+sprouts+' replanted, '+wheat+' wheat)');
// ---- signal flares climb high and burn out (Q45)
setMode('survival');inv.fill(null);inv[0]={id:326,c:2};sel=0;PL.x=x0-3.5;PL.y=y0+1;PL.z=z0+0.5;PL.pitch=1.4;camera.rotation.set(PL.pitch,PL.yaw,0);
act(2);assert(flares.length===1&&countOf(326)===1,'a flare launches and is used up');
let top=0;for(let k=0;k<400&&flares.length;k++){updFlares(0.05);if(flares.length)top=Math.max(top,flares[0].y-PL.y);}
info('flare rose',top.toFixed(0),'blocks and burned out:',flares.length===0);
assert(top>40&&flares.length===0,'the flare climbs over 40 blocks, then burns out');
assert(oneShot(322)&&oneShot(326)&&oneShot(BPTOOL)&&!oneShot(ROPE)&&!oneShot(LADDER),'holding the button throws one grapnel or flare per press; rope and ladders repeat like blocks');
// ---- the starting kit
assert(START_KIT.some(e=>e[0]===240)&&START_KIT.some(e=>e[0]===300)&&START_KIT.some(e=>e[0]===325),'the starting kit holds a wooden pickaxe, a wooden axe and a map');
setMode('creative');
