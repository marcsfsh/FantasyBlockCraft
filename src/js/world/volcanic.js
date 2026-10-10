// ---- The Volcanic Wastes remade (D-051): a burnt land under a black and red sky. Volcanoes rise out of the terrain itself, each
// with a crater holding a lake of lava that spills through a breach in its rim and runs down channels in the flanks; older
// flows lie cooled to glowing crust across the plains; fissures split the ground to fire; the rivers run with lava, cooled to
// obsidian where they meet the water of other lands. The ground is black ash and cinder, with charred trees (some still
// smouldering), basalt spires, obsidian shards and fumaroles ringed with sulphur. All pure functions of the seed.
const VOLC_C=140,volcCandC=new Map(),volcC=new Map(),greatC=new Map(),greatNC=new Map(),TVC={},TVC2={};let volcSkip=false;
// ---- The great volcano (D-054): every stretch of the wastes has one near its middle, far larger than the rest, the seat of an
// Emberlord's fortress. Placed where the land is wholly volcanic for its whole width (the widest that fits, searched outward from
// the stretch's middle); the lesser volcanoes keep clear of it.
function greatOf(c){
  const key=landKey(c.i,c.j);if(greatC.has(key))return greatC.get(key);let v=null;
  if(LANDS[cellLand(c)].k==='volcanic'){
    // the widest cone that fits and still leaves room for two lesser cones about its foot; failing that, the widest that fits
    for(const R of [118,104,92,80]){const g=greatTry(c,R);if(g&&(!v||g.sats.length>v.sats.length))v=g;if(v&&v.sats.length>=2)break;}}
  greatC.set(key,v);return v;
}
function greatTry(c,R){
  for(let k=0;k<16;k++){const a=k*2.4,d=k?k*7:0,X=Math.round(c.x+Math.cos(a)*d),Z=Math.round(c.z+Math.sin(a)*d);
    landsAt(X,Z,TVC);if(TVC.wVolc<0.9||TVC.wS>0.01)continue;let ok=true;
    for(let m=0;m<12&&ok;m++){const aa=m*0.5236;landsAt(X+Math.round(Math.cos(aa)*R),Z+Math.round(Math.sin(aa)*R),TVC2);if(TVC2.wVolc<0.6||TVC2.wS>0.02)ok=false;}
    if(!ok)continue;volcSkip=true;try{const o={};colInfoBase(X,Z,o);if(o.h<SEA+2||o.river||o.rvBot!==999)continue;
      const r=rngAt(c.i,9131,c.j),Hv=Math.min(H-50-o.h,Math.round(R*(1.0+r()*0.18))),rc=Math.round(R*0.16)+4,cd=10+Math.floor(r()*5);
      const fl=[],nf=4+Math.floor(r()*2),a0=r()*6.283;for(let q=0;q<nf;q++)fl.push({a:a0+q*6.283/nf+(r()-0.5)*0.7,len:0.85+r()*0.45});const old=[];for(let q=0;q<4;q++)old.push(r()*6.283);
      const v={great:1,key:'g'+c.i+','+c.j,i:c.i,j:c.j,X:X,Z:Z,R:R,pri:2,base:o.h,Hv:Hv,rc:rc,cd:cd,rimTop:o.h+Hv,lake:o.h+Hv-cd,fl:fl,old:old,name:'The Burning Mountain of '+fullName('drow',r,false),sats:[]};
      // lesser cones about its foot, where the land holds them, clear of each other
      const s0=r()*6.283;for(let q=0;q<14&&v.sats.length<4;q++){const sa=s0+q*0.9+(r()-0.5)*0.3,sR=30+Math.floor(r()*26),sd=R*1.12+sR*0.9+8+(q%2)*26+r()*14,sX=Math.round(X+Math.cos(sa)*sd),sZ=Math.round(Z+Math.sin(sa)*sd),sh=r(),sn=fullName('drow',r,false);
        landsAt(sX,sZ,TVC);if(TVC.wVolc<0.7||TVC.wS>0.01)continue;let sok=true;for(let m=0;m<8&&sok;m++){landsAt(sX+Math.round(Math.cos(m*0.785)*sR),sZ+Math.round(Math.sin(m*0.785)*sR),TVC2);if(TVC2.wVolc<0.45||TVC2.wS>0.02)sok=false;}
        if(!sok||v.sats.some(t=>Math.hypot(t.X-sX,t.Z-sZ)<(t.R+sR)*1.3+12))continue;const so={};colInfoBase(sX,sZ,so);if(so.h<SEA+2||so.river||so.rvBot!==999)continue;
        const sHv=Math.min(H-50-so.h,Math.round(sR*(0.58+sh*0.24))),src=Math.round(sR*0.15)+3,scd=7+Math.floor(sh*5),sfl=[],snf=2+Math.floor(sh*2.9),sa0=sh*6.283;for(let t=0;t<snf;t++)sfl.push({a:sa0+t*6.283/snf,len:0.8+((sh*7.31+t*0.37)%1)*0.5});
        v.sats.push({sat:1,key:'s'+c.i+','+c.j+','+q,i:c.i*16+q,j:c.j,X:sX,Z:sZ,R:sR,pri:1,base:so.h,Hv:sHv,rc:src,cd:scd,rimTop:so.h+sHv,lake:so.h+sHv-scd,fl:sfl,old:[sa0+1,sa0+3,sa0+5],name:'Mount '+sn});}
      return v;}finally{volcSkip=false;}}
  return null;
}
// the great volcanoes whose works may reach within r of (X,Z) (cached by 32-block tile for the terrain)
function greatNear(X,Z,r){
  const tk=(X>>5)*65536+(Z>>5)+(r>200?0.5:0);if(r<=200){const c=greatNC.get(tk);if(c)return c;}if(greatNC.size>40000)greatNC.clear();
  const out=[],seen=new Set(),ci=Math.floor(X/LS),cj=Math.floor(Z/LS),n=r>200?2:1;
  for(let a=-n;a<=n;a++)for(let b=-n;b<=n;b++){const c=stretchCell(landSite(ci+a,cj+b)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const g=greatOf(c);if(g&&Math.hypot(g.X-X,g.Z-Z)<Math.max(r,200)+g.R*1.4){out.push(g);for(const t of g.sats)out.push(t);}}
  if(r<=200)greatNC.set(tk,out);return out;
}
// a candidate: one per grid cell where the land is wholly volcanic for its whole width (no base height yet)
function volcCand(i,j){
  const key=i*65536+j;if(volcCandC.has(key))return volcCandC.get(key);let v=null;
  if(hsh(i,9101,j)<0.95){const X=Math.floor((i+0.15+hsh(i,9103,j)*0.7)*VOLC_C),Z=Math.floor((j+0.15+hsh(i,9105,j)*0.7)*VOLC_C),R=34+Math.floor(hsh(i,9107,j)*30);
    landsAt(X,Z,TVC);let ok=TVC.wVolc>0.85&&TVC.wS<0.01;
    for(let k=0;k<8&&ok;k++){const a=k*0.785;landsAt(X+Math.round(Math.cos(a)*R),Z+Math.round(Math.sin(a)*R),TVC2);if(TVC2.wVolc<0.55||TVC2.wS>0.02)ok=false;}
    if(ok)for(const g of greatNear(X,Z,200))if(Math.hypot(g.X-X,g.Z-Z)<(g.great?g.R*1.15+R*0.9+8:(g.R+R)*1.3+12))ok=false; // clear of the great volcano
    if(ok)v={i:i,j:j,key:i+','+j,X:X,Z:Z,R:R,pri:hsh(i,9113,j)};}
  volcCandC.set(key,v);return v;
}
// a volcano: a candidate not crowded by a stronger neighbour, with its heights fixed from the ground at its heart
function volcAt(i,j){
  const key=i*65536+j;if(volcC.has(key))return volcC.get(key);let v=null;const c=volcCand(i,j);
  if(c){let ok=true;for(let a=-1;a<=1&&ok;a++)for(let b=-1;b<=1&&ok;b++){if(!a&&!b)continue;const n=volcCand(i+a,j+b);if(n&&n.pri>c.pri&&Math.hypot(n.X-c.X,n.Z-c.Z)<(n.R+c.R)*1.3+12)ok=false;}
    if(ok){volcSkip=true;const o={};colInfoBase(c.X,c.Z,o);volcSkip=false;
      if(o.h>=SEA+2&&!o.river&&o.rvBot===999){const Hv=Math.min(H-50-o.h,Math.round(c.R*(0.58+hsh(i,9109,j)*0.24))),rc=Math.round(c.R*0.15)+3,cd=7+Math.floor(hsh(i,9111,j)*5),r=rngAt(i,9115,j);
        const fl=[],nf=2+Math.floor(r()*3),a0=r()*6.283;for(let k=0;k<nf;k++)fl.push({a:a0+k*6.283/nf+(r()-0.5)*0.9,len:0.8+r()*0.55});
        const old=[];for(let k=0;k<3;k++)old.push(r()*6.283);
        v=Object.assign({},c,{base:o.h,Hv:Hv,rc:rc,cd:cd,rimTop:o.h+Hv,lake:o.h+Hv-cd,fl:fl,old:old,name:'Mount '+fullName('drow',r,false)});}}}
  volcC.set(key,v);return v;
}
function volcanoesNear(X,Z,r){const out=[],n=Math.ceil(r/VOLC_C)+1,ci=Math.floor(X/VOLC_C),cj=Math.floor(Z/VOLC_C);
  for(const g of greatNear(X,Z,r))if(Math.hypot(g.X-X,g.Z-Z)<r+g.R)out.push(g);
  for(let a=-n;a<=n;a++)for(let b=-n;b<=n;b++){const v=volcAt(ci+a,cj+b);if(v&&Math.hypot(v.X-X,v.Z-Z)<r+v.R)out.push(v);}return out;}
const angDiffV=(a,b)=>{let d=b-a;while(d>Math.PI)d-=6.2832;while(d<-Math.PI)d+=6.2832;return d;};
// The ground's height and its fire, called by colInfoBase for every column touched by the volcanic land
function volcTerrain(X,Z,o,h){
  if(volcSkip||o.wVolc<0.05)return h;
  const ci=Math.floor(X/VOLC_C),cj=Math.floor(Z/VOLC_C),G=greatNear(X,Z,0);
  for(let q=-G.length;q<9;q++){const v=q<0?G[q+G.length]:volcAt(ci+(q%3)-1,cj+Math.floor(q/3)-1);if(!v)continue;const dx=X-v.X,dz=Z-v.Z,d=Math.hypot(dx,dz),reach=v.R*Math.max(1.3,1+0.6*Math.max(...v.fl.map(f=>f.len-1),0));if(d>=reach)continue;
    // the cone: the ground near it eases to the volcano's own base, so its crater and rim keep their heights
    const fb=sstep(v.R*1.3,v.R*0.75,d);let hh=h+(v.base-h)*fb;const th=Math.atan2(dz,dx);if(fb>0.3){o.river=false;o.bank=false;} // no river climbs a volcano
    if(d<v.rc){const q=d/v.rc;hh=v.rimTop-(v.cd+3)+(v.cd+3)*Math.pow(q,4);o.vcr=true;o.vs=1;if(hh<v.lake)o.vlake=v.lake;}
    else if(d<v.R){const s=1-(d-v.rc)/(v.R-v.rc),gul=Math.abs(Math.sin(th*6+fbm2(X/40,Z/40,1,9117.1)*2.5));
      hh+=Math.pow(s,1.35)*v.Hv-(1-gul)*(1-gul)*s*(1-s)*12+fbm2(X/13,Z/13,1,9119.3)*2.2*Math.min(1,s*2+0.2);o.vs=s;}
    // the flows: out through a breach in the rim at the lake's level, then down the flank and out onto the plain
    if(d>=v.rc*0.9)for(let k=0;k<v.fl.length;k++){const f=v.fl[k],dmax=v.R*f.len;if(d>dmax+3)continue;
      const ca=f.a+0.33*Math.sin(d/11+k*2.1)+0.12*Math.sin(d/4.3+k),lat=Math.abs(angDiffV(th,ca))*d,w=0.8+Math.min(d/v.R,1.2)*1.7+(d>v.R?(d-v.R)*0.1:0);
      if(lat<w&&d<dmax){hh=Math.min(Math.round(hh)-1,Math.round(v.lake-Math.max(0,d-v.rc)*0.55));o.vflow=true;o.vlake=0;break;}
      if(lat<w+2.2)o.vcrust=true;}
    if(!o.vflow&&d>v.rc&&d<v.R*0.95)for(const a0 of v.old)if(Math.abs(angDiffV(th,a0+0.2*Math.sin(d/9)))*d<1.4+d/v.R*1.6)o.vcrust=true; // old flows, cooled
    return hh;}
  // fissures across the plains: narrow, a few blocks deep, lava at the bottom
  if(o.wVolc>0.55&&h>SEA+3){const q=Math.abs(fbm2(X/85,Z/85,2,9121.3));if(q<0.0075+0.006*(o.wVolc-0.55)){o.vfis=true;return h-4-Math.floor(hsh(X>>2,9123,Z>>2)*4);}}
  return h;
}
// Fumaroles: here and there a smoking vent, sulphur round it
const ventAt=(X,Z)=>hsh(X,9141,Z)<0.0025;
function ventNear(X,Z){for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if((a||b)&&ventAt(X+a,Z+b))return true;return false;}
// ---- Charred trees, basalt spires, obsidian shards
function charP(X,y,Z,r){
  if(r()<0.2){const ax=r()<0.5,len=3+(r()*3|0);for(let t=0;t<len;t++)PW(ax?X+t:X,y,ax?Z:Z+t,CHARWOOD,MODE_SET);return;} // fallen
  const th=3+(r()*5|0);if(y+th+2>=H)return;for(let i=0;i<th;i++)PW(X,y+i,Z,i===th-1&&r()<0.35?SMOULDER:CHARWOOD,MODE_SET);
  for(let k=0;k<1+(r()*3|0);k++){const a=r()*6.283,by=y+th-1-(r()*3|0),len=1+(r()*2|0);for(let t=1;t<=len;t++)PW(X+Math.round(Math.cos(a)*t),by+(t>1?1:0),Z+Math.round(Math.sin(a)*t),r()<0.12?SMOULDER:CHARWOOD,MODE_SET);}
}
function shardP(X,y,Z,r){const h=3+(r()*5|0),lx=r()<0.5?1:-1,lz=r()<0.5?1:-1;let x=X,z=Z;for(let i=-1;i<h;i++){if(i>0&&i%2===0){if(r()<0.6)x+=lx;else z+=lz;}PW(x,y+i,z,OBSID,MODE_SET);if(i<1)PW(x+lx,y+i,z,OBSID,MODE_SET);}}
FLOORS.add(BLACKASH);FLOORS.add(CINDER);
FOREST.volcanic={trees:0.007,banks:true,
  tree:(X,y,Z,r)=>{const q=hsh(X,9161,Z);if(q<0.55)charP(X,y,Z,r);else if(q<0.8)spireP(X,y,Z,r,BASALT);else shardP(X,y,Z,r);},
  top:o=>{if(o.vflow||o.vfis)return LAVA;if(o.vcrust)return LAVACRUST;if(o.vcr)return CINDER;if(ventAt(o.X,o.Z))return VENT;if(ventNear(o.X,o.Z))return SULFUR;
    if(o.vs>0.6)return o.dn>0.1?CINDER:BLACKASH;{const fld=fbm2(o.X/90,o.Z/90,2,9133.3);if(fld>0.42&&hsh(o.X,9135,o.Z)<0.35+(fld-0.42)*2)return LAVACRUST;if(Math.abs(fbm2(o.X/52,o.Z/52,2,9131.7))<0.009)return LAVACRUST;}return o.dn>0.36?CINDER:o.dn<-0.42?ASH:BLACKASH;},
  shore:o=>o.dn>0.2?CINDER:BASALT,rock:BASALT,soil:CINDER,floors:new Set([BLACKASH,CINDER,ASH]),
  plant:r=>r<0.008?DBUSH:0};
// The rivers and lakes of the volcanic land run with lava; where its weight thins toward another land the channel is cooled to
// a dry floor of obsidian, so lava never meets water. Read by fillCol.
function liquidOf(o){if(o.wVolc>0.5&&o.wS<0.04)return LAVA;if(o.wVolc>0.3&&o.wS<0.2)return OBSID;return WATER;}
// Lava a landmark holds in its own walls (the citadel's moat, the rift's river), trusted by the underground check at a chunk's edge
function sigLavaAt(X,y,Z){for(const s of sigsNear(Math.floor(X/CS),Math.floor(Z/CS)))if((s.kind==='rift'||s.kind==='citadel')&&y<s.g&&y>=s.g-32&&Math.max(Math.abs(X-s.X),Math.abs(Z-s.Z))<=s.R+2)return true;return false;}
// ---- Landmark and feature
SIGS.volcanic=[['citadel','The Ashen Citadel',15],['rift','Rift of Fire',13]];
function volcBuild(s,r){
  const X=s.X,Z=s.Z,g=s.g;
  switch(s.kind){
    case 'citadel':{ // a ruined black citadel: curtain walls and corner towers round a tall spire crowned with fire, a moat of lava
      const face=Math.floor(s.seed*4),rx=(a,b)=>face===0?a:face===1?-b:face===2?-a:b,rz=(a,b)=>face===0?b:face===1?a:face===2?-b:-a;
      const P=(a,y,b,id)=>PW(X+rx(a,b),y,Z+rz(a,b),id,MODE_SET),stone=()=>{const q=r();return q<0.14?OBSID:q<0.36?CINDER:BASALT;},gap=(a,b,y,top)=>hsh(X+a*7,y,Z+b*5)<0.04+0.3*Math.max(0,(y-g)/top-0.6);
      sigFloor(X-15,Z-15,X+15,Z+15,g,BASALT,14);
      for(let a=-16;a<=16;a++)for(let b=-16;b<=16;b++){const m=Math.max(Math.abs(a),Math.abs(b));
        if(m===16){for(let y=g-3;y<g;y++)P(a,y,b,BASALT);continue;} // the moat's outer wall: its lava is held whatever the ground does
        if(m>=14){if(b>=12&&Math.abs(a)<=1){P(a,g,b,BASALT);continue;} // the causeway over the moat
          P(a,g-3,b,BASALT);P(a,g-2,b,LAVA);P(a,g-1,b,LAVA);P(a,g,b,AIR);}else if(m<=10&&hsh(X+a,9171,Z+b)<0.12)P(a,g,b,LAVACRUST);}
      // the curtain wall with its crenels and the gate in the near side
      for(let a=-12;a<=12;a++)for(let b=-12;b<=12;b++){const m=Math.max(Math.abs(a),Math.abs(b));if(m<11)continue;const wh=7+(hsh(X+a,9173,Z+b)<0.25?-2:0);
        for(let y=g+1;y<=g+wh;y++){if(b>=11&&Math.abs(a)<=1&&y<=g+5)continue;if(!gap(a,b,y,wh))P(a,y,b,stone());}
        if(m===12&&(a+b)%2===0)P(a,g+wh+1,b,stone());}
      // corner and gate towers: hollow, crenelated, a brazier of magma on each
      for(const [ca,cb,th] of [[-12,-12,15],[12,-12,15],[-12,12,14],[12,12,14],[-3,12,12],[3,12,12]])for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const e=Math.abs(a)===2||Math.abs(b)===2;
        for(let y=g+1;y<=g+th;y++)if(e&&!gap(ca+a,cb+b,y,th))P(ca+a,y,cb+b,stone());if(e&&(a+b)%2===0)P(ca+a,g+th+1,cb+b,stone());if(!a&&!b){P(ca,g+th-1,cb,BASALT);P(ca,g+th,cb,MAGMA);}}
      // the spire: stepping in as it rises, slit windows lit from within, a crown of obsidian spikes round a fire at the top
      const tiers=[[4,12],[3,24],[2,34],[1,40]];let y0=g+1;
      for(const [hw,top] of tiers){for(let y=y0;y<=g+top;y++)for(let a=-hw;a<=hw;a++)for(let b=-hw;b<=hw;b++){const e=Math.abs(a)===hw||Math.abs(b)===hw;
          if(!e){P(a,y,b,(y-g)%6===0?BASALT:AIR);continue;}const win=(y-g)%6===3&&(a===0||b===0)&&hw>1;P(a,y,b,win?AIR:stone());if(win)P(Math.sign(a)*(hw-1),y-1,Math.sign(b)*(hw-1),LAVACRUST);}
        y0=g+top+1;}
      for(let y=g+1;y<=g+3;y++)P(0,y,4,AIR); // the spire's door, toward the gate
      for(const [a,b] of [[-1,-1],[1,-1],[-1,1],[1,1]])for(let y=g+41;y<=g+45;y++)if(y<g+44||hsh(X+a,y,Z+b)<0.6)P(a,y,b,OBSID);
      P(0,g+41,0,MAGMA);P(0,g+42,0,LAVACRUST);
      // rubble below the broken walls
      for(let k=0;k<40;k++){const a=-11+(r()*23|0),b=-11+(r()*23|0);if(Math.max(Math.abs(a),Math.abs(b))>5)P(a,g+1,b,r()<0.6?CINDER:BASALT);}
      break;}
    case 'rift':{ // a rift: walls dropping in ledges to a river of fire twenty and more blocks down, a black arch across it
      const ang=hsh(X,9151,Z)*Math.PI,ux=Math.cos(ang),uz=Math.sin(ang),dep=20+Math.floor(hsh(X,9153,Z)*8);
      for(let dx=-14;dx<=14;dx++)for(let dz=-14;dz<=14;dz++){const t=dx*ux+dz*uz,c=-dx*uz+dz*ux;if(Math.abs(t)>13.5)continue;const f=Math.sqrt(Math.max(0,1-(t/13.5)*(t/13.5))),hw=1.5+3.5*f+fbm2((X+dx)/4,(Z+dz)/4,1,9155.1)*0.8;
        if(Math.abs(c)>hw+2)continue;const x=X+dx,z=Z+dz,bot=g-Math.round(dep*Math.min(1,f*1.6)); // a flat bottom along the middle, so the lava lies level
        if(Math.abs(c)>hw){PW(x,g,z,hsh(x,9157,z)<0.5?LAVACRUST:CINDER,MODE_SET);continue;}
        for(let y=g+6;y>bot;y--){const open=Math.abs(c)<=hw-(g-y)/7;if(open)PW(x,y,z,AIR,MODE_SET);}
        if(bot===g-dep&&Math.abs(c)<=hw-dep/7){PW(x,bot,z,LAVA,MODE_SET);PW(x,bot-1,z,LAVA,MODE_SET);PW(x,bot-2,z,MAGMA,MODE_SET);}}
      // the arch: a span of basalt across the middle, a little below the rim
      for(let k=-8;k<=8;k++){const a=-Math.round(k*uz),b=Math.round(k*ux),sag=Math.round(Math.cos(k/8*1.5708)*2);for(let y=g-6+sag;y<=g-4+sag;y++)PW(X+a,y,Z+b,y===g-4+sag?CINDER:BASALT,MODE_SET);}
      break;}
  }
}
