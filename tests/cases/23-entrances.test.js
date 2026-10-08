// @seed 123456789 4242
// Findable ways down (Q22): hold gates climb from the upper deep to a gatehouse terrace on the surface.
const S=id=>id>0&&SOLID[id];
const standable=(x,y,z)=>x>0&&z>0&&x<W-1&&z<D-1&&y>0&&y<H-2&&!S(world[I(x,y,z)])&&!S(world[I(x,y+1,z)])&&(S(world[I(x,y-1,z)])||world[I(x,y-1,z)]===WATER);
// Walk search: steps up of one block (with headroom), drops of up to maxDrop (3 by default; a fall over 3.5 hurts), from a start cell
function walkFrom(sx,sy,sz,lim,maxDrop){const drops=[1,0];for(let d=1;d<=(maxDrop||3);d++)drops.push(-d);
  const seen=new Set(),q=[[sx,sy,sz]],key=(x,y,z)=>x+W*(z+D*y);seen.add(key(sx,sy,sz));
  for(let i=0;i<q.length&&q.length<lim;i++){const [x,y,z]=q[i];
    for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,nz=z+b;
      for(const dy of drops){const ny=y+dy;if(dy===1&&S(world[I(x,y+2,z)]))continue;if(standable(nx,ny,nz)){const k=key(nx,ny,nz);if(!seen.has(k)){seen.add(k);q.push([nx,ny,nz]);}break;}if(dy<=0&&S(world[I(nx,ny,nz)]))break;}}}
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
// Cave mouths, ruined stairways and deep ravines over a square of 120 x 120 chunks (1920 blocks) around spawn
const sws=[],mos=[];let ncell=0;
for(let a=-60;a<60;a++)for(let b=-60;b<60;b++){ncell++;const s=stairwayAt(a,b);if(s)sws.push(s);
  const w=wormsFor(a,b);let k0=-1,kl=-1;for(let k=0;k<w.length;k+=6)if(w[k+5]===2&&w[k+3]>2.65&&w[k+3]<2.75){if(k0<0)k0=k;kl=k;}
  if(k0>=0)mos.push({X:Math.floor(w[k0]),Y:Math.floor(w[k0+1]),Z:Math.floor(w[k0+2]),eX:Math.floor(w[kl]),eY:Math.floor(w[kl+1]),eZ:Math.floor(w[kl+2])});}
let rav=0,ravDeep=0;const o={};for(let a=0;a<480;a++)for(let b=0;b<480;b++){colInfo(-960+a*4,-960+b*4,o);if(o.rvBot<999){rav++;if(o.rvBot<=SEA-24)ravDeep++;}}
info('per 1000 chunks: ruined stairways',(1000*sws.length/ncell).toFixed(1),'cave mouths',(1000*mos.length/ncell).toFixed(1),'; ravine columns',(100*rav/(480*480)).toFixed(2)+'%, of which reach the crawlways',(100*ravDeep/Math.max(1,rav)).toFixed(0)+'%');
assert(sws.length/ncell>0.002&&mos.length/ncell>0.002,'cave mouths and ruined stairways are common enough to find');
assert(ravDeep>0,'some ravines cut down into the crawlways');
// how far is the nearest way down (stairway, mouth or ravine) from a point of open land?
const ents=sws.map(s=>[s.X,s.Z]).concat(mos.map(m=>[m.X,m.Z]));for(let a=0;a<480;a+=6)for(let b=0;b<480;b+=6){colInfo(-960+a*4,-960+b*4,o);if(o.rvBot<=SEA-24)ents.push([-960+a*4,-960+b*4]);}
const dists=[];for(let a=0;a<12;a++)for(let b=0;b<12;b++){const X=-700+a*127,Z=-700+b*127;colInfo(X,Z,o);if(o.b===0)continue;dists.push(Math.min(...ents.map(e=>Math.hypot(e[0]-X,e[1]-Z))));}
dists.sort((p,q)=>p-q);const med=dists[dists.length>>1];info('distance from open land to the nearest way down: median',Math.round(med),'blocks, worst',Math.round(dists[dists.length-1]));
assert(med<250,'a way down is usually within 250 blocks');
// walk down the nearest stairways (stairs only) and mouths (falls of up to 8 allowed, as in a natural cave)
const near=(arr,f)=>arr.slice().sort((p,q)=>Math.hypot(f(p)[0],f(p)[1])-Math.hypot(f(q)[0],f(q)[1]));
let swOk=0,swN=0;for(const s of near(sws,s=>[s.X,s.Z]).slice(0,2)){regenerateAll(s.X,s.Z);while(genQ.length)processGenQ();const x=s.X-OX,z=s.Z-OZ;
  let st=null;for(const [a,b] of [[3,0],[-3,0],[0,3],[0,-3],[4,0],[0,4]]){for(let y=s.g+3;y>=s.g-2;y--)if(standable(x+a,y,z+b)){st=[x+a,y,z+b];break;}if(st)break;}
  const w=walkFrom(st[0],st[1],st[2],300000);const ax=s.a.x-OX,az=s.a.z-OZ;let reach=false;for(const k of w.seen){const y=(k/(W*D))|0,r=k%(W*D),xx=r%W,zz=(r/W)|0;if(Math.abs(xx-ax)<=2&&Math.abs(zz-az)<=2&&Math.abs(y-s.a.y)<=4){reach=true;break;}}
  swN++;if(reach)swOk++;info('ruined stairway at X',s.X,'Z',s.Z,'from y',s.g,'down to a cave at y',s.a.y,reach?'walkable':'BLOCKED');}
assert(swOk===swN,'a ruined stairway can be walked down to its cave');
let moOk=0,moN=0,deepest=999;for(const m of near(mos,m=>[m.X,m.Z]).slice(0,3)){regenerateAll(m.X,m.Z);while(genQ.length)processGenQ();const x=m.X-OX,z=m.Z-OZ;
  let st=null;for(let r=0;r<4&&!st;r++)for(const [p,q] of [[0,0],[r,0],[-r,0],[0,r],[0,-r]]){for(let y=m.Y+3;y>=m.Y-4;y--)if(standable(x+p,y,z+q)){st=[x+p,y,z+q];break;}if(st)break;}
  if(!st){moN++;info('cave mouth at X',m.X,'Z',m.Z,'has no place to stand at its mouth');continue;}
  const w=walkFrom(st[0],st[1],st[2],300000,8),ex=m.eX-OX,ez=m.eZ-OZ;let reach=false,lo=999;for(const k of w.seen){const y=(k/(W*D))|0,r=k%(W*D),xx=r%W,zz=(r/W)|0;if(y<lo)lo=y;if(Math.abs(xx-ex)<=2&&Math.abs(zz-ez)<=2&&Math.abs(y-m.eY)<=4)reach=true;}
  moN++;if(reach)moOk++;deepest=Math.min(deepest,lo);info('cave mouth at X',m.X,'Z',m.Z,'y',m.Y,': its cave at y',m.eY,reach?'reached':'NOT reached','; lowest point reached on foot y',lo);}
assert(moOk>=moN-1,'cave mouths lead down to their caves (one in three may be cut off by a natural drop)');
