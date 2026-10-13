// ---- The ruins of the old kingdom (D-089): what is left of the realm the high men held before the white kingdoms of this age,
// across the gentle lands, the steppe, the moors and the barrow hills, outside the living realms and clear of every other
// place. About one chunk in eleven of those lands is tried for one (most fail on uneven ground, water or a place near): the Kings' Gate, two colossal kings of stone either side of an old
// road, their left hands raised toward whoever comes; the crowned king at a crossroads of old paving, seated on his throne, his
// head broken off and lying beside him in a crown of flowers; a fallen city, the stumps of its walls about the footings of its
// houses, a toppled tower, a dry fountain in its square; an old beacon on a height, a round platform up steps with its great
// hearth gone cold; the tomb of a forgotten king, a portico of columns before a broken house of stone with his effigy within.
// Each is weathered whitestone, cracked and mossed, with a chest of the old kings (OLDLOOT) and a name in the realm's style.
// Pure per chunk; each reaches at most 22 blocks from its middle, so the chunks about it build it (applyOld); it keeps every
// other feature off (oldNear), and keeps off the elder elves' ruins (it asks elderNear; they never ask for it).
const OLD_LANDS={green:['crossroads','citadel','beacon','tomb'],farm:['crossroads','tomb','citadel'],orchard:['tomb','crossroads','beacon'],flower:['colossi','tomb','crossroads'],
  terrace:['citadel','colossi','beacon'],steppe:['colossi','beacon','tomb','citadel'],moors:['beacon','tomb','colossi'],barrow:['tomb','beacon','crossroads'],willow:['crossroads','tomb']};
const OLD_NAMES={colossi:"The Kings' Gate of %",crossroads:'The Crowned King of %',citadel:'The Fallen City of %',beacon:'The Old Beacon of %',tomb:'The Tomb of King %'};
// what a chest of the old kings holds: [item, least, most, weight] (the realm's relics join it: men.js)
const OLDLOOT=[[204,2,6,8],[205,1,2,3],[228,1,3,3],[224,1,3,4],[223,1,2,3],[206,2,5,5],[201,4,10,5],[327,1,3,2],[GOLDB,1,1,0.6]];
const oldC=new Map(),TOK={},TOK2={};
function oldAt(WCX,WCZ){
  const key=WCX*65536+WCZ;if(oldC.has(key))return oldC.get(key);if(oldC.size>20000)oldC.clear();let s=null;
  if(hsh(WCX,8971,WCZ)<0.09){const X=WCX*CS+8,Z=WCZ*CS+8;colInfo(X,Z,TOK);const L=OLD_LANDS[LANDS[TOK.land].k],g=TOK.h;
    if(L&&!TOK.wet&&!TOK.river&&!TOK.bank&&!TOK.lake&&TOK.rvBot===999&&g>TOK.sl+3&&g+40<H&&!surfTaken(X,Z,22)&&!sigNear(X,Z,22)&&!smallNear(X,Z,22)&&!pondNear(X,Z,22)&&!elderNear(X,Z,24)){
      const kind=L[Math.floor(hsh(WCX,8973,WCZ)*L.length)],R=kind==='citadel'?18:kind==='colossi'?16:kind==='crossroads'?20:kind==='tomb'?13:11;let lo=g,hi=g;
      for(let k=0;k<12;k++){const a=k/12*6.283;for(const d of [R*0.5,R]){const e=colInfo(X+Math.round(Math.cos(a)*d),Z+Math.round(Math.sin(a)*d),TOK2);if(e.wet||e.river||e.lake||e.h<e.sl+2)lo=-1e9;lo=Math.min(lo,e.h);hi=Math.max(hi,e.h);}}
      for(let a=-3;a<=3&&lo>-1e9;a++)for(let b=-3;b<=3;b++){const f=fallAt(WCX+a,WCZ+b);if(f&&f.path.some(([x,z])=>Math.hypot(x-X,z-Z)<R+3)){lo=-1e9;break;}}
      if(hi-lo<=(kind==='beacon'?12:kind==='citadel'||kind==='crossroads'?9:7)){const rn=rngAt(WCX,8975,WCZ),nm=kind==='tomb'?nameWord('human',rn):nameWord('realm',rn);
        s={kind:kind,X:X,Z:Z,g:g,R:R,dir:Math.floor(hsh(WCX,8977,WCZ)*4),name:OLD_NAMES[kind].replace('%',nm)};}}}
  oldC.set(key,s);return s;
}
function oldNear(X,Z,m){const cx=Math.floor(X/CS),cz=Math.floor(Z/CS);for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const s=oldAt(cx+a,cz+b);if(s&&Math.hypot(X-s.X,Z-s.Z)<=s.R+(m||0))return s;}return null;}
function applyOld(WCX,WCZ){for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const s=oldAt(WCX+a,WCZ+b);if(s)oldBuild(s);}}
function oldBuild(s){
  const r=mkRng(1+Math.floor(hsh(s.X,8979,s.Z)*2147483000)),[fx,fz]=ELD4[s.dir],g=s.g;
  // local (a, b): a along the ruin's way, b across it
  const XZ=(a,b)=>[s.X+a*fx-b*fz,s.Z+a*fz+b*fx],P=(a,b,y,id,m)=>{const [x,z]=XZ(a,b);PW(x,y,z,id,m||MODE_SET);},G=(a,b)=>{const [x,z]=XZ(a,b);return hAt(x,z);};
  const old=(q,id)=>q<0.35?OLDSTONE:id; // weathered here and there
  const floor=(a,b,y,id)=>{const gg=G(a,b);for(let yy=gg+1;yy<y;yy++)P(a,b,yy,WSROUGH);if(gg<y-6)return;P(a,b,y,id);for(let yy=y+1;yy<=Math.max(y+1,gg+1);yy++)P(a,b,yy,AIR);};
  const flower=(a,b,y,q)=>{const [x,z]=XZ(a,b);PW(x,y,z,[FLOWR,FLOWY,OXEYE,LAVENDER][Math.floor(q*4)%4],MODE_AIR);};
  const chest=(a,b,y)=>{P(a,b,y-1,WSROUGH);P(a,b,y,OLDCHEST);P(a,b,y+1,AIR);};
  // the old road's paving, broken and grown over, from a0 to a1 along b = 0 (w either side)
  const road=(a0,a1,w,across)=>{for(let a=a0;a<=a1;a++)for(let b=-w;b<=w;b++){const q=hsh(a*3+b,8981,s.X);if(q<0.3)continue;const [aa,bb]=across?[b,a]:[a,b],gg=G(aa,bb);P(aa,bb,gg,Math.abs(b)===w?OLDSTONE:q<0.5?OLDSTONE:PAVING);}};
  // a colossal king of stone standing on his plinth facing -a, his left hand raised palm out; built in boxes of weathered stone
  const colossus=(cb,sd)=>{const gp=g+1,top=gp+4,box=(a0,a1,b0,b1,y0,y1,id)=>{for(let a=a0;a<=a1;a++)for(let b=b0;b<=b1;b++)for(let y=y0;y<=y1;y++)P(a,cb+b*sd,y,typeof id==='function'?id(a,b,y):id);};
    for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++){const gg=G(a,cb+b*sd);for(let y=gg+1;y<=top;y++)P(a,cb+b*sd,y,y===top?WSTRIM:y===top-1&&(Math.abs(a)===3||Math.abs(b)===3)?WSCARVE:WSROUGH);}
    const w=(a,b,y)=>old(hsh(a*5+y,8983,b+sd),WSTONE);
    box(-1,1,-2,-1,top+1,top+8,w);box(-1,1,1,2,top+1,top+8,w); // the legs under the robe
    box(-2,2,-3,3,top+5,top+9,w); // the robe's hem
    box(-1,1,-2,2,top+10,top+16,w);box(-2,2,-3,3,top+15,top+17,w); // the body, the shoulders
    box(-1,1,-1,1,top+18,top+20,w);box(-1,1,-1,1,top+21,top+21,WSCARVE);P(0,cb,top+22,old(r(),WSTRIM)); // the head, the crown
    box(-1,0,3,3,top+10,top+14,w);box(-1,0,4,4,top+9,top+10,w); // the right arm down, its hand on a sword's pommel
    box(0,0,4,4,top+1,top+8,OLDSTONE); // the sword point-down
    box(-1,0,-3,-3,top+15,top+19,w);box(-2,-1,-4,-4,top+19,top+24,w);box(-3,-2,-4,-4,top+25,top+26,w); // the left arm raised, the hand
  };
  switch(s.kind){
    case 'colossi':{ // the Kings' Gate: the old road between two colossi, the stones of a fallen arch between them
      road(-16,16,2);colossus(-8,-1);colossus(8,1);
      for(let k=0;k<6;k++){const a=Math.round(r()*8-4),b=Math.round(r()*6-3),gg=G(a,b);P(a,b,gg+1,old(r(),WSBRICK));if(r()<0.4)P(a,b,gg+2,OLDSTONE);}
      chest(-6,-11,G(-6,-11)+1);break;}
    case 'crossroads':{ // the crowned king: two old roads crossing, the king seated on his throne at the crossing's corner facing it,
      // headless, his crowned head lying beside the throne ringed with flowers
      road(-20,20,1);road(-20,20,1,true);
      const ca=-5,cb=-5,top=G(ca,cb)+2;for(let a=ca-2;a<=ca+2;a++)for(let b=cb-2;b<=cb+2;b++){const gg=G(a,b);for(let y=gg+1;y<=top;y++)P(a,b,y,y===top?WSTRIM:WSROUGH);}
      for(let a=ca-1;a<=ca+1;a++)for(let b=cb-1;b<=cb+1;b++){P(a,b,top+1,OLDSTONE);P(a,b,top+2,a===ca-1?AIR:OLDSTONE);if(a===ca+1)for(let y=top+3;y<=top+6;y++)P(a,b,y,y===top+6?WSCARVE:OLDSTONE);} // the throne, its back toward +a
      for(let y=top+3;y<=top+6;y++)P(ca,cb,y,old(hsh(y,8985,s.Z),WSTONE));P(ca,cb-1,top+5,WSTONE);P(ca,cb+1,top+5,WSTONE);P(ca-1,cb,top+3,WSTONE); // the body, the shoulders, the knees
      const ha=ca-4,hb=cb-4,hg=G(ha,hb);P(ha,hb,hg+1,OLDSTONE);P(ha,hb,hg+2,GOLDB);P(ha+1,hb,hg+1,WSTONE); // the head on its side, crowned
      for(const [da,db] of [[-1,0],[1,1],[0,-1],[-1,1],[0,1],[1,-1]])flower(ha+da,hb+db,G(ha+da,hb+db)+1,hsh(da,8987,db));
      chest(ca+3,cb,G(ca+3,cb)+1);break;}
    case 'citadel':{ // the fallen city: the stumps of a square wall with a gate, the footings of houses, a toppled tower, a dry fountain
      const W=17;for(let a=-W;a<=W;a++)for(let b=-W;b<=W;b++){const m=Math.max(Math.abs(a),Math.abs(b)),gg=G(a,b),q=hsh(a,8989,b);
        if(m>=W-1){if(a===-W&&Math.abs(b)<=2)continue;const h=Math.floor(hsh(Math.floor((a+b)/3),8991,m)*6)-1;for(let y=gg+1;y<=gg+h;y++)P(a,b,y,old(hsh(a,y,b),WSBRICK));continue;}
        if(q<0.25)P(a,b,gg,OLDSTONE);else if(q<0.32)P(a,b,gg,PAVING);}
      for(const [cu,cv] of [[-8,-8],[-8,7],[6,-9],[7,6],[-1,-11]])for(let a=cu-3;a<=cu+3;a++)for(let b=cv-3;b<=cv+3;b++){if(Math.max(Math.abs(a-cu),Math.abs(b-cv))!==3||hsh(a,8993,b)<0.25)continue;const gg=G(a,b),h=1+Math.floor(hsh(b,8995,a)*3);for(let y=gg+1;y<=gg+h;y++)P(a,b,y,old(hsh(a,y,b),WSBRICK));}
      for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const m=Math.max(Math.abs(a),Math.abs(b)),gg=G(a,b);if(m===2){P(a,b,gg+1,old(r(),WSTRIM));}else{P(a,b,gg,WSROUGH);if(m===0)for(let y=gg+1;y<=gg+2;y++)P(a,b,y,OLDSTONE);}}
      for(let a=10;a<=14;a++)for(let b=-3;b<=3;b++){const d=Math.hypot(a-12,b);if(d>2.6)continue;const gg=G(a,b),h=d>1.6?4+Math.floor(hsh(a,8997,b)*6):0;for(let y=gg+1;y<=gg+h;y++)P(a,b,y,old(hsh(a,y,b),WSBRICK));}
      for(let k=0;k<5;k++){const b=4+k*2,gg=G(12,b);for(let a=11;a<=13;a++)if(hsh(a,8999,b)>0.25)P(a,b,G(a,b)+1,old(r(),WSBRICK));}
      chest(-12,12,G(-12,12)+1);break;}
    case 'beacon':{ // the old beacon: a round platform up steps, a ring of broken pillars, the great hearth in its middle, cold
      const Y=g+3;for(let a=-10;a<=10;a++)for(let b=-10;b<=10;b++){const d=Math.hypot(a,b);if(d>9.5)continue;
        if(d>7.5){const y=g+Math.round((9.5-d)*1.4);floor(a,b,y,old(hsh(a,9001,b),WSBRICK));continue;}
        floor(a,b,Y,d>6.5?WSTRIM:old(hsh(a,9003,b),PAVING));for(let y=Y+1;y<=Y+8;y++)P(a,b,y,AIR);
        if(d<2.2){P(a,b,Y+1,d<1.2?DSLAG:WSROUGH);if(d<1.2)P(a,b,Y+2,GRAVEL);}}
      for(let k=0;k<8;k++){const an=k*Math.PI/4,a=Math.round(Math.cos(an)*5.5),b=Math.round(Math.sin(an)*5.5),h=r()<0.5?5:1+Math.floor(r()*3);for(let y=Y+1;y<=Y+h;y++)P(a,b,y,y===Y+5?WSCARVE:old(hsh(a,y,b),WSPILLAR));}
      chest(0,4,Y+1);break;}
    default:{ // the tomb of a forgotten king: a portico of six columns (some fallen) before a house of stone, its roof broken in;
      // within, his effigy on its bier, a lamp long cold beside it
      for(let a=-10;a<=10;a++)for(let b=-7;b<=7;b++){const q=hsh(a,9005,b);floor(a,b,g+1,Math.abs(b)===7||Math.abs(a)===10?WSTRIM:old(q,WSTONE));}
      for(let a=-2;a<=9;a++)for(let b=-6;b<=6;b++){const ea=a===-2||a===9,eb=Math.abs(b)===6;if(!ea&&!eb)continue;if(a===-2&&Math.abs(b)<=1)continue;const h=6-Math.floor(hsh(a,9007,b)*4)*(a>4?1:0);for(let y=g+2;y<=g+1+h;y++)P(a,b,y,old(hsh(a,y,b),WSBRICK));}
      for(let a=-2;a<=3;a++)for(let b=-6;b<=6;b++)if(hsh(a,9009,b)<0.7)P(a,b,g+8,old(r(),WSTONE)); // what is left of the roof
      for(const b of [-5,-3,-1,1,3,5]){const a=-6,h=r()<0.65?6:1+Math.floor(r()*3);for(let y=g+2;y<=g+1+h;y++)P(a,b,y,y===g+7?WSCARVE:old(hsh(a,y,b),WSPILLAR));if(h<6){const dd=r()<0.5?1:-1;for(let k=1;k<=3;k++)P(a-k,b+(k>1?dd:0),G(a-k,b)+1,WSPILLAR);}}
      for(let b=-5;b<=5;b++)if(hsh(b,9011,s.X)<0.7)P(-6,b,g+8,old(r(),WSTRIM));
      P(5,0,g+2,EFFIGY);P(4,0,g+2,WSROUGH);P(6,0,g+2,WSROUGH);P(5,2,g+2,WSPILLAR);P(5,2,g+3,LANTERN);
      chest(7,-3,g+2);}
  }
}
