// ---- The camp of the allied hosts before the Gate of the Wastes (D-067): a leaguer, not a scatter of tents. 250 deep and 250
// across (three times the ground of the largest city of men), levelled at the gate's height out beyond the siege lines, its
// front toward the gate. A ditch, a rampart and a palisade all round with timber towers, a gate in each side (the great gate
// toward the wastes between two towers under a bridge hung with the three peoples' banners); a street from the great gate to
// the back gate and one across, a road inside the rampart; in the middle a square before the Pavilion of the Three Banners,
// where the captains of men, elves and dwarves hold council, the three banners on tall poles before it; the muster field
// inside the great gate. The quarters:
//   men (front, one side): rows of tents of canvas in their lines, pavilions of the captains in the black and white of the
//     realm, timber halls (barracks and mess), a smithy, the riders' stables and horse lines
//   elves (front, the other side): round pavilions, tents of grey and blue, a watch-spire, an archery range
//   dwarves (back, the men's side): a redoubt of granite with towers and ballistae, forges, cranes, a trebuchet under repair, a
//     second ram on its trestles, heaps of shot, carts and kegs
//   stores (back, the elves' side): storehouses, wagons, haystacks, wells, cook-fires, the field hospital
// Parts in the gate's site frame (gate-build.js), u = P.uC0 + U, v = V.
function campLayout(P,s,L,r){
  const g=P.hG,c0=P.uC0,A=L.parts,CW=WG_CAMP[0],HV=WG_CAMP[1],cs=P.cs,res=[];
  const box=(k,U0,U1,V0,V1,o)=>{const p=Object.assign({k:k,u0:c0+U0,u1:c0+U1,v0:V0,v1:V1,y:g},o||{});A.push(p);return p;};
  const pc=(k,U,V,w,d,f,o)=>{const p=partC(k,c0+U,V,w,d,f,Object.assign({y:g},o||{}));A.push(p);return p;};
  const take=(U0,U1,V0,V1)=>res.push([U0,U1,V0,V1]),free=(U0,U1,V0,V1)=>res.every(q=>U1<q[0]||U0>q[1]||V1<q[2]||V0>q[3]);
  const sp=(kind,U,V,R,y)=>L.spots.push({kind:kind,u:c0+U,v:V,R:R||4,y:y||g});
  P.campC={c0:c0,c1:c0+CW,hv:HV};
  // the ground, the perimeter
  box('lgground',0,CW,-HV,HV,{cw:CW,hv:HV});
  box('lgwall',0,CW,-HV,HV,{cw:CW,hv:HV});
  take(0,13,-HV,HV);take(CW-13,CW,-HV,HV);take(0,CW,-HV,-HV+13);take(0,CW,HV-13,HV);
  // towers on the rampart: the corners, every forty or so along, either side of each gate
  const tw=(U,V,H)=>{pc('gtwr',U,V,5,5,0,{H:H||12});take(U-3,U+3,V-3,V+3);};
  for(const U of [6,CW-6])for(const V of [-HV+6,-82,-44,-9,9,44,82,HV-6])tw(U,V,V===9||V===-9?14:12);
  for(const V of [-HV+6,HV-6])for(const U of [48,90,116,134,160,202])tw(U,V);
  // the great gate's bridge between its towers, hung with the banners of the three peoples
  box('lggate',4,8,-7,7);
  // the streets and the square
  take(14,CW-14,-5,5);take(121,129,-HV+14,HV-14);
  box('lgsq',104,154,-24,24);take(104,154,-24,24);
  box('lgpav3',132,150,-13,13,{f:0,cols:[WOOLW,WOOLB,WOOLY],big:1});
  for(const [V,id] of [[-8,RBANNER],[0,EVBANNER],[8,DBANNER],[-16,HBANNER],[16,WBANNER]])box('lgpole',110,110,V,V,{id:id,H:Math.abs(V)>8?12:16});
  for(const V of [-20,20])for(const U of [108,120,140,152])box('lglamp',U,U,V,V);
  for(let U=20;U<CW-16;U+=16)if(U<100||U>158)for(const V of [-6,6])box('lglamp',U,U,V,V);
  // the muster field inside the great gate
  box('lgmuster',14,44,-44,44);take(14,44,-44,44);
  sp('r_gate',10,0,3);sp('r_drill',28,-24,6);sp('h_drill',28,24,6);sp('d_drill',36,-6,5);sp('r_hall',140,-4,4);sp('e_hall',140,4,4);sp('d_hall',146,0,3);
  const side=-cs; // the men's side of the main street (the elves' the other), so the men lie toward the ram's side of the pass
  // ---- the men
  {const sv=side;
    // timber halls (barracks, mess) by the front, the smithy, the stables and horse lines toward the side gate
    for(const [U,V] of [[18,74],[18,100]]){const v0=sv>0?V:-V-8;A.push(housePart(c0+U,c0+U+17,v0,v0+7,sv>0?2:3,[1,1,1,1],{mat:'timber',st:2,sh:4,roof:SLATE,door:3,y:g}));take(U-2,U+19,Math.min(v0,v0+7)-2,Math.max(v0,v0+7)+2);}
    sp('r_barracks',27,sv*78,5);sp('r_barracks',27,sv*104,5);
    {const V=sv*66,p=pc('smithy',52,V,7,6,sv>0?2:3);take(47,57,V-5,V+5);sp('r_smithy',52,V,3);}
    {const vv=sv*95;pc('stable',58,vv,26,7,sv>0?2:3);take(44,71,vv-4,vv+4);pc('paddock',87,vv,24,14,sv>0?2:3);take(74,100,vv-8,vv+8);sp('h_stable',58,vv-sv*6,4);sp('h_paddock',87,vv,5);}
    // the captains' pavilions in the realm's black and white, along the cross street
    for(const U of [100,112])for(const V of [36,54,72]){const vv=sv*V;if(!free(U-5,U+5,vv-6,vv+6))continue;pc('lgpav3',U,vv,11,9,0,{cols:[WOOLW,WOOLK]});take(U-5,U+5,vv-6,vv+6);}
    // the lines of tents
    for(let U=48;U<=112;U+=11)for(let V=12;V<=112;V+=8){const vv=sv*V;if(!free(U-4,U+4,vv-3,vv+3))continue;pc('lgtent',U,vv,5,7,0,{col:hsh(U,9743,V)<0.5?WOOLK:WOOLW,flag:V%24===12?RBANNER:0});take(U-4,U+4,vv-3,vv+3);}
    for(let U=16;U<=44;U+=10)for(let V=48;V<=64;V+=8){const vv=sv*V;if(!free(U-4,U+4,vv-3,vv+3))continue;pc('lgtent',U,vv,5,7,0,{col:WOOLK});take(U-4,U+4,vv-3,vv+3);}
    sp('r_street',80,sv*30,6);sp('r_street',100,sv*90,6);}
  // ---- the elves
  {const sv=-side;
    // the archery range along the side: a shooting line, butts of hay with their marks at the far end
    box('lgrange',52,104,sv>0?86:-112,sv>0?112:-86,{sv:sv});take(50,106,sv>0?84:-114,sv>0?114:-84);sp('w_range',56,sv*99,4);
    // the watch-spire, round pavilions, tents of grey and blue
    A.push({k:'etower',cu:c0+112,cv:sv*104,rr:3,H:22,y:g,flag:1,door:0,u0:c0+107,u1:c0+117,v0:sv*104-5,v1:sv*104+5});take(107,117,sv*104-6,sv*104+6);
    for(const [U,V] of [[24,64],[24,90],[60,40],[86,40],[100,64],[74,66]]){const vv=sv*V;if(!free(U-6,U+6,vv-6,vv+6))continue;A.push({k:'epav',cu:c0+U,cv:vv,rp:4,y:g,roof:EVROOF,u0:c0+U-6,u1:c0+U+6,v0:vv-6,v1:vv+6});take(U-6,U+6,vv-6,vv+6);}
    sp('e_garden',60,sv*40,5);sp('e_hall',86,sv*40,4);sp('e_barracks',24,sv*77,5);
    for(let U=48;U<=112;U+=11)for(let V=12;V<=80;V+=9){const vv=sv*V;if(!free(U-4,U+4,vv-3,vv+3))continue;pc('lgtent',U,vv,5,7,0,{col:hsh(U,9745,V)<0.5?WOOLB:WOOLG,canvas:hsh(V,9747,U)<0.5?WOOLW:CANVAS,flag:V%27===12?EVBANNER:0});take(U-4,U+4,vv-3,vv+3);}
    for(let U=16;U<=40;U+=11)for(let V=50;V<=112;V+=9){const vv=sv*V;if(!free(U-4,U+4,vv-3,vv+3))continue;pc('lgtent',U,vv,5,7,0,{col:WOOLB,canvas:WOOLW,flag:V%27===14?WBANNER:0});take(U-4,U+4,vv-3,vv+3);}}
  // ---- the dwarves: their redoubt of granite at the back on the men's side
  {const sv=side,U0=150,U1=226,V0=sv>0?30:-110,V1=sv>0?110:-30;
    box('lgred',U0,U1,V0,V1,{gu:U0,gv:(V0+V1)>>1});take(U0-2,U1+2,V0-2,V1+2);
    for(const [U,V] of [[U0,V0],[U0,V1],[U1,V0],[U1,V1]])A.push({k:'dtower',cu:c0+U,cv:V,h2:3,H:14,y:g,ball:U===U0?1:0,flag:U===U1?1:0,door:U===U0?1:0,u0:c0+U-4,u1:c0+U+4,v0:V-4,v1:V+4});
    const vm=(V0+V1)>>1;
    pc('dforge',U0+12,vm-sv*20,9,7,0,{W:7,D:5});pc('dforge',U0+12,vm+sv*4,9,7,0,{W:7,D:5});
    A.push({k:'dcrane',cu:c0+U0+40,cv:vm-sv*24,y:g,u0:c0+U0+39,u1:c0+U0+41,v0:vm-sv*24-6,v1:vm-sv*24+9});
    pc('dtreb',U0+40,vm+sv*14,7,12,0);
    box('lgram',U0+56,U0+70,vm-5,vm+5);
    box('gshot',U0+28,U0+31,vm+sv*28-3,vm+sv*28+3);box('gshot',U0+50,U0+53,vm-sv*30-3,vm-sv*30+3);
    for(const [U,V] of [[U0+24,vm+sv*30],[U0+64,vm+sv*28],[U0+66,vm-sv*28]])box('lgkegs',U,U+3,V-2,V+2);
    sp('d_forge',U0+12,vm-sv*20,4);sp('d_dforge',U0+12,vm+sv*4,4);sp('d_barracks',U0+40,vm,6);sp('d_gate',U0+3,vm,3);
    // their tents outside the redoubt, toward the cross street
    for(let U=134;U<=146;U+=11)for(let V=12;V<=112;V+=8){const vv=sv*V;if(!free(U-4,U+4,vv-3,vv+3))continue;pc('lgtent',U,vv,5,7,0,{col:WOOLB,flag:V%32===12?DBANNER:0,low:1});take(U-4,U+4,vv-3,vv+3);}
    for(let U=160;U<=222;U+=11)for(let V=12;V<=24;V+=8){const vv=sv*V;if(!free(U-4,U+4,vv-3,vv+3))continue;pc('lgtent',U,vv,5,7,0,{col:WOOLY,low:1});take(U-4,U+4,vv-3,vv+3);}}
  // ---- the stores, the kitchens and the field hospital at the back on the elves' side
  {const sv=-side;
    for(const [U,V] of [[160,96],[184,96],[208,96]]){const v0=sv>0?V:-V-9;A.push(housePart(c0+U,c0+U+17,v0,v0+8,sv>0?2:3,[1,1,1,1],{mat:'cottage',st:1,sh:4,roof:THATCH,door:4,y:g}));take(U-2,U+19,Math.min(v0,v0+8)-2,Math.max(v0,v0+8)+2);}
    for(const [U,V] of [[164,72],[176,72],[188,72],[200,72],[212,72]]){const vv=sv*V;box('lgwagon',U-1,U+5,vv-1,vv+1);take(U-2,U+6,vv-3,vv+3);}
    for(const [U,V] of [[222,60],[226,70],[218,74]]){const vv=sv*V;A.push({k:'hay',cu:c0+U,cv:vv,y:g,u0:c0+U-2,u1:c0+U+2,v0:vv-2,v1:vv+2});take(U-3,U+3,vv-3,vv+3);}
    for(const [U,V] of [[150,40],[200,40]]){const vv=sv*V;A.push({k:'well',cu:c0+U,cv:vv,y:g,u0:c0+U-1,u1:c0+U+1,v0:vv-1,v1:vv+1});take(U-3,U+3,vv-3,vv+3);}
    for(const [U,V] of [[162,46],[176,46],[190,46]]){const vv=sv*V;box('lgcook',U-2,U+2,vv-2,vv+2);take(U-3,U+3,vv-3,vv+3);}
    {const vv=sv*26;pc('lghosp',190,vv,7,31,sv>0?2:3,{col:WOOLR});take(172,208,vv-5,vv+5);}
    sp('r_market',176,sv*60,6);sp('r_farm',200,sv*80,5);sp('e_garden',190,sv*26,4);sp('e_aid',184,sv*20,4); // (healers and bearers by the field hospital, W3)
    for(let U=136;U<=230;U+=11)for(let V=12;V<=112;V+=8){const vv=sv*V;if(!free(U-4,U+4,vv-3,vv+3))continue;pc('lgtent',U,vv,5,7,0,{col:hsh(U,9749,V)<0.4?WOOLR:WOOLW});take(U-4,U+4,vv-3,vv+3);}}
}
// ---- Column builders of the camp (U = u - P.uC0, V = v)
const campE=(p,U,V)=>Math.min(U,p.cw-U,p.hv-Math.abs(V)); // how far in from the camp's edge
const campGateAt=(p,U,V)=>Math.abs(V)<=5&&(U<14||U>p.cw-14)||Math.abs(V)>p.hv-14&&Math.abs(U-p.cw/2)<=4;
// the ground: the streets gravelled between edges of beaten earth, the road inside the rampart, the rest trodden grass
RB.lgground=(s,p,u,v,X,Z)=>{const g=p.y,U=u-p.u0,V=v,av=Math.abs(V),e=campE(p,U,V),q=hsh(X,9751,Z);if(e<8)return;
  let id=q<0.3?PATH:q<0.42?DIRT:GRASS;
  if(av<=4&&U>=8&&U<=p.cw-8)id=av<=2?GRAVEL:PATH;else if(Math.abs(U-p.cw/2)<=3)id=Math.abs(U-p.cw/2)<=1?GRAVEL:PATH;else if(e<=12)id=q<0.7?PATH:GRAVEL;
  RBP(X,g,Z,id);RBS(X,Z,g+1,g+4,AIR);};
// the perimeter: a ditch four wide and three deep, the rampart behind it, a palisade of pointed logs on the rampart, walked
// behind at its top; the gates through it bridged
RB.lgwall=(s,p,u,v,X,Z)=>{const g=p.y,U=u-p.u0,e=campE(p,U,v);if(e>7)return;
  if(campGateAt(p,U,v)){RBP(X,g,Z,e<=3?PLANKS:PATH);RBS(X,Z,g+1,g+5,AIR);if(e<=3&&(Math.abs(v)===5||Math.abs(U-p.cw/2)===4))RBP(X,g+1,Z,FENCE);return;}
  if(e<=3){RBS(X,Z,g-2,g+3,AIR);RBP(X,g-3,Z,DIRT);if(e===1&&hsh(X,9753,Z)<0.35)RBP(X,g-2,Z,STAKES);return;}
  const top=e===5||e===6?g+2:g+1;RBS(X,Z,g,top-1,DIRT);RBP(X,top,Z,GRASS);RBS(X,Z,top+1,top+3,AIR);
  if(e===6){RBS(X,Z,g+3,g+6,LOG);RBP(X,g+7,Z,STAKES);}else if(e===7)RBP(X,g+3,Z,PLANKS);};
// the great gate's bridge between its towers at the height of their platforms, the banners of men, elves and dwarves hung from it
RB.lggate=(s,p,u,v,X,Z)=>{const g=p.y,av=Math.abs(v);RBP(X,g+14,Z,PLANKS);if(u===p.u0||u===p.u1)RBP(X,g+15,Z,FENCE);
  if(u===p.u0&&(av===2||av===5))RBS(X,Z,g+9,g+13,av===2?(v<0?RBANNER:EVBANNER):v<0?DBANNER:HBANNER);};
// the square before the pavilion: paved, its edge kerbed in stone
RB.lgsq=(s,p,u,v,X,Z)=>{const g=p.y,e=Math.min(u-p.u0,p.u1-u,v-p.v0,p.v1-v);RBP(X,g,Z,e===0?WSBRICK:(u+v)%7===0?FSTONE:PAVING);RBS(X,Z,g+1,g+4,AIR);};
// the muster field: trodden earth, posts for the drill at its edge
RB.lgmuster=(s,p,u,v,X,Z)=>{const g=p.y,q=hsh(X,9755,Z),e=Math.min(u-p.u0,p.u1-u,v-p.v0,p.v1-v);RBP(X,g,Z,q<0.6?PATH:q<0.85?DIRT:GRAVEL);
  if(e===0&&(u+v)%6===0){RBP(X,g+1,Z,LOG);RBP(X,g+2,Z,FENCE);}};
// a tent of canvas on a ridge pole (p.W across, p.D deep), its door toward its front, a band of its people's colour (p.col) along
// its ridge; poles out at its ends, a pennant (p.flag) on the front one; the dwarves' tents (p.low) a step lower
RB.lgtent=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,m=(W-1)/2,da=Math.abs(a-m),ry=g+(p.low?3:4)-Math.round(da),cv=p.canvas||CANVAS;
  RBP(X,g,Z,da<m?PATH:DIRT);
  for(let y=g+1;y<=ry;y++){const end=b===0||b===D-1,door=b===0&&da<1&&y<=g+2;RBP(X,y,Z,y===ry?(da<0.5?p.col:cv):end&&!door?cv:AIR);}
  if(da<0.5&&(b===0||b===D-1)){RBP(X,ry+1,Z,LOG);if(b===0&&p.flag)RBP(X,ry+2,Z,p.flag);}
  if(da<0.5&&b===D-2&&hsh(X,9757,Z)<0.4)RBP(X,g+1,Z,hsh(X,9759,Z)<0.5?BARREL:CRATE);};
// A pavilion (p.W across, p.D deep, its front toward p.f): walls of canvas in upright stripes of its colours (p.cols), five high
// (seven for the great one), a valance in the first colour under a roof pitched to a ridge along its depth; a door of three
// held open, poles at the corners crowned with pennants; within lamps hung from the ridge and, in the great one, the council's
// long table with its benches and the map laid on it
RB.lgpav3=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,big=!!p.big,wh=big?7:5,m=(W-1)/2,da=Math.abs(a-m),e=a===0||a===W-1||b===0||b===D-1,c=(a===0||a===W-1)&&(b===0||b===D-1);
  const cols=p.cols,stripe=cols[Math.floor(a/2)%cols.length],ry=g+wh+1+Math.round((m-da)*(big?0.5:0.6));
  RBP(X,g,Z,e?PLANKS:big?(b%4===1?WOOLR:PLANKS):PLANKS);
  for(let y=g+1;y<ry;y++){let id=AIR;if(e){id=y===g+wh?cols[0]:stripe;if(b===0&&da<=1.5&&y<=g+3)id=AIR;}RBP(X,y,Z,id);}
  RBP(X,ry,Z,da<0.6?LOG:(Math.floor(b/2)%2?CANVAS:cols[0]));
  if(c){RBS(X,Z,g+1,ry+2,LOG);RBP(X,ry+3,Z,cols[1]===WOOLK?RBANNER:cols[1]===WOOLB&&!big?EVBANNER:[RBANNER,EVBANNER,DBANNER][(a+b)%3]);}
  if(!e&&da<0.6&&b%5===2)RBP(X,ry-1,Z,LANTERN);
  if(big&&!e){const ta=Math.abs(a-m)<=2,tb=b>=4&&b<=D-5;if(ta&&tb){RBP(X,g+1,Z,DPROP);RBP(X,g+2,Z,da<=1&&b>=6&&b<=D-7?BOOKS:PLANKS);}else if((Math.abs(a-m)===3)&&tb&&b%2===0)RBP(X,g+1,Z,PLANKS);
    if(b===D-2&&da<=1)RBS(X,Z,g+1,g+2,da<0.5?GILDED:PLANKS);}};
// a tall pole crowned with a people's banner
RB.lgpole=(s,p,u,v,X,Z)=>{const g=p.y;RBP(X,g,Z,WSBRICK);RBS(X,Z,g+1,g+p.H,LOG);RBS(X,Z,g+p.H+1,g+p.H+3,p.id);};
// a lamp on a post
RB.lglamp=(s,p,u,v,X,Z)=>{const g=p.y;RBS(X,Z,g+1,g+2,LOG);RBP(X,g+3,Z,LANTERN);};
// the archery range: the shooting line marked in stone at its near end, three butts of hay with their marks at the far end,
// the lanes between fenced
RB.lgrange=(s,p,u,v,X,Z)=>{const g=p.y,b=u-p.u0,a=v-p.v0,W=p.v1-p.v0;RBP(X,g,Z,GRASS);RBS(X,Z,g+1,g+3,AIR);
  if(b===2)RBP(X,g,Z,FSTONE);if((a===0||a===W)&&b%3===0)RBP(X,g+1,Z,FENCE);
  if(b>=p.u1-p.u0-2&&b<=p.u1-p.u0-1&&a%7>=2&&a%7<=4&&a>0&&a<W){RBS(X,Z,g+1,g+3,HAYBALE);if(b===p.u1-p.u0-2&&a%7===3)RBP(X,g+2,Z,WOOLR);}};
// the dwarves' redoubt: a wall of granite four high with merlons, its gate toward the camp's middle (u = p.u0)
RB.lgred=(s,p,u,v,X,Z)=>{const g=p.y,e=Math.min(u-p.u0,p.u1-u,v-p.v0,p.v1-v);
  if(e>1){RBP(X,g,Z,hsh(X,9761,Z)<0.5?DFLAG:GRAVEL);RBS(X,Z,g+1,g+3,AIR);return;}
  if(u-p.u0<=1&&Math.abs(v-p.gv)<=3){RBP(X,g,Z,DFLAG);RBS(X,Z,g+1,g+4,AIR);if(e===0&&Math.abs(v-p.gv)===3)RBS(X,Z,g+1,g+6,DCOL);return;}
  for(let y=g;y<=g+4;y++)RBP(X,y,Z,y===g+4?DKNOT:y<=g+1?DGRAN:DCOURSE);if(e===0&&(u+v)%2===0)RBP(X,g+5,Z,DGRAN);};
// a second ram on its trestles, its head not yet hung
RB.lgram=(s,p,u,v,X,Z)=>{const g=p.y,b=u-p.u0,a=v-(p.v0+p.v1)/2,aa=Math.abs(a);
  if(aa<=1&&b>=1&&b<=13)RBS(X,Z,g+3,g+4,LOG);
  if((b===2||b===7||b===12)&&aa<=3){RBP(X,g+1,Z,DPROP);RBP(X,g+2,Z,aa<=1?DPROP:AIR);if(aa===3)RBP(X,g+2,Z,DPROP);}
  if(b===0&&aa<=2)RBS(X,Z,g+1,g+3,aa<=1?STEELB:DBRONZE);};
// kegs and crates stacked
RB.lgkegs=(s,p,u,v,X,Z)=>{const g=p.y,q=hsh(X,9763,Z);RBP(X,g+1,Z,q<0.6?BARREL:CRATE);if(q<0.45)RBP(X,g+2,Z,BARREL);};
// a wagon: a bed of planks on four wheels, a load under canvas
RB.lgwagon=(s,p,u,v,X,Z)=>{const g=p.y,b=u-p.u0,a=v-p.v0;if(a===1&&b>=1&&b<=5){RBP(X,g+2,Z,PLANKS);RBP(X,g+3,Z,b%2?CANVAS:CRATE);}
  if((a===0||a===2)&&(b===1||b===5))RBP(X,g+1,Z,DGEAR);if(a===1&&b===0)RBP(X,g+1,Z,DPROP);};
// a cook-fire: a ring of stones about the fire, a kettle on a chain from a frame over it
RB.lgcook=(s,p,u,v,X,Z)=>{const g=p.y,a=u-(p.u0+2),b=v-(p.v0+2),d=Math.max(Math.abs(a),Math.abs(b));
  if(d===0){RBP(X,g,Z,HEARTH);RBP(X,g+1,Z,TORCH);RBP(X,g+3,Z,CHAIN);RBP(X,g+4,Z,LOG);}else if(d===1&&(a===0||b===0))RBP(X,g+1,Z,COBBLE);
  else if(d===2&&a===0&&Math.abs(b)===2){RBS(X,Z,g+1,g+4,LOG);}else if(d===2&&b===0)RBP(X,g+4,Z,LOG);};
// the field hospital: a long tent open along its front, cots of wool down it
RB.lghosp=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,m=(D-1)/2,db=Math.abs(b-m),ry=g+5-Math.round(db*0.8),end=a===0||a===W-1;
  RBP(X,g,Z,PLANKS);for(let y=g+1;y<=ry;y++)RBP(X,y,Z,y===ry?(db<0.5?p.col:CANVAS):end||b===D-1?CANVAS:AIR);
  if(b===D-2&&a%3===1&&!end)RBP(X,g+1,Z,WOOLW);if(db<0.5&&a%6===3)RBP(X,ry-1,Z,LANTERN);};
