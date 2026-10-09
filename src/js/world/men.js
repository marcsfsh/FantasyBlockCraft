// ---- Old lands of men (M6g, D-045; Q116, Q123, Q125): Overgrown Farmland, Wild Orchards, Flower Meadows and Old Terraces join the
// land looks and signatures; small structures of the men of old stand across many lands (Q123, Q125): bridges, farmsteads,
// cairns and wayside shrines, abandoned camps, beacon hills, mills and jetties, chapels with graveyards; dry-stone walls run across
// the farmland and the green hills.
function fruitTreeP(X,y,Z,r){ // a small fruit tree: a short trunk, a round head of orchard leaves, some in blossom
  const th=3+(r()*2|0);if(y+th+3>=H)return;PW(X,y-1,Z,DIRT,MODE_SET);for(let i=0;i<th;i++)PW(X,y+i,Z,LOG,MODE_SET);
  const top=y+th,bl=hsh(Math.floor(X/40),8701,Math.floor(Z/40))<0.35;
  for(let dx=-2;dx<=2;dx++)for(let dy=-1;dy<=2;dy++)for(let dz=-2;dz<=2;dz++){const d=Math.hypot(dx,dy*1.2,dz);if(d<=2.4&&!(d>2&&r()<0.4))PW(X+dx,top+dy,Z+dz,bl&&r()<0.3?BLOSSOM:FRUITL,MODE_AIR);}
}
// Field patches of the overgrown farmland: rectangles of about 24 blocks, furrows running one way or the other
const fieldAt=(X,Z)=>{const fx=Math.floor(X/24),fz=Math.floor(Z/24),q=hsh(fx,8703,fz);return q<0.7?{rows:q<0.35,crop:hsh(fx,8705,fz)}:null;};
Object.assign(FOREST,{
  farm:{trees:0.0015,glade:true,tree:(X,y,Z,r)=>bigOakP(X,y,Z,r),top:o=>{const f=fieldAt(o.X,o.Z);return f&&((f.rows?o.X:o.Z)&1)?FARM_D:GRASS;},
    plant:(r,X,Z,o)=>{const f=fieldAt(X,Z);if(f&&((f.rows?X:Z)&1))return r<0.55?(f.crop<0.6?WHEAT:f.crop<0.85?WTURN:POT3):0;return r<0.2?TGRASS:r<0.22?FLOWY:0;}},
  orchard:{grid:7,tree:(X,y,Z,r)=>fruitTreeP(X,y,Z,r),plant:r=>r<0.12?TGRASS:r<0.16?FLOWR:r<0.2?OXEYE:0},
  flower:{trees:0.001,glade:true,tree:(X,y,Z,r)=>treeP(X,y,Z,BIRCH,BLEAVES,5,r),
    plant:(r,X,Z)=>{const band=Math.floor((fbm2(X/40,Z/40,1,8707.3)+1)*3)%5,fl=[FLOWR,FLOWY,BLUEB,OXEYE,LAVENDER][band];return r<0.5?fl:r<0.6?[FLOWR,FLOWY,OXEYE][Math.floor(r*30)%3]:r<0.7?TGRASS:0;}},
  terrace:{trees:0.004,glade:true,tree:(X,y,Z,r)=>fruitTreeP(X,y,Z,r),wall:COBBLE,plant:r=>r<0.1?TGRASS:r<0.13?LAVENDER:0}
});
FLOORS.add(FARM_D);
Object.assign(SIGS,{
  farm:[['manor','Abandoned Manor Farm',11],['furrows','Old Furrows',12]],
  orchard:[['keeper',"Orchard Keeper's Cottage",7],['oldrows','Old Fruit Rows',12]],
  flower:[['flshrine','Flower Shrine',6],['flbands','Bands of Wildflowers',13]],
  terrace:[['tvillage','Terraced Village',12],['tsteps','Stone Terraces',10]]
});
// ---- Small structures: about one chunk in thirty-five, the kind chosen by the land and the ground; pure per chunk, built by the
// chunks around it (they reach at most 14 blocks from their middle)
const smallC=new Map(),TSM={},TSM2={};
const SMALL_LANDS={bridge:null,farmstead:['green','farm','orchard','flower','steppe','terrace','elder','autumn','birch','barrow','willow'],cairn:['moors','barrow','mtn','alpine','tundra','karst','green','pine','fjord'],
  camp:['elder','autumn','birch','pine','yew','silver','moors','shadow','giant','steppe','dry','blight','petrified'],beacon:['green','moors','barrow','chalk','terrace','alpine','mtn','steppe'],
  mill:null,jetty:null,chapel:['green','farm','orchard','flower','terrace','willow','birch','chalk','isles','tundra']};
function smallAt(WCX,WCZ){
  const key=WCX*65536+WCZ;if(smallC.has(key))return smallC.get(key);if(smallC.size>20000)smallC.clear();let s=null;
  if(hsh(WCX,8711,WCZ)<0.03){const X=WCX*CS+8,Z=WCZ*CS+8;colInfo(X,Z,TSM);const L=LANDS[TSM.land].k,q=hsh(WCX,8713,WCZ);
    if(!surfTaken(X,Z,14)&&!sigNear(X,Z,14)&&TSM.rvBot===999){
      // a river through the middle of the chunk: a bridge across it, or a mill on its bank
      if(TSM.river){for(const [dx,dz] of [[1,0],[0,1]]){let a=0,b=0;for(let t=1;t<14&&!a;t++)if(!colInfo(X+dx*t,Z+dz*t,TSM2).river&&TSM2.h>=SEA)a=t;for(let t=1;t<14&&!b;t++)if(!colInfo(X-dx*t,Z-dz*t,TSM2).river&&TSM2.h>=SEA)b=t;
        if(a&&b&&a+b<=18){s=q<0.75?{kind:'bridge',X:X,Z:Z,dx:dx,dz:dz,a:a,b:b}:{kind:'mill',X:X+dx*(a+3),Z:Z+dz*(a+3),dx:dx,dz:dz,g:hAt(X+dx*(a+3),Z+dz*(a+3))};break;}}}
      else if(TSM.h>SEA+2&&!TSM.wet&&!TSM.lake&&!TSM.bank){
        // a lake within a few blocks: a jetty out over it
        let lake=null;for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){colInfo(X+dx*10,Z+dz*10,TSM2);if(TSM2.lake&&!lake)lake=[dx,dz];}
        if(lake)s={kind:'jetty',X:X,Z:Z,dx:lake[0],dz:lake[1],g:TSM.h};
        else{const kinds=Object.keys(SMALL_LANDS).filter(k=>SMALL_LANDS[k]&&SMALL_LANDS[k].includes(L));if(kinds.length){const kind=kinds[Math.floor(q*kinds.length)];
          let ok=flatOK(X,Z,TSM.h);if(kind==='beacon'||kind==='cairn'){ok=true;for(let m=0;m<8&&ok;m++)if(hAt(X+Math.round(Math.cos(m*0.785)*12),Z+Math.round(Math.sin(m*0.785)*12))>TSM.h)ok=false;}
          if(ok)s={kind:kind,X:X,Z:Z,g:TSM.h};}}}}}
  smallC.set(key,s);return s;
}
function smallNear(X,Z,m){const cx=Math.floor(X/CS),cz=Math.floor(Z/CS);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const s=smallAt(cx+a,cz+b);if(s&&Math.abs(s.X-X)<=14+(m||0)&&Math.abs(s.Z-Z)<=14+(m||0))return s;}return null;}
const SMALL_NAMES={bridge:'An Old Bridge',farmstead:'A Deserted Farmstead',cairn:'A Cairn',camp:'An Abandoned Camp',beacon:'A Beacon Hill',mill:'An Old Mill',jetty:'An Old Jetty',chapel:'A Chapel and Graveyard'};
function smallBuild(s){
  const r=mkRng(1+Math.floor(hsh(s.X,8715,s.Z)*2147483000)),X=s.X,Z=s.Z,g=s.g;
  switch(s.kind){
    case 'bridge':{ // a bridge of stone and planks across the river, its ends on the banks
      const dx=s.dx,dz=s.dz,y=SEA+2;for(let t=-s.b-1;t<=s.a+1;t++)for(let c=-1;c<=1;c++){const px=X+dx*t-dz*c,pz=Z+dz*t+dx*c;
        PW(px,y,pz,Math.abs(c)===1&&(t===-s.b-1||t===s.a+1)?COBBLE:PLANKS,MODE_SET);if(Math.abs(c)===1&&t%2===0)PW(px,y+1,pz,PLANKS,MODE_SET);
        if(t%4===0&&c===0)for(let yy=SEA-4;yy<y;yy++)PW(px,yy,pz,COBBLE,MODE_SET);for(let yy=y+1;yy<=y+3;yy++)if(c===0)PW(px,yy,pz,AIR,MODE_SET);}break;}
    case 'mill':{ // a mill on the bank: a stone house, a wheel of planks dipping into the river
      sigFloor(X-3,Z-3,X+3,Z+3,g,COBBLE,8);
      for(let ddx=-3;ddx<=3;ddx++)for(let ddz=-3;ddz<=3;ddz++){const e=Math.abs(ddx)===3||Math.abs(ddz)===3;if(!e)continue;for(let y=g+1;y<=g+4;y++)if(!(ddx===0&&ddz===3&&y<=g+2))PW(X+ddx,y,Z+ddz,y===g+4?PLANKS:COBBLE,MODE_SET);}
      for(let k=0;k<=3;k++)for(let ddx=-4;ddx<=4;ddx++)PW(X+ddx,g+5+k,Z-3+k,PLANKS,MODE_SET),PW(X+ddx,g+5+k,Z+3-k,PLANKS,MODE_SET);
      const wx=X-s.dx*4,wz=Z-s.dz*4;for(let a=0;a<16;a++){const t=a/16*6.283;PW(wx+(s.dz?Math.round(Math.cos(t)*3):0),g+1+Math.round(Math.sin(t)*3),wz+(s.dx?Math.round(Math.cos(t)*3):0),PLANKS,MODE_SET);}PW(X+2,g+1,Z+2,BARREL,MODE_SET);break;}
    case 'jetty':{ // a jetty of planks on posts out over the lake
      for(let t=0;t<=12;t++)for(let c=-1;c<=1;c++){const px=X+s.dx*t-s.dz*c,pz=Z+s.dz*t+s.dx*c,pg=hAt(px,pz);PW(px,Math.max(g,SEA)+(t>6?0:0),pz,PLANKS,MODE_SET);if(t%3===0&&c!==0)for(let y=pg-1;y<g;y++)PW(px,y,pz,LOG,MODE_SET);}break;}
    case 'farmstead':{ // a deserted farmstead: a cottage, a walled yard, a well
      sigFloor(X-3,Z-2,X+3,Z+2,g,PLANKS,7);
      for(let ddx=-3;ddx<=3;ddx++)for(let ddz=-2;ddz<=2;ddz++){const e=Math.abs(ddx)===3||Math.abs(ddz)===2;if(!e)continue;for(let y=g+1;y<=g+3;y++)if(!(ddx===0&&ddz===2&&y<=g+2)&&r()<0.92)PW(X+ddx,y,Z+ddz,(Math.abs(ddx)===3&&Math.abs(ddz)===2)?LOG:PLANKS,MODE_SET);}
      for(let k=0;k<=2;k++)for(let ddx=-4;ddx<=4;ddx++){PW(X+ddx,g+4+k,Z-2+k,BRICK,MODE_SET);PW(X+ddx,g+4+k,Z+2-k,BRICK,MODE_SET);}
      for(let t=-6;t<=6;t++){for(const [ax,az] of [[t,8],[t,-8+((t+6)%13===0?0:0)]])if(r()<0.85)PW(X+ax,hAt(X+ax,Z+az)+1,Z+az,COBBLE,MODE_SET);if(r()<0.85)PW(X+8,hAt(X+8,Z+t)+1,Z+t,COBBLE,MODE_SET);}
      PW(X-2,g+1,Z-1,BARREL,MODE_SET);PW(X+2,g+1,Z+1,CHEST,MODE_SET);break;}
    case 'cairn':{ // a cairn of piled stones on a hilltop
      for(let y=0;y<=5;y++){const R=2.4-y*0.4;for(let ddx=-2;ddx<=2;ddx++)for(let ddz=-2;ddz<=2;ddz++)if(Math.hypot(ddx,ddz)<=R)PW(X+ddx,g+1+y,Z+ddz,r()<0.4?MOSSY:COBBLE,MODE_SET);}break;}
    case 'camp':{ // an abandoned camp: a cold fire ring, log seats, a fallen tent, a barrel
      for(let a=0;a<8;a++)PW(X+Math.round(Math.cos(a*0.785)*1.5),g+1,Z+Math.round(Math.sin(a*0.785)*1.5),COBBLE,MODE_SET);PW(X,g,Z,GRAVEL,MODE_SET);
      for(let t=-1;t<=1;t++){PW(X+3,g+1,Z+t,LOG,MODE_SET);PW(X+t,g+1,Z-3,LOG,MODE_SET);}
      for(let t=-2;t<=2;t++)for(let k=0;k<2;k++)PW(X-4+k,g+1+k,Z+t,WOOLW,MODE_SET);PW(X-3,g+1,Z+3,BARREL,MODE_SET);break;}
    case 'beacon':{ // a beacon on a hilltop: a stone drum with a cold brazier on it
      for(let y=g+1;y<=g+3;y++)for(let ddx=-1;ddx<=1;ddx++)for(let ddz=-1;ddz<=1;ddz++)PW(X+ddx,y,Z+ddz,y===g+3&&!ddx&&!ddz?COBBLE:r()<0.3?MOSSY:COBBLE,MODE_SET);PW(X,g+4,Z,DLANTERN,MODE_SET);break;}
    case 'chapel':{ // a chapel of grey stone and its graveyard, walled about
      sigFloor(X-2,Z-4,X+2,Z+1,g,COBBLE,8);
      for(let ddx=-2;ddx<=2;ddx++)for(let ddz=-4;ddz<=1;ddz++){const e=Math.abs(ddx)===2||ddz===-4||ddz===1;if(!e)continue;for(let y=g+1;y<=g+4;y++)if(!(ddx===0&&ddz===1&&y<=g+2))PW(X+ddx,y,Z+ddz,r()<0.25?MOSSY:COBBLE,MODE_SET);}
      for(let k=0;k<=2;k++)for(let ddz=-5;ddz<=2;ddz++){PW(X-2+k,g+5+k,Z+ddz,SBRICK,MODE_SET);PW(X+2-k,g+5+k,Z+ddz,SBRICK,MODE_SET);}
      for(let ddx=-6;ddx<=6;ddx++)for(let ddz=3;ddz<=10;ddz++){const e=Math.abs(ddx)===6||ddz===10;const px=X+ddx,pz=Z+ddz,pg=hAt(px,pz);if(e&&!(ddz===10&&ddx===0)&&r()<0.9)PW(px,pg+1,pz,COBBLE,MODE_SET);
        else if(!e&&ddx%2===0&&ddz%3===2&&ddz>3&&r()<0.8)PW(px,pg+1,pz,GRAVE,MODE_SET);}break;}
  }
}
function applySmall(WCX,WCZ){for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const s=smallAt(WCX+a,WCZ+b);if(s)smallBuild(s);}}
// dry-stone walls: long lines across the farmland, green hills and terraces (one block high, two in places)
function stoneWallAt(X,Z,o){const k=LANDS[o.land].k;return(k==='farm'||k==='green'||k==='terrace'||k==='orchard')&&Math.abs(fbm2(X/70,Z/70,1,8721.1))<0.012&&!o.river&&!o.wet;}
// The signature builders of the old lands of men
function menBuild(s,r){
  const X=s.X,Z=s.Z,g=s.g;
  switch(s.kind){
    case 'manor':{ // an abandoned manor farm: a long house of brick and timber round a walled yard, a barn half fallen
      sigFloor(X-6,Z-5,X+6,Z+5,g,COBBLE,9);
      for(let ddx=-6;ddx<=6;ddx++)for(let ddz=-5;ddz<=5;ddz++){const e=Math.abs(ddx)===6||Math.abs(ddz)===5;if(!e)continue;const house=ddz<=-2;
        for(let y=g+1;y<=g+(house?4:2);y++)if(!(ddz===5&&Math.abs(ddx)<=1)&&r()<0.93)PW(X+ddx,y,Z+ddz,house?(y===g+4?PLANKS:BRICK):COBBLE,MODE_SET);}
      for(let ddx=-6;ddx<=6;ddx++)for(let y=g+1;y<=g+4;y++)PW(X+ddx,y,Z-2,ddx===0&&y<=g+2?AIR:BRICK,MODE_SET);
      for(let k=0;k<=2;k++)for(let ddx=-7;ddx<=7;ddx++){PW(X+ddx,g+5+k,Z-5+k,PLANKS,MODE_SET);PW(X+ddx,g+5+k,Z+1-k-2,PLANKS,MODE_SET);}
      PW(X-4,g+1,Z-4,BARREL,MODE_SET);PW(X+4,g+1,Z-4,CHEST,MODE_SET);PW(X+3,g+1,Z+3,LOG,MODE_SET);PW(X+4,g+1,Z+3,LOG,MODE_SET);break;}
    case 'furrows':{ // old furrows: a great field of wild wheat between ridges, a scarecrow of sticks and wool
      for(let ddx=-12;ddx<=12;ddx++)for(let ddz=-10;ddz<=10;ddz++){const px=X+ddx,pz=Z+ddz,pg=hAt(px,pz);if(ddx&1){PW(px,pg,pz,FARM_D,MODE_SET);PW(px,pg+1,pz,r()<0.7?WHEAT:AIR,MODE_SET);}else PW(px,pg+1,pz,r()<0.3?TGRASS:AIR,MODE_SET);}
      PW(X,g+1,Z,LOG,MODE_SET);PW(X,g+2,Z,LOG,MODE_SET);PW(X,g+3,Z,WOOLY,MODE_SET);PW(X-1,g+2,Z,PLANKS,MODE_SET);PW(X+1,g+2,Z,PLANKS,MODE_SET);break;}
    case 'keeper':{ // the orchard keeper's cottage, a bench and a heap of apples in barrels
      sigFloor(X-3,Z-3,X+3,Z+3,g,PLANKS,7);
      for(let ddx=-3;ddx<=3;ddx++)for(let ddz=-3;ddz<=3;ddz++){const e=Math.abs(ddx)===3||Math.abs(ddz)===3;if(!e)continue;for(let y=g+1;y<=g+3;y++)if(!(ddx===0&&ddz===3&&y<=g+2)&&!(y===g+2&&ddz===0&&Math.abs(ddx)===3))PW(X+ddx,y,Z+ddz,(Math.abs(ddx)===3&&Math.abs(ddz)===3)?LOG:PLANKS,MODE_SET);}
      for(let k=0;k<=3;k++)for(let ddx=-4;ddx<=4;ddx++){PW(X+ddx,g+4+k,Z-3+k,BLOSSOM,MODE_SET);PW(X+ddx,g+4+k,Z+3-k,BLOSSOM,MODE_SET);}
      PW(X-2,g+1,Z-2,BARREL,MODE_SET);PW(X+2,g+1,Z-2,BARREL,MODE_SET);for(let t=-1;t<=1;t++)PW(X+t,g+1,Z+5,PLANKS,MODE_SET);break;}
    case 'oldrows':{ // old rows of gnarled fruit trees, closer and older than the rest
      for(let ddx=-12;ddx<=12;ddx+=4)for(let ddz=-12;ddz<=12;ddz+=4){const px=X+ddx,pz=Z+ddz;fruitTreeP(px,hAt(px,pz)+1,pz,r);}break;}
    case 'flshrine':{ // a shrine wreathed in flowers: a stone with a niche and a cold lamp, flowers all round
      for(let y=g+1;y<=g+3;y++)PW(X,y,Z,SBRICK,MODE_SET);PW(X,g+4,Z,DLANTERN,MODE_SET);PW(X-1,g+1,Z,SBRICK,MODE_SET);PW(X+1,g+1,Z,SBRICK,MODE_SET);
      for(let ddx=-5;ddx<=5;ddx++)for(let ddz=-5;ddz<=5;ddz++){const d=Math.hypot(ddx,ddz);if(d<1.5||d>5)continue;const px=X+ddx,pz=Z+ddz;PW(px,hAt(px,pz)+1,pz,[FLOWR,FLOWY,BLUEB,OXEYE,LAVENDER][Math.floor(d)%5],MODE_SET);}break;}
    case 'flbands':{ // bands of wildflowers, each colour its own ring
      for(let ddx=-13;ddx<=13;ddx++)for(let ddz=-13;ddz<=13;ddz++){const d=Math.hypot(ddx,ddz);if(d>13)continue;const px=X+ddx,pz=Z+ddz;PW(px,hAt(px,pz)+1,pz,[LAVENDER,FLOWR,OXEYE,FLOWY,BLUEB][Math.floor(d/2.6)%5],MODE_SET);}break;}
    case 'tvillage':{ // a terraced village: three cottages on steps, a stair between them
      for(let k=0;k<3;k++){const hx=X-6+k*6,hz=Z-4+k*2,hg=g+k*3;sigFloor(hx-2,hz-2,hx+2,hz+2,hg,COBBLE,6);
        for(let ddx=-2;ddx<=2;ddx++)for(let ddz=-2;ddz<=2;ddz++){const e=Math.abs(ddx)===2||Math.abs(ddz)===2;if(!e)continue;for(let y=hg+1;y<=hg+3;y++)if(!(ddz===2&&ddx===0&&y<=hg+2)&&r()<0.9)PW(hx+ddx,y,hz+ddz,COBBLE,MODE_SET);}
        for(let ddx=-2;ddx<=2;ddx++)for(let ddz=-2;ddz<=2;ddz++)if(r()<0.7)PW(hx+ddx,hg+4,hz+ddz,BRICK,MODE_SET);}
      for(let t=0;t<9;t++)PW(X-8+t*2,g+Math.floor(t*0.75),Z+3,COBBLE,MODE_SET);break;}
    default:keptBuild(s,r);break; // the old kept lands' signatures (M6h)
    case 'tsteps':{ // stone terraces stepping down a hillside, walled and planted
      for(let k=0;k<4;k++)for(let ddx=-10;ddx<=10;ddx++)for(let ddz=-2;ddz<=2;ddz++){const px=X+ddx,pz=Z+k*5+ddz-8,y=g+6-k*2;for(let yy=y-3;yy<=y;yy++)PW(px,yy,pz,ddz===2?COBBLE:DIRT,MODE_SET);PW(px,y,pz,ddz===2?COBBLE:GRASS,MODE_SET);for(let yy=y+1;yy<=y+4;yy++)PW(px,yy,pz,ddz===-2&&yy===y+1&&ddx%3===0?LAVENDER:AIR,MODE_SET);}break;}
  }
}
