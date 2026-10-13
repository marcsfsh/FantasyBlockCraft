// The elven lands enlarged (D-088): the ruins of the elder elves across the mountains and old woods (a fallen tower, a broken
// colonnade, a moonwell shrine, a theatre, a fallen king, a lone arch), each weathered, with elven plants, an elder chest and a
// name of the elder tongue, clear of every other place; starbloom, silverfern and dawnlily in the elves' gardens and lands;
// moonwells (water over moonstone under a starglass lamp) in their cities, refuges and havens; leaf-stones beside the elven
// ways; and in the wood elves' cities a market glade, a pen for their steeds, a moonwell and lamps hung over the lamplit way.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const B=(X,Y,Z)=>get(X-OX,Y,Z-OZ);
// ---- the ruins: how many and of what kinds, their names
const all=[],K={};for(let i=-60;i<60;i++)for(let j=-60;j<60;j++){const s=elderAt(i,j);if(s){all.push(s);K[s.kind]=(K[s.kind]||0)+1;}}
info('ruins of the elder elves in 120 x 120 chunks:',all.length,JSON.stringify(K));
assert(all.length>=30&&Object.keys(K).length>=5,'the ruins of the elder elves are scattered across the mountains and old woods, of many kinds');
assert(all.every(s=>!isBlockedName(s.name.replace(/^The [A-Za-z ]+ of /,''))&&/^The /.test(s.name)),'each has a name of the elder tongue');
assert(all.every(s=>!realmNear(s.X,s.Z,s.R)&&!smallNear(s.X,s.Z,s.R)),'none stands in a living realm or on another place');
// ---- one of each kind, as built: weathered elvenstone, an elder chest, its plants, its name where it stands
const T={};for(const k of Object.keys(K)){const s=all.find(q=>q.kind===k);gen(s.X,s.Z);
  let ev=0,old=0,chest=0,pl=0,lamp=0;for(let dx=-16;dx<=16;dx++)for(let dz=-16;dz<=16;dz++)for(let y=s.g-8;y<=s.g+18;y++){const id=B(s.X+dx,y,s.Z+dz);
    if(id>=EVSTONE&&id<=EVMOSAIC)ev++;if(id===EVOLD)old++;if(id===ECHEST)chest++;if(id===STARBLOOM||id===SILVFERN||id===DAWNLILY)pl++;if(id===STARLAMP||id===MOONSTONE)lamp++;}
  const nm=surfaceName(s.X,s.g+1,s.Z);T[k]={ev:ev,old:old,chest:chest,pl:pl,lamp:lamp,nm:nm===s.name};
  info(s.name,'('+k+') at',s.X,s.Z,': elvenstone',ev,'; weathered',old,'; elder chests',chest,'; elven plants',pl,'; moonstone and starglass',lamp,'; named where it stands',nm===s.name);
  assert(ev>=40&&old>=3&&chest===1&&nm===s.name,'the '+k+' is built of elvenstone, weathered, with its elder chest, under its name');
  if(k==='shrine'){let wet=0,ms=0;for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){const [x,z]=[s.X+dx,s.Z+dz];for(let y=s.g-3;y<=s.g+2;y++){if(B(x,y,z)===WATER){wet++;if(B(x,y-1,z)===MOONSTONE)ms++;}}}
    info('  its moonwell: water',wet,'; over moonstone',ms);assert(wet>=20&&ms>=8,'the shrine holds a moonwell over moonstone');}}
assert(Object.values(T).some(t=>t.pl>0),'elven plants grow in the ruins');
// what an elder chest holds
{const s=all[0];const L=lootOf(ECHEST,s.X,s.g,s.Z);info('an elder chest holds',L.map(([id,n])=>n+' '+nameOf(id)).join(', '));assert(L.length>=4,'an elder chest holds relics of the elder days');}
// ---- the elves' places: moonwells, plants, leaf-stones; the wood elves' market, pen and moonwell
const seen=new Set();let elfS=null,woodS=null,road=null;
for(let i=-25;i<25;i++)for(let j=-25;j<25;j++){const c=stretchCell(landSite(i,j)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const C=realmHeld(c);if(!C||(C.k!=='elf'&&C.k!=='wood'))continue;const P=provinceOf(c.i,c.j);
  if(C.k==='elf'&&!elfS)elfS=P.sites.find(s=>s.k==='village'&&siteLayout(s).parts.some(p=>p.k==='epool'&&p.moon));
  if(C.k==='wood'&&!woodS)woodS=P.sites.find(s=>s.k==='city'&&siteLayout(s).parts.some(p=>p.k==='wmarket')&&siteLayout(s).parts.some(p=>p.k==='wpen'));
  if(C.k==='elf'&&!road)road=P.roads.find(r=>r.k==='high'&&r.len>200);}
{const s=elfS,p=siteLayout(s).parts.find(p=>p.k==='epool'&&p.moon),[X,Z]=siteXZ(s,p.cu,p.cv);gen(X,Z);let wet=0,ms=0,sl=0,fl=0;
  for(let dx=-4;dx<=4;dx++)for(let dz=-4;dz<=4;dz++)for(let y=p.y-3;y<=p.y+4;y++){const id=B(X+dx,y,Z+dz);if(id===WATER){wet++;if(B(X+dx,y-1,Z+dz)===MOONSTONE)ms++;}if(id===STARLAMP)sl++;}
  for(let dx=-40;dx<=40;dx++)for(let dz=-40;dz<=40;dz++){const g=ground[X+dx-OX+W*(Z+dz-OZ)],id=B(X+dx,g+1,Z+dz);if(id===STARBLOOM||id===SILVFERN||id===DAWNLILY)fl++;}
  info('the moonwell of',s.name,': water',wet,'; over moonstone',ms,'; starglass lamps',sl,'; elven plants about the refuge',fl,'; starbloom shines',LUM[STARBLOOM]);
  assert(wet>=8&&ms>=4&&sl>=1,'a refuge of the elves has its moonwell: water over moonstone under a starglass lamp');assert(fl>=3&&LUM[STARBLOOM]>0,'elven plants grow on the refuge\'s lawns, the starbloom shining');}
{let col=null;const roads=[];seen.clear();for(let i=-25;i<25;i++)for(let j=-25;j<25;j++){const c=stretchCell(landSite(i,j)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const C=realmHeld(c);if(C&&C.k==='elf')roads.push(...provinceOf(c.i,c.j).roads.filter(r=>r.k==='high'));}
  const T2={};for(const rd of roads){if(col)break;const ux=(rd.b[0]-rd.a[0])/rd.len,uz=(rd.b[1]-rd.a[1])/rd.len;for(let along=66;along<rd.len&&!col;along+=144)for(let e=0;e<12&&!col;e++)for(let dx=-22;dx<=22&&!col;dx++)for(let dz=-22;dz<=22&&!col;dz++){
    const X=Math.round(rd.a[0]+ux*(along+e))+dx,Z=Math.round(rd.a[1]+uz*(along+e))+dz,rr=realmRoadAt(X,Z,1);if(!rr||rr.rd!==rd)continue;const ao=Math.abs(rr.off);
    if(ao>rd.w+0.5&&ao<=rd.w+1.5&&rr.off<0&&Math.floor(rr.along)%144===72&&!realmSiteAt(X,Z,0)&&!wasteGateNear(X,Z,0)){colInfo(X,Z,T2);if(!(T2.wet||T2.river||T2.lake||T2.b===0||T2.h<T2.sl+1))col=[X,Z];}}}
  const [X,Z]=col;gen(X,Z);const g=ground[X-OX+W*(Z-OZ)],ids=[B(X,g,Z),B(X,g+1,Z),B(X,g+2,Z),B(X,g+3,Z)];
  info('a leaf-stone beside the elven way at',X,Z,':',ids.map(i=>BL[i].n).join(', '));assert(ids[1]===LEAFSTONE&&ids[2]===LEAFSTONE&&ids[3]===EVCARVE,'leaf-stones stand beside the elven ways');}
{const s=woodS,L=siteLayout(s),m=L.parts.find(p=>p.k==='wmarket'),n=L.parts.find(p=>p.k==='wpen'),w=L.parts.find(p=>p.k==='wpool');const [X,Z]=siteXZ(s,m.cu,m.cv);gen(X,Z);
  const cnt=(cu,cv,r,ids)=>{const [x0,z0]=siteXZ(s,cu,cv);let c=0;for(let dx=-r;dx<=r;dx++)for(let dz=-r;dz<=r;dz++){const g=ground[Math.round(x0)+dx-OX+W*(Math.round(z0)+dz-OZ)];for(let y=g-3;y<=g+6;y++)if(ids.includes(B(Math.round(x0)+dx,y,Math.round(z0)+dz)))c++;}return c;};
  const th=cnt(m.cu,m.cv,9,[WTHATCH]),ct=cnt(m.cu,m.cv,9,[WPLANK]),rail=cnt(n.cu,n.cv,6,[WRAIL]),moon=w&&w.moon?cnt(w.cu,w.cv,4,[MOONSTONE]):0;
  info('in',s.name,': the market glade\'s thatch',th,'and counters',ct,'; the pen\'s rails',rail,'; the moonwell\'s moonstone',moon,'; spots',L.spots.map(q=>q.kind).filter(k=>['market','stable','heal'].includes(k)).join(','));
  assert(th>=12&&ct>=6&&rail>=12&&moon>=6&&L.spots.some(q=>q.kind==='market')&&L.spots.some(q=>q.kind==='stable'&&q.horses),'a city of the wood elves has its market glade, its steeds\' pen and its moonwell');}
