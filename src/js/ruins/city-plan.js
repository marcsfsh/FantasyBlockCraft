// ---- Ancient dwarven undercity: a grid of halls and corridors on two levels, one cell per chunk
const RUIN_Y=[64,82],DEEPY=150;
const ROOM_TYPES=[['hall',2.6],['forge',1.4],['archive',1.2],['barracks',1.3],['vault',0.5],['storage',1.4],['crypt',1.1],['machine',0.9],['farm',0.8],['collapsed',1.6],['throne',0.3],['junction',2.2]];
// Districts give each part of the undercity a purpose
const DISTRICTS={
  residential:{rooms:[['kitchen',1.4],['cistern',0.6],['chasm',0.6],['quarters',3],['office',1.6],['tavern',2],['bath',1],['games',1.1],['archive',1],['storage',1],['junction',1.4],['farm',1],['collapsed',0.9]],megas:['grandlibrary','greathall','gardens']},
  industrial:{rooms:[['cistern',0.8],['armory',0.6],['chasm',1.6],['forge',2.6],['minehall',2.5],['machine',2],['storage',2],['barracks',1],['office',1],['junction',1.4],['collapsed',1.1]],megas:['quarry','foundry']},
  sacred:{rooms:[['statuary',1.2],['cistern',0.5],['chasm',0.7],['shrine',3],['crypt',3],['archive',1.4],['quarters',1],['farm',1],['junction',1.4],['collapsed',0.9]],megas:['temple']},
  royal:{rooms:[['armory',1.2],['statuary',1],['chasm',1.2],['hall',3],['vault',1.2],['throne',0.6],['barracks',1.5],['office',1.5],['arena',1.5],['tavern',1],['junction',1]],megas:['greathall','grandthrone','temple','colosseum']}
};
function districtOf(cx,cz){const v=fbm2(cx/7,cz/7,2,919.3);return v<-0.1?'sacred':v<0.03?'residential':v<0.15?'industrial':'royal';}
const ROOM_HALF={cistern:7,kitchen:7,armory:7,statuary:7,avenue:7,plaza:7,minehall:7,chasm:7,hall:7,forge:7,archive:7,barracks:7,vault:7,storage:7,crypt:7,machine:7,farm:7,collapsed:7,throne:7,junction:7,stair:7,quarters:7,office:7,tavern:7,bath:7,games:7,arena:7,shrine:7,mineworks:7};
const ROOM_H={cistern:10,kitchen:8,armory:8,statuary:11,avenue:12,plaza:12,minehall:10,chasm:9,hall:13,forge:10,archive:10,barracks:8,vault:7,storage:8,crypt:9,machine:11,farm:8,collapsed:10,throne:14,junction:9,stair:8,quarters:8,office:8,tavern:9,bath:9,games:9,arena:11,shrine:12,mineworks:4};
const RUIN_NAMES={gardens:'The Royal Gardens',colosseum:'The Great Arena',cistern:'Dwarven Cistern',kitchen:'Dwarven Kitchens',armory:'Dwarven Armory',statuary:'Hall of the Ancestors',delf:'The Hall of a Thousand Pillars',avenue:'Dwarven Avenue',plaza:'Dwarven Plaza',minehall:'Dwarven Mine Hall',junction:'Dwarven Gallery',chasm:'Bridge over the Deep',gate:'Dwarven Gate',hall:'Dwarven Great Hall',forge:'Dwarven Forge',archive:'Dwarven Archive',barracks:'Dwarven Barracks',vault:'Dwarven Treasury',storage:'Dwarven Storehouse',crypt:'Dwarven Crypt',machine:'Dwarven Machine Hall',farm:'Dwarven Mushroom Farm',collapsed:'Collapsed Chamber',throne:'Dwarven Throne Room',junction:'Dwarven Crossroads',stair:'Dwarven Stairwell',
  quarters:'Dwarven Sleeping Quarters',office:'Dwarven Counting House',tavern:'Dwarven Alehouse',bath:'Dwarven Bathhouse',games:'Dwarven Games Hall',arena:'Dwarven Sparring Pit',shrine:'Dwarven Shrine',mineworks:'Dwarven Mine Works',
  greathall:'The Colossal Hall',grandthrone:'The King\u2019s Throne Hall',foundry:'Dwarven Grand Foundry',temple:'Dwarven Grand Temple',grandlibrary:'Dwarven Grand Library',quarry:'Dwarven Deep Quarry'};
const megaC=new Map();
function megaAt(cx,cz,L){
  const ax=cx-(((cx%2)+2)%2),az=cz-(((cz%2)+2)%2),key=ckey(ax,az)*2+L;
  if(megaC.has(key))return megaC.get(key);if(megaC.size>20000)megaC.clear();
  let m=null;
  if(hsh(ax,L*97+900,az)<0.24&&!inDelf(ax,az)&&!inDelf(ax+1,az)&&!inDelf(ax,az+1)&&!inDelf(ax+1,az+1)&&!isAvenue(ax,az)&&!isAvenue(ax+1,az)&&!isAvenue(ax,az+1)&&!isAvenue(ax+1,az+1)&&ruinActive(ax,az,L)&&ruinActive(ax+1,az,L)&&ruinActive(ax,az+1,L)&&ruinActive(ax+1,az+1,L)){
    const opts=DISTRICTS[districtOf(ax,az)].megas;let tp=opts[Math.floor(hsh(ax,L*97+901,az)*opts.length)];
    if(tp==='quarry'&&L!==0)tp='foundry';
    m={tp:tp,ax:ax,az:az,x0:ax*CS+1,x1:ax*CS+31,z0:az*CS+1,z1:az*CS+31,cx:ax*CS+16,cz:az*CS+16};
  }
  megaC.set(key,m);return m;
}
const ruinZoneC=new Map();
function ruinZone(cx,cz){const k=ckey(cx,cz);let v=ruinZoneC.get(k);if(v===undefined){if(ruinZoneC.size>20000)ruinZoneC.clear();v=fbm2(cx/9,cz/9,2,909.1)>-0.1;ruinZoneC.set(k,v);}return v;}
const md=(a)=>((a%6)+6)%6;
// ---- Street plan per hold: winding avenues from each hold edge to a central plaza
const planC=new Map();
const edgeOffE=(hx,hz)=>1+Math.floor(hsh(hx,1502,hz)*6),edgeOffS=(hx,hz)=>1+Math.floor(hsh(hx,1503,hz)*6);
const edgeSkipE=(hx,hz)=>hsh(hx,1504,hz)<0.12,edgeSkipS=(hx,hz)=>hsh(hx,1505,hz)<0.12;
function holdPlan(hx,hz){
  const key=ckey(hx,hz);let p=planC.get(key);if(p)return p;if(planC.size>4000)planC.clear();
  const r=rngAt(hx,1501,hz),cells=new Set(),hubx=hx*8+2+(r()*4|0),hubz=hz*8+2+(r()*4|0);
  const walk=(x,z)=>{const hf=r()<0.5;let cx=x,cz=z;cells.add(cx+','+cz);
    const stepX=()=>{while(cx!==hubx){cx+=Math.sign(hubx-cx);cells.add(cx+','+cz);}},stepZ=()=>{while(cz!==hubz){cz+=Math.sign(hubz-cz);cells.add(cx+','+cz);}};
    if(hf){stepX();stepZ();}else{stepZ();stepX();}};
  if(!edgeSkipE(hx,hz))walk(hx*8+7,hz*8+edgeOffE(hx,hz));
  if(!edgeSkipE(hx-1,hz))walk(hx*8,hz*8+edgeOffE(hx-1,hz));
  if(!edgeSkipS(hx,hz))walk(hx*8+edgeOffS(hx,hz),hz*8+7);
  if(!edgeSkipS(hx,hz-1))walk(hx*8+edgeOffS(hx,hz-1),hz*8);
  cells.add(hubx+','+hubz);
  p={cells:cells,hub:hubx+','+hubz};planC.set(key,p);return p;
}
function isAvenue(cx,cz){if(!ruinZone(cx,cz))return false;return holdPlan(Math.floor(cx/8),Math.floor(cz/8)).cells.has(cx+','+cz);}
function aveLinks(cx,cz){return(isAvenue(cx+1,cz)?1:0)+(isAvenue(cx-1,cz)?2:0)+(isAvenue(cx,cz+1)?4:0)+(isAvenue(cx,cz-1)?8:0);}
function isHub(cx,cz){return ruinZone(cx,cz)&&holdPlan(Math.floor(cx/8),Math.floor(cz/8)).hub===cx+','+cz;}
function isPlaza(cx,cz){if(!isAvenue(cx,cz))return false;if(isHub(cx,cz))return true;const l=aveLinks(cx,cz);return((l&1)+(l>>1&1)+(l>>2&1)+(l>>3&1))>=3;}
function ruinActive(cx,cz,L){return ruinZone(cx,cz)&&(isAvenue(cx,cz)||hsh(cx,L*97+1,cz)<0.82);}
function stairAt(cx,cz){return !inDelf(cx,cz)&&isHub(cx,cz)&&isAvenue(cx,cz)&&hsh(cx,333,cz)<0.85;}
// How decayed this part of the city is (0 = kept up, 1 = falling apart)
function ruinI(cx,cz){return 0.55+0.45*sstep(-0.25,0.15,fbm2(cx/5,cz/5,2,1777.3));}
// Room footprint and floor offset vary per cell
const SMALLOK=new Set(['office','shrine','crypt','bath','archive','barracks','junction','farm']);
function cellShape(cx,cz,L,t){
  let h=7,yo=0;
  if(SMALLOK.has(t)&&hsh(cx,L*97+61,cz)<0.5){h=5;const q=hsh(cx,L*97+62,cz);yo=q<0.25?-2:q<0.5?2:0;}
  const hv=hsh(cx,L*97+63,cz);let hh=(ROOM_H[t]||9)+(hv<0.3?-1:hv>0.7?2:0);if(h===5)hh=Math.min(hh,9);
  return{h:h,yo:yo,hh:hh};
}
function atriumAt(cx,cz){return ruinActive(cx,cz,0)&&ruinActive(cx,cz,1)&&!isAvenue(cx,cz)&&!megaAt(cx,cz,0)&&!megaAt(cx,cz,1)&&!inDelf(cx,cz)&&hsh(cx,1601,cz)<0.15;}
function holeAt(cx,cz){return !inDelf(cx,cz)&&!atriumAt(cx,cz)&&ruinActive(cx,cz,0)&&ruinActive(cx,cz,1)&&!isAvenue(cx,cz)&&!megaAt(cx,cz,0)&&!megaAt(cx,cz,1)&&ruinI(cx,cz)>0.45&&hsh(cx,1603,cz)<0.25;}
function inRuin(X,Y,Z){
  if(Y<58&&Y>12&&inMineCell(X,Y,Z))return true;
  const cx=Math.floor(X/CS),cz=Math.floor(Z/CS);if(!ruinZone(cx,cz))return false;
  for(let L=0;L<2;L++){const yb=RUIN_Y[L];if(Y<yb-13||Y>yb+17)continue;const t=ruinType(cx,cz,L);if(!t)continue;
    if(L===0&&(atriumAt(cx,cz)||inDelf(cx,cz))&&Y>=yb-4&&Y<=RUIN_Y[0]+33)return true;
    if(L===0&&atriumAt(cx,cz)&&Y>=yb-4&&Y<=RUIN_Y[1]+12)return true;
    const m=megaAt(cx,cz,L);if(m)return Y>=yb-13&&Y<=yb+16;if(Y>=yb-4&&Y<=yb+(ROOM_H[t]||9)+5)return true;if(Y>=yb-2&&Y<=yb+(ROOM_H[t]||9)+1)return true;if(t==='minehall'&&Y>=yb-13)return true;}
  if(stairAt(cx,cz)&&Y>=RUIN_Y[0]-1&&Y<=RUIN_Y[1]+6)return true;
  return false;
}
function ruinType(cx,cz,L){
  if(inDelf(cx,cz))return L===0?'delf':null;
  if(!ruinActive(cx,cz,L))return null;
  if(isPlaza(cx,cz))return 'plaza';if(isAvenue(cx,cz))return 'avenue';
  const m=megaAt(cx,cz,L);if(m)return m.tp;
  const list=DISTRICTS[districtOf(cx,cz)].rooms;let tot=0;for(const t of list)tot+=t[1];let v=hsh(cx,L*97+5,cz)*tot;for(const t of list){v-=t[1];if(v<=0)return t[0]==='chasm'&&L===1&&ruinActive(cx,cz,0)?'junction':t[0];}return 'junction';
}
const DIRS4=[[1,0],[0,1],[-1,0],[0,-1]],forcedC=new Map();
const dirIdx=(dx,dz)=>dx===1?0:dz===1?1:dx===-1?2:3;
function forcedDir(cx,cz,L){
  const key=ckey(cx,cz)*2+L;if(forcedC.has(key))return forcedC.get(key);if(forcedC.size>40000)forcedC.clear();
  let res=-1;
  if(ruinActive(cx,cz,L)&&!isAvenue(cx,cz)&&!inDelf(cx,cz)&&!megaAt(cx,cz,L)){
    let any=false;for(const [dx,dz] of DIRS4)if(edgeBase(cx,cz,dx,dz,L)&&!northBlocked(cx,cz,cx+dx,cz+dz,L)){any=true;break;}
    if(!any){const st=Math.floor(hsh(cx,L*97+300,cz)*4);for(let k=0;k<4;k++){const d=(st+k)%4,[dx,dz]=DIRS4[d];if(ruinActive(cx+dx,cz+dz,L)&&!inDelf(cx+dx,cz+dz)&&!northBlocked(cx,cz,cx+dx,cz+dz,L)){res=d;break;}}}
  }
  forcedC.set(key,res);return res;
}
const avC=new Map(),AVR=9;
const NO_NORTH=new Set(['hall','throne','shrine','crypt']);
function noNorth(cx,cz,L){return !megaAt(cx,cz,L)&&!(L===0&&inDelf(cx,cz))&&NO_NORTH.has(ruinType(cx,cz,L));}
function northBlocked(ax,az,bx,bz,L){return (bz===az-1&&noNorth(ax,az,L))||(bz===az+1&&noNorth(bx,bz,L));}
function cellLink(ax,az,bx,bz,L){ // can two neighbouring cells ever be joined?
  if(northBlocked(ax,az,bx,bz,L))return false;
  if(L===1&&(inDelf(ax,az)||inDelf(bx,bz)))return false;
  return ruinActive(ax,az,L)&&ruinActive(bx,bz,L)||(L===0&&(inDelf(ax,az)&&ruinActive(bx,bz,0)||inDelf(bx,bz)&&ruinActive(ax,az,0)));
}
function avDist(cx,cz,L){
  const key=ckey(cx,cz)*2+L;if(avC.has(key))return avC.get(key);if(avC.size>60000)avC.clear();
  let res=99;
  if(isAvenue(cx,cz)&&ruinActive(cx,cz,L)&&!(L===0&&inDelf(cx,cz)))res=0;
  else{const seen=new Set([cx+','+cz]);let fr=[[cx,cz]];
    for(let d=1;d<=AVR&&res===99&&fr.length;d++){const nf=[];
      for(const [x,z] of fr)for(const [dx,dz] of DIRS4){const nx=x+dx,nz=z+dz,k=nx+','+nz;if(seen.has(k)||!cellLink(x,z,nx,nz,L))continue;seen.add(k);
        if(isAvenue(nx,nz)&&ruinActive(nx,nz,L)&&!(L===0&&inDelf(nx,nz))){res=d;break;}nf.push([nx,nz]);}
      fr=nf;}}
  avC.set(key,res);return res;
}
const downC=new Map();
function downDir(cx,cz,L){
  const key=ckey(cx,cz)*2+L;if(downC.has(key))return downC.get(key);if(downC.size>60000)downC.clear();
  let res=-1;const d=avDist(cx,cz,L);
  if(d>0&&d<99&&!(L===0&&inDelf(cx,cz))){const st=Math.floor(hsh(cx,L*97+301,cz)*4);
    for(let k=0;k<4;k++){const i=(st+k)%4,[dx,dz]=DIRS4[i];if(cellLink(cx,cz,cx+dx,cz+dz,L)&&avDist(cx+dx,cz+dz,L)===d-1){res=i;break;}}}
  downC.set(key,res);return res;
}
function edgeOpen(cx,cz,dx,dz,L){
  if(northBlocked(cx,cz,cx+dx,cz+dz,L))return false;
  if(edgeBase(cx,cz,dx,dz,L))return true;
  if(!cellLink(cx,cz,cx+dx,cz+dz,L))return false;
  const ma=megaAt(cx,cz,L);if(ma&&ma===megaAt(cx+dx,cz+dz,L))return false;
  if(downDir(cx,cz,L)===dirIdx(dx,dz)||downDir(cx+dx,cz+dz,L)===dirIdx(-dx,-dz))return true;
  if(inDelf(cx,cz)||inDelf(cx+dx,cz+dz))return L===0;
  return forcedDir(cx,cz,L)===dirIdx(dx,dz)||forcedDir(cx+dx,cz+dz,L)===dirIdx(-dx,-dz);
}
function edgeBase(cx,cz,dx,dz,L){
  if(dx<0||dz<0)return edgeBase(cx+dx,cz+dz,-dx,-dz,L);
  if(!ruinActive(cx,cz,L)||!ruinActive(cx+dx,cz+dz,L))return false;
  if(inDelf(cx,cz)||inDelf(cx+dx,cz+dz))return false;
  const ma=megaAt(cx,cz,L),mb=megaAt(cx+dx,cz+dz,L);if(ma&&ma===mb)return false;
  if(isAvenue(cx,cz)||isAvenue(cx+dx,cz+dz))return true;
  return hsh(cx*2+dx,L*97+2+dz*5,cz*2+dz)<0.5;
}
function ruinAt(X,Y,Z){
  const cx=Math.floor(X/CS),cz=Math.floor(Z/CS);
  for(let L=0;L<2;L++){const yb=RUIN_Y[L];if(Y<yb-12||Y>yb+16)continue;
    if(L===0&&inDelf(cx,cz)&&Y<=yb+31)return 'The Hall of a Thousand Pillars of '+holdOf(cx,cz).name;
    const m=megaAt(cx,cz,L);if(m){if(X>=m.x0&&X<=m.x1&&Z>=m.z0&&Z<=m.z1&&Y>=yb-12)return RUIN_NAMES[m.tp]+' of '+holdOf(cx,cz).name;continue;}
    if(Y<yb-1||Y>yb+11)continue;const t=ruinType(cx,cz,L);if(!t)continue;
    const lx=X-cx*CS-8,lz=Z-cz*CS-8,h=ROOM_HALF[t]||5;if(Math.abs(lx)<=h&&Math.abs(lz)<=h)return RUIN_NAMES[t];
    if(Math.abs(lx)<=2||Math.abs(lz)<=2)return 'Halls of '+holdOf(cx,cz).name;}
  if(gateAt(cx,cz)&&Math.abs(X-cx*CS-8)<=5&&Math.abs(Z-cz*CS-8)<=5&&Y>=RUIN_Y[1])return 'Gate of '+holdOf(cx,cz).name;
  return null;
}
function dwWall(r){const v=r();return v<0.05?DWCRACK:v<0.07?MOSSY:DWBRICK;}
function dwCorridor(x0,z0,x1,z1,yb,r,canal){
  const ax=x0!==x1,a0=ax?Math.min(x0,x1):Math.min(z0,z1),a1=ax?Math.max(x0,x1):Math.max(z0,z1),c=ax?z0:x0;
  for(let a=a0;a<=a1;a++)for(let w=-2;w<=2;w++){
    const X=ax?a:c+w,Z=ax?c+w:a,pil=a%4===0;
    for(let y=yb-1;y<=yb+4;y++){
      let id;
      if(Math.abs(w)<=1&&y>=yb&&y<=yb+3)id=AIR;
      else if(y===yb-1)id=canal&&!w?WATER:Math.abs(w)<=1?((a+w)%5===0?DWBRICK:DWTILE):DWBRICK;
      else if(Math.abs(w)===2&&pil&&y<yb+4)id=DWPILLAR;
      else id=dwWall(r);
      PW(X,y,Z,id,MODE_SET);
    }
    if(!w&&a%8===4){const q=r();if(q<0.3)PW(X,yb+3,Z,LANTERN,MODE_SET);else if(q<0.55)PW(X,yb+4,Z,RUNE,MODE_SET);}
    if(!w&&r()<0.05){PW(X,yb,Z,GRAVEL,MODE_SET);if(r()<0.5)PW(X+(ax?0:1),yb,Z+(ax?1:0),COBBLE,MODE_SET);}
    if(Math.abs(w)===1&&r()<0.02)PW(X,yb,Z,r()<0.3?DWCHEST:r()<0.6?BARREL:CRATE,MODE_SET);
    PW(X,yb-2,Z,DWBRICK,MODE_FILL);
  }
}
// Grand room shell: pilasters, a glowing rune frieze, brass trim, a corbelled ceiling with beams, and a chandelier
const mosaic=(dx,dz)=>{const g=Math.max(Math.abs(dx),Math.abs(dz));return g===0?GOLDB:g===1?RUNE:g%3===0?CALCITE:DWTILE;};
let curDist='residential',curDeco=false;const BANNER_C={royal:WOOLR,sacred:WOOLB,industrial:WOOLY,residential:WOOLG};
function distFloor(dx,dz){
  if(curDist==='industrial')return Math.abs(dx)<=1||Math.abs(dz)<=1?DWTILE:((dx+dz)&1?COBBLE:STONE);
  if(curDist==='sacred')return (dx===0||dz===0)?RUNE:CALCITE;
  if(curDist==='residential')return Math.abs(dx)<=2&&Math.abs(dz)<=3&&curH>=7?PLANKS:DWTILE;
  return mosaic(dx,dz);
}
function dwShell(cx,cz,h,yb,hh,r,floorFn,noChand){
  const I=curI;
  for(let dx=-h;dx<=h;dx++)for(let dz=-h;dz<=h;dz++){
    const X=cx+dx,Z=cz+dz,ex=Math.abs(dx)===h,ez=Math.abs(dz)===h,edge=ex||ez,corner=ex&&ez,ring=Math.max(Math.abs(dx),Math.abs(dz));
    PW(X,yb-2,Z,DWBRICK,MODE_FILL);
    let fl=edge?DWBRICK:(floorFn?floorFn(dx,dz):distFloor(dx,dz));if(!edge&&fl===DWTILE&&hsh(X,yb,Z)<0.12*I)fl=GRAVEL;
    PW(X,yb-1,Z,fl,MODE_SET);
    const along=ex?dz:dx,pil=corner||along%3===0;
    for(let y=yb;y<yb+hh;y++){
      let id;
      if(edge){
        if(pil)id=y===yb+hh-2?BRASB:DWPILLAR;
        else if(y===yb+3)id=(along%6===0||along%6===3)?RUNE:CALCITE;
        else if(curDeco&&(along%6+6)%6===3&&y>=yb+5&&y<=yb+7&&hsh(X,y-y%8,Z)>0.35*I)id=BANNER_C[curDist]||WOOLR;
        else if(curDeco&&(along%6+6)%6===0&&y===yb+5)id=((along/6|0)%2)?BRASB:COPB;
        else if(y===yb+hh-2)id=DWTILE;
        else{const v=hsh(X,y,Z);id=v<0.03+0.14*I?DWCRACK:v<0.05+0.2*I?MOSSY:curDist==='industrial'&&v<0.45?COBBLE:curDist==='sacred'?(y%3===0?DWBRICK:CALCITE):DWBRICK;}
      }
      else if(hh>=9&&y>=yb+hh-Math.max(0,Math.abs(dz)-(h-4)))id=DWBRICK;
      else if(y===yb+hh-1&&(ring===h-1||(dz%4===0&&ring<h-1)))id=DWBRICK;
      else id=AIR;
      PW(X,y,Z,id,MODE_SET);
    }
    PW(X,yb+hh,Z,DWBRICK,MODE_SET);
    // wall sconces between the pilasters
    if(ring===h-1&&!corner&&(ex||ez||true)){
      const wx=Math.abs(dx)===h-1,wz=Math.abs(dz)===h-1,al=wx?dz:dx;
      if((wx||wz)&&!(wx&&wz)&&((al+30)%6===3)&&hsh(X,yb+7,Z)>0.15+0.75*I)PW(X,yb+3,Z,SCONCE,MODE_SET);
    }
  }
  if(!noChand&&hh>=8){
    for(let y=yb+hh-4;y<yb+hh;y++)PW(cx,y,cz,STEELB,MODE_SET);
    if(hsh(cx,yb,cz)>0.3+0.6*I){PW(cx,yb+hh-5,cz,LANTERN,MODE_SET);for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])if(hsh(cx+a,yb,cz+b)>I*0.6)PW(cx+a,yb+hh-4,cz+b,LANTERN,MODE_SET);}
  }
}
// Passage from a room wall to the chunk edge, stepping between the room floor and the level floor
function dwOpening(side,cx,cz,yb,hh,grand,gx,gz,X0,X1,Z0,Z1,yo){
  const full=grand==='full';if(full)grand=true;yo=yo||0;
  let cells;
  if(side==='e'){cells=[];for(let x=X1;x<=gx0+CS-1;x++)cells.push(x);}else if(side==='w'){cells=[];for(let x=X0;x>=gx0;x--)cells.push(x);}
  else if(side==='s'){cells=[];for(let z=Z1;z<=gz0+CS-1;z++)cells.push(z);}else{cells=[];for(let z=Z0;z>=gz0;z--)cells.push(z);}
  const xs=side==='e'||side==='w',W=grand?6:2,top=full?hh-2:grand?hh-3:5,n=cells.length;
  cells.forEach((d,t)=>{
    const f=yb+(n>1?Math.round(yo*(1-t/(n-1))):yo),inWall=t===0;
    for(let w=-W-1;w<=W+1;w++){
      const X=xs?d:cx+w,Z=xs?cz+w:d,frame=Math.abs(w)===W+1;
      PW(X,f-1,Z,frame?DWBRICK:DWTILE,MODE_SET);for(let y=f-2;y>f-5;y--)PW(X,y,Z,DWBRICK,MODE_FILL);
      for(let y=f;y<=f+Math.max(top+1,6);y++){
        let id=null;
        if(frame){if(y<=f+top)id=inWall||n<=2?DWPILLAR:DWBRICK;}
        else if(grand){if(y<f+top)id=(!full&&w%3===0&&Math.abs(w)>=3)?DWPILLAR:AIR;else if(y===f+top)id=DWBRICK;}
        else{const archTop=f+top-(Math.abs(w)===2?1:0);if(y<archTop)id=AIR;else if(y===archTop)id=(!w&&inWall)?GOLDB:DWBRICK;else if(!inWall&&y===archTop+1)id=DWBRICK;}
        if(id!==null)PW(X,y,Z,id,MODE_SET);
      }
      if(!inWall&&n>2&&!grand&&frame&&t===Math.floor(n/2))PW(X,f+2,Z,SCONCE,MODE_SET);
    }
  });
}
// Structural decay: a broken wall stretch, a caved-in corner with a rubble slope, a fallen pillar
function dwDecay(cx,cz,yb,h,hh,I,WCX,WCZ,L){
  if(I<0.25)return;
  const q=(k)=>hsh(WCX,L*97+k,WCZ),corner=[[-1,-1],[1,-1],[-1,1],[1,1]][Math.floor(q(70)*4)],sx=corner[0],sz=corner[1];
  if(q(71)<I){const len=2+Math.floor(q(72)*3),hgt=2+Math.floor(q(73)*(hh-3)),alongX=q(74)<0.5;
    for(let k=0;k<len;k++){const X=alongX?cx+sx*(h-2-k):cx+sx*h,Z=alongX?cz+sz*h:cz+sz*(h-2-k);for(let y=yb+hh-hgt;y<yb+hh;y++)PW(X,y,Z,AIR,MODE_SET);PW(X,yb,Z,GRAVEL,MODE_SET);}}
  if(q(75)<I*0.8){for(let dx=0;dx<3;dx++)for(let dz=0;dz<3;dz++){const X=cx+sx*(h-1-dx),Z=cz+sz*(h-1-dz);for(let y=yb+hh-1;y<=yb+hh+2;y++)PW(X,y,Z,AIR,MODE_SET);
      const hi=3-Math.max(dx,dz);for(let y=0;y<hi;y++)PW(X,yb+y,Z,y?COBBLE:GRAVEL,MODE_SET);}}
  if(q(76)<I*0.7){const along=q(77)<0.5;for(let k=0;k<4;k++){const X=along?cx-sx*(h-2-k):cx-sx*(h-1),Z=along?cz-sz*(h-1):cz-sz*(h-2-k);PW(X,yb,Z,DWPILLAR,MODE_SET);}}
}
// Two-storey atrium: tall shell from the lower deep, a stair winding up the walls to a balcony on the upper deep
function dwAtrium(cx,cz,r){
  const h=7,y0=RUIN_Y[0],y1=RUIN_Y[1],hh=y1-y0+11;
  dwShell(cx,cz,h,y0,hh,r,(dx,dz)=>Math.max(Math.abs(dx),Math.abs(dz))<=2?WATER:mosaic(dx,dz),true);
  for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){PW(cx+dx,y0-2,cz+dz,CALCITE,MODE_SET);if(Math.max(Math.abs(dx),Math.abs(dz))===2)PW(cx+dx,y0,cz+dz,CALCITE,MODE_SET);}
  for(let y=y0;y<y0+6;y++)PW(cx,y,cz,y===y0+5?GOLDB:CALCITE,MODE_SET);PW(cx,y0+6,cz,GLOW,MODE_SET);
  const ring=[];for(let a=-5;a<5;a++)ring.push([a,-6]);for(let a=-5;a<5;a++)ring.push([6,a]);for(let a=5;a>-5;a--)ring.push([a,6]);for(let a=5;a>-5;a--)ring.push([-6,a]);
  for(let k=0;k<y1-y0;k++){const [dx,dz]=ring[k%ring.length];PW(cx+dx,y0+k,cz+dz,DWTILE,MODE_SET);for(let y=(k>=3?y0+k-1:y0);y<y0+k;y++)PW(cx+dx,y,cz+dz,DWBRICK,MODE_SET);} // open beneath, so doorways stay passable
  for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++){const g=Math.max(Math.abs(dx),Math.abs(dz));if(g<4)continue;PW(cx+dx,y1-1,cz+dz,DWTILE,MODE_SET);if(g===4&&(dx+dz)%2===0)PW(cx+dx,y1,cz+dz,DWBRICK,MODE_SET);if(g===4&&(dx+dz)%6===0)PW(cx+dx,y1+1,cz+dz,SCONCE,MODE_SET);}
  for(const [a,b] of [[-4,-4],[4,-4],[-4,4],[4,4]])for(let y=y0;y<y1-1;y++)PW(cx+a,y,cz+b,DWPILLAR,MODE_SET);
  for(let y=y1+6;y<y0+hh;y++)PW(cx,y,cz,STEELB,MODE_SET);PW(cx,y1+5,cz,LANTERN,MODE_SET);for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])PW(cx+a,y1+6,cz+b,LANTERN,MODE_SET);
}
// A collapsed floor dropping from the upper deep into a cistern on the lower deep
function dwHole(cx,cz){
  const y0=RUIN_Y[0],y1=RUIN_Y[1],x=cx+3,z=cz-3;
  for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=2;dz++){
    for(let y=y0+4;y<y1;y++)PW(x+dx,y,z+dz,AIR,MODE_SET);
    for(let y=y0-3;y<y0;y++)PW(x+dx,y,z+dz,WATER,MODE_SET);PW(x+dx,y0-4,z+dz,DWBRICK,MODE_SET);
    if(Math.abs(dx)===1||dz===-1||dz===2)PW(x+dx,y0,z+dz,y0%2?GRAVEL:COBBLE,MODE_SET);
  }
}
function dwAvenue(cx,cz,yb,r,plaza,axX){
  const h=7,hh=12;
  dwShell(cx,cz,h,yb,hh,r,(dx,dz)=>{const c=axX?dz:dx;if(plaza){const g=Math.max(Math.abs(dx),Math.abs(dz));return g===0?GOLDB:g===3?RUNE:(Math.abs(dx)===Math.abs(dz))?CALCITE:DWTILE;}return c===0?((axX?dx:dz)%4===0?GOLDB:RUNE):Math.abs(c)===3?CALCITE:DWTILE;},true);
  if(!plaza){
    const v=hsh(Math.floor(cx/CS),4001,Math.floor(cz/CS)),P=(a,c)=>[cx+(axX?a:c),cz+(axX?c:a)];
    if(curDist==='industrial')postFns.push(()=>{for(let a=-7;a<=7;a++){const [X,Z]=P(a,2);if(GW(X,yb,Z)===AIR&&SOLID[Math.max(0,GW(X,yb-1,Z))]&&hsh(X,yb+9,Z)>0.15*curI)PW(X,yb,Z,hsh(X,yb+8,Z)<0.04?BARREL:axX?RAILX:RAILZ,MODE_SET);}});
    if(v<0.5){for(let a=-6;a<=6;a+=4)for(const c of [-5,5]){const [X,Z]=P(a,c);for(let y=yb;y<yb+4;y++)PW(X,y,Z,DWPILLAR,MODE_SET);if(hsh(X,yb,Z)>0.2+0.7*curI)PW(X,yb+4,Z,LANTERN,MODE_SET);}}
    else if(v<0.72){ // market row: stalls along both sides
      for(const c of [-5,5])for(let a=-5;a<=3;a+=4){const awn=[WOOLR,WOOLY,WOOLB,WOOLG][Math.floor(hsh(a+cx,c,cz)*4)];
        for(const [da,dc] of [[0,0],[1,0],[0,Math.sign(c)],[1,Math.sign(c)]]){const [X,Z]=P(a+da,c+dc);if(hsh(X,yb+1,Z)>0.25*curI)PW(X,yb+3,Z,(da+dc)&1?awn:WOOLW,MODE_SET);}
        for(const da of [0,1]){const [X,Z]=P(a+da,c);PW(X,yb,Z,da?BARREL:PLANKS,MODE_SET);}
        for(const da of [0,1]){const [X,Z]=P(a+da,c+Math.sign(c));for(let y=yb;y<yb+3;y++)PW(X,y,Z,DWPILLAR,MODE_SET);}}}
    else if(v<0.87){ // aqueduct: a water channel down the middle, crossed by small bridges
      for(let a=-7;a<=7;a++){const [X,Z]=P(a,0);if(a%6===0)continue;PW(X,yb-1,Z,WATER,MODE_SET);PW(X,yb-2,Z,DWBRICK,MODE_SET);for(const c of [-1,1]){const [X2,Z2]=P(a,c);PW(X2,yb-1,Z2,CALCITE,MODE_SET);}}
      for(let a=-6;a<=6;a+=4)for(const c of [-5,5]){const [X,Z]=P(a,c);for(let y=yb;y<yb+4;y++)PW(X,y,Z,DWPILLAR,MODE_SET);if(hsh(X,yb,Z)>0.2+0.7*curI)PW(X,yb+4,Z,LANTERN,MODE_SET);}}
    else{ // a walk of ancestors: statues line both sides with braziers between
      for(let a=-6;a<=6;a+=4)for(const c of [-5,5]){const [X,Z]=P(a,c);statueP(X,yb,Z,hsh(X,yb,Z)<0.3?GOLDB:CALCITE);}
      for(let a=-4;a<=4;a+=4)for(const c of [-5,5]){const [X,Z]=P(a,c);if(hsh(X,yb+3,Z)>0.6*curI)brazierP(X,yb,Z);}}
    const ccx=Math.floor(cx/CS),ccz=Math.floor(cz/CS),LL=yb===RUIN_Y[1]?1:0,sideOpen=(f)=>axX?edgeOpen(ccx,ccz,0,-f,LL):edgeOpen(ccx,ccz,-f,0,LL);
    let flip=hsh(ccx,4202,ccz)<0.5?-1:1;if(sideOpen(flip))flip=-flip;
    const desc=descentAt(ccx,ccz,LL,axX);if(desc)postFns.push(()=>dwDescent(cx,cz,yb,axX));
    if(curI>0.75&&hsh(ccx,4201,ccz)<0.3&&!sideOpen(flip)&&!desc){
      postFns.push(()=>{for(let a=-3;a<=3;a++)for(let c=-6;c<=3;c++){const hgt=Math.max(0,5-Math.abs(a)-Math.max(0,c-1)-(c<-4?1:0))+(hsh(cx+a,yb,cz+c)<0.4?1:0);const [X,Z]=P(a,c*flip);
        for(let y=yb;y<yb+hgt;y++){const q=hsh(X,y,Z);PW(X,y,Z,q<0.4?COBBLE:q<0.7?GRAVEL:q<0.85?DWCRACK:DWBRICK,MODE_SET);}}
        for(let a=-1;a<=1;a++)for(let c=-3;c<=-1;c++){const [X,Z]=P(a,c*flip);for(let y=yb+hh-1;y<=yb+hh+2;y++)PW(X,y,Z,AIR,MODE_SET);}});}
    for(let a=-6;a<=6;a+=6){const X=cx+(axX?a:0),Z=cz+(axX?0:a);for(let y=yb+hh-3;y<yb+hh;y++)PW(X,y,Z,STEELB,MODE_SET);PW(X,yb+hh-4,Z,LANTERN,MODE_SET);}
  }else{
    for(const [a,b] of [[-5,-5],[5,-5],[-5,5],[5,5]]){for(let y=yb;y<yb+hh-1;y++)PW(cx+a,y,cz+b,y===yb+hh-3?BRASB:DWPILLAR,MODE_SET);PW(cx+a+(a<0?1:-1),yb+5,cz+b,GLOW,MODE_SET);}
    PW(cx+4,yb,cz+4,LECTERN,MODE_SET);
  }
}
function edgeKind(cx,cz,dx,dz,L){
  if(dx<0||dz<0)return edgeKind(cx+dx,cz+dz,-dx,-dz,L);
  const a=isAvenue(cx,cz),b=isAvenue(cx+dx,cz+dz);
  if(a&&b)return 'full';if(a||b)return 'arch';
  const q=hsh(cx*2+dx,L*97+44+dz*3,cz*2+dz);return q<0.22?'grand':q<0.36?'full':'arch';
}
function edgeGrand(cx,cz,dx,dz,L){return edgeKind(cx,cz,dx,dz,L)!=='arch';}
const inlay=(dx,dz)=>(!dx&&!dz)?GOLDB:Math.max(Math.abs(dx),Math.abs(dz))<=1?RUNE:(Math.abs(dx)===Math.abs(dz)&&Math.abs(dx)<=4)?RUNE:DWTILE;
function ringCells(h,fn){for(let a=-h+1;a<=h-1;a++){fn(a,-h+1);fn(a,h-1);}for(let a=-h+2;a<=h-2;a++){fn(-h+1,a);fn(h-1,a);}}
function dwRoom(t,cx,cz,yb,r){
  const h=curH||ROOM_HALF[t],hh=curHH||ROOM_H[t];
  const notDoor=(dx,dz)=>Math.abs(dx)>2&&Math.abs(dz)>2;
  switch(t){
    case 'hall':{dwShell(cx,cz,h,yb,hh,r,inlay);
      for(const a of [-3,3])for(const b of [-3,3]){for(let y=yb;y<yb+hh;y++)PW(cx+a,y,cz+b,DWPILLAR,MODE_SET);PW(cx+a,yb+4,cz+b,GLOW,MODE_SET);}
      for(let y=yb;y<yb+2;y++)PW(cx,y,cz-h+1,DWBRICK,MODE_SET);PW(cx,yb+2,cz-h+1,GOLDB,MODE_SET);
      PW(cx-h+1,yb,cz+h-2,DWCHEST,MODE_SET);if(r()<0.6)PW(cx+h-1,yb,cz+h-2,DWCHEST,MODE_SET);PW(cx+2,yb+hh-1,cz,LANTERN,MODE_SET);PW(cx-2,yb+hh-1,cz,LANTERN,MODE_SET);break;}
    case 'forge':{dwShell(cx,cz,h,yb,hh,r,(dx,dz)=>Math.abs(dx)<=4&&dz===0?LAVA:DWTILE);
      for(let dx=-4;dx<=4;dx+=2){PW(cx+dx,yb,cz-5,FURN,MODE_SET);for(let y=yb+1;y<yb+hh-1;y++)PW(cx+dx,y,cz-6,DWBRICK,MODE_SET);}
      PW(cx-5,yb,cz-5,BLAST,MODE_SET);PW(cx+5,yb,cz-5,BLAST,MODE_SET);
      for(const dx of [-3,0,3]){PW(cx+dx,yb,cz+3,STEELB,MODE_SET);}
      for(let dx=-5;dx<=5;dx+=2)PW(cx+dx,yb,cz+6,[COPB,BRONB,BRASB,STEELB,COPB,BRASB][(dx+5)/2],MODE_SET);
      PW(cx+6,yb,cz+5,DWCHEST,MODE_SET);break;}
    case 'archive':{dwShell(cx,cz,h,yb,hh,r);
      ringCells(h,(dx,dz)=>{if(notDoor(dx,dz))for(let y=yb;y<yb+3;y++)PW(cx+dx,y,cz+dz,r()<0.85?BOOKS:AIR,MODE_SET);});
      PW(cx,yb,cz,LECTERN,MODE_SET);PW(cx+1,yb,cz,PLANKS,MODE_SET);PW(cx-1,yb,cz,PLANKS,MODE_SET);PW(cx,yb+hh-1,cz,LANTERN,MODE_SET);
      for(const a of [-3,3])PW(cx+a,yb+hh,cz,RUNE,MODE_SET);PW(cx+3,yb,cz+3,DWCHEST,MODE_SET);break;}
    case 'barracks':{dwShell(cx,cz,h,yb,hh,r);
      for(const a of [-3,3])for(let b=-3;b<=3;b+=2){PW(cx+a,yb,cz+b,WOOLR,MODE_SET);PW(cx+a+(a<0?-1:1),yb,cz+b,PLANKS,MODE_SET);}
      PW(cx,yb,cz-3,STEELB,MODE_SET);PW(cx,yb+1,cz-3,STEELB,MODE_SET);PW(cx,yb,cz+3,CRATE,MODE_SET);PW(cx,yb+hh-1,cz,LANTERN,MODE_SET);break;}
    case 'vault':{dwShell(cx,cz,h,yb,hh,r,inlay);
      for(const [a,b] of [[-5,-5],[5,-5],[-5,5],[5,5]]){PW(cx+a,yb,cz+b,GOLDB,MODE_SET);PW(cx+a,yb+1,cz+b,GOLDB,MODE_SET);}
      for(const a of [-5,5])for(const b of [-2,0,2])PW(cx+a,yb,cz+b,b?COPB:PLATB,MODE_SET);
      PW(cx-2,yb,cz-5,DWCHEST,MODE_SET);PW(cx+2,yb,cz-5,DWCHEST,MODE_SET);PW(cx,yb,cz-5,GOLDB,MODE_SET);break;}
    case 'storage':{dwShell(cx,cz,h,yb,hh,r);
      for(const a of [-5,-4,4,5])for(let b=-5;b<=5;b++){if(Math.abs(b)<=1)continue;PW(cx+a,yb,cz+b,BARREL,MODE_SET);if(Math.abs(a)===5)PW(cx+a,yb+1,cz+b,BARREL,MODE_SET);}
      for(const b of [-5,5])for(const a of [-2,2])PW(cx+a,yb,cz+b,CRATE,MODE_SET);break;}
    case 'crypt':{dwShell(cx,cz,h,yb,hh,r);
      for(const a of [-3,3])for(const b of [-3,0,3]){PW(cx+a,yb,cz+b,CALCITE,MODE_SET);PW(cx+a,yb,cz+b+1,CALCITE,MODE_SET);}
      PW(cx,yb+hh-1,cz-3,RUNE,MODE_SET);PW(cx,yb+hh-1,cz+3,RUNE,MODE_SET);PW(cx,yb,cz-h+1,DWCHEST,MODE_SET);break;}
    case 'machine':{dwShell(cx,cz,h,yb,hh,r);
      for(let dx=-h+1;dx<=h-1;dx++){PW(cx+dx,yb+hh-1,cz-h+1,BRASB,MODE_SET);PW(cx+dx,yb+hh-1,cz+h-1,BRASB,MODE_SET);}
      for(const a of [-h,h])for(let y=yb+2;y<yb+6;y++)for(let b=-2;b<=2;b++){const d=Math.hypot(y-yb-3.5,b);if(d>1.4&&d<2.6)PW(cx+a,y,cz+b,d<2?BRASB:COPB,MODE_SET);}
      for(let y=yb;y<yb+4;y++){PW(cx,y,cz,STEELB,MODE_SET);PW(cx+1,y,cz,y===yb+2?RUNE:STEELB,MODE_SET);}PW(cx-1,yb,cz,WHEEL,MODE_SET);PW(cx+2,yb,cz,BATTERY,MODE_SET);
      PW(cx-3,yb,cz+3,CRATE,MODE_SET);PW(cx+3,yb,cz-3,DWCHEST,MODE_SET);PW(cx,yb+hh-1,cz+3,LANTERN,MODE_SET);break;}
    case 'farm':{dwShell(cx,cz,h,yb,hh,r,(dx,dz)=>dz===0&&Math.abs(dx)<=3?WATER:MOSSY);
      for(let dx=-3;dx<=3;dx++)for(const dz of [-2,-1,1,2])if(r()<0.8)PW(cx+dx,yb,cz+dz,GLOWSHROOM,MODE_SET);break;}
    case 'collapsed':{dwShell(cx,cz,h,yb,hh,r);
      for(let dx=-6;dx<=-2;dx++)for(let dz=-6;dz<=-2;dz++){const hi=Math.max(0,4-Math.max(dx+6,dz+6));for(let y=0;y<hi;y++)PW(cx+dx,yb+y,cz+dz,y===0?GRAVEL:COBBLE,MODE_SET);}
      for(let y=yb+hh-1;y<=yb+hh;y++)for(let dx=-6;dx<=-4;dx++)PW(cx+dx,y,cz-5,AIR,MODE_SET);
      for(let y=yb;y<yb+3;y++)PW(cx+3,y,cz+3,DWPILLAR,MODE_SET);PW(cx+4,yb,cz+3,DWPILLAR,MODE_SET);PW(cx+5,yb,cz+3,DWPILLAR,MODE_SET);PW(cx+5,yb,cz+5,DWCHEST,MODE_SET);break;}
    case 'throne':{dwShell(cx,cz,h,yb,hh,r,(dx,dz)=>dx===0&&dz>-h+2?WOOLR:inlay(dx,dz));
      for(const a of [-4,4])for(let b=-4;b<=4;b+=4){for(let y=yb;y<yb+hh;y++)PW(cx+a,y,cz+b,DWPILLAR,MODE_SET);PW(cx+a,yb+5,cz+b,GLOW,MODE_SET);}
      PW(cx,yb,cz-h+1,GOLDB,MODE_SET);PW(cx,yb+1,cz-h+1,GOLDB,MODE_SET);PW(cx-1,yb,cz-h+1,GOLDB,MODE_SET);PW(cx+1,yb,cz-h+1,GOLDB,MODE_SET);
      PW(cx-2,yb,cz-h+1,DWCHEST,MODE_SET);PW(cx+2,yb,cz-h+1,DWCHEST,MODE_SET);
      for(const a of [-h+1,h-1])for(let y=yb+3;y<yb+7;y++)PW(cx+a,y,cz,WOOLR,MODE_SET);break;}
    case 'junction':{dwShell(cx,cz,h,yb,hh,r,null,true);for(const a of [-3,3])for(const b of [-3,3]){for(let y=yb;y<yb+hh-1;y++)PW(cx+a,y,cz+b,y===yb+hh-3?BRASB:DWPILLAR,MODE_SET);PW(cx+a,yb+4,cz+b+(b<0?1:-1),RUNE,MODE_SET);}
      for(let y=yb;y<yb+3;y++)PW(cx,y,cz,y===yb+2?GOLDB:DWBRICK,MODE_SET);PW(cx,yb+3,cz,GLOW,MODE_SET);break;}
  }
}
function dwStair(cx,cz,r){
  const y0=RUIN_Y[0],y1=RUIN_Y[1],h=3;
  for(let dx=-h;dx<=h;dx++)for(let dz=-h;dz<=h;dz++){
    const edge=Math.abs(dx)===h||Math.abs(dz)===h;
    for(let y=y0-1;y<=y1+5;y++)PW(cx+dx,y,cz+dz,edge?(y===y0-1||y===y1+5?DWBRICK:dwWall(r)):(y===y0-1?DWTILE:AIR),MODE_SET);
  }
  const ring=[];for(let a=-2;a<2;a++)ring.push([a,-2]);for(let a=-2;a<2;a++)ring.push([2,a]);for(let a=2;a>-2;a--)ring.push([a,2]);for(let a=2;a>-2;a--)ring.push([-2,a]);
  for(let y=y0;y<=y1;y++){const [dx,dz]=ring[(y-y0)%ring.length];PW(cx+dx,y-1,cz+dz,DWTILE,MODE_SET);for(let k=1;k<=3;k++)PW(cx+dx,y-1-k,cz+dz,DWBRICK,MODE_FILL);}
  for(let y=y0;y<=y1+4;y++)PW(cx,y,cz,(y-y0)%8===4?RUNE:DWPILLAR,MODE_SET);
  for(const yb of RUIN_Y)PW(cx+1,yb+3,cz+1,LANTERN,MODE_SET);
}
