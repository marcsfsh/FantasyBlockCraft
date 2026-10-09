// ---- Coasts and waters (M6d, D-042; Q109, Q113, Q106, Q126, Q129): Chalk Cliffs, Rocky Isles, Fjords, Black Sand Shores, Kelp
// Shallows and Raised Bogs join the land looks (FOREST: shore is a land's own beach and shallows, rock its cliff stone, soil its
// earth); the Western Sea, the Grey Shore and the lakes are enriched with water plants, driftwood and lily pads; signatures stand
// on the cliffs, on the shore, or under the sea.
Object.assign(FOREST,{
  chalk:{trees:0.003,tree:(X,y,Z,r)=>treeP(X,y,Z,LOG,LEAVES,4,r),shore:()=>GRAVEL,rock:CHALK,plant:r=>r<0.12?TGRASS:r<0.15?FLOWY:r<0.16?FLOWR:0},
  isles:{top:o=>o.dn>0.05?STONE:GRASS,shore:()=>GRAVEL,plant:r=>r<0.1?TGRASS:0,seagrass:0.04},
  fjord:{trees:0.012,tree:(X,y,Z,r,o)=>spruceP(X,y,Z,r,o.h>SEA+50),top:o=>o.h>SEA+70?SNOWG:o.rid>0.2?STONE:GRASS,shore:()=>GRAVEL,plant:r=>r<0.08?TGRASS:r<0.1?FERN:0},
  blacksand:{top:o=>o.dn>0.32?BASALT:GRASS,shore:()=>BLACKSAND,plant:r=>r<0.08?TGRASS:r<0.1?DBUSH:0},
  kelp:{shore:()=>SAND,kelp:0.1,seagrass:0.2},
  bog:{trees:0.002,glade:true,tree:(X,y,Z,r)=>treeP(X,y,Z,BIRCH,BLEAVES,4,r),top:o=>o.h<=SEA?PEAT:o.dn>-0.15?BOGMOSS:GRASS,soil:PEAT,plant:r=>r<0.12?COTTONG:r<0.2?TGRASS:0},
  sea:{seagrass:0.02,kelp:0.006}
});
FALL_LANDS.add('fjord');
Object.assign(SIGS,{
  sea:[['wreck','Wreck on the Shoals',8,'sea'],['stacks','Sea Stacks',9,'sea']],
  isles:[['chapel','Isle Chapel',5],['arch','Sea Arch',8,'sea']],
  kelp:[['causeway','Sunken Causeway',16,'sea'],['kelpforest','Kelp Forest',12,'sea']],
  chalk:[['beacon','Beacon Tower',5,'coast'],['chalkarch','Chalk Arch',6,'cliffsea']],
  fjord:[['boathouse','Boathouse',6,'lowcoast'],['fjordfall','Fjord Fall',5,'coast']],
  blacksand:[['harbour','Harbour Wall',14,'lowcoast'],['basalt','Basalt Columns',7,'lowcoast']],
  bog:[['trackway','Old Trackway',16],['dome','Domed Bog',11]]
});
// Places for signatures that stand in the sea or on a coast. sea: on the floor of shallow water (3 to 14 deep) of the land;
// coast / lowcoast: on land of the land with the sea (or a fjord's inlet) within 6 to 28 blocks (lowcoast: no more than 10 above it), facing it (dx, dz);
// cliffsea: in the sea a few blocks off a cliff of the land (12 or more above the water).
function coastSite(c,L,R,mode){
  const o={},e={};
  for(let k=0;k<200;k++){const a=k*2.4,d=k?8+k*1.4:0,X=Math.round(c.x+Math.cos(a)*d),Z=Math.round(c.z+Math.sin(a)*d);colInfo(X,Z,o);
    if(o.lake||o.river||o.rvBot<999||surfTaken(X,Z,R+4))continue;
    if(mode==='sea'){if(o.area!==L.i||o.h>SEA-3||o.h<SEA-14||o.wS<0.5)continue;let ok=true;for(let m=0;m<8&&ok;m++){colInfo(X+Math.round(Math.cos(m*0.785)*R),Z+Math.round(Math.sin(m*0.785)*R),e);if(Math.abs(e.h-o.h)>4||e.h>=SEA||e.lake)ok=false;}
      if(ok)return{X:X,Z:Z,g:o.h,lo:o.h};continue;}
    const land=o.land===L.i&&o.h>SEA+2&&!o.wet;if(!land)continue;if(mode==='lowcoast'&&o.h>SEA+10)continue;
    for(let m=0;m<8;m++){const dx=Math.round(Math.cos(m*0.785)),dz=Math.round(Math.sin(m*0.785));
      let sea=0;for(let t=6;t<=28&&!sea;t+=2){colInfo(X+dx*t,Z+dz*t,e);if(e.h<SEA-1&&!e.lake&&!e.river&&(e.wS>0.3||e.wFjord>0.5))sea=t;} // the sea, or a fjord's inlet
      if(!sea)continue;
      if(mode==='cliffsea'){if(o.h<SEA+12)continue;const ax=X+dx*(sea+3),az=Z+dz*(sea+3);colInfo(ax,az,e);if(e.h>SEA-1||e.h<SEA-10||e.lake||e.wS<0.3)continue;return{X:ax,Z:az,g:e.h,lo:e.h,dx:dx,dz:dz};}
      return{X:X,Z:Z,g:o.h,lo:o.h,dx:dx,dz:dz,sea:sea};}}
  return null;
}
function driftP(X,y,Z,r){const ax=r()<0.5,len=2+(r()*3|0);for(let t=0;t<len;t++)PW(ax?X+t:X,y,ax?Z:Z+t,r()<0.8?LOG:BIRCH,MODE_AIR);}
// Water plants: kelp and seagrass on sandy, gravelly or muddy floors in the sea; lily pads on shallow lakes and pools
function waterPlants(x,z,X,Z,g,b){
  const top=world[I(x,g,z)],r=hsh(X,5,Z);
  if(b===0&&g>=SEA-6&&rapidAt(X,Z)){const t=hsh(X,8949,Z)<0.6?SEA:SEA-1;for(let y=g+1;y<=t;y++)world[I(x,y,z)]=hsh(X,y,Z)<0.3?MOSSY:STONE;return;} // rapids (M6h)
  if(b===0&&(top===SAND||top===GRAVEL||top===DIRT||top===BLACKSAND)){colInfo(X,Z,TP);const F=forestOf(TP),kd=F&&F.kelp||0,sg=F&&F.seagrass!==undefined?F.seagrass:0.015;
    if(r<kd){const hh=2+Math.floor(hsh(X,8401,Z)*(SEA-g-1));for(let y=g+1;y<=Math.min(SEA-2,g+hh);y++){const i=I(x,y,z);if(world[i]!==WATER)break;world[i]=KELP;}}
    else if(r<kd+sg)world[I(x,g+1,z)]=SEAGRASS;return;}
  if(b===9||b===11){let y=g+1;while(y<H-1&&world[I(x,y,z)]===WATER)y++;if(y-1-g<=3&&world[I(x,y,z)]===AIR&&r<0.035)world[I(x,y,z)]=LILYPAD;}
}
// ---- Builders for the coasts' signatures (called by sigBuild through hiBuild)
function coastBuild(s,r){
  const X=s.X,Z=s.Z,g=s.g;
  switch(s.kind){
    default:dryBuild(s,r);break; // the dry lands' signatures (M6e)
    case 'wreck':{ // the hull of an old ship sunk in the shallows, her mast broken, a barrel still in her hold
      const ax=hsh(X,8411,Z)<0.5,P2=(t,c,y,id)=>PW(ax?X+t:X+c,y,ax?Z+c:Z+t,id,MODE_SET);
      for(let t=-6;t<=6;t++){const w=Math.max(1,Math.round(2.6*Math.sqrt(1-(t/7)*(t/7))));for(let c=-w;c<=w;c++){P2(t,c,g,PLANKS);if(Math.abs(c)===w)for(let y=g+1;y<=g+2+(Math.abs(t)>4?1:0);y++)if(r()<0.85)P2(t,c,y,PLANKS);}
        P2(t,0,g-1,LOG);if(Math.abs(t)<=3&&t%2===0&&r()<0.7)for(let c=-w+1;c<=w-1;c++)P2(t,c,g+3,PLANKS);}
      for(let y=g+1;y<=g+6;y++)P2(1,0,y,LOG);P2(-2,1,g+1,BARREL);break;}
    case 'stacks':{ // sea stacks: pillars of rock standing out of the water
      for(let k=0;k<4;k++){const a=k*1.7+hsh(X,8413+k,Z),d=k?4+k*2:0,px=Math.round(X+Math.cos(a)*d),pz=Math.round(Z+Math.sin(a)*d),top=SEA+5+Math.floor(hsh(px,8417,pz)*9),R=1.4+hsh(pz,8419,px)*1.4,pg=hAt(px,pz);
        for(let y=pg-1;y<=top;y++){const rr=R*(1-0.25*(y-pg)/(top-pg+1)),ri=Math.ceil(rr);for(let dx=-ri;dx<=ri;dx++)for(let dz=-ri;dz<=ri;dz++)if(Math.hypot(dx,dz)<=rr)PW(px+dx,y,pz+dz,y>top-1&&r()<0.4?GRASS:hsh(px+dx,y,pz+dz)<0.3?COBBLE:STONE,MODE_SET);}}break;}
    case 'chapel':{ // a little chapel of grey stone on its isle, its roof half gone
      sigFloor(X-3,Z-2,X+3,Z+2,g,COBBLE,8);
      for(let dx=-3;dx<=3;dx++)for(let dz=-2;dz<=2;dz++){const edge=Math.abs(dx)===3||Math.abs(dz)===2;if(!edge)continue;for(let y=g+1;y<=g+4;y++){if(dx===3&&dz===0&&y<=g+2)continue;if(dz!==0&&dx===0&&y===g+3)continue;PW(X+dx,y,Z+dz,r()<0.35?MOSSY:COBBLE,MODE_SET);}}
      for(let dx=-3;dx<=3;dx++)for(let k=0;k<=2;k++){if(dx>0&&r()<0.6)continue;PW(X+dx,g+5+k,Z-2+k,SBRICK,MODE_SET);PW(X+dx,g+5+k,Z+2-k,SBRICK,MODE_SET);}
      for(let y=g+1;y<=g+7;y++)PW(X-3,y,Z,COBBLE,MODE_SET);PW(X-2,g+1,Z,STONE,MODE_SET);PW(X-2,g+2,Z,DLANTERN,MODE_SET);break;}
    case 'arch':{ // a sea arch: two legs of rock in the water and the span between them
      const ax=hsh(X,8421,Z)<0.5,top=SEA+9;
      for(let t=-5;t<=5;t++)for(let c=-1;c<=1;c++){const leg=Math.abs(t)>=3,y0=leg?hAt(ax?X+t:X+c,ax?Z+c:Z+t)-1:SEA+5+Math.round(2*Math.cos(t*0.5));for(let y=y0;y<=top-(Math.abs(t)>=5?1:0);y++)PW(ax?X+t:X+c,y,ax?Z+c:Z+t,hsh(X+t,y,Z+c)<0.3?COBBLE:STONE,MODE_SET);}break;}
    case 'causeway':{ // an old causeway under the shallows: a road of dressed stone, broken, leading out to sea
      const ax=hsh(X,8423,Z)<0.5;for(let t=-15;t<=15;t++){if(hsh(X+t,8425,Z)<0.12)continue;for(let c=-1;c<=1;c++){const px=ax?X+t:X+c,pz=ax?Z+c:Z+t,pg=hAt(px,pz);for(let y=pg;y<=g+1;y++)PW(px,y,pz,hsh(px,y,pz)<0.3?MOSSY:SBRICK,MODE_SET);}}break;}
    case 'kelpforest':{ // a kelp forest: tall kelp crowding the floor, reaching nearly to the surface
      for(let dx=-12;dx<=12;dx++)for(let dz=-12;dz<=12;dz++){if(Math.hypot(dx,dz)>12||hsh(X+dx,8427,Z+dz)>0.45)continue;const px=X+dx,pz=Z+dz,pg=hAt(px,pz);if(pg>=SEA-2)continue;
        for(let y=pg+1;y<=SEA-2;y++)PW(px,y,pz,KELP,MODE_SET);PW(px,pg,pz,SAND,MODE_SET);}break;}
    case 'beacon':{ // a beacon tower on the cliff top, its fire long cold
      sigFloor(X-2,Z-2,X+2,Z+2,g,COBBLE,14);
      for(let y=g+1;y<=g+11;y++)for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){const d=Math.hypot(dx,dz);if(d>2.4)continue;const wall=d>1.2;if(wall&&!(dx===0&&dz===2&&y<=g+2))PW(X+dx,y,Z+dz,y>g+8&&r()<0.2?AIR:(r()<0.3?MOSSY:COBBLE),MODE_SET);else if(!wall)PW(X+dx,y,Z+dz,AIR,MODE_SET);}
      for(let y=g+1;y<=g+11;y++)PW(X-1,y,Z,LADDER,MODE_SET);PW(X,g+11,Z,COBBLE,MODE_SET);PW(X,g+12,Z,DLANTERN,MODE_SET);break;}
    case 'chalkarch':{ // an arch of chalk standing in the sea off the cliffs
      const ax=s.dx===0,top=SEA+11;
      for(let t=-4;t<=4;t++)for(let c=-1;c<=1;c++){const px=ax?X+t:X+c,pz=ax?Z+c:Z+t,leg=Math.abs(t)>=2,y0=leg?hAt(px,pz)-1:SEA+6+Math.round(1.5*Math.cos(t*0.7));for(let y=y0;y<=top-(Math.abs(t)===4?2:0);y++)PW(px,y,pz,y>=top-1&&r()<0.5?GRASS:CHALK,MODE_SET);}break;}
    case 'boathouse':{ // a timber boathouse at the head of the fjord, its slip running into the water
      const dx=s.dx,dz=s.dz;for(let t=-1;t<=s.sea+1;t++)for(let c=-2;c<=2;c++){const px=X+dx*t-dz*c,pz=Z+dz*t+dx*c,edge=Math.abs(c)===2,y=SEA+1;
        PW(px,y,pz,PLANKS,MODE_SET);if(t%3===0&&edge)for(let yy=SEA-6;yy<y;yy++)PW(px,yy,pz,SPRUCE,MODE_SET);
        if(t<=4){for(let yy=y+1;yy<=y+3;yy++)PW(px,yy,pz,edge||t===-1?PLANKS:AIR,MODE_SET);PW(px,y+4,pz,SPRUCE,MODE_SET);}}
      PW(X,SEA+2,Z,BARREL,MODE_SET);break;}
    case 'fjordfall':{ // a fall pouring off the fjord wall straight down to the water
      const dx=s.dx,dz=s.dz;let t=1,px=X,pz=Z,ph=g;for(;t<=s.sea;t++){const qh=hAt(X+dx*t,Z+dz*t);if(qh<SEA){break;}px=X+dx*t;pz=Z+dz*t;ph=qh;}
      for(let k=-2;k<=0;k++)PW(px-dx*(1-k)+0,ph,pz-dz*(1-k),WATER,MODE_SET);
      for(let y=SEA;y<=ph;y++)PW(px+dx,y,pz+dz,WATER,MODE_SET);break;}
    case 'harbour':{ // a harbour wall of black stone running out into the sea, mooring posts along it
      const dx=s.dx,dz=s.dz;for(let t=-2;t<=s.sea+4;t++)for(let c=-1;c<=1;c++){const px=X+dx*t-dz*c,pz=Z+dz*t+dx*c,pg=hAt(px,pz);if(hsh(px,8431,pz)<0.06)continue;
        for(let y=Math.min(pg,SEA-1)-1;y<=SEA+2;y++)PW(px,y,pz,BASALT,MODE_SET);if(c!==0&&t%4===0)PW(px,SEA+3,pz,LOG,MODE_SET);}break;}
    case 'basalt':{ // basalt columns: a cluster of six-sided pillars stepping down to the water
      for(let dx=-7;dx<=7;dx++)for(let dz=-7;dz<=7;dz++){const d=Math.hypot(dx,dz);if(d>7)continue;const cx=Math.floor((X+dx)/2),cz=Math.floor((Z+dz)/2),hh=Math.round((1-d/7)*7+hsh(cx,8433,cz)*3),pg=hAt(X+dx,Z+dz);
        for(let y=pg-1;y<=pg+hh;y++)PW(X+dx,y,Z+dz,BASALT,MODE_SET);}break;}
    case 'trackway':{ // an old trackway of planks on posts across the bog
      const ax=hsh(X,8435,Z)<0.5;for(let t=-15;t<=15;t++){if(hsh(X+t,8437,Z)<0.08)continue;for(let c=0;c<=1;c++){const px=ax?X+t:X+c,pz=ax?Z+c:Z+t,pg=Math.max(hAt(px,pz),SEA);PW(px,pg+1,pz,PLANKS,MODE_SET);if(t%4===0&&c===0)for(let y=pg-2;y<=pg;y++)PW(px,y,pz,LOG,MODE_SET);}}break;}
    case 'dome':{ // a raised bog: a dome of bog moss swelling above the land, pools of dark water on its crown
      for(let dx=-11;dx<=11;dx++)for(let dz=-11;dz<=11;dz++){const d=Math.hypot(dx,dz);if(d>11)continue;const hh=Math.round(4*(1-(d/11)*(d/11))),pg=hAt(X+dx,Z+dz);
        for(let y=pg;y<=g+hh;y++)PW(X+dx,y,Z+dz,y===g+hh?BOGMOSS:PEAT,MODE_SET);}
      s.pl=g+3;for(const [px,pz,R] of sigPonds(s))for(let dx=-R;dx<=R;dx++)for(let dz=-R;dz<=R;dz++)if(Math.hypot(dx,dz)<R){PW(px+dx,g+3,pz+dz,WATER,MODE_SET);PW(px+dx,g+4,pz+dz,AIR,MODE_SET);}
      for(let k=0;k<10;k++){const a=k*0.63,x=Math.round(X+Math.cos(a)*7),z=Math.round(Z+Math.sin(a)*7);PW(x,g+3,z,COTTONG,MODE_AIR);}break;}
  }
}
