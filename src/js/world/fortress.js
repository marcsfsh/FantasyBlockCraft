// ---- Fortresses in the volcanoes (D-052, D-054). The owner asked for balrogs; the name is Tolkien's, so ours are the Emberlords,
// towering demons of fire and shadow. Each stretch of the wastes has one great volcano (volcanic.js), and in it the Ember Throne:
// an Emberlord's fortress built to its lord's size, with a gate between two great towers at the mountain's foot, a broad way in
// through the rock past troughs of lava, and under the summit a vast throne hall with pillars, rivers of lava in the floor, a dais,
// the throne and the hoard. The lesser volcanoes hold warholds of the orcs on the same plan at a smaller size. A fortress faces
// the quarter of its mountain farthest from the flows. It is built per chunk from the volcano's plan, in detail since D-058 (a
// terrace with a moat of fire and two guardians, a face over a pointed gate, horned towers, vaults ribbed with fire, its own
// masonry), and every block of its lava lies in rock or behind iron that it lays itself (`fortLava`), so it is always held.
// The sizes: gate half-width and height; the way in's half-width and height; the hall's half-width, depths and heights; the
// towers (|v| of their middle, half-size, height); the facade (half-width, height); the terrace (half-width, depth); pillars
// (|v|, half-size, spacing); lava rivers (|v|); the dais (half-width, steps); k, the throne's size; bw, the bridges' half-width.
const FORT_P={
  hold:{gw:3,gh:10,cw:3,ch:9,hw:14,Lhs:[26,22],Hmin:14,Hmax:18,tv:11,ts:2,th:22,fw:14,fh:18,tz:16,td:16,pv:9,ps:1,pg:6,lv:5,dw:7,steps:3,k:1,bw:1},
  throne:{gw:8,gh:22,cw:9,ch:24,hw:32,Lhs:[60,50,42],Hmin:28,Hmax:36,tv:24,ts:4,th:46,fw:30,fh:40,tz:31,td:34,pv:20,ps:2,pg:10,lv:11,dw:16,steps:5,k:2,bw:3},
  // the grandest, for the great volcanoes of the sunken wastes (D-055), and a narrower hall for the smaller ones
  throneL:{gw:9,gh:26,cw:10,ch:28,hw:40,Lhs:[84,72,60],Hmin:34,Hmax:50,tv:28,ts:5,th:58,fw:36,fh:50,tz:36,td:40,pv:24,ps:3,pg:12,lv:14,dw:20,steps:6,k:3,bw:4},
  throneS:{gw:8,gh:22,cw:9,ch:24,hw:22,Lhs:[44,36],Hmin:26,Hmax:32,tv:20,ts:4,th:40,fw:26,fh:36,tz:27,td:30,pv:14,ps:2,pg:9,lv:8,dw:12,steps:5,k:2,bw:3}};
const FORT_C=new Map();
// The fortress of volcano v, or null. Local frame: u runs in from the gate's outer face, v across.
function fortOf(v){
  const key=v.key||v.i+','+v.j;if(FORT_C.has(key))return FORT_C.get(key);let F=null;
  for(const P of v.great?(v.R>=200?[FORT_P.throneL,FORT_P.throne,FORT_P.throneS]:[FORT_P.throne,FORT_P.throneS]):v.Hv>=34&&hsh(v.i,9171,v.j)<0.85?[FORT_P.hold]:[]){if(F)break;
    const quarters=[];for(let q=0;q<4;q++){const th=q*Math.PI/2;let m=9;for(const f of v.fl)m=Math.min(m,Math.abs(angDiffV(th,f.a)));for(const a of v.old)m=Math.min(m,Math.abs(angDiffV(th,a))*1.5);
      for(const t of v.sats||[])m=Math.min(m,Math.abs(angDiffV(th,Math.atan2(t.Z-v.Z,t.X-v.X)))*1.2);quarters.push({th:th,m:m});}
    quarters.sort((a,b)=>b.m-a.m);
    for(const qt of quarters){if(F)break;const ox=Math.round(Math.cos(qt.th)),oz=Math.round(Math.sin(qt.th)),px=-oz,pz=ox; // outward from the mountain's heart, and across
      let dg=-1;for(let d=Math.round(v.R*1.05);d>v.R*0.35;d--)if(hAt(v.X+ox*d,v.Z+oz*d)>=v.base+(v.great?8:6)){dg=d;break;}
      if(dg<0)continue;const GX=v.X+ox*dg,GZ=v.Z+oz*dg,Fy=hAt(GX,GZ);
      // the throne hall lies under the summit, its far end just past the mountain's heart, under the crater's floor; the way in
      // steps down (one block in two) if it must, so five blocks of rock at least lie over the hall
      for(const Lh of P.Lhs){const U1=Math.round(dg+4-Lh);if(U1<10)continue;let cov=1e9;
        for(let u=U1;u<=U1+Lh;u+=3)for(let w=-P.hw-2;w<=P.hw+2;w+=4)cov=Math.min(cov,hAt(GX-ox*u+px*w,GZ-oz*u+pz*w));
        for(let Dd=0;Dd<=Math.min(20,Math.floor((U1-8)/2));Dd+=2){const Fh=Fy-Dd,Hh=Math.min(P.Hmax,cov-Fh-6);if(Hh<P.Hmin)continue;
          const r=rngAt(v.i,9173,v.j),lord=fullName('fiend',r,false),E=U1+Lh,xs=[GX+ox*(P.td+8),GX-ox*(E+1)],zs=[GZ+oz*(P.td+8),GZ-oz*(E+1)],wd=Math.max(P.hw+3,P.fw+1,P.tz,P.tv+P.ts+1+2*P.k)+1;
          for(const w of [-wd,wd]){xs.push(GX+px*w);zs.push(GZ+pz*w);}
          F={v:v,P:P,great:!!v.great,GX:GX,GZ:GZ,Fy:Fy,Fh:Fh,Dd:Dd,ox:ox,oz:oz,px:px,pz:pz,U1:U1,Lh:Lh,Hh:Hh,lord:lord,id:'f'+key,
            name:v.great?'The Ember Throne of '+lord:'The Warhold of '+v.name,box:[Math.min(...xs)-1,Math.max(...xs)+1,Math.min(...zs)-1,Math.max(...zs)+1,Math.min(Fh-8,Fy-30),Fy+Math.max(P.th+7*P.k+4,P.fh+14*P.k+4)],seed:Math.floor(r()*1e6)};break;}
        if(F)break;}}}
  FORT_C.set(key,F);return F;
}
// the fortresses whose works reach within m of (X,Z)
function fortsNear(X,Z,m){const out=[];for(const v of volcanoesNear(X,Z,m+60)){const F=fortOf(v);if(F&&X>=F.box[0]-m&&X<=F.box[1]+m&&Z>=F.box[2]-m&&Z<=F.box[3]+m)out.push(F);}return out;}
// Is (X,Y,Z) within m of a fortress's works? (the warrens keep out)
function fortZone(X,Y,Z,m){for(const F of fortsNear(X,Z,m))if(Y>=F.box[4]-m&&Y<=F.box[5]+m)return true;return false;}
// local (u,v) of a world column
const fortUV=(F,X,Z)=>{const dx=X-F.GX,dz=Z-F.GZ;return [-(dx*F.ox+dz*F.oz),dx*F.px+dz*F.pz];};
// the floor (first open cell) along the way in: level for four blocks, then down a step every two to the hall's floor
const fortFloor=(F,u)=>u<=F.U1-1?F.Fy-Math.min(F.Dd,Math.max(0,Math.floor((u-4)/2))):F.Fh;
// Is (u,v) a lava cell of the fortress (one under the floor there)? A moat of fire across the terrace, bridged by the way to the
// gate; troughs across the way in where it is level (a bridge over each), clear of the pillars along its walls; and rivers down
// the throne hall either side of the middle, bridged in every bay.
function fortLavaUV(F,u,v){const P=F.P,U1=F.U1,ut=U1-6,av=Math.abs(v),k=P.k;
  if(u>=-P.td+2&&u<=-P.td+2+k)return av>P.gw&&av<=P.tz-2;
  if(av<=P.cw-(k>1?2:1)&&av>P.bw&&u<U1&&u>=3){if(ut-4>=2*F.Dd+2&&u>=ut&&u<=ut+2)return true;const um=Math.floor((ut+2*F.Dd+6)/2);if(ut-um>=12&&u>=um&&u<=um+2)return true;}
  return av>=P.lv&&av<P.lv+k&&u>=U1+4&&u<=U1+F.Lh-P.steps-6&&!fortBridge(F,u-U1);}
// a bridge over the hall's rivers, in the middle of each bay between the pillars
function fortBridge(F,pu){const P=F.P,q=((pu-4-P.ps-Math.floor(P.pg/2))%P.pg+P.pg)%P.pg;return q<=P.bw||q>=P.pg-P.bw;}
// Is (u,v,y) lava? Under the floors as above, in the back wall of the hall behind its grates, and in the pools on the towers.
// Every such block lies in rock (or behind iron) on every side and below.
function fortLava(F,u,v,y){const P=F.P,av=Math.abs(v);if(y===fortFloor(F,u)-1&&fortLavaUV(F,u,v))return true;
  if(u===F.U1+F.Lh)return av>=P.lv&&av<P.lv+P.k&&y>=F.Fh&&y<=F.Fh+fortD(F).lfH;
  return y===F.Fy+P.th&&Math.max(Math.abs(av-P.tv),Math.abs(u+P.ts))<=P.ts-2;}
function fortLavaAt(X,Y,Z){for(const F of fortsNear(X,Z,0)){const [u,v]=fortUV(F,X,Z);if(fortLava(F,u,v,Y))return true;}return false;}
// the name of the fortress at (X,y,Z), or null
function fortName(X,y,Z){for(const F of fortsNear(X,Z,0)){if(y<F.box[4]||y>F.box[5])continue;const [u,v]=fortUV(F,X,Z),P=F.P;if(u>=-P.td-1&&u<=F.U1+F.Lh&&Math.abs(v)<=Math.max(P.hw+2,P.tz,P.fw))return F.name;}return null;}
// where the lord waits and the guards stand (world coordinates, y the floor), and how far the lord will go from its throne
function fortSpots(F){const P=F.P,at=(u,v)=>({x:F.GX-F.ox*u+F.px*v+0.5,y:fortFloor(F,u),z:F.GZ-F.oz*u+F.pz*v+0.5}),lu=F.U1+F.Lh-P.steps-3-6*P.k,gv=Math.round((P.lv+P.k+P.pv-P.ps)/2);
  return {lord:at(lu,0),hall:at(F.U1+F.Lh/2,0),reach:lu+P.td+6,
    guards:[at(-6,-P.gw-1),at(-6,P.gw+1),at(-9,0),at(5,0),at(F.U1-2,2)],hallGuards:[at(lu-4,-gv),at(lu-4,gv),at(F.U1+4,0)]};}
// ---- building, per chunk (D-058)
// The measures every part is built from, worked out once per fortress: the arches of the gate, the way in and the hall (each a
// pointed arch: half-span, springing and rise), the bays, the moat, the guardians before the gate, the hall's pillars and cages
function fortD(F){if(F.d)return F.d;const P=F.P,k=P.k,Hh=F.Hh,d={E:F.U1+F.Lh,top:F.Fh+Hh,dz:P.steps+3+k,rt:k>1?2:1,rs:2*k+4,
    rG:Math.round(P.gw*1.6),rC:Math.round(P.cw*1.5),sN:Math.round(Hh*0.42),nw:P.pv-P.ps-1,sA:Math.round(Hh*0.3),wa:(P.hw-P.pv-P.ps)/2,vc:(P.pv+P.ps+1+P.hw)/2,
    um0:-P.td+2,um1:-P.td+2+k,sw:2*k+1,ph:k+1,mo:2*k,HH:4*k+2,pw:P.gw+4*k,kr:Math.max(1,Math.round(k*0.67)),lfH:Math.round(Hh*0.7),
    hc:Math.round((P.pv-P.ps)/2),dc:Math.round(Hh*0.3),rsg:2*k+1,statues:P.hw-P.pv-P.ps>=9};
  d.sG=P.gh-d.rG;d.sC=P.ch-d.rC;d.rN=Hh-d.sN-1;d.rA=Math.round(d.wa*1.4);d.us=d.um1+1+d.sw;d.vs=P.gw+2+d.sw;d.clr=Math.max(P.gh+6,d.ph+13*k+3);
  d.RN=(d.rN*d.rN+d.nw*d.nw)/(2*d.nw);d.cN=d.RN-d.nw;d.RA=(d.rA*d.rA+d.wa*d.wa)/(2*d.wa);d.cA=d.RA-d.wa;d.RC=(d.rC*d.rC+P.cw*P.cw)/(2*P.cw);d.cC=d.RC-P.cw;
  d.wB=P.lv-2;d.sB=2*k;d.rB=Math.max(d.wB,Hh-6-P.steps-2*k);d.sb=Math.round(d.sA*0.5);d.hbw=P.pg/2-2;
  d.np=Math.max(0,Math.floor((F.Lh-d.dz-2-P.ps-4-P.ps)/P.pg)+1);d.hb=P.pg/2-P.ps-0.5;d.yc=F.Fh+Hh-2-d.rsg-k;return F.d=d;}
// A pointed arch of half-span w, springing s above its floor and rising r above that: how far outside its curve a cell lies (a
// across from the arch's middle, dy up; negative inside)
function archD(a,dy,w,s,r){if(dy<=s)return a-w;const R=(r*r+w*w)/(2*w),c=R-w;return Math.hypot(a+c,dy-s)-R;}
// The relief of the big walls and vaults (D-058), so no face of the fortress is a flat sheet. fortPanel lays a wall out in
// tiers of blind lancets: 'L' a ledge (a course standing out), 'P' a pier standing out between the lancets, 'R' a lancet sunk a
// block into the wall, '' plain (p across the wall, t up from the tiers' foot). fortCoffer says whether a cell one block beyond a
// vault's curve is a coffer: sunk between a grid of ribs (al along the vault with ribs every pal, the arc measured up from the
// springing with ribs every k+2), never at the springing.
function fortPanel(k,p,t){const T=3*k+3,PW=k>1?5:4,tr=((t%T)+T)%T,q=((p%PW)+PW)%PW;if(t<0)return '';if(tr===0)return 'L';if(q===0)return 'P';
  return (tr>=2&&tr<=T-3)||(tr===T-2&&Math.abs(q-PW/2)<=0.6)?'R':'';}
function fortCoffer(a,dy,s,R,c,al,pal,k){return dy>s+1&&((al%pal)+pal)%pal!==0&&(R*Math.atan2(dy-s,a+c))%(k+2)>=1;}
// the middle of a coffer's back: a fire basket set in every other coffer (they light the vault) and an ember brick in the rest
function fortCofferMid(a,dy,s,R,c,al,pal,k){if(dy<=s+2||((al%pal)+pal)%pal!==pal>>1)return 0;const arc=R*Math.atan2(dy-s,a+c);if(Math.floor(arc%(k+2))!==(k+2)>>1)return 0;
  return (Math.floor(al/pal)+Math.floor(arc/(k+2)))%2===0?BRAZIER:EMBRICK;}
// the fortress's stone: basalt bricks, cracked in patches, here and there rough, a few seams still aglow
function fortStone(X,y,Z){const r=hsh(X+y*7919,9181,Z),p=hsh(X>>2,(y>>2)+9183,Z>>2)<0.3?0.34:0.08;return r<p?BASCRACK:r<p+0.03?BASALT:r>0.994?EMBRICK:BASBRICK;}
// A guardian in its lord's likeness, about 13s tall: hands on the pommel of a great sword set point down before it, wings folded
// behind and above it, horns, burning eyes and maw. f forward of its middle, a across (either side), t up from its plinth; 0
// where it is not.
function fortStatue(f,a,t,s,X,y,Z){
  const e=0.45/s,F=f/s,A=a/s,T=t/s,inn=(a0,a1,f0,f1,t0,t1)=>A>=a0-e&&A<=a1+e&&F>=f0-e&&F<=f1+e&&T>=t0-e&&T<=t1+e;
  if(T<-e||T>12.9)return 0;
  if(inn(0,0.25,1.5,1.9,0,4.2))return a===0&&s>2?EMBRICK:OBSID; // the blade, its fuller aglow
  if(inn(0,1.1,1.5,1.9,4.2,4.6)||inn(0,0.3,1.3,2.1,5.4,5.9))return OBSBRICK; // the guard and the pommel
  if(inn(0,0.7,1.1,2.1,4.6,5.4)||inn(0.6,2.3,0.5,1.5,4.7,5.4)||inn(1.8,2.5,-0.4,0.6,5.2,6.9))return fortStone(X,y,Z); // fists, forearms, upper arms
  if(inn(1.5,2.6,-0.9,0.9,6.8,7.8))return OBSBRICK; // the pauldrons
  if(inn(2.1,2.5,-0.3,0.3,7.8,8.8)||inn(0.8,1.6,-0.3,0.4,9.2,10)||inn(1.35,1.9,-0.25,0.25,10,11.4)||inn(1.5,1.9,-0.1,0.1,11.4,12.4))return OBSID; // spikes and horns
  if(inn(0,0.9,0.7,1.1,9.15,9.5))return OBSBRICK; // the brow
  if(inn(0,0.8,-0.5,0.8,8,9.8))return F>=0.6&&((A>=0.25&&A<=0.7+e&&T>=8.7-e&&T<=9.15+e)||(A<=0.45+e&&T>=8.1-e&&T<=8.45+e))?MAGMA:BASALT; // the head, its eyes and maw aglow
  if(inn(0,0.5,-0.3,0.4,7.4,8))return fortStone(X,y,Z);
  if(T>=4.3&&T<=7.4&&A<=1.2+(T-4.3)*0.38+e&&F>=-0.8-e&&F<=0.8+e)return F>0.55&&T>5.8?BASCARVE:fortStone(X,y,Z); // the torso, a V
  if(inn(0,1.6,-0.7,0.8,3.3,4.3))return T>=3.9?OBSBRICK:fortStone(X,y,Z); // the belt and tassets
  if(inn(0.6,1.5,-0.6,1.1,0,0.5)||inn(0.6,1.4,-0.6,0.6,0,3.4))return fortStone(X,y,Z); // feet and legs
  if(F>=-1.7-e&&F<=-0.85+e&&A>=0.3-e&&A<=2.7+e&&T>=2.6+A*1.4&&T<=12.8-(A-0.3)*0.9)return T>=12.8-(A-0.3)*0.9-1.2/s?EMBRICK:fortStone(X,y,Z); // the wings, their edges smouldering
  return 0;
}
// the lord's sign on the back wall of its hall: a ring of fire round a flame, with spikes about it
function fortSigil(d,av,dy){const R=d.rsg,r=Math.hypot(av,dy);
  if(Math.abs(r-R)<0.6)return MAGMA;
  if(r<R-1&&av<=Math.min((dy+R-1.5)*0.55,(R-1-dy)*0.5))return EMBRICK;
  if(r>=R+1&&r<=R+2+d.rsg/3&&(av<0.6||Math.abs(dy)<0.6||Math.abs(av-Math.abs(dy))<0.6))return OBSBRICK;
  return 0;}
// The throne, the dais's fire baskets and the hoard, above the dais (pd from the back wall, dy up from the dais's top there)
function fortThrone(P,d,pd,av,dy,X,Z){const k=P.k,ka=k>1?2:1;
  if(pd>=3&&pd<=2+k&&av<=k&&dy<k)return k>1&&pd===2+k&&dy===k-1?OBSBRICK:OBSID; // the seat
  if(pd>=3&&pd<=2+k&&av>k&&av<=k+ka&&dy<2*k)return OBSBRICK; // the arms, skulls on their ends
  if(pd===2+k&&av===k+1&&dy===2*k)return SKULLS;
  if(pd===2&&av<=k+ka&&dy<=7*k-av)return av<=(k>1?1:0)&&dy>=4*k&&dy<=5*k?MAGMA:OBSID; // the back, peaked, a burning sign in it
  if(pd===2&&k>1&&dy>=5*k&&dy<=8*k&&av===k+ka+Math.floor((dy-5*k)/2))return OBSID; // horns swept out from the back
  if(pd===d.dz-1&&av===P.dw-1&&dy<=2*k)return dy===2*k?BRAZIER:BASPILLAR; // fire baskets on pillars at the corners
  if(pd>=2&&pd<=3+k&&av>=k+ka+2&&av<=P.dw-2){const hh=Math.max(1,k+1-(pd-2))+(hsh(X,9187,Z)<0.25?1:0)-(av>=P.dw-3?1:0),r=hsh(X,9189,Z); // the hoard, heaped
    if(dy<hh)return GOLDB;if(dy===hh)return r<0.1?DWCHEST:r<0.18?SKULLS:r<0.24?CRATE:r<0.3?BONES:0;}
  return 0;}
// The stair down from the terrace: treads of tile and obsidian between low walls with skulls on them
function fortStairs(F,X,Z,u,av){const P=F.P,y=F.Fy-1-(-P.td-u),S=(q,id)=>PW(X,q,Z,id,MODE_SET);if(av>P.gw)return;
  for(let q=y-12;q<y-4;q++)PW(X,q,Z,BASALT,MODE_FILL);
  if(av===P.gw){for(let q=y-4;q<=y+2;q++)S(q,fortStone(X,q,Z));const sk=u%3===0;if(sk)S(y+3,SKULLS);for(let q=y+(sk?4:3);q<=F.Fy+4;q++)S(q,AIR);return;}
  for(let q=y-4;q<y;q++)S(q,fortStone(X,q,Z));S(y,u&1?OBSBRICK:BASTILE);for(let q=y+1;q<=F.Fy+4;q++)S(q,AIR);}
// The terrace before the gate: a paved way between edges of obsidian, chevrons pointing in and a burning line down its middle; a
// moat of fire across it, bridged, with fire baskets at the bridge's ends and along the way; parapets with skulls and spikes; an
// obelisk at each outer corner; and two guardians in the lord's likeness on plinths written round with fire
function fortTerrace(F,d,X,Z,u,v,av,h){const P=F.P,k=P.k,Fy=F.Fy,S=(y,id)=>PW(X,y,Z,id,MODE_SET);
  for(let y=Fy-30;y<Fy-8;y++)PW(X,y,Z,BASALT,MODE_FILL);for(let y=Fy-8;y<Fy-1;y++)S(y,BASALT);for(let y=Fy;y<=Fy+d.clr;y++)S(y,AIR);
  const lava=fortLavaUV(F,u,v);
  S(Fy-1,lava?LAVA:av<P.gw?(av===P.gw-1?OBSBRICK:av<=(k>1?1:0)&&!(u&1)?EMBRICK:(u+av)%6===0?OBSBRICK:BASTILE):(u%8===0||v%8===0)?OBSBRICK:h<0.06?BASCRACK:BASTILE);
  if((u===-P.td||av===P.tz)&&!(u===-P.td&&av<P.gw)){for(let y=Fy;y<Fy+k;y++)S(y,fortStone(X,y,Z));const m=(u+v)%3!==0;
    if((u+v)%6===0)S(Fy+k,SKULLS);else if(m){S(Fy+k,fortStone(X,Fy+k,Z));if((u+v)%2===0)S(Fy+k+1,SPIKES);}return;}
  const post=(av===P.gw&&(u===d.um0-1||u===d.um1+1))||(av===P.gw+1&&u<=-4&&u>d.um1+1&&(u-d.um1-6)%8===0);
  if(post){for(let y=Fy;y<Fy+k;y++)S(y,BASPILLAR);S(Fy+k,BRAZIER);return;}
  if(av===P.gw&&u>=d.um0-1&&u<=d.um1+1){S(Fy,OBSBRICK);return;} // the bridge's parapets
  const ob=Math.max(Math.abs(u-(d.um1+2)),Math.abs(av-(P.tz-3)));
  if(ob<=(k>1?1:0)){for(let y=Fy;y<Fy+6*k;y++)S(y,y-Fy===3*k?EMGLYPH:y===Fy+6*k-1?OBSBRICK:fortStone(X,y,Z));if(ob===0){for(let y=Fy+6*k;y<Fy+8*k+4;y++)S(y,OBSID);}return;}
  const sf=d.us-u,sa=av-d.vs,aa=Math.abs(sa);
  if(Math.abs(sf)<=d.sw+2&&aa<=d.sw+2){
    if(Math.abs(sf)<=d.sw&&aa<=d.sw){const ring=Math.abs(sf)===d.sw||aa===d.sw;for(let y=Fy;y<Fy+d.ph;y++)S(y,y===Fy+d.ph-1?OBSBRICK:ring&&y===Fy+d.ph-2&&d.ph>=3?EMGLYPH:fortStone(X,y,Z));
      if(Math.abs(sf)===d.sw&&aa===d.sw)S(Fy+d.ph,SKULLS);}
    for(let t=0;t<=13*k;t++){const id=fortStatue(sf,aa,t,k,X,Fy+d.ph+t,Z);if(id)S(Fy+d.ph+t,id);}
    return;}
  if(!lava&&h<0.012)S(Fy,h<0.004?SKULLS:BONES);
}
// The front of the fortress: a wall up the mountain's foot, its gate a pointed arch in three rings (obsidian, fire, carving) with
// fangs at its mouth and a portcullis drawn up into it, and the wall above it the face of a demon: a heavy V of brow over slanted
// burning eyes, a ridge of nose from the keystone, a jaw round the arch and horns rising over the battlements. A line of burning
// script runs across the wall at the gate's springing; the battlements carry spikes, and a peak at the middle.
function fortFacade(F,d,X,Z,u,v,av){const P=F.P,k=P.k,Fy=F.Fy,S=(y,id)=>PW(X,y,Z,id,MODE_SET),apex=Fy+P.gh,yb=a=>3*k+Math.round(0.55*a),ring=0.45+3*d.kr;
  const topY=Fy+P.fh+Math.max(0,Math.round((d.pw-av)*0.6)),rel=(av,dy,dA,ad,y)=>dy<=2*k+2||y>=topY-1||ad<=ring+1.5||(av<=7*k+2&&dA>=-2&&dA<=yb(av)+k+1)||(dy>=d.sG-1&&dy<=d.sG+k)?'':fortPanel(k,av,dy-2*k-2);
  if(u>=0&&u<=2&&av<=P.fw){
    for(let y=Fy-1;y<=topY;y++){const dy=y-Fy,ad=archD(av,dy,P.gw,d.sG,d.rG);let id;
      if(dy>=0&&ad<=0.45){const tl=av>=P.gw?0:av%3===1?2*k:av%3===2?k:0;id=u===0&&dy>d.sG&&ad>=-tl?OBSID:u===1&&ad>-3*k?GRATE:AIR;}
      else if(dy>=0&&ad<=ring){const ri=Math.min(2,Math.floor((ad-0.45)/d.kr));id=u===0&&ri===0?AIR:[OBSBRICK,EMBRICK,BASCARVE][ri];}
      else{const dA=y-apex;
        if(u===0&&av>=Math.ceil(1.5*k)&&av<=Math.floor(5.5*k)&&dA>=yb(av)-1-k+(av>4.5*k?1:0)&&dA<=yb(av)-1)id=MAGMA; // the eyes
        else if(u===0&&dy>=d.sG&&dy<d.sG+k)id=EMGLYPH;
        else if(y===topY)id=topY>Fy+P.fh?OBSBRICK:fortStone(X,y,Z);
        else if(u===0&&y===Fy+P.fh-1&&av>d.pw)id=BASCARVE;
        else if(u===0&&rel(av,dy,dA,ad,y)==='R')id=AIR;
        else id=fortStone(X,y,Z);}
      S(y,id);}
    if(u===0){if(topY===Fy+P.fh){if(av%3!==0){for(let y=topY+1;y<=topY+k;y++)S(y,fortStone(X,y,Z));if(av%3===1)S(topY+k+1,SPIKES);}}else if(av%2===0)S(topY+1,SPIKES);
      if(av<=(k>1?1:0))for(let y=topY+1;y<=topY+2*k;y++)S(y,OBSID);}}
  if(u<0&&av<=P.fw)for(let y=Fy-1;y<=topY;y++){const dy=y-Fy,dA=y-apex,ad=archD(av,dy,P.gw,d.sG,d.rG);let id=0;
    if(u>=-(k>1?2:1)&&av<=7*k&&dA>=yb(av)&&dA<yb(av)+k)id=OBSBRICK; // the brow
    else if(u===-1&&av<=Math.max(0,k-2)&&dA>=1&&dA<yb(0))id=OBSBRICK; // the nose
    else if(u===-1&&dy>=d.sG&&ad>ring&&ad<=ring+1)id=OBSBRICK; // the jaw
    else if(u===-1&&dy<=2*k+1&&(dy<0||ad>ring))id=dy===2*k+1?OBSBRICK:fortStone(X,y,Z); // the wall's foot
    else if(u===-1){const r=rel(av,dy,dA,ad,y);if(r==='L')id=OBSBRICK;else if(r==='P')id=fortStone(X,y,Z);} // ledges and piers
    if(id)S(y,id);}
  // the horns: tubes along a curve from the ends of the brow, out, up and in at the tips
  if(av>=4*k-2&&av<=7*k+2){const hb=yb(5*k),HP=[[5*k,hb+k-1],[6.2*k,hb+3.5*k],[6.2*k,hb+6.5*k],[5.6*k,hb+9*k]],du=u-(k>1?-1:0);
    for(let y=apex+hb-2*k;y<=apex+hb+10*k;y++){const dA=y-apex;let best=99,bt=0;
      for(let i=0;i<3;i++){const [a0,b0]=HP[i],[a1,b1]=HP[i+1],ex=a1-a0,ey=b1-b0,t=Math.max(0,Math.min(1,((av-a0)*ex+(dA-b0)*ey)/(ex*ex+ey*ey))),dd=Math.hypot(av-a0-t*ex,dA-b0-t*ey);if(dd<best){best=dd;bt=(i+t)/3;}}
      if(Math.hypot(best,du)<=(1.2*k+0.4)*(1-bt)+0.4)S(y,OBSID);}}
}
// A gate tower (a across and b along from its middle): a battered foot capped in obsidian, fluted corners, bands of fire, slits lit
// from within, a carved frieze, machicolations on corbels, battlements with spikes, horns sweeping out from its corners, a pool
// of fire on its roof, and banners hung down its outer face
function fortTower(F,d,X,Z,a,b){const P=F.P,k=P.k,Fy=F.Fy,ts=P.ts,th=P.th,aa=Math.abs(a),ab=Math.abs(b),m=Math.max(aa,ab),S=(y,id)=>PW(X,y,Z,id,MODE_SET),band=Math.round(th/3);
  if(m<=ts+1){
    for(let hy=-1;hy<=th;hy++){const half=hy<=ts||hy>=th-3?ts+1:ts;if(m>half||(hy===th-3&&m===ts+1&&(aa+ab)%2===1))continue;
      const y=Fy+hy,ring=m===half,mid=aa===0||ab===0,slit=hy>=ts+3&&hy<=th-8&&(hy-ts-3)%9<2*k;let id;
      if(hy===th&&m<=ts-2)id=LAVA;
      else if(ring&&mid&&slit&&half===ts)id=AIR;
      else if(m===ts-1&&mid&&slit&&half===ts)id=MAGMA;
      else if(ring&&half===ts&&!mid&&aa!==ab&&((aa===half?ab:aa)&1)&&hy>=ts+2&&hy<=th-5&&hy%band!==band-1)id=AIR; // grooves down the faces
      else if(ring&&aa===half&&ab===half)id=BASPILLAR;
      else if(ring&&(hy===ts||hy===th-2))id=OBSBRICK;
      else if(ring&&hy===th-4)id=BASCARVE;
      else if(ring&&hy%band===band-1)id=EMBRICK;
      else id=fortStone(X,y,Z);
      S(y,id);}
    if(m===ts+1){for(let hy=th+1;hy<=th+1+k;hy++)if(hy===th+1||(aa+ab)%3!==0)S(Fy+hy,fortStone(X,Fy+hy,Z));if((aa+ab)%3!==0&&(aa+ab)%2===0)S(Fy+th+2+k,SPIKES);}
    else if(m===ts-1)S(Fy+th+1,OBSBRICK);
    if(b===-ts-1&&aa<=(k>1?1:0))for(let hy=th-4-4*k;hy<=th-4;hy++)S(Fy+hy,BANNER);}
  const ca=aa-ts-1,cb=ab-ts-1;
  if(ca>=0&&cb>=0)for(let hh=0;hh<=d.HH;hh++){const o=Math.round(d.mo*Math.sin(hh/d.HH*Math.PI/2)),w=hh<d.HH/2&&k>1?1:0;if(Math.abs(ca-o)<=w&&Math.abs(cb-o)<=w)S(Fy+th+1+hh,OBSID);}
}
// The way in: a pointed vault on ribs of fire every few blocks, standing on pillars against the walls with fire baskets before
// them; niches with skulls between the ribs under lintels of burning script; fire hung on chains in every other bay; a runner of
// obsidian down the floor with burning lines across it; troughs of lava with bridges; and an inner portcullis drawn up
function fortWay(F,d,X,Z,u,v,av){const P=F.P,k=P.k,fl=fortFloor(F,u),S=(y,id)=>PW(X,y,Z,id,MODE_SET),c=(u-3)%d.rs,mb=d.rs>>1,bay=c===mb||(k>1&&Math.abs(c-mb)===1),rib=c===0||(k>1&&c===1),lava=fortLavaUV(F,u,v);
  for(let y=fl-3;y<fl-1;y++)S(y,BASBRICK);
  S(fl-1,lava?LAVA:av<=P.bw?(u%4===0?EMBRICK:OBSBRICK):av===P.bw+1?OBSBRICK:u%6===0?OBSID:BASTILE);
  for(let y=fl;y<=fl+P.ch+2;y++){const dy=y-fl,ad=archD(av,dy,P.cw,d.sC,d.rC);let id;
    if(ad<=0.45){id=AIR;
      if(u===F.U1-3&&dy>=P.ch-2*k)id=GRATE;
      else if(rib&&ad>0.45-d.rt)id=dy>d.sC?EMBRICK:BASPILLAR;
      else if(rib&&av===P.cw-d.rt&&!lava&&dy<=k+1)id=dy===k+1?BRAZIER:OBSBRICK;
      else if(c===mb&&av===0&&((u-3)/d.rs|0)%2===0&&dy>d.sC)id=dy===d.sC+1?BRAZIER:CHAIN;
      else if(av===P.cw&&!rib&&(dy===d.sC||dy===0))id=OBSBRICK;}
    else if(ad<=1.45&&!rib&&av>(k>1?1:0)&&fortCoffer(av,dy,d.sC,d.RC,d.cC,u-3,mb,k))id=AIR;
    else if(ad<=2.45&&!rib&&av>(k>1?1:0)&&fortCofferMid(av,dy,d.sC,d.RC,d.cC,u-3,mb,k))id=fortCofferMid(av,dy,d.sC,d.RC,d.cC,u-3,mb,k);
    else if(bay&&av===P.cw+1&&dy>=1&&dy<=2*k+1)id=AIR;
    else if(bay&&av===P.cw+1&&dy===0)id=OBSBRICK;
    else if(bay&&av===P.cw+1&&dy===2*k+2)id=EMGLYPH;
    else if(bay&&av===P.cw+2&&dy<=2*k+2)id=OBSBRICK;
    else if(!bay&&!rib&&av===P.cw+1&&dy>=2&&dy<d.sC&&dy%3===1)id=AIR;
    else id=fortStone(X,y,Z);
    S(y,id);}
  if(c===mb&&av===P.cw+1)S(fl+1,SKULLS);
}
// The throne hall: a tall pointed vault down the nave and lower ones over the aisles, ribs of fire over them; compound pillars
// with obsidian bases, carved capitals and a ring of burning script, joined by pointed arcades; cages of fire hung on chains in
// every bay; rivers of fire either side of a burning runner, kerbed and bridged; guardians in the aisles (where they are wide) and
// banners; the dais, its steps written in fire, the throne and the hoard; and in the back wall the lord's sign between columns
// of lava behind grates. The front wall's door is framed in burning script.
function fortHall(F,d,X,Z,u,v,av,h){const P=F.P,k=P.k,Fh=F.Fh,top=d.top,pu=u-F.U1,pd=d.E-u,S=(y,id)=>PW(X,y,Z,id,MODE_SET);
  S(Fh-3,BASBRICK);S(Fh-2,BASBRICK);
  const vis=(a,dy)=>Math.abs(a-P.pv)>P.ps&&(a<P.pv-P.ps?archD(a,dy,d.nw,d.sN,d.rN):archD(Math.abs(a-d.vc),dy,d.wa,d.sA,d.rA))<=-0.55; // a cell of wall that the hall's open space faces
  if(av>P.hw||pu<=1||pd<=1){const q=((pu-4-P.ps)%P.pg+P.pg)%P.pg,side=av>P.hw&&pu>=2&&pd>=2;
    for(let y=Fh-1;y<=top+1;y++){const dy=y-Fh;let id=dy%6===5&&av===P.hw+1?EMBRICK:fortStone(X,y,Z);
      if(side&&av<=P.hw+2&&dy>=1&&archD(Math.abs(q-P.pg/2),dy-1,d.hbw,d.sb-1,d.sA-1-d.sb)<=0.45)id=av===P.hw+1?(dy===1&&Math.abs(q-P.pg/2)<0.6?BRAZIER:AIR):dy===d.sb?EMGLYPH:BASCARVE; // a blind arch in every bay, a fire in its foot
      else if(pu<=1&&av<=P.cw+3){const ad=archD(av,dy,P.cw,d.sC,d.rC);if(dy>=0&&ad<=0.45)id=AIR;else if(pu===1&&dy>=0&&ad<=1.45)id=EMGLYPH;else if(pu===1&&dy>=0&&ad<=2.45)id=OBSBRICK;}
      else if(pu===1&&av<=P.hw&&dy>=1&&vis(av,dy)&&fortPanel(k,av-P.cw-4,dy-1)==='R')id=AIR; // lancets in the front wall
      else if(pd>=0&&pd<=1&&av<=P.hw){
        const bd=dy>=P.steps?archD(av,dy-P.steps,d.wB,d.sB,d.rB):9,inN=archD(av,dy,d.nw,d.sN,d.rN)<=-1,rec=bd<=0.45&&inN;
        if(fortLava(F,u,v,y))id=LAVA;
        else if(pd===1&&av>=P.lv&&av<P.lv+k&&dy>=0&&dy<=d.lfH)id=GRATE;
        else if(pd===1&&rec)id=AIR; // a deep arch behind the throne
        else if(pd===1&&bd<=1.45&&inN)id=OBSBRICK;
        else if(pd===1&&av>P.lv+k&&dy>=(av<=P.dw?P.steps+1:1)&&vis(av,dy)&&fortPanel(k,av-P.lv-k-1,dy-1)==='R')id=AIR; // lancets beside it
        else if(pd===(rec?0:1)){const sg=fortSigil(d,av,y-d.yc);if(sg)id=sg;}}
      S(y,id);}
    return;}
  const sv=av-P.pv,inBand=Math.abs(sv)<=P.ps,nave=av<P.pv-P.ps,n=Math.max(0,Math.min(d.np-1,Math.round((pu-4-P.ps)/P.pg))),du=pu-(4+P.ps+n*P.pg),hasP=d.np>0&&Math.abs(du)<=P.ps;
  const nb=Math.floor((pu-4-P.ps)/P.pg),inBay=nb>=0&&nb<d.np-1,bcf=4+P.ps+nb*P.pg+P.pg/2,bci=Math.floor(bcf),rib=d.np>0&&Math.abs(du)<=(k>1?1:0);
  const curb=(av===P.lv-1||av===P.lv+k)&&pu>=4&&pu<=F.Lh-P.steps-6&&!fortBridge(F,pu),onDais=pd<=d.dz&&av<=P.dw,st=onDais?Math.min(P.steps,d.dz+1-pd):0;
  S(Fh-1,fortLavaUV(F,u,v)?LAVA:inBand?OBSBRICK:av<=k?((pu+av)%4===0?EMBRICK:OBSID):av===k+1||curb?OBSBRICK:(pu-4-P.ps)%P.pg===0?OBSBRICK:h<0.06?BASCRACK:BASTILE);
  for(let y=Fh;y<=top+1;y++){const dy=y-Fh;let id;
    if(dy<st){S(y,av===P.dw?OBSBRICK:dy===st-1?(st===P.steps?OBSBRICK:EMGLYPH):fortStone(X,y,Z));continue;}
    if(onDais){const t=fortThrone(P,d,pd,av,dy-st,X,Z);if(t){S(y,t);continue;}}
    let open,ad=9;
    if(inBand){
      if(hasP&&dy<=d.sN){const ap=Math.abs(du),aq=Math.abs(sv),cap=dy<=k||(dy>=d.sA-k&&dy<=d.sA),core=ap<=P.ps-1&&aq<=P.ps-1,sh=(ap===P.ps&&aq<=Math.min(1,P.ps-1))||(aq===P.ps&&ap<=Math.min(1,P.ps-1));
        if(cap||core||sh){S(y,dy<k?fortStone(X,y,Z):dy===k||dy===d.sA?OBSBRICK:dy>d.sA-k&&dy<d.sA?BASCARVE:sh?(dy===Math.round(d.sA/2)?EMGLYPH:BASPILLAR):fortStone(X,y,Z));continue;}
        open=dy<d.sA;}
      else open=inBay&&archD(Math.abs(pu-bcf),dy,d.hb,d.sA,d.sN-d.sA)<=0.45;}
    else{ad=nave?archD(av,dy,d.nw,d.sN,d.rN):archD(Math.abs(av-d.vc),dy,d.wa,d.sA,d.rA);open=ad<=0.45;
      if(!open&&ad<=2.45&&!rib&&(!nave||av>(k>1?2:1))){const pal=Math.floor(P.pg/2),al=pu-4-P.ps,cf=nave?[av,dy,d.sN,d.RN,d.cN,al,pal,k]:[Math.abs(av-d.vc),dy,d.sA,d.RA,d.cA,al,pal,k];
        if(ad<=1.45&&fortCoffer(...cf)){S(y,AIR);continue;}if(ad>1.45){const cm=fortCofferMid(...cf);if(cm){S(y,cm);continue;}}}}
    if(!open){S(y,fortStone(X,y,Z));continue;}
    id=AIR;
    if(rib&&!inBand&&ad>0.45-d.rt)id=(nave?dy>d.sN:dy>d.sA)?EMBRICK:BASPILLAR;
    else if(nave&&av<=(k>1?1:0)&&ad>-0.55)id=OBSBRICK;
    else if(dy===0&&curb)id=OBSBRICK;
    else if(!rib&&((nave&&av===d.nw&&dy>=d.sN-(k>1?1:0)&&dy<=d.sN)||(!nave&&!inBand&&(av===P.hw||av===P.pv+P.ps+1)&&dy===d.sA)||(!nave&&!inBand&&av===P.hw&&dy===0)))id=OBSBRICK; // cornices at the springings, a base along the walls
    else if(d.np>0&&du===0&&dy<=k&&((nave&&av===d.nw-d.rt&&av>P.lv+k)||(!nave&&!inBand&&av===P.hw-d.rt)))id=dy===k?BRAZIER:OBSBRICK; // fire baskets before the pillars and the wall's
    else if(inBay&&pu===bci&&((nave&&av===d.nw&&dy===d.sN+1)||(!nave&&!inBand&&av===P.hw&&dy===d.sA+1)))id=BRAZIER; // fire baskets on the cornices
    else if(nave&&inBay&&Math.abs(av-d.hc)<=(k>1?1:0)&&Math.abs(pu-bci)<=(k>1?1:0)&&dy>=d.dc-1){const ce=av===d.hc&&pu===bci; // a cage of fire on a chain
      id=dy===d.dc-1?(k>1||ce?GRATE:AIR):dy===d.dc?(ce?BRAZIER:GRATE):ce?CHAIN:AIR;}
    else if(!nave&&!inBand&&inBay&&d.statues&&nb%2===0&&Math.abs(pu-bci)<=3&&Math.abs(av-(P.hw-3))<=3){const sf=P.hw-3-av,sa=Math.abs(pu-bci);
      id=dy<2?(dy===1?OBSBRICK:fortStone(X,y,Z)):fortStatue(sf,sa,dy-2,1,X,y,Z)||AIR;}
    else if(!nave&&!inBand&&inBay&&(!d.statues||nb%2===1)&&av===P.hw&&Math.abs(pu-bci)<=(k>1?1:0)&&dy>=d.sA-3*k&&dy<d.sA)id=BANNER;
    else if(dy===0&&!onDais&&av>k+1&&!(av>=P.lv&&av<P.lv+k)&&h<0.02)id=h<0.007?SKULLS:BONES;
    S(y,id);}
}
function fortBuild(F){
  const P=F.P,d=fortD(F),U1=F.U1,E=d.E,span=Math.max(P.hw+3,P.fw+1,P.tz,P.tv+P.ts+1+d.mo);
  for(let lz=0;lz<CS;lz++)for(let lx=0;lx<CS;lx++){const X=gx0+lx,Z=gz0+lz,[u,v]=fortUV(F,X,Z),av=Math.abs(v),h=hsh(X,9175,Z);
    if(u<-P.td-8||u>E+1||av>span)continue;
    if(u<-P.td)fortStairs(F,X,Z,u,av);else if(u<0&&av<=P.tz)fortTerrace(F,d,X,Z,u,v,av,h);
    if(u>=-2*P.k-1&&u<=2*P.k+2&&av<=P.fw+1)fortFacade(F,d,X,Z,u,v,av);
    {const a=av-P.tv,b=u+P.ts,R=P.ts+1+d.mo;if(Math.abs(a)<=R&&Math.abs(b)<=R)fortTower(F,d,X,Z,a,b);}
    if(u>=3&&u<U1&&av<=P.cw+2)fortWay(F,d,X,Z,u,v,av);
    if(u>=U1&&av<=P.hw+3)fortHall(F,d,X,Z,u,v,av,h);
  }
}
function applyFortresses(WCX,WCZ){const X=WCX*CS+8,Z=WCZ*CS+8;for(const F of fortsNear(X,Z,12))fortBuild(F);}
