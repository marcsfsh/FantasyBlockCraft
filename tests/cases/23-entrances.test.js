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
  if(g===gs[0])assert(world[I(x+4,top+1,z-4)]===WAYSTONE&&world[I(x+4,top+2,z-4)]===WAYSTONE,'the first gate of '+holdOf(h.cx,h.cz).name+' has an ancient waystone');
  n++;if(hit)ok++;gateInfo.push(holdOf(h.cx,h.cz).name+' gate at X '+X+' Z '+Z+' terrace y'+(top)+(hit?' walkable':' BLOCKED'));}
}
info(gateInfo.join('; '));
assert(ok===n,'the stair of a hold gate can be climbed from the upper deep to the terrace');
let thrown=null;try{const h=holdAt(0,0),p=holdPlan(Math.floor(h.cx/8),Math.floor(h.cz/8)),[hx,hz]=p.hub.split(',').map(Number);const t=loreText(hx*CS+8,RUIN_Y[0],hz*CS+8);info('plaza waymarker:',t.slice(0,160));assert(/gate about/.test(t),'waymarkers point to the nearest gate');}catch(e){thrown=e;}
assert(!thrown,'a plaza waymarker can be read'+(thrown?' ('+thrown.message+')':''));
// Ways down from open land (Q22, Q88): the entrances of cave systems (mouths in slopes, sinkholes), ruined stairways and deep
// ravines, over a square of 120 x 120 chunks (1920 blocks) around spawn
const sws=[],ents=[];let ncell=0;
for(let a=-60;a<60;a++)for(let b=-60;b<60;b++){ncell++;const s=stairwayAt(a,b);if(s)sws.push(s);}
for(let rx=Math.floor(-60/CR);rx<Math.ceil(60/CR);rx++)for(let rz=Math.floor(-60/CR);rz<Math.ceil(60/CR);rz++){const B=caveBase(rx,rz);
  for(const e of B.ents){const n=B.nodes[e],ed=B.edges.find(q=>q.a===e);ents.push({X:Math.floor(n.x),Y:Math.floor(n.y),Z:Math.floor(n.z),sink:!!ed&&ed.pts.length>40});}}
let rav=0,ravDeep=0;const o={};for(let a=0;a<480;a++)for(let b=0;b<480;b++){colInfo(-960+a*4,-960+b*4,o);if(o.rvBot<999){rav++;if(o.rvBot<=SEA-24)ravDeep++;}}
info('per 1000 chunks: cave entrances',(1000*ents.length/ncell).toFixed(1),'(of which sinkholes',ents.filter(e=>e.sink).length+'), ruined stairways',(1000*sws.length/ncell).toFixed(1),'; ravine columns',(100*rav/(480*480)).toFixed(2)+'%, of which reach the crawlways',(100*ravDeep/Math.max(1,rav)).toFixed(0)+'%');
assert(ents.length/ncell>0.004,'cave entrances are common enough to find');
assert(sws.length>0,'ruined stairways still occur');
assert(ravDeep>0,'some ravines cut down into the crawlways');
// how far is the nearest way down (entrance, stairway or ravine) from a point of open land?
const wd=sws.map(s=>[s.X,s.Z]).concat(ents.map(m=>[m.X,m.Z]));for(let a=0;a<480;a+=6)for(let b=0;b<480;b+=6){colInfo(-960+a*4,-960+b*4,o);if(o.rvBot<=SEA-24)wd.push([-960+a*4,-960+b*4]);}
const dists=[];for(let a=0;a<12;a++)for(let b=0;b<12;b++){const X=-700+a*127,Z=-700+b*127;colInfo(X,Z,o);if(o.b===0)continue;dists.push(Math.min(...wd.map(e=>Math.hypot(e[0]-X,e[1]-Z))));}
dists.sort((p,q)=>p-q);const med=dists[dists.length>>1];info('distance from open land to the nearest way down: median',Math.round(med),'blocks, worst',Math.round(dists[dists.length-1]));
assert(med<120,'a way down is usually within about a hundred blocks');
// walk down the nearest stairways (stairs only) to their caves
const near=(arr,f)=>arr.slice().sort((p,q)=>Math.hypot(f(p)[0],f(p)[1])-Math.hypot(f(q)[0],f(q)[1]));
let swOk=0,swN=0;for(const s of near(sws,s=>[s.X,s.Z]).slice(0,2)){regenerateAll(s.X,s.Z);while(genQ.length)processGenQ();const x=s.X-OX,z=s.Z-OZ;
  let st=null;for(const [a,b] of [[3,0],[-3,0],[0,3],[0,-3],[4,0],[0,4]]){for(let y=s.g+3;y>=s.g-2;y--)if(standable(x+a,y,z+b)){st=[x+a,y,z+b];break;}if(st)break;}
  const w=walkFrom(st[0],st[1],st[2],300000);const ax=s.a.x-OX,az=s.a.z-OZ;let reach=false;for(const k of w.seen){const y=(k/(W*D))|0,r=k%(W*D),xx=r%W,zz=(r/W)|0;if(Math.abs(xx-ax)<=2&&Math.abs(zz-az)<=2&&Math.abs(y-s.a.y)<=4){reach=true;break;}}
  swN++;if(reach)swOk++;info('ruined stairway at X',s.X,'Z',s.Z,'from y',s.g,'down to a cave at y',s.a.y,reach?'walkable':'BLOCKED');}
assert(swOk===swN,'a ruined stairway can be walked down to its cave');
// walk into the nearest entrances: a system's trunk can be followed down on foot (steps of one up, drops of three at most, Q81)
let deepOk=0,entN=0;for(const m of near(ents,m=>[m.X,m.Z]).slice(0,4)){regenerateAll(m.X,m.Z);while(genQ.length)processGenQ();const x=m.X-OX,z=m.Z-OZ;
  let st=null;for(let r=0;r<4&&!st;r++)for(const [p,q] of [[0,0],[r,0],[-r,0],[0,r],[0,-r]]){for(let y=m.Y+3;y>=m.Y-4;y--)if(standable(x+p,y,z+q)){st=[x+p,y,z+q];break;}if(st)break;}
  entN++;if(!st){info((m.sink?'sinkhole':'cave mouth')+' at X',m.X,'Z',m.Z,'has no place to stand');continue;}
  const w=walkFrom(st[0],st[1],st[2],400000);let lo=999;for(const k of w.seen){const y=(k/(W*D))|0;if(y<lo)lo=y;}
  if(lo<=m.Y-60)deepOk++;info((m.sink?'sinkhole':'cave mouth')+' at X',m.X,'Z',m.Z,'y',m.Y,': lowest point reached on foot y',lo);}
assert(deepOk>=Math.ceil(entN/2),'most entrances lead on foot at least 60 blocks down');
// a hold can be found from below: a link from a cave system walks down into the upper gallery of its mines (Q99)
{const h=holdAt(0,0),hrx=Math.floor(h.cx/CR),hrz=Math.floor(h.cz/CR);let L=null;
  for(let a=-5;a<=5&&!L;a++)for(let b=-5;b<=5&&!L;b++)L=caveHoldLink(hrx+a,hrz+b);
  assert(!!L,'cave systems near a hold link into its mines');
  if(L){const p=L.pts,n=p.length,sx=p[0],sy=p[1],sz=p[2],ex=p[n-4],ez=p[n-2];regenerateAll((sx+ex)/2,(sz+ez)/2);while(genQ.length)processGenQ();
    let st=null;for(let r=0;r<5&&!st;r++)for(const [a,b] of [[0,0],[r,0],[-r,0],[0,r],[0,-r]]){for(let y=46;y>=42;y--)if(standable(Math.floor(ex)-OX+a,y,Math.floor(ez)-OZ+b)){st=[Math.floor(ex)-OX+a,y,Math.floor(ez)-OZ+b];break;}if(st)break;}
    let reach=false;if(st){const w=walkFrom(st[0],st[1],st[2],400000);for(const k of w.seen){const y=(k/(W*D))|0,r=k%(W*D),xx=r%W+OX,zz=((r/W)|0)+OZ;if(Math.abs(xx-sx)<=3&&Math.abs(zz-sz)<=3&&Math.abs(y-sy)<=4){reach=true;break;}}}
    info('hold link from X',Math.round(sx),'Y',Math.round(sy),'Z',Math.round(sz),'to the mine gallery at X',Math.round(ex),'Z',Math.round(ez),st?(reach?': walkable':': BLOCKED'):': no gallery floor at its end');
    assert(reach,'the link can be walked from the mine gallery up into the cave system');}}
