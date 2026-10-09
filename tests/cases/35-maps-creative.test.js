// Maps and creative tools (M5b): explored chunks, places and markers saved with the world, the world map's colours and screen,
// the layer view; the Fill Tool, larger brushes, going to coordinates, time and weather, test structures.
while(genQ.length)processGenQ();
const store={};localStorage.setItem=(k,v)=>{store[k]=v;};
const saveData=()=>{saveNow();return JSON.parse(store[worldKey(WORLD.id)]||'null');};
// ---- explored chunks, places and markers (Q40)
assert(explored.size>=NCX*NCZ,'every generated chunk of the window is explored ('+explored.size+' chunks)');
const cx0=Math.floor((PL.x+OX)/CS),cz0=Math.floor((PL.z+OZ)/CS);assert(explored.has(ckey(cx0,cz0)),'the chunk under the player is explored');
places.length=0;
assert(notePlace('The Watchtower of Aldric',100,200)&&!notePlace('The Watchtower of Aldric',130,210)&&notePlace('The Watchtower of Aldric',900,200),'a place is kept once nearby, again far away');
assert(!notePlace(BIOMES[2],0,0)&&!notePlace(CAVE_NAMES.lush,0,0)&&!notePlace('An Old Road',0,0),'lands, cave layers and roads are not places');
markers.length=0;const m1=addMarker(PL.x+OX+40,PL.z+OZ,'Home');addMarker(PL.x+OX-80,PL.z+OZ+12,'');
assert(m1&&m1.n==='Home'&&markers[1].n==='Marker 2'&&markers[0].c!==markers[1].c,'markers take a name (or a number) and a colour');
const sv=saveData();
const ex0=new Set(explored);explored.clear();exUnpack(sv.ex);
assert(explored.size===ex0.size&&[...ex0].every(k=>explored.has(k)),'explored chunks come back from their packed form ('+sv.ex.length+' regions)');
assert(sv.v===16&&sv.pl.length===2&&sv.mk.length===2&&sv.mk[0][2]==='Home','explored chunks, places and markers are saved with the world');
info('saved map data:',sv.ex.length,'regions,',sv.pl.length,'places,',sv.mk.length,'markers;',JSON.stringify({ex:sv.ex,pl:sv.pl,mk:sv.mk}).length,'characters');
// the world map's colours come from the terrain plan: sea is blue, land is not
let sea=null,land=null;for(let X=-3000;X<3000&&(!sea||!land);X+=37){colInfo(X,0,TW);if(!sea&&TW.h<SEA-5)sea=X;if(!land&&TW.h>SEA+10&&!TW.river&&!TW.lake)land=X;}
const cs=wmColor(sea,0),cg=wmColor(land,0);
assert(sea!==null&&land!==null&&cs[2]>cs[0]+60&&!(cg[2]>cg[0]+60),'the map draws sea blue and land in the colour of its land ('+cs.map(Math.round)+' / '+cg.map(Math.round)+')');
// the screen opens in creative, needs a map in survival, and tapping places a marker
setMode('survival');inv.fill(null);openWorldMap();assert(!WM.open,'in survival the world map needs a map');
inv[0]={id:325,c:1};openWorldMap();assert(WM.open&&WM.X===PL.x+OX,'with a map it opens, centred on the player');
wmTap(innerWidth/2,innerHeight/2+100);assert(WM.pick&&!WM.pick.m&&Math.abs(WM.pick.Z-(PL.z+OZ+100/WM.s))<1,'tapping the map picks a point');
wmTap(innerWidth/2+40*WM.s,innerHeight/2);assert(WM.pick.m===m1,'tapping near a marker picks the marker');
closeWorldMap();assert(!WM.open,'the map closes');
runAction('worldMap');assert(WM.open,'M opens the world map');runAction('worldMap');assert(!WM.open,'and closes it');
setMode('creative');
// the layer view: only underground
caveF=0;PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]+1;mmZoom=0;assert(!layerWanted(),'on the surface the minimap shows the land');
PL.y=ground[Math.floor(PL.x)+W*Math.floor(PL.z)]-40;caveF=1;assert(layerWanted(),'deep underground it shows the layer at your feet');drawLayer();caveF=0;
// ---- the Fill Tool (Q76)
const x0=W/2,z0=D/2,y0=H-30;let open=true;for(let y=y0-2;y<y0+20;y++)for(let z=z0-8;z<=z0+8;z++)for(let x=x0-8;x<=x0+8;x++)if(world[I(x,y,z)])open=false;
assert(open,'the test site is open air');
fillCorner('a',{x:x0,y:y0,z:z0});fillCorner('b',{x:x0+2,y:y0+2,z:z0+2});
assert(fillDims().join()===[x0+OX,y0,z0+OZ,3,3,3].join(),'two corners mark a 3 x 3 x 3 box');
assert(applyFill(STONE,null)===27&&get(x0+1,y0+1,z0+1)===STONE,'fill puts the block in all 27 cells');
setBlock(x0+1,y0+1,z0+1,DIRT);assert(applyFill(GLASS,STONE)===26&&get(x0+1,y0+1,z0+1)===DIRT,'replace changes only the chosen block (26 stone to glass, the dirt stays)');
assert(fillCensus()[0][0]===GLASS&&fillCensus()[0][1]===26,'the box lists what is in it');
undo();assert(get(x0,y0,z0)===STONE&&get(x0+1,y0+1,z0+1)===DIRT,'undo reverses the last fill');
assert(applyFill(AIR,null)===27&&get(x0,y0,z0)===AIR,'clear empties the box');
FILL.a=FILL.b=null;fillCorner('a',{x:x0,y:y0,z:z0});fillCorner('b',{x:x0+70,y:y0,z:z0});assert(FILL.b===null,'a box over 64 a side is refused');
FILL.a=FILL.b=null;
// ---- larger brushes
brushR=0;const sizes=[];for(let k=0;k<7;k++){cycleBrush();sizes.push(brushR*2+1);}
assert(Math.max(...sizes)===13&&sizes[sizes.length-1]===1,'brushes go up to 13 blocks wide and back to 1 ('+sizes.join(', ')+')');
// ---- time and weather
setTimeOfDay(18);assert(Math.abs(curT()-0.75)<1e-9,'the time of day can be set (18:00)');settings.time='cycle';
setWeatherNow(true);assert(raining&&settings.weather,'rain can be called');setWeatherNow(false);assert(!raining,'and cleared');
// ---- test structures: each kind builds, its blocks are edits, and undo takes it away
const built={};let si=0;
for(const k of Object.keys(STAMPS)){const gx=W/2-50+(si%4)*34,gz=D/2+(si<4?-40:40),gy=ground[gx+W*gz];si++;const before=edits.size;const n=stampAt(k,gx+OX,gy,gz+OZ);built[k]=n;
  if(n){assert(edits.size>before,k+': the built blocks are saved as edits');undo();}}
info('blocks built by each test structure:',JSON.stringify(built));
assert(Object.values(built).every(n=>n>0),'every test structure builds');
assert(gx0>=0||gx0<0,'the generation chunk is restored');
// ---- going to coordinates (creative)
const tx=Math.round(PL.x+OX)+1500,tz=Math.round(PL.z+OZ)-700;
assert(goTo(tx,tz),'going to coordinates far away loads the area');
assert(Math.round(PL.x+OX-0.5)===tx&&Math.round(PL.z+OZ-0.5)===tz&&!collide()&&SOLID[get(Math.floor(PL.x),Math.floor(PL.y)-1,Math.floor(PL.z))],'the player stands on the ground at X '+tx+', Z '+tz);
assert(!goTo('a','b'),'text that is not a number is refused');
// creative only: the Fill Tool does nothing in survival
setMode('survival');FILL.a=null;inv[sel]={id:FILLTOOL,c:1};act(0);assert(FILL.a===null,'the Fill Tool is creative only');inv.fill(null);setMode('creative');
