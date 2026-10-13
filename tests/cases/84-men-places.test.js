// The white realm's places enlarged (D-089): the throne of the realm and the kings in stone in every great hall, the silver tree
// in the royal citadel, houses of healing and inns in the cities, notice boards, signs; the lists by a city, the hallows of the
// kings by a royal city, the ports where a province meets the sea; the village's maypole and churchyard; the milestones of the
// king's roads cut with their letters; the ruins of the old kingdom across the gentle lands.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const B=(X,Y,Z)=>get(X-OX,Y,Z-OZ);
const count=(X,Z,R,ids,y0,y1)=>{const n={};for(const id of ids)n[id]=0;for(let dx=-R;dx<=R;dx++)for(let dz=-R;dz<=R;dz++){const x=X-OX+dx,z=Z-OZ+dz;if(x<0||z<0||x>=W||z>=D)continue;for(let y=y0||SEA-12;y<(y1||SEA+120);y++){const id=world[I(x,y,z)];if(n[id]!==undefined)n[id]++;}}return n;};
const seen=new Set(),cities=[],sites={lists:[],hallows:[],port:[],village:[]};
for(let i=-30;i<30;i++)for(let j=-30;j<30;j++){const c=stretchCell(landSite(i,j)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const C=realmHeld(c);if(!C||C.k!=='white')continue;const P=provinceOf(c.i,c.j);
  for(const s of P.sites){if(s.k==='city')cities.push(s);if(sites[s.k])sites[s.k].push(s);}}
// ---- the cities: the throne in every great hall, inns and houses of healing in most, the silver tree in every royal city
{const L=c=>siteLayout(c),caps=cities.filter(c=>c.prov.capital),inns=cities.filter(c=>L(c).inn).length,heals=cities.filter(c=>L(c).heal).length;
  info('cities',cities.length,': thrones',cities.filter(c=>L(c).parts.some(p=>p.k==='mthrone')).length,'; inns',inns,'; houses of healing',heals,'; royal cities',caps.length,'with the silver tree',caps.filter(c=>L(c).tree).length);
  assert(cities.every(c=>L(c).parts.some(p=>p.k==='mthrone')&&L(c).spots.some(p=>p.kind==='throne'))&&caps.every(c=>L(c).tree)&&inns>=cities.length*0.5&&heals>=cities.length*0.5,'every great hall has its throne, every royal city its silver tree, most cities an inn and a house of healing');
  const cap=caps.sort((a,b)=>b.R-a.R)[0],m=L(cap).parts.find(p=>p.k==='mthrone');gen(cap.X,cap.Z);
  const [TX,TZ]=siteXZ(cap,m.hb-2,0).map(Math.round),[BX,BZ]=siteXZ(cap,m.hb-1,0).map(Math.round);let crowns=0;
  for(let u=m.u0;u<=m.u1;u++)for(const v of [m.hw-1,-(m.hw-1)]){const [X,Z]=siteXZ(cap,u,v).map(Math.round);for(let y=m.y;y<m.y+9;y++)if(B(X,y,Z)===GOLDB)crowns++;}
  info(cap.name,': the throne',BL[B(TX,m.y+2,TZ)].n,'its back',BL[B(BX,m.y+3,BZ)].n,'; the tapestry over it',BL[B(BX,m.y+5,BZ)].n,'; kings in stone along the walls',crowns);
  assert(B(TX,m.y+2,TZ)===RTHRONE&&B(BX,m.y+3,BZ)===RTHRONE&&B(BX,m.y+5,BZ)===RTAP&&crowns>=4,'the throne of the realm stands on its dais under the tapestry, the kings of old in stone along the hall');
  const t=L(cap).tree,n=count(...siteXZ(cap,t[0],t[1]).map(Math.round),5,[SILVBARK,SILVLEAF],t[2],t[2]+16);info('the silver tree: bark',n[SILVBARK],'leaves',n[SILVLEAF]);assert(n[SILVBARK]>=8&&n[SILVLEAF]>=40,'the silver tree stands in the citadel\'s court');
  const sq=count(cap.X,cap.Z,cap.R,[NOTICE,INNSIGN,HEARTSEASE,WOOLW,HEARTH]);info('in the city: notice board',sq[NOTICE],'; inn sign',sq[INNSIGN],'; heartsease',sq[HEARTSEASE],'; a hearth',sq[HEARTH]);
  assert(sq[NOTICE]>=2&&sq[INNSIGN]>=1&&sq[HEARTSEASE]>=2,'a notice board in the square, the inn under its sign, heartsease in the house of healing');}
// ---- the lists
{const s=sites.lists[0],L=siteLayout(s);info('lists',sites.lists.length,'by',cities.length,'cities; ',s.name);assert(sites.lists.length>=cities.length*0.4&&s.prov.roads.some(r=>r.k==='high'&&[r.a,r.b].some(p=>Math.hypot(p[0]-sitePort(s)[0],p[1]-sitePort(s)[1])<2)),'cities have their lists by them, the king\'s road to them');
  gen(s.X,s.Z);const n=count(s.X,s.Z,s.R,[TILTRAIL,RTHRONE,FENCE,PAVCLOTH,WOOLR,WOOLB,PLANKS],s.T-2,s.T+16);info('the lists: tilt',n[TILTRAIL],'royal box throne',n[RTHRONE],'fence',n[FENCE],'stands of planks',n[PLANKS]);
  assert(n[TILTRAIL]>=30&&n[RTHRONE]===1&&n[FENCE]>=100&&n[PLANKS]>=300,'the lists: the tilt down a fenced field, stands either side, the royal box');}
// ---- the hallows
{const s=sites.hallows[0];info('hallows',sites.hallows.length,'by',cities.filter(c=>c.prov.capital).length,'royal cities; ',s.name);assert(sites.hallows.length>=4,'the royal cities have the hallows of their kings');
  gen(s.X,s.Z);const n=count(s.X,s.Z,s.R,[EFFIGY,LECTERN,HEADSTONE,STGLASS,YEWL],s.T-2,s.T+20);info('the hallows: effigies',n[EFFIGY],'lectern',n[LECTERN],'headstones',n[HEADSTONE],'stained glass',n[STGLASS]);
  assert(n[EFFIGY]>=14&&n[LECTERN]===1&&n[HEADSTONE]>=30&&n[STGLASS]>=12,'tombs along the silent street with their effigies, the kings lying in their house with the chronicle\'s lectern, graves in rows');}
// ---- the ports
{const P=sites.port;info('ports',P.length,':',P.map(s=>s.name+' ('+siteLayout(s).ships.length+' ships)').join(', '));assert(P.length>=3&&P.every(s=>!isBlockedName(s.name.replace(/^Port /,''))),'where the realm meets the sea it has ports, named');
  const s=P.find(q=>siteLayout(q).ships.length>=2)||P[0],L=siteLayout(s);gen(...siteXZ(s,L.qL,0).map(Math.round));const [lx,lz]=siteXZ(s,L.light[0],L.light[1]).map(Math.round);
  let fire=0;for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)for(let y=SEA;y<SEA+40;y++)if(B(lx+dx,y,lz+dz)===BRAZIER)fire++;
  const n=count(...siteXZ(s,L.qL+10,0).map(Math.round),s.R,[TARHULL,RSAIL,ROPE],SEA-4,SEA+24);info(s.name,': tarred planks',n[TARHULL],'sails',n[RSAIL],'cranes\' ropes',n[ROPE],'; the lighthouse\'s fire',fire);
  assert(n[TARHULL]>=150&&n[RSAIL]>=40&&n[ROPE]>=4&&fire>=1,'ships of the realm at the piers under the sail of the realm, cranes on the quay, the lighthouse\'s beacon');}
// ---- a village: the maypole, the notice board, the inn's sign, the churchyard
{const s=sites.village.find(v=>v.R>=24);gen(s.X,s.Z);const n=count(s.X,s.Z,s.R+16,[MAYPOLE,NOTICE,INNSIGN,SMITHSIGN,HEADSTONE],s.T-8,s.T+20);
  info(s.name,': maypole',n[MAYPOLE],'notice board',n[NOTICE],'inn sign',n[INNSIGN],'smith\'s sign',n[SMITHSIGN],'headstones',n[HEADSTONE]);
  assert(n[MAYPOLE]===8&&n[NOTICE]===2&&n[INNSIGN]===1&&n[SMITHSIGN]===1&&n[HEADSTONE]>=4,'a village has its maypole and notice board on the green, the inn\'s and smith\'s signs, a churchyard');}
// ---- milestones on the king's roads
{const rd=cities[0].prov.roads.find(r=>r.k==='high'&&r.len>100);const t=36/rd.len,[X,Z]=[Math.round(rd.a[0]+(rd.b[0]-rd.a[0])*0.5),Math.round(rd.a[1]+(rd.b[1]-rd.a[1])*0.5)];gen(X,Z);
  const n=count(X,Z,90,[MILESTONE]);info('milestones about a king\'s road',n[MILESTONE]);assert(n[MILESTONE]>=1,'the milestones of the king\'s roads are cut with their letters');}
// ---- the ruins of the old kingdom
{const R=[],kinds={};for(let i=-90;i<90;i++)for(let j=-90;j<90;j++){const o=oldAt(i,j);if(o){R.push(o);kinds[o.kind]=(kinds[o.kind]||0)+1;}}
  info('ruins of the old kingdom',R.length,JSON.stringify(kinds),'e.g.',R.slice(0,4).map(o=>o.name).join(', '));
  assert(R.length>=12&&Object.keys(kinds).length>=4&&R.every(o=>!isBlockedName(o.name.replace(/^The [^ ]+( [^ ]+)? of (King )?/,''))),'the ruins of the old kingdom lie across the gentle lands, of several kinds, named');
  assert(R.every(o=>!realmNear(o.X,o.Z,8)&&!elderNear(o.X,o.Z,8)),'they keep off the living realms and the ruins of the elder elves');
  const done=new Set();for(const o of R){if(done.has(o.kind)||done.size>=3)continue;done.add(o.kind);gen(o.X,o.Z);const n=count(o.X,o.Z,o.R+3,[OLDSTONE,OLDCHEST,WATER],o.g-6,o.g+40);
    info(o.name,': weathered stone',n[OLDSTONE],'chest',n[OLDCHEST],'water',n[WATER],'; its name here',surfaceName(o.X,o.g+1,o.Z));
    assert(n[OLDSTONE]>=60&&n[OLDCHEST]===1&&surfaceName(o.X,o.g+1,o.Z)===o.name,'a ruin of the old kingdom stands in weathered stone with a chest of the old kings, and has its name');}}
