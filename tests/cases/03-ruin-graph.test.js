// Ruin connectivity rules: every doorway is open from both sides, and almost no room is sealed.
// sealed rooms: active non-avenue, non-mega cells with no open edges
let sealed=0,rooms=0;for(let a=-25;a<25;a++)for(let b=-25;b<25;b++)for(let L=0;L<2;L++){if(!ruinActive(a,b,L)||isAvenue(a,b)||inDelf(a,b)||megaAt(a,b,L))continue;rooms++;let open=false;for(const [dx,dz] of DIRS4)if(edgeOpen(a,b,dx,dz,L)){open=true;break;}if(!open)sealed++;}
console.log("rooms",rooms,"sealed",sealed);
// symmetry check
let asym=0;for(let a=-15;a<15;a++)for(let b=-15;b<15;b++)for(const [dx,dz] of DIRS4)if(edgeOpen(a,b,dx,dz,0)!==edgeOpen(a+dx,b+dz,-dx,-dz,0))asym++;console.log("asymmetric edges",asym);
while(genQ.length)processGenQ();let c={};for(let i=0;i<VOL;i++){const v=world[i];if(v===WATER){}}

assert(asym===0,'every doorway opens on both sides');
assert(sealed/Math.max(1,rooms)<0.03,'fewer than 3% of rooms have no doorway (isolated chambers)');
