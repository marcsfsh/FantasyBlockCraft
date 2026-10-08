// Saved edits come back exactly where they were made, at every height, and undo restores the right blocks.
while(genQ.length)processGenQ();
// 1. World keys round-trip for every height and far-out coordinates
let bad=0;for(const [X,Z] of [[0,0],[-1,-1],[5,7],[-123456,98765],[1048000,-1048000]])for(let y=0;y<H;y++){const c=keyXYZ(wkey(X,y,Z));if(c[0]!==X||c[1]!==y||c[2]!==Z)bad++;}
assert(bad===0,'world keys decode to the same X, y, Z for every height'+(bad?' ('+bad+' wrong)':''));
// 2. A block placed on the surface survives a save and a reload of its chunk
const x=W/2+3,z=D/2+5,g=ground[x+W*z],y=g+2,cx=x>>4,cz=z>>4;
setBlock(x,y,z,BRICK,true);
const store={};localStorage.setItem=(k,v)=>{store[k]=v;};saveNow();
const data=JSON.parse(store[worldKey(WORLD.id)]||'null');
assert(!!data&&Array.isArray(data.e)&&data.e.length>=2,'saving writes the edit list');
edits.clear();editsByChunk.clear();world[I(x,y,z)]=AIR;
for(let k=0;k+1<data.e.length;k+=2)storeEdit(data.e[k],data.e[k+1]);
genChunk(cx,cz);
info('surface edit at y',y,'(ground',g+'), after reload the block is',BL[world[I(x,y,z)]].n);
assert(world[I(x,y,z)]===BRICK,'a surface edit reloads at the same place');
let stray=0;for(let yy=0;yy<H;yy++)if(yy!==y&&world[I(x,yy,z)]===BRICK)stray++;
assert(stray===0,'the reloaded edit does not appear at any other height');
// 3. Undo restores the block at the edited position
setMode('creative');const before=world[I(x+1,y,z)];beginAct();setBlock(x+1,y,z,GLASS);endAct();undo();
assert(world[I(x+1,y,z)]===before,'undo restores the block at the edited height');
