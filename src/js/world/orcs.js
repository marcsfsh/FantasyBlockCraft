// ---- The orcs' places on the floor of the Volcanic Wastes (D-064): war camps behind black palisades, watchtowers, forges by
// troughs of lava and fighting pits, each with its orcs (foes.js peoples them). One may stand in each cell of a grid where the
// floor is open and level enough, clear of the volcanoes and their flows, the lava rivers and fissures, the landmarks, the old
// sites, the fortresses and the goblins' ways in (whose camps stand before them). Planned from the ground (colInfo), which they
// never change, and built per chunk from the plan (pure: each chunk they touch builds the whole place, clipped by PW).
const ORC_C=96,orcCandC=new Map(),orcC=new Map(),TOR={};
// R the place's reach; sp the most its ground may vary; w its share of the places
const ORC_K={camp:{R:20,sp:9,w:0.38,t:'The War Camp of '},tower:{R:7,sp:10,w:0.27,t:'The Watch of '},forge:{R:13,sp:5,w:0.2,t:'The Forge of '},pit:{R:11,sp:7,w:0.15,t:'The Fighting Pit of '}};
// a candidate in grid cell (i,j): its kind, middle and ground, where the floor allows it (no neighbour checked yet)
function orcCand(i,j){
  const key=i*65536+j;if(orcCandC.has(key))return orcCandC.get(key);if(orcCandC.size>20000)orcCandC.clear();let p=null;
  if(hsh(i,9601,j)<0.72){const X=Math.floor((i+0.2+hsh(i,9603,j)*0.6)*ORC_C),Z=Math.floor((j+0.2+hsh(i,9605,j)*0.6)*ORC_C);
    let q=hsh(i,9607,j),kind='tower';for(const k in ORC_K){if(q<ORC_K[k].w){kind=k;break;}q-=ORC_K[k].w;}
    const K=ORC_K[kind],R=K.R;landsAt(X,Z,TOR);
    if(TOR.wVolc>=0.95&&onFloor(X,Z,Math.round(R*0.6),8)&&orcClear(X,Z,R)){let lo=1e9,hi=-1e9,ok=true;
      for(const [rr,n] of [[0,1],[R*0.5,8],[R*0.8,12],[R,16],[R+4,16]])for(let k=0;k<n&&ok;k++){const a=k*6.2832/n;colInfo(Math.round(X+Math.cos(a)*rr),Math.round(Z+Math.sin(a)*rr),TOR);
        if(TOR.h<TOR.sl+3||TOR.river||TOR.lake||TOR.wet||TOR.vflow||TOR.vfis||TOR.vlake||TOR.vcr||TOR.bank||TOR.rvBot<999)ok=false;lo=Math.min(lo,TOR.h);hi=Math.max(hi,TOR.h);}
      if(ok&&hi-lo<=K.sp)p={i:i,j:j,kind:kind,X:X,Z:Z,R:R,g:hAt(X,Z),pr:hsh(i,9609,j)};}}
  orcCandC.set(key,p);return p;
}
// clear of the volcanoes' feet, the landmarks, the old sites, the fortresses and the goblins' camps (the
// cave plans, which the landmarks read, never ask for the orcs, so nothing here asks for itself)
function orcClear(X,Z,R){
  for(const v of volcanoesNear(X,Z,R+60))if(Math.hypot(v.X-X,v.Z-Z)<(v.great?v.R*1.15+R+10:v.R*0.95+R*0.5))return false; // a lesser cone's gentle foot may hold one; the samples keep it off the flows
  return !siteNear(X,Z,R+6)&&!fortsNear(X,Z,R+12).length&&!sigNear(X,Z,R+16)&&!warrenSpots(X,Z,R+16).some(s=>s.kind==='camp');
}
// the orcs' place of cell (i,j): a candidate not crowded by a stronger neighbour, named
function orcAt(i,j){
  const key=i*65536+j;if(orcC.has(key))return orcC.get(key);if(orcC.size>20000)orcC.clear();let p=orcCand(i,j);
  if(p)for(let a=-1;a<=1&&p;a++)for(let b=-1;b<=1&&p;b++){if(!a&&!b)continue;const n=orcCand(i+a,j+b);if(n&&n.pr>p.pr&&Math.hypot(n.X-p.X,n.Z-p.Z)<n.R+p.R+14)p=null;}
  if(p){const r=rngAt(i,9611,j);p=Object.assign({},p,{name:ORC_K[p.kind].t+fullName('orc',r,false),dir:Math.floor(r()*8)*Math.PI/4,seed:Math.floor(r()*1e6)});}
  orcC.set(key,p);return p;
}
// the orcs' places whose reach (grown by m) holds (X,Z)
function orcsNear(X,Z,m){const out=[],ci=Math.floor(X/ORC_C),cj=Math.floor(Z/ORC_C);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const p=orcAt(ci+a,cj+b);if(p&&Math.hypot(p.X-X,p.Z-Z)<=p.R+(m||0))out.push(p);}return out;}
const orcNear=(X,Z,m)=>orcsNear(X,Z,m)[0]||null;
// where the orcs stand (world coordinates, y the floor): spots for foes.js
function orcSpots(p){const o=orcFrame(p),at=(u,v,y)=>({x:o.wx(u,v)+0.5,y:y,z:o.wz(u,v)+0.5});
  if(p.kind==='camp')return [Object.assign(at(0,3,p.g),{R:6,kind:'ocamp'}),Object.assign(at(-14,0,hAt(o.wx(-14,0),o.wz(-14,0))),{R:3,kind:'ogate'})];
  if(p.kind==='tower')return [Object.assign(at(0,0,p.g+12),{R:2,kind:'otower'}),Object.assign(at(-4,0,hAt(o.wx(-4,0),o.wz(-4,0))),{R:2,kind:'ofoot'})];
  if(p.kind==='forge')return [Object.assign(at(0,0,p.g),{R:5,kind:'oforge'})];
  return [Object.assign(at(0,0,p.g-4),{R:4,kind:'opit'})];
}
// a place's frame: u runs from its gate (or front) toward its back, v across; rounded to whole blocks
function orcFrame(p){const ux=Math.round(Math.cos(p.dir)*100)/100,uz=Math.round(Math.sin(p.dir)*100)/100;
  return {ux:ux,uz:uz,wx:(u,v)=>Math.round(p.X-ux*u-uz*v),wz:(u,v)=>Math.round(p.Z-uz*u+ux*v)};}
// ---- building, per chunk
function applyOrcs(WCX,WCZ){const x0=WCX*CS,z0=WCZ*CS,seen=new Set();
  for(let i=Math.floor((x0-40)/ORC_C);i<=Math.floor((x0+CS+40)/ORC_C);i++)for(let j=Math.floor((z0-40)/ORC_C);j<=Math.floor((z0+CS+40)/ORC_C);j++){const p=orcAt(i,j);
    if(!p||seen.has(p))continue;seen.add(p);if(p.X+p.R+6<x0||p.X-p.R-6>x0+CS-1||p.Z+p.R+6<z0||p.Z-p.R-6>z0+CS-1)continue;orcBuild(p);}}
function orcBuild(p){
  const r=rngAt(p.i,9613,p.j),g=p.g,o=orcFrame(p),R=p.R,P=(x,y,z,id,m)=>PW(x,y,z,id,m||MODE_SET),gh=(x,z)=>hAt(x,z);
  // clear the ground of trees, shards and spires, and tread it down to ash and cinder
  for(let x=p.X-R-1;x<=p.X+R+1;x++)for(let z=p.Z-R-1;z<=p.Z+R+1;z++){const d=Math.hypot(x-p.X,z-p.Z);if(d>R+0.5)continue;const h=gh(x,z);
    for(let y=h+1;y<=h+14;y++)P(x,y,z,AIR);P(x,h,z,hsh(x,9615,z)<0.45?CINDER:BLACKASH);}
  // the pieces (u,v in the place's frame; y from the ground there unless given)
  const W=(u,v)=>[o.wx(u,v),o.wz(u,v)],G=(u,v)=>{const [x,z]=W(u,v);return gh(x,z);},B=(u,v,y,id,m)=>{const [x,z]=W(u,v);P(x,y,z,id,m);};
  const pole=(u,v,top)=>{const y=G(u,v);B(u,v,y+1,CHARWOOD);B(u,v,y+2,CHARWOOD);B(u,v,y+3,top||SKULLS);};
  const brazier=(u,v)=>{const y=G(u,v);B(u,v,y+1,BASBRICK);B(u,v,y+2,BRAZIER);};
  const rack=(u,v,alongU)=>{const y=G(u,v);for(const k of [-1,1]){const [a,b]=alongU?[u+k,v]:[u,v+k];B(a,b,y+1,CHARWOOD);B(a,b,y+2,CHARWOOD);}B(u,v,y+1,SPIKES);B(u,v,y+2,CHARWOOD);};
  // a tent of hide on a ridge pole: half-width w, half-length L, its door at the end toward (du,dv) (a unit along u or v)
  const tent=(cu,cv,w,L,hgt,du,dv,big)=>{const y=G(cu,cv),along=du!==0;
    for(let a=-w;a<=w;a++)for(let b=-L;b<=L;b++){const u=cu+(along?b:a),v=cv+(along?a:b),ry=y+Math.max(1,hgt-Math.abs(a)),end=Math.abs(b)===L,front=end&&Math.sign(b)===(along?du:dv);
      for(let yy=y+1;yy<=ry;yy++){if(yy===ry||end&&!(front&&Math.abs(a)<=(big?1:0)&&yy<=y+2))B(u,v,yy,HIDE);}
      for(let yy=G(u,v)+1;yy<=y;yy++)B(u,v,yy,yy===y?BLACKASH:CINDER);}
    for(const b of [-L-1,L+1]){const u=cu+(along?b:0),v=cv+(along?0:b);B(u,v,y+1,CHARWOOD);for(let yy=y+2;yy<=y+hgt+1;yy++)B(u,v,yy,CHARWOOD);}
    if(big)for(const a of [-w-1,w+1]){const u=cu+(along?(du*(L+1)):a),v=cv+(along?a:dv*(L+1));B(u,v,y+1,CHARWOOD);B(u,v,y+2,CHARWOOD);B(u,v,y+3,BANNER);}};
  switch(p.kind){
    case 'camp':{ // a ring of black palisade with its gate toward u=-R (two towers over it), tents round a fire, the chief's tent at the back
      const pr=17;
      for(let x=p.X-pr-2;x<=p.X+pr+2;x++)for(let z=p.Z-pr-2;z<=p.Z+pr+2;z++){const dx=x-p.X,dz=z-p.Z,d=Math.hypot(dx,dz);if(d<pr-0.5||d>=pr+0.5)continue;
        const u=-(dx*o.ux+dz*o.uz),v=-dx*o.uz+dz*o.ux;if(u<0&&Math.abs(v)<2.5)continue; // the gateway
        const y=gh(x,z),tall=hsh(x,9617,z)<0.3?1:0;for(let yy=y+1;yy<=y+4+tall;yy++)P(x,yy,z,ORCLOG);P(x,y+5+tall,z,hsh(x,9619,z)<0.12?BANNER:STAKES);
        const ox=Math.round(dx/d*1.6),oz=Math.round(dz/d*1.6);if(hsh(x,9621,z)<0.45)P(x+ox,gh(x+ox,z+oz)+1,z+oz,SPIKES,MODE_AIR);}
      // the gate towers: three square of palisade to a platform with spikes, a fire basket and a banner; a beam over the way, chains
      const gy=G(-pr,0);
      for(const s of [-1,1]){const tv=s*4;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const y=G(-pr+a,tv+b);for(let yy=Math.min(y,gy)-1;yy<=gy+7;yy++)B(-pr+a,tv+b,yy,ORCLOG);}
        for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){B(-pr+a,tv+b,gy+8,CHARWOOD);if((Math.abs(a)===2||Math.abs(b)===2)&&(a+b)%2===0)B(-pr+a,tv+b,gy+9,SPIKES);}
        B(-pr,tv+s,gy+9,BRAZIER);B(-pr,tv-s,gy+9,BANNER);}
      for(let v=-3;v<=3;v++)B(-pr,v,gy+7,ORCLOG);for(const v of [-1,1]){B(-pr,v,gy+6,CHAIN);B(-pr,v,gy+5,CHAIN);}
      for(const v of [-2,2])brazier(-pr+2,v*1.5|0);
      // the fire in the middle: magma in a ring of basalt bricks, a smouldering log, skull poles about it
      for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)B(a,b,g,a||b?BASBRICK:MAGMA);B(0,0,g+1,SMOULDER);
      for(let k=0;k<4;k++){const a=k*1.5708+0.785;pole(Math.round(Math.cos(a)*4),Math.round(Math.sin(a)*4));}
      // the warchief's tent at the back, its door toward the fire, fire baskets either side; the tents of the band round about
      tent(10,0,3,3,4,-1,0,true);brazier(6,-3);brazier(6,3);B(6,0,G(6,0)+1,BONES,MODE_AIR);
      const nt=5+(r()*3|0);for(let k=0;k<nt;k++){const a=Math.PI*0.25+k*(Math.PI*1.5)/(nt-1)+(r()-0.5)*0.15,rd=10.5+r()*1.5,cu=Math.round(Math.cos(a+Math.PI)*rd),cv=Math.round(Math.sin(a+Math.PI)*rd);
        if(cu>6&&Math.abs(cv)<6)continue;const toU=Math.abs(cu)>=Math.abs(cv);tent(cu,cv,2,2,3,toU?-Math.sign(cu):0,toU?0:-Math.sign(cv));}
      // racks of spears, a cage with bones, crates and barrels, heaps of bones
      rack(-6,7,true);rack(-6,-7,true);
      {const cu=2,cv=-12;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const y=G(cu,cv);for(let yy=y+1;yy<=y+3;yy++)if(Math.abs(a)===1||Math.abs(b)===1||yy===y+3)B(cu+a,cv+b,yy,GRATE);}B(cu,cv,G(cu,cv)+1,BONES);}
      for(const [u,v,id] of [[13,-5,CRATE],[13,-4,BARREL],[12,5,CRATE],[13,5,BARREL],[-9,0,BONES],[3,9,BONES]])B(u,v,G(u,v)+1,id,MODE_AIR);
      break;}
    case 'tower':{ // a watchtower: a foot of cracked basalt with a door toward u=-R, a stage of palisade, a platform with spikes under a hide roof
      const stone=()=>{const q=r();return q<0.35?BASCRACK:q<0.8?BASBRICK:CINDER;};
      for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const y=G(a,b),e=Math.abs(a)===2||Math.abs(b)===2;for(let yy=Math.min(y,g)-2;yy<=g;yy++)B(a,b,yy,BASBRICK);
        for(let yy=g+1;yy<=g+6;yy++)B(a,b,yy,e?(a===-2&&b===0&&yy<=g+2?AIR:stone()):AIR);B(a,b,g,e?BASBRICK:BASTILE);}
      for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const e=Math.abs(a)===2||Math.abs(b)===2,c=Math.abs(a)===2&&Math.abs(b)===2;B(a,b,g+7,(a===1&&b===1)?AIR:CHARWOOD);
        for(let yy=g+8;yy<=g+11;yy++)B(a,b,yy,c?ORCLOG:e&&yy<=g+9?ORCIRON:AIR);}
      for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++){const e=Math.abs(a)===3||Math.abs(b)===3;B(a,b,g+12,(a===1&&b===1)?AIR:CHARWOOD);if(e&&(a+b)%2===0)B(a,b,g+13,SPIKES);}
      for(let yy=g+1;yy<=g+12;yy++)B(1,1,yy,CHAIN); // the way up
      for(const [a,b] of [[-3,-3],[3,-3],[-3,3],[3,3]])for(let yy=g+13;yy<=g+15;yy++)B(a,b,yy,ORCLOG);
      for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++){const m=Math.max(Math.abs(a),Math.abs(b));B(a,b,g+16+Math.min(2,3-m),HIDE);}B(0,0,g+19,BANNER);
      B(-3,0,g+13,BRAZIER);B(3,0,g+13,BRAZIER);
      pole(-3,-2);pole(-3,2);
      for(let x=p.X-7;x<=p.X+7;x++)for(let z=p.Z-7;z<=p.Z+7;z++){const dx=x-p.X,dz=z-p.Z,d=Math.hypot(dx,dz),u=-(dx*o.ux+dz*o.uz),v=-dx*o.uz+dz*o.ux;if(d<5.5||d>=6.5||(u<0&&Math.abs(v)<1.5))continue;if(hsh(x,9623,z)<0.7)P(x,gh(x,z)+1,z,STAKES,MODE_AIR);}
      break;}
    case 'forge':{ // a forge yard: a smelter at the back glowing at its mouth, a trough of lava, anvils under an awning hung with chains
      for(let x=p.X-10;x<=p.X+10;x++)for(let z=p.Z-10;z<=p.Z+10;z++)if(Math.hypot(x-p.X,z-p.Z)<=10)P(x,gh(x,z),z,BASTILE);
      // the smelter: five square of basalt bricks banded with ember bricks, a chimney above, magma inside, its mouth toward the yard
      for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const e=Math.abs(a)===2||Math.abs(b)===2,y=G(7+a,b);for(let yy=Math.min(y,g)-2;yy<g;yy++)B(7+a,b,yy,BASBRICK);
        for(let yy=g;yy<=g+9;yy++)B(7+a,b,yy,e?((yy-g)%4===2?EMBRICK:BASBRICK):yy===g?MAGMA:AIR);}
      B(5,0,g+1,AIR);B(5,0,g+2,AIR);B(5,0,g,EMBRICK);
      for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(let yy=g+10;yy<=g+13;yy++)B(7+a,b,yy,a||b?BASCRACK:AIR);B(7,0,g+13,SMOULDER);
      // the trough: lava a block down in basalt bricks, a kerb about it
      for(let a=-3;a<=3;a++)for(let b=-2;b<=1;b++){const u=a,v=-7+b,y=G(u,v),inner=Math.abs(a)<=2&&b>=-1&&b<=0;for(let yy=Math.min(y,g)-3;yy<=g-2;yy++)B(u,v,yy,BASBRICK);
        B(u,v,g-1,inner?LAVA:BASBRICK);B(u,v,g,inner?AIR:BASBRICK);for(let yy=g+1;yy<=Math.max(y,g)+2;yy++)B(u,v,yy,AIR);}
      // the anvils (riveted iron on basalt), the awning on palisade posts with chains hung from it
      for(const [u,v] of [[-1,2],[2,3],[-1,-3]]){const y=G(u,v);B(u,v,y+1,BASBRICK);B(u,v,y+2,ORCIRON);}
      for(const [u,v] of [[-4,-4],[-4,5],[3,-4],[3,5]])for(let yy=Math.min(G(u,v),g)+1;yy<=g+4;yy++)B(u,v,yy,ORCLOG);
      for(let u=-4;u<=3;u++)for(let v=-4;v<=5;v++)B(u,v,g+5,HIDE);for(const [u,v] of [[-2,0],[1,2],[0,-2]])B(u,v,g+4,CHAIN);
      // racks of blades, heaps of slag and scrap, stacks of charred wood, a fence of stakes with its way in toward u=-R
      rack(-7,4,false);rack(-7,-4,false);
      for(const [cu,cv] of [[2,9],[-3,9]])for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const y=G(cu+a,cv+b);B(cu+a,cv+b,y+1,a||b?CINDER:ORCIRON);if(!a&&!b)B(cu,cv,y+2,CINDER);}
      for(let a=0;a<=1;a++)for(let b=0;b<=1;b++)for(let yy=1;yy<=2;yy++)B(8+a,6+b,G(8,6)+yy,CHARWOOD);
      for(let x=p.X-12;x<=p.X+12;x++)for(let z=p.Z-12;z<=p.Z+12;z++){const dx=x-p.X,dz=z-p.Z,d=Math.hypot(dx,dz),u=-(dx*o.ux+dz*o.uz),v=-dx*o.uz+dz*o.ux;if(d<11.5||d>=12.5||(u<0&&Math.abs(v)<2))continue;P(x,gh(x,z)+1,z,STAKES,MODE_AIR);}
      pole(-12,-3,BANNER);pole(-12,3,BANNER);
      break;}
    case 'pit':{ // a fighting pit: four deep, walled in basalt, iron spikes along its rim, cages in its wall, a chain down, poles and fires about it
      const F=g-4;
      for(let x=p.X-9;x<=p.X+9;x++)for(let z=p.Z-9;z<=p.Z+9;z++){const dx=x-p.X,dz=z-p.Z,d=Math.hypot(dx,dz),y=gh(x,z);
        if(d<7){P(x,F-1,z,BASBRICK);P(x,F,z,hsh(x,9625,z)<0.5?CINDER:BLACKASH);for(let yy=F+1;yy<=y+3;yy++)P(x,yy,z,AIR);if(hsh(x,9627,z)<0.06)P(x,F+1,z,BONES);}
        else if(d<8.3){for(let yy=F-1;yy<=g;yy++)P(x,yy,z,hsh(x,yy*7,z)<0.3?BASCRACK:BASBRICK);for(let yy=g+1;yy<=y;yy++)P(x,yy,z,AIR);P(x,g+1,z,SPIKES);}
        else if(d<9.5){for(let yy=y+1;yy<g;yy++)P(x,yy,z,BASBRICK);P(x,g,z,BASTILE);for(let yy=g+1;yy<=y+2;yy++)P(x,yy,z,AIR);}}
      // two cages in the wall, across the pit from each other; the chain down by the front
      for(const s of [-1,1]){for(let k=-1;k<=1;k++){const [x,z]=W(k,s*7);P(x,F+1,z,GRATE);P(x,F+2,z,GRATE);const [x2,z2]=W(k,s*8);P(x2,F+1,z2,AIR);P(x2,F+2,z2,AIR);P(x2,F+3,z2,BASBRICK);}
        const [bx,bz]=W(0,s*8);P(bx,F+1,bz,BONES);}
      {const [x,z]=W(-6,0);for(let yy=F+1;yy<=g;yy++)P(x,yy,z,CHAIN);}
      for(let k=0;k<6;k++){const a=k*1.047+0.52,u=Math.round(Math.cos(a)*10),v=Math.round(Math.sin(a)*10);if(k%2)pole(u,v);else brazier(u,v);}
      pole(-10,-2,BANNER);pole(-10,2,BANNER);
      break;}
  }
}
