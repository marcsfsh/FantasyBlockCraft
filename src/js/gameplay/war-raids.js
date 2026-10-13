// ---- Raids on the bordering realms (W6, D-073; Q147, Q148, Q173). The wastes strike out of every found gate's war at the
// provinces nearest it (`warBorder`: the two nearest, and a third within 900 of the camp): warbands raid their villages,
// farmsteads and watchtowers, burning and looting, and now and then, while the gate stands, a warhost lays siege to a city or
// castle; wolf riders roam the borderlands and orcs lie in wait on the roads. The realm answers: beacons lit on its watchtowers,
// its soldiers and knights riding out to the raid, its folk fleeing along the roads. A raid goes on while the player is away and
// is told in the war's chronicle; near the player (`RAID_NEAR`) it is fought out: the warband marches in from the wastes' side,
// fires each building it reaches and goes home after a while if not destroyed. What burns stays burned (edits, kept in the war's
// `rb` like the works' fires) until it is rebuilt half an hour of play later; a raid the player missed leaves its burned
// buildings to be found (`w.rd.bs`). The raiders are foes like any of the wastes: hostile in survival, never in creative (D-073
// changes the pillar that hostile creatures keep to the wastes).
const RAID_NEAR=300,RAID_REB=1800,RAID_FIRST=420,RAID_HOUSE=new Set(['house','smithy','stable','stall','hay','ghall','whut','ehall','dhead','dcrane','ptower','tower','rtower','etower','dtower']),
  RAID_MAX={village:3,farm:2,outpost:1,city:0,fort:0},RAID_KN={white:'rknight',horse:'hlancer',elf:'emarch',wood:'wlong',dwarf:'diron'};
for(const id of [THATCH,GTHATCH,WTHATCH,PLASTER,WATTLE,CTIMBER,WPLANK,EVWOOD,FENCE,TAPESTRY,SHIELDS])WAR_BURN.add(id);for(const id of [THATCH,GTHATCH,WTHATCH,TAPESTRY,SLATE,EVSHINGLE])WAR_CLOTH.add(id);
const RAID_FALL=new Set([SLATE,EVSHINGLE]); // roofs that fall in, in part, when the timbers under them burn
Object.assign(FOE_HOME,{kn_white:[['rknight',1]],kn_horse:[['hlancer',1]],kn_elf:[['emarch',1]],kn_wood:[['wlong',1]],kn_dwarf:[['diron',1]]});
// ---- the border: the provinces nearest a war's gate, planned a slice at a time (4 ms a call); null until ready
const RAID_B=new Map();
function warBorder(w){let B=RAID_B.get(w.id);if(B&&B.done)return B;
  if(!B){const P=wasteGateAt(w.X,w.Z,10);if(!P)return null;const [cx,cz]=wgXZ(P,P.uC0+125,0),ci=Math.floor(cx/LS),cj=Math.floor(cz/LS),q=[],seen=new Set();
    for(let r=0;r<=5;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){if(Math.max(Math.abs(a),Math.abs(b))!==r)continue;const c=stretchCell(landSite(ci+a,cj+b)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);if(realmHeld(c))q.push([c.i,c.j,k]);}
    B={cx:cx,cz:cz,q:q,P:[],S:[],done:false};RAID_B.set(w.id,B);}
  const t0=performance.now();
  while(B.q.length){const [i,j,k]=B.q[0];let pv=provC.get(k);
    if(pv===undefined){let g=provJ.get(k);if(!g){g=planProvince(stretchCell(landSite(i,j)),k);provJ.set(k,g);}let r;while(!(r=g.next()).done)if(performance.now()-t0>4)return null;provJ.delete(k);provC.set(k,r.value);pv=r.value;}
    B.q.shift();if(pv&&pv.sites.length){let d=1e9;for(const s of pv.sites)d=Math.min(d,Math.hypot(s.X-B.cx,s.Z-B.cz));if(d<1600)B.P.push({pv:pv,d:d});}if(performance.now()-t0>4)return null;}
  B.P.sort((a,b)=>a.d-b.d);B.P=B.P.filter((p,i)=>i<2||i<3&&p.d<900);for(const p of B.P)for(const s of p.pv.sites)B.S.push({s:s,d:Math.hypot(s.X-B.cx,s.Z-B.cz)});
  B.S.sort((a,b)=>a.d-b.d);B.keys=new Set(B.P.map(p=>p.pv.key));B.done=true;return B;}
const raidSite=(B,id)=>{const e=B.S.find(e=>e.s.id===id);return e?e.s:null;};
const raidKind=s=>s.prov.cult.kind[s.k]+' '+s.prov.kingdom.name.replace(/^The /,'the ');
// the buildings of a site that burn, in an order of its own (a raid fires the first it reaches; one missed fires the first b)
function raidHouses(s){const L=siteLayout(s);return L.parts.map((p,i)=>[p,i]).filter(([p])=>RAID_HOUSE.has(p.k)&&(p.bu1-p.bu0+1)*(p.bv1-p.bv0+1)>=9).sort((a,b)=>hsh(s.X+a[1],9951,s.Z)-hsh(s.X+b[1],9951,s.Z));}
// the cells of a building that burn (window coordinates read, world coordinates kept), from the top, at most 300; and a slate or
// shingle roof over them falls in, about half its columns
function raidCells(s,p){const out=[],xs=[],zs=[];for(const [u,v] of [[p.bu0-1,p.bv0-1],[p.bu1+1,p.bv1+1]]){const [X,Z]=siteXZ(s,u,v);xs.push(Math.round(X));zs.push(Math.round(Z));}
  const x0=Math.min(...xs)-OX,x1=Math.max(...xs)-OX,z0=Math.min(...zs)-OZ,z1=Math.max(...zs)-OZ,mx=(x0+x1)>>1,mz=(z0+z1)>>1;if(x0<0||z0<0||x1>=W||z1>=D)return null;
  for(let x=x0;x<=x1;x+=x1-x0||1)for(let z=z0;z<=z1;z+=z1-z0||1)if(!genDone[(x>>4)+(z>>4)*NCX])return null;
  const g=ground[mx+W*mz],fall=[];for(let y=Math.min(H-2,g+26);y>=Math.max(1,g-4);y--)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){const id=world[I(x,y,z)];
    if(WAR_BURN.has(id)){if(out.length<300)out.push([x+OX,y,z+OZ,id]);}else if(RAID_FALL.has(id)&&fall.length<160&&hsh(x+OX,9953,z+OZ)<0.5)fall.push([x+OX,y,z+OZ,id]);}
  return out.concat(fall);}
// set a building alight: its cells catch one after another from where the fire was set (t0 ahead), or (old) stand burned already
function raidBurn(w,cells,x,z,old){if(!w.rb)w.rb=[];const have=new Set(w.rb.map(e=>e[0]));let n=0;
  for(const [X,Y,Z,id] of cells){const k=X+','+Y+','+Z;if(have.has(k)||w.rb.length>=2000)continue;
    if(old!==undefined){const lx=X-OX,lz=Z-OZ;if(get(lx,Y,lz)!==id)continue;setBlock(lx,Y,lz,WAR_CLOTH.has(id)?AIR:CHARWOOD,true);w.rb.push([k,id,old,Math.max(1,Math.round(warPlay)-old)]);}
    else w.rb.push([k,id,Math.round(warPlay+Math.min(14,Math.hypot(X-OX-x,Z-OZ-z)*0.6)),0]);n++;}
  saveDirty=true;return n;}
// a route of points every 16 (world) from a to b
const raidRoute=(a,b)=>{const L=Math.hypot(b[0]-a[0],b[1]-a[1])||1,out=[];for(let s=0;s<=L;s+=16)out.push([a[0]+(b[0]-a[0])*s/L,a[1]+(b[1]-a[1])*s/L]);out.push([b[0],b[1]]);return out;};
// ---- every second (from warStateTick): each found war's raids, begun, fought or settled
const RAID_LIVE=new Map(); // raid key -> {m: the warband, ...} while fought out near the player (not saved)
function warRaidsTick(){let busy=false;for(const w of WARS.values()){const R=w.rd||(w.rd={n:0,nx:Math.round(warPlay+RAID_FIRST*(0.7+0.6*hsh(w.X,9941,w.Z))),L:[],bs:[],bk:[],t:[0,0,0,0]});
    if(busy&&!(RAID_B.get(w.id)||{}).done)continue;const B=warBorder(w);if(!B){busy=true;continue;}
    for(const r of R.L)if(!r.out)raidStep(w,B,r);
    if(warPlay>=R.nx&&warAuto('r'))raidBegin(w,B,R);raidApply(w,B,R);}
  raidBorderTick();}
function raidBegin(w,B,R,force){if(w.el&&w.el.fate&&!force){R.nx=Math.round(warPlay+1e9);return null;} // (its lord fallen, the raids end: W7c; force {s, siege} from the war console, D-077)
  const q=hsh(w.X+R.n*131,9943,w.Z),q2=hsh(w.Z+R.n*71,9945,w.X),siege=force?!!force.siege:!(w.s>=2)&&R.n%4===3;R.n++;if(!force)R.nx=Math.round(warPlay+(!(w.s>=2)?480+360*q2:1200+600*q2));
  const L=B.S.filter(e=>siege?e.s.k==='city'||e.s.k==='fort':RAID_MAX[e.s.k]>0);if(!L.length&&!force)return null;const s=force?force.s:L[Math.floor(q*q*L.length)].s;
  const r={i:R.n-1,k:siege?'siege':'raid',s:s.id,X:Math.round(s.X),Z:Math.round(s.Z),t0:Math.round(warPlay),out:null,b:0,hb:[]};R.L.push(r);const j=R.L.length>16?R.L.findIndex(q=>q.out):-1;if(j>=0)R.L.splice(j,1);
  if(Math.hypot(s.X-(PL.x+OX),s.Z-(PL.z+OZ))<900)toast(siege?'A warhost marches out of the wastes against '+s.name:'Orcs ride out of the wastes to raid '+s.name);saveDirty=true;return r;}
// a raid under way: fought out if the player is near its place, else settled when it would have come there
function raidStep(w,B,r){const s=raidSite(B,r.s);if(!s){r.out='gone';return;}const key=w.id+':'+r.i,L=RAID_LIVE.get(key),d=Math.hypot(s.X-(PL.x+OX),s.Z-(PL.z+OZ)),age=warPlay-r.t0;
  if(L){raidLiveTick(w,B,r,s,L,d);return;}
  if(d<RAID_NEAR&&!r.lv&&age<(r.k==='siege'?240:150)){if(raidLive(w,B,r,s))return;}
  if(age>=(r.k==='siege'?240:150)||r.lv)raidSettle(w,r,s,null);}
// settled: the outcome (by chance when not seen), its mark in the chronicle, the buildings it burned to be found
function raidSettle(w,r,s,L){const R=w.rd,q=hsh(r.X+r.i*13,9947,r.Z),C=s.prov.cult;
  if(!L&&r.lv)r.out=r.k==='siege'?'lifted':r.b?'burned':'driven'; // (fought near, then the game was left: what it did stands)
  else if(!L){if(r.k==='siege')r.out=q<0.5?'lifted':'broken';else{r.out=q<0.6?'burned':'driven';if(r.out==='burned'){r.b=Math.max(1,Math.min(RAID_MAX[s.k],1+Math.floor(q*5)));R.bs.push({s:r.s,t:Math.round(warPlay),b:r.b});if(R.bs.length>40)R.bs.shift();}}}
  else r.out=r.k==='siege'?(L.fell>=L.n*0.6?'broken':'lifted'):r.b?'burned':'driven';
  R.t[0]++;R.t[1]+=r.b;if(r.out==='driven'||r.out==='broken')R.t[2]++;if(r.k==='siege')R.t[3]++;
  const nm=s.name+', '+raidKind(s),from=w.n.replace(/^The /,'the ');
  warLog(w,r.k==='siege'?(r.out==='broken'?'A warhost out of '+from+' laid siege to '+nm+' and was broken before its walls.':'A warhost out of '+from+' laid siege to '+nm+', burned what stood outside its walls and drew off when the riders of the realm came to its relief.'):
    r.out==='burned'?'Orcs out of '+from+' raided '+nm+', burned '+(r.b===1?'one of its buildings':r.b+' of its buildings')+' and carried off its stores. The folk will rebuild.':'Orcs out of '+from+' came to raid '+nm+' and were driven off by '+(C.k==='dwarf'?'its axemen':C.k==='horse'?'its riders':'its guards')+'.');
  if(L&&Math.hypot(s.X-(PL.x+OX),s.Z-(PL.z+OZ))<RAID_NEAR+100)toast(r.out==='driven'||r.out==='broken'?'The raiders are driven off':'The raiders go back to the wastes');
  RAID_LIVE.delete(w.id+':'+r.i);saveDirty=true;}
// a raid the player missed: its burned buildings made when its place is in the loaded world (within the time it takes to rebuild)
function raidApply(w,B,R){for(const e of R.bs){if(e.ap)continue;if(warPlay-e.t>RAID_REB-60){e.ap=1;continue;}const s=raidSite(B,e.s);if(!s){e.ap=1;continue;}
    const x=s.X-OX,z=s.Z-OZ;if(x<s.R+8||z<s.R+8||x>=W-s.R-8||z>=D-s.R-8)continue;const H2=raidHouses(s).slice(0,e.b);let ok=true;const all=[];
    for(const [p] of H2){const c=raidCells(s,p);if(!c){ok=false;break;}all.push(c);}if(!ok)continue;e.ap=1;for(const c of all)raidBurn(w,c,0,0,e.t);}
  // the beacons, put out ten minutes after they were lit
  for(let i=R.bk.length-1;i>=0;i--){const [X,Y,Z,t]=R.bk[i],x=X-OX,z=Z-OZ;if(warPlay-t<600)continue;if(x<0||z<0||x>=W||z>=D||!genDone[(x>>4)+(z>>4)*NCX])continue;if(get(x,Y,z)===BRAZIER)setBlock(x,Y,z,AIR,true);R.bk.splice(i,1);saveDirty=true;}}
// ---- fought out near the player: the warband (or the warhost), the beacons, the realm's answer, the folk fleeing
function raidLive(w,B,r,s){const P=wasteGateAt(w.X,w.Z,10);if(!P)return false;const k=warSz(),siege=r.k==='siege',dx=B.cx-s.X,dz=B.cz-s.Z,dl=Math.hypot(dx,dz)||1,ux=dx/dl,uz=dz/dl;
  const tgt=siege?sitePort(s):[s.X,s.Z],from=[tgt[0]+ux*(siege?200:170),tgt[1]+uz*(siege?200:170)],route=raidRoute(from,tgt),m=[];
  const go=(t,n,o)=>{const g=warParty({id:w.id},t,n,route,o);if(g)m.push(...g);return g;};
  if(!go(siege?'oarmy':'band',Math.round((siege?14:5)+(siege?20:6)*k),{lead:Math.random()<(siege?1:0.4)?'ochief':null}))return false;
  go('owolf',siege?Math.round(2+4*k):Math.round(1+2*k));if(siege){go('oline',Math.round(4+6*k));go('otroll',Math.round(1+2*k),{lead:'tdriver'});}
  for(const f of m){f.raid=r.i;f.rw=w.id;}r.lv=1;const C=s.prov.cult,fp=C.fp,L={m:m,n:m.length,fell:0,t:warPlay,s:s,rel:0,ref:0,beac:0};RAID_LIVE.set(w.id+':'+r.i,L);
  toast(siege?'A warhost of the wastes comes against '+s.name+'!':'Raiders of the wastes fall on '+s.name+'!');foeCall(m[0],'alert');warSignal('muster',{horse:'h',dwarf:'d',elf:'e',wood:'w'}[C.k]||'r',[s.X-OX,s.T+6,s.Z-OZ]);
  return true;}
function raidLiveTick(w,B,r,s,L,d){const live=L.m.filter(f=>!f.dead&&!f.gone),age=warPlay-L.t,C=s.prov.cult,fp=C.fp;L.fell=L.n-live.length;
  // the beacons on the province's watchtowers, from hill to hill
  if(!L.beac&&age>=6){L.beac=1;let n=0;for(const e of B.S){const o=e.s;if(o.prov!==s.prov||o.k!=='outpost')continue;const x=Math.round(o.X)-OX,z=Math.round(o.Z)-OZ;if(x<1||z<1||x>=W-1||z>=D-1||!genDone[(x>>4)+(z>>4)*NCX])continue;
      let y=Math.min(H-3,o.T+48);while(y>o.T-2&&!SOLID[get(x,y,z)])y--;if(get(x,y+1,z)!==AIR)continue;setBlock(x,y+1,z,BRAZIER,true);w.rd.bk.push([x+OX,y+1,z+OZ,Math.round(warPlay)]);n++;}
    toast(n?'The beacons are lit on the heights of '+s.prov.name:'The alarm is raised in '+s.prov.name);if(s.prov.cult.k==='white'||s.prov.cult.k==='horse'){const o=s.prov.sites.find(q=>q.k==='outpost');if(o)menBeaconChain(o);}} // (and the white realm's beacons answer, one after another, across the kingdom: D-089)
  // the realm rides out: from its city or castle (the nearest), its soldiers and knights, along the way to the raid
  if(!L.rel&&age>=25){L.rel=1;let src=null,sd=1e9;for(const e of B.S){const o=e.s;if(o.prov!==s.prov||o===s||o.k!=='city'&&o.k!=='fort')continue;const q=Math.hypot(o.X-s.X,o.Z-s.Z);if(q<sd){sd=q;src=o;}}
    const a=src?sitePort(src):[s.X-(B.cx-s.X)*0.4,s.Z-(B.cz-s.Z)*0.4],route=raidRoute(a,[s.X,s.Z]),o={prov:s.prov.key,site:src||s,lead:FOLK_LEAD[fp+'host']||null},k=warSz();
    const g=warParty({id:w.id},fp+'host',Math.round(5+7*k),route,o),kn=warParty({id:w.id},'kn_'+C.k,Math.round(2+3*k),route,{prov:s.prov.key,site:src||s});
    if(g||kn){toast((C.k==='horse'?'The riders':C.k==='dwarf'?'The axemen':C.k==='elf'?'The knights of the elves':C.k==='wood'?'The wardens of the wood':'The soldiers and knights')+' of '+s.prov.name+' ride out to meet the raiders');for(const f of [...(g||[]),...(kn||[])])f.rel=1;}
    else L.rel=age>90?1:0;}
  // the folk flee along the road to the city
  if(!L.ref&&age>=10){L.ref=1;let to=null,td=1e9;for(const e of B.S){const o=e.s;if(o.prov!==s.prov||o===s||o.k!=='city'&&o.k!=='fort'&&o.k!=='village')continue;const q=Math.hypot(o.X-s.X,o.Z-s.Z);if(q<td){td=q;to=o;}}
    if(to&&r.k!=='siege'){const g=warParty({id:w.id},fp+'street',3+Math.floor(Math.random()*3),raidRoute([s.X,s.Z],[to.X,to.Z]).slice(1),{prov:s.prov.key,site:s});if(g){for(const f of g){f.ref=1;f.war=null;}toast('The folk of '+s.name+' flee toward '+to.name);}}}
  // at the place: each raider makes for the nearest building not yet burning, and fires it
  const H2=r.k==='siege'?[]:raidHouses(s),max=RAID_MAX[s.k]||0;
  for(const f of live){if(f.climb||f.home)continue;const [u,v]=siteUV(s,f.x+OX,f.z+OZ);if(Math.hypot(f.x+OX-s.X,f.z+OZ-s.Z)>s.R+12)continue;
    let best=null,bd=1e9;for(const [p,i] of H2){if(r.hb.includes(i))continue;const du=Math.max(p.bu0-u,0,u-p.bu1),dv=Math.max(p.bv0-v,0,v-p.bv1),q=Math.hypot(du,dv);if(q<bd){bd=q;best=[p,i];}}
    if(!best||r.hb.length>=max)continue;const [p,i]=best;
    if(bd<=2.5||bd<=8&&Math.random()<0.12){const c=raidCells(s,p); /* (at the wall, or a torch thrown onto it in the fighting) */if(c&&c.length){r.hb.push(i);r.b++;raidBurn(w,c,f.x,f.z);f.cheer=foeClock+3;burst(0.9,'lowpass',500,0.7,0.35,0,[f.x,f.y,f.z]);if(r.b===1)toast('The raiders set '+s.name+' alight');}else r.hb.push(i);}
    else if(!f.foe&&!(f.way&&f.way.length)){const cu=Math.max(p.bu0-1,Math.min(p.bu1+1,u)),cv=Math.max(p.bv0-1,Math.min(p.bv1+1,v)),[X,Z]=siteXZ(s,cu,cv);f.hx=X-OX;f.hz=Z-OZ;f.st='return';f.t=12;f.pace=FOES[f.kind].run*0.7;}}
  // home again after a while (or destroyed)
  if(!live.length){raidSettle(w,r,s,L);return;}
  if(!L.home&&age>(r.k==='siege'?420:240)){L.home=1;const back=raidRoute([s.X,s.Z],[s.X+(B.cx-s.X)/Math.hypot(B.cx-s.X,B.cz-s.Z)*260,s.Z+(B.cz-s.Z)/Math.hypot(B.cx-s.X,B.cz-s.Z)*260]);
    for(const f of live){f.foe=null;f.way=back.slice(1).map(q=>[q[0],q[1]]);const q=f.way.shift();f.hx=q[0]-OX;f.hz=q[1]-OZ;f.st='return';f.t=0;f.home=1;}}
  if(L.home&&live.every(f=>Math.hypot(f.x-PL.x,f.z-PL.z)>90||!f.way||!f.way.length)){for(const f of live)if(Math.hypot(f.x-PL.x,f.z-PL.z)>40)removeFoe(f);if(!L.m.some(f=>!f.dead&&!f.gone)||age>600)raidSettle(w,r,s,L);}
  if(d>RAID_NEAR+200){for(const f of live)removeFoe(f);raidSettle(w,r,s,L);}}
// ---- the borderlands near the player: wolf riders roaming, ambushes on the roads; the fled and the roamers gone when far
let raidRoamT=180,raidAmbT=240;
function raidBorderTick(){for(const f of foes)if((f.ref||f.roam)&&!f.dead&&(Math.hypot(f.x-PL.x,f.z-PL.z)>110||!(f.way&&f.way.length)&&f.st==='idle'&&Math.hypot(f.x-PL.x,f.z-PL.z)>40))removeFoe(f);
  const X=Math.floor(PL.x+OX),Z=Math.floor(PL.z+OZ),pv=realmOfColumn(X,Z);if(!pv)return;let w=null,B=null;
  for(const v of WARS.values()){const b=RAID_B.get(v.id);if(b&&b.done&&b.keys.has(pv.key)){w=v;B=b;break;}}if(!w)return;
  if(warAuto('r')){raidRoamT-=1;raidAmbT-=1;}const C=pv.cult,fp=C.fp; // (stopped from the war console, they come only when called: D-077)
  if(raidRoamT<=0){raidRoamT=240+Math.random()*150;const dx=B.cx-X,dz=B.cz-Z,dl=Math.hypot(dx,dz)||1,ux=dx/dl,uz=dz/dl,sd0=Math.random()<0.5?1:-1,n=Math.round(3+2*Math.random());let g=null;
    for(const sd of [sd0,-sd0]){const a=[X+ux*90-uz*sd*60,Z+uz*90+ux*sd*60],b=[X-ux*40+uz*sd*120,Z-uz*40-ux*sd*120];g=warParty({id:w.id},'owolf',n,raidRoute(a,b));if(g)break;} // (the other flank if the first falls outside the loaded world)
    if(g){for(const f of g){f.roam=1;f.war=null;}toast('Wolf riders of the wastes roam the borderlands');foeCall(g[0],'alert');}}
  if(raidAmbT<=0&&realmRoadAt(X,Z,1)){raidAmbT=300+Math.random()*180;const R=realmRoadAt(X,Z,1).rd,ex=(R.b[0]-R.a[0])/(R.len||1),ez=(R.b[1]-R.a[1])/(R.len||1),dir=Math.random()<0.5?1:-1;
    const st=(x,z)=>x<4||z<4||x>=W-4||z>=D-4?-1:foeStand(x,ground[Math.floor(x)+W*Math.floor(z)]+2,z,2),tx=PL.x+ex*dir*20,tz=PL.z+ez*dir*20,ty=st(tx,tz);if(ty<0)return;
    const tr=spawnGroup(fp+'street',3,tx,ty,tz,2,{prov:pv.key}).concat(spawnGroup(fp+'post',2,tx,ty,tz,2,{prov:pv.key})),am=[];
    for(const s of [-1,1]){const ax=tx-ez*s*14,az=tz+ex*s*14,ay=st(ax,az);if(ay>0)am.push(...spawnGroup(Math.random()<0.5?'band':'oscout',3,ax,ay,az,2,{}));}
    for(const f of tr)f.ref=1;for(const f of am){f.roam=1;f.foe=tr[Math.floor(Math.random()*tr.length)]||null;f.eseen=0;f.st='chase';}
    if(am.length){toast('An ambush on the road!');foeCall(am[0],'alert');}}}
// a creature of the wastes slain near a raid counts as at war (war-sworn.js)
const raidZone=()=>{for(const L of RAID_LIVE.values())if(Math.hypot(L.s.X-(PL.x+OX),L.s.Z-(PL.z+OZ))<RAID_NEAR)return true;return false;};
// the panel, the map, the journal
function warRaidPanel(w){const R=w.rd;if(!R||!R.t[0])return '';return '<div>Raids on the realms '+R.t[0]+', buildings burned '+R.t[1]+', driven off '+R.t[2]+'</div>';}
function warRaidMap(g,sx,sz,w){const R=w.rd;if(!R)return;for(const e of R.bs){if(warPlay-e.t>RAID_REB)continue;const B=RAID_B.get(w.id),s=B&&B.done&&raidSite(B,e.s);if(!s)continue;
    g.fillStyle='#d2561c';g.beginPath();g.arc(sx(s.X),sz(s.Z),5,0,6.283);g.fill();}
  for(const r of R.L){if(r.out||!RAID_LIVE.has(w.id+':'+r.i))continue;g.strokeStyle='#d2561c';g.lineWidth=2;g.beginPath();g.arc(sx(r.X),sz(r.Z),9,0,6.283);g.stroke();}}
function warRaidJournal(w,out){const R=w.rd;if(!R||!R.t[0])return;out.push('Raids on the bordering realms: '+R.t[0]+(R.t[3]?' (sieges '+R.t[3]+')':'')+'; buildings burned '+R.t[1]+'; driven off '+R.t[2]+'.');}
