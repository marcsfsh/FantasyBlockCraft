// ---- The realms of men (D-060): the first of the living kingdoms, high men of a southern realm in white stone and black
// livery. Each stretch of the gentle old lands (Green Hills, Overgrown Farmland, Wild Orchards, Flower Meadows and Old
// Terraces) is held by a kingdom one time in two, and a held stretch is a province: a walled city (in tiers, its citadel at
// the top; the kingdom's capital in three tiers), a castle near its border, villages, farmsteads with their fields, watchtowers
// with beacons on the heights, and roads between them. Plans are pure functions of the seed and the land layout, read from the
// ground before any realm levels it (realmRaw, never cached); colInfoBase then levels the ground under every site (realmGround).
// Kingdoms gather the held stretches of a square of 8 x 8 land cells (some 2500 blocks) under one name; the oldest stretch among
// them holds the capital.
const REALM_LANDS=new Set(['green','farm','orchard','flower','terrace']),REALM_SG=16,provC=new Map(),provJ=new Map(),REALM_STEP_MS=6,realmTC=new Map(),TRP={},TRL={};let realmSkip=false;
// the ground before any realm levels it, and never cached (so the plans cannot depend on themselves)
function realmRaw(X,Z){const was=realmSkip;realmSkip=true;try{return colInfoBase(X,Z,TRP);}finally{realmSkip=was;}}
const realmHeld=c=>REALM_LANDS.has(LANDS[cellLand(c)].k)&&hsh(c.i,9401,c.j)<0.5; // c: the stretch's first cell
function kingdomOf(c){const ki=Math.floor(c.i/8),kj=Math.floor(c.j/8);let best=null;
  for(let a=0;a<8;a++)for(let b=0;b<8;b++){const s=stretchCell(landSite(ki*8+a,kj*8+b));if(realmHeld(s)&&(!best||s.pr>best.pr))best=s;}
  return {key:ki+','+kj,name:'The Kingdom of '+nameWord('realm',rngAt(ki,9403,kj)),cap:best?best.i+','+best.j:''};}
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
    ok[k]=o.river||o.bank||o.wet||o.h<o.sl+3||o.b===0||o.b===1||o.rvBot<999||o.bs<WB_END+40?1:2;}}
  // how far each sample lies from the province's edge (in samples), for castles near the border
  const bd=new Int16Array(N).fill(999),qq=[];for(let k=0;k<N;k++)if(!ok[k]){bd[k]=0;qq.push(k);}
  for(let h=0;h<qq.length;h++){const k=qq[h],a=k%nx,b=(k/nx)|0;for(const [da,db] of [[1,0],[-1,0],[0,1],[0,-1]]){const A=a+da,B=b+db;if(A<0||B<0||A>=nx||B>=nz)continue;const n=A+B*nx;if(bd[n]>bd[k]+1){bd[n]=bd[k]+1;qq.push(n);}}}
  const P={key:key,root:root,L:L,cells:cells,cx:cx,cz:cz,kingdom:kingdomOf(root),sites:[],roads:[],name:''};
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
  const add=(k,R,t)=>{const K=SITE_K[k],s={k:k,X:t.X,Z:t.Z,R:R,M:K.M,T:t.f.T,sq:!!K.sq,prov:P,id:k[0]+t.X+','+t.Z,seed:hsh(t.X,9409,t.Z)};P.sites.push(s);return s;};
  // the city: in the middle of the province's good ground, gently raised if the land allows; the capital the largest
  const n=cells.length,Rc=Math.min(64,(P.capital?50:40)+Math.min(3,n-1)*5);
  for(const R of [Rc,Rc-8,Rc-16,34,30]){const t=yield* pick(SITE_K.city,R,(f,X,Z)=>-f.spread*0.6-Math.hypot(X-cx,Z-cz)/50+Math.max(-4,Math.min(12,f.prom))*0.35);if(t){const s=add('city',R,t);s.tiers=P.capital?3:2;break;}}
  const city=P.sites[0]&&P.sites[0].k==='city'?P.sites[0]:null;
  // a castle on the high ground near the border, well away from the city
  if(n>=2||hsh(root.i,9411,root.j)<0.5){const t=yield* pick(SITE_K.fort,22,(f)=>Math.min(14,f.prom)*0.7-f.spread*0.4-Math.abs(f.bd-90)/40,(X,Z)=>far(X,Z,city?190:60));if(t)add('fort',22,t);}
  // villages, spread out
  const nv=Math.max(2,Math.min(8,Math.round(n*1.1+1)));for(let k=0;k<nv;k++){const t=yield* pick(SITE_K.village,26,(f)=>-f.spread+hsh(k,9413,root.i)*2,(X,Z)=>far(X,Z,120));if(!t)break;add('village',26,t);}
  // where the ground is too rough for a village, a hamlet
  if(!P.sites.some(s=>s.k==='village'||s.k==='city'))for(let k=0;k<2;k++){const t=yield* pick(SITE_K.village,18,(f)=>-f.spread,(X,Z)=>far(X,Z,90));if(!t)break;add('village',18,t);}
  // watchtowers on the heights, mostly toward the edges
  const no=Math.max(1,Math.min(6,n));for(let k=0;k<no;k++){const t=yield* pick(SITE_K.outpost,8,(f)=>Math.min(20,f.prom)-f.spread*0.2-f.bd/200,(X,Z)=>far(X,Z,110));if(!t)break;add('outpost',8,t);}
  // farmsteads, near the villages and the city
  const nf=Math.max(2,Math.min(14,n*2));for(let k=0;k<nf;k++){const t=yield* pick(SITE_K.farm,12,(f)=>-f.spread*0.5+hsh(k,9415,root.j),(X,Z)=>far(X,Z,60)&&P.sites.some(s=>(s.k==='village'||s.k==='city')&&Math.hypot(s.X-X,s.Z-Z)<s.R+170));if(!t)break;add('farm',12,t);}
  // names, the way each site faces (toward its road), the roads
  const used=new Set();for(const s of P.sites){const rs=rngAt(Math.round(s.X),9417,Math.round(s.Z));let w='';
    for(let k=0;k<12&&(!w||used.has(w));k++)w=nameWord(s.k==='village'||s.k==='farm'?'human':'realm',rs);used.add(w); // no two alike in a province
    s.name=s.k==='city'?w:s.k==='fort'?'Castle '+w:s.k==='outpost'?w+' Watch':s.k==='village'?w:w+' Farm';}
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
    if(a.sq){const d=DIRS[a.dir],q=[pa[0]+d[0]*14,pa[1]+d[1]*14];pts.push(q);
      if(a.k==='city'&&(b.X-a.X)*d[0]+(b.Z-a.Z)*d[1]<0){const sx=-d[1],sz=d[0],side=(b.X-a.X)*sx+(b.Z-a.Z)*sz>=0?1:-1,e=a.R+a.M+8;
        pts.push([a.X+d[0]*e+sx*side*e,a.Z+d[1]*e+sz*side*e]);pts.push([a.X+sx*side*e,a.Z+sz*side*e]);}}
    if(b.sq){const d=DIRS[b.dir];pts.push([pb[0]+d[0]*14,pb[1]+d[1]*14]);}
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
  for(const s of S)if(s.dir===undefined)s.dir=(hsh(s.X,9421,s.Z)*4)|0;
  // a road starts and ends at its site's door, never inside it: cut each end back to the edge of the core
  for(const rd of P.roads){let x0=1e9,z0=1e9,x1=-1e9,z1=-1e9;for(const p of [rd.a,rd.b]){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);z0=Math.min(z0,p[1]);z1=Math.max(z1,p[1]);}
    rd.box=[x0-30,z0-30,x1+30,z1+30];rd.len=Math.hypot(rd.b[0]-rd.a[0],rd.b[1]-rd.a[1]);}
}
// where a road meets a site: just outside the gate of a walled one (city, castle, watchtower), the edge of an open one
function sitePort(s){const d=DIRS[s.dir===undefined?0:s.dir],off=s.sq?s.R+3:s.R-4;return [s.X+d[0]*off,s.Z+d[1]*off];}
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
const siteDist=(s,X,Z)=>s.sq?Math.max(Math.abs(X-s.X),Math.abs(Z-s.Z)):Math.hypot(X-s.X,Z-s.Z)+fbm2(X/14,Z/14,1,9423.1)*3;
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
function realmNear(X,Z,m){if(realmSkip)return null;for(const s of realmTile(X,Z).sites)if(siteDist(s,X,Z)<=s.R+(s.k==='village'||s.k==='farm'?s.M+30:s.M*0.6)+(m||0))return s;return realmRoadAt(X,Z,m);}
// ---- The ground: each site's core levelled to its height (a city's to its tiers), easing back to the land over its margin.
// Sets o.town (0 or 1) and o.tsite.
function realmGround(X,Z,o,h){
  o.town=0;o.tsite=null;if(realmSkip)return h;
  for(const s of realmTile(X,Z).sites){const d=siteDist(s,X,Z);if(d>=s.R+s.M)continue;const w=(o.river||o.bank)&&d>s.R?0:sstep(s.R+s.M,s.R,d),tg=s.k==='city'?cityGround(s,X,Z):s.T;if(!w)continue;
    h=h+(tg-h)*w;o.town=1;o.tsite=s;}
  return h;
}
// ---- A city's tiers (D-060): rings round the citadel, which stands toward the back of the city (away from the gate); each
// ring five blocks above the one outside it, held by a retaining wall. The capital has three, other cities two.
function cityFrame(s){if(s.cf)return s.cf;const d=DIRS[s.dir],R=s.R,cu=Math.round(R*0.5),f={fx:-d[0],fz:-d[1],sx:-d[1],sz:d[0],cu:cu,
  r1:s.tiers>=3?Math.round(R*0.66):Math.round(R*0.36),r2:s.tiers>=3?Math.round(R*0.34):-1,step:5};return s.cf=f;}
// local (u, v) of a column: u from the city's middle toward the back (the gate is at u = -R), v across
const cityUV=(s,X,Z)=>{const f=cityFrame(s),dx=X-s.X,dz=Z-s.Z;return [dx*f.fx+dz*f.fz,dx*f.sx+dz*f.sz];};
function cityTier(s,u,v){const f=cityFrame(s),d=Math.max(Math.abs(u-f.cu),Math.abs(v));return f.r2>=0&&d<=f.r2?2:d<=f.r1?1:0;}
function cityGround(s,X,Z){const [u,v]=cityUV(s,X,Z);if(Math.max(Math.abs(u),Math.abs(v))>s.R)return s.T;return s.T+cityTier(s,u,v)*cityFrame(s).step;}
// ---- Names: the readout's line for a site, and the realm a column lies in
const REALM_KIND={city:'a city of',fort:'a castle of',village:'a village of',outpost:'a watchtower of',farm:'a farmstead of'};
function realmPlace(X,Z){const s=realmSiteAt(X,Z,4);return s?{s:s,name:s.name,line:(s.k==='city'&&s.prov.capital?'the royal city of':REALM_KIND[s.k])+' '+s.prov.kingdom.name.replace(/^The /,'the ')}:null;}
function realmOfColumn(X,Z){const o=landsAt(X,Z,{}),i=Math.floor(o.lcell/65536)-32768,j=o.lcell%65536-32768,P=provinceOf(i,j);return P&&P.L.i===o.land?P:null;}
