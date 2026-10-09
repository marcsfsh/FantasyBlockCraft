// ---- Highlands and cold (M6c, D-041; Q110, Q112, Q114, Q119, Q126, Q132): Alpine Meadows, Glacier Fields, Cloud Forest
// Heights, Karst Crags and Frozen Tundra (the Northern Fells reworked) join the land looks table (FOREST) and the signatures
// (SIGS); the High Mountains gain signatures of their own; waterfalls cascade down steep mountain ground.
function mistP(X,y,Z,r){ // a gnarled mistwood: a leaning trunk, cloudy crowns, leaves trailing below them
  const th=5+(r()*4|0),lx=r()<0.5?1:-1,lz=r()<0.5?1:-1;if(y+th+4>=H)return;PW(X,y-1,Z,DIRT,MODE_SET);
  let x=X,z=Z;for(let i=0;i<th;i++){if(i>2&&i%3===0){if(r()<0.5)x+=lx;else z+=lz;}PW(x,y+i,z,MISTW,MODE_SET);}
  const top=y+th;for(let dx=-3;dx<=3;dx++)for(let dy=-1;dy<=2;dy++)for(let dz=-3;dz<=3;dz++){const d=Math.hypot(dx,dy*1.5,dz);if(d<=3&&!(d>2.4&&r()<0.5))PW(x+dx,top+dy,z+dz,MISTL,MODE_AIR);}
  for(let k=0;k<6;k++){const a=r()*6.283,sx=x+Math.round(Math.cos(a)*2.6),sz=z+Math.round(Math.sin(a)*2.6),len=1+(r()*3|0);for(let t=1;t<=len;t++)PW(sx,top-1-t,sz,MISTL,MODE_AIR);}
}
function karstP(X,y,Z,r){ // a limestone pillar standing out of the turf
  const h=3+(r()*7|0),R=0.9+r()*1.3;for(let yy=y-2;yy<y+h;yy++){const rr=R*(1-0.35*(yy-y)/h),ri=Math.ceil(rr);for(let dx=-ri;dx<=ri;dx++)for(let dz=-ri;dz<=ri;dz++)if(Math.hypot(dx,dz)<=rr)PW(X+dx,yy,Z+dz,LIMESTONE,MODE_SET);}
}
FLOORS.add(TMOSS);
const hiSnow=o=>o.h>SEA+150;
Object.assign(FOREST,{
  alpine:{trees:0.006,tree:(X,y,Z,r)=>spruceP(X,y,Z,r,false),top:o=>hiSnow(o)?SNOWG:o.rid>0.3?STONE:GRASS,
    plant:r=>r<0.04?GENTIAN:r<0.06?EDELW:r<0.2?TGRASS:r<0.24?FLOWY:0},
  glacier:{top:o=>o.dn>0.1?GLACIER:o.dn>-0.2?PSNOW:SNOWG},
  cloud:{trees:0.03,tree:(X,y,Z,r)=>mistP(X,y,Z,r),top:o=>o.dn>-0.1?FMOSS:GRASS,plant:r=>r<0.15?FERN:r<0.153?GLOWSHROOM:r<0.2?TGRASS:0},
  karst:{trees:0.006,tree:(X,y,Z,r)=>{if(hsh(X,8191,Z)<0.65)karstP(X,y,Z,r);else treeP(X,y,Z,LOG,LEAVES,4,r);},top:o=>o.rid>0.18?LIMESTONE:GRASS,
    plant:r=>r<0.1?TGRASS:r<0.12?DBUSH:r<0.125?EDELW:0},
  tundra:{trees:0.004,tree:(X,y,Z,r)=>spruceP(X,y,Z,r,true),top:o=>o.dn>0.25?TMOSS:SNOWG,plant:r=>r<0.05?DBUSH:0}
});
Object.assign(SIGS,{
  alpine:[['hut',"Shepherd's Hut",6],['tarn','Meadow Tarn',10]],
  glacier:[['icetower','Ice-bound Tower',7],['icecave','Ice Cave',9]],
  cloud:[['mistshrine','Mist Shrine',6],['mossfall','Mossy Falls',9]],
  karst:[['hermitage','Cliff Hermitage',7],['sinkhole','Great Sinkhole',8]],
  tundra:[['longhouse','Frozen Longhouse',9],['mounds','Frost Mounds',12]],
  mtn:[['passgate','Gatehouse in a High Pass',8],['tarn','High Tarn',10]]
});
// The great sinkhole stands where a cave passage runs under the stretch, so its shaft always reaches the caves (Q132)
function sinkholeSite(c,L,R){
  const ci=Math.floor(c.x/CS),cj=Math.floor(c.z/CS);
  for(let r=0;r<=5;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){if(Math.max(Math.abs(a),Math.abs(b))!==r)continue;const X0=(ci+a)*CS+8,Z0=(cj+b)*CS+8;colInfo(X0,Z0,TSG);
    if(TSG.area!==L.i||TSG.wet||TSG.river||TSG.rvBot<999)continue;const an=caveAnchor(ci+a,cj+b,TSG.h-95,TSG.h-25,8181);if(!an)continue;colInfo(an.x,an.z,TSG);
    if(TSG.land!==L.i||TSG.wet||TSG.lake||TSG.river||TSG.rvBot<999||surfTaken(an.x,an.z,R+4))continue;return{X:an.x,Z:an.z,g:TSG.h,lo:TSG.h,a:an};}
  return null;
}
// ---- Waterfalls (Q126, Q129): on steep high ground, a spring at the top of a slope cascades down it as shaped still water over a
// stony bed, the steepest way down, to a pool where the ground levels out. One chunk in about thirty in the mountains, alpine
// meadows, cloud forest and karst. Pure and planned from its spring, so every chunk it crosses draws its part.
const FALL_LANDS=new Set(['mtn','alpine','cloud','karst']),fallC=new Map(),TFL={};
function fallAt(WCX,WCZ){
  const key=WCX*65536+WCZ;if(fallC.has(key))return fallC.get(key);if(fallC.size>20000)fallC.clear();
  let f=null;
  if(hsh(WCX,8201,WCZ)<0.035){const X=WCX*CS+4+Math.floor(hsh(WCX,8203,WCZ)*8),Z=WCZ*CS+4+Math.floor(hsh(WCX,8205,WCZ)*8);colInfo(X,Z,TFL);
    if(FALL_LANDS.has(LANDS[TFL.land].k)&&!TFL.wet&&TFL.rvBot===999&&!TFL.river&&!surfTaken(X,Z,4)&&!sigNear(X,Z,4)){
      const path=[[X,Z,TFL.h]];let x=X,z=Z,h=TFL.h,flat=0,drop=0;
      for(let k=0;k<48&&flat<3;k++){let bx=0,bz=0,bh=h;for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const hh=hAt(x+dx,z+dz);if(hh<bh){bh=hh;bx=dx;bz=dz;}}
        if(!bx&&!bz)break;x+=bx;z+=bz;drop+=h-bh;flat=h-bh<=0?flat+1:0;h=bh;colInfo(x,z,TFL);if(TFL.wet||TFL.rvBot<999)break;path.push([x,z,h]);}
      if(drop>=10&&path.length>=6)f={X:X,Z:Z,path:path,end:path[path.length-1]};}}
  fallC.set(key,f);return f;
}
function fallP(f){
  for(const [x,z,h] of f.path){PW(x,h,z,hsh(x,8207,z)<0.5?STONE:GRAVEL,MODE_SET);PW(x,h+1,z,WATER,MODE_SET);for(let y=h+2;y<h+4;y++)PW(x,y,z,AIR,MODE_SET);}
  const [ex,ez,eh]=f.end;for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){const d=Math.hypot(dx,dz);if(d<=2.2){PW(ex+dx,eh,ez+dz,WATER,MODE_SET);PW(ex+dx,eh-1,ez+dz,GRAVEL,MODE_SET);PW(ex+dx,eh+1,ez+dz,AIR,MODE_SET);}else if(d<=3.2)PW(ex+dx,eh,ez+dz,STONE,MODE_SET);}
}
function applyFalls(WCX,WCZ){for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++){const f=fallAt(WCX+a,WCZ+b);if(f)fallP(f);}}
// ---- Builders for the highland signatures (called by sigBuild)
function hiBuild(s,r){
  const X=s.X,Z=s.Z,g=s.g;
  switch(s.kind){
    case 'hut':{ // a shepherd's hut of rough stone with a spruce roof
      sigFloor(X-3,Z-3,X+3,Z+3,g,COBBLE,7);
      for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){const edge=Math.abs(dx)===2||Math.abs(dz)===2;for(let y=g+1;y<=g+3;y++)if(edge&&!(dz===2&&dx===0&&y<=g+2)&&!(y===g+2&&dz===0&&Math.abs(dx)===2))PW(X+dx,y,Z+dz,r()<0.3?MOSSY:COBBLE,MODE_SET);}
      for(let k=0;k<=3;k++)for(let dx=-3;dx<=3;dx++){PW(X+dx,g+4+Math.min(k,3-k),Z-2+k+(k>1?1:0)-1,SPRUCE,MODE_SET);}PW(X-1,g+1,Z-1,BARREL,MODE_SET);break;}
    case 'tarn':{ // a cold tarn under the peaks, gravel at its edge, gentians round it
      const L=s.lo-1;for(const [px,pz,R] of sigPonds(s))sigPond(px,pz,R,L,3,r,GRAVEL);
      for(let k=0;k<14;k++){const a=k/14*6.283,x=Math.round(X+Math.cos(a)*9),z=Math.round(Z+Math.sin(a)*9);PW(x,hAt(x,z)+1,z,k%3?GENTIAN:EDELW,MODE_AIR);}break;}
    case 'icetower':{ // a round tower of old stone, bound to half its height in glacier ice
      for(let y=g-2;y<=g+12;y++)for(let dx=-5;dx<=5;dx++)for(let dz=-5;dz<=5;dz++){const d=Math.hypot(dx,dz);
        if(d<=3.3&&d>2.2&&!(y>g+9&&r()<0.4))PW(X+dx,y,Z+dz,SBRICK,MODE_SET);else if(d<=2.2&&y>g)PW(X+dx,y,Z+dz,AIR,MODE_SET);
        else if(d<=5-(y-g)*0.45&&d>3.3&&y<=g+8)PW(X+dx,y,Z+dz,r()<0.85?GLACIER:PSNOW,MODE_SET);}
      PW(X,g,Z,SBRICK,MODE_SET);break;}
    case 'icecave':{ // a dome of ice with a hollow inside and a low way in
      for(let dx=-9;dx<=9;dx++)for(let dz=-9;dz<=9;dz++)for(let dy=-1;dy<=7;dy++){const d=Math.hypot(dx,dy*1.25,dz);if(d>8.5)continue;
        const hollow=Math.hypot(dx,dy*1.4,dz)<4.6&&dy>=0,tunnel=dz>0&&Math.abs(dx)<=1&&dy>=0&&dy<=2;PW(X+dx,g+dy,Z+dz,hollow||tunnel?AIR:d>7.6?PSNOW:GLACIER,MODE_SET);}
      PW(X,g-1,Z,PSNOW,MODE_SET);break;}
    case 'mistshrine':{ // a shrine on a crag in the mist: mossy pillars, a cold lantern, mistwood leaves hanging from the lintel
      sigFloor(X-3,Z-3,X+3,Z+3,g,MOSSY,7);
      for(const [a,b] of [[-2,-2],[2,-2],[-2,2],[2,2]])for(let y=g+1;y<=g+4;y++)PW(X+a,y,Z+b,r()<0.5?MOSSY:COBBLE,MODE_SET);
      for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)if(Math.abs(dx)===2||Math.abs(dz)===2){PW(X+dx,g+5,Z+dz,SBRICK,MODE_SET);if(r()<0.35)PW(X+dx,g+4,Z+dz,MISTL,MODE_AIR);}
      PW(X,g+1,Z,STONE,MODE_SET);PW(X,g+2,Z,DLANTERN,MODE_SET);break;}
    case 'mossfall':{ // a mossy crag with a fall pouring from its lip into a pool at its foot
      const top=g+10;for(let y=g-2;y<=top;y++)for(let dx=-7;dx<=0;dx++)for(let dz=-4;dz<=4;dz++){const d=Math.hypot(dx+3.5,dz);if(d<=4.4-(y-g)*0.08)PW(X+dx,y,Z+dz,hsh(X+dx,y,Z+dz)<0.45?MOSSY:STONE,MODE_SET);}
      const L=s.lo-1;for(const [px,pz,R] of sigPonds(s))sigPond(px,pz,R,L,2,r,FMOSS);
      for(let y=L+1;y<=top;y++){PW(X+1,y,Z,WATER,MODE_SET);}PW(X,top,Z,WATER,MODE_SET);PW(X-1,top,Z,WATER,MODE_SET);
      for(let k=0;k<5;k++)PW(X-3+((r()*4)|0),top+1,Z-2+((r()*4)|0),FERN,MODE_AIR);break;}
    case 'hermitage':{ // a hermit's cell cut into a limestone crag: a room at the foot, a ladder to a lookout room above
      const top=g+13;for(let y=g-2;y<=top;y++)for(let dx=-5;dx<=5;dx++)for(let dz=-5;dz<=5;dz++){const d=Math.hypot(dx,dz)+fbm2((X+dx)/4,y/4,1,8211.3)*0.8;if(d<=5-(y-g)*0.12)PW(X+dx,y,Z+dz,LIMESTONE,MODE_SET);}
      for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){for(let y=g+1;y<=g+3;y++)PW(X+dx,y,Z+dz,AIR,MODE_SET);for(let y=g+7;y<=g+9;y++)PW(X+dx,y,Z+dz,AIR,MODE_SET);PW(X+dx,g,Z+dz,PLANKS,MODE_SET);}
      for(let dz=2;dz<=6;dz++)for(let y=g+1;y<=g+2;y++)PW(X,y,Z+dz,AIR,MODE_SET);for(let dx=2;dx<=6;dx++)PW(X+dx,g+8,Z,AIR,MODE_SET);
      for(let y=g+1;y<=g+8;y++)PW(X-1,y,Z-1,LADDER,MODE_SET); // the ladder climbs a shaft cut through the rock between the rooms
      PW(X+1,g+1,Z-1,BARREL,MODE_SET);PW(X+1,g+7,Z+1,DLANTERN,MODE_SET);break;}
    case 'sinkhole':{ // a round shaft down to a cave passage, a ledge winding down its wall, a rim of bare limestone
      const a=s.a,R=4.5;
      for(let y=a.y;y<=g+4;y++)for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++){const d=Math.hypot(dx,dz);if(d<=R)PW(X+dx,y,Z+dz,AIR,MODE_SET);else if(d<=R+1.2&&y>=g-6)PW(X+dx,y,Z+dz,y>g?AIR:LIMESTONE,MODE_STONE);}
      for(let y=g;y>a.y;y--){const t=(g-y)*0.27;for(const rr of [3.4,4.2]){const x=Math.round(X+Math.cos(t)*rr),z=Math.round(Z+Math.sin(t)*rr);PW(x,y-1,z,LIMESTONE,MODE_SET);}}
      for(let dx=-7;dx<=7;dx++)for(let dz=-7;dz<=7;dz++){const d=Math.hypot(dx,dz);if(d>R+0.5&&d<=7)PW(X+dx,hAt(X+dx,Z+dz),Z+dz,LIMESTONE,MODE_SET);}break;}
    case 'longhouse':{ // a longhouse of spruce on a stone footing, half drifted over with snow
      sigFloor(X-7,Z-3,X+7,Z+3,g,PLANKS,8);
      for(let dx=-6;dx<=6;dx++)for(let dz=-3;dz<=3;dz++){const edge=Math.abs(dx)===6||Math.abs(dz)===3;if(!edge)continue;PW(X+dx,g+1,Z+dz,COBBLE,MODE_SET);
        for(let y=g+2;y<=g+3;y++)if(!(dx===-6&&dz===0)&&!(y===g+3&&dz===3&&dx%3===0))PW(X+dx,y,Z+dz,SPRUCE,MODE_SET);}
      PW(X-6,g+1,Z,AIR,MODE_SET);
      for(let k=0;k<=3;k++)for(let dx=-7;dx<=7;dx++)for(const side of [-1,1]){PW(X+dx,g+4+k,Z+side*(3-k),k===3?SPRUCE:PLANKS,MODE_SET);if(r()<0.6)PW(X+dx,g+5+k,Z+side*(3-k),PSNOW,MODE_AIR);}
      for(let dz=-4;dz<=4;dz++)for(let y=g+1;y<=g+2+((dz+4)%3===0?1:0);y++)PW(X-8,y,Z+dz,PSNOW,MODE_AIR);
      PW(X+5,g+1,Z+2,BARREL,MODE_SET);PW(X+5,g+1,Z-2,CHEST,MODE_SET);break;}
    case 'mounds':{ // frost mounds: domes of earth heaved up by the ice under them, one split open on its core of ice
      for(let k=0;k<5;k++){const a=k*1.37+hsh(X,8213+k,Z),d=k?6+k:0,mx=Math.round(X+Math.cos(a)*d),mz=Math.round(Z+Math.sin(a)*d),R=2.5+hsh(X,8221+k,Z)*2.5,Hh=Math.round(R*0.9),mg=hAt(mx,mz);
        for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++){const dd=Math.hypot(dx,dz);if(dd>R)continue;const hh=Math.round(Hh*Math.sqrt(1-dd*dd/(R*R)));
          for(let y=mg;y<=mg+hh;y++){const open=k===0&&dx>0&&dd<R-1;PW(mx+dx,y,mz+dz,y===mg+hh?(open?GLACIER:SNOWG):open&&dd<R-1.6?GLACIER:DIRT,MODE_SET);}}}break;}
    case 'passgate':{ // a ruined gatehouse across a high pass: two towers and the arch that joined them
      for(const side of [-1,1]){const tx=X+side*4;sigFloor(tx-1,Z-1,tx+1,Z+1,g,SBRICK,10);
        for(let y=g+1;y<=g+9;y++)for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){if(!dx&&!dz)continue;if(y>g+6&&r()<0.35)continue;PW(tx+dx,y,Z+dz,r()<0.25?MOSSY:SBRICK,MODE_SET);}}
      for(let dx=-3;dx<=3;dx++){if(Math.abs(dx)<=1&&r()<0.5)continue;PW(X+dx,g+7,Z,SBRICK,MODE_SET);PW(X+dx,g+7,Z+1,SBRICK,MODE_SET);}break;}
  }
}
