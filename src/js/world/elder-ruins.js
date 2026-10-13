// ---- The ruins of the elder elves (D-088): what is left of the realms the elves held in the elder days, before they drew back
// to the mountains and the deep woods. About one chunk in seventy of the mountains, highlands, sea cliffs and old woods (outside
// the living realms and clear of every other place) holds one: a fallen tower with its drums strewn where it fell, a broken
// colonnade, a moonwell under a ring of columns, a theatre of tiers about a stage, a king of stone toppled from his plinth, a
// lone arch over the floor of a vanished hall. Each is weathered elvenstone, mossed and cracked, with elven plants growing in
// it, an elder chest of relics (ELDERLOOT) and a name of the elder tongue. Pure per chunk; each reaches at most 15 blocks from
// its middle, so the chunks about it build it (applyElder); it keeps every other feature off (elderNear).
const ELDER_LANDS={mtn:['tower','theatre','arch','shrine'],alpine:['shrine','tower','arch','theatre'],karst:['tower','arch','theatre'],fjord:['tower','arch','king'],chalk:['theatre','colonnade','king','arch'],
  cloud:['shrine','tower','colonnade'],elder:['shrine','colonnade','king','arch'],autumn:['colonnade','king','shrine'],birch:['shrine','arch','colonnade'],giant:['king','shrine','tower'],
  yew:['tower','king','arch'],silver:['shrine','colonnade','theatre'],moors:['king','arch','tower'],pine:['tower','shrine']};
const ELDER_NAMES={tower:'The Fallen Tower of %',colonnade:'The Broken Colonnade of %',shrine:'The Moonwell of %',theatre:'The Theatre of %',king:'The Fallen King of %',arch:'The Lone Arch of %'};
// what an elder chest holds: [item, least, most, weight] (the elves' own gear joins it: elves.js)
const ELDERLOOT=[[204,2,6,8],[205,1,2,3],[228,1,3,4],[230,1,2,2],[224,1,3,4],[407,1,1,1],[402,1,1,0.8],[409,6,16,5],[STARLAMP,1,2,3],[MOONSTONE,2,6,4],[327,1,3,3],[STARBLOOM,2,5,3]];
const elderC=new Map(),TER={},TER2={};
function elderAt(WCX,WCZ){
  const key=WCX*65536+WCZ;if(elderC.has(key))return elderC.get(key);if(elderC.size>20000)elderC.clear();let s=null;
  if(hsh(WCX,8951,WCZ)<0.05){const X=WCX*CS+8,Z=WCZ*CS+8;colInfo(X,Z,TER);const L=ELDER_LANDS[LANDS[TER.land].k],g=TER.h;
    if(L&&!TER.wet&&!TER.river&&!TER.bank&&!TER.lake&&TER.rvBot===999&&g>TER.sl+3&&g+34<H&&!surfTaken(X,Z,16)&&!sigNear(X,Z,16)&&!smallNear(X,Z,16)&&!pondNear(X,Z,16)){
      const kind=L[Math.floor(hsh(WCX,8953,WCZ)*L.length)],R=kind==='theatre'||kind==='king'?13:kind==='tower'?15:12;let lo=g,hi=g;
      // the ground under it: no water, and no steeper than it can stand on (a theatre is set into a hillside)
      for(let k=0;k<12;k++){const a=k/12*6.283;for(const d of [R*0.5,R]){const e=colInfo(X+Math.round(Math.cos(a)*d),Z+Math.round(Math.sin(a)*d),TER2);if(e.wet||e.river||e.lake||e.h<e.sl+2)lo=-1e9;lo=Math.min(lo,e.h);hi=Math.max(hi,e.h);}}
      // no waterfall or hillside stream runs through it
      for(let a=-3;a<=3&&lo>-1e9;a++)for(let b=-3;b<=3;b++){const f=fallAt(WCX+a,WCZ+b);if(f&&f.path.some(([x,z])=>Math.hypot(x-X,z-Z)<R+3)){lo=-1e9;break;}}
      if(hi-lo<=(kind==='theatre'?10:6))s={kind:kind,X:X,Z:Z,g:g,R:R,dir:Math.floor(hsh(WCX,8957,WCZ)*4),name:ELDER_NAMES[kind].replace('%',nameWord('elder',rngAt(WCX,8955,WCZ)))};}}
  elderC.set(key,s);return s;
}
function elderNear(X,Z,m){const cx=Math.floor(X/CS),cz=Math.floor(Z/CS);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const s=elderAt(cx+a,cz+b);if(s&&Math.hypot(X-s.X,Z-s.Z)<=s.R+(m||0))return s;}return null;}
function applyElder(WCX,WCZ){for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const s=elderAt(WCX+a,WCZ+b);if(s)elderBuild(s);}}
const ELD4=[[1,0],[0,1],[-1,0],[0,-1]];
function elderBuild(s){
  const r=mkRng(1+Math.floor(hsh(s.X,8961,s.Z)*2147483000)),[fx,fz]=ELD4[s.dir],g=s.g;
  // local (a, b): a along the ruin's way, b across it
  const XZ=(a,b)=>[s.X+a*fx-b*fz,s.Z+a*fz+b*fx],P=(a,b,y,id,m)=>{const [x,z]=XZ(a,b);PW(x,y,z,id,m||MODE_SET);},G=(a,b)=>{const [x,z]=XZ(a,b);return hAt(x,z);};
  const old=(q,id)=>q<0.3?EVOLD:id; // weathered here and there
  // a floor at y over the ground: courses down to the ground under it, headroom over it where the ground stands higher
  const floor=(a,b,y,id)=>{const gg=G(a,b);for(let yy=gg+1;yy<y;yy++)P(a,b,yy,EVBRICK);if(gg<y-6)return;P(a,b,y,id);for(let yy=y+1;yy<=Math.max(y+1,gg+1);yy++)P(a,b,yy,AIR);};
  const plant=(a,b,y,q)=>{const id=q<0.4?STARBLOOM:q<0.7?SILVFERN:DAWNLILY;const [x,z]=XZ(a,b);PW(x,y,z,id,MODE_AIR);};
  const chest=(a,b,y)=>{P(a,b,y-1,EVBRICK);P(a,b,y,ECHEST);P(a,b,y+1,AIR);};
  switch(s.kind){
    case 'tower':{ // a round tower broken off at a ragged height, its door toward -a; its drums and gallery strewn along +a where it fell
      const rr=3.6;for(let a=-5;a<=5;a++)for(let b=-5;b<=5;b++){const d=Math.hypot(a,b);if(d>rr+1.2)continue;const gg=G(a,b);
        if(d>rr+0.4){P(a,b,g,EVOLD);for(let yy=gg+1;yy<g;yy++)P(a,b,yy,EVBRICK);continue;} // the flared foot
        for(let yy=gg+1;yy<g;yy++)P(a,b,yy,EVBRICK);
        if(d>rr-0.9){const ang=Math.atan2(b,a),top=g+7+Math.round(5*(0.5+0.5*Math.sin(ang*2+s.X))+hsh(a,8963,b)*3),door=a<-2&&Math.abs(b)<=1;
          for(let y=g;y<=top;y++){const q=hsh(a*7+b,y,8965);P(a,b,y,door&&y>g&&y<=g+3?AIR:(y-g)%6===0?EVCARVE:q<0.35?EVOLD:EVBRICK);}
          for(let y=top+1;y<=top+3;y++)P(a,b,y,AIR);}
        else{const q=hsh(a,8967,b);P(a,b,g,q<0.25?GRASS:q<0.55?EVOLD:EVMOSAIC);for(let y=g+1;y<=g+16;y++)P(a,b,y,AIR);if(q<0.12)plant(a,b,g+1,hsh(b,8969,a));}}
      for(let a=5;a<=15;a++){const k=a-5,w=k<8?1:2;for(let b=-w;b<=w;b++){if(hsh(a,8971,b)<0.22)continue;const gg=G(a,b);P(a,b,gg+1,old(hsh(b,8973,a),k%4===0?EVCARVE:EVBRICK));if(hsh(a,8975,b)<0.3)P(a,b,gg+2,EVOLD);}}
      for(let b=-3;b<=3;b++){const gg=G(14,b);if(Math.abs(b)>=2)P(14,b,gg+1,EVCARVE);if(b%2===0)P(15,b,G(15,b)+1,EVGOLD);} // the gallery's rail where it came down
      chest(1,1,g+1);P(-1,-1,g+1,STARLAMP);break;}
    case 'colonnade':{ // two rows of columns on a stepped floor, some whole under their beam, some broken, their drums fallen beside
      for(let a=-10;a<=10;a++)for(let b=-6;b<=6;b++){const e=Math.abs(a)===10||Math.abs(b)===6,q=hsh(a,8977,b);floor(a,b,g+1,e?EVCARVE:q<0.18?GRASS:Math.abs(b)<=1?EVMOSAIC:old(q,EVSTONE));if(q<0.06)plant(a,b,g+2,hsh(b,8979,a));}
      const full=[];for(const b of [-4,4])for(let a=-8;a<=8;a+=4){const q=r(),h=q<0.45?8:q<0.6?5:q<0.8?3:1;for(let y=g+2;y<g+2+h;y++)P(a,b,y,y===g+1+h&&h===8?EVCARVE:old(hsh(a,y,b),EVPILLAR));
        if(h===8)full.push([a,b]);else{const dd=r()<0.5?1:-1,n=1+Math.floor(r()*3);for(let k=1;k<=n;k++)P(a+dd*k,b,g+2,EVPILLAR);}}
      for(const [a,b] of full)if(full.some(([a2,b2])=>b2===b&&a2===a+4))for(let k=0;k<=4;k++)P(a+k,b,g+10,EVCARVE);
      chest(9,0,g+2);break;}
    case 'shrine':{ // a moonwell: a round floor a step up, a pool over moonstone in its middle held by a kerb, eight columns about it,
      // some broken, the ring of their beam left where two stand together; starbloom round the water
      const Y=g+1;const cols=[];for(let k=0;k<8;k++){const h=r()<0.6?7:1+Math.floor(r()*4);cols.push(h);}
      for(let a=-7;a<=7;a++)for(let b=-7;b<=7;b++){const d=Math.hypot(a,b);if(d>6.6)continue;
        if(d<2.5){floor(a,b,Y-3,EVOLD);P(a,b,Y-2,MOONSTONE);P(a,b,Y-1,WATER);P(a,b,Y,WATER);P(a,b,Y+1,AIR);continue;}
        if(d<3.5){floor(a,b,Y-2,EVBRICK);P(a,b,Y-1,EVBRICK);P(a,b,Y,EVCARVE);P(a,b,Y+1,EVCARVE);for(let y=Y+2;y<=Y+9;y++)P(a,b,y,AIR);continue;}
        const q=hsh(a,8981,b);floor(a,b,Y,d>6?EVCARVE:q<0.15?GRASS:Math.round(d)===5?EVMOSAIC:old(q,EVSTONE));for(let y=Y+1;y<=Y+9;y++)P(a,b,y,AIR);
        if(d<4.6&&q<0.45)plant(a,b,Y+1,q<0.3?0.1:hsh(b,8983,a));}
      for(let k=0;k<8;k++){const ang=k*Math.PI/4,a=Math.round(Math.cos(ang)*5.2),b=Math.round(Math.sin(ang)*5.2);for(let y=Y+1;y<=Y+cols[k];y++)P(a,b,y,y===Y+7?EVCARVE:old(hsh(a,y,b),EVPILLAR));
        if(cols[k]===7&&cols[(k+1)%8]===7){const a2=Math.round(Math.cos(ang+Math.PI/4)*5.2),b2=Math.round(Math.sin(ang+Math.PI/4)*5.2);for(let t=0;t<=4;t++)P(Math.round(a+(a2-a)*t/4),Math.round(b+(b2-b)*t/4),Y+8,EVCARVE);}}
      chest(0,6,Y+1);break;}
    case 'theatre':{ // tiers in a half ring (from 5 to 12 out) about a stage, each a block over the one inside it, set into the ground;
      // the stage on its step, the broken wall behind it with its columns
      for(let a=-8;a<=13;a++)for(let b=-13;b<=13;b++){const d=Math.hypot(a,b),q=hsh(a,8985,b);
        if(a>=-1&&d>=5&&d<=12.5){const k=Math.floor((d-5)/1.5),y=g+1+k-(q<0.1?1:0);floor(a,b,y,(d-5)%1.5<0.75?old(q,EVBRICK):old(q,EVSTONE));for(let yy=y+1;yy<=y+4;yy++)P(a,b,yy,AIR);if(q>0.97)plant(a,b,y+1,hsh(b,8987,a));continue;}
        if(a>=-4&&a<=0&&Math.abs(b)<=5){floor(a,b,g+1,Math.abs(b)===5||a===-4?EVCARVE:q<0.2?EVOLD:EVMOSAIC);for(let yy=g+2;yy<=g+6;yy++)P(a,b,yy,AIR);continue;}
        if((a===-6||a===-5)&&Math.abs(b)<=7){const top=g+2+Math.floor(hsh(b,8989,0)*6),col=Math.abs(b)%3===0;for(let y=G(a,b)+1;y<=top;y++)P(a,b,y,col?EVPILLAR:old(hsh(a,y,b),EVBRICK));}}
      chest(-3,4,g+2);P(-3,-4,g+2,STARLAMP);break;}
    case 'king':{ // a king of stone fallen from his plinth: the plinth and his feet on it, the robe and shoulders lying along +a, his
      // sword beside him, his crowned head rolled away; fern on the fallen stone
      for(let a=-10;a<=-6;a++)for(let b=-2;b<=2;b++){const top=g+3;for(let y=G(a,b)+1;y<=top;y++)P(a,b,y,y===top?EVCARVE:EVBRICK);if(a>=-9&&a<=-7&&Math.abs(b)===1){P(a,b,top+1,EVOLD);if(a===-8)P(a,b,top+2,EVOLD);}}
      for(let a=-4;a<=8;a++){const w=a>=5?3:a>=2?2:a>=-1?2:1;for(let b=-w;b<=w;b++){const gg=G(a,b);P(a,b,gg+1,a>=5&&Math.abs(b)===3?EVCARVE:old(hsh(a,8991,b),EVSTONE));if(Math.abs(b)<w||a>=5)P(a,b,gg+2,old(hsh(b,8993,a),EVSTONE));if(hsh(a,8995,b)<0.12)plant(a,b,gg+3,0.5);}}
      for(let a=-3;a<=7;a++)P(a,-5,G(a,-5)+1,a===5?EVCARVE:EVPILLAR);for(const b of [-6,-4])P(5,b,G(5,b)+1,EVCARVE);
      for(let a=10;a<=12;a++)for(let b=3;b<=5;b++){const gg=G(a,b);for(let y=gg+1;y<=gg+3;y++)P(a,b,y,a===12&&y===gg+2?EVGOLD:a===12?EVGOLD:old(hsh(a,y,b),EVSTONE));}
      chest(-11,0,G(-11,0)+1);break;}
    default:{ // the lone arch: two piers and a pointed arch between them, the keystone gilt; the broken floor of the hall it stood in
      for(let a=-2;a<=10;a++)for(let b=-6;b<=6;b++){const q=hsh(a,8997,b);if(q<0.45){const gg=G(a,b);P(a,b,gg,q<0.15?EVOLD:EVMOSAIC);if(q<0.05)plant(a,b,gg+1,hsh(b,8999,a));}}
      for(const sb of [-1,1])for(let a=-1;a<=0;a++)for(let b=3;b<=4;b++){const bb=b*sb;for(let y=G(a,bb)+1;y<=g+10;y++)P(a,bb,y,(y-g)%5===0?EVCARVE:old(hsh(a,y,bb),EVBRICK));}
      for(let a=-1;a<=0;a++)for(let b=-3;b<=3;b++){const lo=g+10+Math.round((3-Math.abs(b))*1.5);for(let y=lo;y<=g+15;y++)P(a,b,y,y===g+15&&b===0?EVGOLD:y===lo?EVCARVE:EVBRICK);}
      chest(2,4,G(2,4)+1);}
  }
}
