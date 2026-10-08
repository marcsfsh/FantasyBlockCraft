// Ruin connectivity rules: every doorway is open from both sides, and almost no room is sealed.
// Checked over the hold of region (0,0) (holds are rare, D-023).
const HH=holdAt(0,0),A0=HH.cx,B0=HH.cz;info('hold of region 0,0 at chunk',A0,B0,'radius',HH.R.toFixed(1),HH.inhabited?'(inhabited)':'');
// sealed rooms: active non-avenue, non-mega cells with no open edges
let sealed=0,rooms=0;for(let a=A0-25;a<A0+25;a++)for(let b=B0-25;b<B0+25;b++)for(let L=0;L<2;L++){if(!ruinActive(a,b,L)||isAvenue(a,b)||inDelf(a,b)||megaAt(a,b,L))continue;rooms++;let open=false;for(const [dx,dz] of DIRS4)if(edgeOpen(a,b,dx,dz,L)){open=true;break;}if(!open)sealed++;}
info("rooms",rooms,"sealed",sealed);
// symmetry check
let asym=0;for(let a=A0-15;a<A0+15;a++)for(let b=B0-15;b<B0+15;b++)for(const [dx,dz] of DIRS4)if(edgeOpen(a,b,dx,dz,0)!==edgeOpen(a+dx,b+dz,-dx,-dz,0))asym++;info("asymmetric edges",asym);

assert(rooms>300,'the hold has hundreds of rooms');
assert(asym===0,'every doorway opens on both sides');
assert(sealed/Math.max(1,rooms)<0.03,'fewer than 3% of rooms have no doorway (isolated chambers)');
