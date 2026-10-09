// Lighter meshing (M3, D-025): above ground, cave interiors deeper than MESH_DEEP under the lowest sky-exposed ground around a chunk
// are not meshed; underground the band follows the cave fog. Mode switches have some give.
while(genQ.length)processGenQ();
let verts=0;const realMk=mkGeo;mkGeo=m=>{verts+=m.p.length/3;return realMk(m);};
function meshAll(){verts=0;for(let cz=1;cz<NCZ-1;cz++)for(let cx=1;cx<NCX-1;cx++)buildChunk(cx,cz);return verts;}
const cx0=W/2,cz0=D/2,g=ground[cx0+W*cz0];
PL.x=cx0+0.5;PL.z=cz0+0.5;PL.y=g+2;MB.c=-999;meshBand();
assert(MB.surf,'standing on the ground is surface mode');
MB.surf=false;const whole=meshAll();MB.surf=true;const floored=meshAll();
info('spawn window, band y'+MB.lo+'-'+MB.hi+': whole band',whole,'vertices; with the surface floor',floored,'(',(100*(1-floored/whole)).toFixed(0)+'% fewer)');
// Since M3.5a (D-028) there is far less cave to skip, so the floor saves less; what matters is the total stays low
assert(floored<whole&&floored<1300000,'the surface floor trims the band, and spawn stays under 1.3 million vertices (1.2 million in 0.7.0)');
// the floor never cuts into anything the sky can see: it lies MESH_DEEP under the lowest open-to-sky ground of the chunk and its ring
let bad=0;for(let cz=1;cz<NCZ-1;cz++)for(let cx=1;cx<NCX-1;cx++){const f=meshFloor(cx*CS,cz*CS);for(let z=cz*CS;z<cz*CS+CS;z++)for(let x=cx*CS;x<cx*CS+CS;x++)if(hm[x+W*z]>=0&&hm[x+W*z]-MESH_DEEP<f)bad++;}
assert(bad===0,'no column is cut above '+MESH_DEEP+' blocks under its open ground');
// going underground switches to the cave band (and back, with some give)
const caveHalf=[48,72,118][settings.cave||0];
PL.y=g-4;meshBand();assert(MB.surf,'a few blocks under the ground (a doorway, a ditch) stays surface mode');
PL.y=g-12;meshBand();assert(!MB.surf&&MB.hi-MB.lo<=2*caveHalf+1,'deep enough underground the band follows the cave fog ('+(MB.hi-MB.lo)+' tall)');
PL.y=g-3;meshBand();assert(!MB.surf,'climbing back near the surface keeps cave mode until clear of the ground');
PL.y=g+1;meshBand();assert(MB.surf,'back on the ground is surface mode');
