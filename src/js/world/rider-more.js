// ---- The riders enlarged (D-090): two new places of the riders of the plains, in the frame and parts of their others
// (rider-build.js; riderLayout sends these here), and the bee skeps of their steadings and horse farms.
//   the race course by a hill town: a track of beaten earth five wide round a long oval (two straights and two bends) between
//     rail fences, pennons of green and gold along its outer rail, the start and finish line chalked across the far straight
//     between carved posts with the horse heads, a stand of planks along the near straight under golden thatch, and a long
//     stable for the racers; the gate toward the town (L.track: the oval's straights and bends, read by the race)
//   the mounds of the kings by the king's seat: a field ringed by a turf bank, the way of the kings up its middle from a gate of
//     carved posts, six mounds either side of it with a horse stone at the foot of each, barrowbloom on them all, and at its head
//     the founder's mound, greatest of all, its door of standing stones open on a passage to the chamber where the first king lies
//     on a bier of stone with his shield hung over him; the warden's turf hut by the gate
// ---- the race course (p.y the ground): grass; the track round the oval (d its distance from the oval's middle line: Ls the half
// length of a straight, Rr the bends' radius), its rails, the chalk line, the pennons
const courseD=(u,v,Ls)=>Math.abs(u)<=Ls?Math.abs(v):Math.hypot(Math.abs(u)-Ls,v);
RB.hcground=(s,p,u,v,X,Z)=>{const g=p.y,d=courseD(u,v,p.Ls),e=d-p.Rr;if(Math.hypot(u,v)>s.R-1)return;RBS(X,Z,g+1,g+4,AIR);
  if(Math.abs(e)<=2.5){const line=Math.abs(u)<=0.5&&v>0;RBP(X,g,Z,line?CHALK:hsh(X,9631,Z)<0.25?GRAVEL:PATH);return;}
  RBP(X,g,Z,GRASS);
  if(Math.abs(e+3)<0.5){RBP(X,g+1,Z,FENCE);return;} // the inner rail
  if(Math.abs(e-3)<0.5){if(u<0&&Math.abs(u)>p.Ls&&Math.abs(v)<=2)return; // the way in, at the bend toward the gate
    const t=Math.round(Math.abs(u)<=p.Ls?u+(v>0?0:200):(Math.atan2(v,Math.abs(u)-p.Ls)*p.Rr+(u>0?400:600)));
    if(((t%10)+10)%10===0){RBS(X,Z,g+1,g+2,LOG);RBP(X,g+3,Z,PENNON);}else RBP(X,g+1,Z,FENCE);return;}
  if(e<-3.5&&hsh(X,9633,Z)<0.05)RBP(X,g+1,Z,hsh(X,9635,Z)<0.5?TGRASS:OXEYE);};
// the posts either side of the line: carved oak under the horse heads, a pennon on each
RB.hcpost=(s,p,u,v,X,Z)=>{const g=p.y;RBS(X,Z,g+1,g+3,CTIMBER);RBP(X,g+4,Z,HORNS);};
// the stand along the near straight (its back toward -v): three steps of planks, a rail behind, posts carrying a roof of golden
// thatch over the top step
RB.hcstand=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,k=b;RBS(X,Z,g+1,g+8,AIR);
  if(k<=2){RBS(X,Z,g+1,g+1+k,PLANKS);}else{RBS(X,Z,g+1,g+3,PLANKS);RBP(X,g+4,Z,FENCE);}
  if(k===3&&(a===0||a===W-1||a%5===0))RBS(X,Z,g+4,g+6,LOG);
  if(k>=1)RBP(X,g+7,Z,GTHATCH);if(k===1||k===3)RBP(X,g+7,Z,a%2?GTHATCH:HBANNER);};
function riderCourse(s,L,r){const R=s.R,g=s.T,P=L.parts,Ls=13,Rr=13;
  P.push({k:'hcground',u0:-R,u1:R,v0:-R,v1:R,f:0,y:g,Ls:Ls,Rr:Rr});
  for(const vv of [Rr-4,Rr+4])P.push({k:'hcpost',u0:0,u1:0,v0:vv,v1:vv,f:0,y:g});
  P.push({k:'hcstand',u0:-11,u1:11,v0:-Rr-8,v1:-Rr-5,f:3,y:g});
  P.push({k:'stable',u0:-8,u1:6,v0:Rr+6,v1:Rr+11,f:2,y:g,roof:TURF});
  L.track={Ls:Ls,Rr:Rr,y:g};
  L.spots.push({kind:'cstand',u:-4,v:-Rr-6,y:g+2},{kind:'cstand',u:5,v:-Rr-6,y:g+2},{kind:'cjudge',u:2,v:Rr+4,y:g},{kind:'cpav',u:-1,v:Rr+5,y:g},{kind:'lane',u:-R+3,v:0,y:g});}
// ---- the mounds of the kings: the ground (grass, the way of gravel and flags up the middle, the turf bank round the field with
// its gap at the gate)
RB.hbground=(s,p,u,v,X,Z)=>{const g=p.y,d=Math.hypot(u,v);if(d>s.R-0.5)return;RBS(X,Z,g+1,g+4,AIR);
  if(d>s.R-3.5){if(u<0&&Math.abs(v)<=2){RBP(X,g,Z,GRAVEL);return;}RBP(X,g,Z,DIRT);RBP(X,g+1,Z,GRASS);if(hsh(X,9637,Z)<0.2)RBP(X,g+2,Z,BARROWBLOOM);return;}
  if(Math.abs(v)<=1&&u<p.wu){RBP(X,g,Z,Math.abs(v)===1||hsh(X,9639,Z)<0.4?FSTONE:GRAVEL);return;}
  RBP(X,g,Z,GRASS);if(hsh(X,9641,Z)<0.06)RBP(X,g+1,Z,hsh(X,9643,Z)<0.6?BARROWBLOOM:TGRASS);};
// a king's mound (p.cu, p.cv its middle, p.r its radius, p.hm its height): earth under turf, barrowbloom over it; the founder's
// (p.door) has a passage of standing stones from its foot toward -u under lintels of fieldstone, to a chamber of stone where he
// lies on his bier, his shield hung over him, a lamp at his head
RB.hbarrow=(s,p,u,v,X,Z)=>{const a=u-p.cu,b=v-p.cv,d=Math.hypot(a,b),g=p.y;if(d>p.r)return;const h=Math.max(1,Math.round(p.hm*(1-(d/p.r)*(d/p.r))));
  RBS(X,Z,g+1,g+h-1,DIRT);RBP(X,g+h,Z,GRASS);RBP(X,g+h+1,Z,hsh(X,9645,Z)<0.3?BARROWBLOOM:AIR);
  if(!p.door)return;const ch=Math.max(Math.abs(a),Math.abs(b))<=2,pas=a<0&&Math.abs(b)<=2;
  if(ch||pas){const top=g+4;if(Math.abs(b)===2||ch&&Math.abs(a)===2&&!(a===-2&&Math.abs(b)<=1)){RBS(X,Z,g+1,top-1,STANDSTONE);RBP(X,top,Z,FSTONE);return;}
    RBP(X,g,Z,FSTONE);RBS(X,Z,g+1,top-1,AIR);RBP(X,top,Z,FSTONE);if(top+1<g+h)RBS(X,Z,top+1,g+h-1,DIRT);
    if(ch&&a===0&&b===0)RBP(X,g+1,Z,STANDSTONE);else if(ch&&a===1&&b===0){RBP(X,g+1,Z,STANDSTONE);RBP(X,g+2,Z,BRAZIER);}else if(ch&&a===0&&Math.abs(b)===1)RBP(X,g+3,Z,HSHIELD);}};
// a horse stone at a mound's foot, toward the way
RB.hbstone=(s,p,u,v,X,Z)=>{RBP(X,p.y+1,Z,HSTONE);RBP(X,p.y+2,Z,HSTONE);RBP(X,p.y+3,Z,BARROWBLOOM);};
function riderBarrows(s,L,r){const R=s.R,g=s.T,P=L.parts,fu=R-12;
  P.push({k:'hbground',u0:-R,u1:R,v0:-R,v1:R,f:0,y:g,wu:fu-8});
  for(const cu of [-12,1])for(const sd of [1,-1]){const cv=sd*11;P.push({k:'hbarrow',u0:cu-6,u1:cu+6,v0:cv-6,v1:cv+6,cu:cu,cv:cv,r:6,hm:5,y:g});P.push({k:'hbstone',u0:cu,u1:cu,v0:sd*4,v1:sd*4,y:g});}
  for(const sd of [1,-1]){const cu=-R+9,cv=sd*17;if(Math.hypot(cu,cv)+4<R-3){P.push({k:'hbarrow',u0:cu-4,u1:cu+4,v0:cv-4,v1:cv+4,cu:cu,cv:cv,r:4,hm:3,y:g});}}
  P.push({k:'hbarrow',u0:fu-9,u1:fu+9,v0:-9,v1:9,cu:fu,cv:0,r:9,hm:8,y:g,door:1});P.push({k:'hbstone',u0:fu-10,u1:fu-10,v0:3,v1:3,y:g});P.push({k:'hbstone',u0:fu-10,u1:fu-10,v0:-3,v1:-3,y:g});
  for(const sd of [1,-1])P.push({k:'hcpost',u0:-R+2,u1:-R+2,v0:sd*3,v1:sd*3,f:0,y:g});
  P.push(housePart(-R+6,-R+9,5,8,2,[0,0,0,0],{y:g,st:1,sh:3,mat:'wattle',roof:TURF,pitch:2,horns:true,ridge:'b',door:1}));
  L.founder={u:fu,v:0,y:g+1};
  L.spots.push({kind:'bwarden',u:-R+7,v:3,y:g},{kind:'bmourn',u:fu-13,v:2,y:g},{kind:'bmourn',u:-4,v:-3,y:g});}
// ---- bee skeps (p.pts in the site's frame): a stand of planks, the skep on it; on the site's ground (p.y) or the land's
RB.hskeps=(s,p,u,v,X,Z)=>{if(!p.pts.some(q=>q[0]===u&&q[1]===v))return;const g=p.y!==undefined?p.y:colInfo(X,Z,TRB).h;const o=p.y===undefined?colInfo(X,Z,TRB):null;if(o&&(o.wet||o.river||o.lake))return;
  RBP(X,g+1,Z,PLANKS);RBP(X,g+2,Z,SKEP);RBP(X,g+3,Z,AIR);};
