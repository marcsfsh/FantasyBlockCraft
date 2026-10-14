// The life of the dwarves (D-091): the delving contest (three miners, the horn, ninety seconds, the player's ore counted, won);
// the Kindling in the great hall (the hall full, the horn brought round, kept and fed); a caravan on the Stone Road (ponies laden,
// the caravan master and two axeguards); the shift horns at dawn and dusk; the engine drill at a bastion; the deep watch's
// challenge; the baths' hot water; ravens on the towers; rams in the pens and wild rams on the heights; a prospector at a worked
// claim by day; ram-riders on the Stone Road; the passing horn; the map's signs.
setMode('survival');settings.time='cycle';playing=true;dead=false;hp=20;
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const TO=[];toast=m=>{if(m)TO.push(m);};let shown=null;showText=(t,x)=>{shown=[t,x];};let tones=0;const tone0=tone;tone=(...a)=>{tones++;};
const at=(s,u,v)=>siteXZ(s,u,v).map(Math.round);
const toPL=(X,Z,y)=>{PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=y!==undefined?y:ground[X-OX+W*(Z-OZ)]+1;};
const clear=()=>{for(const f of [...foes])removeFoe(f);foeSpots.clear();for(const a of [...animals])removeAnimal(a);};
DW.r=40;DW.sw=0;DW.kin='';DW.q=null;DW.cw=0;DW.ki=-1;DW.bath=-1;for(let i=0;i<inv.length;i++)inv[i]=null;
const seen=new Set(),S={city:[],village:[],fort:[]};
for(let i=-30;i<30;i++)for(let j=-30;j<30;j++){const c=stretchCell(landSite(i,j)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const C=realmHeld(c);if(!C||C.k!=='dwarf')continue;
  for(const s of provinceOf(c.i,c.j).sites)if(S[s.k])S[s.k].push(s);}
const city=S.city.filter(c=>c.prov.capital)[0]||S.city[0];
// ---- the delving contest
{const s=S.village.find(v=>siteLayout(v).spots.some(p=>p.kind==='mine')),L=siteLayout(s),m=L.spots.find(p=>p.kind==='mine');gen(s.X,s.Z);toPL(...at(s,m.u,m.v));clear();tod=0.45;DELVE=null;delveDone.clear();
  const D0=delveStart(s);info('the delving contest at',s.name,':',D0.K.map(k=>k.nm).join(', '));assert(D0.K.length===3&&D0.K.every(k=>!isBlockedName(k.nm)),'three miners at the headframe');
  const f=addFoe('dminer',PL.x+1,PL.y,PL.z,{site:s,prov:s.prov.key,st:'idle',t:9});const r=dwarfContestAsk(f);info(r);assert(DELVE.pl===1,'the player joins the contest');
  for(let i=0;i<21;i++)delveTick();assert(DELVE.ph==='run','the horn, and they go down');const [ox,oz]=at(s,0,0),y=s.T-12;
  for(let i=0;i<20;i++)delveMined(i%5?IRON:GEMORE,ox-OX,y,oz-OZ);delveMined(IRON,ox-OX,s.T+20,oz-OZ);info('your tally',DELVE.me,'; the miners',DELVE.K.map(k=>k.n).join(','));assert(DELVE.me===24,'every ore and gem broken in the mines counts (a gem twice), and nothing above them');
  TO.length=0;for(let i=0;i<91&&DELVE;i++)delveTick();info(TO.join(' | '),'; contests won',DW.cw,'; the golden pick',countOf(477));assert(!DELVE&&DW.cw===1&&countOf(477)===1,'the most ore wins the contest, and the golden pick');clear();}
// ---- the Kindling
{const q=dwarfGreatOf(city);const [X,Z]=at(city,(q.u0+q.u1)>>1,0);gen(X,Z);toPL(X,Z,q.y0);clear();tod=0.8;while(dayN%4!==3)dayN++;KINDLE=null;kindleDone.clear();TO.length=0;kindleTick();
  info('the Kindling at',city.name,': in the hall',KINDLE&&KINDLE.G.length);assert(KINDLE&&KINDLE.G.length>=10&&KINDLE.bearer,'the hold gathers in the great hall for the Kindling');
  const b=KINDLE.bearer;PL.x=b.x+1;PL.z=b.z;const f0=(food=4);for(let i=0;i<21;i++)kindleTick();info(TO.slice(0,3).join(' | '),'; food',f0,'->',food);assert(KINDLE.horn&&DW.ki===dayN&&food>f0,'the horn is brought round, and whoever keeps the Kindling is fed and the better thought of');
  tod=0.5;kindleTick();assert(!KINDLE,'the Kindling ends with the night');clear();}
// ---- a caravan on the Stone Road
{const rd=city.prov.roads.find(r=>r.k==='high'&&r.len>120);const [X,Z]=[Math.round((rd.a[0]+rd.b[0])/2),Math.round((rd.a[1]+rd.b[1])/2)];gen(X,Z);toPL(X,Z);clear();tod=0.5;CARAVAN=null;caravanT=0;TO.length=0;caravanTick();
  info(TO[0],'; folk',CARAVAN&&CARAVAN.G.map(f=>f.kind).join(','),'; ponies',CARAVAN&&CARAVAN.A.length);assert(CARAVAN&&CARAVAN.G[0].kind==='dmerch'&&CARAVAN.G.filter(f=>f.kind==='daxe').length===2&&CARAVAN.A.length>=2,'a caravan comes along the Stone Road: the master, two axeguards and laden ponies');
  caravanEnd();clear();}
// ---- the shift horns; the engine drill; the deep watch
{gen(city.X,city.Z);toPL(city.X,city.Z);tod=0.26;shiftDay=-1;TO.length=0;dwarfShift();tod=0.74;shiftDusk=-1;dwarfShift();info(TO.join(' | '));assert(TO.some(m=>/miners go down/.test(m))&&TO.some(m=>/come up/.test(m)),'the shift horn at dawn and at dusk');
  const b=S.fort.find(f=>siteLayout(f).trebs);gen(b.X,b.Z);toPL(b.X,b.Z);tod=0.5;engineDone.clear();ENG=null;TO.length=0;engineTick();for(let i=0;i<80&&ENG;i++)engineFrame(0.05);info(TO[0]);assert(TO.some(m=>/Loose/.test(m))&&!ENG,'the engineers drill the trebuchet at the range');
  const L=siteLayout(city);gen(city.X,city.Z);toPL(...at(city,L.lv2.b0+4,8),L.lv2.y);deepDone.clear();TO.length=0;DW.r=0;deepWatch();DW.r=40;info(TO[0]);assert(TO.some(m=>/Who walks in the deep/.test(m)),'a deepwarden challenges whoever comes down to the deep');}
// ---- the baths
{const B=siteLayout(city).bath,[X,Z]=at(city,(B.u0+B.u1)>>1,(B.v0+B.v1)>>1);gen(X,Z);toPL(X,Z,B.y);hp=12;bathT=0;TO.length=0;const r0=DW.r;bathTick(1);
  info('in the baths: water here',get(Math.floor(PL.x),B.y,Math.floor(PL.z))===WATER,'; health 12 ->',hp,';',TO[0]);assert(hp>12&&DW.bath===dayN&&DW.r>r0,'the baths\' hot water heals');}
// ---- ravens, pens, wild rams
{gen(city.X,city.Z);toPL(city.X,city.Z);clear();tod=0.5;RAVENS.clear();PENS.clear();ravenTick();dwarfPens();const rv=animals.filter(a=>a.kind==='raven').length,pr=animals.filter(a=>a.kind==='ram'&&a.pen).length;
  info('ravens on the towers',rv,'; rams in the pens',pr);assert(rv>=1&&pr>=3,'ravens perch on the towers, rams stand in their pens');
  clear();let n=0;for(let k=0;k<20&&!n;k++){wildRamT=0;wildRamTick();n=animals.filter(a=>a.kind==='ram'&&!a.pen&&!a.tame).length;}info('wild rams',n);assert(n>=2,'wild rams on the heights of the dwarves\' lands');clear();}
// ---- a prospector at his claim by day; ram-riders on the Stone Road; the passing horn
{let o=null;for(let r=0;r<=90&&!o;r++)for(let i=-r;i<=r&&!o;i++)for(let j=-r;j<=r;j++){if(Math.max(Math.abs(i),Math.abs(j))!==r)continue;const q=claimsAt(i,j);if(q&&!q.ab){o=q;break;}}
  gen(o.X,o.Z);toPL(o.X,o.Z);clear();tod=0.5;PROSP.clear();prospectorTick();const p=foes.find(f=>f.kind==='dprosp');info('at',o.name,': the prospector',p&&p.nm);assert(p&&p.nm===o.who,'the prospector is at his claim by day, and will trade');clear();PROSP.clear();
  const rd=city.prov.roads.find(r=>r.len>120);const [X,Z]=[Math.round((rd.a[0]+rd.b[0])/2),Math.round((rd.a[1]+rd.b[1])/2)];gen(X,Z);toPL(X,Z);clear();patrolT=0;patrolTick();const R=foes.filter(f=>f.kind==='dramr');info('ram-riders on the road',R.length);
  assert(R.length===2,'ram-riders go by on the Stone Road');const f=addFoe('dminer',PL.x+3,PL.y,PL.z,{site:city,prov:city.prov.key,st:'idle',t:9});dpassT=0;dwarfPassing(f);assert(dpassT>foeClock,'a low horn for one of the dwarves fallen near by');clear();}
// ---- the map's signs
{places.length=0;notePlace(city.name,city.X,city.Z);let o=null;for(let i=-90;i<90&&!o;i++)for(let j=-90;j<90&&!o;j++){const q=claimsAt(i,j);if(q)o=q;}notePlace(o.name,o.X,o.Z);
  info('the map:',places.map(p=>p.n+' ('+p.e+')').join(', '));assert(places[0].e==='d'&&places[1].e==='c','the dwarves\' places and the prospectors\' claims have their signs on the map');}
tone=tone0;setMode('creative');
