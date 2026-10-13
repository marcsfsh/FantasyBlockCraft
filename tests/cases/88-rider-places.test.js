// The riders' places enlarged (D-090): the high seat, the riders' tapestries and the feasting boards in every golden hall, and
// the court's places in it; the race course by the hill towns, the king's road to it, its track, rails, pennons, chalk line and
// stand; the mounds of the kings by each king's seat, the founder's mound with its passage and chamber; bee skeps by the
// steadings and horse farms; horse stones on the riders' roads; the ruins of the forefathers across the open lands outside the
// realms (white horses, stone rings, stone ships, burned halls, picture stones), each with its hoard chest and name, and the
// cairns of fallen riders within the riders' provinces.
setMode('creative');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const count=(X,Z,R,ids,y0,y1)=>{const n={};for(const id of ids)n[id]=0;for(let dx=-R;dx<=R;dx++)for(let dz=-R;dz<=R;dz++){const x=X-OX+dx,z=Z-OZ+dz;if(x<0||z<0||x>=W||z>=D)continue;for(let y=y0||SEA-12;y<(y1||SEA+120);y++){const id=world[I(x,y,z)];if(n[id]!==undefined)n[id]++;}}return n;};
const seen=new Set(),S={city:[],course:[],barrows:[],village:[],farm:[]};
for(let i=-30;i<30;i++)for(let j=-30;j<30;j++){const c=stretchCell(landSite(i,j)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const C=realmHeld(c);if(!C||C.k!=='horse')continue;
  for(const s of provinceOf(c.i,c.j).sites)if(S[s.k])S[s.k].push(s);}
// ---- the golden hall: the high seat, the tapestries of the riders, the feasting boards; the court's places
{const caps=S.city.filter(c=>c.prov.capital),cap=caps.sort((a,b)=>b.R-a.R)[0],L=siteLayout(cap);
  info('hill towns',S.city.length,'king\'s seats',caps.length,'; halls with their court\'s places',S.city.filter(c=>{const L=siteLayout(c);return L.hall&&['seat','hdoor','hcourt','scop'].every(k=>L.spots.some(p=>p.kind===k));}).length);
  assert(S.city.every(c=>{const L=siteLayout(c);return L.hall&&['seat','hdoor','hcourt','scop','leech'].every(k=>L.spots.some(p=>p.kind===k))||!L.parts.some(p=>p.k==='ghall');}),'every golden hall has its high seat, doorwardens, court and lay-singer, and a horse-healer by the stables');
  gen(cap.X,cap.Z);const n=count(cap.X,cap.Z,cap.R,[HSEAT,FEASTBOARD,HTAP,SHIELDS,HEARTH]);info(cap.name,': high seat',n[HSEAT],'feasting boards',n[FEASTBOARD],'tapestries of the riders',n[HTAP],'shields',n[SHIELDS]);
  assert(n[HSEAT]>=3&&n[FEASTBOARD]>=12&&n[HTAP]>=12,'the golden hall holds the high seat, the feasting boards and the riders\' tapestries');}
// ---- the race course
{const s=S.course[0],L=siteLayout(s);info('race courses',S.course.length,'by',S.city.length,'hill towns; ',s.name);
  assert(S.course.length>=S.city.length*0.5&&s.prov.roads.some(r=>r.k==='high'&&[r.a,r.b].some(p=>Math.hypot(p[0]-sitePort(s)[0],p[1]-sitePort(s)[1])<2))&&L.track,'the hill towns have their race courses, the riders\' road to them');
  gen(s.X,s.Z);const n=count(s.X,s.Z,s.R,[PENNON,FENCE,CHALK,GTHATCH,HORNS,PATH],s.T-2,s.T+12);info('the course: pennons',n[PENNON],'rails',n[FENCE],'the chalk line',n[CHALK],'the stand\'s thatch',n[GTHATCH],'posts\' horse heads',n[HORNS],'track',n[PATH]);
  assert(n[PENNON]>=12&&n[FENCE]>=150&&n[CHALK]>=5&&n[GTHATCH]>=30&&n[HORNS]>=2&&n[PATH]>=250,'the course: a track round the oval between rails, pennons, the chalk line between carved posts, the stand');}
// ---- the mounds of the kings
{const s=S.barrows[0];info('mounds of the kings',S.barrows.length,'by',S.city.filter(c=>c.prov.capital).length,'king\'s seats; ',s.name);assert(S.barrows.length>=4,'the king\'s seats have the mounds of their kings');
  gen(s.X,s.Z);const n=count(s.X,s.Z,s.R,[HSTONE,BARROWBLOOM,STANDSTONE,HSHIELD,BRAZIER,DIRT],s.T-2,s.T+12);info('the mounds: horse stones',n[HSTONE],'barrowbloom',n[BARROWBLOOM],'standing stones',n[STANDSTONE],'the founder\'s shield',n[HSHIELD],'lamp',n[BRAZIER],'earth',n[DIRT]);
  assert(n[HSTONE]>=8&&n[BARROWBLOOM]>=100&&n[STANDSTONE]>=30&&n[HSHIELD]>=1&&n[BRAZIER]>=1&&n[DIRT]>=1500,'mounds along the way of the kings with their horse stones and barrowbloom, the founder\'s with its passage and chamber');
  const F=siteLayout(s).founder,[X,Z]=siteXZ(s,F.u,F.v).map(Math.round);let air=0;for(let y=F.y;y<F.y+3;y++)if(!SOLID[get(X-OX,y,Z-OZ)]||get(X-OX,y,Z-OZ)===STANDSTONE)air++;assert(air>=2,'the founder\'s chamber is open within his mound');}
// ---- bee skeps
{const v=S.village.find(q=>q.R>=24),f=S.farm[0];gen(v.X,v.Z);const a=count(v.X,v.Z,v.R+6,[SKEP])[SKEP];gen(f.X,f.Z);const b=count(f.X,f.Z,f.R,[SKEP])[SKEP];info('skeps by',v.name,a,'; at',f.name,b);
  assert(a===3&&b===2,'bee skeps by the steadings and the horse farms');}
// ---- horse stones on the riders' roads
{const rd=S.city[0].prov.roads.find(r=>r.k==='high'&&r.len>100);const [X,Z]=[Math.round((rd.a[0]+rd.b[0])/2),Math.round((rd.a[1]+rd.b[1])/2)];gen(X,Z);const n=count(X,Z,90,[HSTONE]);info('horse stones about a riders\' road',n[HSTONE]);
  assert(n[HSTONE]>=1,'horse stones stand beside the riders\' roads');}
// ---- the ruins of the forefathers and the riders' cairns
{const R=[],C=[],kinds={};for(let i=-90;i<90;i++)for(let j=-90;j<90;j++){const o=fathersAt(i,j);if(!o)continue;if(o.kind==='cairn')C.push(o);else{R.push(o);kinds[o.kind]=(kinds[o.kind]||0)+1;}}
  info('ruins of the forefathers',R.length,JSON.stringify(kinds),'e.g.',R.slice(0,4).map(o=>o.name).join(', '),'; riders\' cairns',C.length);
  assert(R.length>=12&&Object.keys(kinds).length>=4&&R.every(o=>!isBlockedName(o.name.replace(/^The [^ ]+( [^ ]+)? of /,''))),'the ruins of the forefathers lie across the open lands, of several kinds, named');
  assert(R.every(o=>!realmOfColumn(o.X,o.Z)&&!realmNear(o.X,o.Z,8)&&!elderNear(o.X,o.Z,8)&&!oldNear(o.X,o.Z,8)),'they keep off the living realms, the elder elves\' ruins and the old kingdom\'s');
  assert(C.length>=4&&C.every(o=>{const P=realmOfColumn(o.X,o.Z);return P&&P.cult.k==='horse'&&!realmNear(o.X,o.Z,4);}),'the cairns of fallen riders lie in the riders\' provinces, off their places');
  const done=new Set();for(const o of R){if(done.has(o.kind)||done.size>=4)continue;done.add(o.kind);gen(o.X,o.Z);const n=count(o.X,o.Z,o.R+3,[CHALK,STANDSTONE,PICSTONE,CHARWOOD,FSTONE,FCHEST],o.g-6,o.g+30);
    info(o.name,':',JSON.stringify(n),'; its name here',surfaceName(o.X,o.g+1,o.Z));
    const own={horse:n[CHALK]>=300,ring:n[STANDSTONE]>=20,ship:n[STANDSTONE]>=30&&n[PICSTONE]>=2,hall:n[CHARWOOD]>=12&&n[FSTONE]>=40,stones:n[PICSTONE]>=8}[o.kind];
    assert(own&&n[FCHEST]===1&&surfaceName(o.X,o.g+1,o.Z)===o.name,'a ruin of the forefathers ('+o.kind+') stands with its hoard chest, and has its name');}
  const c=C[0];gen(c.X,c.Z);const n=count(c.X,c.Z,4,[FSTONE,HSHIELD,STAKES,BARROWBLOOM],c.g-2,c.g+6);info('a rider\'s cairn:',JSON.stringify(n));assert(n[FSTONE]>=6&&n[HSHIELD]===1&&n[STAKES]===1,'a rider\'s cairn: a heap of fieldstones, a spear in it, a shield hung on it');}
