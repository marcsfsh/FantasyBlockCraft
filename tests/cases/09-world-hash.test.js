// @seed 123456789 4242
// World snapshot: hashes of the generated starting window, layer by layer, plus far-reaching plans.
// Any change to generation changes a hash and fails here. If the change is deliberate, update the
// snapshot on purpose (docs/TESTING.md, "Updating the world snapshot") and log the save key decision.
while(genQ.length)processGenQ();
const fnv=()=>({h:0x811c9dc5,add(v){this.h=Math.imul(this.h^(v&255),16777619);this.h=Math.imul(this.h^((v>>>8)&255),16777619);},hex(){return (this.h>>>0).toString(16).padStart(8,'0');}});
// Block ids and water levels in a band of heights over the whole loaded window (window origin included in the hash)
function band(y0,y1){const f=fnv();f.add(OX);f.add(OZ);for(let y=y0;y<=y1;y++)for(let i=y*W*D,e=i+W*D;i<e;i++){f.add(world[i]);f.add(lvl[i]);}return f.hex();}
const LAYERS=[['fire-below',0,12],['mines',13,57],['dwarven-city',58,101],['great-caverns',102,151],['old-workings',152,203],['old-caves',204,259],['crawlways',260,SEA-20],['surface',SEA-19,H-1]];
for(const [name,y0,y1] of LAYERS)snapshot('blocks:'+name+':y'+y0+'-'+y1,band(y0,y1));
{const f=fnv();for(let i=0;i<W*D;i++){f.add(ground[i]);f.add(biome[i]);f.add(hm[i]);}snapshot('columns:ground-biome-heightmap',f.hex());}
{const f=fnv();for(let i=0;i<VOL;i++)f.add(BLK[i]);snapshot('light:block-light',f.hex());}
// Far beyond the window: terrain height and land over a 64 x 64 grid spanning 16000 blocks, and the city plan over 81 x 81 cells
{const f=fnv(),o={};for(let a=0;a<64;a++)for(let b=0;b<64;b++){const X=-8000+a*250+17,Z=-8000+b*250+29;colInfo(X,Z,o);f.add(o.h);f.add(o.b);}snapshot('plan:terrain-16k',f.hex());}
{const f=fnv();for(let a=-40;a<=40;a++)for(let b=-40;b<=40;b++)for(let L=0;L<2;L++){const t=ruinType(a,b,L)||'-';for(let k=0;k<t.length;k++)f.add(t.charCodeAt(k));f.add(ruinActive(a,b,L)?1:0);f.add(megaAt(a,b,L)?1:0);for(const [dx,dz] of DIRS4)f.add(edgeOpen(a,b,dx,dz,L)?1:0);}snapshot('plan:city-81x81-cells',f.hex());}
