// Generation is a pure function of seed and world coordinates: every chunk comes out the same whatever
// order chunks are generated in, and wherever the loaded window sits (ARCHITECTURE rules 1 to 3).
while(genQ.length)processGenQ();
const ALL=[];for(let cz=0;cz<NCZ;cz++)for(let cx=0;cx<NCX;cx++)ALL.push([cx,cz]);
// FNV-1a over the block ids and water levels of one chunk, all heights
function chunkHash(cx,cz){let h=0x811c9dc5;for(let y=0;y<H;y++)for(let z=cz*CS;z<cz*CS+CS;z++){const r=I(cx*CS,y,z);for(let x=0;x<CS;x++){h=Math.imul(h^world[r+x],16777619);h=Math.imul(h^lvl[r+x],16777619);}}return h>>>0;}
const key=(cx,cz)=>(cx+OX/CS)+','+(cz+OZ/CS);
const hashes=()=>{const m=new Map();for(const [cx,cz] of ALL)m.set(key(cx,cz),chunkHash(cx,cz));return m;};
function compare(ref,now,what){let same=0,diff=0;const bad=[];now.forEach((h,k)=>{if(!ref.has(k))return;if(ref.get(k)===h)same++;else{diff++;if(bad.length<5)bad.push(k);}});
  info(what+': '+same+' chunks identical, '+diff+' different'+(bad.length?' (world chunks '+bad.join(' ')+')':''));return {same,diff};}
// Wipe the given chunks completely, then generate them again in the given order
function regen(order){for(const [cx,cz] of order)for(let y=0;y<H;y++)for(let z=cz*CS;z<cz*CS+CS;z++){const r=I(cx*CS,y,z);world.fill(0,r,r+CS);lvl.fill(0,r,r+CS);}for(const [cx,cz] of order)genChunk(cx,cz);}
// A fixed shuffle (not Math.random, so a failure can be reproduced)
function shuffled(a){const r=mkRng(97531),b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(r()*(i+1));const t=b[i];b[i]=b[j];b[j]=t;}return b;}

const ref=hashes();info('reference chunks',ref.size);

regen(ALL.slice().reverse());let c=compare(ref,hashes(),'regenerated in reverse order');
assert(c.same===ref.size&&c.diff===0,'chunks regenerated in reverse order are identical');

regen(shuffled(ALL));c=compare(ref,hashes(),'regenerated in shuffled order');
assert(c.same===ref.size&&c.diff===0,'chunks regenerated in a shuffled order are identical');

// Slide the window two chunks east and one south: kept chunks move, a new strip streams in
shiftWindow(2*CS,CS);while(genQ.length)processGenQ();
const shifted=hashes();c=compare(ref,shifted,'after a window shift, chunks kept in memory');
assert(c.diff===0&&c.same===(NCX-2)*(NCZ-1),'chunks kept through a window shift are unchanged');
// Everything in the shifted window, including the streamed strip, must equal a fresh generation at this window position
regen(shuffled(ALL));c=compare(shifted,hashes(),'shifted window regenerated from scratch');
assert(c.same===shifted.size&&c.diff===0,'streamed chunks equal a fresh generation of the shifted window');

// Slide back: the strip streamed on the far side must match the original reference exactly
shiftWindow(-2*CS,-CS);while(genQ.length)processGenQ();c=compare(ref,hashes(),'after shifting back');
assert(c.same===ref.size&&c.diff===0,'shifting back restores every chunk exactly');
