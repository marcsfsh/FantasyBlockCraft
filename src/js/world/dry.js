// ---- Dry and fiery (M6e, D-043; Q105, Q106, Q112, Q119, Q132): Southern Drylands, Golden Steppe (the Windswept Plains
// reworked), Volcanic Wastes and Blighted Lands join the land looks and signatures. Under the Volcanic Wastes the rock over the
// Fire Below turns to glowing magma stone (a hotter deep, with no loose lava).
function cactusP(X,y,Z,r){const h=1+(r()*3|0);for(let i=0;i<h;i++)PW(X,y+i,Z,CACTUS,MODE_SET);}
function spireP(X,y,Z,r,id){const h=2+(r()*5|0);for(let i=-1;i<h;i++){PW(X,y+i,Z,id,MODE_SET);if(i<h-2&&r()<0.5)PW(X+(r()<0.5?1:-1),y+i,Z,id,MODE_SET);}}
function deadTreeP(X,y,Z,r){ // a dead tree: a grey trunk and a few bare branches
  const th=4+(r()*4|0);if(y+th+3>=H)return;PW(X,y-1,Z,DIRT,MODE_SET);for(let i=0;i<th;i++)PW(X,y+i,Z,DEADWOOD,MODE_SET);
  for(let k=0;k<3;k++){const a=r()*6.283,by=y+th-1-(r()*3|0),len=2+(r()*2|0);for(let t=1;t<=len;t++)PW(X+Math.round(Math.cos(a)*t),by+(t>1?1:0),Z+Math.round(Math.sin(a)*t),DEADWOOD,MODE_SET);}
}
Object.assign(FOREST,{
  dry:{trees:0.006,tree:(X,y,Z,r)=>cactusP(X,y,Z,r),top:o=>o.dn>0.25?RSAND:SAND,shore:()=>SAND,rock:SANDSTONE,soil:SAND,plant:r=>r<0.02?DBUSH:0},
  steppe:{trees:0.0015,glade:true,tree:(X,y,Z,r)=>bigOakP(X,y,Z,r),top:()=>GOLDGRASS,plant:r=>r<0.3?STEPPEG:r<0.31?FLOWY:0},
  volcanic:{trees:0.004,tree:(X,y,Z,r)=>spireP(X,y,Z,r,BASALT),top:o=>o.dn>0.2?BASALT:ASH,rock:BASALT,soil:ASH,plant:r=>r<0.01?DBUSH:0},
  blight:{trees:0.01,tree:(X,y,Z,r)=>deadTreeP(X,y,Z,r),top:o=>o.dn>0.3?DIRT:DEADGRASS,plant:r=>r<0.06?DBUSH:0}
});
FLOORS.add(GOLDGRASS);FLOORS.add(DEADGRASS);FLOORS.add(ASH);FOREST.dry.floors=new Set([SAND,RSAND]); // sand is a floor only in the drylands
Object.assign(SIGS,{
  dry:[['sandtemple','Sand-buried Temple',9],['wadi','Dry Wadi with a Well',10]],
  steppe:[['horsestones','Ring of Horse Stones',9],['outcrop','Lone Outcrop',7]],
  volcanic:[['fireshrine','Fire Shrine',7],['cone','Smoking Cone',13]],
  blight:[['deadhall',"Dead Lord's Hall",10],['deadgrove','Grey Grove',11]]
});
// The hotter deep: over the Fire Below under the Volcanic Wastes, the rock of the lava sea's roof is shot through with magma stone
const TVO={};
function hotDeep(x,z,X,Z,ceil){colInfo(X,Z,TVO);if(TVO.wVolc<0.5)return;const col=x+W*z,WD=W*D;
  for(let y=ceil+1;y<=ceil+6;y++){const i=col+WD*y,v=world[i];if((v===STONE||v===DEEP)&&hsh(X,y,Z)<0.55-(y-ceil)*0.06)world[i]=MAGMA;}}
function dryBuild(s,r){
  const X=s.X,Z=s.Z,g=s.g;
  switch(s.kind){
    default:strangeBuild(s,r);break; // the strange lands' signatures (M6f)
    case 'sandtemple':{ // a temple of sandstone half buried in the sand, its doorway dug clear, a barrel left in its hall
      const f=g-4;for(let dx=-6;dx<=6;dx++)for(let dz=-4;dz<=4;dz++){const edge=Math.abs(dx)===6||Math.abs(dz)===4,col=Math.abs(dx)%3===0&&Math.abs(dz)===2;
        for(let y=f-1;y<=g+3;y++){const id=y===f-1||y===f?SANDSTONE:edge?(y===f+3?TERO:SANDSTONE):col&&y<g+3?SANDSTONE:y===g+3?SANDSTONE:AIR;PW(X+dx,y,Z+dz,id,MODE_SET);}}
      for(let dx=-7;dx<=7;dx++)for(let dz=-5;dz<=5;dz++){if(Math.abs(dx)<=6&&Math.abs(dz)<=4)continue;for(let y=hAt(X+dx,Z+dz)+1;y<=g;y++)PW(X+dx,y,Z+dz,SAND,MODE_SET);}
      for(let k=0;k<5;k++)for(let c=-1;c<=1;c++){PW(X+c,f+1+k,Z+4+k,AIR,MODE_SET);PW(X+c,f+k,Z+4+k,SANDSTONE,MODE_SET);PW(X+c,f+2+k,Z+4+k,AIR,MODE_SET);}
      PW(X-4,f+1,Z-2,BARREL,MODE_SET);PW(X+4,f+1,Z-2,BARREL,MODE_SET);for(let dz=-1;dz<=1;dz++)PW(X,f+1,Z+dz-2,TERB,MODE_SET);break;}
    case 'wadi':{ // a dry wadi: a gravel bed sunk in the sand, and a stone well beside it, still holding water
      const ax=hsh(X,8511,Z)<0.5;for(let t=-14;t<=14;t++)for(let c=-2;c<=2;c++){const px=ax?X+t:X+c,pz=ax?Z+c:Z+t+Math.round(Math.sin(t*0.3)*2),pg=hAt(px,pz),d=Math.abs(c)===2?1:2;
        for(let y=pg-d+1;y<=pg+2;y++)PW(px,y,pz,AIR,MODE_SET);PW(px,pg-d,pz,GRAVEL,MODE_SET);}
      const wx=ax?X:X+5,wz=ax?Z+5:Z;s.pl=g-1;
      for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){for(let y=g-7;y<=g+1;y++){const rim=dx||dz;PW(wx+dx,y,wz+dz,rim?(y>g?COBBLE:SANDSTONE):(y<=g-1&&y>g-7?WATER:y===g-7?SANDSTONE:AIR),MODE_SET);}}
      for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)if(Math.max(Math.abs(dx),Math.abs(dz))===2)for(let y=g-7;y<=g;y++)PW(wx+dx,y,wz+dz,SANDSTONE,MODE_STONE);break;}
    case 'horsestones':{ // a ring of standing stones carved with horses, and a broad stone at its middle
      for(let k=0;k<9;k++){const a=k/9*6.283,px=Math.round(X+Math.cos(a)*8),pz=Math.round(Z+Math.sin(a)*8),pg=hAt(px,pz),hh=2+(hsh(px,8513,pz)<0.3?0:2);if(hsh(px,8515,pz)<0.15)continue;
        for(let y=pg;y<=pg+hh;y++){PW(px,y,pz,y===pg+hh-1?SBRICK:STONE,MODE_SET);if(y<pg+hh)PW(px+(Math.abs(Math.cos(a))>0.7?0:1),y,pz+(Math.abs(Math.cos(a))>0.7?1:0),STONE,MODE_SET);}}
      for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=0;dz++)PW(X+dx,g+1,Z+dz,STONE,MODE_SET);PW(X,g+2,Z,SBRICK,MODE_SET);break;}
    case 'outcrop':{ // a lone outcrop of grey rock standing over the grass
      for(let y=g-2;y<=g+10;y++){const t=(y-g)/10,R=6*(1-t*0.6)+fbm2(y/3,X/9,1,8517.1)*1.2,ri=Math.ceil(R);
        for(let dx=-ri;dx<=ri;dx++)for(let dz=-ri;dz<=ri;dz++){const d=Math.hypot(dx*1.2,dz)+fbm2((X+dx)/4,(Z+dz)/4,1,8519.3)*1.5;if(d<=R)PW(X+dx,y,Z+dz,y>=g+9&&d<R-1?GRASS:hsh(X+dx,y,Z+dz)<0.25?MOSSY:STONE,MODE_SET);}}break;}
    case 'fireshrine':{ // a ruined fire shrine: a basalt floor, four obsidian pillars, magma at the heart, a cold brazier
      sigFloor(X-3,Z-3,X+3,Z+3,g,BASALT,8);
      for(const [a,b] of [[-3,-3],[3,-3],[-3,3],[3,3]]){const hh=3+(hsh(X+a,8521,Z+b)*3|0);for(let y=g+1;y<=g+hh;y++)PW(X+a,y,Z+b,OBSID,MODE_SET);}
      PW(X,g,Z,MAGMA,MODE_SET);PW(X+1,g,Z,MAGMA,MODE_SET);PW(X,g+1,Z-2,BASALT,MODE_SET);PW(X,g+2,Z-2,DLANTERN,MODE_SET);break;}
    case 'cone':{ // a smoking cone of basalt and ash with a lake of lava held in its crater, walled by rock on every side
      const Hc=12,top=g+Hc;
      for(let dx=-13;dx<=13;dx++)for(let dz=-13;dz<=13;dz++){const d=Math.hypot(dx,dz)+fbm2((X+dx)/6,(Z+dz)/6,1,8523.7)*1.2;if(d>13)continue;const hh=Math.round(Hc*Math.min(1,(13-d)/8)),pg=hAt(X+dx,Z+dz);
        for(let y=pg;y<=g+hh;y++)PW(X+dx,y,Z+dz,y===g+hh?(hsh(X+dx,y,Z+dz)<0.6?ASH:BASALT):BASALT,MODE_SET);
        if(d<4.2){for(let y=top-3;y<=top;y++)PW(X+dx,y,Z+dz,y<=top-2?(d<3.4?LAVA:BASALT):AIR,MODE_SET);PW(X+dx,top-4,Z+dz,MAGMA,MODE_SET);}}break;}
    case 'deadhall':{ // the hall of a dead lord: walls of dark stone, a fallen roof, a broken throne, cobwebs in the corners
      sigFloor(X-7,Z-4,X+7,Z+4,g,MOSSY,9);
      for(let dx=-7;dx<=7;dx++)for(let dz=-4;dz<=4;dz++){const edge=Math.abs(dx)===7||Math.abs(dz)===4;if(!edge)continue;const hh=3+Math.floor(3*Math.abs(fbm2((X+dx)/5,(Z+dz)/5,1,8525.1))*2);
        for(let y=g+1;y<=g+Math.min(6,hh);y++){if(dz===4&&Math.abs(dx)<=1&&y<=g+3)continue;PW(X+dx,y,Z+dz,r()<0.3?MOSSY:COBBLE,MODE_SET);}}
      for(let dx=-6;dx<=6;dx+=3)if(r()<0.6)for(let dz=-3;dz<=3;dz++)PW(X+dx,g+6,Z+dz,DEADWOOD,MODE_SET);
      PW(X,g+1,Z-3,SBRICK,MODE_SET);PW(X,g+2,Z-3,SBRICK,MODE_SET);PW(X-1,g+1,Z-3,SBRICK,MODE_SET);PW(X+1,g+1,Z-3,SBRICK,MODE_SET);
      for(const [a,b] of [[-6,-3],[6,-3],[-6,3],[6,3]])PW(X+a,g+3,Z+b,COBWEB,MODE_SET);PW(X+5,g+1,Z+2,BARREL,MODE_SET);break;}
    case 'deadgrove':{ // a grey grove: dead trees round three pits of ash
      for(let k=0;k<3;k++){const a=k*2.1+hsh(X,8527+k,Z),px=Math.round(X+Math.cos(a)*(k?4:0)),pz=Math.round(Z+Math.sin(a)*(k?4:0));
        for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)if(Math.hypot(dx,dz)<2.3){const pg=hAt(px+dx,pz+dz);PW(px+dx,pg,pz+dz,AIR,MODE_SET);PW(px+dx,pg-1,pz+dz,ASH,MODE_SET);}}
      for(let k=0;k<8;k++){const a=k/8*6.283,x=Math.round(X+Math.cos(a)*10),z=Math.round(Z+Math.sin(a)*10);deadTreeP(x,hAt(x,z)+1,z,r);}break;}
  }
}
