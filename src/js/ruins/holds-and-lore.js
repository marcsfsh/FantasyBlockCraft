// ---- Holds, lore and the extra layers of the undercity
const SYL1=['Kar','Dun','Khaz','Bar','Gor','Thal','Zir','Dur','Mor','Grim','Bael','Ost','Brun','Vor','Kel','Thra','Uld','Az'],SYL2=['ak','in','dum','gar','rak','heim','ul','ond','baz','grund','zar','mir','dor','nar','dek','hal'];
const GUILDS=['the Brasswrights','the Deep Delvers','the Rune Masons','the Lamplighters','the Ironbinders','the Gemcutters','the Brewers of the Black Vat','the Platinum Wardens','the Stonesingers'];
const holdC=new Map();
function holdOf(cx,cz){
  const hx=Math.floor(cx/8),hz=Math.floor(cz/8),k=ckey(hx,hz);let h=holdC.get(k);if(h)return h;
  const r=rngAt(hx,1301,hz),w=()=>SYL1[r()*SYL1.length|0]+SYL2[r()*SYL2.length|0];
  h={name:w()+(r()<0.35?' '+w():''),king:w(),queen:w(),guild:GUILDS[r()*GUILDS.length|0],year:120+(r()*880|0)};
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
  let gate='';{const cx=Math.floor(X/CS),cz=Math.floor(Z/CS);let bd=1e9,g=null;for(let a=-20;a<=20;a++)for(let b=-20;b<=20;b++){if(!gateAt(cx+a,cz+b))continue;const d=Math.hypot(a,b);if(d<bd){bd=d;g=[(cx+a)*CS+8-X,(cz+b)*CS+8-Z];}}
    if(g)gate=' Scratched beneath it: the way up to the surface is a gate about '+Math.round(Math.hypot(g[0],g[1])/10)*10+' paces to the '+compass(g[0],g[1])+'.';}
  const room=roomAt(X,Y,Z);
  if(room==='plaza')return 'A waymarker of '+h.name+'. '+(tr?'Carved arrows point toward the '+RUIN_NAMES[tr.t].replace('Dwarven ','').replace('The ','').toLowerCase()+', about '+Math.round(Math.hypot(tr.dx,tr.dz)/10)*10+' paces to the '+compass(tr.dx,tr.dz)+'.':'Most of the carved arrows have worn away.')+gate;
  return T[n]+hint+gate;
}
function openLore(X,Y,Z){
  const h=holdOf(Math.floor((X+OX)/CS),Math.floor((Z+OZ)/CS));
  invOpen=true;hold=-1;
  ['invgrid','invname','sinv','trade','bplist'].forEach(id=>{$(id).style.display='none';});
  $('invtitle').textContent='A page from '+h.name;$('lore').style.display='block';$('lore').textContent=loreText(X+OX,Y,Z+OZ);
  $('inv').style.display='grid';if(document.pointerLockElement)document.exitPointerLock();if(TOUCH)playing=false;
  tone(500,420,0.25,0.06);
}
// Surface gates lead down into the upper deep
function gateAt(cx,cz){return false&&isAvenue(cx,cz)&&!isPlaza(cx,cz)&&hsh(cx,1401,cz)<0.08&&!townAt(cx*CS+8,cz*CS+8,24)&&!roadAt(cx*CS+8,cz*CS+8,8);}
function dwGate(cx,cz,r){
  const yb=RUIN_Y[1],g=colInfo(cx,cz,T4).h,top=Math.max(g,yb+6);
  for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++){
    const edge=Math.abs(dx)===3||Math.abs(dz)===3;
    for(let y=yb-1;y<=top;y++)PW(cx+dx,y,cz+dz,edge?(y<g-1?dwWall(r):DWBRICK):(y===yb-1?DWTILE:AIR),MODE_SET);
  }
  const ring=[];for(let a=-2;a<2;a++)ring.push([a,-2]);for(let a=-2;a<2;a++)ring.push([2,a]);for(let a=2;a>-2;a--)ring.push([a,2]);for(let a=2;a>-2;a--)ring.push([-2,a]);
  for(let y=yb;y<=top;y++){const [dx,dz]=ring[(y-yb)%ring.length];PW(cx+dx,y-1,cz+dz,DWTILE,MODE_SET);}
  for(let y=yb;y<=top;y++)PW(cx,y,cz,(y-yb)%8===4?RUNE:DWPILLAR,MODE_SET);
  // the gatehouse on the surface
  for(let dx=-5;dx<=5;dx++)for(let dz=-5;dz<=5;dz++){
    const d=Math.max(Math.abs(dx),Math.abs(dz));if(d<=3)continue;
    for(let y=top-4;y<top;y++)PW(cx+dx,y,cz+dz,DWBRICK,MODE_FILL);
    PW(cx+dx,top,cz+dz,DWTILE,MODE_SET);for(let y=top+1;y<=top+8;y++)PW(cx+dx,y,cz+dz,AIR,MODE_SET);
  }
  for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++)if(Math.max(Math.abs(dx),Math.abs(dz))===3&&!((dx===0||dz===0)))PW(cx+dx,top+1,cz+dz,DWBRICK,MODE_SET);
  for(const [a,b] of [[-4,-4],[4,-4],[-4,4],[4,4]]){for(let y=top+1;y<=top+6;y++)PW(cx+a,y,cz+b,DWPILLAR,MODE_SET);PW(cx+a,top+7,cz+b,GLOW,MODE_SET);}
  for(let k=-4;k<=4;k++){PW(cx+k,top+7,cz-4,DWBRICK,MODE_SET);PW(cx+k,top+7,cz+4,DWBRICK,MODE_SET);}
  PW(cx,top+7,cz-4,GOLDB,MODE_SET);PW(cx,top+7,cz+4,GOLDB,MODE_SET);PW(cx,top+6,cz-4,RUNE,MODE_SET);PW(cx,top+6,cz+4,RUNE,MODE_SET);
  for(const [a,b] of [[-5,0],[5,0],[0,-5],[0,5]])brazierP(cx+a,top+1,cz+b);
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
function canalEdge(cx,cz,dx,dz,L){if(dx<0||dz<0)return canalEdge(cx+dx,cz+dz,-dx,-dz,L);return hsh(cx*2+dx,L*97+88+dz*7,cz*2+dz)<0.16;}
