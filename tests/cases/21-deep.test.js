// @seed 123456789 4242
// Cave systems and the deep (D-028): planned systems with flow (trunks, branches, loops, chambers, descents), far less open rock
// than the old noise caves, bigger with depth; passages never cut through each other; the lava sea at the bottom; every
// underground water and lava block held in sound rock (owner's rule, Q87).
const WD=W*D;
function unsound(F){let n=0;for(let z=1;z<D-1;z++)for(let x=1;x<W-1;x++){const g=ground[x+W*z];for(let y=FIRE_LV+1;y<g-2;y++){const i=I(x,y,z);if(world[i]!==F)continue;
  if(F===LAVA){const cx=Math.floor((x+OX)/CS),cz=Math.floor((z+OZ)/CS);if(ruinZone(cx,cz)||mineZone(cx,cz)||plannedLava(x+OX,y,z+OZ))continue;}
  const held=j=>world[j]===F||SOLID[world[j]],rests=j=>held(j-WD),b=i-WD;
  if(!(held(b)&&(world[b]===F||rests(b))&&[i+1,i-1,i+W,i-W].every(j=>held(j)&&(world[j]===F||rests(j)))))n++;}}return n;}
// the plans: systems everywhere, most reaching the deep, links, chambers of every shape
let regions=0,withSys=0,deep=0,fire=0,links=0,ents=0;const shapes=[0,0,0];
for(let rx=-4;rx<4;rx++)for(let rz=-4;rz<4;rz++){regions++;const B=caveBase(rx,rz);if(B.nodes.length)withSys++;if(B.deep>=0)deep++;if(B.fire>=0)fire++;ents+=B.ents.length;for(const c of B.ch)shapes[c.t]++;
  for(const d of [[1,0],[0,1]])if(caveLink(rx,rz,d[0],d[1]))links++;}
info('in',regions,'regions:',withSys,'with systems,',deep,'reaching the deep,',fire,'down to the lava sea; links',links,'; entrances',ents,'; halls',shapes[0],'rifts',shapes[1],'stepped halls',shapes[2]);
assert(withSys===regions,'every region has a cave system');
assert(deep>=regions*0.6,'most regions have a system that winds down to the deep');
assert(fire>0&&links>0,'some systems go down to the lava sea, and some deep halls are linked to the next region');
assert(shapes.every(n=>n>0),'domed halls, rifts and stepped halls all occur');
// passages meet only at their nodes: any two pieces of different edges keep three blocks of rock between them (a little less
// where they share a node), and pass by chambers at a distance
let close=0,pairs=0;
for(let rx=-2;rx<2;rx++)for(let rz=-2;rz<2;rz++){const B=caveBase(rx,rz),cs=B.caps;
  for(let i=0;i<cs.length;i++)for(let j=i+1;j<cs.length;j++){const a=cs[i],b=cs[j];if(a.e===b.e||a.na===b.na||a.na===b.nb||a.nb===b.na||a.nb===b.nb)continue;pairs++;
    if(segDist(a.ax,a.ay+a.r,a.az,a.bx,a.by+a.r,a.bz,b.ax,b.ay+b.r,b.az,b.bx,b.by+b.r,b.bz)<a.r+b.r+3)close++;}}
info('passage pieces from unjoined edges checked',pairs,'closer than three blocks of rock',close);
assert(close===0,'passages never cut through each other');
// the spawn window: open rock by depth, the lava sea, sound water and lava
function survey(){while(genQ.length)processGenQ();const r={sea:0,n:W*D,band:[0,0,0,0],cells:[0,0,0,0],deco:0};
  for(let z=0;z<D;z++)for(let x=0;x<W;x++){if(world[I(x,FIRE_LV,z)]===LAVA&&world[I(x,FIRE_LV+1,z)]===AIR)r.sea++;const g=ground[x+W*z];
    for(let y=25;y<g-3;y++){const b=y>240?0:y>150?1:y>60?2:3,v=world[I(x,y,z)];r.cells[b]++;if(v===AIR)r.band[b]++;else if(y<102&&(v===CRYSTAL||v===GLOWCAP||v===AMETH||v===DRIPU||v===GLOWSHROOM||v===CALCITE))r.deco++;}}
  r.share=r.band.map((v,i)=>v/Math.max(1,r.cells[i]));r.all=r.band.reduce((a,b)=>a+b,0)/r.cells.reduce((a,b)=>a+b,0);return r;}
const o=survey();
info('spawn window: open rock',(100*o.all).toFixed(2)+'% (the old noise caves: about 28%); by band y241+, 151-240, 61-150, 25-60:',o.share.map(v=>(100*v).toFixed(2)+'%').join(' '),'; lava sea open over',(100*o.sea/o.n).toFixed(0)+'%; cave life in the deep',o.deco);
assert(o.all>0.008&&o.all<0.06,'far less open rock than the old caves, but still caves');
assert(Math.max(o.share[2],o.share[3])>o.share[0],'the caves are roomier in the deep than near the surface');
assert(o.sea/o.n>0.5,'the lava sea lies open under most of the land');
assert(o.deco>100,'the deep halls have cave life');
{const u=unsound(WATER),l=unsound(LAVA);info('spawn window: water not in a sound basin',u,'; lava not held in rock (outside holds and lava falls)',l);assert(u===0&&l===0,'underground water and lava are held in sound rock, across chunk borders too');}
const lavaWall=(()=>{let n=0;for(let z=1;z<D-1;z++)for(let x=1;x<W-1;x++)for(let y=FIRE_LV+1;y<=FIRE_LV+3;y++)if(world[I(x,y,z)]===LAVA&&world[I(x,y-1,z)]===AIR)n++;return n;})();
info('lava blocks hanging over open air just above the sea',lavaWall);assert(lavaWall===0,'no lava hangs over the sea');
// further afield, and under a hold (whose own deeps keep the systems out)
regenerateAll(-2600,4100);{while(genQ.length)processGenQ();const u=unsound(WATER),l=unsound(LAVA);info('window at X -2600 Z 4100: unsound water',u,'lava',l);assert(u===0&&l===0,'water and lava are sound elsewhere too');}
const HH=holdAt(0,0);regenerateAll(HH.cx*CS+8,HH.cz*CS+8);const h=survey();
info('under the hold of region 0,0: lava sea open over',(100*h.sea/h.n).toFixed(0)+'%');
assert(h.sea/h.n>0.5,'the lava sea runs under the holds too');
{const u=unsound(WATER);info('underground water not in a sound basin (hold)',u);assert(u===0,'water in and around a hold is held in sound stone');}
