// ---- Fortresses in the volcanoes (D-052, D-054). The owner asked for balrogs; the name is Tolkien's, so ours are the Emberlords,
// towering demons of fire and shadow. Each stretch of the wastes has one great volcano (volcanic.js), and in it the Ember Throne:
// an Emberlord's fortress built to its lord's size, with a gate between two great towers at the mountain's foot, a broad way in
// through the rock past troughs of lava, and under the summit a vast throne hall with pillars, rivers of lava in the floor, a dais,
// the throne and the hoard. The lesser volcanoes hold warholds of the orcs on the same plan at a smaller size. A fortress faces
// the quarter of its mountain farthest from the flows. It is built per chunk from the volcano's plan, and every block of its lava
// lies in a trough it lays itself (rock under and on every side), so it is always held.
// The sizes: gate half-width and height; the way in's half-width and height; the hall's half-width, depths and heights; the
// towers (|v| of their middle, half-size, height); the facade (half-width, height); the terrace (half-width, depth); pillars
// (|v|, half-size, spacing); lava rivers (|v|); the dais (half-width, steps); k, the throne's size; bw, the bridges' half-width.
const FORT_P={
  hold:{gw:3,gh:10,cw:3,ch:9,hw:14,Lhs:[26,22],Hmin:14,Hmax:18,tv:11,ts:2,th:22,fw:14,fh:18,tz:12,td:12,pv:9,ps:1,pg:6,lv:5,dw:7,steps:3,k:1,bw:1},
  throne:{gw:8,gh:22,cw:9,ch:24,hw:32,Lhs:[60,50,42],Hmin:28,Hmax:36,tv:24,ts:4,th:46,fw:30,fh:40,tz:28,td:24,pv:20,ps:2,pg:10,lv:11,dw:16,steps:5,k:2,bw:3},
  // a narrower throne hall for the smaller great volcanoes
  throneS:{gw:8,gh:22,cw:9,ch:24,hw:22,Lhs:[44,36],Hmin:26,Hmax:32,tv:20,ts:4,th:40,fw:26,fh:36,tz:24,td:20,pv:14,ps:2,pg:9,lv:8,dw:12,steps:5,k:2,bw:3}};
const FORT_C=new Map();
// The fortress of volcano v, or null. Local frame: u runs in from the gate's outer face, v across.
function fortOf(v){
  const key=v.key||v.i+','+v.j;if(FORT_C.has(key))return FORT_C.get(key);let F=null;
  for(const P of v.great?[FORT_P.throne,FORT_P.throneS]:v.Hv>=34&&hsh(v.i,9171,v.j)<0.85?[FORT_P.hold]:[]){if(F)break;
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
          const r=rngAt(v.i,9173,v.j),lord=fullName('fiend',r,false),E=U1+Lh,xs=[GX+ox*(P.td+8),GX-ox*(E+1)],zs=[GZ+oz*(P.td+8),GZ-oz*(E+1)],wd=Math.max(P.hw+2,P.fw,P.tz,P.tv+P.ts)+1;
          for(const w of [-wd,wd]){xs.push(GX+px*w);zs.push(GZ+pz*w);}
          F={v:v,P:P,great:!!v.great,GX:GX,GZ:GZ,Fy:Fy,Fh:Fh,Dd:Dd,ox:ox,oz:oz,px:px,pz:pz,U1:U1,Lh:Lh,Hh:Hh,lord:lord,id:'f'+key,
            name:v.great?'The Ember Throne of '+lord:'The Warhold of '+v.name,box:[Math.min(...xs)-1,Math.max(...xs)+1,Math.min(...zs)-1,Math.max(...zs)+1,Fh-8,Fy+Math.max(P.th,P.fh)+4],seed:Math.floor(r()*1e6)};break;}
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
// Is (u,v) a lava cell of the fortress (one under the floor there)? Troughs across the way in where it is level (a bridge over
// each), and rivers down the throne hall either side of the middle.
function fortLavaUV(F,u,v){const P=F.P,U1=F.U1,ut=U1-6,av=Math.abs(v);
  if(av<=P.cw&&av>P.bw&&u<U1){if(ut-4>=2*F.Dd+2&&u>=ut&&u<=ut+2)return true;const um=Math.floor((ut+2*F.Dd+6)/2);if(ut-um>=12&&u>=um&&u<=um+2)return true;}
  return av>=P.lv&&av<P.lv+P.k&&u>=U1+4&&u<=U1+F.Lh-P.steps-6;}
function fortLavaAt(X,Y,Z){for(const F of fortsNear(X,Z,0)){const [u,v]=fortUV(F,X,Z);if(Y===fortFloor(F,u)-1&&fortLavaUV(F,u,v))return true;}return false;}
// the name of the fortress at (X,y,Z), or null
function fortName(X,y,Z){for(const F of fortsNear(X,Z,0)){if(y<F.box[4]||y>F.box[5])continue;const [u,v]=fortUV(F,X,Z),P=F.P;if(u>=-P.td-1&&u<=F.U1+F.Lh&&Math.abs(v)<=Math.max(P.hw+2,P.tz,P.fw))return F.name;}return null;}
// where the lord waits and the guards stand (world coordinates, y the floor), and how far the lord will go from its throne
function fortSpots(F){const P=F.P,at=(u,v)=>({x:F.GX-F.ox*u+F.px*v+0.5,y:fortFloor(F,u),z:F.GZ-F.oz*u+F.pz*v+0.5}),lu=F.U1+F.Lh-P.steps-3-6*P.k;
  return {lord:at(lu,0),hall:at(F.U1+F.Lh/2,0),reach:lu+P.td+6,
    guards:[at(-6,-P.gw-1),at(-6,P.gw+1),at(-9,0),at(5,0),at(F.U1-2,2)],hallGuards:[at(lu-4,-P.pv+3),at(lu-4,P.pv-3),at(F.U1+4,0)]};}
// ---- building, per chunk
function fortBuild(F){
  const {Fy,Fh,U1,Hh,Lh,P}=F,top=Fh+Hh,E=U1+Lh,k=P.k,S=(X,y,Z,id)=>PW(X,y,Z,id,MODE_SET),wall=P.cw+1,dz=P.steps+3,tw=P.tv+P.ts,span=Math.max(P.hw+2,P.fw,P.tz,tw);
  for(let lz=0;lz<CS;lz++)for(let lx=0;lx<CS;lx++){const X=gx0+lx,Z=gz0+lz,[u,v]=fortUV(F,X,Z),av=Math.abs(v),h=hsh(X,9175,Z);
    if(u<-P.td-8||u>E||av>span)continue;
    // the terrace before the gate, with steps down from its outer edge
    if(u>=-P.td&&u<=-1&&av<=P.tz){const edge=u===-P.td||av===P.tz,gap=u===-P.td&&av<P.gw;
      for(let y=Fy-8;y<Fy-1;y++)S(X,y,Z,BASALT);S(X,Fy-1,Z,(u+v)%4===0?OBSID:BASBRICK);for(let y=Fy;y<=Fy+P.gh+6;y++)S(X,y,Z,AIR);
      if(edge&&!gap){S(X,Fy,Z,BASBRICK);if((u+v)%2===0)S(X,Fy+1,Z,BASBRICK);}}
    if(u<-P.td&&u>=-P.td-8&&av<P.gw){const y=Fy-1-(-P.td-u);for(let q=y-4;q<=y;q++)S(X,q,Z,BASBRICK);for(let q=y+1;q<=Fy+4;q++)S(X,q,Z,AIR);}
    // the gate towers
    if(av>=P.tv-P.ts&&av<=tw&&u>=-2*P.ts&&u<=0){const ring=av===P.tv-P.ts||av===tw||u===-2*P.ts||u===0,band=Math.round(P.th/3);
      for(let y=Fy-1;y<=Fy+P.th;y++)S(X,y,Z,ring&&(y-Fy)%band===band-1?EMBRICK:BASBRICK);
      if(ring&&(u+v)%2===0)S(X,Fy+P.th+1,Z,BASBRICK);if(av===P.tv&&u===-P.ts){S(X,Fy+P.th+1,Z,MAGMA);if(k>1)S(X,Fy+P.th+2,Z,MAGMA);}}
    // the facade: a wall up the mountain's foot with the gate in it, a raised portcullis, and glowing eyes above
    if(u>=0&&u<=2&&av<=P.fw&&!(av>=P.tv-P.ts&&av<=tw&&u===0)){const eye=u===0&&av>=Math.round(P.gw/2)&&av<Math.round(P.gw/2)+k;
      for(let y=Fy-1;y<=Fy+P.fh;y++){const gate=av<=P.gw&&y>=Fy&&y<Fy+P.gh;S(X,y,Z,gate?(u===1&&y>=Fy+P.gh-3*k?GRATE:AIR):y===Fy+P.gh+2*k?EMBRICK:(eye&&y>=Fy+P.gh+4*k&&y<Fy+P.gh+5*k)?MAGMA:BASBRICK);}
      if(v%2===0&&u===0)S(X,Fy+P.fh+1,Z,BASBRICK);}
    // the way in: walls, a floor stepping down, a ceiling, a line of fire in the walls, troughs of lava with bridges, braziers
    if(u>=3&&u<U1&&av<=wall){const fl=fortFloor(F,u);for(let y=fl-3;y<fl-1;y++)S(X,y,Z,BASBRICK);
      if(av===wall){for(let y=fl-1;y<=fl+P.ch;y++)S(X,y,Z,y===fl+Math.round(P.ch*0.6)?EMBRICK:BASBRICK);}
      else{S(X,fl-1,Z,fortLavaUV(F,u,v)?LAVA:(u%6===0?OBSID:BASBRICK));for(let y=fl;y<fl+P.ch;y++)S(X,y,Z,AIR);S(X,fl+P.ch,Z,BASBRICK);S(X,fl+P.ch+1,Z,BASBRICK);
        if(av===P.cw&&u%7===5){S(X,fl,Z,MAGMA);if(k>1)S(X,fl+1,Z,MAGMA);}}}
    // the throne hall
    if(u>=U1&&u<=E&&av<=P.hw+2){const isWall=av>P.hw||u<=U1+1||u>=E-1,door=u<=U1+1&&av<=P.cw;
      if(isWall&&!door){for(let y=Fh-3;y<=top+1;y++)S(X,y,Z,(y-Fh)%6===5?EMBRICK:BASBRICK);continue;}
      S(X,Fh-3,Z,BASBRICK);S(X,Fh-2,Z,BASBRICK);
      if(door){S(X,Fh-1,Z,BASBRICK);for(let y=Fh;y<Fh+P.ch;y++)S(X,y,Z,AIR);for(let y=Fh+P.ch;y<=top+1;y++)S(X,y,Z,BASBRICK);continue;}
      S(X,Fh-1,Z,fortLavaUV(F,u,v)?LAVA:(av<=2*k||(u-U1)%6===0)?OBSID:BASBRICK);
      for(let y=Fh;y<top;y++)S(X,y,Z,AIR);S(X,top,Z,(u-U1)%6===0?EMBRICK:BASBRICK);S(X,top+1,Z,BASBRICK);
      // pillars in two rows
      const pu=u-U1,pd=E-u;if(av>=P.pv-P.ps&&av<=P.pv+P.ps&&pu>=4&&pd>=dz+2&&(pu-4)%P.pg<=2*P.ps){for(let y=Fh;y<top;y++)S(X,y,Z,(y-Fh)%Math.max(4,Math.round(Hh/4))===3?EMBRICK:BASBRICK);continue;}
      // the dais at the far end, stepping up to the throne; braziers at its corners, the hoard behind
      if(pd>=2&&pd<=dz&&av<=P.dw){const st=Math.min(P.steps,dz+1-pd);for(let y=Fh;y<Fh+st;y++)S(X,y,Z,y===Fh+st-1?OBSID:BASBRICK);const fl=Fh+st;
        if(pd===dz-1&&av===P.dw-1){for(let y=fl;y<fl+2*k;y++)S(X,y,Z,BASBRICK);S(X,fl+2*k,Z,MAGMA);}
        if(pd===3&&av<k)for(let y=fl;y<fl+k;y++)S(X,y,Z,OBSID); // the seat
        if(pd===3&&av===k)for(let y=fl;y<fl+2*k;y++)S(X,y,Z,EMBRICK); // the arms
        if(pd===2&&av<=k)for(let y=fl;y<=fl+5*k;y++)S(X,y,Z,y>=fl+5*k-(k-1)?EMBRICK:OBSID); // the back
        if(pd===2&&av>k&&av<P.dw-1){const q=(av+(v>0?0:5))%5;S(X,fl,Z,q===0?DWCHEST:q===1?GOLDB:q===2?CRATE:q===3?GOLDB:SKULLS);if(k>1&&q===1)S(X,fl+1,Z,GOLDB);}
        continue;}
      // banners on the side walls, bones and skulls about the floor
      if(av===P.hw&&pu%5===2){for(let y=Fh;y<Fh+2*k;y++)S(X,y,Z,BANNER);}
      else if(h<0.025&&!fortLavaUV(F,u,v))S(X,Fh,Z,h<0.008?SKULLS:BONES);}
  }
}
function applyFortresses(WCX,WCZ){const X=WCX*CS+8,Z=WCZ*CS+8;for(const F of fortsNear(X,Z,12))fortBuild(F);}
