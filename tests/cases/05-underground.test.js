// @seed 4242
// Targets: very little standing water underground, and few cave openings at the surface.
while(genQ.length)processGenQ();
let runs=0,changes=0;for(let line=0;line<8;line++){const Z=line*1500-6000;let prev=-1;for(let X=-8000;X<8000;X+=4){const b=colInfo(X,Z,{}).b;if(prev>=0&&b!==prev)changes++;prev=b;}}console.log("mean biome stretch along a line (blocks)",Math.round(8*16000/(changes+1)));
let wat=0,air=0,open=0,cols=0;
for(let z=0;z<D;z++)for(let x=0;x<W;x++){const g=ground[x+W*z];if(g<SEA+1)continue;cols++;let o=false;for(let k=1;k<=5;k++){if(world[I(x,g-k,z)]===AIR){o=true;break;}}if(o)open++;
  for(let y=12;y<g-12;y++){const v=world[I(x,y,z)];if(v===WATER)wat++;else if(v===AIR)air++;}}
console.log("underground water as share of open cave space",(100*wat/(wat+air)).toFixed(1)+"%","; land columns with a cave opening within 5 blocks of the surface",(100*open/cols).toFixed(2)+"%");

assert(wat/(wat+air)<0.01,'underground water is under 1% of open cave space');
assert(open/cols<0.006,'cave openings near the surface are under 0.6% of land columns');
