// ---- The life of the white realm (D-089): what its people do about the player, day and night.
//
// The tourney: once a day at each lists, while the player is near by daylight, knights in their own colours ride against each
// other down the tilt, a pass at a time (a glance, a lance broken, a knight unhorsed), the stands cheering, the herald crying the
// victor; an esquire of the realm or a knight who is mounted with a lance in hand may ride a bout of three passes themselves (aim
// at the knight as you pass). Caravans: wagons drawn by oxen go along the king's roads between its places with guards walking
// beside them; one may be the player's to guard (an escort task), and in the provinces that border a gate's war raiders may fall
// on it. The city's day: bells from the towers and chapels at the hours, the crier with his bell, the lamplighters at dusk,
// market day every third day, the night watch going round with lanterns, a minstrel at the inn of an evening, smoke from the
// chimneys. Beacons: a beacon lit on a watchtower of the realm (use its fire) is answered by every beacon of the kingdom one
// after another, and its riders come; the raids of the wastes light them too. The village fair every fourth evening: dancing
// about the maypole, a bonfire, a fiddle, games; whoever keeps it with them is fed and the better thought of. The countryside
// at work: shepherds with their flocks, ploughmen with their oxen. Ships of the realm come and go from its ports. The silver
// tree in the royal citadel is in flower once an Emberlord has fallen (and for a knight of the realm), its petals falling.
let menLand=false,menLandT=0;
function menLandNow(){const P=realmOfColumn(Math.floor(PL.x+OX),Math.floor(PL.z+OZ));return !!(P&&P.cult.k==='white');}
// the white realm's sites within reach of the player
function menSitesNear(m){const X=PL.x+OX,Z=PL.z+OZ;return realmTile(Math.floor(X),Math.floor(Z)).sites.filter(s=>s.prov.cult.k==='white'&&Math.hypot(s.X-X,s.Z-Z)<s.R+m);}
const menAt=(s,u,v,y)=>{const [X,Z]=siteXZ(s,u,v);return [X-OX+0.5,y,Z-OZ+0.5];};
// a bell's stroke, at a place
function menBell(at,n,lo){for(let i=0;i<n;i++){tone(lo?392:587,lo?390:585,2.2,0.05,i*1.4,'sine',at);tone(lo?784:1175,lo?780:1170,1.2,0.02,i*1.4,'sine',at);}}
// ---- the tourney
let TOUR=null;
const tourDone=new Set();
function tourFind(){if(!(curT()>0.28&&curT()<0.7))return null;for(const s of menSitesNear(60))if(s.k==='lists'&&!tourDone.has(s.id+':'+dayN))return s;return null;}
// the knights of the tourney ride from the pavilions to the ends of the tilt
function tourStart(s){tourDone.add(s.id+':'+dayN);const L=siteLayout(s),y=L.tilt.y+1,K=[];
  for(let i=0;i<4;i++){const sg=i%2?-1:1,[x,yy,z]=menAt(s,i<2?-6:6,sg*24,y),f=addFoe('rjoust',x,foeStand(x,y+1,z,3)>0?foeStand(x,y+1,z,3):y,z,{site:s,prov:s.prov.key,ci:(i+dayN)%6,st:'idle',t:99});if(!f)continue;
    f.nm=nameWord('human',Math.random)+' of '+nameWord('realm',Math.random);f.tour=1;f.hold=1;f.holdSp=0;f.pts=0;K.push(f);}
  TOUR={s:s,K:K,bout:0,pairs:[[0,1],[2,3]],ph:'muster',t:4,pass:0,a:null,b:null,win:[],pl:null};
  toast('A tourney at '+s.name+'! The knights ride out to the lists.');warSignal('muster','r',menAt(s,0,0,y+4));hint('tourney');return TOUR;}
// a knight's place on its lane (u: 2 or -2 across the tilt; v along it)
function tourPlace(f,u,v,sp){const s=TOUR.s,y=TOUR.s.lay.tilt.y+1,[x,,z]=menAt(s,u,v,y),dx=x-f.x,dz=z-f.z,d=Math.hypot(dx,dz);if(d>0.05){f.yaw=f.hd=Math.atan2(dx,dz);}f.x=x;f.z=z;const ny=foeStand(x,y+1,z,3);if(ny>0)f.y=f.gy=ny;f.holdSp=sp;}
// a pass between two knights: each may glance, break a lance (a point) or unhorse the other (the bout's end)
function tourStrike(a,b,r){const q=r();if(q<0.35)return 0;if(q<0.82)return 1;return 2;}
function tourPassEnd(a,b,r){const sa=tourStrike(a,b,r),sb=tourStrike(b,a,r),at=[(a.x+b.x)/2,a.y+2,(a.z+b.z)/2];
  for(const [s,f] of [[sa,a],[sb,b]])if(s){for(let k=0;k<10;k++)spawnP(at[0],at[1],at[2],(Math.random()-.5)*4,Math.random()*3,(Math.random()-.5)*4,[0.7,0.55,0.35],0.5,10);burst(0.3,'bandpass',900,3,0.25,0,at);f.pts+=1;}
  const word=s=>s===2?'unhorses his opponent':s===1?'breaks his lance on his opponent\'s shield':'glances off';
  if(sa||sb)menCheer(at,sa===2||sb===2);toast(a.nm+' '+word(sa)+'; '+b.nm+' '+word(sb)+'.');return sa===2?a:sb===2?b:null;}
function menCheer(at,big){for(let i=0;i<(big?14:7);i++)voice(320+Math.random()*260,300+Math.random()*240,0.5,0.012,{form:900+Math.random()*600,q:1,delay:i*0.06},at);}
// every frame: the knights ride their lanes
function tourFrame(dt){const T=TOUR;if(!T)return;const s=T.s;if(T.K.some(f=>f.dead||f.foe)){tourEnd(true);return;}
  if(T.ph==='charge'){const sp=6.5;T.va-=sp*dt*T.dir;T.vb+=sp*dt*T.dir;tourPlace(T.a,2,T.va,sp);if(T.b)tourPlace(T.b,-2,T.vb,sp);
    if(T.dir*(T.va-T.vb)<=0){T.pass++;const win=T.b?tourPassEnd(T.a,T.b,Math.random):tourPlayerPass(T.a);T.ph='slow';T.t=2.5;T.won=win||(T.pass>=3?(T.b?(T.a.pts>T.b.pts?T.a:T.b.pts>T.a.pts?T.b:null):null):null);T.over=!!win||T.pass>=3;}}
  else if(T.ph==='slow'){T.va-=2*dt*T.dir;T.vb+=2*dt*T.dir;tourPlace(T.a,2,T.va,2);if(T.b)tourPlace(T.b,-2,T.vb,2);}}
// the player's pass: their hit (riding, lance in hand, at speed, aiming at the knight) and the knight's (a raised shield turns most)
function tourPlayerPass(f,r){r=r||Math.random;const d=camDir(),dx=f.x-PL.x,dz=f.z-PL.z,dd=Math.hypot(dx,dz)||1,aim=(d.x*dx+d.z*dz)/dd,sp=Math.hypot(PL.vx,PL.vz);
  const P=TOUR.pl,riding=!!PL.ride,lance=curId()===413,mine=riding&&lance&&sp>3&&aim>0.85;let res=null,msg='';
  if(mine){P.pts++;if(r()<0.35){res='p';msg='You strike '+f.nm+' fair on the shield and unhorse him! ';}else msg='Your lance breaks on '+f.nm+'\'s shield. ';}else msg=!riding?'You are not mounted. ':!lance?'You have no lance in hand. ':sp<=3?'You are hardly moving. ':'Your lance passes wide. ';
  const guard=typeof armsGuarding==='function'&&armsGuarding(),hit=r()<(guard?0.25:0.45);if(hit){f.pts++;if(!res&&r()<0.3){res='k';msg+=f.nm+'\'s lance takes you square and throws you from the saddle!';if(PL.ride)dismount();if(SURV()){hp=Math.max(1,hp-3);drawStats();}}else msg+=f.nm+'\'s lance breaks on you.';}
  else msg+=f.nm+' misses.';toast(msg);menCheer([(f.x+PL.x)/2,f.y+2,(f.z+PL.z)/2],!!res);return res==='p'?'player':res==='k'?f:null;}
// once a second: the tourney's order (muster, the bouts' passes, the victor, the final, the player's bout if they asked)
function tourTick(){const T=TOUR;if(!T){if(Math.random()<0.2){const s=tourFind();if(s&&folkCount()<FOLK_CAP+8)tourStart(s);}return;}
  const s=T.s;if(Math.hypot(s.X-OX-PL.x,s.Z-OZ-PL.z)>s.R+110){tourEnd(true);return;}if((T.t-=1)>0)return;
  if(T.ph==='slow'&&T.over){const W0=T.won;if(W0==='player'){tourPlayerWins();}else if(T.pl&&W0!=='player'&&!T.b){toast(W0?W0.nm+' wins the bout.':'The bout is even; the herald gives it to '+T.a.nm+'.');menGain(2,null);}
    else if(T.b){const w=W0||(T.a.pts>=T.b.pts?T.a:T.b);T.win.push(w);toast('The herald cries: "'+w.nm+' has the bout!"');menCheer(menAt(s,0,0,s.lay.tilt.y+3),true);}
    T.b&&(T.a.pts=T.b.pts=0);T.pl=null;T.bout++;T.ph='muster';T.t=4;T.over=0;return;}
  if(T.ph==='slow'){T.dir=-T.dir;T.ph='charge';tone(392,523,0.6,0.05,0,'triangle');return;}
  if(T.ph==='muster'){if(T.plWant&&!T.pl){T.plWant=0;const k=T.K.find(f=>!f.dead);if(k){T.pl={pts:0};k.pts=0;T.a=k;T.b=null;T.va=18;T.vb=-18;T.dir=1;T.pass=0;tourPlace(k,2,18,0);T.ph='slow';T.t=5;toast('The herald: "'+k.nm+' will ride against you. Take the near lane, couch your lance, and ride when the horn sounds!"');return;}}
    const pr=T.bout<2?T.pairs[T.bout]:T.bout===2&&T.win.length===2?null:'end';
    if(pr==='end'||T.bout>2){tourEnd(false);return;}
    const [a,b]=pr?[T.K[pr[0]],T.K[pr[1]]]:[T.win[0],T.win[1]];if(!a||!b){tourEnd(false);return;}a.pts=b.pts=0;T.a=a;T.b=b;T.va=18;T.vb=-18;T.dir=1;T.pass=0;tourPlace(a,2,18,0);tourPlace(b,-2,-18,0);
    toast(pr?'The herald: "'+a.nm+' and '+b.nm+'!"':'The final bout: '+a.nm+' against '+b.nm+'!');T.ph='slow';T.t=3;}}
function tourPlayerWins(){const T=TOUR;MN.tw=(MN.tw||0)+1;saveDirty=true;const got=['3 gold'];giveCoin(30);if(SURV()&&!countOf(440)&&MN.tw===1){addItem(440,1);got.push("the Champion's Circlet");}drawBar(true);
  menGain(10,'You won your bout at '+T.s.name);toast('The stands are on their feet. The herald: "The victor of the bout!" Your prize: '+got.join(' and ')+'.');menCheer([PL.x,PL.y+2,PL.z],true);}
function tourEnd(abort){const T=TOUR;if(!T)return;if(!abort&&T.win.length){const w=T.win[T.win.length-1];toast('The tourney at '+T.s.name+' is over. '+w.nm+' is the champion of the day.');}
  for(const f of T.K)if(!f.dead){f.hold=0;f.tour=0;if(Math.hypot(f.x-PL.x,f.z-PL.z)>40)removeFoe(f);else{f.st='idle';f.t=3;}}TOUR=null;}
// asking about the tourney (a herald, a knight at the pavilions): the player rides the next bout, if fit to
function menTourneyAsk(f){if(!TOUR)return '"There is no tourney today. Come back another day, by daylight."';if(menRank()<3)return '"The lists are for knights and esquires of the realm."';
  TOUR.plWant=1;return '"You will ride the next bout. Mount, take a lance, and go to the near end of the tilt."'+(curId()!==413?' (You have no lance in hand.)':'');}
// ---- caravans on the king's roads
const CARAVANS=[];let carT=30;
function menRouteOf(P,a,b){const pts=[sitePort(a)],end=sitePort(b);let cur=pts[0];for(let k=0;k<12;k++){let nx=null;for(const rd of P.roads)for(const [p,q] of [[rd.a,rd.b],[rd.b,rd.a]])if(Math.hypot(p[0]-cur[0],p[1]-cur[1])<3&&!pts.some(o=>Math.hypot(o[0]-q[0],o[1]-q[1])<3)){nx=q;}
    if(!nx)break;pts.push(nx);cur=nx;if(Math.hypot(cur[0]-end[0],cur[1]-end[1])<3)break;}return Math.hypot(cur[0]-end[0],cur[1]-end[1])<3?pts:null;}
function carSpawn(route,o){const m=amBuild('wagon',Math.floor(Math.random()*3),{});scene.add(m.grp);const C=Object.assign({m:m,route:route,i:0,t:0,G:[],ph:0,L:route.map((p,i)=>i?Math.hypot(p[0]-route[i-1][0],p[1]-route[i-1][1]):0)},o||{});
  const [x,z]=route[0];for(let i=0;i<2;i++){const g=addFoe(i?'rspear':'rsword',x-OX+0.5+i,(ground[Math.floor(x-OX)+W*Math.floor(z-OZ)]||SEA)+1,z-OZ+0.5,{site:C.site,prov:C.prov,st:'idle',t:1});if(g){g.car=1;C.G.push(g);}}
  CARAVANS.push(C);return C;}
function carRemove(C){scene.remove(C.m.grp);scene.remove(C.m.shadow);C.m.mat.dispose();C.m.shadow.material.dispose();for(const g of C.G)if(!g.dead&&Math.hypot(g.x-PL.x,g.z-PL.z)>40)removeFoe(g);else if(g)g.car=0;CARAVANS.splice(CARAVANS.indexOf(C),1);}
// a caravan now and then on a road of the realm near the player (and the player's own, for an escort task)
function carTick(){const q=MN.q;
  if(q&&q.k==='escort'&&!CARAVANS.some(C=>C.esc)){const X=PL.x+OX,Z=PL.z+OZ;if(Math.hypot(q.fx-X,q.fz-Z)<80){let s=null,t=null;for(const s0 of menSitesNear(200)){if(s0.name===q.fn)s=s0;}
      if(s){t=s.prov.sites.find(o=>o.name===q.tn);const route=t&&menRouteOf(s.prov,s,t);if(route){carSpawn(route,{esc:1,site:s,prov:s.prov.key,far:0});toast('The wagon sets out for '+q.tn+'. Keep near it.');}else{MN.q=null;toast('The merchant has gone on without you');}}}}
  for(const C of [...CARAVANS]){const [x,z]=carPos(C);const d=Math.hypot(x-OX-PL.x,z-OZ-PL.z);
    if(C.esc){if(d>110){C.far+=1;if(C.far===10)toast('The wagon is getting away from you!');if(C.far>25){toast('The wagon went on without you. Your task is failed.');MN.q=null;saveDirty=true;carRemove(C);continue;}}else C.far=0;
      if(!C.amb&&C.t>0.5&&menBorderOfWar(C.prov)){C.amb=1;carAmbush(C);}}
    else if(d>170)carRemove(C);}
  if(!menLand||(carT-=1)>0||CARAVANS.length>1)return;carT=90+Math.random()*90;const X=PL.x+OX,Z=PL.z+OZ,roads=realmTile(Math.floor(X),Math.floor(Z)).roads.filter(r=>r.P.cult.k==='white'&&r.len>30);if(!roads.length)return;
  const rd=roads[Math.floor(Math.random()*roads.length)],[a,b]=Math.random()<0.5?[rd.a,rd.b]:[rd.b,rd.a],d=Math.hypot(a[0]-X,a[1]-Z);if(d<40||d>120)return;
  const x=a[0]-OX,z=a[1]-OZ,bx=Math.floor(x),bz=Math.floor(z);if(bx<3||bz<3||bx>=W-3||bz>=D-3||!genDone[(bx>>4)+(bz>>4)*NCX])return;carSpawn([a,b],{site:rd.P.sites[0],prov:rd.P.key});}
// where a caravan is along its route (world X, Z), as a fraction t of its length
function carPos(C){const T=C.L.reduce((a,b)=>a+b,0)||1;let l=C.t*T;for(let i=1;i<C.route.length;i++){if(l<=C.L[i]||i===C.route.length-1){const k=Math.min(1,l/(C.L[i]||1)),p=C.route[i-1],q=C.route[i];return [p[0]+(q[0]-p[0])*k,p[1]+(q[1]-p[1])*k,Math.atan2(q[0]-p[0],q[1]-p[1])];}l-=C.L[i];}return C.route[C.route.length-1];}
function carFrame(dt){for(const C of [...CARAVANS]){const T=C.L.reduce((a,b)=>a+b,0)||1;C.t=Math.min(1,C.t+1.5*dt/T);const [X,Z,yaw]=carPos(C),x=X-OX,z=Z-OZ,bx=Math.floor(x),bz=Math.floor(z);
    const y=bx>=0&&bz>=0&&bx<W&&bz<D?ground[bx+W*bz]+1:SEA;C.m.grp.position.set(x,y,z);if(yaw!==undefined)C.m.grp.rotation.y=yaw;C.ph+=dt*4;
    const P=C.m.parts;for(const n of ['xLlegFL','xRlegBR','xLlegBR','xRlegFL'])if(P[n])P[n].rotation.x=Math.sin(C.ph)*0.4;for(const n of ['xLlegFR','xRlegBL','xLlegBL','xRlegFR'])if(P[n])P[n].rotation.x=-Math.sin(C.ph)*0.4;
    for(const w of ['whFL','whFR','whBL','whBR'])if(P[w])P[w].rotation.x=C.t*T*1.5;
    for(const [i,g] of C.G.entries())if(g&&!g.dead&&!g.foe){const ox=Math.cos(yaw+1.57)*(i?2.2:-2.2),oz=Math.sin(yaw+1.57)*(i?-2.2:2.2);g.hx=x+ox;g.hz=z+oz;if(Math.hypot(g.x-g.hx,g.z-g.hz)>1.5){g.st='return';g.t=2;}}
    if(C.t>=1){if(C.esc&&MN.q&&MN.q.k==='escort'){toast('The wagon comes safe to '+MN.q.tn+'.');menReward(MN.q);}carRemove(C);}}}
// the provinces that border a gate's war (war-raids.js), where raiders may fall on a wagon
function menBorderOfWar(pk){for(const w of Object.values(WARS||{})){const B=typeof warBorder==='function'&&warBorder(w);if(B&&B.P&&B.P.some(P=>(P.key||P)===pk))return true;}return false;}
function carAmbush(C){const [X,Z]=carPos(C),x=X-OX+12,z=Z-OZ+12,bx=Math.floor(x),bz=Math.floor(z);if(bx<3||bz<3||bx>=W-3||bz>=D-3||!genDone[(bx>>4)+(bz>>4)*NCX])return;
  const G=spawnGroup('band',3,x,ground[bx+W*bz]+1,z,2,{});for(const g of G){g.st='chase';g.t=6;}toast('Raiders out of the wastes fall on the wagon!');}
// ---- the city's day: bells at the hours, the crier, the lamplighters at dusk, market day, the night watch, a minstrel of an
// evening, smoke from the chimneys
let menHour=-1,crierT=20,minstT=0,menTodW=-1;const WATCH_HR=['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth','eleventh','last'];
const WATCH=new Map(),MARKET=new Set(),MINST=new Set();
function menBells(){const h=Math.floor(curT()*24),was=menHour;menHour=h;if(was<0||h===was||h%3!==0)return;let s=null,bd=200;for(const q of menSitesNear(140))if(q.k==='city'||q.k==='village'){const d=Math.hypot(q.X-OX-PL.x,q.Z-OZ-PL.z);if(d<bd){bd=d;s=q;}}
  if(!s)return;menBell([s.X-OX,s.T+16,s.Z-OZ],Math.max(1,(h%12||12)/3|0),s.k==='village');}
function menCrier(){if((crierT-=1)>0)return;crierT=45;const f=foes.find(g=>g.kind==='rcrier'&&!g.dead&&Math.hypot(g.x-PL.x,g.z-PL.z)<26);if(!f)return;menBell([f.x,f.y+2,f.z],3);toast('The crier: '+menNews().replace(/^The crier rings his bell\. /,''));}
function menDusk(){const t=curT(),was=menTodW;menTodW=t;if(was<0)return;
  if(was<0.74&&t>=0.74){for(const s of menSitesNear(30))if(s.k==='city'){for(const p of siteLayout(s).parts)if(p.k==='lamp'){const [x,y,z]=menAt(s,p.u0,p.v0,p.y+3);if(Math.hypot(x-PL.x,z-PL.z)<60)for(let k=0;k<6;k++)spawnP(x,y,z,(Math.random()-.5)*0.8,0.6,(Math.random()-.5)*0.8,[1,0.85,0.45],1,0);}toast('The lamplighters go round the streets of '+s.name);break;}}}
// the night watch: two of the watch walk the avenue of a city at night, from its gate to the citadel and back, calling the hour
function menWatch(){if(!ambNight()){for(const [k,Wt] of WATCH){for(const g of Wt.G)if(!g.dead&&Math.hypot(g.x-PL.x,g.z-PL.z)>40)removeFoe(g);}WATCH.clear();return;}
  for(const s of menSitesNear(20)){if(s.k!=='city'||WATCH.has(s.id))continue;const L=siteLayout(s),f=cityFrame(s),cu=f.cu,rt=s.tiers>=3?f.r2:f.r1,pts=[[-s.R+6,2],[Math.round((cu-rt-s.R)/2),2],[cu-rt-6,2]].map(([u,v])=>menAt(s,u,v,0));
    const [x,,z]=pts[0],bx=Math.floor(x),bz=Math.floor(z);if(bx<2||bz<2||bx>=W-2||bz>=D-2)continue;const G=spawnGroup('r_patrol',1,x,ground[bx+W*bz]+1,z,1,{prov:s.prov.key,site:s,lead:'rwatch'});
    const g2=addFoe('rwatch',x+1,ground[bx+W*bz]+1,z+1,{prov:s.prov.key,site:s,st:'idle',t:1});if(g2)G.push(g2);WATCH.set(s.id,{G:G.filter(g=>g.kind==='rwatch'),pts:pts,i:0,dir:1,callT:20});}
  for(const [k,Wt] of WATCH){const g0=Wt.G.find(g=>!g.dead);if(!g0)continue;const p=Wt.pts[Wt.i];if(Math.hypot(g0.x-p[0],g0.z-p[2])<2.5){Wt.i+=Wt.dir;if(Wt.i<0||Wt.i>=Wt.pts.length){Wt.dir=-Wt.dir;Wt.i+=2*Wt.dir;}}
    for(const g of Wt.G)if(!g.dead&&!g.foe){g.hx=p[0]+(g===g0?0:1);g.hz=p[2];g.st='return';g.t=3;}
    if((Wt.callT-=1)<=0){Wt.callT=30;if(Math.hypot(g0.x-PL.x,g0.z-PL.z)<30){const h=Math.floor(curT()*24),n=(h+4)%24;toast(FOES.rwatch.n+': "The '+WATCH_HR[Math.min(11,n)]+' hour of the night, and all is well!"');}}}}
// market day (every third day): more merchants in the squares, the crier calling it
function menMarketDay(){if(dayN%3!==0||ambNight())return;for(const s of menSitesNear(40)){if(s.k!=='city'||MARKET.has(s.id+':'+dayN))continue;MARKET.add(s.id+':'+dayN);
    const sp=siteLayout(s).spots.filter(q=>q.kind==='market');for(const q of sp){const [x,y,z]=menAt(s,q.u,q.v,q.y);spawnGroup('r_market',3,x,y+1,z,3,{prov:s.prov.key,site:s});}toast('It is market day in '+s.name);}}
// a minstrel at the inn of an evening, playing for the room
const MEN_TUNES=[[523,587,659,698,784,698,659,587],[392,440,494,523,587,523,494,440],[659,587,523,587,659,659,659,0]];
function menMinstrel(){const t=curT();if(t<0.7&&t>0.2){MINST.clear();return;}for(const s of menSitesNear(30)){for(const q of siteLayout(s).spots){if(q.kind!=='inn')continue;const key=s.id+':'+q.u+','+q.v;if(MINST.has(key))continue;
      const [x,y,z]=menAt(s,q.u,q.v,q.y);if(Math.hypot(x-PL.x,z-PL.z)>30)continue;MINST.add(key);addFoe('rminst',x,y+1,z,{prov:s.prov.key,site:s,st:'idle',t:30,spk:'r_inn'});}}
  if((minstT-=1)>0)return;minstT=9;const f=foes.find(g=>g.kind==='rminst'&&!g.dead&&Math.hypot(g.x-PL.x,g.z-PL.z)<24);if(!f)return;const T=MEN_TUNES[Math.floor(Math.random()*3)];
  T.forEach((fq,i)=>{if(fq)tone(fq,fq,0.32,0.02,i*0.34,'triangle',[f.x,f.y+1.5,f.z]);});f.cheer=foeClock+3;}
// smoke from the chimneys of the realm's houses near the player (their stacks found once for each place)
const SMOKE=new Map();let smokeT=0;
function menSmoke(dt){if((smokeT-=dt)>0)return;smokeT=0.5;let n=0;
  for(const s of menSitesNear(30)){let L=SMOKE.get(s.id);if(!L){L=[];for(const p of siteLayout(s).parts){if(p.k!=='house'||!(p.chim||p.xchim))continue;const mg=p.mg||[0,0,0,0],[u,v]=p.chim?partAt(p,mg[0]+p.chim[0],mg[2]+(p.porch||0)+p.chim[1]):partAt(p,mg[0]+(p.W>>1),mg[2]+(p.porch||0)+p.D);
        const [X,Z]=siteXZ(s,u,v),x=Math.round(X)-OX,z=Math.round(Z)-OZ;if(x<0||z<0||x>=W||z>=D)continue;let y=p.y+30;while(y>p.y&&get(x,y,z)===AIR)y--;if(y>p.y+3)L.push([x+0.5,y+1,z+0.5]);}SMOKE.set(s.id,L);}
    for(const [x,y,z] of L){if(n>14||Math.hypot(x-PL.x,z-PL.z)>50)continue;n++;spawnP(x+(Math.random()-.5)*0.3,y,z+(Math.random()-.5)*0.3,(Math.random()-.5)*0.2+0.15,0.6+Math.random()*0.3,(Math.random()-.5)*0.2,[0.62,0.62,0.64],2.6,-0.15);}}}
// ---- beacons: lit at one watchtower of a kingdom (by the player, or by a raid), answered by every beacon of the kingdom in turn;
// a great fire stands over each while it burns
const BEACONS=[];
function useBeacon(x,y,z){const s=realmSiteAt(x+OX,z+OZ,3);if(!s||s.k!=='outpost'||s.prov.cult.k!=='white')return false;if(BEACONS.some(b=>b.s===s&&b.t>0))return true;
  menBeaconChain(s);menGain(1,null);const n=menRidersCome();toast('You light the beacon of '+s.name+'. Across the hills, one after another, the beacons of the realm answer it.'+(n?' Riders of the realm are coming.':''));return true;}
function menBeaconChain(s0){const K=s0.prov.kingdom,ci=Math.floor(s0.X/LS),cj=Math.floor(s0.Z/LS),seen=new Set(),L=[];
  for(let a=-6;a<=6;a++)for(let b=-6;b<=6;b++){const c=stretchCell(landSite(ci+a,cj+b)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);if(realmHeld(c)!==s0.prov.cult)continue;const P=provinceOf(c.i,c.j);if(!P||P.kingdom.key!==K.key)continue;
    for(const s of P.sites)if(s.k==='outpost')L.push([Math.hypot(s.X-s0.X,s.Z-s0.Z),s]);}
  L.sort((a,b)=>a[0]-b[0]);L.forEach(([d,s],i)=>BEACONS.push({s:s,t:-(i*3),life:90,told:i<3||i===L.length-1,last:i===L.length-1,n:L.length}));return L.length;}
function beaconFrame(dt){for(let i=BEACONS.length-1;i>=0;i--){const b=BEACONS[i],was=b.t;b.t+=dt;if(was<0&&b.t>=0&&b.told)toast(b.last&&b.n>3?'The last beacon burns: '+b.n+' beacons are lit across '+b.s.prov.kingdom.name.replace(/^The /,'the ')+'.':'The beacon of '+b.s.name+' is lit!');
    if(b.t<0)continue;if(b.t>b.life){BEACONS.splice(i,1);continue;}const L=siteLayout(b.s),tw=L.parts.find(p=>p.k==='tower');if(!tw)continue;const [x,,z]=menAt(b.s,tw.cu,tw.cv,0),y=tw.y+tw.H+4;
    if(Math.hypot(x-PL.x,z-PL.z)>W)continue;if(Math.random()<dt*30)spawnP(x+(Math.random()-.5)*1.6,y,z+(Math.random()-.5)*1.6,(Math.random()-.5)*0.6,2.5+Math.random()*2,(Math.random()-.5)*0.6,[1,0.45+Math.random()*0.3,0.1],1.4,-0.6);
    if(Math.random()<dt*6)spawnP(x,y+3,z,(Math.random()-.5)*0.5,1.5,(Math.random()-.5)*0.5,[0.3,0.3,0.3],4,-0.3);}}
// riders of the realm come to the player, answering a beacon
function menRidersCome(){const P=realmOfColumn(Math.floor(PL.x+OX),Math.floor(PL.z+OZ));if(!P||P.cult.k!=='white')return 0;const a=PL.yaw+3.14,x=PL.x+Math.sin(a)*28,z=PL.z+Math.cos(a)*28,bx=Math.floor(x),bz=Math.floor(z);
  if(bx<3||bz<3||bx>=W-3||bz>=D-3||!genDone[(bx>>4)+(bz>>4)*NCX])return 0;let n=0;for(let i=0;i<3;i++){const f=addFoe('rknight',x+i*2,ground[bx+W*bz]+1,z,{prov:P.key,site:P.sites[0],st:'return',t:6});if(f){f.aid=MN.pt+90;f.hx=PL.x;f.hz=PL.z;n++;}}return n;}
// ---- the village fair (every fourth evening): dancing about the maypole, a bonfire, a fiddle; keeping it feeds the player
let FAIR=null;
function fairTick(){const t=curT(),on=dayN%4===1&&t>0.7&&t<0.97;if(!on){if(FAIR)fairEnd();return;}
  if(FAIR&&Math.hypot(FAIR.x-PL.x,FAIR.z-PL.z)>120)fairEnd();
  if(!FAIR){for(const s of menSitesNear(60)){if(s.k!=='village')continue;const q=siteLayout(s).spots.find(p=>p.kind==='fair');if(!q)continue;const [x,y,z]=menAt(s,q.u,q.v,q.y),r=festRing(x,z,y);if(!r)continue;
      const G=[],n=8;for(let i=0;i<n;i++){const a=i/n*6.283,g=spawnGroup('r_fair',1,x+Math.cos(a)*r,y,z+Math.sin(a)*r,0.8,{prov:s.prov.key,site:s})[0];if(g){g.fest={a:a,r:r};g.hold=0;G.push(g);}}
      FAIR={s:s,x:x,y:y,z:z,r:r,G:G,kept:0,tuneT:1,told:0};break;}return;}
  const d=Math.hypot(FAIR.x-PL.x,FAIR.z-PL.z);if(d<40&&!FAIR.told){FAIR.told=1;toast('The folk of '+FAIR.s.name+' keep the fair on the green: dancing round the maypole, and a bonfire');}
  if(d<16){FAIR.kept++;if(FAIR.kept>=20&&MN.fair!==dayN){MN.fair=dayN;saveDirty=true;if(SURV()){food=Math.min(20,food+8);hp=Math.min(20,hp+4);drawStats();}menGain(3,'You kept the fair with the folk of '+FAIR.s.name);}}}
function fairFrame(dt){const F=FAIR;if(!F)return;for(const g of F.G){if(g.dead||g.gone||g.foe||!g.fest)continue;g.fest.a+=dt*1.4/g.fest.r;const a=g.fest.a,tx=F.x+Math.cos(a)*g.fest.r,tz=F.z+Math.sin(a)*g.fest.r,dx=tx-g.x,dz=tz-g.z,d=Math.hypot(dx,dz),st=Math.min(d,3*dt);
    g.st='dance';g.t=5;if(d>0.01){const nx=g.x+dx/d*st,nz=g.z+dz/d*st,ny=foeStand(nx,g.y+1,nz,2);if(ny>0&&Math.abs(ny-g.y)<=1.2){g.x=nx;g.z=nz;g.y=g.gy=ny;}}g.sp=Math.min(2.4,st/Math.max(dt,1e-3));g.hd=g.yaw=Math.atan2(-Math.sin(a),Math.cos(a));if(Math.random()<dt*0.3)g.cheer=foeClock+1;}
  if(Math.random()<dt*14){const a=Math.random()*6.283;spawnP(F.x+5+Math.cos(a)*0.6,F.y+1,F.z+5+Math.sin(a)*0.6,(Math.random()-.5)*0.4,1.5+Math.random(),(Math.random()-.5)*0.4,[1,0.5+Math.random()*0.3,0.12],0.9,-0.4);}
  if((F.tuneT-=dt)<=0){F.tuneT=4;if(Math.hypot(F.x-PL.x,F.z-PL.z)<50){const T=[659,784,880,784,659,587,523,587,659,659,587,523];T.forEach((fq,i)=>tone(fq,fq*1.01,0.2,0.018,i*0.22,'sawtooth',[F.x,F.y+1.5,F.z]));}}}
function fairEnd(){if(!FAIR)return;for(const g of FAIR.G)if(!g.dead&&!g.gone){g.fest=null;if(Math.hypot(g.x-PL.x,g.z-PL.z)>40)removeFoe(g);else{g.st='idle';g.t=2;}}FAIR=null;}
// ---- the countryside at work: a shepherd with a flock, a ploughman with his ox, at the farmsteads and villages by day
const WORK=new Set();
function menWork(){if(ambNight())return;for(const s of menSitesNear(70)){if((s.k!=='farm'&&s.k!=='village')||WORK.has(s.id))continue;const q=siteLayout(s).spots.find(p=>p.kind==='field');if(!q)continue;
    const [X,Z]=siteXZ(s,q.u,q.v),x=X-OX+0.5,z=Z-OZ+0.5,bx=Math.floor(x),bz=Math.floor(z);if(bx<3||bz<3||bx>=W-3||bz>=D-3||!genDone[(bx>>4)+(bz>>4)*NCX])continue;WORK.add(s.id);const y=ground[bx+W*bz]+1;
    if(hsh(Math.round(s.X),9913,Math.round(s.Z))<0.5){addFoe('rshep',x,y,z,{prov:s.prov.key,site:s,st:'idle',t:3,spk:'r_field'});for(let i=0;i<4;i++){const ax=x+2+Math.random()*4,az=z+Math.random()*4-2,ay=standY(ax,y+1,az);if(ay>0)addAnimal('sheep',ax,ay,az,{pen:{x:x,z:z,r:7}});}}
    else{addFoe('rfarmer',x,y,z,{prov:s.prov.key,site:s,st:'idle',t:3,spk:'r_field'});const ay=standY(x+2,y+1,z);if(ay>0)addAnimal('ox',x+2,ay,z,{pen:{x:x,z:z,r:5}});}}
  for(const id of [...WORK]){if(!menSitesNear(160).some(s=>s.id===id))WORK.delete(id);}}
// ---- ships of the realm coming in to a port or putting out from it
const MEN_SHIPS=[];let mshipT=60;
function menShipTick(){if((mshipT-=1)>0)return;mshipT=150+Math.random()*120;const port=menSitesNear(170).find(s=>s.k==='port');if(!port)return;const L=siteLayout(port),out=Math.random()<0.5;
  const [x0,z0]=siteXZ(port,L.qL+(out?14:120),0),[x1,z1]=siteXZ(port,L.qL+(out?15:119),0),m=amBuild('cog',0,{});scene.add(m.grp);const sh={m:m,X:x0,Z:z0,dx:x1-x0,dz:z1-z0,t:0,y:SEA+0.3,out:out,life:out?140:95};
  m.grp.rotation.y=Math.atan2(sh.dx,sh.dz);MEN_SHIPS.push(sh);toast(out?'A cog of the realm puts out from '+port.name:'A cog of the realm is coming in to '+port.name);}
function menShipFrame(dt){for(let i=MEN_SHIPS.length-1;i>=0;i--){const s=MEN_SHIPS[i];s.t+=dt;const v=s.out?Math.min(2.6,0.3+s.t*0.06):Math.max(0.2,1.4-s.t*0.012);s.X+=s.dx*v*dt;s.Z+=s.dz*v*dt;const x=s.X-OX,z=s.Z-OZ;
    s.m.grp.position.set(x,s.y+Math.sin(s.t*0.7)*0.1,z);if(s.t>s.life||x<-60||z<-60||x>W+60||z>D+60){scene.remove(s.m.grp);scene.remove(s.m.shadow);s.m.mat.dispose();s.m.shadow.material.dispose();MEN_SHIPS.splice(i,1);}}}
// ---- the silver tree in flower: petals falling from it, once an Emberlord has fallen (or for a knight of the realm)
let petalT=0;
function menTreeBloom(dt){if((petalT-=dt)>0)return;petalT=0.15;if(!(fallenLords&&fallenLords.size||MN.kn))return;for(const s of menSitesNear(40)){if(s.k!=='city'||!s.prov.capital)continue;const L=siteLayout(s);if(!L.tree)continue;
    const [x,y,z]=menAt(s,L.tree[0],L.tree[1],L.tree[2]+10);if(Math.hypot(x-PL.x,z-PL.z)>50)continue;const a=Math.random()*6.283,r=Math.random()*4;spawnP(x+Math.cos(a)*r,y,z+Math.sin(a)*r,(Math.random()-.5)*0.4,-0.4,(Math.random()-.5)*0.4,[1,0.97,1],5,0.03);}}
// ---- the passing bell for one of the realm's folk fallen near the player
let passT=0;
function menPassing(f){if(!f||f.war||f.hst||passT>foeClock||!FOES[f.kind].folk||!menPeopleOf(f)||Math.hypot(f.x-PL.x,f.z-PL.z)>50)return;passT=foeClock+30;setTimeout(()=>{menBell([f.x,f.y+8,f.z],3,true);},1500);}
// ---- each frame (from menFrame): the tourney's riding, the caravans, the fair, beacons, ships, smoke, petals; each second the rest
function menLife(dt){tourFrame(dt);carFrame(dt);fairFrame(dt);beaconFrame(dt);menShipFrame(dt);if(menLand||MEN_SHIPS.length){menSmoke(dt);menTreeBloom(dt);}if((menLandT-=dt)>0)return;menLandT=1;
  menLand=menLandNow();tourTick();carTick();fairTick();menShipTick();if(menLand||WATCH.size){menBells();menCrier();menDusk();menWatch();menMarketDay();menMinstrel();menWork();}}
