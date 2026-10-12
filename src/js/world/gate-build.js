// ---- Building the Gate of the Wastes (D-067). The gate's works are one site in the gate's frame (u outward, v across, as
// siteUV gives it; the yard at u < 0, the camp of the allied hosts far out at u > 0), its level the gate's height, with a layout
// of parts like a realm's: the gate between its towers, its leaves (one barred and propped, the other ajar), the dwarves' ram
// at the barred leaf under its shed, the covered way back to the siege lines, mantlets, the lines with their engines, the orcs'
// camp in the yard (gateLayout), and the camp of the hosts (campLayout, siege-build.js). A chunk builds its own columns only,
// part by part in the layout's order; then the road down (wgRoadCol). Pure functions of the plan.
const TGB={};
function wgSite(P){if(P.s)return P.s;
  const s={k:'wgate',X:P.X,Z:P.Z,dir:P.din,T:P.hG,R:0,M:0,P:P,id:P.id,seed:P.seed,name:P.camp,prov:{cult:REALM_CULTS.white,key:'wg:'+P.id,kingdom:{name:'The Allied Hosts'}}},L={parts:[],spots:[],pads:[]};
  P.s=s;s.lay=L;P.cs=hsh(P.X,9709,P.Z)<0.5?1:-1; // the side of the barred leaf (v > 0 or v < 0); the ram stands before it
  gateLayout(P,s,L,rngAt(P.X,9711,P.Z));campLayout(P,s,L,rngAt(P.X,9713,P.Z));
  for(const p of L.parts){p.bu0=Math.min(p.u0,p.u1);p.bu1=Math.max(p.u0,p.u1);p.bv0=Math.min(p.v0,p.v1);p.bv1=Math.max(p.v0,p.v1);}
  return s;}
// the half-width of the level works at u (the pass, the field of the siege lines)
function wgHalf(P,u){for(const q of wgPieces(P))if(u>=q[0]&&u<=q[1])return q[2]+(q[3]-q[2])*(u-q[0])/Math.max(1,q[1]-q[0]);return 0;}
// the way the war parties march between the camp and the orcs' camp in the yard (the gate's frame, from the camp inward): out of
// the camp's great gate, through the gate of the lines, up the pass clear of the covered way and the ram, through the gap by
// the open leaf's edge, to the opening in the barricades before the orcs' gate and into their camp. The works keep off it.
function wgWay(P){if(P.way)return P.way;const cs=P.cs,y=P.yc;
  return P.way=[[P.uC0+4,0],[P.uL+14,0],[P.uL+4,0],[P.uL-6,0],[44,-cs*14],[22,-cs*4],[8,-cs*2],[-2,-cs*2],[-14,-cs*2],[-17,y.vm],[-26,y.vm],[-34,y.vm],[y.ua+16,y.vm]];}
// how far (u,v) lies from a line of points
function wgLineD(pts,u,v){let bd=1e9;for(let i=0;i+1<pts.length;i++){const [a0,b0]=pts[i],[a1,b1]=pts[i+1],ex=a1-a0,ez=b1-b0,l2=ex*ex+ez*ez||1,t=Math.max(0,Math.min(1,((u-a0)*ex+(v-b0)*ez)/l2));bd=Math.min(bd,Math.hypot(u-a0-ex*t,v-b0-ez*t));}return bd;}
function gateLayout(P,s,L,r){
  const g=P.hG,cs=P.cs,A=L.parts,uY=P.uY,uF=P.uF,uC0=P.uC0,box=(k,u0,u1,v0,v1,o)=>A.push(Object.assign({k:k,u0:u0,u1:u1,v0:v0,v1:v1,y:g},o||{}));
  const sd=P.side,ua=uY+6,ubk=-28,v0=sd>0?-46:-24,v1=sd>0?24:46,vm=(v0+v1)>>1;P.yc={ua:ua,ub:ubk,v0:v0,v1:v1,vm:vm};P.uL=uF+10;const way=wgWay(P);
  // the ground of the works first: the yard trodden to ash, the pass scarred by the siege, the field before the lines trampled
  box('gground',uY-2,uC0+2,-128,128);
  // the gate: its wall across the throat, keyed into the cliffs, the towers either side, the leaves
  box('gwall',-16,12,-52,52);
  // the dwarves' ram at the barred leaf, under its shed on eight wheels; the covered way back from it to the lines
  const uL=P.uL;
  box('gram',1,32,cs>0?2:-18,cs>0?18:-2);
  box('ggall',32,uL-1,cs>0?6:-14,cs>0?14:-6,{cv:cs*10});
  // mantlets about the pass, propped and facing the gate
  for(let k=0;k<9;k++){const u=36+Math.floor(r()*(uL-44)),v=Math.round((r()-0.5)*2*(wgHalf(P,u)-8));if(Math.abs(v-cs*10)<8||wgLineD(way,u,v)<9)continue;box('gmant',u-1,u+1,v-2,v+2);}
  // the siege lines across the field: a ditch, a rampart and a palisade, their gate in the middle between two towers, ballistae
  const hw=Math.floor(wgHalf(P,uL+4))-3;box('gline',uL,uL+8,-hw,hw,{hw:hw,cv:cs*10});
  for(const sv of [-1,1]){A.push(partC('gtwr',uL+6,sv*9,5,5,0,{y:g,H:12}));A.push(partC('gball',uL+11,sv*30,3,3,0,{y:g}));}
  // behind the lines: the dwarves' trebuchets with their shot, a siege tower of men ready to be wheeled up, wagons of shot
  const ub=uL+12;
  for(const tv of [-44,-20,20,44])if(Math.abs(tv)+6<wgHalf(P,ub+12)){A.push(partC('dtreb',ub+6,tv,7,12,0,{y:g}));box('gshot',ub+13,ub+15,tv-2,tv+2);}
  A.push(partC('gsiege',ub+6,-cs*Math.min(68,Math.floor(wgHalf(P,ub+6))-10),7,7,0,{y:g}));
  // ---- the orcs' camp in the yard: barricades of stakes across it facing the gate, a palisade round the camp (open on the side
  // the road leaves), the warlord's hall at its back, tents of hide, a forge by a trough of lava, a cage for the troll, the war
  // drum, two stone-throwers aimed at the gate, fires, skull poles and banners; the road paved from the gate's gap to its head
  box('opath',uY,-4,-50,50);
  box('ospike',-24,-19,-46,46);
  box('opal',ua,ubk,v0,v1,{gv:vm});
  A.push(partC('ohall',ua+8,vm,21,11,1,{y:g}));
  for(let k=0;k<5;k++){const tv=v0+6+k*Math.floor((v1-v0-12)/4);if(Math.abs(tv-vm)<5)continue;A.push(partC('otent',ubk-6,tv,5,7,1,{y:g}));if(k%2)A.push(partC('otent',ubk-16,tv,5,7,1,{y:g}));}
  A.push(partC('oforge',ua+20,v0+8,9,9,3,{y:g}));A.push(partC('ocage',ua+20,v1-7,7,7,2,{y:g}));
  A.push(partC('odrum',ubk-12,vm+7,5,5,1,{y:g})); // (the avenue down the camp's middle, |v - vm| < 4, is kept clear for the warbands)
  for(const cv of [vm-13,vm+13])A.push(partC('ocata',ubk-4,cv,5,9,1,{y:g}));
  for(const [pu,pv] of [[ubk-2,vm-6],[ubk-2,vm+6],[ua+18,vm-6],[ua+18,vm+6],[ubk-20,v0+4],[ubk-20,v1-4]])box('opole',pu,pu,pv,pv);
  // where they all stand (for the war, war.js): kinds of the foes' tables and the folk's; y over the level
  const sp=(kind,u,v,R,y)=>L.spots.push({kind:kind,u:u,v:v,R:R||4,y:y||g});
  sp('ogate',-12,-cs*4,3);sp('ocamp',ubk-10,vm,7);sp('ocamp',ua+12,vm+(sd>0?-12:12),6);sp('oforge',ua+20,v0+8,4);sp('opit',ua+20,v1-7,2);sp('owall',-1,-12,2,g+49);sp('owall',-1,14,2,g+49);
  sp('d_ram',16,cs*10,4);sp('r_mant',40,-cs*14,5);sp('d_treb',ub+8,-20,5);sp('d_treb',ub+8,20,5);sp('r_lines',uL+10,0,4);sp('e_lines',uL+10,cs*28,4);
}
// ---- Column builders
// The ground of the works: the yard trodden to ash and cinder; before the gate scorched, pocked with the craters of the
// throwers' stones and strewn with them; the field before the lines trampled
RB.gground=(s,p,u,v,X,Z)=>{const P=s.P,g=s.T,o=colInfo(X,Z,TGB);if(!o.wlvl||o.wroad>=0||Math.abs(o.h-g)>1)return;const q=hsh(X,9715,Z);
  if(u<-4){RBP(X,g,Z,q<0.45?CINDER:q<0.9?BLACKASH:BASCRACK);RBS(X,Z,g+1,g+3,AIR);return;}
  if(u<=P.uF+4){const cu=Math.round(u/13)*13,cv=Math.round(v/13)*13,ch=hsh(cu,9717,cv),d=Math.hypot(u-cu-(ch-0.5)*5,v-cv-(hsh(cv,9719,cu)-0.5)*5),cr=2+ch*2.5;
    if(u>6&&ch<0.45&&d<cr){RBP(X,g,Z,AIR);RBP(X,g-1,Z,d<cr-1?SCORCH:CINDER);if(d<0.8&&ch<0.25){RBP(X,g-1,Z,STONE);RBP(X,g,Z,COBBLE);}return;}
    RBP(X,g,Z,q<0.3?SCORCH:q<0.65?CINDER:q<0.95?BLACKASH:GRAVEL);RBS(X,Z,g+1,g+3,AIR);return;}
  const top=world[I(X-OX,g,Z-OZ)];if(top===GRASS||top===DIRT)RBP(X,g,Z,q<0.35?PATH:q<0.55?DIRT:GRASS);RBS(X,Z,g+1,g+3,AIR);};
// The Ashen Gate. A wall of basalt seven thick across the throat of the pass, 48 high, keyed into the cliffs either side; the
// gateway 41 wide under a pointed arch 39 high, the Emberlord's horned skull carved over it with eyes of ember glyphs; a tower
// either side 15 square and 64 high, hollow, its floors joined by a ladder, slits in its walls, a door from the yard and one
// onto the wall's walk, a crown of spikes and a brazier on its top, banners down its outer face. The barred leaf (side cs) is
// iron plates over black timber, banded, battered by the ram, three great props behind it; the other leaf hangs ajar, swung in
// 38 degrees about its hinge, its bar broken on the ground behind it
const WG_SIGIL=["hh.............hh",".hh...xxxxx...hh.","..hhxxxxxxxxxhh..","...xxeexxxeexx...","...xxeexxxeexx...","....xxxx.xxxx....",".....xx.x.xx.....","......x.x.x......"];
const wgArch=(g,w)=>g+30+Math.round(9*(1-Math.min(1,w/20.5)));
RB.gwall=(s,p,u,v,X,Z)=>{const P=s.P,g=s.T,cs=P.cs,av=Math.abs(v),au=Math.abs(u),sv=v*cs,q=(y)=>hsh(X*7+y,9721,Z);
  const stone=y=>y<=g+3?OBSBRICK:(y-g)%9===0?BASCARVE:q(y)<0.14?BASCRACK:BASBRICK;
  // the towers
  if(av>=20&&av<=36&&au<=10){const core=av>=21&&av<=35&&au<=9;
    if(!core){for(let y=g-4;y<=g+6;y++)RBP(X,y,Z,y===g+6?BASCARVE:OBSBRICK); // the battered foot
      if(u===10&&(av===25||av===31))RBS(X,Z,g+30,g+46,BANNER);if(u===-10&&av===28)RBS(X,Z,g+20,g+30,BANNER);return;}
    const top=g+64,inner=av>=24&&av<=32&&au<=6,lad=av===24&&u===-6;
    for(let y=g-4;y<=top;y++){let id=stone(y);
      if(inner&&y>g){id=(y-g)%8===0&&!lad?BASTILE:AIR;if(lad&&y<top)id=LADDER;}
      if(!inner&&y>g){const slit=(au>=7&&(av===26||av===30)||au<=6&&av>=33&&(u===-3||u===3))&&(y-g)%8>=3&&(y-g)%8<=4&&y<top-4;if(slit)id=AIR;
        if(u<=-7&&av>=27&&av<=29&&y<=g+4)id=AIR; // the door from the yard
        if(av<=23&&au<=1&&y>=g+49&&y<=g+51)id=AIR; // the door onto the walk
        if(au===9&&y===g+40&&(av===24||av===28||av===32))id=EMGLYPH;}
      RBP(X,y,Z,id);}
    // the top: a parapet with crenels, pinnacles at the corners crowned with spikes, a brazier on a pillar in the middle
    const rim=av===21||av===35||au===9,corner=(av===21||av===35)&&au===9;
    if(rim){RBP(X,top+1,Z,BASBRICK);if((av+au)%2===0)RBP(X,top+2,Z,BASBRICK);if((av+au)%2===0&&hsh(X,9723,Z)<0.25)RBP(X,top+3,Z,SKULLS);}
    if(corner){RBS(X,Z,top+1,top+5,BASPILLAR);RBP(X,top+6,Z,SPIKES);}
    if(av===28&&u===0){RBP(X,top+1,Z,BASPILLAR);RBP(X,top+2,Z,BRAZIER);}
    return;}
  // what the leaves, the props and the bar put in this column at y (0 where none)
  let lf=0,lt=0;
  if(sv>=1&&sv<=20&&au<=1){lf=1;lt=wgArch(g,av);} // the barred leaf, in the gateway's middle
  else if(sv<=0&&sv>=-21&&u<=1&&u>=-15){const th=0.66,ex=-20*Math.sin(th),ey=20*Math.cos(th),t=Math.max(0,Math.min(1,(u*ex+(sv+20.5)*ey)/400)),d=Math.hypot(u-ex*t,sv+20.5-ey*t);
    if(d<=1.05){lf=2;lt=wgArch(g,20.5-t*20);}} // the leaf ajar, swung in about its hinge at (0, -cs*20.5)
  const prop=u<=-2&&u>=-14&&(sv===4||sv===5||sv===11||sv===12||sv===17||sv===18)?Math.round(g+13-(-2-u)*1.1):0;
  const extra=y=>{if(lf&&y>g&&y<lt){const band=(y-g)%10===4||(y-g)%10===5;if(lf===1){if(u===-1)return ORCLOG;if(u===1&&sv>=8&&sv<=12&&y>=g+3&&y<=g+7&&hsh(X*5+y,9727,Z)<0.35)return AIR;return sv===1||band?ORCIRON:GATEIRON;}return band?ORCIRON:GATEIRON;}
    if(prop&&(y===prop||y===prop-1))return ORCLOG;if(prop&&u===-14&&y===g+1)return BASBRICK;
    if(y===g+1&&(u===-17&&sv<=-6&&sv>=-16&&sv!==-10||u===-16&&(sv===-11||sv===-10)))return ORCIRON; // the bar, broken
    return 0;};
  // the wall, the gateway and its arch
  if(au<=3&&av<=50){const ar=wgArch(g,av);
    for(let y=g-4;y<=g+48;y++){let id=stone(y);
      if(av<=20&&y>g&&y<ar)id=extra(y)||AIR; // the way through
      else if(av<=20&&y===g)id=BASTILE;
      else if(av<=20&&(y===ar||y===ar+1)&&au===3)id=BASCARVE; // the voussoirs
      else if(av<=20&&y===ar&&au<=1&&av%5===2)id=GRATE; // murder holes
      if(u===3&&av<=8&&y>=g+40&&y<=g+47){const c=WG_SIGIL[g+47-y][v+8];if(c==='x'||c==='h')id=BASCARVE;else if(c==='e')id=EMGLYPH;else id=OBSBRICK;}
      if(u===3&&y===g+43&&av>=11&&av<=20&&av%3===0)id=EMGLYPH;
      RBP(X,y,Z,id);}
    // the walk along the top behind crenels, braziers along it
    if(au===3){if((v&1)===0)RBP(X,g+49,Z,BASBRICK);if((v&1)===0&&hsh(X,9725,Z)<0.12)RBP(X,g+50,Z,SKULLS);}
    else{RBP(X,g+48,Z,BASTILE);if(u===-2&&av%12===6&&av<=20)RBP(X,g+49,Z,BRAZIER);}
    return;}
  for(let y=g+1;y<=g+40;y++){const id=extra(y);if(id)RBP(X,y,Z,id);}};
// The dwarves' ram: a beam of three logs square, 29 long, its head of steel in a collar of bronze against the barred leaf,
// hung on chains from the cross-beams of its shed; the shed on posts of oiled timber, its roof of bronze plates, on eight
// wheels; bars at its back for the crew, the banner of the mountain over it
RB.gram=(s,p,u,v,X,Z)=>{const P=s.P,g=s.T,a=v*P.cs-10,aa=Math.abs(a),b=u;
  // the head and the beam
  if(aa<=2&&b>=2&&b<=4){for(let y=g+3;y<=g+7;y++){const c=aa<=1&&y>=g+4&&y<=g+6;RBP(X,y,Z,b===2?(c?STEELB:DBRONZE):DBRONZE);}}
  if(aa<=1&&b>=5&&b<=30)for(let y=g+4;y<=g+6;y++)RBP(X,y,Z,LOG);
  if(b>=4&&b<=28){
    // posts, beams, the roof
    if(aa===6&&b%6===4)RBS(X,Z,g+1,g+7,DPROP);
    if(aa===6)RBP(X,g+8,Z,DPROP);
    if(aa<=6&&(b===8||b===16||b===24)){RBP(X,g+8,Z,DPROP);if(aa<=1&&a===0)RBP(X,g+7,Z,CHAIN);}
    if(aa<=7){const ry=g+9+Math.round((7-aa)*0.55);RBP(X,ry,Z,aa===0?DPROP:DBRONZE);if(aa===7)RBP(X,ry-1,Z,DBRONZE);}
    if(a===0&&b===26){RBS(X,Z,g+13,g+15,DPROP);RBP(X,g+16,Z,DBANNER);RBP(X,g+17,Z,DBANNER);}}
  // the wheels, each a rim of timber with its spokes about an iron hub, outside the posts
  if(aa===7)for(const bc of [7,13,20,27]){const db=b-bc;if(Math.abs(db)>3)continue;for(let y=g+1;y<=g+5;y++){const dy=y-(g+2.5),r=Math.hypot(db,dy);
    if(r<0.9)RBP(X,y,Z,DGEAR);else if(r>=1.6&&r<2.7||r<1.6&&(db===0||Math.abs(dy)<0.6))RBP(X,y,Z,DPROP);}}
  if(b===30&&aa<=5&&aa>=2)RBP(X,g+3,Z,DPROP);};
// The covered way from the ram back to the lines: posts every six, a roof of mantlets, its sides of mantlets to shoulder height
// with gaps to step out
RB.ggall=(s,p,u,v,X,Z)=>{const g=s.T,a=v-p.cv,aa=Math.abs(a);if(aa>3)return;
  if(aa===3&&u%6===0){RBS(X,Z,g+1,g+4,DPROP);RBP(X,g+5,Z,MANTLET);return;}
  RBP(X,g+5,Z,MANTLET);if(aa===3&&u%12!==3)RBS(X,Z,g+1,g+2,MANTLET);};
// a mantlet: a wall of heavy planks 5 across and 3 high facing the gate, propped from behind
RB.gmant=(s,p,u,v,X,Z)=>{const g=s.T,b=u-p.u0,a=v-p.v0;if(b===0)RBS(X,Z,g+1,g+3,MANTLET);else if(b===1&&(a===0||a===4))RBP(X,g+2,Z,DPROP);else if(b===2&&(a===0||a===4))RBP(X,g+1,Z,DPROP);};
// The siege lines: a ditch three deep toward the gate with stakes in its bottom, the spoil thrown up behind it into a rampart,
// a palisade of logs pointed at their tops along it; the way through in the middle, bridged over the ditch
RB.gline=(s,p,u,v,X,Z)=>{const g=s.T,b=u-p.u0,av=Math.abs(v),gap=av<=4||Math.abs(v-p.cv)<=3,end=av>p.hw-2;
  if(gap){RBP(X,g,Z,b<=3?PLANKS:PATH);RBS(X,Z,g+1,g+3,AIR);return;} // the way through, bridged; a sally port where the covered way meets it
  if(b<=3&&!end){RBS(X,Z,g-2,g,AIR);RBP(X,g-3,Z,DIRT);if(b===1&&hsh(X,9729,Z)<0.4)RBP(X,g-2,Z,STAKES);return;}
  if(b>=4&&b<=7){const top=b===5||b===6?g+2:g+1;RBS(X,Z,g+1,top-1,DIRT);RBP(X,top,Z,GRASS);
    if(b===6&&!end){RBS(X,Z,g+3,g+5,LOG);RBP(X,g+6,Z,STAKES);}}};
// a timber tower 5 square on the lines (or the camp's rampart), p.H high, a platform with a rail and a roof of canvas
RB.gtwr=(s,p,u,v,X,Z)=>{const [a,b]=partAB(p,u,v),g=p.y,H=p.H,e=a===0||a===4||b===0||b===4,c=(a===0||a===4)&&(b===0||b===4);
  if(c)RBS(X,Z,g+1,g+H+3,LOG);
  if(e&&!c&&a!==2)RBP(X,g+H+1,Z,FENCE);
  RBP(X,g+H,Z,a===2&&b===2?AIR:PLANKS);if(a===2&&b===2)for(let y=g+1;y<g+H;y++)RBP(X,y,Z,LADDER);
  if(e&&!c&&(b===0||b===4)&&a!==2)for(let y=g+2;y<g+H;y+=3)RBP(X,y,Z,LOG);
  RBP(X,g+H+4,Z,CANVAS);if(a===2&&b===2){RBP(X,g+H+5,Z,LOG);RBP(X,g+H+6,Z,RBANNER);}};
// a ballista on its platform: the bow across, the stock along, a bolt laid in it
RB.gball=(s,p,u,v,X,Z)=>{const [a,b]=partAB(p,u,v),g=p.y;if(a===1&&b===1){RBP(X,g,Z,PLANKS);RBP(X,g+1,Z,DPROP);return;}
  if(b===0)RBP(X,g+1,Z,a===1?STEELB:DPROP);if(a===1&&b===2)RBP(X,g+1,Z,DPROP);};
// a heap of stone shot for the throwers
RB.gshot=(s,p,u,v,X,Z)=>{const g=s.T,c=(p.u0+p.u1)/2,d=Math.hypot(u-c,v-(p.v0+p.v1)/2);RBP(X,g+1,Z,hsh(X,9731,Z)<0.5?STONE:COBBLE);if(d<1.5)RBP(X,g+2,Z,STONE);};
// A siege tower of men, 7 square and 24 high, on its wheels: a frame of timber, its front and sides hung with hides, floors
// with ladders, a drawbridge raised at the top of its front, a banner over it
RB.gsiege=(s,p,u,v,X,Z)=>{const [a,b]=partAB(p,u,v),g=p.y,e=a===0||a===6||b===0||b===6,c=(a===0||a===6)&&(b===0||b===6),T=g+24;
  if(e&&(b===1||b===5)&&(a===0||a===6)){RBP(X,g+1,Z,DGEAR);}
  for(let y=g+2;y<=T;y++){let id=AIR;if(c)id=LOG;else if(e)id=b===6&&y<T-6&&(y-g)%6===0?AIR:(y-g)%6===0?LOG:b===6?PLANKS:HIDE;if((y-g)%6===2&&!e)id=a===3&&b===3?AIR:PLANKS;if(!e&&a===1&&b===1&&y>g+2)id=LADDER;RBP(X,y,Z,id);}
  if(b===0&&a>=1&&a<=5)RBS(X,Z,T-5,T,PLANKS); // the drawbridge, raised
  if(a===3&&b===3){RBS(X,Z,T+1,T+3,LOG);RBP(X,T+4,Z,RBANNER);RBP(X,T+5,Z,RBANNER);}
  if(!e)RBP(X,T,Z,PLANKS);};
// ---- the orcs' camp in the yard
// the paved way from the gate's gap to the head of the road down, through the barricades; skull poles and fire baskets by it
RB.opath=(s,p,u,v,X,Z)=>{const P=s.P,g=s.T,y=P.yc,cs=P.cs;
  const pts=[[-4,-cs*3],[-26,-cs*3],[-26,P.side*36],[P.uY+8,P.side*36]];
  for(let k=0;k+1<pts.length;k++){const [a0,b0]=pts[k],[a1,b1]=pts[k+1],ex=a1-a0,ez=b1-b0,l2=ex*ex+ez*ez||1,t=Math.max(0,Math.min(1,((u-a0)*ex+(v-b0)*ez)/l2)),d=Math.hypot(u-a0-ex*t,v-b0-ez*t);
    if(d<=2.5){RBP(X,g,Z,d>=2?BASBRICK:BASTILE);RBS(X,Z,g+1,g+3,AIR);return;}}};
// barricades of stakes across the yard toward the gate, two rows, open before the gap of the leaf ajar and before the orcs' gate
RB.ospike=(s,p,u,v,X,Z)=>{const g=s.T,av=Math.abs(v),P=s.P;if(Math.abs(v+P.cs*3)<=4||Math.abs(v-P.yc.vm)<=4)return;if(u===-24||u===-20){if((v&1)===0)RBP(X,g+1,Z,STAKES);if(hsh(X,9733,Z)<0.3)RBP(X,g+2,Z,SPIKES);}};
// the camp's palisade: black logs, pointed, banners here and there; its gate toward the gate (u = p.u1), a way out toward the road
RB.opal=(s,p,u,v,X,Z)=>{const g=s.T,e=u===p.u0||u===p.u1||v===p.v0||v===p.v1;if(!e)return;
  if(u===p.u1&&Math.abs(v-p.gv)<=3)return;if(u===p.u0&&Math.abs(v-p.gv)<=2)return;const sv=s.P.side;if((sv>0?v===p.v1:v===p.v0)&&u<=p.u0+10)return;
  const tall=hsh(X,9735,Z)<0.3?1:0;RBS(X,Z,g+1,g+4+tall,ORCLOG);RBP(X,g+5+tall,Z,hsh(X,9737,Z)<0.1?BANNER:STAKES);};
// a tent of hide on a ridge pole, its door toward its front
RB.otent=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,m=(W-1)/2,da=Math.abs(a-m),ry=g+4-Math.round(da);
  for(let y=g+1;y<=ry;y++){const end=b===0||b===D-1,door=b===0&&da<1&&y<=g+2;if(y===ry||end&&!door)RBP(X,y,Z,HIDE);else RBP(X,y,Z,AIR);}
  if(da<0.5&&(b===0||b===D-1))RBP(X,g+5,Z,CHARWOOD);RBP(X,g,Z,BLACKASH);};
// The warlord's hall: walls of black palisade under a roof of hide on rafters, its door toward the gate under skulls; within, a
// long fire of magma, a seat of iron and bones at the back between braziers
RB.ohall=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,m=(W-1)/2,da=Math.abs(a-m),e=a===0||a===W-1||b===0||b===D-1,ry=g+6+Math.round((m-da)*0.6);
  RBP(X,g,Z,e?BASBRICK:BASTILE);
  for(let y=g+1;y<ry;y++){let id=AIR;if(e)id=y<=g+5?ORCLOG:HIDE;if(b===0&&da<=1.5&&y<=g+4)id=AIR;if(e&&a%4===0&&y===g+3&&b>0)id=AIR;RBP(X,y,Z,id);}
  RBP(X,ry,Z,da<0.6?CHARWOOD:HIDE);
  if(b===0&&da<=2.5&&da>1.5)RBP(X,g+5,Z,SKULLS);
  if(!e&&da<0.6&&b>=2&&b<=D-4)RBP(X,g,Z,MAGMA);
  if(!e&&b===D-2&&da<0.6){RBP(X,g+1,Z,ORCIRON);RBP(X,g+2,Z,BONES);}
  if(!e&&b===D-2&&da>=2&&da<3)RBP(X,g+1,Z,BRAZIER);};
// a forge in the yard: a smelter of basalt glowing at its mouth with a chimney, a trough of lava a block down, anvils
RB.oforge=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y;RBP(X,g,Z,BASTILE);
  if(b>=D-3&&a>=2&&a<=6){const e=a===2||a===6||b===D-1;for(let y=g+1;y<=g+6;y++)RBP(X,y,Z,e?((y-g)%3===1?EMBRICK:BASBRICK):y===g+1?MAGMA:AIR);if(a===4&&b===D-3)RBS(X,Z,g+7,g+10,BASCRACK);}
  if(b>=1&&b<=2&&a>=1&&a<=7){RBP(X,g-2,Z,BASBRICK);if(a===1||a===7){RBP(X,g-1,Z,BASBRICK);RBP(X,g,Z,BASBRICK);}else{RBP(X,g-1,Z,LAVA);RBP(X,g,Z,AIR);}}
  if(b===4&&(a===2||a===6)){RBP(X,g+1,Z,BASBRICK);RBP(X,g+2,Z,ORCIRON);}
  if(b===0&&(a===0||a===8))RBS(X,Z,g+1,g+3,ORCLOG);};
// the troll's cage of iron grates, bones within
RB.ocage=(s,p,u,v,X,Z)=>{const [a,b,W,D]=partAB(p,u,v),g=p.y,e=a===0||a===W-1||b===0||b===D-1;RBP(X,g,Z,BASTILE);
  for(let y=g+1;y<=g+5;y++)RBP(X,y,Z,y===g+5?ORCIRON:e?(b===0&&a===3&&y<=g+3?AIR:GRATE):AIR);if(!e&&hsh(X,9739,Z)<0.2)RBP(X,g+1,Z,BONES);};
// the war drum: a great drum of hide on a platform, braziers either side
RB.odrum=(s,p,u,v,X,Z)=>{const [a,b]=partAB(p,u,v),g=p.y,d=Math.hypot(a-2,b-2);RBP(X,g+1,Z,CHARWOOD);if(d<1.6){RBS(X,Z,g+2,g+3,HIDE);RBP(X,g+4,Z,HIDE);}
  if((a===0||a===4)&&b===2)RBP(X,g+2,Z,BRAZIER);};
// a stone-thrower of black timber aimed at the gate: two frames, the arm cocked back with a boulder in its cup
RB.ocata=(s,p,u,v,X,Z)=>{const [a,b]=partAB(p,u,v),g=p.y;
  if((a===0||a===4)&&b>=1&&b<=7)RBP(X,g+1,Z,ORCLOG);if((a===0||a===4)&&(b===3||b===5))RBS(X,Z,g+2,g+4,ORCLOG);if(a>=0&&a<=4&&b===4)RBP(X,g+5,Z,a===2?ORCIRON:ORCLOG);
  if(a===2){for(let bb=1;bb<=8;bb++)if(b===bb){const y=Math.round(g+5+(bb-4)*0.6);RBP(X,y,Z,ORCLOG);}if(b===8){RBP(X,g+8,Z,BASCRACK);}}};
// a pole of black timber crowned with skulls, a fire basket by it
RB.opole=(s,p,u,v,X,Z)=>{const g=s.T;RBS(X,Z,g+1,g+3,CHARWOOD);RBP(X,g+4,Z,SKULLS);};
// ---- The road down (The Long Descent): paved in basalt tiles between kerbs of basalt bricks, a low wall along its edge over
// the drop; every forty blocks skull poles and fire baskets
function wgRoadCol(P,segs,X,Z){const n=wgRoadNear(P,segs,X,Z),d=n[0];if(d>WG_RW+0.5)return;const g=hAt(X,Z),y=Math.round(n[2]);if(Math.abs(g-y)>1)return;
  const L=Math.floor(n[1]),edge=d>WG_RW-1,low=n[3]===P.ramp.drop?1:0;
  RBP(X,g,Z,d<4?BASTILE:edge?BASBRICK:hsh(X,9741,Z)<0.5?CINDER:BLACKASH);RBS(X,Z,g+1,g+4,AIR);
  if(edge&&low)RBP(X,g+1,Z,BASBRICK);
  if(d>WG_RW-2.5&&d<=WG_RW-1.5&&L%40===20){if(low){RBS(X,Z,g+1,g+3,CHARWOOD);RBP(X,g+4,Z,SKULLS);}else{RBP(X,g+1,Z,BASBRICK);RBP(X,g+2,Z,BRAZIER);}}}
// ---- Names: the place at (X,Z) among a gate's works (the readout and the map): the road down, the camp (the pavilion in it),
// the ram, the siege lines and the pass before the gate, the gate itself, the orcs' camp in the yard
function wasteGateName(X,Z){if(wgSkip)return null;for(const t of wgTile(X,Z)){const P=t.P,[u,v]=wgUV(P,X,Z);
  if(t.segs.length&&wgRoadNear(P,t.segs,X,Z)[0]<=WG_RW&&u<P.uY+4)return P.road;
  let on=false;for(const q of wgPieces(P))if(wgOut(q,u,v)<=2)on=true;if(!on)continue;const cs=wgSite(P)&&P.cs;
  if(u>=P.uC0)return u>=P.uC0+132&&u<=P.uC0+150&&Math.abs(v)<=13?'The Pavilion of the Three Banners':P.camp;
  if(u>=1&&u<=32&&Math.abs(v*cs-10)<=8)return P.ram;
  if(u>16)return 'The Siege Lines of '+P.camp.replace(/^The /,'the ');
  return u>=-16?P.name:P.yard;}return null;}
// ---- Per chunk: every gate whose works reach the chunk builds the parts over its columns, then the road down
function applyGates(WCX,WCZ){
  const x0=WCX*CS,z0=WCZ*CS,T=wgTile(x0,z0);if(!T.length)return;genLit=true;
  try{for(const t of T){const P=t.P,s=wgSite(P),L=s.lay;let u0=1e9,u1=-1e9,v0=1e9,v1=-1e9;
      for(const [X,Z] of [[x0,z0],[x0+CS-1,z0],[x0,z0+CS-1],[x0+CS-1,z0+CS-1]]){const [u,v]=siteUV(s,X,Z);u0=Math.min(u0,u);u1=Math.max(u1,u);v0=Math.min(v0,v);v1=Math.max(v1,v);}
      const ps=L.parts.filter(p=>!(p.bu1<u0||p.bu0>u1||p.bv1<v0||p.bv0>v1));
      if(ps.length)for(let lz=0;lz<CS;lz++)for(let lx=0;lx<CS;lx++){const X=x0+lx,Z=z0+lz,[u,v]=siteUV(s,X,Z);for(const p of ps)if(u>=p.bu0&&u<=p.bu1&&v>=p.bv0&&v<=p.bv1)RB[p.k](s,p,u,v,X,Z);}
      if(t.segs.length)for(let lz=0;lz<CS;lz++)for(let lx=0;lx<CS;lx++)wgRoadCol(P,t.segs,x0+lx,z0+lz);}}
  finally{genLit=false;}}
