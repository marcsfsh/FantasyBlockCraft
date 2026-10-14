// ---- The prospectors' claims (D-091): the dwarves go out beyond their holds into the high lands no kingdom holds, after the
// ore in the hills: the Pine Highlands, the Glacier Fields, the Alpine Meadows, the Karst Crags, the Crystal Barrens, the Frozen
// Tundra, the Fjords, the Cloud Forest Heights and the Starfall Craters, outside the realms. About one chunk in eight of those lands is tried for one: the foot of the steepest rise in
// the chunk (four or more in eight) (most fail on the ground: a claim wants a hillside steep enough to drive an adit into, level ground before it for the
// camp, and no water, road or place near).
// The adit runs level into the hill from its mouth (uphill, along the claim's a), three wide and four high, timbered every four,
// walled as the holds' mines are (RB.dhold: the rock as it stands, filled where a cave or water touches it, ore and now and then
// a gem in its walls), so no water or lava reaches in; a cart at its face. Before its mouth the camp: a lean-to of slate on props
// with a bedroll and the prospector's strongbox (DSTRONG, PROSPLOOT), a fire, an anvil, a heap of spoil. One claim in three is
// worked out and left: its props fallen here and there, its lamps gone, cobwebs in it, the fire ash. The rest are kept by a
// prospector by day (dwarf-life.js), who will trade.
// Pure per chunk like the forefathers' ruins; each reaches at most 24 blocks from its mouth, so the chunks two about it build it
// (applyClaims); claimsNear keeps trees and boulders off. They keep off the elder elves' ruins, the old kingdom's and the
// forefathers' (they ask elderNear, oldNear and fathersNear; those never ask for these).
const CLAIM_LANDS=new Set(['pine','glacier','alpine','karst','crystal','tundra','fjord','cloud','starfall']);
// what a strongbox holds: [item, least, most, weight]
const PROSPLOOT=[[468,1,3,4],[469,1,1,1],[213,2,5,4],[214,1,3,2],[210,2,5,3],[200,3,8,4],[204,2,6,4],[462,1,2,3],[465,1,2,3],[466,1,1,2],[470,1,1,0.4],[485,1,1,0.3],[223,1,2,2]];
const clmC=new Map(),TCL={},TCL2={};
const claimLow=(WCX,WCZ,q)=>{for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)if((a||b)&&hsh(WCX+a,9701,WCZ+b)<q)return false;return true;};
function claimsAt(WCX,WCZ){
  const key=WCX*65536+WCZ;if(clmC.has(key))return clmC.get(key);if(clmC.size>20000)clmC.clear();let s=null;const q=hsh(WCX,9701,WCZ);
  if(q<0.13&&claimLow(WCX,WCZ,q)){const X0=WCX*CS+8,Z0=WCZ*CS+8;colInfo(X0,Z0,TCL);
    if(CLAIM_LANDS.has(LANDS[TCL.land].k)&&!realmOfColumn(X0,Z0)&&!realmNear(X0,Z0,12)&&!wasteGateNear(X0,Z0,40)){
      // the mouth: the foot of the steepest rise in the chunk (eight blocks on), with level ground before it for the camp
      let top=null;for(let x=1;x<CS;x+=3)for(let z=1;z<CS;z+=3){const X=WCX*CS+x,Z=WCZ*CS+z,e0=colInfo(X,Z,TCL2),h=e0.h;if(e0.wet||e0.river||e0.bank||e0.lake||h<=e0.sl+3)continue;
        for(let d=0;d<4;d++){const [fx,fz]=ELD4[d],r=colInfo(X+fx*8,Z+fz*8,TCL2).h-h;if(r<4)continue;const c=Math.abs(colInfo(X-fx*6,Z-fz*6,TCL2).h-h),sc=r-c*2;if(c<=4&&(!top||sc>top.sc))top={X:X,Z:Z,d:d,sc:sc};}}
      if(top){const X=top.X,Z=top.Z,dir=top.d;colInfo(X,Z,TCL);const g=TCL.h;
        let ok=CLAIM_LANDS.has(LANDS[TCL.land].k)&&!TCL.wet&&!TCL.river&&!TCL.bank&&!TCL.lake&&g>TCL.sl+3&&g+30<H&&!realmOfColumn(X,Z)
          &&!surfTaken(X,Z,22)&&!sigNear(X,Z,22)&&!smallNear(X,Z,22)&&!pondNear(X,Z,22)&&!elderNear(X,Z,24)&&!oldNear(X,Z,24)&&!fathersNear(X,Z,24);
        const [fx,fz]=ELD4[dir],XZ=(a,b)=>[X+a*fx-b*fz,Z+a*fz+b*fx],G=(a,b)=>{const [x,z]=XZ(a,b);return colInfo(x,z,TCL2);};
        // the camp's ground before the mouth: near level, dry, no road
        for(const [a,b] of [[-4,0],[-7,0],[-6,-5],[-6,4],[-2,-4],[-2,4]]){if(!ok)break;const e=G(a,b),[x,z]=XZ(a,b);if(e.wet||e.river||e.lake||Math.abs(e.h-g)>4||oldRoadAt(x,z)||realmRoadAt(x,z,2))ok=false;}
        // the hill over the adit: rock over its roof from no more than ten in (an open cut before that), for six or more and as
        // far as it runs (22 at most)
        let ai=-1,n=0;if(ok)for(let a=3;a<=22;a++){let lo=1e9;for(const b of [-2,0,2]){const e=G(a,b);lo=Math.min(lo,e.wet||e.river||e.lake?-1e9:e.h);}if(lo>=g+5){if(ai<0)ai=a;n=a;}else if(ai>=0)break;}
        if(ok&&ai>=0&&ai<=10&&n-ai>=6){for(let a=-3;a<=3&&ok;a++)for(let b=-3;b<=3;b++){const f=fallAt(WCX+a,WCZ+b);if(f&&f.path.some(([x,z])=>Math.hypot(x-X,z-Z)<28)){ok=false;break;}}
          if(ok){const rn=rngAt(WCX,9703,WCZ),nm=nameWord('dwarf',rn),ab=hsh(WCX,9705,WCZ)<0.34;
            s={kind:'claim',X:X,Z:Z,g:g,R:24,dir:dir,n:n,ab:ab,who:nm,name:ab?'The Old Claim of '+nm:nm+'\'s Claim'};}}}}}
  clmC.set(key,s);return s;
}
function claimsNear(X,Z,m){const cx=Math.floor(X/CS),cz=Math.floor(Z/CS);for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const s=claimsAt(cx+a,cz+b);if(s&&Math.hypot(X-s.X,Z-s.Z)<=s.R+(m||0))return s;}return null;}
function applyClaims(WCX,WCZ){for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const s=claimsAt(WCX+a,WCZ+b);if(s)claimsBuild(s);}}
// the claim's frame: a along the adit into the hill from its mouth, b across it
const claimAB=(s,X,Z)=>{const [fx,fz]=ELD4[s.dir],dx=X-s.X,dz=Z-s.Z;return [dx*fx+dz*fz,-dx*fz+dz*fx];};
function claimsBuild(s){
  const [fx,fz]=ELD4[s.dir],g=s.g,XZ=(a,b)=>[s.X+a*fx-b*fz,s.Z+a*fz+b*fx],P=(a,b,y,id,m)=>{const [x,z]=XZ(a,b);PW(x,y,z,id,m||MODE_SET);},G=(a,b)=>{const [x,z]=XZ(a,b);return hAt(x,z);};
  // the adit: one shape in the claim's frame, carved and walled per column of this chunk by the holds' own builder
  if(!s.S)s.S=[dBox({t:'b',k:'cgal',st:2,ax:'u',u0:0,u1:s.n,v0:-1,v1:1,y0:g+1,y1:g+4})];const p={S:s.S,y0:g},cl=s;
  genLit=!s.ab;
  try{for(let lz=0;lz<CS;lz++)for(let lx=0;lx<CS;lx++){const X=gx0+lx,Z=gz0+lz,[a,b]=claimAB(s,X,Z);if(a<-1||a>s.n+1||Math.abs(b)>2)continue;RB.dhold(cl,p,a,b,X,Z);}
    // the cut before the mouth: the ground cleared to the adit's floor where it stands over it
    for(let a=-2;a<=0;a++)for(let b=-1;b<=1;b++){const gg=G(a,b);for(let y=g+1;y<=Math.max(gg,g+4);y++)P(a,b,y,AIR);P(a,b,g,GRAVEL);}
    for(const b of [-2,2]){const gg=G(0,b);for(let y=g+1;y<=g+4;y++)if(y<=gg)P(0,b,y,DPROP);}{const gg=G(0,0);if(gg>=g+5)for(let b=-2;b<=2;b++)P(0,b,g+5,DPROP);}
    // the camp: a lean-to of slate on props, a bedroll and the strongbox under it; the fire; an anvil; the heap of spoil
    for(let a=-9;a<=-6;a++)for(let b=3;b<=6;b++){const gg=G(a,b),post=(a===-9||a===-6)&&(b===3||b===6),roofY=gg+(b>=5?4:3);
      if(post)for(let y=gg+1;y<roofY;y++)P(a,b,y,DPROP);if(!s.ab||hsh(a+s.X,9707,b+s.Z)<0.6)P(a,b,roofY,SLATE);}
    {const gg=G(-8,5);P(-8,5,gg+1,WOOLB);const g2=G(-7,5);P(-7,5,g2+1,DSTRONG);const g3=G(-8,4);P(-8,4,g3+1,BARREL);}
    {const gg=G(-5,-2);for(const [a,b] of [[-6,-2],[-4,-2],[-5,-3],[-5,-1]])P(a,b,G(a,b)+1,COBBLE);P(-5,-2,gg+1,s.ab?ASH:BRAZIER);}
    {const gg=G(-3,-5);P(-3,-5,gg+1,DANVIL);}
    for(let a=-12;a<=-6;a++)for(let b=-9;b<=-4;b++){const d=Math.hypot(a+9,b+6.5);if(d>3.2)continue;const gg=G(a,b),h=Math.round(3*(1-d/3.2));for(let y=gg+1;y<=gg+h;y++)P(a,b,y,hsh(a*3+y,9709,b+s.Z)<0.08?IRON:GRAVEL);}
  }finally{genLit=false;}
}
// the adit's furnishing: a set of timbers every four (two props and a cap; in a worked-out claim some are down), a lamp at every
// other cap's middle (gone in a worked-out one, cobwebs there instead), a cart at the face
DEC.cgal=(s,p,q,u,v,X,Z,iv)=>{const y=q.y0,a=u-q.u0,c=v-q.v0,top=iv[1];
  if(a===q.u1-q.u0&&c===1){RBP(X,y,Z,DCART);return;}
  if(a%4===0&&a>0){if(s.ab&&hsh(X,9711,Z)<0.35){if(c===1&&hsh(X,9713,Z)<0.5)RBP(X,y,Z,DPROP);return;}if(c===0||c===2)RBS(X,Z,y,top-1,DPROP);RBP(X,top,Z,DPROP);return;}
  if(a%8===2&&c===1){if(s.ab)RBP(X,top,Z,COBWEB);else RBP(X,top,Z,DLAMP);}else if(s.ab&&c!==1&&hsh(X,9715,Z)<0.08)RBP(X,top,Z,COBWEB);};
