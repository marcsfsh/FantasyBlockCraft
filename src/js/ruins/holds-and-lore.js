// ---- Holds, lore and the extra layers of the undercity
const GUILDS=['the Brasswrights','the Deep Delvers','the Rune Masons','the Lamplighters','the Ironbinders','the Gemcutters','the Brewers of the Black Vat','the Platinum Wardens','the Stonesingers'];
const holdC=new Map();
function holdOf(cx,cz){ // the name and history of the hold a chunk belongs to
  const H0=holdNear(cx,cz),hx=H0.rx,hz=H0.rz,k=ckey(hx,hz);let h=holdC.get(k);if(h)return h;
  const r=rngAt(hx,1301,hz);
  h={name:fullName('dwarf',r,r()<0.35),king:nameWord('dwarf',r),queen:nameWord('dwarf',r),guild:GUILDS[r()*GUILDS.length|0],year:120+(r()*880|0)};
  holdC.set(k,h);return h;
}
function compass(dx,dz){const a=Math.atan2(dz,dx)*180/Math.PI,dirs=['east','southeast','south','southwest','west','northwest','north','northeast'];return dirs[((Math.round(a/45)%8)+8)%8];}
function findTreasure(X,Z){
  const cx=Math.floor(X/CS),cz=Math.floor(Z/CS);let best=null,bd=1e9;
  for(let a=-8;a<=8;a++)for(let b=-8;b<=8;b++)for(let L=0;L<2;L++){const t=ruinType(cx+a,cz+b,L);if(t==='vault'||t==='throne'||t==='grandthrone'||t==='temple'){const d=Math.hypot(a,b);if(d>0&&d<bd){bd=d;best={t:t,dx:(cx+a)*CS+8-X,dz:(cz+b)*CS+8-Z,L:L};}}}
  return best;
}
// ---- Hold chronicles (M7, Q27, Q28): each hold has eight pages in order, from its founding to its fall, or to the present day
// for an inhabited hold. The text is a draft for the owner's approval (docs/LORE.md). The chronicle uses its own stream, so the
// hold's name, king, queen, guild and year stay as they were.
const CHRON_N=8;
const CHRON_CAUSE=[ // what turned the hold's fortune: [the warning, the lean years, the leaving]
  ['The lower shafts grow warm. The fire below rises a hand each season, and the deepest gates weep with heat.','The lowest halls are sealed one by one. The forges are moved up into the rooms where the scribes once worked.','The fire reached the second deep this spring. We carry out what we can lift and leave the rest to the heat.'],
  ['The veins are thinning. The tin of the eastern drifts is gone, and the copper comes up poorer every month.','Fewer carts go out to the surface markets. The young ones leave to seek work in other holds and few of them return.','There is nothing left to dig that is worth the digging. The council votes to leave, and no one speaks against it.'],
  ['The roof of the eastern hall cracked in the night. The Stonesingers say the mountain has shifted in its sleep.','Props of oak hold up three of the great halls. No one sleeps under the long gallery any more.','The roof has come down twice in one month. The king says we will return when the stone is quiet again.'],
  ['A cold spring broke into the cisterns and has not stopped. The lower streets stand ankle deep in water.','The pumps run day and night. The brewers have moved their vats to the upper deep and complain of the stairs.','The water has taken the lower deep. We leave the pumps running for whoever comes after us.'],
  ['The guilds quarrel over the shares of the brass. Two of them have walled off their own halls and keep their own gates.','The market is half empty. Each guild trades only with its own, and the king cannot make them meet.','The guilds leave one by one, each by its own gate, each saying the others drove them out.']
];
function holdChronicle(cx,cz){
  const H0=holdNear(cx,cz),h=holdOf(cx,cz);if(h.pages)return h.pages;
  const r=rngAt(H0.rx,1303,H0.rz),cause=CHRON_CAUSE[r()*CHRON_CAUSE.length|0],G=h.guild[0].toUpperCase()+h.guild.slice(1),y=[h.year];
  for(let k=1;k<CHRON_N;k++)y.push(y[k-1]+8+(r()*60|0));
  const work=['a cavern of living crystal that hums at night','a library of four hundred shelves cut into the living rock','a throne hall whose pillars are carved with the names of every delver','cisterns deep enough to keep the hold through a hundred dry years'][r()*4|0];
  const P=[
    ['The Founding','In the year '+y[0]+' King '+h.king+' led the first delvers into the mountain and named the place '+h.name+'. The first hall was cut in a single winter, and the first lamp was lit in it on the longest night.'],
    ['The First Deep','Year '+y[1]+'. '+G+' broke through to the first deep and found tin and copper in good seams. The forges were lit, and it was decreed that they should never go out while the hold stood.'],
    ['The Market Days','Year '+y[2]+'. Brass for wheat, wheat for ale, ale for stories. Traders from the surface come up the gate road every season, and Queen '+h.queen+' buys every lantern in the row.'],
    ['The Great Work','Year '+y[3]+'. After long years of cutting, the hold has finished '+work+'. The masons who began it did not live to see it done, and their names are cut over its door.'],
    ['The Warning','Year '+y[4]+'. '+cause[0]],
    ['The Lean Years','Year '+y[5]+'. '+cause[1]]
  ];
  if(H0.inhabited){
    P.push(['The Holding','Year '+y[6]+'. We did not leave. '+G+' found new work for every hand, and the lamps of '+h.name+' were never let go out.']);
    P.push(['The Present Day','Year '+y[7]+'. The halls of '+h.name+' still ring with hammers. The gates stand open to anyone who comes in peace, though fewer travellers come up the old roads each year.']);
  }else{
    P.push(['The Leaving','Year '+y[6]+'. '+cause[2]]);
    P.push(['The Last Page','Year '+y[7]+'. Roster of the last watch of '+h.name+': eleven names, then a twelfth in a shaking hand. Below it, the words "the lamps are out", and nothing more.']);
  }
  h.pages=P;return P;
}
// which page of its hold's chronicle a lectern holds
const lecternPage=(X,Y,Z)=>Math.floor(hsh(X,1307+Y,Z)*CHRON_N);
function loreText(X,Y,Z){
  const cx=Math.floor(X/CS),cz=Math.floor(Z/CS),h=holdOf(cx,cz),k=lecternPage(X,Y,Z);
  const tr=findTreasure(X,Z);
  const hint=tr?' A margin note in another hand: the '+RUIN_NAMES[tr.t].replace('Dwarven ','').replace('The ','').toLowerCase()+' lies about '+Math.round(Math.hypot(tr.dx,tr.dz)/10)*10+' paces to the '+compass(tr.dx,tr.dz)+(tr.L?', on the upper deep.':', on the lower deep.'):'';
  const room=roomAt(X,Y,Z);let gate='';
  {const gs=holdGates(holdNear(cx,cz));let bd=1e9,g=null;for(const q of gs){const dx=q.cx*CS+8-X,dz=q.cz*CS+8-Z,d=Math.hypot(dx,dz);if(d<bd){bd=d;g=[dx,dz];}}
    if(g)gate=' Scratched beneath it: the way up to the surface is a gate about '+Math.round(bd/10)*10+' paces to the '+compass(g[0],g[1])+', on the upper deep.';}
  if(room==='plaza')return 'A waymarker of '+h.name+'. '+(tr?'Carved arrows point toward the '+RUIN_NAMES[tr.t].replace('Dwarven ','').replace('The ','').toLowerCase()+', about '+Math.round(Math.hypot(tr.dx,tr.dz)/10)*10+' paces to the '+compass(tr.dx,tr.dz)+'.':'Most of the carved arrows have worn away.')+gate;
  return holdChronicle(cx,cz)[k][1]+hint+gate;
}
// A text card in the inventory frame: the lectern's page, the journal, a rune tablet
function showText(title,text){
  invOpen=true;hold=-1;
  ['invgrid','invname','sinv','bplist','invsearch'].forEach(id=>{$(id).style.display='none';});
  $('invtitle').textContent=title;$('lore').style.display='block';$('lore').textContent=text;
  $('inv').style.display='grid';if(document.pointerLockElement)document.exitPointerLock();if(TOUCH)playing=false;
}
function openLore(X,Y,Z){
  const WX=X+OX,WZ=Z+OZ,cx=Math.floor(WX/CS),cz=Math.floor(WZ/CS),h=holdOf(cx,cz),plaza=roomAt(WX,Y,WZ)==='plaza',k=lecternPage(WX,Y,WZ);
  showText(plaza?'A waymarker of '+h.name:h.name+', page '+(k+1)+' of '+CHRON_N+': '+holdChronicle(cx,cz)[k][0],loreText(WX,Y,WZ));
  if(!plaza)journalPage(cx,cz,k);
  tone(500,420,0.25,0.06);
}
// ---- Hold gates (Q22, Q72): up to three per hold, on avenues in the hold's outer ring under the highest dry ground, at least
// eight cells apart. A spiral stair climbs a shaft from the upper floor (y82) to a gatehouse terrace on the surface.
const gateC=new Map(),TG={};
function holdGates(h){
  const key=ckey(h.rx,h.rz);let out=gateC.get(key);if(out)return out;if(gateC.size>400)gateC.clear();
  const cand=[],R=Math.ceil(h.R*1.4);
  for(let a=-R;a<=R;a++)for(let b=-R;b<=R;b++){const cx=h.cx+a,cz=h.cz+b,d=holdReach(h,cx,cz);if(d<0.5||d>=0.95)continue;
    if(!isAvenue(cx,cz)||isPlaza(cx,cz)||inDelf(cx,cz)||stairAt(cx,cz))continue;
    colInfo(cx*CS+8,cz*CS+8,TG);if(TG.wet||TG.lake||TG.river||TG.h<=SEA+2||TG.rvBot<999)continue;
    cand.push({cx:cx,cz:cz,s:TG.h+hsh(cx,1401,cz)*30});}
  cand.sort((p,q)=>q.s-p.s);out=[];
  for(const c of cand){if(out.length>=3)break;if(out.every(o=>Math.hypot(o.cx-c.cx,o.cz-c.cz)>=8))out.push(c);}
  gateC.set(key,out);return out;
}
function gateAt(cx,cz){return ruinZone(cx,cz)&&holdGates(holdNear(cx,cz)).some(g=>g.cx===cx&&g.cz===cz);}
// The terrace sits at the highest ground under it, so the hillside never buries it
function gateTop(X,Z){let t=RUIN_Y[1]+6;for(let a=-5;a<=5;a+=5)for(let b=-5;b<=5;b+=5)t=Math.max(t,colInfo(X+a,Z+b,TG).h);return t;}
// Is a surface column taken by a gatehouse? (trees, boulders and other surface features stay off it)
function gateNear(X,Z,m){const e=7+(m||0),cx=Math.floor(X/CS),cz=Math.floor(Z/CS);if(!ruinZone(cx,cz)&&!ruinZone(Math.floor((X+e)/CS),cz)&&!ruinZone(Math.floor((X-e)/CS),cz)&&!ruinZone(cx,Math.floor((Z+e)/CS))&&!ruinZone(cx,Math.floor((Z-e)/CS)))return false;
  for(const g of holdGates(holdNear(cx,cz)))if(Math.abs(X-(g.cx*CS+8))<=e&&Math.abs(Z-(g.cz*CS+8))<=e)return true;return false;}
const GATE_RING=[];for(let a=-2;a<2;a++)GATE_RING.push([a,-2]);for(let a=-2;a<2;a++)GATE_RING.push([2,a]);for(let a=2;a>-2;a--)GATE_RING.push([a,2]);for(let a=2;a>-2;a--)GATE_RING.push([-2,a]);
function dwGate(cx,cz,r){ // cx,cz: block coordinates of the cell's centre
  const yb=RUIN_Y[1],g=colInfo(cx,cz,TG).h,top=gateTop(cx,cz);
  // the shaft: walls, a 3 x 3 core, and a floor at the upper deep
  for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++){const m=Math.max(Math.abs(dx),Math.abs(dz));
    for(let y=yb-1;y<=top;y++)PW(cx+dx,y,cz+dz,m===3?(y<g-1?dwWall(r):DWBRICK):m<=1?(y===yb-1?DWTILE:(y-yb)%8===4&&m===1&&(dx===0||dz===0)?RUNE:DWPILLAR):(y===yb-1?DWTILE:AIR),MODE_SET);}
  // a spiral stair, one step up per block of height; the last step is at top-1
  for(let y=yb;y<=top;y++){const [dx,dz]=GATE_RING[(y-yb)%GATE_RING.length];PW(cx+dx,y-1,cz+dz,DWTILE,MODE_SET);}
  // doors at the bottom on the east, south and west (the north door would open under the third step)
  for(const [a,b] of [[3,0],[0,3],[-3,0]])for(let y=yb;y<yb+3;y++)PW(cx+a,y,cz+b,AIR,MODE_SET);
  // the terrace: a brick platform around the shaft, cleared above
  for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++){const m=Math.max(Math.abs(dx),Math.abs(dz));
    if(m>=4){for(let y=top-5;y<top;y++)PW(cx+dx,y,cz+dz,DWBRICK,MODE_FILL);PW(cx+dx,top,cz+dz,m===6?DWBRICK:DWTILE,MODE_SET);}
    for(let y=top+1;y<=top+9;y++)PW(cx+dx,y,cz+dz,AIR,MODE_SET);}
  // the way out at the top: through the shaft wall beside the last step
  {const [dx,dz]=GATE_RING[(top-yb)%GATE_RING.length],ox=Math.abs(dx)===2?Math.sign(dx)*3:dx,oz=Math.abs(dx)===2?dz:Math.sign(dz)*3;PW(cx+ox,top,cz+oz,DWTILE,MODE_SET);}
  // four pillars carrying lintels, braziers, a little rubble
  for(const [a,b] of [[-5,-5],[5,-5],[-5,5],[5,5]]){for(let y=top+1;y<=top+6;y++)PW(cx+a,y,cz+b,DWPILLAR,MODE_SET);}
  for(let k=-5;k<=5;k++){PW(cx+k,top+7,cz-5,DWBRICK,MODE_SET);PW(cx+k,top+7,cz+5,DWBRICK,MODE_SET);}
  PW(cx,top+7,cz-5,GOLDB,MODE_SET);PW(cx,top+7,cz+5,GOLDB,MODE_SET);PW(cx,top+6,cz-5,RUNE,MODE_SET);PW(cx,top+6,cz+5,RUNE,MODE_SET);
  for(const [a,b] of [[-6,0],[6,0],[0,-6],[0,6]])brazierP(cx+a,top+1,cz+b);
  {const gs=holdGates(holdNear(Math.floor(cx/CS),Math.floor(cz/CS)));if(gs.length&&gs[0].cx*CS+8===cx&&gs[0].cz*CS+8===cz){PW(cx+4,top+1,cz-4,WAYSTONE,MODE_SET);PW(cx+4,top+2,cz-4,WAYSTONE,MODE_SET);PW(cx+4,top+3,cz-4,CALCITE,MODE_SET);}} // the hold's waystone
  for(let k=0;k<6;k++){const a=(r()*13|0)-6,b=(r()*13|0)-6;if(Math.max(Math.abs(a),Math.abs(b))>=4&&r()<0.6*curI)PW(cx+a,top+1,cz+b,r()<0.5?COBBLE:GRAVEL,MODE_AIR);}
}
// A chasm room: a deep drop to the lava with stone bridges along open corridors
function dwChasm(cx,cz,yb,r,L,WCX,WCZ){
  const bottom=9,ex=edgeOpen(WCX,WCZ,1,0,L)||edgeOpen(WCX,WCZ,-1,0,L),ez=edgeOpen(WCX,WCZ,0,1,L)||edgeOpen(WCX,WCZ,0,-1,L);
  for(let dx=-7;dx<=7;dx++)for(let dz=-7;dz<=7;dz++){
    const X=cx+dx,Z=cz+dz,openSide=(dx===7&&ruinType(WCX+1,WCZ,L)==='chasm')||(dx===-7&&ruinType(WCX-1,WCZ,L)==='chasm')||(dz===7&&ruinType(WCX,WCZ+1,L)==='chasm')||(dz===-7&&ruinType(WCX,WCZ-1,L)==='chasm'),rim=Math.max(Math.abs(dx),Math.abs(dz))===7&&!openSide;
    for(let y=bottom;y<=yb+6;y++)PW(X,y,Z,rim&&y>=yb?dwWall(r):(y<=bottom+1?LAVA:AIR),MODE_SET);
    PW(X,yb+7,Z,dwWall(r),MODE_SET);
  }
  const narrow=curI>0.7,BW=narrow?0:2;
  const bridge=(alongX)=>{for(let t=-7;t<=7;t++)for(let w=-BW;w<=BW;w++){const X=cx+(alongX?t:w),Z=cz+(alongX?w:t);
    PW(X,yb-1,Z,narrow?DWBRICK:Math.abs(w)<=1?DWTILE:DWBRICK,MODE_SET);PW(X,yb-2,Z,DWBRICK,MODE_SET);
    if(Math.abs(w)===2)PW(X,yb,Z,t%3===0?DWPILLAR:DWBRICK,MODE_SET);
    if(Math.abs(w)===2&&t%6===0)PW(X,yb+1,Z,GLOW,MODE_SET);
    if(!w&&t%5===0&&Math.abs(t)<7)for(let y=bottom+2;y<yb-2;y++)PW(X,y,Z,DWPILLAR,MODE_SET);}};
  if(ex||!ez)bridge(true);if(ez)bridge(false);
}
// Hidden cellar under a cracked floor tile
function dwCellar(cx,cz,yb,h){
  const x=cx-h+3,z=cz+h-3,r=rngAt(x,yb+19,z);
  for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let y=yb-6;y<=yb-2;y++){const edge=Math.abs(dx)===2||Math.abs(dz)===2||y===yb-6;PW(x+dx,y,z+dz,edge?DWBRICK:AIR,MODE_SET);}
  PW(x,yb-1,z,DWCRACK,MODE_SET);
  PW(x-1,yb-5,z-1,DWCHEST,MODE_SET);PW(x+1,yb-5,z-1,r()<0.5?DWCHEST:GOLDB,MODE_SET);PW(x+1,yb-5,z+1,r()<0.4?PLATB:GOLDB,MODE_SET);PW(x-1,yb-3,z+1,RUNE,MODE_SET);
}
// Floods, overgrowth and old fires make rooms feel abandoned
function dwCondition(cx,cz,yb,h,c){
  for(let dx=-h+1;dx<=h-1;dx++)for(let dz=-h+1;dz<=h-1;dz++){
    const X=cx+dx,Z=cz+dz,f=GW(X,yb-1,Z),a=GW(X,yb,Z),q=hsh(X,yb,Z);
    if(c==='flooded'){if(a===AIR&&f>0&&SOLID[f]&&q<0.92)PW(X,yb-1,Z,WATER,MODE_SET);} // the floor itself lies under water, so no walls of water stand at the doorways
    else if(c==='overgrown'){if(f===DWTILE&&q<0.6)PW(X,yb-1,Z,MOSSY,MODE_SET);if(a===AIR&&q<0.08)PW(X,yb,Z,GLOWSHROOM,MODE_SET);}
    else if(c==='burned'){if(f===DWTILE&&q<0.35)PW(X,yb-1,Z,OBSID,MODE_SET);if((a===PLANKS||a===BOOKS||a===BARREL)&&q<0.6)PW(X,yb,Z,COBBLE,MODE_SET);}
  }
}
