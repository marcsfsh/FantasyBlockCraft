// Noclip (M3.5a.2): in creative, N (or the Clip button, or the pause menu) lets the player fly through blocks; survival refuses
// it; turning it off inside rock lifts the player to the first place they fit.
while(genQ.length)processGenQ();
setMode('creative');assert(!PL.noclip,'noclip starts off');
assert(BINDS.keys.KeyN==='noclip'&&ACTIONS.noclip,'N is bound to the noclip action');
const x=W/2,z=D/2,g=ground[x+W*z];
// stand the player inside solid rock, well under the ground
PL.x=x+0.5;PL.z=z+0.5;PL.y=g-20;PL.vx=PL.vy=PL.vz=0;
let solid=0;for(let y=g-20;y<g-18;y++)if(SOLID[world[I(x,y,z)]])solid++;
info('ground at the window centre y',g,'; solid cells where the player stands',solid,'of 2');
assert(collide(),'inside rock the player collides without noclip');
runAction('noclip');assert(PL.noclip&&PL.fly,'noclip turns on, with flying');
assert(!collide(),'with noclip the player does not collide inside rock');
// moving through rock: moveAxis lets the player pass
const x0=PL.x;moveAxis('x',3);assert(Math.abs(PL.x-(x0+3))<1e-9,'with noclip the player moves straight through rock');
runAction('noclip');assert(!PL.noclip&&PL.fly,'noclip turns off; the player keeps flying');
assert(!collide(),'turning noclip off inside rock lifts the player out to a place they fit');
info('after turning noclip off the player stands at y',PL.y.toFixed(1));
// survival refuses it, and switching to survival turns it off
runAction('noclip');assert(PL.noclip,'noclip on again');
setMode('survival');assert(!PL.noclip&&!PL.fly,'survival turns noclip and flying off');
runAction('noclip');assert(!PL.noclip,'survival refuses noclip');
setMode('creative');
// F during noclip turns noclip off first and keeps flying
runAction('noclip');runAction('fly');assert(!PL.noclip&&PL.fly,'fly during noclip turns noclip off and keeps flying');
