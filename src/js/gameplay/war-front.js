// ---- Into the basin and beneath it (W5, D-072; Q138, Q143, Q149, Q175). Once a gate has fallen its war goes on into its basin.
// The front (`w.fr`, 0 to 1) moves out from the foot of the Long Descent across the floor toward the great volcano's foot with
// play time (an hour or so, a little different at each gate) and with battles won; four forward camps rise along that way as the
// front passes them (a palisade ring with a gate toward the road, a watchtower, tents, the peoples' banners and a fire; made as
// edits like the works, w.ap.fc), each with its garrison. The hosts' armies march down the Long Descent to the front and on, the
// warhosts come at it from the volcano. The wastes' places are stormed: when every creature of one of their spots has fallen
// with a soldier of the hosts near, in a basin whose gate has fallen, the place is the hosts' (`w.cl`) and their garrison holds
// it; so the war camps, watchtowers, forges and pits on the floor, the warholds of the lesser volcanoes, the goblin warrens hall by
// hall and the Ember Stair chamber by chamber. Underground in such a basin a company of the hosts goes with the player, and now
// and then a warband of the deep comes at it.
const WAR_CAMPS=[0.05,0.35,0.65,0.95];
// the way of the front: from the foot of the Long Descent to the great volcano's foot, a point every 16 (world), cached
function warFrontPath(P){if(P.fpth)return P.fpth;const p=P.ramp.pts,a=p[p.length-1],G=P.B&&greatOf(P.B.chief),out=[];
  if(!G){P.fpth=[[a[0],a[1]]];return P.fpth;}const dx=G.X-a[0],dz=G.Z-a[1],L=Math.hypot(dx,dz)||1,end=Math.max(20,L-(G.R*1.3+24));
  for(let s=0;s<=end;s+=16)out.push([a[0]+dx/L*s,a[1]+dz/L*s]);return P.fpth=out;}
// the war of the basin a world point lies in, if its gate has fallen (and the gate)
// the basin a world point lies in (its floor, or the ring's inner wall), or null
function warBasinAt(X,Z){const o={};wasteAt(X,Z,o);return o.bc&&o.bs<40?wasteBasin(o.bc):null;}
function warBasinWar(X,Z){let any=false;for(const w of WARS.values())if(w.s>=2)any=true;if(!any)return null;const B=warBasinAt(X,Z),P=B&&wasteGateOf(B);if(!P)return null;
  const w=WARS.get(P.id);return w&&w.s>=2?{P:P,w:w}:null;}
// how far the front has come
function warFront(w){if(!(w.s>=2))return 0;const pace=60*60*(0.85+0.3*hsh(w.X,9921,w.Z));return Math.max(0,Math.min(1,(w.b.fr||0)+(warPlay-(w.fallT||0))/pace));}
const warFrontAt=(P,w)=>{const F=warFrontPath(P);return F[Math.min(F.length-1,Math.floor(warFront(w)*(F.length-1)))];};
// ---- the forward camps: where each stands (the path's point, moved along it to dry ground), and its cells
function warCampAt(P,k){P.fcs=P.fcs||[];if(P.fcs[k]!==undefined)return P.fcs[k];const F=warFrontPath(P),i0=Math.round(WAR_CAMPS[k]*(F.length-1));let r=null;
  for(let d=0;d<F.length&&!r;d++)for(const i of [i0+d,i0-d]){if(i<0||i>=F.length)continue;const [X,Z]=F[i],o={};colInfoBase(Math.round(X),Math.round(Z),o);if(o.h>o.sl+1&&!o.river&&!o.lake){r=[Math.round(X),Math.round(Z),i,Math.round(o.h)];break;}}
  return P.fcs[k]=r;}
function warCampCells(P,k){const C=warCampAt(P,k);if(!C)return [];const [X,Z,i]=C,F=warFrontPath(P),[bx,bz]=F[Math.max(0,i-1)],gdx=bx-X,gdz=bz-Z,gl=Math.hypot(gdx,gdz)||1,out=[];
  const top=(x,z)=>{const lx=x-OX,lz=z-OZ;return lx<0||lz<0||lx>=W||lz>=D?-1:ground[lx+W*lz];},put=(x,y,z,id)=>out.push([x,y,z,id]);
  // the palisade: a ring of logs nine across, stakes atop, a gate toward the road
  for(let a=0;a<64;a++){const t=a/64*6.2832,x=Math.round(X+Math.cos(t)*9),z=Math.round(Z+Math.sin(t)*9);if((Math.cos(t)*gdx+Math.sin(t)*gdz)/gl>0.93)continue;const y=top(x,z)+1;if(y<1)continue;
    put(x,y,z,LOG);put(x,y+1,z,LOG);put(x,y+2,z,STAKES);}
  // the watchtower at the back: four posts, a platform at six with stakes about it
  const tx=Math.round(X-gdx/gl*5),tz=Math.round(Z-gdz/gl*5),ty=top(tx,tz)+1;if(ty>0){for(const [a,b] of [[-1,-1],[1,-1],[-1,1],[1,1]])for(let y=ty;y<ty+6;y++)put(tx+a,y,tz+b,LOG);
    for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){put(tx+a,ty+6,tz+b,PLANKS);if(Math.abs(a)===2||Math.abs(b)===2)put(tx+a,ty+7,tz+b,STAKES);}put(tx,ty+7,tz,RBANNER);put(tx,ty+8,tz,RBANNER);}
  // two tents of white wool, banners of the three peoples, a fire in the middle
  for(const sd of [-1,1]){const cx=Math.round(X+gdz/gl*4*sd),cz=Math.round(Z-gdx/gl*4*sd),cy=top(cx,cz)+1;if(cy<1)continue;for(let a=-1;a<=1;a++)for(let b=-2;b<=2;b++){put(cx+a,cy,cz+b,a?WOOLW:AIR);if(!a)put(cx,cy+1,cz+b,WOOLW);}}
  const fy=top(X,Z)+1;if(fy>0){put(X,fy,Z,HEARTH);for(const [a,b,id] of [[2,2,RBANNER],[-2,2,DBANNER],[2,-2,EVBANNER]])for(let y=fy;y<fy+3;y++)put(X+a,y,Z+b,id);}
  return out;}
// ---- every second (from warWorksTick, for the war near): the forward camps the front has passed, built where loaded
function warFrontTick(P,w){if(!(w.s>=2)||WJ.length)return;if(!w.ap)w.ap={leaf:0,me:0,cm:0,lad:0,gr:0,fall:0,ban:0,fire:0};const A=w.ap,fr=warFront(w),n=WAR_CAMPS.filter(f=>fr>=f-0.05).length;A.fc=A.fc||0;
  if(n>A.fc&&!(A.wt&&A.wt.fc>warPlay)){const k=A.fc,C=warCampAt(P,k);if(!C){A.fc++;return;}const x=C[0]-OX,z=C[1]-OZ;if(x<20||z<20||x>=W-20||z>=D-20||!genDone[(x>>4)+(z>>4)*NCX])return;
    warJob(warCampCells(P,k),300,ok=>{if(ok){A.fc=k+1;warLog(w,'The hosts raised their '+['first','second','third','fourth'][k]+' forward camp on the floor of the wastes.');if(Math.hypot(x-PL.x,z-PL.z)<160)toast('The hosts raise a forward camp');}
      else{A.wt=A.wt||{};A.wt.fc=warPlay+20;}saveDirty=true;});}
  if(fr>=1&&!w.vf){w.vf=1;const G=P.B&&greatOf(P.B.chief);warLog(w,'The front has reached the foot of '+(G?G.name.replace(/^The /,'the '):'the great volcano')+'.');}}
// the camps' garrisons (from warPlaces)
function warCampSpots(P,X,Z,out){const w=WARS.get(P.id);if(!w||!w.ap||!w.ap.fc)return;const s=wgSite(P);
  for(let k=0;k<w.ap.fc;k++){const C=warCampAt(P,k);if(!C||Math.hypot(C[0]-X,C[1]-Z)>60)continue;
    out.push({id:P.id+':fc'+k,x:C[0]+0.5,y:C[3]+1,z:C[1]+0.5,R:5,kind:['r_lines','e_lines','d_post','r_lines'][k],folk:1,s:s});}}
function warFrontPlaces(X,Z,out){const bw=warBasinWar(X,Z);if(bw)warCampSpots(bw.P,X,Z,out);}
// ---- the stormed places: cleared of the wastes with the hosts near, in a fallen basin
const WAR_CL=new Map(); // spot id -> war id, from every war's w.cl
function warClIndex(){WAR_CL.clear();for(const w of WARS.values())for(const id of w.cl||[])WAR_CL.set(id,w.id);}
warClIndex();
// a creature of the wastes fell (from updFoes): was its spot the last of its place?
function warSpotFell(f){if(!f.spot||FOES[f.kind].folk||WAR_CL.has(f.spot))return;for(const g of foes)if(g!==f&&!g.dead&&g.spot===f.spot)return;
  if(!foes.some(g=>!g.dead&&FOES[g.kind].folk&&!FOES[g.kind].civ&&Math.hypot(g.x-f.x,g.z-f.z)<24))return;const bw=warBasinWar(f.x+OX,f.z+OZ);if(!bw)return;
  const w=bw.w;if(!w.cl)w.cl=[];if(w.cl.length>=600)return;w.cl.push(f.spot);WAR_CL.set(f.spot,w.id);w.tk=(w.tk||0)+1;saveDirty=true;
  const under=f.y<(ground[Math.floor(f.x)+W*Math.floor(f.z)]||0)-6,what=/^w/.test(f.spot)?'a hall of the goblin warrens':/^o/.test(f.spot)?'a place of the orcs':f.spot.includes(':')&&!/^wg/.test(f.spot)?'a chamber of the Ember Stair':'a hold of the wastes';
  if(w.tk%5===1)warLog(w,'The hosts have taken '+what+(under?' beneath the basin':' on the floor of the wastes')+' ('+w.tk+' in all).');if(Math.hypot(f.x-PL.x,f.z-PL.z)<60)toast('The hosts have taken '+what);}
// a place of the wastes that the hosts hold: their garrison stands there instead (from foeSpawnTick)
function warHeld(s){if(s.folk||!WAR_CL.has(s.id))return s;const w=WARS.get(WAR_CL.get(s.id)),P=w&&wasteGateAt(w.X,w.Z,10);if(!P)return s;
  const under=s.y<hAt(Math.round(s.x),Math.round(s.z))-6;return {id:s.id+'h',x:s.x,y:s.y,z:s.z,R:Math.max(2,Math.min(5,s.R||4)),kind:under?'d_sap':'r_lines',folk:1,s:wgSite(P)};}
// ---- underground in a fallen basin: a company of the hosts with the player, and the deep's warbands
let warDeepT=60;
function warDeepTick(){const bx=Math.floor(PL.x),bz=Math.floor(PL.z);if(bx<0||bz<0||bx>=W||bz>=D)return;const under=PL.y<ground[bx+W*bz]-8,bw=under&&warBasinWar(PL.x+OX,PL.z+OZ);
  warFollow(2,bw?6:0,['d_host','d_sap','d_host','r_host'],'A company of the hosts goes down with you');
  if(!bw||(warDeepT-=1)>0)return;warDeepT=150+Math.random()*90;
  for(let k=0;k<10;k++){const a=Math.random()*6.283,d=26+Math.random()*10,x=PL.x+Math.sin(a)*d,z=PL.z+Math.cos(a)*d;if(x<3||z<3||x>=W-3||z>=D-3)continue;
    const y=foeStand(x,PL.y+4,z,2);if(y<0||Math.abs(y-PL.y)>8)continue;const g=spawnGroup('band',5,x,y,z,3,{lead:Math.random()<0.4?'ochief':null});for(const f of g){f.war=bw.w.id;f.foe=null;}
    if(g.length){toast('A warband of the deep comes at the hosts');foeCall(g[0],'alert');}break;}}
// followers: a squad (tag 1, war-sworn.js) or a company (tag 2), n of them, each to a place behind the player, fighting what comes
// near; gone when the player leaves them; the fallen replaced one every five seconds
const warFolT={};
function warFollow(tag,n,tables,said){const mine=foes.filter(f=>f.follow===tag&&!f.dead);
  if(!n||photo){for(const f of mine)if(Math.hypot(f.x-PL.x,f.z-PL.z)>40||!n)removeFoe(f);return;}
  const off=tag===2?0.35:0;mine.forEach((f,i)=>{const a=PL.yaw+off+((i%5)-2)*0.5,r=3+Math.floor(i/5)*2.2,tx=PL.x+Math.sin(a)*r,tz=PL.z+Math.cos(a)*r,d=Math.hypot(f.x-tx,f.z-tz);
    if(Math.hypot(f.x-PL.x,f.z-PL.z)>60){const y=foeStand(tx,PL.y+2,tz,FOES[f.kind].tall||2);if(y>0){f.x=tx;f.z=tz;f.y=f.gy=y;}}
    f.hx=tx;f.hz=tz;if(!f.foe&&d>2.5&&f.st!=='chase'){f.st='return';f.t=8;f.way=null;f.pace=d>10?FOES[f.kind].run:FOES[f.kind].walk*1.3;}});
  if(mine.length>=n||(warFolT[tag]=(warFolT[tag]||0)-1)>0)return;warFolT[tag]=5;
  for(let k=0;k<8;k++){const a=PL.yaw+(Math.random()-0.5)*1.4,d=10+Math.random()*10,x=PL.x+Math.sin(a)*d,z=PL.z+Math.cos(a)*d;if(x<3||z<3||x>=W-3||z>=D-3)continue;
    const y=foeStand(x,PL.y+3,z,2);if(y<0)continue;const g=spawnGroup(tables[mine.length%tables.length],1,x,y,z,1,{});
    for(const f of g){f.follow=tag;f.leash=0;f.hx=f.x;f.hz=f.z;}if(g.length){if(!mine.length)toast(said);break;}}}
// ---- the armies' ways once the gate has fallen: the hosts' down the Long Descent to the front and on; the warhosts' from the
// volcano at the front
function warFrontWays(P,w){const F=warFrontPath(P),i=Math.min(F.length-1,Math.floor(warFront(w)*(F.length-1))),W2=warWays(P);
  const inA=W2.inB.concat(F.slice(0,Math.min(F.length,i+4)).map(q=>[q[0]+0.5,q[1]+0.5]));if(warFront(w)>=1)inA.push(...emberWayIn(w,F[F.length-1])); // on to its gate (W7b)
  return {inA:inA,out:F.slice(Math.max(0,i-2)).reverse().map(q=>[q[0]+0.5,q[1]+0.5])};}
// the panel and the map
function warFrontPanel(P,w){if(!(w.s>=2))return '';return '<div>The front '+Math.round(warFront(w)*100)+'%, forward camps '+(w.ap&&w.ap.fc||0)+', places taken '+(w.tk||0)+'</div>';}
function warFrontMap(g,sx,sz,P,w){if(!(w.s>=2)||!w.ap||!w.ap.fc)return;g.fillStyle='#2a4c9c';for(let k=0;k<w.ap.fc;k++){const C=warCampAt(P,k);if(C)g.fillRect(sx(C[0])-4,sz(C[1])-4,8,8);}}
