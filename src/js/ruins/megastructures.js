// ---- Two-by-two chunk megastructures
function megaShell(m,yb,hh,r,floorFn){
  for(let X=m.x0;X<=m.x1;X++)for(let Z=m.z0;Z<=m.z1;Z++){
    if(X<gx0-1||X>gx0+CS||Z<gz0-1||Z>gz0+CS)continue;
    const edge=X===m.x0||X===m.x1||Z===m.z0||Z===m.z1,dx=X-m.cx,dz=Z-m.cz;
    PW(X,yb-2,Z,DWBRICK,MODE_FILL);PW(X,yb-1,Z,edge?DWBRICK:(floorFn?floorFn(dx,dz):DWTILE),MODE_SET);
    for(let y=yb;y<yb+hh;y++)PW(X,y,Z,edge?((X-m.x0)%5===0||(Z-m.z0)%5===0?DWPILLAR:dwWall(r)):AIR,MODE_SET);
    PW(X,yb+hh,Z,dwWall(r),MODE_SET);
  }
}
function bigPillar(X,Z,yb,hh,band){for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)for(let y=yb;y<yb+hh;y++)PW(X+dx,y,Z+dz,y===yb+band?BRASB:(dx&&dz)?DWBRICK:DWPILLAR,MODE_SET);PW(X+2,yb+band+1,Z,GLOW,MODE_SET);PW(X-2,yb+band+1,Z,GLOW,MODE_SET);}
function balcony(m,y,inset,r){
  for(let X=m.x0+1;X<m.x1;X++)for(let Z=m.z0+1;Z<m.z1;Z++){const d=Math.min(X-m.x0,m.x1-X,Z-m.z0,m.z1-Z);if(d>inset)continue;PW(X,y,Z,DWTILE,MODE_SET);if(d===inset&&(X+Z)%2===0)PW(X,y+1,Z,DWBRICK,MODE_SET);}
  for(let k=0;k<y-RUIN_Y[0];k++){}
}
function megaStairs(m,yb,top){const X0=m.x0+1;for(let k=0;k<top-yb;k++){PW(X0+k,yb+k,m.z0+1,DWTILE,MODE_SET);PW(X0+k,yb+k,m.z0+2,DWTILE,MODE_SET);for(let y=yb;y<yb+k;y++){PW(X0+k,y,m.z0+1,DWBRICK,MODE_SET);PW(X0+k,y,m.z0+2,DWBRICK,MODE_SET);}}}
function buildMega(m,L){
  const yb=RUIN_Y[L],r=rngAt(m.ax,L*41+950,m.az),cx=m.cx,cz=m.cz;
  switch(m.tp){
    case 'greathall':{const hh=15;
      megaShell(m,yb,hh,r,(dx,dz)=>(!dx&&!dz)?GOLDB:(dx===0||dz===0||Math.abs(dx)===Math.abs(dz))&&Math.max(Math.abs(dx),Math.abs(dz))<=6?RUNE:Math.abs(Math.hypot(dx,dz)-9)<0.5?GOLDB:DWTILE);
      for(const px of [-8,0,8])for(const pz of [-8,8])bigPillar(cx+px,cz+pz,yb,hh,7);
      balcony(m,yb+7,2,r);megaStairs(m,yb,yb+7);
      for(const px of [-10,-5,5,10]){for(let y=0;y<2;y++)PW(cx+px,yb+y,m.z1-1,DWBRICK,MODE_SET);for(let y=2;y<5;y++)PW(cx+px,yb+y,m.z1-1,CALCITE,MODE_SET);PW(cx+px,yb+5,m.z1-1,GOLDB,MODE_SET);}
      for(const [a,b] of [[-12,-12],[12,-12],[-12,12],[12,12]])brazierP(cx+a,yb,cz+b);
      PW(cx-12,yb,cz,DWCHEST,MODE_SET);PW(cx+12,yb,cz,DWCHEST,MODE_SET);PW(cx,yb,m.z1-2,DWCHEST,MODE_SET);
      for(const a of [-4,4])PW(cx+a,yb+hh-1,cz,LANTERN,MODE_SET);break;}
    case 'grandthrone':{const hh=14;
      megaShell(m,yb,hh,r,(dx,dz)=>Math.abs(dx)<=1&&dz>-12?WOOLR:Math.abs(dx)===2&&dz>-12?GOLDB:DWTILE);
      for(let pz=-8;pz<=8;pz+=8)for(const px of [-7,7])bigPillar(cx+px,cz+pz,yb,hh,6);
      for(let s2=0;s2<3;s2++)for(let dx=-6+s2;dx<=6-s2;dx++)for(let dz=-14;dz<=-11+s2;dz++)PW(cx+dx,yb+s2,cz+dz,s2===2?WOOLR:DWTILE,MODE_SET);
      for(let y=3;y<8;y++)for(let dx=-1;dx<=1;dx++)PW(cx+dx,yb+y,cz-14,GOLDB,MODE_SET);PW(cx,yb+3,cz-13,GOLDB,MODE_SET);PW(cx,yb+8,cz-14,GLOW,MODE_SET);
      for(const a of [-5,5]){PW(cx+a,yb+3,cz-13,GOLDB,MODE_SET);PW(cx+a,yb+4,cz-13,PLATB,MODE_SET);PW(cx+a-1,yb+3,cz-12,DWCHEST,MODE_SET);}
      for(const X of [m.x0+1,m.x1-1])for(let Z=cz-10;Z<=cz+10;Z+=5)for(let y=yb+4;y<yb+10;y++)PW(X,y,Z,(Z/5|0)%2?WOOLR:WOOLB,MODE_SET);
      brazierP(cx-3,yb+3,cz-12);brazierP(cx+3,yb+3,cz-12);PW(cx,yb+hh-1,cz,LANTERN,MODE_SET);break;}
    case 'foundry':{const hh=15;
      megaShell(m,yb,hh,r,(dx,dz)=>(dz===4||dz===-4)&&Math.abs(dx)<12?LAVA:DWTILE);
      for(const px of [-9,0,9]){const tx=cx+px,tz=cz-9;
        for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let y=yb;y<yb+hh;y++){const e=Math.abs(dx)===2||Math.abs(dz)===2;PW(tx+dx,y,tz+dz,e?(y<yb+6&&dz===2&&Math.abs(dx)<=1?(y===yb?FURN:y<yb+3?BLAST:DWBRICK):DWBRICK):(y<yb+4?LAVA:AIR),MODE_SET);}}
      for(const px of [-6,6]){const tx=cx+px,tz=cz+9;for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){PW(tx+dx,yb,tz+dz,STEELB,MODE_SET);PW(tx+dx,yb+1,tz+dz,(dx||dz)?STEELB:LAVA,MODE_SET);}}
      for(let dx=-11;dx<=11;dx++){PW(cx+dx,yb,cz,BRASB,MODE_SET);if(dx%3===0)PW(cx+dx,yb+1,cz,pick([COPO,IRON,TINO,ZINO,COAL],r),MODE_SET);}
      for(const [px,pz,ore] of [[-11,10,IRON],[11,10,COPO],[0,12,GOLD]])for(let dx=-2;dx<=2;dx++)for(let dz=-1;dz<=1;dz++){const hi=2-Math.abs(dx)+(dz?0:1);for(let y=0;y<hi;y++)PW(cx+px+dx,yb+y,cz+pz+dz,r()<0.6?ore:COBBLE,MODE_SET);}
      for(let dx=-4;dx<=4;dx+=2)PW(cx+dx,yb,cz+6,pick([COPB,BRONB,BRASB,STEELB,GOLDB],r),MODE_SET);
      PW(cx-13,yb,cz+13,DWCHEST,MODE_SET);PW(cx+13,yb,cz-2,DWCHEST,MODE_SET);
      for(const a of [-6,6])PW(cx+a,yb+hh-1,cz,LANTERN,MODE_SET);break;}
    case 'temple':{const hh=16;
      megaShell(m,yb,hh,r,(dx,dz)=>Math.abs(dx)<=1?(dz%3===0?RUNE:DWTILE):Math.abs(Math.hypot(dx,dz+10)-4)<0.5?RUNE:DWTILE);
      for(let dz=-4;dz<=12;dz+=2)for(const side of [-1,1])for(let a=3;a<=9;a++)PW(cx+side*a,yb,cz+dz,PLANKS,MODE_SET);
      for(let s2=0;s2<2;s2++)for(let dx=-5+s2;dx<=5-s2;dx++)for(let dz=-14;dz<=-9+s2;dz++)PW(cx+dx,yb+s2,cz+dz,CALCITE,MODE_SET);
      for(let dx=-1;dx<=1;dx++)PW(cx+dx,yb+2,cz-12,GOLDB,MODE_SET);PW(cx,yb+3,cz-12,AMETH,MODE_SET);PW(cx,yb+4,cz-12,CRYSTAL,MODE_SET);
      for(let y=yb+5;y<yb+hh-1;y++)PW(cx,y,cz-14,y%3===0?RUNE:GOLDB,MODE_SET);
      for(let dz=-8;dz<=10;dz+=6)for(const side of [-1,1]){statueP(cx+side*12,yb,cz+dz,CALCITE);PW(cx+side*12,yb+4,cz+dz,GLOW,MODE_SET);}
      for(const X of [m.x0,m.x1])for(let Z=m.z0+3;Z<m.z1-2;Z+=4)for(let y=yb+8;y<yb+12;y++)PW(X,y,Z,pick([WOOLR,WOOLB,WOOLY,AMETH],r),MODE_SET);
      PW(cx-3,yb+1,cz-11,DWCHEST,MODE_SET);PW(cx+3,yb+1,cz-11,DWCHEST,MODE_SET);PW(cx,yb,cz-7,LECTERN,MODE_SET);
      for(const a of [-5,5])PW(cx+a,yb+hh-1,cz,LANTERN,MODE_SET);break;}
    case 'grandlibrary':{const hh=15;
      megaShell(m,yb,hh,r);
      for(let row=-10;row<=10;row+=4)for(let dx=-11;dx<=11;dx++){if(Math.abs(dx)<=2)continue;for(let y=yb;y<yb+5;y++)PW(cx+dx,y,cz+row,r()<0.92?BOOKS:AIR,MODE_SET);}
      balcony(m,yb+7,2,r);megaStairs(m,yb,yb+7);
      for(let X=m.x0+1;X<m.x1;X++)for(let Z=m.z0+1;Z<m.z1;Z++){const d=Math.min(X-m.x0,m.x1-X,Z-m.z0,m.z1-Z);if(d===1)for(let y=yb+8;y<yb+11;y++)PW(X,y,Z,BOOKS,MODE_SET);}
      for(let dz=-8;dz<=8;dz+=4){PW(cx,yb,cz+dz,dz%8===0?LECTERN:PLANKS,MODE_SET);PW(cx,yb+hh-1,cz+dz,dz%8===0?LANTERN:RUNE,MODE_SET);}
      PW(cx-13,yb,cz-13,DWCHEST,MODE_SET);PW(cx+13,yb,cz+13,DWCHEST,MODE_SET);PW(cx+12,yb+8,cz-12,DWCHEST,MODE_SET);break;}
    case 'gardens':{const hh=13;
      megaShell(m,yb,hh,r,(dx,dz)=>(Math.abs(dx)<=1||Math.abs(dz)<=1)?DWTILE:(Math.abs(dx)===2||Math.abs(dz)===2)?WATER:MOSSY);
      for(let dx=-14;dx<=14;dx++)for(let dz=-14;dz<=14;dz++){if((Math.abs(dx)===2||Math.abs(dz)===2)&&Math.abs(dx)>1&&Math.abs(dz)>1)continue;if(Math.abs(dx)===2||Math.abs(dz)===2)PW(cx+dx,yb-2,cz+dz,DWBRICK,MODE_SET);}
      for(const [qx,qz] of [[-8,-8],[8,-8],[-8,8],[8,8],[-10,0],[10,0],[0,-10],[0,10]]){if(qx&&qz||hsh(cx+qx,yb,cz+qz)<0.7){const hgt=4+Math.floor(hsh(cx+qx,yb+1,cz+qz)*3);
        for(let y=0;y<hgt;y++)PW(cx+qx,yb+y,cz+qz,MUSHSTEM,MODE_SET);for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++){const d=Math.hypot(a,b);if(d<=2.8)PW(cx+qx+a,yb+hgt,cz+qz+b,GLOWCAP,MODE_SET);if(d<=1.6)PW(cx+qx+a,yb+hgt+1,cz+qz+b,GLOWCAP,MODE_SET);}}}
      for(let k=0;k<40;k++){const a=(r()*27|0)-13,b=(r()*27|0)-13;if(Math.abs(a)<=2||Math.abs(b)<=2)continue;PW(cx+a,yb,cz+b,GLOWSHROOM,MODE_AIR);}
      for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){const e=Math.max(Math.abs(dx),Math.abs(dz));PW(cx+dx,yb,cz+dz,e===2?CALCITE:e===1?WATER:CALCITE,MODE_SET);}
      PW(cx,yb+1,cz,CALCITE,MODE_SET);PW(cx,yb+2,cz,GOLDB,MODE_SET);PW(cx,yb+3,cz,GLOW,MODE_SET);
      for(const [a,b] of [[-4,3],[4,-3],[3,4],[-3,-4]])PW(cx+a,yb,cz+b,PLANKS,MODE_SET);
      PW(cx-13,yb,cz-13,DWCHEST,MODE_SET);break;}
    case 'colosseum':{const hh=14;
      megaShell(m,yb,hh,r,(dx,dz)=>DWTILE);
      for(let dx=-14;dx<=14;dx++)for(let dz=-14;dz<=14;dz++){
        const g=Math.max(Math.abs(dx),Math.abs(dz)),gate=Math.abs(dx)<=1||Math.abs(dz)<=1,X=cx+dx,Z=cz+dz;
        if(g<=7){for(let y=yb-3;y<yb;y++)PW(X,y,Z,AIR,MODE_SET);PW(X,yb-4,Z,SAND,MODE_SET);PW(X,yb-5,Z,DWBRICK,MODE_SET);}
        else if(!gate&&g<=13){const tier=Math.min(3,Math.floor((g-8)/2));for(let y=yb-3;y<yb+tier;y++)PW(X,y,Z,y===yb+tier-1?DWTILE:DWBRICK,MODE_SET);}
        else if(gate&&g<=13){for(let y=yb-3;y<yb;y++)PW(X,y,Z,g<=9?AIR:DWBRICK,MODE_SET);PW(X,yb-4,Z,SAND,MODE_SET);if(g>=10){const s2=13-g;PW(X,yb-1-Math.min(3,s2),Z,DWTILE,MODE_SET);for(let y=yb-Math.min(3,s2);y<yb;y++)PW(X,y,Z,AIR,MODE_SET);}}
      }
      for(const [a,b] of [[-13,-13],[13,-13],[-13,13],[13,13],[-13,0],[13,0],[0,-13],[0,13]])if(hsh(cx+a,yb,cz+b)>0.5*ruinI(m.ax,m.az))brazierP(cx+a,yb+3,cz+b);
      for(const [a,b] of [[-5,-5],[5,5]]){PW(cx+a,yb-3,cz+b,STEELB,MODE_SET);PW(cx+a,yb-2,cz+b,STEELB,MODE_SET);}
      PW(cx+12,yb+3,cz-12,DWCHEST,MODE_SET);break;}
    case 'quarry':{
      for(let X=m.x0;X<=m.x1;X++)for(let Z=m.z0;Z<=m.z1;Z++){
        if(X<gx0-1||X>gx0+CS||Z<gz0-1||Z>gz0+CS)continue;
        const inset=Math.min(X-m.x0,m.x1-X,Z-m.z0,m.z1-Z),floor=yb-1-Math.min(10,Math.floor(inset/1.4));
        for(let y=floor+1;y<yb+8;y++)PW(X,y,Z,AIR,MODE_SET);
        PW(X,floor,Z,floor<=12&&inset>12?LAVA:DWTILE,MODE_SET);
        if(hsh(X,floor,Z)<0.12)PW(X,floor-1,Z,pick([IRON,GOLD,PLATO,COAL,COPO,DIAMOND,TITO],r),MODE_STONE);
        if(inset%3===0&&(X+Z)%6===0&&inset<14){PW(X,floor+1,Z,DWPILLAR,MODE_SET);PW(X,floor+2,Z,LANTERN,MODE_SET);}
        else if(hsh(X,floor+1,Z)<0.015)PW(X,floor+1,Z,hsh(X,floor+2,Z)<0.5?BARREL:DWCHEST,MODE_SET);
      }
      for(let X=m.x0;X<=m.x1;X++){PW(X,yb+7,cz,STEELB,MODE_SET);}
      for(let y=yb-6;y<yb+7;y++)PW(cx,y,cz,(y-yb)%4===0?STEELB:AIR,MODE_SET);break;}
  }
}
const ARMORY_L=[[227,2,6,8],[223,2,6,6],[245,1,1,3],[305,1,1,2],[244,1,1,4],[246,1,1,0.6],[STEELB,1,1,1.5],[271,1,3,3],[204,2,6,4],[255,1,1,0.15]];
const FOOD_L=[[206,2,5,8],[269,3,6,7],[207,2,5,5],[270,3,8,5],[202,4,10,4],[208,4,8,3],[209,3,6,3],[203,4,12,3],[331,3,8,4],[335,1,3,3],[338,1,3,3]];
const SCHOLAR_L=[[273,1,2,8],[203,6,20,6],[204,1,4,4],[LANTERN,1,2,3],[BOOKS,1,3,3],[GLOW,1,3,2],[230,1,1,1],[CRYSTAL,1,3,2],[274,1,1,0.2],[255,1,1,0.12]];
const SMITH_L=[[220,2,6,6],[221,2,5,5],[222,2,5,5],[223,2,5,6],[225,2,5,4],[226,2,5,4],[227,1,3,4],[228,1,2,1.2],[229,1,2,1],[200,4,12,6],[271,1,4,6],[COPB,1,1,1],[303,1,1,1.5],[313,1,1,1.5],[PITON,4,12,2],[255,1,1,0.12]];
const TREASURE_L=[[224,3,8,8],[229,1,3,5],[272,1,2,6],[274,1,1,1.2],[205,1,4,6],[204,4,12,6],[230,1,3,4],[GOLDB,1,1,1.5],[PLATB,1,1,0.6],[255,1,1,0.25]];
const ROOM_LOOT={mine:SMITH_L,armory:ARMORY_L,barracks:ARMORY_L,arena:ARMORY_L,kitchen:FOOD_L,tavern:FOOD_L,storage:FOOD_L,farm:FOOD_L,quarters:FOOD_L,bath:FOOD_L,games:FOOD_L,cistern:FOOD_L,
  archive:SCHOLAR_L,office:SCHOLAR_L,grandlibrary:SCHOLAR_L,statuary:SCHOLAR_L,shrine:SCHOLAR_L,temple:SCHOLAR_L,crypt:SCHOLAR_L,delf:SCHOLAR_L,
  forge:SMITH_L,foundry:SMITH_L,machine:SMITH_L,minehall:SMITH_L,quarry:SMITH_L,chasm:SMITH_L,collapsed:SMITH_L,
  gardens:FOOD_L,colosseum:ARMORY_L,vault:TREASURE_L,throne:TREASURE_L,grandthrone:TREASURE_L,hall:TREASURE_L,greathall:TREASURE_L,cellar:TREASURE_L};
function roomAt(X,Y,Z){
  const cx=Math.floor(X/CS),cz=Math.floor(Z/CS);
  if(Y<58&&inMineCell(X,Y,Z))return 'mine';
  for(let L=0;L<2;L++){const yb=RUIN_Y[L];if(Y<yb-14||Y>yb+16)continue;if(L===0&&inDelf(cx,cz))return 'delf';const t=ruinType(cx,cz,L);if(!t)continue;if(Y<yb-1&&!megaAt(cx,cz,L))return 'cellar';return t;}
  return null;
}
const DWLOOT=[[255,1,1,0.18],[271,1,4,10],[272,1,1,4],[273,1,2,5],[274,1,1,0.6],[224,2,6,8],[229,1,2,3],[228,1,2,2],[227,2,5,7],[226,2,6,7],[230,1,2,3],[204,3,10,8],[205,1,2,2],[245,1,1,1],[246,1,1,0.4],[LANTERN,1,3,4],[270,2,6,4]];
