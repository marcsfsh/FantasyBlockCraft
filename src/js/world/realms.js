// ---- The realms of men (D-060): the first of the living kingdoms, high men of a southern realm in white stone and black
// livery. Each stretch of the gentle old lands (Green Hills, Overgrown Farmland, Wild Orchards, Flower Meadows and Old
// Terraces) is held by a kingdom one time in two, and a held stretch is a province: a walled city (in tiers, its citadel at
// the top; the kingdom's capital in three tiers), a castle near its border, villages, farmsteads with their fields, watchtowers
// with beacons on the heights, and roads between them. Plans are pure functions of the seed and the land layout, read from the
// ground before any realm levels it (realmRaw, never cached); colInfoBase then levels the ground under every site (realmGround).
// Kingdoms gather the held stretches of a square of 8 x 8 land cells (some 2500 blocks) under one name; the oldest stretch among
// them holds the capital.
const REALM_SG=16,provC=new Map(),provJ=new Map(),REALM_STEP_MS=6,realmTC=new Map(),TRP={},TRL={};let realmSkip=false;
// the ground before any realm levels it, and never cached (so the plans cannot depend on themselves)
function realmRaw(X,Z){const was=realmSkip;realmSkip=true;try{return colInfoBase(X,Z,TRP);}finally{realmSkip=was;}}
// the people whose lands a stretch lies in (REALM_CULTS, below), and whether they hold it: one stretch in two (c: its first cell)
const realmCult=c=>{const k=LANDS[cellLand(c)].k;for(const n in REALM_CULTS)if(REALM_CULTS[n].lands.has(k))return REALM_CULTS[n];return null;};
// A people may also share a land with its holders (share: {land: [lo, hi)}, D-066): the dwarves take the High Mountains the
// high elves leave, where the same hash falls in their band
const realmHeld=c=>{const C=realmCult(c),q=hsh(c.i,9401,c.j);if(C&&q<0.5)return C;const k=LANDS[cellLand(c)].k;
  for(const n in REALM_CULTS){const S=REALM_CULTS[n].share;if(S&&S[k]&&q>=S[k][0]&&q<S[k][1])return REALM_CULTS[n];}return null;};
// A kingdom gathers its people's held stretches in a square of 8 x 8 cells; the oldest of them holds the royal seat
function kingdomOf(c,C){const ki=Math.floor(c.i/8),kj=Math.floor(c.j/8);let best=null;
  for(let a=0;a<8;a++)for(let b=0;b<8;b++){const s=stretchCell(landSite(ki*8+a,kj*8+b));if(realmHeld(s)===C&&(!best||s.pr>best.pr))best=s;}
  return {key:C.k+ki+','+kj,name:C.kingdom+nameWord(C.names,rngAt(ki,C.ks,kj)),cap:best?best.i+','+best.j:''};}
// The province of the stretch a cell belongs to, or null where no kingdom holds it
function provinceOf(i,j){
  const root=stretchCell(landSite(i,j)),key=landKey(root.i,root.j);if(provC.has(key))return provC.get(key);if(provC.size>3000)provC.clear();
  let P=null;if(realmHeld(root)){const g=provJ.get(key)||planProvince(root,key);provJ.delete(key);let r;while(!(r=g.next()).done);P=r.value;}
  provC.set(key,P);return P;
}
// ---- Planning a province: its cells, a grid of samples of the raw ground every REALM_SG blocks (in or out of it, usable or
// not), then the sites in order (the city, the castle, villages, watchtowers, farmsteads), then the roads between them
const SITE_K={ // R the core, M the margin over which the ground eases back, spread the most the raw ground may vary under it, round or square
  city:{M:20,spread:16,sq:1},fort:{R:22,M:12,spread:12,sq:1},village:{R:26,M:12,spread:9},outpost:{R:8,M:8,spread:14,sq:1},farm:{R:12,M:8,spread:6}};
// The peoples of the realms, each on its own lands with its own sites, names, readout and roads:
//   white: the high men of the southern realms (D-060): walled cities of white stone in square tiers, castles, villages,
//     watchtowers and farmsteads
//   horse: the riders of the plains (D-061): hill towns in round tiers inside a timber palisade under the king's golden hall,
//     round stone holds, steadings of longhouses, beacons on the heights and horse farms, on Golden Steppe, Heath Moors and the
//     Barrow Hills; their walled places are round (wall), the edges of the open ones wander
// R: the radii of their sites (the city's grows with the province); w: how the city weighs the ground (its spread against the
// prominence it wants under it)
const REALM_CULTS={
  white:{k:'white',lands:new Set(['green','farm','orchard','flower','terrace']),names:'realm',folkNames:'human',kingdom:'The Kingdom of ',ks:9403,fp:'r_',
    site:SITE_K,R:{city:40,cap:50,cmax:64,small:34,fort:22,village:26,hamlet:18,outpost:8,farm:12},w:{spread:0.6,prom:0.35,pmax:12},
    label:{fort:'Castle %',outpost:'% Watch',farm:'% Farm'},kind:{city:'a city of',fort:'a castle of',village:'a village of',outpost:'a watchtower of',farm:'a farmstead of'},
    capital:'the royal city of',roads:["The King's Road",'A Country Lane']},
  horse:{k:'horse',lands:new Set(['steppe','moors','barrow']),names:'rider',folkNames:'rider',kingdom:'The Riders of ',ks:9431,fp:'h_',
    site:{city:{M:22,spread:24,wall:1},fort:{M:12,spread:12,wall:1},village:{M:12,spread:9},outpost:{M:8,spread:16,wall:1},farm:{M:10,spread:7}},
    R:{city:38,cap:46,cmax:58,small:32,fort:20,village:24,hamlet:16,outpost:9,farm:16},w:{spread:0.3,prom:0.8,pmax:20},
    label:{fort:'% Hold',outpost:'% Beacon',farm:'% Stud'},kind:{city:'a hill town of',fort:'a hold of',village:'a steading of',outpost:'a beacon of',farm:'a horse farm of'},
    capital:'the king\'s seat of',roads:["The Riders' Road",'A Cart Track']},
  // the high elves of the elder realms (D-062): hidden cities, fastnesses, refuges, watch-spires and gardens on the mountains,
  // the high meadows, the crags and the sea cliffs. They need no level ground: their sites take rough land (spread), and the
  // ground under them is cut into terraces that follow the land (terr: the step), with a platform under every building
  // (D-088: and where a province meets the sea, a haven: haven, its quays toward the water)
  elf:{k:'elf',lands:new Set(['mtn','alpine','karst','fjord','chalk']),names:'elder',folkNames:'elder',kingdom:'The Elder Realm of ',ks:9441,fp:'e_',haven:1,
    site:{city:{M:24,spread:72,wall:1,terr:5},fort:{M:14,spread:48,wall:1,terr:4},village:{M:14,spread:48,terr:4},outpost:{M:10,spread:64,wall:1,terr:4},farm:{M:12,spread:36,terr:3},haven:{M:12,spread:80,terr:4}},
    R:{city:42,cap:52,cmax:62,small:32,fort:22,village:24,hamlet:18,outpost:8,farm:20,haven:28},w:{spread:0.08,prom:0.4,pmax:24},
    label:{fort:'% Fastness',outpost:'% Spire',farm:'% Gardens',haven:'% Haven'},kind:{city:'a hidden city of',fort:'a fastness of',village:'a refuge of',outpost:'a watch-spire of',farm:'the gardens of',haven:'a haven of'},
    capital:'the high seat of',roads:['The Elven Way','A Hidden Path']},
  // the wood elves of the forest kingdoms (D-065): cities in the great trees, the king's halls under a hill, tree-villages,
  // watch-trees and feasting glades, in the Elder Wood, Autumn Woods, Birch Glades, Ancient Giant Wood, Yew Wood and Silverwood.
  // Their ground is left as it lies (raw), save the platforms their layout asks for (pads) and the hill over the halls (mound);
  // the forest's own trees grow on among their works
  wood:{k:'wood',lands:new Set(['elder','autumn','birch','giant','yew','silver']),names:'woodelf',folkNames:'woodelf',kingdom:'The Forest Kingdom of ',ks:9451,fp:'w_',
    site:{city:{M:16,spread:48,wall:1,raw:1},fort:{M:14,spread:30,wall:1,raw:1},village:{M:12,spread:36,raw:1},outpost:{M:8,spread:48,raw:1},farm:{M:10,spread:16,raw:1}},
    R:{city:46,cap:56,cmax:64,small:34,fort:24,village:26,hamlet:18,outpost:8,farm:16},w:{spread:0.1,prom:0.2,pmax:10},
    label:{fort:'The Halls of %',outpost:'% Watch-tree',farm:'% Glade'},kind:{city:'a city in the trees of',fort:'the halls of',village:'a tree-village of',outpost:'a watch-tree of',farm:'a glade of'},
    capital:'the king\'s wood of',roads:['The Lamplit Way','A Woodland Path']},
  // the mountain dwarves (D-066): holds on and in the High Mountains (those the high elves leave) and the Glacier Fields. Their
  // ground is cut into terraces like the elves' (terr), and under it they delve: a city's halls, forges, cistern and mines go
  // down into the mountain behind its great gate, cut into a massif raised at its back (the layout's mass, elfGround)
  dwarf:{k:'dwarf',lands:new Set(['glacier','pine']),share:{mtn:[0.5,1]},names:'dwarf',folkNames:'dwarf',kingdom:'The Mountain Kingdom of ',ks:9461,fp:'d_',
    site:{city:{M:24,spread:72,wall:1,terr:4},fort:{M:14,spread:56,wall:1,terr:4},village:{M:14,spread:56,terr:3},outpost:{M:10,spread:64,wall:1,terr:3},farm:{M:12,spread:56,terr:3}},
    R:{city:50,cap:58,cmax:64,small:34,fort:26,village:30,hamlet:24,outpost:9,farm:16},w:{spread:0.08,prom:0.4,pmax:24},
    label:{fort:'% Bastion',outpost:'% Lookout',farm:'% Mine'},kind:{city:'a mountain hold of',fort:'a bastion of',village:'a mining town of',outpost:'a lookout of',farm:'a mine of'},
    capital:'the high hold of',roads:['The Stone Road','A Miners\' Track']}};
const REALM_LANDS=new Set(Object.values(REALM_CULTS).flatMap(C=>[...C.lands,...Object.keys(C.share||{})]));
function* planProvince(root,key){
  const L=LANDS[cellLand(root)],cells=[root],seen=new Set([key]),r=rngAt(root.i,9405,root.j);
  for(let q=0;q<cells.length&&cells.length<24;q++){const c=cells[q];for(const [a,b] of LN8){const n=landSite(c.i+a,c.j+b),nk=landKey(n.i,n.j);if(seen.has(nk))continue;seen.add(nk);
    if(cellLand(n)===L.i){const s=stretchCell(n);if(s.i===root.i&&s.j===root.j)cells.push(n);}}}
  const ck=new Set(cells.map(c=>landKey(c.i,c.j)));let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9,cx=0,cz=0;
  for(const c of cells){x0=Math.min(x0,c.x);x1=Math.max(x1,c.x);z0=Math.min(z0,c.z);z1=Math.max(z1,c.z);cx+=c.x/cells.length;cz+=c.z/cells.length;}
  const S=REALM_SG,gx0=Math.floor((x0-LS*0.7)/S),gz0=Math.floor((z0-LS*0.7)/S),nx=Math.ceil((x1+LS*0.7)/S)-gx0+1,nz=Math.ceil((z1+LS*0.7)/S)-gz0+1;
  const N=nx*nz,gh=new Float32Array(N),ok=new Uint8Array(N); // ok: 0 outside the province, 1 inside but not to build on, 2 good ground
  for(let b=0;b<nz;b++){yield;for(let a=0;a<nx;a++){const X=(gx0+a)*S,Z=(gz0+b)*S,k=a+b*nx;landsAt(X,Z,TRL);if(TRL.land!==L.i||!ck.has(TRL.lcell))continue; // only the province's own ground is read
    const o=realmRaw(X,Z);gh[k]=o.h;
    const lk=lakeAt(X,Z);if(lk&&Math.hypot(X-lk.cx,Z-lk.cz)<lk.R+12)continue; // no lake under a site or its margin
    ok[k]=o.river||o.bank||o.wet||o.h<o.sl+3||o.b===0||o.b===1||o.rvBot<999||o.bs<WB_END+40||wasteGateNear(X,Z,40)?1:2;}}
  // how far each sample lies from the province's edge (in samples), for castles near the border
  const bd=new Int16Array(N).fill(999),qq=[];for(let k=0;k<N;k++)if(!ok[k]){bd[k]=0;qq.push(k);}
  for(let h=0;h<qq.length;h++){const k=qq[h],a=k%nx,b=(k/nx)|0;for(const [da,db] of [[1,0],[-1,0],[0,1],[0,-1]]){const A=a+da,B=b+db;if(A<0||B<0||A>=nx||B>=nz)continue;const n=A+B*nx;if(bd[n]>bd[k]+1){bd[n]=bd[k]+1;qq.push(n);}}}
  const C=realmHeld(root),SK=C.site,P={key:key,root:root,L:L,cells:cells,cx:cx,cz:cz,cult:C,kingdom:kingdomOf(root,C),sites:[],roads:[],name:''};
  P.capital=P.kingdom.cap===root.i+','+root.j;P.name=stretchName(key);
  // fit a site of kind k (radius R) at sample (a,b): every sample under it good ground, little height spread; its level (the
  // median), how far it stands above the land around it, how far it is from the province's edge
  const fit=(a,b,K,R)=>{const M=K.M,rr=R+M,e=Math.ceil(rr/S);let lo=1e9,hi=-1e9;const core=[];
    if(a-e<0||b-e<0||a+e>=nx||b+e>=nz)return null;
    for(let db=-e;db<=e;db++)for(let da=-e;da<=e;da++){const d=K.sq?Math.max(Math.abs(da),Math.abs(db))*S:Math.hypot(da,db)*S;if(d>rr)continue;const k=a+da+(b+db)*nx;
      if(!ok[k]||(d<=R+S&&ok[k]!==2))return null;if(ok[k]!==2)continue; // the core on good ground; the margin may hold a river, never a lake
      const h=gh[k];if(h<lo)lo=h;if(h>hi)hi=h;if(d<=R)core.push(h);}
    if(hi-lo>K.spread)return null;core.sort((p,q)=>p-q);const T=Math.round(core[core.length>>1]);
    let ring=0,n=0;const e2=Math.ceil((rr+40)/S);for(let k=0;k<16;k++){const A=Math.round(a+Math.cos(k/16*6.283)*e2),B=Math.round(b+Math.sin(k/16*6.283)*e2);if(A<0||B<0||A>=nx||B>=nz||!ok[A+B*nx])continue;ring+=gh[A+B*nx];n++;}
    return {T:T,spread:hi-lo,prom:n?T-ring/n:0,bd:bd[a+b*nx]*S};};
  const far=(X,Z,m)=>P.sites.every(s=>Math.hypot(s.X-X,s.Z-Z)>=m+(s.R||0));
  function* best(K,R,score,need){let top=null;for(let b=0;b<nz;b++){yield;for(let a=0;a<nx;a++){if(ok[a+b*nx]!==2)continue;const X=(gx0+a)*S,Z=(gz0+b)*S;if(need&&!need(X,Z,a,b))continue;
      const f=fit(a,b,K,R);if(!f)continue;const sc=score(f,X,Z)+hsh(X,9407,Z)*0.5;if(!top||sc>top.sc)top={X:X,Z:Z,f:f,sc:sc};}}return top;}
  // a site's core, on a grid of four: no river, bank or wet ground (a narrow river can slip between the samples)
  function* clean(X,Z,K,R){const rr=R+4;for(let dz=-rr;dz<=rr;dz+=4){yield;for(let dx=-rr;dx<=rr;dx+=4){if((K.sq?Math.max(Math.abs(dx),Math.abs(dz)):Math.hypot(dx,dz))>rr)continue;
    const o=realmRaw(X+dx,Z+dz);if(o.river||o.bank||o.wet||o.h<o.sl+3||o.rvBot<999)return false;}}return true;}
  function* pick(K,R,score,need){for(let k=0;k<6;k++){const t=yield* best(K,R,score,need);if(!t)return null;if(yield* clean(t.X,t.Z,K,R))return t;ok[Math.round((t.X/S)-gx0)+Math.round((t.Z/S)-gz0)*nx]=1;}return null;}
  const inLake=(x,z)=>{const lk=lakeAt(x,z);return !!lk&&Math.hypot(x-lk.cx,z-lk.cz)<lk.R+6;};
  function* havenPick(){let top=null;const R=Z_.haven;
    for(let b=2;b<nz-2;b+=2){yield;for(let a=2;a<nx-2;a+=2){const k=a+b*nx;if(ok[k]!==2)continue;if(gh[k]>SEA+24)continue;const X=(gx0+a)*S,Z=(gz0+b)*S;if(!far(X,Z,R+70))continue;
      for(let d=0;d<4;d++){const [dx,dz]=DIRS[d];if(ok[a+dx+(b+dz)*nx]===2||ok[a-dx+(b-dz)*nx]!==2||ok[a-2*dx+(b-2*dz)*nx]!==2)continue;
        let wat=0;for(const [k2,sd] of [[14,0],[26,0],[40,0],[30,-16],[30,16]]){const x=X+dx*k2-dz*sd,z=Z+dz*k2+dx*sd,o=realmRaw(x,z);if(o.h<o.sl-2&&!o.river&&o.rvBot===999&&!inLake(x,z))wat++;}
        if(wat<3)continue;const sc=wat-Math.abs(gh[k]-SEA-8)/6-Math.hypot(X-cx,Z-cz)/400+hsh(X,9467,Z)*0.5;
        if(!top||sc>top.sc)top={X:X,Z:Z,d:(d+2)%4,sc:sc,f:{T:Math.round(gh[k])}};}}}
    return top;}
  const add=(k,R,t)=>{const K=SK[k],s={k:k,X:t.X,Z:t.Z,R:R,M:K.M,T:t.f.T,sq:!!K.sq,wall:!!(K.sq||K.wall),terr:K.terr||0,raw:K.raw||0,prov:P,id:C.k[0]+k[0]+t.X+','+t.Z,seed:hsh(t.X,9409,t.Z)};P.sites.push(s);return s;};
  // the city (the riders' hill town): in the middle of the province's good ground, raised if the land allows (the riders want a
  // hill under their hall); the capital the largest
  const n=cells.length,Z_=C.R,Rc=Math.min(Z_.cmax,(P.capital?Z_.cap:Z_.city)+Math.min(3,n-1)*5);
  for(const R of [Rc,Rc-8,Rc-16,Z_.small,Z_.small-4]){const t=yield* pick(SK.city,R,(f,X,Z)=>-f.spread*C.w.spread-Math.hypot(X-cx,Z-cz)/50+Math.max(-4,Math.min(C.w.pmax,f.prom))*C.w.prom);if(t){const s=add('city',R,t);s.tiers=P.capital?3:2;break;}}
  const city=P.sites[0]&&P.sites[0].k==='city'?P.sites[0]:null;
  // a castle (the riders' hold) on the high ground near the border, well away from the city
  if(n>=2||hsh(root.i,9411,root.j)<0.5){const t=yield* pick(SK.fort,Z_.fort,(f)=>Math.min(14,f.prom)*0.7-f.spread*0.4-Math.abs(f.bd-90)/40,(X,Z)=>far(X,Z,city?190:60));if(t)add('fort',Z_.fort,t);}
  // a haven (D-088): where the province meets the sea, on its own good ground (two samples deep behind it) with open water before
  // it, from 14 blocks out; the sea at its back (+u), its gate toward the land; low over the water, well away from the city
  if(C.haven){const t=yield* havenPick();if(t){const s=add('haven',Z_.haven,t);s.dir=t.d;}}
  // villages, spread out
  const nv=Math.max(2,Math.min(8,Math.round(n*1.1+1)));for(let k=0;k<nv;k++){const t=yield* pick(SK.village,Z_.village,(f)=>-f.spread+hsh(k,9413,root.i)*2,(X,Z)=>far(X,Z,120));if(!t)break;add('village',Z_.village,t);}
  // where the ground is too rough for a village, a hamlet
  if(!P.sites.some(s=>s.k==='village'||s.k==='city'))for(let k=0;k<2;k++){const t=yield* pick(SK.village,Z_.hamlet,(f)=>-f.spread,(X,Z)=>far(X,Z,90));if(!t)break;add('village',Z_.hamlet,t);}
  // watchtowers (the riders' beacons) on the heights, mostly toward the edges
  const no=Math.max(1,Math.min(6,n));for(let k=0;k<no;k++){const t=yield* pick(SK.outpost,Z_.outpost,(f)=>Math.min(20,f.prom)-f.spread*0.2-f.bd/200,(X,Z)=>far(X,Z,110));if(!t)break;add('outpost',Z_.outpost,t);}
  // farmsteads (the riders' horse farms), near the villages and the city
  const nf=Math.max(2,Math.min(14,n*2));for(let k=0;k<nf;k++){const t=yield* pick(SK.farm,Z_.farm,(f)=>-f.spread*0.5+hsh(k,9415,root.j),(X,Z)=>far(X,Z,60)&&P.sites.some(s=>(s.k==='village'||s.k==='city')&&Math.hypot(s.X-X,s.Z-Z)<s.R+170));if(!t)break;add('farm',Z_.farm,t);}
  // a terraced or raw site's ground, every eight blocks over its core and margin (elfRaw reads it between the samples)
  for(const s of P.sites)if(s.terr||s.raw){const E=s.R+s.M+8,n=Math.ceil(2*E/8)+1,a=new Float32Array(n*n);
    for(let b=0;b<n;b++){yield;for(let q=0;q<n;q++)a[q+b*n]=realmRaw(Math.round(s.X-E+q*8),Math.round(s.Z-E+b*8)).h;}s.hg={a:a,n:n,E:E};}
  // names (in the people's styles, no two alike in a province), the way each site faces (toward its road), the roads
  const used=new Set();for(const s of P.sites){const rs=rngAt(Math.round(s.X),9417,Math.round(s.Z));let w='';
    for(let k=0;k<12&&(!w||used.has(w));k++)w=nameWord(s.k==='village'||s.k==='farm'?C.folkNames:C.names,rs);used.add(w);
    s.name=(C.label[s.k]||'%').replace('%',w);}
  realmRoads(P,city);
  return P;
}
// ---- Roads: from the city gate out to every village and the castle; from the castle (or the city) to each watchtower; from
// the nearest village (or the city) to each farmstead. The king's roads (to the castle and the watchtowers) are paved, the rest
// are lanes. A site faces the way its first road leaves it; a city's gate is on that side.
const DIRS=[[0,-1],[1,0],[0,1],[-1,0]]; // north, east, south, west
const dirTo=(s,X,Z)=>{const dx=X-s.X,dz=Z-s.Z;return Math.abs(dx)>Math.abs(dz)?(dx>0?1:3):(dz>0?2:0);};
function realmRoads(P,city){
  const S=P.sites,link=(a,b)=>{if(a.dir===undefined)a.dir=dirTo(a,b.X,b.Z);if(b.dir===undefined)b.dir=dirTo(b,a.X,a.Z);
    const pa=sitePort(a),pb=sitePort(b),pts=[pa];
    // leave a walled site straight out of its gate; round a city's flank toward a place behind it, never through it
    if(a.wall){const d=DIRS[a.dir],q=[pa[0]+d[0]*14,pa[1]+d[1]*14];pts.push(q);
      if(a.k==='city'&&(b.X-a.X)*d[0]+(b.Z-a.Z)*d[1]<0){const sx=-d[1],sz=d[0],side=(b.X-a.X)*sx+(b.Z-a.Z)*sz>=0?1:-1,e=a.R+a.M+8;
        pts.push([a.X+d[0]*e+sx*side*e,a.Z+d[1]*e+sz*side*e]);pts.push([a.X+sx*side*e,a.Z+sz*side*e]);}}
    if(b.wall){const d=DIRS[b.dir];pts.push([pb[0]+d[0]*14,pb[1]+d[1]*14]);}
    pts.push(pb);
    for(let k=0;k+1<pts.length;k++)P.roads.push({a:pts[k],b:pts[k+1],w:K==='high'?2:1,k:K,P:P,seed:hsh(Math.round(pts[k][0]),9419,Math.round(pts[k][1]))});};
  let K='high';
  const villages=S.filter(s=>s.k==='village'),fort=S.find(s=>s.k==='fort'),outs=S.filter(s=>s.k==='outpost'),farms=S.filter(s=>s.k==='farm');
  const nearest=(s,list)=>{let b=null,bd=1e9;for(const t of list){if(t===s)continue;const d=Math.hypot(t.X-s.X,t.Z-s.Z);if(d<bd){bd=d;b=t;}}return b;};
  if(city&&fort){K='high';link(city,fort);}
  if(city)for(const v of villages){K='lane';link(city,v);}
  else for(let k=1;k<villages.length;k++){K='lane';link(villages[k-1],villages[k]);}
  for(const o of outs){const h=nearest(o,[fort,city].filter(Boolean))||nearest(o,villages);if(h){K=h===city||h===fort?'high':'lane';link(h,o);}}
  for(const f of farms){const h=nearest(f,[...villages,city].filter(Boolean));if(h){K='lane';link(h,f);}}
  for(const hv of S.filter(s=>s.k==='haven')){const h=city||nearest(hv,villages);if(h){K='high';link(h,hv);}} // the elves' haven (D-088)
  for(const s of S)if(s.dir===undefined)s.dir=(hsh(s.X,9421,s.Z)*4)|0;
  // a road starts and ends at its site's door, never inside it: cut each end back to the edge of the core
  for(const rd of P.roads){let x0=1e9,z0=1e9,x1=-1e9,z1=-1e9;for(const p of [rd.a,rd.b]){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);z0=Math.min(z0,p[1]);z1=Math.max(z1,p[1]);}
    rd.box=[x0-30,z0-30,x1+30,z1+30];rd.len=Math.hypot(rd.b[0]-rd.a[0],rd.b[1]-rd.a[1]);}
}
// where a road meets a site: just outside the gate of a walled one (city, castle, watchtower), the edge of an open one
function sitePort(s){const d=DIRS[s.dir===undefined?0:s.dir],off=s.wall?s.R+3:s.R-4;return [s.X+d[0]*off,s.Z+d[1]*off];}
// ---- Queries
// The stretches whose provinces a tile of 64 blocks may meet (those of the cells two around it)
function realmRoots(tx,tz){const ci=Math.floor((tx*64+32)/LS),cj=Math.floor((tz*64+32)/LS),out=[],seen=new Set();
  for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const s=stretchCell(landSite(ci+a,cj+b)),k=landKey(s.i,s.j);if(!seen.has(k)){seen.add(k);out.push(s);}}return out;}
// Streaming (a step of its own, before a chunk's columns): a province is planned a slice at a time (planProvince yields after
// every row it reads or searches), REALM_STEP_MS to a call, so a realm coming into reach is spread over frames, never one long
// one; the plan is the same however it is sliced. True once every province the chunk's tile meets is planned
function realmPrep(X,Z){const tx=X>>6,tz=Z>>6;if(realmTC.has(tx*65536+tz))return true;
  for(const s of realmRoots(tx,tz)){const key=landKey(s.i,s.j);if(provC.has(key)||!realmHeld(s))continue;
    let g=provJ.get(key);if(!g){if(provJ.size>6)provJ.clear();g=planProvince(stretchCell(landSite(s.i,s.j)),key);provJ.set(key,g);}
    const t0=performance.now();let r;while(!(r=g.next()).done)if(performance.now()-t0>REALM_STEP_MS)return false;
    provJ.delete(key);if(provC.size>3000)provC.clear();provC.set(key,r.value);return false;}
  return true;}
// the sites and roads that may reach a tile of 64 blocks (the provinces of the cells two around it)
function realmTile(X,Z){
  const tx=X>>6,tz=Z>>6,tk=tx*65536+tz;let T=realmTC.get(tk);if(T)return T;if(realmTC.size>20000)realmTC.clear();
  T={sites:[],roads:[]};
  for(const s of realmRoots(tx,tz)){const P=provinceOf(s.i,s.j);if(!P)continue;
    for(const st of P.sites){const e=st.R+st.M+24;if(st.X+e>=tx*64&&st.X-e<tx*64+64&&st.Z+e>=tz*64&&st.Z-e<tz*64+64)T.sites.push(st);}
    for(const rd of P.roads){const b2=rd.box;if(b2[2]>=tx*64&&b2[0]<tx*64+64&&b2[3]>=tz*64&&b2[1]<tz*64+64)T.roads.push(rd);}}
  realmTC.set(tk,T);return T;
}
// how far (X,Z) lies from a site's middle: square for walled sites, round (with a wandering edge) for open ones
const siteDist=(s,X,Z)=>s.sq?Math.max(Math.abs(X-s.X),Math.abs(Z-s.Z)):s.wall?Math.hypot(X-s.X,Z-s.Z):Math.hypot(X-s.X,Z-s.Z)+fbm2(X/14,Z/14,1,9423.1)*3;
// the site whose core (grown by m) holds (X,Z), or null
function realmSiteAt(X,Z,m){if(realmSkip)return null;for(const s of realmTile(X,Z).sites)if(siteDist(s,X,Z)<=s.R+(m||0))return s;return null;}
// The road at (X,Z): the nearest road whose band holds the column (its middle wanders a little, less near its ends), as
// {rd, off (across, from its middle), t (along, 0 to 1)}, or null
function realmRoadAt(X,Z,m){if(realmSkip)return null;
  for(const rd of realmTile(X,Z).roads){const dx=rd.b[0]-rd.a[0],dz=rd.b[1]-rd.a[1],L=rd.len||1,ux=dx/L,uz=dz/L,px=X-rd.a[0],pz=Z-rd.a[1],along=px*ux+pz*uz;
    if(along<-2||along>L+2)continue;const t=Math.max(0,Math.min(1,along/L)),wob=fbm2(along/90+rd.seed*50,rd.seed*70,2,9425.3)*Math.min(L*0.12,18)*Math.sin(Math.PI*t),off=-px*uz+pz*ux-wob;
    if(Math.abs(off)<=rd.w+0.5+(m||0))return {rd:rd,off:off,t:t,along:along};}
  return null;}
// Is a surface column taken by the realm (a site's core or margin, or a road)? Trees, boulders, ruins and the like keep off
// (tree: a tree asks; in the wood elves' sites the forest grows on, off their works: woodBusy)
function realmNear(X,Z,m,tree){if(realmSkip)return null;for(const s of realmTile(X,Z).sites)if(siteDist(s,X,Z)<=s.R+(s.k==='village'||s.k==='farm'||(s.k==='city'&&s.prov.cult.k==='horse')?s.M+30:s.M*0.6)+(m||0)){if(tree&&s.raw&&!woodBusy(s,X,Z,m||0))continue;return s;}return realmRoadAt(X,Z,m);}
// ---- The ground: each site's core levelled to its height (a city's to its tiers), easing back to the land over its margin.
// Sets o.town (0 or 1) and o.tsite.
function realmGround(X,Z,o,h){
  o.town=0;o.tsite=null;if(realmSkip)return h;
  for(const s of realmTile(X,Z).sites){const d=siteDist(s,X,Z);if(d>=s.R+s.M)continue;const w=(o.river||o.bank)&&d>s.R?0:sstep(s.R+s.M,s.R,d),tg=s.terr?elfGround(s,X,Z):s.raw?woodGround(s,X,Z,h):s.k==='city'?cityGround(s,X,Z):s.T;if(!w)continue;
    h=h+(tg-h)*w;o.town=1;o.tsite=s;}
  return h;
}
// ---- A city's tiers (D-060): rings round the citadel, which stands toward the back of the city (away from the gate); each
// ring five blocks above the one outside it, held by a retaining wall. The capital has three, other cities two.
// The riders' hill town (D-061) is round: its tiers are circles about its hall, which stands a little toward the back, four
// blocks a step.
function cityFrame(s){if(s.cf)return s.cf;const d=DIRS[s.dir],R=s.R,f={fx:-d[0],fz:-d[1],sx:-d[1],sz:d[0]};
  if(s.prov.cult.k==='horse')Object.assign(f,{cu:Math.round(R*0.25),r1:s.tiers>=3?Math.round(R*0.62):Math.round(R*0.44),r2:s.tiers>=3?Math.round(R*0.32):-1,step:4,round:1});
  else Object.assign(f,{cu:Math.round(R*0.5),r1:s.tiers>=3?Math.round(R*0.66):Math.round(R*0.36),r2:s.tiers>=3?Math.round(R*0.34):-1,step:5});return s.cf=f;}
// local (u, v) of a column: u from the city's middle toward the back (the gate is at u = -R), v across
const cityUV=(s,X,Z)=>{const f=cityFrame(s),dx=X-s.X,dz=Z-s.Z;return [dx*f.fx+dz*f.fz,dx*f.sx+dz*f.sz];};
function cityTier(s,u,v){const f=cityFrame(s),d=f.round?Math.hypot(u-f.cu,v):Math.max(Math.abs(u-f.cu),Math.abs(v));return f.r2>=0&&d<=f.r2?2:d<=f.r1?1:0;}
function cityGround(s,X,Z){const [u,v]=cityUV(s,X,Z),f=cityFrame(s);if((f.round?Math.hypot(u,v):Math.max(Math.abs(u),Math.abs(v)))>s.R)return s.T;return s.T+cityTier(s,u,v)*f.step;}
// ---- The wood elves' ground (D-065): as it lies, save a platform of the layout (pads, level) and the hill raised over the king's
// halls (L.mound: a dome about (cu, cv) cut off at u = face; within gw of the middle a sheer face for the gate, beyond it the
// hill's sides slope up from the forecourt), so a layout reads no colInfo
function woodGround(s,X,Z,h){const [u,v]=siteUV(s,X,Z),L=siteLayout(s);for(const p of L.pads)if(u>=p.u0&&u<=p.u1&&v>=p.v0&&v<=p.v1)return p.y;
  const m=L.mound;if(m&&u>=m.face){const d=Math.hypot(u-m.cu,v-m.cv)/m.R;if(d<1){let k=m.H*Math.pow(1-d*d,0.7);if(Math.abs(v)>m.gw)k=Math.min(k,(u-m.face)*2.2+(Math.abs(v)-m.gw)*0.6);return Math.max(h,s.T+Math.round(k));}}return h;}
// is (X,Z) on or by (m) a work of a wood elves' site that wants the forest clear (a part flagged clear)?
// is (X,Z) on one of a wood site's paths (no plants grow on them)?
function woodPath(s,X,Z){const L=siteLayout(s);if(!L.paths)return false;const [u,v]=siteUV(s,X,Z);for(const q of L.paths){const ux=q[2]-q[0],vx=q[3]-q[1],l=Math.hypot(ux,vx)||1,t=Math.max(0,Math.min(l,((u-q[0])*ux+(v-q[1])*vx)/l));if(Math.hypot(u-q[0]-ux*t/l,v-q[1]-vx*t/l)<=q[4]+1)return true;}return false;}
function woodBusy(s,X,Z,m){const [u,v]=siteUV(s,X,Z),L=siteLayout(s);for(const p of L.parts)if(p.clear&&u>=p.bu0-m&&u<=p.bu1+m&&v>=p.bv0-m&&v<=p.bv1+m)return true;return !!(L.busy&&L.busy(u,v,m));}
// ---- The elves' terraces (D-062): the raw ground under a terraced site, read between its samples, cut into steps of s.terr
// about the site's level, so the terraces follow the lie of the land; a building's platform (its layout's pads, each a box in the
// site's frame grown by one) holds its own level
function elfRaw(s,X,Z){const g=s.hg,n=g.n,fx=(X-s.X+g.E)/8,fz=(Z-s.Z+g.E)/8,ix=Math.max(0,Math.min(n-2,Math.floor(fx))),iz=Math.max(0,Math.min(n-2,Math.floor(fz))),tx=Math.max(0,Math.min(1,fx-ix)),tz=Math.max(0,Math.min(1,fz-iz)),a=g.a;
  return (a[ix+iz*n]*(1-tx)+a[ix+1+iz*n]*tx)*(1-tz)+(a[ix+(iz+1)*n]*(1-tx)+a[ix+1+(iz+1)*n]*tx)*tz;}
const elfTerrace=(s,X,Z)=>s.T+Math.round((elfRaw(s,X,Z)-s.T)/s.terr)*s.terr;
function elfPad(s,u,v){for(const p of siteLayout(s).pads)if(u>=p.u0-1&&u<=p.u1+1&&v>=p.v0-1&&v<=p.v1+1)return p;return null;}
function elfGround(s,X,Z){const [u,v]=siteUV(s,X,Z),p=elfPad(s,u,v);if(p)return p.y;
  if(s.k==='haven'){const L=siteLayout(s);if(u>L.qL&&Math.abs(v)<=L.hw+2)return Math.min(Math.round(elfRaw(s,X,Z)),SEA-5);} // a haven's harbour, dredged (D-088)
  const t=elfTerrace(s,X,Z),M=siteLayout(s).mass;return M?Math.max(t,massifAt(M,u,v)):t;}
// The massif at the back of a dwarves' hold (D-066): rock raised to M.y + M.H over a box (u from its face M.f to M.b, |v| up to
// M.w), its face sheer, falling away over M.m to its sides and back in ridges, its top broken; -1 elsewhere
function massifAt(M,u,v){if(u<M.f)return -1;const du=Math.max(0,u-M.b),dv=Math.max(0,Math.abs(v)-M.w),d=Math.hypot(du,dv)/M.m;if(d>=1)return -1;
  const k=Math.pow(1-d,1.4)*(1-0.25*Math.abs(Math.sin(u*0.21+v*0.13))*d);return M.y+Math.round(M.H*k+(u>M.f+3?hsh(u>>2,9463,v>>2)*3*d:0));}
// ---- Names: the readout's line for a site, and the realm a column lies in
function realmPlace(X,Z){const s=realmSiteAt(X,Z,4),C=s&&s.prov.cult;return s?{s:s,name:s.name,line:(s.k==='city'&&s.prov.capital?C.capital:C.kind[s.k])+' '+s.prov.kingdom.name.replace(/^The /,'the ')}:null;}
// a road's name: the people's high road or its lanes
const realmRoadName=rd=>rd.P.cult.roads[rd.k==='high'?0:1];
function realmOfColumn(X,Z){const o=landsAt(X,Z,{}),i=Math.floor(o.lcell/65536)-32768,j=o.lcell%65536-32768,P=provinceOf(i,j);return P&&P.L.i===o.land?P:null;}
