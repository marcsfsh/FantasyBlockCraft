// Entity registry: moving things keep their world position when the window slides, rebuilds clear or keep the right kinds,
// and gameplay updates run only while playing. New creatures (E1) register the same way.
while(genQ.length)processGenQ();
const names=ENTITY_KINDS.map(k=>k.name);info('entity kinds',names.join(', '));
assert(['falling blocks','waypoint beams','lit kegs','blast flashes','particles','rockets','hook','rain'].every(n=>names.includes(n)),'every existing kind of moving thing is registered');
// A test kind: one entity with a mesh, an update counter
const probe=[],m={position:{x:0,y:0,z:0}};let ticks=0;
entityKind({name:'probe',list:probe,update:()=>{ticks++;}});
probe.push({x:100.5,y:330,z:90.5,m:m});m.position.x=100.5;m.position.z=90.5;
const w0=entityWorld(probe[0]);
// A lit keg somewhere near
const kx=W/2+2,kz=D/2+2,ky=ground[kx+W*kz]+1;setBlock(kx,ky,kz,TNT,true);prime(kx,ky,kz,30);
const keg=primed[primed.length-1],kw0=entityWorld(keg);
shiftWindow(2*CS,-CS);
const w1=entityWorld(probe[0]),kw1=entityWorld(keg);
assert(w1[0]===w0[0]&&w1[2]===w0[2]&&m.position.x===probe[0].x&&m.position.z===probe[0].z,'an entity and its mesh keep their world position through a window shift');
assert(kw1[0]===kw0[0]&&kw1[2]===kw0[2],'a lit keg keeps its world position through a window shift');
// Updates run while playing, not while paused
playing=false;ticks=0;for(let k=0;k<5;k++)frame(5000+k*33);const paused=ticks;
playing=true;for(let k=0;k<5;k++)frame(6000+k*33);
assert(paused===0&&ticks>0,'entity updates run while playing and wait while paused');
// A rebuild clears ordinary kinds and keeps waypoint beams at the same world position
const wx=W/2+5,wz=D/2+5,wy=ground[wx+W*wz]+1;setBlock(wx,wy,wz,WAYPT,true);
const beam=[...waypoints.values()].pop(),bw0=[beam.position.x+OX,beam.position.z+OZ];
regenerateAll(OX+W/2+300,OZ+D/2);
const bw1=[beam.position.x+OX,beam.position.z+OZ];
assert(primed.length===0&&probe.length===0,'a rebuild clears lit kegs and other ordinary entities');
assert(waypoints.size>=1&&bw1[0]===bw0[0]&&bw1[1]===bw0[1],'waypoint beams survive a rebuild at the same world position');
