// Streaming must light chunks exactly as a full recompute would.
const t0=Date.now();shiftWindow(16,0);while(genQ.length)processGenQ();console.log("shift+gen ms",Date.now()-t0);
const b2=BLK.slice();BLK.fill(0);lightAll();let d2=0;for(let i=0;i<VOL;i++)if(BLK[i]!==b2[i])d2++;console.log("after streaming, light cells differing from a full recompute:",d2);

assert(d2===0,'streamed lighting equals a full recompute');
