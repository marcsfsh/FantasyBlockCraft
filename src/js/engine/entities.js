// ---- Entities: every kind of moving thing in the loaded window registers its list here once (entityKind).
// The registry moves them all when the window slides (shiftEntities), clears or keeps them when the area is rebuilt
// (clearEntities), and runs the gameplay updates while the game is playing (updateEntities).
// Positions are window coordinates like everything the physics touches: world X = e.x + OX, world Z = e.z + OZ (entityWorld).
// A kind: {name, list, update(dt)?, persist?, shift(dx,dz)?, clear()?}
//   list     an array (or Map) of entities; the default shift moves e.x/e.z and a mesh e.m, the default clear removes meshes and empties it
//   persist  kept when the area is rebuilt (moved to the new origin instead of cleared)
const ENTITY_KINDS=[];
function entityKind(k){ENTITY_KINDS.push(k);return k.list;}
function shiftKind(k,dx,dz){
  if(k.shift){k.shift(dx,dz);return;}
  for(const e of k.list.values()){if(e.x!==undefined){e.x-=dx;e.z-=dz;}if(e.m){e.m.position.x-=dx;e.m.position.z-=dz;}}
}
function shiftEntities(dx,dz){for(const k of ENTITY_KINDS)shiftKind(k,dx,dz);}
// The area is rebuilt around a new origin that moved by (ddx,ddz): persistent kinds follow it, the rest are cleared
function clearEntities(ddx,ddz){
  for(const k of ENTITY_KINDS){
    if(k.persist){shiftKind(k,ddx,ddz);continue;}
    if(k.clear){k.clear();continue;}
    for(const e of k.list.values())if(e.m)scene.remove(e.m);
    if(Array.isArray(k.list))k.list.length=0;else k.list.clear();
  }
}
function updateEntities(dt){for(const k of ENTITY_KINDS)if(k.update)k.update(dt);}
const entityWorld=e=>[e.x+OX,e.y,e.z+OZ];
