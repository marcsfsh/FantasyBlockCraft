// Engine state: torches in streamed chunks are registered for their flames; the world simulation pauses with the game.
while(genQ.length)processGenQ();
// 1. Torches generated in chunks that stream in are registered (they get flame particles)
const countTorches=()=>{let n=0,missing=0;for(let i=0;i<VOL;i++)if(world[i]===TORCH){n++;if(!torches.has(i))missing++;}return [n,missing];};
shiftWindow(2*CS,0);while(genQ.length)processGenQ();
const [n,missing]=countTorches();info('torch blocks in the window',n,'unregistered',missing);
assert(missing===0,'every torch in the window, including streamed chunks, is registered');
// 2. Lit kegs, falling blocks and water wait while the game is paused
const x=W/2,z=D/2+9,y=ground[x+W*z]+1;setBlock(x,y,z,TNT,true);prime(x,y,z,4);
const p=primed[primed.length-1],fuse0=p.fuse;
playing=false;for(let k=0;k<30;k++)frame(1000+k*33);
assert(primed.includes(p)&&p.fuse===fuse0,'a lit keg does not burn down while paused');
playing=true;for(let k=0;k<5;k++)frame(3000+k*33);
assert(p.fuse<fuse0,'the keg burns again once play resumes');
