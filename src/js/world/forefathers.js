// ---- The forefathers of the riders (D-090): what is left of the people the riders came from, long ago, out of the north, on
// the open lands the living kingdoms do not hold: the steppe, the moors, the barrow hills, the chalk, the green hills, the
// frozen tundra and the bogs. About one chunk in nine of those lands is tried for one (most fail on the ground, the water or a place near): a white horse
// cut through the turf into the chalk of a hillside, its back uphill so that it is read from the valley, a cairn over a hoard
// above it; a ring of standing stones about an altar stone; a ship of standing stones, taller at stem and stern, a picture
// stone at its middle; the burned hall, its footings, charred posts and fallen beams, its long hearth cold; and a row of picture
// stones before a mound. Each has a hoard chest of the forefathers (FATHERLOOT) and a name in the riders' style.
// And within the riders' own provinces, the cairns of riders fallen on the plains: a heap of fieldstones, a spear in it, a
// shield hung on it, barrowbloom about it (one chunk in about forty of their open ground, off their sites and roads).
// Pure per chunk like the old kingdom's ruins; each reaches at most 22 blocks from its middle, so the chunks about it build it
// (applyFathers); fathersNear keeps every other feature off. They keep off the elder elves' ruins and the old kingdom's (they ask
// elderNear and oldNear; those never ask for these).
const FATHER_LANDS={steppe:['horse','ring','ship','stones','hall'],moors:['horse','ring','hall','stones','ship'],barrow:['ship','stones','ring','horse'],chalk:['horse','ring','ship'],green:['horse','ring'],tundra:['horse','ring','ship','stones','hall'],bog:['stones','ship']};
const FATHER_NAMES={horse:'The White Horse of %',ring:'The Stone Ring of %',ship:'The Stone Ship of %',hall:'The Burned Hall of %',stones:'The Picture Stones of %'};
// what a hoard chest holds: [item, least, most, weight] (the relics of the forefathers are rare)
const FATHERLOOT=[[457,1,1,1.2],[458,1,1,0.6],[459,1,1,0.9],[204,2,6,6],[205,1,2,2],[224,1,2,3],[223,1,2,3],[206,2,4,4],[201,4,8,3],[446,1,2,3],[228,1,2,1.5]];
// the white horse: a galloping horse, eighteen cells by eleven, its head to high a and its back to high b (uphill)
const HF_ROWS=['..............1...','.............111..','............11111.','...........111.111','..........111.....','..1111111111......','.11111111111......',
  '11111111111.......','1.11....111.......','..1.1....1.1......','.1...1..1...1.....'];
const fatC=new Map(),TFA={},TFA2={};
// a candidate stands only where no chunk two about it draws a lower hash (so no two ruins crowd one another)
const fatLow=(WCX,WCZ,q)=>{for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)if((a||b)&&hsh(WCX+a,9651,WCZ+b)<q)return false;return true;};
function fathersAt(WCX,WCZ){
  const key=WCX*65536+WCZ;if(fatC.has(key))return fatC.get(key);if(fatC.size>20000)fatC.clear();let s=null;const q=hsh(WCX,9651,WCZ);
  if(q<0.11){const X=WCX*CS+8,Z=WCZ*CS+8;colInfo(X,Z,TFA);const g=TFA.h,P=realmOfColumn(X,Z);
    if(!TFA.wet&&!TFA.river&&!TFA.bank&&!TFA.lake&&TFA.rvBot===999&&g>TFA.sl+3&&g+40<H){
      if(P&&P.cult.k==='horse'){ // a rider's cairn
        if(q<0.025&&!realmNear(X,Z,6)&&!realmRoadAt(X,Z,4)&&!sigNear(X,Z,4)&&!smallNear(X,Z,4)&&!pondNear(X,Z,4)&&!surfTaken(X,Z,4)){let lo=g,hi=g;
          for(const [a,b] of [[2,0],[-2,0],[0,2],[0,-2],[2,2],[-2,-2]]){const e=colInfo(X+a,Z+b,TFA2);if(e.wet||e.river||e.lake)lo=-1e9;lo=Math.min(lo,e.h);hi=Math.max(hi,e.h);}
          if(hi-lo<=2)s={kind:'cairn',X:X,Z:Z,g:g,R:3,dir:0,name:null};}}
      else if(!P&&q<0.11&&fatLow(WCX,WCZ,q)){const L=FATHER_LANDS[LANDS[TFA.land].k];
        if(L&&!surfTaken(X,Z,22)&&!sigNear(X,Z,22)&&!smallNear(X,Z,22)&&!pondNear(X,Z,22)&&!elderNear(X,Z,24)&&!oldNear(X,Z,24)){
          const kind=L[Math.floor(hsh(WCX,9655,WCZ)*L.length)],R=kind==='horse'?20:kind==='ship'?16:kind==='hall'?14:kind==='stones'?12:11;let lo=g,hi=g,ux=0,uz=0;
          for(let k=0;k<12;k++){const a=k/12*6.283;for(const d of [R*0.5,R]){const e=colInfo(X+Math.round(Math.cos(a)*d),Z+Math.round(Math.sin(a)*d),TFA2);const x=X+Math.round(Math.cos(a)*d),z=Z+Math.round(Math.sin(a)*d);if(e.wet||e.river||e.lake||e.h<e.sl+2||oldRoadAt(x,z)||realmRoadAt(x,z,2))lo=-1e9;lo=Math.min(lo,e.h);hi=Math.max(hi,e.h);ux+=Math.cos(a)*(e.h-g);uz+=Math.sin(a)*(e.h-g);}}
          for(let dx=-R;dx<=R&&lo>-1e9;dx+=3)for(let dz=-R;dz<=R;dz+=3)if(Math.hypot(dx,dz)<=R+1&&oldRoadAt(X+dx,Z+dz)){lo=-1e9;break;} // no old road across it
          for(let a=-3;a<=3&&lo>-1e9;a++)for(let b=-3;b<=3;b++){const f=fallAt(WCX+a,WCZ+b);if(f&&f.path.some(([x,z])=>Math.hypot(x-X,z-Z)<R+3)){lo=-1e9;break;}}
          const sp=hi-lo,ok=kind==='horse'?sp>=5&&sp<=30&&lo>-1e9:sp<=(kind==='stones'?10:kind==='ring'?9:kind==='ship'?8:7);
          if(ok){const rn=rngAt(WCX,9657,WCZ),nm=nameWord('rider',rn);let dir=Math.floor(hsh(WCX,9659,WCZ)*4);
            if(kind==='horse'){let best=-1e9;for(let d=0;d<4;d++){const [fx,fz]=ELD4[d],v=-fz*ux+fx*uz;if(v>best){best=v;dir=d;}}} // its back (local +b) uphill
            s={kind:kind,X:X,Z:Z,g:g,R:R,dir:dir,name:FATHER_NAMES[kind].replace('%',nm)};}}}}}
  fatC.set(key,s);return s;
}
function fathersNear(X,Z,m){const cx=Math.floor(X/CS),cz=Math.floor(Z/CS);for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const s=fathersAt(cx+a,cz+b);if(s&&Math.hypot(X-s.X,Z-s.Z)<=s.R+(m||0))return s;}return null;}
function applyFathers(WCX,WCZ){for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const s=fathersAt(WCX+a,WCZ+b);if(s)fathersBuild(s);}}
function fathersBuild(s){
  const r=mkRng(1+Math.floor(hsh(s.X,9661,s.Z)*2147483000)),[fx,fz]=ELD4[s.dir],g=s.g;
  // local (a, b): a along the ruin, b across it (for the white horse, b uphill)
  const XZ=(a,b)=>[s.X+a*fx-b*fz,s.Z+a*fz+b*fx],P=(a,b,y,id,m)=>{const [x,z]=XZ(a,b);PW(x,y,z,id,m||MODE_SET);},G=(a,b)=>{const [x,z]=XZ(a,b);return hAt(x,z);};
  const bloom=(a,b)=>{const gg=G(a,b);P(a,b,gg+1,BARROWBLOOM,MODE_AIR);};
  const stone=(a,b,h,id)=>{const gg=G(a,b);for(let y=gg+1;y<=gg+h;y++)P(a,b,y,id||STANDSTONE);};
  const chest=(a,b)=>{const gg=G(a,b);P(a,b,gg,FSTONE);P(a,b,gg+1,FCHEST);P(a,b,gg+2,AIR);};
  switch(s.kind){
    case 'cairn':{for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){if(Math.abs(a)+Math.abs(b)===2&&hsh(a+s.X,9663,b+s.Z)<0.5)continue;const gg=G(a,b);P(a,b,gg+1,FSTONE);}
      const gg=G(0,0);P(0,0,gg+2,FSTONE);P(0,0,gg+3,STAKES);P(1,0,gg+2,HSHIELD,MODE_AIR);
      for(const [a,b] of [[2,1],[-2,0],[1,-2],[-1,2],[2,-1]])if(hsh(a+s.X,9665,b+s.Z)<0.7)bloom(a,b);break;}
    case 'horse':{ // the white horse: the figure two blocks to each of its cells, its turf cut away to chalk two deep
      for(let a=-18;a<18;a++)for(let b=-11;b<=10;b++){const cx=Math.floor((a+18)/2),cy=Math.floor((10-b)/2);if(!(cy>=0&&cy<11&&HF_ROWS[cy][cx]==='1'))continue;
        const gg=G(a,b);P(a,b,gg,CHALK);P(a,b,gg-1,CHALK);P(a,b,gg+1,AIR);P(a,b,gg+2,AIR);}
      // the cairn over the hoard on the hilltop above it
      for(let a=-1;a<=1;a++)for(let b=14;b<=16;b++){if(a===0&&b===15)continue;const gg=G(a,b);P(a,b,gg+1,FSTONE);if(Math.abs(a)+Math.abs(b-15)===1)P(a,b,gg+2,FSTONE);}
      chest(0,15);{const gg=G(0,15);P(0,15,gg+2,STANDSTONE);}break;}
    case 'ring':{ // twelve standing stones about an altar stone, some fallen
      for(let k=0;k<12;k++){const an=k*Math.PI/6+0.13,a=Math.round(Math.cos(an)*8),b=Math.round(Math.sin(an)*8),q=r();
        if(q<0.22){const da=Math.round(Math.cos(an+1.6)),db=Math.round(Math.sin(an+1.6)),gg=G(a,b);P(a,b,gg+1,STANDSTONE);P(a+da,b+db,G(a+da,b+db)+1,STANDSTONE);}
        else stone(a,b,2+Math.floor(r()*3));}
      for(const b of [-1,0,1]){const gg=G(0,b);P(0,b,gg+1,STANDSTONE);}
      for(let k=0;k<10;k++)bloom(Math.round(r()*12-6),Math.round(r()*12-6));
      chest(2,0);break;}
    case 'ship':{ // a ship of stones fourteen either side of its middle: the stones along her sides, her stem and stern tall; a
      // picture stone amidships
      for(let a=-14;a<=14;a+=2){const w=Math.round(5*Math.sqrt(Math.max(0,1-(a/14.5)*(a/14.5)))),h=Math.abs(a)>=12?4:Math.abs(a)>=8?2:1;
        if(Math.abs(a)===14){stone(a,0,4);continue;}for(const sd of [1,-1])if(r()>0.12)stone(a,sd*w,h);}
      stone(0,0,3,PICSTONE);for(let k=0;k<6;k++)bloom(Math.round(r()*16-8),Math.round(r()*6-3));
      chest(3,0);break;}
    case 'hall':{ // the burned hall: footings of fieldstone round a long floor, two rows of charred posts, beams fallen across the
      // floor, ash, the long hearth cold in the middle
      for(let a=-12;a<=11;a++)for(let b=-5;b<=4;b++){const ea=a===-12||a===11,eb=b===-5||b===4,gg=G(a,b);
        if(ea||eb){if(!(a===-12&&Math.abs(b+0.5)<=1)&&hsh(a+s.X,9667,b+s.Z)>0.15)P(a,b,gg+1,FSTONE);continue;}
        const q=hsh(a+s.X,9669,b+s.Z);P(a,b,gg,q<0.3?ASH:q<0.45?GRAVEL:DIRT);
        if((b===-3||b===2)&&a%4===0&&a>-12&&a<11){const h=1+Math.floor(r()*3);for(let y=gg+1;y<=gg+h;y++)P(a,b,y,CHARWOOD);}
        else if(b===-1&&a>=-6&&a<=5&&(a===-6||a===5))P(a,b,gg+1,FSTONE);}
      for(let k=0;k<3;k++){const a0=-9+Math.floor(r()*14),b=-2+Math.floor(r()*4);for(let a=a0;a<a0+4;a++)P(a,b,G(a,b)+1,CHARWOOD);}
      for(let a=-5;a<=4;a++){const gg=G(a,0);P(a,0,gg,FSTONE);P(a,-1,G(a,-1),FSTONE);}
      chest(9,-1);break;}
    default:{ // the picture stones: five in an arc before a mound, the hoard in a setting of stones at the mound's foot
      for(let a=2;a<=11;a++)for(let b=-6;b<=6;b++){const d=Math.hypot(a-7,b);if(d>5.5)continue;const gg=G(a,b),h=Math.round(3*(1-(d/5.5)*(d/5.5)));for(let y=gg+1;y<=gg+h;y++)P(a,b,y,y===gg+h?GRASS:DIRT);if(h>0&&hsh(a,9671,b+s.Z)<0.3)P(a,b,gg+h+1,BARROWBLOOM,MODE_AIR);}
      for(const b of [-8,-4,0,4,8]){const a=-4+Math.round(Math.abs(b)*0.4);stone(a,b,2+(b===0?1:0),PICSTONE);}
      for(const [a,b] of [[1,-1],[1,1],[0,0],[2,0]]){const gg=G(a,b);P(a,b,gg+1,FSTONE);}chest(1,0);}
  }
}
