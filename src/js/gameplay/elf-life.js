// ---- The life of the elves (D-088): what they do about the player in their lands, day and night.
//
// Festivals under the stars: on one night in two at each of their places (every night of the full moon), the elves keep festival
// where they gather (the high elves' gardens, courts and quays, the wood elves' glades and market): a ring of dancers circling,
// singers about them, a song with harps, lanterns rising into the sky. Whoever keeps it with them a while is rested, and the
// elves think the better of them (once a night). Dawn and dusk: horns from their places and the folk turning to the light to
// sing. Lights: motes of pale light drifting at night in their lands; golden leaves falling in the wood elves'. The archery
// contest at their ranges and training grounds (speak with an archer there): a minute to put arrows in the butts, prizes by the
// score. Travellers on their roads, some of them leaving for the havens with all they have; the white ships that sail from the
// havens into the west. A lament when one of them falls near the player. Their places on the map: a star for the high elves',
// a leaf for the wood elves', a broken star for the ruins of the elder days.
let elfLand=null,elfLandT=0;
// which people's land the player is in (once a second): 'e', 'w' or null
function elfLandNow(){const P=realmOfColumn(Math.floor(PL.x+OX),Math.floor(PL.z+OZ)),C=P&&P.cult;return C&&C.k==='elf'?'e':C&&C.k==='wood'?'w':null;}
// ---- the song: phrases of chords sung by many voices over a harp, at a place (the festival, dawn and dusk, a lament in a minor key)
const ELF_SONG=[[[523,659,784],[587,740,880],[659,784,988],[587,740,880]],[[440,554,659],[494,587,740],[554,659,831],[440,554,659]],[[392,494,587],[440,523,659],[494,587,740],[523,659,784]]];
const ELF_LAMENT=[[440,523,659],[392,466,587],[349,440,523],[330,392,494]];
function elfSong(at,lament,k){const ph=lament?ELF_LAMENT:ELF_SONG[(k||0)%ELF_SONG.length];for(let i=0;i<ph.length;i++){for(const f of ph[i])voice(f,f*1.005,lament?1.6:1.15,lament?0.014:0.016,{type:'sine',form:1300,q:1.1,vib:5,vd:0.015,delay:i*(lament?1.5:1.1)},at);
    tone(ph[i][0]/2,ph[i][0]/2,1.3,0.02,i*(lament?1.5:1.1),'triangle',at);tone(ph[i][2],ph[i][2],0.5,0.012,i*(lament?1.5:1.1)+0.3,'triangle',at);}}
// ---- festivals
const FEST_SPOT={e:new Set(['market','quay','green','garden','court']),w:new Set(['market','glade','garden'])};
let FEST=null,festT=0;
const festTonight=s=>hsh(Math.round(s.X)+dayN*7,9841,Math.round(s.Z))<0.5||dayN%8===0;
// the widest ring about (x, z) at height y that the dancers can walk all round (twelve points of it standing clear), or 0
function festRing(x,z,y){for(const r of [4.5,3.5,2.8]){let ok=true;for(let k=0;k<12&&ok;k++){const a=k/12*6.283,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r,bx=Math.floor(px),bz=Math.floor(pz);
    if(bx<1||bz<1||bx>=W-1||bz>=D-1||!genDone[(bx>>4)+(bz>>4)*NCX]){ok=false;break;}const sy=foeStand(px,y+1,pz,2);if(sy<0||Math.abs(sy-y)>1)ok=false;}if(ok)return r;}return 0;}
// the nearest place keeping festival tonight within reach of the player, where there is room to dance
function festFind(){const X=PL.x+OX,Z=PL.z+OZ,C0=[];
  for(const s of realmTile(Math.floor(X),Math.floor(Z)).sites){const C=s.prov.cult;if((C.k!=='elf'&&C.k!=='wood')||Math.hypot(s.X-X,s.Z-Z)>s.R+70||!festTonight(s))continue;const p=C.k==='elf'?'e':'w';
    for(const q of siteLayout(s).spots){if(!FEST_SPOT[p].has(q.kind))continue;const [x,z]=siteXZ(s,q.u,q.v),d=Math.hypot(x-X,z-Z);if(d<70)C0.push({s:s,p:p,X:x+0.5,Z:z+0.5,y:q.y,d:d,moon:dayN%8===0});}}
  C0.sort((a,b)=>a.d-b.d);for(const c of C0){const r=festRing(c.X-OX,c.Z-OZ,c.y);if(r){c.r=r;return c;}}return null;}
// a festival begins: dancers in a ring about its middle, singers outside it
function festBegin(F0){const x=F0.X-OX,z=F0.Z-OZ,tab=F0.s.prov.cult.fp+(F0.p==='e'?'court':'glade'),G=[],rr=F0.r||4.5,n=Math.round((F0.moon?12:8)*rr/4.5);
  for(let i=0;i<n;i++){const a=i/n*6.283,g=spawnGroup(tab,1,x+Math.cos(a)*rr,F0.y,z+Math.sin(a)*rr,0.8,{prov:F0.s.prov.key,site:F0.s})[0];if(!g)continue;g.fest={a:a,r:rr};g.st='return';g.t=5;G.push(g);}
  for(let i=0;i<3;i++){const a=i/3*6.283+0.5,g=spawnGroup(tab,1,x+Math.cos(a)*(rr+3.5),F0.y,z+Math.sin(a)*(rr+3.5),0.8,{prov:F0.s.prov.key,site:F0.s})[0];if(!g)continue;g.sing=1;g.st='idle';g.t=999;G.push(g);}
  FEST=Object.assign(F0,{G:G,kept:0,songT:2,told:0,lanT:0});return FEST;}
function festEnd(){if(!FEST)return;for(const g of FEST.G)if(!g.dead&&!g.gone){g.fest=null;g.sing=0;if(Math.hypot(g.x-PL.x,g.z-PL.z)>40)removeFoe(g);else{g.st='idle';g.t=2;}}FEST=null;}
// every frame: the dance goes round, the lanterns rise, the song is sung
function festFrame(dt){const F0=FEST;if(!F0)return;const x=F0.X-OX,z=F0.Z-OZ;
  for(const g of F0.G){if(g.dead||g.gone||g.foe)continue;if(g.fest){const R=g.fest.r;g.fest.a+=dt/R;const a=g.fest.a,tx=x+Math.cos(a)*R,tz=z+Math.sin(a)*R,dx=tx-g.x,dz=tz-g.z,d=Math.hypot(dx,dz),st=Math.min(d,(d>1.5?2.4:1.3)*dt);g.st='dance';g.t=5; // (stepped here round the ring, not by the folk's own walking)
      if(d>0.01){const nx=g.x+dx/d*st,nz=g.z+dz/d*st,ny=foeStand(nx,g.y+1,nz,2);if(ny>0&&Math.abs(ny-g.y)<=1.2){g.x=nx;g.z=nz;g.y=g.gy=ny;}}g.sp=Math.min(2,st/Math.max(dt,1e-3));g.hd=g.yaw=Math.atan2(-Math.sin(a),Math.cos(a));if(Math.random()<dt*0.15)g.cheer=foeClock+1.2;}
    else if(g.sing){g.hd=g.yaw=Math.atan2(x-g.x,z-g.z);}}
  if((F0.lanT-=dt)<=0){F0.lanT=F0.moon?0.25:0.4;const a=Math.random()*6.283,r=Math.random()*5;spawnP(x+Math.cos(a)*r,F0.y+1.5,z+Math.sin(a)*r,(Math.random()-.5)*0.3,0.9+Math.random()*0.5,(Math.random()-.5)*0.3,[1,0.82,0.48],14,-0.02);}
  if((F0.songT-=dt)<=0){F0.songT=6+Math.random()*3;if(Math.hypot(x-PL.x,z-PL.z)<60)elfSong([x,F0.y+2,z],false,Math.floor(Math.random()*3));}}
// once a second: festivals begun at night and ended at day; keeping one with the elves
function festTick(){if(!ambNight()){if(FEST)festEnd();return;}
  if(FEST&&Math.hypot(FEST.X-OX-PL.x,FEST.Z-OZ-PL.z)>130)festEnd();
  if(!FEST){if((festT-=1)>0)return;festT=10;const F0=festFind();if(F0&&folkCount()<FOLK_CAP+10)festBegin(F0);return;}
  const d=Math.hypot(FEST.X-OX-PL.x,FEST.Z-OZ-PL.z);if(d<40&&!FEST.told){FEST.told=1;toast('The elves of '+FEST.s.name+' keep festival under the stars'+(FEST.moon?': the feast of the full moon':''));}
  if(d<18){FEST.kept+=1;if(FEST.kept>=25&&EF.fe!==dayN){EF.fe=dayN;saveDirty=true;if(SURV()){hp=20;food=Math.min(20,food+6);drawStats();}elfGain(FEST.p,FEST.moon?6:3,'You kept the festival with the elves of '+FEST.s.name+', and you are rested');}}}
// ---- motes of light at night in their lands, golden leaves in the wood elves'
let moteT=0,leafT=0;
function elfLights(dt){if(!elfLand)return;const bx=Math.floor(PL.x),bz=Math.floor(PL.z);if(bx<0||bz<0||bx>=W||bz>=D||PL.y<ground[bx+W*bz]-4)return;
  if(ambNight()&&(moteT-=dt)<=0){moteT=0.12;const a=Math.random()*6.283,r=3+Math.random()*12;spawnP(PL.x+Math.cos(a)*r,PL.y+0.5+Math.random()*3,PL.z+Math.sin(a)*r,(Math.random()-.5)*0.25,(Math.random()-.4)*0.25,(Math.random()-.5)*0.25,elfLand==='w'?[0.8,1,0.6]:[0.8,0.88,1],7,-0.01);}
  if(elfLand==='w'&&(leafT-=dt)<=0){leafT=0.2;const a=Math.random()*6.283,r=Math.random()*12;spawnP(PL.x+Math.cos(a)*r,PL.y+7+Math.random()*6,PL.z+Math.sin(a)*r,0.3+(Math.random()-.5)*0.4,-0.5,(Math.random()-.5)*0.4,[0.96,0.74,0.26],12,0.02);}}
// ---- dawn and dusk: horns from their places, the folk turned to the light, singing
let elfTod=-1;
function elfDawnDusk(){const t=curT(),was=elfTod;elfTod=t;if(was<0||!elfLand)return;const dawn=was<0.24&&t>=0.24,dusk=was<0.76&&t>=0.76;if(!dawn&&!dusk)return;
  const X=PL.x+OX,Z=PL.z+OZ;let s=null,bd=160;for(const q of realmTile(Math.floor(X),Math.floor(Z)).sites){const C=q.prov.cult;if(C.k!=='elf'&&C.k!=='wood')continue;const d=Math.hypot(q.X-X,q.Z-Z);if(d<bd){bd=d;s=q;}}
  if(!s)return;const at=[s.X-OX,s.T+12,s.Z-OZ];warSignal('muster',elfLand,at);setTimeout(()=>warSignal('muster',elfLand,at),2600);
  let n=0;foeNear(PL.x,PL.z,50,g=>{if(g.dead||g.foe||!FOES[g.kind].folk||elfPeopleOf(g)!==elfLand)return;g.st='idle';g.t=25;g.yaw=g.hd=dawn?Math.PI/2:-Math.PI/2;g.dawn=foeClock+25;n++;},0);
  if(n)setTimeout(()=>elfSong([PL.x+6,PL.y+3,PL.z],false,dawn?2:1),1500);toast(dawn?'Horns at the dawn: the elves of '+s.name+' turn to the light and sing':'Horns at dusk: the elves of '+s.name+' sing the light down');}
// ---- the archery contest at a range or training ground: a minute to put arrows in the butts (a straw butt one, its painted
// eye two); arrows for three, more and the elves' regard for six, an elven bow for ten
let CONTEST=null;
function elfContest(f,p){if(CONTEST)return 'A contest is already under way';const x=f.x,z=f.z;let n=0;for(let dx=-24;dx<=24;dx++)for(let dz=-24;dz<=24;dz++)for(let dy=-4;dy<=6;dy++){const id=get(Math.floor(x)+dx,Math.floor(f.y)+dy,Math.floor(z)+dz);if(id===HAYBALE||id===WOOLR)n++;}
  if(!n)return 'There are no butts here to shoot at';CONTEST={p:p,x:x,z:z,t:60,pts:0,n:0,who:FOES[f.kind].n};closeInv();toast('The contest begins: a minute to put your arrows in the butts. A straw butt is one, its painted eye two');return false;}
// an arrow of the player's stuck (war-arms.js): in a butt near the contest, it scores
function elfArrowIn(s){const C=CONTEST;if(!C||!s.byP||Math.hypot(s.x-C.x,s.z-C.z)>30)return;let best=0;
  for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(let dz=-1;dz<=1;dz++){const id=get(Math.floor(s.x+dx*0.45),Math.floor(s.y+dy*0.45),Math.floor(s.z+dz*0.45));if(id===WOOLR)best=2;else if(id===HAYBALE&&best<1)best=1;}
  if(best){C.pts+=best;C.n++;toast((best===2?'In the eye! ':'In the butt. ')+C.pts+' so far');}}
function contestTick(){const C=CONTEST;if(!C)return;C.t-=1;if(C.t===30)toast('Half the minute gone: '+C.pts);if(C.t>0)return;CONTEST=null;
  const got=[];if(C.pts>=3){if(SURV())addItem(409,16);got.push('16 arrows');}if(C.pts>=6)elfGain(C.p,3,null);if(C.pts>=10&&SURV()&&countOf(407)<1){addItem(407,1);got.push('an Elven Bow');}drawBar(true);
  toast('The contest is over: '+C.pts+' with '+C.n+' arrows. '+(C.pts>=10?'The elves cheer: none of them did better. ':C.pts>=6?'The elves nod: well shot. ':C.pts>=3?'Not bad, for one who is not an elf. ':'The elves are kind about it. ')+(got.length?'The prize: '+got.join(' and ')+'.':''));}
// ---- travellers on their roads, some leaving for the havens; the white ships sailing west
Object.assign(FOE_HOME,{e_trav:[['elady',2],['elord',2],['elore',1]],w_trav:[['wfolk',2],['wlady',1],['wlord',0.5]]});
let travT=20;
function elfTravel(){if(!elfLand||(travT-=1)>0)return;travT=40+Math.random()*30;if(folkCount()>=FOLK_CAP-6||foes.some(f=>f.trav&&!f.dead))return;
  const X=PL.x+OX,Z=PL.z+OZ,roads=realmTile(Math.floor(X),Math.floor(Z)).roads.filter(r=>r.k==='high'&&(r.P.cult.k==='elf'||r.P.cult.k==='wood'));if(!roads.length)return;
  const rd=roads[Math.floor(Math.random()*roads.length)],t=Math.random(),px=rd.a[0]+(rd.b[0]-rd.a[0])*t,pz=rd.a[1]+(rd.b[1]-rd.a[1])*t,d=Math.hypot(px-X,pz-Z);if(d<30||d>75)return;
  const x=px-OX,z=pz-OZ,bx=Math.floor(x),bz=Math.floor(z);if(bx<3||bz<3||bx>=W-3||bz>=D-3||!genDone[(bx>>4)+(bz>>4)*NCX])return;
  const hv=rd.P.sites.find(s=>s.k==='haven'),toHv=hv&&[rd.a,rd.b].some(e=>Math.hypot(e[0]-sitePort(hv)[0],e[1]-sitePort(hv)[1])<3),leave=!!hv&&Math.random()<0.5,
    dir=leave&&toHv?(Math.hypot(rd.b[0]-sitePort(hv)[0],rd.b[1]-sitePort(hv)[1])<3?1:-1):Math.random()<0.5?1:-1;
  const G=spawnGroup(rd.P.cult.fp+'trav',2+Math.floor(Math.random()*3),x,ground[bx+W*bz]+1,z,2,{prov:rd.P.key,site:rd.P.sites[0]});
  for(const f of G){f.road={rd:rd,dir:dir,along:t*rd.len};f.trav=1;f.leave=leave?1:0;f.carry=leave;f.st='idle';f.t=0.5;}}
function elfTravelMeet(){for(const f of foes){if(!f.leave||f.dead||f.met||Math.hypot(f.x-PL.x,f.z-PL.z)>8)continue;for(const g of foes)if(g.leave&&Math.hypot(g.x-f.x,g.z-f.z)<12)g.met=1;
  toast('Elves on the road with all they own, going down to the haven. "The sea calls us, and we go. Fare well, '+(elfName(elfPeopleOf(f))||'traveller').split(' ')[0]+'."');return;}}
// a white ship setting sail from a haven near the player, every few minutes: out along the harbour and away west over the sea
const elfShips=[];let shipT=40;
function elfShipTick(){if((shipT-=1)>0)return;shipT=200+Math.random()*160;const X=PL.x+OX,Z=PL.z+OZ;let hv=null;for(const s of realmTile(Math.floor(X),Math.floor(Z)).sites)if(s.k==='haven'&&Math.hypot(s.X-X,s.Z-Z)<200)hv=s;
  if(!hv)return;const L=siteLayout(hv),[x0,z0]=siteXZ(hv,L.qL+12,0),[x1,z1]=siteXZ(hv,L.qL+13,0),m=amBuild('whiteship',0,{});scene.add(m.grp);
  const sh={m:m,X:x0,Z:z0,dx:x1-x0,dz:z1-z0,t:0,y:SEA+0.4};m.grp.rotation.y=Math.atan2(sh.dx,sh.dz);elfShips.push(sh);toast('A white ship sails from '+hv.name+' into the west, and does not turn back');}
function elfShipFrame(dt){for(let i=elfShips.length-1;i>=0;i--){const s=elfShips[i];s.t+=dt;const v=Math.min(3,0.3+s.t*0.08);s.X+=s.dx*v*dt;s.Z+=s.dz*v*dt;const x=s.X-OX,z=s.Z-OZ;
    s.m.grp.position.set(x,s.y+Math.sin(s.t*0.8)*0.08,z);const u=s.m.mat.uniforms;if(u.eL)u.eL.value=1;
    if(s.t>150||x<-40||z<-40||x>W+40||z>D+40){scene.remove(s.m.grp);scene.remove(s.m.shadow);s.m.mat.dispose();s.m.shadow.material.dispose();elfShips.splice(i,1);}}}
// ---- a lament for one of them fallen near the player (foeSlain, foeFalls)
let lamentT=0;
function elfLament(f){if(!f||f.war||f.hst||lamentT>foeClock||!FOES[f.kind].folk||!elfPeopleOf(f)||Math.hypot(f.x-PL.x,f.z-PL.z)>40)return;lamentT=foeClock+25;
  setTimeout(()=>{elfSong([f.x,f.y+2,f.z],true);toast('The elves sing a lament for '+(f.nm||'the fallen'));},1200);}
// ---- each frame (from elfFrame): festivals, lights, the ships; each second: the land, dawn and dusk, the contest, travellers
function elfLife(dt){festFrame(dt);elfLights(dt);elfShipFrame(dt);if((elfLandT-=dt)>0)return;elfLandT=1;elfLand=elfLandNow();festTick();elfDawnDusk();contestTick();elfTravel();elfTravelMeet();elfShipTick();}
