// ---- The Ember Stair (D-067): the way up inside each great volcano, from its foot to its crater. It leaves the Ember Throne's
// way in by a door in its side wall and winds round the mountain inside it, rising one in six, as near the flank as keeps 18
// blocks of rock over it, so it turns tighter as the mountain narrows; two turns and more to the top, where it ends in a gallery
// open over the crater's lake of fire. It goes by stretches of about 150: the orcs' stronghold (dressed basalt, floors of tiles,
// ribbed vaults, fire baskets, banners, iron gates between the stretches) and raw cave of the mountain's fire (basalt and
// obsidian, crusted lava underfoot, veins of magma in the walls, rock hanging from the roof). Halfway along each stretch it
// opens into a chamber: in the stronghold a hall (the gate of the stair, barracks, a forge, an armoury, a shrine of the
// Emberlord, a fighting pit), in the cave a cavern with a pool of lava held in its floor, or a hollow of obsidian spires.
// Every hall and cavern has its orcs, goblins or trolls (stairSpots). It is carved sealed: every cell of its interiors is
// opened, every cell about them within two is walled, so no cave's lava reaches in, and nothing is walled above the
// mountain's surface. Planned from the cone's own shape (volcCone), never the ground, per volcano; built per chunk.
const STAIR_W=4,STAIR_H=8,STAIR_COVER=18,stairC=new Map(),stairJ=new Map();
const STAIR_HALLS=['gate','barracks','forge','armoury','shrine','pit'],STAIR_CAVES=['cavern','hollow'];
const STAIR_NAMES={gate:'The Gate of the Stair',barracks:'The Barracks of the Ash Guard',forge:'The Forge of the Deep Fire',armoury:'The Armoury of the Throne',shrine:'The Shrine of the Emberlord',pit:'The Pit of the Stair',
  cavern:'The Cavern of Cinders',hollow:'The Obsidian Hollow',gallery:'The Gallery of the Crater'};
// the stair of great volcano v (null if it has none), planned now if it is not yet
function stairOf(v){
  if(!v||!v.great)return null;if(stairC.has(v.key))return stairC.get(v.key);const g=stairJ.get(v.key)||planStair(v);stairJ.delete(v.key);let r;while(!(r=g.next()).done);
  if(stairC.size>200)stairC.clear();stairC.set(v.key,r.value);return r.value;}
// Streaming (a step of its own, before a chunk's columns, like realmPrep): the stairs of the great volcanoes about the chunk are
// planned a slice at a time. True once all are planned
function stairPrep(X,Z){for(const v of greatNear(X,Z,0)){if(!v.great||stairC.has(v.key))continue;let g=stairJ.get(v.key);if(!g){if(stairJ.size>4)stairJ.clear();g=planStair(v);stairJ.set(v.key,g);}
    const t0=performance.now();let r;while(!(r=g.next()).done)if(performance.now()-t0>WG_STEP_MS)return false;
    stairJ.delete(v.key);if(stairC.size>200)stairC.clear();stairC.set(v.key,r.value);return false;}
  return true;}
function* planStair(v){
  let H=null;const F=fortOf(v);yield;
  if(F){const S=volcShape(v),P=F.P,cone=(X,Z)=>{const [d,th]=volcFrame(v,S,X,Z);return d>=v.R?v.base:v.base+volcCone(v,S,d,th,X,Z);},r=rngAt(v.i,9801,v.j),sj=r()<0.5?1:-1;
    const fw=(u,w)=>[F.GX-F.ox*u+F.px*w,F.GZ-F.oz*u+F.pz*w];
    // the door: where the way in has rock enough beside it, at least 12 in from the gate
    let uJ=-1;for(let u=12;u<F.U1-12;u+=2){const [x,z]=fw(u,sj*(P.cw+16));if(cone(x,z)>=fortFloor(F,u)+STAIR_H+STAIR_COVER){uJ=u;break;}}
    if(uJ>=0){const y0=fortFloor(F,uJ)-1,pts=[];let [x,z]=fw(uJ,sj*(P.cw+1)),dx=F.px*sj,dz=F.pz*sj,y=y0;pts.push([x,z,y]);
      for(let k=1;k<=4;k++){x+=dx*4;z+=dz*4;pts.push([x,z,y]);}
      // round the mountain: four along the way about its middle (which leans with the crater as it rises), then in (at most four)
      // or out (at most two) toward the radius that keeps its cover over the next four steps, and up two in three
      const mid=yy=>{const q=Math.pow(Math.max(0,Math.min(1,(yy-v.base)/v.Hv)),1.5);return [v.X+S.ox*q,v.Z+S.oz*q];};
      for(let k=0;k<700;k++){if(k%8===0)yield;const [mx,mz]=mid(y),rx=x-mx,rz=z-mz,rr=Math.hypot(rx,rz)||1;let tx=-rz/rr,tz=rx/rr;if(tx*dx+tz*dz<0){tx=-tx;tz=-tz;}
        x+=tx*4;z+=tz*4;y+=4/6;dx=tx;dz=tz;
        const [cx,cz]=mid(y),rad=Math.hypot(x-cx,z-cz),ux=(x-cx)/rad,uz=(z-cz)/rad,need=y+STAIR_H+STAIR_COVER;let best=null;
        // the cover over a spread of points across the passage and out beyond its flank side (the gullies are narrow and deep)
        const deep=(px,pz)=>{for(const [o,t] of [[0,0],[STAIR_W+3,0],[STAIR_W+9,0],[0,4],[0,-4],[STAIR_W+3,4],[STAIR_W+3,-4]])if(cone(px+ux*o+tx*t,pz+uz*o+tz*t)<need)return false;return true;};
        for(let e=4;e>=-24&&best===null;e-=2){let ok=true;for(let a=0;a<=4&&ok;a++){const px=x+tx*4*a+ux*e,pz=z+tz*4*a+uz*e;
            if(!deep(px,pz))ok=false; // its cover toward the flank
            else if(y<v.lake+3&&cone(px-ux*(STAIR_W+3),pz-uz*(STAIR_W+3))<y+STAIR_H+6)ok=false;} // and never into the crater below its lake
          if(ok)best=e;}
        const e=best===null?-4:Math.max(-4,Math.min(2,best));x+=ux*e;z+=uz*e;pts.push([x,z,y]);
        if(y>=v.lake+3)break;}
      if(y>=v.lake+3){
        // the gallery at the top: in from the stair's end toward the crater until the floor of the crater lies below it, a little more
        const [cx,cz]=mid(y),ex=cx-x,ez=cz-z,el=Math.hypot(ex,ez)||1,top=[];for(let q=1;q<40;q++){const px=x+ex/el*q*2,pz=z+ez/el*q*2;top.push([px,pz,y]);if(cone(px,pz)<y-1&&q>3){top.push([px+ex/el*3,pz+ez/el*3,y]);break;}}
        const L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
        // the stretches and their chambers
        const tot=L[L.length-1],secs=[],ch=[],seg=new Array(pts.length).fill(0);let nh=0,nc=0;
        for(let s=0;s*150<tot;s++){const kind=s%2===0?'hold':'cave';secs.push(kind);}
        for(let i=0;i<pts.length;i++)seg[i]=Math.min(secs.length-1,Math.floor(L[i]/150));
        for(let s=0;s<secs.length;s++){const Lm=s===0?Math.min(40,tot/2):s*150+75;if(Lm>tot-30)break;let i=0;while(i+1<pts.length&&L[i]<Lm)i++;
          const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],tl=Math.hypot(b[0]-a[0],b[1]-a[1])||1,tx=(b[0]-a[0])/tl,tz=(b[1]-a[1])/tl,[mx,mz]=mid(pts[i][2]),rl=Math.hypot(pts[i][0]-mx,pts[i][1]-mz)||1,ox=(pts[i][0]-mx)/rl,oz=(pts[i][1]-mz)/rl;
          const kind=secs[s]==='hold'?STAIR_HALLS[nh++%STAIR_HALLS.length]:STAIR_CAVES[nc++%STAIR_CAVES.length],cave=secs[s]==='cave',inw=cave?9:7;
          ch.push({kind:kind,cave:cave,x:pts[i][0]-ox*inw,z:pts[i][1]-oz*inw,y:Math.round(pts[i][2]),tx:tx,tz:tz,ox:ox,oz:oz,R:cave?15:0,len:26,wid:16,Hc:cave?18:11,i:i,seed:hsh(i,9803,v.i)});}
        ch.push({kind:'gallery',cave:false,x:x-ex/el*8,z:z-ez/el*8,y:Math.round(y),tx:dx,tz:dz,ox:-ex/el,oz:-ez/el,R:0,len:18,wid:14,Hc:10,i:pts.length-1,seed:0}); // (back from the crater, its spur opening onto it)
        const allP=pts.concat(top),segK=seg.concat(top.map(()=>secs.length));
        let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9,ylo=1e9,yhi=-1e9;for(const p of allP){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);z0=Math.min(z0,p[1]);z1=Math.max(z1,p[1]);ylo=Math.min(ylo,p[2]);yhi=Math.max(yhi,p[2]);}
        H={v:v,F:F,pts:allP,top0:pts.length,seg:segK,secs:secs.concat(['hold']),L:L,ch:ch,name:'The Ember Stair of '+v.name.replace(/^The Burning Mountain of /,''),sj:sj,
          box:[x0-40,x1+40,z0-40,z1+40,ylo-4,yhi+30],id:'st'+v.key};}}}
  return H;}
// the stairs of the great volcanoes whose works reach within m of (X,Z)
function stairsNear(X,Z,m){const out=[];for(const v of greatNear(X,Z,0))if(v.great){const H=stairOf(v);if(H&&X>=H.box[0]-m&&X<=H.box[1]+m&&Z>=H.box[2]-m&&Z<=H.box[3]+m)out.push(H);}return out;}
// A chamber's cells about (X,Z): its floor and the height of its interior there (0 outside it), and how far outside it lies
// (for the shell); local a along the stair, b across (out toward the flank positive)
function stairChamber(c,X,Z){const dx=X-c.x,dz=Z-c.z,a=dx*c.tx+dz*c.tz,b=dx*c.ox+dz*c.oz;
  if(c.R){const ang=Math.atan2(b,a),Rr=c.R*(1+0.18*Math.sin(ang*3+c.seed*6)+0.1*Math.sin(ang*7+c.seed*11)),r=Math.hypot(a,b)/Rr;
    if(r>=1)return [0,(Math.hypot(a,b)-Rr),a,b];return [Math.max(2,Math.round(c.Hc*Math.sqrt(1-r*r)+fbm2(X/6,Z/6,1,9805.3)*3)),0,a,b];}
  const ea=Math.abs(a)-c.len/2,eb=Math.abs(b)-c.wid/2;if(ea>0||eb>0)return [0,Math.max(ea,eb),a,b];
  return [c.Hc-(Math.abs(b)>c.wid/2-2?Math.round((Math.abs(b)-(c.wid/2-2))*1.5):0),0,a,b];}
// Is (X,Y,Z) a block of a cavern's pool of lava (held in its floor)?
function stairPool(c,a,b){return c.kind==='cavern'&&Math.hypot(a-3,b+2)<4.2;}
function stairLavaAt(X,Y,Z){for(const H of stairsNear(X,Z,0))for(const c of H.ch){if(!c.R||Math.abs(X-c.x)>c.R+2||Math.abs(Z-c.z)>c.R+2)continue;const [h,e,a,b]=stairChamber(c,X,Z);if(h&&Y===c.y&&stairPool(c,a,b))return true;}return false;}
// ---- Building, per chunk: each column's interiors (the stair's stretches near it and its chambers) and the shell about them
const TST={};
function applyStairs(WCX,WCZ){
  const x0=WCX*CS,z0=WCZ*CS;
  for(const H of stairsNear(x0+8,z0+8,8)){if(x0+CS<H.box[0]||x0>H.box[1]||z0+CS<H.box[2]||z0>H.box[3])continue;
    const segs=[],p=H.pts,M=STAIR_W+5;for(let i=0;i+1<p.length;i++){if(Math.max(p[i][0],p[i+1][0])+M<x0||Math.min(p[i][0],p[i+1][0])-M>x0+CS||Math.max(p[i][1],p[i+1][1])+M<z0||Math.min(p[i][1],p[i+1][1])-M>z0+CS)continue;segs.push(i);}
    const chs=H.ch.filter(c=>{const e=Math.max(c.R+6,c.len/2+c.wid/2+4);return c.x+e>=x0&&c.x-e<=x0+CS&&c.z+e>=z0&&c.z-e<=z0+CS;});
    if(!segs.length&&!chs.length)continue;genLit=true;
    try{for(let lz=0;lz<CS;lz++)for(let lx=0;lx<CS;lx++)stairCol(H,segs,chs,x0+lx,z0+lz);}finally{genLit=false;}}}
function stairCol(H,segs,chs,X,Z){
  const p=H.pts,x=X-OX,z=Z-OZ,gTop=ground[x+W*z],iv=[];
  for(const i of segs){const a=p[i],b=p[i+1],ex=b[0]-a[0],ez=b[1]-a[1],l2=ex*ex+ez*ez||1,t=Math.max(0,Math.min(1,((X-a[0])*ex+(Z-a[1])*ez)/l2)),d=Math.hypot(X-a[0]-ex*t,Z-a[1]-ez*t);
    const cave=H.secs[H.seg[i]]==='cave',hw=cave?STAIR_W+1+fbm2(X/9,Z/9,1,9807.1)*1.5:STAIR_W;if(d>hw+2.5)continue;const f=Math.round(a[2]+(b[2]-a[2])*t),L=(H.L[i]||0)+Math.sqrt(l2)*t;
    const top=d>hw?0:cave?Math.max(3,Math.round((STAIR_H+2)*Math.sqrt(Math.max(0,1-(d/hw)*(d/hw)))+fbm2(X/5,Z/5,1,9809.3)*2)):STAIR_H-(d>hw-1.5?1:0);
    iv.push([f,top,d>hw?d-hw:0,cave,L,d,i]);}
  for(const c of chs){const [h,e,a,b]=stairChamber(c,X,Z);if(e>2.5)continue;iv.push([c.y,h,e,c.cave,0,0,-1,c,a,b]);}
  if(!iv.length)return;
  // the fortress's own way in and hall stay as they are (the stair opens a door in the way's wall, nothing more)
  let fz=null;{const F=H.F,[fu,fv]=fortUV(F,X,Z),P=F.P;if(fu>=3&&fu<F.U1&&Math.abs(fv)<=P.cw||fu>=F.U1&&fu<=F.U1+F.Lh&&Math.abs(fv)<=P.hw+3)fz=[fortFloor(F,fu)-1,F.Fh+F.Hh+2];}
  const band=q=>q[0]+Math.max(q[1],q[7]?q[7].Hc+3:STAIR_H+4)+2;let ylo=1e9,yhi=-1e9;for(const q of iv){ylo=Math.min(ylo,q[0]-2);yhi=Math.max(yhi,band(q));}
  const S=(y,id)=>{if(fz&&y>=fz[0]&&y<=fz[1])return;PW(X,y,Z,id,MODE_SET);};
  for(let y=ylo;y<=yhi;y++){let inn=null,sh=null;
    for(const q of iv){const f=q[0];if(q[1]&&q[2]===0&&y>f&&y<=f+q[1]){inn=q;break;}if(y>=f-2&&y<=band(q))sh=sh||q;}
    if(inn){S(y,y>gTop?AIR:stairInner(H,inn,X,y,Z));continue;} // nothing is furnished out in the open
    if(!sh)continue;
    // out in the open only the gallery at the top and its way out over the crater are built: a floor, and a parapet at its edge
    if(y>gTop&&!((sh[7]&&sh[7].kind==='gallery'||sh[6]>=H.top0-1)&&(y===sh[0]||y===sh[0]+1&&sh[2]>0&&sh[2]<=1.5)))continue;
    S(y,stairShell(H,sh,X,y,Z,iv));}}
// what fills an interior cell (air, or a piece of furnishing)
function stairInner(H,q,X,y,Z){const f=q[0],dy=y-f,c=q[7],h=hsh(X*3+y,9811,Z);
  if(c)return stairRoom(H,c,q[8],q[9],X,y,Z,dy,q[1]);
  if(q[3]){if(dy===q[1]&&h<0.12)return CINDER;return AIR;} // rock hanging from a cave's roof
  const L=q[4],d=q[5],at=Math.floor(L)%10;
  if(dy===1&&d>STAIR_W-1.2&&at===5)return BRAZIER;
  if(dy===STAIR_H&&Math.floor(L)%6===0)return BASCARVE;
  if(dy>=STAIR_H-1&&Math.floor(L)%150<2)return GRATE; // the gate between the stretches, raised
  return AIR;}
// the shell: the floor, the walls and the vault, by the stretch's kind
function stairShell(H,q,X,y,Z,iv){const f=q[0],h=hsh(X*7+y,9813,Z);
  if(q[7]&&y===f&&q[2]===0&&stairPool(q[7],q[8],q[9]))return LAVA; // a cavern's pool, held in its floor
  if(q[3]){if(y===f)return h<0.18?LAVACRUST:h<0.6?CINDER:BLACKASH;return h<0.05?MAGMA:h<0.17?OBSID:h<0.4?BASALT:CINDER;}
  if(y===f)return q[2]>0.5?OBSBRICK:BASTILE;
  if(q[7])return fortStone(X,y,Z);
  if(y===f+3&&Math.floor(q[4])%20===10&&q[2]<1.2&&h<0.6)return EMGLYPH;
  return fortStone(X,y,Z);}
// The furnishings of a chamber (a along the stair, b across, dy over its floor, hc its height there)
function stairRoom(H,c,a,b,X,y,Z,dy,hc){const k=c.kind,h=hsh(X*5+y,9815,Z),ab=Math.abs(b),aa=Math.abs(a);
  if(c.cave){if(stairPool(c,a,b))return AIR;
    if(k==='hollow'){const sx=Math.round(a/5)*5,sz=Math.round(b/5)*5,sh2=hsh(sx,9817,sz);if(sh2<0.35&&Math.hypot(a-sx,b-sz)<1.2&&dy<=Math.round(3+sh2*14))return OBSID;}
    if(dy===hc&&h<0.15)return CINDER;
    if(k==='cavern'&&dy===1&&h<0.03)return BONES;return AIR;}
  const W2=c.wid/2,L2=c.len/2;
  // pillars down both sides of every hall, fire baskets between them
  if(ab>=W2-3&&ab<=W2-2&&(Math.round(a)%6+6)%6===0&&dy<hc)return BASPILLAR;
  if(ab>W2-1.5&&(Math.round(a)%6+6)%6===3&&dy===1)return BRAZIER;
  if(dy===hc&&(Math.round(a)%6+6)%6===0)return BASCARVE;
  switch(k){
    case 'gate':if(aa<=1&&dy>=hc-2&&ab<=STAIR_W)return GRATE;if(aa>=L2-1&&ab<=W2-3&&dy===1&&h<0.4)return SPIKES;if(ab<=1&&aa===4&&dy===1)return SKULLS;break;
    case 'barracks':if(ab>=W2-5&&ab<=W2-4&&(Math.round(a)%3+3)%3!==0&&dy===1)return HIDE;if(ab<=1&&(Math.round(a)%8+8)%8===4&&dy===1)return h<0.5?BARREL:CRATE;break;
    case 'forge':if(ab<=1.5&&aa<=L2-4){if(dy===1&&(Math.round(a)%5+5)%5===0)return ORCIRON;}if(ab>=W2-5&&ab<=W2-4&&aa<=3){if(dy<=4)return dy===1?MAGMA:BASBRICK;}if(ab<=0.5&&aa===L2-3&&dy>=2&&dy<=hc-1)return CHAIN;break;
    case 'armoury':if(ab>=W2-5&&ab<=W2-4&&(Math.round(a)%2+2)%2===0&&dy<=2)return dy===2?SPIKES:CHARWOOD;if(ab<=1&&(Math.round(a)%5+5)%5===0&&dy===1)return CRATE;break;
    case 'shrine':if(ab<=1.5&&a>=L2-4&&dy<=6)return dy===6?BRAZIER:dy===1?OBSBRICK:EMGLYPH;if(ab<=0.5&&a>=L2-6&&a<L2-4&&dy===1)return SKULLS;if(ab>=2&&ab<=4&&a>=L2-3&&dy===1)return BONES;break;
    case 'pit':if(ab<=W2-5&&aa<=L2-6){if(dy===1&&(ab>W2-6||aa>L2-7))return SPIKES;}break;
    case 'gallery':if(dy===1&&ab>=W2-2&&(Math.round(a)%4+4)%4===0)return BRAZIER;break;}
  return AIR;}
// ---- Names and the foes in it
// the name of the stair at (X,Y,Z) (a chamber's own name in a chamber), or null
function stairName(X,Y,Z){for(const H of stairsNear(X,Z,0)){if(Y<H.box[4]||Y>H.box[5])continue;
  for(const c of H.ch){if(Math.abs(Y-c.y-4)>c.Hc)continue;const [h]=stairChamber(c,X,Z);if(h)return STAIR_NAMES[c.kind];}
  const p=H.pts;for(let i=0;i+1<p.length;i++){const a=p[i],b=p[i+1],ex=b[0]-a[0],ez=b[1]-a[1],l2=ex*ex+ez*ez||1,t=Math.max(0,Math.min(1,((X-a[0])*ex+(Z-a[1])*ez)/l2));
    if(Math.hypot(X-a[0]-ex*t,Z-a[1]-ez*t)<=STAIR_W+1&&Math.abs(Y-(a[2]+(b[2]-a[2])*t)-4)<=6)return H.name;}}return null;}
// where they stand: each chamber's band (world coordinates, y the floor), within 44 of (X,Z) and 18 of Y
const STAIR_SPOT={gate:'gate',barracks:'ocamp',forge:'oforge',armoury:'ogate',shrine:'shrine',pit:'opit',cavern:'band',hollow:'den',gallery:'gate'};
function stairSpots(X,Y,Z,out){for(const H of stairsNear(X,Z,44))H.ch.forEach((c,k)=>{if(Math.hypot(c.x-X,c.z-Z)>44||Math.abs(c.y-Y)>18)return;
  out.push({id:H.id+':'+k,x:c.x+0.5,y:c.y+1,z:c.z+0.5,R:c.cave?6:5,kind:STAIR_SPOT[c.kind],stair:c.kind});});}
