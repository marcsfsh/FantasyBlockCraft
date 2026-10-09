// @seed 4242
// Look balance and size: no look dominates and lands are wide. Since M6a (D-039) the twelve looks are worn by the lands of the
// registry, so a look's share is the sum of its lands; the Barrow Hills are an uncommon land.
// Since M3.5b lands mix in patches across a wide border (Q92), so a change counts only once the new land holds for 40 blocks
let ch=0,n=0;const sh={};for(let line=0;line<12;line++){const Z=line*1700-10000;let prev=-1,cand=-1,run=0;for(let X=-12000;X<12000;X+=4){const b=colInfo(X,Z,{}).b;if(b===0||b===1||b===9)continue;n++;sh[BIOMES[b]]=(sh[BIOMES[b]]||0)+1;
  if(b===prev){cand=-1;run=0;continue;}if(b===cand)run++;else{cand=b;run=1;}if(run>=10){if(prev>=0)ch++;prev=b;cand=-1;run=0;}}}
info("land biome stretch",Math.round(n*4/(ch+1)),"blocks; land shares",Object.entries(sh).sort((a,b)=>b[1]-a[1]).map(e=>e[0]+' '+Math.round(100*e[1]/n)+'%').join(', '));

const stretch=n*4/(ch+1);assert(stretch>150,'lands average over 150 blocks along a line');
for(const [k,v] of Object.entries(sh))assert(v/n>(k==='Barrow Hills'?0.003:0.03)&&v/n<0.3,k+' covers '+(k==='Barrow Hills'?'0.3':'3')+' to 30% of land');
