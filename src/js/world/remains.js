// ---- Remains of other peoples in the deep (Q10, Q70, D-024): goblin warrens, gnome workshops, drow halls and older, nameless
// ruins, built on the floor of a natural deep cavern away from the holds. Some are only leftovers: a few walls in a cave.
// One site at most per region of REM_REG x REM_REG chunks; a site is rebuilt from its region by every chunk it touches.
const REM_REG=10,REM_KINDS=[['warren',3],['workshop',2.5],['drow',2],['nameless',2.5]];
const REM_TITLE={warren:'Goblin Warren',workshop:'Gnome Workshop',drow:'Drow Hall',nameless:'Nameless Ruins'};
const remC=new Map();
function remainsAt(rx,rz){
  const key=ckey(rx,rz);if(remC.has(key))return remC.get(key);if(remC.size>4000)remC.clear();
  let s=null;const r=rngAt(rx,6501,rz);
  if(r()<0.32){
    let tot=0;for(const k of REM_KINDS)tot+=k[1];let v=r()*tot,kind=REM_KINDS[0][0];for(const k of REM_KINDS){v-=k[1];if(v<=0){kind=k[0];break;}}
    const left=r()<0.4,seed=r(),span=REM_REG*CS-56;
    for(let t=0;t<8&&!s;t++){
      const X=rx*REM_REG*CS+28+(r()*span|0),Z=rz*REM_REG*CS+28+(r()*span|0),lowFirst=r()<0.5;
      if(holdReach(holdNear(Math.floor(X/CS),Math.floor(Z/CS)),X/CS-0.5,Z/CS-0.5)<1.9)continue;
      // a cavern floor with room above it: the lower tier (dry) or the upper tier above the lake level
      for(const [lo,hi] of lowFirst?[[20,50],[DEEP_WL+3,94]]:[[DEEP_WL+3,94],[20,50]]){if(s)break;
        for(let y=lo;y<=hi;y++){if(!deepOpenAt(X,y,Z)||deepOpenAt(X,y-1,Z)||deepRiverAt(X,y,Z))continue;
          let room=true;for(let k=1;k<=6&&room;k++)if(!deepOpenAt(X,y+k,Z))room=false;
          if(room){s={kind:kind,left:left,X:X,Z:Z,y:y,seed:seed};break;}}}
    }
    if(s){const rr=mkRng(Math.floor(s.seed*1e9)+7);
      const n=s.kind==='warren'?'The Warren of '+nameWord('goblin',rr):s.kind==='workshop'?'The Workshop of '+fullName('gnome',rr,false):s.kind==='drow'?'The Hall of House '+nameWord('drow',rr):'Nameless Ruins';
      s.name=s.left?(s.kind==='nameless'?'Scattered Nameless Ruins':'Remains of a '+REM_TITLE[s.kind]):n;}
  }
  remC.set(key,s);return s;
}
function remainsNear(X,Y,Z){
  const rx=Math.floor(X/CS/REM_REG),rz=Math.floor(Z/CS/REM_REG);
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const s=remainsAt(rx+a,rz+b);if(s&&Math.abs(X-s.X)<=16&&Math.abs(Z-s.Z)<=16&&Y>=s.y-3&&Y<=s.y+10)return s;}
  return null;
}
function applyRemains(WCX,WCZ){
  const seen=new Set();
  for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const rx=Math.floor((WCX+a)/REM_REG),rz=Math.floor((WCZ+b)/REM_REG),k=rx+','+rz;if(seen.has(k))continue;seen.add(k);
    const s=remainsAt(rx,rz);if(!s||s.X+20<gx0||s.X-20>gx0+CS||s.Z+20<gz0||s.Z-20>gz0+CS)continue;buildRemains(s);}
}
function buildRemains(s){
  const r=mkRng(Math.floor(s.seed*1e9)+11),X=s.X,Z=s.Z,y=s.y,left=s.left;
  // leftovers keep only part of what was built, the same in every chunk (by position)
  const keepP=left?0.35:0.93,put=(x,yy,z,id)=>{if(hsh(x,yy*7+3,z)<keepP)PW(x,yy,z,id,MODE_SET);};
  // a floor block that never floats: anything open under it is filled with rock, a few blocks down
  const floor=(x,z,id)=>{PW(x,y-1,z,id,MODE_SET);for(let d=2;d<=8;d++){const c=GW(x,y-d,z);if(c<0||SOLID[c])break;PW(x,y-d,z,d<3?id:STONE,MODE_SET);}};
  const clear=(x,z,h)=>{for(let k=0;k<h;k++)PW(x,y+k,z,AIR,MODE_SET);};
  if(s.kind==='warren'){
    // a round central burrow with a fire pit, and side burrows on low tunnels
    const dig=(cx,cz,R,H)=>{for(let dx=-Math.ceil(R);dx<=Math.ceil(R);dx++)for(let dz=-Math.ceil(R);dz<=Math.ceil(R);dz++){const d=Math.hypot(dx,dz)/R;if(d>1)continue;
      floor(cx+dx,cz+dz,hsh(cx+dx,y,cz+dz)<0.5?DIRT:hsh(cx+dx,y+1,cz+dz)<0.5?GRAVEL:COBBLE);clear(cx+dx,cz+dz,Math.max(2,Math.round(H*Math.sqrt(1-d*d))));}};
    dig(X,Z,4.5,4);
    for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(a||b)put(X+a,y,Z+b,COBBLE);put(X,y-1,Z,GRAVEL);put(X,y,Z,DTORCH);
    const n=3+(r()*3|0),a0=r()*6.283;
    for(let k=0;k<n;k++){const ang=a0+k*6.283/n+(r()-0.5)*0.6,dist=9+r()*4,cx=X+Math.round(Math.cos(ang)*dist),cz=Z+Math.round(Math.sin(ang)*dist),R=2.5+r();
      for(let t=4;t<=dist-R+1;t++){const tx=X+Math.round(Math.cos(ang)*t),tz=Z+Math.round(Math.sin(ang)*t);for(const [p,q] of [[0,0],[1,0],[0,1]]){floor(tx+p,tz+q,DIRT);clear(tx+p,tz+q,2);}}
      dig(cx,cz,R,3);
      for(let m=0;m<3;m++){const fx=cx+((r()*3|0)-1),fz=cz+((r()*3|0)-1),q=r();put(fx,y,fz,q<0.2?BARREL:q<0.35?CRATE:q<0.55?BONES:q<0.7?WOOLK:q<0.8?LOG:q<0.9?GLOWSHROOM:PLANKS);}
      if(r()<0.5)PW(cx,y+1,cz+1,COBWEB,MODE_AIR);}
  }else if(s.kind==='workshop'){
    // two small brick rooms with low doors, copper pipes under the roof, benches and stores
    const ax=r()<0.5,L=6,Wd=4,P=(u,v)=>ax?[X+u,Z+v]:[X+v,Z+u];
    for(let u=-L;u<=L;u++)for(let v=-Wd;v<=Wd;v++){const [x,z]=P(u,v),edge=Math.abs(u)===L||Math.abs(v)===Wd||u===0;
      floor(x,z,PLANKS);
      for(let k=0;k<4;k++){let id=edge?BRICK:AIR;
        if(edge&&k===1&&Math.abs(v)===Wd&&(u===-3||u===3))id=GLASS;                     // windows
        if(edge&&k<2&&((u===0&&v===0)||(Math.abs(u)===L&&v===0)))id=AIR;                 // doors, two blocks high
        if(id===AIR)PW(x,y+k,z,AIR,MODE_SET);else put(x,y+k,z,id);}
      put(x,y+4,z,BRICK);if(!edge&&v===Wd-1)put(x,y+3,z,COPB);}
    const furn=[[FURN,-5,-3],[FURN,-4,-3],[BOOKS,-2,-3],[BOOKS,-1,-3],[GLASS,-5,3],[BARREL,-1,3],[CRATE,2,3],[BRASB,4,-3],[COPB,5,-3],[BARREL,5,3],[BOOKS,2,-3]];
    for(const [id,u,v] of furn){const [x,z]=P(u,v);put(x,y,z,id);}
    {const [x,z]=P(3,0);put(x,y+3,z,LANTERN);}{const [x,z]=P(-3,0);put(x,y+3,z,LANTERN);}
  }else if(s.kind==='drow'){
    // a long dark hall: obsidian walls, pillars capped with amethyst, black banners, an altar with a crystal; open at both ends
    const ax=r()<0.5,L=10,Wd=4,Ht=7,P=(u,v)=>ax?[X+u,Z+v]:[X+v,Z+u];
    for(let u=-L;u<=L;u++)for(let v=-Wd;v<=Wd;v++){const [x,z]=P(u,v),side=Math.abs(v)===Wd,end=Math.abs(u)===L;
      floor(x,z,v===0?AMETH:DEEP);
      for(let k=0;k<Ht;k++){if(side&&!(Math.abs(u)<=1&&k<3))put(x,y+k,z,k===Ht-1?OBSID:hsh(x,y+k,z)<0.6?OBSID:DEEP);else if(end&&Math.abs(v)>1)put(x,y+k,z,OBSID);else PW(x,y+k,z,AIR,MODE_SET);}
      if(side&&u%4===2&&!left)PW(x,y+3,z,WOOLK,MODE_SET);
      if(!side&&!end&&Math.abs(v)===Wd-1&&u%4===0){for(let k=0;k<Ht-1;k++)put(x,y+k,z,OBSID);put(x,y+Ht-1,z,AMETH);}}
    {const [x,z]=P(L-2,0);put(x,y,z,OBSID);put(x,y+1,z,CRYSTAL);const [x2,z2]=P(L-2,1);put(x2,y,z2,GLOWMOSS);const [x3,z3]=P(L-2,-1);put(x3,y,z3,GLOWMOSS);}
    for(let k=0;k<6;k++){const u=(r()*(2*L-2)|0)-L+1,v=r()<0.5?-(Wd-1):Wd-1,[x,z]=P(u,v);PW(x,y+Ht-2,z,COBWEB,MODE_AIR);}
  }else{
    // older than the holds: weathered columns in a grid, a low broken wall, a dais with a glowing stone, half buried in gravel
    for(let a=-9;a<=9;a++)for(let b=-9;b<=9;b++){const m=Math.max(Math.abs(a),Math.abs(b));if(m<=9)floor(X+a,Z+b,m<=2?CALCITE:hsh(X+a,y,Z+b)<0.5?SBRICK:MOSSY);
      if(m===9&&hsh(X+a,y+2,Z+b)<0.7)put(X+a,y,Z+b,hsh(X+a,y+4,Z+b)<0.5?MOSSY:SBRICK);}
    for(let a=-6;a<=6;a+=6)for(let b=-6;b<=6;b+=6){if(!a&&!b)continue;const hgt=2+(r()*6|0);for(let k=0;k<hgt;k++)put(X+a,y+k,Z+b,k%3===2?SBRICK:CALCITE);}
    for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)put(X+a,y,Z+b,CALCITE);PW(X,y+1,Z,RUNE,MODE_SET);
    for(let k=0;k<5;k++){const gx=X+(r()*17|0)-8,gz=Z+(r()*17|0)-8,R=1+r()*2;for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++){const hgt=Math.round(R-Math.hypot(a,b));for(let j=0;j<hgt;j++)PW(gx+a,y+j,gz+b,GRAVEL,MODE_AIR);}}
  }
}
