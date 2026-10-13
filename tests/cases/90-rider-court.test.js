// The court of the riders (D-090): the king or the queen on the high seat of the king's seat (a thane on a lesser one), the
// doorwardens at the hall's doors, the counsellor and the court; an audience and its gift; the oath sworn at the high seat and
// its gifts (the oath-ring, the war-horn, the riders' mail, barding); the thaneship and a steading; the new folk built whole;
// the windsteed, which lets only a sworn rider lay a hand on it, and outruns every other horse.
setMode('survival');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const TO=[];toast=m=>{if(m)TO.push(m);};let shown=null;showText=(t,x)=>{shown=[t,x];};
const at=(s,u,v)=>siteXZ(s,u,v).map(Math.round);
const toPL=(X,Z,y)=>{PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=y!==undefined?y:ground[X-OX+W*(Z-OZ)]+1;};
const clear=()=>{for(const f of [...foes])removeFoe(f);foeSpots.clear();};
RH.r=0;RH.sw=0;RH.th='';RH.g=0;RH.q=null;RH.au={};for(let i=0;i<inv.length;i++)inv[i]=null;
const seen=new Set();let cap=null,town=null;
for(let i=-30;i<30;i++)for(let j=-30;j<30;j++){const c=stretchCell(landSite(i,j)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const C=realmHeld(c);if(!C||C.k!=='horse')continue;const P=provinceOf(c.i,c.j);
  for(const s of P.sites){if(s.k!=='city')continue;if(P.capital&&!cap)cap=s;if(!P.capital&&!town)town=s;}}
const spot=(s,k)=>{const p=siteLayout(s).spots.find(q=>q.kind===k),[X,Z]=at(s,p.u,p.v);return [X,Z,p.y];};
// ---- the high seat, its doorwardens and its court
let ruler=null;
{const [X,Z,y]=spot(cap,'seat');gen(X,Z);toPL(X,Z,y+1);clear();foeSpawnTick();ruler=foes.find(f=>f.kind==='hking'||f.kind==='hqueen');const D=foes.filter(f=>f.kind==='hdoor'),C=foes.filter(f=>f.spk==='h_hcourt');
  info(cap.name,': on the high seat',ruler&&FOES[ruler.kind].n,'; doorwardens',D.length,'; the court',C.map(f=>FOES[f.kind].n).join(', '));
  assert(ruler&&ruler.kind===riderSeatLead(cap)&&D.length>=3&&C.length>=3&&C.some(f=>f.kind==='hcouns'),'the king or the queen on the high seat, doorwardens at the doors and about the seat, the counsellor and the court');
  const [X2,Z2,y2]=spot(town,'seat');gen(X2,Z2);toPL(X2,Z2,y2+1);clear();foeSpawnTick();const th=foes.find(f=>f.spk==='h_seat'&&f.kind==='hthane');info(town.name,': on its high seat',th&&FOES[th.kind].n);
  assert(!!th,'a thane holds the high seat of a lesser hill town');}
// ---- an audience
{const [X,Z,y]=spot(cap,'seat');gen(X,Z);toPL(X,Z,y+1);clear();foeSpawnTick();ruler=foes.find(f=>f.kind==='hking'||f.kind==='hqueen');
  const r0=riderAudience(ruler);RH.r=12;const r1=riderAudience(ruler),c1=countOf(446),r2=riderAudience(ruler),c2=countOf(446);info('a stranger:',r0);info('a guest:',r1,'; and again: mead',c1,'->',c2);
  assert(/stranger/i.test(r0)&&/gift/i.test(r1)&&c1>=2&&c2===c1,'the high seat grants an audience, and a gift once for each rank');}
// ---- the oath
{RH.r=150;assert(riderRank()===3,'a friend of the riders');const K=cap.prov.kingdom;riderAudience(ruler);riderOath(ruler,K);info('the oath:',shown&&shown[1].slice(0,110));
  assert(RH.sw===1&&riderRank()===4&&/swear|hilt/.test(shown[1]),'a friend of great standing swears the oath at the high seat');
  riderGift(4);info('the oath\'s gifts: oath-ring',countOf(454),'; war-horn',countOf(453),'; mail',countOf(451),'; barding',countOf(452));assert(countOf(454)===1&&countOf(453)===1&&countOf(451)===1&&countOf(452)===1,'the sworn rider is given the oath-ring, the war-horn, the riders\' mail and barding');
  const d=foes.find(f=>f.kind==='hdoor');d.bow=0;const g=riderGreet(d,FOES[d.kind]);info('a doorwarden greets a sworn rider:',g);assert(d.bow>foeClock&&/Sworn rider/.test(g),'the riders bow to a sworn rider');}
// ---- the thaneship
{RH.r=260;riderThane(ruler,cap.prov.kingdom);info('the thaneship:',shown&&shown[1].slice(0,110),'; rank',riderRankName());assert(RH.th&&riderRank()===5&&countOf(455)===1,'a sworn rider of great standing is made a thane and given a steading');
  const out=[];riderJournal(out);info(out[out.length-1]);assert(/Thane of /.test(out[out.length-1]),'the journal keeps the thaneship');}
// ---- the new folk, built whole
{const ks=['hking','hqueen','hdoor','hcouns','hmaid','hscop','hleech','hdealer','hchild','hgirl','hwarden','hracer'];const bad=[];clear();
  for(const k of ks){const f=addFoe(k,PL.x+2,PL.y,PL.z,{st:'idle',t:9});if(!f||!f.m||!(f.m.box[4]>0))bad.push(k);}info('the riders\' new folk built:',ks.length-bad.length,'of',ks.length,bad.join(','));assert(!bad.length,'the riders\' new folk are built');clear();
  for(const k of ['windsteed','kine']){const a=addAnimal(k,PL.x+3,PL.y,PL.z,{});assert(a&&a.m,'the '+ANIMALS[k].n.toLowerCase()+' is built');removeAnimal(a);}}
// ---- the windsteed
{RH.sw=0;RH.r=60;const a=addAnimal('windsteed',PL.x+2,PL.y,PL.z,{});TO.length=0;windTame(a);info('a friend of the riders:',TO[0]);assert(!a.tame,'a windsteed lets no one near but a sworn rider');
  RH.sw=1;RH.r=150;TO.length=0;windTame(a);info('a sworn rider:',TO.join(' | '));assert(a.tame,'a windsteed lets a sworn rider lay a hand on it');
  info('gallop: windsteed',ANIMALS.windsteed.gallop,'; elven horse',ANIMALS.ehorse.gallop,'; charger',ANIMALS.charger.gallop);assert(ANIMALS.windsteed.gallop>Math.max(ANIMALS.ehorse.gallop,ANIMALS.charger.gallop),'no horse runs faster than a windsteed');removeAnimal(a);}
RH.sw=0;RH.th='';RH.r=0;setMode('creative');
