// The court and the city of the high elves (D-088): at the back of the high hall the throne on its dais under the banners,
// between starglass lamps, a blue runner to it from the door (the royal throne at the high seat of each elder realm, a lord's
// seat in its other cities); the kings of the elder days in stone along the way before the hall, crowned, with starred staffs;
// a market of stalls under blue and white awnings; a house of healing with its beds; a library of shelves and lecterns; the
// stables with horses in their stalls; and folk at each: the court at the throne, healers, loremasters.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const B=(X,Y,Z)=>get(X-OX,Y,Z-OZ);
const seen=new Set(),cities=[];
for(let i=-25;i<25;i++)for(let j=-25;j<25;j++){const c=stretchCell(landSite(i,j)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const C=realmHeld(c);if(!C||C.k!=='elf')continue;
  for(const s of provinceOf(c.i,c.j).sites)if(s.k==='city')cities.push(s);}
const has=(s,k)=>siteLayout(s).spots.some(q=>q.kind===k);
info('elven cities',cities.length,'; with a market',cities.filter(s=>has(s,'market')).length,', a house of healing',cities.filter(s=>has(s,'heal')).length,', stables',cities.filter(s=>has(s,'stable')).length,', a throne',cities.filter(s=>has(s,'throne')).length,', a lord\'s seat',cities.filter(s=>has(s,'seat')).length);
const hh=cities.filter(s=>siteLayout(s).parts.some(p=>p.k==='ehall'&&p.throne));info('with their high hall',hh.length);
assert(hh.length>=cities.length*0.9&&hh.every(s=>has(s,'throne')===!!s.prov.capital&&has(s,'throne')!==has(s,'seat')),'in every high hall a throne (the king\'s or queen\'s at the high seat, a lord\'s elsewhere)');
assert(cities.filter(s=>has(s,'market')).length>=cities.length*0.8&&cities.filter(s=>has(s,'heal')).length>=cities.length*0.8&&cities.filter(s=>has(s,'stable')).length>=cities.length*0.7,'nearly every elven city has its market, its house of healing and its stables');
const s=cities.find(q=>q.prov.capital&&['market','heal','library','stable'].every(k=>has(q,k))),L=siteLayout(s),at=(u,v)=>siteXZ(s,u,v).map(Math.round),sp=k=>L.spots.find(q=>q.kind===k);
const H=L.parts.find(p=>p.k==='ehall'&&p.throne),[HX,HZ]=at((H.u0+H.u1)>>1,0);gen(HX,HZ);
const box=(p,ids,y0,y1)=>{let n=0;for(let u=p.bu0;u<=p.bu1;u++)for(let v=p.bv0;v<=p.bv1;v++){const [X,Z]=at(u,v);for(let y=y0;y<=y1;y++)if(ids.includes(B(X,y,Z)))n++;}return n;};
// the throne
{const th=box(H,[ETHRONE],H.y,H.y+6),ru=box(H,[WOOLB],H.y,H.y),sl=box(H,[STARLAMP],H.y,H.y+8),bn=box(H,[EVBANNER],H.y,H.y+6);
  info(s.name,'(the high seat of',s.prov.kingdom.name+'): the throne',th,'; the runner',ru,'; starglass by it',sl,'; banners',bn);assert(th===1&&ru>=10&&sl>=2&&bn>=2,'the throne stands on its dais at the back of the high hall, a runner to it, lamps and banners by it');}
// the kings of the elder days
{const st=L.parts.filter(p=>p.k==='estatue'&&p.king);let gold=0,staff=0;for(const p of st){gold+=box(p,[EVGOLD],p.y,p.y+20);staff+=box(p,[STARLAMP],p.y,p.y+20);}
  info('kings in stone before the hall',st.length,'; their crowns\' gold',gold,'; stars on their staffs',staff);assert(st.length>=2&&gold>=st.length*6&&staff===st.length,'the kings of the elder days stand in stone before the high hall, crowned, with starred staffs');}
// the market, the house of healing, the library, the stables
{const m=L.parts.find(p=>p.k==='emarket'),hl=L.parts.find(p=>p.k==='ehall'&&p.heal),lb=L.parts.find(p=>p.k==='ehall'&&p.lib),sb=L.parts.find(p=>p.k==='ehall'&&p.stable);
  for(const p of [m,hl,lb,sb]){const [X,Z]=at((p.u0+p.u1)>>1,(p.v0+p.v1)>>1);if(Math.abs(X-OX-W/2)>W/2-30||Math.abs(Z-OZ-D/2)>D/2-30)gen(X,Z);}
  const aw=box(m,[EAWNING],m.y,m.y+5),ct=box(m,[EVWOOD],m.y,m.y+2),beds=box(hl,[WOOLW],hl.y,hl.y+2),pl=box(hl,[DAWNLILY,STARBLOOM],hl.y,hl.y+3),bk=box(lb,[BOOKS],lb.y,lb.y+4),lc=box(lb,[LECTERN],lb.y,lb.y+2),hay=box(sb,[HAYBALE],sb.y,sb.y+3);
  info('the market\'s awnings',aw,'and counters',ct,'; the house of healing\'s beds',beds,'and planters',pl,'; the library\'s books',bk,'and lecterns',lc,'; the stables\' hay',hay);
  assert(aw>=30&&ct>=8,'the market has its stalls under blue and white awnings');assert(beds>=8&&pl>=2,'the house of healing has its beds');assert(bk>=60&&lc>=2,'the library is lined with books, lecterns between them');assert(hay>=4,'the stables are strawed');}
// folk at the throne, the healers, the loremasters, the horses
{const near=k=>{const p=sp(k),[X,Z]=at(p.u,p.v);if(Math.abs(X-OX-W/2)>W/2-30||Math.abs(Z-OZ-D/2)>D/2-30)gen(X,Z);PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=p.y+1;for(const f of [...foes])removeFoe(f);for(const a of [...animals])removeAnimal(a);foeSpots.clear();foeSpawnTick();
    return foes.filter(f=>!f.dead&&f.spk===s.prov.cult.fp+k);};
  const T=near('throne');info('at the throne:',T.map(f=>FOES[f.kind].n).join(', '));assert(T.length>=2,'the court is at the throne');
  const He=near('heal');info('in the house of healing:',He.map(f=>FOES[f.kind].n).join(', '));assert(He.some(f=>f.kind==='eheal'),'healers keep the house of healing');
  const Lb=near('library');info('in the library:',Lb.map(f=>FOES[f.kind].n).join(', '));assert(Lb.some(f=>f.kind==='elore'),'loremasters keep the library');
  near('stable');const hs=animals.filter(a=>a.pen);info('in the stables:',hs.length,'horses');assert(hs.length>=2,'horses stand in the stables');
  for(const f of [...foes])removeFoe(f);for(const a of [...animals])removeAnimal(a);foeSpots.clear();}
