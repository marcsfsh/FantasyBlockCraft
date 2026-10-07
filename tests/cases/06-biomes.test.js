// @seed 4242
// Biome balance and size: no land dominates and lands are wide.
let ch=0,n=0;const sh={};for(let line=0;line<12;line++){const Z=line*1700-10000;let prev=-1;for(let X=-12000;X<12000;X+=4){const b=colInfo(X,Z,{}).b;if(b===0||b===1||b===9)continue;n++;sh[BIOMES[b]]=(sh[BIOMES[b]]||0)+1;if(prev>=0&&b!==prev)ch++;prev=b;}}
console.log("land biome stretch",Math.round(n*4/(ch+1)),"blocks; land shares",Object.entries(sh).sort((a,b)=>b[1]-a[1]).map(e=>e[0]+' '+Math.round(100*e[1]/n)+'%').join(', '));

const stretch=n*4/(ch+1);assert(stretch>100,'lands average over 100 blocks along a line');
for(const [k,v] of Object.entries(sh))assert(v/n>0.03&&v/n<0.25,k+' covers 3 to 25% of land');
