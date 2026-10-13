// The court of the white realm (D-089): the king or queen on the throne of a royal city (the lord of the province on lesser
// thrones), the guard of the citadel about them, courtiers in the hall; an audience and the throne's gifts; knighthood for an
// esquire of great renown (the dubbing, arms of the player's choosing painted on the banner of their arms, plate and a charger);
// lordship at the last; the charger called with the groom's whistle.
setMode('survival');
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const TO=[];toast=m=>{if(m)TO.push(m);};let shown=null;showText=(t,x)=>{shown=[t,x];};
const at=(s,u,v)=>siteXZ(s,u,v).map(Math.round);
const toPL=(X,Z,y)=>{PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=y!==undefined?y:ground[X-OX+W*(Z-OZ)]+1;};
const clear=()=>{for(const f of [...foes])removeFoe(f);foeSpots.clear();};
MN.r=0;MN.kn=0;MN.g=0;MN.q=null;MN.au={};MN.lord='';MN.arms=null;for(let i=0;i<inv.length;i++)inv[i]=null;
const seen=new Set();let cap=null,city=null;
for(let i=-30;i<30;i++)for(let j=-30;j<30;j++){const c=stretchCell(landSite(i,j)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const C=realmHeld(c);if(!C||C.k!=='white')continue;const P=provinceOf(c.i,c.j);
  for(const s of P.sites){if(s.k!=='city')continue;if(P.capital&&!cap)cap=s;if(!P.capital&&!city&&siteLayout(s).spots.some(p=>p.kind==='stable'))city=s;}}
const spot=(s,k)=>{const p=siteLayout(s).spots.find(q=>q.kind===k),[X,Z]=at(s,p.u,p.v);return [X,Z,p.y];};
// ---- the throne of a royal city: its king or queen, the guard of the citadel, the court in the hall
let ruler=null;
{const [X,Z,y]=spot(cap,'throne');gen(X,Z);toPL(X,Z,y+1);clear();foeSpawnTick();ruler=foes.find(f=>f.kind==='rking'||f.kind==='rqueen');const G=foes.filter(f=>f.kind==='rcguard'),C=foes.filter(f=>f.spk==='r_court');
  info(cap.name,': on the throne',ruler&&FOES[ruler.kind].n,'; the guard of the citadel',G.length,'; the court',C.map(f=>FOES[f.kind].n).join(', '));
  assert(ruler&&G.length>=1&&C.length>=2&&ruler.kind===menThroneLead(cap),'the king or the queen holds court on the throne of the royal city, guarded, courtiers in the hall');
  const [X2,Z2,y2]=spot(city,'throne');gen(X2,Z2);toPL(X2,Z2,y2+1);clear();foeSpawnTick();const lord=foes.find(f=>f.spk==='r_throne'&&f.kind==='rnoble');info(city.name,': on its throne',lord&&FOES[lord.kind].n);
  assert(!!lord,'the lord of the province sits on the throne of a lesser city');}
// ---- an audience: a stranger is sent away; a freeman is welcomed and given a gift once
{const [X,Z,y]=spot(cap,'throne');gen(X,Z);toPL(X,Z,y+1);clear();foeSpawnTick();ruler=foes.find(f=>f.kind==='rking'||f.kind==='rqueen');
  const r0=menAudience(ruler);MN.r=12;const r1=menAudience(ruler),c1=countOf(431),r2=menAudience(ruler),c2=countOf(431);info('a stranger:',r0);info('a freeman:',r1,'; and again: gift',c1,'->',c2);
  assert(/stranger/i.test(r0)&&/gift/i.test(r1)&&c1>=3&&c2===c1,'the throne grants an audience, and a gift once for each rank');}
// ---- knighthood: an esquire of great renown kneels and is dubbed; their arms are chosen and painted; plate and a charger
{MN.r=150;assert(menRank()===3,'an esquire of the realm');const r=menAudience(ruler);menDub(ruler,cap.prov.kingdom);info('the dubbing:',shown&&shown[1].slice(0,90));assert(MN.kn===1&&menRank()===4&&/knight/i.test(shown[1]),'an esquire of great renown is knighted at the throne');
  menGift(4);info('the gifts of knighthood: plate',countOf(438),'; banners of your arms',countOf(MYARMS),'; a groom\'s whistle',countOf(445));assert(countOf(438)===1&&countOf(MYARMS)===4&&countOf(445)===1,'a knight is given the realm\'s plate, banners of their arms and a groom\'s whistle');
  const px=()=>{const t=399,X=(t%AC)*TS+4,Y=((t/AC)|0)*TS+12,i=(Y*AW+X)*4;return [dat[i],dat[i+1],dat[i+2]];},before=px();MN.arms={f:1,c:0,t:1};armsPaint();const red=px();MN.arms={f:2,c:3,t:0};armsPaint();const blue=px();
  info('the banner of your arms: blank',before.join(','),'-> red field',red.join(','),'-> blue field',blue.join(','),'; in words:',armsWord(MN.arms));
  assert(red[0]>red[2]+60&&blue[2]>blue[0]+60&&/a tree in silver on blue/.test(armsWord(MN.arms)),'the knight\'s arms, chosen at the heralds\' table, are painted on the banner of their arms');
  const g=foes.find(f=>f.kind==='rcguard');g.bow=0;const gr=menGreet(g,FOES[g.kind]);info('a guard greets the knight:',gr);assert(g.bow>foeClock,'the realm\'s folk bow to its knights');}
// ---- the charger from the stables; the groom's whistle
{const [X,Z,y]=spot(city,'stable');gen(X,Z);toPL(X,Z,y+1);clear();for(const a of [...animals])removeAnimal(a);foeSpawnTick();const groom=foes.find(f=>f.spk==='r_stable');assert(!!groom,'a groom keeps the stables');
  const r=menCharger();const ch=animals.find(a=>a.kind==='charger'&&a.tame);info(r,'; its caparison',ch&&AM_KINDS.charger.coats[ch.ci][0].name);assert(ch&&ch.ci===2,'a knight is given a charger in a caparison of their colours');
  ch.x+=60;elfWhistle();info('the whistle: the charger comes',ch.st);assert(ch.st==='follow','the groom\'s whistle calls the charger');}
// ---- lordship
{MN.r=260;const [X,Z,y]=spot(cap,'throne');gen(X,Z);toPL(X,Z,y+1);clear();foeSpawnTick();ruler=foes.find(f=>f.kind==='rking'||f.kind==='rqueen');menLordship(ruler,cap.prov.kingdom);
  info('lordship:',shown&&shown[1].slice(0,100),'; rank',menRankName(),'; a chain of office',countOf(441));assert(MN.lord&&menRank()===5&&countOf(441)===1,'a knight of great renown is made a lord of the realm');
  const out=[];menJournal(out);info(out[out.length-1]);assert(/Lord of /.test(out[out.length-1])&&/arms/.test(out[out.length-1]),'the journal keeps the knight\'s arms and lordship');}
setMode('creative');
