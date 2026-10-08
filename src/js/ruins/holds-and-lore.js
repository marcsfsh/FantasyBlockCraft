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
function loreText(X,Y,Z){
  const cx=Math.floor(X/CS),cz=Math.floor(Z/CS),h=holdOf(cx,cz),r=rngAt(X,Y+500,Z),n=r()*13|0;
  const tr=findTreasure(X,Z);
  const hint=tr?' A margin note in another hand: the '+RUIN_NAMES[tr.t].replace('Dwarven ','').replace('The ','').toLowerCase()+' lies about '+Math.round(Math.hypot(tr.dx,tr.dz)/10)*10+' paces to the '+compass(tr.dx,tr.dz)+(tr.L?', on the upper deep.':', on the lower deep.'):'';
  const T=[
    'Ledger of '+h.name+', year '+h.year+'. Forty carts of tin from the eastern drifts, eleven of zinc. '+h.guild[0].toUpperCase()+h.guild.slice(1)+' demand a larger share of the brass.',
    'By decree of King '+h.king+': no lamp shall be put out in the Great Hall while the deep fires burn. Let the halls of '+h.name+' never go dark.',
    'We broke into a cavern of living crystal today. The Rune Masons say it hums at night. Queen '+h.queen+' has forbidden anyone to cut it.',
    'Third warning from the lower shafts. The lava rises a hand each season. '+h.guild[0].toUpperCase()+h.guild.slice(1)+' have begun to seal the deepest gates.',
    'Recipe of the Black Vat: mushroom caps, wheat from the surface traders, and patience. Never serve it to a king before noon.',
    'The moonsilver seams lie below the second deep, near the fire. Only steel bites them. The old picks of '+h.name+' were forged with runes for this.',
    'We are leaving. The roof of the eastern hall has come down twice this month. King '+h.king+' says we will return to '+h.name+' when the stone is quiet.',
    'Account of the treasury, year '+(h.year+3)+': gold enough to plate the throne twice over. The rest is kept beneath the floor where only the stewards know.',
    'To whoever reads this: the cracked tiles are not all damage. Some of us hid our savings under them.',
    'Roster of the night watch, year '+(h.year+11)+'. Eleven names, then a twelfth in a shaking hand, then nothing.',
    'The cisterns are full again. '+h.guild[0].toUpperCase()+h.guild.slice(1)+' say the springs above the upper deep will last a thousand years if no one digs too greedily.',
    'Market day in '+h.name+'. Brass for mushrooms, mushrooms for ale, ale for stories. Queen '+h.queen+' bought every lantern in the row.',
    'Song of the hammer, verse four: strike once for the stone, once for the king, once for the ones below who never saw the sun.'
  ];
  const room=roomAt(X,Y,Z);let gate='';
  {const gs=holdGates(holdNear(cx,cz));let bd=1e9,g=null;for(const q of gs){const dx=q.cx*CS+8-X,dz=q.cz*CS+8-Z,d=Math.hypot(dx,dz);if(d<bd){bd=d;g=[dx,dz];}}
    if(g)gate=' Scratched beneath it: the way up to the surface is a gate about '+Math.round(bd/10)*10+' paces to the '+compass(g[0],g[1])+', on the upper deep.';}
  if(room==='plaza')return 'A waymarker of '+h.name+'. '+(tr?'Carved arrows point toward the '+RUIN_NAMES[tr.t].replace('Dwarven ','').replace('The ','').toLowerCase()+', about '+Math.round(Math.hypot(tr.dx,tr.dz)/10)*10+' paces to the '+compass(tr.dx,tr.dz)+'.':'Most of the carved arrows have worn away.')+gate;
  return T[n]+hint+gate;
}
function openLore(X,Y,Z){
  const h=holdOf(Math.floor((X+OX)/CS),Math.floor((Z+OZ)/CS));
  invOpen=true;hold=-1;
  ['invgrid','invname','sinv','bplist'].forEach(id=>{$(id).style.display='none';});
  $('invtitle').textContent='A page from '+h.name;$('lore').style.display='block';$('lore').textContent=loreText(X+OX,Y,Z+OZ);
  $('inv').style.display='grid';if(document.pointerLockElement)document.exitPointerLock();if(TOUCH)playing=false;
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
