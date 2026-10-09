// ---- Water and caves by land (M6h, D-046; Q126, Q132): ponds and springs across the green lands, rapids where rocks break a
// river, hillside streams (planned with the waterfalls in highlands.js), and cave floors near the surface in the character of the
// land above them.
const POND_NONE=new Set(['dry','volcanic','petrified','starfall','glacier','blight','crystal','steppe']),pondC=new Map(),TPD={},TPD2={};
// A pond or spring: about one chunk in fifteen where the ground is level. Two blocks deep, its banks no lower than its water, so
// it is held by the ground around it. Pure per chunk; it reaches at most six blocks from its middle.
function pondAt(WCX,WCZ){
  const key=WCX*65536+WCZ;if(pondC.has(key))return pondC.get(key);if(pondC.size>20000)pondC.clear();let p=null;
  if(hsh(WCX,8931,WCZ)<0.07){const X=WCX*CS+4+Math.floor(hsh(WCX,8933,WCZ)*8),Z=WCZ*CS+4+Math.floor(hsh(WCX,8935,WCZ)*8);colInfo(X,Z,TPD);const L=LANDS[TPD.land],h=TPD.h;
    if(!L.sea&&!POND_NONE.has(L.k)&&!TPD.wet&&!TPD.river&&!TPD.bank&&!TPD.lake&&TPD.rvBot===999&&h>SEA+2&&h<SEA+120){
      const spring=hsh(WCX,8937,WCZ)<0.3,R=spring?1:2+Math.floor(hsh(WCX,8939,WCZ)*3);
      let ok=!surfTaken(X,Z,R+4)&&!sigNear(X,Z,R+4)&&!smallNear(X,Z,R+4);
      for(let dx=-R-1;dx<=R+1&&ok;dx++)for(let dz=-R-1;dz<=R+1&&ok;dz++){if(Math.hypot(dx,dz)>R+1.5)continue;const e=colInfo(X+dx,Z+dz,TPD2);if(e.h<h||e.h>h+2||e.rvBot<999||e.wet||e.river||e.lake)ok=false;}
      if(ok)p={X:X,Z:Z,h:h,R:R,spring:spring};}}
  pondC.set(key,p);return p;
}
function pondNear(X,Z,m){const cx=Math.floor(X/CS),cz=Math.floor(Z/CS);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const p=pondAt(cx+a,cz+b);if(p&&Math.hypot(X-p.X,Z-p.Z)<=p.R+1.5+(m||0))return p;}return null;}
function pondP(p){
  const {X,Z,h,R}=p;
  for(let dx=-R-1;dx<=R+1;dx++)for(let dz=-R-1;dz<=R+1;dz++){const d=Math.hypot(dx,dz),x=X+dx,z=Z+dz;
    if(d<R+0.5){PW(x,h,z,WATER,MODE_SET);PW(x,h-1,z,WATER,MODE_SET);PW(x,h-2,z,p.spring?GRAVEL:d<R-0.5?DIRT:SAND,MODE_SET);PW(x,h-3,z,DIRT,MODE_FILL);PW(x,h+1,z,AIR,MODE_SET);PW(x,h+2,z,AIR,MODE_SET);}
    else if(d<R+1.5){for(let y=h-3;y<h;y++)PW(x,y,z,DIRT,MODE_FILL);if(p.spring&&hsh(x,8941,z)<0.6)PW(x,hAt(x,z)+1,z,hsh(x,8943,z)<0.5?MOSSY:COBBLE,MODE_AIR);}}
}
function applyPonds(WCX,WCZ){for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const p=pondAt(WCX+a,WCZ+b);if(p)pondP(p);}}
// Rapids: stretches of a river where rocks stand up through the water
function rapidAt(X,Z){return hsh(X,8945,Z)<0.09&&fbm2(X/48,Z/48,1,8947.3)>0.25&&colInfo(X,Z,TPD).river;}
// Hillside streams: the green and wooded hills get falls of their own, smaller than the mountains' (see fallAt)
const STREAM_LANDS=new Set(['green','moors','elder','barrow','autumn','birch','pine','yew','giant','silver','terrace','shadow']);
// ---- Caves near the surface take on the land above them (Q132): within about fifty blocks of the ground
const CAVE_LOOK={autumn:'wood',birch:'wood',pine:'wood',giant:'wood',yew:'wood',silver:'wood',elder:'wood',green:'wood',orchard:'wood',farm:'wood',flower:'wood',terrace:'wood',
  willow:'wet',bog:'wet',moors:'wet',cloud:'wet',karst:'drip',chalk:'drip',alpine:'cold',glacier:'cold',tundra:'cold',fjord:'cold',mtn:'cold',
  dry:'sand',steppe:'sand',petrified:'sand',volcanic:'fire',blacksand:'fire',blight:'ash',barrow:'bone',shadow:'web',glowcap:'glow',crystal:'crystal',starfall:'star',sea:'shore',isles:'shore',kelp:'shore'};
function landCaves(X0,Z0){
  const cx=Math.floor(X0/CS),cz=Math.floor(Z0/CS);if(ruinZone(cx,cz)||mineZone(cx,cz))return;const r=rngAt(cx,8951,cz),T={};
  for(let k=0;k<90;k++){const X=X0+(r()*CS|0),Z=Z0+(r()*CS|0),g=ground[(X-OX)+W*(Z-OZ)],kind=r(),q=r();let y=g-6-(r()*44|0);
    if(y<8||GW(X,y,Z)!==AIR)continue;while(y>g-60&&y>8&&GW(X,y-1,Z)===AIR)y--;const fl=GW(X,y-1,Z);if(fl<=0||!SOLID[fl]||isWetId(GW(X,y,Z)))continue;
    const lk=CAVE_LOOK[LANDS[colInfo(X,Z,T).land].k];if(!lk)continue;
    const patch=id=>{for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(q<0.6||a===0||b===0)PW(X+a,y-1,Z+b,id,MODE_STONE);},on=id=>{if(GW(X,y,Z)===AIR)PW(X,y,Z,id,MODE_SET);};
    switch(lk){
      case 'wood':if(kind<0.4)patch(DIRT);else if(kind<0.6){patch(MOSSY);on(FERN);}else if(kind<0.7)on(MUSHB);break; // roots and earth under the woods
      case 'wet':if(kind<0.4)patch(PEAT);else if(kind<0.6){patch(MOSSY);on(GLOWSHROOM);}break;
      case 'drip':if(kind<0.45)on(DRIPU);else if(kind<0.7)patch(CALCITE);break;
      case 'cold':if(kind<0.45)patch(ICE);else if(kind<0.6)patch(PSNOW);break;
      case 'sand':if(kind<0.45)patch(RSAND);else if(kind<0.5)on(BONES);else if(kind<0.55)patch(PETRIWOOD);break;
      case 'fire':if(kind<0.4)patch(BASALT);else if(kind<0.5)patch(OBSID);else if(kind<0.55)patch(MAGMA);break;
      case 'ash':if(kind<0.5)patch(ASH);else if(kind<0.6)on(BONES);break;
      case 'bone':if(kind<0.25)on(BONES);else if(kind<0.5)patch(GRAVEL);break;
      case 'web':if(kind<0.35)on(COBWEB);else if(kind<0.6)patch(MOSSY);break;
      case 'glow':if(kind<0.5)on(GLOWSHROOM);else if(kind<0.7)patch(MOSSY);break;
      case 'crystal':if(kind<0.4)on(CRYSTAL);else if(kind<0.6)patch(AMETH);break;
      case 'star':if(kind<0.06)patch(STARORE);else if(kind<0.4)patch(SCORCH);break;
      case 'shore':if(kind<0.5)patch(GRAVEL);else if(kind<0.8)patch(SAND);break;}}
}
