// Standing with the dwarves (D-091): its ranks and their gifts, and the name they give a stone-friend; their tongue (words of our
// own) and greetings; trade for coin, the moneychanger, the gemcutter; the runes the runesmith cuts and what each does in the
// rune slot; rams bought and tended, a wild ram that lets only a friend near; justice (a blow and its amends, a slaying and
// banishment) and the treasury robbed; the tasks of the hold (the writ-stone in time or too late, supplies, a bounty, a lost miner
// found, an heirloom from a worked-out claim); the horn of the hold and its shield-wall; waymarks, tombs and the deep drum; the
// annals of the kings and the journal; the claims in the discovery log; the hall-key.
setMode('survival');playing=true;dead=false;hp=20;
const gen=(X,Z)=>{regenerateAll(X,Z);while(genQ.length)processGenQ();};
const TO=[];toast=m=>{if(m)TO.push(m);};let shown=null;showText=(t,x)=>{shown=[t,x];};
const reset=()=>{DW.r=0;DW.sw=0;DW.kin='';DW.g=0;DW.q=null;DW.an=[];DW.ann={};DW.au={};DW.out={};DW.nm='';for(let i=0;i<inv.length;i++)inv[i]=null;for(const k in equip)equip[k]=null;};
const at=(s,u,v)=>siteXZ(s,u,v).map(Math.round);
const toPL=(X,Z,y)=>{PL.x=X-OX+0.5;PL.z=Z-OZ+0.5;PL.y=y!==undefined?y:ground[X-OX+W*(Z-OZ)]+1;};
const clear=()=>{for(const f of [...foes])removeFoe(f);foeSpots.clear();for(const a of [...animals])removeAnimal(a);};
reset();
const seen=new Set();let city=null;
for(let i=-30;i<30;i++)for(let j=-30;j<30;j++){const c=stretchCell(landSite(i,j)),k=landKey(c.i,c.j);if(seen.has(k))continue;seen.add(k);const C=realmHeld(c);if(!C||C.k!=='dwarf')continue;const P=provinceOf(c.i,c.j);
  if(!city)city=P.sites.find(s=>s.k==='city'&&['dmarket','drunes','dpen','dfathers'].every(q=>siteLayout(s).spots.some(p=>p.kind===q)));}
const spot=(s,k)=>{const p=siteLayout(s).spots.find(q=>q.kind===k),[X,Z]=at(s,p.u,p.v);return [X,Z,p.y];};
const folkAt=(s,k,kind)=>{const [X,Z,y]=spot(s,k);gen(X,Z);toPL(X,Z,y+1);clear();foeSpawnTick();return foes.find(f=>!f.dead&&(kind?f.kind===kind:f.spk==='d_'+k));};
// ---- ranks and gifts; the name; the tongue
{assert(dwarfRank()===0&&dwarfRankName()==='Stranger','a stranger to the dwarves at first');dwarfGain(12,null);dwarfRankUp(1);const b0=countOf(465);dwarfGain(20,null);dwarfRankUp(2);
  info('standing',DW.r,'(',dwarfRankName(),'); mushroom bread given',b0,'; cheese',countOf(466),'; their name for you',DW.nm);
  assert(dwarfRank()===2&&b0>=3&&countOf(466)>=2&&DW.nm&&!isBlockedName(DW.nm),'standing rises through the ranks, each with its gift; a stone-friend is given a name of their own');
  DW.r=200;assert(dwarfRank()===3,'no one is oathbound but by the oath');DW.sw=1;assert(dwarfRank()===4,'oathbound once the oath is sworn');DW.r=300;assert(dwarfRank()===5,'an oathbound friend of great standing is kin');DW.sw=0;DW.r=32;
  const words=DWARF_TONGUE.flatMap(t=>t[0].replace(/[!,]/g,'').split(' '));info('their tongue:',DWARF_TONGUE.slice(0,3).map(t=>t[0]+' ('+t[1]+')').join('; '));
  assert(DWARF_TONGUE.length>=10&&words.every(w=>!isBlockedName(w)),'the dwarves\' tongue: words of our own, none of them blocked');}
// ---- speaking with them; trade, the moneychanger, the gemcutter
{const m=folkAt(city,'dmarket','dmerch');assert(!!m,'a merchant keeps the market hall below');dwarfTalk(m);assert(invOpen,'speaking with one of them opens what they will say and do');closeInv();
  const g=dwarfGreet(m,FOES[m.kind]);info('a stone-friend is greeted:',g);
  addItem(204,10);const n0=countOf(465),p0=purse(),r=dwarfBuy(465,2,2),p1=purse();addItem(213,4);const r2=dwarfSell(213,3,4),p2=purse();
  info('trade:',r,'; purse',p0,'->',p1,'; at the mint:',r2,'; purse',p2);assert(p1===p0-dwarfPrice(2)*2&&p2===p1+dwarfOffer(3)*4&&countOf(465)===n0+2,'the dwarves trade for coin, and the moneychanger buys ore');
  addItem(468,1);const c0=countOf(469),cut=dwarfCutGem();info('the gemcutter:',cut);assert(countOf(469)===c0+1&&countOf(468)===0,'the gemcutter cuts a rough gem');}
// ---- runes: cut, worn in the rune slot, each doing what it says
{addItem(205,10);const r=dwarfBuy(479,40,1);info(r);inv.forEach((q,i)=>{if(q&&q.id===479)equipFrom(i);});assert(equip.rune&&equip.rune.id===479&&runeOn('keen'),'the runesmith cuts a rune, worn in the rune slot');
  const lit0=(equip.rune=null,lampLevel()[1]);equip.rune={id:482,c:1,d:0};const lit1=lampLevel()[1];equip.rune={id:480,c:1,d:0};const cut1=armourCut(20);equip.rune=null;const cut0=armourCut(20);
  info('the rune of the lamp: light',lit0,'->',lit1,'; the rune of warding: a blow of 20',cut0,'->',cut1);assert(lit1>lit0&&cut1<cut0,'the rune of the lamp gives light, the rune of warding turns a little of every blow');
  equip.rune={id:479,c:1,d:0};setMode('creative');const off=runeOn('keen');setMode('survival');equip.rune=null;assert(!off,'runes work in survival only');
  assert(DWARF_RUNES.length===6&&DWARF_RUNES.every(([id])=>ITEMS[id]&&ITEMS[id].equip==='rune'),'six runes: keenness, warding, delving, the lamp, the hearth and stone');}
// ---- rams
{const k=folkAt(city,'dpen','dkeep');assert(!!k,'a ram-keeper keeps the pens');addItem(205,3);const a=riderLeadOut('ram',2);info('a ram from the keeper:',AM_KINDS.ram.coats[a.ci][0].coat);assert(a.tame&&ANIMALS.ram.mount&&ANIMALS.ram.climb,'the ram-keeper sells great rams to ride, which climb');
  a.hp=3;const t=dwarfTendRam();info(t);assert(a.hp===ANIMALS.ram.hp,'the keeper tends your ram');removeAnimal(a);
  const w=addAnimal('ram',PL.x+2,PL.y,PL.z,{});DW.r=5;TO.length=0;ramTame(w);const t0=w.tame;DW.r=40;ramTame(w);info('a wild ram: to a stranger',t0,'; to a stone-friend',w.tame);assert(!t0&&w.tame,'a wild ram lets only a friend of the dwarves take it');removeAnimal(w);}
// ---- justice; the treasury
{const g=folkAt(city,'dmarket','dmerch'),r0=DW.r;dwarfStruck(g);assert(DW.r<r0,'striking the dwarves costs standing');
  dwarfSlain(g);info('slew one: banished',dwarfOutlaw(g),'; the folk turn on the player',folkWrath(g));assert(dwarfOutlaw(g)&&folkWrath(g),'whoever slays one of the dwarves is banished from the kingdom');
  addItem(205,3);const r=dwarfAmends(g);info(r);assert(!dwarfOutlaw(g)&&!folkWrath(g),'the stone-price paid ends the banishment');DW.r=40;
  const v=folkAt(city,'dvault');assert(foes.some(f=>f.kind==='danvil'),'the anvilguard keep the treasury');const [X,Z,y]=spot(city,'dvault');const r1=DW.r;dwarfTheft(X-OX,y,Z-OZ,GOLDB);
  info('gold taken from the treasury: standing',r1,'->',DW.r,'; the guards take up arms',foes.some(f=>folkWrath(f)));assert(DW.r<r1&&foes.some(f=>f.kind[0]==='d'&&folkWrath(f)),'whoever robs the treasury is a thief to them');realmWrath.clear();clear();}
// ---- tasks
{const s=city;DW.q=null;const q=dwarfTaskGive(s,'writ');info('the writ-stone:',q.n,'; carrying it',countOf(478));assert(q&&countOf(478)===1,'a task: the writ-stone given to carry');
  const r0=DW.r;gen(q.X,q.Z);toPL(q.X,q.Z);dwarfTaskTick();info('at',q.tn,': done',!DW.q,'; standing',r0,'->',DW.r);assert(!DW.q&&countOf(478)===0&&DW.r>r0,'the writ-stone carried in time');
  const q2=dwarfTaskGive(s,'writ');toPL(s.X,s.Z);DW.pt+=q2.lim+1;TO.length=0;dwarfTaskTick();assert(!DW.q&&TO.some(m=>/too late/i.test(m)),'too late with the writ-stone, the task is lost');
  const q3=dwarfTaskGive(s,'supply');addItem(q3.it,q3.need);assert(dwarfTaskReady(q3),'supplies for the smelters');const p0=purse();dwarfTaskDone();assert(purse()-p0===q3.rw,'supplies brought and paid for');
  const q4=dwarfTaskGive(s,'bounty'),nb=q4.c;for(let i=0;i<nb;i++)dwarfSlain({kind:'raider',x:PL.x,z:PL.z});assert(dwarfTaskReady(q4),'the bounty earned');dwarfTaskDone();
  const q5=dwarfTaskGive(s,'miner');info('a lost miner:',q5&&q5.n);gen(q5.X,q5.Z);toPL(Math.round(q5.X),Math.round(q5.Z));dwarfTaskTick();const L=dwarfLost;assert(!!L,'the lost miner is down in the mines');
  toPL(Math.floor(L.x+OX),Math.floor(L.z+OZ),L.y);dwarfTaskTick();assert(!DW.q,'the lost miner found, and he finds his own way up');
  let oc=null;for(let r=0;r<=90&&!oc;r++)for(let i=-r;i<=r&&!oc;i++)for(let j=-r;j<=r;j++){if(Math.max(Math.abs(i),Math.abs(j))!==r)continue;const q=claimsAt(i,j);if(q&&q.ab){oc=q;break;}}PL.x=oc.X+150-OX;PL.z=oc.Z-OZ; // (an heirloom is sought at the worked-out claim nearest the player)
  const q6=dwarfTaskGive(s,'heirloom');info('an heirloom:',q6&&q6.n);gen(q6.X,q6.Z);toPL(q6.X,q6.Z);dwarfTaskTick();assert(q6.got&&countOf(485)===1,'the heirloom found at the worked-out claim');
  toPL(Math.round(q6.fx),Math.round(q6.fz));dwarfTaskTick();assert(!DW.q&&countOf(485)===0,'the heirloom brought home');}
// ---- the horn of the hold
{toPL(city.X,city.Z);clear();TO.length=0;DW.hn=-1e9;dwarfHorn();assert(TO.some(m=>/oathbound/.test(m)),'the horn of the hold answers only an oathbound friend');
  DW.sw=1;DW.r=150;DW.hn=-1e9;gen(city.X+60,city.Z);toPL(city.X+60,city.Z);clear();dwarfHorn();const R=foes.filter(f=>f.kind[0]==='d'&&!FOES[f.kind].civ&&f.aid>MN.pt);
  info('a shield-wall answers the horn:',R.length,R.map(f=>f.kind).join(','));assert(R.length>=5,'an oathbound friend\'s horn calls a shield-wall');DW.sw=0;DW.r=40;clear();}
// ---- waymarks, tombs, the deep drum; the annals and the journal; the claims in the log; the hall-key
{const rd=city.prov.roads.find(r=>r.len>150)||city.prov.roads[0];let wm=null;for(let k=0;k<=8&&!wm;k++){const X=Math.round(rd.a[0]+(rd.b[0]-rd.a[0])*k/8),Z=Math.round(rd.a[1]+(rd.b[1]-rd.a[1])*k/8);gen(X,Z);
    for(let dx=-60;dx<=60&&!wm;dx++)for(let dz=-60;dz<=60&&!wm;dz++){const x=X-OX+dx,z=Z-OZ+dz;if(x<0||z<0||x>=W||z>=D)continue;for(let y=SEA;y<H-2;y++)if(world[I(x,y,z)]===DWAY){wm=[x,y,z];break;}}}
  shown=null;useWaymark(...wm);info('a waymark:',shown&&shown[1]);assert(shown&&/paces/.test(shown[1]),'a waymark tells the road and the distance to its places');
  const F=siteLayout(city).fathers,[tx,tz]=at(city,F.u0+1,(F.v0+F.v1)>>1);gen(tx,tz);shown=null;useTomb(tx-OX,F.y,tz-OZ);info('a tomb:',shown&&shown[0],'|',shown&&shown[1]);assert(shown&&/king under the mountain/.test(shown[1]),'the tombs name the kings');
  TO.length=0;useDeepDrum(0,0,0);assert(TO.some(m=>/deep drum/.test(m)),'the deep drum is beaten');
  shown=null;const [lx,lz]=at(city,F.u1-2,(F.v0+F.v1)/2-2);assert(dwarfLectern(lx-OX,F.y,lz-OZ),'the lecterns of the Hall of the Fathers hold the annals');info('an annal:',shown&&shown[0]);
  for(let k=0;k<3;k++)dwarfAnnal(city,true);const out=[];dwarfJournal(out);info(out.slice(2,4).join(' | '));assert(DW.an.length===4&&out.some(l=>/The Annals of/.test(l)),'the annals heard are kept in the journal');
  let o=null;for(let i=-90;i<90&&!o;i++)for(let j=-90;j<90&&!o;j++){const q=claimsAt(i,j);if(q)o=q;}gen(o.X,o.Z);toPL(o.X,o.Z);const d0=JN.d.c.length;dwarfT=0;dwarfFrame(0.01);info('the claims in the discovery log:',JN.d.c.join(', '));assert(JN.d.c.length===d0+1,'the prospectors\' claims go into the discovery log');
  TO.length=0;useHallKey();assert(TO.some(m=>/opens nothing/.test(m)),'a hall-key with no hall');DW.kin=city.name;DW.kx=city.X;DW.kz=city.Z;gen(city.X,city.Z);toPL(city.X,city.Z);spawnW=[0,0,0];useHallKey();info('the hall-key in',city.name,': wake there',spawnW.map(Math.round).join(','));
  assert(Math.abs(spawnW[0]-city.X)<2&&Math.abs(spawnW[2]-city.Z)<2,'kin rest in their hall, and wake there after a fall');DW.kin='';}
reset();setMode('creative');
