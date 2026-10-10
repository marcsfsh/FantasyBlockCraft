// ---- The Emberlords' fortresses (D-052). The owner asked for balrogs; the name is Tolkien's, so ours are the Emberlords, great
// demons of fire and shadow. Some of the great volcanoes hold one in a fortress cut into the mountain: a terrace and a gate
// between two towers at the foot of the cone, a hall in through the rock over a trough of lava, and under the summit the throne
// hall with its pillars, rivers of lava in the floor, a dais, the throne and the hoard. Its lord waits there; orcs keep the gate.
// The fortress faces the quarter of the mountain farthest from its flows. It is built per chunk from the volcano's plan, and
// every block of its lava lies in a trough it lays itself (rock under and on every side), so it is always held.
const FORT_C=new Map();
// The fortress of volcano v, or null. Local frame: u runs in from the gate's outer face, v across (the gate is v -3 to 3).
function fortOf(v){
  const key=v.i*65536+v.j;if(FORT_C.has(key))return FORT_C.get(key);let F=null;
  if(v.Hv>=34&&hsh(v.i,9171,v.j)<0.85){
    let best=null;for(let q=0;q<4;q++){const th=q*Math.PI/2;let m=9;for(const f of v.fl)m=Math.min(m,Math.abs(angDiffV(th,f.a)));for(const a of v.old)m=Math.min(m,Math.abs(angDiffV(th,a))*1.5);if(!best||m>best.m)best={th:th,m:m};}
    const ox=Math.round(Math.cos(best.th)),oz=Math.round(Math.sin(best.th)),px=-oz,pz=ox; // outward from the mountain's heart, and across
    let dg=-1;for(let d=Math.round(v.R*1.05);d>v.R*0.35;d--)if(hAt(v.X+ox*d,v.Z+oz*d)>=v.base+6){dg=d;break;}
    if(dg>0){const GX=v.X+ox*dg,GZ=v.Z+oz*dg,Fy=hAt(GX,GZ);
      // the throne hall (Lh deep, 33 across) lies under the summit, its far end just past the mountain's heart, under the
      // crater's floor; the way in steps down (one block in two) if it must, so five blocks of rock at least lie over the hall
      for(const Lh of [26,22]){const U1=Math.round(dg+4-Lh);if(U1<10)continue;let cov=1e9;
        for(let u=U1;u<=U1+Lh;u+=3)for(let w=-16;w<=16;w+=4)cov=Math.min(cov,hAt(GX-ox*u+px*w,GZ-oz*u+pz*w));
        for(let Dd=0;Dd<=Math.min(16,Math.floor((U1-8)/2));Dd+=2){const Fh=Fy-Dd,Hh=Math.min(18,cov-Fh-6);if(Hh<14)continue;
          const r=rngAt(v.i,9173,v.j),lord=fullName('fiend',r,false),xs=[GX+ox*20,GX-ox*(U1+Lh+1)],zs=[GZ+oz*20,GZ-oz*(U1+Lh+1)];for(const w of [-17,17]){xs.push(GX+px*w);zs.push(GZ+pz*w);}
          F={v:v,GX:GX,GZ:GZ,Fy:Fy,Fh:Fh,Dd:Dd,ox:ox,oz:oz,px:px,pz:pz,U1:U1,Lh:Lh,Hh:Hh,lord:lord,name:'The Ember Throne of '+lord,
            box:[Math.min(...xs)-1,Math.max(...xs)+1,Math.min(...zs)-1,Math.max(...zs)+1,Fh-8,Fy+26],seed:Math.floor(r()*1e6)};break;}
        if(F)break;}}}
  FORT_C.set(key,F);return F;
}
// the fortresses whose works reach within m of (X,Z)
function fortsNear(X,Z,m){const out=[];for(const v of volcanoesNear(X,Z,m+40)){const F=fortOf(v);if(F&&X>=F.box[0]-m&&X<=F.box[1]+m&&Z>=F.box[2]-m&&Z<=F.box[3]+m)out.push(F);}return out;}
// Is (X,Y,Z) within m of a fortress's works? (the warrens keep out)
function fortZone(X,Y,Z,m){for(const F of fortsNear(X,Z,m))if(Y>=F.box[4]-m&&Y<=F.box[5]+m)return true;return false;}
// local (u,v) of a world column
const fortUV=(F,X,Z)=>{const dx=X-F.GX,dz=Z-F.GZ;return [-(dx*F.ox+dz*F.oz),dx*F.px+dz*F.pz];};
// the floor (first open cell) along the way in: level for four blocks, then down a step every two to the hall's floor
const fortFloor=(F,u)=>u<=F.U1-1?F.Fy-Math.min(F.Dd,Math.max(0,Math.floor((u-4)/2))):F.Fh;
// Is (u,v) a lava cell of the fortress (one under the floor there)? A trough across the way in where it is level again (with a
// bridge), and two rivers down the throne hall.
function fortLavaUV(F,u,v){const U1=F.U1,ut=U1-6;
  if(ut-4>=2*F.Dd+2&&u>=ut&&u<=ut+2&&Math.abs(v)<=3&&Math.abs(v)>=2)return true;
  const um=Math.floor((ut+2*F.Dd+6)/2);if(ut-um>=12&&u>=um&&u<=um+2&&Math.abs(v)<=3&&Math.abs(v)>=2)return true;
  return Math.abs(v)===5&&u>=U1+4&&u<=U1+F.Lh-8;}
function fortLavaAt(X,Y,Z){for(const F of fortsNear(X,Z,0)){const [u,v]=fortUV(F,X,Z);if(Y===fortFloor(F,u)-1&&fortLavaUV(F,u,v))return true;}return false;}
// the name of the fortress at (X,y,Z), or null
function fortName(X,y,Z){for(const F of fortsNear(X,Z,0)){if(y<F.box[4]||y>F.box[5])continue;const [u,v]=fortUV(F,X,Z);if(u>=-13&&u<=F.U1+F.Lh&&Math.abs(v)<=16)return F.name;}return null;}
// where the lord waits and the guards stand (world coordinates, y the floor)
function fortSpots(F){const at=(u,v)=>({x:F.GX-F.ox*u+F.px*v+0.5,y:fortFloor(F,u),z:F.GZ-F.oz*u+F.pz*v+0.5});
  return {lord:at(F.U1+F.Lh-12,0),hall:at(F.U1+F.Lh/2,0),guards:[at(-6,-4),at(-6,4),at(-9,0),at(5,0),at(F.U1-2,2)]};}
// ---- building, per chunk
function fortBuild(F){
  const {Fy,Fh,U1,Hh,Lh}=F,top=Fh+Hh,E=U1+Lh,S=(X,y,Z,id)=>PW(X,y,Z,id,MODE_SET);
  for(let lz=0;lz<CS;lz++)for(let lx=0;lx<CS;lx++){const X=gx0+lx,Z=gz0+lz,[u,v]=fortUV(F,X,Z),av=Math.abs(v),h=hsh(X,9175,Z);
    if(u<-18||u>E||av>16)continue;
    // the terrace before the gate, with steps down from its outer edge
    if(u>=-12&&u<=-1&&av<=12){const edge=u===-12||av===12;
      for(let y=Fy-8;y<Fy-1;y++)S(X,y,Z,BASALT);S(X,Fy-1,Z,(u+v)%4===0?OBSID:BASBRICK);for(let y=Fy;y<=Fy+16;y++)S(X,y,Z,AIR);
      if(edge&&!(u===-12&&av<=2))S(X,Fy,Z,BASBRICK);if(edge&&!(u===-12&&av<=2)&&(u+v)%2===0)S(X,Fy+1,Z,BASBRICK);}
    if(u<-12&&u>=-18&&av<=2){const y=Fy-1-(-12-u);for(let k=y-4;k<=y;k++)S(X,k,Z,BASBRICK);for(let k=y+1;k<=Fy+4;k++)S(X,k,Z,AIR);}
    // the gate towers
    if(av>=9&&av<=13&&u>=-4&&u<=0){const ring=av===9||av===13||u===-4||u===0;
      for(let y=Fy-1;y<=Fy+22;y++)S(X,y,Z,(y===Fy+8||y===Fy+16)&&ring?EMBRICK:BASBRICK);
      if(ring&&(u+v)%2===0)S(X,Fy+23,Z,BASBRICK);if(av===11&&u===-2)S(X,Fy+23,Z,MAGMA);}
    // the facade: a wall up the mountain's foot with the gate in it, a raised portcullis and two glowing eyes above
    if(u>=0&&u<=2&&av<=14&&!(av>=9&&av<=13&&u===0)){
      for(let y=Fy-1;y<=Fy+18;y++){const gate=av<=3&&y>=Fy&&y<=Fy+9;S(X,y,Z,gate?(u===1&&y>=Fy+7?GRATE:AIR):y===Fy+12?EMBRICK:(av===2&&y===Fy+14&&u===0)?MAGMA:BASBRICK);}
      if(v%2===0&&u===0)S(X,Fy+19,Z,BASBRICK);}
    // the way in: walls, a floor stepping down, a ceiling, a line of fire in the walls, a trough of lava with a bridge
    if(u>=3&&u<U1&&av<=4){const fl=fortFloor(F,u);for(let y=fl-3;y<fl-1;y++)S(X,y,Z,BASBRICK);
      if(av===4){for(let y=fl-1;y<=fl+9;y++)S(X,y,Z,y===fl+6?EMBRICK:BASBRICK);}
      else{S(X,fl-1,Z,fortLavaUV(F,u,v)?LAVA:(u%6===0?OBSID:BASBRICK));for(let y=fl;y<=fl+8;y++)S(X,y,Z,AIR);S(X,fl+9,Z,BASBRICK);S(X,fl+10,Z,BASBRICK);
        if(av===3&&u%7===5)S(X,fl,Z,MAGMA);}}
    // the throne hall
    if(u>=U1&&u<=E&&av<=16){const wall=av>=15||u<=U1+1||u>=E-1,door=u<=U1+1&&av<=3;
      if(wall&&!door){for(let y=Fh-3;y<=top+1;y++)S(X,y,Z,(y-Fh)%6===5?EMBRICK:BASBRICK);continue;}
      S(X,Fh-3,Z,BASBRICK);S(X,Fh-2,Z,BASBRICK);
      if(door){S(X,Fh-1,Z,BASBRICK);for(let y=Fh;y<=Fh+8;y++)S(X,y,Z,AIR);for(let y=Fh+9;y<=top+1;y++)S(X,y,Z,BASBRICK);continue;}
      S(X,Fh-1,Z,fortLavaUV(F,u,v)?LAVA:(av<=2||(u-U1)%6===0)?OBSID:BASBRICK);
      for(let y=Fh;y<top;y++)S(X,y,Z,AIR);S(X,top,Z,(u-U1)%6===0?EMBRICK:BASBRICK);S(X,top+1,Z,BASBRICK);
      // pillars in two rows
      const pu=u-U1,pd=E-u;if(av>=8&&av<=10&&pu>=4&&pd>=8&&(pu-4)%6<=2){for(let y=Fh;y<top;y++)S(X,y,Z,(y===Fh+3||y===top-3)?EMBRICK:BASBRICK);continue;}
      // the dais at the far end, stepping up to the throne
      if(pd>=2&&pd<=6&&av<=7){const st=pd===6?1:pd===5?2:3;for(let y=Fh;y<Fh+st;y++)S(X,y,Z,y===Fh+st-1?OBSID:BASBRICK);
        if(pd===5&&av===6){S(X,Fh+2,Z,BASBRICK);S(X,Fh+3,Z,MAGMA);}
        if(pd===3&&v===0)S(X,Fh+3,Z,OBSID);if(pd===3&&av===1){S(X,Fh+3,Z,EMBRICK);S(X,Fh+4,Z,EMBRICK);}
        if(pd===2&&v===0)for(let y=Fh+3;y<=Fh+8;y++)S(X,y,Z,y===Fh+8?EMBRICK:OBSID);
        if(pd===2&&av>=2&&av<=6){const k=(av+(v>0?0:5))%5;S(X,Fh+3,Z,k===0?DWCHEST:k===1?GOLDB:k===2?CRATE:k===3?GOLDB:SKULLS);}
        continue;}
      // banners on the side walls, bones and skulls about the floor
      if(av===14&&pu%5===2){S(X,Fh,Z,BANNER);S(X,Fh+1,Z,BANNER);}
      else if(h<0.025&&!fortLavaUV(F,u,v))S(X,Fh,Z,h<0.008?SKULLS:BONES);}
  }
}
function applyFortresses(WCX,WCZ){const X=WCX*CS+8,Z=WCZ*CS+8;for(const F of fortsNear(X,Z,12))fortBuild(F);}
