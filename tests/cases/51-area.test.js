// @area 1
// The loaded area (D-057): the world in memory is a square of AREA blocks a side, chosen at start; here Far (320). Every
// world array is sized from it, the starting world is generated whole, the window slides a chunk as the player walks and keeps
// what it held, and the view reaches out to eight blocks short of the edge, no further.
assert(W===320&&D===320&&NCX===20&&world.length===320*512*320&&SKL.length===world.length&&lvl.length===world.length&&BLK.length===world.length&&ground.length===320*320,'every world array is sized from the loaded area (320)');
assert(AREAS.join()==='224,320,416'&&autoArea({hardwareConcurrency:16,userAgent:'Windows NT 10.0'})===320&&autoArea({hardwareConcurrency:8,userAgentData:{mobile:true}})===224&&autoArea({hardwareConcurrency:4})===224&&autoArea({hardwareConcurrency:16,deviceMemory:4})===224,
  'Auto takes Far on a desktop or handheld with 8 cores and more, Near on a phone or a smaller machine');
while(genQ.length||genJob)processGenQ();
let done=0;for(let c=0;c<NCX*NCZ;c++)done+=genDone[c];assert(done===NCX*NCZ,'the whole starting area is generated ('+done+' chunks)');
// slide the window one chunk east: what stays loaded is unchanged
const X=OX+200,Z=OZ+150,col=[];for(let y=0;y<H;y+=7)col.push(get(X-OX,y,Z-OZ));const t0=Date.now();shiftWindow(CS,0);const ms=Date.now()-t0;
let same=0;for(let y=0,k=0;y<H;y+=7,k++)if(get(X-OX,y,Z-OZ)===col[k])same++;
info('a slide of the 320 area took',ms,'ms on this machine;',same,'of',col.length,'cells held');assert(same===col.length,'the window slides a chunk and keeps what it held');
// the view: Farthest is clamped to the edge, Farther fits
settings.view=4;drawView();const f4=FOGF;settings.view=3;drawView();const f3=FOGF;settings.view=-1;drawView();
info('view max',VIEW_MAX,'; Farthest gives',f4,'; Farther',f3);assert(VIEW_MAX===152&&f4===152&&f3===150,'the view reaches eight blocks short of the edge of the loaded area, no further');
