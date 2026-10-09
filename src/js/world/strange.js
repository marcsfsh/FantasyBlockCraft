// ---- Strange lands (M6f, D-044; Q115, Q118, Q130): Crystal Barrens, Glowcap Hollows, Petrified Forest and Starfall Craters, the
// rare tier. Each holds a rare find for later magic (Q68, Q130): prism shards on crystal spires, amber in stone trees, starmetal in
// the hearts of craters; glowcap gills give a soft light.
function crystalP(X,y,Z,r){ // a crystal spire, sometimes tipped with a prism shard
  const h=3+(r()*7|0),lean=r()<0.5?1:-1;for(let i=-1;i<h;i++){const x=X+(i>h*0.6?lean:0);PW(x,y+i,Z,AMETH,MODE_SET);if(i<h/3&&r()<0.5)PW(x+(r()<0.5?1:-1),y+i,Z,AMETH,MODE_SET);}
  if(r()<0.3)PW(X+(h>4?lean:0),y+h,Z,PRISM,MODE_SET);
}
function capP(X,y,Z,r,big){ // a giant glowcap: a pale stalk and a broad cap, its gills glowing underneath
  const th=big?8+(r()*5|0):4+(r()*4|0),R=big?5.5:3.2;if(y+th+4>=H)return;
  for(let i=-1;i<th;i++){PW(X,y+i,Z,MUSHSTEM,MODE_SET);if(big&&i<3)for(const [a,b] of [[1,0],[0,1]])PW(X+a,y+i,Z+b,MUSHSTEM,MODE_SET);}
  const ri=Math.ceil(R);for(let dx=-ri;dx<=ri;dx++)for(let dz=-ri;dz<=ri;dz++){const d=Math.hypot(dx,dz);if(d>R)continue;const dome=Math.round(2*(1-d/R));
    for(let k=0;k<=dome;k++)PW(X+dx,y+th+k,Z+dz,CAPB,MODE_SET);if(d>R*0.45&&d<R-0.6&&((dx+dz)&1))PW(X+dx,y+th-1,Z+dz,CAPG,MODE_AIR);}
}
function petriP(X,y,Z,r){ // a tree turned to stone: a trunk and the stumps of its branches, now and then a lump of amber in it
  const th=4+(r()*5|0);for(let i=-1;i<th;i++)PW(X,y+i,Z,PETRIWOOD,MODE_SET);
  for(let k=0;k<2+(r()*2|0);k++){const a=r()*6.283,by=y+2+(r()*(th-2)|0),len=1+(r()*2|0);for(let t=1;t<=len;t++)PW(X+Math.round(Math.cos(a)*t),by+(t>1?1:0),Z+Math.round(Math.sin(a)*t),PETRIWOOD,MODE_SET);}
  if(r()<0.12)PW(X,y+1+(r()*(th-2)|0),Z,AMBER,MODE_SET);
}
// The crater field of Starfall Craters: one crater in about two of the cells of 56 blocks, a bowl with a raised rim, its floor of
// scorched stone; read by colInfoBase (crater depth for the height, o.cr for the floor)
const CRATER_C=56;
function craterAt(X,Z,o){
  const ci=Math.floor(X/CRATER_C),cj=Math.floor(Z/CRATER_C);let dep=0,rim=0;
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const i=ci+a,j=cj+b;if(hsh(i,8601,j)>0.5)continue;const cx=(i+0.25+hsh(i,8603,j)*0.5)*CRATER_C,cz=(j+0.25+hsh(i,8605,j)*0.5)*CRATER_C,R=6+hsh(i,8607,j)*10,d=Math.hypot(X-cx,Z-cz);
    if(d<R)dep=Math.max(dep,(1-(d/R)*(d/R))*R*0.45);else if(d<R*1.5)rim=Math.max(rim,Math.sin((d-R)/(R*0.5)*Math.PI)*R*0.15);}
  o.cr=dep>0.8;return rim-dep;
}
Object.assign(FOREST,{
  crystal:{trees:0.006,tree:(X,y,Z,r)=>crystalP(X,y,Z,r),top:o=>o.dn>0.1?CALCITE:o.dn>-0.2?GRAVEL:PALEG,plant:r=>r<0.02?DBUSH:0},
  glowcap:{trees:0.014,tree:(X,y,Z,r)=>capP(X,y,Z,r,hsh(X,8611,Z)<0.3),top:o=>o.dn>-0.1?FMOSS:GRASS,plant:r=>r<0.04?GLOWSHROOM:r<0.05?MUSHB:r<0.14?FERN:0},
  petrified:{trees:0.008,tree:(X,y,Z,r)=>petriP(X,y,Z,r),top:o=>o.dn>0.2?RSAND:o.dn>-0.25?SAND:GRAVEL,soil:SAND,plant:r=>r<0.02?DBUSH:0,floors:new Set([SAND,RSAND])},
  starfall:{trees:0.002,tree:(X,y,Z,r)=>treeP(X,y,Z,LOG,LEAVES,4,r),top:o=>o.cr?SCORCH:o.dn>0.3?GRAVEL:GRASS,plant:r=>r<0.08?TGRASS:r<0.09?FLOWY:0}
});
Object.assign(SIGS,{
  crystal:[['cutters',"Crystal Cutters' Ruin",8],['spires','Crystal Spires',10]],
  glowcap:[['mushhome','Mushroom Dwelling',7],['giantcaps','Giant Glowcaps',10]],
  petrified:[['stoneway','Waystation of Stone',7],['stonetrees','Grove of Stone Trees',10]],
  starfall:[['startower','Star Tower',6],['starheart','Crater of the Starmetal Heart',14]]
});
function strangeBuild(s,r){
  const X=s.X,Z=s.Z,g=s.g;
  switch(s.kind){
    case 'cutters':{ // the crystal cutters' ruin: low stone walls, a worktable of calcite, cut shards left on it
      sigFloor(X-4,Z-3,X+4,Z+3,g,CALCITE,7);
      for(let dx=-4;dx<=4;dx++)for(let dz=-3;dz<=3;dz++){const edge=Math.abs(dx)===4||Math.abs(dz)===3;if(!edge)continue;const hh=1+(hsh(X+dx,8613,Z+dz)*3|0);for(let y=g+1;y<=g+hh;y++)if(!(dz===3&&Math.abs(dx)<=1))PW(X+dx,y,Z+dz,r()<0.3?MOSSY:COBBLE,MODE_SET);}
      for(let dx=-1;dx<=1;dx++)PW(X+dx,g+1,Z-1,CALCITE,MODE_SET);PW(X,g+2,Z-1,PRISM,MODE_SET);PW(X-1,g+2,Z-1,AMETH,MODE_SET);PW(X+3,g+1,Z+2,BARREL,MODE_SET);break;}
    case 'spires':{ // a stand of tall crystal spires, prisms at their tips
      for(let k=0;k<9;k++){const a=k*0.7+hsh(X,8615+k,Z),d=k?2+k*0.9:0,px=Math.round(X+Math.cos(a)*d),pz=Math.round(Z+Math.sin(a)*d),pg=hAt(px,pz),h=6+Math.floor(hsh(px,8617,pz)*10);
        for(let y=pg-1;y<=pg+h;y++){PW(px,y,pz,AMETH,MODE_SET);if(y<pg+h*0.4)PW(px+1,y,pz,AMETH,MODE_SET);}PW(px,pg+h+1,pz,PRISM,MODE_SET);}break;}
    case 'mushhome':{ // a dwelling hollowed in a giant glowcap stalk: a door, a round room, a lamp of glowing gills
      for(let y=g-1;y<=g+8;y++)for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++){const d=Math.hypot(dx,dz);if(d>3.2)continue;const inside=d<2.2&&y>=g+1&&y<=g+3,door=dz===3&&dx===0&&y>=g+1&&y<=g+2;PW(X+dx,y,Z+dz,inside||door?AIR:y===g?PLANKS:MUSHSTEM,MODE_SET);}
      for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++){const d=Math.hypot(dx,dz);if(d>6)continue;for(let k=0;k<=Math.round(2*(1-d/6));k++)PW(X+dx,g+9+k,Z+dz,CAPB,MODE_SET);if(d>3.5&&d<5.5&&((dx+dz)&1))PW(X+dx,g+8,Z+dz,CAPG,MODE_AIR);}
      PW(X,g+3,Z,CAPG,MODE_SET);PW(X-1,g+1,Z-1,BARREL,MODE_SET);break;}
    case 'giantcaps':{ // a ring of giant glowcaps round a mossy hollow
      for(let k=0;k<6;k++){const a=k/6*6.283+0.4,x=Math.round(X+Math.cos(a)*8),z=Math.round(Z+Math.sin(a)*8);capP(x,hAt(x,z)+1,z,r,true);}
      for(let dx=-5;dx<=5;dx++)for(let dz=-5;dz<=5;dz++)if(Math.hypot(dx,dz)<5){const pg=hAt(X+dx,Z+dz);PW(X+dx,pg,Z+dz,FMOSS,MODE_SET);if(hsh(X+dx,8619,Z+dz)<0.2)PW(X+dx,pg+1,Z+dz,GLOWSHROOM,MODE_AIR);}break;}
    case 'stoneway':{ // a waystation turned to stone: a little shelter of petrified beams, a stone bench, a waymark
      sigFloor(X-3,Z-3,X+3,Z+3,g,SANDSTONE,7);
      for(const [a,b] of [[-3,-3],[3,-3],[-3,3],[3,3]])for(let y=g+1;y<=g+4;y++)PW(X+a,y,Z+b,PETRIWOOD,MODE_SET);
      for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++)if((Math.abs(dx)===3||Math.abs(dz)===3)&&r()<0.75)PW(X+dx,g+5,Z+dz,PETRIWOOD,MODE_SET);
      for(let dx=-1;dx<=1;dx++)PW(X+dx,g+1,Z-2,SANDSTONE,MODE_SET);for(let y=g+1;y<=g+3;y++)PW(X+5,y,Z,y===g+3?SBRICK:SANDSTONE,MODE_SET);PW(X+1,g+1,Z+1,AMBER,MODE_SET);break;}
    case 'stonetrees':{ // a grove of stone trees, the biggest with amber in its heart
      for(let k=0;k<10;k++){const a=k*0.63+hsh(X,8621,Z),d=k?3+k*0.8:0,x=Math.round(X+Math.cos(a)*d),z=Math.round(Z+Math.sin(a)*d);petriP(x,hAt(x,z)+1,z,r);}
      PW(X,g+2,Z,AMBER,MODE_SET);PW(X,g+3,Z,AMBER,MODE_SET);break;}
    case 'startower':{ // a ruined star tower: a round tower open to the sky, a stair winding up its wall
      for(let y=g-1;y<=g+14;y++)for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++){const d=Math.hypot(dx,dz);if(d>3.3)continue;const wall=d>2.2;
        if(wall){if(!(dz===3&&dx===0&&y>=g+1&&y<=g+2)&&!(y>g+11&&r()<0.4))PW(X+dx,y,Z+dz,y<=g?COBBLE:SBRICK,MODE_SET);}else PW(X+dx,y,Z+dz,y<=g?COBBLE:AIR,MODE_SET);}
      for(let y=g+1;y<=g+12;y++){const t=y*1.1,x=Math.round(X+Math.cos(t)*1.5),z=Math.round(Z+Math.sin(t)*1.5);PW(x,y,z,SBRICK,MODE_SET);}PW(X,g+1,Z,STARORE,MODE_SET);break;}
    case 'starheart':{ // the crater of the starmetal heart: a great bowl of scorched stone, starmetal at its middle
      for(let dx=-14;dx<=14;dx++)for(let dz=-14;dz<=14;dz++){const d=Math.hypot(dx,dz);if(d>14*1.4)continue;const pg=hAt(X+dx,Z+dz);
        if(d<14){const dep=Math.round((1-(d/14)*(d/14))*7),fl=g-dep;for(let y=fl+1;y<=pg+3;y++)PW(X+dx,y,Z+dz,AIR,MODE_SET);PW(X+dx,fl,Z+dz,SCORCH,MODE_SET);PW(X+dx,fl-1,Z+dz,SCORCH,MODE_SET);}
        else{const rh=Math.round(Math.sin((d-14)/7*Math.PI)*2.5);for(let y=pg;y<=g+rh;y++)PW(X+dx,y,Z+dz,y===g+rh?GRAVEL:SCORCH,MODE_SET);}}
      for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)for(let y=g-8;y<=g-6+((dx||dz)?0:1);y++)PW(X+dx,y,Z+dz,STARORE,MODE_SET);break;}
  }
}
