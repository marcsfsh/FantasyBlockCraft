// ---- The forests (M6b, D-040; Q111, Q124, Q130): the seven forest lands' own trees, floors and plants, and each stretch's
// signature: its land's landmark structure, its natural feature, or (four stretches in ten) neither. A forest keeps the heights of
// the old land it stood in for (its look); FOREST overrides what grows on it.
function mapleP(X,y,Z,r,gold){
  const th=5+(r()*3|0);if(y+th+4>=H)return;PW(X,y-1,Z,DIRT,MODE_SET);for(let i=0;i<th;i++)PW(X,y+i,Z,MAPLE,MODE_SET);
  const top=y+th,L=gold?MAPLEG:MAPLEL,M=gold?MAPLEL:MAPLEG;
  for(let dx=-3;dx<=3;dx++)for(let dy=-2;dy<=2;dy++)for(let dz=-3;dz<=3;dz++){const d=Math.hypot(dx,dy*1.3,dz);if(d<=3.2&&!(d>2.6&&r()<0.45))PW(X+dx,top+dy,Z+dz,r()<0.15?M:L,MODE_AIR);}
}
function pineP(X,y,Z,r,snowy){
  const th=10+(r()*6|0);if(y+th+3>=H)return;PW(X,y-1,Z,DIRT,MODE_SET);for(let i=0;i<th;i++)PW(X,y+i,Z,PINE,MODE_SET);
  const L=snowy?SNOWLEAF:PINEL,c0=y+Math.floor(th*0.45);PW(X,y+th,Z,L,MODE_AIR);PW(X,y+th+1,Z,L,MODE_AIR);
  for(let yy=y+th-1;yy>=c0;yy--){const k=y+th-yy,rr=k<2?1:k<5?(k%2?2:1):(k%2?2:3)-(yy<c0+2?1:0);
    for(let dx=-rr;dx<=rr;dx++)for(let dz=-rr;dz<=rr;dz++){if(Math.hypot(dx,dz)>rr+0.4)continue;PW(X+dx,yy,Z+dz,L,MODE_AIR);}}
}
// a giant: a 2 x 2 trunk 22 to 31 high, or (big) 3 x 3 and 40 to 47, buttress roots, limbs in the upper third, a wide crown
function greatP(X,y,Z,r,big){
  const s=big?3:2,th=big?40+(r()*8|0):22+(r()*10|0);if(y+th+8>=H)return;
  for(let a=0;a<s;a++)for(let b=0;b<s;b++)for(let i=-1;i<th;i++)PW(X+a,y+i,Z+b,i<0?DIRT:GREAT,MODE_SET);
  const nr=big?8:5,cx=X+(s-1)/2,cz=Z+(s-1)/2,top=y+th,R=big?8:5.5;
  for(let k=0;k<nr;k++){const ang=k/nr*6.283+r()*0.4,len=2+(r()*(big?4:3)|0);
    for(let t=1;t<=len;t++){const rx=Math.round(cx+Math.cos(ang)*(t+s/2-0.5)),rz=Math.round(cz+Math.sin(ang)*(t+s/2-0.5));for(let q=-1;q<len-t+1;q++)PW(rx,y+q,rz,GREAT,MODE_SET);}}
  const blob=(bx,by,bz,rad)=>{const ri=Math.ceil(rad);for(let dx=-ri;dx<=ri;dx++)for(let dy=-ri;dy<=ri;dy++)for(let dz=-ri;dz<=ri;dz++){const d=Math.hypot(dx,dy*1.6,dz);if(d<=rad&&!(d>rad-0.8&&r()<0.4))PW(Math.round(bx)+dx,Math.round(by)+dy,Math.round(bz)+dz,GREATL,MODE_AIR);}};
  const limbs=big?6:4;
  for(let k=0;k<limbs;k++){const ang=r()*6.283,len=Math.round(R*0.8)+(r()*3|0),by=top-Math.floor(th*0.3*r())-2;let ex=cx,ez=cz,ey=by;
    for(let t=1;t<=len;t++){ex=cx+Math.cos(ang)*(t+s/2);ez=cz+Math.sin(ang)*(t+s/2);ey=by+Math.floor(t/3);PW(Math.round(ex),ey,Math.round(ez),GREAT,MODE_SET);}
    blob(ex,ey+1,ez,big?4:3);}
  blob(cx,top,cz,R*0.75);
}
function yewP(X,y,Z,r){
  const thick=r()<0.35,th=4+(r()*2|0),s=thick?2:1;if(y+th+5>=H)return;
  for(let a=0;a<s;a++)for(let b=0;b<s;b++)for(let i=-1;i<th;i++)PW(X+a,y+i,Z+b,i<0?DIRT:YEW,MODE_SET);
  const cx=X+(s-1)/2,cz=Z+(s-1)/2,R=thick?4.6:3.6;
  for(let dx=-5;dx<=5;dx++)for(let dy=-2;dy<=4;dy++)for(let dz=-5;dz<=5;dz++){const d=Math.hypot(dx,dy*1.25,dz);if(d<=R&&!(d>R-0.7&&r()<0.35))PW(Math.round(cx+dx),y+th+dy,Math.round(cz+dz),YEWL,MODE_AIR);}
}
function silverP(X,y,Z,r){
  const th=9+(r()*4|0);if(y+th+4>=H)return;PW(X,y-1,Z,DIRT,MODE_SET);for(let i=0;i<th;i++)PW(X,y+i,Z,SILV,MODE_SET);
  const top=y+th;
  for(let dy=-5;dy<=2;dy++){const rr=dy>=1?1:dy>=-1?2.4:dy>=-3?2.8:1.8,ri=Math.ceil(rr);
    for(let dx=-ri;dx<=ri;dx++)for(let dz=-ri;dz<=ri;dz++){const d=Math.hypot(dx,dz);if(d<=rr&&!(d>rr-0.6&&r()<0.4))PW(X+dx,top+dy,Z+dz,SILVL,MODE_AIR);}}
  PW(X,top+3,Z,SILVL,MODE_AIR);
}
// What grows in each forest: tree density (per column, before groves), the tree, the floor, and the plants. glade: trees keep to
// groves with open glades between (as on the open lands); otherwise they fill the land, thinning a little in the clearings.
const FLOORS=new Set([LITTER,NEEDLES,FMOSS]);
const FOREST={
  autumn:{trees:0.03,tree:(X,y,Z,r)=>{const q=hsh(X,8161,Z);if(q<0.72)mapleP(X,y,Z,r,hsh(Math.floor(X/24),8163,Math.floor(Z/24))<0.45);else if(q<0.86)bigOakP(X,y,Z,r);else treeP(X,y,Z,LOG,LEAVES,4,r);},
    top:o=>o.dn>-0.05?LITTER:GRASS,plant:r=>r<0.05?FERN:r<0.09?DBUSH:r<0.15?TGRASS:0},
  birch:{trees:0.022,glade:true,tree:(X,y,Z,r)=>treeP(X,y,Z,BIRCH,BLEAVES,6,r),
    plant:(r,X,Z)=>{const G=sstep(-0.2,0.25,fbm2(X/70,Z/70,2,4801.3));return r<0.12*G?BLUEB:r<0.22?TGRASS:r<0.25?(hsh(Math.floor(X/12),1903,Math.floor(Z/12))<.5?FLOWR:FLOWY):0;}},
  pine:{trees:0.034,tree:(X,y,Z,r,o)=>pineP(X,y,Z,r,o.cold&&o.h>SEA+40),top:o=>o.cold&&o.h>SEA+40?SNOWG:o.rid>0.28?STONE:o.dn>0.05?NEEDLES:GRASS,plant:r=>r<0.05?FERN:r<0.1?TGRASS:0},
  giant:{trees:0.012,tree:(X,y,Z,r)=>{const q=hsh(X,8165,Z);if(q<0.4)greatP(X,y,Z,r,false);else if(q<0.75)yewP(X,y,Z,r);else treeP(X,y,Z,LOG,LEAVES,5,r);},
    top:o=>o.dn>-0.1?FMOSS:GRASS,plant:r=>r<0.18?FERN:r<0.183?GLOWSHROOM:r<0.21?TGRASS:0},
  willow:{trees:0.012,glade:true,tree:(X,y,Z,r)=>willowP(X,y,Z,r,WILLOW,WILLOWL)},
  yew:{trees:0.03,tree:(X,y,Z,r)=>{if(hsh(X,8167,Z)<0.8)yewP(X,y,Z,r);else treeP(X,y,Z,LOG,LEAVES,4,r);},
    top:o=>o.dn>0.15?FMOSS:o.dn<-0.3?DIRT:GRASS,plant:r=>r<0.06?FERN:r<0.11?DBUSH:r<0.14?TGRASS:0},
  silver:{trees:0.016,tree:(X,y,Z,r)=>silverP(X,y,Z,r),plant:r=>r<0.006?MOONP:r<0.04?BLUEB:r<0.14?TGRASS:0}
};
const forestOf=o=>FOREST[LANDS[o.land].k];
// ---- Signatures (Q124): each stretch of a forest (named after its highest-priority cell) has its landmark, its feature, or,
// four times in ten, neither. Each stands on level ground of its own land near the stretch's middle, keeps clear of the old
// sites, roads, gates and stairways, and claims its ground so trees keep off it.
const SIGS={
  autumn:[['lodge',"Woodcutters' Lodge",9],['glade','Red-leaf Glade',15]],
  birch:[['bshrine','Birch-bark Shrine',7],['bring','Ring of White Birches',13]],
  pine:[['post','Timber Watch Post',6],['rock','Lookout Rock',8]],
  giant:[['platform','Platform in a Giant',10],['great','The Great Tree',12]],
  willow:[['stilt','Stilt House',11],['pools','Willow Pools',14]],
  yew:[['hall',"Archers' Hall",10],['hollow','Hollow Yew',8]],
  silver:[['gate','Moon Gate',7],['spring','Silver Spring',11]]
};
const sigC=new Map(),TSG={},TSG2={};
function sigOf(c){
  const key=landKey(c.i,c.j);if(sigC.has(key))return sigC.get(key);if(sigC.size>4000)sigC.clear();
  let s=null;const L=LANDS[cellLand(c)],S=SIGS[L.k],q=hsh(c.i,8141,c.j);
  if(S&&q>=0.4){const [kind,name,R,mode]=S[q<0.7?0:1];
    if(mode){const t=coastSite(c,L,R,mode);if(t)s=Object.assign(t,{kind:kind,name:name,land:L.k,R:R,seed:hsh(c.i,8143,c.j)});}
    else if(kind==='sinkhole'){const t=sinkholeSite(c,L,R);if(t)s=Object.assign(t,{kind:kind,name:name,land:L.k,R:R,seed:hsh(c.i,8143,c.j)});}
    else
    for(let k=0;k<40&&!s;k++){const a=k*2.4,d=k?12+k*3:0,X=Math.round(c.x+Math.cos(a)*d),Z=Math.round(c.z+Math.sin(a)*d);colInfo(X,Z,TSG);
      const low=L.k==='willow'||L.k==='bog'; // the vales' pools and stilt house stand on the low wet ground itself
      if(TSG.area!==L.i||TSG.land!==L.i||(TSG.wet&&!low)||TSG.lake||TSG.river||TSG.bank||TSG.rvBot<999||TSG.h<=SEA+(low?0:2))continue;
      let ok=true,lo=TSG.h;for(let m=0;m<8&&ok;m++){const e=colInfo(X+Math.round(Math.cos(m*0.785)*R),Z+Math.round(Math.sin(m*0.785)*R),TSG2);if(Math.abs(e.h-TSG.h)>3||(e.wet&&!low)||e.h<SEA||e.lake||e.river||e.rvBot<999)ok=false;lo=Math.min(lo,e.h);}
      if(ok&&!surfTaken(X,Z,R+4))s={kind:kind,name:name,land:L.k,X:X,Z:Z,g:TSG.h,lo:lo,R:R,seed:hsh(c.i,8143,c.j)};}}
  sigC.set(key,s);return s;
}
// the signatures that may reach a chunk (by the stretches of the cells around it)
const sigChunkC=new Map();
function sigsNear(WCX,WCZ){
  const key=WCX*65536+WCZ;let l=sigChunkC.get(key);if(l)return l;if(sigChunkC.size>20000)sigChunkC.clear();
  l=[];const X=WCX*CS+8,Z=WCZ*CS+8,ci=Math.floor(X/LS),cj=Math.floor(Z/LS),seen=new Set();
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const rc=stretchCell(landSite(ci+a,cj+b)),k=landKey(rc.i,rc.j);if(seen.has(k))continue;seen.add(k);
    const s=sigOf(rc);if(s&&Math.abs(s.X-X)<s.R+40&&Math.abs(s.Z-Z)<s.R+40)l.push(s);}
  sigChunkC.set(key,l);return l;
}
function sigNear(X,Z,m){for(const s of sigsNear(Math.floor(X/CS),Math.floor(Z/CS)))if(Math.hypot(X-s.X,Z-s.Z)<=s.R+(m||0))return s;return null;}
// ---- Builders. Each is a pure function of its signature, written through PW, so every chunk it reaches builds its own part.
// A level floor: earth under it down to the ground, the floor at y, air above for h blocks
function sigFloor(x0,z0,x1,z1,y,id,h){for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){for(let yy=y-1;yy>y-12;yy--){const c=GW(x,yy,z);if(c<0||(SOLID[c]&&!BL[c].leaf))break;PW(x,yy,z,DIRT,MODE_SET);}
  PW(x,y,z,id,MODE_SET);for(let k=1;k<=(h||6);k++)PW(x,y+k,z,AIR,MODE_SET);}}
// A pond: a bowl of radius R filled to level L (one below the lowest ground at its rim), banks built up to hold it
function sigPond(X,Z,R,L,depth,r,bank){
  for(let dx=-R-2;dx<=R+2;dx++)for(let dz=-R-2;dz<=R+2;dz++){const d=Math.hypot(dx,dz)+fbm2((X+dx)/5,(Z+dz)/5,1,8171.3)*1.2,x=X+dx,z=Z+dz;
    if(d<R){const dep=Math.max(1,Math.round(depth*(1-d/R))+1);for(let y=L-dep;y<=L;y++)PW(x,y,z,WATER,MODE_SET);PW(x,L-dep-1,z,d<R-1.5?DIRT:SAND,MODE_SET);for(let y=L+1;y<=L+8;y++)PW(x,y,z,AIR,MODE_SET);}
    else if(d<R+2){for(let y=L-3;y<=L;y++)PW(x,y,z,DIRT,MODE_SET);PW(x,L,z,bank||GRASS,MODE_SET);for(let y=L+1;y<=L+6;y++)PW(x,y,z,AIR,MODE_SET);}}
}
// The ponds a signature digs, [X, Z, radius], filled to one below the lowest ground at its rim (s.lo - 1)
function sigPonds(s){
  if(s.kind==='glade')return[[s.X,s.Z,5]];if(s.kind==='stilt')return[[s.X,s.Z,7]];if(s.kind==='spring')return[[s.X,s.Z,3]];if(s.kind==='tarn')return[[s.X,s.Z,6]];if(s.kind==='mossfall')return[[s.X+3,s.Z,3]];if(s.kind==='dome')return[[s.X,s.Z,3],[s.X+4,s.Z-3,2]];
  if(s.kind==='pools'){const l=[[s.X,s.Z,6]];for(let k=1;k<3;k++){const a=k*2.1+hsh(s.X,8177+k,s.Z);l.push([Math.round(s.X+Math.cos(a)*7),Math.round(s.Z+Math.sin(a)*7),4]);}return l;}
  return[];
}
// Water a signature's pond holds: trusted by the underground water check at a chunk edge (it is held by the pond's own banks)
function sigWaterAt(X,y,Z){for(const s of sigsNear(Math.floor(X/CS),Math.floor(Z/CS)))if(y<=(s.pl||s.lo-1))for(const [px,pz,R] of sigPonds(s))if(Math.hypot(X-px,Z-pz)<R+1.5)return true;return false;}
function sigBuild(s){
  const r=mkRng(1+Math.floor(s.seed*2147483000)),X=s.X,Z=s.Z,g=s.g;
  switch(s.kind){
    case 'lodge':{ // a woodcutter's lodge of maple, its roof fallen in at one end, a barrel inside and logs stacked by the door
      sigFloor(X-4,Z-3,X+4,Z+3,g,MAPLEP,8);
      for(let x=X-4;x<=X+4;x++)for(let z=Z-3;z<=Z+3;z++){const edge=x===X-4||x===X+4||z===Z-3||z===Z+3,corner=(x===X-4||x===X+4)&&(z===Z-3||z===Z+3);if(!edge)continue;
        for(let y=g+1;y<=g+3;y++){if(z===Z+3&&x===X&&y<=g+2)continue;if(!corner&&y===g+2&&(x===X-2||x===X+2))continue;if(r()<0.06&&!corner)continue;PW(x,y,z,corner?MAPLE:MAPLEP,MODE_SET);}}
      for(let k=0;k<=4;k++)for(let x=X-5;x<=X+5;x++){if(x>X+2&&r()<0.7)continue;PW(x,g+4+Math.min(k,4-k),Math.floor(Z-3+k*1.5),k===2?MAPLE:MAPLEP,MODE_SET);}
      PW(X-3,g+1,Z-2,BARREL,MODE_SET);PW(X+3,g+1,Z-2,CHEST,MODE_SET);
      for(let k=0;k<3;k++)PW(X+2+k,g+1,Z+4,MAPLE,MODE_SET);PW(X+3,g+2,Z+4,MAPLE,MODE_SET);break;}
    case 'glade':{ // a still pond in a ring of red maples, the ground thick with fallen leaves
      const L=s.lo-1;for(const [px,pz,R] of sigPonds(s))sigPond(px,pz,R,L,2,r,LITTER);
      for(let dx=-13;dx<=13;dx++)for(let dz=-13;dz<=13;dz++){const d=Math.hypot(dx,dz);if(d>=7&&d<13)PW(X+dx,hAt(X+dx,Z+dz),Z+dz,LITTER,MODE_SET);}
      for(let k=0;k<7;k++){const a=k/7*6.283+r()*0.3,x=Math.round(X+Math.cos(a)*10),z=Math.round(Z+Math.sin(a)*10);mapleP(x,hAt(x,z)+1,z,r,k%3===0);}break;}
    case 'bshrine':{ // a little open shrine of birch: four posts, a roof of planks and leaves, a cold lantern on a stone
      sigFloor(X-3,Z-3,X+3,Z+3,g,COBBLE,7);
      for(const [a,b] of [[-2,-2],[2,-2],[-2,2],[2,2]])for(let y=g+1;y<=g+4;y++)PW(X+a,y,Z+b,BIRCH,MODE_SET);
      for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++){PW(X+dx,g+5,Z+dz,(Math.abs(dx)===3||Math.abs(dz)===3)?BLEAVES:PLANKS,MODE_SET);if(Math.abs(dx)<=1&&Math.abs(dz)<=1)PW(X+dx,g+6,Z+dz,BLEAVES,MODE_SET);}
      PW(X,g+1,Z,STONE,MODE_SET);PW(X,g+2,Z,DLANTERN,MODE_SET);
      for(let k=0;k<10;k++){const a=k/10*6.283,x=Math.round(X+Math.cos(a)*5),z=Math.round(Z+Math.sin(a)*5);PW(x,hAt(x,z)+1,z,k%2?FLOWR:BLUEB,MODE_AIR);}break;}
    case 'bring':{ // a ring of tall white birches round a clearing of bluebells
      for(let dx=-10;dx<=10;dx++)for(let dz=-10;dz<=10;dz++){const d=Math.hypot(dx,dz);if(d<9){const x=X+dx,z=Z+dz,y=hAt(x,z)+1;PW(x,y,z,r()<0.5?BLUEB:r()<0.3?FLOWY:AIR,MODE_SET);}}
      for(let k=0;k<11;k++){const a=k/11*6.283,x=Math.round(X+Math.cos(a)*10),z=Math.round(Z+Math.sin(a)*10);treeP(x,hAt(x,z)+1,z,BIRCH,BLEAVES,7,r);}break;}
    case 'post':{ // a timber watch post of pine: a 3 x 3 tower ten high with a ladder inside and an open platform
      sigFloor(X-2,Z-2,X+2,Z+2,g,PINEP,16);
      for(let y=g+1;y<=g+10;y++)for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){const corner=Math.abs(dx)===1&&Math.abs(dz)===1;if(!dx&&!dz){PW(X,y,Z,AIR,MODE_SET);continue;}
        if(corner)PW(X+dx,y,Z+dz,PINE,MODE_SET);else if(!(dz===1&&dx===0&&y<=g+2)&&(y%3!==0||r()<0.5))PW(X+dx,y,Z+dz,PINEP,MODE_SET);}
      for(let y=g+1;y<=g+10;y++)PW(X,y,Z-1,PINEP,MODE_SET);for(let y=g+1;y<=g+11;y++)PW(X,y,Z,LADDER,MODE_SET);
      for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){if(!dx&&!dz)continue;PW(X+dx,g+11,Z+dz,PINEP,MODE_SET);if(Math.abs(dx)===2||Math.abs(dz)===2)if((dx+dz)%2===0)PW(X+dx,g+12,Z+dz,PINE,MODE_SET);}break;}
    case 'rock':{ // a lookout rock: a weathered spire of stone, mossy on its sides
      const Hs=10+(r()*7|0);for(let y=g-2;y<=g+Hs;y++){const t=(y-g)/Hs,rad=Math.max(0.8,4.2*(1-t*0.75)+fbm2(y/3,X/7,1,8173.1)*0.9);const ri=Math.ceil(rad);
        for(let dx=-ri;dx<=ri;dx++)for(let dz=-ri;dz<=ri;dz++){if(Math.hypot(dx,dz)>rad)continue;const q=hsh(X+dx,y,Z+dz);PW(X+dx,y,Z+dz,q<0.25?MOSSY:q<0.35?COBBLE:STONE,MODE_SET);}}break;}
    case 'platform':{ // a giant greatwood with a ring of planks high up its trunk and a rope down to the ground
      greatP(X,g+1,Z,r,false);const py=g+16;
      for(let dx=-4;dx<=5;dx++)for(let dz=-4;dz<=5;dz++){const d=Math.hypot(dx-0.5,dz-0.5);if(d<=5&&d>=1.3&&(r()<0.9))PW(X+dx,py,Z+dz,GREATP,MODE_SET);if(d>4.3&&d<=5&&r()<0.5)PW(X+dx,py+1,Z+dz,GREATP,MODE_SET);}
      for(let y=g+1;y<py;y++)PW(X+5,y,Z,ROPE,MODE_SET);PW(X+4,py+1,Z+1,BARREL,MODE_SET);break;}
    case 'great':{greatP(X,g+1,Z,r,true);break;} // the great tree: three blocks thick and forty or more high
    case 'stilt':{ // a pond with a house of willow on stilts over it and a walk of planks to the bank
      const L=s.lo-1;for(const [px,pz,R] of sigPonds(s))sigPond(px,pz,R,L,2,r);const fy=L+2;
      for(const [a,b] of [[-2,-2],[2,-2],[-2,2],[2,2]])for(let y=L-3;y<fy;y++)PW(X+a,y,Z+b,WILLOW,MODE_SET);
      for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){PW(X+dx,fy,Z+dz,WILLOWP,MODE_SET);const edge=Math.abs(dx)===2||Math.abs(dz)===2;
        for(let y=fy+1;y<=fy+3;y++)PW(X+dx,y,Z+dz,edge&&!(dz===2&&dx===0&&y<fy+3)&&!(y===fy+2&&dz===0&&Math.abs(dx)===2)?WILLOWP:AIR,MODE_SET);
        PW(X+dx,fy+4,Z+dz,WILLOWP,MODE_SET);if(Math.abs(dx)<=1&&Math.abs(dz)<=1)PW(X+dx,fy+5,Z+dz,WILLOWL,MODE_SET);}
      for(let k=3;k<=9;k++){PW(X,fy,Z+k,WILLOWP,MODE_SET);if(k%3===0)for(let y=L-2;y<fy;y++)PW(X+1,y,Z+k,WILLOW,MODE_SET);}
      PW(X-1,fy+1,Z-1,BARREL,MODE_SET);break;}
    case 'pools':{ // three pools with an islet, willows leaning over them
      const L=s.lo-1;for(const [px,pz,R] of sigPonds(s))sigPond(px,pz,R,L,2,r);
      for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){for(let y=L-3;y<=L;y++)PW(X+dx,y,Z+dz,DIRT,MODE_SET);PW(X+dx,L+1,Z+dz,GRASS,MODE_SET);}
      PW(X,L+2,Z,TGRASS,MODE_SET);
      for(let k=0;k<5;k++){const a=k/5*6.283+0.4,x=Math.round(X+Math.cos(a)*12),z=Math.round(Z+Math.sin(a)*12);willowP(x,hAt(x,z)+1,z,r,WILLOW,WILLOWL);}break;}
    case 'hall':{ // a ruined hall of the archers: broken walls of mossy stone, a yew floor, targets at the far end
      sigFloor(X-6,Z-4,X+6,Z+4,g,YEWP,8);
      for(let x=X-6;x<=X+6;x++)for(let z=Z-4;z<=Z+4;z++){const edge=x===X-6||x===X+6||z===Z-4||z===Z+4;if(!edge)continue;
        const hgt=2+Math.floor(3*Math.abs(fbm2(x/4,z/4,1,8175.7))*2);for(let y=g+1;y<=g+Math.min(5,hgt);y++){if(z===Z+4&&Math.abs(x-X)<=1)continue;PW(x,y,z,r()<0.4?MOSSY:COBBLE,MODE_SET);}}
      for(let k=-1;k<=1;k+=2){PW(X+k*3,g+1,Z-3,WOOLW,MODE_SET);PW(X+k*3,g+2,Z-3,WOOLR,MODE_SET);}
      PW(X+5,g+1,Z+3,BARREL,MODE_SET);for(let k=0;k<5;k++)PW(X-5+((r()*10)|0),g+1,Z-3+((r()*6)|0),COBBLE,MODE_SET);break;}
    case 'hollow':{ // an ancient yew five blocks thick, hollow inside with a way in, under a wide dark crown
      const R=2.5;for(let y=g-1;y<=g+8;y++)for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++){const d=Math.hypot(dx,dz);if(d>R+0.4)continue;
        const inside=d<R-0.9&&y>=g+1&&y<=g+6;PW(X+dx,y,Z+dz,inside?AIR:y<g+1?DIRT:YEW,MODE_SET);}
      PW(X,g+1,Z+2,AIR,MODE_SET);PW(X,g+2,Z+2,AIR,MODE_SET);PW(X,g,Z,FMOSS,MODE_SET);PW(X-1,g+1,Z-1,MUSHB,MODE_SET);
      for(let dx=-7;dx<=7;dx++)for(let dy=0;dy<=5;dy++)for(let dz=-7;dz<=7;dz++){const d=Math.hypot(dx,(dy-2)*1.6,dz);if(d<=7&&!(d>6.2&&r()<0.4))PW(X+dx,g+8+dy,Z+dz,YEWL,MODE_AIR);}break;}
    case 'gate':{ // a moon gate: a ring of carved stone standing on edge, silverleaf trailing from it, moonpetals at its foot
      sigFloor(X-4,Z-1,X+4,Z+1,g,SBRICK,10);
      for(let a=0;a<64;a++){const t=a/64*6.283,x=Math.round(X+Math.cos(t)*4.2),y=Math.round(g+5+Math.sin(t)*4.2);for(let dz=-1;dz<=1;dz++)if(y>g)PW(x,y,Z+dz,SBRICK,MODE_SET);if(Math.sin(t)>0.3&&r()<0.25)PW(x,y-1,Z+(r()<0.5?-1:1),SILVL,MODE_AIR);}
      for(let k=0;k<8;k++){const x=X-4+k,z=Z+(k%2?2:-2);PW(x,hAt(x,z)+1,z,MOONP,MODE_AIR);}break;}
    default:hiBuild(s,r);break; // the highlands' signatures (M6c)
    case 'spring':{ // a spring in a kerb of mossy stone, silver trees round it, moonpetals in the grass
      const L=s.lo-1;for(const [px,pz,R] of sigPonds(s))sigPond(px,pz,R,L,1,r,MOSSY);
      for(let k=0;k<6;k++){const a=k/6*6.283+0.3,x=Math.round(X+Math.cos(a)*8),z=Math.round(Z+Math.sin(a)*8);silverP(x,hAt(x,z)+1,z,r);}
      for(let k=0;k<12;k++){const a=k/12*6.283,x=Math.round(X+Math.cos(a)*5.5),z=Math.round(Z+Math.sin(a)*5.5);PW(x,hAt(x,z)+1,z,MOONP,MODE_AIR);}break;}
  }
}
function applyForestSigs(WCX,WCZ){for(const s of sigsNear(WCX,WCZ))if(Math.abs(s.X-(WCX*CS+8))<s.R+24&&Math.abs(s.Z-(WCZ*CS+8))<s.R+24)sigBuild(s);}
