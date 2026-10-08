// @seed 123456789 4242
// Findable ways down (Q22): hold gates climb from the upper deep to a gatehouse terrace on the surface.
const S=id=>id>0&&SOLID[id];
const standable=(x,y,z)=>x>0&&z>0&&x<W-1&&z<D-1&&y>0&&y<H-2&&!S(world[I(x,y,z)])&&!S(world[I(x,y+1,z)])&&(S(world[I(x,y-1,z)])||world[I(x,y-1,z)]===WATER);
// Walk search: steps up of one block (with headroom), drops of up to 3, from a start cell; returns visited set and a probe
function walkFrom(sx,sy,sz,lim){
  const seen=new Set(),q=[[sx,sy,sz]],key=(x,y,z)=>x+W*(z+D*y);seen.add(key(sx,sy,sz));
  for(let i=0;i<q.length&&q.length<lim;i++){const [x,y,z]=q[i];
    for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,nz=z+b;
      for(const dy of [1,0,-1,-2,-3]){const ny=y+dy;if(dy===1&&S(world[I(x,y+2,z)]))continue;if(standable(nx,ny,nz)){const k=key(nx,ny,nz);if(!seen.has(k)){seen.add(k);q.push([nx,ny,nz]);}break;}if(dy<=0&&S(world[I(nx,ny,nz)]))break;}}}
  return {seen,key};
}
let ok=0,n=0;const gateInfo=[];
for(const [rx,rz] of [[0,0],[-1,0]]){const h=holdAt(rx,rz),gs=holdGates(h);
  assert(gs.length>=2,'a hold has at least two gates ('+holdOf(h.cx,h.cz).name+': '+gs.length+')');
  for(const g of (rx===0?gs:gs.slice(0,1))){const X=g.cx*CS+8,Z=g.cz*CS+8;regenerateAll(X,Z);while(genQ.length)processGenQ();
  const x=X-OX,z=Z-OZ,top=gateTop(X,Z);
  // start on the avenue floor just east of the shaft, walk; success when standing on the terrace
  let sy=RUIN_Y[1];const w=walkFrom(x+5,sy,z,400000);const hit=[[5,0],[-5,0],[0,5],[0,-5]].some(([a,b])=>w.seen.has(w.key(x+a,top+1,z+b)));
  n++;if(hit)ok++;gateInfo.push(holdOf(h.cx,h.cz).name+' gate at X '+X+' Z '+Z+' terrace y'+(top)+(hit?' walkable':' BLOCKED'));}
}
info(gateInfo.join('; '));
assert(ok===n,'the stair of a hold gate can be climbed from the upper deep to the terrace');
let thrown=null;try{const h=holdAt(0,0),p=holdPlan(Math.floor(h.cx/8),Math.floor(h.cz/8)),[hx,hz]=p.hub.split(',').map(Number);const t=loreText(hx*CS+8,RUIN_Y[0],hz*CS+8);info('plaza waymarker:',t.slice(0,160));assert(/gate about/.test(t),'waymarkers point to the nearest gate');}catch(e){thrown=e;}
assert(!thrown,'a plaza waymarker can be read'+(thrown?' ('+thrown.message+')':''));
