// ---- The dwarves enlarged (D-091): more of a high hold under the mountain, and more of their works above it, in the frame and
// shapes of dwarf-build.js (dwKit, RB.dhold, DEC).
// In the great hall the court's places about the throne (the king or the queen of the mountain, or the hold's thane, on the
// high seat; the anvilguard either side of the dais; the hold-warden, the loremaster and the court below it). Level 1 (the forge
// hall's, 22 under the gate): a street running from the foot of the stair down from the great hall, and along it the ale-hall
// (its boards, its kegs racked along the back wall, its hearth), the runesmith's chamber with the rune forge, the brewery (its
// great vats of copper, the copper over its fire, kegs) and the market hall (its stalls down either side under the blue cloth of
// the mountain, the gemcutter's at its end). Level 2 (the deep level, 46 under the gate): a street from the smelting hall, and
// along it the mushroom gardens (beds of dark loam in rows, glowing mushrooms in them), the hot baths (a pool held in granite,
// warmed by the furnaces' flues; its water is trusted as the cistern's is) and the treasury (its gold heaped along the walls, its
// gems on a plinth); at the street's end a passage to the Hall of the Fathers, the long vault of the kings' tombs: their tombs
// in two rows, each with its flame at its head, the kings of old in stone along the walls, the founder's tomb on its dais at the
// far end under the banners, the annals at lecterns by the way in. Above: pens for the mountain rams at the holds and the mining
// towns, their engineers by the trebuchets.
function dwarfHoldMore(K,s,L,o){const F=o.F,Lg=o.Lg,Y0=o.Y0,Yf=o.Yf,Yd=o.Yd,a0=F+Lg-30,ue=F+Lg+4;
  // the court about the throne (the old keep's place: D-066)
  L.spots.push({kind:'dthrone',u:F+Lg+9,v:0,y:Y0+2},{kind:'danvil',u:F+Lg+7,v:5,y:Y0+2},{kind:'danvil',u:F+Lg+7,v:-5,y:Y0+2},{kind:'dcourt',u:F+Lg+1,v:5,y:Y0+1});
  // level 1: the street from the stair's foot, the rooms along it (each with its door from the street)
  K.room('door',a0,a0+2,20,21,Yf,4,{force:1});
  if(K.room('dstreet',a0,ue,22,24,Yf,5,{force:1})){
    const R=(k,u0,u1,du,h,o2)=>{const q=K.room(k,u0,u1,26,33,Yf,h,Object.assign({far:33},o2||{}));if(q)K.room('door',du-1,du+1,25,25,Yf,4,{force:1});return q;};
    if(R('dale',a0,a0+8,a0+4,6,{vr:2,vax:'v'}))L.spots.push({kind:'dale',u:a0+4,v:29,y:Yf+1});
    if(R('drunes',a0+10,a0+14,a0+12,6))L.spots.push({kind:'drunes',u:a0+12,v:28,y:Yf+1});
    if(R('dbrew',a0+16,a0+22,a0+19,7))L.spots.push({kind:'dbrew',u:a0+19,v:28,y:Yf+1});
    if(R('dmarket',a0+24,ue,a0+28,6,{vr:2,vax:'v'}))L.spots.push({kind:'dmarket',u:a0+27,v:29,y:Yf+1},{kind:'dgem',u:ue-2,v:30,y:Yf+1});
    L.spots.push({kind:'dstreet',u:a0+12,v:23,y:Yf+1});L.lv1={a0:a0,ue:ue,y:Yf+1};}
  // level 2: the deep street from the smelting hall, the rooms along it, the passage to the Hall of the Fathers
  const b0=F-10,be=F+Lg+2;
  if(K.room('dstreet',b0,be,7,9,Yd,5,{force:1})){K.room('door',F-4,F-2,5,6,Yd,4,{force:1});
    const R2=(k,u0,u1,du,h,o2)=>{const q=K.room(k,u0,u1,11,20,Yd,h,Object.assign({far:20},o2||{}));if(q)K.room('door',du-1,du+1,10,10,Yd,4,{force:1});return q;};
    if(R2('dgarden',b0,F+6,F-1,7,{vr:2,vax:'v'}))L.spots.push({kind:'dgarden',u:F-1,v:14,y:Yd+1});
    if(R2('dbath',F+8,F+18,F+13,6)){L.spots.push({kind:'dbath',u:F+13,v:12,y:Yd+1});L.water.push({u0:F+10,u1:F+16,v0:13,v1:18,y0:Yd-1,y1:Yd});L.bath={u0:F+10,u1:F+16,v0:13,v1:18,y:Yd};}
    if(R2('dvault',F+20,F+28,F+24,5)){L.spots.push({kind:'dvault',u:F+24,v:12,y:Yd+1});L.vault={u0:F+20,u1:F+28,v0:11,v1:19,y:Yd+1};}
    K.room('door',be-2,be,10,22,Yd,5,{force:1});
    if(K.room('dfathers',F-6,be,23,33,Yd,9,{vr:3,vax:'v',force:1})){L.fathers={u0:F-6,u1:be,v0:23,v1:33,y:Yd+1};L.spots.push({kind:'dfathers',u:be-4,v:28,y:Yd+1},{kind:'dmourn',u:F+10,v:28,y:Yd+1});}
    L.spots.push({kind:'ddeep',u:F+10,v:8,y:Yd+1});L.lv2={b0:b0,be:be,y:Yd+1};}}
// the street: lamps hung down its middle, the banners of the mountain along its walls
DEC.dstreet=(s,p,q,u,v,X,Z,iv)=>{const mid=(q.v0+q.v1)/2,du=u-q.u0;if(Math.abs(v-mid)<0.6&&du%6===3)dHang(X,Z,iv[1],1);else if((v===q.v0||v===q.v1)&&du%12===8)RBS(X,Z,q.y0+2,q.y0+3,DBANNER);};
// the ale-hall: kegs racked two high along the back wall between props, two long boards laid, the hearth at its end, lamps
DEC.dale=(s,p,q,u,v,X,Z,iv)=>{const y=q.y0,du=u-q.u0,dv=v-q.v0,Wd=q.u1-q.u0,mv=(q.v1-q.v0)/2;
  if(v===q.far){if(du%2===0){RBP(X,y,Z,DKEG);RBP(X,y+1,Z,DKEG);}else RBS(X,Z,y,y+2,DPROP);return;}
  if(du===0&&Math.abs(dv-mv)<1.1){RBP(X,y,Z,DFORGE);if(Math.abs(dv-mv)<0.6)RBP(X,y+1,Z,BRAZIER);return;}
  if((dv===2||dv===4)&&du>=2&&du<=Wd-1)RBP(X,y,Z,FEASTBOARD);else if(dv===3&&du%3===1&&du>=2)dHang(X,Z,iv[1],2);};
// the runesmith's chamber: the rune forge in its middle, an anvil by it, rune-stones set along its walls glowing, a lamp
DEC.drunes=(s,p,q,u,v,X,Z,iv)=>{const y=q.y0,mu=Math.round((q.u0+q.u1)/2),dv=v-q.v0;
  if(u===mu&&dv===4){RBP(X,y,Z,DRUNE);return;}if(u===mu+1&&dv===5){RBP(X,y,Z,DANVIL);return;}
  if((u===q.u0||u===q.u1)&&dv%2===1&&dv>1)RBP(X,y+2,Z,RUNE);else if(v===q.far&&Math.abs(u-mu)<=1)RBP(X,y,Z,u===mu?DGEAR:BARREL);else if(u===mu&&dv===2)dHang(X,Z,iv[1],1);};
// the brewery: great vats of copper two high along its sides, the copper over its fire in the middle, kegs and barrels along the
// back wall, crates by the door, lamps
DEC.dbrew=(s,p,q,u,v,X,Z,iv)=>{const y=q.y0,du=u-q.u0,dv=v-q.v0,Wd=q.u1-q.u0,mu=Wd/2;
  if(v===q.far){RBP(X,y,Z,du%2?BARREL:DKEG);if(du%2===0)RBP(X,y+1,Z,DKEG);return;}
  if((dv===3||dv===5)&&(du===0||du===Wd)){RBP(X,y,Z,DVAT);RBP(X,y+1,Z,DVAT);return;}
  if(dv===4&&Math.abs(du-mu)<0.6){RBP(X,y,Z,DFORGE);RBP(X,y+1,Z,DVAT);return;}
  if(dv===1&&(du===0||du===Wd))RBP(X,y,Z,CRATE);else if(Math.abs(du-mu)<0.6&&dv===2)dHang(X,Z,iv[1],2);};
// the market hall: stalls down either side, a counter of granite with goods on it and the cloth of the mountain over it, a gap
// every four; stock behind the stalls; lamps down the aisle
DEC.dmarket=(s,p,q,u,v,X,Z,iv)=>{const y=q.y0,du=u-q.u0,dv=v-q.v0,Dv=q.v1-q.v0,Wd=q.u1-q.u0;
  if((dv===1||dv===Dv-1)&&du>=1&&du<=Wd-1&&du%4!==0){RBP(X,y,Z,DGRAN);if(hsh(X,9533,Z)<0.6)RBP(X,y+1,Z,[CRATE,BARREL,DKEG,GOLDB,GEMHEAP,DANVIL][(hsh(X,9531,Z)*6)|0]);RBP(X,y+3,Z,DBANNER);return;}
  if((dv===0||dv===Dv)&&du%4===2){RBP(X,y,Z,hsh(X,9535,Z)<0.5?BARREL:CRATE);return;}
  if(Math.abs(dv-Dv/2)<0.6&&du%5===2)dHang(X,Z,iv[1],2);};
// the mushroom gardens: beds two wide of dark loam set in the floor between paths, glowing mushrooms and others in them, great
// mushrooms at the ends of the paths, lamps hung over the paths
DEC.dgarden=(s,p,q,u,v,X,Z,iv)=>{const y=q.y0,du=u-q.u0,dv=v-q.v0,Wd=q.u1-q.u0;
  if(du>=1&&du<=Wd-1&&dv>=1&&dv<=8&&dv%3!==0){RBP(X,y-1,Z,MUSHBED);const h=hsh(X,9537,Z);RBP(X,y,Z,h<0.35?GLOWSHROOM:h<0.7?MUSHB:AIR);return;}
  if((du===0||du===Wd)&&(dv===3||dv===6)){RBS(X,Z,y,y+3,MUSHSTEM);RBP(X,y+4,Z,GLOWCAP);return;}
  if(dv%3===0&&du%6===3)dHang(X,Z,iv[1],2);};
// the baths: a pool two deep held in granite, its water level with the floor, columns at its corners, lamps on the walls
DEC.dbath=(s,p,q,u,v,X,Z,iv)=>{const y=q.y0,du=u-q.u0,dv=v-q.v0,Wd=q.u1-q.u0,Dv=q.v1-q.v0;RBP(X,y-3,Z,DGRAN);RBP(X,y-2,Z,DGRAN);
  if(du>=2&&du<=Wd-2&&dv>=2&&dv<=Dv-2){RBS(X,Z,y-2,y-1,WATER);return;}
  if((du===1||du===Wd-1)&&(dv===1||dv===Dv-1)){RBS(X,Z,y,iv[1]-1,DCOL);RBP(X,iv[1],Z,DKNOT);return;}
  if((du===0||du===Wd)&&dv===(Dv>>1))RBP(X,y+2,Z,DLAMP);else if(v===q.far&&du%3===1)RBP(X,y,Z,BARREL);};
// the treasury: gold heaped along its walls one to three high, gems on the heaps, a plinth with gems in the middle; the way in
// left clear
DEC.dvault=(s,p,q,u,v,X,Z,iv)=>{const y=q.y0,du=u-q.u0,dv=v-q.v0,Wd=q.u1-q.u0,Dv=q.v1-q.v0,h=hsh(X,9539,Z);
  if(dv<=1&&Math.abs(du-Wd/2)<2)return;
  if(du===0||du===Wd||dv===Dv||(dv>=Dv-2&&(du<=1||du>=Wd-1))){const n=1+((h*3)|0);RBS(X,Z,y,y+n-1,GOLDB);if(h<0.5)RBP(X,y+n,Z,GEMHEAP);return;}
  if(Math.abs(du-Wd/2)<0.6&&Math.abs(dv-Dv/2)<0.6){RBP(X,y,Z,DGRAN);RBP(X,y+1,Z,GEMHEAP);return;}
  if(Math.abs(du-Wd/2)<0.6&&dv===Dv-2)dHang(X,Z,iv[1],1);};
// the Hall of the Fathers (entered at its +u end): the founder's dais at its far end, his tomb with gold at its head and the
// banners behind it, flames either side; the kings' tombs in two rows, each with its flame at its head; the kings of old in stone
// along the walls; the annals at lecterns by the way in; lamps hung down its middle
DEC.dfathers=(s,p,q,u,v,X,Z,iv)=>{const y=q.y0,du=u-q.u0,dd=q.u1-u,mv=(q.v0+q.v1)/2,av=Math.abs(v-mv),hv=(q.v1-q.v0)/2,top=iv[1];
  if(du<=4&&av<=3.5){RBP(X,y,Z,du===4||av>3?DKNOT:DFLAG);
    if(du>=1&&du<=2&&av<0.6)RBP(X,y+1,Z,DTOMB);else if(du===0&&av<0.6)RBS(X,Z,y+1,y+2,GOLDB);
    else if(du===2&&Math.abs(av-2)<0.6)RBP(X,y+1,Z,BRAZIER);else if(du===0&&Math.abs(av-2)<0.6)RBS(X,Z,y+3,y+7,DBANNER);return;}
  const k=(du-6)%5;if(Math.abs(av-3)<0.6&&du>=6&&dd>=6){if(k===1||k===2)RBP(X,y,Z,DTOMB);else if(k===0)RBP(X,y,Z,BRAZIER);return;}
  if(av>hv-0.6&&du>=6&&dd>=4&&k===3){RBS(X,Z,y,y+1,DCOURSE);RBP(X,y+2,Z,DKNOT);RBP(X,y+3,Z,DGRAN);RBP(X,y+4,Z,GOLDB);return;}
  if(dd>=1&&dd<=3&&Math.abs(av-2)<0.6)RBP(X,y,Z,LECTERN);else if(av<0.6&&k===3)dHang(X,Z,top,Math.max(1,top-y-7));};
// ---- Above: a pen for the mountain rams (p.W by p.D, its gate toward p.f): a fence round it but at its gate, a shelter of slate on
// props over its back rows with a wall of courses behind, hay and a water barrel under it
RB.dpen=(s,p,u,v,X,Z)=>{const [a0,b0]=partAB(p,u,v),a=a0-1,b=b0-1,W=p.W,D=p.D,g=p.y,mid=(W-1)/2,core=a>=0&&a<W&&b>=0&&b<D;
  RBP(X,g,Z,core?(b>=D-3?DFLAG:GRAVEL):PAVING);if(!core)return;RBS(X,Z,g+1,g+5,AIR);
  if(b===D-1){RBS(X,Z,g+1,g+3,DCOURSE);RBP(X,g+4,Z,SLATE);return;}
  if(b>=D-3){if((a===0||a===W-1)&&b===D-3)RBS(X,Z,g+1,g+3,DPROP);else if(a===0||a===W-1)RBP(X,g+1,Z,FENCE);RBP(X,g+4,Z,SLATE);
    if(b===D-2&&(a===1||a===W-2))RBP(X,g+1,Z,HAYBALE);else if(b===D-2&&a===2)RBP(X,g+1,Z,BARREL);return;}
  if((a===0||a===W-1||b===0)&&!(b===0&&Math.abs(a-mid)<1.01))RBP(X,g+1,Z,FENCE);};
// a pen at (cu, cv), facing downhill, its keeper's place before its gate (the rams themselves are brought by dwarf-life.js)
function dwPen(K,L,cu,cv){const p=K.bld('dpen',cu,cv,9,7,K.downhill(cu,cv));if(!p)return null;L.pens=L.pens||[];L.pens.push({u:(p.u0+p.u1)/2,v:(p.v0+p.v1)/2,y:p.y});
  L.spots.push({kind:'dpen',u:p.front[0],v:p.front[1],y:p.y});return p;}
